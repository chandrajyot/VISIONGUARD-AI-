from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.db_models import Product

router = APIRouter()

@router.get("/products")
def get_products(db: Session = Depends(get_db)):
    products = db.query(Product).all()
    res = []
    for p in products:
        res.append({
            "id": p.id,
            "name": p.name,
            "sku": p.sku,
            "description": p.description,
            "defect_tolerance": p.defect_tolerance,
            "target_fps": p.target_fps
        })
    return res

@router.post("/products")
def create_product(data: dict, db: Session = Depends(get_db)):
    prod = Product(
        name=data.get("name"),
        sku=data.get("sku"),
        description=data.get("description", ""),
        defect_tolerance=float(data.get("defect_tolerance", 1.5)),
        target_fps=int(data.get("target_fps", 30))
    )
    db.add(prod)
    db.commit()
    return {"status": "created", "sku": prod.sku}
