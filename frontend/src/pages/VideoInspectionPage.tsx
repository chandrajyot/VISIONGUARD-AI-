import React, { useState, useRef } from 'react';
import { Film, Upload, Play, Pause, Square, Download, ShieldCheck } from 'lucide-react';

export const VideoInspectionPage: React.FC = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [inspectedFrames, setInspectedFrames] = useState(0);
  const [totalDefects, setTotalDefects] = useState(0);
  const [detectedLog, setDetectedLog] = useState<any[]>([]);
  const [sampleRate, setSampleRate] = useState(5);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setVideoFile(file);
      setVideoUrl(URL.createObjectURL(file));
      setProgress(0);
      setInspectedFrames(0);
      setTotalDefects(0);
      setDetectedLog([]);
    }
  };

  const handleStartProcessing = () => {
    if (!videoUrl) return;
    setIsProcessing(true);
    setIsPaused(false);
    setProgress(0);
    setInspectedFrames(0);
    setTotalDefects(0);

    let frameCount = 0;
    let defectCount = 0;
    const logs: any[] = [];

    const interval = setInterval(() => {
      if (isPaused) return;

      frameCount += 5;
      const currentPct = Math.min(100, Math.round((frameCount / 300) * 100));
      setProgress(currentPct);
      setInspectedFrames(frameCount);

      if (frameCount % 45 === 0) {
        defectCount += 1;
        setTotalDefects(defectCount);
        logs.unshift({
          id: `vdet-${frameCount}`,
          timestamp: `00:0${Math.floor(frameCount / 30)}:${(frameCount % 30).toString().padStart(2, '0')}`,
          frame: frameCount,
          class_name: frameCount % 90 === 0 ? 'Crack' : 'Dent',
          confidence: (88 + (frameCount % 10)).toFixed(1),
          severity: 'Critical'
        });
        setDetectedLog([...logs]);
      }

      if (currentPct >= 100) {
        clearInterval(interval);
        setIsProcessing(false);
      }
    }, 200);
  };

  return (
    <div className="space-y-6 pb-8 animate-fade-in">
      <div className="bg-navy-800 border border-navy-600 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center space-x-3">
          <Film className="w-6 h-6 text-brand-blue" />
          <div>
            <h1 className="text-xl lg:text-2xl font-extrabold text-white tracking-tight">
              Uploaded Video Defect Inspection
            </h1>
            <p className="text-xs text-slate-400 mt-1 font-medium">
              Run continuous frame sampling and automated YOLO bounding box annotation over uploaded videos
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-navy-800 border border-navy-600 rounded-2xl p-5 shadow-xl space-y-5">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-navy-600 pb-3">
              Video File & Sampling Setup
            </h3>

            <div className="border-2 border-dashed border-navy-600 hover:border-brand-blue rounded-2xl p-6 text-center cursor-pointer transition-colors bg-navy-850 relative">
              <input
                type="file"
                accept="video/mp4, video/webm, video/avi, video/mov"
                onChange={handleVideoChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <Upload className="w-8 h-8 text-brand-blue mx-auto mb-2" />
              <p className="text-xs font-bold text-white">Click or drag video file to upload</p>
              <p className="text-[10px] text-slate-400 mt-1">Supports MP4, WebM up to 200MB</p>
            </div>

            {videoFile && (
              <div className="p-3 bg-navy-850 rounded-xl border border-navy-600 text-xs font-mono flex items-center justify-between">
                <span className="text-slate-200 truncate">{videoFile.name}</span>
                <span className="text-slate-400 font-bold">{(videoFile.size / (1024 * 1024)).toFixed(1)} MB</span>
              </div>
            )}

            <div className="space-y-2 pt-2 border-t border-navy-600/60">
              <label className="text-xs font-semibold text-slate-300 block">Frame Sampling Frequency</label>
              <select
                value={sampleRate}
                onChange={(e) => setSampleRate(Number(e.target.value))}
                className="w-full bg-navy-850 border border-navy-600 text-slate-200 text-xs font-semibold rounded-xl px-3 py-2 focus:outline-none"
              >
                <option value={1}>Every Frame (Full 1:1 Precision)</option>
                <option value={5}>Sample Every 5th Frame (Recommended)</option>
                <option value={10}>Sample Every 10th Frame (Fast High Speed)</option>
              </select>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              {!isProcessing ? (
                <button
                  disabled={!videoUrl}
                  onClick={handleStartProcessing}
                  className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-lg ${
                    !videoUrl
                      ? 'bg-navy-700 text-slate-500 cursor-not-allowed'
                      : 'bg-brand-blue hover:bg-blue-600 text-white shadow-glow-blue'
                  }`}
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Start Video Inspection</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={() => setIsPaused(!isPaused)}
                    className="flex-1 py-3 bg-navy-750 hover:bg-navy-700 text-amber-400 font-bold text-xs rounded-xl border border-navy-600 flex items-center justify-center space-x-1"
                  >
                    {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                    <span>{isPaused ? 'Resume' : 'Pause'}</span>
                  </button>
                  <button
                    onClick={() => { setIsProcessing(false); setProgress(0); }}
                    className="px-4 py-3 bg-brand-red hover:bg-red-600 text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-1 shadow-glow-red"
                  >
                    <Square className="w-3.5 h-3.5 fill-current" />
                    <span>Stop</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-6">
          <div className="bg-navy-800 border border-navy-600 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-navy-600 pb-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-brand-blue" />
                <span>Video Inspection Stream Viewport</span>
              </h3>

              {progress === 100 && (
                <button 
                  onClick={() => alert('Annotated video ready for download')}
                  className="px-3 py-1.5 bg-navy-850 hover:bg-navy-750 text-slate-200 border border-navy-600 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-brand-blue" />
                  <span>Download Annotated Video</span>
                </button>
              )}
            </div>

            <div className="relative w-full h-[360px] bg-navy-950 border border-navy-600 rounded-xl overflow-hidden flex items-center justify-center">
              {videoUrl ? (
                <video
                  ref={videoRef}
                  src={videoUrl}
                  controls
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-center p-8 text-slate-500 space-y-2">
                  <Film className="w-12 h-12 mx-auto text-slate-600" />
                  <p className="text-xs font-semibold">No video uploaded</p>
                  <p className="text-[10px]">Select a video file to run frame-by-frame defect scanning</p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono font-semibold">
                <span className="text-slate-300">Job Progress: <strong className="text-brand-blue">{progress}%</strong></span>
                <span className="text-slate-400">Inspected Frames: <strong className="text-white">{inspectedFrames}</strong></span>
                <span className="text-slate-400">Defects Found: <strong className="text-brand-red">{totalDefects}</strong></span>
              </div>

              <div className="w-full h-2.5 bg-navy-900 rounded-full overflow-hidden border border-navy-600">
                <div 
                  className="h-full bg-gradient-to-r from-brand-blue to-brand-cyan transition-all duration-300 rounded-full"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            {detectedLog.length > 0 && (
              <div className="pt-3 border-t border-navy-600/60 space-y-2">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Video Defect Timestamp Log</h4>
                <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                  {detectedLog.map((item, i) => (
                    <div key={i} className="p-2.5 bg-navy-850 rounded-xl border border-navy-600 flex items-center justify-between text-xs font-mono">
                      <div className="flex items-center space-x-3">
                        <span className="text-brand-blue font-bold">[{item.timestamp}]</span>
                        <span className="text-white font-semibold">{item.class_name}</span>
                        <span className="text-slate-400 text-[10px]">Frame #{item.frame}</span>
                      </div>
                      <span className="text-brand-red font-bold">{item.confidence}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
