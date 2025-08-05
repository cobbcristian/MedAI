import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  LinearProgress,
  useTheme
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  LocalHospital,
  VideoCall,
  Chat,
  Description,
  People,
  Analytics,
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
  Info
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

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

  const recentActivity = [
    {
      action: 'Blood test results uploaded',
      time: '2 hours ago',
      icon: <CheckCircle color="success" />,
      type: 'success'
    },
    {
      action: 'Appointment scheduled with Dr. Johnson',
      time: '1 day ago',
      icon: <Info color="info" />,
      type: 'info'
    },
    {
      action: 'Medication reminder: Lisinopril',
      time: '3 days ago',
      icon: <Warning color="warning" />,
      type: 'warning'
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
      case 'stable': return <TrendingUp color="info" />;
      case 'declining': return <TrendingUp color="error" />;
      default: return <TrendingUp color="info" />;
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Welcome to MedAI
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          AI-Powered Healthcare Dashboard
        </Typography>
        <Chip 
          label="AI Assistant Active" 
          color="success" 
          icon={<HealthAndSafety />}
          sx={{ mt: 1 }}
        />
      </Box>

      {/* Quick Actions */}
      <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
        Quick Actions
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {quickActions.map((action, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card 
              sx={{ 
                height: '100%',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                }
              }}
              onClick={() => navigate(action.path)}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: action.color, mr: 2 }}>
                    {action.icon}
                  </Avatar>
                  <Typography variant="h6" component="h3">
                    {action.title}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {action.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary">
                  Open
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Health Metrics */}
      <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
        Health Metrics
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {healthMetrics.map((metric, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" component="h3">
                    {metric.label}
                  </Typography>
                  {getTrendIcon(metric.trend)}
                </Box>
                <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {metric.value}
                </Typography>
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
      <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
        Recent Activity
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Health Events
              </Typography>
              <List>
                {recentActivity.map((activity, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      {activity.icon}
                    </ListItemIcon>
                    <ListItemText 
                      primary={activity.action}
                      secondary={activity.time}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                AI Health Score
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', mr: 2 }}>
                  85
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  / 100
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={85} 
                sx={{ height: 8, borderRadius: 4, mb: 2 }}
              />
              <Typography variant="body2" color="text.secondary">
                Excellent health status based on recent metrics
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 