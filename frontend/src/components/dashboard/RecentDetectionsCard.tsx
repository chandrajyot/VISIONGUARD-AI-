import React, { useState } from 'react';
import { ChevronRight, X, ShieldAlert } from 'lucide-react';
import type { DetectionItem } from '../../types';

interface RecentDetectionsCardProps {
  detections: DetectionItem[];
  onViewAll?: () => void;
}

export const RecentDetectionsCard: React.FC<RecentDetectionsCardProps> = ({ detections, onViewAll }) => {
  const [selectedItem, setSelectedItem] = useState<DetectionItem | null>(null);

  const items = detections.length > 0 ? detections.slice(0, 3) : [
    {
      id: 'det-001',
      class_name: 'Scratch' as const,
      confidence: 64.0,
      bbox: [120, 80, 240, 180] as [number, number, number, number],
      severity: 'Warning' as const,
      timestamp: '02:11:30',
      production_line_id: 'Line A',
      crop_url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=300'
    },
    {
      id: 'det-002',
      class_name: 'Dent' as const,
      confidence: 78.0,
      bbox: [80, 140, 180, 220] as [number, number, number, number],
      severity: 'Critical' as const,
      timestamp: '02:11:28',
      production_line_id: 'Line A',
      crop_url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=300'
    },
    {
      id: 'det-003',
      class_name: 'Crack' as const,
      confidence: 82.0,
      bbox: [300, 90, 420, 150] as [number, number, number, number],
      severity: 'Critical' as const,
      timestamp: '02:11:25',
      production_line_id: 'Line B',
      crop_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300'
    }
  ];

  return (
    <div className="bg-[#0F192C] border border-[#1A2A47] rounded-xl p-3.5 flex flex-col justify-between h-full shadow-md">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider">
          Recent Detections
        </h3>

        <button 
          onClick={onViewAll}
          className="text-xs text-blue-400 hover:text-blue-300 font-semibold transition-colors"
        >
          View All
        </button>
      </div>

      <div className="space-y-1.5 font-mono">
        {items.map((item, idx) => {
          const isCritical = item.severity === 'Critical' || item.class_name === 'Crack' || item.class_name === 'Dent';

          return (
            <div
              key={`${item.id}-${idx}`}
              onClick={() => setSelectedItem(item)}
              className="bg-[#152238] hover:bg-[#1A2B47] border border-[#23324D] rounded-xl p-2 flex items-center justify-between cursor-pointer transition-colors group"
            >
              <div className="flex items-center space-x-2.5">
                <div className="w-10 h-9 rounded-lg bg-[#09111E] overflow-hidden border border-[#23324D] shrink-0">
                  <img 
                    src={item.crop_url || 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=150'} 
                    alt={item.class_name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                  />
                </div>

                <div className="px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase tracking-wide shrink-0 font-mono shadow-sm" style={{ backgroundColor: isCritical ? '#EF4444' : '#F59E0B' }}>
                  {item.class_name} {item.confidence}%
                </div>
              </div>

              <div className="flex items-center space-x-3 text-[10px] text-slate-400">
                <span>{item.timestamp}</span>
                <span className="text-slate-300 font-semibold">{item.production_line_id}</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-white" />
              </div>
            </div>
          );
        })}
      </div>

      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0F1B30] border border-[#1E2E4F] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#1E2E4F] pb-3">
              <div className="flex items-center space-x-2">
                <ShieldAlert className="w-5 h-5 text-red-400" />
                <h3 className="font-bold text-base text-white">Detection Details</h3>
              </div>
              <button onClick={() => setSelectedItem(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="w-full h-48 rounded-xl bg-[#09111E] border border-[#1E2E4F] overflow-hidden relative flex items-center justify-center">
              <img 
                src={selectedItem.crop_url || 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=500'} 
                alt="Defect crop" 
                className="w-full h-full object-cover"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="bg-[#172542] p-3 rounded-xl border border-[#23324D]">
                <span className="text-slate-400 block text-[10px] uppercase">Class</span>
                <span className="text-white font-bold">{selectedItem.class_name} ({selectedItem.confidence}%)</span>
              </div>
              <div className="bg-[#172542] p-3 rounded-xl border border-[#23324D]">
                <span className="text-slate-400 block text-[10px] uppercase">Production Line</span>
                <span className="text-white font-bold">{selectedItem.production_line_id}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button 
                onClick={() => setSelectedItem(null)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
