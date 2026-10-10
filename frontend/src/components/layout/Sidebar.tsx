import React from 'react';
import { 
  LayoutGrid, 
  CircleDot, 
  Image, 
  Play, 
  RotateCcw, 
  BarChart2, 
  Hexagon, 
  Kanban, 
  User, 
  Settings, 
  Diamond
} from 'lucide-react';
import type { SystemStatus } from '../../types';

export type NavItem = 
  | 'dashboard' 
  | 'live-inspection' 
  | 'image-inspection' 
  | 'video-inspection' 
  | 'history' 
  | 'analytics' 
  | 'model-registry' 
  | 'products-lines' 
  | 'users' 
  | 'settings';

interface SidebarProps {
  currentTab: NavItem;
  onSelectTab: (tab: NavItem) => void;
  systemStatus: SystemStatus | null;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onSelectTab }) => {
  const menuItems: { id: NavItem; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutGrid className="w-4 h-4" /> },
    { id: 'live-inspection', label: 'Live Inspection', icon: <CircleDot className="w-4 h-4" /> },
    { id: 'image-inspection', label: 'Image Inspection', icon: <Image className="w-4 h-4" /> },
    { id: 'video-inspection', label: 'Video Inspection', icon: <Play className="w-4 h-4" /> },
    { id: 'history', label: 'History', icon: <RotateCcw className="w-4 h-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart2 className="w-4 h-4" /> },
    { id: 'model-registry', label: 'Model Registry', icon: <Hexagon className="w-4 h-4" /> },
    { id: 'products-lines', label: 'Products & Lines', icon: <Kanban className="w-4 h-4" /> },
    { id: 'users', label: 'Users', icon: <User className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <aside className="w-64 bg-[#0B1322] border-r border-[#1A2A47]/80 flex flex-col h-screen sticky top-0 shrink-0 select-none z-40">
      {/* 1. VISIONGUARD AI Logo & Subtitle */}
      <div className="p-5 flex items-center space-x-3.5">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
          <Diamond className="w-5 h-5 text-white fill-white" />
        </div>
        <div>
          <h1 className="font-extrabold text-sm tracking-wider text-white uppercase flex items-center">
            VISIONGUARD <span className="text-blue-400 ml-1.5 font-black">AI</span>
          </h1>
          <p className="text-[11px] text-slate-400 font-medium tracking-tight mt-0.5">
            Industrial Quality Inspection
          </p>
        </div>
      </div>

      {/* Navigation Items (Matching Reference Screenshot) */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center space-x-3.5 px-4 py-3 rounded-2xl text-xs font-semibold transition-all duration-200 ${
                isActive
                  ? 'bg-[#2563EB] text-white shadow-lg shadow-blue-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-[#0F192C]'
              }`}
            >
              <span className={isActive ? 'text-white' : 'text-slate-400'}>
                {item.icon}
              </span>
              <span className="truncate tracking-wide">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* 12. System Status Card (Matching Screenshot Bottom Left) */}
      <div className="mx-3 mb-3 p-3.5 bg-[#0F192C] border border-[#1A2A47] rounded-xl text-xs space-y-2 shadow-md">
        <span className="font-bold text-white text-xs tracking-wider uppercase block mb-1">
          System Status
        </span>

        <div className="space-y-1.5 text-[11px] font-medium">
          <div className="flex items-center text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse mr-2 shrink-0"></span>
            <span>API Server Online</span>
          </div>

          <div className="flex items-center text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse mr-2 shrink-0"></span>
            <span>AI Model Loaded</span>
          </div>

          <div className="flex items-center text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse mr-2 shrink-0"></span>
            <span>Database Connected</span>
          </div>

          <div className="flex items-center text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse mr-2 shrink-0"></span>
            <span>Storage Ready</span>
          </div>

          <div className="flex items-center text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse mr-2 shrink-0"></span>
            <span>WebSocket Connected</span>
          </div>
        </div>
      </div>

      {/* 13. Version Footer */}
      <div className="px-5 py-3 border-t border-[#1A2A47]/60 flex items-center justify-between text-[10px] text-slate-500 font-mono">
        <span>v1.0.0</span>
      </div>
    </aside>
  );
};
