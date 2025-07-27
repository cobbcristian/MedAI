from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime

class Condition(BaseModel):
    name: str
    confidence: float = Field(..., ge=0.0, le=1.0)
    description: Optional[str] = None
    severity: str = Field(..., regex="^(low|medium|high|critical)$")
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
    image_quality: str = Field(..., regex="^(poor|fair|good|excellent)$")
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
    status: str = Field(..., regex="^(normal|low|high|critical)$")
    significance: Optional[str] = None

class BloodworkAnalysisResult(BaseModel):
    lab_values: List[LabValue]
    abnormalities: List[str]
    recommendations: List[str]
    urgency_level: str = Field(..., regex="^(low|medium|high|critical)$")
    suggested_tests: List[str]
    processing_time: float

class BloodworkAnalysisResponse(BaseModel):
    success: bool
    file_id: str
    analysis: BloodworkAnalysisResult
    timestamp: str

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
    status: str = Field(..., regex="^(loaded|loading|error|unavailable)$")
    version: Optional[str] = None
    last_updated: Optional[str] = None
    accuracy: Optional[float] = None 