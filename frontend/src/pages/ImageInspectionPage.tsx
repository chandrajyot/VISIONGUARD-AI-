import React, { useState } from 'react';
import { Image, Upload, Zap, Download, RefreshCw, ShieldCheck } from 'lucide-react';
import { api } from '../services/api';

export const ImageInspectionPage: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [confThreshold, setConfThreshold] = useState(0.45);
  const [selectedLine, setSelectedLine] = useState('Line A');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const handleRunInference = async () => {
    if (!selectedFile) return;
    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('line_id', selectedLine);
      formData.append('conf_threshold', confThreshold.toString());

      const res = await api.inspectImage(formData);
      setResult(res);
    } catch (err) {
      console.error('Image inspection error:', err);
      alert('Failed to process image inspection.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 pb-8 animate-fade-in">
      <div className="bg-navy-800 border border-navy-600 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center space-x-3">
          <Image className="w-6 h-6 text-brand-blue" />
          <div>
            <h1 className="text-xl lg:text-2xl font-extrabold text-white tracking-tight">
              Static Image Defect Inspection
            </h1>
            <p className="text-xs text-slate-400 mt-1 font-medium">
              Upload industrial component photos to run instant YOLO AI defect diagnostics
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-navy-800 border border-navy-600 rounded-2xl p-5 shadow-xl space-y-5">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-navy-600 pb-3">
              Image Upload & Settings
            </h3>

            <div className="border-2 border-dashed border-navy-600 hover:border-brand-blue rounded-2xl p-6 text-center cursor-pointer transition-colors bg-navy-850 relative">
              <input
                type="file"
                accept="image/png, image/jpeg, image/jpg"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <Upload className="w-8 h-8 text-brand-blue mx-auto mb-2" />
              <p className="text-xs font-bold text-white">Click or drag image file to upload</p>
              <p className="text-[10px] text-slate-400 mt-1">Supports PNG, JPG, JPEG up to 20MB</p>
            </div>

            {selectedFile && (
              <div className="p-3 bg-navy-850 rounded-xl border border-navy-600 text-xs font-mono flex items-center justify-between">
                <span className="text-slate-200 truncate">{selectedFile.name}</span>
                <span className="text-slate-400 font-bold">{(selectedFile.size / 1024).toFixed(0)} KB</span>
              </div>
            )}

            <div className="space-y-3 pt-2 border-t border-navy-600/60">
              <label className="text-xs font-semibold text-slate-300 block">Production Line Context</label>
              <select
                value={selectedLine}
                onChange={(e) => setSelectedLine(e.target.value)}
                className="w-full bg-navy-850 border border-navy-600 text-slate-200 text-xs font-semibold rounded-xl px-3 py-2 focus:outline-none"
              >
                <option value="Line A">Line A (Stamped Sheet Metal)</option>
                <option value="Line B">Line B (PCB Controller)</option>
                <option value="Line C">Line C (Composite Panel)</option>
              </select>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-300">
                  <span>Confidence Threshold</span>
                  <span className="font-mono text-brand-blue font-bold">{Math.round(confThreshold * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.15"
                  max="0.95"
                  step="0.05"
                  value={confThreshold}
                  onChange={(e) => setConfThreshold(parseFloat(e.target.value))}
                  className="w-full accent-brand-blue bg-navy-900 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            <button
              disabled={!selectedFile || isProcessing}
              onClick={handleRunInference}
              className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-lg ${
                !selectedFile || isProcessing
                  ? 'bg-navy-700 text-slate-500 cursor-not-allowed'
                  : 'bg-brand-blue hover:bg-blue-600 text-white shadow-glow-blue'
              }`}
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Analyzing Image with YOLOv8...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  <span>Run Defect Diagnostics</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-6">
          <div className="bg-navy-800 border border-navy-600 rounded-2xl p-5 shadow-xl flex flex-col min-h-[480px]">
            <div className="flex items-center justify-between border-b border-navy-600 pb-3 mb-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-brand-green" />
                <span>Annotated Inspection Result</span>
              </h3>

              {result?.annotated_image_url && (
                <a
                  href={result.annotated_image_url}
                  download="annotated_inspection.jpg"
                  className="px-3 py-1.5 bg-navy-850 hover:bg-navy-750 text-slate-200 border border-navy-600 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-brand-blue" />
                  <span>Download Result</span>
                </a>
              )}
            </div>

            <div className="flex-1 bg-navy-950 border border-navy-600 rounded-xl overflow-hidden flex items-center justify-center relative min-h-[360px]">
              {result?.annotated_image_url ? (
                <img 
                  src={result.annotated_image_url} 
                  alt="Annotated Inspection Result" 
                  className="w-full h-full object-contain max-h-[460px]"
                />
              ) : previewUrl ? (
                <img 
                  src={previewUrl} 
                  alt="Uploaded Preview" 
                  className="w-full h-full object-contain opacity-70 max-h-[460px]"
                />
              ) : (
                <div className="text-center p-8 text-slate-500 space-y-2">
                  <Image className="w-12 h-12 mx-auto text-slate-600" />
                  <p className="text-xs font-semibold">No image selected for inspection</p>
                  <p className="text-[10px]">Upload an image file on the left to begin analysis</p>
                </div>
              )}
            </div>

            {result && (
              <div className="mt-4 p-4 bg-navy-850 rounded-xl border border-navy-600 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold">
                  <div className="flex items-center space-x-2">
                    <span className="text-slate-300">Diagnostic Status:</span>
                    <span className={`px-2 py-0.5 rounded ${result.status === 'DEFECT' ? 'bg-brand-red/20 text-brand-red border border-brand-red/40' : 'bg-brand-green/20 text-brand-green border border-brand-green/40'}`}>
                      {result.status} ({result.defect_count} defects found)
                    </span>
                  </div>

                  <span className="font-mono text-slate-400">
                    Latency: <strong className="text-brand-blue">{result.processing_time_ms}ms</strong>
                  </span>
                </div>

                {result.detections?.length > 0 && (
                  <div className="pt-2 border-t border-navy-600/60">
                    <span className="text-[11px] font-bold text-slate-300 uppercase block mb-2">Detected Defect Bounding Crops</span>
                    <div className="flex items-center space-x-3 overflow-x-auto pb-1">
                      {result.detections.map((det: any, i: number) => (
                        <div key={i} className="bg-navy-800 border border-navy-600 rounded-lg p-2 min-w-[140px] text-center space-y-1">
                          <span className="text-[10px] font-bold text-brand-red block">{det.class_name} ({det.confidence}%)</span>
                          <span className="text-[9px] font-mono text-slate-400 block">{det.severity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
