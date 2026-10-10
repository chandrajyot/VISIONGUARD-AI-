import requests
import logging
from app.core.config import settings

logger = logging.getLogger("visionguard.groq")

class GroqService:
    def __init__(self):
        self.api_url = "https://api.groq.com/openai/v1/chat/completions"

    def _get_headers(self):
        return {
            "Authorization": f"Bearer {settings.GROQ_API_KEY}",
            "Content-Type": "application/json"
        }

    def check_connection(self) -> dict:
        """Verifies connection to Groq API using configured key and model"""
        try:
            r = requests.get(
                "https://api.groq.com/openai/v1/models",
                headers=self._get_headers(),
                timeout=5
            )
            if r.status_code == 200:
                models_data = r.json().get("data", [])
                model_ids = [m.get("id") for m in models_data]
                return {
                    "status": "connected",
                    "provider": "Groq Cloud API",
                    "active_model": settings.GROQ_MODEL,
                    "available_models": model_ids[:5]
                }
            else:
                return {
                    "status": "error",
                    "detail": f"HTTP {r.status_code}: {r.text}"
                }
        except Exception as e:
            logger.error(f"Groq API connection check failed: {e}")
            return {
                "status": "offline",
                "detail": str(e)
            }

    def diagnose_defect(self, class_name: str, severity: str, production_line: str, confidence: float, context: str = "") -> dict:
        """Generates real-time AI industrial defect diagnostic & mitigation steps via Groq LLM"""
        system_prompt = (
            "You are VisionGuard AI Industrial Quality Copilot, an expert manufacturing engineer and computer vision specialist. "
            "Analyze the detected defect and provide structured diagnostic advice for factory operators and quality personnel. "
            "Keep response concise, highly technical, and actionable."
        )

        user_prompt = f"""Defect Alert Details:
- Defect Classification: {class_name}
- Severity Level: {severity}
- Production Line: {production_line}
- Detection Confidence: {confidence * 100:.1f}%
- Additional Context: {context if context else 'Standard inline inspection'}

Please respond in JSON format with the following keys:
1. "root_cause_hypothesis": Brief explanation of what physical/mechanical process likely caused this defect.
2. "severity_assessment": Short evaluation of risk to product integrity or machine safety.
3. "immediate_action": Step-by-step immediate action for shop-floor operators.
4. "preventative_recommendation": Calibration or maintenance recommendation for engineering team.
"""

        try:
            payload = {
                "model": settings.GROQ_MODEL,
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                "temperature": 0.2,
                "max_tokens": 600
            }

            r = requests.post(self.api_url, headers=self._get_headers(), json=payload, timeout=12)
            if r.status_code == 200:
                content = r.json()["choices"][0]["message"]["content"]
                return {
                    "success": True,
                    "model": settings.GROQ_MODEL,
                    "raw_response": content
                }
            else:
                logger.error(f"Groq API Error {r.status_code}: {r.text}")
                return {
                    "success": False,
                    "error": f"Groq API returned HTTP {r.status_code}: {r.text}"
                }
        except Exception as e:
            logger.error(f"Groq service call failed: {e}")
            return {
                "success": False,
                "error": str(e)
            }

    def generate_quality_report(self, analytics_data: dict) -> dict:
        """Generates an executive quality summary and recommendations from inspection analytics data"""
        system_prompt = (
            "You are the Lead Quality Assurance AI Specialist for VisionGuard AI. "
            "Generate a high-level executive report based on shop floor analytics."
        )

        user_prompt = f"""Inspection Analytics Data:
{analytics_data}

Please generate an executive summary containing:
1. Executive Overview of Yield & Quality Performance
2. Top Risk Factors & Bottlenecks Identified
3. Recommended Action Plan for Quality Engineers
"""

        try:
            payload = {
                "model": settings.GROQ_MODEL,
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                "temperature": 0.3,
                "max_tokens": 700
            }

            r = requests.post(self.api_url, headers=self._get_headers(), json=payload, timeout=15)
            if r.status_code == 200:
                content = r.json()["choices"][0]["message"]["content"]
                return {
                    "success": True,
                    "model": settings.GROQ_MODEL,
                    "report": content
                }
            else:
                return {"success": False, "error": f"HTTP {r.status_code}: {r.text}"}
        except Exception as e:
            return {"success": False, "error": str(e)}

    def chat(self, messages: list) -> dict:
        """Interactive chat copilot endpoint powered by Groq"""
        system_prompt = {
            "role": "system",
            "content": (
                "You are VisionGuard AI Industrial Assistant. You specialize in computer vision quality inspection, "
                "YOLOv8 defect detection, industrial automation, conveyer monitoring, and quality control optimization. "
                "Provide helpful, concise, and technical responses."
            )
        }

        full_messages = [system_prompt] + messages

        try:
            payload = {
                "model": settings.GROQ_MODEL,
                "messages": full_messages,
                "temperature": 0.5,
                "max_tokens": 800
            }

            r = requests.post(self.api_url, headers=self._get_headers(), json=payload, timeout=15)
            if r.status_code == 200:
                answer = r.json()["choices"][0]["message"]["content"]
                return {
                    "success": True,
                    "model": settings.GROQ_MODEL,
                    "message": answer
                }
            else:
                return {"success": False, "error": f"Groq Error {r.status_code}: {r.text}"}
        except Exception as e:
            return {"success": False, "error": str(e)}

groq_service = GroqService()
