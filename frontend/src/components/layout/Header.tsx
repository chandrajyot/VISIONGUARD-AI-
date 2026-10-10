import React from 'react';
import { Cpu, Activity } from 'lucide-react';
import type { SystemStatus } from '../../types';

interface HeaderProps {
  systemStatus: SystemStatus | null;
}

export const Header: React.FC<HeaderProps> = ({ systemStatus }) => {
  return (
    <header className="min-h-16 h-auto md:h-16 py-2 md:py-0 bg-[#0B1322] border-b border-[#1A2A47]/80 px-4 md:px-6 flex flex-wrap md:flex-nowrap items-center justify-between z-30 sticky top-0 shadow-md gap-2">
      {/* System Status Badges */}
      <div className="flex items-center flex-wrap gap-2.5 min-w-0">
        {/* Camera Connected badge */}
        <div className="flex items-center space-x-2 bg-[#0A261A] border border-[#10B981]/30 px-3 py-1 rounded-full text-xs font-semibold text-[#10B981] shrink-0">
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
          <span>{systemStatus?.camera_connected ? 'Camera Connected' : 'CAM-01 Active'}</span>
        </div>

        {/* Model badge */}
        <div className="flex items-center space-x-2 bg-[#0F1E3A] border border-[#3B82F6]/30 px-3 py-1 rounded-full text-xs font-semibold text-[#3B82F6] shrink-0">
          <Cpu className="w-3.5 h-3.5 text-[#3B82F6]" />
          <span className="text-slate-300">Model:</span>
          <span className="text-blue-400 font-bold">{systemStatus?.active_model || 'YOLOv8 (v1.0)'}</span>
        </div>

        {/* FPS counter */}
        <div className="flex items-center space-x-2 bg-[#151D2F] border border-slate-700/60 px-3 py-1 rounded-full text-xs font-mono font-semibold text-slate-200 shrink-0">
          <Activity className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-slate-400">FPS:</span>
          <span className="text-slate-200 font-bold">{systemStatus?.fps ? systemStatus.fps.toFixed(0) : '28'}</span>
        </div>

        {/* Status: Inspecting badge */}
        <div className="flex items-center space-x-2 bg-[#0A261A] border border-[#10B981]/30 px-3 py-1 rounded-full text-xs font-semibold text-[#10B981] shrink-0">
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping"></span>
          <span>Status: Inspecting</span>
        </div>
      </div>
    </header>
  );
};
