import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { ChevronDown } from 'lucide-react';
import type { AnalyticsSummary } from '../../types';

interface InspectionTrendCardProps {
  data: AnalyticsSummary | null;
}

export const InspectionTrendCard: React.FC<InspectionTrendCardProps> = ({ data }) => {
  const [timeRange, setTimeRange] = useState('Last 24 Hours');

  const trendData = data?.inspection_trends || [
    { time: '00:00', inspections: 40, defects: 15 },
    { time: '04:00', inspections: 85, defects: 25 },
    { time: '08:00', inspections: 105, defects: 20 },
    { time: '12:00', inspections: 95, defects: 18 },
    { time: '16:00', inspections: 110, defects: 32 },
    { time: '20:00', inspections: 90, defects: 22 }
  ];

  return (
    <div className="bg-[#0F192C] border border-[#1A2A47] rounded-xl p-3.5 flex flex-col justify-between h-full shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider">
          Inspection Trend
        </h3>

        <div className="relative">
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className="appearance-none bg-[#152238] border border-[#23324D] text-[10px] font-semibold text-slate-300 rounded-lg px-2.5 py-1 pr-6 focus:outline-none cursor-pointer"
          >
            <option value="Last 24 Hours">Last 24 Hours</option>
            <option value="Last 7 Days">Last 7 Days</option>
            <option value="Last 30 Days">Last 30 Days</option>
          </select>
          <ChevronDown className="w-3 h-3 text-slate-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center space-x-3 text-[10px] font-medium text-slate-400 mb-2">
        <div className="flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-[#3B82F6]"></span>
          <span className="text-slate-300">Total Inspections</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-[#EF4444]"></span>
          <span className="text-slate-300">Defects</span>
        </div>
      </div>

      {/* Line Chart */}
      <div className="w-full h-24 my-auto">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trendData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#152238" vertical={false} />
            <XAxis dataKey="time" stroke="#64748B" fontSize={9} tickLine={false} />
            <YAxis stroke="#64748B" fontSize={9} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#09111E',
                borderColor: '#1A2A47',
                borderRadius: '8px',
                fontSize: '10px',
                color: '#fff'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="inspections" 
              stroke="#3B82F6" 
              strokeWidth={2}
              dot={{ r: 3, fill: '#3B82F6' }} 
            />
            <Line 
              type="monotone" 
              dataKey="defects" 
              stroke="#EF4444" 
              strokeWidth={2}
              dot={{ r: 3, fill: '#EF4444' }} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
