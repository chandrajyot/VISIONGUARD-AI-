from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(String, default="Inspector") # Admin, Inspector, Quality Engineer, Technician
    status = Column(String, default="Active") # Active, Inactive
    avatar = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class ProductionLine(Base):
    __tablename__ = "production_lines"

    id = Column(String, primary_key=True, index=True) # Line A, Line B, Line C
    name = Column(String, nullable=False)
    location = Column(String, default="Main Factory Floor - Section 1")
    status = Column(String, default="Operational") # Operational, Maintenance, Offline
    camera_id = Column(String, default="CAM-01")
    product_sku = Column(String, default="PROD-MET-882")
    defect_count_today = Column(Integer, default=0)
    total_inspected_today = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    sku = Column(String, unique=True, index=True, nullable=False)
    description = Column(Text, nullable=True)
    defect_tolerance = Column(Float, default=1.5) # max allowed defect %
    target_fps = Column(Integer, default=30)
    created_at = Column(DateTime, default=datetime.utcnow)

class AIModel(Base):
    __tablename__ = "models"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    version = Column(String, nullable=False)
    weights_path = Column(String, nullable=False)
    class_names = Column(Text, default='["Scratch", "Dent", "Crack", "Contamination", "Other", "OK"]')
    confidence_threshold = Column(Float, default=0.50)
    iou_threshold = Column(Float, default=0.45)
    status = Column(String, default="Active") # Active, Staging, Archived
    precision = Column(Float, default=98.4)
    recall = Column(Float, default=96.8)
    map50 = Column(Float, default=97.5)
    latency_ms = Column(Float, default=12.4)
    fps = Column(Float, default=60.0)
    size_mb = Column(Float, default=14.2)
    created_at = Column(DateTime, default=datetime.utcnow)

class InspectionSession(Base):
    __tablename__ = "inspection_sessions"

    id = Column(String, primary_key=True, index=True)
    session_name = Column(String, nullable=False)
    camera_id = Column(String, default="CAM-01")
    production_line_id = Column(String, ForeignKey("production_lines.id"), default="Line A")
    model_id = Column(String, ForeignKey("models.id"), default="yolov8-ind-v1.0")
    status = Column(String, default="Active") # Active, Paused, Stopped
    started_at = Column(DateTime, default=datetime.utcnow)
    ended_at = Column(DateTime, nullable=True)

class Inspection(Base):
    __tablename__ = "inspections"

    id = Column(String, primary_key=True, index=True)
    session_id = Column(String, ForeignKey("inspection_sessions.id"), nullable=True)
    source_type = Column(String, default="live") # live, image, video
    image_path = Column(String, nullable=True)
    annotated_image_path = Column(String, nullable=True)
    production_line_id = Column(String, default="Line A")
    inspected_at = Column(DateTime, default=datetime.utcnow, index=True)
    processing_time_ms = Column(Float, default=14.2)
    total_objects = Column(Integer, default=1)
    defect_count = Column(Integer, default=0)
    status = Column(String, default="OK") # OK, DEFECT, WARNING
    
    detections = relationship("Detection", back_populates="inspection", cascade="all, delete-orphan")

class Detection(Base):
    __tablename__ = "detections"

    id = Column(String, primary_key=True, index=True)
    inspection_id = Column(String, ForeignKey("inspections.id"), index=True)
    class_name = Column(String, nullable=False) # Scratch, Dent, Crack, Contamination, Other, OK
    confidence = Column(Float, nullable=False) # 0.0 to 1.0 or %
    x1 = Column(Float, nullable=False)
    y1 = Column(Float, nullable=False)
    x2 = Column(Float, nullable=False)
    y2 = Column(Float, nullable=False)
    crop_path = Column(String, nullable=True)
    severity = Column(String, default="Critical") # Critical, Warning, Acceptable
    frame_timestamp = Column(String, nullable=True)
    production_line_id = Column(String, default="Line A")
    created_at = Column(DateTime, default=datetime.utcnow, index=True)

    inspection = relationship("Inspection", back_populates="detections")

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_name = Column(String, default="Admin User")
    action = Column(String, nullable=False)
    entity_type = Column(String, nullable=False)
    entity_id = Column(String, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
