import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Alert,
  CircularProgress,
  IconButton,
  Badge,
} from '@mui/material';
import {
  CalendarToday,
  VideoCall,
  Chat,
  LocalHospital,
  Person,
  Schedule,
  CheckCircle,
  Cancel,
  Add,
  Notifications,
  HealthAndSafety,
  Description,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

function GlobalSymptomMapPlaceholder() {
  return (
    <Box my={4} p={3} bgcolor="#fff3cd" borderRadius={2} border={1} borderColor="#ffeeba">
      <Typography variant="h6" color="textPrimary" gutterBottom>
        Global Symptom Heatmap (Coming Soon)
      </Typography>
      <Typography variant="body2" color="textSecondary">
        This section will display a real-time outbreak heatmap and early warning system.
      </Typography>
    </Box>
  );
}

const PatientDashboard = () => {
  const { user } = useAuth();
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  // Mock data for demo mode
  useEffect(() => {
    const mockAppointments = [
      {
        id: 1,
        doctorName: 'Dr. Sarah Johnson',
        specialty: 'Cardiology',
        date: '2024-01-15',
        time: '10:00 AM',
        status: 'CONFIRMED',
        type: 'IN_PERSON'
      },
      {
        id: 2,
        doctorName: 'Dr. Michael Chen',
        specialty: 'Dermatology',
        date: '2024-01-18',
        time: '2:30 PM',
        status: 'PENDING',
        type: 'VIDEO_CALL'
      }
    ];
    setUpcomingAppointments(mockAppointments);
    setLoading(false);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'CANCELLED':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return <CheckCircle color="success" />;
      case 'PENDING':
        return <Schedule color="warning" />;
      case 'CANCELLED':
        return <Cancel color="error" />;
      default:
        return <Schedule />;
    }
  };

  function OfflineSyncStatus() {
    return (
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <HealthAndSafety color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6">Offline Sync Status</Typography>
          </Box>
          <Alert severity="info">
            All data is synced and up to date. You can work offline.
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Patient Dashboard
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Welcome back, {user?.name || 'Patient'}! Here's your health overview.
        </Typography>
        <Chip 
          label="Demo Mode" 
          color="info" 
          icon={<HealthAndSafety />}
          sx={{ mt: 1 }}
        />
      </Box>

      {/* Quick Actions */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', cursor: 'pointer' }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  <CalendarToday />
                </Avatar>
                <Typography variant="h6">Book Appointment</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Schedule a new consultation
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', cursor: 'pointer' }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
                  <VideoCall />
                </Avatar>
                <Typography variant="h6">Video Call</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Start virtual consultation
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', cursor: 'pointer' }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                  <Chat />
                </Avatar>
                <Typography variant="h6">Chat Support</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Get help from AI assistant
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', cursor: 'pointer' }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                  <LocalHospital />
                </Avatar>
                <Typography variant="h6">Symptom Check</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                AI-powered symptom analysis
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Offline Sync Status */}
      <OfflineSyncStatus />

      {/* Upcoming Appointments */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h5" component="h2">
              Upcoming Appointments
            </Typography>
            <Button variant="outlined" startIcon={<Add />}>
              Book New
            </Button>
          </Box>

          {upcomingAppointments.length > 0 ? (
            <List>
              {upcomingAppointments.map((appointment, index) => (
                <React.Fragment key={appointment.id}>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar>
                        <Person />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={appointment.doctorName}
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {appointment.specialty} • {appointment.date} at {appointment.time}
                          </Typography>
                          <Chip
                            label={appointment.status}
                            color={getStatusColor(appointment.status)}
                            size="small"
                            icon={getStatusIcon(appointment.status)}
                            sx={{ mt: 1 }}
                          />
                        </Box>
                      }
                    />
                    <Box>
                      <IconButton>
                        <VideoCall />
                      </IconButton>
                      <IconButton>
                        <Chat />
                      </IconButton>
                    </Box>
                  </ListItem>
                  {index < upcomingAppointments.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          ) : (
            <Box textAlign="center" py={4}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No upcoming appointments
              </Typography>
              <Button variant="contained" startIcon={<Add />}>
                Book Your First Appointment
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Global Symptom Map */}
      <GlobalSymptomMapPlaceholder />

      {/* Health Summary */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Health Events
              </Typography>
              <List>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'success.main' }}>
                      <CheckCircle />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Blood test completed"
                    secondary="2 days ago"
                  />
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'info.main' }}>
                      <Description />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Prescription renewed"
                    secondary="1 week ago"
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
                Health Score
              </Typography>
              <Box display="flex" alignItems="center" mb={2}>
                <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', mr: 2 }}>
                  92
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  / 100
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Excellent health status based on recent metrics
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default PatientDashboard;