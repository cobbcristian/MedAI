"""
AI Model Comparison Dashboard Service
Run the same input through multiple AI models and compare outputs
Shows differences in output, confidence, and match doctor feedback
"""

import os
import json
import logging
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any, Tuple
from dataclasses import dataclass
import asyncio
import aiofiles
from pathlib import Path

import numpy as np
import pandas as pd
import torch
import torch.nn.functional as F
from sklearn.metrics import accuracy_score, precision_recall_fscore_support
from sklearn.ensemble import RandomForestClassifier
import joblib

from fastapi import HTTPException
from pydantic import BaseModel, Field

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@dataclass
class ModelConfig:
    """Configuration for AI model comparison"""
    model_name: str
    model_type: str  # 'gpt4', 'biogpt', 'chexnet', 'custom'
    model_path: str
    confidence_threshold: float = 0.7
    max_tokens: int = 1000
    temperature: float = 0.1

class ModelComparisonResult:
    """Results from model comparison"""
    def __init__(self, input_data: Dict[str, Any]):
        self.input_data = input_data
        self.model_results = {}
        self.consensus_analysis = {}
        self.confidence_analysis = {}
        self.doctor_feedback = {}
        self.comparison_metrics = {}
    
    def add_model_result(self, model_name: str, result: Dict[str, Any]):
        """Add result from a specific model"""
        self.model_results[model_name] = result
    
    def analyze_consensus(self):
        """Analyze consensus among models"""
        if len(self.model_results) < 2:
            return
        
        # Extract predictions and confidences
        predictions = []
        confidences = []
        
        for model_name, result in self.model_results.items():
            if 'prediction' in result:
                predictions.append(result['prediction'])
            if 'confidence' in result:
                confidences.append(result['confidence'])
        
        # Calculate consensus metrics
        if predictions:
            unique_predictions = set(predictions)
            consensus_score = 1.0 - (len(unique_predictions) - 1) / len(self.model_results)
            
            self.consensus_analysis = {
                'consensus_score': consensus_score,
                'unique_predictions': list(unique_predictions),
                'prediction_frequency': {pred: predictions.count(pred) for pred in unique_predictions},
                'majority_prediction': max(set(predictions), key=predictions.count) if predictions else None
            }
        
        if confidences:
            self.confidence_analysis = {
                'mean_confidence': np.mean(confidences),
                'std_confidence': np.std(confidences),
                'max_confidence': max(confidences),
                'min_confidence': min(confidences),
                'confidence_range': max(confidences) - min(confidences)
            }
    
    def compare_with_doctor_feedback(self, doctor_feedback: Dict[str, Any]):
        """Compare model predictions with doctor feedback"""
        self.doctor_feedback = doctor_feedback
        
        agreement_scores = {}
        for model_name, result in self.model_results.items():
            if 'prediction' in result and 'doctor_diagnosis' in doctor_feedback:
                model_pred = result['prediction']
                doctor_diag = doctor_feedback['doctor_diagnosis']
                
                # Calculate agreement score
                agreement = 1.0 if model_pred == doctor_diag else 0.0
                agreement_scores[model_name] = agreement
        
        self.comparison_metrics['agreement_scores'] = agreement_scores
        self.comparison_metrics['overall_agreement'] = np.mean(list(agreement_scores.values())) if agreement_scores else 0.0

