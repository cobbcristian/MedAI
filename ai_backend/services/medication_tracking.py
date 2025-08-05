import pandas as pd
import numpy as np
import time
from typing import Dict, List, Any, Optional
import logging
from models.response_models import MedicationImpact, EnhancedMedicalRecord

logger = logging.getLogger(__name__)

class MedicationTrackingService:
    def __init__(self):
        self.model_status = "loaded"
        self.medication_database = self._load_medication_database()
        self.drug_interactions = self._load_drug_interactions()
        self.side_effect_patterns = self._load_side_effect_patterns()
        self.effectiveness_metrics = self._load_effectiveness_metrics()
        
    def _load_medication_database(self) -> Dict[str, Dict[str, Any]]:
        """Load comprehensive medication database"""
        return {
            "Lisinopril": {
                "category": "ACE Inhibitor",
                "indications": ["Hypertension", "Heart Failure", "Kidney Protection"],
                "common_side_effects": ["Dry cough", "Dizziness", "Fatigue", "Headache"],
                "serious_side_effects": ["Angioedema", "Hyperkalemia", "Kidney injury"],
                "effectiveness_indicators": ["Blood pressure reduction", "Proteinuria reduction"],
                "dosage_range": {"min": 2.5, "max": 40, "unit": "mg"},
                "life_impact": {
                    "positive": ["Reduces cardiovascular risk", "Protects kidneys", "Improves survival"],
                    "negative": ["May cause cough", "Risk of hyperkalemia"]
                }
            },
            "Metformin": {
                "category": "Biguanide",
                "indications": ["Type 2 Diabetes", "Prediabetes", "PCOS"],
                "common_side_effects": ["GI upset", "Diarrhea", "Nausea", "Metallic taste"],
                "serious_side_effects": ["Lactic acidosis", "Vitamin B12 deficiency"],
                "effectiveness_indicators": ["HbA1c reduction", "Weight loss", "Insulin sensitivity"],
                "dosage_range": {"min": 500, "max": 2550, "unit": "mg"},
                "life_impact": {
                    "positive": ["Reduces diabetes complications", "May improve longevity", "Weight management"],
                    "negative": ["GI side effects", "B12 deficiency risk"]
                }
            },
            "Atorvastatin": {
                "category": "Statin",
                "indications": ["High Cholesterol", "Cardiovascular Disease Prevention"],
                "common_side_effects": ["Muscle pain", "GI upset", "Headache", "Insomnia"],
                "serious_side_effects": ["Rhabdomyolysis", "Liver injury", "Diabetes risk"],
                "effectiveness_indicators": ["LDL reduction", "Cardiovascular event reduction"],
                "dosage_range": {"min": 10, "max": 80, "unit": "mg"},
                "life_impact": {
                    "positive": ["Reduces heart attack risk", "Improves survival", "Anti-inflammatory"],
                    "negative": ["Muscle pain", "Diabetes risk increase"]
                }
            },
            "Amlodipine": {
                "category": "Calcium Channel Blocker",
                "indications": ["Hypertension", "Angina", "Coronary Artery Disease"],
                "common_side_effects": ["Edema", "Dizziness", "Flushing", "Headache"],
                "serious_side_effects": ["Severe hypotension", "Heart failure exacerbation"],
                "effectiveness_indicators": ["Blood pressure control", "Angina reduction"],
                "dosage_range": {"min": 2.5, "max": 10, "unit": "mg"},
                "life_impact": {
                    "positive": ["Effective BP control", "Reduces stroke risk", "Well tolerated"],
                    "negative": ["Peripheral edema", "May cause dizziness"]
                }
            },
            "Omeprazole": {
                "category": "Proton Pump Inhibitor",
                "indications": ["GERD", "Peptic Ulcer", "Esophagitis"],
                "common_side_effects": ["Headache", "Diarrhea", "Abdominal pain"],
                "serious_side_effects": ["Clostridium difficile", "Bone fractures", "Kidney injury"],
                "effectiveness_indicators": ["Symptom relief", "Healing of ulcers"],
                "dosage_range": {"min": 10, "max": 40, "unit": "mg"},
                "life_impact": {
                    "positive": ["Effective acid suppression", "Heals ulcers", "Prevents complications"],
                    "negative": ["Long-term use risks", "Nutrient absorption issues"]
                }
            }
        }
    
    def _load_drug_interactions(self) -> Dict[str, List[str]]:
        """Load drug interaction database"""
        return {
            "Lisinopril": ["Potassium supplements", "NSAIDs", "Lithium", "Diuretics"],
            "Metformin": ["Alcohol", "Contrast dye", "Insulin", "Sulfonylureas"],
            "Atorvastatin": ["Grapefruit juice", "Warfarin", "Digoxin", "Cyclosporine"],
            "Amlodipine": ["Grapefruit juice", "Simvastatin", "Digoxin", "Warfarin"],
            "Omeprazole": ["Iron supplements", "Vitamin B12", "Clopidogrel", "Digoxin"]
        }
    
    def _load_side_effect_patterns(self) -> Dict[str, Dict[str, Any]]:
        """Load side effect analysis patterns"""
        return {
            "dose_dependent": ["Muscle pain", "Edema", "GI upset", "Dizziness"],
            "time_dependent": ["Dry cough", "Fatigue", "Headache", "Insomnia"],
            "serious_indicators": ["Severe muscle pain", "Swelling", "Chest pain", "Yellow skin"],
            "monitoring_required": ["Liver function", "Kidney function", "Blood pressure", "Blood sugar"]
        }
    
    def _load_effectiveness_metrics(self) -> Dict[str, Dict[str, Any]]:
        """Load effectiveness measurement criteria"""
        return {
            "blood_pressure": {
                "target": "<140/90",
                "improvement": ">10 mmHg reduction",
                "monitoring": "Weekly measurements"
            },
            "diabetes": {
                "target": "HbA1c <7%",
                "improvement": ">0.5% reduction",
                "monitoring": "Every 3 months"
            },
            "cholesterol": {
                "target": "LDL <100 mg/dL",
                "improvement": ">30% reduction",
                "monitoring": "Every 6 months"
            },
            "kidney_function": {
                "target": "Creatinine stable",
                "improvement": "No increase >20%",
                "monitoring": "Every 3 months"
            }
        }
    
    async def analyze_medication_history(self, medication_data: List[Dict[str, Any]]) -> List[MedicationImpact]:
        """Analyze medication history and provide comprehensive assessment"""
        medication_impacts = []
        
        for med_data in medication_data:
            impact = await self._analyze_single_medication(med_data)
            medication_impacts.append(impact)
        
        return medication_impacts
    
    async def _analyze_single_medication(self, med_data: Dict[str, Any]) -> MedicationImpact:
        """Analyze a single medication's impact"""
        medication_name = med_data.get("name", "")
        dosage = med_data.get("dosage", "")
        start_date = med_data.get("start_date", "")
        end_date = med_data.get("end_date")
        reason = med_data.get("reason", "")
        effectiveness = med_data.get("effectiveness", "")
        side_effects = med_data.get("side_effects", [])
        
        # Get medication info from database
        med_info = self.medication_database.get(medication_name, {})
        
        # Analyze effectiveness
        effectiveness_analysis = self._analyze_effectiveness(medication_name, effectiveness, med_info)
        
        # Analyze side effects
        side_effect_analysis = self._analyze_side_effects(medication_name, side_effects, med_info)
        
        # Generate AI recommendation
        ai_recommendation = self._generate_ai_recommendation(
            medication_name, effectiveness_analysis, side_effect_analysis, med_info
        )
        
        # Assess life impact
        life_impact = self._assess_life_impact(medication_name, effectiveness_analysis, side_effect_analysis, med_info)
        
        # Determine dosage recommendation
        dosage_recommendation = self._determine_dosage_recommendation(
            medication_name, effectiveness_analysis, side_effect_analysis, med_info
        )
        
        # Assess long-term effects
        long_term_effects = self._assess_long_term_effects(medication_name, med_info)
        
        return MedicationImpact(
            medication_name=medication_name,
            dosage=dosage,
            start_date=start_date,
            end_date=end_date,
            reason=reason,
            effectiveness=effectiveness_analysis,
            side_effects=side_effects,
            ai_recommendation=ai_recommendation,
            life_impact=life_impact,
            dosage_recommendation=dosage_recommendation,
            long_term_effects=long_term_effects
        )
    
    def _analyze_effectiveness(self, medication_name: str, effectiveness: str, med_info: Dict[str, Any]) -> str:
        """Analyze medication effectiveness"""
        if not effectiveness:
            return "Effectiveness data not available"
        
        # Check for positive indicators
        positive_indicators = med_info.get("effectiveness_indicators", [])
        effectiveness_lower = effectiveness.lower()
        
        analysis_parts = []
        
        # Check for specific improvements
        if any(indicator.lower() in effectiveness_lower for indicator in positive_indicators):
            analysis_parts.append("Good response to treatment")
        
        # Check for specific metrics
        if "reduced" in effectiveness_lower or "decreased" in effectiveness_lower:
            analysis_parts.append("Shows improvement in target parameters")
        elif "increased" in effectiveness_lower or "elevated" in effectiveness_lower:
            analysis_parts.append("May need dosage adjustment")
        elif "stable" in effectiveness_lower or "maintained" in effectiveness_lower:
            analysis_parts.append("Maintaining therapeutic levels")
        
        # Add specific analysis based on medication type
        if medication_name == "Lisinopril":
            if "blood pressure" in effectiveness_lower and "reduced" in effectiveness_lower:
                analysis_parts.append("Effective blood pressure control achieved")
        elif medication_name == "Metformin":
            if "a1c" in effectiveness_lower or "glucose" in effectiveness_lower:
                analysis_parts.append("Good glycemic control")
        elif medication_name == "Atorvastatin":
            if "cholesterol" in effectiveness_lower or "ldl" in effectiveness_lower:
                analysis_parts.append("Effective cholesterol reduction")
        
        return " | ".join(analysis_parts) if analysis_parts else effectiveness
    
    def _analyze_side_effects(self, medication_name: str, side_effects: List[str], med_info: Dict[str, Any]) -> str:
        """Analyze side effects and their severity"""
        if not side_effects:
            return "No significant side effects reported"
        
        common_side_effects = med_info.get("common_side_effects", [])
        serious_side_effects = med_info.get("serious_side_effects", [])
        
        analysis_parts = []
        severity_level = "mild"
        
        for effect in side_effects:
            effect_lower = effect.lower()
            
            if any(serious in effect_lower for serious in serious_side_effects):
                analysis_parts.append(f"⚠️ SERIOUS: {effect}")
                severity_level = "severe"
            elif any(common in effect_lower for common in common_side_effects):
                analysis_parts.append(f"Common: {effect}")
                if severity_level == "mild":
                    severity_level = "moderate"
            else:
                analysis_parts.append(f"Unusual: {effect}")
        
        if severity_level == "severe":
            analysis_parts.append("⚠️ Immediate medical attention may be needed")
        elif severity_level == "moderate":
            analysis_parts.append("Consider dosage adjustment or alternative medication")
        
        return " | ".join(analysis_parts)
    
    def _generate_ai_recommendation(self, medication_name: str, effectiveness: str, side_effects: str, med_info: Dict[str, Any]) -> str:
        """Generate AI-powered medication recommendation"""
        recommendations = []
        
        # Check for serious side effects
        if "SERIOUS" in side_effects:
            recommendations.append("Immediate medical evaluation recommended")
            recommendations.append("Consider discontinuing medication")
        
        # Check effectiveness
        if "good response" in effectiveness.lower() or "effective" in effectiveness.lower():
            recommendations.append("Continue current dosage")
            recommendations.append("Maintain regular monitoring")
        elif "dosage adjustment" in effectiveness.lower():
            recommendations.append("Consider dosage titration")
            recommendations.append("Monitor response to changes")
        
        # Medication-specific recommendations
        if medication_name == "Lisinopril":
            if "cough" in side_effects.lower():
                recommendations.append("Consider switching to ARB (Losartan, Valsartan)")
            recommendations.append("Monitor kidney function and potassium levels")
        
        elif medication_name == "Metformin":
            if "gi upset" in side_effects.lower():
                recommendations.append("Take with meals to reduce GI side effects")
                recommendations.append("Consider extended-release formulation")
            recommendations.append("Monitor B12 levels annually")
        
        elif medication_name == "Atorvastatin":
            if "muscle pain" in side_effects.lower():
                recommendations.append("Check CPK levels")
                recommendations.append("Consider alternative statin")
            recommendations.append("Monitor liver function tests")
        
        # General recommendations
        recommendations.append("Regular follow-up with healthcare provider")
        recommendations.append("Report any new or worsening side effects")
        
        return " | ".join(recommendations)
    
    def _assess_life_impact(self, medication_name: str, effectiveness: str, side_effects: str, med_info: Dict[str, Any]) -> str:
        """Assess overall life impact of medication"""
        positive_impacts = med_info.get("life_impact", {}).get("positive", [])
        negative_impacts = med_info.get("life_impact", {}).get("negative", [])
        
        impact_analysis = []
        
        # Positive impacts
        if "good response" in effectiveness.lower() or "effective" in effectiveness.lower():
            impact_analysis.extend(positive_impacts[:2])  # Top 2 positive impacts
        
        # Negative impacts
        if side_effects and "SERIOUS" not in side_effects:
            impact_analysis.extend(negative_impacts[:1])  # Top negative impact
        
        # Overall assessment
        if "good response" in effectiveness.lower() and not side_effects:
            impact_analysis.append("Overall positive impact on health and longevity")
        elif "SERIOUS" in side_effects:
            impact_analysis.append("⚠️ Negative impact due to serious side effects")
        else:
            impact_analysis.append("Balanced impact - benefits likely outweigh risks")
        
        return " | ".join(impact_analysis)
    
    def _determine_dosage_recommendation(self, medication_name: str, effectiveness: str, side_effects: str, med_info: Dict[str, Any]) -> str:
        """Determine dosage adjustment recommendation"""
        if "SERIOUS" in side_effects:
            return "stop"
        elif "dosage adjustment" in effectiveness.lower():
            return "increase"
        elif "good response" in effectiveness.lower() and not side_effects:
            return "maintain"
        elif side_effects and "moderate" in side_effects.lower():
            return "decrease"
        else:
            return "maintain"
    
    def _assess_long_term_effects(self, medication_name: str, med_info: Dict[str, Any]) -> List[str]:
        """Assess potential long-term effects of medication"""
        long_term_effects = []
        
        if medication_name == "Lisinopril":
            long_term_effects.extend([
                "Kidney protection in diabetes",
                "Reduced cardiovascular events",
                "Potential hyperkalemia risk"
            ])
        elif medication_name == "Metformin":
            long_term_effects.extend([
                "Reduced diabetes complications",
                "Potential B12 deficiency",
                "Possible longevity benefits"
            ])
        elif medication_name == "Atorvastatin":
            long_term_effects.extend([
                "Reduced heart attack and stroke risk",
                "Potential muscle damage",
                "Diabetes risk increase"
            ])
        elif medication_name == "Amlodipine":
            long_term_effects.extend([
                "Effective long-term blood pressure control",
                "Reduced stroke risk",
                "Potential peripheral edema"
            ])
        elif medication_name == "Omeprazole":
            long_term_effects.extend([
                "Effective acid suppression",
                "Potential nutrient absorption issues",
                "Increased fracture risk with long-term use"
            ])
        
        return long_term_effects
    
    async def get_medication_interactions(self, current_medications: List[str]) -> Dict[str, List[str]]:
        """Get potential drug interactions for current medications"""
        interactions = {}
        
        for med in current_medications:
            if med in self.drug_interactions:
                interactions[med] = self.drug_interactions[med]
        
        return interactions
    
    async def get_model_status(self) -> Dict[str, Any]:
        """Get model status information"""
        return {
            "model_name": "Medication Tracking and Analysis Model",
            "status": self.model_status,
            "version": "1.0.0",
            "medications_covered": len(self.medication_database),
            "last_updated": "2024-01-01"
        } 