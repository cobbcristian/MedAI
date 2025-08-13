import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Avatar,
  LinearProgress,
  IconButton,
  Tooltip,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Badge,
  Switch,
  FormControlLabel,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Person,
  VideoCall,
  Assessment,
  Notifications,
  Settings,
  Dashboard,
  Analytics,
  HealthAndSafety,
  Psychology,
  Biotech,
  Timeline,
  Speed,
  CheckCircle,
  Warning,
  Error,
  Info,
  Refresh,
  PlayArrow,
  Pause,
  Stop,
  Fullscreen,
  ZoomIn,
  ZoomOut,
  FilterList,
  Search,
  Add,
  Edit,
  Delete,
  Download,
  Upload,
  Share,
  Favorite,
  Star,
  StarBorder,
  Visibility,
  VisibilityOff,
  Brightness4,
  Brightness7,
  Language,
  LocationOn,
  Schedule,
  Payment,
  Security,
  PrivacyTip,
  VerifiedUser,
  CloudUpload,
  CloudDownload,
  Sync,
  Autorenew,
  Memory,
  Storage,
  NetworkCheck,
  Wifi,
  WifiOff,
  SignalCellular4Bar,
  SignalCellularConnectedNoInternet4Bar,
  Battery90,
  BatteryCharging90,
  BatteryAlert,
  BatteryUnknown,
  BatteryFull,
  Battery6Bar,
  Battery5Bar,
  Battery4Bar,
  Battery3Bar,
  Battery2Bar,
  Battery1Bar,
  Battery0Bar,
  BatteryChargingFull,
  BatteryCharging6Bar,
  BatteryCharging5Bar,
  BatteryCharging4Bar,
  BatteryCharging3Bar,
  BatteryCharging2Bar,
  BatteryCharging1Bar,
  BatteryCharging0Bar,
  BatterySaver,
  BatteryStd,
  BatteryUnknown
} from '@mui/icons-material';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';

const EnhancedDashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [darkMode, setDarkMode] = useState(false);
  const [realTimeData, setRealTimeData] = useState({
    activePatients: 127,
    activeDoctors: 23,
    pendingAppointments: 45,
    aiPredictions: 89,
    systemHealth: 98.5,
    responseTime: 145,
    accuracy: 96.8,
    securityScore: 99.2
  });

  const [aiInsights, setAiInsights] = useState([
    {
      id: 1,
      type: 'prediction',
      title: 'High Risk Patient Detected',
      description: 'Patient ID 12345 shows 87% risk of cardiovascular event',
      severity: 'high',
      confidence: 87,
      timestamp: new Date().toISOString()
    },
    {
      id: 2,
      type: 'anomaly',
      title: 'Unusual Lab Results',
      description: 'Blood work shows elevated markers requiring attention',
      severity: 'medium',
      confidence: 92,
      timestamp: new Date().toISOString()
    },
    {
      id: 3,
      type: 'recommendation',
      title: 'Treatment Optimization',
      description: 'AI suggests medication adjustment for better outcomes',
      severity: 'low',
      confidence: 94,
      timestamp: new Date().toISOString()
    }
  ]);

  const [performanceData] = useState([
    { name: 'Mon', patients: 65, consultations: 45, ai_usage: 78 },
    { name: 'Tue', patients: 72, consultations: 52, ai_usage: 82 },
    { name: 'Wed', patients: 68, consultations: 48, ai_usage: 75 },
    { name: 'Thu', patients: 85, consultations: 61, ai_usage: 89 },
    { name: 'Fri', patients: 78, consultations: 55, ai_usage: 81 },
    { name: 'Sat', patients: 45, consultations: 32, ai_usage: 65 },
    { name: 'Sun', patients: 38, consultations: 28, ai_usage: 58 }
  ]);

  const [aiModelPerformance] = useState([
    { name: 'Diagnosis', accuracy: 96.8, speed: 2.3, usage: 89 },
    { name: 'Imaging', accuracy: 98.2, speed: 1.8, usage: 92 },
    { name: 'Prediction', accuracy: 94.5, speed: 3.1, usage: 76 },
    { name: 'Recommendation', accuracy: 95.7, speed: 2.7, usage: 84 }
  ]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData(prev => ({
        ...prev,
        activePatients: prev.activePatients + Math.floor(Math.random() * 3) - 1,
        aiPredictions: prev.aiPredictions + Math.floor(Math.random() * 5),
        systemHealth: Math.max(95, Math.min(100, prev.systemHealth + (Math.random() - 0.5) * 2)),
        responseTime: Math.max(100, Math.min(200, prev.responseTime + (Math.random() - 0.5) * 10))
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return theme.palette.error.main;
      case 'medium': return theme.palette.warning.main;
      case 'low': return theme.palette.success.main;
      default: return theme.palette.info.main;
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'high': return <Error />;
      case 'medium': return <Warning />;
      case 'low': return <CheckCircle />;
      default: return <Info />;
    }
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3, backgroundColor: theme.palette.background.default }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
          🏥 MedAI Dashboard
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <FormControlLabel
            control={
              <Switch
                checked={darkMode}
                onChange={(e) => setDarkMode(e.target.checked)}
                icon={<Brightness7 />}
                checkedIcon={<Brightness4 />}
              />
            }
            label="Dark Mode"
          />
          <Tooltip title="Refresh Data">
            <IconButton>
              <Refresh />
            </IconButton>
          </Tooltip>
          <Tooltip title="Settings">
            <IconButton>
              <Settings />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Real-time Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {realTimeData.activePatients}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Active Patients
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                  <Person />
                </Avatar>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <TrendingUp sx={{ fontSize: 16, mr: 0.5 }} />
                <Typography variant="caption">+12% this week</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            color: 'white'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {realTimeData.activeDoctors}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Active Doctors
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                  <HealthAndSafety />
                </Avatar>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <TrendingUp sx={{ fontSize: 16, mr: 0.5 }} />
                <Typography variant="caption">+5% this week</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            color: 'white'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {realTimeData.aiPredictions}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    AI Predictions
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                  <Psychology />
                </Avatar>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <TrendingUp sx={{ fontSize: 16, mr: 0.5 }} />
                <Typography variant="caption">+23% this week</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            color: 'white'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {realTimeData.systemHealth}%
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    System Health
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                  <CheckCircle />
                </Avatar>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <CheckCircle sx={{ fontSize: 16, mr: 0.5 }} />
                <Typography variant="caption">Optimal</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Content Grid */}
      <Grid container spacing={3}>
        {/* Performance Charts */}
        <Grid item xs={12} lg={8}>
          <Card sx={{ height: 400 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <Timeline sx={{ mr: 1 }} />
                Weekly Performance Analytics
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Area type="monotone" dataKey="patients" stackId="1" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="consultations" stackId="1" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="ai_usage" stackId="1" stroke="#ffc658" fill="#ffc658" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* AI Model Performance */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ height: 400 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <Biotech sx={{ mr: 1 }} />
                AI Model Performance
              </Typography>
              {aiModelPerformance.map((model, index) => (
                <Box key={model.name} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">{model.name}</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {model.accuracy}%
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={model.accuracy} 
                    sx={{ 
                      height: 8, 
                      borderRadius: 4,
                      backgroundColor: theme.palette.grey[200],
                      '& .MuiLinearProgress-bar': {
                        background: `linear-gradient(90deg, ${COLORS[index % COLORS.length]} 0%, ${COLORS[(index + 1) % COLORS.length]} 100%)`
                      }
                    }} 
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                    <Typography variant="caption" color="textSecondary">
                      Speed: {model.speed}s
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Usage: {model.usage}%
                    </Typography>
                  </Box>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* AI Insights */}
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <Psychology sx={{ mr: 1 }} />
                AI Insights & Alerts
              </Typography>
              <List>
                {aiInsights.map((insight) => (
                  <ListItem key={insight.id} sx={{ 
                    border: `1px solid ${getSeverityColor(insight.severity)}`,
                    borderRadius: 2,
                    mb: 1,
                    backgroundColor: `${getSeverityColor(insight.severity)}10`
                  }}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: getSeverityColor(insight.severity) }}>
                        {getSeverityIcon(insight.severity)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={insight.title}
                      secondary={
                        <Box>
                          <Typography variant="body2" color="textSecondary">
                            {insight.description}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                            <Chip 
                              label={`${insight.confidence}% confidence`} 
                              size="small" 
                              color={insight.severity === 'high' ? 'error' : insight.severity === 'medium' ? 'warning' : 'success'}
                            />
                            <Typography variant="caption" sx={{ ml: 1 }}>
                              {new Date(insight.timestamp).toLocaleTimeString()}
                            </Typography>
                          </Box>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* System Status */}
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <Speed sx={{ mr: 1 }} />
                System Status
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center', p: 2, border: `1px solid ${theme.palette.divider}`, borderRadius: 2 }}>
                    <Typography variant="h4" color="primary">
                      {realTimeData.responseTime}ms
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Response Time
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center', p: 2, border: `1px solid ${theme.palette.divider}`, borderRadius: 2 }}>
                    <Typography variant="h4" color="success.main">
                      {realTimeData.accuracy}%
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      AI Accuracy
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center', p: 2, border: `1px solid ${theme.palette.divider}`, borderRadius: 2 }}>
                    <Typography variant="h4" color="warning.main">
                      {realTimeData.securityScore}%
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Security Score
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center', p: 2, border: `1px solid ${theme.palette.divider}`, borderRadius: 2 }}>
                    <Typography variant="h4" color="info.main">
                      {realTimeData.pendingAppointments}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Pending Appointments
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EnhancedDashboard;
