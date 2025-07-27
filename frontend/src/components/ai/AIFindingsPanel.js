import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Edit as EditIcon,
  Warning as WarningIcon,
  Info as InfoIcon
} from '@mui/icons-material';

const AIFindingsPanel = ({ analysisData, onFeedback }) => {
  const [feedbackDialog, setFeedbackDialog] = useState(false);
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [feedbackType, setFeedbackType] = useState('');
  const [feedbackComments, setFeedbackComments] = useState('');
  const [modifiedDiagnosis, setModifiedDiagnosis] = useState('');

  const handleFeedback = (analysisId, type) => {
    setSelectedAnalysis(analysisId);
    setFeedbackType(type);
    setFeedbackDialog(true);
  };

  const submitFeedback = () => {
    if (onFeedback) {
      onFeedback({
        analysis_id: selectedAnalysis,
        feedback_type: feedbackType,
        comments: feedbackComments,
        modified_diagnosis: modifiedDiagnosis
      });
    }
    setFeedbackDialog(false);
    setFeedbackComments('');
    setModifiedDiagnosis('');
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8) return 'success';
    if (confidence >= 0.6) return 'warning';
    return 'error';
  };

  const renderScanAnalysis = (scanData) => {
    if (!scanData) return null;

    return (
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            <InfoIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Scan Analysis Results
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="textSecondary">
                Overall Confidence
              </Typography>
              <Chip
                label={`${(scanData.overall_confidence * 100).toFixed(1)}%`}
                color={getConfidenceColor(scanData.overall_confidence)}
                sx={{ mb: 1 }}
              />
              
              <Typography variant="subtitle2" color="textSecondary">
                Image Quality
              </Typography>
              <Chip
                label={scanData.image_quality}
                color={scanData.image_quality === 'excellent' ? 'success' : 'default'}
                sx={{ mb: 1 }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="textSecondary">
                Processing Time
              </Typography>
              <Typography variant="body2">
                {scanData.processing_time.toFixed(2)}s
              </Typography>
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle1" gutterBottom>
            Detected Conditions
          </Typography>
          
          {scanData.conditions?.map((condition, index) => (
            <Box key={index} sx={{ mb: 2, p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
              <Grid container alignItems="center" spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2">
                    {condition.name}
                  </Typography>
                  <Chip
                    label={`${(condition.confidence * 100).toFixed(1)}% confidence`}
                    color={getConfidenceColor(condition.confidence)}
                    size="small"
                    sx={{ mr: 1 }}
                  />
                  <Chip
                    label={condition.severity}
                    color={getSeverityColor(condition.severity)}
                    size="small"
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  {condition.recommendations?.length > 0 && (
                    <Typography variant="body2" color="textSecondary">
                      <strong>Recommendations:</strong>
                    </Typography>
                  )}
                  {condition.recommendations?.map((rec, recIndex) => (
                    <Typography key={recIndex} variant="body2" color="textSecondary">
                      • {rec}
                    </Typography>
                  ))}
                </Grid>
              </Grid>
            </Box>
          ))}
        </CardContent>
      </Card>
    );
  };

  const renderBloodworkAnalysis = (bloodworkData) => {
    if (!bloodworkData) return null;

    return (
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            <InfoIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Bloodwork Analysis Results
          </Typography>
          
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle2" color="textSecondary">
                Urgency Level
              </Typography>
              <Chip
                label={bloodworkData.urgency_level}
                color={getSeverityColor(bloodworkData.urgency_level)}
                sx={{ mb: 1 }}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle2" color="textSecondary">
                Abnormal Values
              </Typography>
              <Typography variant="body2">
                {bloodworkData.abnormalities?.length || 0} found
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle2" color="textSecondary">
                Processing Time
              </Typography>
              <Typography variant="body2">
                {bloodworkData.processing_time.toFixed(2)}s
              </Typography>
            </Grid>
          </Grid>

          {bloodworkData.abnormalities?.length > 0 && (
            <>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" gutterBottom>
                Abnormalities
              </Typography>
              <List dense>
                {bloodworkData.abnormalities.map((abnormality, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={abnormality}
                      secondary={
                        <Chip
                          label="Requires attention"
                          color="warning"
                          size="small"
                        />
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </>
          )}

          {bloodworkData.recommendations?.length > 0 && (
            <>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" gutterBottom>
                Recommendations
              </Typography>
              <List dense>
                {bloodworkData.recommendations.map((rec, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={rec} />
                  </ListItem>
                ))}
              </List>
            </>
          )}

          {bloodworkData.suggested_tests?.length > 0 && (
            <>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" gutterBottom>
                Suggested Additional Tests
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {bloodworkData.suggested_tests.map((test, index) => (
                  <Chip key={index} label={test} variant="outlined" size="small" />
                ))}
              </Box>
            </>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderRecoveryPrediction = (predictionData) => {
    if (!predictionData) return null;

    return (
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            <InfoIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Recovery Prediction
          </Typography>
          
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle2" color="textSecondary">
                Estimated Recovery Time
              </Typography>
              <Typography variant="h4" color="primary">
                {predictionData.estimated_recovery_days} days
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Range: {predictionData.confidence_interval.lower} - {predictionData.confidence_interval.upper} days
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle2" color="textSecondary">
                Complication Risk
              </Typography>
              <Typography variant="h4" color={predictionData.complication_risk > 0.5 ? 'error' : 'success'}>
                {(predictionData.complication_risk * 100).toFixed(1)}%
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle2" color="textSecondary">
                Risk Factors
              </Typography>
              <Typography variant="body2">
                {predictionData.risk_factors?.length || 0} identified
              </Typography>
            </Grid>
          </Grid>

          {predictionData.risk_factors?.length > 0 && (
            <>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" gutterBottom>
                Risk Factors
              </Typography>
              <List dense>
                {predictionData.risk_factors.map((factor, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={factor} />
                  </ListItem>
                ))}
              </List>
            </>
          )}

          {predictionData.recommendations?.length > 0 && (
            <>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" gutterBottom>
                Recommendations
              </Typography>
              <List dense>
                {predictionData.recommendations.map((rec, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={rec} />
                  </ListItem>
                ))}
              </List>
            </>
          )}

          {predictionData.follow_up_schedule && (
            <>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" gutterBottom>
                Follow-up Schedule
              </Typography>
              <Grid container spacing={2}>
                {Object.entries(predictionData.follow_up_schedule).map(([period, schedule]) => (
                  <Grid item xs={12} md={6} key={period}>
                    <Typography variant="subtitle2" color="textSecondary">
                      {period}
                    </Typography>
                    <Typography variant="body2">
                      {schedule}
                    </Typography>
                  </Grid>
                ))}
              </Grid>
            </>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        AI Analysis Findings
      </Typography>

      {analysisData?.scan_analysis && renderScanAnalysis(analysisData.scan_analysis)}
      {analysisData?.bloodwork_analysis && renderBloodworkAnalysis(analysisData.bloodwork_analysis)}
      {analysisData?.recovery_prediction && renderRecoveryPrediction(analysisData.recovery_prediction)}

      {analysisData && (
        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            color="success"
            startIcon={<CheckCircleIcon />}
            onClick={() => handleFeedback(analysisData.analysis_id, 'approve')}
          >
            Approve AI Findings
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<CancelIcon />}
            onClick={() => handleFeedback(analysisData.analysis_id, 'reject')}
          >
            Reject Findings
          </Button>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<EditIcon />}
            onClick={() => handleFeedback(analysisData.analysis_id, 'modify')}
          >
            Modify Diagnosis
          </Button>
        </Box>
      )}

      {/* Feedback Dialog */}
      <Dialog open={feedbackDialog} onClose={() => setFeedbackDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Submit Feedback
          <Typography variant="subtitle2" color="textSecondary">
            {feedbackType === 'approve' && 'Approve AI findings'}
            {feedbackType === 'reject' && 'Reject AI findings'}
            {feedbackType === 'modify' && 'Modify AI diagnosis'}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Comments (Optional)
            </Typography>
            <textarea
              value={feedbackComments}
              onChange={(e) => setFeedbackComments(e.target.value)}
              style={{
                width: '100%',
                minHeight: '100px',
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                resize: 'vertical'
              }}
              placeholder="Add any comments about the AI analysis..."
            />
            
            {feedbackType === 'modify' && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Modified Diagnosis
                </Typography>
                <textarea
                  value={modifiedDiagnosis}
                  onChange={(e) => setModifiedDiagnosis(e.target.value)}
                  style={{
                    width: '100%',
                    minHeight: '80px',
                    padding: '8px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    resize: 'vertical'
                  }}
                  placeholder="Enter your modified diagnosis..."
                />
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFeedbackDialog(false)}>
            Cancel
          </Button>
          <Button onClick={submitFeedback} variant="contained">
            Submit Feedback
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AIFindingsPanel; 