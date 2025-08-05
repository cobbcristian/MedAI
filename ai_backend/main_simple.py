from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import os
import uuid
import base64
from datetime import datetime
from typing import Optional, Dict, Any, List
import json

app = FastAPI(
    title="AI Telemedicine Analysis API",
    description="AI-powered medical scan analysis, bloodwork parsing, and recovery prediction",
    version="1.0.0"
)

# CORS middleware for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for deployment
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {
        "message": "AI Telemedicine Analysis API", 
        "status": "running",
        "features": [
            "Bloodwork Analysis with Cancer Risk Assessment",
            "X-ray AI Analysis with Doctor Notes", 
            "Medication Tracking and Life Impact Analysis",
            "Vaccination Records and Missing Vaccines",
            "Surgical Procedure Guides for Doctors"
        ]
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

@app.get("/test")
async def test_endpoint():
    return {
        "message": "Test endpoint working", 
        "features": [
            "Bloodwork Analysis with Cancer Risk Assessment",
            "X-ray AI Analysis with Doctor Notes",
            "Medication Tracking and Life Impact Analysis", 
            "Vaccination Records and Missing Vaccines",
            "Surgical Procedure Guides for Doctors"
        ]
    }

@app.post("/analyze/bloodwork/enhanced")
async def analyze_bloodwork_enhanced(
    file: UploadFile = File(...),
    patient_id: Optional[str] = Form(None),
    patient_age: Optional[int] = Form(50),
    patient_gender: Optional[str] = Form("unknown")
):
    """
    Enhanced bloodwork analysis with cancer risk and life expectancy assessment
    """
    try:
        # Simulate processing time
        import time
        time.sleep(1)
        
        # Mock analysis results
        analysis_result = {
            "lab_values": [
                {
                    "name": "Hemoglobin",
                    "value": 14.2,
                    "unit": "g/dL",
                    "reference_range": "13.5-17.5",
                    "status": "normal",
                    "significance": "Normal hemoglobin levels"
                },
                {
                    "name": "White Blood Cell Count",
                    "value": 11.5,
                    "unit": "K/μL",
                    "reference_range": "4.5-11.0",
                    "status": "high",
                    "significance": "Elevated WBC count may indicate infection"
                }
            ],
            "abnormalities": ["Elevated WBC count"],
            "recommendations": [
                "Monitor for signs of infection",
                "Consider follow-up CBC in 2 weeks",
                "Review recent medical history"
            ],
            "urgency_level": "medium",
            "suggested_tests": ["CBC with differential", "CRP", "ESR"],
            "cancer_risk": {
                "risk_level": "low",
                "probability": 0.05,
                "factors": ["Age", "Normal hemoglobin"],
                "recommendations": ["Continue routine screening"]
            },
            "life_expectancy": {
                "current_estimate": 78,
                "factors_affecting": ["Good overall health", "Normal hemoglobin"],
                "interventions": ["Regular exercise", "Balanced diet"],
                "confidence": 0.85
            },
            "interventions": ["Monitor WBC", "Regular checkups"],
            "medications": ["None recommended at this time"],
            "processing_time": 1.2
        }
        
        return {
            "success": True,
            "file_id": str(uuid.uuid4()),
            "analysis": analysis_result,
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/medical-records/medication-analysis")
async def analyze_medication_history(
    medication_data: str = Form(...),
    patient_id: Optional[str] = Form(None)
):
    """
    Analyze medication history and provide recommendations
    """
    try:
        # Mock medication analysis
        analysis_result = {
            "medications": [
                {
                    "medication_name": "Lisinopril",
                    "dosage": "10mg daily",
                    "start_date": "2023-01-15",
                    "reason": "Hypertension management",
                    "effectiveness": "Good blood pressure control",
                    "side_effects": ["Dry cough", "Dizziness"],
                    "ai_recommendation": "Continue current dosage",
                    "life_impact": "Positive - reduces cardiovascular risk",
                    "dosage_recommendation": "maintain",
                    "long_term_effects": ["Reduced stroke risk", "Kidney protection"]
                }
            ],
            "overall_assessment": "Medication regimen appears appropriate",
            "recommendations": [
                "Continue current medications",
                "Monitor blood pressure regularly",
                "Report any new side effects"
            ]
        }
        
        return {
            "success": True,
            "analysis": analysis_result,
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/medical-records/vaccination-analysis")
async def analyze_vaccination_records(
    vaccination_data: str = Form(...),
    patient_age: int = Form(...),
    patient_conditions: Optional[str] = Form(None)
):
    """
    Analyze vaccination records and identify missing vaccines
    """
    try:
        # Mock vaccination analysis
        analysis_result = {
            "completed_vaccinations": [
                {
                    "name": "COVID-19",
                    "date": "2023-03-15",
                    "type": "mRNA",
                    "reaction": "Mild arm soreness",
                    "ai_analysis": "Good immune response",
                    "risk_if_missed": "High risk of severe COVID",
                    "risk_if_taken": "Minimal risk"
                }
            ],
            "missing_vaccinations": [
                {
                    "name": "Influenza",
                    "recommended_age": "Annual",
                    "risk_level": "medium",
                    "ai_analysis": "Recommended for all adults",
                    "urgency": "Schedule within 30 days"
                }
            ],
            "recommendations": [
                "Get annual flu shot",
                "Consider pneumococcal vaccine",
                "Stay up to date with COVID boosters"
            ]
        }
        
        return {
            "success": True,
            "analysis": analysis_result,
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/medical-records/surgical-guide/{procedure_name}")
async def get_surgical_procedure_guide(procedure_name: str):
    """
    Get detailed surgical procedure guide
    """
    try:
        # Mock surgical guide
        guide = {
            "name": procedure_name,
            "complexity": "moderate",
            "duration": "2-3 hours",
            "pre_op_steps": [
                {
                    "step_number": 1,
                    "description": "Patient preparation and positioning",
                    "duration": "30 minutes",
                    "critical_points": ["Ensure proper positioning", "Check equipment"],
                    "warnings": ["Verify patient identity", "Check allergies"]
                }
            ],
            "procedure_steps": [
                {
                    "step_number": 1,
                    "description": "Initial incision and exposure",
                    "duration": "45 minutes",
                    "critical_points": ["Maintain sterile field", "Control bleeding"],
                    "warnings": ["Avoid major vessels", "Monitor vital signs"]
                }
            ],
            "post_op_steps": [
                {
                    "step_number": 1,
                    "description": "Wound closure and dressing",
                    "duration": "20 minutes",
                    "critical_points": ["Proper wound closure", "Apply sterile dressing"],
                    "warnings": ["Check for bleeding", "Ensure proper closure"]
                }
            ],
            "complications": ["Bleeding", "Infection", "Anesthesia complications"],
            "success_rate": 0.95
        }
        
        return {
            "success": True,
            "guide": guide,
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/medical-records/surgical-procedures")
async def get_available_surgical_procedures():
    """
    Get list of available surgical procedures
    """
    procedures = [
        "Appendectomy",
        "Cholecystectomy", 
        "Hernia Repair",
        "Cataract Surgery",
        "Knee Arthroscopy",
        "Cardiac Bypass",
        "Hip Replacement"
    ]
    
    return {
        "success": True,
        "procedures": procedures,
        "timestamp": datetime.now().isoformat()
    }

@app.post("/medical-records/comprehensive-analysis")
async def get_comprehensive_medical_analysis(
    patient_id: str = Form(...),
    bloodwork_file: Optional[UploadFile] = File(None),
    medication_data: Optional[str] = Form(None),
    vaccination_data: Optional[str] = Form(None),
    patient_age: Optional[int] = Form(50),
    patient_gender: Optional[str] = Form("unknown"),
    patient_conditions: Optional[str] = Form(None)
):
    """
    Comprehensive medical analysis combining all data sources
    """
    try:
        # Mock comprehensive analysis
        comprehensive_analysis = {
            "patient_id": patient_id,
            "overall_health_score": 85,
            "risk_factors": ["Age", "Family history"],
            "recommendations": [
                "Continue current medications",
                "Get annual physical",
                "Monitor blood pressure",
                "Consider flu shot"
            ],
            "bloodwork_summary": "Most values normal, minor elevation in WBC",
            "medication_summary": "Current regimen appropriate",
            "vaccination_summary": "Most vaccines up to date, missing flu shot",
            "next_appointment": "3 months",
            "urgent_actions": ["Schedule flu shot within 30 days"]
        }
        
        return {
            "success": True,
            "analysis": comprehensive_analysis,
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port) 