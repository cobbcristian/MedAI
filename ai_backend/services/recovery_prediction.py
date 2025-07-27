import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier
from sklearn.preprocessing import StandardScaler, LabelEncoder
import joblib
import time
from typing import Dict, List, Any, Optional
import logging
from models.response_models import RecoveryPrediction

logger = logging.getLogger(__name__)

class RecoveryPredictionService:
    def __init__(self):
        self.model_status = "loading"
        self.recovery_model = None
        self.complication_model = None
        self.scaler = None
        self.label_encoder = None
        self.symptom_encoder = None
        self.diagnosis_encoder = None
        self.load_models()
        
    def load_models(self):
        """Load pre-trained recovery prediction models"""
        try:
            # Initialize models (in production, these would be pre-trained)
            self.recovery_model = RandomForestRegressor(n_estimators=100, random_state=42)
            self.complication_model = RandomForestClassifier(n_estimators=100, random_state=42)
            self.scaler = StandardScaler()
            self.label_encoder = LabelEncoder()
            self.symptom_encoder = LabelEncoder()
            self.diagnosis_encoder = LabelEncoder()
            
            # Train on synthetic data for demo (in production, use real medical data)
            self._train_models()
            
            self.model_status = "loaded"
            logger.info("Recovery prediction models loaded successfully")
            
        except Exception as e:
            self.model_status = "error"
            logger.error(f"Failed to load recovery prediction models: {e}")
    
    def _train_models(self):
        """Train models on synthetic data for demonstration"""
        # Generate synthetic training data
        n_samples = 1000
        np.random.seed(42)
        
        # Generate synthetic features
        ages = np.random.normal(50, 15, n_samples)
        ages = np.clip(ages, 18, 90)
        
        genders = np.random.choice(['male', 'female'], n_samples)
        
        # Common symptoms and diagnoses
        symptoms_list = [
            'fever', 'cough', 'shortness of breath', 'chest pain', 'fatigue',
            'headache', 'nausea', 'vomiting', 'diarrhea', 'abdominal pain',
            'joint pain', 'swelling', 'rash', 'dizziness', 'weakness'
        ]
        
        diagnoses_list = [
            'pneumonia', 'influenza', 'hypertension', 'diabetes', 'heart disease',
            'kidney disease', 'liver disease', 'cancer', 'fracture', 'infection',
            'allergic reaction', 'dehydration', 'anemia', 'thyroid disorder'
        ]
        
        # Generate synthetic data
        data = []
        for i in range(n_samples):
            # Random symptoms (1-5 symptoms per patient)
            num_symptoms = np.random.randint(1, 6)
            symptoms = np.random.choice(symptoms_list, num_symptoms, replace=False)
            symptoms_text = ', '.join(symptoms)
            
            # Random diagnosis
            diagnosis = np.random.choice(diagnoses_list)
            
            # Generate features that affect recovery
            age = ages[i]
            gender = genders[i]
            
            # Scan analysis features (synthetic)
            scan_confidence = np.random.uniform(0.1, 0.9)
            scan_severity = np.random.choice(['low', 'medium', 'high', 'critical'], p=[0.4, 0.3, 0.2, 0.1])
            
            # Bloodwork features (synthetic)
            lab_abnormalities = np.random.randint(0, 5)
            lab_urgency = np.random.choice(['low', 'medium', 'high', 'critical'], p=[0.5, 0.3, 0.15, 0.05])
            
            # Visit frequency
            visit_frequency = np.random.randint(1, 10)
            
            # Calculate recovery time based on features (synthetic rules)
            base_recovery = self._calculate_base_recovery(diagnosis, age, scan_severity, lab_urgency)
            recovery_days = max(1, int(base_recovery + np.random.normal(0, 2)))
            
            # Calculate complication risk
            complication_risk = self._calculate_complication_risk(diagnosis, age, scan_severity, lab_urgency, visit_frequency)
            
            data.append({
                'age': age,
                'gender': gender,
                'symptoms': symptoms_text,
                'diagnosis': diagnosis,
                'scan_confidence': scan_confidence,
                'scan_severity': scan_severity,
                'lab_abnormalities': lab_abnormalities,
                'lab_urgency': lab_urgency,
                'visit_frequency': visit_frequency,
                'recovery_days': recovery_days,
                'complication_risk': complication_risk
            })
        
        # Convert to DataFrame
        df = pd.DataFrame(data)
        
        # Prepare features for training
        X = self._prepare_features(df)
        y_recovery = df['recovery_days'].values
        y_complication = (df['complication_risk'] > 0.5).astype(int)  # Binary classification
        
        # Fit scaler and encoders
        self.scaler.fit(X)
        X_scaled = self.scaler.transform(X)
        
        # Train models
        self.recovery_model.fit(X_scaled, y_recovery)
        self.complication_model.fit(X_scaled, y_complication)
        
        logger.info("Models trained on synthetic data")
    
    def _calculate_base_recovery(self, diagnosis: str, age: float, scan_severity: str, lab_urgency: str) -> float:
        """Calculate base recovery time based on diagnosis and severity"""
        base_times = {
            'pneumonia': 14,
            'influenza': 7,
            'hypertension': 30,
            'diabetes': 60,
            'heart disease': 45,
            'kidney disease': 90,
            'liver disease': 120,
            'cancer': 180,
            'fracture': 42,
            'infection': 10,
            'allergic reaction': 3,
            'dehydration': 2,
            'anemia': 30,
            'thyroid disorder': 60
        }
        
        base_time = base_times.get(diagnosis, 14)
        
        # Adjust for age
        if age > 65:
            base_time *= 1.3
        elif age > 50:
            base_time *= 1.1
        
        # Adjust for scan severity
        severity_multipliers = {'low': 0.8, 'medium': 1.0, 'high': 1.3, 'critical': 1.6}
        base_time *= severity_multipliers.get(scan_severity, 1.0)
        
        # Adjust for lab urgency
        urgency_multipliers = {'low': 0.9, 'medium': 1.0, 'high': 1.2, 'critical': 1.4}
        base_time *= urgency_multipliers.get(lab_urgency, 1.0)
        
        return base_time
    
    def _calculate_complication_risk(self, diagnosis: str, age: float, scan_severity: str, lab_urgency: str, visit_frequency: int) -> float:
        """Calculate complication risk based on various factors"""
        base_risks = {
            'pneumonia': 0.3,
            'influenza': 0.1,
            'hypertension': 0.4,
            'diabetes': 0.5,
            'heart disease': 0.6,
            'kidney disease': 0.7,
            'liver disease': 0.8,
            'cancer': 0.9,
            'fracture': 0.2,
            'infection': 0.3,
            'allergic reaction': 0.1,
            'dehydration': 0.1,
            'anemia': 0.3,
            'thyroid disorder': 0.2
        }
        
        base_risk = base_risks.get(diagnosis, 0.3)
        
        # Adjust for age
        if age > 65:
            base_risk *= 1.4
        elif age > 50:
            base_risk *= 1.2
        
        # Adjust for scan severity
        severity_multipliers = {'low': 0.7, 'medium': 1.0, 'high': 1.3, 'critical': 1.6}
        base_risk *= severity_multipliers.get(scan_severity, 1.0)
        
        # Adjust for lab urgency
        urgency_multipliers = {'low': 0.8, 'medium': 1.0, 'high': 1.3, 'critical': 1.5}
        base_risk *= urgency_multipliers.get(lab_urgency, 1.0)
        
        # Adjust for visit frequency (more visits = higher risk)
        base_risk *= (1 + visit_frequency * 0.05)
        
        return min(0.95, base_risk)  # Cap at 95%
    
    def _prepare_features(self, df: pd.DataFrame) -> np.ndarray:
        """Prepare features for model input"""
        features = []
        
        for _, row in df.iterrows():
            # Age (normalized)
            age_norm = (row['age'] - 50) / 15
            
            # Gender (encoded)
            gender_encoded = 1 if row['gender'] == 'male' else 0
            
            # Scan features
            scan_confidence = row['scan_confidence']
            scan_severity_encoded = {'low': 0, 'medium': 1, 'high': 2, 'critical': 3}[row['scan_severity']]
            
            # Lab features
            lab_abnormalities = row['lab_abnormalities']
            lab_urgency_encoded = {'low': 0, 'medium': 1, 'high': 2, 'critical': 3}[row['lab_urgency']]
            
            # Visit frequency
            visit_frequency = row['visit_frequency']
            
            # Diagnosis (encoded)
            diagnosis_encoded = self.diagnosis_encoder.fit_transform([row['diagnosis']])[0]
            
            # Symptoms (count and severity)
            symptoms_count = len(row['symptoms'].split(', '))
            
            feature_vector = [
                age_norm, gender_encoded, scan_confidence, scan_severity_encoded,
                lab_abnormalities, lab_urgency_encoded, visit_frequency,
                diagnosis_encoded, symptoms_count
            ]
            
            features.append(feature_vector)
        
        return np.array(features)
    
    async def predict_recovery(
        self,
        symptoms: str,
        diagnosis: str,
        scan_analysis: Optional[Dict] = None,
        bloodwork_analysis: Optional[Dict] = None,
        patient_age: Optional[int] = None,
        patient_gender: Optional[str] = None,
        visit_frequency: int = 1
    ) -> RecoveryPrediction:
        """
        Predict recovery time and complication risk
        """
        try:
            # Prepare input features
            features = self._prepare_prediction_features(
                symptoms, diagnosis, scan_analysis, bloodwork_analysis,
                patient_age, patient_gender, visit_frequency
            )
            
            # Scale features
            features_scaled = self.scaler.transform([features])
            
            # Make predictions
            recovery_days = self.recovery_model.predict(features_scaled)[0]
            complication_prob = self.complication_model.predict_proba(features_scaled)[0][1]
            
            # Calculate confidence intervals
            confidence_interval = self._calculate_confidence_interval(recovery_days)
            
            # Generate risk factors
            risk_factors = self._identify_risk_factors(
                symptoms, diagnosis, scan_analysis, bloodwork_analysis,
                patient_age, patient_gender, visit_frequency
            )
            
            # Generate recommendations
            recommendations = self._generate_recovery_recommendations(
                diagnosis, recovery_days, complication_prob, risk_factors
            )
            
            # Generate follow-up schedule
            follow_up_schedule = self._generate_follow_up_schedule(
                diagnosis, recovery_days, complication_prob
            )
            
            return RecoveryPrediction(
                estimated_recovery_days=max(1, int(recovery_days)),
                confidence_interval=confidence_interval,
                complication_risk=float(complication_prob),
                risk_factors=risk_factors,
                recommendations=recommendations,
                follow_up_schedule=follow_up_schedule
            )
            
        except Exception as e:
            logger.error(f"Error predicting recovery: {e}")
            raise
    
    def _prepare_prediction_features(
        self,
        symptoms: str,
        diagnosis: str,
        scan_analysis: Optional[Dict],
        bloodwork_analysis: Optional[Dict],
        patient_age: Optional[int],
        patient_gender: Optional[str],
        visit_frequency: int
    ) -> np.ndarray:
        """Prepare features for prediction"""
        # Age (normalized, default to 50 if not provided)
        age = patient_age if patient_age else 50
        age_norm = (age - 50) / 15
        
        # Gender (encoded)
        gender_encoded = 1 if patient_gender == 'male' else 0
        
        # Scan features
        scan_confidence = scan_analysis.get('overall_confidence', 0.5) if scan_analysis else 0.5
        scan_severity = self._extract_scan_severity(scan_analysis)
        scan_severity_encoded = {'low': 0, 'medium': 1, 'high': 2, 'critical': 3}[scan_severity]
        
        # Lab features
        lab_abnormalities = self._count_lab_abnormalities(bloodwork_analysis)
        lab_urgency = self._extract_lab_urgency(bloodwork_analysis)
        lab_urgency_encoded = {'low': 0, 'medium': 1, 'high': 2, 'critical': 3}[lab_urgency]
        
        # Diagnosis (encoded)
        diagnosis_encoded = self.diagnosis_encoder.fit_transform([diagnosis])[0]
        
        # Symptoms (count)
        symptoms_count = len(symptoms.split(',')) if symptoms else 0
        
        return np.array([
            age_norm, gender_encoded, scan_confidence, scan_severity_encoded,
            lab_abnormalities, lab_urgency_encoded, visit_frequency,
            diagnosis_encoded, symptoms_count
        ])
    
    def _extract_scan_severity(self, scan_analysis: Optional[Dict]) -> str:
        """Extract severity from scan analysis"""
        if not scan_analysis or 'conditions' not in scan_analysis:
            return 'medium'
        
        conditions = scan_analysis['conditions']
        if not conditions:
            return 'low'
        
        # Find highest severity
        severities = [c.get('severity', 'low') for c in conditions]
        severity_levels = {'low': 0, 'medium': 1, 'high': 2, 'critical': 3}
        max_severity = max(severities, key=lambda x: severity_levels.get(x, 0))
        
        return max_severity
    
    def _count_lab_abnormalities(self, bloodwork_analysis: Optional[Dict]) -> int:
        """Count abnormal lab values"""
        if not bloodwork_analysis or 'lab_values' not in bloodwork_analysis:
            return 0
        
        lab_values = bloodwork_analysis['lab_values']
        abnormal_count = sum(1 for lv in lab_values if lv.get('status') in ['high', 'low', 'critical'])
        
        return abnormal_count
    
    def _extract_lab_urgency(self, bloodwork_analysis: Optional[Dict]) -> str:
        """Extract urgency level from bloodwork analysis"""
        if not bloodwork_analysis:
            return 'low'
        
        return bloodwork_analysis.get('urgency_level', 'low')
    
    def _calculate_confidence_interval(self, recovery_days: float) -> Dict[str, int]:
        """Calculate confidence interval for recovery prediction"""
        # Simple confidence interval based on prediction uncertainty
        uncertainty = recovery_days * 0.2  # 20% uncertainty
        
        return {
            "lower": max(1, int(recovery_days - uncertainty)),
            "upper": int(recovery_days + uncertainty)
        }
    
    def _identify_risk_factors(
        self,
        symptoms: str,
        diagnosis: str,
        scan_analysis: Optional[Dict],
        bloodwork_analysis: Optional[Dict],
        patient_age: Optional[int],
        patient_gender: Optional[str],
        visit_frequency: int
    ) -> List[str]:
        """Identify risk factors for complications"""
        risk_factors = []
        
        # Age-related risks
        if patient_age and patient_age > 65:
            risk_factors.append("Advanced age (>65 years)")
        elif patient_age and patient_age > 50:
            risk_factors.append("Middle age (>50 years)")
        
        # Diagnosis-specific risks
        high_risk_diagnoses = ['heart disease', 'kidney disease', 'liver disease', 'cancer', 'diabetes']
        if diagnosis.lower() in high_risk_diagnoses:
            risk_factors.append(f"High-risk diagnosis: {diagnosis}")
        
        # Scan-based risks
        if scan_analysis and scan_analysis.get('overall_confidence', 0) > 0.8:
            risk_factors.append("High-confidence scan abnormalities detected")
        
        # Lab-based risks
        if bloodwork_analysis and bloodwork_analysis.get('urgency_level') in ['high', 'critical']:
            risk_factors.append("Critical lab values detected")
        
        # Visit frequency risk
        if visit_frequency > 5:
            risk_factors.append("High visit frequency (may indicate complex case)")
        
        # Symptom-based risks
        severe_symptoms = ['chest pain', 'shortness of breath', 'severe pain', 'unconsciousness']
        if any(symptom in symptoms.lower() for symptom in severe_symptoms):
            risk_factors.append("Severe symptoms present")
        
        return risk_factors
    
    def _generate_recovery_recommendations(
        self,
        diagnosis: str,
        recovery_days: float,
        complication_risk: float,
        risk_factors: List[str]
    ) -> List[str]:
        """Generate recovery recommendations"""
        recommendations = []
        
        # General recommendations
        if recovery_days > 30:
            recommendations.append("Long-term recovery plan recommended")
        elif recovery_days > 14:
            recommendations.append("Moderate recovery period expected")
        else:
            recommendations.append("Short recovery period expected")
        
        # Complication risk recommendations
        if complication_risk > 0.7:
            recommendations.append("High complication risk - close monitoring required")
        elif complication_risk > 0.4:
            recommendations.append("Moderate complication risk - regular follow-up recommended")
        else:
            recommendations.append("Low complication risk - standard follow-up")
        
        # Diagnosis-specific recommendations
        if diagnosis.lower() == 'pneumonia':
            recommendations.extend([
                "Complete antibiotic course",
                "Monitor oxygen saturation",
                "Follow up chest X-ray in 4-6 weeks"
            ])
        elif diagnosis.lower() == 'diabetes':
            recommendations.extend([
                "Blood glucose monitoring",
                "Diet and exercise counseling",
                "Regular HbA1c testing"
            ])
        elif diagnosis.lower() == 'heart disease':
            recommendations.extend([
                "Cardiac rehabilitation program",
                "Medication compliance monitoring",
                "Regular cardiac follow-up"
            ])
        
        # Risk factor-based recommendations
        if "Advanced age" in risk_factors:
            recommendations.append("Geriatric assessment recommended")
        
        if "Critical lab values" in risk_factors:
            recommendations.append("Immediate medical attention may be required")
        
        return recommendations
    
    def _generate_follow_up_schedule(
        self,
        diagnosis: str,
        recovery_days: float,
        complication_risk: float
    ) -> Dict[str, str]:
        """Generate follow-up schedule"""
        schedule = {}
        
        # Immediate follow-up
        if complication_risk > 0.6:
            schedule["Immediate"] = "Within 24-48 hours"
        elif complication_risk > 0.3:
            schedule["Short-term"] = "Within 1 week"
        else:
            schedule["Short-term"] = "Within 2 weeks"
        
        # Mid-term follow-up
        if recovery_days > 30:
            schedule["Mid-term"] = "Monthly for 3 months"
        else:
            schedule["Mid-term"] = "2-4 weeks"
        
        # Long-term follow-up
        if diagnosis.lower() in ['cancer', 'heart disease', 'diabetes']:
            schedule["Long-term"] = "Every 3-6 months"
        else:
            schedule["Long-term"] = "As needed"
        
        return schedule
    
    async def get_model_status(self) -> Dict[str, Any]:
        """Get model status information"""
        return {
            "model_name": "Recovery Prediction Model",
            "status": self.model_status,
            "version": "1.0.0",
            "last_updated": "2024-01-01"
        } 