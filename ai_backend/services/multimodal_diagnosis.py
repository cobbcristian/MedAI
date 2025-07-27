import asyncio
import json
import logging
import os
from datetime import datetime
from typing import Dict, List, Optional, Any
import numpy as np
from PIL import Image
import io
import base64

# AI/ML imports
import torch
import torch.nn as nn
from transformers import AutoTokenizer, AutoModel
import openai
from openai import AsyncOpenAI

logger = logging.getLogger(__name__)

class MultimodalDiagnosisService:
    """
    Multimodal AI diagnosis service that combines:
    - Symptoms (text)
    - Medical images (MRI, X-ray, CT, Ultrasound)
    - Lab data (bloodwork, urine, etc.)
    - Patient demographics and history
    """
    
    def __init__(self):
        self.client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        self.model_version = "v1.3.7"
        self.confidence_threshold = 0.75
        
        # Initialize multimodal model components
        self.text_encoder = None
        self.image_encoder = None
        self.fusion_model = None
        
        # Load models asynchronously
        asyncio.create_task(self._load_models())
    
    async def _load_models(self):
        """Load multimodal models asynchronously"""
        try:
            # Initialize text encoder (for symptoms and lab data)
            self.text_encoder = AutoModel.from_pretrained("microsoft/BiomedNLP-PubMedBERT-base-uncased-abstract")
            self.text_tokenizer = AutoTokenizer.from_pretrained("microsoft/BiomedNLP-PubMedBERT-base-uncased-abstract")
            
            # Initialize image encoder (for medical scans)
            self.image_encoder = AutoModel.from_pretrained("microsoft/BiomedCLIP-PubMedBERT_256-vit_base_patch16_224")
            
            # Initialize fusion model for combining modalities
            self.fusion_model = self._create_fusion_model()
            
            logger.info("Multimodal models loaded successfully")
            
        except Exception as e:
            logger.error(f"Error loading multimodal models: {e}")
            raise
    
    def _create_fusion_model(self):
        """Create fusion model to combine text and image features"""
        class MultimodalFusion(nn.Module):
            def __init__(self, text_dim=768, image_dim=768, hidden_dim=512, num_classes=1000):
                super().__init__()
                self.text_projection = nn.Linear(text_dim, hidden_dim)
                self.image_projection = nn.Linear(image_dim, hidden_dim)
                self.fusion_layer = nn.Linear(hidden_dim * 2, hidden_dim)
                self.classifier = nn.Linear(hidden_dim, num_classes)
                self.dropout = nn.Dropout(0.3)
                
            def forward(self, text_features, image_features):
                text_proj = self.text_projection(text_features)
                image_proj = self.image_projection(image_features)
                combined = torch.cat([text_proj, image_proj], dim=1)
                fused = self.fusion_layer(combined)
                fused = torch.relu(fused)
                fused = self.dropout(fused)
                return self.classifier(fused)
        
        return MultimodalFusion()
    
    async def analyze_multimodal(
        self,
        symptoms: str,
        images: List[Dict[str, Any]] = None,  # List of {image_data, image_type, metadata}
        lab_data: Dict[str, Any] = None,
        patient_demographics: Dict[str, Any] = None,
        medical_history: str = None
    ) -> Dict[str, Any]:
        """
        Perform multimodal diagnosis analysis
        
        Args:
            symptoms: Patient-reported symptoms
            images: List of medical images with metadata
            lab_data: Laboratory test results
            patient_demographics: Age, gender, weight, height, etc.
            medical_history: Previous conditions, medications, etc.
        
        Returns:
            Unified diagnosis with confidence scores and explanations
        """
        try:
            # Step 1: Process text inputs (symptoms, lab data, history)
            text_features = await self._process_text_inputs(
                symptoms, lab_data, medical_history
            )
            
            # Step 2: Process medical images
            image_features = await self._process_images(images) if images else None
            
            # Step 3: Combine modalities for unified diagnosis
            diagnosis_result = await self._generate_unified_diagnosis(
                text_features, image_features, patient_demographics
            )
            
            # Step 4: Generate detailed explanation
            explanation = await self._generate_patient_explanation(
                diagnosis_result, symptoms, patient_demographics
            )
            
            return {
                "diagnosis": diagnosis_result["primary_diagnosis"],
                "confidence": diagnosis_result["confidence"],
                "differential_diagnoses": diagnosis_result["differential_diagnoses"],
                "recommended_tests": diagnosis_result["recommended_tests"],
                "urgency_level": diagnosis_result["urgency_level"],
                "explanation": explanation,
                "model_version": self.model_version,
                "timestamp": datetime.now().isoformat(),
                "modalities_used": self._get_modalities_used(images, lab_data)
            }
            
        except Exception as e:
            logger.error(f"Error in multimodal analysis: {e}")
            raise
    
    async def _process_text_inputs(
        self, 
        symptoms: str, 
        lab_data: Dict[str, Any] = None, 
        medical_history: str = None
    ) -> torch.Tensor:
        """Process text inputs using medical BERT"""
        try:
            # Combine all text inputs
            text_input = f"Symptoms: {symptoms}"
            if lab_data:
                lab_text = self._format_lab_data(lab_data)
                text_input += f" Lab Results: {lab_text}"
            if medical_history:
                text_input += f" Medical History: {medical_history}"
            
            # Tokenize and encode
            inputs = self.text_tokenizer(
                text_input,
                return_tensors="pt",
                max_length=512,
                truncation=True,
                padding=True
            )
            
            with torch.no_grad():
                outputs = self.text_encoder(**inputs)
                # Use [CLS] token representation
                text_features = outputs.last_hidden_state[:, 0, :]
            
            return text_features
            
        except Exception as e:
            logger.error(f"Error processing text inputs: {e}")
            raise
    
    async def _process_images(self, images: List[Dict[str, Any]]) -> torch.Tensor:
        """Process medical images using vision transformer"""
        try:
            image_features_list = []
            
            for image_data in images:
                # Decode image data
                if isinstance(image_data["image_data"], str):
                    # Base64 encoded
                    image_bytes = base64.b64decode(image_data["image_data"])
                else:
                    image_bytes = image_data["image_data"]
                
                # Load and preprocess image
                image = Image.open(io.BytesIO(image_bytes))
                image = self._preprocess_image(image)
                
                # Encode image
                with torch.no_grad():
                    inputs = self.image_encoder.preprocess(image)
                    outputs = self.image_encoder.encode_image(inputs)
                    image_features_list.append(outputs)
            
            # Average features from multiple images
            if image_features_list:
                return torch.mean(torch.stack(image_features_list), dim=0)
            else:
                return None
                
        except Exception as e:
            logger.error(f"Error processing images: {e}")
            raise
    
    def _preprocess_image(self, image: Image.Image) -> Image.Image:
        """Preprocess image for medical vision model"""
        # Resize to standard size
        image = image.resize((224, 224))
        
        # Convert to RGB if needed
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        return image
    
    def _format_lab_data(self, lab_data: Dict[str, Any]) -> str:
        """Format lab data as text for processing"""
        formatted = []
        for test_name, result in lab_data.items():
            if isinstance(result, dict):
                value = result.get('value', 'N/A')
                unit = result.get('unit', '')
                reference = result.get('reference_range', '')
                formatted.append(f"{test_name}: {value} {unit} (ref: {reference})")
            else:
                formatted.append(f"{test_name}: {result}")
        
        return "; ".join(formatted)
    
    async def _generate_unified_diagnosis(
        self,
        text_features: torch.Tensor,
        image_features: Optional[torch.Tensor],
        patient_demographics: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Generate unified diagnosis from multimodal features"""
        try:
            # Prepare input for fusion model
            if image_features is not None:
                # Combine text and image features
                combined_features = torch.cat([text_features, image_features], dim=1)
            else:
                # Use only text features
                combined_features = text_features
            
            # Generate diagnosis using fusion model
            with torch.no_grad():
                logits = self.fusion_model(text_features, image_features) if image_features else text_features
                probabilities = torch.softmax(logits, dim=1)
            
            # Get top diagnoses
            top_k = 5
            top_probs, top_indices = torch.topk(probabilities, top_k)
            
            # Map indices to diagnosis names (simplified)
            diagnosis_names = self._get_diagnosis_names()
            primary_diagnosis = diagnosis_names[top_indices[0].item()]
            confidence = top_probs[0].item()
            
            # Generate differential diagnoses
            differential_diagnoses = []
            for i in range(1, min(top_k, len(top_indices))):
                differential_diagnoses.append({
                    "diagnosis": diagnosis_names[top_indices[i].item()],
                    "confidence": top_probs[i].item()
                })
            
            # Determine urgency level
            urgency_level = self._determine_urgency_level(
                primary_diagnosis, confidence, patient_demographics
            )
            
            # Generate recommended tests
            recommended_tests = self._generate_recommended_tests(
                primary_diagnosis, differential_diagnoses
            )
            
            return {
                "primary_diagnosis": primary_diagnosis,
                "confidence": confidence,
                "differential_diagnoses": differential_diagnoses,
                "urgency_level": urgency_level,
                "recommended_tests": recommended_tests
            }
            
        except Exception as e:
            logger.error(f"Error generating unified diagnosis: {e}")
            raise
    
    async def _generate_patient_explanation(
        self,
        diagnosis_result: Dict[str, Any],
        symptoms: str,
        patient_demographics: Dict[str, Any]
    ) -> str:
        """Generate patient-friendly explanation using GPT"""
        try:
            prompt = f"""
            As a medical AI assistant, explain the diagnosis to a patient in simple terms.
            
            Patient Symptoms: {symptoms}
            Primary Diagnosis: {diagnosis_result['primary_diagnosis']}
            Confidence: {diagnosis_result['confidence']:.2%}
            Urgency Level: {diagnosis_result['urgency_level']}
            
            Please provide:
            1. A simple explanation of what this diagnosis means
            2. What symptoms they might expect
            3. When to seek immediate medical attention
            4. General lifestyle recommendations
            
            Keep the language simple and avoid medical jargon.
            """
            
            response = await self.client.chat.completions.create(
                model="gpt-4",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=500,
                temperature=0.7
            )
            
            return response.choices[0].message.content
            
        except Exception as e:
            logger.error(f"Error generating patient explanation: {e}")
            return "Unable to generate explanation at this time."
    
    def _get_diagnosis_names(self) -> List[str]:
        """Get list of diagnosis names (simplified)"""
        return [
            "Hypertension", "Diabetes Type 2", "Coronary Artery Disease",
            "Asthma", "COPD", "Pneumonia", "Urinary Tract Infection",
            "Gastroenteritis", "Migraine", "Depression", "Anxiety",
            "Osteoarthritis", "Rheumatoid Arthritis", "Hypothyroidism",
            "Hyperthyroidism", "Anemia", "Chronic Kidney Disease",
            "Liver Disease", "Cancer", "Stroke", "Heart Failure"
        ]
    
    def _determine_urgency_level(
        self,
        diagnosis: str,
        confidence: float,
        demographics: Dict[str, Any]
    ) -> str:
        """Determine urgency level based on diagnosis and patient factors"""
        high_urgency_conditions = [
            "Pneumonia", "Stroke", "Heart Failure", "Cancer"
        ]
        
        if diagnosis in high_urgency_conditions:
            return "HIGH"
        elif confidence > 0.9:
            return "MEDIUM"
        else:
            return "LOW"
    
    def _generate_recommended_tests(
        self,
        primary_diagnosis: str,
        differential_diagnoses: List[Dict[str, Any]]
    ) -> List[str]:
        """Generate recommended tests based on diagnosis"""
        test_mapping = {
            "Diabetes Type 2": ["HbA1c", "Fasting Glucose", "Lipid Panel"],
            "Hypertension": ["Blood Pressure Monitoring", "ECG", "Echocardiogram"],
            "Coronary Artery Disease": ["ECG", "Stress Test", "Coronary Angiography"],
            "Asthma": ["Spirometry", "Peak Flow Test", "Chest X-ray"],
            "Pneumonia": ["Chest X-ray", "Blood Culture", "Sputum Culture"],
            "Urinary Tract Infection": ["Urinalysis", "Urine Culture", "Blood Test"]
        }
        
        return test_mapping.get(primary_diagnosis, ["Complete Blood Count", "Comprehensive Metabolic Panel"])
    
    def _get_modalities_used(
        self,
        images: List[Dict[str, Any]] = None,
        lab_data: Dict[str, Any] = None
    ) -> List[str]:
        """Get list of modalities used in analysis"""
        modalities = ["symptoms"]
        
        if images:
            modalities.append("medical_images")
        if lab_data:
            modalities.append("lab_data")
        
        return modalities
    
    async def get_model_status(self) -> Dict[str, Any]:
        """Get status of multimodal models"""
        return {
            "model_version": self.model_version,
            "text_encoder_loaded": self.text_encoder is not None,
            "image_encoder_loaded": self.image_encoder is not None,
            "fusion_model_loaded": self.fusion_model is not None,
            "confidence_threshold": self.confidence_threshold,
            "last_updated": datetime.now().isoformat()
        } 