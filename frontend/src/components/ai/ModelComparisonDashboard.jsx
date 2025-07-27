import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Chip,
  LinearProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider
} from '@mui/material';
import {
  Compare as CompareIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  ExpandMore as ExpandMoreIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Psychology as PsychologyIcon,
  Assessment as AssessmentIcon,
  Feedback as FeedbackIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { aiService } from '../../services/aiService';

const ModelComparisonDashboard = () => {
  const { user } = useAuth();
  const [availableModels, setAvailableModels] = useState([]);
  const [comparisonHistory, setComparisonHistory] = useState([]);
  const [comparisonDialog, setComparisonDialog] = useState(false);
  const [feedbackDialog, setFeedbackDialog] = useState(false);
  const [selectedComparison, setSelectedComparison] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Comparison form state
  const [comparisonForm, setComparisonForm] = useState({
    symptoms: '',
    patientInfo: {
      age: '',
      gender: '',
      medicalHistory: ''
    },
    vitals: {
      temperature: '',
      bloodPressureSystolic: '',
      bloodPressureDiastolic: '',
      heartRate: '',
      respiratoryRate: ''
    },
    selectedModels: []
  });

  // Doctor feedback form state
  const [feedbackForm, setFeedbackForm] = useState({
    doctorDiagnosis: '',
    confidenceLevel: 0.8,
    reasoning: '',
    treatmentPlan: ''
  });

  useEffect(() => {
    loadAvailableModels();
    loadComparisonHistory();
  }, []);

  const loadAvailableModels = async () => {
    try {
      const response = await aiService.getAvailableModels();
      setAvailableModels(response.data || []);
    } catch (err) {
      console.error('Failed to load available models:', err);
    }
  };

  const loadComparisonHistory = async () => {
    try {
      const response = await aiService.getComparisonHistory();
      setComparisonHistory(response.data || []);
    } catch (err) {
      console.error('Failed to load comparison history:', err);
    }
  };

  const handleComparisonSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      const inputData = {
        symptoms: comparisonForm.symptoms.split(',').map(s => s.trim()),
        patient_info: comparisonForm.patientInfo,
        vitals: comparisonForm.vitals
      };

      const comparisonData = {
        input_data: inputData,
        model_names: comparisonForm.selectedModels
      };

      const response = await aiService.compareModels(comparisonData);
      
      setSuccess('Model comparison completed successfully!');
      setComparisonDialog(false);
      setComparisonForm({
        symptoms: '',
        patientInfo: {
          age: '',
          gender: '',
          medicalHistory: ''
        },
        vitals: {
          temperature: '',
          bloodPressureSystolic: '',
          bloodPressureDiastolic: '',
          heartRate: '',
          respiratoryRate: ''
        },
        selectedModels: []
      });
      
      loadComparisonHistory();
    } catch (err) {
      setError('Failed to run model comparison');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFeedbackSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      const feedbackData = {
        comparison_id: selectedComparison.comparison_id,
        doctor_diagnosis: feedbackForm.doctorDiagnosis,
        confidence_level: feedbackForm.confidenceLevel,
        reasoning: feedbackForm.reasoning,
        treatment_plan: feedbackForm.treatmentPlan
      };

      const response = await aiService.addDoctorFeedback(feedbackData);
      
      setSuccess('Doctor feedback added successfully!');
      setFeedbackDialog(false);
      setFeedbackForm({
        doctorDiagnosis: '',
        confidenceLevel: 0.8,
        reasoning: '',
        treatmentPlan: ''
      });
      
      loadComparisonHistory();
    } catch (err) {
      setError('Failed to add doctor feedback');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getModelResultColor = (confidence) => {
    if (confidence >= 0.8) return 'success';
    if (confidence >= 0.6) return 'warning';
    return 'error';
  };

  const getConsensusColor = (consensusScore) => {
    if (consensusScore >= 0.8) return 'success';
    if (consensusScore >= 0.6) return 'warning';
    return 'error';
  };

  const getAgreementColor = (agreement) => {
    return agreement ? 'success' : 'error';
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        AI Model Comparison Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Compare multiple AI models on the same input and analyze differences in output, confidence, and doctor feedback
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Model Comparison Section */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Model Comparison</Typography>
                <Button
                  variant="contained"
                  startIcon={<CompareIcon />}
                  onClick={() => setComparisonDialog(true)}
                >
                  Run Comparison
                </Button>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom>
                        Available Models
                      </Typography>
                      <List dense>
                        {availableModels.map((model) => (
                          <ListItem key={model} dense>
                            <ListItemIcon>
                              <PsychologyIcon />
                            </ListItemIcon>
                            <ListItemText primary={model} />
                          </ListItem>
                        ))}
                      </List>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={8}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom>
                        Recent Comparisons
                      </Typography>
                      {comparisonHistory.length === 0 ? (
                        <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
                          No comparisons run yet
                        </Typography>
                      ) : (
                        <TableContainer component={Paper}>
                          <Table>
                            <TableHead>
                              <TableRow>
                                <TableCell>Comparison ID</TableCell>
                                <TableCell>Models</TableCell>
                                <TableCell>Consensus Score</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Actions</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {comparisonHistory.slice(0, 5).map((comparison) => (
                                <TableRow key={comparison.comparison_id}>
                                  <TableCell>{comparison.comparison_id}</TableCell>
                                  <TableCell>
                                    {Object.keys(comparison.model_results || {}).join(', ')}
                                  </TableCell>
                                  <TableCell>
                                    <Chip
                                      label={`${(comparison.consensus_analysis?.consensus_score * 100 || 0).toFixed(1)}%`}
                                      color={getConsensusColor(comparison.consensus_analysis?.consensus_score || 0)}
                                      size="small"
                                    />
                                  </TableCell>
                                  <TableCell>
                                    {new Date(comparison.timestamp).toLocaleDateString()}
                                  </TableCell>
                                  <TableCell>
                                    <Button
                                      size="small"
                                      onClick={() => {
                                        setSelectedComparison(comparison);
                                        setFeedbackDialog(true);
                                      }}
                                    >
                                      Add Feedback
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Detailed Comparison Results */}
        {comparisonHistory.length > 0 && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Detailed Comparison Results
                </Typography>
                
                {comparisonHistory.map((comparison) => (
                  <Accordion key={comparison.comparison_id} sx={{ mb: 2 }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        <Typography variant="subtitle1" sx={{ mr: 2 }}>
                          Comparison #{comparison.comparison_id}
                        </Typography>
                        <Chip
                          label={`${(comparison.consensus_analysis?.consensus_score * 100 || 0).toFixed(1)}% consensus`}
                          color={getConsensusColor(comparison.consensus_analysis?.consensus_score || 0)}
                          size="small"
                        />
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container spacing={3}>
                        {/* Model Results */}
                        <Grid item xs={12} md={6}>
                          <Typography variant="subtitle2" gutterBottom>
                            Model Predictions
                          </Typography>
                          <TableContainer component={Paper}>
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell>Model</TableCell>
                                  <TableCell>Prediction</TableCell>
                                  <TableCell>Confidence</TableCell>
                                  <TableCell>Agreement</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {Object.entries(comparison.model_results || {}).map(([modelName, result]) => (
                                  <TableRow key={modelName}>
                                    <TableCell>{modelName}</TableCell>
                                    <TableCell>{result.prediction || 'N/A'}</TableCell>
                                    <TableCell>
                                      <Chip
                                        label={`${(result.confidence * 100 || 0).toFixed(1)}%`}
                                        color={getModelResultColor(result.confidence || 0)}
                                        size="small"
                                      />
                                    </TableCell>
                                    <TableCell>
                                      {comparison.comparison_metrics?.agreement_scores?.[modelName] ? (
                                        <CheckIcon color="success" />
                                      ) : (
                                        <ErrorIcon color="error" />
                                      )}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </Grid>

                        {/* Consensus Analysis */}
                        <Grid item xs={12} md={6}>
                          <Typography variant="subtitle2" gutterBottom>
                            Consensus Analysis
                          </Typography>
                          <List dense>
                            <ListItem>
                              <ListItemIcon>
                                <AssessmentIcon />
                              </ListItemIcon>
                              <ListItemText
                                primary="Consensus Score"
                                secondary={`${(comparison.consensus_analysis?.consensus_score * 100 || 0).toFixed(1)}%`}
                              />
                            </ListItem>
                            <ListItem>
                              <ListItemIcon>
                                <TrendingUpIcon />
                              </ListItemIcon>
                              <ListItemText
                                primary="Majority Prediction"
                                secondary={comparison.consensus_analysis?.majority_prediction || 'N/A'}
                              />
                            </ListItem>
                            <ListItem>
                              <ListItemIcon>
                                <InfoIcon />
                              </ListItemIcon>
                              <ListItemText
                                primary="Unique Predictions"
                                secondary={comparison.consensus_analysis?.unique_predictions?.length || 0}
                              />
                            </ListItem>
                            {comparison.confidence_analysis && (
                              <>
                                <ListItem>
                                  <ListItemIcon>
                                    <TrendingUpIcon />
                                  </ListItemIcon>
                                  <ListItemText
                                    primary="Mean Confidence"
                                    secondary={`${(comparison.confidence_analysis.mean_confidence * 100 || 0).toFixed(1)}%`}
                                  />
                                </ListItem>
                                <ListItem>
                                  <ListItemIcon>
                                    <TrendingDownIcon />
                                  </ListItemIcon>
                                  <ListItemText
                                    primary="Confidence Range"
                                    secondary={`${(comparison.confidence_analysis.confidence_range * 100 || 0).toFixed(1)}%`}
                                  />
                                </ListItem>
                              </>
                            )}
                          </List>
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>

      {/* Run Comparison Dialog */}
      <Dialog open={comparisonDialog} onClose={() => setComparisonDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Run Model Comparison</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Symptoms"
                value={comparisonForm.symptoms}
                onChange={(e) => setComparisonForm(prev => ({ ...prev, symptoms: e.target.value }))}
                placeholder="Enter symptoms separated by commas (e.g., fever, cough, chest pain)"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Age"
                value={comparisonForm.patientInfo.age}
                onChange={(e) => setComparisonForm(prev => ({ 
                  ...prev, 
                  patientInfo: { ...prev.patientInfo, age: e.target.value }
                }))}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Gender</InputLabel>
                <Select
                  value={comparisonForm.patientInfo.gender}
                  onChange={(e) => setComparisonForm(prev => ({ 
                    ...prev, 
                    patientInfo: { ...prev.patientInfo, gender: e.target.value }
                  }))}
                >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Medical History"
                value={comparisonForm.patientInfo.medicalHistory}
                onChange={(e) => setComparisonForm(prev => ({ 
                  ...prev, 
                  patientInfo: { ...prev.patientInfo, medicalHistory: e.target.value }
                }))}
              />
            </Grid>
            
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                type="number"
                label="Temperature (°F)"
                value={comparisonForm.vitals.temperature}
                onChange={(e) => setComparisonForm(prev => ({ 
                  ...prev, 
                  vitals: { ...prev.vitals, temperature: e.target.value }
                }))}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                type="number"
                label="BP Systolic"
                value={comparisonForm.vitals.bloodPressureSystolic}
                onChange={(e) => setComparisonForm(prev => ({ 
                  ...prev, 
                  vitals: { ...prev.vitals, bloodPressureSystolic: e.target.value }
                }))}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                type="number"
                label="BP Diastolic"
                value={comparisonForm.vitals.bloodPressureDiastolic}
                onChange={(e) => setComparisonForm(prev => ({ 
                  ...prev, 
                  vitals: { ...prev.vitals, bloodPressureDiastolic: e.target.value }
                }))}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                type="number"
                label="Heart Rate"
                value={comparisonForm.vitals.heartRate}
                onChange={(e) => setComparisonForm(prev => ({ 
                  ...prev, 
                  vitals: { ...prev.vitals, heartRate: e.target.value }
                }))}
              />
            </Grid>
            
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Select Models to Compare</InputLabel>
                <Select
                  multiple
                  value={comparisonForm.selectedModels}
                  onChange={(e) => setComparisonForm(prev => ({ 
                    ...prev, 
                    selectedModels: e.target.value 
                  }))}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                >
                  {availableModels.map((model) => (
                    <MenuItem key={model} value={model}>
                      {model}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setComparisonDialog(false)}>Cancel</Button>
          <Button
            onClick={handleComparisonSubmit}
            variant="contained"
            startIcon={<CompareIcon />}
            disabled={!comparisonForm.symptoms || comparisonForm.selectedModels.length === 0}
          >
            Run Comparison
          </Button>
        </DialogActions>
      </Dialog>

      {/* Doctor Feedback Dialog */}
      <Dialog open={feedbackDialog} onClose={() => setFeedbackDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add Doctor Feedback</DialogTitle>
        <DialogContent>
          {selectedComparison && (
            <Alert severity="info" sx={{ mb: 2 }}>
              Adding feedback for Comparison #{selectedComparison.comparison_id}
            </Alert>
          )}
          
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Doctor's Diagnosis"
                value={feedbackForm.doctorDiagnosis}
                onChange={(e) => setFeedbackForm(prev => ({ ...prev, doctorDiagnosis: e.target.value }))}
                placeholder="Enter your diagnosis"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="number"
                label="Confidence Level (0-1)"
                value={feedbackForm.confidenceLevel}
                onChange={(e) => setFeedbackForm(prev => ({ ...prev, confidenceLevel: parseFloat(e.target.value) }))}
                inputProps={{ min: 0, max: 1, step: 0.1 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Reasoning"
                value={feedbackForm.reasoning}
                onChange={(e) => setFeedbackForm(prev => ({ ...prev, reasoning: e.target.value }))}
                placeholder="Explain your reasoning for this diagnosis"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Treatment Plan"
                value={feedbackForm.treatmentPlan}
                onChange={(e) => setFeedbackForm(prev => ({ ...prev, treatmentPlan: e.target.value }))}
                placeholder="Describe the recommended treatment plan"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFeedbackDialog(false)}>Cancel</Button>
          <Button
            onClick={handleFeedbackSubmit}
            variant="contained"
            startIcon={<FeedbackIcon />}
            disabled={!feedbackForm.doctorDiagnosis}
          >
            Add Feedback
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ModelComparisonDashboard; 