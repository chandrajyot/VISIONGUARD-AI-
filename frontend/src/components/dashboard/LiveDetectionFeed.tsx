import React from 'react';
import type { DetectionItem } from '../../types';

interface LiveDetectionFeedProps {
  detections: DetectionItem[];
  onSelectDetection?: (item: DetectionItem) => void;
}

export const LiveDetectionFeed: React.FC<LiveDetectionFeedProps> = ({ detections, onSelectDetection }) => {
  const feedItems = detections.length > 0 ? detections : [
    {
      id: 'feed-1',
      class_name: 'Crack' as const,
      confidence: 97.8,
      bbox: [100, 100, 200, 200] as [number, number, number, number],
      severity: 'Critical' as const,
      timestamp: '10:45:01',
      production_line_id: 'Line A',
      crop_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300'
    },
    {
      id: 'feed-2',
      class_name: 'Dent' as const,
      confidence: 94.2,
      bbox: [80, 80, 180, 180] as [number, number, number, number],
      severity: 'Critical' as const,
      timestamp: '10:44:48',
      production_line_id: 'Line A',
      crop_url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=300'
    },
    {
      id: 'feed-3',
      class_name: 'Scratch' as const,
      confidence: 92.1,
      bbox: [50, 50, 150, 150] as [number, number, number, number],
      severity: 'Warning' as const,
      timestamp: '10:44:30',
      production_line_id: 'Line B',
      crop_url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=300'
    },
    {
      id: 'feed-4',
      class_name: 'Contamination' as const,
      confidence: 89.6,
      bbox: [120, 120, 220, 220] as [number, number, number, number],
      severity: 'Warning' as const,
      timestamp: '10:43:55',
      production_line_id: 'Line A',
      crop_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300'
    },
    {
      id: 'feed-5',
      class_name: 'Other' as const,
      confidence: 86.4,
      bbox: [90, 90, 190, 190] as [number, number, number, number],
      severity: 'Warning' as const,
      timestamp: '10:42:10',
      production_line_id: 'Line C',
      crop_url: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=300'
    }
  ];

  return (
    <div className="bg-[#0F192C] border border-[#1A2A47] rounded-xl p-3.5 shadow-md">
      <div className="flex items-center justify-between mb-3 border-b border-[#1A2A47] pb-2.5">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-[#EF4444] animate-ping mr-1"></span>
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Live Detection Feed
          </h3>
        </div>

        <span className="text-[10px] font-mono text-slate-400">
          Auto-scroll Enabled
        </span>
      </div>

      <div className="flex items-center space-x-3 overflow-x-auto pb-1 scrollbar-thin">
        {feedItems.map((item, idx) => {
          const isOK = item.class_name === 'OK';
          const isDent = item.class_name === 'Dent';
          const borderColor = isOK ? 'border-[#10B981]' : isDent ? 'border-[#F59E0B]' : 'border-[#EF4444]';
          const badgeBg = isOK ? 'bg-[#10B981]' : isDent ? 'bg-[#F59E0B]' : 'bg-[#EF4444]';

          return (
            <div
              key={`${item.id || 'feed'}-${idx}`}
              onClick={() => onSelectDetection?.(item)}
              className={`min-w-[190px] max-w-[190px] bg-[#152238] hover:bg-[#1A2B47] border ${borderColor} rounded-xl overflow-hidden shadow-md cursor-pointer transition-all duration-200 group shrink-0 relative`}
            >
              <div className="relative w-full h-24 bg-[#09111E]">
                <img 
                  src={item.crop_url || 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=200'} 
                  alt={item.class_name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Top Badge Overlay */}
                <div className={`absolute top-1.5 left-1.5 px-2 py-0.5 rounded ${badgeBg} text-white font-mono font-bold text-[9px] shadow`}>
                  {item.class_name} {item.confidence}%
                </div>

                {/* Bottom Timestamp Overlay */}
                <div className="absolute bottom-1.5 left-1.5 text-[9px] font-mono text-slate-200 bg-black/60 px-1.5 py-0.5 rounded backdrop-blur-sm">
                  {item.timestamp}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
