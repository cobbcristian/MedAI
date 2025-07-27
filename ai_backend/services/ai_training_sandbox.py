"""
AI Training Sandbox Service
Enables clinics to upload anonymized data for custom AI model training
Supports federated learning and on-prem training with periodic syncs
"""

import os
import json
import hashlib
import logging
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any, Tuple
from dataclasses import dataclass
import asyncio
import aiofiles
from pathlib import Path

import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader, Dataset
import joblib

from fastapi import HTTPException, BackgroundTasks
from pydantic import BaseModel, Field

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@dataclass
class TrainingConfig:
    """Configuration for AI model training"""
    model_type: str  # 'classification', 'regression', 'custom'
    architecture: str  # 'transformer', 'cnn', 'lstm', 'custom'
    epochs: int = 100
    batch_size: int = 32
    learning_rate: float = 0.001
    validation_split: float = 0.2
    early_stopping_patience: int = 10
    federated_learning: bool = False
    privacy_level: str = "high"  # 'low', 'medium', 'high'
    
class AnonymizedDataset:
    """Handles anonymized dataset processing and validation"""
    
    def __init__(self, clinic_id: str, dataset_name: str):
        self.clinic_id = clinic_id
        self.dataset_name = dataset_name
        self.data_path = f"data/anonymized/{clinic_id}/{dataset_name}"
        self.metadata_path = f"data/metadata/{clinic_id}/{dataset_name}_metadata.json"
        
    async def validate_and_anonymize(self, raw_data: Dict[str, Any]) -> Dict[str, Any]:
        """Validate and anonymize uploaded data"""
        try:
            # Remove PII fields
            pii_fields = ['name', 'ssn', 'email', 'phone', 'address', 'date_of_birth']
            anonymized_data = raw_data.copy()
            
            for field in pii_fields:
                if field in anonymized_data:
                    del anonymized_data[field]
            
            # Hash patient IDs
            if 'patient_id' in anonymized_data:
                anonymized_data['patient_id'] = hashlib.sha256(
                    str(anonymized_data['patient_id']).encode()
                ).hexdigest()[:16]
            
            # Validate data quality
            quality_score = self._assess_data_quality(anonymized_data)
            
            # Store metadata
            metadata = {
                'clinic_id': self.clinic_id,
                'dataset_name': self.dataset_name,
                'upload_date': datetime.now().isoformat(),
                'data_quality_score': quality_score,
                'record_count': len(anonymized_data.get('records', [])),
                'fields': list(anonymized_data.keys()),
                'anonymization_applied': True
            }
            
            await self._save_metadata(metadata)
            
            return anonymized_data
            
        except Exception as e:
            logger.error(f"Error anonymizing data: {e}")
            raise HTTPException(status_code=400, detail="Data anonymization failed")
    
    def _assess_data_quality(self, data: Dict[str, Any]) -> float:
        """Assess data quality score (0-1)"""
        score = 1.0
        
        # Check for missing values
        records = data.get('records', [])
        if records:
            total_fields = len(records[0]) if records else 0
            missing_count = sum(1 for record in records 
                              for value in record.values() 
                              if value is None or value == '')
            
            if total_fields > 0:
                missing_ratio = missing_count / (len(records) * total_fields)
                score -= missing_ratio * 0.3
        
        # Check for data consistency
        if len(records) > 1:
            field_types = {}
            for record in records:
                for field, value in record.items():
                    if field not in field_types:
                        field_types[field] = type(value)
                    elif type(value) != field_types[field]:
                        score -= 0.2
                        break
        
        return max(0.0, score)
    
    async def _save_metadata(self, metadata: Dict[str, Any]):
        """Save dataset metadata"""
        os.makedirs(os.path.dirname(self.metadata_path), exist_ok=True)
        async with aiofiles.open(self.metadata_path, 'w') as f:
            await f.write(json.dumps(metadata, indent=2))

