"""
Patient-Centered AI Feedback Loop Service
Let patients mark AI explanations as helpful/confusing
Build a trust rating system for AI outputs (and regulatory proof of bias monitoring)
"""

import os
import json
import logging
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any, Tuple
from dataclasses import dataclass
import asyncio
import aiofiles
from pathlib import Path
import uuid

import numpy as np
import pandas as pd
from sklearn.metrics import accuracy_score, precision_recall_fscore_support
from sklearn.ensemble import RandomForestClassifier
import joblib

from fastapi import HTTPException
from pydantic import BaseModel, Field

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@dataclass
class FeedbackMetadata:
    """Metadata for patient feedback"""
    patient_id: str
    ai_output_id: str
    feedback_type: str  # 'helpful', 'confusing', 'incorrect', 'unclear'
    feedback_score: float  # 1-5 scale
    feedback_text: Optional[str] = None
    timestamp: datetime = None
    session_id: Optional[str] = None
    device_info: Optional[Dict[str, Any]] = None

class TrustRatingSystem:
    """Manages trust ratings for AI outputs"""
    
    def __init__(self):
        self.trust_scores = {}
        self.feedback_history = []
        self.bias_indicators = {}
        
    async def calculate_trust_score(self, ai_output_id: str, 
                                 feedback_data: List[FeedbackMetadata]) -> float:
        """Calculate trust score for an AI output based on feedback"""
        try:
            if not feedback_data:
                return 0.5  # Default neutral score
            
            # Calculate weighted average of feedback scores
            total_weight = 0
            weighted_sum = 0
            
            for feedback in feedback_data:
                # Weight by recency (more recent feedback has higher weight)
                days_old = (datetime.now() - feedback.timestamp).days
                weight = max(0.1, 1.0 - (days_old / 365))  # Decay over 1 year
                
                # Convert feedback type to score
                type_score = self._feedback_type_to_score(feedback.feedback_type)
                
                weighted_sum += weight * type_score * feedback.feedback_score
                total_weight += weight
            
            trust_score = weighted_sum / total_weight if total_weight > 0 else 0.5
            
            # Store trust score
            self.trust_scores[ai_output_id] = {
                'score': trust_score,
                'feedback_count': len(feedback_data),
                'last_updated': datetime.now().isoformat(),
                'confidence_interval': self._calculate_confidence_interval(feedback_data)
            }
            
            return trust_score
            
        except Exception as e:
            logger.error(f"Failed to calculate trust score: {e}")
            return 0.5
    
    def _feedback_type_to_score(self, feedback_type: str) -> float:
        """Convert feedback type to numerical score"""
        type_scores = {
            'helpful': 1.0,
            'confusing': 0.3,
            'incorrect': 0.0,
            'unclear': 0.5,
            'neutral': 0.7
        }
        return type_scores.get(feedback_type, 0.5)
    
    def _calculate_confidence_interval(self, feedback_data: List[FeedbackMetadata]) -> Dict[str, float]:
        """Calculate confidence interval for trust score"""
        if len(feedback_data) < 2:
            return {'lower': 0.0, 'upper': 1.0, 'confidence': 0.5}
        
        scores = [self._feedback_type_to_score(f.feedback_type) * f.feedback_score 
                 for f in feedback_data]
        
        mean_score = np.mean(scores)
        std_score = np.std(scores)
        
        # 95% confidence interval
        margin_of_error = 1.96 * std_score / np.sqrt(len(scores))
        
        return {
            'lower': max(0.0, mean_score - margin_of_error),
            'upper': min(1.0, mean_score + margin_of_error),
            'confidence': 0.95
        }
    
    async def detect_bias_patterns(self, feedback_data: List[FeedbackMetadata]) -> Dict[str, Any]:
        """Detect potential bias patterns in feedback"""
        try:
            bias_analysis = {
                'demographic_bias': {},
                'temporal_bias': {},
                'content_bias': {},
                'overall_bias_score': 0.0
            }
            
            if not feedback_data:
                return bias_analysis
            
            # Analyze demographic patterns (if available)
            demographic_groups = {}
            for feedback in feedback_data:
                if hasattr(feedback, 'patient_demographics'):
                    demo_key = f"{feedback.patient_demographics.get('age_group', 'unknown')}_{feedback.patient_demographics.get('gender', 'unknown')}"
                    if demo_key not in demographic_groups:
                        demographic_groups[demo_key] = []
                    demographic_groups[demo_key].append(feedback)
            
            # Calculate bias scores for each demographic group
            for group, group_feedback in demographic_groups.items():
                group_scores = [self._feedback_type_to_score(f.feedback_type) * f.feedback_score 
                              for f in group_feedback]
                bias_analysis['demographic_bias'][group] = {
                    'average_score': np.mean(group_scores),
                    'feedback_count': len(group_feedback),
                    'bias_indicator': 'high' if np.std(group_scores) > 0.3 else 'low'
                }
            
            # Analyze temporal patterns
            feedback_by_month = {}
            for feedback in feedback_data:
                month_key = feedback.timestamp.strftime('%Y-%m')
                if month_key not in feedback_by_month:
                    feedback_by_month[month_key] = []
                feedback_by_month[month_key].append(feedback)
            
            monthly_scores = []
            for month, month_feedback in feedback_by_month.items():
                month_scores = [self._feedback_type_to_score(f.feedback_type) * f.feedback_score 
                              for f in month_feedback]
                monthly_scores.append(np.mean(month_scores))
            
            if monthly_scores:
                bias_analysis['temporal_bias'] = {
                    'score_variance': np.var(monthly_scores),
                    'trend_direction': 'improving' if monthly_scores[-1] > monthly_scores[0] else 'declining',
                    'bias_indicator': 'high' if np.var(monthly_scores) > 0.1 else 'low'
                }
            
            # Calculate overall bias score
            bias_indicators = []
            for group_data in bias_analysis['demographic_bias'].values():
                if group_data['bias_indicator'] == 'high':
                    bias_indicators.append(1.0)
            
            if bias_analysis['temporal_bias']:
                if bias_analysis['temporal_bias']['bias_indicator'] == 'high':
                    bias_indicators.append(1.0)
            
            bias_analysis['overall_bias_score'] = np.mean(bias_indicators) if bias_indicators else 0.0
            
            return bias_analysis
            
        except Exception as e:
            logger.error(f"Failed to detect bias patterns: {e}")
            return {'error': str(e)}

