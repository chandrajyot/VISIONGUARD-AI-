import React from 'react';
import type { AnalyticsSummary } from '../../types';

interface DefectDistributionCardProps {
  data: AnalyticsSummary | null;
}

export const DefectDistributionCard: React.FC<DefectDistributionCardProps> = ({ data }) => {
  const distribution = data?.defect_distribution || [
    { name: 'Scratch', value: 42, percentage: 48.3 },
    { name: 'Dent', value: 20, percentage: 23.0 },
    { name: 'Crack', value: 15, percentage: 17.2 },
    { name: 'Contamination', value: 8, percentage: 9.2 },
    { name: 'Other', value: 2, percentage: 2.3 }
  ];

  const totalDefects = data?.total_defects || 87;

  const COLORS: { [key: string]: string } = {
    'Scratch': '#EF4444',       // Red
    'Dent': '#F59E0B',          // Orange / Yellow
    'Crack': '#DC2626',         // Dark Red
    'Contamination': '#06B6D4',  // Cyan
    'Other': '#3B82F6'          // Blue
  };

  // Calculate SVG stroke-dasharray and stroke-dashoffset for each slice
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const totalVal = distribution.reduce((sum, d) => sum + d.value, 0) || 1;

  let accumulatedPct = 0;
  const slices = distribution.map((item) => {
    const pct = item.value / totalVal;
    const strokeDasharray = `${pct * circumference} ${circumference}`;
    const strokeDashoffset = -accumulatedPct * circumference;
    accumulatedPct += pct;
    return {
      name: item.name,
      color: COLORS[item.name] || '#3B82F6',
      strokeDasharray,
      strokeDashoffset
    };
  });

  return (
    <div className="bg-[#0F192C] border border-[#1A2A47] rounded-xl p-4 shadow-md flex flex-col justify-between h-full min-h-[220px]">
      <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
        Defect Distribution
      </h3>

      <div className="flex items-center justify-between gap-3 my-auto">
        {/* SVG Donut Ring with Center Total Count */}
        <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
          <svg viewBox="0 0 110 110" className="w-full h-full -rotate-90 transform">
            {/* Base Background Circle */}
            <circle
              cx="55"
              cy="55"
              r={radius}
              stroke="#152238"
              strokeWidth="12"
              fill="transparent"
            />

            {/* Slices */}
            {slices.map((slice, idx) => (
              <circle
                key={`slice-${idx}`}
                cx="55"
                cy="55"
                r={radius}
                stroke={slice.color}
                strokeWidth="12"
                strokeDasharray={slice.strokeDasharray}
                strokeDashoffset={slice.strokeDashoffset}
                strokeLinecap="butt"
                fill="transparent"
                className="transition-all duration-700 ease-out"
              />
            ))}
          </svg>

          {/* Center Text overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
            <span className="text-xl font-black text-white font-mono leading-none">{totalDefects}</span>
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-1">Total</span>
          </div>
        </div>

        {/* Legend List on Right */}
        <div className="space-y-1.5 text-xs font-medium flex-1">
          {distribution.map((item) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center space-x-2 truncate">
                <span 
                  className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm" 
                  style={{ backgroundColor: COLORS[item.name] || '#3B82F6' }}
                ></span>
                <span className="text-slate-200 text-xs font-medium truncate">{item.name}</span>
              </div>

              <div className="font-mono text-xs text-slate-400 shrink-0 ml-2">
                <span className="text-white font-bold mr-1">{item.value}</span>
                <span className="text-[10px] text-slate-400">({item.percentage}%)</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
