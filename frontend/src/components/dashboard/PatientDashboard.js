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
import { useQuery } from 'react-query';
import api from '../../services/api';
import { format } from 'date-fns';
import aiService from '../../services/aiService';

function GlobalSymptomMapPlaceholder() {
  return (
    <Box my={4} p={3} bgcolor="#fff3cd" borderRadius={2} border={1} borderColor="#ffeeba">
      <Typography variant="h6" color="textPrimary" gutterBottom>
        Global Symptom Heatmap (Coming Soon)
      </Typography>
      <Typography variant="body2" color="textSecondary">
        This section will display a real-time outbreak heatmap and early warning system. (Vue component integration required)
      </Typography>
    </Box>
  );
}

const PatientDashboard = () => {
  const { user } = useAuth();
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [offlineSyncStatus, setOfflineSyncStatus] = useState(null);

  // Fetch upcoming appointments
  const { data: appointments, isLoading: appointmentsLoading } = useQuery(
    'patient-appointments',
    async () => {
      const response = await api.get('/api/appointments');
      return response.data;
    },
    {
      refetchInterval: 30000, // Refetch every 30 seconds
    }
  );

  useEffect(() => {
    if (appointments) {
      setUpcomingAppointments(appointments.slice(0, 5)); // Show only next 5
      setLoading(false);
    }
  }, [appointments]);

  // Fetch offline sync status
  const { data: syncStatus, isLoading: syncLoading } = useQuery(
    'offline-sync-status',
    async () => {
      const response = await aiService.getOfflineSyncStatus();
      return response;
    },
    {
      refetchInterval: 30000, // Refetch every 30 seconds
    }
  );

  useEffect(() => {
    if (syncStatus) {
      setOfflineSyncStatus(syncStatus);
    }
  }, [syncStatus]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'CANCELLED':
        return 'error';
      case 'COMPLETED':
        return 'info';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return <CheckCircle />;
      case 'PENDING':
        return <Schedule />;
      case 'CANCELLED':
        return <Cancel />;
      case 'COMPLETED':
        return <CheckCircle />;
      default:
        return <Schedule />;
    }
  };

  function OfflineSyncStatus() {
    if (syncLoading) {
      return <CircularProgress size={20} />;
    }

    if (!offlineSyncStatus) {
      return <Chip label="Online Mode" color="success" size="small" />;
    }

    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Chip 
          label={offlineSyncStatus.isOnline ? "Online" : "Offline"} 
          color={offlineSyncStatus.isOnline ? "success" : "warning"} 
          size="small" 
        />
        {offlineSyncStatus.pendingSync && (
          <Chip label={`${offlineSyncStatus.pendingSync} pending`} color="info" size="small" />
        )}
      </Box>
    );
  }

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Welcome back, {user?.name || 'Patient'}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's your health summary and upcoming appointments.
        </Typography>
      </Box>

      {/* Offline Sync Status */}
      <Box sx={{ mb: 3 }}>
        <OfflineSyncStatus />
      </Box>

      <Grid container spacing={3}>
        {/* Quick Actions */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<VideoCall />}
                  fullWidth
                >
                  Join Video Call
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Chat />}
                  fullWidth
                >
                  Start Chat
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<LocalHospital />}
                  fullWidth
                >
                  Book Appointment
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Description />}
                  fullWidth
                >
                  View Records
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Upcoming Appointments */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <CalendarToday color="primary" />
                <Typography variant="h6">
                  Upcoming Appointments
                </Typography>
              </Box>
              {appointmentsLoading ? (
                <Box display="flex" justifyContent="center" p={3}>
                  <CircularProgress />
                </Box>
              ) : upcomingAppointments.length === 0 ? (
                <Alert severity="info">
                  No upcoming appointments. Book your next consultation!
                </Alert>
              ) : (
                <List>
                  {upcomingAppointments.map((appointment, index) => (
                    <React.Fragment key={appointment.id || index}>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: `${getStatusColor(appointment.status)}.main` }}>
                            {getStatusIcon(appointment.status)}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={`Dr. ${appointment.doctorName || 'Doctor'}`}
                          secondary={`${format(new Date(appointment.date), 'MMM dd, yyyy')} at ${appointment.time}`}
                        />
                        <Chip
                          label={appointment.status}
                          color={getStatusColor(appointment.status)}
                          size="small"
                        />
                      </ListItem>
                      {index < upcomingAppointments.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Health Summary */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Health Summary
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="primary">
                      {upcomingAppointments.filter(a => a.status === 'COMPLETED').length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Completed Consultations
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="success.main">
                      {upcomingAppointments.filter(a => a.status === 'CONFIRMED').length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Upcoming Appointments
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        {/* Recent Activity */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Activity
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'success.main' }}>
                      <CheckCircle />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Appointment confirmed"
                    secondary="Dr. Smith - Tomorrow at 2:00 PM"
                  />
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'info.main' }}>
                      <Description />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Medical record uploaded"
                    secondary="Lab results - 2 days ago"
                  />
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'warning.main' }}>
                      <HealthAndSafety />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Symptom check completed"
                    secondary="Headache analysis - 3 days ago"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
        {/* Notifications */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Notifications color="primary" />
                <Typography variant="h6">
                  Notifications
                </Typography>
              </Box>
              <Alert severity="info" sx={{ mb: 2 }}>
                Your appointment with Dr. Johnson is in 30 minutes. Please join the video call.
              </Alert>
              <Alert severity="success" sx={{ mb: 2 }}>
                Your medical records have been updated with the latest lab results.
              </Alert>
              <Alert severity="warning">
                Don't forget to complete your health questionnaire before your next appointment.
              </Alert>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default PatientDashboard;