class PatientFeedbackManager:
    """Manages patient feedback collection and processing"""
    
    def __init__(self):
        self.feedback_storage = {}
        self.trust_system = TrustRatingSystem()
        self.feedback_analytics = {}
        
    async def submit_feedback(self, feedback: FeedbackMetadata) -> Dict[str, Any]:
        """Submit patient feedback for an AI output"""
        try:
            # Generate unique feedback ID
            feedback_id = str(uuid.uuid4())
            
            # Store feedback
            feedback_data = {
                'feedback_id': feedback_id,
                'patient_id': feedback.patient_id,
                'ai_output_id': feedback.ai_output_id,
                'feedback_type': feedback.feedback_type,
                'feedback_score': feedback.feedback_score,
                'feedback_text': feedback.feedback_text,
                'timestamp': feedback.timestamp.isoformat(),
                'session_id': feedback.session_id,
                'device_info': feedback.device_info
            }
            
            # Store in memory and persist to file
            if feedback.ai_output_id not in self.feedback_storage:
                self.feedback_storage[feedback.ai_output_id] = []
            
            self.feedback_storage[feedback.ai_output_id].append(feedback_data)
            
            # Persist to file
            await self._persist_feedback(feedback_data)
            
            # Update trust score
            all_feedback = [FeedbackMetadata(**f) for f in self.feedback_storage[feedback.ai_output_id]]
            trust_score = await self.trust_system.calculate_trust_score(feedback.ai_output_id, all_feedback)
            
            # Detect bias patterns
            bias_analysis = await self.trust_system.detect_bias_patterns(all_feedback)
            
            return {
                'feedback_id': feedback_id,
                'ai_output_id': feedback.ai_output_id,
                'trust_score': trust_score,
                'bias_analysis': bias_analysis,
                'feedback_count': len(self.feedback_storage[feedback.ai_output_id]),
                'status': 'submitted'
            }
            
        except Exception as e:
            logger.error(f"Failed to submit feedback: {e}")
            raise HTTPException(status_code=500, detail="Failed to submit feedback")
    
    async def _persist_feedback(self, feedback_data: Dict[str, Any]):
        """Persist feedback to file"""
        try:
            feedback_dir = "data/feedback"
            os.makedirs(feedback_dir, exist_ok=True)
            
            feedback_file = f"{feedback_dir}/{feedback_data['ai_output_id']}_feedback.json"
            
            # Load existing feedback or create new
            existing_feedback = []
            if os.path.exists(feedback_file):
                async with aiofiles.open(feedback_file, 'r') as f:
                    content = await f.read()
                    existing_feedback = json.loads(content) if content else []
            
            # Add new feedback
            existing_feedback.append(feedback_data)
            
            # Save updated feedback
            async with aiofiles.open(feedback_file, 'w') as f:
                await f.write(json.dumps(existing_feedback, indent=2))
                
        except Exception as e:
            logger.error(f"Failed to persist feedback: {e}")
    
    async def get_feedback_summary(self, ai_output_id: str) -> Dict[str, Any]:
        """Get feedback summary for an AI output"""
        try:
            if ai_output_id not in self.feedback_storage:
                return {
                    'ai_output_id': ai_output_id,
                    'feedback_count': 0,
                    'trust_score': 0.5,
                    'feedback_distribution': {},
                    'bias_analysis': {}
                }
            
            feedback_list = self.feedback_storage[ai_output_id]
            
            # Calculate feedback distribution
            feedback_distribution = {}
            for feedback in feedback_list:
                feedback_type = feedback['feedback_type']
                feedback_distribution[feedback_type] = feedback_distribution.get(feedback_type, 0) + 1
            
            # Get trust score
            trust_score = self.trust_system.trust_scores.get(ai_output_id, {}).get('score', 0.5)
            
            # Get bias analysis
            all_feedback = [FeedbackMetadata(**f) for f in feedback_list]
            bias_analysis = await self.trust_system.detect_bias_patterns(all_feedback)
            
            return {
                'ai_output_id': ai_output_id,
                'feedback_count': len(feedback_list),
                'trust_score': trust_score,
                'feedback_distribution': feedback_distribution,
                'bias_analysis': bias_analysis,
                'last_updated': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Failed to get feedback summary: {e}")
            raise HTTPException(status_code=500, detail="Failed to get feedback summary")
    
    async def get_patient_feedback_history(self, patient_id: str) -> List[Dict[str, Any]]:
        """Get feedback history for a specific patient"""
        try:
            patient_feedback = []
            
            for ai_output_id, feedback_list in self.feedback_storage.items():
                for feedback in feedback_list:
                    if feedback['patient_id'] == patient_id:
                        patient_feedback.append(feedback)
            
            # Sort by timestamp
            patient_feedback.sort(key=lambda x: x['timestamp'], reverse=True)
            
            return patient_feedback
            
        except Exception as e:
            logger.error(f"Failed to get patient feedback history: {e}")
            raise HTTPException(status_code=500, detail="Failed to get patient feedback history")
    
    async def generate_regulatory_report(self, start_date: datetime, 
                                      end_date: datetime) -> Dict[str, Any]:
        """Generate regulatory compliance report for bias monitoring"""
        try:
            report_data = {
                'report_period': {
                    'start_date': start_date.isoformat(),
                    'end_date': end_date.isoformat()
                },
                'total_feedback_count': 0,
                'trust_score_summary': {},
                'bias_analysis_summary': {},
                'compliance_status': 'compliant'
            }
            
            # Collect feedback within date range
            period_feedback = []
            for ai_output_id, feedback_list in self.feedback_storage.items():
                for feedback in feedback_list:
                    feedback_date = datetime.fromisoformat(feedback['timestamp'])
                    if start_date <= feedback_date <= end_date:
                        period_feedback.append(feedback)
            
            report_data['total_feedback_count'] = len(period_feedback)
            
            # Calculate trust score summary
            if period_feedback:
                trust_scores = []
                for feedback in period_feedback:
                    ai_output_id = feedback['ai_output_id']
                    if ai_output_id in self.trust_system.trust_scores:
                        trust_scores.append(self.trust_system.trust_scores[ai_output_id]['score'])
                
                if trust_scores:
                    report_data['trust_score_summary'] = {
                        'average_trust_score': np.mean(trust_scores),
                        'trust_score_std': np.std(trust_scores),
                        'min_trust_score': min(trust_scores),
                        'max_trust_score': max(trust_scores)
                    }
            
            # Generate bias analysis summary
            if period_feedback:
                feedback_objects = [FeedbackMetadata(**f) for f in period_feedback]
                bias_analysis = await self.trust_system.detect_bias_patterns(feedback_objects)
                report_data['bias_analysis_summary'] = bias_analysis
                
                # Check compliance status
                if bias_analysis.get('overall_bias_score', 0.0) > 0.7:
                    report_data['compliance_status'] = 'requires_review'
            
            return report_data
            
        except Exception as e:
            logger.error(f"Failed to generate regulatory report: {e}")
            raise HTTPException(status_code=500, detail="Failed to generate regulatory report")

class AIExplanationQuality:
    """Analyzes and improves AI explanation quality based on feedback"""
    
    def __init__(self):
        self.explanation_patterns = {}
        self.improvement_suggestions = {}
        
    async def analyze_explanation_quality(self, ai_output_id: str, 
                                       feedback_data: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Analyze explanation quality based on patient feedback"""
        try:
            quality_analysis = {
                'clarity_score': 0.0,
                'helpfulness_score': 0.0,
                'completeness_score': 0.0,
                'improvement_areas': [],
                'best_practices': []
            }
            
            if not feedback_data:
                return quality_analysis
            
            # Analyze feedback patterns
            confusing_feedback = [f for f in feedback_data if f['feedback_type'] == 'confusing']
            helpful_feedback = [f for f in feedback_data if f['feedback_type'] == 'helpful']
            
            # Calculate clarity score
            total_feedback = len(feedback_data)
            clarity_score = 1.0 - (len(confusing_feedback) / total_feedback) if total_feedback > 0 else 0.5
            quality_analysis['clarity_score'] = clarity_score
            
            # Calculate helpfulness score
            helpfulness_score = len(helpful_feedback) / total_feedback if total_feedback > 0 else 0.5
            quality_analysis['helpfulness_score'] = helpfulness_score
            
            # Identify improvement areas
            if len(confusing_feedback) > len(helpful_feedback):
                quality_analysis['improvement_areas'].append('explanation_clarity')
            
            if clarity_score < 0.7:
                quality_analysis['improvement_areas'].append('simplify_language')
            
            if helpfulness_score < 0.6:
                quality_analysis['improvement_areas'].append('provide_more_context')
            
            # Suggest best practices
            if clarity_score > 0.8:
                quality_analysis['best_practices'].append('clear_explanation_style')
            
            if helpfulness_score > 0.7:
                quality_analysis['best_practices'].append('comprehensive_context')
            
            return quality_analysis
            
        except Exception as e:
            logger.error(f"Failed to analyze explanation quality: {e}")
            return {'error': str(e)}

# Initialize global instances
patient_feedback_manager = PatientFeedbackManager()
ai_explanation_quality = AIExplanationQuality()

# Pydantic models for API
class PatientFeedbackRequest(BaseModel):
    patient_id: str = Field(..., description="Patient identifier")
    ai_output_id: str = Field(..., description="AI output identifier")
    feedback_type: str = Field(..., description="Type of feedback")
    feedback_score: float = Field(..., ge=1.0, le=5.0, description="Feedback score (1-5)")
    feedback_text: Optional[str] = Field(None, description="Optional feedback text")
    session_id: Optional[str] = Field(None, description="Session identifier")
    device_info: Optional[Dict[str, Any]] = Field(None, description="Device information")

class FeedbackSummaryResponse(BaseModel):
    ai_output_id: str
    feedback_count: int
    trust_score: float
    feedback_distribution: Dict[str, int]
    bias_analysis: Dict[str, Any]
    last_updated: str

class RegulatoryReportRequest(BaseModel):
    start_date: datetime = Field(..., description="Report start date")
    end_date: datetime = Field(..., description="Report end date")

class RegulatoryReportResponse(BaseModel):
    report_period: Dict[str, str]
    total_feedback_count: int
    trust_score_summary: Dict[str, float]
    bias_analysis_summary: Dict[str, Any]
    compliance_status: str 