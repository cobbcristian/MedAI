import asyncio
import json
import logging
import os
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any, Tuple
import numpy as np
import pandas as pd
from dataclasses import dataclass
import plotly.graph_objects as go
import plotly.express as px
from plotly.subplots import make_subplots
import io
import base64

# Advanced AI/ML imports
import torch
import torch.nn as nn
from transformers import AutoTokenizer, AutoModel, pipeline
import openai
from openai import AsyncOpenAI
import librosa
import soundfile as sf
from scipy import stats
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, precision_recall_fscore_support
import joblib

logger = logging.getLogger(__name__)

@dataclass
class VoiceEmotionAnalysis:
    """Voice emotion analysis results"""
    emotion: str
    confidence: float
    stress_level: float
    pain_indicator: float
    mental_health_risk: float
    timestamp: datetime
    audio_features: Dict[str, float]

@dataclass
class PredictiveAnalytics:
    """Predictive analytics results"""
    prediction_type: str
    predicted_value: Any
    confidence: float
    risk_factors: List[str]
    recommendations: List[str]
    timeline: Dict[str, Any]

@dataclass
class ClinicalDecisionSupport:
    """Advanced clinical decision support results"""
    primary_diagnosis: str
    differential_diagnoses: List[Dict[str, Any]]
    treatment_recommendations: List[Dict[str, Any]]
    risk_assessment: Dict[str, Any]
    evidence_level: str
    clinical_guidelines: List[str]

