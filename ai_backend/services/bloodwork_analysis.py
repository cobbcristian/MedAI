import pandas as pd
import numpy as np
import pdfplumber
import tabula
import re
import time
from typing import Dict, List, Any, Optional
import logging
from models.response_models import BloodworkAnalysisResult, LabValue, EnhancedBloodworkAnalysis, CancerRisk, LifeExpectancy

logger = logging.getLogger(__name__)

class BloodworkAnalysisService:
    def __init__(self):
        self.model_status = "loaded"
        self.reference_ranges = self._load_reference_ranges()
        self.critical_values = self._load_critical_values()
        self.cancer_markers = self._load_cancer_markers()
        self.life_expectancy_factors = self._load_life_expectancy_factors()
        
    def _load_reference_ranges(self) -> Dict[str, Dict[str, Any]]:
        """Load reference ranges for common lab values"""
        return {
            "WBC": {
                "unit": "K/µL",
                "normal_range": (4.5, 11.0),
                "critical_low": 1.0,
                "critical_high": 30.0
            },
            "RBC": {
                "unit": "M/µL",
                "normal_range": (4.5, 5.9),
                "critical_low": 2.0,
                "critical_high": 8.0
            },
            "Hemoglobin": {
                "unit": "g/dL",
                "normal_range": (13.5, 17.5),
                "critical_low": 7.0,
                "critical_high": 20.0
            },
            "Hematocrit": {
                "unit": "%",
                "normal_range": (41.0, 50.0),
                "critical_low": 20.0,
                "critical_high": 60.0
            },
            "Platelets": {
                "unit": "K/µL",
                "normal_range": (150, 450),
                "critical_low": 50,
                "critical_high": 1000
            },
            "Glucose": {
                "unit": "mg/dL",
                "normal_range": (70, 100),
                "critical_low": 40,
                "critical_high": 400
            },
            "Creatinine": {
                "unit": "mg/dL",
                "normal_range": (0.7, 1.3),
                "critical_low": 0.2,
                "critical_high": 10.0
            },
            "BUN": {
                "unit": "mg/dL",
                "normal_range": (7, 20),
                "critical_low": 3,
                "critical_high": 100
            },
            "Sodium": {
                "unit": "mEq/L",
                "normal_range": (135, 145),
                "critical_low": 120,
                "critical_high": 160
            },
            "Potassium": {
                "unit": "mEq/L",
                "normal_range": (3.5, 5.0),
                "critical_low": 2.5,
                "critical_high": 7.0
            },
            "Chloride": {
                "unit": "mEq/L",
                "normal_range": (96, 106),
                "critical_low": 80,
                "critical_high": 120
            },
            "CO2": {
                "unit": "mEq/L",
                "normal_range": (22, 28),
                "critical_low": 15,
                "critical_high": 40
            },
            "Calcium": {
                "unit": "mg/dL",
                "normal_range": (8.5, 10.5),
                "critical_low": 6.0,
                "critical_high": 13.0
            },
            "Albumin": {
                "unit": "g/dL",
                "normal_range": (3.5, 5.0),
                "critical_low": 2.0,
                "critical_high": 6.0
            },
            "Total Protein": {
                "unit": "g/dL",
                "normal_range": (6.0, 8.3),
                "critical_low": 4.0,
                "critical_high": 12.0
            },
            "Bilirubin Total": {
                "unit": "mg/dL",
                "normal_range": (0.3, 1.2),
                "critical_low": 0.1,
                "critical_high": 20.0
            },
            "ALT": {
                "unit": "U/L",
                "normal_range": (7, 55),
                "critical_low": 5,
                "critical_high": 1000
            },
            "AST": {
                "unit": "U/L",
                "normal_range": (8, 48),
                "critical_low": 5,
                "critical_high": 1000
            },
            "Alkaline Phosphatase": {
                "unit": "U/L",
                "normal_range": (44, 147),
                "critical_low": 20,
                "critical_high": 500
            },
            # Cancer markers
            "PSA": {
                "unit": "ng/mL",
                "normal_range": (0, 4.0),
                "critical_low": 0,
                "critical_high": 20.0
            },
            "CEA": {
                "unit": "ng/mL",
                "normal_range": (0, 3.0),
                "critical_low": 0,
                "critical_high": 10.0
            },
            "AFP": {
                "unit": "ng/mL",
                "normal_range": (0, 10.0),
                "critical_low": 0,
                "critical_high": 400.0
            },
            "CA-125": {
                "unit": "U/mL",
                "normal_range": (0, 35.0),
                "critical_low": 0,
                "critical_high": 200.0
            },
            "CA-19-9": {
                "unit": "U/mL",
                "normal_range": (0, 37.0),
                "critical_low": 0,
                "critical_high": 1000.0
            }
        }
    
    def _load_critical_values(self) -> Dict[str, Dict[str, float]]:
        """Load critical value thresholds"""
        return {
            "critical_low": {
                "Glucose": 40,
                "Sodium": 120,
                "Potassium": 2.5,
                "Hemoglobin": 7.0,
                "Platelets": 50
            },
            "critical_high": {
                "Glucose": 400,
                "Sodium": 160,
                "Potassium": 7.0,
                "Hemoglobin": 20.0,
                "Platelets": 1000
            }
        }
    
    def _load_cancer_markers(self) -> Dict[str, Dict[str, Any]]:
        """Load cancer marker information and risk factors"""
        return {
            "PSA": {
                "cancer_type": "Prostate",
                "elevated_risk": 4.0,
                "high_risk": 10.0,
                "age_factors": {"50-59": 3.0, "60-69": 4.0, "70+": 5.0}
            },
            "CEA": {
                "cancer_type": "Colorectal",
                "elevated_risk": 3.0,
                "high_risk": 10.0,
                "smoking_factor": 1.5
            },
            "AFP": {
                "cancer_type": "Liver",
                "elevated_risk": 10.0,
                "high_risk": 400.0,
                "hepatitis_factor": 2.0
            },
            "CA-125": {
                "cancer_type": "Ovarian",
                "elevated_risk": 35.0,
                "high_risk": 200.0,
                "menopause_factor": 1.3
            },
            "CA-19-9": {
                "cancer_type": "Pancreatic",
                "elevated_risk": 37.0,
                "high_risk": 1000.0,
                "diabetes_factor": 1.5
            }
        }
    
    def _load_life_expectancy_factors(self) -> Dict[str, Dict[str, Any]]:
        """Load factors that affect life expectancy"""
        return {
            "cardiovascular": {
                "risk_factors": ["high_cholesterol", "hypertension", "diabetes", "obesity"],
                "life_reduction": {"high": 10, "medium": 5, "low": 2}
            },
            "kidney": {
                "risk_factors": ["high_creatinine", "high_bun", "proteinuria"],
                "life_reduction": {"high": 15, "medium": 8, "low": 3}
            },
            "liver": {
                "risk_factors": ["high_alt", "high_ast", "high_bilirubin"],
                "life_reduction": {"high": 12, "medium": 6, "low": 2}
            },
            "cancer": {
                "risk_factors": ["elevated_markers", "family_history", "age"],
                "life_reduction": {"high": 20, "medium": 10, "low": 5}
            },
            "diabetes": {
                "risk_factors": ["high_glucose", "high_hba1c"],
                "life_reduction": {"high": 8, "medium": 4, "low": 2}
            }
        }
    
    async def analyze_bloodwork(self, file_path: str) -> BloodworkAnalysisResult:
        """
        Analyze bloodwork from PDF or CSV file
        """
        start_time = time.time()
        
        try:
            # Parse file based on extension
            if file_path.lower().endswith('.pdf'):
                lab_values = await self._parse_pdf(file_path)
            elif file_path.lower().endswith('.csv'):
                lab_values = await self._parse_csv(file_path)
            else:
                raise ValueError("Unsupported file format. Only PDF and CSV are supported.")
            
            # Analyze lab values
            abnormalities = self._identify_abnormalities(lab_values)
            recommendations = self._generate_recommendations(lab_values, abnormalities)
            urgency_level = self._determine_urgency(lab_values, abnormalities)
            suggested_tests = self._suggest_additional_tests(lab_values, abnormalities)
            
            processing_time = time.time() - start_time
            
            return BloodworkAnalysisResult(
                lab_values=lab_values,
                abnormalities=abnormalities,
                recommendations=recommendations,
                urgency_level=urgency_level,
                suggested_tests=suggested_tests,
                processing_time=processing_time
            )
            
        except Exception as e:
            logger.error(f"Error analyzing bloodwork: {e}")
            raise
    
    async def analyze_bloodwork_enhanced(self, file_path: str, patient_age: int = 50, patient_gender: str = "unknown") -> EnhancedBloodworkAnalysis:
        """
        Enhanced bloodwork analysis with cancer risk and life expectancy assessment
        """
        start_time = time.time()
        
        try:
            # Get basic analysis
            basic_analysis = await self.analyze_bloodwork(file_path)
            
            # Enhanced analysis
            cancer_risk = self._assess_cancer_risk(basic_analysis.lab_values, patient_age, patient_gender)
            life_expectancy = self._assess_life_expectancy(basic_analysis.lab_values, patient_age, patient_gender)
            interventions = self._generate_interventions(basic_analysis.lab_values, cancer_risk, life_expectancy)
            medications = self._suggest_medications(basic_analysis.lab_values, cancer_risk, life_expectancy)
            
            processing_time = time.time() - start_time
            
            return EnhancedBloodworkAnalysis(
                lab_values=basic_analysis.lab_values,
                abnormalities=basic_analysis.abnormalities,
                recommendations=basic_analysis.recommendations,
                urgency_level=basic_analysis.urgency_level,
                suggested_tests=basic_analysis.suggested_tests,
                cancer_risk=cancer_risk,
                life_expectancy=life_expectancy,
                interventions=interventions,
                medications=medications,
                processing_time=processing_time
            )
            
        except Exception as e:
            logger.error(f"Error in enhanced bloodwork analysis: {e}")
            raise
    
    def _assess_cancer_risk(self, lab_values: List[LabValue], age: int, gender: str) -> CancerRisk:
        """Assess cancer risk based on lab values and patient factors"""
        risk_factors = []
        total_risk = 0.0
        
        # Check cancer markers
        for lab_value in lab_values:
            if lab_value.name in self.cancer_markers:
                marker_info = self.cancer_markers[lab_value.name]
                
                if lab_value.value > marker_info["high_risk"]:
                    risk_factors.append(f"Very high {lab_value.name} ({lab_value.value} {lab_value.unit})")
                    total_risk += 0.4
                elif lab_value.value > marker_info["elevated_risk"]:
                    risk_factors.append(f"Elevated {lab_value.name} ({lab_value.value} {lab_value.unit})")
                    total_risk += 0.2
                
                # Age-specific factors
                if lab_value.name == "PSA" and age >= 70:
                    total_risk += 0.1
                elif lab_value.name == "CA-125" and gender == "female" and age > 50:
                    total_risk += 0.15
        
        # Additional risk factors
        if any(lv.name == "Hemoglobin" and lv.status == "low" for lv in lab_values):
            risk_factors.append("Anemia (possible blood loss)")
            total_risk += 0.1
        
        if any(lv.name == "Platelets" and lv.status == "high" for lv in lab_values):
            risk_factors.append("Elevated platelets (possible inflammation)")
            total_risk += 0.05
        
        # Determine risk level
        if total_risk >= 0.5:
            risk_level = "very_high"
        elif total_risk >= 0.3:
            risk_level = "high"
        elif total_risk >= 0.15:
            risk_level = "medium"
        else:
            risk_level = "low"
        
        # Generate recommendations
        recommendations = []
        if risk_level in ["high", "very_high"]:
            recommendations.extend([
                "Immediate oncology consultation recommended",
                "Consider additional cancer screening tests",
                "Family history assessment needed",
                "Regular monitoring of tumor markers"
            ])
        elif risk_level == "medium":
            recommendations.extend([
                "Consider cancer screening in 6 months",
                "Monitor for new symptoms",
                "Lifestyle modifications recommended"
            ])
        else:
            recommendations.append("Continue routine cancer screening schedule")
        
        return CancerRisk(
            risk_level=risk_level,
            probability=min(total_risk, 0.95),
            factors=risk_factors,
            recommendations=recommendations
        )
    
    def _assess_life_expectancy(self, lab_values: List[LabValue], age: int, gender: str) -> LifeExpectancy:
        """Assess life expectancy based on lab values and health factors"""
        base_life_expectancy = 85  # Base life expectancy
        factors_affecting = []
        interventions = []
        total_reduction = 0
        
        # Cardiovascular factors
        cv_risk = 0
        if any(lv.name == "Glucose" and lv.status in ["high", "critical"] for lv in lab_values):
            cv_risk += 1
            factors_affecting.append("Elevated glucose (diabetes risk)")
        if any(lv.name == "Hemoglobin" and lv.status == "low" for lv in lab_values):
            cv_risk += 1
            factors_affecting.append("Anemia (cardiovascular stress)")
        
        if cv_risk >= 2:
            total_reduction += 8
            interventions.append("Cardiovascular risk management")
        elif cv_risk == 1:
            total_reduction += 4
            interventions.append("Blood sugar monitoring")
        
        # Kidney function
        kidney_risk = 0
        if any(lv.name == "Creatinine" and lv.status in ["high", "critical"] for lv in lab_values):
            kidney_risk += 1
            factors_affecting.append("Elevated creatinine (kidney dysfunction)")
        if any(lv.name == "BUN" and lv.status in ["high", "critical"] for lv in lab_values):
            kidney_risk += 1
            factors_affecting.append("Elevated BUN (kidney stress)")
        
        if kidney_risk >= 2:
            total_reduction += 12
            interventions.append("Nephrology consultation")
        elif kidney_risk == 1:
            total_reduction += 6
            interventions.append("Kidney function monitoring")
        
        # Liver function
        liver_risk = 0
        if any(lv.name in ["ALT", "AST"] and lv.status in ["high", "critical"] for lv in lab_values):
            liver_risk += 1
            factors_affecting.append("Elevated liver enzymes")
        if any(lv.name == "Bilirubin Total" and lv.status in ["high", "critical"] for lv in lab_values):
            liver_risk += 1
            factors_affecting.append("Elevated bilirubin")
        
        if liver_risk >= 2:
            total_reduction += 10
            interventions.append("Hepatology consultation")
        elif liver_risk == 1:
            total_reduction += 5
            interventions.append("Liver function monitoring")
        
        # Cancer risk (from previous assessment)
        cancer_markers = [lv for lv in lab_values if lv.name in self.cancer_markers]
        if any(lv.status in ["high", "critical"] for lv in cancer_markers):
            total_reduction += 15
            factors_affecting.append("Elevated cancer markers")
            interventions.append("Oncology consultation")
        
        # Calculate final life expectancy
        estimated_life_expectancy = max(base_life_expectancy - total_reduction, 60)
        confidence = max(0.7 - (total_reduction * 0.01), 0.3)
        
        return LifeExpectancy(
            current_estimate=estimated_life_expectancy,
            factors_affecting=factors_affecting,
            interventions=interventions,
            confidence=confidence
        )
    
    def _generate_interventions(self, lab_values: List[LabValue], cancer_risk: CancerRisk, life_expectancy: LifeExpectancy) -> List[str]:
        """Generate specific interventions based on lab values and risk assessments"""
        interventions = []
        
        # Cardiovascular interventions
        if any(lv.name == "Glucose" and lv.status in ["high", "critical"] for lv in lab_values):
            interventions.extend([
                "Diabetes management program",
                "Regular blood sugar monitoring",
                "Dietary modifications",
                "Exercise program"
            ])
        
        if any(lv.name == "Hemoglobin" and lv.status == "low" for lv in lab_values):
            interventions.extend([
                "Iron supplementation",
                "Dietary iron enhancement",
                "Investigate cause of anemia"
            ])
        
        # Kidney interventions
        if any(lv.name == "Creatinine" and lv.status in ["high", "critical"] for lv in lab_values):
            interventions.extend([
                "Kidney function monitoring",
                "Blood pressure control",
                "Protein restriction if needed",
                "Avoid nephrotoxic medications"
            ])
        
        # Cancer prevention
        if cancer_risk.risk_level in ["high", "very_high"]:
            interventions.extend([
                "Regular cancer screening",
                "Lifestyle modifications",
                "Genetic counseling if indicated",
                "Early detection protocols"
            ])
        
        # General health
        interventions.extend([
            "Regular exercise program",
            "Balanced diet",
            "Stress management",
            "Regular medical checkups"
        ])
        
        return list(set(interventions))  # Remove duplicates
    
    def _suggest_medications(self, lab_values: List[LabValue], cancer_risk: CancerRisk, life_expectancy: LifeExpectancy) -> List[str]:
        """Suggest medications based on lab values and risk assessments"""
        medications = []
        
        # Diabetes medications
        if any(lv.name == "Glucose" and lv.status in ["high", "critical"] for lv in lab_values):
            medications.extend([
                "Metformin (if not contraindicated)",
                "Insulin (if needed)",
                "SGLT2 inhibitors (consider)"
            ])
        
        # Blood pressure medications
        if any(lv.name == "Creatinine" and lv.status in ["high", "critical"] for lv in lab_values):
            medications.extend([
                "ACE inhibitors (kidney protection)",
                "ARBs (alternative to ACE inhibitors)",
                "Diuretics (if fluid overload)"
            ])
        
        # Anemia treatment
        if any(lv.name == "Hemoglobin" and lv.status == "low" for lv in lab_values):
            medications.extend([
                "Iron supplements",
                "B12 supplements (if deficient)",
                "Folic acid (if needed)"
            ])
        
        # Cholesterol medications
        if any(lv.name == "Cholesterol" and lv.status in ["high", "critical"] for lv in lab_values):
            medications.extend([
                "Statins (cardiovascular protection)",
                "Ezetimibe (if statins not tolerated)"
            ])
        
        # Cancer prevention (if high risk)
        if cancer_risk.risk_level in ["high", "very_high"]:
            medications.extend([
                "Aspirin (if cardiovascular risk)",
                "Vitamin D (if deficient)",
                "Calcium supplements (if needed)"
            ])
        
        return medications
    
    async def get_model_status(self) -> Dict[str, Any]:
        """Get model status information"""
        return {
            "model_name": "Bloodwork Analysis Model",
            "status": self.model_status,
            "version": "1.0.0",
            "last_updated": "2024-01-01"
        } 