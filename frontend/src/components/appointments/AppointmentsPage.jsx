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
  Calendar,
  CalendarGrid,
  CalendarCell,
  CalendarHeader
} from '@mui/material';
import {
  Schedule,
  VideoCall,
  Person,
  LocalHospital,
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
  CalendarToday,
  Event,
  Notifications,
  ConfirmationNumber,
  Payment,
  Receipt
} from '@mui/icons-material';
import api from '../../services/api';

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      type: 'consultation',
      title: 'Follow-up Consultation',
      date: '2024-01-20',
      time: '14:00',
      duration: 30,
      doctor: 'Dr. Sarah Johnson',
      specialty: 'Cardiology',
      status: 'confirmed',
      patient: 'John Smith',
      notes: 'Review blood pressure medication',
      location: 'Virtual',
      meetingLink: 'https://meet.google.com/abc-defg-hij',
      cost: 150
    },
    {
      id: 2,
      type: 'checkup',
      title: 'Annual Physical',
      date: '2024-01-25',
      time: '10:30',
      duration: 60,
      doctor: 'Dr. Michael Chen',
      specialty: 'Primary Care',
      status: 'scheduled',
      patient: 'John Smith',
      notes: 'Complete annual physical examination',
      location: 'In-Person',
      cost: 200
    },
    {
      id: 3,
      type: 'emergency',
      title: 'Emergency Consultation',
      date: '2024-01-18',
      time: '09:00',
      duration: 45,
      doctor: 'Dr. Emily Davis',
      specialty: 'Emergency Medicine',
      status: 'completed',
      patient: 'John Smith',
      notes: 'Chest pain evaluation',
      location: 'Virtual',
      cost: 300
    }
  ]);

  const [selectedTab, setSelectedTab] = useState(0);
  const [bookingDialog, setBookingDialog] = useState(false);
  const [viewDialog, setViewDialog] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [booking, setBooking] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('');

  const appointmentTypes = [
    { value: 'consultation', label: 'Consultation', icon: <Person /> },
    { value: 'checkup', label: 'Checkup', icon: <LocalHospital /> },
    { value: 'emergency', label: 'Emergency', icon: <Warning /> },
    { value: 'followup', label: 'Follow-up', icon: <Schedule /> },
    { value: 'surgery', label: 'Surgery', icon: <LocalHospital /> },
    { value: 'imaging', label: 'Imaging', icon: <Info /> }
  ];

  const doctors = [
    { id: 1, name: 'Dr. Sarah Johnson', specialty: 'Cardiology', available: true },
    { id: 2, name: 'Dr. Michael Chen', specialty: 'Primary Care', available: true },
    { id: 3, name: 'Dr. Emily Davis', specialty: 'Emergency Medicine', available: true },
    { id: 4, name: 'Dr. Lisa Rodriguez', specialty: 'Dermatology', available: false }
  ];

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'success';
      case 'scheduled': return 'primary';
      case 'pending': return 'warning';
      case 'completed': return 'info';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed': return <CheckCircle />;
      case 'scheduled': return <Schedule />;
      case 'pending': return <Warning />;
      case 'completed': return <CheckCircle />;
      case 'cancelled': return <Warning />;
      default: return <Info />;
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'consultation': return <Person />;
      case 'checkup': return <LocalHospital />;
      case 'emergency': return <Warning />;
      case 'followup': return <Schedule />;
      case 'surgery': return <LocalHospital />;
      case 'imaging': return <Info />;
      default: return <Event />;
    }
  };

  const handleBookAppointment = async (appointmentData) => {
    setBooking(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newAppointment = {
        id: appointments.length + 1,
        ...appointmentData,
        status: 'scheduled',
        patient: 'John Smith'
      };

      setAppointments([newAppointment, ...appointments]);
      setBookingDialog(false);
    } catch (error) {
      console.error('Booking failed:', error);
    } finally {
      setBooking(false);
    }
  };

  const handleViewAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setViewDialog(true);
  };

  const handleCancelAppointment = (appointmentId) => {
    setAppointments(appointments.map(apt => 
      apt.id === appointmentId 
        ? { ...apt, status: 'cancelled' }
        : apt
    ));
  };

  const handleRescheduleAppointment = (appointmentId) => {
    // Implementation for rescheduling
    console.log('Rescheduling appointment:', appointmentId);
  };

  const filteredAppointments = selectedTab === 0 
    ? appointments 
    : appointments.filter(apt => apt.type === appointmentTypes[selectedTab - 1]?.value);

  const upcomingAppointments = appointments.filter(apt => 
    apt.status === 'scheduled' || apt.status === 'confirmed'
  );

  const completedAppointments = appointments.filter(apt => 
    apt.status === 'completed'
  );

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Appointments
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setBookingDialog(true)}
        >
          Book Appointment
        </Button>
      </Box>

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Schedule color="primary" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h6">{upcomingAppointments.length}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Upcoming
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
                <CheckCircle color="success" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h6">{completedAppointments.length}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Completed
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
                <VideoCall color="info" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h6">
                    {appointments.filter(apt => apt.location === 'Virtual').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Virtual
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
                <LocalHospital color="secondary" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h6">
                    {appointments.filter(apt => apt.location === 'In-Person').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    In-Person
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
          <Tab label="All Appointments" />
          {appointmentTypes.map((type) => (
            <Tab 
              key={type.value} 
              label={type.label}
              icon={type.icon}
              iconPosition="start"
            />
          ))}
        </Tabs>
      </Paper>

      {/* Appointments Grid */}
      <Grid container spacing={3}>
        {filteredAppointments.map((appointment) => (
          <Grid item xs={12} sm={6} md={4} key={appointment.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  {getTypeIcon(appointment.type)}
                  <Typography variant="h6" sx={{ ml: 1 }}>
                    {appointment.title}
                  </Typography>
                </Box>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {appointment.notes}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Chip
                    icon={getStatusIcon(appointment.status)}
                    label={appointment.status}
                    color={getStatusColor(appointment.status)}
                    size="small"
                  />
                  <Typography variant="caption" sx={{ ml: 1 }}>
                    {appointment.date} at {appointment.time}
                  </Typography>
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  <strong>Doctor:</strong> {appointment.doctor}
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  <strong>Duration:</strong> {appointment.duration} minutes
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Chip 
                    label={appointment.location} 
                    size="small" 
                    variant="outlined"
                    icon={appointment.location === 'Virtual' ? <VideoCall /> : <LocationOn />}
                  />
                  <Typography variant="caption" sx={{ ml: 1 }}>
                    ${appointment.cost}
                  </Typography>
                </Box>
              </CardContent>

              <CardActions>
                <Button 
                  size="small" 
                  startIcon={<Visibility />}
                  onClick={() => handleViewAppointment(appointment)}
                >
                  View
                </Button>
                {appointment.status === 'scheduled' && (
                  <Button 
                    size="small" 
                    startIcon={<Edit />}
                    onClick={() => handleRescheduleAppointment(appointment.id)}
                  >
                    Reschedule
                  </Button>
                )}
                {appointment.status !== 'cancelled' && appointment.status !== 'completed' && (
                  <Button 
                    size="small" 
                    color="error"
                    onClick={() => handleCancelAppointment(appointment.id)}
                  >
                    Cancel
                  </Button>
                )}
                {appointment.location === 'Virtual' && appointment.meetingLink && (
                  <Button 
                    size="small" 
                    variant="contained"
                    startIcon={<VideoCall />}
                    href={appointment.meetingLink}
                    target="_blank"
                  >
                    Join
                  </Button>
                )}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Booking Dialog */}
      <Dialog open={bookingDialog} onClose={() => setBookingDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Book New Appointment</DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>Appointment Details</Typography>
              
              <TextField
                fullWidth
                label="Appointment Title"
                placeholder="e.g., Follow-up Consultation"
                sx={{ mb: 2 }}
              />

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Appointment Type</InputLabel>
                <Select label="Appointment Type">
                  {appointmentTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Select Doctor</InputLabel>
                <Select label="Select Doctor">
                  {doctors.filter(d => d.available).map((doctor) => (
                    <MenuItem key={doctor.id} value={doctor.id}>
                      {doctor.name} - {doctor.specialty}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                multiline
                rows={3}
                label="Notes"
                placeholder="Describe your symptoms or reason for visit..."
                sx={{ mb: 2 }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>Schedule</Typography>
              
              <TextField
                fullWidth
                type="date"
                label="Date"
                InputLabelProps={{ shrink: true }}
                sx={{ mb: 2 }}
              />

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Time Slot</InputLabel>
                <Select label="Time Slot">
                  {timeSlots.map((time) => (
                    <MenuItem key={time} value={time}>
                      {time}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Duration</InputLabel>
                <Select label="Duration" defaultValue={30}>
                  <MenuItem value={15}>15 minutes</MenuItem>
                  <MenuItem value={30}>30 minutes</MenuItem>
                  <MenuItem value={45}>45 minutes</MenuItem>
                  <MenuItem value={60}>1 hour</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Location</InputLabel>
                <Select label="Location" defaultValue="virtual">
                  <MenuItem value="virtual">Virtual (Video Call)</MenuItem>
                  <MenuItem value="in-person">In-Person</MenuItem>
                </Select>
              </FormControl>

              {booking && (
                <Box sx={{ width: '100%' }}>
                  <LinearProgress />
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Booking appointment...
                  </Typography>
                </Box>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBookingDialog(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={() => handleBookAppointment({
              title: 'New Appointment',
              type: 'consultation',
              doctor: 'Dr. Sarah Johnson',
              date: '2024-01-30',
              time: '14:00',
              duration: 30,
              notes: 'General consultation',
              location: 'Virtual',
              cost: 150
            })}
            disabled={booking}
          >
            Book Appointment
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Appointment Dialog */}
      <Dialog open={viewDialog} onClose={() => setViewDialog(false)} maxWidth="md" fullWidth>
        {selectedAppointment && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {getTypeIcon(selectedAppointment.type)}
                <Typography variant="h6" sx={{ ml: 1 }}>
                  {selectedAppointment.title}
                </Typography>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>Appointment Details</Typography>
                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        <CalendarToday />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Date & Time" 
                        secondary={`${selectedAppointment.date} at ${selectedAppointment.time}`} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <AccessTime />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Duration" 
                        secondary={`${selectedAppointment.duration} minutes`} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Person />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Doctor" 
                        secondary={selectedAppointment.doctor} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <LocationOn />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Location" 
                        secondary={selectedAppointment.location} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Payment />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Cost" 
                        secondary={`$${selectedAppointment.cost}`} 
                      />
                    </ListItem>
                  </List>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>Status & Notes</Typography>
                  <Box sx={{ mb: 2 }}>
                    <Chip
                      icon={getStatusIcon(selectedAppointment.status)}
                      label={selectedAppointment.status}
                      color={getStatusColor(selectedAppointment.status)}
                      size="medium"
                    />
                  </Box>
                  
                  <Typography variant="body2" paragraph>
                    <strong>Notes:</strong> {selectedAppointment.notes}
                  </Typography>

                  {selectedAppointment.meetingLink && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Meeting Link:
                      </Typography>
                      <Button
                        variant="contained"
                        startIcon={<VideoCall />}
                        href={selectedAppointment.meetingLink}
                        target="_blank"
                        fullWidth
                      >
                        Join Video Call
                      </Button>
                    </Box>
                  )}
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setViewDialog(false)}>Close</Button>
              {selectedAppointment.status === 'scheduled' && (
                <Button variant="outlined" startIcon={<Edit />}>
                  Reschedule
                </Button>
              )}
              {selectedAppointment.meetingLink && (
                <Button variant="contained" startIcon={<VideoCall />}>
                  Join Call
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default AppointmentsPage; 