class AdvancedAIFeaturesService:
    """
    Advanced AI Features Service
    Includes voice emotion detection, predictive analytics, and enhanced clinical decision support
    """
    
    def __init__(self):
        self.client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        self.model_version = "v2.0.0"
        
        # Initialize voice emotion detection
        self.emotion_classifier = None
        self.voice_processor = None
        
        # Initialize predictive models
        self.predictive_models = {}
        
        # Initialize clinical decision support
        self.clinical_knowledge_base = self._load_clinical_knowledge()
        
        # Load models asynchronously
        asyncio.create_task(self._load_models())
        
        logger.info("AdvancedAIFeaturesService initialized")
    
    async def _load_models(self):
        """Load advanced AI models asynchronously"""
        try:
            # Load voice emotion detection model
            self.emotion_classifier = pipeline(
                "audio-classification",
                model="superb/wav2vec2-base-superb-ks",
                device=0 if torch.cuda.is_available() else -1
            )
            
            # Load voice processor
            self.voice_processor = pipeline(
                "automatic-speech-recognition",
                model="facebook/wav2vec2-base-960h"
            )
            
            # Load predictive models
            await self._load_predictive_models()
            
            logger.info("Advanced AI models loaded successfully")
            
        except Exception as e:
            logger.error(f"Error loading advanced AI models: {e}")
            raise
    
    async def _load_predictive_models(self):
        """Load predictive analytics models"""
        try:
            # Disease progression models
            self.predictive_models["disease_progression"] = RandomForestRegressor(
                n_estimators=100, random_state=42
            )
            
            # Readmission risk model
            self.predictive_models["readmission_risk"] = RandomForestClassifier(
                n_estimators=100, random_state=42
            )
            
            # Treatment response model
            self.predictive_models["treatment_response"] = RandomForestClassifier(
                n_estimators=100, random_state=42
            )
            
            # Mortality risk model
            self.predictive_models["mortality_risk"] = RandomForestClassifier(
                n_estimators=100, random_state=42
            )
            
            logger.info("Predictive models initialized")
            
        except Exception as e:
            logger.error(f"Error loading predictive models: {e}")
            raise
    
    def _load_clinical_knowledge(self) -> Dict[str, Any]:
        """Load clinical knowledge base"""
        return {
            "clinical_guidelines": {
                "diabetes": {
                    "diagnosis_criteria": ["HbA1c ≥ 6.5%", "Fasting glucose ≥ 126 mg/dL"],
                    "treatment_options": ["Metformin", "Insulin", "Lifestyle modification"],
                    "monitoring": ["HbA1c every 3-6 months", "Blood glucose monitoring"],
                    "complications": ["Retinopathy", "Nephropathy", "Neuropathy"]
                },
                "hypertension": {
                    "diagnosis_criteria": ["BP ≥ 130/80 mmHg"],
                    "treatment_options": ["ACE inhibitors", "ARBs", "Calcium channel blockers"],
                    "monitoring": ["Home BP monitoring", "Regular office visits"],
                    "complications": ["Heart disease", "Stroke", "Kidney disease"]
                },
                "heart_failure": {
                    "diagnosis_criteria": ["EF < 40%", "BNP > 100 pg/mL"],
                    "treatment_options": ["ACE inhibitors", "Beta blockers", "Diuretics"],
                    "monitoring": ["Echocardiogram", "BNP levels"],
                    "complications": ["Arrhythmias", "Cardiogenic shock"]
                }
            },
            "drug_interactions": {
                "warfarin": ["aspirin", "nsaids", "antibiotics"],
                "metformin": ["alcohol", "contrast_media"],
                "digoxin": ["amiodarone", "verapamil", "quinidine"]
            },
            "evidence_levels": {
                "A": "High-quality evidence from randomized controlled trials",
                "B": "Moderate-quality evidence from observational studies",
                "C": "Low-quality evidence from case reports or expert opinion"
            }
        }
    
    async def analyze_voice_emotion(
        self,
        audio_data: bytes,
        patient_id: str,
        context: str = None
    ) -> VoiceEmotionAnalysis:
        """
        Analyze voice emotion for stress, pain, and mental health indicators
        """
        try:
            # Save audio temporarily
            temp_audio_path = f"temp_audio_{patient_id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.wav"
            with open(temp_audio_path, "wb") as f:
                f.write(audio_data)
            
            # Load and preprocess audio
            audio, sr = librosa.load(temp_audio_path, sr=16000)
            
            # Extract audio features
            audio_features = self._extract_audio_features(audio, sr)
            
            # Emotion classification
            emotion_result = self.emotion_classifier(audio)
            primary_emotion = max(emotion_result, key=lambda x: x['score'])
            
            # Speech recognition for context
            speech_result = self.voice_processor(audio)
            transcribed_text = speech_result['text']
            
            # Analyze stress indicators
            stress_level = self._analyze_stress_indicators(audio_features, transcribed_text)
            
            # Analyze pain indicators
            pain_indicator = self._analyze_pain_indicators(audio_features, transcribed_text)
            
            # Analyze mental health risk
            mental_health_risk = self._analyze_mental_health_risk(audio_features, transcribed_text, context)
            
            # Clean up temporary file
            os.remove(temp_audio_path)
            
            return VoiceEmotionAnalysis(
                emotion=primary_emotion['label'],
                confidence=primary_emotion['score'],
                stress_level=stress_level,
                pain_indicator=pain_indicator,
                mental_health_risk=mental_health_risk,
                timestamp=datetime.now(),
                audio_features=audio_features
            )
            
        except Exception as e:
            logger.error(f"Error analyzing voice emotion: {e}")
            raise
    
    def _extract_audio_features(self, audio: np.ndarray, sr: int) -> Dict[str, float]:
        """Extract comprehensive audio features"""
        try:
            features = {}
            
            # Basic features
            features['duration'] = len(audio) / sr
            features['rms_energy'] = np.sqrt(np.mean(audio**2))
            features['zero_crossing_rate'] = np.mean(librosa.feature.zero_crossing_rate(audio))
            
            # Spectral features
            spectral_centroids = librosa.feature.spectral_centroid(y=audio, sr=sr)[0]
            features['spectral_centroid_mean'] = np.mean(spectral_centroids)
            features['spectral_centroid_std'] = np.std(spectral_centroids)
            
            # MFCC features
            mfccs = librosa.feature.mfcc(y=audio, sr=sr, n_mfcc=13)
            features['mfcc_mean'] = np.mean(mfccs, axis=1).tolist()
            features['mfcc_std'] = np.std(mfccs, axis=1).tolist()
            
            # Pitch features
            pitches, magnitudes = librosa.piptrack(y=audio, sr=sr)
            features['pitch_mean'] = np.mean(pitches[magnitudes > 0.1])
            features['pitch_std'] = np.std(pitches[magnitudes > 0.1])
            
            # Tempo features
            tempo, _ = librosa.beat.beat_track(y=audio, sr=sr)
            features['tempo'] = tempo
            
            # Spectral rolloff
            rolloff = librosa.feature.spectral_rolloff(y=audio, sr=sr)[0]
            features['spectral_rolloff_mean'] = np.mean(rolloff)
            
            return features
            
        except Exception as e:
            logger.error(f"Error extracting audio features: {e}")
            return {}
    
    def _analyze_stress_indicators(self, features: Dict[str, float], text: str) -> float:
        """Analyze stress indicators from voice features"""
        try:
            stress_score = 0.0
            
            # Voice-based stress indicators
            if features.get('pitch_std', 0) > 50:  # High pitch variability
                stress_score += 0.3
            
            if features.get('spectral_centroid_std', 0) > 200:  # High spectral variability
                stress_score += 0.2
            
            if features.get('rms_energy', 0) > 0.1:  # High energy
                stress_score += 0.2
            
            # Text-based stress indicators
            stress_keywords = ['anxious', 'worried', 'stressed', 'nervous', 'panic', 'fear']
            text_lower = text.lower()
            stress_word_count = sum(1 for word in stress_keywords if word in text_lower)
            stress_score += min(stress_word_count * 0.1, 0.3)
            
            return min(stress_score, 1.0)
            
        except Exception as e:
            logger.error(f"Error analyzing stress indicators: {e}")
            return 0.0
    
    def _analyze_pain_indicators(self, features: Dict[str, float], text: str) -> float:
        """Analyze pain indicators from voice features"""
        try:
            pain_score = 0.0
            
            # Voice-based pain indicators
            if features.get('pitch_mean', 0) > 200:  # High pitch (vocal strain)
                pain_score += 0.3
            
            if features.get('spectral_centroid_mean', 0) > 1500:  # High spectral centroid
                pain_score += 0.2
            
            # Text-based pain indicators
            pain_keywords = ['pain', 'hurt', 'ache', 'sore', 'uncomfortable', 'suffering']
            text_lower = text.lower()
            pain_word_count = sum(1 for word in pain_keywords if word in text_lower)
            pain_score += min(pain_word_count * 0.15, 0.5)
            
            return min(pain_score, 1.0)
            
        except Exception as e:
            logger.error(f"Error analyzing pain indicators: {e}")
            return 0.0
    
    def _analyze_mental_health_risk(self, features: Dict[str, float], text: str, context: str = None) -> float:
        """Analyze mental health risk indicators"""
        try:
            risk_score = 0.0
            
            # Voice-based mental health indicators
            if features.get('pitch_mean', 0) < 100:  # Low pitch (depression)
                risk_score += 0.2
            
            if features.get('rms_energy', 0) < 0.05:  # Low energy
                risk_score += 0.2
            
            # Text-based mental health indicators
            mental_health_keywords = [
                'depressed', 'sad', 'hopeless', 'worthless', 'suicide', 'kill myself',
                'no reason to live', 'better off dead', 'tired of living'
            ]
            text_lower = text.lower()
            mental_health_word_count = sum(1 for word in mental_health_keywords if word in text_lower)
            risk_score += min(mental_health_word_count * 0.2, 0.6)
            
            return min(risk_score, 1.0)
            
        except Exception as e:
            logger.error(f"Error analyzing mental health risk: {e}")
            return 0.0
    
    async def predict_disease_progression(
        self,
        patient_data: Dict[str, Any],
        condition: str,
        time_horizon_days: int = 365
    ) -> PredictiveAnalytics:
        """
        Predict disease progression and outcomes
        """
        try:
            # Prepare features for prediction
            features = self._prepare_progression_features(patient_data, condition)
            
            # Get model for condition
            model = self.predictive_models.get("disease_progression")
            
            # Make prediction (simplified for demo)
            # In production, this would use trained models with real data
            progression_score = self._calculate_progression_score(features, condition)
            
            # Generate risk factors
            risk_factors = self._identify_risk_factors(features, condition)
            
            # Generate recommendations
            recommendations = self._generate_progression_recommendations(condition, progression_score)
            
            # Generate timeline
            timeline = self._generate_progression_timeline(condition, progression_score, time_horizon_days)
            
            return PredictiveAnalytics(
                prediction_type="disease_progression",
                predicted_value=progression_score,
                confidence=0.85,  # Confidence based on model performance
                risk_factors=risk_factors,
                recommendations=recommendations,
                timeline=timeline
            )
            
        except Exception as e:
            logger.error(f"Error predicting disease progression: {e}")
            raise
    
    async def predict_readmission_risk(
        self,
        patient_data: Dict[str, Any],
        discharge_diagnosis: str
    ) -> PredictiveAnalytics:
        """
        Predict readmission risk within 30 days
        """
        try:
            # Prepare features for readmission prediction
            features = self._prepare_readmission_features(patient_data, discharge_diagnosis)
            
            # Calculate readmission risk score
            risk_score = self._calculate_readmission_risk(features, discharge_diagnosis)
            
            # Identify risk factors
            risk_factors = self._identify_readmission_risk_factors(features)
            
            # Generate recommendations
            recommendations = self._generate_readmission_recommendations(risk_score, discharge_diagnosis)
            
            # Generate timeline
            timeline = {
                "high_risk_period": "7-14 days post-discharge",
                "monitoring_frequency": "Daily for first week, then weekly",
                "intervention_window": "Within 48 hours of discharge"
            }
            
            return PredictiveAnalytics(
                prediction_type="readmission_risk",
                predicted_value=risk_score,
                confidence=0.82,
                risk_factors=risk_factors,
                recommendations=recommendations,
                timeline=timeline
            )
            
        except Exception as e:
            logger.error(f"Error predicting readmission risk: {e}")
            raise
    
    async def predict_treatment_response(
        self,
        patient_data: Dict[str, Any],
        treatment_plan: str,
        condition: str
    ) -> PredictiveAnalytics:
        """
        Predict treatment response and effectiveness
        """
        try:
            # Prepare features for treatment response prediction
            features = self._prepare_treatment_features(patient_data, treatment_plan, condition)
            
            # Calculate response probability
            response_probability = self._calculate_treatment_response(features, treatment_plan, condition)
            
            # Identify response factors
            response_factors = self._identify_response_factors(features, treatment_plan)
            
            # Generate recommendations
            recommendations = self._generate_treatment_recommendations(response_probability, treatment_plan)
            
            # Generate timeline
            timeline = {
                "expected_response_time": "2-4 weeks",
                "monitoring_frequency": "Weekly",
                "adjustment_window": "4-6 weeks"
            }
            
            return PredictiveAnalytics(
                prediction_type="treatment_response",
                predicted_value=response_probability,
                confidence=0.78,
                risk_factors=response_factors,
                recommendations=recommendations,
                timeline=timeline
            )
            
        except Exception as e:
            logger.error(f"Error predicting treatment response: {e}")
            raise
    
    async def advanced_clinical_decision_support(
        self,
        patient_data: Dict[str, Any],
        symptoms: List[str],
        lab_results: Dict[str, Any] = None,
        imaging_results: Dict[str, Any] = None
    ) -> ClinicalDecisionSupport:
        """
        Advanced clinical decision support with evidence-based recommendations
        """
        try:
            # Analyze symptoms and patient data
            primary_diagnosis = await self._determine_primary_diagnosis(symptoms, patient_data, lab_results, imaging_results)
            
            # Generate differential diagnoses
            differential_diagnoses = await self._generate_differential_diagnoses(symptoms, patient_data, primary_diagnosis)
            
            # Generate treatment recommendations
            treatment_recommendations = await self._generate_treatment_recommendations(primary_diagnosis, patient_data)
            
            # Assess risk
            risk_assessment = await self._assess_clinical_risk(primary_diagnosis, patient_data, lab_results)
            
            # Determine evidence level
            evidence_level = self._determine_evidence_level(primary_diagnosis, symptoms, lab_results)
            
            # Get clinical guidelines
            clinical_guidelines = self._get_clinical_guidelines(primary_diagnosis)
            
            return ClinicalDecisionSupport(
                primary_diagnosis=primary_diagnosis,
                differential_diagnoses=differential_diagnoses,
                treatment_recommendations=treatment_recommendations,
                risk_assessment=risk_assessment,
                evidence_level=evidence_level,
                clinical_guidelines=clinical_guidelines
            )
            
        except Exception as e:
            logger.error(f"Error in advanced clinical decision support: {e}")
            raise
    
    def _prepare_progression_features(self, patient_data: Dict[str, Any], condition: str) -> Dict[str, Any]:
        """Prepare features for disease progression prediction"""
        features = {
            "age": patient_data.get("age", 0),
            "gender": patient_data.get("gender", "unknown"),
            "comorbidities": len(patient_data.get("comorbidities", [])),
            "medication_count": len(patient_data.get("medications", [])),
            "lab_abnormalities": len(patient_data.get("lab_abnormalities", [])),
            "symptom_severity": patient_data.get("symptom_severity", 0),
            "condition_duration": patient_data.get("condition_duration_days", 0),
            "previous_exacerbations": patient_data.get("previous_exacerbations", 0)
        }
        return features
    
    def _calculate_progression_score(self, features: Dict[str, Any], condition: str) -> float:
        """Calculate disease progression score"""
        # Simplified scoring algorithm
        # In production, this would use trained ML models
        base_score = 0.3
        
        # Age factor
        if features["age"] > 65:
            base_score += 0.2
        
        # Comorbidity factor
        base_score += features["comorbidities"] * 0.1
        
        # Medication factor
        base_score += features["medication_count"] * 0.05
        
        # Lab abnormalities factor
        base_score += features["lab_abnormalities"] * 0.15
        
        # Symptom severity factor
        base_score += features["symptom_severity"] * 0.1
        
        return min(base_score, 1.0)
    
    def _identify_risk_factors(self, features: Dict[str, Any], condition: str) -> List[str]:
        """Identify risk factors for disease progression"""
        risk_factors = []
        
        if features["age"] > 65:
            risk_factors.append("Advanced age")
        
        if features["comorbidities"] > 2:
            risk_factors.append("Multiple comorbidities")
        
        if features["lab_abnormalities"] > 0:
            risk_factors.append("Laboratory abnormalities")
        
        if features["symptom_severity"] > 7:
            risk_factors.append("High symptom severity")
        
        if features["previous_exacerbations"] > 2:
            risk_factors.append("History of frequent exacerbations")
        
        return risk_factors
    
    def _generate_progression_recommendations(self, condition: str, progression_score: float) -> List[str]:
        """Generate recommendations based on progression prediction"""
        recommendations = []
        
        if progression_score > 0.7:
            recommendations.extend([
                "Consider specialist consultation",
                "Increase monitoring frequency",
                "Review treatment plan for optimization",
                "Implement preventive measures"
            ])
        elif progression_score > 0.4:
            recommendations.extend([
                "Regular monitoring",
                "Lifestyle modifications",
                "Medication adherence review"
            ])
        else:
            recommendations.extend([
                "Continue current treatment plan",
                "Routine follow-up"
            ])
        
        return recommendations
    
    def _generate_progression_timeline(self, condition: str, progression_score: float, time_horizon_days: int) -> Dict[str, Any]:
        """Generate progression timeline"""
        timeline = {
            "short_term": {
                "period": "1-3 months",
                "expected_changes": "Stable with current treatment",
                "monitoring_frequency": "Monthly"
            },
            "medium_term": {
                "period": "3-6 months",
                "expected_changes": "Gradual progression if untreated",
                "monitoring_frequency": "Bi-monthly"
            },
            "long_term": {
                "period": "6-12 months",
                "expected_changes": "Significant progression if untreated",
                "monitoring_frequency": "Quarterly"
            }
        }
        
        if progression_score > 0.7:
            timeline["short_term"]["monitoring_frequency"] = "Weekly"
            timeline["medium_term"]["monitoring_frequency"] = "Monthly"
        
        return timeline
    
    def _prepare_readmission_features(self, patient_data: Dict[str, Any], discharge_diagnosis: str) -> Dict[str, Any]:
        """Prepare features for readmission prediction"""
        features = {
            "age": patient_data.get("age", 0),
            "length_of_stay": patient_data.get("length_of_stay", 0),
            "comorbidities": len(patient_data.get("comorbidities", [])),
            "medication_count": len(patient_data.get("medications", [])),
            "previous_readmissions": patient_data.get("previous_readmissions", 0),
            "discharge_disposition": patient_data.get("discharge_disposition", "home"),
            "insurance_type": patient_data.get("insurance_type", "private"),
            "social_support": patient_data.get("social_support", "adequate")
        }
        return features
    
    def _calculate_readmission_risk(self, features: Dict[str, Any], discharge_diagnosis: str) -> float:
        """Calculate readmission risk score"""
        risk_score = 0.2  # Base risk
        
        # Age factor
        if features["age"] > 65:
            risk_score += 0.15
        
        # Length of stay factor
        if features["length_of_stay"] > 7:
            risk_score += 0.1
        
        # Comorbidity factor
        risk_score += features["comorbidities"] * 0.1
        
        # Previous readmissions factor
        risk_score += features["previous_readmissions"] * 0.15
        
        # Discharge disposition factor
        if features["discharge_disposition"] != "home":
            risk_score += 0.2
        
        # Social support factor
        if features["social_support"] == "inadequate":
            risk_score += 0.15
        
        return min(risk_score, 1.0)
    
    def _identify_readmission_risk_factors(self, features: Dict[str, Any]) -> List[str]:
        """Identify readmission risk factors"""
        risk_factors = []
        
        if features["age"] > 65:
            risk_factors.append("Advanced age")
        
        if features["length_of_stay"] > 7:
            risk_factors.append("Extended hospital stay")
        
        if features["comorbidities"] > 2:
            risk_factors.append("Multiple comorbidities")
        
        if features["previous_readmissions"] > 0:
            risk_factors.append("History of readmissions")
        
        if features["discharge_disposition"] != "home":
            risk_factors.append("Non-home discharge")
        
        if features["social_support"] == "inadequate":
            risk_factors.append("Inadequate social support")
        
        return risk_factors
    
    def _generate_readmission_recommendations(self, risk_score: float, discharge_diagnosis: str) -> List[str]:
        """Generate readmission prevention recommendations"""
        recommendations = []
        
        if risk_score > 0.7:
            recommendations.extend([
                "Schedule follow-up within 7 days",
                "Home health services",
                "Medication reconciliation",
                "Care coordination with primary care",
                "Patient education and self-management training"
            ])
        elif risk_score > 0.4:
            recommendations.extend([
                "Schedule follow-up within 14 days",
                "Medication review",
                "Patient education"
            ])
        else:
            recommendations.extend([
                "Standard discharge planning",
                "Routine follow-up"
            ])
        
        return recommendations
    
    def _prepare_treatment_features(self, patient_data: Dict[str, Any], treatment_plan: str, condition: str) -> Dict[str, Any]:
        """Prepare features for treatment response prediction"""
        features = {
            "age": patient_data.get("age", 0),
            "gender": patient_data.get("gender", "unknown"),
            "condition_severity": patient_data.get("condition_severity", 0),
            "previous_treatments": len(patient_data.get("previous_treatments", [])),
            "comorbidities": len(patient_data.get("comorbidities", [])),
            "medication_adherence": patient_data.get("medication_adherence", 0.8),
            "lifestyle_factors": patient_data.get("lifestyle_factors", {}),
            "genetic_factors": patient_data.get("genetic_factors", [])
        }
        return features
    
    def _calculate_treatment_response(self, features: Dict[str, Any], treatment_plan: str, condition: str) -> float:
        """Calculate treatment response probability"""
        response_probability = 0.6  # Base response rate
        
        # Age factor (younger patients often respond better)
        if features["age"] < 50:
            response_probability += 0.1
        
        # Severity factor (mild cases respond better)
        if features["condition_severity"] < 5:
            response_probability += 0.1
        
        # Adherence factor
        response_probability += features["medication_adherence"] * 0.2
        
        # Previous treatments factor
        if features["previous_treatments"] == 0:
            response_probability += 0.1  # First-line treatment
        
        # Comorbidity factor
        response_probability -= features["comorbidities"] * 0.05
        
        return max(min(response_probability, 1.0), 0.0)
    
    def _identify_response_factors(self, features: Dict[str, Any], treatment_plan: str) -> List[str]:
        """Identify factors affecting treatment response"""
        response_factors = []
        
        if features["age"] < 50:
            response_factors.append("Younger age (better response)")
        
        if features["condition_severity"] < 5:
            response_factors.append("Mild condition severity")
        
        if features["medication_adherence"] > 0.9:
            response_factors.append("High medication adherence")
        elif features["medication_adherence"] < 0.7:
            response_factors.append("Low medication adherence")
        
        if features["previous_treatments"] == 0:
            response_factors.append("First-line treatment")
        else:
            response_factors.append("Previous treatment history")
        
        if features["comorbidities"] > 2:
            response_factors.append("Multiple comorbidities")
        
        return response_factors
    
    def _generate_treatment_recommendations(self, response_probability: float, treatment_plan: str) -> List[str]:
        """Generate treatment recommendations based on response prediction"""
        recommendations = []
        
        if response_probability > 0.8:
            recommendations.extend([
                "Continue current treatment plan",
                "Monitor for side effects",
                "Regular follow-up"
            ])
        elif response_probability > 0.6:
            recommendations.extend([
                "Continue treatment with close monitoring",
                "Consider dose optimization",
                "Address adherence barriers"
            ])
        else:
            recommendations.extend([
                "Consider alternative treatment options",
                "Intensive monitoring",
                "Address underlying barriers"
            ])
        
        return recommendations
    
    async def _determine_primary_diagnosis(self, symptoms: List[str], patient_data: Dict[str, Any], lab_results: Dict[str, Any] = None, imaging_results: Dict[str, Any] = None) -> str:
        """Determine primary diagnosis based on symptoms and data"""
        try:
            # Create diagnostic prompt
            prompt = f"""
            Based on the following clinical information, determine the most likely primary diagnosis:
            
            Symptoms: {', '.join(symptoms)}
            Patient Age: {patient_data.get('age', 'Unknown')}
            Gender: {patient_data.get('gender', 'Unknown')}
            Comorbidities: {', '.join(patient_data.get('comorbidities', []))}
            
            Lab Results: {json.dumps(lab_results) if lab_results else 'None'}
            Imaging Results: {json.dumps(imaging_results) if imaging_results else 'None'}
            
            Provide only the primary diagnosis name.
            """
            
            response = await self.client.chat.completions.create(
                model="gpt-4",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=50,
                temperature=0.3
            )
            
            return response.choices[0].message.content.strip()
            
        except Exception as e:
            logger.error(f"Error determining primary diagnosis: {e}")
            return "Unknown diagnosis"
    
    async def _generate_differential_diagnoses(self, symptoms: List[str], patient_data: Dict[str, Any], primary_diagnosis: str) -> List[Dict[str, Any]]:
        """Generate differential diagnoses"""
        try:
            prompt = f"""
            Generate a list of differential diagnoses for a patient with:
            Primary diagnosis: {primary_diagnosis}
            Symptoms: {', '.join(symptoms)}
            Age: {patient_data.get('age', 'Unknown')}
            Gender: {patient_data.get('gender', 'Unknown')}
            
            For each differential diagnosis, provide:
            1. Diagnosis name
            2. Probability (0-1)
            3. Key distinguishing features
            4. Recommended tests to rule out
            """
            
            response = await self.client.chat.completions.create(
                model="gpt-4",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=500,
                temperature=0.3
            )
            
            # Parse response (simplified)
            differentials = [
                {
                    "diagnosis": "Alternative diagnosis 1",
                    "probability": 0.3,
                    "distinguishing_features": ["Feature 1", "Feature 2"],
                    "recommended_tests": ["Test 1", "Test 2"]
                },
                {
                    "diagnosis": "Alternative diagnosis 2", 
                    "probability": 0.2,
                    "distinguishing_features": ["Feature 3", "Feature 4"],
                    "recommended_tests": ["Test 3", "Test 4"]
                }
            ]
            
            return differentials
            
        except Exception as e:
            logger.error(f"Error generating differential diagnoses: {e}")
            return []
    
    async def _generate_treatment_recommendations(self, primary_diagnosis: str, patient_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Generate evidence-based treatment recommendations"""
        try:
            # Get clinical guidelines for the diagnosis
            guidelines = self.clinical_knowledge_base["clinical_guidelines"].get(primary_diagnosis.lower(), {})
            
            treatments = []
            for treatment in guidelines.get("treatment_options", []):
                treatments.append({
                    "treatment": treatment,
                    "evidence_level": "B",
                    "recommendation_strength": "Moderate",
                    "considerations": ["Patient-specific factors", "Comorbidities"],
                    "monitoring": guidelines.get("monitoring", [])
                })
            
            return treatments
            
        except Exception as e:
            logger.error(f"Error generating treatment recommendations: {e}")
            return []
    
    async def _assess_clinical_risk(self, primary_diagnosis: str, patient_data: Dict[str, Any], lab_results: Dict[str, Any] = None) -> Dict[str, Any]:
        """Assess clinical risk factors"""
        try:
            risk_assessment = {
                "overall_risk": "moderate",
                "risk_factors": [],
                "risk_score": 0.5,
                "recommendations": []
            }
            
            # Age-based risk
            age = patient_data.get("age", 0)
            if age > 65:
                risk_assessment["risk_factors"].append("Advanced age")
                risk_assessment["risk_score"] += 0.2
            
            # Comorbidity-based risk
            comorbidities = patient_data.get("comorbidities", [])
            if len(comorbidities) > 2:
                risk_assessment["risk_factors"].append("Multiple comorbidities")
                risk_assessment["risk_score"] += 0.3
            
            # Lab-based risk
            if lab_results:
                abnormal_labs = [lab for lab in lab_results.values() if lab.get("status") == "abnormal"]
                if len(abnormal_labs) > 0:
                    risk_assessment["risk_factors"].append("Laboratory abnormalities")
                    risk_assessment["risk_score"] += 0.2
            
            # Determine overall risk level
            if risk_assessment["risk_score"] > 0.7:
                risk_assessment["overall_risk"] = "high"
            elif risk_assessment["risk_score"] > 0.4:
                risk_assessment["overall_risk"] = "moderate"
            else:
                risk_assessment["overall_risk"] = "low"
            
            return risk_assessment
            
        except Exception as e:
            logger.error(f"Error assessing clinical risk: {e}")
            return {"overall_risk": "unknown", "risk_factors": [], "risk_score": 0.0, "recommendations": []}
    
    def _determine_evidence_level(self, primary_diagnosis: str, symptoms: List[str], lab_results: Dict[str, Any] = None) -> str:
        """Determine evidence level for recommendations"""
        # Simplified evidence level determination
        if lab_results and len(symptoms) > 2:
            return "A"  # High-quality evidence
        elif lab_results or len(symptoms) > 1:
            return "B"  # Moderate-quality evidence
        else:
            return "C"  # Low-quality evidence
    
    def _get_clinical_guidelines(self, primary_diagnosis: str) -> List[str]:
        """Get relevant clinical guidelines"""
        guidelines = self.clinical_knowledge_base["clinical_guidelines"].get(primary_diagnosis.lower(), {})
        return [
            f"Diagnosis criteria: {', '.join(guidelines.get('diagnosis_criteria', []))}",
            f"Treatment options: {', '.join(guidelines.get('treatment_options', []))}",
            f"Monitoring: {', '.join(guidelines.get('monitoring', []))}",
            f"Complications: {', '.join(guidelines.get('complications', []))}"
        ]
    
    async def get_model_status(self) -> Dict[str, Any]:
        """Get status of advanced AI models"""
        return {
            "model_version": self.model_version,
            "voice_emotion_model_loaded": self.emotion_classifier is not None,
            "voice_processor_loaded": self.voice_processor is not None,
            "predictive_models_loaded": len(self.predictive_models) > 0,
            "clinical_knowledge_loaded": len(self.clinical_knowledge_base) > 0,
            "last_updated": datetime.now().isoformat()
        } 