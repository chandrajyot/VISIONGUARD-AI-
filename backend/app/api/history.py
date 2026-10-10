from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import Optional
from app.core.database import get_db
from app.models.db_models import Inspection

router = APIRouter()

@router.get("/history")
def get_inspection_history(
    line_id: Optional[str] = None,
    status: Optional[str] = None,
    source_type: Optional[str] = None,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    query = db.query(Inspection)
    if line_id:
        query = query.filter(Inspection.production_line_id == line_id)
    if status and status != "All":
        query = query.filter(Inspection.status == status)
    if source_type:
        query = query.filter(Inspection.source_type == source_type)

    inspections = query.order_by(Inspection.inspected_at.desc()).limit(limit).all()

    items = []
    for insp in inspections:
        items.append({
            "id": insp.id,
            "source_type": insp.source_type,
            "production_line_id": insp.production_line_id,
            "inspected_at": insp.inspected_at.strftime("%Y-%m-%d %H:%M:%S"),
            "processing_time_ms": insp.processing_time_ms,
            "defect_count": insp.defect_count,
            "status": insp.status,
            "image_url": insp.image_path,
            "annotated_image_url": insp.annotated_image_path
        })
    return items
