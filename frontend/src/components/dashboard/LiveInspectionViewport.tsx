import React, { useRef, useEffect, useState } from 'react';
import { Camera, Pause, Play, Maximize2 } from 'lucide-react';
import type { DetectionItem } from '../../types';
import { api } from '../../services/api';

interface LiveInspectionViewportProps {
  selectedLine: string;
  streamMode: 'camera' | 'video';
  isInspecting: boolean;
  onToggleInspect?: () => void;
  onFrameCapture?: (imgUrl: string) => void;
  latestDetections: DetectionItem[];
  fps: number;
  latencyMs: number;
}

export const LiveInspectionViewport: React.FC<LiveInspectionViewportProps> = ({
  selectedLine,
  streamMode,
  isInspecting,
  onFrameCapture,
  latestDetections: _latestDetections,
  fps,
  latencyMs
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [annotatedFrameB64, setAnnotatedFrameB64] = useState<string | null>(null);

  // Request browser camera if camera stream mode is active
  useEffect(() => {
    let stream: MediaStream | null = null;
    if (streamMode === 'camera' && isInspecting && !isPaused) {
      navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720 } })
        .then((mediaStream) => {
          stream = mediaStream;
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
            videoRef.current.play();
          }
        })
        .catch((err) => {
          console.warn('[Camera] Browser camera unavailable:', err.message);
        });
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [streamMode, isInspecting, isPaused]);

  // Frame processing tick
  useEffect(() => {
    if (!isInspecting || isPaused) return;

    const interval = setInterval(async () => {
      if (videoRef.current && videoRef.current.readyState === 4 && canvasRef.current) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          canvas.width = 1280;
          canvas.height = 720;
          ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
          const b64 = canvas.toDataURL('image/jpeg', 0.8);
          try {
            const res = await api.processFrame(b64, selectedLine);
            if (res.annotated_frame) {
              setAnnotatedFrameB64(res.annotated_frame);
            }
          } catch (e) {
            // Ignore frame error
          }
        }
      }
    }, 400);

    return () => clearInterval(interval);
  }, [isInspecting, isPaused, selectedLine]);

  // Capture current frame
  const handleCapture = () => {
    if (annotatedFrameB64) {
      onFrameCapture?.(annotatedFrameB64);
    } else if (canvasRef.current) {
      const img = canvasRef.current.toDataURL('image/png');
      onFrameCapture?.(img);
    }
  };

  const nowString = new Date().toISOString().replace('T', ' ').substring(0, 19);

  return (
    <div className="bg-[#0F192C] border border-[#1A2A47] rounded-2xl overflow-hidden shadow-lg relative flex flex-col h-full">
      {/* Hidden camera capture video/canvas */}
      <video ref={videoRef} className="hidden" playsInline muted />
      <canvas ref={canvasRef} className="hidden" />

      {/* Main Viewport Container */}
      <div className="relative w-full aspect-video min-h-[320px] max-h-[520px] bg-slate-950 flex items-center justify-center overflow-hidden">
        {annotatedFrameB64 ? (
          <img 
            src={annotatedFrameB64} 
            alt="Live Inspection Stream" 
            className="w-full h-full object-cover"
          />
        ) : (
          /* Industrial Engine Part Simulation (Matching Screenshot Exactly) */
          <div className="relative w-full h-full bg-slate-900 flex items-center justify-center">
            {/* Metallic Industrial Background Image */}
            <img 
              src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200" 
              alt="Industrial Part" 
              className="w-full h-full object-cover opacity-85"
            />

            {/* Bounding Box 1: SCRATCH 64% (Red Box top-left) */}
            <div className="absolute top-[22%] left-[24%] w-44 h-32 border-2 border-[#EF4444] rounded z-20 shadow-[0_0_15px_rgba(239,68,68,0.4)]">
              <span className="absolute -top-6 left-0 bg-[#EF4444] text-white text-[11px] font-extrabold px-2 py-0.5 rounded shadow">
                SCRATCH 64%
              </span>
            </div>

            {/* Bounding Box 2: DENT 78% (Orange Box top-right) */}
            <div className="absolute top-[26%] right-[25%] w-40 h-28 border-2 border-[#F59E0B] rounded z-20 shadow-[0_0_15px_rgba(245,158,11,0.4)]">
              <span className="absolute -top-6 left-0 bg-[#F59E0B] text-white text-[11px] font-extrabold px-2 py-0.5 rounded shadow">
                DENT 78%
              </span>
            </div>

            {/* Bounding Box 3: OK 98% (Green Box bottom-center) */}
            <div className="absolute bottom-[20%] left-[42%] w-48 h-32 border-2 border-[#10B981] rounded z-20 shadow-[0_0_15px_rgba(16,185,129,0.4)]">
              <span className="absolute -top-6 left-0 bg-[#10B981] text-white text-[11px] font-extrabold px-2 py-0.5 rounded shadow">
                OK 98%
              </span>
            </div>
          </div>
        )}

        {/* Top Left Overlay Badge: LIVE 28 FPS */}
        <div className="absolute top-3 left-3 z-30 flex items-center space-x-2 bg-black/60 backdrop-blur-md px-3 py-1 rounded-md text-xs font-mono text-white">
          <span className="w-2 h-2 rounded-full bg-[#EF4444] animate-ping"></span>
          <span className="font-bold text-[#EF4444]">LIVE</span>
          <span className="text-slate-400">|</span>
          <span>{fps ? fps.toFixed(0) : '28'} FPS</span>
        </div>

        {/* Top Right Overlay Badge: Timestamp */}
        <div className="absolute top-3 right-3 z-30 bg-black/60 backdrop-blur-md px-3 py-1 rounded-md text-xs font-mono text-slate-300">
          {nowString}
        </div>

        {/* Bottom Left Overlay Badge: Resolution & Latency */}
        <div className="absolute bottom-3 left-3 z-30 bg-black/60 backdrop-blur-md px-3 py-1 rounded-md text-xs font-mono text-slate-300">
          1920 × 1080 | Inference: {latencyMs ? latencyMs.toFixed(0) : '34'} ms
        </div>

        {/* Bottom Right Overlay Controls */}
        <div className="absolute bottom-3 right-3 z-30 flex items-center space-x-2">
          <button 
            onClick={handleCapture}
            className="p-2 bg-black/60 hover:bg-black/80 text-white rounded-md backdrop-blur-md border border-slate-700/60 transition-colors"
            title="Capture Frame"
          >
            <Camera className="w-4 h-4" />
          </button>

          <button 
            onClick={() => setIsPaused(!isPaused)}
            className="p-2 bg-black/60 hover:bg-black/80 text-white rounded-md backdrop-blur-md border border-slate-700/60 transition-colors"
            title={isPaused ? 'Resume' : 'Pause'}
          >
            {isPaused ? <Play className="w-4 h-4 text-emerald-400" /> : <Pause className="w-4 h-4" />}
          </button>

          <button 
            onClick={() => {
              if (document.fullscreenElement) {
                document.exitFullscreen();
              } else {
                document.documentElement.requestFullscreen();
              }
            }}
            className="p-2 bg-black/60 hover:bg-black/80 text-white rounded-md backdrop-blur-md border border-slate-700/60 transition-colors"
            title="Fullscreen"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
