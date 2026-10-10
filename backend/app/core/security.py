import hashlib
from datetime import datetime, timedelta
from typing import Optional

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode('utf-8')).hexdigest()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return hash_password(plain_password) == hashed_password

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    # Lightweight token creation without external dependencies if needed
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(hours=24))
    to_encode.update({"exp": int(expire.timestamp())})
    # Return string representations for simplicity
    import json, base64
    payload_str = json.dumps(to_encode)
    encoded = base64.b64encode(payload_str.encode()).decode()
    return f"vg_token_{encoded}"
