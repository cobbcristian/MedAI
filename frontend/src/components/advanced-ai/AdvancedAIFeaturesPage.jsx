import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  IconButton,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  LinearProgress,
  Divider,
  Tabs,
  Tab,
  Badge,
  Tooltip,
  Fab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Switch,
  FormControlLabel,
  Slider,
  Radio,
  RadioGroup
} from '@mui/material';
import {
  Psychology,
  Analytics,
  Science,
  Timeline,
  TrendingUp,
  TrendingDown,
  Compare,
  School,
  AutoFixHigh,
  Lightbulb,
  Warning,
  CheckCircle,
  Error,
  Info,
  ExpandMore,
  PlayArrow,
  Stop,
  Refresh,
  Download,
  Upload,
  Settings,
  Visibility,
  Edit,
  Delete,
  Add,
  History,
  Security,
  CloudUpload,
  FileCopy,
  Print,
  Lock,
  Public,
  Verified,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Timeline as TimelineIcon,
  Analytics as AnalyticsIcon,
  Psychology as PsychologyIcon,
  Science as ScienceIcon,
  Compare as CompareIcon,
  School as SchoolIcon,
  AutoFixHigh as AutoFixHighIcon,
  Lightbulb as LightbulbIcon
} from '@mui/icons-material';

const AdvancedAIFeaturesPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [diagnosisDialog, setDiagnosisDialog] = useState(false);
  const [modelDialog, setModelDialog] = useState(false);
  const [trainingDialog, setTrainingDialog] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analyzing, setAnalyzing] = useState(false);

  // Mock AI features data
  const [aiFeatures] = useState([
    {
      id: 1,
      title: 'AI Diagnosis',
      category: 'Diagnostic',
      description: 'Advanced diagnostic AI algorithms for comprehensive health analysis',
      status: 'active',
      accuracy: 94.2,
      lastUpdated: '2024-01-15',
      features: ['Multi-modal analysis', 'Symptom correlation', 'Risk assessment'],
      icon: <Psychology color="primary" />
    },
    {
      id: 2,
      title: 'Predictive Analytics',
      category: 'Analytics',
      description: 'Predict health trends and potential risks using machine learning',
      status: 'active',
      accuracy: 89.7,
      lastUpdated: '2024-01-12',
      features: ['Disease progression', 'Readmission risk', 'Treatment response'],
      icon: <Analytics color="secondary" />
    },
    {
      id: 3,
      title: 'Treatment Planning',
      category: 'Planning',
      description: 'AI-powered treatment recommendations based on patient data',
      status: 'active',
      accuracy: 91.3,
      lastUpdated: '2024-01-10',
      features: ['Personalized plans', 'Drug interactions', 'Dosage optimization'],
      icon: <Science color="success" />
    },
    {
      id: 4,
      title: 'Research Insights',
      category: 'Research',
      description: 'Access to latest medical research and clinical guidelines',
      status: 'active',
      accuracy: 96.8,
      lastUpdated: '2024-01-08',
      features: ['PubMed integration', 'Clinical trials', 'Guideline updates'],
      icon: <Timeline color="info" />
    },
    {
      id: 5,
      title: 'Model Comparison',
      category: 'Analysis',
      description: 'Compare different AI models for optimal performance',
      status: 'active',
      accuracy: 92.1,
      lastUpdated: '2024-01-05',
      features: ['Performance metrics', 'A/B testing', 'Model selection'],
      icon: <Compare color="warning" />
    },
    {
      id: 6,
      title: 'AI Training Sandbox',
      category: 'Development',
      description: 'Federated learning environment for model training',
      status: 'development',
      accuracy: 87.5,
      lastUpdated: '2024-01-03',
      features: ['Federated learning', 'Model training', 'Performance monitoring'],
      icon: <School color="error" />
    }
  ]);

  const [modelPerformance] = useState([
    {
      model: 'DenseNet121',
      accuracy: 94.2,
      precision: 92.8,
      recall: 93.5,
      f1Score: 93.1,
      status: 'production'
    },
    {
      model: 'ResNet50',
      accuracy: 91.7,
      precision: 90.3,
      recall: 91.2,
      f1Score: 90.7,
      status: 'testing'
    },
    {
      model: 'EfficientNet',
      accuracy: 93.8,
      precision: 93.1,
      recall: 94.0,
      f1Score: 93.5,
      status: 'production'
    }
  ]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleFeatureClick = (feature) => {
    setSelectedFeature(feature);
  };

  const handleDiagnosis = () => {
    setDiagnosisDialog(true);
  };

  const handleModelAnalysis = () => {
    setModelDialog(true);
  };

  const handleTraining = () => {
    setTrainingDialog(true);
  };

  const startAnalysis = () => {
    setAnalyzing(true);
    setAnalysisProgress(0);
    
    // Simulate analysis progress
    const interval = setInterval(() => {
      setAnalysisProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setAnalyzing(false);
          return 100;
        }
        return prev + 5;
      });
    }, 200);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'development': return 'warning';
      case 'production': return 'success';
      case 'testing': return 'info';
      default: return 'default';
    }
  };

  const getAccuracyColor = (accuracy) => {
    if (accuracy >= 95) return 'success';
    if (accuracy >= 90) return 'primary';
    if (accuracy >= 85) return 'warning';
    return 'error';
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Advanced AI Features
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Compare />}
            onClick={handleModelAnalysis}
          >
            Model Analysis
          </Button>
          <Button
            variant="contained"
            startIcon={<Psychology />}
            onClick={handleDiagnosis}
          >
            AI Diagnosis
          </Button>
        </Box>
      </Box>

      <Paper sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab label="AI Features" />
          <Tab label="Model Performance" />
          <Tab label="Training & Development" />
          <Tab label="Research & Insights" />
        </Tabs>
      </Paper>

      {activeTab === 0 && (
        <Grid container spacing={3}>
          {aiFeatures.map((feature) => (
            <Grid item xs={12} md={6} lg={4} key={feature.id}>
              <Card 
                sx={{ 
                  height: '100%',
                  cursor: 'pointer',
                  '&:hover': { boxShadow: 4 }
                }}
                onClick={() => handleFeatureClick(feature)}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {feature.icon}
                      <Typography variant="h6" component="h3">
                        {feature.title}
                      </Typography>
                    </Box>
                    <Chip 
                      label={feature.status} 
                      size="small" 
                      color={getStatusColor(feature.status)}
                    />
                  </Box>

                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {feature.description}
                  </Typography>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                      Updated: {feature.lastUpdated}
                    </Typography>
                    <Chip 
                      label={`${feature.accuracy}%`} 
                      size="small" 
                      color={getAccuracyColor(feature.accuracy)}
                    />
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    {feature.features.map((feat) => (
                      <Chip key={feat} label={feat} size="small" variant="outlined" />
                    ))}
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" color="text.secondary">
                      {feature.category}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton size="small">
                        <Visibility fontSize="small" />
                      </IconButton>
                      <IconButton size="small">
                        <Settings fontSize="small" />
                      </IconButton>
                      <IconButton size="small">
                        <PlayArrow fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {activeTab === 1 && (
        <Box>
          <Typography variant="h6" gutterBottom>Model Performance Metrics</Typography>
          <Grid container spacing={3}>
            {modelPerformance.map((model) => (
              <Grid item xs={12} md={6} lg={4} key={model.model}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6">{model.model}</Typography>
                      <Chip label={model.status} size="small" color={getStatusColor(model.status)} />
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Accuracy: <strong>{model.accuracy}%</strong>
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Precision: <strong>{model.precision}%</strong>
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Recall: <strong>{model.recall}%</strong>
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        F1 Score: <strong>{model.f1Score}%</strong>
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button size="small" variant="outlined">Compare</Button>
                      <Button size="small" variant="outlined">Deploy</Button>
                      <Button size="small" variant="outlined">Retrain</Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {activeTab === 2 && (
        <Box>
          <Typography variant="h6" gutterBottom>AI Training & Development</Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Federated Learning</Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Train AI models across multiple institutions while keeping data local and secure.
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button variant="contained" startIcon={<PlayArrow />}>
                      Start Training
                    </Button>
                    <Button variant="outlined">
                      View Progress
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Model Validation</Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Validate model performance against clinical standards and real-world data.
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button variant="contained" startIcon={<Science />}>
                      Validate
                    </Button>
                    <Button variant="outlined">
                      View Results
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}

      {activeTab === 3 && (
        <Box>
          <Typography variant="h6" gutterBottom>Research & Clinical Insights</Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Latest Research</Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <Info color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="New AI model shows 95% accuracy in early cancer detection"
                        secondary="Published in Nature Medicine - 2 days ago"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Warning color="warning" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Updated guidelines for diabetes management with AI assistance"
                        secondary="WHO Guidelines - 1 week ago"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircle color="success" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="FDA approves new AI-powered diagnostic tool"
                        secondary="FDA Approval - 2 weeks ago"
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Knowledge Base</Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Last updated: 2 hours ago
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Chip label="PubMed Articles: 2.3M+" color="primary" />
                    <Chip label="Clinical Trials: 45K+" color="secondary" />
                    <Chip label="FDA Guidelines: 12K+" color="success" />
                    <Chip label="WHO Reports: 8K+" color="info" />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* AI Diagnosis Dialog */}
      <Dialog open={diagnosisDialog} onClose={() => setDiagnosisDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>AI-Powered Diagnosis</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Upload medical images or describe symptoms for AI analysis:
            </Typography>
            
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Analysis Type</InputLabel>
              <Select label="Analysis Type" defaultValue="symptoms">
                <MenuItem value="symptoms">Symptom Analysis</MenuItem>
                <MenuItem value="imaging">Medical Imaging</MenuItem>
                <MenuItem value="lab">Lab Results</MenuItem>
                <MenuItem value="comprehensive">Comprehensive Analysis</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Patient Symptoms"
              multiline
              rows={4}
              placeholder="Describe the symptoms in detail..."
              sx={{ mb: 2 }}
            />

            <Box sx={{ border: '2px dashed', borderColor: 'grey.300', borderRadius: 2, p: 3, textAlign: 'center', mb: 2 }}>
              <Button variant="outlined" startIcon={<CloudUpload />}>
                Upload Medical Images
              </Button>
              <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                Supported: X-Ray, MRI, CT Scan, Ultrasound (Max 50MB)
              </Typography>
            </Box>

            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Include research insights"
            />

            {analyzing && (
              <Box sx={{ mt: 2 }}>
                <LinearProgress variant="determinate" value={analysisProgress} />
                <Typography variant="caption" sx={{ mt: 1 }}>
                  Analyzing... {analysisProgress}%
                </Typography>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDiagnosisDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={startAnalysis} disabled={analyzing}>
            Start Analysis
          </Button>
        </DialogActions>
      </Dialog>

      {/* Model Analysis Dialog */}
      <Dialog open={modelDialog} onClose={() => setModelDialog(false)} maxWidth="lg" fullWidth>
        <DialogTitle>Model Performance Analysis</DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>Model Comparison</Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Compare different AI models for your specific use case:
                </Typography>
              </Box>
              
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Primary Model</InputLabel>
                <Select label="Primary Model" defaultValue="densenet">
                  <MenuItem value="densenet">DenseNet121</MenuItem>
                  <MenuItem value="resnet">ResNet50</MenuItem>
                  <MenuItem value="efficientnet">EfficientNet</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Comparison Model</InputLabel>
                <Select label="Comparison Model" defaultValue="resnet">
                  <MenuItem value="densenet">DenseNet121</MenuItem>
                  <MenuItem value="resnet">ResNet50</MenuItem>
                  <MenuItem value="efficientnet">EfficientNet</MenuItem>
                </Select>
              </FormControl>

              <Button variant="contained" fullWidth>
                Compare Models
              </Button>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>Performance Metrics</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="body2">Accuracy</Typography>
                  <LinearProgress variant="determinate" value={94} sx={{ height: 8 }} />
                  <Typography variant="caption">94%</Typography>
                </Box>
                <Box>
                  <Typography variant="body2">Precision</Typography>
                  <LinearProgress variant="determinate" value={92} sx={{ height: 8 }} />
                  <Typography variant="caption">92%</Typography>
                </Box>
                <Box>
                  <Typography variant="body2">Recall</Typography>
                  <LinearProgress variant="determinate" value={93} sx={{ height: 8 }} />
                  <Typography variant="caption">93%</Typography>
                </Box>
                <Box>
                  <Typography variant="body2">F1 Score</Typography>
                  <LinearProgress variant="determinate" value={92} sx={{ height: 8 }} />
                  <Typography variant="caption">92%</Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModelDialog(false)}>Close</Button>
          <Button variant="contained">Export Report</Button>
        </DialogActions>
      </Dialog>

      {/* Feature Details Dialog */}
      <Dialog open={!!selectedFeature} onClose={() => setSelectedFeature(null)} maxWidth="md" fullWidth>
        {selectedFeature && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h5">{selectedFeature.title}</Typography>
                <Chip label={selectedFeature.status} color={getStatusColor(selectedFeature.status)} />
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                  <Typography variant="h6" gutterBottom>Description</Typography>
                  <Typography variant="body2" paragraph>
                    {selectedFeature.description}
                  </Typography>
                  
                  <Typography variant="h6" gutterBottom>Features</Typography>
                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    {selectedFeature.features.map((feat) => (
                      <Chip key={feat} label={feat} size="small" />
                    ))}
                  </Box>

                  <Typography variant="h6" gutterBottom>Performance</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Typography variant="body2">
                      Accuracy: <strong>{selectedFeature.accuracy}%</strong>
                    </Typography>
                    <Chip 
                      label={`${selectedFeature.accuracy}%`} 
                      size="small" 
                      color={getAccuracyColor(selectedFeature.accuracy)}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="h6" gutterBottom>Quick Actions</Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Button variant="contained" startIcon={<PlayArrow />}>
                      Run Analysis
                    </Button>
                    <Button variant="outlined" startIcon={<Settings />}>
                      Configure
                    </Button>
                    <Button variant="outlined" startIcon={<Compare />}>
                      Compare
                    </Button>
                    <Button variant="outlined" startIcon={<School />}>
                      Train
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSelectedFeature(null)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default AdvancedAIFeaturesPage; 