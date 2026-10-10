from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
from app.services.groq_service import groq_service

router = APIRouter()

class DefectDiagnoseRequest(BaseModel):
    class_name: str
    severity: str = "Warning"
    production_line: str = "Line A"
    confidence: float = 0.85
    context: Optional[str] = ""

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]

class QualityReportRequest(BaseModel):
    analytics_data: dict

@router.get("/ai/status")
def get_ai_status():
    """Checks connection status to Groq API"""
    return groq_service.check_connection()

@router.post("/ai/diagnose")
def diagnose_defect(req: DefectDiagnoseRequest):
    """Generates Groq AI diagnostic and root cause analysis for a specific defect"""
    res = groq_service.diagnose_defect(
        class_name=req.class_name,
        severity=req.severity,
        production_line=req.production_line,
        confidence=req.confidence,
        context=req.context
    )
    if not res.get("success"):
        raise HTTPException(status_code=500, detail=res.get("error", "AI diagnostic generation failed"))
    return res

@router.post("/ai/report")
def generate_quality_report(req: QualityReportRequest):
    """Generates an executive quality report via Groq LLM"""
    res = groq_service.generate_quality_report(req.analytics_data)
    if not res.get("success"):
        raise HTTPException(status_code=500, detail=res.get("error", "AI report generation failed"))
    return res

@router.post("/ai/chat")
def ai_chat(req: ChatRequest):
    """Interactive chat with VisionGuard AI Assistant powered by Groq LLM"""
    formatted_messages = [{"role": m.role, "content": m.content} for m in req.messages]
    res = groq_service.chat(formatted_messages)
    if not res.get("success"):
        raise HTTPException(status_code=500, detail=res.get("error", "AI chat response failed"))
    return res
