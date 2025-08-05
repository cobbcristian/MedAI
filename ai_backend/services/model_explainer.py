import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from typing import Dict, List, Any, Optional, Tuple
import json
import logging
from dataclasses import dataclass, asdict
from enum import Enum
import shap
import lime
import lime.lime_tabular
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
import joblib
import os
from datetime import datetime
import openai

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load OpenAI API key from environment
openai.api_key = os.getenv('OPENAI_API_KEY')

class ExplanationType(Enum):
    LIME = "lime"
    SHAP = "shap"
    FEATURE_IMPORTANCE = "feature_importance"
    DECISION_PATH = "decision_path"
    CONFIDENCE_BREAKDOWN = "confidence_breakdown"
    OPENAI_EXPLANATION = "openai_explanation"

@dataclass
class ExplanationResult:
    """Result of AI model explanation"""
    explanation_type: ExplanationType
    feature_contributions: Dict[str, float]
    confidence_score: float
    confidence_breakdown: Dict[str, float]
    decision_path: List[str]
    risk_factors: List[str]
    recommendations: List[str]
    plain_language_explanation: str
    visualization_data: Dict[str, Any]
    timestamp: datetime
    model_version: str
    training_data_info: Dict[str, Any]

class ModelExplainer:
    """
    AI Model Explainer for diagnostic models
    Provides LIME/SHAP-based explanations for building patient trust
    """
    
    def __init__(self, model_path: Optional[str] = None):
        self.model = None
        self.scaler = None
        self.feature_names = []
        self.class_names = []
        self.explainer = None
        self.shap_explainer = None
        
        if model_path and os.path.exists(model_path):
            self.load_model(model_path)
        else:
            self._initialize_demo_model()
    
    def _initialize_demo_model(self):
        """Initialize a demo model for demonstration purposes"""
        logger.info("Initializing demo diagnostic model")
        
        # Demo feature names for medical diagnosis
        self.feature_names = [
            'age', 'gender', 'temperature', 'blood_pressure_systolic',
            'blood_pressure_diastolic', 'heart_rate', 'respiratory_rate',
            'oxygen_saturation', 'pain_level', 'fatigue_level',
            'cough_present', 'fever_present', 'shortness_of_breath',
            'chest_pain', 'headache', 'nausea', 'diarrhea',
            'loss_of_appetite', 'muscle_aches', 'sore_throat'
        ]
        
        self.class_names = ['Healthy', 'Mild Illness', 'Moderate Illness', 'Severe Illness']
        
        # Create demo training data
        np.random.seed(42)
        n_samples = 1000
        
        # Generate synthetic medical data
        demo_data = {
            'age': np.random.normal(45, 15, n_samples),
            'gender': np.random.choice([0, 1], n_samples),
            'temperature': np.random.normal(98.6, 2, n_samples),
            'blood_pressure_systolic': np.random.normal(120, 20, n_samples),
            'blood_pressure_diastolic': np.random.normal(80, 10, n_samples),
            'heart_rate': np.random.normal(72, 15, n_samples),
            'respiratory_rate': np.random.normal(16, 4, n_samples),
            'oxygen_saturation': np.random.normal(98, 2, n_samples),
            'pain_level': np.random.randint(0, 11, n_samples),
            'fatigue_level': np.random.randint(0, 11, n_samples),
            'cough_present': np.random.choice([0, 1], n_samples),
            'fever_present': np.random.choice([0, 1], n_samples),
            'shortness_of_breath': np.random.choice([0, 1], n_samples),
            'chest_pain': np.random.choice([0, 1], n_samples),
            'headache': np.random.choice([0, 1], n_samples),
            'nausea': np.random.choice([0, 1], n_samples),
            'diarrhea': np.random.choice([0, 1], n_samples),
            'loss_of_appetite': np.random.choice([0, 1], n_samples),
            'muscle_aches': np.random.choice([0, 1], n_samples),
            'sore_throat': np.random.choice([0, 1], n_samples)
        }
        
        X = pd.DataFrame(demo_data)
        
        # Create target labels based on symptoms
        y = np.zeros(n_samples)
        
        # Severe illness: high fever + multiple symptoms
        severe_mask = (
            (X['temperature'] > 101) & 
            (X['shortness_of_breath'] == 1) & 
            (X['chest_pain'] == 1)
        )
        y[severe_mask] = 3
        
        # Moderate illness: moderate symptoms
        moderate_mask = (
            (X['temperature'] > 100) & 
            (X['cough_present'] == 1) & 
            (X['fatigue_level'] > 5)
        ) & (y == 0)
        y[moderate_mask] = 2
        
        # Mild illness: mild symptoms
        mild_mask = (
            (X['temperature'] > 99) & 
            (X['cough_present'] == 1)
        ) & (y == 0)
        y[mild_mask] = 1
        
        # Train model
        self.scaler = StandardScaler()
        X_scaled = self.scaler.fit_transform(X)
        
        self.model = RandomForestClassifier(n_estimators=100, random_state=42)
        self.model.fit(X_scaled, y)
        
        # Initialize explainers
        self._initialize_explainers(X_scaled)
        
        logger.info("Demo model initialized successfully")
    
    def _initialize_explainers(self, X_scaled: np.ndarray):
        """Initialize LIME and SHAP explainers"""
        try:
            # Initialize LIME explainer
            self.explainer = lime.lime_tabular.LimeTabularExplainer(
                X_scaled,
                feature_names=self.feature_names,
                class_names=self.class_names,
                mode='classification'
            )
            
            # Initialize SHAP explainer
            self.shap_explainer = shap.TreeExplainer(self.model)
            
            logger.info("Explainers initialized successfully")
            
        except Exception as e:
            logger.error(f"Error initializing explainers: {e}")
    
    def load_model(self, model_path: str):
        """Load a trained model from file"""
        try:
            self.model = joblib.load(f"{model_path}/model.pkl")
            self.scaler = joblib.load(f"{model_path}/scaler.pkl")
            
            # Load feature names and class names
            with open(f"{model_path}/metadata.json", 'r') as f:
                metadata = json.load(f)
                self.feature_names = metadata['feature_names']
                self.class_names = metadata['class_names']
            
            # Initialize explainers with loaded model
            # This would need actual training data for proper initialization
            logger.info(f"Model loaded from {model_path}")
            
        except Exception as e:
            logger.error(f"Error loading model: {e}")
            self._initialize_demo_model()
    
    def save_model(self, model_path: str):
        """Save the trained model to file"""
        try:
            os.makedirs(model_path, exist_ok=True)
            
            joblib.dump(self.model, f"{model_path}/model.pkl")
            joblib.dump(self.scaler, f"{model_path}/scaler.pkl")
            
            # Save metadata
            metadata = {
                'feature_names': self.feature_names,
                'class_names': self.class_names,
                'model_type': 'RandomForestClassifier',
                'created_at': datetime.now().isoformat()
            }
            
            with open(f"{model_path}/metadata.json", 'w') as f:
                json.dump(metadata, f, indent=2)
            
            logger.info(f"Model saved to {model_path}")
            
        except Exception as e:
            logger.error(f"Error saving model: {e}")
    
    async def explain_prediction(self, patient_data: Dict[str, Any], 
                          explanation_type: ExplanationType = ExplanationType.LIME) -> ExplanationResult:
        """
        Explain a model prediction for patient data
        
        Args:
            patient_data: Patient's medical data
            explanation_type: Type of explanation to generate
            
        Returns:
            ExplanationResult with detailed explanation
        """
        try:
            # Prepare patient data
            X_patient = self._prepare_patient_data(patient_data)
            
            # Get model prediction
            prediction = self.model.predict(X_patient)[0]
            prediction_proba = self.model.predict_proba(X_patient)[0]
            confidence_score = max(prediction_proba)
            
            # Generate explanation based on type
            if explanation_type == ExplanationType.LIME:
                explanation = self._generate_lime_explanation(X_patient)
            elif explanation_type == ExplanationType.SHAP:
                explanation = self._generate_shap_explanation(X_patient)
            elif explanation_type == ExplanationType.OPENAI_EXPLANATION:
                explanation = await self._generate_openai_explanation(patient_data, prediction, confidence_score)
            else:
                explanation = self._generate_feature_importance_explanation(X_patient)
            
            # Generate plain language explanation
            plain_language = self._generate_plain_language_explanation(
                patient_data, prediction, explanation, confidence_score
            )
            
            # Generate recommendations
            recommendations = self._generate_recommendations(prediction, explanation)
            
            # Generate risk factors
            risk_factors = self._identify_risk_factors(patient_data, explanation)
            
            # Generate decision path
            decision_path = self._generate_decision_path(prediction, explanation)
            
            # Generate confidence breakdown
            confidence_breakdown = self._generate_confidence_breakdown(
                prediction_proba, explanation
            )
            
            return ExplanationResult(
                explanation_type=explanation_type,
                feature_contributions=explanation['feature_contributions'],
                confidence_score=confidence_score,
                confidence_breakdown=confidence_breakdown,
                decision_path=decision_path,
                risk_factors=risk_factors,
                recommendations=recommendations,
                plain_language_explanation=plain_language,
                visualization_data=explanation['visualization_data'],
                timestamp=datetime.now(),
                model_version="1.0.0",
                training_data_info={
                    'total_samples': 1000,
                    'last_updated': '2024-01-01',
                    'data_source': 'Synthetic medical data'
                }
            )
            
        except Exception as e:
            logger.error(f"Error explaining prediction: {e}")
            raise
    
    async def _generate_openai_explanation(self, patient_data: Dict[str, Any], 
                                         prediction: int, confidence_score: float) -> Dict[str, Any]:
        """Generate explanation using OpenAI GPT-4"""
        try:
            if not openai.api_key:
                logger.warning("OpenAI API key not found, using fallback explanation")
                return self._generate_fallback_explanation(np.array([[0]]))
            
            # Create prompt for OpenAI
            prompt = f"""
            As a medical AI assistant, explain this patient's diagnosis in plain language.
            
            Patient Data:
            {json.dumps(patient_data, indent=2)}
            
            Diagnosis: {self.class_names[prediction]}
            Confidence: {confidence_score:.1%}
            
            Please provide:
            1. A clear explanation of the diagnosis
            2. Key factors that led to this conclusion
            3. Risk factors to consider
            4. Recommended next steps
            
            Format your response as JSON with these fields:
            - explanation: plain language explanation
            - key_factors: list of important factors
            - risk_factors: list of risk factors
            - recommendations: list of next steps
            """
            
            response = await openai.ChatCompletion.acreate(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are a medical AI assistant providing clear, accurate explanations of diagnoses."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3,
                max_tokens=1000
            )
            
            # Parse OpenAI response
            try:
                openai_explanation = json.loads(response.choices[0].message.content)
            except json.JSONDecodeError:
                # Fallback if JSON parsing fails
                openai_explanation = {
                    "explanation": response.choices[0].message.content,
                    "key_factors": [],
                    "risk_factors": [],
                    "recommendations": []
                }
            
            return {
                'feature_contributions': {},  # OpenAI doesn't provide feature contributions
                'visualization_data': {
                    'openai_explanation': openai_explanation,
                    'model_used': 'gpt-4'
                }
            }
            
        except Exception as e:
            logger.error(f"Error generating OpenAI explanation: {e}")
            return self._generate_fallback_explanation(np.array([[0]]))
    
    def _prepare_patient_data(self, patient_data: Dict[str, Any]) -> np.ndarray:
        """Prepare patient data for model input"""
        # Convert patient data to feature vector
        feature_vector = []
        
        for feature in self.feature_names:
            if feature in patient_data:
                feature_vector.append(patient_data[feature])
            else:
                # Use default values for missing features
                feature_vector.append(0)
        
        # Scale the features
        X_scaled = self.scaler.transform([feature_vector])
        return X_scaled
    
    def _generate_lime_explanation(self, X_patient: np.ndarray) -> Dict[str, Any]:
        """Generate LIME explanation"""
        try:
            # Generate LIME explanation
            lime_exp = self.explainer.explain_instance(
                X_patient[0], 
                self.model.predict_proba,
                num_features=len(self.feature_names),
                top_labels=1
            )
            
            # Extract feature contributions
            feature_contributions = {}
            for feature, weight in lime_exp.as_list():
                feature_contributions[feature] = weight
            
            # Generate visualization data
            visualization_data = {
                'lime_weights': lime_exp.as_list(),
                'lime_score': lime_exp.score,
                'lime_local_pred': lime_exp.local_pred,
                'lime_local_exp': lime_exp.local_exp
            }
            
            return {
                'feature_contributions': feature_contributions,
                'visualization_data': visualization_data
            }
            
        except Exception as e:
            logger.error(f"Error generating LIME explanation: {e}")
            return self._generate_fallback_explanation(X_patient)
    
    def _generate_shap_explanation(self, X_patient: np.ndarray) -> Dict[str, Any]:
        """Generate SHAP explanation"""
        try:
            # Generate SHAP values
            shap_values = self.shap_explainer.shap_values(X_patient)
            
            # Extract feature contributions
            feature_contributions = {}
            for i, feature in enumerate(self.feature_names):
                feature_contributions[feature] = shap_values[0][i]
            
            # Generate visualization data
            visualization_data = {
                'shap_values': shap_values.tolist(),
                'base_value': self.shap_explainer.expected_value,
                'feature_names': self.feature_names
            }
            
            return {
                'feature_contributions': feature_contributions,
                'visualization_data': visualization_data
            }
            
        except Exception as e:
            logger.error(f"Error generating SHAP explanation: {e}")
            return self._generate_fallback_explanation(X_patient)
    
    def _generate_feature_importance_explanation(self, X_patient: np.ndarray) -> Dict[str, Any]:
        """Generate feature importance explanation"""
        try:
            # Get feature importances
            feature_importances = self.model.feature_importances_
            
            # Weight by actual feature values
            feature_contributions = {}
            for i, feature in enumerate(self.feature_names):
                feature_contributions[feature] = feature_importances[i] * X_patient[0][i]
            
            # Generate visualization data
            visualization_data = {
                'feature_importances': feature_importances.tolist(),
                'feature_values': X_patient[0].tolist(),
                'feature_names': self.feature_names
            }
            
            return {
                'feature_contributions': feature_contributions,
                'visualization_data': visualization_data
            }
            
        except Exception as e:
            logger.error(f"Error generating feature importance explanation: {e}")
            return self._generate_fallback_explanation(X_patient)
    
    def _generate_fallback_explanation(self, X_patient: np.ndarray) -> Dict[str, Any]:
        """Generate fallback explanation when other methods fail"""
        feature_contributions = {}
        for i, feature in enumerate(self.feature_names):
            feature_contributions[feature] = X_patient[0][i] * 0.1  # Simple fallback
        
        return {
            'feature_contributions': feature_contributions,
            'visualization_data': {}
        }
    
    def _generate_plain_language_explanation(self, patient_data: Dict[str, Any],
                                           prediction: int, explanation: Dict[str, Any],
                                           confidence_score: float) -> str:
        """Generate plain language explanation for patients"""
        prediction_name = self.class_names[prediction]
        
        # Get top contributing factors
        sorted_features = sorted(
            explanation['feature_contributions'].items(),
            key=lambda x: abs(x[1]),
            reverse=True
        )[:5]
        
        explanation_text = f"Based on your symptoms and vital signs, our AI system has classified your condition as '{prediction_name}' with {confidence_score:.1%} confidence. "
        
        if prediction == 0:  # Healthy
            explanation_text += "Your symptoms appear to be within normal ranges."
        elif prediction == 1:  # Mild
            explanation_text += "You may have a mild illness that typically resolves on its own."
        elif prediction == 2:  # Moderate
            explanation_text += "You have symptoms that may require medical attention."
        else:  # Severe
            explanation_text += "You have symptoms that require immediate medical attention."
        
        # Add contributing factors
        if sorted_features:
            explanation_text += " The main factors contributing to this assessment are: "
            factors = []
            for feature, contribution in sorted_features:
                if abs(contribution) > 0.01:  # Only mention significant factors
                    factor_name = self._get_patient_friendly_name(feature)
                    if contribution > 0:
                        factors.append(f"elevated {factor_name}")
                    else:
                        factors.append(f"normal {factor_name}")
            
            explanation_text += ", ".join(factors[:3]) + "."
        
        return explanation_text
    
    def _get_patient_friendly_name(self, feature: str) -> str:
        """Convert technical feature names to patient-friendly terms"""
        friendly_names = {
            'temperature': 'body temperature',
            'blood_pressure_systolic': 'systolic blood pressure',
            'blood_pressure_diastolic': 'diastolic blood pressure',
            'heart_rate': 'heart rate',
            'respiratory_rate': 'breathing rate',
            'oxygen_saturation': 'oxygen levels',
            'pain_level': 'pain level',
            'fatigue_level': 'fatigue level',
            'cough_present': 'cough',
            'fever_present': 'fever',
            'shortness_of_breath': 'shortness of breath',
            'chest_pain': 'chest pain',
            'headache': 'headache',
            'nausea': 'nausea',
            'diarrhea': 'diarrhea',
            'loss_of_appetite': 'loss of appetite',
            'muscle_aches': 'muscle aches',
            'sore_throat': 'sore throat'
        }
        return friendly_names.get(feature, feature.replace('_', ' '))
    
    def _generate_recommendations(self, prediction: int, explanation: Dict[str, Any]) -> List[str]:
        """Generate recommendations based on prediction and explanation"""
        recommendations = []
        
        if prediction == 0:  # Healthy
            recommendations = [
                "Continue monitoring your symptoms",
                "Maintain good hygiene practices",
                "Get adequate rest and hydration"
            ]
        elif prediction == 1:  # Mild
            recommendations = [
                "Rest and stay hydrated",
                "Monitor symptoms for worsening",
                "Consider over-the-counter medications for symptom relief",
                "Contact healthcare provider if symptoms persist beyond 3-5 days"
            ]
        elif prediction == 2:  # Moderate
            recommendations = [
                "Schedule an appointment with your healthcare provider",
                "Monitor symptoms closely",
                "Rest and avoid strenuous activities",
                "Seek immediate care if symptoms worsen"
            ]
        else:  # Severe
            recommendations = [
                "Seek immediate medical attention",
                "Call emergency services if experiencing severe symptoms",
                "Do not delay seeking care",
                "Follow up with healthcare provider after emergency care"
            ]
        
        return recommendations
    
    def _identify_risk_factors(self, patient_data: Dict[str, Any], 
                              explanation: Dict[str, Any]) -> List[str]:
        """Identify risk factors from patient data and explanation"""
        risk_factors = []
        
        # Check for high-risk values
        if patient_data.get('temperature', 0) > 103:
            risk_factors.append("High fever (>103°F)")
        
        if patient_data.get('blood_pressure_systolic', 0) > 180:
            risk_factors.append("High systolic blood pressure")
        
        if patient_data.get('heart_rate', 0) > 100:
            risk_factors.append("Elevated heart rate")
        
        if patient_data.get('oxygen_saturation', 100) < 95:
            risk_factors.append("Low oxygen saturation")
        
        if patient_data.get('shortness_of_breath', 0) == 1:
            risk_factors.append("Shortness of breath")
        
        if patient_data.get('chest_pain', 0) == 1:
            risk_factors.append("Chest pain")
        
        # Add age-related risk factors
        age = patient_data.get('age', 0)
        if age > 65:
            risk_factors.append("Advanced age (>65)")
        elif age < 5:
            risk_factors.append("Young age (<5)")
        
        return risk_factors
    
    def _generate_decision_path(self, prediction: int, explanation: Dict[str, Any]) -> List[str]:
        """Generate decision path explanation"""
        decision_path = []
        
        # Sort features by absolute contribution
        sorted_features = sorted(
            explanation['feature_contributions'].items(),
            key=lambda x: abs(x[1]),
            reverse=True
        )
        
        for feature, contribution in sorted_features[:5]:
            if abs(contribution) > 0.01:
                feature_name = self._get_patient_friendly_name(feature)
                if contribution > 0:
                    decision_path.append(f"Elevated {feature_name} contributed to diagnosis")
                else:
                    decision_path.append(f"Normal {feature_name} supported diagnosis")
        
        return decision_path
    
    def _generate_confidence_breakdown(self, prediction_proba: np.ndarray, 
                                     explanation: Dict[str, Any]) -> Dict[str, float]:
        """Generate confidence breakdown by class"""
        confidence_breakdown = {}
        
        for i, class_name in enumerate(self.class_names):
            confidence_breakdown[class_name] = float(prediction_proba[i])
        
        return confidence_breakdown
    
    def generate_visualization(self, explanation_result: ExplanationResult) -> Dict[str, Any]:
        """Generate visualization data for the explanation"""
        try:
            # Create feature importance plot data
            features = list(explanation_result.feature_contributions.keys())
            values = list(explanation_result.feature_contributions.values())
            
            # Sort by absolute value
            sorted_data = sorted(zip(features, values), key=lambda x: abs(x[1]), reverse=True)
            top_features = [x[0] for x in sorted_data[:10]]
            top_values = [x[1] for x in sorted_data[:10]]
            
            visualization_data = {
                'feature_importance': {
                    'features': top_features,
                    'values': top_values,
                    'colors': ['red' if v > 0 else 'blue' for v in top_values]
                },
                'confidence_breakdown': explanation_result.confidence_breakdown,
                'decision_path': explanation_result.decision_path,
                'risk_factors': explanation_result.risk_factors,
                'recommendations': explanation_result.recommendations
            }
            
            return visualization_data
            
        except Exception as e:
            logger.error(f"Error generating visualization: {e}")
            return {}
    
    def get_model_info(self) -> Dict[str, Any]:
        """Get information about the model"""
        return {
            'model_type': type(self.model).__name__,
            'feature_count': len(self.feature_names),
            'class_count': len(self.class_names),
            'classes': self.class_names,
            'features': self.feature_names,
            'explanation_types': [e.value for e in ExplanationType],
            'openai_available': bool(openai.api_key)
        }

