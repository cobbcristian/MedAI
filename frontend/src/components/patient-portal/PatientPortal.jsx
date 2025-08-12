import React, { useState } from 'react';
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
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Chip,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextareaAutosize,
  Alert,
  LinearProgress,
  Divider,
  IconButton,
  Badge,
  Fab,
  Tooltip
} from '@mui/material';
import {
  Person,
  LocalHospital,
  Chat,
  VideoCall,
  CalendarToday,
  Medication,
  Assessment,
  FileUpload,
  Send,
  Add,
  Edit,
  Delete,
  Visibility,
  CheckCircle,
  Warning,
  Info,
  AccessTime,
  LocationOn,
  Phone,
  Email,
  Event,
  Notifications,
  Payment,
  Receipt,
  CameraAlt,
  FileCopy,
  Download,
  Share,
  HealthAndSafety,
  MonitorHeart,
  Bloodtype,
  Weight,
  Height,
  Favorite,
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
  Analytics,
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
  Settings,
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
  ThumbDownOutlined,
  FavoriteBorder,
  Bookmark,
  BookmarkBorder,
  Flag,
  FlagOutlined,
  Block,
  BlockOutlined,
  ReportOutlined,
  Archive,
  ArchiveOutlined,
  DeleteOutlined,
  Restore,
  RestoreFromTrash,
  Undo,
  Redo,
  Refresh,
  Sync,
  CloudUpload,
  CloudDownload,
  CloudSync,
  Backup,
  Save,
  SaveAlt,
  Print,
  ShareOutlined,
  Link,
  LinkOff,
  ContentCopy,
  ContentPaste,
  Cut,
  SelectAll,
  FindInPage,
  FindReplace,
  ZoomIn,
  ZoomOut,
  Fullscreen as FullscreenIcon,
  FullscreenExit as FullscreenExitIcon,
  OpenInNew,
  OpenInBrowser,
  Launch,
  ExitToApp,
  Logout,
  Login,
  PersonAdd,
  PersonRemove,
  Group,
  GroupAdd,
  GroupRemove,
  SupervisorAccount,
  AdminPanelSettings,
  Security as SecurityIcon,
  VpnKey,
  Lock as LockIcon,
  LockOpen,
  LockOutline,
  LockPerson,
  LockReset,
  Password,
  Key,
  KeyOff,
  Visibility as VisibilityIcon,
  VisibilityOff,
  VerifiedUser as VerifiedUserIcon,
  VerifiedUserOutlined,
  Badge as BadgeIcon,
  BadgeOutlined,
  CardMembership,
  CardGiftcard,
  CardTravel,
  CreditCard,
  CreditCardOff,
  CreditScore,
  AccountBalance,
  AccountBalanceWallet,
  AccountBox,
  AccountCircle,
  AccountTree,
  AccountTreeOutlined,
  Business,
  BusinessCenter,
  BusinessCenterOutlined,
  CorporateFare,
  CorporateFareOutlined,
  Domain,
  DomainDisabled,
  DomainVerification,
  Home,
  HomeOutlined,
  HomeWork,
  HomeWorkOutlined,
  House,
  HouseOutlined,
  LocationCity,
  LocationCityOutlined,
  LocationOff,
  LocationOn as LocationOnIcon,
  LocationOnOutlined,
  MyLocation,
  Navigation,
  NavigationOutlined,
  NearMe,
  NearMeOutlined,
  Place,
  PlaceOutlined,
  Room,
  RoomOutlined,
  Satellite,
  SatelliteAlt,
  SatelliteAltOutlined,
  SatelliteOutlined,
  Streetview,
  StreetviewOutlined,
  Terrain,
  TerrainOutlined,
  Traffic,
  TrafficOutlined,
  Train,
  TrainOutlined,
  Tram,
  TramOutlined,
  Directions,
  DirectionsBike,
  DirectionsBikeOutlined,
  DirectionsBoat,
  DirectionsBoatOutlined,
  DirectionsBus,
  DirectionsBusOutlined,
  DirectionsCar,
  DirectionsCarOutlined,
  DirectionsOff,
  DirectionsOffOutlined,
  DirectionsRailway,
  DirectionsRailwayOutlined,
  DirectionsRun,
  DirectionsRunOutlined,
  DirectionsSubway,
  DirectionsSubwayOutlined,
  DirectionsTransit,
  DirectionsTransitOutlined,
  DirectionsWalk,
  DirectionsWalkOutlined,
  Flight,
  FlightLand,
  FlightTakeoff,
  FlightOutlined,
  FlightLandOutlined,
  FlightTakeoffOutlined,
  Hotel,
  HotelOutlined,
  LocalAirport,
  LocalAirportOutlined,
  LocalAtm,
  LocalAtmOutlined,
  LocalBar,
  LocalBarOutlined,
  LocalCafe,
  LocalCafeOutlined,
  LocalCarWash,
  LocalCarWashOutlined,
  LocalConvenienceStore,
  LocalConvenienceStoreOutlined,
  LocalDining,
  LocalDiningOutlined,
  LocalDrink,
  LocalDrinkOutlined,
  LocalFlorist,
  LocalFloristOutlined,
  LocalGasStation,
  LocalGasStationOutlined,
  LocalGroceryStore,
  LocalGroceryStoreOutlined,
  LocalHospital as LocalHospitalIcon,
  LocalHospitalOutlined,
  LocalHotel,
  LocalHotelOutlined,
  LocalLaundryService,
  LocalLaundryServiceOutlined,
  LocalLibrary,
  LocalLibraryOutlined,
  LocalMall,
  LocalMallOutlined,
  LocalMovies,
  LocalMoviesOutlined,
  LocalOffer,
  LocalOfferOutlined,
  LocalParking,
  LocalParkingOutlined,
  LocalPharmacy,
  LocalPharmacyOutlined,
  LocalPizza,
  LocalPizzaOutlined,
  LocalPlay,
  LocalPlayOutlined,
  LocalPostOffice,
  LocalPostOfficeOutlined,
  LocalPrintshop,
  LocalPrintshopOutlined,
  LocalSee,
  LocalSeeOutlined,
  LocalShipping,
  LocalShippingOutlined,
  LocalTaxi,
  LocalTaxiOutlined,
  LocalTheater,
  LocalTheaterOutlined,
  LocalActivity,
  LocalActivityOutlined,
  Thermostat
} from '@mui/icons-material';

