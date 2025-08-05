import pandas as pd
import numpy as np
import time
from typing import Dict, List, Any, Optional
import logging
from models.response_models import SurgicalProcedure, SurgicalStep

logger = logging.getLogger(__name__)

class SurgicalGuideService:
    def __init__(self):
        self.model_status = "loaded"
        self.procedure_database = self._load_procedure_database()
        self.complication_database = self._load_complication_database()
        self.equipment_database = self._load_equipment_database()
        self.anatomy_database = self._load_anatomy_database()
        
    def _load_procedure_database(self) -> Dict[str, Dict[str, Any]]:
        """Load comprehensive surgical procedure database"""
        return {
            "Laparoscopic Cholecystectomy": {
                "category": "General Surgery",
                "duration": "45-60 minutes",
                "complexity": "Medium",
                "success_rate": 0.95,
                "anesthesia": "General",
                "position": "Supine with arms extended",
                "equipment": ["Laparoscope", "Trocars", "Graspers", "Scissors", "Clip applier"],
                "indications": ["Symptomatic gallstones", "Cholecystitis", "Biliary colic"],
                "contraindications": ["Severe coagulopathy", "Uncontrolled sepsis", "Pregnancy (relative)"],
                "pre_op_requirements": [
                    "NPO for 8 hours",
                    "IV access",
                    "Antibiotic prophylaxis",
                    "Informed consent",
                    "Preoperative labs"
                ]
            },
            "Appendectomy": {
                "category": "General Surgery",
                "duration": "30-45 minutes",
                "complexity": "Low-Medium",
                "success_rate": 0.98,
                "anesthesia": "General",
                "position": "Supine",
                "equipment": ["Laparoscope", "Trocars", "Graspers", "Stapler"],
                "indications": ["Acute appendicitis", "Appendiceal mass"],
                "contraindications": ["Severe coagulopathy", "Uncontrolled sepsis"],
                "pre_op_requirements": [
                    "NPO for 6 hours",
                    "IV access",
                    "Antibiotic prophylaxis",
                    "Informed consent"
                ]
            },
            "Hernia Repair": {
                "category": "General Surgery",
                "duration": "60-90 minutes",
                "complexity": "Medium",
                "success_rate": 0.92,
                "anesthesia": "General or Local",
                "position": "Supine",
                "equipment": ["Mesh", "Sutures", "Retractors", "Scissors"],
                "indications": ["Inguinal hernia", "Ventral hernia", "Umbilical hernia"],
                "contraindications": ["Severe coagulopathy", "Active infection"],
                "pre_op_requirements": [
                    "NPO for 8 hours",
                    "IV access",
                    "Informed consent",
                    "Preoperative assessment"
                ]
            },
            "Cataract Surgery": {
                "category": "Ophthalmology",
                "duration": "15-30 minutes",
                "complexity": "Medium",
                "success_rate": 0.96,
                "anesthesia": "Local with sedation",
                "position": "Supine",
                "equipment": ["Phacoemulsification machine", "IOL", "Microscope"],
                "indications": ["Cataract", "Vision impairment"],
                "contraindications": ["Active eye infection", "Uncontrolled glaucoma"],
                "pre_op_requirements": [
                    "Eye drops (antibiotic, anti-inflammatory)",
                    "Informed consent",
                    "Preoperative measurements"
                ]
            },
            "Knee Arthroscopy": {
                "category": "Orthopedics",
                "duration": "30-60 minutes",
                "complexity": "Medium",
                "success_rate": 0.90,
                "anesthesia": "General or Regional",
                "position": "Supine with leg in holder",
                "equipment": ["Arthroscope", "Shavers", "Probes", "Sutures"],
                "indications": ["Meniscal tear", "ACL tear", "Joint pain"],
                "contraindications": ["Active infection", "Severe arthritis"],
                "pre_op_requirements": [
                    "NPO for 8 hours",
                    "IV access",
                    "Informed consent",
                    "Preoperative imaging"
                ]
            }
        }
    
    def _load_complication_database(self) -> Dict[str, Dict[str, Any]]:
        """Load surgical complication database"""
        return {
            "Laparoscopic Cholecystectomy": {
                "common": ["Bleeding (1-2%)", "Infection (1%)", "Bile leak (0.5%)"],
                "serious": ["Bile duct injury (0.3%)", "Retained stones (2%)", "Bowel injury (0.1%)"],
                "prevention": [
                    "Careful dissection of Calot's triangle",
                    "Proper identification of structures",
                    "Adequate visualization"
                ]
            },
            "Appendectomy": {
                "common": ["Bleeding (1%)", "Infection (2%)", "Ileus (5%)"],
                "serious": ["Abscess formation (1%)", "Bowel injury (0.1%)", "Wound dehiscence (0.5%)"],
                "prevention": [
                    "Adequate antibiotic coverage",
                    "Careful dissection",
                    "Proper closure"
                ]
            },
            "Hernia Repair": {
                "common": ["Seroma (5%)", "Chronic pain (3%)", "Infection (1%)"],
                "serious": ["Mesh infection (1%)", "Recurrence (2%)", "Nerve injury (0.5%)"],
                "prevention": [
                    "Proper mesh placement",
                    "Adequate overlap",
                    "Gentle tissue handling"
                ]
            },
            "Cataract Surgery": {
                "common": ["Corneal edema (5%)", "Inflammation (3%)", "Elevated IOP (2%)"],
                "serious": ["Endophthalmitis (0.1%)", "Retinal detachment (0.5%)", "Capsule rupture (1%)"],
                "prevention": [
                    "Aseptic technique",
                    "Proper IOL placement",
                    "Gentle manipulation"
                ]
            },
            "Knee Arthroscopy": {
                "common": ["Joint stiffness (5%)", "Swelling (10%)", "Pain (3%)"],
                "serious": ["Infection (0.1%)", "DVT (0.5%)", "Nerve injury (0.1%)"],
                "prevention": [
                    "Proper portal placement",
                    "Adequate visualization",
                    "Gentle tissue handling"
                ]
            }
        }
    
    def _load_equipment_database(self) -> Dict[str, Dict[str, Any]]:
        """Load surgical equipment database"""
        return {
            "Laparoscope": {
                "type": "Optical instrument",
                "purpose": "Visualization of abdominal cavity",
                "setup": "Connect to light source and camera",
                "maintenance": "Clean and sterilize after use"
            },
            "Trocars": {
                "type": "Access device",
                "purpose": "Create ports for instruments",
                "sizes": ["5mm", "10mm", "12mm"],
                "placement": "Insert under direct visualization"
            },
            "Graspers": {
                "type": "Grasping instrument",
                "purpose": "Hold and manipulate tissue",
                "varieties": ["Maryland", "Babcock", "Allis"],
                "usage": "Gentle tissue handling"
            },
            "Scissors": {
                "type": "Cutting instrument",
                "purpose": "Cut tissue and sutures",
                "varieties": ["Metzenbaum", "Mayo", "Laparoscopic"],
                "usage": "Sharp dissection"
            },
            "Clip applier": {
                "type": "Hemostatic device",
                "purpose": "Apply clips to vessels",
                "sizes": ["Medium", "Large"],
                "usage": "Secure cystic duct and artery"
            }
        }
    
    def _load_anatomy_database(self) -> Dict[str, Dict[str, Any]]:
        """Load anatomical reference database"""
        return {
            "Gallbladder": {
                "location": "Right upper quadrant",
                "blood_supply": "Cystic artery",
                "drainage": "Cystic duct to common bile duct",
                "landmarks": ["Calot's triangle", "Hartmann's pouch", "Cystic plate"]
            },
            "Appendix": {
                "location": "Right lower quadrant",
                "blood_supply": "Appendiceal artery",
                "base": "Cecum",
                "variations": ["Retrocecal", "Pelvic", "Subcecal"]
            },
            "Inguinal Canal": {
                "location": "Groin region",
                "contents": ["Spermatic cord (male)", "Round ligament (female)"],
                "boundaries": ["Inguinal ligament", "Conjoint tendon", "Internal oblique"],
                "hernia_types": ["Direct", "Indirect", "Femoral"]
            },
            "Eye": {
                "structures": ["Cornea", "Iris", "Lens", "Retina"],
                "measurements": ["Axial length", "Keratometry", "IOL power"],
                "complications": ["Capsule rupture", "Vitreous loss", "Iris trauma"]
            },
            "Knee": {
                "compartments": ["Medial", "Lateral", "Patellofemoral"],
                "structures": ["ACL", "PCL", "MCL", "LCL", "Meniscus"],
                "portals": ["Anterolateral", "Anteromedial", "Posteromedial"]
            }
        }
    
    async def get_surgical_procedure(self, procedure_name: str, patient_data: Dict[str, Any] = None) -> SurgicalProcedure:
        """Get detailed surgical procedure guide"""
        try:
            procedure_info = self.procedure_database.get(procedure_name, {})
            if not procedure_info:
                raise ValueError(f"Procedure {procedure_name} not found in database")
            
            # Generate procedure steps
            pre_op_steps = await self._generate_pre_op_steps(procedure_name, procedure_info, patient_data)
            procedure_steps = await self._generate_procedure_steps(procedure_name, procedure_info)
            post_op_steps = await self._generate_post_op_steps(procedure_name, procedure_info)
            
            # Get complications
            complications = self.complication_database.get(procedure_name, {}).get("common", [])
            complications.extend(self.complication_database.get(procedure_name, {}).get("serious", []))
            
            return SurgicalProcedure(
                name=procedure_name,
                scheduled_date=patient_data.get("scheduled_date", "TBD") if patient_data else "TBD",
                duration=procedure_info.get("duration", "Variable"),
                complexity=procedure_info.get("complexity", "Unknown"),
                pre_op_steps=pre_op_steps,
                procedure_steps=procedure_steps,
                post_op_steps=post_op_steps,
                complications=complications,
                success_rate=procedure_info.get("success_rate", 0.0)
            )
            
        except Exception as e:
            logger.error(f"Error getting surgical procedure: {e}")
            raise
    
    async def _generate_pre_op_steps(self, procedure_name: str, procedure_info: Dict[str, Any], 
                                   patient_data: Dict[str, Any] = None) -> List[SurgicalStep]:
        """Generate pre-operative steps"""
        steps = []
        step_number = 1
        
        # Standard pre-op requirements
        pre_op_requirements = procedure_info.get("pre_op_requirements", [])
        
        for requirement in pre_op_requirements:
            step = SurgicalStep(
                step_number=step_number,
                description=requirement,
                duration="Variable",
                critical_points=[f"Ensure {requirement.lower()} is completed"],
                warnings=["Failure to complete may delay or cancel surgery"]
            )
            steps.append(step)
            step_number += 1
        
        # Patient-specific steps
        if patient_data:
            if patient_data.get("diabetes"):
                steps.append(SurgicalStep(
                    step_number=step_number,
                    description="Check blood glucose and adjust insulin if needed",
                    duration="15 minutes",
                    critical_points=["Maintain glucose 80-200 mg/dL"],
                    warnings=["Hypoglycemia risk if NPO"]
                ))
                step_number += 1
            
            if patient_data.get("anticoagulation"):
                steps.append(SurgicalStep(
                    step_number=step_number,
                    description="Hold anticoagulation as per protocol",
                    duration="24-48 hours",
                    critical_points=["Check INR if on warfarin", "Consider bridging therapy"],
                    warnings=["Risk of bleeding if not held properly"]
                ))
                step_number += 1
        
        return steps
    
    async def _generate_procedure_steps(self, procedure_name: str, procedure_info: Dict[str, Any]) -> List[SurgicalStep]:
        """Generate detailed procedure steps"""
        steps = []
        step_number = 1
        
        if procedure_name == "Laparoscopic Cholecystectomy":
            steps = [
                SurgicalStep(
                    step_number=step_number,
                    description="Position patient supine with arms extended",
                    duration="5 minutes",
                    critical_points=["Ensure patient is secure", "Check pressure points"],
                    warnings=["Risk of nerve injury if positioning incorrect"]
                ),
                SurgicalStep(
                    step_number=step_number + 1,
                    description="Create umbilical port (10mm) using Hasson technique",
                    duration="5 minutes",
                    critical_points=["Enter at umbilicus", "Confirm intraperitoneal location"],
                    warnings=["Risk of bowel injury if not careful"]
                ),
                SurgicalStep(
                    step_number=step_number + 2,
                    description="Establish pneumoperitoneum (12-15 mmHg)",
                    duration="3 minutes",
                    critical_points=["Monitor pressure", "Check for subcutaneous emphysema"],
                    warnings=["High pressure can cause cardiovascular compromise"]
                ),
                SurgicalStep(
                    step_number=step_number + 3,
                    description="Insert laparoscope and inspect abdomen",
                    duration="5 minutes",
                    critical_points=["Systematic inspection", "Document any findings"],
                    warnings=["Missed injuries if inspection incomplete"]
                ),
                SurgicalStep(
                    step_number=step_number + 4,
                    description="Create additional ports under direct visualization",
                    duration="10 minutes",
                    critical_points=["Epigastric port (5mm)", "Right subcostal port (5mm)"],
                    warnings=["Risk of bleeding or organ injury"]
                ),
                SurgicalStep(
                    step_number=step_number + 5,
                    description="Identify and dissect Calot's triangle",
                    duration="15 minutes",
                    critical_points=["Identify cystic duct and artery", "Clear triangle of Calot"],
                    warnings=["Bile duct injury risk if dissection too medial"]
                ),
                SurgicalStep(
                    step_number=step_number + 6,
                    description="Apply clips to cystic duct and artery",
                    duration="5 minutes",
                    critical_points=["Secure clips properly", "Ensure no bile leak"],
                    warnings=["Bile leak if clips not secure"]
                ),
                SurgicalStep(
                    step_number=step_number + 7,
                    description="Divide cystic duct and artery",
                    duration="3 minutes",
                    critical_points=["Cut between clips", "Ensure complete division"],
                    warnings=["Bleeding if artery not completely divided"]
                ),
                SurgicalStep(
                    step_number=step_number + 8,
                    description="Dissect gallbladder from liver bed",
                    duration="10 minutes",
                    critical_points=["Stay in correct plane", "Control any bleeding"],
                    warnings=["Liver injury if dissection too deep"]
                ),
                SurgicalStep(
                    step_number=step_number + 9,
                    description="Remove gallbladder through umbilical port",
                    duration="5 minutes",
                    critical_points=["Extract carefully", "Check for stones"],
                    warnings=["Port site hernia if extraction too forceful"]
                ),
                SurgicalStep(
                    step_number=step_number + 10,
                    description="Irrigate and inspect for bleeding",
                    duration="5 minutes",
                    critical_points=["Thorough irrigation", "Check all port sites"],
                    warnings=["Missed bleeding if inspection incomplete"]
                ),
                SurgicalStep(
                    step_number=step_number + 11,
                    description="Close port sites with subcuticular sutures",
                    duration="10 minutes",
                    critical_points=["Close fascia for 10mm ports", "Cosmetic closure"],
                    warnings=["Port site hernia if fascia not closed"]
                )
            ]
        
        elif procedure_name == "Appendectomy":
            steps = [
                SurgicalStep(
                    step_number=step_number,
                    description="Position patient supine",
                    duration="3 minutes",
                    critical_points=["Secure patient", "Prep abdomen"],
                    warnings=["Risk of pressure injury"]
                ),
                SurgicalStep(
                    step_number=step_number + 1,
                    description="Create umbilical port and establish pneumoperitoneum",
                    duration="5 minutes",
                    critical_points=["Enter safely", "Check pressure"],
                    warnings=["Risk of bowel injury"]
                ),
                SurgicalStep(
                    step_number=step_number + 2,
                    description="Insert laparoscope and identify appendix",
                    duration="5 minutes",
                    critical_points=["Systematic inspection", "Document findings"],
                    warnings=["Missed pathology if inspection incomplete"]
                ),
                SurgicalStep(
                    step_number=step_number + 3,
                    description="Create additional ports for instruments",
                    duration="5 minutes",
                    critical_points=["Left lower quadrant port", "Right lower quadrant port"],
                    warnings=["Risk of injury during port placement"]
                ),
                SurgicalStep(
                    step_number=step_number + 4,
                    description="Mobilize appendix and mesoappendix",
                    duration="10 minutes",
                    critical_points=["Identify base", "Control mesoappendix"],
                    warnings=["Bleeding from mesoappendix"]
                ),
                SurgicalStep(
                    step_number=step_number + 5,
                    description="Divide mesoappendix with energy device",
                    duration="5 minutes",
                    critical_points=["Secure division", "Check for bleeding"],
                    warnings=["Bleeding if division incomplete"]
                ),
                SurgicalStep(
                    step_number=step_number + 6,
                    description="Staple appendix at base",
                    duration="3 minutes",
                    critical_points=["Place staples correctly", "Ensure complete division"],
                    warnings=["Staple line leak if not secure"]
                ),
                SurgicalStep(
                    step_number=step_number + 7,
                    description="Remove appendix through port",
                    duration="3 minutes",
                    critical_points=["Extract carefully", "Check specimen"],
                    warnings=["Port site contamination"]
                ),
                SurgicalStep(
                    step_number=step_number + 8,
                    description="Irrigate and inspect",
                    duration="5 minutes",
                    critical_points=["Thorough irrigation", "Check for bleeding"],
                    warnings=["Missed pathology if inspection incomplete"]
                ),
                SurgicalStep(
                    step_number=step_number + 9,
                    description="Close port sites",
                    duration="5 minutes",
                    critical_points=["Close fascia", "Cosmetic closure"],
                    warnings=["Port site hernia"]
                )
            ]
        
        return steps
    
    async def _generate_post_op_steps(self, procedure_name: str, procedure_info: Dict[str, Any]) -> List[SurgicalStep]:
        """Generate post-operative care steps"""
        steps = []
        step_number = 1
        
        # Standard post-op care
        steps.extend([
            SurgicalStep(
                step_number=step_number,
                description="Monitor vital signs every 15 minutes initially",
                duration="2 hours",
                critical_points=["Blood pressure", "Heart rate", "Oxygen saturation"],
                warnings=["Signs of bleeding or complications"]
            ),
            SurgicalStep(
                step_number=step_number + 1,
                description="Assess for signs of bleeding",
                duration="Ongoing",
                critical_points=["Check dressings", "Monitor hemoglobin"],
                warnings=["Delayed bleeding can occur"]
            ),
            SurgicalStep(
                step_number=step_number + 2,
                description="Pain management with IV then oral medications",
                duration="24-48 hours",
                critical_points=["Adequate pain control", "Monitor for side effects"],
                warnings=["Over-sedation risk"]
            ),
            SurgicalStep(
                step_number=step_number + 3,
                description="Ambulate patient within 4-6 hours",
                duration="Variable",
                critical_points=["Prevent DVT", "Improve recovery"],
                warnings=["Risk of falls"]
            )
        ])
        
        # Procedure-specific post-op care
        if procedure_name == "Laparoscopic Cholecystectomy":
            steps.extend([
                SurgicalStep(
                    step_number=step_number + 4,
                    description="Monitor for signs of bile leak",
                    duration="24-48 hours",
                    critical_points=["Abdominal pain", "Jaundice", "Fever"],
                    warnings=["Bile leak requires intervention"]
                ),
                SurgicalStep(
                    step_number=step_number + 5,
                    description="Discharge criteria: tolerating diet, pain controlled",
                    duration="4-6 hours",
                    critical_points=["Able to eat", "Pain controlled", "Able to ambulate"],
                    warnings=["Early discharge may mask complications"]
                )
            ])
        
        elif procedure_name == "Appendectomy":
            steps.extend([
                SurgicalStep(
                    step_number=step_number + 4,
                    description="Monitor for signs of infection",
                    duration="24-48 hours",
                    critical_points=["Fever", "WBC count", "Abdominal pain"],
                    warnings=["Post-op abscess can occur"]
                ),
                SurgicalStep(
                    step_number=step_number + 5,
                    description="Discharge when tolerating diet and afebrile",
                    duration="6-12 hours",
                    critical_points=["No fever", "Able to eat", "Pain controlled"],
                    warnings=["Infection may develop after discharge"]
                )
            ])
        
        return steps
    
    async def get_complication_prevention(self, procedure_name: str) -> Dict[str, List[str]]:
        """Get complication prevention strategies"""
        complications = self.complication_database.get(procedure_name, {})
        return {
            "common_complications": complications.get("common", []),
            "serious_complications": complications.get("serious", []),
            "prevention_strategies": complications.get("prevention", [])
        }
    
    async def get_equipment_guide(self, procedure_name: str) -> Dict[str, Any]:
        """Get equipment guide for procedure"""
        procedure_info = self.procedure_database.get(procedure_name, {})
        equipment_list = procedure_info.get("equipment", [])
        
        equipment_guide = {}
        for equipment in equipment_list:
            if equipment in self.equipment_database:
                equipment_guide[equipment] = self.equipment_database[equipment]
        
        return {
            "procedure": procedure_name,
            "equipment": equipment_guide,
            "setup_notes": "Ensure all equipment is available and functioning before starting"
        }
    
    async def get_anatomy_guide(self, procedure_name: str) -> Dict[str, Any]:
        """Get anatomical reference for procedure"""
        anatomy_mapping = {
            "Laparoscopic Cholecystectomy": "Gallbladder",
            "Appendectomy": "Appendix",
            "Hernia Repair": "Inguinal Canal",
            "Cataract Surgery": "Eye",
            "Knee Arthroscopy": "Knee"
        }
        
        relevant_anatomy = anatomy_mapping.get(procedure_name, "")
        if relevant_anatomy in self.anatomy_database:
            return {
                "procedure": procedure_name,
                "anatomy": self.anatomy_database[relevant_anatomy]
            }
        
        return {"procedure": procedure_name, "anatomy": "Not available"}
    
    async def get_model_status(self) -> Dict[str, Any]:
        """Get model status information"""
        return {
            "model_name": "Surgical Procedure Guide Model",
            "status": self.model_status,
            "version": "1.0.0",
            "procedures_covered": len(self.procedure_database),
            "last_updated": "2024-01-01"
        } 