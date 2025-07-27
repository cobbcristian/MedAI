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

const PatientDashboard = () => {
  const { user } = useAuth();
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const getStatusColor = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return 'success';
      case 'SCHEDULED':
        return 'info';
      case 'IN_PROGRESS':
        return 'warning';
      case 'COMPLETED':
        return 'default';
      case 'CANCELLED':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return <CheckCircle />;
      case 'SCHEDULED':
        return <Schedule />;
      case 'IN_PROGRESS':
        return <VideoCall />;
      case 'COMPLETED':
        return <CheckCircle />;
      case 'CANCELLED':
        return <Cancel />;
      default:
        return <Schedule />;
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Welcome Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome back, {user.firstName}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's your health overview and upcoming appointments
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Quick Actions */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  fullWidth
                  href="/appointments"
                >
                  Book Appointment
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<HealthAndSafety />}
                  fullWidth
                  href="/symptom-checker"
                >
                  Symptom Checker
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Description />}
                  fullWidth
                  href="/medical-records"
                >
                  View Records
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Chat />}
                  fullWidth
                  href="/chat"
                >
                  Chat with Doctor
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Upcoming Appointments */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Upcoming Appointments
                </Typography>
                <Button
                  variant="text"
                  href="/appointments"
                  endIcon={<Add />}
                >
                  View All
                </Button>
              </Box>
              
              {appointmentsLoading ? (
                <Box display="flex" justifyContent="center" p={3}>
                  <CircularProgress />
                </Box>
              ) : upcomingAppointments.length === 0 ? (
                <Alert severity="info">
                  No upcoming appointments. Book your first consultation!
                </Alert>
              ) : (
                <List>
                  {upcomingAppointments.map((appointment, index) => (
                    <React.Fragment key={appointment.id}>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: 'primary.main' }}>
                            <Person />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="subtitle1">
                                Dr. {appointment.doctor?.firstName} {appointment.doctor?.lastName}
                              </Typography>
                              <Chip
                                icon={getStatusIcon(appointment.status)}
                                label={appointment.status}
                                color={getStatusColor(appointment.status)}
                                size="small"
                              />
                            </Box>
                          }
                          secondary={
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                {format(new Date(appointment.scheduledAt), 'PPP p')}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {appointment.type} Consultation • ${appointment.fee}
                              </Typography>
                            </Box>
                          }
                        />
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          {appointment.status === 'CONFIRMED' && (
                            <Button
                              variant="contained"
                              size="small"
                              startIcon={<VideoCall />}
                              href={`/video-call/${appointment.id}`}
                            >
                              Join
                            </Button>
                          )}
                          <Button
                            variant="outlined"
                            size="small"
                            href={`/appointments/${appointment.id}`}
                          >
                            Details
                          </Button>
                        </Box>
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