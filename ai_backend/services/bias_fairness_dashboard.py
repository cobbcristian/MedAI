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

# Statistical analysis
from scipy import stats
from sklearn.metrics import confusion_matrix, classification_report
from sklearn.preprocessing import LabelEncoder

logger = logging.getLogger(__name__)

@dataclass
class BiasMetric:
    """Represents a bias metric calculation"""
    metric_name: str
    demographic_group: str
    value: float
    confidence_interval: Tuple[float, float]
    sample_size: int
    timestamp: datetime
    model_version: str

@dataclass
class FairnessReport:
    """Represents a fairness analysis report"""
    report_id: str
    analysis_date: datetime
    model_version: str
    demographic_groups: List[str]
    bias_metrics: List[BiasMetric]
    fairness_score: float
    recommendations: List[str]
    status: str  # "pass", "warning", "fail"

class BiasFairnessDashboardService:
    """
    AI Bias & Fairness Dashboard Service
    Tracks disparities across race, age, gender in AI outputs
    """
    
    def __init__(self):
        self.model_version = "v1.1.0"
        self.fairness_threshold = 0.8  # Minimum fairness score
        self.bias_threshold = 0.1  # Maximum acceptable bias
        
        # Demographic categories
        self.demographic_categories = {
            "race": ["White", "Black", "Hispanic", "Asian", "Other"],
            "age": ["18-30", "31-50", "51-70", "70+"],
            "gender": ["Male", "Female", "Other"],
            "socioeconomic": ["Low", "Medium", "High"]
        }
        
        # Bias metrics to track
        self.bias_metrics = [
            "demographic_parity",
            "equalized_odds",
            "equal_opportunity",
            "statistical_parity",
            "calibration"
        ]
        
        logger.info("BiasFairnessDashboardService initialized")
    
    async def analyze_model_bias(
        self,
        predictions: List[Dict[str, Any]],
        ground_truth: List[Any],
        demographics: List[Dict[str, Any]],
        model_version: str = None
    ) -> FairnessReport:
        """
        Analyze bias in model predictions across demographic groups
        """
        try:
            if model_version is None:
                model_version = self.model_version
            
            # Convert to DataFrame for analysis
            df = pd.DataFrame({
                'prediction': [p.get('prediction', p.get('diagnosis', '')) for p in predictions],
                'confidence': [p.get('confidence', 0.0) for p in predictions],
                'ground_truth': ground_truth,
                'race': [d.get('race', 'Unknown') for d in demographics],
                'age': [d.get('age', 0) for d in demographics],
                'gender': [d.get('gender', 'Unknown') for d in demographics],
                'socioeconomic': [d.get('socioeconomic', 'Unknown') for d in demographics]
            })
            
            # Calculate bias metrics for each demographic category
            bias_metrics = []
            
            # Race-based bias analysis
            race_metrics = await self._analyze_demographic_bias(df, 'race', model_version)
            bias_metrics.extend(race_metrics)
            
            # Age-based bias analysis
            age_metrics = await self._analyze_age_bias(df, model_version)
            bias_metrics.extend(age_metrics)
            
            # Gender-based bias analysis
            gender_metrics = await self._analyze_demographic_bias(df, 'gender', model_version)
            bias_metrics.extend(gender_metrics)
            
            # Socioeconomic bias analysis
            socioeconomic_metrics = await self._analyze_demographic_bias(df, 'socioeconomic', model_version)
            bias_metrics.extend(socioeconomic_metrics)
            
            # Calculate overall fairness score
            fairness_score = await self._calculate_fairness_score(bias_metrics)
            
            # Generate recommendations
            recommendations = await self._generate_bias_recommendations(bias_metrics, fairness_score)
            
            # Determine status
            status = self._determine_fairness_status(fairness_score, bias_metrics)
            
            report = FairnessReport(
                report_id=f"bias_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
                analysis_date=datetime.now(),
                model_version=model_version,
                demographic_groups=list(self.demographic_categories.keys()),
                bias_metrics=bias_metrics,
                fairness_score=fairness_score,
                recommendations=recommendations,
                status=status
            )
            
            return report
            
        except Exception as e:
            logger.error(f"Error analyzing model bias: {e}")
            raise
    
    async def _analyze_demographic_bias(
        self,
        df: pd.DataFrame,
        demographic_col: str,
        model_version: str
    ) -> List[BiasMetric]:
        """Analyze bias for a specific demographic category"""
        metrics = []
        
        try:
            # Get unique values for the demographic category
            unique_values = df[demographic_col].unique()
            
            for value in unique_values:
                if value == 'Unknown' or pd.isna(value):
                    continue
                
                # Filter data for this demographic group
                group_data = df[df[demographic_col] == value]
                
                if len(group_data) < 10:  # Minimum sample size
                    continue
                
                # Calculate various bias metrics
                demographic_parity = await self._calculate_demographic_parity(df, group_data)
                equalized_odds = await self._calculate_equalized_odds(df, group_data)
                equal_opportunity = await self._calculate_equal_opportunity(df, group_data)
                statistical_parity = await self._calculate_statistical_parity(df, group_data)
                calibration = await self._calculate_calibration(df, group_data)
                
                # Create metrics
                metrics.extend([
                    BiasMetric(
                        metric_name="demographic_parity",
                        demographic_group=f"{demographic_col}_{value}",
                        value=demographic_parity,
                        confidence_interval=self._calculate_confidence_interval(demographic_parity, len(group_data)),
                        sample_size=len(group_data),
                        timestamp=datetime.now(),
                        model_version=model_version
                    ),
                    BiasMetric(
                        metric_name="equalized_odds",
                        demographic_group=f"{demographic_col}_{value}",
                        value=equalized_odds,
                        confidence_interval=self._calculate_confidence_interval(equalized_odds, len(group_data)),
                        sample_size=len(group_data),
                        timestamp=datetime.now(),
                        model_version=model_version
                    ),
                    BiasMetric(
                        metric_name="equal_opportunity",
                        demographic_group=f"{demographic_col}_{value}",
                        value=equal_opportunity,
                        confidence_interval=self._calculate_confidence_interval(equal_opportunity, len(group_data)),
                        sample_size=len(group_data),
                        timestamp=datetime.now(),
                        model_version=model_version
                    ),
                    BiasMetric(
                        metric_name="statistical_parity",
                        demographic_group=f"{demographic_col}_{value}",
                        value=statistical_parity,
                        confidence_interval=self._calculate_confidence_interval(statistical_parity, len(group_data)),
                        sample_size=len(group_data),
                        timestamp=datetime.now(),
                        model_version=model_version
                    ),
                    BiasMetric(
                        metric_name="calibration",
                        demographic_group=f"{demographic_col}_{value}",
                        value=calibration,
                        confidence_interval=self._calculate_confidence_interval(calibration, len(group_data)),
                        sample_size=len(group_data),
                        timestamp=datetime.now(),
                        model_version=model_version
                    )
                ])
            
            return metrics
            
        except Exception as e:
            logger.error(f"Error analyzing {demographic_col} bias: {e}")
            return []
    
    async def _analyze_age_bias(self, df: pd.DataFrame, model_version: str) -> List[BiasMetric]:
        """Analyze age-based bias with age groups"""
        metrics = []
        
        try:
            # Create age groups
            df['age_group'] = pd.cut(
                df['age'],
                bins=[0, 30, 50, 70, 120],
                labels=['18-30', '31-50', '51-70', '70+'],
                include_lowest=True
            )
            
            # Analyze each age group
            for age_group in df['age_group'].unique():
                if pd.isna(age_group):
                    continue
                
                group_data = df[df['age_group'] == age_group]
                
                if len(group_data) < 10:
                    continue
                
                # Calculate bias metrics for age group
                demographic_parity = await self._calculate_demographic_parity(df, group_data)
                equalized_odds = await self._calculate_equalized_odds(df, group_data)
                equal_opportunity = await self._calculate_equal_opportunity(df, group_data)
                statistical_parity = await self._calculate_statistical_parity(df, group_data)
                calibration = await self._calculate_calibration(df, group_data)
                
                # Create metrics
                metrics.extend([
                    BiasMetric(
                        metric_name="demographic_parity",
                        demographic_group=f"age_{age_group}",
                        value=demographic_parity,
                        confidence_interval=self._calculate_confidence_interval(demographic_parity, len(group_data)),
                        sample_size=len(group_data),
                        timestamp=datetime.now(),
                        model_version=model_version
                    ),
                    BiasMetric(
                        metric_name="equalized_odds",
                        demographic_group=f"age_{age_group}",
                        value=equalized_odds,
                        confidence_interval=self._calculate_confidence_interval(equalized_odds, len(group_data)),
                        sample_size=len(group_data),
                        timestamp=datetime.now(),
                        model_version=model_version
                    ),
                    BiasMetric(
                        metric_name="equal_opportunity",
                        demographic_group=f"age_{age_group}",
                        value=equal_opportunity,
                        confidence_interval=self._calculate_confidence_interval(equal_opportunity, len(group_data)),
                        sample_size=len(group_data),
                        timestamp=datetime.now(),
                        model_version=model_version
                    ),
                    BiasMetric(
                        metric_name="statistical_parity",
                        demographic_group=f"age_{age_group}",
                        value=statistical_parity,
                        confidence_interval=self._calculate_confidence_interval(statistical_parity, len(group_data)),
                        sample_size=len(group_data),
                        timestamp=datetime.now(),
                        model_version=model_version
                    ),
                    BiasMetric(
                        metric_name="calibration",
                        demographic_group=f"age_{age_group}",
                        value=calibration,
                        confidence_interval=self._calculate_confidence_interval(calibration, len(group_data)),
                        sample_size=len(group_data),
                        timestamp=datetime.now(),
                        model_version=model_version
                    )
                ])
            
            return metrics
            
        except Exception as e:
            logger.error(f"Error analyzing age bias: {e}")
            return []
    
    async def _calculate_demographic_parity(self, full_df: pd.DataFrame, group_df: pd.DataFrame) -> float:
        """Calculate demographic parity (statistical parity)"""
        try:
            # Overall positive prediction rate
            overall_positive_rate = (full_df['prediction'] == 1).mean()
            
            # Group positive prediction rate
            group_positive_rate = (group_df['prediction'] == 1).mean()
            
            # Demographic parity difference
            parity_diff = abs(group_positive_rate - overall_positive_rate)
            
            return 1 - parity_diff  # Higher is better
            
        except Exception as e:
            logger.error(f"Error calculating demographic parity: {e}")
            return 0.5
    
    async def _calculate_equalized_odds(self, full_df: pd.DataFrame, group_df: pd.DataFrame) -> float:
        """Calculate equalized odds"""
        try:
            # Calculate TPR and FPR for full dataset
            full_tpr = self._calculate_tpr(full_df)
            full_fpr = self._calculate_fpr(full_df)
            
            # Calculate TPR and FPR for group
            group_tpr = self._calculate_tpr(group_df)
            group_fpr = self._calculate_fpr(group_df)
            
            # Equalized odds difference
            tpr_diff = abs(group_tpr - full_tpr)
            fpr_diff = abs(group_fpr - full_fpr)
            
            # Average difference
            avg_diff = (tpr_diff + fpr_diff) / 2
            
            return 1 - avg_diff  # Higher is better
            
        except Exception as e:
            logger.error(f"Error calculating equalized odds: {e}")
            return 0.5
    
    async def _calculate_equal_opportunity(self, full_df: pd.DataFrame, group_df: pd.DataFrame) -> float:
        """Calculate equal opportunity (TPR parity)"""
        try:
            # Calculate TPR for full dataset
            full_tpr = self._calculate_tpr(full_df)
            
            # Calculate TPR for group
            group_tpr = self._calculate_tpr(group_df)
            
            # Equal opportunity difference
            opportunity_diff = abs(group_tpr - full_tpr)
            
            return 1 - opportunity_diff  # Higher is better
            
        except Exception as e:
            logger.error(f"Error calculating equal opportunity: {e}")
            return 0.5
    
    async def _calculate_statistical_parity(self, full_df: pd.DataFrame, group_df: pd.DataFrame) -> float:
        """Calculate statistical parity"""
        try:
            # Overall prediction distribution
            overall_dist = full_df['prediction'].value_counts(normalize=True)
            
            # Group prediction distribution
            group_dist = group_df['prediction'].value_counts(normalize=True)
            
            # Statistical parity difference
            parity_diff = 0
            for pred in overall_dist.index:
                overall_prob = overall_dist.get(pred, 0)
                group_prob = group_dist.get(pred, 0)
                parity_diff += abs(group_prob - overall_prob)
            
            return 1 - (parity_diff / 2)  # Higher is better
            
        except Exception as e:
            logger.error(f"Error calculating statistical parity: {e}")
            return 0.5
    
    async def _calculate_calibration(self, full_df: pd.DataFrame, group_df: pd.DataFrame) -> float:
        """Calculate calibration (reliability)"""
        try:
            # Group predictions by confidence bins
            confidence_bins = pd.cut(full_df['confidence'], bins=10)
            group_confidence_bins = pd.cut(group_df['confidence'], bins=10)
            
            # Calculate calibration error for full dataset
            full_calibration_error = self._calculate_calibration_error(full_df, confidence_bins)
            
            # Calculate calibration error for group
            group_calibration_error = self._calculate_calibration_error(group_df, group_confidence_bins)
            
            # Calibration difference
            calibration_diff = abs(group_calibration_error - full_calibration_error)
            
            return 1 - calibration_diff  # Higher is better
            
        except Exception as e:
            logger.error(f"Error calculating calibration: {e}")
            return 0.5
    
    def _calculate_tpr(self, df: pd.DataFrame) -> float:
        """Calculate True Positive Rate"""
        try:
            if len(df) == 0:
                return 0.0
            
            # Create confusion matrix
            cm = confusion_matrix(df['ground_truth'], df['prediction'])
            
            if cm.shape == (2, 2):
                tn, fp, fn, tp = cm.ravel()
                return tp / (tp + fn) if (tp + fn) > 0 else 0.0
            else:
                return 0.0
                
        except Exception as e:
            logger.error(f"Error calculating TPR: {e}")
            return 0.0
    
    def _calculate_fpr(self, df: pd.DataFrame) -> float:
        """Calculate False Positive Rate"""
        try:
            if len(df) == 0:
                return 0.0
            
            # Create confusion matrix
            cm = confusion_matrix(df['ground_truth'], df['prediction'])
            
            if cm.shape == (2, 2):
                tn, fp, fn, tp = cm.ravel()
                return fp / (fp + tn) if (fp + tn) > 0 else 0.0
            else:
                return 0.0
                
        except Exception as e:
            logger.error(f"Error calculating FPR: {e}")
            return 0.0
    
    def _calculate_calibration_error(self, df: pd.DataFrame, confidence_bins) -> float:
        """Calculate calibration error"""
        try:
            calibration_error = 0
            total_samples = 0
            
            for bin_name in confidence_bins.cat.categories:
                bin_data = df[confidence_bins == bin_name]
                
                if len(bin_data) > 0:
                    # Expected accuracy (confidence)
                    expected_acc = bin_data['confidence'].mean()
                    
                    # Actual accuracy
                    actual_acc = (bin_data['prediction'] == bin_data['ground_truth']).mean()
                    
                    # Calibration error for this bin
                    bin_error = abs(expected_acc - actual_acc) * len(bin_data)
                    calibration_error += bin_error
                    total_samples += len(bin_data)
            
            return calibration_error / total_samples if total_samples > 0 else 0.0
            
        except Exception as e:
            logger.error(f"Error calculating calibration error: {e}")
            return 0.0
    
    def _calculate_confidence_interval(self, value: float, sample_size: int, confidence_level: float = 0.95) -> Tuple[float, float]:
        """Calculate confidence interval for a metric"""
        try:
            if sample_size < 2:
                return (value, value)
            
            # Standard error
            se = np.sqrt(value * (1 - value) / sample_size)
            
            # Z-score for confidence level
            z_score = stats.norm.ppf((1 + confidence_level) / 2)
            
            # Confidence interval
            margin_of_error = z_score * se
            lower_bound = max(0, value - margin_of_error)
            upper_bound = min(1, value + margin_of_error)
            
            return (lower_bound, upper_bound)
            
        except Exception as e:
            logger.error(f"Error calculating confidence interval: {e}")
            return (value, value)
    
    async def _calculate_fairness_score(self, bias_metrics: List[BiasMetric]) -> float:
        """Calculate overall fairness score"""
        try:
            if not bias_metrics:
                return 0.0
            
            # Calculate average metric values
            metric_values = [metric.value for metric in bias_metrics]
            
            # Weight different metrics
            weights = {
                "demographic_parity": 0.25,
                "equalized_odds": 0.25,
                "equal_opportunity": 0.25,
                "statistical_parity": 0.15,
                "calibration": 0.10
            }
            
            weighted_sum = 0
            total_weight = 0
            
            for metric in bias_metrics:
                weight = weights.get(metric.metric_name, 0.1)
                weighted_sum += metric.value * weight
                total_weight += weight
            
            fairness_score = weighted_sum / total_weight if total_weight > 0 else 0.0
            
            return fairness_score
            
        except Exception as e:
            logger.error(f"Error calculating fairness score: {e}")
            return 0.0
    
    async def _generate_bias_recommendations(self, bias_metrics: List[BiasMetric], fairness_score: float) -> List[str]:
        """Generate recommendations based on bias analysis"""
        recommendations = []
        
        try:
            # Overall fairness recommendations
            if fairness_score < 0.6:
                recommendations.append("CRITICAL: Model shows significant bias. Consider retraining with balanced dataset.")
            elif fairness_score < 0.8:
                recommendations.append("WARNING: Model shows moderate bias. Review training data and consider bias mitigation techniques.")
            else:
                recommendations.append("Model shows good fairness across demographic groups.")
            
            # Analyze specific demographic groups
            group_metrics = {}
            for metric in bias_metrics:
                group = metric.demographic_group
                if group not in group_metrics:
                    group_metrics[group] = []
                group_metrics[group].append(metric)
            
            # Identify problematic groups
            for group, metrics in group_metrics.items():
                avg_value = np.mean([m.value for m in metrics])
                if avg_value < 0.7:
                    recommendations.append(f"Address bias in {group} demographic group (avg fairness: {avg_value:.2f})")
            
            # Specific metric recommendations
            metric_analysis = {}
            for metric in bias_metrics:
                if metric.metric_name not in metric_analysis:
                    metric_analysis[metric.metric_name] = []
                metric_analysis[metric.metric_name].append(metric.value)
            
            for metric_name, values in metric_analysis.items():
                avg_value = np.mean(values)
                if avg_value < 0.7:
                    recommendations.append(f"Improve {metric_name.replace('_', ' ')} (avg: {avg_value:.2f})")
            
            # Data collection recommendations
            recommendations.append("Ensure diverse representation in training and validation datasets.")
            recommendations.append("Regularly monitor bias metrics as model evolves.")
            recommendations.append("Consider implementing bias mitigation techniques during training.")
            
            return recommendations
            
        except Exception as e:
            logger.error(f"Error generating bias recommendations: {e}")
            return ["Unable to generate recommendations at this time."]
    
    def _determine_fairness_status(self, fairness_score: float, bias_metrics: List[BiasMetric]) -> str:
        """Determine overall fairness status"""
        try:
            if fairness_score >= 0.8:
                return "pass"
            elif fairness_score >= 0.6:
                return "warning"
            else:
                return "fail"
                
        except Exception as e:
            logger.error(f"Error determining fairness status: {e}")
            return "unknown"
    
    async def generate_bias_dashboard(
        self,
        bias_reports: List[FairnessReport],
        time_range_days: int = 30
    ) -> Dict[str, Any]:
        """Generate bias dashboard with visualizations"""
        try:
            # Filter reports by time range
            cutoff_date = datetime.now() - timedelta(days=time_range_days)
            recent_reports = [r for r in bias_reports if r.analysis_date >= cutoff_date]
            
            if not recent_reports:
                return {"error": "No bias reports found in the specified time range"}
            
            # Create dashboard data
            dashboard_data = {
                "time_range": f"Last {time_range_days} days",
                "total_reports": len(recent_reports),
                "average_fairness_score": np.mean([r.fairness_score for r in recent_reports]),
                "status_distribution": self._get_status_distribution(recent_reports),
                "demographic_analysis": await self._analyze_demographic_trends(recent_reports),
                "metric_analysis": await self._analyze_metric_trends(recent_reports),
                "visualizations": await self._generate_bias_visualizations(recent_reports)
            }
            
            return dashboard_data
            
        except Exception as e:
            logger.error(f"Error generating bias dashboard: {e}")
            raise
    
    def _get_status_distribution(self, reports: List[FairnessReport]) -> Dict[str, int]:
        """Get distribution of fairness statuses"""
        status_counts = {}
        for report in reports:
            status = report.status
            status_counts[status] = status_counts.get(status, 0) + 1
        return status_counts
    
    async def _analyze_demographic_trends(self, reports: List[FairnessReport]) -> Dict[str, Any]:
        """Analyze trends across demographic groups"""
        try:
            demographic_trends = {}
            
            for report in reports:
                for metric in report.bias_metrics:
                    group = metric.demographic_group
                    if group not in demographic_trends:
                        demographic_trends[group] = []
                    demographic_trends[group].append({
                        "date": report.analysis_date,
                        "value": metric.value,
                        "metric": metric.metric_name
                    })
            
            # Calculate trends for each demographic group
            trends = {}
            for group, data in demographic_trends.items():
                if len(data) > 1:
                    values = [d["value"] for d in data]
                    trend_slope = np.polyfit(range(len(values)), values, 1)[0]
                    trends[group] = {
                        "average_value": np.mean(values),
                        "trend_slope": trend_slope,
                        "trend_direction": "improving" if trend_slope > 0 else "worsening" if trend_slope < 0 else "stable"
                    }
            
            return trends
            
        except Exception as e:
            logger.error(f"Error analyzing demographic trends: {e}")
            return {}
    
    async def _analyze_metric_trends(self, reports: List[FairnessReport]) -> Dict[str, Any]:
        """Analyze trends across different bias metrics"""
        try:
            metric_trends = {}
            
            for report in reports:
                for metric in report.bias_metrics:
                    metric_name = metric.metric_name
                    if metric_name not in metric_trends:
                        metric_trends[metric_name] = []
                    metric_trends[metric_name].append({
                        "date": report.analysis_date,
                        "value": metric.value
                    })
            
            # Calculate trends for each metric
            trends = {}
            for metric_name, data in metric_trends.items():
                if len(data) > 1:
                    values = [d["value"] for d in data]
                    trend_slope = np.polyfit(range(len(values)), values, 1)[0]
                    trends[metric_name] = {
                        "average_value": np.mean(values),
                        "trend_slope": trend_slope,
                        "trend_direction": "improving" if trend_slope > 0 else "worsening" if trend_slope < 0 else "stable"
                    }
            
            return trends
            
        except Exception as e:
            logger.error(f"Error analyzing metric trends: {e}")
            return {}
    
    async def _generate_bias_visualizations(self, reports: List[FairnessReport]) -> Dict[str, str]:
        """Generate bias visualization charts"""
        try:
            visualizations = {}
            
            # Fairness score over time
            fairness_chart = await self._create_fairness_trend_chart(reports)
            visualizations["fairness_trend"] = fairness_chart
            
            # Demographic bias heatmap
            demographic_chart = await self._create_demographic_bias_heatmap(reports)
            visualizations["demographic_bias"] = demographic_chart
            
            # Metric comparison chart
            metric_chart = await self._create_metric_comparison_chart(reports)
            visualizations["metric_comparison"] = metric_chart
            
            return visualizations
            
        except Exception as e:
            logger.error(f"Error generating bias visualizations: {e}")
            return {}
    
    async def _create_fairness_trend_chart(self, reports: List[FairnessReport]) -> str:
        """Create fairness score trend chart"""
        try:
            # Sort reports by date
            sorted_reports = sorted(reports, key=lambda x: x.analysis_date)
            
            dates = [r.analysis_date for r in sorted_reports]
            scores = [r.fairness_score for r in sorted_reports]
            
            fig = go.Figure()
            
            fig.add_trace(go.Scatter(
                x=dates,
                y=scores,
                mode='lines+markers',
                name='Fairness Score',
                line=dict(color='blue', width=2),
                marker=dict(size=8, color='blue')
            ))
            
            # Add threshold lines
            fig.add_hline(y=0.8, line_dash="dash", line_color="green", annotation_text="Pass Threshold")
            fig.add_hline(y=0.6, line_dash="dash", line_color="orange", annotation_text="Warning Threshold")
            
            fig.update_layout(
                title="Fairness Score Trend Over Time",
                xaxis_title="Date",
                yaxis_title="Fairness Score",
                yaxis=dict(range=[0, 1]),
                height=400
            )
            
            # Convert to base64
            img_bytes = fig.to_image(format="png")
            img_base64 = base64.b64encode(img_bytes).decode()
            
            return f"data:image/png;base64,{img_base64}"
            
        except Exception as e:
            logger.error(f"Error creating fairness trend chart: {e}")
            return ""
    
    async def _create_demographic_bias_heatmap(self, reports: List[FairnessReport]) -> str:
        """Create demographic bias heatmap"""
        try:
            # Collect data for heatmap
            demographic_data = {}
            
            for report in reports:
                for metric in report.bias_metrics:
                    group = metric.demographic_group
                    if group not in demographic_data:
                        demographic_data[group] = []
                    demographic_data[group].append(metric.value)
            
            # Calculate average values
            heatmap_data = []
            for group, values in demographic_data.items():
                avg_value = np.mean(values)
                heatmap_data.append([group, avg_value])
            
            if not heatmap_data:
                return ""
            
            # Create heatmap
            groups, values = zip(*heatmap_data)
            
            fig = go.Figure(data=go.Heatmap(
                z=[values],
                x=groups,
                y=['Bias Score'],
                colorscale='RdYlGn',
                zmin=0,
                zmax=1
            ))
            
            fig.update_layout(
                title="Demographic Bias Heatmap",
                xaxis_title="Demographic Groups",
                yaxis_title="Bias Metrics",
                height=300
            )
            
            # Convert to base64
            img_bytes = fig.to_image(format="png")
            img_base64 = base64.b64encode(img_bytes).decode()
            
            return f"data:image/png;base64,{img_base64}"
            
        except Exception as e:
            logger.error(f"Error creating demographic bias heatmap: {e}")
            return ""
    
    async def _create_metric_comparison_chart(self, reports: List[FairnessReport]) -> str:
        """Create metric comparison chart"""
        try:
            # Collect metric data
            metric_data = {}
            
            for report in reports:
                for metric in report.bias_metrics:
                    metric_name = metric.metric_name
                    if metric_name not in metric_data:
                        metric_data[metric_name] = []
                    metric_data[metric_name].append(metric.value)
            
            # Calculate average values
            metric_names = []
            avg_values = []
            
            for metric_name, values in metric_data.items():
                metric_names.append(metric_name.replace('_', ' ').title())
                avg_values.append(np.mean(values))
            
            if not metric_names:
                return ""
            
            # Create bar chart
            fig = go.Figure(data=go.Bar(
                x=metric_names,
                y=avg_values,
                marker_color='lightblue'
            ))
            
            fig.update_layout(
                title="Average Bias Metrics Comparison",
                xaxis_title="Bias Metrics",
                yaxis_title="Average Score",
                yaxis=dict(range=[0, 1]),
                height=400
            )
            
            # Convert to base64
            img_bytes = fig.to_image(format="png")
            img_base64 = base64.b64encode(img_bytes).decode()
            
            return f"data:image/png;base64,{img_base64}"
            
        except Exception as e:
            logger.error(f"Error creating metric comparison chart: {e}")
            return ""
    
    async def get_model_status(self) -> Dict[str, Any]:
        """Get status of the bias fairness dashboard"""
        return {
            "model_version": self.model_version,
            "fairness_threshold": self.fairness_threshold,
            "bias_threshold": self.bias_threshold,
            "demographic_categories": self.demographic_categories,
            "bias_metrics": self.bias_metrics,
            "last_updated": datetime.now().isoformat()
        } 