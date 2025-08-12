import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Typography, Container, Paper, Grid, Card, CardContent, CardActions, Button, Chip, Avatar, List, ListItem, ListItemIcon, ListItemText, LinearProgress, useTheme, AppBar, Toolbar, Drawer, IconButton, Badge, Menu, MenuItem } from '@mui/material';
import { 
  Dashboard as DashboardIcon, 
  Person, 
  Description, 
  LocalHospital, 
  VideoCall, 
  Chat, 
  People, 
  Security, 
  Science, 
  Warning, 
  TrendingUp, 
  HealthAndSafety, 
  MonitorHeart, 
  Medication, 
  Vaccines, 
  Image, 
  Timeline, 
  Notifications, 
  CheckCircle, 
  Info,
  Menu as MenuIcon,
  Analytics,
  AccountCircle,
  Settings,
  Logout,
  Build,
  Payment
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import SymptomCheckerPage from './components/symptom-checker/SymptomCheckerPage';
import MedicalRecordsPage from './components/medical-records/MedicalRecordsPage';
import AppointmentsPage from './components/appointments/AppointmentsPage';
import VideoCallsPage from './components/video-calls/VideoCallsPage';
import ChatPage from './components/chat/ChatPage';
import PatientDashboard from './components/dashboard/PatientDashboard';
import PatientManagementPage from './components/patient-management/PatientManagementPage';
import SecurityPrivacyPage from './components/security/SecurityPrivacyPage';
import AdvancedAIFeaturesPage from './components/advanced-ai/AdvancedAIFeaturesPage';
import AnalyticsDashboardPage from './components/analytics/AnalyticsDashboardPage';
import CrisisDashboardPage from './components/crisis/CrisisDashboardPage';
import PatientPortal from './components/patient-portal/PatientPortal';
import SurgicalGuide from './components/surgical-guide/SurgicalGuide';
import AdminBilling from './components/admin-billing/AdminBilling';
import LoginPage from './components/auth/LoginPage';
import ProviderDashboard from './components/dashboard/ProviderDashboard';
import ScanAnalysis from './components/advanced-ai/ScanAnalysis';
import PatientReporting from './components/patient-reporting/PatientReporting';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
  },
});

const drawerWidth = 280;

const menuItems = [
  { text: 'Login', icon: <Security />, path: '/login' },
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Patient Dashboard', icon: <Person />, path: '/patient-dashboard' },
  { text: 'Provider Dashboard', icon: <LocalHospital />, path: '/provider-dashboard' },
  { text: 'Patient Portal', icon: <Person />, path: '/patient-portal' },
  { text: 'Medical Records', icon: <Description />, path: '/medical-records' },
  { text: 'Symptom Checker', icon: <LocalHospital />, path: '/symptom-checker' },
  { text: 'Appointments', icon: <Timeline />, path: '/appointments' },
  { text: 'Video Calls', icon: <VideoCall />, path: '/video-calls' },
  { text: 'Chat', icon: <Chat />, path: '/chat' },
  { text: 'Patient Management', icon: <People />, path: '/patient-management' },
  { text: 'Surgical Guide', icon: <Build />, path: '/surgical-guide' },
  { text: 'Scan Analysis', icon: <Image />, path: '/scan-analysis' },
  { text: 'Patient Reporting', icon: <Description />, path: '/patient-reporting' },
  { text: 'Admin Billing', icon: <Payment />, path: '/admin-billing' },
  { text: 'Security & Privacy', icon: <Security />, path: '/security-privacy' },
  { text: 'Advanced AI', icon: <Science />, path: '/advanced-ai' },
  { text: 'Analytics', icon: <Analytics />, path: '/analytics' },
  { text: 'Crisis Dashboard', icon: <Warning />, path: '/crisis-dashboard' }
];

