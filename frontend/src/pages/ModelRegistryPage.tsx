import React, { useState, useEffect } from 'react';
import { Cpu, CheckCircle2, Plus } from 'lucide-react';
import type { AIModelItem } from '../types';
import { api } from '../services/api';

export const ModelRegistryPage: React.FC = () => {
  const [models, setModels] = useState<AIModelItem[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  const [modelName, setModelName] = useState('');
  const [modelVersion, setModelVersion] = useState('');

  const loadModels = async () => {
    try {
      const data = await api.getModels();
      setModels(data);
    } catch (err) {
      console.error('Failed to load models:', err);
    }
  };

  useEffect(() => {
    loadModels();
  }, []);

  const handleActivate = async (id: string) => {
    try {
      await api.activateModel(id);
      loadModels();
    } catch (err) {
      console.error('Failed to activate model:', err);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modelName || !modelVersion) return;
    try {
      const formData = new FormData();
      formData.append('name', modelName);
      formData.append('version', modelVersion);
      await api.registerModel(formData);
      setShowAddModal(false);
      setModelName('');
      setModelVersion('');
      loadModels();
    } catch (err) {
      console.error('Failed to register model:', err);
    }
  };

  return (
    <div className="space-y-6 pb-8 animate-fade-in">
      <div className="bg-navy-800 border border-navy-600 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <Cpu className="w-6 h-6 text-brand-blue" />
          <div>
            <h1 className="text-xl lg:text-2xl font-extrabold text-white tracking-tight">
              AI Model Registry & Weights Management
            </h1>
            <p className="text-xs text-slate-400 mt-1 font-medium">
              Manage custom-trained YOLO defect inspection checkpoints, benchmark metrics, and active runtime weights
            </p>
          </div>
        </div>

        <button 
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-brand-blue hover:bg-blue-600 text-white rounded-xl text-xs font-bold shadow-glow-blue flex items-center space-x-2 transition-all self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Register New YOLO Model</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {models.map((m) => {
          const isActive = m.status === 'Active';

          return (
            <div 
              key={m.id} 
              className={`bg-navy-800 border rounded-2xl p-6 shadow-xl space-y-5 transition-all ${
                isActive ? 'border-brand-blue shadow-glow-blue' : 'border-navy-600'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <h2 className="text-base font-bold text-white">{m.name}</h2>
                    <span className="text-xs font-mono font-bold text-brand-blue bg-brand-blue/10 border border-brand-blue/30 px-2 py-0.5 rounded">
                      {m.version}
                    </span>
                  </div>
                  <p className="text-xs font-mono text-slate-400 mt-1">Weights: {m.weights_path}</p>
                </div>

                <span className={`px-3 py-1 rounded-full text-xs font-bold font-mono border ${
                  isActive 
                    ? 'bg-brand-green/20 text-brand-green border-brand-green/40' 
                    : 'bg-navy-850 text-slate-400 border-navy-600'
                }`}>
                  {m.status}
                </span>
              </div>

              <div className="grid grid-cols-5 gap-2 bg-navy-850 p-3 rounded-xl border border-navy-600 text-center font-mono">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Precision</span>
                  <span className="text-xs font-bold text-white">{m.precision}%</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Recall</span>
                  <span className="text-xs font-bold text-brand-green">{m.recall}%</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">mAP@0.5</span>
                  <span className="text-xs font-bold text-brand-cyan">{m.map50}%</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Latency</span>
                  <span className="text-xs font-bold text-brand-amber">{m.latency_ms}ms</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">FPS</span>
                  <span className="text-xs font-bold text-purple-400">{m.fps}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Target Defect Classes</span>
                <div className="flex flex-wrap gap-1.5">
                  {m.class_names.map((c, i) => (
                    <span key={i} className="px-2 py-0.5 bg-navy-900 border border-navy-600 rounded text-[10px] font-mono text-slate-300">
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-navy-600/60 flex justify-end">
                {!isActive ? (
                  <button 
                    onClick={() => handleActivate(m.id)}
                    className="px-4 py-2 bg-navy-850 hover:bg-brand-blue text-slate-200 hover:text-white border border-navy-600 font-bold text-xs rounded-xl transition-all"
                  >
                    Set as Active Runtime Model
                  </button>
                ) : (
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-brand-green">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Currently Active in Inference Pipeline</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleRegister} className="bg-navy-850 border border-navy-600 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-bold text-base text-white border-b border-navy-600 pb-3">Register New YOLO Weights</h3>
            
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Model Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. YOLOv8 PCB Surface Specialist"
                  value={modelName}
                  onChange={(e) => setModelName(e.target.value)}
                  className="w-full bg-navy-900 border border-navy-600 rounded-xl px-3 py-2 text-xs text-white"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Version Tag</label>
                <input 
                  type="text" 
                  placeholder="e.g. v2.5"
                  value={modelVersion}
                  onChange={(e) => setModelVersion(e.target.value)}
                  className="w-full bg-navy-900 border border-navy-600 rounded-xl px-3 py-2 text-xs text-white"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 bg-navy-800 text-slate-300 rounded-xl text-xs">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-brand-blue text-white font-bold rounded-xl text-xs">Register Model</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
