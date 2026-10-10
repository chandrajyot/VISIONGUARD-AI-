import { useState, useEffect } from 'react';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import type { NavItem } from './components/layout/Sidebar';
import { DashboardPage } from './pages/DashboardPage';
import { LiveInspectionPage } from './pages/LiveInspectionPage';
import { ImageInspectionPage } from './pages/ImageInspectionPage';
import { VideoInspectionPage } from './pages/VideoInspectionPage';
import { HistoryPage } from './pages/HistoryPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { ModelRegistryPage } from './pages/ModelRegistryPage';
import { ProductsLinesPage } from './pages/ProductsLinesPage';
import { UsersPage } from './pages/UsersPage';
import { SettingsPage } from './pages/SettingsPage';
import type { AnalyticsSummary, DetectionItem, SystemStatus } from './types';
import { api, InspectionWebSocket } from './services/api';

export function App() {
  const [currentTab, setCurrentTab] = useState<NavItem>('dashboard');
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [recentDetections, setRecentDetections] = useState<DetectionItem[]>([]);
  const [liveDetections, setLiveDetections] = useState<DetectionItem[]>([]);

  // Fetch initial data
  const fetchData = async () => {
    try {
      const [sys, ana, rec] = await Promise.all([
        api.getSystemStatus(),
        api.getAnalyticsSummary(),
        api.getRecentDetections(20)
      ]);
      setSystemStatus(sys);
      setAnalytics(ana);
      setRecentDetections(rec);
      if (liveDetections.length === 0) {
        setLiveDetections(rec);
      }
    } catch (err) {
      console.error('Error fetching initial dashboard data:', err);
    }
  };

  useEffect(() => {
    fetchData();

    // Setup WebSocket for live real-time detection updates
    const wsClient = new InspectionWebSocket();
    wsClient.connect((event) => {
      if (event.event === 'detection.created' && event.detections) {
        setLiveDetections((prev) => [...event.detections, ...prev]);
        setRecentDetections((prev) => [...event.detections, ...prev]);
      }
    });

    // Refresh telemetry every 10 seconds
    const telemetryInterval = setInterval(fetchData, 10000);

    return () => {
      wsClient.disconnect();
      clearInterval(telemetryInterval);
    };
  }, []);

  return (
    <div className="flex h-screen bg-navy-900 text-slate-100 overflow-hidden font-sans">
      {/* 1. Sidebar Component preserving exact ordering */}
      <Sidebar 
        currentTab={currentTab} 
        onSelectTab={setCurrentTab} 
        systemStatus={systemStatus} 
      />

      {/* Main Content Viewport Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Status Header */}
        <Header 
          systemStatus={systemStatus} 
        />

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto p-6 scrollbar-thin">
          {currentTab === 'dashboard' && (
            <DashboardPage
              analytics={analytics}
              recentDetections={recentDetections}
              liveDetections={liveDetections}
              fps={systemStatus?.fps || 29.8}
              latencyMs={analytics?.model_performance.latency || 12.4}
              onNavigateTab={setCurrentTab}
            />
          )}

          {currentTab === 'live-inspection' && (
            <LiveInspectionPage
              liveDetections={liveDetections}
              fps={systemStatus?.fps || 29.8}
              latencyMs={analytics?.model_performance.latency || 12.4}
            />
          )}

          {currentTab === 'image-inspection' && <ImageInspectionPage />}

          {currentTab === 'video-inspection' && <VideoInspectionPage />}

          {currentTab === 'history' && <HistoryPage />}

          {currentTab === 'analytics' && <AnalyticsPage analytics={analytics} />}

          {currentTab === 'model-registry' && <ModelRegistryPage />}

          {currentTab === 'products-lines' && <ProductsLinesPage />}

          {currentTab === 'users' && <UsersPage />}

          {currentTab === 'settings' && <SettingsPage />}
        </main>
      </div>
    </div>
  );
}

export default App;
