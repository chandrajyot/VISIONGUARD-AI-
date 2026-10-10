import React, { useState } from 'react';
import { Camera, Film, Play, Square, ChevronDown } from 'lucide-react';
import { LiveInspectionViewport } from '../components/dashboard/LiveInspectionViewport';
import { KPICards } from '../components/dashboard/KPICards';
import { DefectDistributionCard } from '../components/dashboard/DefectDistributionCard';
import { InspectionTrendCard } from '../components/dashboard/InspectionTrendCard';
import { ModelPerformanceCard } from '../components/dashboard/ModelPerformanceCard';
import { RecentDetectionsCard } from '../components/dashboard/RecentDetectionsCard';
import { LiveDetectionFeed } from '../components/dashboard/LiveDetectionFeed';
import type { AnalyticsSummary, DetectionItem } from '../types';

interface DashboardPageProps {
  analytics: AnalyticsSummary | null;
  recentDetections: DetectionItem[];
  liveDetections: DetectionItem[];
  fps: number;
  latencyMs: number;
  onNavigateTab: (tab: any) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  analytics,
  recentDetections,
  liveDetections,
  fps,
  latencyMs,
  onNavigateTab
}) => {
  const [streamMode, setStreamMode] = useState<'camera' | 'video'>('camera');
  const [selectedLine, setSelectedLine] = useState('Line A');
  const [isInspecting, setIsInspecting] = useState(true);

  return (
    <div className="space-y-4 pb-6 min-w-0 animate-fade-in">
      {/* 5. DASHBOARD TITLE AND ACTIONS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#111C31] border border-[#22314A] rounded-xl p-4 shadow-md">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-xl font-extrabold text-[#F5F7FB] tracking-tight">
              Live Stream Quality Inspection
            </h1>
            <span className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-[#20C968]/20 border border-[#20C968]/40 text-[#20C968] text-xs font-bold font-mono">
              <span className="w-2 h-2 rounded-full bg-[#20C968] animate-pulse"></span>
              <span>LIVE</span>
            </span>
          </div>
          <p className="text-xs text-[#91A5C4] mt-1 font-medium">
            AI-powered real-time defect detection and quality monitoring
          </p>
        </div>

        {/* Action Control Buttons */}
        <div className="flex items-center space-x-2.5 flex-wrap gap-y-2">
          <button
            onClick={() => setStreamMode('camera')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              streamMode === 'camera'
                ? 'bg-[#316BFA] text-white shadow-md'
                : 'bg-[#0D1728] text-[#91A5C4] hover:text-white border border-[#22314A]'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Camera</span>
          </button>

          <button
            onClick={() => setStreamMode('video')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              streamMode === 'video'
                ? 'bg-[#316BFA] text-white shadow-md'
                : 'bg-[#0D1728] text-[#91A5C4] hover:text-white border border-[#22314A]'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>Video File</span>
          </button>

          <div className="relative">
            <select
              value={selectedLine}
              onChange={(e) => setSelectedLine(e.target.value)}
              className="appearance-none bg-[#0D1728] border border-[#22314A] text-[#F5F7FB] text-xs font-semibold rounded-xl px-3.5 py-2 pr-8 focus:outline-none cursor-pointer"
            >
              <option value="Line A">Production Line A</option>
              <option value="Line B">Production Line B</option>
              <option value="Line C">Production Line C</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#91A5C4] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <button
            onClick={() => setIsInspecting(!isInspecting)}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md ${
              isInspecting
                ? 'bg-[#F04444] hover:bg-red-600 text-white'
                : 'bg-[#20C968] hover:bg-emerald-600 text-white'
            }`}
          >
            {isInspecting ? (
              <>
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>Stop Inspection</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Start Inspection</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 6. PRIMARY INSPECTION GRID (minmax(0, 1.65fr) minmax(0, 1fr)) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* LEFT COLUMN: LIVE INSPECTION (col-span-7 ~ 1.65fr ratio) */}
        <div className="lg:col-span-7 min-w-0">
          <LiveInspectionViewport
            selectedLine={selectedLine}
            streamMode={streamMode}
            isInspecting={isInspecting}
            onToggleInspect={() => setIsInspecting(!isInspecting)}
            latestDetections={liveDetections}
            fps={fps}
            latencyMs={latencyMs}
          />
        </div>

        {/* RIGHT COLUMN: INDEPENDENT ANALYTICS CARDS (col-span-5 ~ 1fr ratio) */}
        <div className="lg:col-span-5 space-y-4 flex flex-col justify-between min-w-0">
          {/* 4 KPI Cards in a 4-column compact grid */}
          <KPICards data={analytics} />

          {/* Charts Row: Defect Distribution (wider) & Inspection Trend */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 flex-1 min-w-0">
            <div className="sm:col-span-7 min-w-0">
              <DefectDistributionCard data={analytics} />
            </div>
            <div className="sm:col-span-5 min-w-0">
              <InspectionTrendCard data={analytics} />
            </div>
          </div>
        </div>
      </div>

      {/* 7. SECONDARY DASHBOARD GRID (minmax(0, 1.65fr) minmax(0, 1fr)) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* LEFT: MODEL PERFORMANCE (col-span-7 ~ 1.65fr ratio) */}
        <div className="lg:col-span-7 min-w-0">
          <ModelPerformanceCard data={analytics} />
        </div>

        {/* RIGHT: RECENT DETECTIONS (col-span-5 ~ 1fr ratio) */}
        <div className="lg:col-span-5 min-w-0">
          <RecentDetectionsCard 
            detections={recentDetections} 
            onViewAll={() => onNavigateTab('history')}
          />
        </div>
      </div>

      {/* 8. BOTTOM LIVE DETECTION FEED (Full width across main workspace) */}
      <LiveDetectionFeed detections={liveDetections} />
    </div>
  );
};
