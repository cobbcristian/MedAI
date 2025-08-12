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

const SecurityPrivacyPage = () => {
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: true,
    biometricAuth: false,
    sessionTimeout: 30,
    passwordPolicy: 'strong',
    encryptionLevel: 'high',
    auditLogging: true,
    dataRetention: 7,
    autoLogout: true,
    ipWhitelist: false,
    deviceManagement: true
  });

  const [privacySettings, setPrivacySettings] = useState({
    dataSharing: false,
    marketingEmails: false,
    researchParticipation: true,
    thirdPartyAccess: false,
    anonymizedData: true,
    dataPortability: true,
    rightToDelete: true,
    consentManagement: true
  });

  const [complianceStatus, setComplianceStatus] = useState([
    {
      id: 1,
      standard: 'HIPAA',
      status: 'compliant',
      lastAudit: '2024-01-15',
      nextAudit: '2024-07-15',
      score: 95
    },
    {
      id: 2,
      standard: 'GDPR',
      status: 'compliant',
      lastAudit: '2024-01-10',
      nextAudit: '2024-07-10',
      score: 92
    },
    {
      id: 3,
      standard: 'SOC 2',
      status: 'in-progress',
      lastAudit: '2023-12-20',
      nextAudit: '2024-06-20',
      score: 78
    }
  ]);

  const [securityEvents, setSecurityEvents] = useState([
    {
      id: 1,
      type: 'login',
      user: 'john.smith@email.com',
      ip: '192.168.1.100',
      location: 'New York, NY',
      timestamp: '2024-01-20 14:30:00',
      status: 'success',
      risk: 'low'
    },
    {
      id: 2,
      type: 'failed_login',
      user: 'unknown@email.com',
      ip: '203.45.67.89',
      location: 'Unknown',
      timestamp: '2024-01-20 13:45:00',
      status: 'blocked',
      risk: 'high'
    },
    {
      id: 3,
      type: 'data_access',
      user: 'dr.sarah@clinic.com',
      ip: '192.168.1.50',
      location: 'New York, NY',
      timestamp: '2024-01-20 12:15:00',
      status: 'success',
      risk: 'medium'
    }
  ]);

  const [selectedTab, setSelectedTab] = useState(0);

  const getStatusColor = (status) => {
    switch (status) {
      case 'compliant': return 'success';
      case 'in-progress': return 'warning';
      case 'non-compliant': return 'error';
      case 'success': return 'success';
      case 'blocked': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'compliant': return <CheckCircle />;
      case 'in-progress': return <Warning />;
      case 'non-compliant': return <Warning />;
      case 'success': return <CheckCircle />;
      case 'blocked': return <Block />;
      default: return <Info />;
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

  const handleSecuritySettingChange = (setting, value) => {
    setSecuritySettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handlePrivacySettingChange = (setting, value) => {
    setPrivacySettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handlePasswordChange = () => {
    // Implement password change logic
    console.log('Password change requested');
  };

  const handleTwoFactorSetup = () => {
    // Implement 2FA setup logic
    console.log('2FA setup requested');
  };

  const handleDataExport = () => {
    // Implement data export logic
    console.log('Data export requested');
  };

  const handleDataDeletion = () => {
    // Implement data deletion logic
    console.log('Data deletion requested');
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Security & Privacy
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your security settings and privacy preferences
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
          <Tab label="Security Settings" />
          <Tab label="Privacy Settings" />
          <Tab label="Compliance" />
          <Tab label="Security Events" />
        </Tabs>
      </Paper>

      {/* Security Settings */}
      {selectedTab === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Authentication
                </Typography>
                
                <Box sx={{ mb: 3 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={securitySettings.twoFactorAuth}
                        onChange={(e) => handleSecuritySettingChange('twoFactorAuth', e.target.checked)}
                      />
                    }
                    label="Two-Factor Authentication"
                  />
                  <Typography variant="caption" color="text.secondary" display="block">
                    Add an extra layer of security to your account
                  </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={securitySettings.biometricAuth}
                        onChange={(e) => handleSecuritySettingChange('biometricAuth', e.target.checked)}
                      />
                    }
                    label="Biometric Authentication"
                  />
                  <Typography variant="caption" color="text.secondary" display="block">
                    Use fingerprint or face recognition
                  </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={securitySettings.autoLogout}
                        onChange={(e) => handleSecuritySettingChange('autoLogout', e.target.checked)}
                      />
                    }
                    label="Auto Logout"
                  />
                  <Typography variant="caption" color="text.secondary" display="block">
                    Automatically log out after inactivity
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button variant="outlined" onClick={handlePasswordChange}>
                    Change Password
                  </Button>
                  <Button variant="outlined" onClick={handleTwoFactorSetup}>
                    Setup 2FA
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Session Management
                </Typography>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" gutterBottom>
                    Session Timeout (minutes)
                  </Typography>
                  <TextField
                    type="number"
                    value={securitySettings.sessionTimeout}
                    onChange={(e) => handleSecuritySettingChange('sessionTimeout', parseInt(e.target.value))}
                    fullWidth
                    size="small"
                  />
                </Box>

                <Box sx={{ mb: 3 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={securitySettings.auditLogging}
                        onChange={(e) => handleSecuritySettingChange('auditLogging', e.target.checked)}
                      />
                    }
                    label="Audit Logging"
                  />
                  <Typography variant="caption" color="text.secondary" display="block">
                    Log all security events for monitoring
                  </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={securitySettings.deviceManagement}
                        onChange={(e) => handleSecuritySettingChange('deviceManagement', e.target.checked)}
                      />
                    }
                    label="Device Management"
                  />
                  <Typography variant="caption" color="text.secondary" display="block">
                    Manage and monitor connected devices
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Privacy Settings */}
      {selectedTab === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Data Sharing
                </Typography>
                
                <Box sx={{ mb: 3 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={privacySettings.dataSharing}
                        onChange={(e) => handlePrivacySettingChange('dataSharing', e.target.checked)}
                      />
                    }
                    label="Allow Data Sharing"
                  />
                  <Typography variant="caption" color="text.secondary" display="block">
                    Share data with healthcare providers
                  </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={privacySettings.marketingEmails}
                        onChange={(e) => handlePrivacySettingChange('marketingEmails', e.target.checked)}
                      />
                    }
                    label="Marketing Emails"
                  />
                  <Typography variant="caption" color="text.secondary" display="block">
                    Receive promotional and informational emails
                  </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={privacySettings.researchParticipation}
                        onChange={(e) => handlePrivacySettingChange('researchParticipation', e.target.checked)}
                      />
                    }
                    label="Research Participation"
                  />
                  <Typography variant="caption" color="text.secondary" display="block">
                    Allow anonymized data for medical research
                  </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={privacySettings.thirdPartyAccess}
                        onChange={(e) => handlePrivacySettingChange('thirdPartyAccess', e.target.checked)}
                      />
                    }
                    label="Third-Party Access"
                  />
                  <Typography variant="caption" color="text.secondary" display="block">
                    Allow third-party applications access
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Data Rights
                </Typography>
                
                <Box sx={{ mb: 3 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={privacySettings.dataPortability}
                        onChange={(e) => handlePrivacySettingChange('dataPortability', e.target.checked)}
                      />
                    }
                    label="Data Portability"
                  />
                  <Typography variant="caption" color="text.secondary" display="block">
                    Export your data in standard format
                  </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={privacySettings.rightToDelete}
                        onChange={(e) => handlePrivacySettingChange('rightToDelete', e.target.checked)}
                      />
                    }
                    label="Right to Delete"
                  />
                  <Typography variant="caption" color="text.secondary" display="block">
                    Request complete data deletion
                  </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={privacySettings.consentManagement}
                        onChange={(e) => handlePrivacySettingChange('consentManagement', e.target.checked)}
                      />
                    }
                    label="Consent Management"
                  />
                  <Typography variant="caption" color="text.secondary" display="block">
                    Manage your consent preferences
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button variant="outlined" onClick={handleDataExport}>
                    Export Data
                  </Button>
                  <Button variant="outlined" color="error" onClick={handleDataDeletion}>
                    Delete Data
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Compliance */}
      {selectedTab === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Compliance Status
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Standard</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Score</TableCell>
                        <TableCell>Last Audit</TableCell>
                        <TableCell>Next Audit</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {complianceStatus.map((compliance) => (
                        <TableRow key={compliance.id}>
                          <TableCell>
                            <Typography variant="subtitle2">{compliance.standard}</Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              icon={getStatusIcon(compliance.status)}
                              label={compliance.status}
                              color={getStatusColor(compliance.status)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <LinearProgress
                                variant="determinate"
                                value={compliance.score}
                                sx={{ width: 60, mr: 1 }}
                              />
                              <Typography variant="body2">{compliance.score}%</Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            {new Date(compliance.lastAudit).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {new Date(compliance.nextAudit).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Button size="small" variant="outlined">
                              View Report
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

      {/* Security Events */}
      {selectedTab === 3 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Security Events
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Event</TableCell>
                        <TableCell>User</TableCell>
                        <TableCell>IP Address</TableCell>
                        <TableCell>Location</TableCell>
                        <TableCell>Timestamp</TableCell>
                        <TableCell>Risk</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {securityEvents.map((event) => (
                        <TableRow key={event.id}>
                          <TableCell>
                            <Typography variant="subtitle2" sx={{ textTransform: 'capitalize' }}>
                              {event.type.replace('_', ' ')}
                            </Typography>
                          </TableCell>
                          <TableCell>{event.user}</TableCell>
                          <TableCell>{event.ip}</TableCell>
                          <TableCell>{event.location}</TableCell>
                          <TableCell>
                            {new Date(event.timestamp).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={event.risk}
                              color={getRiskColor(event.risk)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Chip
                              icon={getStatusIcon(event.status)}
                              label={event.status}
                              color={getStatusColor(event.status)}
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

export default SecurityPrivacyPage; 