class ModelRegistry:
    """Registry of available AI models for comparison"""
    
    def __init__(self):
        self.registered_models = {}
        self.model_configs = {}
        self._load_model_configs()
    
    def _load_model_configs(self):
        """Load model configurations"""
        config_path = "config/model_configs.json"
        if os.path.exists(config_path):
            try:
                with open(config_path, 'r') as f:
                    configs = json.load(f)
                    for config in configs:
                        model_config = ModelConfig(**config)
                        self.model_configs[model_config.model_name] = model_config
                        logger.info(f"Loaded model config: {model_config.model_name}")
            except Exception as e:
                logger.error(f"Failed to load model configs: {e}")
        
        # Add default models if none loaded
        if not self.model_configs:
            self._add_default_models()
    
    def _add_default_models(self):
        """Add default model configurations"""
        default_models = [
            {
                'model_name': 'GPT-4',
                'model_type': 'gpt4',
                'model_path': 'models/gpt4',
                'confidence_threshold': 0.8,
                'max_tokens': 1000,
                'temperature': 0.1
            },
            {
                'model_name': 'BioGPT',
                'model_type': 'biogpt',
                'model_path': 'models/biogpt',
                'confidence_threshold': 0.7,
                'max_tokens': 800,
                'temperature': 0.2
            },
            {
                'model_name': 'CheXNet',
                'model_type': 'chexnet',
                'model_path': 'models/chexnet',
                'confidence_threshold': 0.75,
                'max_tokens': 500,
                'temperature': 0.1
            },
            {
                'model_name': 'Custom Clinical',
                'model_type': 'custom',
                'model_path': 'models/custom_clinical',
                'confidence_threshold': 0.7,
                'max_tokens': 600,
                'temperature': 0.15
            }
        ]
        
        for config in default_models:
            model_config = ModelConfig(**config)
            self.model_configs[model_config.model_name] = model_config
    
    def get_available_models(self) -> List[str]:
        """Get list of available models"""
        return list(self.model_configs.keys())
    
    def get_model_config(self, model_name: str) -> Optional[ModelConfig]:
        """Get configuration for a specific model"""
        return self.model_configs.get(model_name)

