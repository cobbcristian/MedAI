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
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

from services.scan_analysis import ScanAnalysisService
from services.bloodwork_analysis import BloodworkAnalysisService
from services.recovery_prediction import RecoveryPredictionService
from services.feedback_service import FeedbackService
from services.multimodal_diagnosis import MultimodalDiagnosisService
from services.symptom_timeline import SymptomTimelineService
from services.doctor_copilot import DoctorCopilotService, NoteContext
from services.bias_fairness_dashboard import BiasFairnessDashboardService
from services.advanced_ai_features import AdvancedAIFeaturesService
from services.security_compliance import SecurityComplianceService
from services.ai_training_sandbox import ai_training_sandbox
from services.model_comparison_dashboard import model_comparison_dashboard
from services.patient_feedback_loop import patient_feedback_manager
from services.model_explainer import explain_diagnosis, get_model_information
from services.offline_sync_queue import get_sync_status, queue_appointment, force_sync_now
from services.smartcard_generator import SmartcardGenerator
from services.continuous_learning import continuous_learning_service
from services.medication_tracking import MedicationTrackingService
from services.vaccination_tracking import VaccinationTrackingService
from services.surgical_guide import SurgicalGuideService
from utils.file_handler import FileHandler
from models.response_models import (
    ScanAnalysisResponse,
    BloodworkAnalysisResponse,
    RecoveryPredictionResponse,
    FeedbackResponse,
    EnhancedBloodworkAnalysis,
    EnhancedMedicalRecord
)

app = FastAPI(
    title="MedAI Healthcare Platform API",
    description="MedAI - AI-powered medical scan analysis, bloodwork parsing, recovery prediction, and comprehensive healthcare services",
    version="2.0.0"
)

# CORS middleware for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
scan_service = ScanAnalysisService()
bloodwork_service = BloodworkAnalysisService()
recovery_service = RecoveryPredictionService()
feedback_service = FeedbackService()
multimodal_service = MultimodalDiagnosisService()
symptom_timeline_service = SymptomTimelineService()
doctor_copilot_service = DoctorCopilotService()
bias_fairness_service = BiasFairnessDashboardService()
advanced_ai_service = AdvancedAIFeaturesService()
security_compliance_service = SecurityComplianceService()
medication_tracking_service = MedicationTrackingService()
vaccination_tracking_service = VaccinationTrackingService()
surgical_guide_service = SurgicalGuideService()
file_handler = FileHandler()
smartcard_generator = SmartcardGenerator()
continuous_learning = continuous_learning_service

# Create uploads directory if it doesn't exist
os.makedirs("uploads", exist_ok=True)

