import os
import uuid
import time
import base64
import cv2
import numpy as np
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.config import settings
from app.inference.yolo_detector import detector
from app.models.db_models import InspectionSession, Inspection, Detection, ProductionLine
from app.websocket.ws_manager import ws_manager

router = APIRouter()

# Global state for inspection session
current_session = {
    "is_running": True,
    "is_paused": False,
    "line_id": "Line A",
    "camera_id": "CAM-01",
    "fps": 29.8,
    "total_inspected": 14280,
    "defects_found": 342
}

@router.get("/inspection/status")
def get_inspection_status():
    return {
        "status": "Inspecting" if current_session["is_running"] and not current_session["is_paused"] else ("Paused" if current_session["is_paused"] else "Stopped"),
        "is_running": current_session["is_running"],
        "is_paused": current_session["is_paused"],
        "line_id": current_session["line_id"],
        "camera_id": current_session["camera_id"],
        "fps": current_session["fps"]
    }

@router.post("/inspection/start")
async def start_inspection(line_id: str = "Line A", camera_id: str = "CAM-01"):
    current_session["is_running"] = True
    current_session["is_paused"] = False
    current_session["line_id"] = line_id
    current_session["camera_id"] = camera_id
    await ws_manager.broadcast({
        "event": "inspection.started",
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
        "line_id": line_id,
        "camera_id": camera_id
    })
    return {"status": "started", "line_id": line_id, "camera_id": camera_id}

@router.post("/inspection/stop")
async def stop_inspection():
    current_session["is_running"] = False
    current_session["is_paused"] = False
    await ws_manager.broadcast({
        "event": "inspection.stopped",
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
    })
    return {"status": "stopped"}

@router.post("/inspection/pause")
async def pause_inspection():
    current_session["is_paused"] = not current_session["is_paused"]
    status_str = "paused" if current_session["is_paused"] else "resumed"
    await ws_manager.broadcast({
        "event": f"inspection.{status_str}",
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
    })
    return {"status": status_str}

