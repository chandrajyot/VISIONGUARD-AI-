import React from 'react';
import { BarChart3, Download, PieChart as PieIcon, Layers } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import type { AnalyticsSummary } from '../types';

interface AnalyticsPageProps {
  analytics: AnalyticsSummary | null;
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = () => {
  const lineComparisonData = [
    { line: 'Line A (Sheet Metal)', inspected: 14280, defects: 342, yield: 97.6 },
    { line: 'Line B (PCB Main)', inspected: 9840, defects: 118, yield: 98.8 },
    { line: 'Line C (Carbon Skin)', inspected: 4200, defects: 54, yield: 98.7 }
  ];

  const severityData = [
    { name: 'Critical (Crack/Dent)', value: 152, color: '#F04444' },
    { name: 'Warning (Scratch/Contam)', value: 180, color: '#F59E0B' },
    { name: 'Acceptable Minor', value: 10, color: '#20C968' }
  ];

  return (
    <div className="space-y-6 pb-8 animate-fade-in">
      {/* Header */}
      <div className="bg-navy-800 border border-navy-600 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <BarChart3 className="w-6 h-6 text-brand-blue" />
          <div>
            <h1 className="text-xl lg:text-2xl font-extrabold text-white tracking-tight">
              Quality Analytics & Intelligence Reports
            </h1>
            <p className="text-xs text-slate-400 mt-1 font-medium">
              Comprehensive statistical insights, yield metrics, and defect frequency analysis across factory bays
            </p>
          </div>
        </div>

        <button 
          onClick={() => alert('Downloading Quality Analytics Report (CSV)...')}
          className="px-4 py-2 bg-brand-blue hover:bg-blue-600 text-white rounded-xl text-xs font-bold shadow-glow-blue flex items-center space-x-2 transition-all self-start md:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV Report</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-navy-800 border border-navy-600 rounded-2xl p-5 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2 border-b border-navy-600 pb-3">
            <Layers className="w-4 h-4 text-brand-blue" />
            <span>Line-by-Line Inspection & Defect Breakdown</span>
          </h3>

          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={lineComparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#172542" />
                <XAxis dataKey="line" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0D172A', borderColor: '#23324D', borderRadius: '8px', color: '#fff' }} />
                <Bar dataKey="inspected" fill="#316BFA" name="Inspected" radius={[4, 4, 0, 0]} />
                <Bar dataKey="defects" fill="#F04444" name="Defects" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-5 bg-navy-800 border border-navy-600 rounded-2xl p-5 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2 border-b border-navy-600 pb-3">
            <PieIcon className="w-4 h-4 text-brand-amber" />
            <span>Defect Severity Breakdown</span>
          </h3>

          <div className="h-[220px] w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={severityData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value">
                  {severityData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} stroke="#0D172A" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0D172A', borderColor: '#23324D', color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 font-mono text-xs">
            {severityData.map((s, i) => (
              <div key={i} className="flex justify-between items-center text-slate-300">
                <span className="flex items-center">
                  <span className="w-2.5 h-2.5 rounded-full mr-2" style={{ backgroundColor: s.color }}></span>
                  {s.name}
                </span>
                <span className="font-bold text-white">{s.value} ({Math.round((s.value / 342) * 100)}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
