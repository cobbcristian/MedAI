import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
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
  Avatar,
  Badge,
  Fab,
  Tooltip,
  Switch,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Rating,
  Slider,
  FormGroup,
  CircularProgress,
  AlertTitle
} from '@mui/material';
import {
  Person,
  LocalHospital,
  Description,
  Timeline,
  VideoCall,
  Chat,
  Notifications,
  CheckCircle,
  Warning,
  Error,
  Info,
  ExpandMore,
  Visibility,
  Edit,
  Add,
  Schedule,
  Event,
  Medication,
  Vaccines,
  MonitorHeart,
  Favorite,
  TrendingUp,
  TrendingDown,
  Speed,
  Memory,
  Storage,
  CloudUpload,
  CloudDownload,
  Security,
  VerifiedUser,
  Timeline as TimelineIcon,
  Analytics,
  Psychology,
  Biotech,
  HealthAndSafety,
  FavoriteBorder,
  Star,
  StarBorder,
  StarHalf,
  CalendarToday,
  AccessTime,
  LocationOn,
  Phone,
  Email,
  Payment,
  Receipt,
  Assessment,
  AutoAwesome,
  Science,
  CameraAlt,
  Image,
  Download,
  Share,
  Print,
  ZoomIn,
  ZoomOut,
  Brightness6,
  Contrast,
  FilterAlt,
  AutoAwesome as AutoAwesomeIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import aiService from '../../services/aiService';

const PatientDashboard = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [healthData, setHealthData] = useState({
    vitals: [
      { date: '2024-01-15', bloodPressure: '120/80', heartRate: 72, temperature: 98.6, weight: 68 },
      { date: '2024-01-16', bloodPressure: '118/78', heartRate: 70, temperature: 98.4, weight: 68 },
      { date: '2024-01-17', bloodPressure: '122/82', heartRate: 75, temperature: 98.8, weight: 67.8 },
      { date: '2024-01-18', bloodPressure: '119/79', heartRate: 71, temperature: 98.5, weight: 67.9 },
      { date: '2024-01-19', bloodPressure: '121/81', heartRate: 73, temperature: 98.7, weight: 68.1 },
      { date: '2024-01-20', bloodPressure: '120/80', heartRate: 72, temperature: 98.6, weight: 68 }
    ],
    medications: [
      { name: 'Lisinopril', dosage: '10mg', frequency: 'Daily', status: 'active', startDate: '2023-06-15' },
      { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', status: 'active', startDate: '2023-08-20' },
      { name: 'Atorvastatin', dosage: '20mg', frequency: 'Daily', status: 'active', startDate: '2023-09-10' }
    ],
    appointments: [
      { id: 1, type: 'Follow-up', doctor: 'Dr. Cobb', date: '2024-01-25', time: '14:00', status: 'scheduled' },
      { id: 2, type: 'Lab Work', doctor: 'Dr. Johnson', date: '2024-01-30', time: '09:00', status: 'scheduled' },
      { id: 3, type: 'Cardiology', doctor: 'Dr. Davis', date: '2024-02-05', time: '11:00', status: 'scheduled' }
    ],
    recentTests: [
      { name: 'Blood Work', date: '2024-01-15', result: 'Normal', status: 'completed' },
      { name: 'EKG', date: '2024-01-10', result: 'Normal', status: 'completed' },
      { name: 'Chest X-Ray', date: '2024-01-05', result: 'Normal', status: 'completed' }
    ],
    symptoms: [
      { symptom: 'Fatigue', severity: 'mild', date: '2024-01-18', duration: '2 days' },
      { symptom: 'Headache', severity: 'moderate', date: '2024-01-16', duration: '1 day' },
      { symptom: 'Joint Pain', severity: 'mild', date: '2024-01-14', duration: '3 days' }
    ]
  });

  const [aiInsights, setAiInsights] = useState({
    healthScore: 85,
    riskFactors: ['Age', 'Family History'],
    recommendations: [
      'Continue current medication regimen',
      'Schedule annual physical examination',
      'Monitor blood pressure daily',
      'Increase physical activity to 150 minutes/week'
    ],
    trends: [
      { metric: 'Blood Pressure', trend: 'stable', change: '+2%' },
      { metric: 'Heart Rate', trend: 'improving', change: '-3%' },
      { metric: 'Weight', trend: 'stable', change: '0%' }
    ]
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load patient data and AI insights
    loadPatientData();
  }, []);

  const loadPatientData = async () => {
    setLoading(true);
    try {
      // In a real implementation, this would fetch data from the backend
      // For now, we'll use the mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLoading(false);
    } catch (error) {
      console.error('Failed to load patient data:', error);
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'completed': return 'info';
      case 'scheduled': return 'primary';
      case 'pending': return 'warning';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'mild': return 'info';
      case 'moderate': return 'warning';
      case 'severe': return 'error';
      default: return 'default';
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'improving': return <TrendingUp color="success" />;
      case 'stable': return <CheckCircle color="info" />;
      case 'declining': return <TrendingDown color="warning" />;
      default: return <Info color="default" />;
    }
  };

  const chartColors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300'];

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Welcome back, John Smith
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" startIcon={<Notifications />}>
            Notifications
          </Button>
          <Button variant="contained" startIcon={<Add />}>
            New Appointment
          </Button>
        </Box>
      </Box>

      {/* Health Score Card */}
      <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h5" gutterBottom>
                Your Health Score
              </Typography>
              <Typography variant="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
                {aiInsights.healthScore}/100
              </Typography>
              <Typography variant="body1">
                Based on your recent health data and AI analysis
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                  <CircularProgress
                    variant="determinate"
                    value={aiInsights.healthScore}
                    size={120}
                    thickness={4}
                    sx={{ color: 'white' }}
                  />
                  <Box
                    sx={{
                      top: 0,
                      left: 0,
                      bottom: 0,
                      right: 0,
                      position: 'absolute',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                      {aiInsights.healthScore}%
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <MonitorHeart color="primary" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h6">120/80</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Blood Pressure
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Favorite color="success" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h6">72 bpm</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Heart Rate
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Medication color="info" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h6">3</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active Medications
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Event color="warning" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h6">3</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Upcoming Appointments
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Content Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs 
          value={selectedTab} 
          onChange={(e, newValue) => setSelectedTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Overview" />
          <Tab label="Vitals & Trends" />
          <Tab label="Medications" />
          <Tab label="Appointments" />
          <Tab label="Test Results" />
          <Tab label="Symptoms" />
          <Tab label="AI Insights" />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      {selectedTab === 0 && (
        <Grid container spacing={3}>
          {/* Vitals Chart */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Vital Signs Trends
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={healthData.vitals}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="heartRate" stroke="#8884d8" name="Heart Rate" />
                    <Line type="monotone" dataKey="temperature" stroke="#82ca9d" name="Temperature" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* AI Recommendations */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  AI Recommendations
                </Typography>
                <List dense>
                  {aiInsights.recommendations.map((rec, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <CheckCircle color="primary" />
                      </ListItemIcon>
                      <ListItemText primary={rec} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Recent Activity */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Recent Activity
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" gutterBottom>
                      Recent Appointments
                    </Typography>
                    <List dense>
                      {healthData.appointments.slice(0, 3).map((apt) => (
                        <ListItem key={apt.id}>
                          <ListItemIcon>
                            <Event color="primary" />
                          </ListItemIcon>
                          <ListItemText 
                            primary={`${apt.type} with ${apt.doctor}`}
                            secondary={`${apt.date} at ${apt.time}`}
                          />
                          <Chip label={apt.status} color={getStatusColor(apt.status)} size="small" />
                        </ListItem>
                      ))}
                    </List>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" gutterBottom>
                      Recent Test Results
                    </Typography>
                    <List dense>
                      {healthData.recentTests.slice(0, 3).map((test, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <Assessment color="success" />
                          </ListItemIcon>
                          <ListItemText 
                            primary={test.name}
                            secondary={`${test.date} - ${test.result}`}
                          />
                          <Chip label={test.status} color={getStatusColor(test.status)} size="small" />
                        </ListItem>
                      ))}
                    </List>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {selectedTab === 1 && (
        <Grid container spacing={3}>
          {/* Blood Pressure Chart */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Blood Pressure Trends
                </Typography>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={healthData.vitals}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="bloodPressure" stroke="#ff7300" name="BP" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Weight Chart */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Weight Trends
                </Typography>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={healthData.vitals}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="weight" stroke="#82ca9d" name="Weight (kg)" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Current Vitals */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Current Vital Signs
                </Typography>
                <Grid container spacing={3}>
                  {Object.entries(healthData.vitals[healthData.vitals.length - 1]).map(([key, value]) => {
                    if (key === 'date') return null;
                    return (
                      <Grid item xs={6} sm={3} key={key}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h4" color="primary">
                            {value}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </Typography>
                        </Box>
                      </Grid>
                    );
                  })}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {selectedTab === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">
                    Current Medications
                  </Typography>
                  <Button variant="outlined" startIcon={<Add />}>
                    Add Medication
                  </Button>
                </Box>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Medication</TableCell>
                        <TableCell>Dosage</TableCell>
                        <TableCell>Frequency</TableCell>
                        <TableCell>Start Date</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {healthData.medications.map((med, index) => (
                        <TableRow key={index}>
                          <TableCell>{med.name}</TableCell>
                          <TableCell>{med.dosage}</TableCell>
                          <TableCell>{med.frequency}</TableCell>
                          <TableCell>{med.startDate}</TableCell>
                          <TableCell>
                            <Chip label={med.status} color={getStatusColor(med.status)} size="small" />
                          </TableCell>
                          <TableCell>
                            <IconButton size="small">
                              <Visibility />
                            </IconButton>
                            <IconButton size="small">
                              <Edit />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {selectedTab === 3 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">
                    Upcoming Appointments
                  </Typography>
                  <Button variant="contained" startIcon={<Add />}>
                    Schedule Appointment
                  </Button>
                </Box>
                <Grid container spacing={2}>
                  {healthData.appointments.map((apt) => (
                    <Grid item xs={12} md={6} lg={4} key={apt.id}>
                      <Card variant="outlined">
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                            <Typography variant="h6">
                              {apt.type}
                            </Typography>
                            <Chip label={apt.status} color={getStatusColor(apt.status)} size="small" />
                          </Box>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            <Event sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                            {apt.date} at {apt.time}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            <Person sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                            {apt.doctor}
                          </Typography>
                          <Box sx={{ mt: 2 }}>
                            <Button size="small" variant="outlined" sx={{ mr: 1 }}>
                              Reschedule
                            </Button>
                            <Button size="small" variant="outlined" color="error">
                              Cancel
                            </Button>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {selectedTab === 4 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Test Results
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Test Name</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Result</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {healthData.recentTests.map((test, index) => (
                        <TableRow key={index}>
                          <TableCell>{test.name}</TableCell>
                          <TableCell>{test.date}</TableCell>
                          <TableCell>{test.result}</TableCell>
                          <TableCell>
                            <Chip label={test.status} color={getStatusColor(test.status)} size="small" />
                          </TableCell>
                          <TableCell>
                            <IconButton size="small">
                              <Visibility />
                            </IconButton>
                            <IconButton size="small">
                              <Download />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {selectedTab === 5 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">
                    Symptom Tracker
                  </Typography>
                  <Button variant="contained" startIcon={<Add />}>
                    Log Symptom
                  </Button>
                </Box>
                <Grid container spacing={2}>
                  {healthData.symptoms.map((symptom, index) => (
                    <Grid item xs={12} md={6} lg={4} key={index}>
                      <Card variant="outlined">
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                            <Typography variant="h6">
                              {symptom.symptom}
                            </Typography>
                            <Chip label={symptom.severity} color={getSeverityColor(symptom.severity)} size="small" />
                          </Box>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            <Event sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                            {symptom.date}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Duration: {symptom.duration}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {selectedTab === 6 && (
        <Grid container spacing={3}>
          {/* AI Insights Overview */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  AI Health Analysis
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" gutterBottom>
                      Health Trends
                    </Typography>
                    <List dense>
                      {aiInsights.trends.map((trend, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            {getTrendIcon(trend.trend)}
                          </ListItemIcon>
                          <ListItemText 
                            primary={trend.metric}
                            secondary={`${trend.trend} (${trend.change})`}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" gutterBottom>
                      Risk Factors
                    </Typography>
                    <List dense>
                      {aiInsights.riskFactors.map((risk, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <Warning color="warning" />
                          </ListItemIcon>
                          <ListItemText primary={risk} />
                        </ListItem>
                      ))}
                    </List>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* AI Recommendations */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Personalized Recommendations
                </Typography>
                <List dense>
                  {aiInsights.recommendations.map((rec, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <AutoAwesome color="primary" />
                      </ListItemIcon>
                      <ListItemText primary={rec} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default PatientDashboard;