@router.post("/inspection/frame")
async def process_frame(
    data: dict,
    db: Session = Depends(get_db)
):
    """Processes base64 frame sent from browser camera or stream client"""
    image_b64 = data.get("image_base64", "")
    line_id = data.get("line_id", current_session["line_id"])
    conf_thresh = float(data.get("confidence_threshold", 0.45))

    if not image_b64:
        raise HTTPException(status_code=400, detail="Missing frame payload")

    # Decode base64
    try:
        header, encoded = image_b64.split(",", 1) if "," in image_b64 else ("", image_b64)
        img_bytes = base64.b64decode(encoded)
        nparr = np.frombuffer(img_bytes, np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid image encoding: {e}")

    # Run YOLO Inference
    annotated_frame, detections, latency_ms = detector.predict_frame(frame, conf_threshold=conf_thresh, line_id=line_id)

    # Convert annotated frame back to base64 for fast display
    _, buffer = cv2.imencode(".jpg", annotated_frame)
    annotated_b64 = base64.b64encode(buffer).decode("utf-8")

    # Save to database if defects exist
    insp_id = f"INSP-{uuid.uuid4().hex[:8].upper()}"
    has_defect = any(d["class_name"] != "OK" for d in detections)
    status_str = "DEFECT" if has_defect else "OK"

    inspection = Inspection(
        id=insp_id,
        source_type="live",
        production_line_id=line_id,
        processing_time_ms=latency_ms,
        total_objects=1,
        defect_count=len(detections) if has_defect else 0,
        status=status_str
    )
    db.add(inspection)
    
    detection_records = []
    for d in detections:
        if d["class_name"] != "OK":
            # Crop image
            crop = detector.extract_crop(frame, d["bbox"])
            crop_filename = f"crop_{uuid.uuid4().hex[:8]}.jpg"
            crop_path = os.path.join(settings.CROPS_DIR, crop_filename)
            cv2.imwrite(crop_path, crop)

            det_rec = Detection(
                id=d["id"],
                inspection_id=insp_id,
                class_name=d["class_name"],
                confidence=d["confidence"],
                x1=d["bbox"][0],
                y1=d["bbox"][1],
                x2=d["bbox"][2],
                y2=d["bbox"][3],
                crop_path=f"/api/detections/crop/{crop_filename}",
                severity=d["severity"],
                frame_timestamp=d["frame_timestamp"],
                production_line_id=line_id
            )
            db.add(det_rec)
            detection_records.append({
                "id": d["id"],
                "class_name": d["class_name"],
                "confidence": d["confidence"],
                "crop_url": f"/api/detections/crop/{crop_filename}",
                "severity": d["severity"],
                "timestamp": d["frame_timestamp"],
                "production_line_id": line_id
            })

    db.commit()

    # Update line counters
    line = db.query(ProductionLine).filter(ProductionLine.id == line_id).first()
    if line:
        line.total_inspected_today += 1
        if has_defect:
            line.defect_count_today += len(detections)
        db.commit()

    response_payload = {
        "inspection_id": insp_id,
        "annotated_frame": f"data:image/jpeg;base64,{annotated_b64}",
        "detections": detections,
        "latency_ms": latency_ms,
        "status": status_str,
        "fps": round(1000.0 / max(latency_ms, 1), 1)
    }

    # Broadcast websocket update
    if has_defect:
        await ws_manager.broadcast({
            "event": "detection.created",
            "inspection_id": insp_id,
            "production_line": line_id,
            "detections": detection_records,
            "latency_ms": latency_ms
        })

    return response_payload

@router.post("/inspection/image")
async def inspect_uploaded_image(
    file: UploadFile = File(...),
    line_id: str = Form("Line A"),
    conf_threshold: float = Form(0.45),
    db: Session = Depends(get_db)
):
    """Single static image upload inspection endpoint"""
    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)
    frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    if frame is None:
        raise HTTPException(status_code=400, detail="Could not read uploaded image file")

    annotated_frame, detections, latency_ms = detector.predict_frame(frame, conf_threshold=conf_threshold, line_id=line_id)

    # Save original & annotated image
    filename_base = f"img_{uuid.uuid4().hex[:8]}"
    orig_path = os.path.join(settings.UPLOADS_DIR, f"{filename_base}.jpg")
    annotated_path = os.path.join(settings.ANNOTATED_DIR, f"{filename_base}_annotated.jpg")

    cv2.imwrite(orig_path, frame)
    cv2.imwrite(annotated_path, annotated_frame)

    insp_id = f"INSP-IMG-{uuid.uuid4().hex[:8].upper()}"
    has_defect = any(d["class_name"] != "OK" for d in detections)
    status_str = "DEFECT" if has_defect else "OK"

    inspection = Inspection(
        id=insp_id,
        source_type="image",
        image_path=f"/api/inspection/file/{filename_base}.jpg",
        annotated_image_path=f"/api/inspection/file/{filename_base}_annotated.jpg",
        production_line_id=line_id,
        processing_time_ms=latency_ms,
        total_objects=len(detections),
        defect_count=len(detections) if has_defect else 0,
        status=status_str
    )
    db.add(inspection)
    
    crops = []
    for d in detections:
        crop = detector.extract_crop(frame, d["bbox"])
        crop_name = f"crop_{uuid.uuid4().hex[:8]}.jpg"
        crop_path = os.path.join(settings.CROPS_DIR, crop_name)
        cv2.imwrite(crop_path, crop)

        det_rec = Detection(
            id=d["id"],
            inspection_id=insp_id,
            class_name=d["class_name"],
            confidence=d["confidence"],
            x1=d["bbox"][0],
            y1=d["bbox"][1],
            x2=d["bbox"][2],
            y2=d["bbox"][3],
            crop_path=f"/api/detections/crop/{crop_name}",
            severity=d["severity"],
            frame_timestamp=time.strftime("%H:%M:%S"),
            production_line_id=line_id
        )
        db.add(det_rec)
        crops.append({
            "id": d["id"],
            "class_name": d["class_name"],
            "confidence": d["confidence"],
            "bbox": d["bbox"],
            "severity": d["severity"],
            "crop_url": f"/api/detections/crop/{crop_name}"
        })

    db.commit()

    # Convert annotated image to base64
    _, buffer = cv2.imencode(".jpg", annotated_frame)
    annotated_b64 = base64.b64encode(buffer).decode("utf-8")

    return {
        "id": insp_id,
        "annotated_image_url": f"data:image/jpeg;base64,{annotated_b64}",
        "detections": crops,
        "processing_time_ms": latency_ms,
        "defect_count": len(crops) if has_defect else 0,
        "status": status_str,
        "filename": file.filename
    }
