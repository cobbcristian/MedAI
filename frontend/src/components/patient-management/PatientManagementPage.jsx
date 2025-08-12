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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  InputAdornment,
  Drawer,
  AppBar,
  Toolbar
} from '@mui/material';
import {
  Search,
  FilterList,
  Sort,
  MoreVert,
  Edit,
  Delete,
  Visibility,
  Add,
  Person,
  LocalHospital,
  Medication,
  CalendarToday,
  VideoCall,
  Chat,
  Notifications,
  Settings,
  CheckCircle,
  Warning,
  Info,
  AccessTime,
  LocationOn,
  Phone,
  Email,
  CalendarToday as CalendarIcon,
  Event,
  Notifications as NotificationsIcon,
  ConfirmationNumber,
  Payment,
  Receipt,
  CameraAlt,
  CameraEnhance,
  CameraFront,
  CameraRear,
  FileCopy,
  Download,
  Share,
  Reply,
  Forward,
  HealthAndSafety,
  MonitorHeart,
  Bloodtype,
  Weight,
  Height,
  Favorite,
  Speed,
  TrendingUp,
  TrendingDown,
  Security,
  Privacy,
  Lock,
  Shield,
  VerifiedUser,
  Support,
  Help,
  QuestionAnswer,
  Assignment,
  Description,
  Assessment,
  Analytics,
  BarChart,
  PieChart,
  LineChart,
  ShowChart,
  Timeline as TimelineIcon,
  History,
  Schedule,
  Alarm,
  Timer,
  Stop,
  PlayArrow,
  Pause,
  SkipNext,
  SkipPrevious,
  VolumeUp,
  VolumeOff,
  Mic,
  MicOff,
  Videocam,
  VideocamOff,
  ScreenShare,
  StopScreenShare,
  RecordVoiceOver,
  Fullscreen,
  FullscreenExit,
  Settings as SettingsIcon,
  Tune,
  Build,
  Code,
  BugReport,
  Report,
  Feedback,
  RateReview,
  Star,
  StarBorder,
  StarHalf,
  ThumbUp,
  ThumbDown,
  ThumbUpOutlined,
  ThumbDownOutlined
} from '@mui/icons-material';
import api from '../../services/api';

