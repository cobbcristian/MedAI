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
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Switch,
  FormControlLabel,
  Slider,
  Radio,
  RadioGroup,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  People,
  Person,
  Add,
  Edit,
  Delete,
  Visibility,
  History,
  Security,
  CloudUpload,
  FileCopy,
  Print,
  Lock,
  Public,
  Verified,
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
  Timeline,
  TrendingUp,
  TrendingDown,
  Compare,
  School,
  AutoFixHigh,
  Lightbulb,
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
  Lightbulb as LightbulbIcon,
  Phone,
  Email,
  LocationOn,
  CalendarToday,
  AccessTime,
  LocalHospital,
  Medication,
  Assignment,
  Assessment
} from '@mui/icons-material';

const PatientManagementPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [addPatientDialog, setAddPatientDialog] = useState(false);
  const [carePlanDialog, setCarePlanDialog] = useState(false);
  const [progressDialog, setProgressDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock patient data
  const [patients] = useState([
    {
      id: 1,
      name: 'Sarah Johnson',
      age: 34,
      gender: 'Female',
      email: 'sarah.johnson@email.com',
      phone: '+1 (555) 123-4567',
      status: 'active',
      lastVisit: '2024-01-15',
      nextAppointment: '2024-01-25',
      primaryCondition: 'Diabetes Type 2',
      riskLevel: 'medium',
      avatar: 'SJ',
      carePlan: 'Diabetes Management',
      progress: 75
    },
    {
      id: 2,
      name: 'Michael Chen',
      age: 28,
      gender: 'Male',
      email: 'michael.chen@email.com',
      phone: '+1 (555) 234-5678',
      status: 'active',
      lastVisit: '2024-01-12',
      nextAppointment: '2024-01-30',
      primaryCondition: 'Hypertension',
      riskLevel: 'low',
      avatar: 'MC',
      carePlan: 'Blood Pressure Control',
      progress: 90
    },
    {
      id: 3,
      name: 'Emily Davis',
      age: 45,
      gender: 'Female',
      email: 'emily.davis@email.com',
      phone: '+1 (555) 345-6789',
      status: 'active',
      lastVisit: '2024-01-10',
      nextAppointment: '2024-01-28',
      primaryCondition: 'Asthma',
      riskLevel: 'high',
      avatar: 'ED',
      carePlan: 'Asthma Management',
      progress: 60
    },
    {
      id: 4,
      name: 'Robert Wilson',
      age: 52,
      gender: 'Male',
      email: 'robert.wilson@email.com',
      phone: '+1 (555) 456-7890',
      status: 'inactive',
      lastVisit: '2023-12-20',
      nextAppointment: null,
      primaryCondition: 'Heart Disease',
      riskLevel: 'high',
      avatar: 'RW',
      carePlan: 'Cardiac Rehabilitation',
      progress: 40
    },
    {
      id: 5,
      name: 'Lisa Thompson',
      age: 39,
      gender: 'Female',
      email: 'lisa.thompson@email.com',
      phone: '+1 (555) 567-8901',
      status: 'active',
      lastVisit: '2024-01-08',
      nextAppointment: '2024-01-22',
      primaryCondition: 'Depression',
      riskLevel: 'medium',
      avatar: 'LT',
      carePlan: 'Mental Health Support',
      progress: 85
    }
  ]);

  const [carePlans] = useState([
    {
      id: 1,
      patientId: 1,
      title: 'Diabetes Management',
      type: 'Chronic Disease',
      status: 'active',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      goals: ['Blood sugar control', 'Weight management', 'Exercise routine'],
      medications: ['Metformin', 'Insulin'],
      progress: 75
    },
    {
      id: 2,
      patientId: 2,
      title: 'Blood Pressure Control',
      type: 'Preventive Care',
      status: 'active',
      startDate: '2024-01-01',
      endDate: '2024-06-30',
      goals: ['BP < 140/90', 'Salt reduction', 'Regular exercise'],
      medications: ['Lisinopril'],
      progress: 90
    },
    {
      id: 3,
      patientId: 3,
      title: 'Asthma Management',
      type: 'Respiratory',
      status: 'active',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      goals: ['Symptom control', 'Peak flow monitoring', 'Trigger avoidance'],
      medications: ['Albuterol', 'Fluticasone'],
      progress: 60
    }
  ]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handlePatientClick = (patient) => {
    setSelectedPatient(patient);
  };

  const handleAddPatient = () => {
    setAddPatientDialog(true);
  };

  const handleCarePlan = () => {
    setCarePlanDialog(true);
  };

  const handleProgress = () => {
    setProgressDialog(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'error';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'low': return 'success';
      case 'medium': return 'warning';
      case 'high': return 'error';
      default: return 'default';
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'success';
    if (progress >= 60) return 'primary';
    if (progress >= 40) return 'warning';
    return 'error';
  };

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.primaryCondition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Patient Management
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Assessment />}
            onClick={handleProgress}
          >
            Progress Reports
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAddPatient}
          >
            Add Patient
          </Button>
        </Box>
      </Box>

      <Paper sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab label={`All Patients (${patients.length})`} />
          <Tab label="Care Plans" />
          <Tab label="Progress Tracking" />
          <Tab label="Analytics" />
        </Tabs>
      </Paper>

      {activeTab === 0 && (
        <Box>
          <TextField
            fullWidth
            label="Search patients..."
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mb: 3 }}
          />
          
          <Grid container spacing={3}>
            {filteredPatients.map((patient) => (
              <Grid item xs={12} md={6} lg={4} key={patient.id}>
                <Card 
                  sx={{ 
                    height: '100%',
                    cursor: 'pointer',
                    '&:hover': { boxShadow: 4 }
                  }}
                  onClick={() => handlePatientClick(patient)}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          {patient.avatar}
                        </Avatar>
                        <Box>
                          <Typography variant="h6" component="h3">
                            {patient.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {patient.age} years • {patient.gender}
                          </Typography>
                        </Box>
                      </Box>
                      <Chip 
                        label={patient.status} 
                        size="small" 
                        color={getStatusColor(patient.status)}
                      />
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        <Email fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
                        {patient.email}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        <Phone fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
                        {patient.phone}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        {patient.primaryCondition}
                      </Typography>
                      <Chip 
                        label={patient.riskLevel} 
                        size="small" 
                        color={getRiskColor(patient.riskLevel)}
                      />
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Care Plan Progress
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={patient.progress} 
                        color={getProgressColor(patient.progress)}
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        {patient.progress}% complete
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="caption" color="text.secondary">
                        Next: {patient.nextAppointment || 'No appointment'}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton size="small">
                          <Visibility fontSize="small" />
                        </IconButton>
                        <IconButton size="small">
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton size="small">
                          <Assignment fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {activeTab === 1 && (
        <Box>
          <Typography variant="h6" gutterBottom>Care Plans</Typography>
          <Grid container spacing={3}>
            {carePlans.map((plan) => (
              <Grid item xs={12} md={6} key={plan.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h6">{plan.title}</Typography>
                      <Chip label={plan.status} size="small" color={getStatusColor(plan.status)} />
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Type: {plan.type}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Duration: {plan.startDate} - {plan.endDate}
                    </Typography>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Goals:
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {plan.goals.map((goal) => (
                          <Chip key={goal} label={goal} size="small" variant="outlined" />
                        ))}
                      </Box>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Medications:
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {plan.medications.map((med) => (
                          <Chip key={med} label={med} size="small" color="primary" />
                        ))}
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Progress
                        </Typography>
                        <LinearProgress 
                          variant="determinate" 
                          value={plan.progress} 
                          color={getProgressColor(plan.progress)}
                          sx={{ width: 100, height: 6 }}
                        />
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button size="small" variant="outlined">Edit</Button>
                        <Button size="small" variant="outlined">View</Button>
                      </Box>
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
          <Typography variant="h6" gutterBottom>Progress Tracking</Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Patient Progress Overview</Typography>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Patient</TableCell>
                          <TableCell>Care Plan</TableCell>
                          <TableCell>Progress</TableCell>
                          <TableCell>Last Update</TableCell>
                          <TableCell>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {patients.slice(0, 5).map((patient) => (
                          <TableRow key={patient.id}>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Avatar sx={{ width: 32, height: 32 }}>
                                  {patient.avatar}
                                </Avatar>
                                <Box>
                                  <Typography variant="body2">{patient.name}</Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {patient.primaryCondition}
                                  </Typography>
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell>{patient.carePlan}</TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <LinearProgress 
                                  variant="determinate" 
                                  value={patient.progress} 
                                  color={getProgressColor(patient.progress)}
                                  sx={{ width: 60, height: 6 }}
                                />
                                <Typography variant="body2">{patient.progress}%</Typography>
                              </Box>
                            </TableCell>
                            <TableCell>{patient.lastVisit}</TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', gap: 1 }}>
                                <IconButton size="small">
                                  <Visibility fontSize="small" />
                                </IconButton>
                                <IconButton size="small">
                                  <Edit fontSize="small" />
                                </IconButton>
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Quick Stats</Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Active Patients
                      </Typography>
                      <Typography variant="h4" color="primary">
                        {patients.filter(p => p.status === 'active').length}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Average Progress
                      </Typography>
                      <Typography variant="h4" color="success.main">
                        {Math.round(patients.reduce((acc, p) => acc + p.progress, 0) / patients.length)}%
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        High Risk Patients
                      </Typography>
                      <Typography variant="h4" color="error.main">
                        {patients.filter(p => p.riskLevel === 'high').length}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}

      {activeTab === 3 && (
        <Box>
          <Typography variant="h6" gutterBottom>Patient Analytics</Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Risk Distribution</Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2">Low Risk</Typography>
                      <Chip label={patients.filter(p => p.riskLevel === 'low').length} color="success" />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2">Medium Risk</Typography>
                      <Chip label={patients.filter(p => p.riskLevel === 'medium').length} color="warning" />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2">High Risk</Typography>
                      <Chip label={patients.filter(p => p.riskLevel === 'high').length} color="error" />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Progress Distribution</Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2">Excellent (80%+)</Typography>
                      <Chip label={patients.filter(p => p.progress >= 80).length} color="success" />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2">Good (60-79%)</Typography>
                      <Chip label={patients.filter(p => p.progress >= 60 && p.progress < 80).length} color="primary" />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2">Needs Attention (&lt;60%)</Typography>
                      <Chip label={patients.filter(p => p.progress < 60).length} color="warning" />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Add Patient Dialog */}
      <Dialog open={addPatientDialog} onClose={() => setAddPatientDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add New Patient</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="First Name" />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Last Name" />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Email" type="email" />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Phone" />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Age" type="number" />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Gender</InputLabel>
                <Select label="Gender">
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Primary Condition" />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Risk Level</InputLabel>
                <Select label="Risk Level">
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Initial Care Plan" />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddPatientDialog(false)}>Cancel</Button>
          <Button variant="contained">Add Patient</Button>
        </DialogActions>
      </Dialog>

      {/* Patient Details Dialog */}
      <Dialog open={!!selectedPatient} onClose={() => setSelectedPatient(null)} maxWidth="lg" fullWidth>
        {selectedPatient && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ width: 48, height: 48 }}>
                    {selectedPatient.avatar}
                  </Avatar>
                  <Box>
                    <Typography variant="h5">{selectedPatient.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedPatient.age} years • {selectedPatient.gender}
                    </Typography>
                  </Box>
                </Box>
                <Chip label={selectedPatient.status} color={getStatusColor(selectedPatient.status)} />
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>Contact Information</Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      <Email fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
                      {selectedPatient.email}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <Phone fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
                      {selectedPatient.phone}
                    </Typography>
                  </Box>

                  <Typography variant="h6" gutterBottom>Medical Information</Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Primary Condition: {selectedPatient.primaryCondition}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Risk Level: 
                      <Chip 
                        label={selectedPatient.riskLevel} 
                        size="small" 
                        color={getRiskColor(selectedPatient.riskLevel)}
                        sx={{ ml: 1 }}
                      />
                    </Typography>
                  </Box>

                  <Typography variant="h6" gutterBottom>Appointments</Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Last Visit: {selectedPatient.lastVisit}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Next Appointment: {selectedPatient.nextAppointment || 'Not scheduled'}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>Care Plan Progress</Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {selectedPatient.carePlan}
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={selectedPatient.progress} 
                      color={getProgressColor(selectedPatient.progress)}
                      sx={{ height: 10, borderRadius: 5, mb: 1 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {selectedPatient.progress}% complete
                    </Typography>
                  </Box>

                  <Typography variant="h6" gutterBottom>Quick Actions</Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Button variant="outlined" startIcon={<Assignment />}>
                      View Care Plan
                    </Button>
                    <Button variant="outlined" startIcon={<CalendarToday />}>
                      Schedule Appointment
                    </Button>
                    <Button variant="outlined" startIcon={<Assessment />}>
                      View Progress
                    </Button>
                    <Button variant="outlined" startIcon={<Edit />}>
                      Edit Patient Info
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSelectedPatient(null)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default PatientManagementPage; 