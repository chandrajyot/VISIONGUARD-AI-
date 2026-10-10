import uuid
from datetime import datetime, timedelta
import random
from sqlalchemy.orm import Session
from app.models.db_models import User, AIModel, ProductionLine, Product, InspectionSession, Inspection, Detection, AuditLog
from app.core.security import hash_password

def seed_database(db: Session):
    # 1. Users
    if db.query(User).count() == 0:
        users = [
            User(name="Admin User", email="admin@visionguard.ai", password_hash=hash_password("admin123"), role="Admin", status="Active", avatar="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"),
            User(name="Marcus Chen", email="marcus@visionguard.ai", password_hash=hash_password("password"), role="Lead Inspector", status="Active", avatar="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"),
            User(name="Sarah Jenkins", email="sarah@visionguard.ai", password_hash=hash_password("password"), role="Quality Engineer", status="Active", avatar="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"),
            User(name="David Vance", email="david@visionguard.ai", password_hash=hash_password("password"), role="Technician", status="Active", avatar="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150")
        ]
        db.add_all(users)
        db.commit()

    # 2. Production Lines
    if db.query(ProductionLine).count() == 0:
        lines = [
            ProductionLine(id="Line A", name="Automotive Sheet Stamping Line A", location="Factory West - Bay 4", status="Operational", camera_id="CAM-01", product_sku="MET-STAMP-882", defect_count_today=342, total_inspected_today=14280),
            ProductionLine(id="Line B", name="Precision PCB Assembly Line B", location="Cleanroom South - Bay 2", status="Operational", camera_id="CAM-02", product_sku="PCB-MAIN-901", defect_count_today=118, total_inspected_today=9840),
            ProductionLine(id="Line C", name="Composite Panel Finishing Line C", location="Factory East - Bay 1", status="Maintenance", camera_id="CAM-03", product_sku="PANEL-COMP-404", defect_count_today=54, total_inspected_today=4200)
        ]
        db.add_all(lines)
        db.commit()

    # 3. Products
    if db.query(Product).count() == 0:
        products = [
            Product(id=1, name="Stamped Steel Door Panel", sku="MET-STAMP-882", description="High-precision automotive outer door panel sheet", defect_tolerance=1.2, target_fps=60),
            Product(id=2, name="Main Logic Circuit Board", sku="PCB-MAIN-901", description="Dual-layer industrial controller motherboard", defect_tolerance=0.8, target_fps=30),
            Product(id=3, name="Carbon Composite Wing Panel", sku="PANEL-COMP-404", description="Aerospace grade carbon fiber composite structural skin", defect_tolerance=0.5, target_fps=60)
        ]
        db.add_all(products)
        db.commit()

    # 4. Models
    if db.query(AIModel).count() == 0:
        models = [
            AIModel(
                id="yolov8-ind-v1.0",
                name="YOLOv8 Industrial Inspection",
                version="v1.0",
                weights_path="models/yolov8n.pt",
                class_names='["Scratch", "Dent", "Crack", "Contamination", "Other", "OK"]',
                confidence_threshold=0.50,
                iou_threshold=0.45,
                status="Active",
                precision=98.4,
                recall=96.8,
                map50=97.5,
                latency_ms=12.4,
                fps=60.0,
                size_mb=14.2
            ),
            AIModel(
                id="yolov8-heavy-v2.1",
                name="YOLOv8 Heavy Surface Defect Model",
                version="v2.1",
                weights_path="models/yolov8s_heavy.pt",
                class_names='["Scratch", "Dent", "Crack", "Contamination", "Other", "OK"]',
                confidence_threshold=0.60,
                iou_threshold=0.40,
                status="Staging",
                precision=99.1,
                recall=97.4,
                map50=98.2,
                latency_ms=18.6,
                fps=45.0,
                size_mb=28.5
            )
        ]
        db.add_all(models)
        db.commit()

    # 5. Inspection History & Detections
    if db.query(Inspection).count() == 0:
        now = datetime.utcnow()
        classes = ["Scratch", "Dent", "Crack", "Contamination", "Other"]
        severities = {"Crack": "Critical", "Dent": "Critical", "Scratch": "Warning", "Contamination": "Warning", "Other": "Warning"}
        
        # Sample defect thumbnails (high quality placeholder URLs matching industrial metal/pcb defects)
        sample_thumbs = {
            "Scratch": "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=300",
            "Dent": "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=300",
            "Crack": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300",
            "Contamination": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300",
            "Other": "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=300"
        }

        inspections = []
        all_detections = []

        # Create 50 historical inspections over the last 24 hours
        for i in range(50):
            insp_id = f"INSP-{1000 + i}"
            mins_ago = random.randint(1, 1440)
            insp_time = now - timedelta(minutes=mins_ago)
            has_defect = random.random() < 0.35 # 35% defect rate in sample feed
            
            status = "DEFECT" if has_defect else "OK"
            defect_cnt = random.choice([1, 2, 3]) if has_defect else 0

            insp = Inspection(
                id=insp_id,
                session_id="SESS-001",
                source_type="live",
                production_line_id=random.choice(["Line A", "Line B", "Line C"]),
                inspected_at=insp_time,
                processing_time_ms=round(random.uniform(10.5, 15.8), 1),
                total_objects=1,
                defect_count=defect_cnt,
                status=status
            )
            inspections.append(insp)

            if has_defect:
                for d in range(defect_cnt):
                    cls_name = random.choice(classes)
                    conf = round(random.uniform(84.5, 98.9), 1)
                    det = Detection(
                        id=f"DET-{uuid.uuid4().hex[:8].upper()}",
                        inspection_id=insp_id,
                        class_name=cls_name,
                        confidence=conf,
                        x1=round(random.uniform(50, 200), 1),
                        y1=round(random.uniform(50, 200), 1),
                        x2=round(random.uniform(250, 450), 1),
                        y2=round(random.uniform(250, 450), 1),
                        crop_path=sample_thumbs[cls_name],
                        severity=severities.get(cls_name, "Critical"),
                        frame_timestamp=insp_time.strftime("%H:%M:%S"),
                        production_line_id=insp.production_line_id,
                        created_at=insp_time
                    )
                    all_detections.append(det)

        db.add_all(inspections)
        db.commit()
        db.add_all(all_detections)
        db.commit()

        # Audit logs
        logs = [
            AuditLog(user_name="Admin User", action="Activated Model", entity_type="AIModel", entity_id="yolov8-ind-v1.0", timestamp=now - timedelta(hours=5)),
            AuditLog(user_name="Marcus Chen", action="Started Inspection Session", entity_type="InspectionSession", entity_id="SESS-001", timestamp=now - timedelta(hours=8)),
            AuditLog(user_name="Sarah Jenkins", action="Updated Line Thresholds", entity_type="ProductionLine", entity_id="Line A", timestamp=now - timedelta(hours=12))
        ]
        db.add_all(logs)
        db.commit()
