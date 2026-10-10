import os
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.config import settings
from app.models.db_models import Detection

router = APIRouter()

@router.get("/detections")
def get_recent_detections(limit: int = 20, line_id: str = None, db: Session = Depends(get_db)):
    query = db.query(Detection)
    if line_id:
        query = query.filter(Detection.production_line_id == line_id)
    records = query.order_by(Detection.created_at.desc()).limit(limit).all()
    
    result = []
    for r in records:
        result.append({
            "id": r.id,
            "inspection_id": r.inspection_id,
            "class_name": r.class_name,
            "confidence": r.confidence,
            "bbox": [r.x1, r.y1, r.x2, r.y2],
            "crop_url": r.crop_path,
            "severity": r.severity,
            "timestamp": r.frame_timestamp or r.created_at.strftime("%H:%M:%S"),
            "production_line_id": r.production_line_id,
            "date": r.created_at.strftime("%Y-%m-%d")
        })
    return result

@router.get("/detections/{detection_id}")
def get_detection_by_id(detection_id: str, db: Session = Depends(get_db)):
    r = db.query(Detection).filter(Detection.id == detection_id).first()
    if not r:
        raise HTTPException(status_code=404, detail="Detection not found")
    return {
        "id": r.id,
        "inspection_id": r.inspection_id,
        "class_name": r.class_name,
        "confidence": r.confidence,
        "bbox": [r.x1, r.y1, r.x2, r.y2],
        "crop_url": r.crop_path,
        "severity": r.severity,
        "timestamp": r.frame_timestamp or r.created_at.strftime("%H:%M:%S"),
        "production_line_id": r.production_line_id
    }

@router.get("/detections/crop/{filename}")
def serve_crop_file(filename: str):
    path = os.path.join(settings.CROPS_DIR, filename)
    if os.path.exists(path):
        return FileResponse(path)
    # Fallback default image if crop path is external URL or not cached on disk
    raise HTTPException(status_code=404, detail="Crop file not found")
