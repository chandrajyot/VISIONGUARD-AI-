# 🛡️ VisionGuard AI

> **Next-Generation Automated Visual Quality Inspection System powered by YOLOv8, FastAPI, React & Groq LLM.**

![VisionGuard AI Banner](frontend/src/assets/hero.png)

VisionGuard AI is a high-performance, real-time industrial visual inspection platform designed for smart manufacturing, quality assurance, and automated defect detection. It combines real-time computer vision inference (YOLOv8) with an LLM-powered Quality Assistant (Groq) and a sleek, responsive monitoring dashboard.

---

## 🌟 Key Features

- **⚡ Real-Time Live Inspection Stream**: Low-latency video stream processing with live object detection, bounding-box annotations, defect classification, and real-time WebSocket telemetry.
- **📸 Multi-Modal Media Inspection**: Analyze static industrial images and recorded video feeds with frame-by-frame defect extraction, bounding box rendering, and automated file storage.
- **🤖 Groq-Powered AI Quality Assistant**: Integrated LLM chat assistant offering real-time root-cause analysis, defect mitigation recommendations, and quality report generation.
- **📊 Interactive Analytics & KPI Dashboard**: Comprehensive metrics covering First-Pass Yield (FPY), Defect Distribution by Category, Throughput Rates, and Historical Quality Trends.
- **🏷️ Model Registry & Threshold Management**: Seamlessly switch active YOLOv8 model weights, configure confidence thresholds, and track inference latency performance.
- **🏭 Production Line & Product Management**: Map inspection streams to specific factory lines, product types, and assign operator access.
- **👥 Role-Based Access Control (RBAC)**: Fine-grained permissions tailored for Administrators, Quality Engineers, and Plant Operators.

---

## 🏗️ System Architecture

```
                       ┌─────────────────────────────────────┐
                       │          React + Vite + TS          │
                       │         Tailwind CSS Dashboard      │
                       └──────────────────┬──────────────────┘
                                          │
                             REST API & WebSockets (WS)
                                          │
                       ┌──────────────────▼──────────────────┐
                       │           FastAPI Backend           │
                       └──────────┬─────────────────┬────────┘
                                  │                 │
              ┌───────────────────▼──┐           ┌──▼───────────────────┐
              │  YOLOv8 Vision Engine│           │  Groq LLM Service    │
              │  (Ultralytics/OpenCV)│           │ (Quality Insights)   │
              └──────────────────────┘           └──────────────────────┘
```

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Lucide React Icons
- **Data Visualization**: Recharts
- **Networking**: Axios, WebSockets

### **Backend**
- **Framework**: FastAPI (Python 3.10+)
- **Computer Vision**: Ultralytics YOLOv8, OpenCV, PyTorch
- **AI / LLM**: Groq API (GPT-OSS / Llama 3 models)
- **Database & ORM**: SQLite, SQLAlchemy, Pydantic
- **Server**: Uvicorn, WebSockets

---

## 🚀 Getting Started

### Prerequisites
- **Python**: 3.10+ installed
- **Node.js**: 18.x+ installed
- **Git**

---

### 1. Clone the Repository
```bash
git clone https://github.com/chandrajyot/VISIONGUARD-AI-.git
cd VISIONGUARD-AI-
```

---

### 2. Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Create a virtual environment**:
   ```bash
   python -m venv venv
   # On Windows:
   .\venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Environment Configuration**:
   Create a `.env` file in the `backend/` directory (or copy from `.env.example`):
   ```env
   GROQ_API_KEY=your_groq_api_key_here
   GROQ_MODEL=openai/gpt-oss-20b
   ```

5. **Start the FastAPI Server**:
   ```bash
   python run.py
   ```
   *The server will run at `http://localhost:8000` with Swagger docs available at `http://localhost:8000/docs`.*

---

### 3. Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd ../frontend
   ```

2. **Install Node packages**:
   ```bash
   npm install
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```
   *The dashboard will be available at `http://localhost:5173`.*

---

## 📂 Project Structure

```
VISIONGUARD-AI-/
├── backend/
│   ├── app/
│   │   ├── api/             # REST API Endpoints (Analytics, Detections, AI Assistant, etc.)
│   │   ├── core/            # Database config, Security, Environment settings
│   │   ├── inference/       # YOLOv8 Object Detection Pipeline & Models
│   │   ├── models/          # SQLAlchemy ORM Models
│   │   ├── schemas/         # Pydantic Schemas
│   │   ├── services/        # Groq LLM integration & DB seeders
│   │   └── websocket/       # Real-time WebSocket connection manager
│   ├── storage/             # Stored image uploads & annotated outputs
│   ├── weights/             # YOLOv8 model weights (.pt files)
│   ├── requirements.txt
│   └── run.py
│
├── frontend/
│   ├── src/
│   │   ├── assets/          # Static branding & images
│   │   ├── components/      # Reusable UI components & Dashboard cards
│   │   ├── pages/           # Live Stream, Image/Video Inspection, Analytics pages
│   │   ├── services/        # API service clients
│   │   └── types/           # TypeScript interface definitions
│   ├── package.json
│   └── vite.config.ts
│
└── README.md
```

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.
