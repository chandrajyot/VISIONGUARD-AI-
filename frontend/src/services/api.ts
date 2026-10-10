import axios from 'axios';
import type { AnalyticsSummary, DetectionItem, InspectionRecord, AIModelItem, ProductionLineItem, ProductItem, UserItem, SystemStatus } from '../types';

const API_BASE = '/api';

export const api = {
  // System
  getHealth: async () => {
    const res = await axios.get(`${API_BASE}/health`);
    return res.data;
  },
  getSystemStatus: async (): Promise<SystemStatus> => {
    const res = await axios.get(`${API_BASE}/system/status`);
    return res.data;
  },
  getCameras: async () => {
    const res = await axios.get(`${API_BASE}/cameras`);
    return res.data;
  },

  // Analytics
  getAnalyticsSummary: async (): Promise<AnalyticsSummary> => {
    const res = await axios.get(`${API_BASE}/analytics/summary`);
    return res.data;
  },

  // Inspection
  getInspectionStatus: async () => {
    const res = await axios.get(`${API_BASE}/inspection/status`);
    return res.data;
  },
  startInspection: async (lineId: string, cameraId: string) => {
    const res = await axios.post(`${API_BASE}/inspection/start?line_id=${encodeURIComponent(lineId)}&camera_id=${encodeURIComponent(cameraId)}`);
    return res.data;
  },
  stopInspection: async () => {
    const res = await axios.post(`${API_BASE}/inspection/stop`);
    return res.data;
  },
  pauseInspection: async () => {
    const res = await axios.post(`${API_BASE}/inspection/pause`);
    return res.data;
  },
  processFrame: async (imageBase64: string, lineId: string, confThreshold: number = 0.45) => {
    const res = await axios.post(`${API_BASE}/inspection/frame`, {
      image_base64: imageBase64,
      line_id: lineId,
      confidence_threshold: confThreshold
    });
    return res.data;
  },
  inspectImage: async (formData: FormData) => {
    const res = await axios.post(`${API_BASE}/inspection/image`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  },

  // Detections & History
  getRecentDetections: async (limit: number = 20, lineId?: string): Promise<DetectionItem[]> => {
    const url = lineId ? `${API_BASE}/detections?limit=${limit}&line_id=${encodeURIComponent(lineId)}` : `${API_BASE}/detections?limit=${limit}`;
    const res = await axios.get(url);
    return res.data;
  },
  getInspectionHistory: async (lineId?: string, status?: string, limit: number = 50): Promise<InspectionRecord[]> => {
    let url = `${API_BASE}/history?limit=${limit}`;
    if (lineId) url += `&line_id=${encodeURIComponent(lineId)}`;
    if (status && status !== 'All') url += `&status=${encodeURIComponent(status)}`;
    const res = await axios.get(url);
    return res.data;
  },

  // Models
  getModels: async (): Promise<AIModelItem[]> => {
    const res = await axios.get(`${API_BASE}/models`);
    return res.data;
  },
  activateModel: async (modelId: string) => {
    const res = await axios.post(`${API_BASE}/models/${modelId}/activate`);
    return res.data;
  },
  registerModel: async (formData: FormData) => {
    const res = await axios.post(`${API_BASE}/models`, formData);
    return res.data;
  },

  // Production Lines
  getProductionLines: async (): Promise<ProductionLineItem[]> => {
    const res = await axios.get(`${API_BASE}/production-lines`);
    return res.data;
  },
  createProductionLine: async (data: Partial<ProductionLineItem>) => {
    const res = await axios.post(`${API_BASE}/production-lines`, data);
    return res.data;
  },

  // Products
  getProducts: async (): Promise<ProductItem[]> => {
    const res = await axios.get(`${API_BASE}/products`);
    return res.data;
  },
  createProduct: async (data: Partial<ProductItem>) => {
    const res = await axios.post(`${API_BASE}/products`, data);
    return res.data;
  },

  // Users
  getUsers: async (): Promise<UserItem[]> => {
    const res = await axios.get(`${API_BASE}/users`);
    return res.data;
  },
  createUser: async (data: Partial<UserItem>) => {
    const res = await axios.post(`${API_BASE}/users`, data);
    return res.data;
  }
};

// WebSocket Service
export class InspectionWebSocket {
  private ws: WebSocket | null = null;
  private url: string;
  private onMessageCallback: ((event: any) => void) | null = null;
  private reconnectInterval: any = null;

  constructor() {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
      ? 'localhost:8000' 
      : window.location.host;
    this.url = `${protocol}//${host}/ws/inspection`;
  }

  connect(onMessage: (event: any) => void) {
    this.onMessageCallback = onMessage;
    try {
      this.ws = new WebSocket(this.url);
      
      this.ws.onopen = () => {
        console.log('[WebSocket] Connected to VisionGuard AI stream');
        if (this.reconnectInterval) {
          clearInterval(this.reconnectInterval);
          this.reconnectInterval = null;
        }
      };

      this.ws.onmessage = (msg) => {
        try {
          const data = JSON.parse(msg.data);
          if (this.onMessageCallback) {
            this.onMessageCallback(data);
          }
        } catch (e) {
          console.error('[WebSocket] Failed to parse message', e);
        }
      };

      this.ws.onclose = () => {
        console.warn('[WebSocket] Closed. Attempting reconnect in 3s...');
        this.scheduleReconnect();
      };

      this.ws.onerror = (err) => {
        console.error('[WebSocket] Error', err);
        this.ws?.close();
      };
    } catch (err) {
      console.error('[WebSocket] Connection failed', err);
      this.scheduleReconnect();
    }
  }

  private scheduleReconnect() {
    if (!this.reconnectInterval) {
      this.reconnectInterval = setInterval(() => {
        if (this.onMessageCallback) {
          this.connect(this.onMessageCallback);
        }
      }, 3000);
    }
  }

  disconnect() {
    if (this.reconnectInterval) {
      clearInterval(this.reconnectInterval);
      this.reconnectInterval = null;
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}
