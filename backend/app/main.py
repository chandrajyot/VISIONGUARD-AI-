import os
import time
import asyncio
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import Base, engine, SessionLocal, get_db
from app.services.seed_data import seed_database
from app.websocket.ws_manager import ws_manager

from app.api import system, inspection, analytics, history, detections, models, production_lines, products, users, ai_assistant

# Initialize Database tables and Seed data
Base.metadata.create_all(bind=engine)
db = SessionLocal()
try:
    seed_database(db)
finally:
    db.close()

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.VERSION,
    openapi_url="/api/openapi.json"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Static Folders for Cropped Images and Annotated Outputs
app.mount("/storage", StaticFiles(directory=settings.STORAGE_DIR), name="storage")

# Include REST Routers
app.include_router(system.router, prefix=settings.API_PREFIX, tags=["System"])
app.include_router(ai_assistant.router, prefix=settings.API_PREFIX, tags=["AI Assistant"])
app.include_router(inspection.router, prefix=settings.API_PREFIX, tags=["Inspection"])
app.include_router(analytics.router, prefix=settings.API_PREFIX, tags=["Analytics"])
app.include_router(history.router, prefix=settings.API_PREFIX, tags=["History"])
app.include_router(detections.router, prefix=settings.API_PREFIX, tags=["Detections"])
app.include_router(models.router, prefix=settings.API_PREFIX, tags=["Models"])
app.include_router(production_lines.router, prefix=settings.API_PREFIX, tags=["Production Lines"])
app.include_router(products.router, prefix=settings.API_PREFIX, tags=["Products"])
app.include_router(users.router, prefix=settings.API_PREFIX, tags=["Users"])

@app.websocket("/ws/inspection")
async def websocket_inspection_endpoint(websocket: WebSocket):
    await ws_manager.connect(websocket)
    try:
        # Keep connection open and send heartbeats / metrics
        while True:
            data = await websocket.receive_text()
            # ECHO / Handle Client WebSocket messages
            await websocket.send_json({"event": "ack", "received": data})
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket)
    except Exception as e:
        ws_manager.disconnect(websocket)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
