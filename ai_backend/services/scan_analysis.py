import os
import cv2
import numpy as np
import pydicom
from PIL import Image
import torch
import torch.nn as nn
from torchvision import transforms, models
import time
from typing import Dict, List, Any, Optional
import logging
from models.response_models import ScanAnalysisResult, Condition, BoundingBox

logger = logging.getLogger(__name__)

class ScanAnalysisService:
    def __init__(self):
        self.model = None
        self.transform = None
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.model_status = "loading"
        self.load_model()
        
    def load_model(self):
        """Load pre-trained medical imaging model"""
        try:
            # Use DenseNet121 pre-trained on ImageNet as base
            self.model = models.densenet121(pretrained=True)
            
            # Modify final layer for medical classification
            num_classes = 14  # Common medical conditions
            self.model.classifier = nn.Linear(self.model.classifier.in_features, num_classes)
            
            # Load custom weights if available (placeholder for production)
            # self.model.load_state_dict(torch.load('models/medical_scan_model.pth'))
            
            self.model.to(self.device)
            self.model.eval()
            
            # Define image transformations
            self.transform = transforms.Compose([
                transforms.Resize((224, 224)),
                transforms.ToTensor(),
                transforms.Normalize(mean=[0.485, 0.456, 0.406], 
                                  std=[0.229, 0.224, 0.225])
            ])
            
            self.model_status = "loaded"
            logger.info("Medical scan model loaded successfully")
            
        except Exception as e:
            self.model_status = "error"
            logger.error(f"Failed to load medical scan model: {e}")
    
    async def analyze_scan(self, file_path: str, scan_type: Optional[str] = None) -> ScanAnalysisResult:
        """
        Analyze medical scan and return diagnosis suggestions
        """
        start_time = time.time()
        
        try:
            # Load and preprocess image
            image = await self._load_image(file_path)
            if image is None:
                raise ValueError("Failed to load image")
            
            # Analyze image quality
            image_quality = self._assess_image_quality(image)
            
            # Run inference
            predictions = await self._run_inference(image)
            
            # Process results
            conditions = self._process_predictions(predictions, scan_type)
            
            # Generate bounding boxes (placeholder for object detection)
            bounding_boxes = self._generate_bounding_boxes(image, predictions)
            
            # Calculate overall confidence
            overall_confidence = np.mean([c.confidence for c in conditions]) if conditions else 0.0
            
            processing_time = time.time() - start_time
            
            return ScanAnalysisResult(
                conditions=conditions,
                overall_confidence=overall_confidence,
                scan_type=scan_type,
                image_quality=image_quality,
                bounding_boxes=bounding_boxes,
                heatmap_url=None,  # Would generate heatmap in production
                processing_time=processing_time
            )
            
        except Exception as e:
            logger.error(f"Error analyzing scan: {e}")
            raise
    
    async def _load_image(self, file_path: str) -> Optional[np.ndarray]:
        """Load image from file (DICOM or standard image)"""
        try:
            # Check if it's a DICOM file
            if file_path.lower().endswith('.dcm'):
                return self._load_dicom(file_path)
            else:
                return self._load_standard_image(file_path)
        except Exception as e:
            logger.error(f"Error loading image: {e}")
            return None
    
    def _load_dicom(self, file_path: str) -> np.ndarray:
        """Load DICOM file and convert to numpy array"""
        try:
            dcm = pydicom.dcmread(file_path)
            image = dcm.pixel_array
            
            # Normalize to 0-255 range
            if image.dtype != np.uint8:
                image = ((image - image.min()) / (image.max() - image.min()) * 255).astype(np.uint8)
            
            # Convert to RGB if grayscale
            if len(image.shape) == 2:
                image = cv2.cvtColor(image, cv2.COLOR_GRAY2RGB)
            
            return image
            
        except Exception as e:
            logger.error(f"Error loading DICOM: {e}")
            raise
    
    def _load_standard_image(self, file_path: str) -> np.ndarray:
        """Load standard image format (PNG, JPG, etc.)"""
        try:
            image = cv2.imread(file_path)
            if image is None:
                raise ValueError("Failed to load image")
            
            # Convert BGR to RGB
            image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
            return image
            
        except Exception as e:
            logger.error(f"Error loading standard image: {e}")
            raise
    
    def _assess_image_quality(self, image: np.ndarray) -> str:
        """Assess image quality based on various metrics"""
        try:
            # Calculate metrics
            gray = cv2.cvtColor(image, cv2.COLOR_RGB2GRAY) if len(image.shape) == 3 else image
            
            # Sharpness (Laplacian variance)
            sharpness = cv2.Laplacian(gray, cv2.CV_64F).var()
            
            # Contrast
            contrast = gray.std()
            
            # Brightness
            brightness = gray.mean()
            
            # Determine quality
            if sharpness > 100 and contrast > 50 and 50 < brightness < 200:
                return "excellent"
            elif sharpness > 50 and contrast > 30:
                return "good"
            elif sharpness > 20 and contrast > 15:
                return "fair"
            else:
                return "poor"
                
        except Exception as e:
            logger.error(f"Error assessing image quality: {e}")
            return "fair"
    
    async def _run_inference(self, image: np.ndarray) -> np.ndarray:
        """Run model inference on preprocessed image"""
        try:
            # Convert numpy array to PIL Image
            pil_image = Image.fromarray(image)
            
            # Apply transformations
            input_tensor = self.transform(pil_image).unsqueeze(0).to(self.device)
            
            # Run inference
            with torch.no_grad():
                outputs = self.model(input_tensor)
                probabilities = torch.softmax(outputs, dim=1)
            
            return probabilities.cpu().numpy()[0]
            
        except Exception as e:
            logger.error(f"Error running inference: {e}")
            raise
    
    def _process_predictions(self, predictions: np.ndarray, scan_type: Optional[str] = None) -> List[Condition]:
        """Process model predictions into structured conditions"""
        # Medical condition labels (example - would be trained on specific dataset)
        condition_labels = [
            "Normal", "Pneumonia", "Pneumothorax", "Effusion", "Cardiomegaly",
            "Edema", "Consolidation", "Atelectasis", "Pleural_Thickening",
            "Fracture", "Mass", "Nodule", "Emphysema", "Fibrosis"
        ]
        
        conditions = []
        
        # Get top predictions
        top_indices = np.argsort(predictions)[::-1][:5]
        
        for idx in top_indices:
            confidence = float(predictions[idx])
            
            # Only include conditions with confidence > 0.1
            if confidence > 0.1:
                condition_name = condition_labels[idx]
                
                # Determine severity based on confidence and condition type
                severity = self._determine_severity(condition_name, confidence)
                
                # Generate recommendations
                recommendations = self._generate_recommendations(condition_name, confidence, scan_type)
                
                condition = Condition(
                    name=condition_name,
                    confidence=confidence,
                    severity=severity,
                    recommendations=recommendations
                )
                conditions.append(condition)
        
        return conditions
    
    def _determine_severity(self, condition: str, confidence: float) -> str:
        """Determine severity level based on condition and confidence"""
        critical_conditions = ["Pneumothorax", "Mass", "Nodule", "Cardiomegaly"]
        high_conditions = ["Pneumonia", "Effusion", "Consolidation", "Fracture"]
        
        if condition in critical_conditions and confidence > 0.7:
            return "critical"
        elif condition in high_conditions and confidence > 0.6:
            return "high"
        elif confidence > 0.8:
            return "high"
        elif confidence > 0.5:
            return "medium"
        else:
            return "low"
    
    def _generate_recommendations(self, condition: str, confidence: float, scan_type: Optional[str]) -> List[str]:
        """Generate recommendations based on detected condition"""
        recommendations = []
        
        if condition == "Pneumonia":
            recommendations = [
                "Consider antibiotic treatment",
                "Monitor oxygen saturation",
                "Follow up in 48-72 hours"
            ]
        elif condition == "Pneumothorax":
            recommendations = [
                "Immediate medical attention required",
                "Consider chest tube placement",
                "Monitor for respiratory distress"
            ]
        elif condition == "Fracture":
            recommendations = [
                "Orthopedic consultation recommended",
                "Immobilization may be necessary",
                "Follow up for healing assessment"
            ]
        elif condition == "Mass" or condition == "Nodule":
            recommendations = [
                "Biopsy may be indicated",
                "Consider CT follow-up",
                "Oncology consultation recommended"
            ]
        else:
            recommendations = [
                "Clinical correlation recommended",
                "Consider additional imaging if symptoms persist"
            ]
        
        return recommendations
    
    def _generate_bounding_boxes(self, image: np.ndarray, predictions: np.ndarray) -> Optional[List[BoundingBox]]:
        """Generate bounding boxes for detected abnormalities (placeholder)"""
        # In production, this would use object detection models
        # For now, return None as placeholder
        return None
    
    async def get_model_status(self) -> Dict[str, Any]:
        """Get model status information"""
        return {
            "model_name": "Medical Scan Analysis Model",
            "status": self.model_status,
            "version": "1.0.0",
            "device": str(self.device),
            "last_updated": "2024-01-01"
        } 