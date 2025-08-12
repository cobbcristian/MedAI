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

const AnalyticsDashboardPage = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [analyticsData, setAnalyticsData] = useState({
    totalPatients: 1247,
    activePatients: 892,
    totalAppointments: 156,
    completedAppointments: 142,
    revenue: 45600,
    averageWaitTime: 12,
    patientSatisfaction: 4.6,
    emergencyCases: 8
  });

  const [patientMetrics, setPatientMetrics] = useState([
    {
      id: 1,
      metric: 'New Patients',
      value: 45,
      change: 12.5,
      trend: 'up',
      period: 'This Month'
    },
    {
      id: 2,
      metric: 'Returning Patients',
      value: 234,
      change: -2.3,
      trend: 'down',
      period: 'This Month'
    },
    {
      id: 3,
      metric: 'Virtual Consultations',
      value: 89,
      change: 18.7,
      trend: 'up',
      period: 'This Month'
    },
    {
      id: 4,
      metric: 'Emergency Cases',
      value: 12,
      change: -15.2,
      trend: 'down',
      period: 'This Month'
    }
  ]);

  const [revenueData, setRevenueData] = useState([
    { month: 'Jan', revenue: 42000, appointments: 145 },
    { month: 'Feb', revenue: 38000, appointments: 132 },
    { month: 'Mar', revenue: 45000, appointments: 158 },
    { month: 'Apr', revenue: 41000, appointments: 142 },
    { month: 'May', revenue: 48000, appointments: 165 },
    { month: 'Jun', revenue: 52000, appointments: 178 }
  ]);

  const [topConditions, setTopConditions] = useState([
    { condition: 'Hypertension', patients: 156, percentage: 12.5 },
    { condition: 'Diabetes Type 2', patients: 134, percentage: 10.8 },
    { condition: 'Asthma', patients: 98, percentage: 7.9 },
    { condition: 'Depression', patients: 87, percentage: 7.0 },
    { condition: 'Obesity', patients: 76, percentage: 6.1 }
  ]);

  const [doctorPerformance, setDoctorPerformance] = useState([
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      specialty: 'Cardiology',
      patients: 45,
      satisfaction: 4.8,
      efficiency: 92
    },
    {
      id: 2,
      name: 'Dr. Michael Chen',
      specialty: 'Primary Care',
      patients: 67,
      satisfaction: 4.6,
      efficiency: 88
    },
    {
      id: 3,
      name: 'Dr. Emily Davis',
      specialty: 'Neurology',
      patients: 34,
      satisfaction: 4.9,
      efficiency: 95
    }
  ]);

  const getTrendColor = (trend) => {
    return trend === 'up' ? 'success' : 'error';
  };

  const getTrendIcon = (trend) => {
    return trend === 'up' ? <TrendingUp /> : <TrendingDown />;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Analytics Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Comprehensive healthcare analytics and insights
        </Typography>
      </Box>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h4" color="primary">
                    {analyticsData.totalPatients}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Patients
                  </Typography>
                </Box>
                <Person sx={{ fontSize: 40, color: 'primary.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h4" color="success.main">
                    {analyticsData.activePatients}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active Patients
                  </Typography>
                </Box>
                <CheckCircle sx={{ fontSize: 40, color: 'success.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h4" color="info.main">
                    {formatCurrency(analyticsData.revenue)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Monthly Revenue
                  </Typography>
                </Box>
                <Payment sx={{ fontSize: 40, color: 'info.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h4" color="warning.main">
                    {analyticsData.patientSatisfaction}/5
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Patient Satisfaction
                  </Typography>
                </Box>
                <Star sx={{ fontSize: 40, color: 'warning.main' }} />
              </Box>
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
          <Tab label="Overview" />
          <Tab label="Patient Metrics" />
          <Tab label="Revenue Analysis" />
          <Tab label="Doctor Performance" />
          <Tab label="Conditions Analysis" />
        </Tabs>
      </Paper>

      {/* Overview */}
      {selectedTab === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Patient Metrics Trends
                </Typography>
                <Grid container spacing={2}>
                  {patientMetrics.map((metric) => (
                    <Grid item xs={12} sm={6} key={metric.id}>
                      <Box sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="h6">{metric.value}</Typography>
                          <Chip
                            icon={getTrendIcon(metric.trend)}
                            label={`${metric.change > 0 ? '+' : ''}${metric.change}%`}
                            color={getTrendColor(metric.trend)}
                            size="small"
                          />
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {metric.metric}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {metric.period}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Quick Stats
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <CalendarToday />
                    </ListItemIcon>
                    <ListItemText
                      primary={`${analyticsData.totalAppointments} Appointments`}
                      secondary={`${analyticsData.completedAppointments} completed`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <AccessTime />
                    </ListItemIcon>
                    <ListItemText
                      primary={`${analyticsData.averageWaitTime} min`}
                      secondary="Average wait time"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Warning />
                    </ListItemIcon>
                    <ListItemText
                      primary={`${analyticsData.emergencyCases} cases`}
                      secondary="Emergency cases today"
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Patient Metrics */}
      {selectedTab === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Patient Demographics & Trends
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Metric</TableCell>
                        <TableCell>Current Value</TableCell>
                        <TableCell>Change</TableCell>
                        <TableCell>Trend</TableCell>
                        <TableCell>Period</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {patientMetrics.map((metric) => (
                        <TableRow key={metric.id}>
                          <TableCell>
                            <Typography variant="subtitle2">{metric.metric}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="h6">{metric.value}</Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              icon={getTrendIcon(metric.trend)}
                              label={`${metric.change > 0 ? '+' : ''}${metric.change}%`}
                              color={getTrendColor(metric.trend)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              {getTrendIcon(metric.trend)}
                              <Typography variant="body2" sx={{ ml: 1 }}>
                                {metric.trend === 'up' ? 'Increasing' : 'Decreasing'}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">{metric.period}</Typography>
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

      {/* Revenue Analysis */}
      {selectedTab === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Revenue & Appointment Trends
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Month</TableCell>
                        <TableCell>Revenue</TableCell>
                        <TableCell>Appointments</TableCell>
                        <TableCell>Avg. Revenue/Appointment</TableCell>
                        <TableCell>Growth</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {revenueData.map((data, index) => {
                        const prevRevenue = index > 0 ? revenueData[index - 1].revenue : data.revenue;
                        const growth = ((data.revenue - prevRevenue) / prevRevenue * 100).toFixed(1);
                        const avgRevenue = (data.revenue / data.appointments).toFixed(0);
                        
                        return (
                          <TableRow key={data.month}>
                            <TableCell>
                              <Typography variant="subtitle2">{data.month}</Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="h6">{formatCurrency(data.revenue)}</Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">{data.appointments}</Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">{formatCurrency(avgRevenue)}</Typography>
                            </TableCell>
                            <TableCell>
                              <Chip
                                icon={index === 0 ? <Info /> : (growth > 0 ? <TrendingUp /> : <TrendingDown />)}
                                label={`${index === 0 ? 'N/A' : (growth > 0 ? '+' : '')}${index === 0 ? '' : growth}%`}
                                color={index === 0 ? 'default' : (growth > 0 ? 'success' : 'error')}
                                size="small"
                              />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Doctor Performance */}
      {selectedTab === 3 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Doctor Performance Metrics
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Doctor</TableCell>
                        <TableCell>Specialty</TableCell>
                        <TableCell>Patients</TableCell>
                        <TableCell>Satisfaction</TableCell>
                        <TableCell>Efficiency</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {doctorPerformance.map((doctor) => (
                        <TableRow key={doctor.id}>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Avatar sx={{ mr: 2 }}>
                                {doctor.name.split(' ').map(n => n[0]).join('')}
                              </Avatar>
                              <Typography variant="subtitle2">{doctor.name}</Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip label={doctor.specialty} size="small" variant="outlined" />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">{doctor.patients}</Typography>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Star sx={{ color: 'warning.main', mr: 0.5 }} />
                              <Typography variant="body2">{doctor.satisfaction}</Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <LinearProgress
                                variant="determinate"
                                value={doctor.efficiency}
                                sx={{ width: 60, mr: 1 }}
                              />
                              <Typography variant="body2">{doctor.efficiency}%</Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Button size="small" variant="outlined">
                              View Details
                            </Button>
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

      {/* Conditions Analysis */}
      {selectedTab === 4 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Top Medical Conditions
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Condition</TableCell>
                        <TableCell>Patients</TableCell>
                        <TableCell>Percentage</TableCell>
                        <TableCell>Distribution</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {topConditions.map((condition) => (
                        <TableRow key={condition.condition}>
                          <TableCell>
                            <Typography variant="subtitle2">{condition.condition}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">{condition.patients}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">{condition.percentage}%</Typography>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <LinearProgress
                                variant="determinate"
                                value={condition.percentage}
                                sx={{ width: 100, mr: 1 }}
                              />
                              <Typography variant="caption">{condition.percentage}%</Typography>
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
    </Container>
  );
};

export default AnalyticsDashboardPage; 