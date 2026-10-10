import React, { useState, useEffect } from 'react';
import { History, Search, RefreshCw } from 'lucide-react';
import type { InspectionRecord } from '../types';
import { api } from '../services/api';

export const HistoryPage: React.FC = () => {
  const [history, setHistory] = useState<InspectionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLine, setSelectedLine] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<InspectionRecord | null>(null);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const lineFilter = selectedLine === 'All' ? undefined : selectedLine;
      const statusFilter = selectedStatus === 'All' ? undefined : selectedStatus;
      const data = await api.getInspectionHistory(lineFilter, statusFilter, 100);
      setHistory(data);
    } catch (err) {
      console.error('Failed to load history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [selectedLine, selectedStatus]);

  const filteredHistory = history.filter(item => 
    item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.production_line_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-8 animate-fade-in">
      <div className="bg-navy-800 border border-navy-600 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <History className="w-6 h-6 text-brand-blue" />
          <div>
            <h1 className="text-xl lg:text-2xl font-extrabold text-white tracking-tight">
              Inspection Records & Historical Logs
            </h1>
            <p className="text-xs text-slate-400 mt-1 font-medium">
              Complete searchable audit log of all historical live, image, and video quality checks
            </p>
          </div>
        </div>

        <button 
          onClick={loadHistory}
          className="px-4 py-2 bg-navy-850 hover:bg-navy-750 border border-navy-600 rounded-xl text-xs font-semibold text-slate-200 flex items-center space-x-2 transition-colors self-start md:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-brand-blue ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      <div className="bg-navy-800 border border-navy-600 rounded-2xl p-4 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by ID or line..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-navy-850 border border-navy-600 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-blue"
            />
          </div>

          <select
            value={selectedLine}
            onChange={(e) => setSelectedLine(e.target.value)}
            className="bg-navy-850 border border-navy-600 text-slate-200 text-xs font-semibold rounded-xl px-3 py-2 focus:outline-none"
          >
            <option value="All">All Production Lines</option>
            <option value="Line A">Line A</option>
            <option value="Line B">Line B</option>
            <option value="Line C">Line C</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-navy-850 border border-navy-600 text-slate-200 text-xs font-semibold rounded-xl px-3 py-2 focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="DEFECT">Defects Only</option>
            <option value="OK">Acceptable / OK Only</option>
          </select>
        </div>

        <span className="text-xs font-mono text-slate-400">
          Showing {filteredHistory.length} inspection records
        </span>
      </div>

      <div className="bg-navy-800 border border-navy-600 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-navy-850 text-slate-400 uppercase text-[10px] border-b border-navy-600">
              <tr>
                <th className="p-4">Inspection ID</th>
                <th className="p-4">Timestamp</th>
                <th className="p-4">Line</th>
                <th className="p-4">Source</th>
                <th className="p-4">Latency</th>
                <th className="p-4">Defects</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-600/60 text-slate-200">
              {filteredHistory.map((item) => (
                <tr key={item.id} className="hover:bg-navy-750 transition-colors">
                  <td className="p-4 font-bold text-white">{item.id}</td>
                  <td className="p-4 text-slate-300">{item.inspected_at}</td>
                  <td className="p-4 text-slate-300 font-semibold">{item.production_line_id}</td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded bg-navy-850 border border-navy-600 text-[10px] text-slate-300 capitalize">
                      {item.source_type}
                    </span>
                  </td>
                  <td className="p-4 text-brand-blue font-bold">{item.processing_time_ms}ms</td>
                  <td className="p-4 font-bold">{item.defect_count}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                      item.status === 'DEFECT' 
                        ? 'bg-brand-red/10 text-brand-red border-brand-red/30' 
                        : 'bg-brand-green/10 text-brand-green border-brand-green/30'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => setSelectedRecord(item)}
                      className="px-3 py-1 bg-navy-850 hover:bg-brand-blue text-slate-300 hover:text-white border border-navy-600 rounded-lg text-xs font-semibold transition-colors"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedRecord && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-navy-850 border border-navy-600 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-navy-600 pb-3">
              <h3 className="font-bold text-base text-white">Record Details — {selectedRecord.id}</h3>
              <button onClick={() => setSelectedRecord(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="bg-navy-800 p-3 rounded-xl border border-navy-600">
                <span className="text-slate-400 block text-[10px] uppercase">Status</span>
                <span className={`font-bold ${selectedRecord.status === 'DEFECT' ? 'text-brand-red' : 'text-brand-green'}`}>{selectedRecord.status}</span>
              </div>
              <div className="bg-navy-800 p-3 rounded-xl border border-navy-600">
                <span className="text-slate-400 block text-[10px] uppercase">Inspected At</span>
                <span className="text-white font-bold">{selectedRecord.inspected_at}</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button onClick={() => setSelectedRecord(null)} className="px-4 py-2 bg-brand-blue text-white rounded-xl text-xs font-semibold">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
