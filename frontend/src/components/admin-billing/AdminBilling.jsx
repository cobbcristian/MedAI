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
  Alert,
  LinearProgress,
  Divider,
  IconButton,
  Badge,
  Fab,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import {
  Payment,
  Receipt,
  CreditCard,
  AccountBalance,
  AccountBalanceWallet,
  Business,
  People,
  Assignment,
  Description,
  VideoCall,
  CameraAlt,
  FileUpload,
  Download,
  Share,
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
  FileCopy,
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
  CreditCardOff,
  CreditScore,
  AccountBox,
  AccountCircle,
  AccountTree,
  AccountTreeOutlined,
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
  Thermostat,
  ExpandMore
} from '@mui/icons-material';

const AdminBilling = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [billingDialog, setBillingDialog] = useState(false);
  const [paymentDialog, setPaymentDialog] = useState(false);
  const [automationDialog, setAutomationDialog] = useState(false);

  const [billingRecords, setBillingRecords] = useState([
    {
      id: 1,
      patient: 'John Smith',
      service: 'Video Consultation',
      doctor: 'Dr. Sarah Johnson',
      date: '2024-01-20',
      amount: 150.00,
      status: 'paid',
      paymentMethod: 'Credit Card',
      invoiceNumber: 'INV-2024-001'
    },
    {
      id: 2,
      patient: 'Mary Johnson',
      service: 'Symptom Analysis',
      doctor: 'AI System',
      date: '2024-01-19',
      amount: 25.00,
      status: 'pending',
      paymentMethod: 'Insurance',
      invoiceNumber: 'INV-2024-002'
    },
    {
      id: 3,
      patient: 'Robert Davis',
      service: 'Emergency Consultation',
      doctor: 'Dr. Emily Chen',
      date: '2024-01-18',
      amount: 300.00,
      status: 'paid',
      paymentMethod: 'Insurance',
      invoiceNumber: 'INV-2024-003'
    }
  ]);

  const [automationTasks, setAutomationTasks] = useState([
    {
      id: 1,
      task: 'Insurance Claim Processing',
      status: 'active',
      lastRun: '2024-01-20 10:30',
      nextRun: '2024-01-21 10:30',
      successRate: 95,
      description: 'Automatically process insurance claims and submit to providers'
    },
    {
      id: 2,
      task: 'Payment Reminders',
      status: 'active',
      lastRun: '2024-01-20 09:00',
      nextRun: '2024-01-21 09:00',
      successRate: 98,
      description: 'Send automated payment reminders to patients with outstanding balances'
    },
    {
      id: 3,
      task: 'Invoice Generation',
      status: 'active',
      lastRun: '2024-01-20 08:00',
      nextRun: '2024-01-21 08:00',
      successRate: 100,
      description: 'Generate invoices for completed services'
    },
    {
      id: 4,
      task: 'Payment Reconciliation',
      status: 'scheduled',
      lastRun: '2024-01-19 23:00',
      nextRun: '2024-01-20 23:00',
      successRate: 92,
      description: 'Reconcile payments with bank statements'
    }
  ]);

  const [financialMetrics, setFinancialMetrics] = useState({
    totalRevenue: 47500.00,
    monthlyRevenue: 12500.00,
    outstandingPayments: 8500.00,
    insuranceClaims: 32000.00,
    patientPayments: 15500.00,
    averagePaymentTime: 3.2,
    paymentSuccessRate: 94.5
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'success';
      case 'pending': return 'warning';
      case 'overdue': return 'error';
      case 'active': return 'success';
      case 'scheduled': return 'info';
      case 'failed': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid': return <CheckCircle />;
      case 'pending': return <Schedule />;
      case 'overdue': return <Warning />;
      case 'active': return <CheckCircle />;
      case 'scheduled': return <Info />;
      case 'failed': return <Warning />;
      default: return <Info />;
    }
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
          Admin Billing & Automation
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage billing, payments, and automated administrative tasks
        </Typography>
      </Box>

      {/* Financial Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <AccountBalance color="primary" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h6">{formatCurrency(financialMetrics.totalRevenue)}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Revenue
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
                <Payment color="success" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h6">{formatCurrency(financialMetrics.monthlyRevenue)}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Monthly Revenue
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
                <Warning color="warning" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h6">{formatCurrency(financialMetrics.outstandingPayments)}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Outstanding Payments
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
                <CreditCard color="info" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h6">{financialMetrics.paymentSuccessRate}%</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Payment Success Rate
                  </Typography>
                </Box>
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
          <Tab label="Billing Records" />
          <Tab label="Automation Tasks" />
          <Tab label="Payment Processing" />
          <Tab label="Reports" />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      {selectedTab === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Billing Records</Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setBillingDialog(true)}
              >
                Create Invoice
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Patient</TableCell>
                    <TableCell>Service</TableCell>
                    <TableCell>Doctor</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {billingRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>{record.patient}</TableCell>
                      <TableCell>{record.service}</TableCell>
                      <TableCell>{record.doctor}</TableCell>
                      <TableCell>{record.date}</TableCell>
                      <TableCell>{formatCurrency(record.amount)}</TableCell>
                      <TableCell>
                        <Chip
                          icon={getStatusIcon(record.status)}
                          label={record.status}
                          color={getStatusColor(record.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button size="small" startIcon={<Visibility />}>
                            View
                          </Button>
                          <Button size="small" startIcon={<Download />}>
                            Download
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      )}

      {selectedTab === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Automation Tasks</Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setAutomationDialog(true)}
              >
                Add Task
              </Button>
            </Box>
          </Grid>
          {automationTasks.map((task) => (
            <Grid item xs={12} sm={6} md={4} key={task.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Assignment sx={{ mr: 1 }} />
                    <Typography variant="h6" sx={{ ml: 1 }}>
                      {task.task}
                    </Typography>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {task.description}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Chip
                      icon={getStatusIcon(task.status)}
                      label={task.status}
                      color={getStatusColor(task.status)}
                      size="small"
                    />
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    <strong>Success Rate:</strong> {task.successRate}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    <strong>Last Run:</strong> {task.lastRun}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    <strong>Next Run:</strong> {task.nextRun}
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button size="small" startIcon={<Settings />}>
                      Configure
                    </Button>
                    <Button size="small" startIcon={<Visibility />}>
                      Logs
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {selectedTab === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Payment Processing
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Process payments and manage payment methods
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                  <Button
                    variant="contained"
                    startIcon={<Payment />}
                    onClick={() => setPaymentDialog(true)}
                  >
                    Process Payment
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<CreditCard />}
                  >
                    Payment Methods
                  </Button>
                </Box>

                <Typography variant="subtitle2" gutterBottom>
                  Recent Payments
                </Typography>
                <List dense>
                  {billingRecords.filter(r => r.status === 'paid').slice(0, 3).map((record) => (
                    <ListItem key={record.id}>
                      <ListItemIcon>
                        <CheckCircle color="success" />
                      </ListItemIcon>
                      <ListItemText 
                        primary={`${record.patient} - ${record.service}`}
                        secondary={`${record.date} - ${formatCurrency(record.amount)}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Payment Analytics
                </Typography>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Payment Methods Distribution
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Chip label="Credit Card: 65%" color="primary" />
                    <Chip label="Insurance: 25%" color="secondary" />
                    <Chip label="Other: 10%" color="default" />
                  </Box>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Average Payment Time
                  </Typography>
                  <Typography variant="h4" color="primary">
                    {financialMetrics.averagePaymentTime} days
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Revenue Breakdown
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    Insurance Claims: {formatCurrency(financialMetrics.insuranceClaims)}
                  </Typography>
                  <Typography variant="body2">
                    Patient Payments: {formatCurrency(financialMetrics.patientPayments)}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {selectedTab === 3 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Financial Reports
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Revenue Report
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Monthly revenue trends and analysis
                </Typography>
                <Button variant="contained" startIcon={<Download />}>
                  Download Report
                </Button>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Payment Analytics
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Payment success rates and processing times
                </Typography>
                <Button variant="contained" startIcon={<Download />}>
                  Download Report
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Create Invoice Dialog */}
      <Dialog open={billingDialog} onClose={() => setBillingDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create New Invoice</DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Patient Name"
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Service"
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Doctor"
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="date"
                label="Service Date"
                InputLabelProps={{ shrink: true }}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                type="number"
                label="Amount"
                sx={{ mb: 2 }}
              />
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Payment Method</InputLabel>
                <Select label="Payment Method">
                  <MenuItem value="credit_card">Credit Card</MenuItem>
                  <MenuItem value="insurance">Insurance</MenuItem>
                  <MenuItem value="cash">Cash</MenuItem>
                  <MenuItem value="check">Check</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBillingDialog(false)}>Cancel</Button>
          <Button variant="contained">Create Invoice</Button>
        </DialogActions>
      </Dialog>

      {/* Process Payment Dialog */}
      <Dialog open={paymentDialog} onClose={() => setPaymentDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Process Payment</DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Invoice Number"
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Amount"
                type="number"
                sx={{ mb: 2 }}
              />
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Payment Method</InputLabel>
                <Select label="Payment Method">
                  <MenuItem value="credit_card">Credit Card</MenuItem>
                  <MenuItem value="debit_card">Debit Card</MenuItem>
                  <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
                  <MenuItem value="cash">Cash</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Card Number"
                sx={{ mb: 2 }}
              />
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  fullWidth
                  label="Expiry Date"
                  placeholder="MM/YY"
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="CVV"
                  sx={{ mb: 2 }}
                />
              </Box>
              <TextField
                fullWidth
                label="Cardholder Name"
                sx={{ mb: 2 }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPaymentDialog(false)}>Cancel</Button>
          <Button variant="contained">Process Payment</Button>
        </DialogActions>
      </Dialog>

      {/* Add Automation Task Dialog */}
      <Dialog open={automationDialog} onClose={() => setAutomationDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add Automation Task</DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Task Name"
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                sx={{ mb: 2 }}
              />
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Schedule</InputLabel>
                <Select label="Schedule">
                  <MenuItem value="daily">Daily</MenuItem>
                  <MenuItem value="weekly">Weekly</MenuItem>
                  <MenuItem value="monthly">Monthly</MenuItem>
                  <MenuItem value="custom">Custom</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                type="time"
                label="Time"
                InputLabelProps={{ shrink: true }}
                sx={{ mb: 2 }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAutomationDialog(false)}>Cancel</Button>
          <Button variant="contained">Add Task</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminBilling;
