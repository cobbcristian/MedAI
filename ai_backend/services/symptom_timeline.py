import asyncio
import json
import logging
import os
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any, Tuple
import numpy as np
import pandas as pd
from dataclasses import dataclass
import plotly.graph_objects as go
import plotly.express as px
from plotly.subplots import make_subplots
import io
import base64

# AI/ML imports
from sklearn.cluster import DBSCAN
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
import openai
from openai import AsyncOpenAI

logger = logging.getLogger(__name__)

@dataclass
class SymptomEvent:
    """Represents a single symptom event"""
    timestamp: datetime
    symptom: str
    severity: float  # 0-10 scale
    duration_hours: Optional[float] = None
    triggers: List[str] = None
    medications: List[str] = None
    notes: str = None
    location: str = None
    associated_symptoms: List[str] = None

@dataclass
class SymptomPattern:
    """Represents a discovered symptom pattern"""
    pattern_type: str  # "cyclic", "triggered", "progressive", "random"
    symptoms: List[str]
    frequency: float  # events per week
    severity_trend: str  # "increasing", "decreasing", "stable"
    confidence: float
    triggers: List[str] = None
    recommendations: List[str] = None

class SymptomTimelineService:
    """
    AI-powered symptom timeline tracking and analysis service
    Helps track chronic illness progression and identify patterns
    """
    
    def __init__(self):
        self.client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        self.model_version = "v1.2.1"
        
        # Initialize clustering for pattern detection
        self.scaler = StandardScaler()
        self.pca = PCA(n_components=2)
        
        logger.info("SymptomTimelineService initialized")
    
    async def track_symptom_event(
        self,
        patient_id: str,
        symptom: str,
        severity: float,
        timestamp: datetime = None,
        duration_hours: Optional[float] = None,
        triggers: List[str] = None,
        medications: List[str] = None,
        notes: str = None,
        location: str = None,
        associated_symptoms: List[str] = None
    ) -> Dict[str, Any]:
        """
        Track a new symptom event
        """
        try:
            if timestamp is None:
                timestamp = datetime.now()
            
            event = SymptomEvent(
                timestamp=timestamp,
                symptom=symptom,
                severity=severity,
                duration_hours=duration_hours,
                triggers=triggers or [],
                medications=medications or [],
                notes=notes,
                location=location,
                associated_symptoms=associated_symptoms or []
            )
            
            # Store event (in production, this would go to database)
            event_id = await self._store_symptom_event(patient_id, event)
            
            # Analyze patterns in real-time
            patterns = await self._analyze_symptom_patterns(patient_id)
            
            # Generate insights
            insights = await self._generate_symptom_insights(patient_id, event, patterns)
            
            return {
                "event_id": event_id,
                "event": {
                    "timestamp": event.timestamp.isoformat(),
                    "symptom": event.symptom,
                    "severity": event.severity,
                    "duration_hours": event.duration_hours,
                    "triggers": event.triggers,
                    "medications": event.medications,
                    "notes": event.notes,
                    "location": event.location,
                    "associated_symptoms": event.associated_symptoms
                },
                "patterns": patterns,
                "insights": insights,
                "model_version": self.model_version
            }
            
        except Exception as e:
            logger.error(f"Error tracking symptom event: {e}")
            raise
    
    async def get_symptom_timeline(
        self,
        patient_id: str,
        start_date: datetime = None,
        end_date: datetime = None,
        symptoms: List[str] = None
    ) -> Dict[str, Any]:
        """
        Get symptom timeline with visualization
        """
        try:
            # Get symptom events
            events = await self._get_symptom_events(patient_id, start_date, end_date, symptoms)
            
            # Generate timeline visualization
            timeline_chart = await self._generate_timeline_chart(events)
            
            # Analyze patterns
            patterns = await self._analyze_symptom_patterns(patient_id, events)
            
            # Generate trend analysis
            trends = await self._analyze_trends(events)
            
            return {
                "events": [self._event_to_dict(event) for event in events],
                "timeline_chart": timeline_chart,
                "patterns": patterns,
                "trends": trends,
                "summary": await self._generate_timeline_summary(events, patterns, trends)
            }
            
        except Exception as e:
            logger.error(f"Error getting symptom timeline: {e}")
            raise
    
    async def analyze_chronic_illness_progression(
        self,
        patient_id: str,
        condition: str,
        months_back: int = 6
    ) -> Dict[str, Any]:
        """
        Analyze progression of chronic illness symptoms
        """
        try:
            end_date = datetime.now()
            start_date = end_date - timedelta(days=months_back * 30)
            
            events = await self._get_symptom_events(patient_id, start_date, end_date)
            
            # Filter events related to the condition
            condition_events = [e for e in events if condition.lower() in e.symptom.lower()]
            
            if not condition_events:
                return {"error": f"No events found for condition: {condition}"}
            
            # Analyze progression patterns
            progression_analysis = await self._analyze_progression_patterns(condition_events)
            
            # Generate progression visualization
            progression_chart = await self._generate_progression_chart(condition_events)
            
            # Predict future trends
            predictions = await self._predict_future_trends(condition_events)
            
            # Generate recommendations
            recommendations = await self._generate_progression_recommendations(
                condition_events, progression_analysis, predictions
            )
            
            return {
                "condition": condition,
                "analysis_period": {
                    "start_date": start_date.isoformat(),
                    "end_date": end_date.isoformat()
                },
                "total_events": len(condition_events),
                "progression_analysis": progression_analysis,
                "progression_chart": progression_chart,
                "predictions": predictions,
                "recommendations": recommendations,
                "model_version": self.model_version
            }
            
        except Exception as e:
            logger.error(f"Error analyzing chronic illness progression: {e}")
            raise
    
    async def detect_symptom_patterns(
        self,
        patient_id: str,
        time_window_days: int = 90
    ) -> Dict[str, Any]:
        """
        Detect patterns in symptom occurrence and severity
        """
        try:
            end_date = datetime.now()
            start_date = end_date - timedelta(days=time_window_days)
            
            events = await self._get_symptom_events(patient_id, start_date, end_date)
            
            if not events:
                return {"error": "No symptom events found in the specified time window"}
            
            # Detect cyclic patterns
            cyclic_patterns = await self._detect_cyclic_patterns(events)
            
            # Detect trigger-based patterns
            trigger_patterns = await self._detect_trigger_patterns(events)
            
            # Detect severity trends
            severity_trends = await self._analyze_severity_trends(events)
            
            # Cluster similar symptoms
            symptom_clusters = await self._cluster_symptoms(events)
            
            # Generate pattern insights
            pattern_insights = await self._generate_pattern_insights(
                cyclic_patterns, trigger_patterns, severity_trends, symptom_clusters
            )
            
            return {
                "time_window": {
                    "start_date": start_date.isoformat(),
                    "end_date": end_date.isoformat(),
                    "days": time_window_days
                },
                "total_events": len(events),
                "cyclic_patterns": cyclic_patterns,
                "trigger_patterns": trigger_patterns,
                "severity_trends": severity_trends,
                "symptom_clusters": symptom_clusters,
                "pattern_insights": pattern_insights,
                "model_version": self.model_version
            }
            
        except Exception as e:
            logger.error(f"Error detecting symptom patterns: {e}")
            raise
    
    async def _store_symptom_event(self, patient_id: str, event: SymptomEvent) -> str:
        """Store symptom event (placeholder for database integration)"""
        # In production, this would store to database
        event_id = f"{patient_id}_{event.timestamp.strftime('%Y%m%d_%H%M%S')}"
        logger.info(f"Stored symptom event: {event_id}")
        return event_id
    
    async def _get_symptom_events(
        self,
        patient_id: str,
        start_date: datetime = None,
        end_date: datetime = None,
        symptoms: List[str] = None
    ) -> List[SymptomEvent]:
        """Get symptom events (placeholder for database integration)"""
        # In production, this would query database
        # For now, return mock data
        mock_events = [
            SymptomEvent(
                timestamp=datetime.now() - timedelta(days=i),
                symptom="Headache",
                severity=7.0,
                duration_hours=4.0,
                triggers=["stress", "lack of sleep"],
                medications=["Ibuprofen"],
                notes="Severe headache in the morning",
                location="Temples",
                associated_symptoms=["nausea", "light sensitivity"]
            )
            for i in range(30)  # Last 30 days
        ]
        
        # Filter by date range
        if start_date:
            mock_events = [e for e in mock_events if e.timestamp >= start_date]
        if end_date:
            mock_events = [e for e in mock_events if e.timestamp <= end_date]
        
        # Filter by symptoms
        if symptoms:
            mock_events = [e for e in mock_events if e.symptom in symptoms]
        
        return mock_events
    
    async def _generate_timeline_chart(self, events: List[SymptomEvent]) -> str:
        """Generate timeline visualization using Plotly"""
        try:
            if not events:
                return ""
            
            # Prepare data for plotting
            dates = [event.timestamp for event in events]
            severities = [event.severity for event in events]
            symptoms = [event.symptom for event in events]
            
            # Create timeline chart
            fig = go.Figure()
            
            # Add severity line
            fig.add_trace(go.Scatter(
                x=dates,
                y=severities,
                mode='lines+markers',
                name='Symptom Severity',
                line=dict(color='red', width=2),
                marker=dict(size=8, color='red')
            ))
            
            # Add symptom annotations
            for i, (date, severity, symptom) in enumerate(zip(dates, severities, symptoms)):
                fig.add_annotation(
                    x=date,
                    y=severity,
                    text=symptom,
                    showarrow=True,
                    arrowhead=2,
                    arrowsize=1,
                    arrowwidth=2,
                    arrowcolor="black",
                    ax=0,
                    ay=-40
                )
            
            # Update layout
            fig.update_layout(
                title="Symptom Timeline",
                xaxis_title="Date",
                yaxis_title="Severity (0-10)",
                yaxis=dict(range=[0, 10]),
                hovermode='closest',
                height=500
            )
            
            # Convert to base64 for frontend
            img_bytes = fig.to_image(format="png")
            img_base64 = base64.b64encode(img_bytes).decode()
            
            return f"data:image/png;base64,{img_base64}"
            
        except Exception as e:
            logger.error(f"Error generating timeline chart: {e}")
            return ""
    
    async def _analyze_symptom_patterns(
        self,
        patient_id: str,
        events: List[SymptomEvent] = None
    ) -> List[SymptomPattern]:
        """Analyze symptom patterns"""
        try:
            if events is None:
                events = await self._get_symptom_events(patient_id)
            
            patterns = []
            
            # Analyze by symptom type
            symptom_groups = {}
            for event in events:
                if event.symptom not in symptom_groups:
                    symptom_groups[event.symptom] = []
                symptom_groups[event.symptom].append(event)
            
            for symptom, symptom_events in symptom_groups.items():
                if len(symptom_events) < 3:
                    continue
                
                # Analyze frequency
                frequency = len(symptom_events) / (len(events) / 7)  # events per week
                
                # Analyze severity trend
                severities = [e.severity for e in symptom_events]
                severity_trend = self._calculate_trend(severities)
                
                # Analyze triggers
                all_triggers = []
                for event in symptom_events:
                    all_triggers.extend(event.triggers)
                
                common_triggers = self._get_common_items(all_triggers, 3)
                
                # Determine pattern type
                pattern_type = self._determine_pattern_type(symptom_events, frequency)
                
                pattern = SymptomPattern(
                    pattern_type=pattern_type,
                    symptoms=[symptom],
                    frequency=frequency,
                    severity_trend=severity_trend,
                    confidence=0.8,  # Simplified confidence calculation
                    triggers=common_triggers,
                    recommendations=self._generate_pattern_recommendations(pattern_type, symptom)
                )
                
                patterns.append(pattern)
            
            return patterns
            
        except Exception as e:
            logger.error(f"Error analyzing symptom patterns: {e}")
            return []
    
    def _calculate_trend(self, values: List[float]) -> str:
        """Calculate trend from a list of values"""
        if len(values) < 2:
            return "stable"
        
        # Simple linear regression
        x = np.arange(len(values))
        y = np.array(values)
        
        slope = np.polyfit(x, y, 1)[0]
        
        if slope > 0.1:
            return "increasing"
        elif slope < -0.1:
            return "decreasing"
        else:
            return "stable"
    
    def _get_common_items(self, items: List[str], top_n: int) -> List[str]:
        """Get most common items from a list"""
        from collections import Counter
        counter = Counter(items)
        return [item for item, count in counter.most_common(top_n)]
    
    def _determine_pattern_type(
        self,
        events: List[SymptomEvent],
        frequency: float
    ) -> str:
        """Determine the type of symptom pattern"""
        if frequency > 3:  # More than 3 times per week
            return "cyclic"
        elif any(event.triggers for event in events):
            return "triggered"
        elif len(events) > 10:
            return "progressive"
        else:
            return "random"
    
    def _generate_pattern_recommendations(self, pattern_type: str, symptom: str) -> List[str]:
        """Generate recommendations based on pattern type"""
        recommendations = {
            "cyclic": [
                "Track your daily routine to identify triggers",
                "Consider preventive medications",
                "Maintain a regular sleep schedule"
            ],
            "triggered": [
                "Avoid known triggers when possible",
                "Keep a detailed trigger diary",
                "Consider desensitization therapy"
            ],
            "progressive": [
                "Schedule regular check-ups with your doctor",
                "Monitor symptom severity closely",
                "Consider lifestyle modifications"
            ],
            "random": [
                "Continue monitoring for patterns",
                "Keep detailed symptom logs",
                "Discuss with healthcare provider"
            ]
        }
        
        return recommendations.get(pattern_type, ["Continue monitoring"])
    
    async def _analyze_trends(self, events: List[SymptomEvent]) -> Dict[str, Any]:
        """Analyze overall trends in symptom data"""
        try:
            if not events:
                return {}
            
            # Group by week
            weekly_data = {}
            for event in events:
                week_start = event.timestamp - timedelta(days=event.timestamp.weekday())
                week_key = week_start.strftime('%Y-%W')
                
                if week_key not in weekly_data:
                    weekly_data[week_key] = []
                weekly_data[week_key].append(event)
            
            # Calculate weekly averages
            weekly_averages = []
            for week, week_events in weekly_data.items():
                avg_severity = np.mean([e.severity for e in week_events])
                weekly_averages.append({
                    "week": week,
                    "avg_severity": avg_severity,
                    "event_count": len(week_events)
                })
            
            # Calculate overall trends
            severities = [w["avg_severity"] for w in weekly_averages]
            severity_trend = self._calculate_trend(severities)
            
            # Calculate frequency trend
            frequencies = [w["event_count"] for w in weekly_averages]
            frequency_trend = self._calculate_trend(frequencies)
            
            return {
                "severity_trend": severity_trend,
                "frequency_trend": frequency_trend,
                "weekly_data": weekly_averages,
                "overall_improvement": severity_trend == "decreasing" and frequency_trend == "decreasing"
            }
            
        except Exception as e:
            logger.error(f"Error analyzing trends: {e}")
            return {}
    
    async def _generate_timeline_summary(
        self,
        events: List[SymptomEvent],
        patterns: List[SymptomPattern],
        trends: Dict[str, Any]
    ) -> str:
        """Generate a summary of the timeline analysis"""
        try:
            if not events:
                return "No symptom events found in the specified time period."
            
            summary_parts = []
            
            # Basic statistics
            total_events = len(events)
            avg_severity = np.mean([e.severity for e in events])
            unique_symptoms = len(set(e.symptom for e in events))
            
            summary_parts.append(f"Over the analyzed period, you experienced {total_events} symptom events.")
            summary_parts.append(f"Average severity was {avg_severity:.1f}/10.")
            summary_parts.append(f"You reported {unique_symptoms} different types of symptoms.")
            
            # Pattern insights
            if patterns:
                cyclic_count = len([p for p in patterns if p.pattern_type == "cyclic"])
                triggered_count = len([p for p in patterns if p.pattern_type == "triggered"])
                
                if cyclic_count > 0:
                    summary_parts.append(f"Found {cyclic_count} cyclic symptom patterns.")
                if triggered_count > 0:
                    summary_parts.append(f"Found {triggered_count} trigger-based patterns.")
            
            # Trend insights
            if trends.get("overall_improvement"):
                summary_parts.append("Overall, your symptoms show improvement over time.")
            elif trends.get("severity_trend") == "increasing":
                summary_parts.append("Your symptom severity has been increasing. Consider consulting your healthcare provider.")
            
            return " ".join(summary_parts)
            
        except Exception as e:
            logger.error(f"Error generating timeline summary: {e}")
            return "Unable to generate summary at this time."
    
    def _event_to_dict(self, event: SymptomEvent) -> Dict[str, Any]:
        """Convert SymptomEvent to dictionary"""
        return {
            "timestamp": event.timestamp.isoformat(),
            "symptom": event.symptom,
            "severity": event.severity,
            "duration_hours": event.duration_hours,
            "triggers": event.triggers,
            "medications": event.medications,
            "notes": event.notes,
            "location": event.location,
            "associated_symptoms": event.associated_symptoms
        }
    
    async def _analyze_progression_patterns(self, events: List[SymptomEvent]) -> Dict[str, Any]:
        """Analyze progression patterns for chronic illness"""
        try:
            # Sort events by timestamp
            sorted_events = sorted(events, key=lambda x: x.timestamp)
            
            # Calculate progression metrics
            severities = [e.severity for e in sorted_events]
            frequencies = []
            
            # Calculate weekly frequencies
            for i in range(0, len(sorted_events), 7):
                week_events = sorted_events[i:i+7]
                frequencies.append(len(week_events))
            
            # Analyze progression phases
            phases = self._identify_progression_phases(sorted_events)
            
            # Calculate stability periods
            stability_periods = self._find_stability_periods(sorted_events)
            
            return {
                "total_duration_days": (sorted_events[-1].timestamp - sorted_events[0].timestamp).days,
                "severity_progression": self._calculate_trend(severities),
                "frequency_progression": self._calculate_trend(frequencies),
                "phases": phases,
                "stability_periods": stability_periods,
                "peak_severity": max(severities),
                "current_severity": severities[-1] if severities else 0
            }
            
        except Exception as e:
            logger.error(f"Error analyzing progression patterns: {e}")
            return {}
    
    def _identify_progression_phases(self, events: List[SymptomEvent]) -> List[Dict[str, Any]]:
        """Identify different phases in symptom progression"""
        phases = []
        
        if len(events) < 3:
            return phases
        
        # Simple phase detection based on severity changes
        severities = [e.severity for e in events]
        dates = [e.timestamp for e in events]
        
        # Find significant changes in severity
        severity_changes = []
        for i in range(1, len(severities)):
            change = severities[i] - severities[i-1]
            if abs(change) > 2:  # Significant change threshold
                severity_changes.append({
                    "date": dates[i],
                    "change": change,
                    "index": i
                })
        
        # Define phases based on changes
        if severity_changes:
            for i, change in enumerate(severity_changes):
                start_idx = severity_changes[i-1]["index"] if i > 0 else 0
                end_idx = change["index"]
                
                phase_severities = severities[start_idx:end_idx]
                avg_severity = np.mean(phase_severities)
                
                if avg_severity < 3:
                    phase_type = "mild"
                elif avg_severity < 7:
                    phase_type = "moderate"
                else:
                    phase_type = "severe"
                
                phases.append({
                    "phase_type": phase_type,
                    "start_date": dates[start_idx].isoformat(),
                    "end_date": dates[end_idx-1].isoformat(),
                    "avg_severity": avg_severity,
                    "duration_days": (dates[end_idx-1] - dates[start_idx]).days
                })
        
        return phases
    
    def _find_stability_periods(self, events: List[SymptomEvent]) -> List[Dict[str, Any]]:
        """Find periods of symptom stability"""
        stability_periods = []
        
        if len(events) < 5:
            return stability_periods
        
        # Group events by week
        weekly_groups = {}
        for event in events:
            week_start = event.timestamp - timedelta(days=event.timestamp.weekday())
            week_key = week_start.strftime('%Y-%W')
            
            if week_key not in weekly_groups:
                weekly_groups[week_key] = []
            weekly_groups[week_key].append(event)
        
        # Find consecutive weeks with similar severity
        weeks = sorted(weekly_groups.keys())
        current_stability_start = None
        current_stability_severity = None
        
        for week in weeks:
            week_events = weekly_groups[week]
            avg_severity = np.mean([e.severity for e in week_events])
            
            if current_stability_severity is None:
                current_stability_start = week
                current_stability_severity = avg_severity
            elif abs(avg_severity - current_stability_severity) <= 1:  # Stability threshold
                continue
            else:
                # End of stability period
                if current_stability_start:
                    stability_periods.append({
                        "start_week": current_stability_start,
                        "end_week": week,
                        "avg_severity": current_stability_severity,
                        "duration_weeks": len([w for w in weeks if current_stability_start <= w <= week])
                    })
                
                current_stability_start = week
                current_stability_severity = avg_severity
        
        return stability_periods
    
    async def _generate_progression_chart(self, events: List[SymptomEvent]) -> str:
        """Generate progression visualization"""
        try:
            if not events:
                return ""
            
            # Sort events by timestamp
            sorted_events = sorted(events, key=lambda x: x.timestamp)
            dates = [e.timestamp for e in sorted_events]
            severities = [e.severity for e in sorted_events]
            
            # Create progression chart
            fig = go.Figure()
            
            # Add severity line
            fig.add_trace(go.Scatter(
                x=dates,
                y=severities,
                mode='lines+markers',
                name='Symptom Severity',
                line=dict(color='red', width=3),
                marker=dict(size=10, color='red')
            ))
            
            # Add trend line
            x_numeric = np.arange(len(dates))
            z = np.polyfit(x_numeric, severities, 1)
            p = np.poly1d(z)
            trend_line = p(x_numeric)
            
            fig.add_trace(go.Scatter(
                x=dates,
                y=trend_line,
                mode='lines',
                name='Trend Line',
                line=dict(color='blue', width=2, dash='dash')
            ))
            
            # Update layout
            fig.update_layout(
                title="Symptom Progression Over Time",
                xaxis_title="Date",
                yaxis_title="Severity (0-10)",
                yaxis=dict(range=[0, 10]),
                hovermode='closest',
                height=500
            )
            
            # Convert to base64
            img_bytes = fig.to_image(format="png")
            img_base64 = base64.b64encode(img_bytes).decode()
            
            return f"data:image/png;base64,{img_base64}"
            
        except Exception as e:
            logger.error(f"Error generating progression chart: {e}")
            return ""
    
    async def _predict_future_trends(self, events: List[SymptomEvent]) -> Dict[str, Any]:
        """Predict future symptom trends"""
        try:
            if len(events) < 5:
                return {"error": "Insufficient data for prediction"}
            
            # Sort events by timestamp
            sorted_events = sorted(events, key=lambda x: x.timestamp)
            severities = [e.severity for e in sorted_events]
            
            # Simple linear regression for prediction
            x = np.arange(len(severities))
            y = np.array(severities)
            
            # Fit polynomial regression
            z = np.polyfit(x, y, 2)  # Quadratic fit
            p = np.poly1d(z)
            
            # Predict next 30 days
            future_x = np.arange(len(severities), len(severities) + 30)
            future_predictions = p(future_x)
            
            # Calculate confidence intervals (simplified)
            residuals = y - p(x)
            std_error = np.std(residuals)
            confidence_interval = 1.96 * std_error  # 95% confidence
            
            return {
                "predictions": future_predictions.tolist(),
                "confidence_interval": confidence_interval,
                "trend_direction": "increasing" if z[0] > 0 else "decreasing",
                "prediction_horizon_days": 30
            }
            
        except Exception as e:
            logger.error(f"Error predicting future trends: {e}")
            return {"error": "Unable to generate predictions"}
    
    async def _generate_progression_recommendations(
        self,
        events: List[SymptomEvent],
        progression_analysis: Dict[str, Any],
        predictions: Dict[str, Any]
    ) -> List[str]:
        """Generate recommendations based on progression analysis"""
        recommendations = []
        
        # Analyze current trend
        if progression_analysis.get("severity_progression") == "increasing":
            recommendations.append("Your symptoms are worsening. Consider scheduling an appointment with your healthcare provider.")
        
        # Analyze stability
        if progression_analysis.get("stability_periods"):
            recommendations.append("You've had periods of symptom stability. Identify what factors contributed to these stable periods.")
        
        # Analyze predictions
        if predictions.get("trend_direction") == "increasing":
            recommendations.append("Based on current trends, your symptoms may continue to worsen. Consider preventive measures.")
        
        # General recommendations
        recommendations.extend([
            "Continue tracking your symptoms daily",
            "Note any new triggers or patterns",
            "Keep your healthcare provider informed of any significant changes",
            "Consider lifestyle modifications that may help manage symptoms"
        ])
        
        return recommendations
    
    async def _detect_cyclic_patterns(self, events: List[SymptomEvent]) -> List[Dict[str, Any]]:
        """Detect cyclic patterns in symptoms"""
        try:
            cyclic_patterns = []
            
            # Group by symptom type
            symptom_groups = {}
            for event in events:
                if event.symptom not in symptom_groups:
                    symptom_groups[event.symptom] = []
                symptom_groups[event.symptom].append(event)
            
            for symptom, symptom_events in symptom_groups.items():
                if len(symptom_events) < 5:
                    continue
                
                # Sort by timestamp
                sorted_events = sorted(symptom_events, key=lambda x: x.timestamp)
                
                # Calculate intervals between events
                intervals = []
                for i in range(1, len(sorted_events)):
                    interval = (sorted_events[i].timestamp - sorted_events[i-1].timestamp).days
                    intervals.append(interval)
                
                if len(intervals) < 2:
                    continue
                
                # Check for regularity (low variance in intervals)
                interval_std = np.std(intervals)
                interval_mean = np.mean(intervals)
                
                # If coefficient of variation is low, it's cyclic
                cv = interval_std / interval_mean if interval_mean > 0 else float('inf')
                
                if cv < 0.5:  # Regular pattern
                    cyclic_patterns.append({
                        "symptom": symptom,
                        "cycle_length_days": interval_mean,
                        "regularity_score": 1 - cv,
                        "event_count": len(symptom_events),
                        "avg_severity": np.mean([e.severity for e in symptom_events])
                    })
            
            return cyclic_patterns
            
        except Exception as e:
            logger.error(f"Error detecting cyclic patterns: {e}")
            return []
    
    async def _detect_trigger_patterns(self, events: List[SymptomEvent]) -> List[Dict[str, Any]]:
        """Detect trigger-based patterns"""
        try:
            trigger_patterns = []
            
            # Collect all triggers
            all_triggers = {}
            for event in events:
                for trigger in event.triggers:
                    if trigger not in all_triggers:
                        all_triggers[trigger] = []
                    all_triggers[trigger].append(event)
            
            # Analyze each trigger
            for trigger, trigger_events in all_triggers.items():
                if len(trigger_events) < 2:
                    continue
                
                # Calculate trigger effectiveness
                avg_severity = np.mean([e.severity for e in trigger_events])
                trigger_frequency = len(trigger_events) / len(events)
                
                trigger_patterns.append({
                    "trigger": trigger,
                    "event_count": len(trigger_events),
                    "avg_severity": avg_severity,
                    "frequency": trigger_frequency,
                    "effectiveness_score": avg_severity * trigger_frequency
                })
            
            # Sort by effectiveness
            trigger_patterns.sort(key=lambda x: x["effectiveness_score"], reverse=True)
            
            return trigger_patterns[:5]  # Top 5 triggers
            
        except Exception as e:
            logger.error(f"Error detecting trigger patterns: {e}")
            return []
    
    async def _analyze_severity_trends(self, events: List[SymptomEvent]) -> Dict[str, Any]:
        """Analyze trends in symptom severity"""
        try:
            if not events:
                return {}
            
            # Sort by timestamp
            sorted_events = sorted(events, key=lambda x: x.timestamp)
            severities = [e.severity for e in sorted_events]
            
            # Calculate overall trend
            overall_trend = self._calculate_trend(severities)
            
            # Calculate weekly trends
            weekly_trends = []
            for i in range(0, len(sorted_events), 7):
                week_events = sorted_events[i:i+7]
                if len(week_events) >= 2:
                    week_severities = [e.severity for e in week_events]
                    week_trend = self._calculate_trend(week_severities)
                    weekly_trends.append({
                        "week": i // 7,
                        "trend": week_trend,
                        "avg_severity": np.mean(week_severities)
                    })
            
            # Find severity clusters
            severity_clusters = self._cluster_severities(severities)
            
            return {
                "overall_trend": overall_trend,
                "weekly_trends": weekly_trends,
                "severity_clusters": severity_clusters,
                "peak_severity": max(severities),
                "min_severity": min(severities),
                "avg_severity": np.mean(severities)
            }
            
        except Exception as e:
            logger.error(f"Error analyzing severity trends: {e}")
            return {}
    
    def _cluster_severities(self, severities: List[float]) -> List[Dict[str, Any]]:
        """Cluster severity levels to identify patterns"""
        try:
            if len(severities) < 3:
                return []
            
            # Reshape for clustering
            X = np.array(severities).reshape(-1, 1)
            
            # Apply DBSCAN clustering
            clustering = DBSCAN(eps=1.0, min_samples=2).fit(X)
            
            # Group by clusters
            clusters = {}
            for i, label in enumerate(clustering.labels_):
                if label not in clusters:
                    clusters[label] = []
                clusters[label].append(severities[i])
            
            # Format results
            cluster_results = []
            for label, cluster_severities in clusters.items():
                if label != -1:  # Skip noise points
                    cluster_results.append({
                        "cluster_id": label,
                        "avg_severity": np.mean(cluster_severities),
                        "count": len(cluster_severities),
                        "severity_range": [min(cluster_severities), max(cluster_severities)]
                    })
            
            return cluster_results
            
        except Exception as e:
            logger.error(f"Error clustering severities: {e}")
            return []
    
    async def _cluster_symptoms(self, events: List[SymptomEvent]) -> List[Dict[str, Any]]:
        """Cluster similar symptoms based on co-occurrence and characteristics"""
        try:
            if len(events) < 3:
                return []
            
            # Create symptom similarity matrix
            symptoms = list(set(e.symptom for e in events))
            similarity_matrix = np.zeros((len(symptoms), len(symptoms)))
            
            # Calculate similarity based on co-occurrence and characteristics
            for i, symptom1 in enumerate(symptoms):
                for j, symptom2 in enumerate(symptoms):
                    if i == j:
                        similarity_matrix[i][j] = 1.0
                    else:
                        # Find events with both symptoms
                        events1 = [e for e in events if e.symptom == symptom1]
                        events2 = [e for e in events if e.symptom == symptom2]
                        
                        # Calculate temporal proximity
                        proximity_score = 0
                        for e1 in events1:
                            for e2 in events2:
                                time_diff = abs((e1.timestamp - e2.timestamp).days)
                                if time_diff <= 7:  # Within a week
                                    proximity_score += 1 / (time_diff + 1)
                        
                        # Calculate characteristic similarity
                        avg_severity1 = np.mean([e.severity for e in events1])
                        avg_severity2 = np.mean([e.severity for e in events2])
                        severity_similarity = 1 - abs(avg_severity1 - avg_severity2) / 10
                        
                        # Combined similarity
                        similarity_matrix[i][j] = (proximity_score + severity_similarity) / 2
            
            # Apply clustering
            clustering = DBSCAN(eps=0.3, min_samples=2).fit(similarity_matrix)
            
            # Group symptoms by clusters
            clusters = {}
            for i, label in enumerate(clustering.labels_):
                if label not in clusters:
                    clusters[label] = []
                clusters[label].append(symptoms[i])
            
            # Format results
            cluster_results = []
            for label, cluster_symptoms in clusters.items():
                if label != -1:  # Skip noise
                    cluster_events = [e for e in events if e.symptom in cluster_symptoms]
                    cluster_results.append({
                        "cluster_id": label,
                        "symptoms": cluster_symptoms,
                        "event_count": len(cluster_events),
                        "avg_severity": np.mean([e.severity for e in cluster_events])
                    })
            
            return cluster_results
            
        except Exception as e:
            logger.error(f"Error clustering symptoms: {e}")
            return []
    
    async def _generate_pattern_insights(
        self,
        cyclic_patterns: List[Dict[str, Any]],
        trigger_patterns: List[Dict[str, Any]],
        severity_trends: Dict[str, Any],
        symptom_clusters: List[Dict[str, Any]]
    ) -> List[str]:
        """Generate insights from pattern analysis"""
        insights = []
        
        # Cyclic pattern insights
        if cyclic_patterns:
            most_cyclic = max(cyclic_patterns, key=lambda x: x["regularity_score"])
            insights.append(f"Your {most_cyclic['symptom']} shows a strong cyclic pattern every {most_cyclic['cycle_length_days']:.1f} days.")
        
        # Trigger pattern insights
        if trigger_patterns:
            top_trigger = trigger_patterns[0]
            insights.append(f"'{top_trigger['trigger']}' appears to be your most significant trigger, causing {top_trigger['event_count']} symptom events.")
        
        # Severity trend insights
        if severity_trends.get("overall_trend") == "increasing":
            insights.append("Your overall symptom severity has been increasing over time.")
        elif severity_trends.get("overall_trend") == "decreasing":
            insights.append("Your overall symptom severity has been improving over time.")
        
        # Symptom cluster insights
        if symptom_clusters:
            largest_cluster = max(symptom_clusters, key=lambda x: x["event_count"])
            insights.append(f"You experience {len(largest_cluster['symptoms'])} related symptoms that often occur together.")
        
        return insights
    
    async def _generate_symptom_insights(
        self,
        patient_id: str,
        event: SymptomEvent,
        patterns: List[SymptomPattern]
    ) -> List[str]:
        """Generate real-time insights for a new symptom event"""
        insights = []
        
        # Check if this symptom follows a known pattern
        for pattern in patterns:
            if event.symptom in pattern.symptoms:
                if pattern.pattern_type == "cyclic":
                    insights.append(f"This {event.symptom} follows your usual cyclic pattern.")
                elif pattern.pattern_type == "triggered":
                    if event.triggers:
                        insights.append(f"This {event.symptom} was likely triggered by: {', '.join(event.triggers)}")
        
        # Severity insights
        if event.severity > 8:
            insights.append("This is a high-severity symptom. Consider seeking immediate medical attention if it persists.")
        elif event.severity > 6:
            insights.append("This is a moderate-severity symptom. Monitor it closely and consider preventive measures.")
        
        # Duration insights
        if event.duration_hours and event.duration_hours > 24:
            insights.append("This symptom has persisted for over 24 hours. Consider consulting your healthcare provider.")
        
        return insights 