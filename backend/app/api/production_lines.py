from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.db_models import ProductionLine

router = APIRouter()

@router.get("/production-lines")
def get_production_lines(db: Session = Depends(get_db)):
    lines = db.query(ProductionLine).all()
    res = []
    for l in lines:
        res.append({
            "id": l.id,
            "name": l.name,
            "location": l.location,
            "status": l.status,
            "camera_id": l.camera_id,
            "product_sku": l.product_sku,
            "defect_count_today": l.defect_count_today,
            "total_inspected_today": l.total_inspected_today
        })
    return res

@router.post("/production-lines")
def create_production_line(data: dict, db: Session = Depends(get_db)):
    line_id = data.get("id", f"Line {data.get('name', 'X')}")
    line = ProductionLine(
        id=line_id,
        name=data.get("name", "New Production Line"),
        location=data.get("location", "Factory Bay 1"),
        status=data.get("status", "Operational"),
        camera_id=data.get("camera_id", "CAM-01"),
        product_sku=data.get("product_sku", "SKU-DEF-101")
    )
    db.add(line)
    db.commit()
    return {"status": "created", "id": line_id}
