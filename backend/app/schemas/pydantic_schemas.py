from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class DetectionSchema(BaseModel):
    id: str
    inspection_id: Optional[str] = None
    class_name: str
    confidence: float
    bbox: List[float] # [x1, y1, x2, y2]
    crop_url: Optional[str] = None
    severity: str = "Critical"
    frame_timestamp: Optional[str] = None
    production_line_id: str = "Line A"
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class InspectionSchema(BaseModel):
    id: str
    session_id: Optional[str] = None
    source_type: str
    image_url: Optional[str] = None
    annotated_image_url: Optional[str] = None
    production_line_id: str
    inspected_at: datetime
    processing_time_ms: float
    total_objects: int
    defect_count: int
    status: str
    detections: List[DetectionSchema] = []

    class Config:
        from_attributes = True

class StartInspectionRequest(BaseModel):
    camera_id: str = "CAM-01"
    production_line_id: str = "Line A"
    model_id: str = "yolov8-ind-v1.0"
    source_type: str = "camera" # camera, browser, RTSP

class FrameInferenceRequest(BaseModel):
    image_base64: str
    production_line_id: str = "Line A"
    model_id: str = "yolov8-ind-v1.0"

class AIModelSchema(BaseModel):
    id: str
    name: str
    version: str
    weights_path: str
    class_names: List[str]
    confidence_threshold: float
    iou_threshold: float
    status: str
    precision: float
    recall: float
    map50: float
    latency_ms: float
    fps: float
    size_mb: float
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class ProductionLineSchema(BaseModel):
    id: str
    name: str
    location: str
    status: str
    camera_id: str
    product_sku: str
    defect_count_today: int
    total_inspected_today: int

    class Config:
        from_attributes = True

class ProductSchema(BaseModel):
    id: int
    name: str
    sku: str
    description: Optional[str] = None
    defect_tolerance: float
    target_fps: int

    class Config:
        from_attributes = True

class AnalyticsSummarySchema(BaseModel):
    total_inspected: int
    total_defects: int
    defect_rate: float
    first_pass_yield: float
    inspected_change_pct: float
    defects_change_pct: float
    defect_rate_change_pct: float
    yield_change_pct: float
    defect_distribution: List[dict]
    inspection_trends: List[dict]
    model_performance: dict
