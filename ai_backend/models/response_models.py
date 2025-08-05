from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime

class Condition(BaseModel):
    name: str
    confidence: float = Field(..., ge=0.0, le=1.0)
    description: Optional[str] = None
    severity: str = Field(..., pattern="^(low|medium|high|critical)$")
    recommendations: List[str] = []

class BoundingBox(BaseModel):
    x: float
    y: float
    width: float
    height: float
    confidence: float

class ScanAnalysisResult(BaseModel):
    conditions: List[Condition]
    overall_confidence: float = Field(..., ge=0.0, le=1.0)
    scan_type: Optional[str] = None
    image_quality: str = Field(..., pattern="^(poor|fair|good|excellent)$")
    bounding_boxes: Optional[List[BoundingBox]] = None
    heatmap_url: Optional[str] = None
    processing_time: float

class ScanAnalysisResponse(BaseModel):
    success: bool
    file_id: str
    analysis: ScanAnalysisResult
    timestamp: str

class LabValue(BaseModel):
    name: str
    value: float
    unit: str
    reference_range: str
    status: str = Field(..., pattern="^(normal|low|high|critical)$")
    significance: Optional[str] = None

class BloodworkAnalysisResult(BaseModel):
    lab_values: List[LabValue]
    abnormalities: List[str]
    recommendations: List[str]
    urgency_level: str = Field(..., pattern="^(low|medium|high|critical)$")
    suggested_tests: List[str]
    processing_time: float

class BloodworkAnalysisResponse(BaseModel):
    success: bool
    file_id: str
    analysis: BloodworkAnalysisResult
    timestamp: str

# Enhanced Medical Records Models
class CancerRisk(BaseModel):
    risk_level: str = Field(..., pattern="^(low|medium|high|very_high)$")
    probability: float = Field(..., ge=0.0, le=1.0)
    factors: List[str] = []
    recommendations: List[str] = []

class LifeExpectancy(BaseModel):
    current_estimate: int = Field(..., ge=0)
    factors_affecting: List[str] = []
    interventions: List[str] = []
    confidence: float = Field(..., ge=0.0, le=1.0)

class MedicationImpact(BaseModel):
    medication_name: str
    dosage: str
    start_date: str
    end_date: Optional[str] = None
    reason: str
    effectiveness: str
    side_effects: List[str] = []
    ai_recommendation: str
    life_impact: str
    dosage_recommendation: str  # increase, decrease, maintain, stop
    long_term_effects: List[str] = []

class VaccinationRecord(BaseModel):
    name: str
    date: str
    type: str
    reaction: str
    next_due: Optional[str] = None
    ai_analysis: str
    risk_if_missed: str
    risk_if_taken: str

class MissingVaccination(BaseModel):
    name: str
    recommended_age: str
    risk_level: str
    ai_analysis: str
    urgency: str

class SurgicalStep(BaseModel):
    step_number: int
    description: str
    duration: str
    critical_points: List[str] = []
    warnings: List[str] = []

class SurgicalProcedure(BaseModel):
    name: str
    scheduled_date: str
    duration: str
    complexity: str
    pre_op_steps: List[SurgicalStep] = []
    procedure_steps: List[SurgicalStep] = []
    post_op_steps: List[SurgicalStep] = []
    complications: List[str] = []
    success_rate: float = Field(..., ge=0.0, le=1.0)

class EnhancedBloodworkAnalysis(BaseModel):
    lab_values: List[LabValue]
    abnormalities: List[str]
    recommendations: List[str]
    urgency_level: str
    suggested_tests: List[str]
    cancer_risk: CancerRisk
    life_expectancy: LifeExpectancy
    interventions: List[str] = []
    medications: List[str] = []
    processing_time: float

class EnhancedMedicalRecord(BaseModel):
    record_id: str
    patient_id: str
    record_type: str  # bloodwork, imaging, medication, vaccination, surgery
    title: str
    date: str
    doctor: str
    description: str
    
    # Enhanced analysis based on type
    bloodwork_analysis: Optional[EnhancedBloodworkAnalysis] = None
    scan_analysis: Optional[ScanAnalysisResult] = None
    medication_history: Optional[List[MedicationImpact]] = None
    vaccination_records: Optional[List[VaccinationRecord]] = None
    missing_vaccinations: Optional[List[MissingVaccination]] = None
    surgical_procedure: Optional[SurgicalProcedure] = None
    
    # Security and compliance
    encrypted: bool = True
    access_level: str = "private"
    shared_with: List[str] = []

class RecoveryPrediction(BaseModel):
    estimated_recovery_days: int = Field(..., ge=1)
    confidence_interval: Dict[str, int]
    complication_risk: float = Field(..., ge=0.0, le=1.0)
    risk_factors: List[str]
    recommendations: List[str]
    follow_up_schedule: Dict[str, str]

class RecoveryPredictionResponse(BaseModel):
    success: bool
    prediction: RecoveryPrediction
    timestamp: str

class FeedbackResponse(BaseModel):
    success: bool
    feedback_id: str
    message: str
    timestamp: str

class ModelStatus(BaseModel):
    model_name: str
    status: str = Field(..., pattern="^(loaded|loading|error|unavailable)$")
    version: Optional[str] = None
    last_updated: Optional[str] = None
    accuracy: Optional[float] = None 