const PatientManagementPage = () => {
  const [patients, setPatients] = useState([
    {
      id: 1,
      name: 'John Smith',
      age: 45,
      gender: 'Male',
      email: 'john.smith@email.com',
      phone: '+1 (555) 123-4567',
      status: 'active',
      lastVisit: '2024-01-15',
      nextAppointment: '2024-01-20',
      doctor: 'Dr. Sarah Johnson',
      specialty: 'Cardiology',
      insurance: 'Blue Cross Blue Shield',
      medicalHistory: ['Hypertension', 'Diabetes Type 2'],
      medications: ['Lisinopril', 'Metformin'],
      alerts: ['Blood pressure elevated', 'Medication due']
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      age: 32,
      gender: 'Female',
      email: 'sarah.johnson@email.com',
      phone: '+1 (555) 234-5678',
      status: 'active',
      lastVisit: '2024-01-10',
      nextAppointment: '2024-01-25',
      doctor: 'Dr. Michael Chen',
      specialty: 'Primary Care',
      insurance: 'Aetna',
      medicalHistory: ['Asthma', 'Allergies'],
      medications: ['Albuterol', 'Fluticasone'],
      alerts: ['Asthma flare-up', 'Allergy season']
    },
    {
      id: 3,
      name: 'Michael Brown',
      age: 58,
      gender: 'Male',
      email: 'michael.brown@email.com',
      phone: '+1 (555) 345-6789',
      status: 'inactive',
      lastVisit: '2023-12-20',
      nextAppointment: null,
      doctor: 'Dr. Emily Davis',
      specialty: 'Neurology',
      insurance: 'UnitedHealth',
      medicalHistory: ['Migraine', 'Anxiety'],
      medications: ['Sumatriptan', 'Sertraline'],
      alerts: ['No recent visits', 'Medication review needed']
    }
  ]);

  const [selectedTab, setSelectedTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientDialog, setPatientDialog] = useState(false);
  const [viewDialog, setViewDialog] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const patientStatuses = [
    { value: 'all', label: 'All Patients', icon: <Person /> },
    { value: 'active', label: 'Active', icon: <CheckCircle /> },
    { value: 'inactive', label: 'Inactive', icon: <Warning /> },
    { value: 'new', label: 'New', icon: <Add /> },
    { value: 'urgent', label: 'Urgent', icon: <Warning /> }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'default';
      case 'new': return 'primary';
      case 'urgent': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <CheckCircle />;
      case 'inactive': return <Warning />;
      case 'new': return <Add />;
      case 'urgent': return <Warning />;
      default: return <Info />;
    }
  };

  const handleViewPatient = (patient) => {
    setSelectedPatient(patient);
    setViewDialog(true);
  };

  const handleEditPatient = (patient) => {
    setSelectedPatient(patient);
    setPatientDialog(true);
  };

  const handleDeletePatient = (patientId) => {
    setPatients(patients.filter(p => p.id !== patientId));
  };

  const filteredPatients = selectedTab === 0 
    ? patients 
    : patients.filter(patient => patient.status === patientStatuses[selectedTab]?.value);

  const searchFilteredPatients = filteredPatients.filter(patient =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.doctor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Patient Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setPatientDialog(true)}
        >
          Add Patient
        </Button>
      </Box>

      {/* Search and Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search patients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: <Search />,
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button variant="outlined" startIcon={<FilterList />}>
                Filter
              </Button>
              <Button variant="outlined" startIcon={<Sort />}>
                Sort
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs 
          value={selectedTab} 
          onChange={(e, newValue) => setSelectedTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="All Patients" />
          {patientStatuses.slice(1).map((status) => (
            <Tab 
              key={status.value} 
              label={status.label}
              icon={status.icon}
              iconPosition="start"
            />
          ))}
        </Tabs>
      </Paper>

      {/* Patients Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Patient</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Doctor</TableCell>
                <TableCell>Last Visit</TableCell>
                <TableCell>Next Appointment</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {searchFilteredPatients
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ mr: 2 }}>
                        {patient.name.split(' ').map(n => n[0]).join('')}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2">{patient.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {patient.age} years, {patient.gender}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2">{patient.email}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {patient.phone}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2">{patient.doctor}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {patient.specialty}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {patient.lastVisit ? new Date(patient.lastVisit).toLocaleDateString() : 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {patient.nextAppointment ? new Date(patient.nextAppointment).toLocaleDateString() : 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={getStatusIcon(patient.status)}
                      label={patient.status}
                      color={getStatusColor(patient.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton size="small" onClick={() => handleViewPatient(patient)}>
                        <Visibility />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleEditPatient(patient)}>
                        <Edit />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDeletePatient(patient.id)}>
                        <Delete />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={searchFilteredPatients.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Patient Details Dialog */}
      <Dialog open={viewDialog} onClose={() => setViewDialog(false)} maxWidth="md" fullWidth>
        {selectedPatient && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ mr: 2 }}>
                  {selectedPatient.name.split(' ').map(n => n[0]).join('')}
                </Avatar>
                <Box>
                  <Typography variant="h6">{selectedPatient.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Patient ID: {selectedPatient.id}
                  </Typography>
                </Box>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>Personal Information</Typography>
                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        <Person />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Age & Gender" 
                        secondary={`${selectedPatient.age} years, ${selectedPatient.gender}`} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Email />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Email" 
                        secondary={selectedPatient.email} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Phone />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Phone" 
                        secondary={selectedPatient.phone} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <LocalHospital />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Insurance" 
                        secondary={selectedPatient.insurance} 
                      />
                    </ListItem>
                  </List>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>Medical Information</Typography>
                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        <Person />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Primary Doctor" 
                        secondary={selectedPatient.doctor} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <LocalHospital />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Specialty" 
                        secondary={selectedPatient.specialty} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CalendarToday />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Last Visit" 
                        secondary={selectedPatient.lastVisit ? new Date(selectedPatient.lastVisit).toLocaleDateString() : 'N/A'} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Event />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Next Appointment" 
                        secondary={selectedPatient.nextAppointment ? new Date(selectedPatient.nextAppointment).toLocaleDateString() : 'N/A'} 
                      />
                    </ListItem>
                  </List>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>Medical History</Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {selectedPatient.medicalHistory.map((condition, index) => (
                      <Chip key={index} label={condition} variant="outlined" />
                    ))}
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>Current Medications</Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {selectedPatient.medications.map((medication, index) => (
                      <Chip key={index} label={medication} color="primary" />
                    ))}
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>Alerts</Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {selectedPatient.alerts.map((alert, index) => (
                      <Chip key={index} label={alert} color="warning" />
                    ))}
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setViewDialog(false)}>Close</Button>
              <Button variant="outlined" onClick={() => handleEditPatient(selectedPatient)}>
                Edit Patient
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Add/Edit Patient Dialog */}
      <Dialog open={patientDialog} onClose={() => setPatientDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedPatient ? 'Edit Patient' : 'Add New Patient'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>Personal Information</Typography>
              
              <TextField
                fullWidth
                label="Full Name"
                defaultValue={selectedPatient?.name || ''}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Age"
                type="number"
                defaultValue={selectedPatient?.age || ''}
                sx={{ mb: 2 }}
              />

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Gender</InputLabel>
                <Select label="Gender" defaultValue={selectedPatient?.gender || ''}>
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Email"
                type="email"
                defaultValue={selectedPatient?.email || ''}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Phone"
                defaultValue={selectedPatient?.phone || ''}
                sx={{ mb: 2 }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>Medical Information</Typography>
              
              <TextField
                fullWidth
                label="Primary Doctor"
                defaultValue={selectedPatient?.doctor || ''}
                sx={{ mb: 2 }}
              />

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Specialty</InputLabel>
                <Select label="Specialty" defaultValue={selectedPatient?.specialty || ''}>
                  <MenuItem value="Primary Care">Primary Care</MenuItem>
                  <MenuItem value="Cardiology">Cardiology</MenuItem>
                  <MenuItem value="Neurology">Neurology</MenuItem>
                  <MenuItem value="Dermatology">Dermatology</MenuItem>
                  <MenuItem value="Pediatrics">Pediatrics</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Insurance"
                defaultValue={selectedPatient?.insurance || ''}
                sx={{ mb: 2 }}
              />

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Status</InputLabel>
                <Select label="Status" defaultValue={selectedPatient?.status || 'active'}>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                  <MenuItem value="new">New</MenuItem>
                  <MenuItem value="urgent">Urgent</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPatientDialog(false)}>Cancel</Button>
          <Button variant="contained">
            {selectedPatient ? 'Update Patient' : 'Add Patient'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PatientManagementPage; 