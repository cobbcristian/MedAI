import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Avatar,
  LinearProgress,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Badge,
  Switch,
  FormControlLabel,
  useTheme,
  useMediaQuery,
  Alert,
  Snackbar,
  Paper,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tabs,
  Tab,
  Fab,
  Zoom
} from '@mui/material';
import {
  Psychology,
  Biotech,
  Timeline,
  Speed,
  CheckCircle,
  Warning,
  Error,
  Info,
  Refresh,
  PlayArrow,
  Pause,
  Stop,
  Fullscreen,
  ZoomIn,
  ZoomOut,
  FilterList,
  Search,
  Add,
  Edit,
  Delete,
  Download,
  Upload,
  Share,
  Favorite,
  Star,
  StarBorder,
  Visibility,
  VisibilityOff,
  Brightness4,
  Brightness7,
  Language,
  LocationOn,
  Schedule,
  Payment,
  Security,
  PrivacyTip,
  VerifiedUser,
  CloudUpload,
  CloudDownload,
  Sync,
  Autorenew,
  Memory,
  Storage,
  NetworkCheck,
  Wifi,
  WifiOff,
  SignalCellular4Bar,
  SignalCellularConnectedNoInternet4Bar,
  Battery90,
  BatteryCharging90,
  BatteryAlert,
  BatteryUnknown,
  BatteryFull,
  Battery6Bar,
  Battery5Bar,
  Battery4Bar,
  Battery3Bar,
  Battery2Bar,
  Battery1Bar,
  Battery0Bar,
  BatteryChargingFull,
  BatteryCharging6Bar,
  BatteryCharging5Bar,
  BatteryCharging4Bar,
  BatteryCharging3Bar,
  BatteryCharging2Bar,
  BatteryCharging1Bar,
  BatteryCharging0Bar,
  BatterySaver,
  BatteryStd,
  BatteryUnknown,
  ExpandMore,
  ExpandLess,
  TrendingUp,
  TrendingDown,
  Analytics,
  Assessment,
  HealthAndSafety,
  LocalHospital,
  Medication,
  Bloodtype,
  MonitorHeart,
  Favorite,
  FavoriteBorder,
  ThumbUp,
  ThumbDown,
  Comment,
  Send,
  AttachFile,
  CameraAlt,
  Videocam,
  Mic,
  MicOff,
  VolumeUp,
  VolumeOff,
  Settings,
  Tune,
  AutoAwesome,
  Science,
  School,
  Work,
  Home,
  Person,
  Group,
  Public,
  Lock,
  LockOpen,
  VpnKey,
  Fingerprint,
  Face,
  Visibility,
  VisibilityOff,
  Notifications,
  NotificationsOff,
  NotificationsActive,
  NotificationsNone,
  NotificationsPaused,
  NotificationsImportant,
  NotificationsUrgent,
  NotificationsCritical,
  NotificationsWarning,
  NotificationsInfo,
  NotificationsSuccess,
  NotificationsError
} from '@mui/icons-material';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, ScatterChart, Scatter, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ComposedChart } from 'recharts';

