import pandas as pd
import numpy as np
import pdfplumber
import tabula
import re
import time
from typing import Dict, List, Any, Optional
import logging
from models.response_models import BloodworkAnalysisResult, LabValue

logger = logging.getLogger(__name__)

class BloodworkAnalysisService:
    def __init__(self):
        self.model_status = "loaded"
        self.reference_ranges = self._load_reference_ranges()
        self.critical_values = self._load_critical_values()
        
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
    
    async def _parse_pdf(self, file_path: str) -> List[LabValue]:
        """Parse lab values from PDF file"""
        try:
            lab_values = []
            
            # Try pdfplumber first
            with pdfplumber.open(file_path) as pdf:
                for page in pdf.pages:
                    text = page.extract_text()
                    if text:
                        values = self._extract_lab_values_from_text(text)
                        lab_values.extend(values)
            
            # If no values found, try tabula for tables
            if not lab_values:
                tables = tabula.read_pdf(file_path, pages='all')
                for table in tables:
                    values = self._extract_lab_values_from_table(table)
                    lab_values.extend(values)
            
            return lab_values
            
        except Exception as e:
            logger.error(f"Error parsing PDF: {e}")
            raise
    
    async def _parse_csv(self, file_path: str) -> List[LabValue]:
        """Parse lab values from CSV file"""
        try:
            df = pd.read_csv(file_path)
            return self._extract_lab_values_from_dataframe(df)
            
        except Exception as e:
            logger.error(f"Error parsing CSV: {e}")
            raise
    
    def _extract_lab_values_from_text(self, text: str) -> List[LabValue]:
        """Extract lab values from text using regex patterns"""
        lab_values = []
        
        # Common patterns for lab value extraction
        patterns = [
            r'(\w+(?:\s+\w+)*)\s*:?\s*([\d.]+)\s*([a-zA-Z/%]+)',
            r'([\w\s]+)\s+([\d.]+)\s+([a-zA-Z/%]+)',
            r'([\w\s]+)\s*=\s*([\d.]+)\s*([a-zA-Z/%]+)'
        ]
        
        for pattern in patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            for match in matches:
                name, value, unit = match
                name = name.strip()
                
                # Clean up name and check if it's a known lab test
                normalized_name = self._normalize_lab_name(name)
                if normalized_name in self.reference_ranges:
                    try:
                        numeric_value = float(value)
                        lab_value = self._create_lab_value(normalized_name, numeric_value, unit)
                        if lab_value:
                            lab_values.append(lab_value)
                    except ValueError:
                        continue
        
        return lab_values
    
    def _extract_lab_values_from_table(self, table: pd.DataFrame) -> List[LabValue]:
        """Extract lab values from pandas DataFrame"""
        lab_values = []
        
        # Common column patterns
        column_patterns = [
            ['Test', 'Value', 'Unit', 'Reference'],
            ['Lab Test', 'Result', 'Units', 'Normal Range'],
            ['Test Name', 'Value', 'Unit', 'Reference Range']
        ]
        
        for pattern in column_patterns:
            if all(col in table.columns for col in pattern):
                for _, row in table.iterrows():
                    try:
                        test_name = str(row[pattern[0]]).strip()
                        value = float(row[pattern[1]])
                        unit = str(row[pattern[2]]).strip()
                        
                        normalized_name = self._normalize_lab_name(test_name)
                        if normalized_name in self.reference_ranges:
                            lab_value = self._create_lab_value(normalized_name, value, unit)
                            if lab_value:
                                lab_values.append(lab_value)
                    except (ValueError, KeyError):
                        continue
        
        return lab_values
    
    def _extract_lab_values_from_dataframe(self, df: pd.DataFrame) -> List[LabValue]:
        """Extract lab values from CSV DataFrame"""
        lab_values = []
        
        # Try to identify columns
        for col in df.columns:
            if any(keyword in col.lower() for keyword in ['test', 'lab', 'name']):
                test_col = col
                break
        else:
            # Default to first column
            test_col = df.columns[0]
        
        # Find value and unit columns
        value_col = None
        unit_col = None
        
        for col in df.columns:
            if any(keyword in col.lower() for keyword in ['value', 'result', 'level']):
                value_col = col
            elif any(keyword in col.lower() for keyword in ['unit', 'units']):
                unit_col = col
        
        if value_col:
            for _, row in df.iterrows():
                try:
                    test_name = str(row[test_col]).strip()
                    value = float(row[value_col])
                    unit = str(row.get(unit_col, '')).strip() if unit_col else ''
                    
                    normalized_name = self._normalize_lab_name(test_name)
                    if normalized_name in self.reference_ranges:
                        lab_value = self._create_lab_value(normalized_name, value, unit)
                        if lab_value:
                            lab_values.append(lab_value)
                except (ValueError, KeyError):
                    continue
        
        return lab_values
    
    def _normalize_lab_name(self, name: str) -> str:
        """Normalize lab test names to match reference ranges"""
        name = name.upper().strip()
        
        # Common variations
        variations = {
            'WBC': ['WHITE BLOOD CELLS', 'LEUKOCYTES', 'WBC COUNT'],
            'RBC': ['RED BLOOD CELLS', 'ERYTHROCYTES', 'RBC COUNT'],
            'Hemoglobin': ['HGB', 'HEMOGLOBIN', 'HB'],
            'Hematocrit': ['HCT', 'HEMATOCRIT', 'PACKED CELL VOLUME'],
            'Platelets': ['PLT', 'PLATELET COUNT', 'THROMBOCYTES'],
            'Glucose': ['GLU', 'BLOOD SUGAR', 'GLUCOSE'],
            'Creatinine': ['CREAT', 'CREATININE'],
            'BUN': ['BLOOD UREA NITROGEN', 'UREA NITROGEN'],
            'Sodium': ['NA', 'SODIUM'],
            'Potassium': ['K', 'POTASSIUM'],
            'Chloride': ['CL', 'CHLORIDE'],
            'CO2': ['BICARBONATE', 'HCO3', 'CO2'],
            'Calcium': ['CA', 'CALCIUM'],
            'Albumin': ['ALB', 'ALBUMIN'],
            'Total Protein': ['PROTEIN', 'TOTAL PROTEIN', 'TP'],
            'Bilirubin Total': ['BILIRUBIN', 'TOTAL BILIRUBIN', 'TBIL'],
            'ALT': ['ALANINE AMINOTRANSFERASE', 'SGPT', 'ALT'],
            'AST': ['ASPARTATE AMINOTRANSFERASE', 'SGOT', 'AST'],
            'Alkaline Phosphatase': ['ALP', 'ALKALINE PHOSPHATASE', 'ALK PHOS']
        }
        
        for normalized, variants in variations.items():
            if name in variants or any(variant in name for variant in variants):
                return normalized
        
        return name
    
    def _create_lab_value(self, name: str, value: float, unit: str) -> Optional[LabValue]:
        """Create LabValue object with proper validation"""
        if name not in self.reference_ranges:
            return None
        
        ref_range = self.reference_ranges[name]
        normal_min, normal_max = ref_range["normal_range"]
        
        # Determine status
        if value < ref_range["critical_low"]:
            status = "critical"
        elif value > ref_range["critical_high"]:
            status = "critical"
        elif value < normal_min:
            status = "low"
        elif value > normal_max:
            status = "high"
        else:
            status = "normal"
        
        # Generate significance
        significance = self._generate_significance(name, value, status)
        
        return LabValue(
            name=name,
            value=value,
            unit=ref_range["unit"],
            reference_range=f"{normal_min}-{normal_max}",
            status=status,
            significance=significance
        )
    
    def _generate_significance(self, name: str, value: float, status: str) -> Optional[str]:
        """Generate clinical significance for abnormal values"""
        if status == "normal":
            return None
        
        significance_map = {
            "WBC": {
                "high": "Possible infection, inflammation, or leukemia",
                "low": "Possible bone marrow suppression, infection, or autoimmune disease"
            },
            "Hemoglobin": {
                "high": "Possible polycythemia, dehydration, or high altitude",
                "low": "Possible anemia, blood loss, or nutritional deficiency"
            },
            "Platelets": {
                "high": "Possible inflammation, infection, or myeloproliferative disorder",
                "low": "Possible bleeding risk, bone marrow disorder, or medication effect"
            },
            "Glucose": {
                "high": "Possible diabetes, stress, or medication effect",
                "low": "Possible hypoglycemia, insulin overdose, or fasting"
            },
            "Creatinine": {
                "high": "Possible kidney dysfunction, dehydration, or medication effect",
                "low": "Possible muscle wasting, pregnancy, or low protein diet"
            },
            "Sodium": {
                "high": "Possible dehydration, diabetes insipidus, or excess salt intake",
                "low": "Possible fluid overload, SIADH, or diuretic use"
            },
            "Potassium": {
                "high": "Possible kidney failure, medication effect, or tissue damage",
                "low": "Possible diuretic use, vomiting, or malnutrition"
            }
        }
        
        return significance_map.get(name, {}).get(status)
    
    def _identify_abnormalities(self, lab_values: List[LabValue]) -> List[str]:
        """Identify significant abnormalities"""
        abnormalities = []
        
        for lab_value in lab_values:
            if lab_value.status in ["high", "low", "critical"]:
                abnormality = f"{lab_value.name}: {lab_value.value} {lab_value.unit} ({lab_value.status})"
                abnormalities.append(abnormality)
        
        return abnormalities
    
    def _generate_recommendations(self, lab_values: List[LabValue], abnormalities: List[str]) -> List[str]:
        """Generate clinical recommendations based on lab values"""
        recommendations = []
        
        # Check for critical values
        critical_values = [lv for lv in lab_values if lv.status == "critical"]
        if critical_values:
            recommendations.append("Immediate medical attention required for critical values")
        
        # Check for anemia pattern
        hgb = next((lv for lv in lab_values if lv.name == "Hemoglobin"), None)
        hct = next((lv for lv in lab_values if lv.name == "Hematocrit"), None)
        if hgb and hct and hgb.status == "low" and hct.status == "low":
            recommendations.append("Consider iron studies and B12/folate levels")
        
        # Check for kidney function
        creat = next((lv for lv in lab_values if lv.name == "Creatinine"), None)
        bun = next((lv for lv in lab_values if lv.name == "BUN"), None)
        if creat and creat.status in ["high", "critical"]:
            recommendations.append("Consider kidney function evaluation and nephrology consult")
        
        # Check for electrolyte imbalance
        na = next((lv for lv in lab_values if lv.name == "Sodium"), None)
        k = next((lv for lv in lab_values if lv.name == "Potassium"), None)
        if na and k and (na.status != "normal" or k.status != "normal"):
            recommendations.append("Monitor electrolytes and consider IV fluids if needed")
        
        # Check for infection markers
        wbc = next((lv for lv in lab_values if lv.name == "WBC"), None)
        if wbc and wbc.status == "high":
            recommendations.append("Consider infection workup and antibiotic therapy")
        
        if not recommendations:
            recommendations.append("All values within normal limits")
        
        return recommendations
    
    def _determine_urgency(self, lab_values: List[LabValue], abnormalities: List[str]) -> str:
        """Determine urgency level based on lab values"""
        critical_count = len([lv for lv in lab_values if lv.status == "critical"])
        high_count = len([lv for lv in lab_values if lv.status == "high"])
        low_count = len([lv for lv in lab_values if lv.status == "low"])
        
        if critical_count > 0:
            return "critical"
        elif high_count + low_count >= 3:
            return "high"
        elif high_count + low_count >= 1:
            return "medium"
        else:
            return "low"
    
    def _suggest_additional_tests(self, lab_values: List[LabValue], abnormalities: List[str]) -> List[str]:
        """Suggest additional tests based on current results"""
        suggested_tests = []
        
        # Check for anemia
        hgb = next((lv for lv in lab_values if lv.name == "Hemoglobin"), None)
        if hgb and hgb.status == "low":
            suggested_tests.extend(["Iron Studies", "B12", "Folate", "Reticulocyte Count"])
        
        # Check for kidney issues
        creat = next((lv for lv in lab_values if lv.name == "Creatinine"), None)
        if creat and creat.status in ["high", "critical"]:
            suggested_tests.extend(["Urinalysis", "Protein/Creatinine Ratio", "Kidney Ultrasound"])
        
        # Check for liver issues
        alt = next((lv for lv in lab_values if lv.name == "ALT"), None)
        ast = next((lv for lv in lab_values if lv.name == "AST"), None)
        if (alt and alt.status != "normal") or (ast and ast.status != "normal"):
            suggested_tests.extend(["Liver Function Panel", "Hepatitis Panel", "Liver Ultrasound"])
        
        # Check for diabetes
        glucose = next((lv for lv in lab_values if lv.name == "Glucose"), None)
        if glucose and glucose.status == "high":
            suggested_tests.extend(["HbA1c", "Fasting Glucose", "Oral Glucose Tolerance Test"])
        
        return suggested_tests
    
    async def get_model_status(self) -> Dict[str, Any]:
        """Get model status information"""
        return {
            "model_name": "Bloodwork Analysis Model",
            "status": self.model_status,
            "version": "1.0.0",
            "last_updated": "2024-01-01"
        } 