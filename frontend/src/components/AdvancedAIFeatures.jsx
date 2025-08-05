import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Grid,
  CircularProgress,
  Alert,
  Chip,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Divider,
  Paper,
  IconButton,
  Tooltip,
  Container,
  ListItemIcon
} from '@mui/material';
import {
  Mic,
  MicOff,
  Analytics,
  Psychology,
  TrendingUp,
  Security,
  Assessment,
  Timeline,
  Warning,
  CheckCircle,
  Error,
  ArrowForward
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import aiService from '../services/aiService';

const AdvancedAIFeatures = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [voiceAnalysis, setVoiceAnalysis] = useState(null);
  const [predictiveAnalytics, setPredictiveAnalytics] = useState(null);
  const [clinicalDecision, setClinicalDecision] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [explanationResult, setExplanationResult] = useState(null);
  const [modelInfo, setModelInfo] = useState(null);
  const [isExplaining, setIsExplaining] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Voice Emotion Analysis
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setAudioBlob(audioBlob);
        await analyzeVoiceEmotion(audioBlob);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      setError('Error accessing microphone: ' + err.message);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const analyzeVoiceEmotion = async (audioBlob) => {
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('audio_file', audioBlob, 'voice_recording.wav');
      formData.append('patient_id', 'demo_patient_123');
      formData.append('context', 'Routine check-in call');

      const response = await fetch('/api/ai/voice-emotion', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to analyze voice emotion');
      }

      const result = await response.json();
      setVoiceAnalysis(result);
    } catch (err) {
      setError('Error analyzing voice emotion: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Predictive Analytics
  const runPredictiveAnalytics = async () => {
    setLoading(true);
    setError(null);

    try {
      const patientData = {
        age: 65,
        gender: 'male',
        comorbidities: ['diabetes', 'hypertension'],
        medications: ['metformin', 'lisinopril'],
        lab_abnormalities: ['elevated_creatinine'],
        symptom_severity: 7,
        condition_duration_days: 180,
        previous_exacerbations: 2
      };

      const formData = new FormData();
      formData.append('patient_data', JSON.stringify(patientData));
      formData.append('condition', 'heart_failure');
      formData.append('time_horizon_days', '365');

      const response = await fetch('/api/ai/predict-progression', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to run predictive analytics');
      }

      const result = await response.json();
      setPredictiveAnalytics(result);
    } catch (err) {
      setError('Error running predictive analytics: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Clinical Decision Support
  const runClinicalDecisionSupport = async () => {
    setLoading(true);
    setError(null);

    try {
      const patientData = {
        age: 45,
        gender: 'female',
        comorbidities: ['asthma'],
        medications: ['albuterol']
      };

      const symptoms = ['chest pain', 'shortness of breath', 'cough'];
      const labResults = {
        'troponin': { value: 0.5, unit: 'ng/mL', status: 'normal' },
        'creatinine': { value: 1.2, unit: 'mg/dL', status: 'normal' }
      };

      const formData = new FormData();
      formData.append('patient_data', JSON.stringify(patientData));
      formData.append('symptoms', JSON.stringify(symptoms));
      formData.append('lab_results', JSON.stringify(labResults));

      const response = await fetch('/api/ai/clinical-decision-support', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to run clinical decision support');
      }

      const result = await response.json();
      setClinicalDecision(result);
    } catch (err) {
      setError('Error running clinical decision support: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // AI Model Explainability
  const handleExplainDiagnosis = async () => {
    setIsExplaining(true);
    try {
      // Example patient data for demonstration
      const patientData = {
        age: 35,
        gender: 1,
        temperature: 101.2,
        blood_pressure_systolic: 130,
        blood_pressure_diastolic: 85,
        heart_rate: 88,
        respiratory_rate: 18,
        oxygen_saturation: 97,
        pain_level: 6,
        fatigue_level: 7,
        cough_present: 1,
        fever_present: 1,
        shortness_of_breath: 0,
        chest_pain: 0,
        headache: 1,
        nausea: 0,
        diarrhea: 0,
        loss_of_appetite: 1,
        muscle_aches: 1,
        sore_throat: 0
      };
      
      const result = await aiService.explainDiagnosis(patientData, 'lime');
      setExplanationResult(result);
    } catch (error) {
      console.error('Error explaining diagnosis:', error);
    } finally {
      setIsExplaining(false);
    }
  };
  
  const loadModelInfo = async () => {
    try {
      const info = await aiService.getModelInfo();
      setModelInfo(info);
    } catch (error) {
      console.error('Error loading model info:', error);
    }
  };
  
  useEffect(() => {
    loadModelInfo();
  }, []);

  const getEmotionColor = (emotion) => {
    const colors = {
      'happy': '#4caf50',
      'sad': '#2196f3',
      'angry': '#f44336',
      'anxious': '#ff9800',
      'neutral': '#9e9e9e'
    };
    return colors[emotion] || '#9e9e9e';
  };

  const getSeverityColor = (level) => {
    if (level > 0.7) return '#f44336';
    if (level > 0.4) return '#ff9800';
    return '#4caf50';
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Advanced AI Features
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Voice Emotion Analysis */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Psychology color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Voice Emotion Analysis</Typography>
              </Box>

              <Typography variant="body2" color="text.secondary" mb={2}>
                Analyze voice for stress, pain, and mental health indicators
              </Typography>

              <Box display="flex" gap={2} mb={2}>
                <Button
                  variant="contained"
                  startIcon={isRecording ? <MicOff /> : <Mic />}
                  onClick={isRecording ? stopRecording : startRecording}
                  color={isRecording ? 'error' : 'primary'}
                  disabled={loading}
                >
                  {isRecording ? 'Stop Recording' : 'Start Recording'}
                </Button>
              </Box>

              {loading && (
                <Box display="flex" alignItems="center" gap={1}>
                  <CircularProgress size={20} />
                  <Typography variant="body2">Analyzing voice...</Typography>
                </Box>
              )}

              {voiceAnalysis && (
                <Box mt={2}>
                  <Typography variant="h6" gutterBottom>
                    Analysis Results
                  </Typography>

                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Box textAlign="center">
                        <Typography variant="body2" color="text.secondary">
                          Primary Emotion
                        </Typography>
                        <Chip
                          label={voiceAnalysis.emotion}
                          sx={{
                            backgroundColor: getEmotionColor(voiceAnalysis.emotion),
                            color: 'white',
                            mt: 1
                          }}
                        />
                        <Typography variant="caption" display="block" mt={1}>
                          Confidence: {(voiceAnalysis.confidence * 100).toFixed(1)}%
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid item xs={6}>
                      <Box>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Stress Level
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={voiceAnalysis.stress_level * 100}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: '#e0e0e0',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: getSeverityColor(voiceAnalysis.stress_level)
                            }
                          }}
                        />
                        <Typography variant="caption" display="block" mt={1}>
                          {(voiceAnalysis.stress_level * 100).toFixed(1)}%
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid item xs={6}>
                      <Box>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Pain Indicator
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={voiceAnalysis.pain_indicator * 100}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: '#e0e0e0',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: getSeverityColor(voiceAnalysis.pain_indicator)
                            }
                          }}
                        />
                        <Typography variant="caption" display="block" mt={1}>
                          {(voiceAnalysis.pain_indicator * 100).toFixed(1)}%
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid item xs={6}>
                      <Box>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Mental Health Risk
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={voiceAnalysis.mental_health_risk * 100}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: '#e0e0e0',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: getSeverityColor(voiceAnalysis.mental_health_risk)
                            }
                          }}
                        />
                        <Typography variant="caption" display="block" mt={1}>
                          {(voiceAnalysis.mental_health_risk * 100).toFixed(1)}%
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Predictive Analytics */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Analytics color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Predictive Analytics</Typography>
              </Box>

              <Typography variant="body2" color="text.secondary" mb={2}>
                Predict disease progression and outcomes
              </Typography>

              <Button
                variant="contained"
                onClick={runPredictiveAnalytics}
                disabled={loading}
                sx={{ mb: 2 }}
              >
                Run Predictive Analysis
              </Button>

              {loading && (
                <Box display="flex" alignItems="center" gap={1}>
                  <CircularProgress size={20} />
                  <Typography variant="body2">Running analysis...</Typography>
                </Box>
              )}

              {predictiveAnalytics && (
                <Box mt={2}>
                  <Typography variant="h6" gutterBottom>
                    Prediction Results
                  </Typography>

                  <Box mb={2}>
                    <Typography variant="body2" color="text.secondary">
                      Progression Score
                    </Typography>
                    <Typography variant="h4" color="primary">
                      {(predictiveAnalytics.predicted_value * 100).toFixed(1)}%
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Confidence: {(predictiveAnalytics.confidence * 100).toFixed(1)}%
                    </Typography>
                  </Box>

                  <Box mb={2}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Risk Factors
                    </Typography>
                    <Box display="flex" flexWrap="wrap" gap={1}>
                      {predictiveAnalytics.risk_factors.map((factor, index) => (
                        <Chip
                          key={index}
                          label={factor}
                          size="small"
                          color="warning"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </Box>

                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Recommendations
                    </Typography>
                    <List dense>
                      {predictiveAnalytics.recommendations.map((rec, index) => (
                        <ListItem key={index} sx={{ py: 0.5 }}>
                          <ListItemText
                            primary={rec}
                            primaryTypographyProps={{ variant: 'body2' }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Clinical Decision Support */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Assessment color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Clinical Decision Support</Typography>
              </Box>

              <Typography variant="body2" color="text.secondary" mb={2}>
                Advanced clinical decision support with evidence-based recommendations
              </Typography>

              <Button
                variant="contained"
                onClick={runClinicalDecisionSupport}
                disabled={loading}
                sx={{ mb: 2 }}
              >
                Run Clinical Analysis
              </Button>

              {loading && (
                <Box display="flex" alignItems="center" gap={1}>
                  <CircularProgress size={20} />
                  <Typography variant="body2">Running clinical analysis...</Typography>
                </Box>
              )}

              {clinicalDecision && (
                <Box mt={2}>
                  <Typography variant="h6" gutterBottom>
                    Clinical Analysis Results
                  </Typography>

                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Paper sx={{ p: 2 }}>
                        <Typography variant="subtitle1" gutterBottom>
                          Primary Diagnosis
                        </Typography>
                        <Typography variant="h6" color="primary" gutterBottom>
                          {clinicalDecision.primary_diagnosis}
                        </Typography>

                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Evidence Level: {clinicalDecision.evidence_level}
                        </Typography>

                        <Box mt={2}>
                          <Typography variant="subtitle2" gutterBottom>
                            Risk Assessment
                          </Typography>
                          <Chip
                            label={clinicalDecision.risk_assessment.overall_risk}
                            color={
                              clinicalDecision.risk_assessment.overall_risk === 'high'
                                ? 'error'
                                : clinicalDecision.risk_assessment.overall_risk === 'medium'
                                ? 'warning'
                                : 'success'
                            }
                            sx={{ mr: 1 }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            Score: {(clinicalDecision.risk_assessment.risk_score * 100).toFixed(1)}%
                          </Typography>
                        </Box>
                      </Paper>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Paper sx={{ p: 2 }}>
                        <Typography variant="subtitle1" gutterBottom>
                          Treatment Recommendations
                        </Typography>
                        <List dense>
                          {clinicalDecision.treatment_recommendations.map((treatment, index) => (
                            <ListItem key={index} sx={{ py: 0.5 }}>
                              <ListItemText
                                primary={treatment.treatment}
                                secondary={`Evidence Level: ${treatment.evidence_level}`}
                                primaryTypographyProps={{ variant: 'body2' }}
                                secondaryTypographyProps={{ variant: 'caption' }}
                              />
                            </ListItem>
                          ))}
                        </List>
                      </Paper>
                    </Grid>

                    <Grid item xs={12}>
                      <Paper sx={{ p: 2 }}>
                        <Typography variant="subtitle1" gutterBottom>
                          Clinical Guidelines
                        </Typography>
                        <List dense>
                          {clinicalDecision.clinical_guidelines.map((guideline, index) => (
                            <ListItem key={index} sx={{ py: 0.5 }}>
                              <ListItemText
                                primary={guideline}
                                primaryTypographyProps={{ variant: 'body2' }}
                              />
                            </ListItem>
                          ))}
                        </List>
                      </Paper>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* AI Model Explainability Section */}
        <Grid item xs={12}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                🤖 AI Model Explainability
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Understand how AI arrives at diagnostic decisions with LIME/SHAP explanations
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Button
                  variant="contained"
                  onClick={handleExplainDiagnosis}
                  disabled={isExplaining}
                  startIcon={isExplaining ? <CircularProgress size={20} /> : <Psychology />}
                >
                  {isExplaining ? 'Explaining...' : 'Explain Diagnosis'}
                </Button>
              </Box>
              
              {modelInfo && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Model Information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2">
                        <strong>Model Type:</strong> {modelInfo.model_type}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Features:</strong> {modelInfo.feature_count}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2">
                        <strong>Classes:</strong> {modelInfo.class_count}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Classes:</strong> {modelInfo.classes.join(', ')}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              )}
              
              {explanationResult && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Diagnosis Explanation
                  </Typography>
                  
                  <Alert severity="info" sx={{ mb: 2 }}>
                    <Typography variant="body1">
                      {explanationResult.plain_language_explanation}
                    </Typography>
                  </Alert>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle1" gutterBottom>
                        Confidence: {(explanationResult.confidence_score * 100).toFixed(1)}%
                      </Typography>
                      
                      <Typography variant="subtitle2" gutterBottom>
                        Risk Factors:
                      </Typography>
                      <List dense>
                        {explanationResult.risk_factors.map((factor, index) => (
                          <ListItem key={index}>
                            <ListItemIcon>
                              <Warning color="warning" />
                            </ListItemIcon>
                            <ListItemText primary={factor} />
                          </ListItem>
                        ))}
                      </List>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" gutterBottom>
                        Recommendations:
                      </Typography>
                      <List dense>
                        {explanationResult.recommendations.map((rec, index) => (
                          <ListItem key={index}>
                            <ListItemIcon>
                              <CheckCircle color="success" />
                            </ListItemIcon>
                            <ListItemText primary={rec} />
                          </ListItem>
                        ))}
                      </List>
                    </Grid>
                  </Grid>
                  
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Decision Path:
                    </Typography>
                    <List dense>
                      {explanationResult.decision_path.map((step, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <ArrowForward color="primary" />
                          </ListItemIcon>
                          <ListItemText primary={step} />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdvancedAIFeatures; 