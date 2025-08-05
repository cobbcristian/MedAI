import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Paper,
  Divider,
  Avatar,
  Badge,
  Stepper,
  Step,
  StepLabel,
  StepContent,
} from '@mui/material';
import {
  CalendarToday,
  Schedule,
  Person,
  VideoCall,
  Phone,
  LocationOn,
  Edit,
  Delete,
  Add,
  CheckCircle,
  Cancel,
  Warning,
  Info,
  AccessTime,
  Event,
  Notifications,
} from '@mui/icons-material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, addDays, isAfter, isBefore } from 'date-fns';

// Mock data for demonstration
const mockDoctors = [
  { id: 1, name: 'Dr. Sarah Johnson', specialty: 'Cardiology', avatar: 'SJ', available: true },
  { id: 2, name: 'Dr. Michael Chen', specialty: 'Dermatology', avatar: 'MC', available: true },
  { id: 3, name: 'Dr. Emily Rodriguez', specialty: 'Pediatrics', avatar: 'ER', available: false },
  { id: 4, name: 'Dr. James Wilson', specialty: 'Neurology', avatar: 'JW', available: true },
];

const mockAppointments = [
  {
    id: 1,
    doctor: mockDoctors[0],
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    time: '10:00 AM',
    type: 'video',
    status: 'confirmed',
    notes: 'Follow-up consultation for heart condition',
  },
  {
    id: 2,
    doctor: mockDoctors[1],
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    time: '2:30 PM',
    type: 'in-person',
    status: 'pending',
    notes: 'Skin condition evaluation',
  },
];

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState(mockAppointments);
  const [doctors, setDoctors] = useState(mockDoctors);
  const [selectedTab, setSelectedTab] = useState(0);
  const [openScheduleDialog, setOpenScheduleDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [scheduleStep, setScheduleStep] = useState(0);
  
  // Form states
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('');
  const [appointmentType, setAppointmentType] = useState('video');
  const [notes, setNotes] = useState('');

  const handleScheduleAppointment = () => {
    setOpenScheduleDialog(true);
    setScheduleStep(0);
    setSelectedDoctor('');
    setSelectedDate(new Date());
    setSelectedTime('');
    setAppointmentType('video');
    setNotes('');
  };

  const handleEditAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setSelectedDoctor(appointment.doctor.id);
    setSelectedDate(appointment.date);
    setSelectedTime(appointment.time);
    setAppointmentType(appointment.type);
    setNotes(appointment.notes);
    setOpenEditDialog(true);
  };

  const handleCancelAppointment = (appointmentId) => {
    setAppointments(appointments.map(apt => 
      apt.id === appointmentId 
        ? { ...apt, status: 'cancelled' }
        : apt
    ));
  };

  const handleConfirmSchedule = () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const newAppointment = {
        id: Date.now(),
        doctor: doctors.find(d => d.id === selectedDoctor),
        date: selectedDate,
        time: selectedTime,
        type: appointmentType,
        status: 'confirmed',
        notes: notes,
      };
      
      setAppointments([...appointments, newAppointment]);
      setOpenScheduleDialog(false);
      setLoading(false);
      setScheduleStep(0);
    }, 1000);
  };

  const handleConfirmEdit = () => {
    setLoading(true);
    
    setTimeout(() => {
      setAppointments(appointments.map(apt => 
        apt.id === selectedAppointment.id
          ? {
              ...apt,
              doctor: doctors.find(d => d.id === selectedDoctor),
              date: selectedDate,
              time: selectedTime,
              type: appointmentType,
              notes: notes,
            }
          : apt
      ));
      setOpenEditDialog(false);
      setLoading(false);
    }, 1000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'success';
      case 'pending': return 'warning';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed': return <CheckCircle />;
      case 'pending': return <Schedule />;
      case 'cancelled': return <Cancel />;
      default: return <Info />;
    }
  };

  const getTypeIcon = (type) => {
    return type === 'video' ? <VideoCall /> : <LocationOn />;
  };

  const upcomingAppointments = appointments.filter(apt => 
    apt.status !== 'cancelled' && isAfter(apt.date, new Date())
  );

  const pastAppointments = appointments.filter(apt => 
    isBefore(apt.date, new Date())
  );

  const cancelledAppointments = appointments.filter(apt => 
    apt.status === 'cancelled'
  );

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Appointments
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleScheduleAppointment}
            sx={{ borderRadius: 2 }}
          >
            Schedule Appointment
          </Button>
        </Box>

        <Paper sx={{ mb: 3 }}>
          <Tabs value={selectedTab} onChange={(e, newValue) => setSelectedTab(newValue)}>
            <Tab label={`Upcoming (${upcomingAppointments.length})`} />
            <Tab label={`Past (${pastAppointments.length})`} />
            <Tab label={`Cancelled (${cancelledAppointments.length})`} />
          </Tabs>
        </Paper>

        {/* Upcoming Appointments */}
        {selectedTab === 0 && (
          <Grid container spacing={3}>
            {upcomingAppointments.length === 0 ? (
              <Grid item xs={12}>
                <Card>
                  <CardContent sx={{ textAlign: 'center', py: 4 }}>
                    <CalendarToday sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      No upcoming appointments
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Schedule your first appointment to get started
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ) : (
              upcomingAppointments.map((appointment) => (
                <Grid item xs={12} md={6} key={appointment.id}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{ bgcolor: 'primary.main' }}>
                            {appointment.doctor.avatar}
                          </Avatar>
                          <Box>
                            <Typography variant="h6">{appointment.doctor.name}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {appointment.doctor.specialty}
                            </Typography>
                          </Box>
                        </Box>
                        <Chip
                          icon={getStatusIcon(appointment.status)}
                          label={appointment.status}
                          color={getStatusColor(appointment.status)}
                          size="small"
                        />
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <Event color="action" />
                        <Typography variant="body2">
                          {format(appointment.date, 'EEEE, MMMM d, yyyy')}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <AccessTime color="action" />
                        <Typography variant="body2">{appointment.time}</Typography>
                        {getTypeIcon(appointment.type)}
                        <Typography variant="body2" color="text.secondary">
                          {appointment.type === 'video' ? 'Video Call' : 'In-Person'}
                        </Typography>
                      </Box>
                      
                      {appointment.notes && (
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {appointment.notes}
                        </Typography>
                      )}
                      
                      <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                        <Button
                          size="small"
                          startIcon={<Edit />}
                          onClick={() => handleEditAppointment(appointment)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="small"
                          color="error"
                          startIcon={<Cancel />}
                          onClick={() => handleCancelAppointment(appointment.id)}
                        >
                          Cancel
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>
        )}

        {/* Past Appointments */}
        {selectedTab === 1 && (
          <Grid container spacing={3}>
            {pastAppointments.map((appointment) => (
              <Grid item xs={12} md={6} key={appointment.id}>
                <Card sx={{ height: '100%', opacity: 0.7 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: 'grey.400' }}>
                          {appointment.doctor.avatar}
                        </Avatar>
                        <Box>
                          <Typography variant="h6">{appointment.doctor.name}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {appointment.doctor.specialty}
                          </Typography>
                        </Box>
                      </Box>
                      <Chip
                        icon={<CheckCircle />}
                        label="Completed"
                        color="success"
                        size="small"
                      />
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <Event color="action" />
                      <Typography variant="body2">
                        {format(appointment.date, 'EEEE, MMMM d, yyyy')}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AccessTime color="action" />
                      <Typography variant="body2">{appointment.time}</Typography>
                      {getTypeIcon(appointment.type)}
                      <Typography variant="body2" color="text.secondary">
                        {appointment.type === 'video' ? 'Video Call' : 'In-Person'}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Cancelled Appointments */}
        {selectedTab === 2 && (
          <Grid container spacing={3}>
            {cancelledAppointments.map((appointment) => (
              <Grid item xs={12} md={6} key={appointment.id}>
                <Card sx={{ height: '100%', opacity: 0.7 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: 'grey.400' }}>
                          {appointment.doctor.avatar}
                        </Avatar>
                        <Box>
                          <Typography variant="h6">{appointment.doctor.name}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {appointment.doctor.specialty}
                          </Typography>
                        </Box>
                      </Box>
                      <Chip
                        icon={<Cancel />}
                        label="Cancelled"
                        color="error"
                        size="small"
                      />
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <Event color="action" />
                      <Typography variant="body2">
                        {format(appointment.date, 'EEEE, MMMM d, yyyy')}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AccessTime color="action" />
                      <Typography variant="body2">{appointment.time}</Typography>
                      {getTypeIcon(appointment.type)}
                      <Typography variant="body2" color="text.secondary">
                        {appointment.type === 'video' ? 'Video Call' : 'In-Person'}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* Schedule Appointment Dialog */}
      <Dialog open={openScheduleDialog} onClose={() => setOpenScheduleDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Schedule New Appointment</DialogTitle>
        <DialogContent>
          <Stepper activeStep={scheduleStep} orientation="vertical">
            <Step>
              <StepLabel>Select Doctor</StepLabel>
              <StepContent>
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <InputLabel>Choose a doctor</InputLabel>
                  <Select
                    value={selectedDoctor}
                    onChange={(e) => setSelectedDoctor(e.target.value)}
                    label="Choose a doctor"
                  >
                    {doctors.filter(d => d.available).map((doctor) => (
                      <MenuItem key={doctor.id} value={doctor.id}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{ width: 32, height: 32, fontSize: '0.875rem' }}>
                            {doctor.avatar}
                          </Avatar>
                          <Box>
                            <Typography variant="body1">{doctor.name}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {doctor.specialty}
                            </Typography>
                          </Box>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Box sx={{ mt: 2 }}>
                  <Button
                    variant="contained"
                    onClick={() => setScheduleStep(1)}
                    disabled={!selectedDoctor}
                  >
                    Next
                  </Button>
                </Box>
              </StepContent>
            </Step>
            
            <Step>
              <StepLabel>Select Date & Time</StepLabel>
              <StepContent>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DateTimePicker
                    label="Appointment Date & Time"
                    value={selectedDate}
                    onChange={setSelectedDate}
                    minDateTime={new Date()}
                    sx={{ width: '100%', mt: 2 }}
                  />
                </LocalizationProvider>
                <Box sx={{ mt: 2 }}>
                  <Button onClick={() => setScheduleStep(0)}>Back</Button>
                  <Button
                    variant="contained"
                    onClick={() => setScheduleStep(2)}
                    disabled={!selectedDate}
                    sx={{ ml: 1 }}
                  >
                    Next
                  </Button>
                </Box>
              </StepContent>
            </Step>
            
            <Step>
              <StepLabel>Appointment Details</StepLabel>
              <StepContent>
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <InputLabel>Appointment Type</InputLabel>
                  <Select
                    value={appointmentType}
                    onChange={(e) => setAppointmentType(e.target.value)}
                    label="Appointment Type"
                  >
                    <MenuItem value="video">Video Call</MenuItem>
                    <MenuItem value="in-person">In-Person</MenuItem>
                  </Select>
                </FormControl>
                
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Notes (Optional)"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  sx={{ mt: 2 }}
                />
                
                <Box sx={{ mt: 2 }}>
                  <Button onClick={() => setScheduleStep(1)}>Back</Button>
                  <Button
                    variant="contained"
                    onClick={handleConfirmSchedule}
                    disabled={loading}
                    sx={{ ml: 1 }}
                  >
                    {loading ? <CircularProgress size={20} /> : 'Schedule Appointment'}
                  </Button>
                </Box>
              </StepContent>
            </Step>
          </Stepper>
        </DialogContent>
      </Dialog>

      {/* Edit Appointment Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Appointment</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Choose a doctor</InputLabel>
            <Select
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(e.target.value)}
              label="Choose a doctor"
            >
              {doctors.filter(d => d.available).map((doctor) => (
                <MenuItem key={doctor.id} value={doctor.id}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ width: 32, height: 32, fontSize: '0.875rem' }}>
                      {doctor.avatar}
                    </Avatar>
                    <Box>
                      <Typography variant="body1">{doctor.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {doctor.specialty}
                      </Typography>
                    </Box>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
              label="Appointment Date & Time"
              value={selectedDate}
              onChange={setSelectedDate}
              minDateTime={new Date()}
              sx={{ width: '100%', mt: 2 }}
            />
          </LocalizationProvider>
          
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Appointment Type</InputLabel>
            <Select
              value={appointmentType}
              onChange={(e) => setAppointmentType(e.target.value)}
              label="Appointment Type"
            >
              <MenuItem value="video">Video Call</MenuItem>
              <MenuItem value="in-person">In-Person</MenuItem>
            </Select>
          </FormControl>
          
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Notes (Optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleConfirmEdit}
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} /> : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AppointmentsPage; 