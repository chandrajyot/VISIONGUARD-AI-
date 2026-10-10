import os
from pydantic import BaseModel
from dotenv import load_dotenv

# Load environment variables from .env file if available
dotenv_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), ".env")
if os.path.exists(dotenv_path):
    load_dotenv(dotenv_path)

class Settings(BaseModel):
    APP_NAME: str = "VisionGuard AI"
    VERSION: str = "1.4.2"
    API_PREFIX: str = "/api"
    SECRET_KEY: str = "visionguard-secret-key-industrial-ai-2026"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24
    
    BASE_DIR: str = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    STORAGE_DIR: str = os.path.join(BASE_DIR, "storage")
    UPLOADS_DIR: str = os.path.join(STORAGE_DIR, "uploads")
    ANNOTATED_DIR: str = os.path.join(STORAGE_DIR, "annotated")
    CROPS_DIR: str = os.path.join(STORAGE_DIR, "crops")
    WEIGHTS_DIR: str = os.path.join(BASE_DIR, "weights")
    
    DATABASE_URL: str = f"sqlite:///{os.path.join(BASE_DIR, 'visionguard.db')}"
    
    DEFAULT_CONF_THRESHOLD: float = 0.50
    DEFAULT_IOU_THRESHOLD: float = 0.45
    
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    GROQ_MODEL: str = os.getenv("GROQ_MODEL", "openai/gpt-oss-20b")
    
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "*"
    ]

settings = Settings()

# Ensure directories exist
for folder in [settings.STORAGE_DIR, settings.UPLOADS_DIR, settings.ANNOTATED_DIR, settings.CROPS_DIR, settings.WEIGHTS_DIR]:
    os.makedirs(folder, exist_ok=True)
