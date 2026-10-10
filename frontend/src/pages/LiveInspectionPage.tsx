import React, { useState, useEffect } from 'react';
import { Eye, Camera, Sliders, Play, Square, ShieldAlert } from 'lucide-react';
import type { DetectionItem } from '../types';
import { api } from '../services/api';
import { LiveInspectionViewport } from '../components/dashboard/LiveInspectionViewport';

interface LiveInspectionPageProps {
  liveDetections: DetectionItem[];
  fps: number;
  latencyMs: number;
}

export const LiveInspectionPage: React.FC<LiveInspectionPageProps> = ({ liveDetections, fps, latencyMs }) => {
  const [cameras, setCameras] = useState<any[]>([]);
  const [selectedCamera, setSelectedCamera] = useState('CAM-01');
  const [selectedLine, setSelectedLine] = useState('Line A');
  const [confThreshold, setConfThreshold] = useState(0.45);
  const [isInspecting, setIsInspecting] = useState(true);

  useEffect(() => {
    api.getCameras().then(setCameras).catch(() => {});
  }, []);

  return (
    <div className="space-y-6 pb-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-navy-800 border border-navy-600 rounded-2xl p-5 shadow-xl">
        <div>
          <div className="flex items-center space-x-3">
            <Eye className="w-6 h-6 text-brand-blue" />
            <h1 className="text-xl lg:text-2xl font-extrabold text-white tracking-tight">
              Live Inspection Studio
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            Dedicated real-time camera feed and live YOLO defect detection control
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsInspecting(!isInspecting)}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg ${
              isInspecting
                ? 'bg-brand-red hover:bg-red-600 text-white shadow-glow-red'
                : 'bg-brand-green hover:bg-green-600 text-white shadow-glow-green'
            }`}
          >
            {isInspecting ? (
              <>
                <Square className="w-4 h-4 fill-current" />
                <span>Stop Inspection</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Start Inspection</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <LiveInspectionViewport
            selectedLine={selectedLine}
            streamMode="camera"
            isInspecting={isInspecting}
            onToggleInspect={() => setIsInspecting(!isInspecting)}
            latestDetections={liveDetections}
            fps={fps}
            latencyMs={latencyMs}
          />

          <div className="bg-navy-800 border border-navy-600 rounded-2xl p-5 shadow-xl space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 text-brand-amber" />
              <span>Inspection Session Event Log</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-navy-850 text-slate-400 uppercase text-[10px] border-b border-navy-600">
                  <tr>
                    <th className="p-3">Time</th>
                    <th className="p-3">Defect Class</th>
                    <th className="p-3">Confidence</th>
                    <th className="p-3">Severity</th>
                    <th className="p-3">Line</th>
                    <th className="p-3">Bounding Box [x1, y1, x2, y2]</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-600/60 text-slate-200">
                  {liveDetections.slice(0, 6).map((det, idx) => (
                    <tr key={det.id || idx} className="hover:bg-navy-750 transition-colors">
                      <td className="p-3 font-semibold text-slate-300">{det.timestamp || '10:45:07'}</td>
                      <td className="p-3 font-bold text-white">{det.class_name}</td>
                      <td className="p-3 text-brand-green">{det.confidence}%</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          det.severity === 'Critical' ? 'bg-brand-red/10 text-brand-red border border-brand-red/30' : 'bg-brand-amber/10 text-brand-amber border border-brand-amber/30'
                        }`}>
                          {det.severity}
                        </span>
                      </td>
                      <td className="p-3 text-slate-400">{det.production_line_id}</td>
                      <td className="p-3 text-slate-400 font-mono text-[10px]">
                        [{det.bbox.join(', ')}]
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-navy-800 border border-navy-600 rounded-2xl p-5 shadow-xl space-y-5">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2 border-b border-navy-600 pb-3">
              <Sliders className="w-4 h-4 text-brand-blue" />
              <span>Inspection Controls</span>
            </h3>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
                <Camera className="w-3.5 h-3.5 text-brand-blue" />
                <span>Select Hardware Camera</span>
              </label>
              <select
                value={selectedCamera}
                onChange={(e) => setSelectedCamera(e.target.value)}
                className="w-full bg-navy-850 border border-navy-600 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-blue"
              >
                {cameras.length > 0 ? (
                  cameras.map((c) => (
                    <option key={c.id} value={c.id}>{c.name} ({c.resolution})</option>
                  ))
                ) : (
                  <>
                    <option value="CAM-01">CAM-01 Primary Conveyor (1920x1080)</option>
                    <option value="CAM-02">CAM-02 High Speed Macro (1920x1080)</option>
                    <option value="CAM-03">CAM-03 Thermal Array (1280x720)</option>
                  </>
                )}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Target Production Line</label>
              <select
                value={selectedLine}
                onChange={(e) => setSelectedLine(e.target.value)}
                className="w-full bg-navy-850 border border-navy-600 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-blue"
              >
                <option value="Line A">Line A (Automotive Door Panel)</option>
                <option value="Line B">Line B (PCB Motherboard)</option>
                <option value="Line C">Line C (Carbon Wing Skin)</option>
              </select>
            </div>

            <div className="space-y-2 pt-2 border-t border-navy-600/60">
              <div className="flex justify-between text-xs font-semibold text-slate-300">
                <span>Confidence Threshold</span>
                <span className="font-mono text-brand-blue font-bold">{Math.round(confThreshold * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.10"
                max="0.95"
                step="0.05"
                value={confThreshold}
                onChange={(e) => setConfThreshold(parseFloat(e.target.value))}
                className="w-full accent-brand-blue bg-navy-900 rounded-lg cursor-pointer"
              />
            </div>

            <div className="p-4 bg-navy-850 rounded-xl border border-navy-600 space-y-2 text-xs font-mono">
              <div className="flex justify-between text-slate-400">
                <span>Active Model:</span>
                <span className="text-white font-bold">YOLOv8 v1.0</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Inference Device:</span>
                <span className="text-brand-green font-bold">CUDA GPU</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Target Resolution:</span>
                <span className="text-slate-200">1920x1080 @ 60fps</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