@app.get("/")
async def root():
    return {"message": "MedAI Healthcare Platform API", "status": "running", "version": "2.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

@app.post("/analyze/scan", response_model=ScanAnalysisResponse)
async def analyze_medical_scan(
    file: UploadFile = File(...),
    patient_id: Optional[str] = Form(None),
    scan_type: Optional[str] = Form(None)
):
    """
    Analyze medical scans (MRI, CT, X-ray, Ultrasound)
    Supports: DICOM, PNG, JPG formats
    """
    try:
        # Validate file type
        allowed_types = ["image/dicom", "image/png", "image/jpeg", "image/jpg"]
        if file.content_type not in allowed_types:
            raise HTTPException(
                status_code=400, 
                detail=f"Unsupported file type. Allowed: {allowed_types}"
            )
        
        # Save file temporarily
        file_id = str(uuid.uuid4())
        file_path = await file_handler.save_upload(file, file_id)
        
        # Analyze scan
        result = await scan_service.analyze_scan(file_path, scan_type)
        
        # Clean up temporary file
        file_handler.cleanup_file(file_path)
        
        return ScanAnalysisResponse(
            success=True,
            file_id=file_id,
            analysis=result,
            timestamp=datetime.now().isoformat()
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze/bloodwork", response_model=BloodworkAnalysisResponse)
async def analyze_bloodwork(
    file: UploadFile = File(...),
    patient_id: Optional[str] = Form(None)
):
    """
    Analyze bloodwork and lab reports
    Supports: PDF, CSV formats
    """
    try:
        # Validate file type
        allowed_types = ["application/pdf", "text/csv"]
        if file.content_type not in allowed_types:
            raise HTTPException(
                status_code=400, 
                detail=f"Unsupported file type. Allowed: {allowed_types}"
            )
        
        # Save file temporarily
        file_id = str(uuid.uuid4())
        file_path = await file_handler.save_upload(file, file_id)
        
        # Analyze bloodwork
        result = await bloodwork_service.analyze_bloodwork(file_path)
        
        # Clean up temporary file
        file_handler.cleanup_file(file_path)
        
        return BloodworkAnalysisResponse(
            success=True,
            file_id=file_id,
            analysis=result,
            timestamp=datetime.now().isoformat()
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/predict/recovery", response_model=RecoveryPredictionResponse)
async def predict_recovery(
    symptoms: str = Form(...),
    diagnosis: str = Form(...),
    scan_analysis: Optional[str] = Form(None),
    bloodwork_analysis: Optional[str] = Form(None),
    patient_age: Optional[int] = Form(None),
    patient_gender: Optional[str] = Form(None),
    visit_frequency: Optional[int] = Form(1)
):
    """
    Predict recovery time and complication risk
    """
    try:
        # Parse optional JSON inputs
        scan_data = json.loads(scan_analysis) if scan_analysis else None
        bloodwork_data = json.loads(bloodwork_analysis) if bloodwork_analysis else None
        
        result = await recovery_service.predict_recovery(
            symptoms=symptoms,
            diagnosis=diagnosis,
            scan_analysis=scan_data,
            bloodwork_analysis=bloodwork_data,
            patient_age=patient_age,
            patient_gender=patient_gender,
            visit_frequency=visit_frequency
        )
        
        return RecoveryPredictionResponse(
            success=True,
            prediction=result,
            timestamp=datetime.now().isoformat()
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/feedback", response_model=FeedbackResponse)
async def submit_feedback(
    analysis_id: str = Form(...),
    feedback_type: str = Form(...),  # "approve", "reject", "modify"
    doctor_id: str = Form(...),
    patient_id: str = Form(...),
    comments: Optional[str] = Form(None),
    modified_diagnosis: Optional[str] = Form(None)
):
    """
    Submit doctor feedback on AI suggestions
    """
    try:
        result = await feedback_service.submit_feedback(
            analysis_id=analysis_id,
            feedback_type=feedback_type,
            doctor_id=doctor_id,
            patient_id=patient_id,
            comments=comments,
            modified_diagnosis=modified_diagnosis
        )
        
        return FeedbackResponse(
            success=True,
            feedback_id=result["feedback_id"],
            message="Feedback submitted successfully",
            timestamp=datetime.now().isoformat()
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/models/status")
async def get_model_status():
    """
    Get status of loaded ML models
    """
    try:
        status = {
            "scan_model": await scan_service.get_model_status(),
            "bloodwork_model": await bloodwork_service.get_model_status(),
            "recovery_model": await recovery_service.get_model_status(),
            "multimodal_model": await multimodal_service.get_model_status(),
            "symptom_timeline_model": await symptom_timeline_service.get_model_status(),
            "doctor_copilot_model": await doctor_copilot_service.get_model_status(),
            "bias_fairness_model": await bias_fairness_service.get_model_status(),
            "advanced_ai_model": await advanced_ai_service.get_model_status(),
            "security_compliance_model": await security_compliance_service.get_model_status()
        }
        return status
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Multimodal Diagnosis API
@app.post("/diagnose/multimodal")
async def analyze_multimodal_diagnosis(
    symptoms: str = Form(...),
    patient_demographics: str = Form(...),  # JSON string
    medical_history: Optional[str] = Form(None),
    lab_data: Optional[str] = Form(None),  # JSON string
    images: Optional[List[UploadFile]] = File(None)
):
    """
    Perform multimodal diagnosis combining symptoms, images, and lab data
    """
    try:
        # Parse JSON inputs
        demographics = json.loads(patient_demographics)
        lab_data_dict = json.loads(lab_data) if lab_data else None
        
        # Process images if provided
        image_data = []
        if images:
            for image in images:
                file_path = await file_handler.save_upload(image, str(uuid.uuid4()))
                with open(file_path, 'rb') as f:
                    image_bytes = f.read()
                image_data.append({
                    "image_data": base64.b64encode(image_bytes).decode(),
                    "image_type": image.content_type,
                    "metadata": {"filename": image.filename}
                })
                file_handler.cleanup_file(file_path)
        
        result = await multimodal_service.analyze_multimodal(
            symptoms=symptoms,
            images=image_data if image_data else None,
            lab_data=lab_data_dict,
            patient_demographics=demographics,
            medical_history=medical_history
        )
        
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Symptom Timeline API
@app.post("/symptoms/track")
async def track_symptom_event(
    patient_id: str = Form(...),
    symptom: str = Form(...),
    severity: float = Form(...),
    timestamp: Optional[str] = Form(None),
    duration_hours: Optional[float] = Form(None),
    triggers: Optional[str] = Form(None),  # JSON string
    medications: Optional[str] = Form(None),  # JSON string
    notes: Optional[str] = Form(None),
    location: Optional[str] = Form(None),
    associated_symptoms: Optional[str] = Form(None)  # JSON string
):
    """
    Track a new symptom event
    """
    try:
        # Parse optional JSON inputs
        triggers_list = json.loads(triggers) if triggers else None
        medications_list = json.loads(medications) if medications else None
        associated_symptoms_list = json.loads(associated_symptoms) if associated_symptoms else None
        
        # Parse timestamp
        event_timestamp = datetime.fromisoformat(timestamp) if timestamp else None
        
        result = await symptom_timeline_service.track_symptom_event(
            patient_id=patient_id,
            symptom=symptom,
            severity=severity,
            timestamp=event_timestamp,
            duration_hours=duration_hours,
            triggers=triggers_list,
            medications=medications_list,
            notes=notes,
            location=location,
            associated_symptoms=associated_symptoms_list
        )
        
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/symptoms/timeline/{patient_id}")
async def get_symptom_timeline(
    patient_id: str,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    symptoms: Optional[str] = None  # JSON string
):
    """
    Get symptom timeline with visualization
    """
    try:
        # Parse optional parameters
        start_dt = datetime.fromisoformat(start_date) if start_date else None
        end_dt = datetime.fromisoformat(end_date) if end_date else None
        symptoms_list = json.loads(symptoms) if symptoms else None
        
        result = await symptom_timeline_service.get_symptom_timeline(
            patient_id=patient_id,
            start_date=start_dt,
            end_date=end_dt,
            symptoms=symptoms_list
        )
        
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/symptoms/analyze-progression")
async def analyze_chronic_illness_progression(
    patient_id: str = Form(...),
    condition: str = Form(...),
    months_back: int = Form(6)
):
    """
    Analyze progression of chronic illness symptoms
    """
    try:
        result = await symptom_timeline_service.analyze_chronic_illness_progression(
            patient_id=patient_id,
            condition=condition,
            months_back=months_back
        )
        
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/symptoms/detect-patterns")
async def detect_symptom_patterns(
    patient_id: str = Form(...),
    time_window_days: int = Form(90)
):
    """
    Detect patterns in symptom occurrence and severity
    """
    try:
        result = await symptom_timeline_service.detect_symptom_patterns(
            patient_id=patient_id,
            time_window_days=time_window_days
        )
        
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Doctor Copilot API
@app.post("/copilot/generate-soap")
async def generate_soap_note(
    context: str = Form(...),  # JSON string
    doctor_notes: Optional[str] = Form(None),
    style_preference: str = Form("comprehensive")
):
    """
    Generate structured SOAP note from doctor's free text and patient data
    """
    try:
        # Parse context
        context_data = json.loads(context)
        note_context = NoteContext(**context_data)
        
        result = await doctor_copilot_service.generate_soap_note(
            context=note_context,
            doctor_notes=doctor_notes,
            style_preference=style_preference
        )
        
        return {
            "suggestion_type": result.suggestion_type,
            "content": result.content,
            "confidence": result.confidence,
            "reasoning": result.reasoning,
            "alternatives": result.alternatives,
            "references": result.references
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/copilot/suggest-labs")
async def suggest_lab_tests(
    context: str = Form(...),  # JSON string
    suspected_conditions: Optional[str] = Form(None)  # JSON string
):
    """
    Suggest relevant laboratory tests based on symptoms and clinical context
    """
    try:
        # Parse inputs
        context_data = json.loads(context)
        note_context = NoteContext(**context_data)
        suspected_conditions_list = json.loads(suspected_conditions) if suspected_conditions else None
        
        result = await doctor_copilot_service.suggest_lab_tests(
            context=note_context,
            suspected_conditions=suspected_conditions_list
        )
        
        return {
            "suggestion_type": result.suggestion_type,
            "content": result.content,
            "confidence": result.confidence,
            "reasoning": result.reasoning,
            "alternatives": result.alternatives,
            "references": result.references
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/copilot/suggest-diagnosis")
async def suggest_diagnosis(
    context: str = Form(...),  # JSON string
    include_differential: bool = Form(True),
    include_confidence: bool = Form(True)
):
    """
    Suggest primary diagnosis and differential diagnoses
    """
    try:
        # Parse context
        context_data = json.loads(context)
        note_context = NoteContext(**context_data)
        
        result = await doctor_copilot_service.suggest_diagnosis(
            context=note_context,
            include_differential=include_differential,
            include_confidence=include_confidence
        )
        
        return {
            "suggestion_type": result.suggestion_type,
            "content": result.content,
            "confidence": result.confidence,
            "reasoning": result.reasoning,
            "alternatives": result.alternatives,
            "references": result.references
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/copilot/explain-diagnosis")
async def explain_diagnosis_to_patient(
    diagnosis: str = Form(...),
    context: str = Form(...),  # JSON string
    education_level: str = Form("high_school"),
    language: str = Form("English")
):
    """
    Generate patient-friendly explanation of diagnosis
    """
    try:
        # Parse context
        context_data = json.loads(context)
        note_context = NoteContext(**context_data)
        
        result = await doctor_copilot_service.explain_diagnosis_to_patient(
            diagnosis=diagnosis,
            context=note_context,
            education_level=education_level,
            language=language
        )
        
        return {
            "suggestion_type": result.suggestion_type,
            "content": result.content,
            "confidence": result.confidence,
            "reasoning": result.reasoning,
            "alternatives": result.alternatives,
            "references": result.references
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/copilot/suggest-followup")
async def suggest_follow_up_plan(
    context: str = Form(...),  # JSON string
    diagnosis: str = Form(...),
    treatment_initiated: Optional[str] = Form(None)  # JSON string
):
    """
    Suggest follow-up plan and monitoring recommendations
    """
    try:
        # Parse inputs
        context_data = json.loads(context)
        note_context = NoteContext(**context_data)
        treatment_list = json.loads(treatment_initiated) if treatment_initiated else None
        
        result = await doctor_copilot_service.suggest_follow_up_plan(
            context=note_context,
            diagnosis=diagnosis,
            treatment_initiated=treatment_list
        )
        
        return {
            "suggestion_type": result.suggestion_type,
            "content": result.content,
            "confidence": result.confidence,
            "reasoning": result.reasoning,
            "alternatives": result.alternatives,
            "references": result.references
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/copilot/summarize-visit")
async def summarize_visit(
    context: str = Form(...),  # JSON string
    doctor_notes: str = Form(...),
    summary_type: str = Form("comprehensive")
):
    """
    Summarize the patient visit for documentation
    """
    try:
        # Parse context
        context_data = json.loads(context)
        note_context = NoteContext(**context_data)
        
        result = await doctor_copilot_service.summarize_visit(
            context=note_context,
            doctor_notes=doctor_notes,
            summary_type=summary_type
        )
        
        return {
            "suggestion_type": result.suggestion_type,
            "content": result.content,
            "confidence": result.confidence,
            "reasoning": result.reasoning,
            "alternatives": result.alternatives,
            "references": result.references
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/copilot/suggest-cpt-codes")
async def suggest_cpt_codes(
    context: str = Form(...),  # JSON string
    procedures_performed: Optional[str] = Form(None),  # JSON string
    visit_complexity: str = Form("moderate")
):
    """
    Suggest appropriate CPT codes for billing
    """
    try:
        # Parse inputs
        context_data = json.loads(context)
        note_context = NoteContext(**context_data)
        procedures_list = json.loads(procedures_performed) if procedures_performed else None
        
        result = await doctor_copilot_service.suggest_cpt_codes(
            context=note_context,
            procedures_performed=procedures_list,
            visit_complexity=visit_complexity
        )
        
        return {
            "suggestion_type": result.suggestion_type,
            "content": result.content,
            "confidence": result.confidence,
            "reasoning": result.reasoning,
            "alternatives": result.alternatives,
            "references": result.references
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Bias & Fairness Dashboard API
@app.post("/bias/analyze")
async def analyze_model_bias(
    predictions: str = Form(...),  # JSON string
    ground_truth: str = Form(...),  # JSON string
    demographics: str = Form(...),  # JSON string
    model_version: Optional[str] = Form(None)
):
    """
    Analyze bias in model predictions across demographic groups
    """
    try:
        # Parse JSON inputs
        predictions_list = json.loads(predictions)
        ground_truth_list = json.loads(ground_truth)
        demographics_list = json.loads(demographics)
        
        result = await bias_fairness_service.analyze_model_bias(
            predictions=predictions_list,
            ground_truth=ground_truth_list,
            demographics=demographics_list,
            model_version=model_version
        )
        
        return {
            "report_id": result.report_id,
            "analysis_date": result.analysis_date.isoformat(),
            "model_version": result.model_version,
            "demographic_groups": result.demographic_groups,
            "bias_metrics": [
                {
                    "metric_name": m.metric_name,
                    "demographic_group": m.demographic_group,
                    "value": m.value,
                    "confidence_interval": m.confidence_interval,
                    "sample_size": m.sample_size,
                    "timestamp": m.timestamp.isoformat(),
                    "model_version": m.model_version
                }
                for m in result.bias_metrics
            ],
            "fairness_score": result.fairness_score,
            "recommendations": result.recommendations,
            "status": result.status
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/bias/dashboard")
async def generate_bias_dashboard(
    bias_reports: str = Form(...),  # JSON string
    time_range_days: int = Form(30)
):
    """
    Generate bias dashboard with visualizations
    """
    try:
        # Parse bias reports
        reports_data = json.loads(bias_reports)
        
        # Convert to FairnessReport objects
        from services.bias_fairness_dashboard import FairnessReport, BiasMetric
        
        reports = []
        for report_data in reports_data:
            bias_metrics = []
            for metric_data in report_data.get("bias_metrics", []):
                metric = BiasMetric(
                    metric_name=metric_data["metric_name"],
                    demographic_group=metric_data["demographic_group"],
                    value=metric_data["value"],
                    confidence_interval=tuple(metric_data["confidence_interval"]),
                    sample_size=metric_data["sample_size"],
                    timestamp=datetime.fromisoformat(metric_data["timestamp"]),
                    model_version=metric_data["model_version"]
                )
                bias_metrics.append(metric)
            
            report = FairnessReport(
                report_id=report_data["report_id"],
                analysis_date=datetime.fromisoformat(report_data["analysis_date"]),
                model_version=report_data["model_version"],
                demographic_groups=report_data["demographic_groups"],
                bias_metrics=bias_metrics,
                fairness_score=report_data["fairness_score"],
                recommendations=report_data["recommendations"],
                status=report_data["status"]
            )
            reports.append(report)
        
        result = await bias_fairness_service.generate_bias_dashboard(
            bias_reports=reports,
            time_range_days=time_range_days
        )
        
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Advanced AI Features API
@app.post("/ai/voice-emotion")
async def analyze_voice_emotion(
    audio_file: UploadFile = File(...),
    patient_id: str = Form(...),
    context: Optional[str] = Form(None)
):
    """
    Analyze voice emotion for stress, pain, and mental health indicators
    """
    try:
        # Validate audio file
        if not audio_file.content_type.startswith('audio/'):
            raise HTTPException(status_code=400, detail="Invalid audio file type")
        
        # Read audio data
        audio_data = await audio_file.read()
        
        result = await advanced_ai_service.analyze_voice_emotion(
            audio_data=audio_data,
            patient_id=patient_id,
            context=context
        )
        
        return {
            "emotion": result.emotion,
            "confidence": result.confidence,
            "stress_level": result.stress_level,
            "pain_indicator": result.pain_indicator,
            "mental_health_risk": result.mental_health_risk,
            "timestamp": result.timestamp.isoformat(),
            "audio_features": result.audio_features
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/ai/predict-progression")
async def predict_disease_progression(
    patient_data: str = Form(...),  # JSON string
    condition: str = Form(...),
    time_horizon_days: int = Form(365)
):
    """
    Predict disease progression and outcomes
    """
    try:
        # Parse patient data
        patient_data_dict = json.loads(patient_data)
        
        result = await advanced_ai_service.predict_disease_progression(
            patient_data=patient_data_dict,
            condition=condition,
            time_horizon_days=time_horizon_days
        )
        
        return {
            "prediction_type": result.prediction_type,
            "predicted_value": result.predicted_value,
            "confidence": result.confidence,
            "risk_factors": result.risk_factors,
            "recommendations": result.recommendations,
            "timeline": result.timeline
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/ai/predict-readmission")
async def predict_readmission_risk(
    patient_data: str = Form(...),  # JSON string
    discharge_diagnosis: str = Form(...)
):
    """
    Predict readmission risk within 30 days
    """
    try:
        # Parse patient data
        patient_data_dict = json.loads(patient_data)
        
        result = await advanced_ai_service.predict_readmission_risk(
            patient_data=patient_data_dict,
            discharge_diagnosis=discharge_diagnosis
        )
        
        return {
            "prediction_type": result.prediction_type,
            "predicted_value": result.predicted_value,
            "confidence": result.confidence,
            "risk_factors": result.risk_factors,
            "recommendations": result.recommendations,
            "timeline": result.timeline
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/ai/predict-treatment-response")
async def predict_treatment_response(
    patient_data: str = Form(...),  # JSON string
    treatment_plan: str = Form(...),
    condition: str = Form(...)
):
    """
    Predict treatment response and effectiveness
    """
    try:
        # Parse patient data
        patient_data_dict = json.loads(patient_data)
        
        result = await advanced_ai_service.predict_treatment_response(
            patient_data=patient_data_dict,
            treatment_plan=treatment_plan,
            condition=condition
        )
        
        return {
            "prediction_type": result.prediction_type,
            "predicted_value": result.predicted_value,
            "confidence": result.confidence,
            "risk_factors": result.risk_factors,
            "recommendations": result.recommendations,
            "timeline": result.timeline
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/ai/clinical-decision-support")
async def advanced_clinical_decision_support(
    patient_data: str = Form(...),  # JSON string
    symptoms: str = Form(...),  # JSON string
    lab_results: Optional[str] = Form(None),  # JSON string
    imaging_results: Optional[str] = Form(None)  # JSON string
):
    """
    Advanced clinical decision support with evidence-based recommendations
    """
    try:
        # Parse inputs
        patient_data_dict = json.loads(patient_data)
        symptoms_list = json.loads(symptoms)
        lab_results_dict = json.loads(lab_results) if lab_results else None
        imaging_results_dict = json.loads(imaging_results) if imaging_results else None
        
        result = await advanced_ai_service.advanced_clinical_decision_support(
            patient_data=patient_data_dict,
            symptoms=symptoms_list,
            lab_results=lab_results_dict,
            imaging_results=imaging_results_dict
        )
        
        return {
            "primary_diagnosis": result.primary_diagnosis,
            "differential_diagnoses": result.differential_diagnoses,
            "treatment_recommendations": result.treatment_recommendations,
            "risk_assessment": result.risk_assessment,
            "evidence_level": result.evidence_level,
            "clinical_guidelines": result.clinical_guidelines
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Security & Compliance API
@app.post("/security/encrypt-phi")
async def encrypt_phi(
    data: str = Form(...)
):
    """
    Encrypt Protected Health Information (PHI)
    """
    try:
        encrypted_data = await security_compliance_service.encrypt_phi(data)
        return {"encrypted_data": encrypted_data}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/security/decrypt-phi")
async def decrypt_phi(
    encrypted_data: str = Form(...)
):
    """
    Decrypt Protected Health Information (PHI)
    """
    try:
        decrypted_data = await security_compliance_service.decrypt_phi(encrypted_data)
        return {"decrypted_data": decrypted_data}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/security/audit-log")
async def log_audit_event(
    user_id: str = Form(...),
    action: str = Form(...),
    resource_type: str = Form(...),
    resource_id: str = Form(...),
    ip_address: str = Form(...),
    user_agent: str = Form(...),
    success: bool = Form(...),
    details: Optional[str] = Form(None)  # JSON string
):
    """
    Log audit event for compliance
    """
    try:
        details_dict = json.loads(details) if details else None
        
        audit_id = await security_compliance_service.log_audit_event(
            user_id=user_id,
            action=action,
            resource_type=resource_type,
            resource_id=resource_id,
            ip_address=ip_address,
            user_agent=user_agent,
            success=success,
            details=details_dict
        )
        
        return {"audit_id": audit_id}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/security/check-permission")
async def check_access_permission(
    user_id: str = Form(...),
    user_role: str = Form(...),
    action: str = Form(...),
    resource_type: str = Form(...),
    resource_id: str = Form(...)
):
    """
    Check if user has permission to perform action on resource
    """
    try:
        has_permission = await security_compliance_service.check_access_permission(
            user_id=user_id,
            user_role=user_role,
            action=action,
            resource_type=resource_type,
            resource_id=resource_id
        )
        
        return {"has_permission": has_permission}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/security/compliance-report")
async def generate_compliance_report(
    report_type: str = Form(...),
    period_start: str = Form(...),  # ISO format
    period_end: str = Form(...)  # ISO format
):
    """
    Generate compliance report for regulatory requirements
    """
    try:
        start_dt = datetime.fromisoformat(period_start)
        end_dt = datetime.fromisoformat(period_end)
        
        report = await security_compliance_service.generate_compliance_report(
            report_type=report_type,
            period_start=start_dt,
            period_end=end_dt
        )
        
        return {
            "report_type": report.report_type,
            "period_start": report.period_start.isoformat(),
            "period_end": report.period_end.isoformat(),
            "total_events": report.total_events,
            "security_events": report.security_events,
            "compliance_score": report.compliance_score,
            "violations": report.violations,
            "recommendations": report.recommendations
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/security/anonymize-data")
async def anonymize_patient_data(
    patient_data: str = Form(...),  # JSON string
    anonymization_level: str = Form("standard")
):
    """
    Anonymize patient data for research or external use
    """
    try:
        patient_data_dict = json.loads(patient_data)
        
        anonymized_data = await security_compliance_service.anonymize_patient_data(
            patient_data=patient_data_dict,
            anonymization_level=anonymization_level
        )
        
        return {"anonymized_data": anonymized_data}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/security/hipaa-compliance")
async def validate_hipaa_compliance():
    """
    Validate HIPAA compliance requirements
    """
    try:
        compliance_status = await security_compliance_service.validate_hipaa_compliance()
        return compliance_status
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/security/data-retention")
async def generate_data_retention_report():
    """
    Generate data retention report for compliance
    """
    try:
        report = await security_compliance_service.generate_data_retention_report()
        return report
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# AI Training Sandbox Endpoints
@app.post("/ai-training/upload-dataset")
async def upload_dataset(
    clinic_id: str = Form(...),
    dataset_name: str = Form(...),
    target_column: str = Form(...),
    description: str = Form(...),
    data_file: UploadFile = File(...)
):
    """
    Upload anonymized dataset for AI training
    """
    try:
        form_data = {
            'clinic_id': clinic_id,
            'dataset_name': dataset_name,
            'target_column': target_column,
            'description': description,
            'data_file': data_file
        }
        
        result = await ai_training_sandbox.upload_dataset(
            clinic_id, dataset_name, form_data
        )
        return JSONResponse(content=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/ai-training/start-training")
async def start_training(training_data: dict):
    """
    Start custom model training
    """
    try:
        result = await ai_training_sandbox.start_training(
            training_data['clinic_id'],
            training_data['dataset_name'],
            training_data['config']
        )
        return JSONResponse(content=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/ai-training/datasets/{clinic_id}")
async def get_datasets(clinic_id: str):
    """
    Get datasets for a clinic
    """
    try:
        datasets = await ai_training_sandbox.get_datasets(clinic_id)
        return JSONResponse(content=datasets)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/ai-training/trainings/{clinic_id}")
async def get_trainings(clinic_id: str):
    """
    Get training history for a clinic
    """
    try:
        trainings = await ai_training_sandbox.get_trainings(clinic_id)
        return JSONResponse(content=trainings)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Model Comparison Dashboard Endpoints
@app.get("/model-comparison/available-models")
async def get_available_models():
    """
    Get list of available models for comparison
    """
    try:
        models = await model_comparison_dashboard.get_available_models()
        return JSONResponse(content=models)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/model-comparison/compare")
async def compare_models(comparison_data: dict):
    """
    Compare multiple AI models on the same input
    """
    try:
        result = await model_comparison_dashboard.compare_models(
            comparison_data['input_data'],
            comparison_data['model_names']
        )
        return JSONResponse(content=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/model-comparison/doctor-feedback")
async def add_doctor_feedback(feedback_data: dict):
    """
    Add doctor feedback to model comparison
    """
    try:
        result = await model_comparison_dashboard.add_doctor_feedback(
            feedback_data['comparison_id'],
            feedback_data
        )
        return JSONResponse(content=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/model-comparison/history")
async def get_comparison_history(limit: int = 10):
    """
    Get comparison history
    """
    try:
        history = await model_comparison_dashboard.get_comparison_history(limit)
        return JSONResponse(content=history)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Patient Feedback Loop Endpoints
@app.get("/patient-feedback/ai-outputs/{patient_id}")
async def get_ai_outputs(patient_id: str):
    """
    Get AI outputs for patient feedback
    """
    try:
        outputs = await patient_feedback_manager.get_ai_outputs(patient_id)
        return JSONResponse(content=outputs)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/patient-feedback/submit")
async def submit_patient_feedback(feedback_data: dict):
    """
    Submit patient feedback for AI output
    """
    try:
        result = await patient_feedback_manager.submit_feedback(feedback_data)
        return JSONResponse(content=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/patient-feedback/history/{patient_id}")
async def get_patient_feedback_history(patient_id: str):
    """
    Get patient feedback history
    """
    try:
        history = await patient_feedback_manager.get_patient_feedback_history(patient_id)
        return JSONResponse(content=history)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/patient-feedback/trust-metrics/{patient_id}")
async def get_trust_metrics(patient_id: str):
    """
    Get trust metrics for patient
    """
    try:
        metrics = await patient_feedback_manager.get_trust_metrics(patient_id)
        return JSONResponse(content=metrics)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/ai/explain-diagnosis")
async def api_explain_diagnosis(patient_data: dict, explanation_type: str = 'lime'):
    """Explain a diagnosis for patient data using LIME/SHAP/OpenAI"""
    try:
        result = await model_explainer.explain_prediction(patient_data, explanation_type)
        return {
            "plain_language_explanation": result.plain_language_explanation,
            "confidence_score": result.confidence_score,
            "feature_contributions": result.feature_contributions,
            "confidence_breakdown": result.confidence_breakdown,
            "decision_path": result.decision_path,
            "risk_factors": result.risk_factors,
            "recommendations": result.recommendations,
            "visualization_data": result.visualization_data,
            "timestamp": result.timestamp.isoformat(),
            "model_version": result.model_version,
            "training_data_info": result.training_data_info
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/ai/model-info")
async def api_model_info():
    """Get information about the AI model"""
    return get_model_information()

@app.get("/offline-sync/status")
async def api_offline_sync_status():
    """Get current offline sync status and statistics"""
    return get_sync_status()

@app.post("/offline-sync/queue")
async def api_offline_sync_queue(action: str, data: dict, user_id: str, device_id: str = None):
    """Queue an action for offline sync (e.g., appointment creation)"""
    try:
        item_id = queue_appointment(data, user_id, device_id)
        return {"item_id": item_id, "status": "queued"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/offline-sync/force-sync")
async def api_offline_sync_force():
    """Force immediate synchronization of all pending items"""
    try:
        force_sync_now()
        return {"status": "sync triggered"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/smartcard/generate")
async def api_generate_smartcard(patient_info: dict, vaccine_info: dict, test_info: dict = None):
    """Generate a SMART Health Card (QR code + JSON payload)"""
    try:
        card = smartcard_generator.generate_smartcard(patient_info, vaccine_info, test_info)
        return card
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Continuous Learning Endpoints
@app.get("/continuous-learning/knowledge-base")
async def get_knowledge_base_status():
    """Get knowledge base status and updates"""
    try:
        status = await continuous_learning.get_knowledge_base_status()
        return {"success": True, "knowledge_base": status}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/continuous-learning/model-performance")
async def get_model_performance_status():
    """Get model performance status and drift detection"""
    try:
        status = await continuous_learning.get_model_performance_status()
        return {"success": True, "model_performance": status}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/continuous-learning/automated-actions")
async def get_automated_actions_log(limit: int = 50):
    """Get recent automated learning actions"""
    try:
        actions = await continuous_learning.get_automated_actions_log(limit)
        return {"success": True, "automated_actions": actions}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/continuous-learning/trigger-update")
async def trigger_knowledge_update():
    """Manually trigger knowledge base update"""
    try:
        # This would trigger the update process
        return {"success": True, "message": "Knowledge base update triggered"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/continuous-learning/trigger-retraining")
async def trigger_model_retraining(model_name: Optional[str] = None):
    """Manually trigger model retraining"""
    try:
        # This would trigger model retraining
        return {"success": True, "message": f"Model retraining triggered for {model_name or 'all models'}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={"error": "Internal server error", "detail": str(exc)}
    )

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000) 

@app.post("/analyze/bloodwork/enhanced")
async def analyze_bloodwork_enhanced(
    file: UploadFile = File(...),
    patient_id: Optional[str] = Form(None),
    patient_age: Optional[int] = Form(50),
    patient_gender: Optional[str] = Form("unknown")
):
    """
    Enhanced bloodwork analysis with cancer risk assessment and life expectancy analysis
    """
    try:
        # Validate file type
        allowed_types = ["application/pdf", "text/csv", "application/vnd.ms-excel"]
        if file.content_type not in allowed_types:
            raise HTTPException(
                status_code=400, 
                detail=f"Unsupported file type. Allowed: {allowed_types}"
            )
        
        # Save uploaded file
        file_id = str(uuid.uuid4())
        file_path = f"uploads/{file_id}_{file.filename}"
        
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        # Analyze bloodwork with enhanced features
        analysis = await bloodwork_service.analyze_bloodwork_enhanced(
            file_path, patient_age, patient_gender
        )
        
        # Clean up file
        os.remove(file_path)
        
        return {
            "success": True,
            "file_id": file_id,
            "analysis": analysis.dict(),
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/medical-records/medication-analysis")
async def analyze_medication_history(
    medication_data: str = Form(...),  # JSON string
    patient_id: Optional[str] = Form(None)
):
    """
    Analyze medication history and provide comprehensive assessment
    """
    try:
        # Parse medication data
        medication_list = json.loads(medication_data)
        
        # Analyze medication history
        medication_impacts = await medication_tracking_service.analyze_medication_history(medication_list)
        
        # Get drug interactions
        current_medications = [med.medication_name for med in medication_impacts if not med.end_date]
        interactions = await medication_tracking_service.get_medication_interactions(current_medications)
        
        return {
            "success": True,
            "medication_impacts": [med.dict() for med in medication_impacts],
            "drug_interactions": interactions,
            "patient_id": patient_id,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/medical-records/vaccination-analysis")
async def analyze_vaccination_records(
    vaccination_data: str = Form(...),  # JSON string
    patient_age: int = Form(...),
    patient_conditions: Optional[str] = Form(None)  # JSON string
):
    """
    Analyze vaccination records and identify missing vaccines
    """
    try:
        # Parse vaccination data
        vaccination_list = json.loads(vaccination_data)
        
        # Parse patient conditions
        conditions = json.loads(patient_conditions) if patient_conditions else []
        
        # Analyze vaccination records
        analysis = await vaccination_tracking_service.analyze_vaccination_records(
            vaccination_list, patient_age, conditions
        )
        
        return {
            "success": True,
            "analysis": analysis,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/medical-records/surgical-guide/{procedure_name}")
async def get_surgical_procedure_guide(
    procedure_name: str,
    patient_data: Optional[str] = None  # JSON string
):
    """
    Get detailed surgical procedure guide with step-by-step instructions
    """
    try:
        # Parse patient data if provided
        patient_info = json.loads(patient_data) if patient_data else None
        
        # Get surgical procedure guide
        procedure = await surgical_guide_service.get_surgical_procedure(procedure_name, patient_info)
        
        # Get additional information
        complications = await surgical_guide_service.get_complication_prevention(procedure_name)
        equipment = await surgical_guide_service.get_equipment_guide(procedure_name)
        anatomy = await surgical_guide_service.get_anatomy_guide(procedure_name)
        
        return {
            "success": True,
            "procedure": procedure.dict(),
            "complications": complications,
            "equipment": equipment,
            "anatomy": anatomy,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/medical-records/surgical-procedures")
async def get_available_surgical_procedures():
    """
    Get list of available surgical procedures
    """
    try:
        procedures = list(surgical_guide_service.procedure_database.keys())
        
        return {
            "success": True,
            "procedures": procedures,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/medical-records/comprehensive-analysis")
async def get_comprehensive_medical_analysis(
    patient_id: str = Form(...),
    bloodwork_file: Optional[UploadFile] = File(None),
    medication_data: Optional[str] = Form(None),  # JSON string
    vaccination_data: Optional[str] = Form(None),  # JSON string
    patient_age: Optional[int] = Form(50),
    patient_gender: Optional[str] = Form("unknown"),
    patient_conditions: Optional[str] = Form(None)  # JSON string
):
    """
    Get comprehensive medical records analysis including bloodwork, medications, and vaccinations
    """
    try:
        comprehensive_analysis = {
            "patient_id": patient_id,
            "bloodwork_analysis": None,
            "medication_analysis": None,
            "vaccination_analysis": None,
            "overall_health_assessment": None
        }
        
        # Analyze bloodwork if provided
        if bloodwork_file:
            file_id = str(uuid.uuid4())
            file_path = f"uploads/{file_id}_{bloodwork_file.filename}"
            
            with open(file_path, "wb") as buffer:
                content = await bloodwork_file.read()
                buffer.write(content)
            
            bloodwork_analysis = await bloodwork_service.analyze_bloodwork_enhanced(
                file_path, patient_age, patient_gender
            )
            comprehensive_analysis["bloodwork_analysis"] = bloodwork_analysis.dict()
            
            os.remove(file_path)
        
        # Analyze medications if provided
        if medication_data:
            medication_list = json.loads(medication_data)
            medication_impacts = await medication_tracking_service.analyze_medication_history(medication_list)
            comprehensive_analysis["medication_analysis"] = [med.dict() for med in medication_impacts]
        
        # Analyze vaccinations if provided
        if vaccination_data:
            vaccination_list = json.loads(vaccination_data)
            conditions = json.loads(patient_conditions) if patient_conditions else []
            
            vaccination_analysis = await vaccination_tracking_service.analyze_vaccination_records(
                vaccination_list, patient_age, conditions
            )
            comprehensive_analysis["vaccination_analysis"] = vaccination_analysis
        
        # Generate overall health assessment
        overall_assessment = await generate_overall_health_assessment(
            comprehensive_analysis, patient_age, patient_gender
        )
        comprehensive_analysis["overall_health_assessment"] = overall_assessment
        
        return {
            "success": True,
            "comprehensive_analysis": comprehensive_analysis,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def generate_overall_health_assessment(analysis: Dict[str, Any], age: int, gender: str) -> Dict[str, Any]:
    """Generate overall health assessment based on all available data"""
    assessment = {
        "risk_level": "low",
        "recommendations": [],
        "priority_actions": [],
        "health_score": 85
    }
    
    # Assess bloodwork risks
    if analysis.get("bloodwork_analysis"):
        bloodwork = analysis["bloodwork_analysis"]
        if bloodwork.get("cancer_risk", {}).get("risk_level") in ["high", "very_high"]:
            assessment["risk_level"] = "high"
            assessment["recommendations"].append("Immediate oncology consultation recommended")
        
        if bloodwork.get("life_expectancy", {}).get("current_estimate", 85) < 75:
            assessment["risk_level"] = "medium"
            assessment["recommendations"].append("Lifestyle modifications recommended")
    
    # Assess medication risks
    if analysis.get("medication_analysis"):
        for med in analysis["medication_analysis"]:
            if "SERIOUS" in med.get("side_effects", ""):
                assessment["risk_level"] = "high"
                assessment["priority_actions"].append(f"Review {med['medication_name']} - serious side effects detected")
    
    # Assess vaccination risks
    if analysis.get("vaccination_analysis"):
        vaccination = analysis["vaccination_analysis"]
        if vaccination.get("overall_risk") == "high":
            assessment["risk_level"] = "medium"
            assessment["recommendations"].append("Update missing vaccinations")
    
    # Calculate health score
    if assessment["risk_level"] == "high":
        assessment["health_score"] = 60
    elif assessment["risk_level"] == "medium":
        assessment["health_score"] = 75
    else:
        assessment["health_score"] = 85
    
    return assessment 