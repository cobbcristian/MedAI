import uuid
import json
import time
from datetime import datetime
from typing import Dict, List, Any, Optional
import logging
from models.response_models import FeedbackResponse

logger = logging.getLogger(__name__)

class FeedbackService:
    def __init__(self):
        self.feedback_log = []  # In production, this would be a database
        self.model_status = "loaded"
    
    async def submit_feedback(
        self,
        analysis_id: str,
        feedback_type: str,  # "approve", "reject", "modify"
        doctor_id: str,
        patient_id: str,
        comments: Optional[str] = None,
        modified_diagnosis: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Submit doctor feedback on AI suggestions
        """
        try:
            # Validate feedback type
            valid_types = ["approve", "reject", "modify"]
            if feedback_type not in valid_types:
                raise ValueError(f"Invalid feedback type. Must be one of: {valid_types}")
            
            # Create feedback record
            feedback_id = str(uuid.uuid4())
            feedback_record = {
                "feedback_id": feedback_id,
                "analysis_id": analysis_id,
                "feedback_type": feedback_type,
                "doctor_id": doctor_id,
                "patient_id": patient_id,
                "comments": comments,
                "modified_diagnosis": modified_diagnosis,
                "timestamp": datetime.now().isoformat(),
                "processed": False
            }
            
            # Store feedback (in production, save to database)
            self.feedback_log.append(feedback_record)
            
            # Log for model improvement
            await self._log_for_model_improvement(feedback_record)
            
            # Generate response
            response = {
                "feedback_id": feedback_id,
                "status": "submitted",
                "message": f"Feedback {feedback_type} recorded successfully"
            }
            
            logger.info(f"Feedback submitted: {feedback_id} by doctor {doctor_id}")
            
            return response
            
        except Exception as e:
            logger.error(f"Error submitting feedback: {e}")
            raise
    
    async def _log_for_model_improvement(self, feedback_record: Dict[str, Any]):
        """
        Log feedback for model improvement and training
        """
        try:
            # In production, this would:
            # 1. Save to a training dataset
            # 2. Trigger model retraining pipeline
            # 3. Update model performance metrics
            # 4. Send to analytics platform
            
            log_entry = {
                "timestamp": feedback_record["timestamp"],
                "feedback_type": feedback_record["feedback_type"],
                "analysis_id": feedback_record["analysis_id"],
                "doctor_id": feedback_record["doctor_id"],
                "patient_id": feedback_record["patient_id"],
                "comments": feedback_record["comments"],
                "modified_diagnosis": feedback_record["modified_diagnosis"],
                "processed": False
            }
            
            # Save to file for now (in production, use proper logging system)
            with open("feedback_log.jsonl", "a") as f:
                f.write(json.dumps(log_entry) + "\n")
            
            logger.info(f"Feedback logged for model improvement: {feedback_record['feedback_id']}")
            
        except Exception as e:
            logger.error(f"Error logging feedback for model improvement: {e}")
    
    async def get_feedback_stats(self, doctor_id: Optional[str] = None) -> Dict[str, Any]:
        """
        Get feedback statistics
        """
        try:
            # Filter feedback by doctor if specified
            if doctor_id:
                filtered_feedback = [f for f in self.feedback_log if f["doctor_id"] == doctor_id]
            else:
                filtered_feedback = self.feedback_log
            
            # Calculate statistics
            total_feedback = len(filtered_feedback)
            approve_count = len([f for f in filtered_feedback if f["feedback_type"] == "approve"])
            reject_count = len([f for f in filtered_feedback if f["feedback_type"] == "reject"])
            modify_count = len([f for f in filtered_feedback if f["feedback_type"] == "modify"])
            
            # Calculate approval rate
            approval_rate = (approve_count / total_feedback * 100) if total_feedback > 0 else 0
            
            stats = {
                "total_feedback": total_feedback,
                "approve_count": approve_count,
                "reject_count": reject_count,
                "modify_count": modify_count,
                "approval_rate": round(approval_rate, 2),
                "doctor_id": doctor_id
            }
            
            return stats
            
        except Exception as e:
            logger.error(f"Error getting feedback stats: {e}")
            raise
    
    async def get_feedback_history(
        self,
        doctor_id: Optional[str] = None,
        patient_id: Optional[str] = None,
        limit: int = 50
    ) -> List[Dict[str, Any]]:
        """
        Get feedback history with optional filtering
        """
        try:
            # Filter feedback
            filtered_feedback = self.feedback_log
            
            if doctor_id:
                filtered_feedback = [f for f in filtered_feedback if f["doctor_id"] == doctor_id]
            
            if patient_id:
                filtered_feedback = [f for f in filtered_feedback if f["patient_id"] == patient_id]
            
            # Sort by timestamp (newest first) and limit
            sorted_feedback = sorted(
                filtered_feedback,
                key=lambda x: x["timestamp"],
                reverse=True
            )[:limit]
            
            return sorted_feedback
            
        except Exception as e:
            logger.error(f"Error getting feedback history: {e}")
            raise
    
    async def process_feedback_batch(self) -> Dict[str, Any]:
        """
        Process a batch of feedback for model improvement
        """
        try:
            # Get unprocessed feedback
            unprocessed = [f for f in self.feedback_log if not f["processed"]]
            
            if not unprocessed:
                return {"message": "No unprocessed feedback found", "processed_count": 0}
            
            # Process feedback (in production, this would trigger model retraining)
            processed_count = 0
            for feedback in unprocessed:
                try:
                    # Mark as processed
                    feedback["processed"] = True
                    feedback["processed_timestamp"] = datetime.now().isoformat()
                    
                    # In production, this would:
                    # 1. Extract features from the original analysis
                    # 2. Compare with doctor feedback
                    # 3. Update training dataset
                    # 4. Trigger model retraining if enough new data
                    
                    processed_count += 1
                    
                except Exception as e:
                    logger.error(f"Error processing feedback {feedback['feedback_id']}: {e}")
            
            return {
                "message": f"Processed {processed_count} feedback records",
                "processed_count": processed_count,
                "total_unprocessed": len(unprocessed)
            }
            
        except Exception as e:
            logger.error(f"Error processing feedback batch: {e}")
            raise
    
    async def get_model_improvement_metrics(self) -> Dict[str, Any]:
        """
        Get metrics for model improvement tracking
        """
        try:
            # Calculate various metrics
            total_feedback = len(self.feedback_log)
            processed_feedback = len([f for f in self.feedback_log if f["processed"]])
            
            # Feedback type distribution
            feedback_types = {}
            for feedback in self.feedback_log:
                feedback_type = feedback["feedback_type"]
                feedback_types[feedback_type] = feedback_types.get(feedback_type, 0) + 1
            
            # Recent feedback (last 30 days)
            recent_cutoff = datetime.now().timestamp() - (30 * 24 * 60 * 60)
            recent_feedback = [
                f for f in self.feedback_log 
                if datetime.fromisoformat(f["timestamp"]).timestamp() > recent_cutoff
            ]
            
            metrics = {
                "total_feedback": total_feedback,
                "processed_feedback": processed_feedback,
                "processing_rate": round((processed_feedback / total_feedback * 100), 2) if total_feedback > 0 else 0,
                "feedback_type_distribution": feedback_types,
                "recent_feedback_count": len(recent_feedback),
                "model_status": self.model_status
            }
            
            return metrics
            
        except Exception as e:
            logger.error(f"Error getting model improvement metrics: {e}")
            raise
    
    async def get_model_status(self) -> Dict[str, Any]:
        """Get model status information"""
        return {
            "model_name": "Feedback Processing Model",
            "status": self.model_status,
            "version": "1.0.0",
            "last_updated": "2024-01-01"
        } 