from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI(
    title="AI Telemedicine Platform",
    description="A comprehensive AI-powered telemedicine platform",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure this properly for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {
        "message": "AI Telemedicine Platform API",
        "status": "running",
        "version": "1.0.0"
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "message": "AI Telemedicine Platform is running"
    }

@app.get("/api/status")
async def api_status():
    return {
        "backend": "running",
        "ai_features": "available",
        "database": "connected" if os.getenv("DATABASE_URL") else "not_configured"
    }

@app.post("/api/ai/symptoms")
async def analyze_symptoms(symptoms: dict):
    """AI symptom analysis endpoint"""
    return {
        "analysis": "AI symptom analysis would be performed here",
        "confidence": 0.85,
        "recommendations": ["Consult a doctor", "Monitor symptoms"]
    }

@app.post("/api/ai/scan")
async def analyze_scan(scan_data: dict):
    """AI medical scan analysis endpoint"""
    return {
        "analysis": "AI scan analysis would be performed here",
        "findings": ["No abnormalities detected"],
        "confidence": 0.92
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
