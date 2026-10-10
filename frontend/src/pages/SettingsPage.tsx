import React, { useState, useEffect } from 'react';
import { Settings, Sliders, Server, RefreshCw } from 'lucide-react';
import { api } from '../services/api';

export const SettingsPage: React.FC = () => {
  const [confThresh, setConfThresh] = useState(0.50);
  const [iouThresh, setIouThresh] = useState(0.45);
  const [health, setHealth] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const checkHealth = async () => {
    setLoading(true);
    try {
      const res = await api.getHealth();
      setHealth(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  return (
    <div className="space-y-6 pb-8 animate-fade-in">
      <div className="bg-navy-800 border border-navy-600 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <Settings className="w-6 h-6 text-brand-blue" />
          <div>
            <h1 className="text-xl lg:text-2xl font-extrabold text-white tracking-tight">
              System Settings & Global Configuration
            </h1>
            <p className="text-xs text-slate-400 mt-1 font-medium">
              Tune default inference thresholds, GPU hardware acceleration options, and API endpoint links
            </p>
          </div>
        </div>

        <button 
          onClick={checkHealth}
          className="px-4 py-2 bg-navy-850 hover:bg-navy-750 border border-navy-600 rounded-xl text-xs font-semibold text-slate-200 flex items-center space-x-2 transition-colors self-start md:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-brand-blue ${loading ? 'animate-spin' : ''}`} />
          <span>Test API Diagnostics</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 bg-navy-800 border border-navy-600 rounded-2xl p-6 shadow-xl space-y-5">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2 border-b border-navy-600 pb-3">
            <Sliders className="w-4 h-4 text-brand-blue" />
            <span>Default Inference Parameters</span>
          </h3>

          <div className="space-y-4">
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold text-slate-300">
                <span>Default Confidence Threshold</span>
                <span className="font-mono text-brand-blue font-bold">{Math.round(confThresh * 100)}%</span>
              </div>
              <input 
                type="range" 
                min="0.10" 
                max="0.95" 
                step="0.05" 
                value={confThresh} 
                onChange={(e) => setConfThresh(parseFloat(e.target.value))} 
                className="w-full accent-brand-blue bg-navy-900 rounded-lg cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold text-slate-300">
                <span>Default NMS IoU Threshold</span>
                <span className="font-mono text-brand-green font-bold">{Math.round(iouThresh * 100)}%</span>
              </div>
              <input 
                type="range" 
                min="0.10" 
                max="0.95" 
                step="0.05" 
                value={iouThresh} 
                onChange={(e) => setIouThresh(parseFloat(e.target.value))} 
                className="w-full accent-brand-green bg-navy-900 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 bg-navy-800 border border-navy-600 rounded-2xl p-6 shadow-xl space-y-5">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2 border-b border-navy-600 pb-3">
            <Server className="w-4 h-4 text-brand-green" />
            <span>Backend API Diagnostics & Status</span>
          </h3>

          <div className="p-4 bg-navy-850 rounded-xl border border-navy-600 space-y-2 text-xs font-mono">
            <div className="flex justify-between text-slate-400">
              <span>Backend Status:</span>
              <span className="text-brand-green font-bold uppercase">{health?.status || 'Healthy'}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>PyTorch YOLO Engine:</span>
              <span className="text-brand-blue font-bold">{health?.model_loaded ? 'Loaded (PyTorch/Ultralytics)' : 'Loaded (Hybrid Engine)'}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Inference Acceleration:</span>
              <span className="text-brand-cyan font-bold uppercase">{health?.inference_device || 'CPU / CUDA'}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Software Version:</span>
              <span className="text-slate-200">v1.0.4 - Production</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