# Global instance for easy access
model_explainer = ModelExplainer()

# Convenience functions
def explain_diagnosis(patient_data: Dict[str, Any], 
                     explanation_type: str = 'lime') -> ExplanationResult:
    """Explain a diagnosis for patient data"""
    exp_type = ExplanationType(explanation_type)
    return model_explainer.explain_prediction(patient_data, exp_type)

def get_explanation_visualization(explanation_result: ExplanationResult) -> Dict[str, Any]:
    """Generate visualization data for explanation"""
    return model_explainer.generate_visualization(explanation_result)

def get_model_information() -> Dict[str, Any]:
    """Get information about the AI model"""
    return model_explainer.get_model_info()

if __name__ == "__main__":
    # Example usage
    print("AI Model Explainer Service")
    print("=" * 40)
    
    # Example patient data
    patient_data = {
        'age': 35,
        'gender': 1,
        'temperature': 101.2,
        'blood_pressure_systolic': 130,
        'blood_pressure_diastolic': 85,
        'heart_rate': 88,
        'respiratory_rate': 18,
        'oxygen_saturation': 97,
        'pain_level': 6,
        'fatigue_level': 7,
        'cough_present': 1,
        'fever_present': 1,
        'shortness_of_breath': 0,
        'chest_pain': 0,
        'headache': 1,
        'nausea': 0,
        'diarrhea': 0,
        'loss_of_appetite': 1,
        'muscle_aches': 1,
        'sore_throat': 0
    }
    
    # Generate explanation
    explanation = explain_diagnosis(patient_data, 'lime')
    
    print(f"Diagnosis: {explanation.plain_language_explanation}")
    print(f"Confidence: {explanation.confidence_score:.1%}")
    print(f"Risk Factors: {', '.join(explanation.risk_factors)}")
    print(f"Recommendations: {', '.join(explanation.recommendations)}")
    
    # Generate visualization
    viz_data = get_explanation_visualization(explanation)
    print(f"Visualization data generated: {len(viz_data)} components") 