const AdvancedAIFeaturesV2 = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [activeTab, setActiveTab] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [analysisType, setAnalysisType] = useState('symptoms');
  const [patientData, setPatientData] = useState({
    age: '',
    gender: '',
    symptoms: '',
    medicalHistory: '',
    medications: '',
    vitalSigns: {
      bloodPressure: '',
      heartRate: '',
      temperature: '',
      oxygenSaturation: ''
    }
  });

  const [aiModels, setAiModels] = useState([
    {
      id: 1,
      name: 'GPT-4 Medical',
      type: 'NLP',
      accuracy: 96.8,
      speed: 2.3,
      status: 'active',
      lastUpdated: '2024-01-15',
      description: 'Advanced language model for medical diagnosis and treatment recommendations'
    },
    {
      id: 2,
      name: 'CheXNet',
      type: 'Computer Vision',
      accuracy: 98.2,
      speed: 1.8,
      status: 'active',
      lastUpdated: '2024-01-14',
      description: 'Deep learning model for chest X-ray analysis and disease detection'
    },
    {
      id: 3,
      name: 'BioGPT',
      type: 'NLP',
      accuracy: 94.5,
      speed: 3.1,
      status: 'training',
      lastUpdated: '2024-01-13',
      description: 'Biomedical language model for medical literature analysis'
    },
    {
      id: 4,
      name: 'MedCLIP',
      type: 'Multimodal',
      accuracy: 97.1,
      speed: 2.7,
      status: 'active',
      lastUpdated: '2024-01-12',
      description: 'Multimodal model for medical image and text understanding'
    }
  ]);

  const [realTimeMetrics, setRealTimeMetrics] = useState({
    accuracy: 96.8,
    responseTime: 145,
    throughput: 234,
    errorRate: 0.2,
    modelConfidence: 94.5
  });

  const [predictionData] = useState([
    { name: 'Cardiovascular', probability: 87, confidence: 92, urgency: 'high' },
    { name: 'Respiratory', probability: 65, confidence: 78, urgency: 'medium' },
    { name: 'Neurological', probability: 43, confidence: 85, urgency: 'low' },
    { name: 'Endocrine', probability: 32, confidence: 71, urgency: 'low' },
    { name: 'Gastrointestinal', probability: 28, confidence: 68, urgency: 'low' }
  ]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658'];

  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeMetrics(prev => ({
        ...prev,
        accuracy: Math.max(90, Math.min(100, prev.accuracy + (Math.random() - 0.5) * 2)),
        responseTime: Math.max(100, Math.min(200, prev.responseTime + (Math.random() - 0.5) * 10)),
        throughput: prev.throughput + Math.floor(Math.random() * 10) - 5,
        modelConfidence: Math.max(85, Math.min(100, prev.modelConfidence + (Math.random() - 0.5) * 3))
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleAnalysis = async () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      const mockResults = {
        diagnosis: {
          primary: 'Hypertension',
          secondary: ['Type 2 Diabetes', 'Hyperlipidemia'],
          confidence: 94.5,
          urgency: 'medium'
        },
        recommendations: [
          'Monitor blood pressure daily',
          'Adjust medication dosage',
          'Lifestyle modifications recommended',
          'Follow-up in 2 weeks'
        ],
        riskFactors: [
          { factor: 'Age', risk: 'high', description: 'Patient is in high-risk age group' },
          { factor: 'Family History', risk: 'medium', description: 'Family history of cardiovascular disease' },
          { factor: 'Lifestyle', risk: 'high', description: 'Sedentary lifestyle and poor diet' }
        ],
        treatmentPlan: {
          medications: ['Lisinopril 10mg daily', 'Metformin 500mg twice daily'],
          lifestyle: ['Regular exercise', 'Low-sodium diet', 'Weight management'],
          monitoring: ['Blood pressure', 'Blood glucose', 'Lipid panel'],
          followUp: '2 weeks'
        }
      };
      
      setAnalysisResults(mockResults);
      setIsAnalyzing(false);
    }, 3000);
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'high': return theme.palette.error.main;
      case 'medium': return theme.palette.warning.main;
      case 'low': return theme.palette.success.main;
      default: return theme.palette.info.main;
    }
  };

  const getModelStatusColor = (status) => {
    switch (status) {
      case 'active': return theme.palette.success.main;
      case 'training': return theme.palette.warning.main;
      case 'inactive': return theme.palette.error.main;
      default: return theme.palette.info.main;
    }
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3, backgroundColor: theme.palette.background.default }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
          🤖 Advanced AI Medical Assistant
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Chip 
            label={`${realTimeMetrics.accuracy.toFixed(1)}% Accuracy`} 
            color="success" 
            icon={<CheckCircle />}
          />
          <Chip 
            label={`${realTimeMetrics.responseTime}ms Response`} 
            color="info" 
            icon={<Speed />}
          />
          <Tooltip title="Refresh AI Models">
            <IconButton>
              <Refresh />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="Patient Analysis" icon={<Person />} />
          <Tab label="AI Models" icon={<Psychology />} />
          <Tab label="Predictions" icon={<Timeline />} />
          <Tab label="Real-time Monitoring" icon={<Speed />} />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      {activeTab === 0 && (
        <Grid container spacing={3}>
          {/* Patient Data Input */}
          <Grid item xs={12} lg={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                  <Person sx={{ mr: 1 }} />
                  Patient Information
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Age"
                      value={patientData.age}
                      onChange={(e) => setPatientData({...patientData, age: e.target.value})}
                      type="number"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl fullWidth>
                      <InputLabel>Gender</InputLabel>
                      <Select
                        value={patientData.gender}
                        onChange={(e) => setPatientData({...patientData, gender: e.target.value})}
                        label="Gender"
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
                      rows={3}
                      label="Symptoms"
                      value={patientData.symptoms}
                      onChange={(e) => setPatientData({...patientData, symptoms: e.target.value})}
                      placeholder="Describe patient symptoms..."
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={2}
                      label="Medical History"
                      value={patientData.medicalHistory}
                      onChange={(e) => setPatientData({...patientData, medicalHistory: e.target.value})}
                      placeholder="Previous medical conditions..."
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Current Medications"
                      value={patientData.medications}
                      onChange={(e) => setPatientData({...patientData, medications: e.target.value})}
                      placeholder="List current medications..."
                    />
                  </Grid>
                </Grid>

                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>Vital Signs</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Blood Pressure"
                        value={patientData.vitalSigns.bloodPressure}
                        onChange={(e) => setPatientData({
                          ...patientData, 
                          vitalSigns: {...patientData.vitalSigns, bloodPressure: e.target.value}
                        })}
                        placeholder="120/80"
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Heart Rate"
                        value={patientData.vitalSigns.heartRate}
                        onChange={(e) => setPatientData({
                          ...patientData, 
                          vitalSigns: {...patientData.vitalSigns, heartRate: e.target.value}
                        })}
                        placeholder="72 bpm"
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Temperature"
                        value={patientData.vitalSigns.temperature}
                        onChange={(e) => setPatientData({
                          ...patientData, 
                          vitalSigns: {...patientData.vitalSigns, temperature: e.target.value}
                        })}
                        placeholder="98.6°F"
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Oxygen Saturation"
                        value={patientData.vitalSigns.oxygenSaturation}
                        onChange={(e) => setPatientData({
                          ...patientData, 
                          vitalSigns: {...patientData.vitalSigns, oxygenSaturation: e.target.value}
                        })}
                        placeholder="98%"
                      />
                    </Grid>
                  </Grid>
                </Box>

                <Box sx={{ mt: 3 }}>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={handleAnalysis}
                    disabled={isAnalyzing}
                    startIcon={isAnalyzing ? <Pause /> : <PlayArrow />}
                    sx={{ 
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white'
                    }}
                  >
                    {isAnalyzing ? 'Analyzing...' : 'Start AI Analysis'}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Analysis Results */}
          <Grid item xs={12} lg={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                  <Assessment sx={{ mr: 1 }} />
                  AI Analysis Results
                </Typography>

                {isAnalyzing && (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <LinearProgress sx={{ mb: 2 }} />
                    <Typography>AI is analyzing patient data...</Typography>
                  </Box>
                )}

                {analysisResults && !isAnalyzing && (
                  <Box>
                    {/* Primary Diagnosis */}
                    <Paper sx={{ p: 2, mb: 2, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                      <Typography variant="h6">Primary Diagnosis</Typography>
                      <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                        {analysisResults.diagnosis.primary}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        <Chip 
                          label={`${analysisResults.diagnosis.confidence}% confidence`} 
                          color="success" 
                          size="small"
                        />
                        <Chip 
                          label={analysisResults.diagnosis.urgency} 
                          color={analysisResults.diagnosis.urgency === 'high' ? 'error' : 'warning'} 
                          size="small"
                          sx={{ ml: 1 }}
                        />
                      </Box>
                    </Paper>

                    {/* Recommendations */}
                    <Accordion>
                      <AccordionSummary expandIcon={<ExpandMore />}>
                        <Typography variant="h6">Treatment Recommendations</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <List>
                          {analysisResults.recommendations.map((rec, index) => (
                            <ListItem key={index}>
                              <ListItemAvatar>
                                <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                                  <CheckCircle />
                                </Avatar>
                              </ListItemAvatar>
                              <ListItemText primary={rec} />
                            </ListItem>
                          ))}
                        </List>
                      </AccordionDetails>
                    </Accordion>

                    {/* Risk Factors */}
                    <Accordion>
                      <AccordionSummary expandIcon={<ExpandMore />}>
                        <Typography variant="h6">Risk Factors</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        {analysisResults.riskFactors.map((risk, index) => (
                          <Box key={index} sx={{ mb: 2, p: 2, border: `1px solid ${getUrgencyColor(risk.risk)}`, borderRadius: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                              <Typography variant="subtitle1">{risk.factor}</Typography>
                              <Chip 
                                label={risk.risk} 
                                color={risk.risk === 'high' ? 'error' : risk.risk === 'medium' ? 'warning' : 'success'} 
                                size="small"
                              />
                            </Box>
                            <Typography variant="body2" color="textSecondary">
                              {risk.description}
                            </Typography>
                          </Box>
                        ))}
                      </AccordionDetails>
                    </Accordion>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {activeTab === 1 && (
        <Grid container spacing={3}>
          {aiModels.map((model) => (
            <Grid item xs={12} md={6} key={model.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                      <Typography variant="h6">{model.name}</Typography>
                      <Typography variant="body2" color="textSecondary">{model.type}</Typography>
                    </Box>
                    <Chip 
                      label={model.status} 
                      color={model.status === 'active' ? 'success' : 'warning'} 
                      size="small"
                    />
                  </Box>
                  
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {model.description}
                  </Typography>

                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Accuracy</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {model.accuracy}%
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={model.accuracy} 
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Speed</Typography>
                    <Typography variant="body2">{model.speed}s</Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Last Updated</Typography>
                    <Typography variant="body2">{model.lastUpdated}</Typography>
                  </Box>

                  <Box sx={{ mt: 2 }}>
                    <Button variant="outlined" size="small" sx={{ mr: 1 }}>
                      <Edit sx={{ fontSize: 16, mr: 0.5 }} />
                      Configure
                    </Button>
                    <Button variant="outlined" size="small">
                      <Analytics sx={{ fontSize: 16, mr: 0.5 }} />
                      Metrics
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {activeTab === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                  <Timeline sx={{ mr: 1 }} />
                  Disease Probability Predictions
                </Typography>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={predictionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <RechartsTooltip />
                    <Legend />
                    <Bar dataKey="probability" fill="#8884d8" />
                    <Bar dataKey="confidence" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} lg={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                  <Analytics sx={{ mr: 1 }} />
                  Prediction Summary
                </Typography>
                {predictionData.map((prediction, index) => (
                  <Box key={prediction.name} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">{prediction.name}</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {prediction.probability}%
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={prediction.probability} 
                      sx={{ 
                        height: 8, 
                        borderRadius: 4,
                        backgroundColor: theme.palette.grey[200],
                        '& .MuiLinearProgress-bar': {
                          background: `linear-gradient(90deg, ${COLORS[index % COLORS.length]} 0%, ${COLORS[(index + 1) % COLORS.length]} 100%)`
                        }
                      }} 
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                      <Typography variant="caption" color="textSecondary">
                        Confidence: {prediction.confidence}%
                      </Typography>
                      <Chip 
                        label={prediction.urgency} 
                        size="small" 
                        color={prediction.urgency === 'high' ? 'error' : prediction.urgency === 'medium' ? 'warning' : 'success'}
                      />
                    </Box>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {activeTab === 3 && (
        <Grid container spacing={3}>
          <Grid item xs={12} lg={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                  <Speed sx={{ mr: 1 }} />
                  Real-time Performance Metrics
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={[
                    { time: '00:00', accuracy: 96.8, responseTime: 145, throughput: 234 },
                    { time: '04:00', accuracy: 97.2, responseTime: 142, throughput: 241 },
                    { time: '08:00', accuracy: 96.5, responseTime: 148, throughput: 228 },
                    { time: '12:00', accuracy: 97.8, responseTime: 138, throughput: 256 },
                    { time: '16:00', accuracy: 96.9, responseTime: 145, throughput: 239 },
                    { time: '20:00', accuracy: 97.1, responseTime: 141, throughput: 245 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <RechartsTooltip />
                    <Legend />
                    <Line type="monotone" dataKey="accuracy" stroke="#8884d8" strokeWidth={2} />
                    <Line type="monotone" dataKey="responseTime" stroke="#82ca9d" strokeWidth={2} />
                    <Line type="monotone" dataKey="throughput" stroke="#ffc658" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} lg={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                  <Memory sx={{ mr: 1 }} />
                  System Health
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center', p: 2, border: `1px solid ${theme.palette.divider}`, borderRadius: 2 }}>
                      <Typography variant="h4" color="success.main">
                        {realTimeMetrics.accuracy.toFixed(1)}%
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Model Accuracy
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center', p: 2, border: `1px solid ${theme.palette.divider}`, borderRadius: 2 }}>
                      <Typography variant="h4" color="primary">
                        {realTimeMetrics.responseTime}ms
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Response Time
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center', p: 2, border: `1px solid ${theme.palette.divider}`, borderRadius: 2 }}>
                      <Typography variant="h4" color="info.main">
                        {realTimeMetrics.throughput}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Requests/min
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center', p: 2, border: `1px solid ${theme.palette.divider}`, borderRadius: 2 }}>
                      <Typography variant="h4" color="warning.main">
                        {realTimeMetrics.errorRate}%
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Error Rate
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Floating Action Button */}
      <Zoom in={true}>
        <Fab
          color="primary"
          aria-label="add"
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          }}
        >
          <Add />
        </Fab>
      </Zoom>
    </Box>
  );
};

export default AdvancedAIFeaturesV2;
