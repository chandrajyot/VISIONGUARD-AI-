from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.db_models import User
from app.core.security import hash_password

router = APIRouter()

@router.get("/users")
def get_users(db: Session = Depends(get_db)):
    users = db.query(User).all()
    res = []
    for u in users:
        res.append({
            "id": u.id,
            "name": u.name,
            "email": u.email,
            "role": u.role,
            "status": u.status,
            "avatar": u.avatar,
            "created_at": u.created_at.strftime("%Y-%m-%d")
        })
    return res

@router.post("/users")
def create_user(data: dict, db: Session = Depends(get_db)):
    user = User(
        name=data.get("name"),
        email=data.get("email"),
        password_hash=hash_password(data.get("password", "password123")),
        role=data.get("role", "Inspector"),
        status=data.get("status", "Active"),
        avatar=data.get("avatar", "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150")
    )
    db.add(user)
    db.commit()
    return {"status": "created", "id": user.id}
