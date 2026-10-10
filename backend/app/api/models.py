import json
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.db_models import AIModel

router = APIRouter()

@router.get("/models")
def get_models(db: Session = Depends(get_db)):
    models = db.query(AIModel).order_by(AIModel.created_at.desc()).all()
    res = []
    for m in models:
        try:
            cls_list = json.loads(m.class_names)
        except:
            cls_list = ["Scratch", "Dent", "Crack", "Contamination", "Other", "OK"]

        res.append({
            "id": m.id,
            "name": m.name,
            "version": m.version,
            "weights_path": m.weights_path,
            "class_names": cls_list,
            "confidence_threshold": m.confidence_threshold,
            "iou_threshold": m.iou_threshold,
            "status": m.status,
            "precision": m.precision,
            "recall": m.recall,
            "map50": m.map50,
            "latency_ms": m.latency_ms,
            "fps": m.fps,
            "size_mb": m.size_mb,
            "created_at": m.created_at.strftime("%Y-%m-%d")
        })
    return res

@router.post("/models/{model_id}/activate")
def activate_model(model_id: str, db: Session = Depends(get_db)):
    target = db.query(AIModel).filter(AIModel.id == model_id).first()
    if not target:
        raise HTTPException(status_code=404, detail="Model not found")

    # Set all other models to Staging
    db.query(AIModel).update({"status": "Staging"})
    target.status = "Active"
    db.commit()

    return {"status": "activated", "active_model_id": model_id, "name": target.name}

@router.post("/models")
def register_model(
    name: str = Form(...),
    version: str = Form(...),
    weights_path: str = Form("models/yolov8_custom.pt"),
    confidence_threshold: float = Form(0.50),
    db: Session = Depends(get_db)
):
    model_id = f"model-{version.replace('.', '_')}"
    new_model = AIModel(
        id=model_id,
        name=name,
        version=version,
        weights_path=weights_path,
        class_names='["Scratch", "Dent", "Crack", "Contamination", "Other", "OK"]',
        confidence_threshold=confidence_threshold,
        status="Staging",
        precision=98.5,
        recall=97.0,
        map50=97.8,
        latency_ms=13.5,
        fps=55.0,
        size_mb=16.8
    )
    db.add(new_model)
    db.commit()
    return {"status": "registered", "model_id": model_id}
