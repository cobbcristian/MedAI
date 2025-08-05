import pandas as pd
import numpy as np
import time
from typing import Dict, List, Any, Optional
import logging
from datetime import datetime, timedelta
from models.response_models import VaccinationRecord, MissingVaccination

logger = logging.getLogger(__name__)

class VaccinationTrackingService:
    def __init__(self):
        self.model_status = "loaded"
        self.vaccine_database = self._load_vaccine_database()
        self.age_recommendations = self._load_age_recommendations()
        self.risk_factors = self._load_risk_factors()
        self.contraindications = self._load_contraindications()
        
    def _load_vaccine_database(self) -> Dict[str, Dict[str, Any]]:
        """Load comprehensive vaccine database"""
        return {
            "COVID-19": {
                "types": ["Pfizer", "Moderna", "Johnson & Johnson", "Novavax"],
                "schedule": {"primary": 2, "booster": 1, "interval": 6},
                "age_groups": ["6 months+"],
                "risk_if_missed": "High risk of severe COVID-19, hospitalization, and death",
                "risk_if_taken": "Mild side effects (fever, fatigue, injection site pain)",
                "effectiveness": "90%+ against severe disease",
                "duration": "6-12 months for boosters"
            },
            "Influenza": {
                "types": ["Annual", "High-dose", "Quadrivalent"],
                "schedule": {"primary": 1, "annual": True},
                "age_groups": ["6 months+"],
                "risk_if_missed": "Increased risk of flu complications, hospitalization",
                "risk_if_taken": "Mild side effects (sore arm, low-grade fever)",
                "effectiveness": "40-60% against circulating strains",
                "duration": "Annual"
            },
            "Tetanus": {
                "types": ["Tdap", "Td"],
                "schedule": {"primary": 3, "booster": 1, "interval": 10},
                "age_groups": ["All ages"],
                "risk_if_missed": "Risk of tetanus infection (potentially fatal)",
                "risk_if_taken": "Mild side effects (sore arm, fatigue)",
                "effectiveness": "95%+ protection",
                "duration": "10 years"
            },
            "Pneumonia": {
                "types": ["PCV13", "PPSV23"],
                "schedule": {"primary": 1, "booster": 1, "interval": 5},
                "age_groups": ["65+", "High-risk 19-64"],
                "risk_if_missed": "Increased risk of pneumococcal disease, pneumonia",
                "risk_if_taken": "Mild side effects (sore arm, fever)",
                "effectiveness": "60-70% against invasive disease",
                "duration": "5 years"
            },
            "Shingles": {
                "types": ["Shingrix"],
                "schedule": {"primary": 2, "interval": 2},
                "age_groups": ["50+"],
                "risk_if_missed": "Risk of shingles (painful rash, complications)",
                "risk_if_taken": "Moderate side effects (sore arm, fatigue, fever)",
                "effectiveness": "90%+ protection",
                "duration": "Lifetime"
            },
            "Hepatitis B": {
                "types": ["Recombivax HB", "Engerix-B"],
                "schedule": {"primary": 3, "interval": [0, 1, 6]},
                "age_groups": ["All ages"],
                "risk_if_missed": "Risk of hepatitis B infection, liver disease",
                "risk_if_taken": "Mild side effects (sore arm, fatigue)",
                "effectiveness": "95%+ protection",
                "duration": "Lifetime"
            },
            "MMR": {
                "types": ["MMR II"],
                "schedule": {"primary": 2, "interval": [12, 48]},
                "age_groups": ["12 months+"],
                "risk_if_missed": "Risk of measles, mumps, rubella",
                "risk_if_taken": "Mild side effects (fever, rash)",
                "effectiveness": "95%+ protection",
                "duration": "Lifetime"
            },
            "HPV": {
                "types": ["Gardasil 9"],
                "schedule": {"primary": 2, "interval": [0, 6]},
                "age_groups": ["9-26", "27-45"],
                "risk_if_missed": "Risk of HPV-related cancers (cervical, throat)",
                "risk_if_taken": "Mild side effects (sore arm, dizziness)",
                "effectiveness": "90%+ against covered strains",
                "duration": "Lifetime"
            }
        }
    
    def _load_age_recommendations(self) -> Dict[str, List[str]]:
        """Load age-based vaccination recommendations"""
        return {
            "0-6 months": ["Hepatitis B", "DTaP", "Hib", "PCV13", "Rotavirus"],
            "6-12 months": ["Hepatitis B", "DTaP", "Hib", "PCV13", "MMR", "Varicella"],
            "12-18 months": ["DTaP", "Hib", "PCV13", "MMR", "Varicella", "Hepatitis A"],
            "4-6 years": ["DTaP", "MMR", "Varicella", "IPV"],
            "11-12 years": ["Tdap", "HPV", "Meningococcal"],
            "16-18 years": ["Meningococcal B"],
            "19-26 years": ["HPV", "Tdap"],
            "27-49 years": ["Tdap", "Influenza"],
            "50-64 years": ["Tdap", "Influenza", "Shingles"],
            "65+": ["Tdap", "Influenza", "Pneumonia", "Shingles"]
        }
    
    def _load_risk_factors(self) -> Dict[str, List[str]]:
        """Load risk factors that affect vaccination recommendations"""
        return {
            "diabetes": ["Pneumonia", "Influenza", "Hepatitis B"],
            "heart_disease": ["Pneumonia", "Influenza"],
            "lung_disease": ["Pneumonia", "Influenza"],
            "kidney_disease": ["Pneumonia", "Influenza", "Hepatitis B"],
            "liver_disease": ["Hepatitis A", "Hepatitis B", "Pneumonia"],
            "cancer": ["Pneumonia", "Influenza", "Shingles"],
            "pregnancy": ["Tdap", "Influenza"],
            "immunocompromised": ["Pneumonia", "Influenza", "Hepatitis B"],
            "smoking": ["Pneumonia", "Influenza"],
            "obesity": ["Pneumonia", "Influenza"]
        }
    
    def _load_contraindications(self) -> Dict[str, List[str]]:
        """Load vaccination contraindications"""
        return {
            "severe_allergy": ["All vaccines"],
            "pregnancy": ["MMR", "Varicella", "HPV"],
            "immunocompromised": ["Live vaccines"],
            "fever": ["All vaccines (temporary)"],
            "recent_illness": ["All vaccines (temporary)"]
        }
    
    async def analyze_vaccination_records(self, vaccination_data: List[Dict[str, Any]], 
                                        patient_age: int, 
                                        patient_conditions: List[str] = None) -> Dict[str, Any]:
        """Analyze vaccination records and provide comprehensive assessment"""
        try:
            # Process completed vaccinations
            completed_vaccinations = []
            for vax_data in vaccination_data.get("completed", []):
                vax_record = await self._process_vaccination_record(vax_data)
                completed_vaccinations.append(vax_record)
            
            # Identify missing vaccinations
            missing_vaccinations = await self._identify_missing_vaccinations(
                completed_vaccinations, patient_age, patient_conditions or []
            )
            
            # Generate AI analysis
            ai_analysis = self._generate_vaccination_analysis(
                completed_vaccinations, missing_vaccinations, patient_age, patient_conditions
            )
            
            return {
                "completed_vaccinations": completed_vaccinations,
                "missing_vaccinations": missing_vaccinations,
                "ai_analysis": ai_analysis,
                "overall_risk": self._assess_overall_risk(completed_vaccinations, missing_vaccinations),
                "recommendations": self._generate_recommendations(completed_vaccinations, missing_vaccinations)
            }
            
        except Exception as e:
            logger.error(f"Error analyzing vaccination records: {e}")
            raise
    
    async def _process_vaccination_record(self, vax_data: Dict[str, Any]) -> VaccinationRecord:
        """Process a single vaccination record"""
        name = vax_data.get("name", "")
        date = vax_data.get("date", "")
        vax_type = vax_data.get("type", "")
        reaction = vax_data.get("reaction", "None")
        
        # Get vaccine info
        vaccine_info = self.vaccine_database.get(name, {})
        
        # Calculate next due date
        next_due = self._calculate_next_due_date(name, date, vaccine_info)
        
        # Generate AI analysis
        ai_analysis = self._analyze_vaccination_effectiveness(name, reaction, vaccine_info)
        
        # Assess risks
        risk_if_missed = vaccine_info.get("risk_if_missed", "Unknown risk")
        risk_if_taken = vaccine_info.get("risk_if_taken", "Minimal risk")
        
        return VaccinationRecord(
            name=name,
            date=date,
            type=vax_type,
            reaction=reaction,
            next_due=next_due,
            ai_analysis=ai_analysis,
            risk_if_missed=risk_if_missed,
            risk_if_taken=risk_if_taken
        )
    
    def _calculate_next_due_date(self, vaccine_name: str, last_date: str, vaccine_info: Dict[str, Any]) -> Optional[str]:
        """Calculate next due date for vaccination"""
        try:
            last_date_obj = datetime.strptime(last_date, "%Y-%m-%d")
            schedule = vaccine_info.get("schedule", {})
            
            if "annual" in schedule and schedule["annual"]:
                next_date = last_date_obj + timedelta(days=365)
            elif "interval" in schedule:
                if isinstance(schedule["interval"], list):
                    # Primary series
                    if len(schedule["interval"]) > 1:
                        next_date = last_date_obj + timedelta(days=schedule["interval"][1] * 30)
                    else:
                        next_date = None
                else:
                    # Booster interval
                    next_date = last_date_obj + timedelta(days=schedule["interval"] * 365)
            else:
                next_date = None
            
            return next_date.strftime("%Y-%m-%d") if next_date else None
            
        except Exception as e:
            logger.error(f"Error calculating next due date: {e}")
            return None
    
    def _analyze_vaccination_effectiveness(self, vaccine_name: str, reaction: str, vaccine_info: Dict[str, Any]) -> str:
        """Analyze vaccination effectiveness and safety"""
        analysis_parts = []
        
        # Check reaction severity
        if reaction.lower() in ["none", "mild", "slight"]:
            analysis_parts.append("Well tolerated with minimal side effects")
        elif "moderate" in reaction.lower():
            analysis_parts.append("Moderate side effects, but within normal range")
        elif "severe" in reaction.lower():
            analysis_parts.append("⚠️ Severe reaction - consult healthcare provider")
        
        # Add effectiveness info
        effectiveness = vaccine_info.get("effectiveness", "")
        if effectiveness:
            analysis_parts.append(f"Effectiveness: {effectiveness}")
        
        # Add duration info
        duration = vaccine_info.get("duration", "")
        if duration:
            analysis_parts.append(f"Protection duration: {duration}")
        
        return " | ".join(analysis_parts)
    
    async def _identify_missing_vaccinations(self, completed_vaccinations: List[VaccinationRecord], 
                                           patient_age: int, 
                                           patient_conditions: List[str]) -> List[MissingVaccination]:
        """Identify missing vaccinations based on age and conditions"""
        missing_vaccinations = []
        
        # Get age-appropriate vaccines
        age_group = self._get_age_group(patient_age)
        age_recommendations = self.age_recommendations.get(age_group, [])
        
        # Get condition-specific recommendations
        condition_vaccines = []
        for condition in patient_conditions:
            if condition in self.risk_factors:
                condition_vaccines.extend(self.risk_factors[condition])
        
        # Combine all recommended vaccines
        all_recommended = list(set(age_recommendations + condition_vaccines))
        
        # Check which vaccines are missing
        completed_names = [vax.name for vax in completed_vaccinations]
        
        for vaccine_name in all_recommended:
            if vaccine_name not in completed_names:
                missing_vax = await self._create_missing_vaccination(
                    vaccine_name, patient_age, patient_conditions
                )
                missing_vaccinations.append(missing_vax)
        
        return missing_vaccinations
    
    def _get_age_group(self, age: int) -> str:
        """Get age group for vaccination recommendations"""
        if age < 1:
            return "0-6 months" if age < 0.5 else "6-12 months"
        elif age < 2:
            return "12-18 months"
        elif age < 7:
            return "4-6 years"
        elif age < 13:
            return "11-12 years"
        elif age < 19:
            return "16-18 years"
        elif age < 27:
            return "19-26 years"
        elif age < 50:
            return "27-49 years"
        elif age < 65:
            return "50-64 years"
        else:
            return "65+"
    
    async def _create_missing_vaccination(self, vaccine_name: str, patient_age: int, 
                                        patient_conditions: List[str]) -> MissingVaccination:
        """Create missing vaccination record with risk assessment"""
        vaccine_info = self.vaccine_database.get(vaccine_name, {})
        
        # Determine recommended age
        age_groups = vaccine_info.get("age_groups", [])
        recommended_age = " | ".join(age_groups) if age_groups else "Check with provider"
        
        # Assess risk level
        risk_level = self._assess_missing_vaccine_risk(vaccine_name, patient_age, patient_conditions)
        
        # Generate AI analysis
        ai_analysis = self._analyze_missing_vaccine(vaccine_name, patient_age, patient_conditions)
        
        # Determine urgency
        urgency = self._determine_vaccine_urgency(vaccine_name, patient_age, patient_conditions)
        
        return MissingVaccination(
            name=vaccine_name,
            recommended_age=recommended_age,
            risk_level=risk_level,
            ai_analysis=ai_analysis,
            urgency=urgency
        )
    
    def _assess_missing_vaccine_risk(self, vaccine_name: str, patient_age: int, 
                                    patient_conditions: List[str]) -> str:
        """Assess risk level for missing vaccine"""
        high_risk_vaccines = ["COVID-19", "Influenza", "Pneumonia"]
        moderate_risk_vaccines = ["Tetanus", "Hepatitis B", "Shingles"]
        
        # Age-based risk
        if patient_age >= 65 and vaccine_name in ["Pneumonia", "Influenza", "Shingles"]:
            return "high"
        elif patient_age >= 50 and vaccine_name == "Shingles":
            return "high"
        
        # Condition-based risk
        if any(condition in ["diabetes", "heart_disease", "lung_disease"] for condition in patient_conditions):
            if vaccine_name in ["Pneumonia", "Influenza"]:
                return "high"
        
        if "cancer" in patient_conditions and vaccine_name in ["Pneumonia", "Influenza", "Shingles"]:
            return "high"
        
        # Vaccine-specific risk
        if vaccine_name in high_risk_vaccines:
            return "high"
        elif vaccine_name in moderate_risk_vaccines:
            return "medium"
        else:
            return "low"
    
    def _analyze_missing_vaccine(self, vaccine_name: str, patient_age: int, 
                                patient_conditions: List[str]) -> str:
        """Analyze missing vaccine and provide recommendations"""
        analysis_parts = []
        
        vaccine_info = self.vaccine_database.get(vaccine_name, {})
        risk_if_missed = vaccine_info.get("risk_if_missed", "")
        
        analysis_parts.append(f"Missing: {vaccine_name}")
        analysis_parts.append(f"Risk if not vaccinated: {risk_if_missed}")
        
        # Age-specific analysis
        if patient_age >= 65 and vaccine_name in ["Pneumonia", "Influenza", "Shingles"]:
            analysis_parts.append("Strongly recommended for age group")
        elif patient_age >= 50 and vaccine_name == "Shingles":
            analysis_parts.append("Recommended to prevent shingles")
        
        # Condition-specific analysis
        if "diabetes" in patient_conditions and vaccine_name in ["Pneumonia", "Influenza"]:
            analysis_parts.append("Especially important for diabetes management")
        if "cancer" in patient_conditions and vaccine_name in ["Pneumonia", "Influenza"]:
            analysis_parts.append("Critical for immunocompromised patients")
        
        return " | ".join(analysis_parts)
    
    def _determine_vaccine_urgency(self, vaccine_name: str, patient_age: int, 
                                  patient_conditions: List[str]) -> str:
        """Determine urgency level for missing vaccine"""
        # High urgency conditions
        if patient_age >= 65 and vaccine_name in ["Pneumonia", "Influenza"]:
            return "immediate"
        if "cancer" in patient_conditions and vaccine_name in ["Pneumonia", "Influenza"]:
            return "immediate"
        if vaccine_name == "COVID-19" and patient_age >= 50:
            return "high"
        
        # Medium urgency
        if vaccine_name in ["Tetanus", "Shingles"] and patient_age >= 50:
            return "high"
        if vaccine_name in ["Pneumonia", "Influenza"] and patient_age >= 50:
            return "high"
        
        # Low urgency
        return "routine"
    
    def _generate_vaccination_analysis(self, completed_vaccinations: List[VaccinationRecord],
                                     missing_vaccinations: List[MissingVaccination],
                                     patient_age: int, patient_conditions: List[str]) -> str:
        """Generate comprehensive vaccination analysis"""
        analysis_parts = []
        
        # Overall assessment
        total_vaccines = len(completed_vaccinations)
        missing_count = len(missing_vaccinations)
        
        if missing_count == 0:
            analysis_parts.append("✅ Complete vaccination coverage")
        elif missing_count <= 2:
            analysis_parts.append(f"⚠️ {missing_count} vaccines missing - consider updating")
        else:
            analysis_parts.append(f"⚠️ {missing_count} vaccines missing - significant gaps in coverage")
        
        # High-risk missing vaccines
        high_risk_missing = [vax for vax in missing_vaccinations if vax.risk_level == "high"]
        if high_risk_missing:
            analysis_parts.append(f"🚨 {len(high_risk_missing)} high-risk vaccines missing")
        
        # Age-appropriate recommendations
        if patient_age >= 65:
            analysis_parts.append("Age 65+ - focus on pneumonia, flu, and shingles vaccines")
        elif patient_age >= 50:
            analysis_parts.append("Age 50+ - consider shingles vaccine")
        
        # Condition-specific recommendations
        if patient_conditions:
            condition_vaccines = []
            for condition in patient_conditions:
                if condition in self.risk_factors:
                    condition_vaccines.extend(self.risk_factors[condition])
            
            if condition_vaccines:
                analysis_parts.append(f"Condition-specific vaccines needed: {', '.join(set(condition_vaccines))}")
        
        return " | ".join(analysis_parts)
    
    def _assess_overall_risk(self, completed_vaccinations: List[VaccinationRecord],
                            missing_vaccinations: List[MissingVaccination]) -> str:
        """Assess overall vaccination risk"""
        high_risk_missing = len([vax for vax in missing_vaccinations if vax.risk_level == "high"])
        medium_risk_missing = len([vax for vax in missing_vaccinations if vax.risk_level == "medium"])
        
        if high_risk_missing >= 2:
            return "high"
        elif high_risk_missing >= 1 or medium_risk_missing >= 3:
            return "medium"
        elif missing_vaccinations:
            return "low"
        else:
            return "minimal"
    
    def _generate_recommendations(self, completed_vaccinations: List[VaccinationRecord],
                                missing_vaccinations: List[MissingVaccination]) -> List[str]:
        """Generate vaccination recommendations"""
        recommendations = []
        
        # Prioritize high-risk missing vaccines
        high_risk_missing = [vax for vax in missing_vaccinations if vax.risk_level == "high"]
        for vax in high_risk_missing:
            recommendations.append(f"Priority: Get {vax.name} vaccine immediately")
        
        # Schedule routine vaccines
        routine_missing = [vax for vax in missing_vaccinations if vax.risk_level == "low"]
        if routine_missing:
            recommendations.append(f"Schedule routine vaccines: {', '.join([vax.name for vax in routine_missing])}")
        
        # General recommendations
        recommendations.extend([
            "Keep vaccination records updated",
            "Discuss vaccination schedule with healthcare provider",
            "Report any adverse reactions to vaccines",
            "Stay informed about new vaccine recommendations"
        ])
        
        return recommendations
    
    async def get_model_status(self) -> Dict[str, Any]:
        """Get model status information"""
        return {
            "model_name": "Vaccination Tracking and Analysis Model",
            "status": self.model_status,
            "version": "1.0.0",
            "vaccines_covered": len(self.vaccine_database),
            "last_updated": "2024-01-01"
        } 