class ModelExecutor:
    """Executes inference on different AI models"""
    
    def __init__(self):
        self.model_registry = ModelRegistry()
        self.loaded_models = {}
    
    async def execute_model(self, model_name: str, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """Execute inference on a specific model"""
        try:
            config = self.model_registry.get_model_config(model_name)
            if not config:
                raise ValueError(f"Model {model_name} not found")
            
            # Load model if not already loaded
            if model_name not in self.loaded_models:
                await self._load_model(model_name, config)
            
            # Execute inference based on model type
            if config.model_type == 'gpt4':
                result = await self._execute_gpt4(input_data, config)
            elif config.model_type == 'biogpt':
                result = await self._execute_biogpt(input_data, config)
            elif config.model_type == 'chexnet':
                result = await self._execute_chexnet(input_data, config)
            elif config.model_type == 'custom':
                result = await self._execute_custom_model(input_data, config)
            else:
                raise ValueError(f"Unsupported model type: {config.model_type}")
            
            # Add metadata
            result['model_name'] = model_name
            result['model_type'] = config.model_type
            result['execution_time'] = datetime.now().isoformat()
            
            return result
            
        except Exception as e:
            logger.error(f"Model execution failed for {model_name}: {e}")
            return {
                'model_name': model_name,
                'error': str(e),
                'status': 'failed',
                'execution_time': datetime.now().isoformat()
            }
    
    async def _load_model(self, model_name: str, config: ModelConfig):
        """Load a model into memory"""
        try:
            if config.model_type == 'custom':
                # Load custom PyTorch model
                model_path = f"{config.model_path}/model.pth"
                if os.path.exists(model_path):
                    model = torch.load(model_path, map_location='cpu')
                    model.eval()
                    self.loaded_models[model_name] = {
                        'model': model,
                        'config': config
                    }
                else:
                    logger.warning(f"Model file not found: {model_path}")
            
            # For API-based models (GPT-4, BioGPT), we don't pre-load
            elif config.model_type in ['gpt4', 'biogpt']:
                self.loaded_models[model_name] = {
                    'config': config
                }
            
            logger.info(f"Model {model_name} loaded successfully")
            
        except Exception as e:
            logger.error(f"Failed to load model {model_name}: {e}")
    
    async def _execute_gpt4(self, input_data: Dict[str, Any], config: ModelConfig) -> Dict[str, Any]:
        """Execute GPT-4 inference"""
        try:
            # Simulate GPT-4 API call
            # In production, this would call OpenAI's API
            symptoms = input_data.get('symptoms', [])
            patient_info = input_data.get('patient_info', {})
            
            # Simulate GPT-4 response
            prompt = f"Patient symptoms: {symptoms}. Patient info: {patient_info}. Provide diagnosis and confidence."
            
            # Simulate response
            diagnosis = self._simulate_gpt4_diagnosis(symptoms)
            confidence = np.random.uniform(0.7, 0.95)
            
            return {
                'prediction': diagnosis,
                'confidence': confidence,
                'reasoning': f"Based on symptoms {symptoms}, GPT-4 suggests {diagnosis}",
                'model_type': 'gpt4'
            }
            
        except Exception as e:
            logger.error(f"GPT-4 execution failed: {e}")
            return {'error': str(e), 'status': 'failed'}
    
    async def _execute_biogpt(self, input_data: Dict[str, Any], config: ModelConfig) -> Dict[str, Any]:
        """Execute BioGPT inference"""
        try:
            symptoms = input_data.get('symptoms', [])
            patient_info = input_data.get('patient_info', {})
            
            # Simulate BioGPT response (more medical-focused)
            diagnosis = self._simulate_biogpt_diagnosis(symptoms)
            confidence = np.random.uniform(0.65, 0.9)
            
            return {
                'prediction': diagnosis,
                'confidence': confidence,
                'reasoning': f"BioGPT analysis of {symptoms} indicates {diagnosis}",
                'model_type': 'biogpt'
            }
            
        except Exception as e:
            logger.error(f"BioGPT execution failed: {e}")
            return {'error': str(e), 'status': 'failed'}
    
    async def _execute_chexnet(self, input_data: Dict[str, Any], config: ModelConfig) -> Dict[str, Any]:
        """Execute CheXNet inference (for chest X-rays)"""
        try:
            image_data = input_data.get('image_data')
            if not image_data:
                return {'error': 'No image data provided for CheXNet', 'status': 'failed'}
            
            # Simulate CheXNet analysis
            diagnosis = self._simulate_chexnet_diagnosis(image_data)
            confidence = np.random.uniform(0.7, 0.92)
            
            return {
                'prediction': diagnosis,
                'confidence': confidence,
                'reasoning': f"CheXNet analysis of chest X-ray indicates {diagnosis}",
                'model_type': 'chexnet'
            }
            
        except Exception as e:
            logger.error(f"CheXNet execution failed: {e}")
            return {'error': str(e), 'status': 'failed'}
    
    async def _execute_custom_model(self, input_data: Dict[str, Any], config: ModelConfig) -> Dict[str, Any]:
        """Execute custom model inference"""
        try:
            if config.model_name not in self.loaded_models:
                return {'error': 'Custom model not loaded', 'status': 'failed'}
            
            model_info = self.loaded_models[config.model_name]
            model = model_info['model']
            
            # Prepare input data
            features = self._prepare_features(input_data)
            
            # Run inference
            with torch.no_grad():
                outputs = model(torch.FloatTensor(features).unsqueeze(0))
                probabilities = F.softmax(outputs, dim=1)
                confidence, prediction = torch.max(probabilities, 1)
            
            # Convert prediction to diagnosis
            diagnosis = self._convert_prediction_to_diagnosis(prediction.item())
            
            return {
                'prediction': diagnosis,
                'confidence': confidence.item(),
                'reasoning': f"Custom clinical model predicts {diagnosis}",
                'model_type': 'custom'
            }
            
        except Exception as e:
            logger.error(f"Custom model execution failed: {e}")
            return {'error': str(e), 'status': 'failed'}
    
    def _simulate_gpt4_diagnosis(self, symptoms: List[str]) -> str:
        """Simulate GPT-4 diagnosis based on symptoms"""
        symptom_keywords = {
            'fever': 'viral infection',
            'cough': 'respiratory infection',
            'chest pain': 'cardiac evaluation needed',
            'headache': 'tension headache',
            'fatigue': 'chronic fatigue syndrome',
            'nausea': 'gastroenteritis'
        }
        
        for symptom in symptoms:
            if symptom.lower() in symptom_keywords:
                return symptom_keywords[symptom.lower()]
        
        return 'general consultation recommended'
    
    def _simulate_biogpt_diagnosis(self, symptoms: List[str]) -> str:
        """Simulate BioGPT diagnosis (more medical terminology)"""
        symptom_keywords = {
            'fever': 'bacterial infection',
            'cough': 'bronchitis',
            'chest pain': 'angina pectoris',
            'headache': 'migraine',
            'fatigue': 'anemia',
            'nausea': 'gastritis'
        }
        
        for symptom in symptoms:
            if symptom.lower() in symptom_keywords:
                return symptom_keywords[symptom.lower()]
        
        return 'further diagnostic evaluation required'
    
    def _simulate_chexnet_diagnosis(self, image_data: Any) -> str:
        """Simulate CheXNet diagnosis for chest X-rays"""
        # Simulate different chest conditions
        conditions = [
            'normal chest X-ray',
            'pneumonia',
            'pneumothorax',
            'cardiomegaly',
            'pleural effusion'
        ]
        
        return np.random.choice(conditions, p=[0.6, 0.15, 0.1, 0.1, 0.05])
    
    def _prepare_features(self, input_data: Dict[str, Any]) -> np.ndarray:
        """Prepare features for custom model"""
        # Extract numerical features
        features = []
        
        # Age
        age = input_data.get('patient_info', {}).get('age', 30)
        features.append(age)
        
        # Gender (0 for female, 1 for male)
        gender = 1 if input_data.get('patient_info', {}).get('gender', '').lower() == 'male' else 0
        features.append(gender)
        
        # Symptom encoding
        symptoms = input_data.get('symptoms', [])
        symptom_features = [1 if symptom in symptoms else 0 for symptom in [
            'fever', 'cough', 'chest_pain', 'headache', 'fatigue', 'nausea'
        ]]
        features.extend(symptom_features)
        
        # Vital signs
        vitals = input_data.get('vitals', {})
        features.extend([
            vitals.get('temperature', 98.6),
            vitals.get('blood_pressure_systolic', 120),
            vitals.get('blood_pressure_diastolic', 80),
            vitals.get('heart_rate', 72),
            vitals.get('respiratory_rate', 16)
        ])
        
        return np.array(features)
    
    def _convert_prediction_to_diagnosis(self, prediction: int) -> str:
        """Convert model prediction to diagnosis"""
        diagnoses = [
            'healthy',
            'viral infection',
            'bacterial infection',
            'chronic condition',
            'acute condition'
        ]
        
        return diagnoses[prediction] if prediction < len(diagnoses) else 'unknown'

class ModelComparisonDashboard:
    """Main model comparison dashboard service"""
    
    def __init__(self):
        self.model_executor = ModelExecutor()
        self.comparison_history = []
    
    async def compare_models(self, input_data: Dict[str, Any], 
                           model_names: List[str]) -> Dict[str, Any]:
        """Compare multiple models on the same input"""
        try:
            # Create comparison result
            comparison_result = ModelComparisonResult(input_data)
            
            # Execute all models
            tasks = []
            for model_name in model_names:
                task = self.model_executor.execute_model(model_name, input_data)
                tasks.append(task)
            
            # Wait for all models to complete
            results = await asyncio.gather(*tasks, return_exceptions=True)
            
            # Process results
            for i, result in enumerate(results):
                if isinstance(result, Exception):
                    logger.error(f"Model {model_names[i]} failed: {result}")
                    result = {'error': str(result), 'status': 'failed'}
                
                comparison_result.add_model_result(model_names[i], result)
            
            # Analyze consensus
            comparison_result.analyze_consensus()
            
            # Store in history
            comparison_data = {
                'timestamp': datetime.now().isoformat(),
                'input_data': input_data,
                'model_results': comparison_result.model_results,
                'consensus_analysis': comparison_result.consensus_analysis,
                'confidence_analysis': comparison_result.confidence_analysis
            }
            self.comparison_history.append(comparison_data)
            
            return {
                'comparison_id': len(self.comparison_history),
                'model_results': comparison_result.model_results,
                'consensus_analysis': comparison_result.consensus_analysis,
                'confidence_analysis': comparison_result.confidence_analysis,
                'comparison_metrics': comparison_result.comparison_metrics,
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Model comparison failed: {e}")
            raise HTTPException(status_code=500, detail="Model comparison failed")
    
    async def add_doctor_feedback(self, comparison_id: int, 
                                doctor_feedback: Dict[str, Any]) -> Dict[str, Any]:
        """Add doctor feedback to a comparison"""
        try:
            if comparison_id > len(self.comparison_history):
                raise HTTPException(status_code=404, detail="Comparison not found")
            
            comparison_data = self.comparison_history[comparison_id - 1]
            
            # Create comparison result for analysis
            comparison_result = ModelComparisonResult(comparison_data['input_data'])
            comparison_result.model_results = comparison_data['model_results']
            comparison_result.consensus_analysis = comparison_data.get('consensus_analysis', {})
            comparison_result.confidence_analysis = comparison_data.get('confidence_analysis', {})
            
            # Compare with doctor feedback
            comparison_result.compare_with_doctor_feedback(doctor_feedback)
            
            # Update comparison data
            comparison_data['doctor_feedback'] = doctor_feedback
            comparison_data['comparison_metrics'] = comparison_result.comparison_metrics
            
            return {
                'comparison_id': comparison_id,
                'doctor_feedback': doctor_feedback,
                'agreement_scores': comparison_result.comparison_metrics.get('agreement_scores', {}),
                'overall_agreement': comparison_result.comparison_metrics.get('overall_agreement', 0.0)
            }
            
        except Exception as e:
            logger.error(f"Failed to add doctor feedback: {e}")
            raise HTTPException(status_code=500, detail="Failed to add doctor feedback")
    
    async def get_comparison_history(self, limit: int = 10) -> List[Dict[str, Any]]:
        """Get comparison history"""
        return self.comparison_history[-limit:] if self.comparison_history else []
    
    async def get_available_models(self) -> List[str]:
        """Get list of available models for comparison"""
        return self.model_executor.model_registry.get_available_models()
    
    async def get_model_performance_metrics(self) -> Dict[str, Any]:
        """Get performance metrics for all models"""
        try:
            metrics = {}
            
            for model_name in self.model_executor.model_registry.get_available_models():
                # Calculate metrics from comparison history
                model_results = []
                doctor_agreements = []
                
                for comparison in self.comparison_history:
                    if model_name in comparison['model_results']:
                        result = comparison['model_results'][model_name]
                        if 'confidence' in result:
                            model_results.append(result['confidence'])
                        
                        # Check doctor feedback agreement
                        if 'doctor_feedback' in comparison:
                            doctor_diag = comparison['doctor_feedback'].get('doctor_diagnosis')
                            model_pred = result.get('prediction')
                            if doctor_diag and model_pred:
                                agreement = 1.0 if doctor_diag == model_pred else 0.0
                                doctor_agreements.append(agreement)
                
                if model_results:
                    metrics[model_name] = {
                        'average_confidence': np.mean(model_results),
                        'confidence_std': np.std(model_results),
                        'total_predictions': len(model_results),
                        'doctor_agreement_rate': np.mean(doctor_agreements) if doctor_agreements else 0.0,
                        'doctor_agreement_count': len(doctor_agreements)
                    }
            
            return metrics
            
        except Exception as e:
            logger.error(f"Failed to calculate performance metrics: {e}")
            return {}

# Pydantic models for API
class ModelComparisonRequest(BaseModel):
    input_data: Dict[str, Any] = Field(..., description="Input data for model comparison")
    model_names: List[str] = Field(..., description="List of model names to compare")

class DoctorFeedbackRequest(BaseModel):
    comparison_id: int = Field(..., description="Comparison ID")
    doctor_diagnosis: str = Field(..., description="Doctor's diagnosis")
    confidence_level: float = Field(..., ge=0.0, le=1.0, description="Doctor's confidence level")
    reasoning: str = Field(..., description="Doctor's reasoning")
    treatment_plan: str = Field(..., description="Recommended treatment plan")

class ModelComparisonResponse(BaseModel):
    comparison_id: int
    model_results: Dict[str, Any]
    consensus_analysis: Dict[str, Any]
    confidence_analysis: Dict[str, Any]
    comparison_metrics: Dict[str, Any]
    timestamp: str

# Initialize global instance
model_comparison_dashboard = ModelComparisonDashboard() 