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
  ThumbDownOutlined,
  FavoriteBorder,
  Bookmark,
  BookmarkBorder,
  Flag,
  FlagOutlined,
  Block,
  BlockOutlined,
  Report as ReportIcon,
  ReportOutlined,
  Archive,
  ArchiveOutlined,
  Delete as DeleteIcon,
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
  Share as ShareIcon,
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
  LocalTheaterOutlined
} from '@mui/icons-material';
import api from '../../services/api';

const CrisisDashboardPage = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [crisisMode, setCrisisMode] = useState(false);
  const [emergencyAlerts, setEmergencyAlerts] = useState([
    {
      id: 1,
      type: 'critical',
      patient: 'John Smith',
      condition: 'Cardiac Arrest',
      location: 'Emergency Room',
      timestamp: '2024-01-20 15:30:00',
      status: 'active',
      priority: 'high'
    },
    {
      id: 2,
      type: 'urgent',
      patient: 'Sarah Johnson',
      condition: 'Severe Bleeding',
      location: 'Trauma Unit',
      timestamp: '2024-01-20 15:25:00',
      status: 'active',
      priority: 'high'
    },
    {
      id: 3,
      type: 'warning',
      patient: 'Michael Brown',
      condition: 'Respiratory Distress',
      location: 'ICU',
      timestamp: '2024-01-20 15:20:00',
      status: 'monitoring',
      priority: 'medium'
    }
  ]);

  const [emergencyResources, setEmergencyResources] = useState([
    {
      id: 1,
      type: 'Ambulance',
      status: 'available',
      location: 'Station A',
      eta: '5 minutes',
      crew: 'Team Alpha'
    },
    {
      id: 2,
      type: 'Helicopter',
      status: 'en-route',
      location: 'Airport',
      eta: '15 minutes',
      crew: 'Team Bravo'
    },
    {
      id: 3,
      type: 'Emergency Response',
      status: 'available',
      location: 'Station B',
      eta: '8 minutes',
      crew: 'Team Charlie'
    }
  ]);

  const [crisisProtocols, setCrisisProtocols] = useState([
    {
      id: 1,
      name: 'Mass Casualty Protocol',
      status: 'standby',
      description: 'Emergency response for multiple casualties',
      lastActivated: '2024-01-15'
    },
    {
      id: 2,
      name: 'Pandemic Response',
      status: 'active',
      description: 'COVID-19 and infectious disease protocols',
      lastActivated: '2024-01-10'
    },
    {
      id: 3,
      name: 'Natural Disaster',
      status: 'standby',
      description: 'Earthquake, flood, and storm response',
      lastActivated: '2023-12-20'
    }
  ]);

  const [staffStatus, setStaffStatus] = useState([
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      role: 'Emergency Physician',
      status: 'on-duty',
      location: 'ER',
      availability: 'available'
    },
    {
      id: 2,
      name: 'Dr. Michael Chen',
      role: 'Trauma Surgeon',
      status: 'on-duty',
      location: 'OR',
      availability: 'busy'
    },
    {
      id: 3,
      name: 'Nurse Lisa Thompson',
      role: 'ICU Nurse',
      status: 'on-duty',
      location: 'ICU',
      availability: 'available'
    }
  ]);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'default';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'error';
      case 'monitoring': return 'warning';
      case 'resolved': return 'success';
      case 'available': return 'success';
      case 'en-route': return 'warning';
      case 'busy': return 'warning';
      case 'on-duty': return 'success';
      case 'off-duty': return 'default';
      case 'standby': return 'info';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <Warning />;
      case 'monitoring': return <Warning />;
      case 'resolved': return <CheckCircle />;
      case 'available': return <CheckCircle />;
      case 'en-route': return <Schedule />;
      case 'busy': return <Warning />;
      case 'on-duty': return <CheckCircle />;
      case 'off-duty': return <Info />;
      case 'standby': return <Info />;
      default: return <Info />;
    }
  };

  const handleCrisisModeToggle = () => {
    setCrisisMode(!crisisMode);
  };

  const handleEmergencyResponse = (alertId) => {
    // Implement emergency response logic
    console.log('Responding to emergency:', alertId);
  };

  const handleResourceDispatch = (resourceId) => {
    // Implement resource dispatch logic
    console.log('Dispatching resource:', resourceId);
  };

  const activateProtocol = (protocolId) => {
    // Implement protocol activation logic
    console.log('Activating protocol:', protocolId);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Crisis Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Emergency management and crisis response system
        </Typography>
      </Box>

      {/* Crisis Mode Toggle */}
      <Alert 
        severity={crisisMode ? "error" : "info"} 
        sx={{ mb: 3 }}
        action={
          <FormControlLabel
            control={
              <Switch
                checked={crisisMode}
                onChange={handleCrisisModeToggle}
                color="error"
              />
            }
            label="Crisis Mode"
          />
        }
      >
        {crisisMode ? "CRISIS MODE ACTIVE - Emergency protocols enabled" : "Normal operations - Crisis mode available"}
      </Alert>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs 
          value={selectedTab} 
          onChange={(e, newValue) => setSelectedTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Emergency Alerts" />
          <Tab label="Resources" />
          <Tab label="Protocols" />
          <Tab label="Staff Status" />
        </Tabs>
      </Paper>

      {/* Emergency Alerts */}
      {selectedTab === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Active Emergency Alerts
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Patient</TableCell>
                        <TableCell>Condition</TableCell>
                        <TableCell>Location</TableCell>
                        <TableCell>Priority</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Time</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {emergencyAlerts.map((alert) => (
                        <TableRow key={alert.id}>
                          <TableCell>
                            <Typography variant="subtitle2">{alert.patient}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">{alert.condition}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">{alert.location}</Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={alert.priority}
                              color={getPriorityColor(alert.priority)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Chip
                              icon={getStatusIcon(alert.status)}
                              label={alert.status}
                              color={getStatusColor(alert.status)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {new Date(alert.timestamp).toLocaleTimeString()}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Button 
                                size="small" 
                                variant="contained" 
                                color="error"
                                onClick={() => handleEmergencyResponse(alert.id)}
                              >
                                Respond
                              </Button>
                              <Button size="small" variant="outlined">
                                Details
                              </Button>
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
        </Grid>
      )}

      {/* Resources */}
      {selectedTab === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Emergency Resources
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Resource</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Location</TableCell>
                        <TableCell>ETA</TableCell>
                        <TableCell>Crew</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {emergencyResources.map((resource) => (
                        <TableRow key={resource.id}>
                          <TableCell>
                            <Typography variant="subtitle2">{resource.type}</Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              icon={getStatusIcon(resource.status)}
                              label={resource.status}
                              color={getStatusColor(resource.status)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">{resource.location}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">{resource.eta}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">{resource.crew}</Typography>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Button 
                                size="small" 
                                variant="contained" 
                                color="primary"
                                onClick={() => handleResourceDispatch(resource.id)}
                                disabled={resource.status !== 'available'}
                              >
                                Dispatch
                              </Button>
                              <Button size="small" variant="outlined">
                                Track
                              </Button>
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
        </Grid>
      )}

      {/* Protocols */}
      {selectedTab === 2 && (
        <Grid container spacing={3}>
          {crisisProtocols.map((protocol) => (
            <Grid item xs={12} md={6} lg={4} key={protocol.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6">{protocol.name}</Typography>
                    <Chip
                      icon={getStatusIcon(protocol.status)}
                      label={protocol.status}
                      color={getStatusColor(protocol.status)}
                      size="small"
                    />
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {protocol.description}
                  </Typography>

                  <Typography variant="caption" color="text.secondary">
                    Last activated: {protocol.lastActivated}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button 
                    size="small" 
                    variant="contained" 
                    color="error"
                    onClick={() => activateProtocol(protocol.id)}
                  >
                    Activate
                  </Button>
                  <Button size="small" variant="outlined">
                    View Details
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Staff Status */}
      {selectedTab === 3 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Staff Status
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Staff Member</TableCell>
                        <TableCell>Role</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Location</TableCell>
                        <TableCell>Availability</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {staffStatus.map((staff) => (
                        <TableRow key={staff.id}>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Avatar sx={{ mr: 2 }}>
                                {staff.name.split(' ').map(n => n[0]).join('')}
                              </Avatar>
                              <Typography variant="subtitle2">{staff.name}</Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">{staff.role}</Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              icon={getStatusIcon(staff.status)}
                              label={staff.status}
                              color={getStatusColor(staff.status)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">{staff.location}</Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={staff.availability}
                              color={getStatusColor(staff.availability)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Button size="small" variant="outlined">
                                Contact
                              </Button>
                              <Button size="small" variant="outlined">
                                Assign
                              </Button>
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
        </Grid>
      )}

      {/* Emergency Contact FAB */}
      <Fab
        color="error"
        aria-label="emergency"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
      >
        <Warning />
      </Fab>
    </Container>
  );
};

export default CrisisDashboardPage; 