class FederatedLearningManager:
    """Manages federated learning across multiple clinics"""
    
    def __init__(self):
        self.global_model = None
        self.participating_clinics = set()
        self.aggregation_rounds = 0
        self.min_clinics_for_aggregation = 3
        
    async def register_clinic(self, clinic_id: str, model_config: TrainingConfig):
        """Register a clinic for federated learning"""
        self.participating_clinics.add(clinic_id)
        logger.info(f"Clinic {clinic_id} registered for federated learning")
        
        if len(self.participating_clinics) >= self.min_clinics_for_aggregation:
            await self._trigger_aggregation()
    
    async def _trigger_aggregation(self):
        """Trigger federated learning aggregation"""
        try:
            # Collect local models from participating clinics
            local_models = await self._collect_local_models()
            
            if local_models:
                # Aggregate models (FedAvg algorithm)
                self.global_model = self._aggregate_models(local_models)
                self.aggregation_rounds += 1
                
                # Distribute updated global model
                await self._distribute_global_model()
                
                logger.info(f"Federated aggregation completed - Round {self.aggregation_rounds}")
        
        except Exception as e:
            logger.error(f"Federated aggregation failed: {e}")
    
    async def _collect_local_models(self) -> List[Dict[str, Any]]:
        """Collect local models from participating clinics"""
        local_models = []
        
        for clinic_id in self.participating_clinics:
            model_path = f"models/local/{clinic_id}/latest_model.pth"
            if os.path.exists(model_path):
                try:
                    model_state = torch.load(model_path)
                    local_models.append({
                        'clinic_id': clinic_id,
                        'model_state': model_state,
                        'sample_count': self._get_clinic_sample_count(clinic_id)
                    })
                except Exception as e:
                    logger.error(f"Failed to load local model for clinic {clinic_id}: {e}")
        
        return local_models
    
    def _aggregate_models(self, local_models: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Aggregate local models using FedAvg algorithm"""
        if not local_models:
            return None
        
        # Calculate total samples
        total_samples = sum(model['sample_count'] for model in local_models)
        
        # Initialize aggregated model state
        aggregated_state = {}
        
        # Weighted average of model parameters
        for key in local_models[0]['model_state'].keys():
            weighted_sum = torch.zeros_like(local_models[0]['model_state'][key])
            
            for model in local_models:
                weight = model['sample_count'] / total_samples
                weighted_sum += weight * model['model_state'][key]
            
            aggregated_state[key] = weighted_sum
        
        return aggregated_state
    
    async def _distribute_global_model(self):
        """Distribute the global model to participating clinics"""
        if not self.global_model:
            return
        
        for clinic_id in self.participating_clinics:
            try:
                model_path = f"models/global/{clinic_id}/global_model.pth"
                os.makedirs(os.path.dirname(model_path), exist_ok=True)
                torch.save(self.global_model, model_path)
                
                logger.info(f"Global model distributed to clinic {clinic_id}")
            
            except Exception as e:
                logger.error(f"Failed to distribute global model to clinic {clinic_id}: {e}")
    
    def _get_clinic_sample_count(self, clinic_id: str) -> int:
        """Get sample count for a clinic"""
        metadata_path = f"data/metadata/{clinic_id}/dataset_metadata.json"
        try:
            with open(metadata_path, 'r') as f:
                metadata = json.load(f)
                return metadata.get('record_count', 1000)  # Default fallback
        except:
            return 1000

class CustomModelTrainer:
    """Handles custom model training with various architectures"""
    
    def __init__(self, config: TrainingConfig):
        self.config = config
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        
    async def train_model(self, dataset: Dict[str, Any], clinic_id: str) -> Dict[str, Any]:
        """Train a custom model on the provided dataset"""
        try:
            # Prepare data
            X_train, X_val, y_train, y_val = await self._prepare_data(dataset)
            
            # Initialize model
            model = self._create_model(X_train.shape[1], len(set(y_train)))
            model.to(self.device)
            
            # Training setup
            criterion = nn.CrossEntropyLoss()
            optimizer = optim.Adam(model.parameters(), lr=self.config.learning_rate)
            
            # Training loop
            best_val_loss = float('inf')
            patience_counter = 0
            training_history = []
            
            for epoch in range(self.config.epochs):
                # Training phase
                model.train()
                train_loss = 0
                for batch_X, batch_y in self._create_dataloader(X_train, y_train):
                    batch_X = batch_X.to(self.device)
                    batch_y = batch_y.to(self.device)
                    
                    optimizer.zero_grad()
                    outputs = model(batch_X)
                    loss = criterion(outputs, batch_y)
                    loss.backward()
                    optimizer.step()
                    
                    train_loss += loss.item()
                
                # Validation phase
                model.eval()
                val_loss = 0
                correct = 0
                total = 0
                
                with torch.no_grad():
                    for batch_X, batch_y in self._create_dataloader(X_val, y_val):
                        batch_X = batch_X.to(self.device)
                        batch_y = batch_y.to(self.device)
                        
                        outputs = model(batch_X)
                        loss = criterion(outputs, batch_y)
                        val_loss += loss.item()
                        
                        _, predicted = torch.max(outputs.data, 1)
                        total += batch_y.size(0)
                        correct += (predicted == batch_y).sum().item()
                
                # Record metrics
                epoch_metrics = {
                    'epoch': epoch + 1,
                    'train_loss': train_loss / len(X_train),
                    'val_loss': val_loss / len(X_val),
                    'val_accuracy': correct / total
                }
                training_history.append(epoch_metrics)
                
                # Early stopping
                if val_loss < best_val_loss:
                    best_val_loss = val_loss
                    patience_counter = 0
                    # Save best model
                    await self._save_model(model, clinic_id, 'best')
                else:
                    patience_counter += 1
                
                if patience_counter >= self.config.early_stopping_patience:
                    logger.info(f"Early stopping at epoch {epoch + 1}")
                    break
            
            # Save final model
            await self._save_model(model, clinic_id, 'final')
            
            # Return training results
            return {
                'clinic_id': clinic_id,
                'model_type': self.config.model_type,
                'architecture': self.config.architecture,
                'final_accuracy': training_history[-1]['val_accuracy'],
                'training_history': training_history,
                'total_epochs': len(training_history),
                'best_val_loss': best_val_loss
            }
            
        except Exception as e:
            logger.error(f"Model training failed: {e}")
            raise HTTPException(status_code=500, detail="Model training failed")
    
    async def _prepare_data(self, dataset: Dict[str, Any]) -> Tuple[np.ndarray, np.ndarray, np.ndarray, np.ndarray]:
        """Prepare and split data for training"""
        records = dataset.get('records', [])
        
        if not records:
            raise ValueError("No records found in dataset")
        
        # Convert to DataFrame for easier processing
        df = pd.DataFrame(records)
        
        # Separate features and target
        target_column = dataset.get('target_column', 'diagnosis')
        if target_column not in df.columns:
            raise ValueError(f"Target column '{target_column}' not found")
        
        X = df.drop(columns=[target_column])
        y = df[target_column]
        
        # Handle categorical variables
        X = pd.get_dummies(X)
        
        # Convert target to numeric
        label_encoder = joblib.load('models/label_encoder.pkl') if os.path.exists('models/label_encoder.pkl') else None
        if label_encoder is None:
            from sklearn.preprocessing import LabelEncoder
            label_encoder = LabelEncoder()
            y = label_encoder.fit_transform(y)
            joblib.dump(label_encoder, 'models/label_encoder.pkl')
        else:
            y = label_encoder.transform(y)
        
        # Split data
        X_train, X_val, y_train, y_val = train_test_split(
            X, y, test_size=self.config.validation_split, random_state=42
        )
        
        # Scale features
        scaler = StandardScaler()
        X_train = scaler.fit_transform(X_train)
        X_val = scaler.transform(X_val)
        
        # Save scaler for inference
        joblib.dump(scaler, f'models/scaler_{self.config.model_type}.pkl')
        
        return X_train, X_val, y_train, y_val
    
    def _create_model(self, input_size: int, num_classes: int) -> nn.Module:
        """Create model based on architecture configuration"""
        if self.config.architecture == 'transformer':
            return self._create_transformer_model(input_size, num_classes)
        elif self.config.architecture == 'cnn':
            return self._create_cnn_model(input_size, num_classes)
        elif self.config.architecture == 'lstm':
            return self._create_lstm_model(input_size, num_classes)
        else:
            return self._create_mlp_model(input_size, num_classes)
    
    def _create_mlp_model(self, input_size: int, num_classes: int) -> nn.Module:
        """Create a simple MLP model"""
        return nn.Sequential(
            nn.Linear(input_size, 128),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(128, 64),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(64, num_classes)
        )
    
    def _create_transformer_model(self, input_size: int, num_classes: int) -> nn.Module:
        """Create a transformer-based model"""
        # Simplified transformer for tabular data
        return nn.Sequential(
            nn.Linear(input_size, 256),
            nn.LayerNorm(256),
            nn.MultiheadAttention(256, num_heads=8, batch_first=True),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(256, 128),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(128, num_classes)
        )
    
    def _create_cnn_model(self, input_size: int, num_classes: int) -> nn.Module:
        """Create a CNN model (adapted for 1D data)"""
        return nn.Sequential(
            nn.Conv1d(1, 32, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.MaxPool1d(2),
            nn.Conv1d(32, 64, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.MaxPool1d(2),
            nn.Flatten(),
            nn.Linear(64 * (input_size // 4), 128),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(128, num_classes)
        )
    
    def _create_lstm_model(self, input_size: int, num_classes: int) -> nn.Module:
        """Create an LSTM model"""
        return nn.Sequential(
            nn.Linear(input_size, 128),
            nn.LSTM(128, 64, batch_first=True),
            nn.Dropout(0.3),
            nn.Linear(64, num_classes)
        )
    
    def _create_dataloader(self, X: np.ndarray, y: np.ndarray) -> DataLoader:
        """Create DataLoader for training"""
        dataset = torch.utils.data.TensorDataset(
            torch.FloatTensor(X),
            torch.LongTensor(y)
        )
        return DataLoader(dataset, batch_size=self.config.batch_size, shuffle=True)
    
    async def _save_model(self, model: nn.Module, clinic_id: str, model_type: str):
        """Save trained model"""
        model_dir = f"models/local/{clinic_id}"
        os.makedirs(model_dir, exist_ok=True)
        
        model_path = f"{model_dir}/{model_type}_model.pth"
        torch.save(model.state_dict(), model_path)
        
        logger.info(f"Model saved to {model_path}")

class AITrainingSandbox:
    """Main AI Training Sandbox service"""
    
    def __init__(self):
        self.federated_manager = FederatedLearningManager()
        self.active_trainings = {}
        
    async def upload_dataset(self, clinic_id: str, dataset_name: str, 
                           raw_data: Dict[str, Any]) -> Dict[str, Any]:
        """Upload and process anonymized dataset"""
        try:
            # Create dataset handler
            dataset_handler = AnonymizedDataset(clinic_id, dataset_name)
            
            # Validate and anonymize data
            anonymized_data = await dataset_handler.validate_and_anonymize(raw_data)
            
            # Save anonymized dataset
            os.makedirs(dataset_handler.data_path, exist_ok=True)
            async with aiofiles.open(f"{dataset_handler.data_path}/data.json", 'w') as f:
                await f.write(json.dumps(anonymized_data, indent=2))
            
            return {
                'clinic_id': clinic_id,
                'dataset_name': dataset_name,
                'status': 'uploaded',
                'record_count': len(anonymized_data.get('records', [])),
                'data_quality_score': anonymized_data.get('data_quality_score', 0.0),
                'upload_date': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Dataset upload failed: {e}")
            raise HTTPException(status_code=500, detail="Dataset upload failed")
    
    async def start_training(self, clinic_id: str, dataset_name: str, 
                           config: TrainingConfig, background_tasks: BackgroundTasks) -> Dict[str, Any]:
        """Start custom model training"""
        try:
            # Load dataset
            dataset_path = f"data/anonymized/{clinic_id}/{dataset_name}/data.json"
            if not os.path.exists(dataset_path):
                raise HTTPException(status_code=404, detail="Dataset not found")
            
            async with aiofiles.open(dataset_path, 'r') as f:
                dataset_content = await f.read()
                dataset = json.loads(dataset_content)
            
            # Initialize trainer
            trainer = CustomModelTrainer(config)
            
            # Start training in background
            training_id = f"{clinic_id}_{dataset_name}_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
            self.active_trainings[training_id] = {
                'clinic_id': clinic_id,
                'dataset_name': dataset_name,
                'config': config,
                'status': 'training',
                'start_time': datetime.now().isoformat()
            }
            
            background_tasks.add_task(
                self._run_training, training_id, trainer, dataset, config
            )
            
            # Register for federated learning if enabled
            if config.federated_learning:
                await self.federated_manager.register_clinic(clinic_id, config)
            
            return {
                'training_id': training_id,
                'clinic_id': clinic_id,
                'dataset_name': dataset_name,
                'status': 'started',
                'federated_learning': config.federated_learning,
                'estimated_duration': f"{config.epochs * 2} minutes"
            }
            
        except Exception as e:
            logger.error(f"Training start failed: {e}")
            raise HTTPException(status_code=500, detail="Training start failed")
    
    async def _run_training(self, training_id: str, trainer: CustomModelTrainer, 
                          dataset: Dict[str, Any], config: TrainingConfig):
        """Run training in background"""
        try:
            clinic_id = self.active_trainings[training_id]['clinic_id']
            
            # Run training
            results = await trainer.train_model(dataset, clinic_id)
            
            # Update training status
            self.active_trainings[training_id].update({
                'status': 'completed',
                'results': results,
                'end_time': datetime.now().isoformat()
            })
            
            logger.info(f"Training {training_id} completed successfully")
            
        except Exception as e:
            logger.error(f"Training {training_id} failed: {e}")
            self.active_trainings[training_id].update({
                'status': 'failed',
                'error': str(e),
                'end_time': datetime.now().isoformat()
            })
    
    async def get_training_status(self, training_id: str) -> Dict[str, Any]:
        """Get training status and results"""
        if training_id not in self.active_trainings:
            raise HTTPException(status_code=404, detail="Training not found")
        
        return self.active_trainings[training_id]
    
    async def list_clinic_models(self, clinic_id: str) -> List[Dict[str, Any]]:
        """List all models for a clinic"""
        models = []
        model_dir = f"models/local/{clinic_id}"
        
        if os.path.exists(model_dir):
            for model_file in os.listdir(model_dir):
                if model_file.endswith('.pth'):
                    model_path = os.path.join(model_dir, model_file)
                    model_info = {
                        'model_name': model_file,
                        'clinic_id': clinic_id,
                        'file_size': os.path.getsize(model_path),
                        'created_date': datetime.fromtimestamp(
                            os.path.getctime(model_path)
                        ).isoformat()
                    }
                    models.append(model_info)
        
        return models
    
    async def get_federated_learning_status(self) -> Dict[str, Any]:
        """Get federated learning status"""
        return {
            'participating_clinics': list(self.federated_manager.participating_clinics),
            'aggregation_rounds': self.federated_manager.aggregation_rounds,
            'global_model_available': self.federated_manager.global_model is not None,
            'min_clinics_for_aggregation': self.federated_manager.min_clinics_for_aggregation
        }

# Pydantic models for API
class DatasetUploadRequest(BaseModel):
    clinic_id: str = Field(..., description="Clinic identifier")
    dataset_name: str = Field(..., description="Name of the dataset")
    raw_data: Dict[str, Any] = Field(..., description="Raw dataset data")
    target_column: str = Field(..., description="Target column for training")

class TrainingStartRequest(BaseModel):
    clinic_id: str = Field(..., description="Clinic identifier")
    dataset_name: str = Field(..., description="Dataset name")
    config: TrainingConfig = Field(..., description="Training configuration")

class TrainingStatusResponse(BaseModel):
    training_id: str
    clinic_id: str
    status: str
    start_time: str
    end_time: Optional[str] = None
    results: Optional[Dict[str, Any]] = None
    error: Optional[str] = None

# Initialize global instance
ai_training_sandbox = AITrainingSandbox() 