// Layout Component
const Layout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    navigate('/');
  };

  const drawer = (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <HealthAndSafety sx={{ mr: 2, color: 'primary.main', fontSize: 32 }} />
        <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          MedAI
        </Typography>
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        AI-Powered Healthcare Platform
      </Typography>
      <List>
        {menuItems.map((item) => (
          <ListItem 
            button 
            key={item.text}
            onClick={() => navigate(item.path)}
            sx={{
              mb: 1,
              borderRadius: 1,
              backgroundColor: location.pathname === item.path ? 'primary.light' : 'transparent',
              color: location.pathname === item.path ? 'primary.contrastText' : 'inherit',
              '&:hover': {
                backgroundColor: 'primary.light',
                color: 'primary.contrastText',
              }
            }}
          >
            <ListItemIcon sx={{ color: 'inherit' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            MedAI Healthcare Platform
          </Typography>
          <IconButton color="inherit">
            <Badge badgeContent={4} color="error">
              <Notifications />
            </Badge>
          </IconButton>
          <IconButton color="inherit" onClick={handleMenuOpen}>
            <AccountCircle />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
            <MenuItem onClick={handleMenuClose}>Settings</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: 8
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

// Dashboard Component
const Dashboard = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const quickActions = [
    {
      title: 'Medical Records',
      description: 'View and manage your health records',
      icon: <Description color="primary" />,
      path: '/medical-records',
      color: 'primary.main'
    },
    {
      title: 'Symptom Checker',
      description: 'AI-powered symptom analysis',
      icon: <LocalHospital color="secondary" />,
      path: '/symptom-checker',
      color: 'secondary.main'
    },
    {
      title: 'Appointments',
      description: 'Schedule and manage appointments',
      icon: <Timeline color="info" />,
      path: '/appointments',
      color: 'info.main'
    },
    {
      title: 'Video Calls',
      description: 'Start a virtual consultation',
      icon: <VideoCall color="success" />,
      path: '/video-calls',
      color: 'success.main'
    }
  ];

  const healthMetrics = [
    {
      label: 'Blood Pressure',
      value: '120/80',
      status: 'normal',
      trend: 'stable'
    },
    {
      label: 'Heart Rate',
      value: '72 bpm',
      status: 'normal',
      trend: 'stable'
    },
    {
      label: 'Blood Sugar',
      value: '95 mg/dL',
      status: 'normal',
      trend: 'improving'
    },
    {
      label: 'Weight',
      value: '68 kg',
      status: 'normal',
      trend: 'stable'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'normal': return 'success';
      case 'warning': return 'warning';
      case 'critical': return 'error';
      default: return 'default';
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'improving': return <TrendingUp color="success" />;
      case 'stable': return <CheckCircle color="info" />;
      case 'declining': return <Warning color="warning" />;
      default: return <Info color="default" />;
    }
  };

  return (
    <Container maxWidth="lg">
              <Typography variant="h4" component="h1" gutterBottom>
          Welcome back, Dr. Cobb
        </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Here's your healthcare dashboard overview
      </Typography>

      {/* Quick Actions */}
      <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 2 }}>
        Quick Actions
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {quickActions.map((action) => (
          <Grid item xs={12} sm={6} md={3} key={action.title}>
            <Card 
              sx={{ 
                height: '100%',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows[8]
                }
              }}
              onClick={() => navigate(action.path)}
            >
              <CardContent sx={{ textAlign: 'center' }}>
                <Box sx={{ mb: 2 }}>
                  {action.icon}
                </Box>
                <Typography variant="h6" component="h2" gutterBottom>
                  {action.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {action.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Health Metrics */}
      <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 2 }}>
        Health Metrics
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {healthMetrics.map((metric) => (
          <Grid item xs={12} sm={6} md={3} key={metric.label}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: `${getStatusColor(metric.status)}.main`, mr: 2 }}>
                    {getTrendIcon(metric.trend)}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" component="div">
                      {metric.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {metric.label}
                    </Typography>
                  </Box>
                </Box>
                <Chip 
                  label={metric.status} 
                  color={getStatusColor(metric.status)}
                  size="small"
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Recent Activity */}
      <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 2 }}>
        Recent Activity
      </Typography>
      <Card>
        <CardContent>
          <List>
            <ListItem>
              <ListItemIcon>
                <LocalHospital color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Symptom analysis completed"
                secondary="AI analyzed your symptoms - No immediate concerns detected"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <VideoCall color="success" />
              </ListItemIcon>
              <ListItemText 
                primary="Video consultation scheduled"
                secondary="Appointment with Dr. Johnson tomorrow at 2:00 PM"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Description color="info" />
              </ListItemIcon>
              <ListItemText 
                primary="Medical records updated"
                secondary="New lab results uploaded to your profile"
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>
    </Container>
  );
};

// Placeholder components for other routes
const PlaceholderPage = ({ title, description }) => (
  <Container maxWidth="lg">
    <Typography variant="h4" component="h1" gutterBottom>
      {title}
    </Typography>
    <Typography variant="body1" color="text.secondary" paragraph>
      {description}
    </Typography>
    <Paper sx={{ p: 3, textAlign: 'center' }}>
      <Typography variant="h6" gutterBottom>
        Coming Soon
      </Typography>
      <Typography variant="body2" color="text.secondary">
        This feature is under development and will be available soon.
      </Typography>
    </Paper>
  </Container>
);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/patient-dashboard" element={<PatientDashboard />} />
            <Route path="/provider-dashboard" element={<ProviderDashboard />} />

            <Route path="/medical-records" element={<MedicalRecordsPage />} />
            <Route path="/symptom-checker" element={<SymptomCheckerPage />} />
            <Route path="/appointments" element={<AppointmentsPage />} />
            <Route path="/video-calls" element={<VideoCallsPage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/patient-management" element={<PatientManagementPage />} />
            <Route path="/patient-portal" element={<PatientPortal />} />
            <Route path="/surgical-guide" element={<SurgicalGuide />} />
            <Route path="/scan-analysis" element={<ScanAnalysis />} />
            <Route path="/patient-reporting" element={<PatientReporting />} />
            <Route path="/admin-billing" element={<AdminBilling />} />
            <Route path="/security-privacy" element={<SecurityPrivacyPage />} />
            <Route path="/advanced-ai" element={<AdvancedAIFeaturesPage />} />
            <Route path="/analytics" element={<AnalyticsDashboardPage />} />
            <Route path="/crisis-dashboard" element={<CrisisDashboardPage />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App; 