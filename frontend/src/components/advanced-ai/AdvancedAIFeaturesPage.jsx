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

const AdvancedAIFeaturesPage = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [aiModels, setAiModels] = useState([
    {
      id: 1,
      name: 'GPT-4 Medical',
      type: 'Diagnosis',
      accuracy: 94.5,
      status: 'active',
      lastUpdated: '2024-01-15',
      description: 'Advanced medical diagnosis model trained on clinical data',
      performance: {
        precision: 0.92,
        recall: 0.89,
        f1Score: 0.90
      }
    },
    {
      id: 2,
      name: 'BERT-Clinical',
      type: 'Text Analysis',
      accuracy: 91.2,
      status: 'active',
      lastUpdated: '2024-01-10',
      description: 'Clinical text analysis and medical record processing',
      performance: {
        precision: 0.89,
        recall: 0.87,
        f1Score: 0.88
      }
    },
    {
      id: 3,
      name: 'Vision-Med',
      type: 'Image Analysis',
      accuracy: 96.8,
      status: 'training',
      lastUpdated: '2024-01-20',
      description: 'Medical image analysis for radiology and pathology',
      performance: {
        precision: 0.95,
        recall: 0.94,
        f1Score: 0.94
      }
    }
  ]);

  const [trainingJobs, setTrainingJobs] = useState([
    {
      id: 1,
      modelName: 'Vision-Med',
      status: 'training',
      progress: 75,
      startTime: '2024-01-20 10:00:00',
      estimatedCompletion: '2024-01-21 14:00:00',
      dataset: 'Medical Images Dataset v2.1',
      epochs: 100,
      currentEpoch: 75
    },
    {
      id: 2,
      modelName: 'GPT-4 Medical',
      status: 'completed',
      progress: 100,
      startTime: '2024-01-15 08:00:00',
      estimatedCompletion: '2024-01-16 12:00:00',
      dataset: 'Clinical Text Dataset v3.0',
      epochs: 50,
      currentEpoch: 50
    }
  ]);

  const [aiInsights, setAiInsights] = useState([
    {
      id: 1,
      type: 'diagnosis',
      patientId: 'P001',
      confidence: 0.89,
      recommendation: 'High probability of Type 2 Diabetes based on symptoms and lab results',
      timestamp: '2024-01-20 14:30:00',
      status: 'reviewed'
    },
    {
      id: 2,
      type: 'treatment',
      patientId: 'P002',
      confidence: 0.92,
      recommendation: 'Recommended medication adjustment based on recent blood pressure readings',
      timestamp: '2024-01-20 13:45:00',
      status: 'pending'
    }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'training': return 'warning';
      case 'completed': return 'info';
      case 'failed': return 'error';
      case 'reviewed': return 'success';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <CheckCircle />;
      case 'training': return <Build />;
      case 'completed': return <CheckCircle />;
      case 'failed': return <Warning />;
      case 'reviewed': return <CheckCircle />;
      case 'pending': return <Schedule />;
      default: return <Info />;
    }
  };

  const handleStartTraining = (modelId) => {
    // Implement training start logic
    console.log('Starting training for model:', modelId);
  };

  const handleModelDeploy = (modelId) => {
    // Implement model deployment logic
    console.log('Deploying model:', modelId);
  };

  const handleInsightReview = (insightId) => {
    // Implement insight review logic
    console.log('Reviewing insight:', insightId);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Advanced AI Features
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage AI models, training jobs, and advanced healthcare AI tools
        </Typography>
      </Box>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs 
          value={selectedTab} 
          onChange={(e, newValue) => setSelectedTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="AI Models" />
          <Tab label="Training Jobs" />
          <Tab label="AI Insights" />
          <Tab label="Model Comparison" />
        </Tabs>
      </Paper>

      {/* AI Models */}
      {selectedTab === 0 && (
        <Grid container spacing={3}>
          {aiModels.map((model) => (
            <Grid item xs={12} md={6} lg={4} key={model.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6">{model.name}</Typography>
                    <Chip
                      icon={getStatusIcon(model.status)}
                      label={model.status}
                      color={getStatusColor(model.status)}
                      size="small"
                    />
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {model.description}
                  </Typography>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" gutterBottom>
                      Accuracy: {model.accuracy}%
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={model.accuracy} 
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" gutterBottom>
                      Performance Metrics:
                    </Typography>
                    <Grid container spacing={1}>
                      <Grid item xs={4}>
                        <Typography variant="caption" color="text.secondary">
                          Precision
                        </Typography>
                        <Typography variant="body2">
                          {(model.performance.precision * 100).toFixed(1)}%
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="caption" color="text.secondary">
                          Recall
                        </Typography>
                        <Typography variant="body2">
                          {(model.performance.recall * 100).toFixed(1)}%
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="caption" color="text.secondary">
                          F1 Score
                        </Typography>
                        <Typography variant="body2">
                          {(model.performance.f1Score * 100).toFixed(1)}%
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>

                  <Typography variant="caption" color="text.secondary">
                    Last updated: {new Date(model.lastUpdated).toLocaleDateString()}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" onClick={() => handleModelDeploy(model.id)}>
                    Deploy
                  </Button>
                  <Button size="small" onClick={() => handleStartTraining(model.id)}>
                    Retrain
                  </Button>
                  <Button size="small">
                    View Details
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Training Jobs */}
      {selectedTab === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Training Jobs
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Model</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Progress</TableCell>
                        <TableCell>Dataset</TableCell>
                        <TableCell>Epochs</TableCell>
                        <TableCell>Estimated Completion</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {trainingJobs.map((job) => (
                        <TableRow key={job.id}>
                          <TableCell>
                            <Typography variant="subtitle2">{job.modelName}</Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              icon={getStatusIcon(job.status)}
                              label={job.status}
                              color={getStatusColor(job.status)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <LinearProgress
                                variant="determinate"
                                value={job.progress}
                                sx={{ width: 60, mr: 1 }}
                              />
                              <Typography variant="body2">{job.progress}%</Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">{job.dataset}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {job.currentEpoch}/{job.epochs}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {new Date(job.estimatedCompletion).toLocaleString()}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Button size="small" variant="outlined">
                                View Logs
                              </Button>
                              {job.status === 'training' && (
                                <Button size="small" color="error">
                                  Stop
                                </Button>
                              )}
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

      {/* AI Insights */}
      {selectedTab === 2 && (
        <Grid container spacing={3}>
          {aiInsights.map((insight) => (
            <Grid item xs={12} md={6} key={insight.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" sx={{ textTransform: 'capitalize' }}>
                      {insight.type} Insight
                    </Typography>
                    <Chip
                      icon={getStatusIcon(insight.status)}
                      label={insight.status}
                      color={getStatusColor(insight.status)}
                      size="small"
                    />
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Patient ID: {insight.patientId}
                  </Typography>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" gutterBottom>
                      Confidence: {(insight.confidence * 100).toFixed(1)}%
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={insight.confidence * 100} 
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>

                  <Typography variant="body2" paragraph>
                    <strong>Recommendation:</strong> {insight.recommendation}
                  </Typography>

                  <Typography variant="caption" color="text.secondary">
                    Generated: {new Date(insight.timestamp).toLocaleString()}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" onClick={() => handleInsightReview(insight.id)}>
                    Review
                  </Button>
                  <Button size="small">
                    View Details
                  </Button>
                  <Button size="small">
                    Apply
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Model Comparison */}
      {selectedTab === 3 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Model Performance Comparison
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Model</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Accuracy</TableCell>
                        <TableCell>Precision</TableCell>
                        <TableCell>Recall</TableCell>
                        <TableCell>F1 Score</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {aiModels.map((model) => (
                        <TableRow key={model.id}>
                          <TableCell>
                            <Typography variant="subtitle2">{model.name}</Typography>
                          </TableCell>
                          <TableCell>
                            <Chip label={model.type} size="small" variant="outlined" />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">{model.accuracy}%</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {(model.performance.precision * 100).toFixed(1)}%
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {(model.performance.recall * 100).toFixed(1)}%
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {(model.performance.f1Score * 100).toFixed(1)}%
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              icon={getStatusIcon(model.status)}
                              label={model.status}
                              color={getStatusColor(model.status)}
                              size="small"
                            />
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
    </Container>
  );
};

export default AdvancedAIFeaturesPage; 