const PatientPortal = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [loginDialog, setLoginDialog] = useState(false);
  const [adviceDialog, setAdviceDialog] = useState(false);
  const [symptomDialog, setSymptomDialog] = useState(false);
  const [contactDialog, setContactDialog] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);

  const [user, setUser] = useState({
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '+1 (555) 123-4567',
    dateOfBirth: '1985-03-15',
    insurance: 'Blue Cross Blue Shield',
    primaryDoctor: 'Dr. Sarah Johnson'
  });

  const [medicalQuestions, setMedicalQuestions] = useState([
    {
      id: 1,
      question: 'What are the side effects of my blood pressure medication?',
      category: 'medication',
      status: 'answered',
      answer: 'Common side effects include dizziness, fatigue, and dry cough. Contact your doctor if you experience severe symptoms.',
      doctor: 'Dr. Sarah Johnson',
      date: '2024-01-15'
    },
    {
      id: 2,
      question: 'When should I schedule my next checkup?',
      category: 'appointment',
      status: 'pending',
      answer: '',
      doctor: '',
      date: '2024-01-18'
    }
  ]);

  const [symptoms, setSymptoms] = useState([
    {
      id: 1,
      symptoms: 'Headache, fatigue, mild fever',
      severity: 'mild',
      status: 'reviewed',
      diagnosis: 'Common cold',
      recommendations: 'Rest, fluids, over-the-counter pain relievers',
      date: '2024-01-10'
    }
  ]);

  const [doctors, setDoctors] = useState([
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      specialty: 'Cardiology',
      available: true,
      rating: 4.8,
      nextAvailable: '2024-01-25 14:00'
    },
    {
      id: 2,
      name: 'Dr. Michael Chen',
      specialty: 'Primary Care',
      available: true,
      rating: 4.9,
      nextAvailable: '2024-01-22 10:30'
    },
    {
      id: 3,
      name: 'Dr. Emily Davis',
      specialty: 'Emergency Medicine',
      available: false,
      rating: 4.7,
      nextAvailable: '2024-01-26 09:00'
    }
  ]);

  const handleLogin = async (credentials) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsLoggedIn(true);
      setLoginDialog(false);
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitQuestion = async (questionData) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newQuestion = {
        id: medicalQuestions.length + 1,
        ...questionData,
        status: 'pending',
        date: new Date().toISOString().split('T')[0]
      };
      
      setMedicalQuestions([newQuestion, ...medicalQuestions]);
      setAdviceDialog(false);
    } catch (error) {
      console.error('Question submission failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitSymptoms = async (symptomData) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newSymptom = {
        id: symptoms.length + 1,
        ...symptomData,
        status: 'pending',
        date: new Date().toISOString().split('T')[0]
      };
      
      setSymptoms([newSymptom, ...symptoms]);
      setSymptomDialog(false);
    } catch (error) {
      console.error('Symptom submission failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleContactDoctor = async (contactData) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setContactDialog(false);
    } catch (error) {
      console.error('Contact request failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'answered': return 'success';
      case 'pending': return 'warning';
      case 'reviewed': return 'info';
      case 'mild': return 'success';
      case 'moderate': return 'warning';
      case 'severe': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'answered': return <CheckCircle />;
      case 'pending': return <Schedule />;
      case 'reviewed': return <Info />;
      case 'mild': return <CheckCircle />;
      case 'moderate': return <Warning />;
      case 'severe': return <Warning />;
      default: return <Info />;
    }
  };

  if (!isLoggedIn) {
    return (
      <Container maxWidth="md">
        <Box sx={{ mt: 8, textAlign: 'center' }}>
          <Typography variant="h3" component="h1" gutterBottom>
            Patient Portal
          </Typography>
          <Typography variant="h6" color="text.secondary" paragraph>
            Access your health information, ask questions, and connect with your healthcare team
          </Typography>
          
          <Card sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Welcome Back
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Log in to access your patient portal
              </Typography>
              
              <TextField
                fullWidth
                label="Email"
                type="email"
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
                sx={{ mb: 3 }}
              />
              
              <Button
                variant="contained"
                fullWidth
                onClick={() => handleLogin({ email: 'demo@email.com', password: 'demo' })}
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Log In'}
              </Button>
              
              <Button
                variant="text"
                fullWidth
                sx={{ mt: 1 }}
                onClick={() => setIsLoggedIn(true)}
              >
                Demo Login
              </Button>
            </CardContent>
          </Card>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Patient Portal
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome back, {user.name}. How can we help you today?
        </Typography>
      </Box>

      {/* Quick Actions */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', cursor: 'pointer' }} onClick={() => setAdviceDialog(true)}>
            <CardContent sx={{ textAlign: 'center' }}>
              <QuestionAnswer sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Ask Medical Question
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Get expert advice from your doctors
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', cursor: 'pointer' }} onClick={() => setSymptomDialog(true)}>
            <CardContent sx={{ textAlign: 'center' }}>
              <LocalHospital sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Submit Symptoms
              </Typography>
              <Typography variant="body2" color="text.secondary">
                AI-powered symptom analysis
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', cursor: 'pointer' }} onClick={() => setContactDialog(true)}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Chat sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Contact Doctor
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Message your healthcare team
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', cursor: 'pointer' }} onClick={() => window.location.href = '/appointments'}>
            <CardContent sx={{ textAlign: 'center' }}>
              <CalendarToday sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Book Appointment
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Schedule consultations
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs 
          value={selectedTab} 
          onChange={(e, newValue) => setSelectedTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Medical Questions" />
          <Tab label="Symptoms" />
          <Tab label="Available Doctors" />
          <Tab label="Profile" />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      {selectedTab === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Medical Questions</Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setAdviceDialog(true)}
              >
                Ask Question
              </Button>
            </Box>
          </Grid>
          {medicalQuestions.map((question) => (
            <Grid item xs={12} key={question.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      {question.question}
                    </Typography>
                    <Chip
                      icon={getStatusIcon(question.status)}
                      label={question.status}
                      color={getStatusColor(question.status)}
                      size="small"
                    />
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Category: {question.category} • Date: {question.date}
                  </Typography>
                  
                  {question.status === 'answered' && (
                    <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Answer from {question.doctor}:
                      </Typography>
                      <Typography variant="body2">
                        {question.answer}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {selectedTab === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Symptom Submissions</Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setSymptomDialog(true)}
              >
                Submit Symptoms
              </Button>
            </Box>
          </Grid>
          {symptoms.map((symptom) => (
            <Grid item xs={12} key={symptom.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Symptoms: {symptom.symptoms}
                    </Typography>
                    <Chip
                      icon={getStatusIcon(symptom.severity)}
                      label={symptom.severity}
                      color={getStatusColor(symptom.severity)}
                      size="small"
                    />
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Status: {symptom.status} • Date: {symptom.date}
                  </Typography>
                  
                  {symptom.diagnosis && (
                    <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Analysis:
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        <strong>Diagnosis:</strong> {symptom.diagnosis}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Recommendations:</strong> {symptom.recommendations}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {selectedTab === 2 && (
        <Grid container spacing={3}>
          {doctors.map((doctor) => (
            <Grid item xs={12} sm={6} md={4} key={doctor.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                      {doctor.name.split(' ').map(n => n[0]).join('')}
                    </Avatar>
                    <Box>
                      <Typography variant="h6">{doctor.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {doctor.specialty}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Star sx={{ color: 'warning.main', mr: 0.5 }} />
                    <Typography variant="body2">
                      {doctor.rating} Rating
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Chip
                      label={doctor.available ? 'Available' : 'Unavailable'}
                      color={doctor.available ? 'success' : 'default'}
                      size="small"
                    />
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Next Available: {doctor.nextAvailable}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<Chat />}
                      onClick={() => setContactDialog(true)}
                    >
                      Message
                    </Button>
                    <Button
                      size="small"
                      variant="contained"
                      startIcon={<VideoCall />}
                      onClick={() => window.location.href = '/video-calls'}
                    >
                      Video Call
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {selectedTab === 3 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Personal Information
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <Person />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Name" 
                      secondary={user.name} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Email />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Email" 
                      secondary={user.email} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Phone />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Phone" 
                      secondary={user.phone} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Event />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Date of Birth" 
                      secondary={user.dateOfBirth} 
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Healthcare Information
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <LocalHospital />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Insurance" 
                      secondary={user.insurance} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Person />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Primary Doctor" 
                      secondary={user.primaryDoctor} 
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Ask Medical Question Dialog */}
      <Dialog open={adviceDialog} onClose={() => setAdviceDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Ask Medical Question</DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Category</InputLabel>
                <Select label="Category" defaultValue="general">
                  <MenuItem value="general">General Health</MenuItem>
                  <MenuItem value="medication">Medication</MenuItem>
                  <MenuItem value="appointment">Appointment</MenuItem>
                  <MenuItem value="test">Test Results</MenuItem>
                  <MenuItem value="emergency">Emergency</MenuItem>
                </Select>
              </FormControl>
              
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Your Question"
                placeholder="Describe your medical question in detail..."
                sx={{ mb: 2 }}
              />
              
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Preferred Doctor</InputLabel>
                <Select label="Preferred Doctor">
                  <MenuItem value="">Any Available Doctor</MenuItem>
                  {doctors.filter(d => d.available).map((doctor) => (
                    <MenuItem key={doctor.id} value={doctor.id}>
                      {doctor.name} - {doctor.specialty}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              {loading && (
                <Box sx={{ width: '100%' }}>
                  <LinearProgress />
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Submitting question...
                  </Typography>
                </Box>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAdviceDialog(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={() => handleSubmitQuestion({
              question: 'What are the side effects of my current medication?',
              category: 'medication',
              doctor: 'Dr. Sarah Johnson'
            })}
            disabled={loading}
          >
            Submit Question
          </Button>
        </DialogActions>
      </Dialog>

      {/* Submit Symptoms Dialog */}
      <Dialog open={symptomDialog} onClose={() => setSymptomDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Submit Symptoms</DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Describe Your Symptoms"
                placeholder="Please describe your symptoms in detail, including when they started, severity, and any other relevant information..."
                sx={{ mb: 2 }}
              />
              
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Severity</InputLabel>
                <Select label="Severity" defaultValue="mild">
                  <MenuItem value="mild">Mild</MenuItem>
                  <MenuItem value="moderate">Moderate</MenuItem>
                  <MenuItem value="severe">Severe</MenuItem>
                </Select>
              </FormControl>
              
              <TextField
                fullWidth
                label="Duration"
                placeholder="How long have you been experiencing these symptoms?"
                sx={{ mb: 2 }}
              />
              
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Urgency</InputLabel>
                <Select label="Urgency" defaultValue="normal">
                  <MenuItem value="normal">Normal - Can wait for response</MenuItem>
                  <MenuItem value="urgent">Urgent - Need quick response</MenuItem>
                  <MenuItem value="emergency">Emergency - Need immediate attention</MenuItem>
                </Select>
              </FormControl>
              
              {loading && (
                <Box sx={{ width: '100%' }}>
                  <LinearProgress />
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Analyzing symptoms...
                  </Typography>
                </Box>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSymptomDialog(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={() => handleSubmitSymptoms({
              symptoms: 'Headache, fatigue, mild fever',
              severity: 'mild',
              duration: '2 days',
              urgency: 'normal'
            })}
            disabled={loading}
          >
            Submit Symptoms
          </Button>
        </DialogActions>
      </Dialog>

      {/* Contact Doctor Dialog */}
      <Dialog open={contactDialog} onClose={() => setContactDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Contact Doctor</DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Select Doctor</InputLabel>
                <Select label="Select Doctor">
                  {doctors.filter(d => d.available).map((doctor) => (
                    <MenuItem key={doctor.id} value={doctor.id}>
                      {doctor.name} - {doctor.specialty}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Subject</InputLabel>
                <Select label="Subject" defaultValue="general">
                  <MenuItem value="general">General Question</MenuItem>
                  <MenuItem value="medication">Medication Question</MenuItem>
                  <MenuItem value="appointment">Appointment Request</MenuItem>
                  <MenuItem value="test">Test Results</MenuItem>
                  <MenuItem value="emergency">Emergency</MenuItem>
                </Select>
              </FormControl>
              
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Message"
                placeholder="Type your message here..."
                sx={{ mb: 2 }}
              />
              
              {loading && (
                <Box sx={{ width: '100%' }}>
                  <LinearProgress />
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Sending message...
                  </Typography>
                </Box>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setContactDialog(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={() => handleContactDoctor({
              doctor: 'Dr. Sarah Johnson',
              subject: 'general',
              message: 'I have a question about my medication.'
            })}
            disabled={loading}
          >
            Send Message
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PatientPortal;
