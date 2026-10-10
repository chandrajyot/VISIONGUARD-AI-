export interface DetectionItem {
  id: string;
  inspection_id?: string;
  class_name: 'Scratch' | 'Dent' | 'Crack' | 'Contamination' | 'Other' | 'OK';
  confidence: number;
  bbox: [number, number, number, number]; // [x1, y1, x2, y2]
  crop_url?: string;
  severity: 'Critical' | 'Warning' | 'Acceptable';
  timestamp: string;
  production_line_id: string;
  date?: string;
}

export interface InspectionRecord {
  id: string;
  source_type: 'live' | 'image' | 'video';
  production_line_id: string;
  inspected_at: string;
  processing_time_ms: number;
  defect_count: number;
  status: 'OK' | 'DEFECT' | 'WARNING';
  image_url?: string;
  annotated_image_url?: string;
}

export interface AnalyticsSummary {
  total_inspected: number;
  total_defects: number;
  defect_rate: number;
  first_pass_yield: number;
  inspected_change_pct: number;
  defects_change_pct: number;
  defect_rate_change_pct: number;
  yield_change_pct: number;
  defect_distribution: { name: string; value: number; percentage: number }[];
  inspection_trends: { time: string; inspections: number; defects: number }[];
  model_performance: {
    precision: number;
    recall: number;
    map50: number;
    latency: number;
    fps: number;
  };
}

export interface AIModelItem {
  id: string;
  name: string;
  version: string;
  weights_path: string;
  class_names: string[];
  confidence_threshold: number;
  iou_threshold: number;
  status: 'Active' | 'Staging' | 'Archived';
  precision: number;
  recall: number;
  map50: number;
  latency_ms: number;
  fps: number;
  size_mb: number;
  created_at: string;
}

export interface ProductionLineItem {
  id: string;
  name: string;
  location: string;
  status: 'Operational' | 'Maintenance' | 'Offline';
  camera_id: string;
  product_sku: string;
  defect_count_today: number;
  total_inspected_today: number;
}

export interface ProductItem {
  id: number;
  name: string;
  sku: string;
  description: string;
  defect_tolerance: number;
  target_fps: number;
}

export interface UserItem {
  id: number;
  name: string;
  email: string;
  role: 'Admin' | 'Lead Inspector' | 'Quality Engineer' | 'Technician';
  status: 'Active' | 'Inactive';
  avatar: string;
  created_at: string;
}

export interface SystemStatus {
  status: string;
  fps: number;
  active_model: string;
  camera_connected: boolean;
  cpu_usage_pct: number;
  memory_usage_pct: number;
  gpu_temperature_c: number;
  system_version: string;
}
