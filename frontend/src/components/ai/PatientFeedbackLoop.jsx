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
  Rating,
  Divider,
  ProgressBar
} from '@mui/material';
import {
  Feedback as FeedbackIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  Help as HelpIcon,
  Error as ErrorIcon,
  CheckCircle as CheckIcon,
  ExpandMore as ExpandMoreIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Security as SecurityIcon,
  Assessment as AssessmentIcon,
  Psychology as PsychologyIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { aiService } from '../../services/aiService';

const PatientFeedbackLoop = () => {
  const { user } = useAuth();
  const [aiOutputs, setAiOutputs] = useState([]);
  const [feedbackHistory, setFeedbackHistory] = useState([]);
  const [feedbackDialog, setFeedbackDialog] = useState(false);
  const [selectedOutput, setSelectedOutput] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Feedback form state
  const [feedbackForm, setFeedbackForm] = useState({
    feedbackType: 'helpful',
    feedbackScore: 4,
    feedbackText: '',
    sessionId: '',
    deviceInfo: {}
  });

  // Trust metrics state
  const [trustMetrics, setTrustMetrics] = useState({
    overallTrustScore: 0.0,
    feedbackCount: 0,
    biasAnalysis: {},
    qualityMetrics: {}
  });

  useEffect(() => {
    loadAiOutputs();
    loadFeedbackHistory();
    loadTrustMetrics();
  }, []);

  const loadAiOutputs = async () => {
    try {
      setLoading(true);
      const response = await aiService.getAiOutputs(user.id);
      setAiOutputs(response.data || []);
    } catch (err) {
      setError('Failed to load AI outputs');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadFeedbackHistory = async () => {
    try {
      const response = await aiService.getPatientFeedbackHistory(user.id);
      setFeedbackHistory(response.data || []);
    } catch (err) {
      console.error('Failed to load feedback history:', err);
    }
  };

  const loadTrustMetrics = async () => {
    try {
      const response = await aiService.getTrustMetrics(user.id);
      setTrustMetrics(response.data || {
        overallTrustScore: 0.0,
        feedbackCount: 0,
        biasAnalysis: {},
        qualityMetrics: {}
      });
    } catch (err) {
      console.error('Failed to load trust metrics:', err);
    }
  };

  const handleFeedbackSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      const feedbackData = {
        patient_id: user.id,
        ai_output_id: selectedOutput.id,
        feedback_type: feedbackForm.feedbackType,
        feedback_score: feedbackForm.feedbackScore,
        feedback_text: feedbackForm.feedbackText,
        session_id: feedbackForm.sessionId,
        device_info: feedbackForm.deviceInfo
      };

      const response = await aiService.submitPatientFeedback(feedbackData);
      
      setSuccess('Feedback submitted successfully!');
      setFeedbackDialog(false);
      setFeedbackForm({
        feedbackType: 'helpful',
        feedbackScore: 4,
        feedbackText: '',
        sessionId: '',
        deviceInfo: {}
      });
      
      loadFeedbackHistory();
      loadTrustMetrics();
    } catch (err) {
      setError('Failed to submit feedback');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getFeedbackTypeColor = (type) => {
    switch (type) {
      case 'helpful': return 'success';
      case 'confusing': return 'warning';
      case 'incorrect': return 'error';
      case 'unclear': return 'info';
      default: return 'default';
    }
  };

  const getFeedbackTypeIcon = (type) => {
    switch (type) {
      case 'helpful': return <ThumbUpIcon />;
      case 'confusing': return <HelpIcon />;
      case 'incorrect': return <ErrorIcon />;
      case 'unclear': return <HelpIcon />;
      default: return <FeedbackIcon />;
    }
  };

  const getTrustScoreColor = (score) => {
    if (score >= 0.8) return 'success';
    if (score >= 0.6) return 'warning';
    return 'error';
  };

  const getBiasIndicatorColor = (biasScore) => {
    if (biasScore < 0.3) return 'success';
    if (biasScore < 0.7) return 'warning';
    return 'error';
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Patient AI Feedback Loop
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Rate AI explanations and help improve the system's trustworthiness and accuracy
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
        {/* Trust Metrics Dashboard */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Trust & Quality Metrics
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={3}>
                  <Card variant="outlined">
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <TrendingUpIcon color="primary" sx={{ mr: 1 }} />
                        <Typography variant="h6">
                          {(trustMetrics.overallTrustScore * 100).toFixed(1)}%
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        Overall Trust Score
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={trustMetrics.overallTrustScore * 100}
                        color={getTrustScoreColor(trustMetrics.overallTrustScore)}
                        sx={{ mt: 1 }}
                      />
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={3}>
                  <Card variant="outlined">
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <FeedbackIcon color="primary" sx={{ mr: 1 }} />
                        <Typography variant="h6">
                          {trustMetrics.feedbackCount}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        Total Feedback
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={3}>
                  <Card variant="outlined">
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <SecurityIcon color="primary" sx={{ mr: 1 }} />
                        <Typography variant="h6">
                          {trustMetrics.biasAnalysis?.overall_bias_score ? 
                            `${(trustMetrics.biasAnalysis.overall_bias_score * 100).toFixed(1)}%` : 'N/A'}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        Bias Score
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={3}>
                  <Card variant="outlined">
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <AssessmentIcon color="primary" sx={{ mr: 1 }} />
                        <Typography variant="h6">
                          {trustMetrics.qualityMetrics?.clarity_score ? 
                            `${(trustMetrics.qualityMetrics.clarity_score * 100).toFixed(1)}%` : 'N/A'}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        Clarity Score
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* AI Outputs for Feedback */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                AI Outputs for Feedback
              </Typography>

              {loading ? (
                <LinearProgress />
              ) : aiOutputs.length === 0 ? (
                <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
                  No AI outputs available for feedback
                </Typography>
              ) : (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Output ID</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Trust Score</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {aiOutputs.map((output) => (
                        <TableRow key={output.id}>
                          <TableCell>{output.id}</TableCell>
                          <TableCell>{output.type}</TableCell>
                          <TableCell>
                            <Chip
                              label={`${(output.trust_score * 100 || 0).toFixed(1)}%`}
                              color={getTrustScoreColor(output.trust_score || 0)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Button
                              size="small"
                              onClick={() => {
                                setSelectedOutput(output);
                                setFeedbackDialog(true);
                              }}
                            >
                              Provide Feedback
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

        {/* Feedback History */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Your Feedback History
              </Typography>

              {feedbackHistory.length === 0 ? (
                <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
                  No feedback submitted yet
                </Typography>
              ) : (
                <Box>
                  {feedbackHistory.slice(0, 5).map((feedback) => (
                    <Accordion key={feedback.feedback_id} sx={{ mb: 1 }}>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                          <Chip
                            icon={getFeedbackTypeIcon(feedback.feedback_type)}
                            label={feedback.feedback_type}
                            color={getFeedbackTypeColor(feedback.feedback_type)}
                            sx={{ mr: 2 }}
                          />
                          <Typography variant="body2">
                            {new Date(feedback.timestamp).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <Typography variant="body2" color="text.secondary">
                              <strong>Feedback Score:</strong> {feedback.feedback_score}/5
                            </Typography>
                          </Grid>
                          {feedback.feedback_text && (
                            <Grid item xs={12}>
                              <Typography variant="body2" color="text.secondary">
                                <strong>Comments:</strong> {feedback.feedback_text}
                              </Typography>
                            </Grid>
                          )}
                          <Grid item xs={12}>
                            <Typography variant="body2" color="text.secondary">
                              <strong>AI Output ID:</strong> {feedback.ai_output_id}
                            </Typography>
                          </Grid>
                        </Grid>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Bias Analysis */}
        {trustMetrics.biasAnalysis && Object.keys(trustMetrics.biasAnalysis).length > 0 && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Bias Analysis
                </Typography>
                <Grid container spacing={2}>
                  {trustMetrics.biasAnalysis.demographic_bias && (
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" gutterBottom>
                        Demographic Bias
                      </Typography>
                      <List dense>
                        {Object.entries(trustMetrics.biasAnalysis.demographic_bias).map(([group, data]) => (
                          <ListItem key={group}>
                            <ListItemIcon>
                              <Chip
                                label={data.bias_indicator}
                                color={getBiasIndicatorColor(data.average_score)}
                                size="small"
                              />
                            </ListItemIcon>
                            <ListItemText
                              primary={group}
                              secondary={`Score: ${(data.average_score * 100).toFixed(1)}% (${data.feedback_count} feedback)`}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Grid>
                  )}
                  
                  {trustMetrics.biasAnalysis.temporal_bias && (
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" gutterBottom>
                        Temporal Bias
                      </Typography>
                      <List dense>
                        <ListItem>
                          <ListItemIcon>
                            <Chip
                              label={trustMetrics.biasAnalysis.temporal_bias.bias_indicator}
                              color={getBiasIndicatorColor(trustMetrics.biasAnalysis.temporal_bias.score_variance)}
                              size="small"
                            />
                          </ListItemIcon>
                          <ListItemText
                            primary="Score Variance"
                            secondary={`${(trustMetrics.biasAnalysis.temporal_bias.score_variance * 100).toFixed(1)}%`}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <TrendingUpIcon color={trustMetrics.biasAnalysis.temporal_bias.trend_direction === 'improving' ? 'success' : 'error'} />
                          </ListItemIcon>
                          <ListItemText
                            primary="Trend Direction"
                            secondary={trustMetrics.biasAnalysis.temporal_bias.trend_direction}
                          />
                        </ListItem>
                      </List>
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>

      {/* Feedback Dialog */}
      <Dialog open={feedbackDialog} onClose={() => setFeedbackDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Provide Feedback on AI Output</DialogTitle>
        <DialogContent>
          {selectedOutput && (
            <Alert severity="info" sx={{ mb: 2 }}>
              Providing feedback for AI Output #{selectedOutput.id}
            </Alert>
          )}
          
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Feedback Type</InputLabel>
                <Select
                  value={feedbackForm.feedbackType}
                  onChange={(e) => setFeedbackForm(prev => ({ ...prev, feedbackType: e.target.value }))}
                >
                  <MenuItem value="helpful">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <ThumbUpIcon sx={{ mr: 1 }} />
                      Helpful
                    </Box>
                  </MenuItem>
                  <MenuItem value="confusing">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <HelpIcon sx={{ mr: 1 }} />
                      Confusing
                    </Box>
                  </MenuItem>
                  <MenuItem value="incorrect">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <ErrorIcon sx={{ mr: 1 }} />
                      Incorrect
                    </Box>
                  </MenuItem>
                  <MenuItem value="unclear">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <HelpIcon sx={{ mr: 1 }} />
                      Unclear
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <Typography component="legend">Rating (1-5)</Typography>
              <Rating
                name="feedback-score"
                value={feedbackForm.feedbackScore}
                onChange={(event, newValue) => {
                  setFeedbackForm(prev => ({ ...prev, feedbackScore: newValue }));
                }}
                max={5}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Additional Comments (Optional)"
                value={feedbackForm.feedbackText}
                onChange={(e) => setFeedbackForm(prev => ({ ...prev, feedbackText: e.target.value }))}
                placeholder="Please share any additional thoughts about this AI output..."
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
            disabled={!feedbackForm.feedbackType}
          >
            Submit Feedback
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PatientFeedbackLoop; 