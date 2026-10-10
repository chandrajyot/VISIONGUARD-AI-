import React from 'react';
import type { AnalyticsSummary } from '../../types';

interface ModelPerformanceCardProps {
  data: AnalyticsSummary | null;
}

export const ModelPerformanceCard: React.FC<ModelPerformanceCardProps> = ({ data }) => {
  const perf = data?.model_performance || {
    precision: 96,
    recall: 92,
    map50: 94,
    latency: 28,
    fps: 28
  };

  const meters = [
    { label: 'Precision', value: `${perf.precision}%`, pct: perf.precision, color: '#10B981' },
    { label: 'Recall', value: `${perf.recall}%`, pct: perf.recall, color: '#10B981' },
    { label: 'mAP@0.5', value: `${perf.map50}%`, pct: perf.map50, color: '#10B981' },
    { label: 'Latency', value: `${perf.latency} ms`, pct: 75, color: '#06B6D4' },
    { label: 'FPS', value: `${perf.fps} FPS`, pct: 85, color: '#06B6D4' }
  ];

  return (
    <div className="bg-[#0F192C] border border-[#1A2A47] rounded-xl p-4 shadow-md flex flex-col justify-between h-full">
      <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
        Model Performance <span className="text-slate-400 font-normal capitalize">(Current Session)</span>
      </h3>

      {/* 5 Circular Arc Gauges in a single horizontal row */}
      <div className="grid grid-cols-5 gap-2 items-center justify-items-center my-auto">
        {meters.map((meter, idx) => {
          const radius = 26;
          const strokeWidth = 4.5;
          const circumference = 2 * Math.PI * radius;
          const strokeDashoffset = circumference - (meter.pct / 100) * circumference;

          return (
            <div key={idx} className="flex flex-col items-center justify-center text-center w-full">
              {/* Circle container */}
              <div className="relative w-16 h-16 sm:w-18 sm:h-18 flex items-center justify-center shrink-0">
                <svg viewBox="0 0 70 70" className="w-full h-full -rotate-90 transform">
                  {/* Track Circle */}
                  <circle
                    cx="35"
                    cy="35"
                    r={radius}
                    stroke="#152238"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                  />
                  {/* Progress Circle */}
                  <circle
                    cx="35"
                    cy="35"
                    r={radius}
                    stroke={meter.color}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                {/* Center Value */}
                <div className="absolute inset-0 flex items-center justify-center font-mono font-bold text-[11px] sm:text-xs text-white pointer-events-none">
                  {meter.value}
                </div>
              </div>

              {/* Bottom Label */}
              <span className="text-[10px] sm:text-[11px] font-semibold text-slate-300 mt-1.5 truncate max-w-full">
                {meter.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
