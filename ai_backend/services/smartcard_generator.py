import qrcode
import json
from typing import Dict, Any, Optional
from datetime import datetime
import base64
import io

class SmartcardGenerator:
    def __init__(self):
        pass

    def generate_smartcard(self, patient_info: Dict[str, Any], vaccine_info: Dict[str, Any],
                           test_info: Optional[Dict[str, Any]] = None,
                           transplant_info: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        Generate a SMART health card with vaccine, test, and transplant information.
        
        Args:
            patient_info: Patient demographic information
            vaccine_info: Vaccine details (type, date, doses, etc.)
            test_info: COVID-19 test results (optional)
            transplant_info: Organ transplant information (optional)
        """
        
        # Create the card payload
        card_payload = {
            "iss": "ai_telemedicine_system",
            "iat": int(datetime.now().timestamp()),
            "exp": int((datetime.now().replace(year=datetime.now().year + 1)).timestamp()),
            "patient": {
                "id": patient_info.get("id"),
                "name": patient_info.get("name"),
                "date_of_birth": patient_info.get("date_of_birth"),
                "gender": patient_info.get("gender"),
                "blood_type": patient_info.get("blood_type"),
                "emergency_contact": patient_info.get("emergency_contact")
            },
            "vaccines": [],
            "tests": [],
            "transplants": []
        }
        
        # Add vaccine information
        if vaccine_info:
            for vaccine in vaccine_info.get("vaccines", []):
                card_payload["vaccines"].append({
                    "type": vaccine.get("type"),
                    "manufacturer": vaccine.get("manufacturer"),
                    "date_administered": vaccine.get("date_administered"),
                    "dose_number": vaccine.get("dose_number"),
                    "lot_number": vaccine.get("lot_number"),
                    "administering_provider": vaccine.get("administering_provider")
                })
        
        # Add test information
        if test_info:
            for test in test_info.get("tests", []):
                card_payload["tests"].append({
                    "type": test.get("type"),  # PCR, Antigen, Antibody
                    "result": test.get("result"),  # Positive, Negative, Inconclusive
                    "date_taken": test.get("date_taken"),
                    "date_reported": test.get("date_reported"),
                    "laboratory": test.get("laboratory"),
                    "test_id": test.get("test_id")
                })
        
        # Add transplant information
        if transplant_info:
            for transplant in transplant_info.get("transplants", []):
                transplant_data = {
                    "organ_type": transplant.get("organ_type"),  # kidney, liver, heart, lung, etc.
                    "transplant_date": transplant.get("transplant_date"),
                    "transplant_center": transplant.get("transplant_center"),
                    "surgeon": transplant.get("surgeon"),
                    "donor_type": transplant.get("donor_type"),  # deceased, living, paired
                    "blood_type_match": transplant.get("blood_type_match"),
                    "hla_match": transplant.get("hla_match"),
                    "status": transplant.get("status"),  # active, failed, removed
                    "immunosuppression": []
                }
                
                # Add immunosuppression medications
                for med in transplant.get("immunosuppression", []):
                    transplant_data["immunosuppression"].append({
                        "medication": med.get("medication"),
                        "dosage": med.get("dosage"),
                        "frequency": med.get("frequency"),
                        "start_date": med.get("start_date"),
                        "end_date": med.get("end_date"),
                        "reason_for_change": med.get("reason_for_change")
                    })
                
                card_payload["transplants"].append(transplant_data)
        
        # Generate QR code
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=4,
        )
        qr.add_data(json.dumps(card_payload))
        qr.make(fit=True)
        
        # Create QR code image
        img = qr.make_image(fill_color="black", back_color="white")
        
        # Convert to base64
        buffer = io.BytesIO()
        img.save(buffer, format='PNG')
        qr_code_base64 = base64.b64encode(buffer.getvalue()).decode()
        
        return {
            "qr_code": f"data:image/png;base64,{qr_code_base64}",
            "payload": card_payload,
            "card_type": "smart_health_card",
            "version": "1.0",
            "generated_at": datetime.now().isoformat()
        }
    
    def generate_transplant_specific_card(self, patient_info: Dict[str, Any], 
                                        transplant_info: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generate a specialized card for organ transplant patients.
        """
        return self.generate_smartcard(
            patient_info=patient_info,
            vaccine_info={},  # Empty for transplant-specific card
            transplant_info=transplant_info
        )
    
    def validate_transplant_data(self, transplant_info: Dict[str, Any]) -> Dict[str, Any]:
        """
        Validate transplant information and return validation results.
        """
        errors = []
        warnings = []
        
        required_fields = ["organ_type", "transplant_date", "transplant_center"]
        for field in required_fields:
            if not transplant_info.get(field):
                errors.append(f"Missing required field: {field}")
        
        # Check for immunosuppression medications
        if not transplant_info.get("immunosuppression"):
            warnings.append("No immunosuppression medications recorded")
        
        # Check transplant date validity
        try:
            transplant_date = datetime.fromisoformat(transplant_info.get("transplant_date", ""))
            if transplant_date > datetime.now():
                errors.append("Transplant date cannot be in the future")
        except:
            errors.append("Invalid transplant date format")
        
        return {
            "is_valid": len(errors) == 0,
            "errors": errors,
            "warnings": warnings
        }

if __name__ == "__main__":
    # Example usage
    patient_info = {
        "name": "John Doe",
        "dob": "1980-01-01",
        "gender": "male",
        "id": "1234567890"
    }
    vaccine_info = {
        "vaccine": "COVID-19 mRNA",
        "manufacturer": "Pfizer",
        "date": "2023-12-01",
        "lot": "AB1234"
    }
    test_info = {
        "type": "PCR",
        "result": "negative",
        "date": "2023-12-10"
    }
    generator = SmartcardGenerator()
    card = generator.generate_smartcard(patient_info, vaccine_info, test_info)
    print(card["card_json"])
    print("QR code (base64):", card["qr_code_base64"][:50], "...") 