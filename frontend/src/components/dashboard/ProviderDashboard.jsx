import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Paper,
  Chip,
  Button,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Person,
  LocalHospital,
  CalendarToday,
  VideoCall,
  Chat,
  Medication,
  MonitorHeart,
  Bloodtype,
  Thermostat,
  Favorite,
  HealthAndSafety,
  CheckCircle,
  Warning,
  Info,
  AccountBalance,
  Build,
  LocalShipping,
  AdminPanelSettings,
  People,
  Assignment,
  Assessment,
  Timeline,
  Payment,
  Receipt,
  Engineering,
  Settings,
  Security
} from '@mui/icons-material';

const ProviderDashboard = () => {
  const [selectedRole, setSelectedRole] = useState('doctor');
  const [activeTab, setActiveTab] = useState(0);

  const roles = [
    { value: 'doctor', label: 'Doctor', icon: <LocalHospital />, color: 'primary.main' },
    { value: 'nurse', label: 'Nurse', icon: <Medication />, color: 'secondary.main' },
    { value: 'admin', label: 'Administrator', icon: <AdminPanelSettings />, color: 'error.main' },
    { value: 'accounting', label: 'Accounting', icon: <AccountBalance />, color: 'success.main' },
    { value: 'ambulance', label: 'Ambulance', icon: <LocalShipping />, color: 'warning.main' },
    { value: 'maintenance', label: 'Maintenance', icon: <Build />, color: 'info.main' }
  ];

  const getRoleData = (role) => {
    switch (role) {
      case 'doctor':
        return {
          title: 'Doctor Dashboard',
          subtitle: 'Patient care, diagnosis, and treatment management',
          metrics: [
            { label: 'Active Patients', value: '24', icon: <People />, color: 'primary.main' },
            { label: 'Today\'s Appointments', value: '8', icon: <CalendarToday />, color: 'secondary.main' },
            { label: 'Pending Reports', value: '3', icon: <Assignment />, color: 'warning.main' },
            { label: 'Emergency Cases', value: '1', icon: <Warning />, color: 'error.main' }
          ],
          actions: [
            { label: 'Patient Records', icon: <People />, color: 'primary.main' },
            { label: 'Schedule Appointments', icon: <CalendarToday />, color: 'secondary.main' },
            { label: 'Video Consultations', icon: <VideoCall />, color: 'success.main' },
            { label: 'Medical Reports', icon: <Assessment />, color: 'info.main' }
          ]
        };
      case 'nurse':
        return {
          title: 'Nurse Dashboard',
          subtitle: 'Patient monitoring, medication, and care management',
          metrics: [
            { label: 'Patients Under Care', value: '12', icon: <People />, color: 'primary.main' },
            { label: 'Medication Due', value: '5', icon: <Medication />, color: 'warning.main' },
            { label: 'Vital Signs Check', value: '8', icon: <MonitorHeart />, color: 'secondary.main' },
            { label: 'Care Tasks', value: '15', icon: <Assignment />, color: 'info.main' }
          ],
          actions: [
            { label: 'Patient Monitoring', icon: <MonitorHeart />, color: 'primary.main' },
            { label: 'Medication Management', icon: <Medication />, color: 'secondary.main' },
            { label: 'Vital Signs', icon: <Thermostat />, color: 'success.main' },
            { label: 'Care Plans', icon: <Assignment />, color: 'info.main' }
          ]
        };
      case 'admin':
        return {
          title: 'Administrator Dashboard',
          subtitle: 'System administration and user management',
          metrics: [
            { label: 'Total Users', value: '156', icon: <People />, color: 'primary.main' },
            { label: 'Active Sessions', value: '23', icon: <Timeline />, color: 'secondary.main' },
            { label: 'System Alerts', value: '2', icon: <Warning />, color: 'warning.main' },
            { label: 'Backup Status', value: 'OK', icon: <CheckCircle />, color: 'success.main' }
          ],
          actions: [
            { label: 'User Management', icon: <People />, color: 'primary.main' },
            { label: 'System Settings', icon: <Settings />, color: 'secondary.main' },
            { label: 'Security Logs', icon: <Security />, color: 'warning.main' },
            { label: 'System Health', icon: <HealthAndSafety />, color: 'info.main' }
          ]
        };
      case 'accounting':
        return {
          title: 'Accounting Dashboard',
          subtitle: 'Billing, insurance, and financial management',
          metrics: [
            { label: 'Pending Bills', value: '45', icon: <Receipt />, color: 'warning.main' },
            { label: 'Today\'s Revenue', value: '$12,450', icon: <Payment />, color: 'success.main' },
            { label: 'Insurance Claims', value: '23', icon: <Assignment />, color: 'primary.main' },
            { label: 'Overdue Payments', value: '8', icon: <Warning />, color: 'error.main' }
          ],
          actions: [
            { label: 'Billing Management', icon: <Receipt />, color: 'primary.main' },
            { label: 'Insurance Claims', icon: <Assignment />, color: 'secondary.main' },
            { label: 'Financial Reports', icon: <Assessment />, color: 'success.main' },
            { label: 'Payment Processing', icon: <Payment />, color: 'info.main' }
          ]
        };
      case 'ambulance':
        return {
          title: 'Ambulance Dashboard',
          subtitle: 'Emergency response and transport management',
          metrics: [
            { label: 'Active Calls', value: '3', icon: <Warning />, color: 'error.main' },
            { label: 'Available Units', value: '5', icon: <LocalShipping />, color: 'success.main' },
            { label: 'Response Time', value: '4.2 min', icon: <Timeline />, color: 'warning.main' },
            { label: 'Today\'s Transports', value: '12', icon: <LocalShipping />, color: 'primary.main' }
          ],
          actions: [
            { label: 'Emergency Calls', icon: <Warning />, color: 'error.main' },
            { label: 'Vehicle Management', icon: <LocalShipping />, color: 'primary.main' },
            { label: 'Route Planning', icon: <Timeline />, color: 'secondary.main' },
            { label: 'Dispatch Center', icon: <Assignment />, color: 'info.main' }
          ]
        };
      case 'maintenance':
        return {
          title: 'Maintenance Dashboard',
          subtitle: 'Equipment maintenance and facilities management',
          metrics: [
            { label: 'Equipment Issues', value: '7', icon: <Build />, color: 'warning.main' },
            { label: 'Preventive Maintenance', value: '15', icon: <Engineering />, color: 'primary.main' },
            { label: 'Critical Alerts', value: '2', icon: <Warning />, color: 'error.main' },
            { label: 'Completed Today', value: '8', icon: <CheckCircle />, color: 'success.main' }
          ],
          actions: [
            { label: 'Equipment Status', icon: <Build />, color: 'primary.main' },
            { label: 'Maintenance Schedule', icon: <CalendarToday />, color: 'secondary.main' },
            { label: 'Repair Requests', icon: <Assignment />, color: 'warning.main' },
            { label: 'Facility Management', icon: <Settings />, color: 'info.main' }
          ]
        };
      default:
        return {
          title: 'Provider Dashboard',
          subtitle: 'Healthcare provider management',
          metrics: [],
          actions: []
        };
    }
  };

  const roleData = getRoleData(selectedRole);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          {roleData.title}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {roleData.subtitle}
        </Typography>
      </Box>

      {/* Role Selection */}
      <Card sx={{ mb: 4, boxShadow: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
            Select Your Role
          </Typography>
          <FormControl fullWidth>
            <InputLabel>Provider Role</InputLabel>
            <Select
              value={selectedRole}
              label="Provider Role"
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              {roles.map((role) => (
                <MenuItem key={role.value} value={role.value}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ color: role.color, mr: 1 }}>
                      {role.icon}
                    </Box>
                    {role.label}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </CardContent>
      </Card>

      {/* Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {roleData.metrics.map((metric, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ height: '100%', boxShadow: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ color: metric.color, mr: 1 }}>
                    {metric.icon}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {metric.label}
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: metric.color }}>
                  {metric.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Quick Actions */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
            Quick Actions
          </Typography>
        </Grid>
        {roleData.actions.map((action, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ height: '100%', cursor: 'pointer', boxShadow: 2 }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Box sx={{ color: action.color, mb: 2 }}>
                  {action.icon}
                </Box>
                <Typography variant="h6" gutterBottom>
                  {action.label}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Recent Activity */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ boxShadow: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Recent Activity
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      <Assignment />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary="New patient assigned"
                    secondary="Patient John Doe assigned to your care"
                  />
                  <Chip label="2 min ago" size="small" />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemIcon>
                    <Avatar sx={{ bgcolor: 'secondary.main' }}>
                      <CalendarToday />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary="Appointment scheduled"
                    secondary="Follow-up appointment with Sarah Johnson"
                  />
                  <Chip label="15 min ago" size="small" />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemIcon>
                    <Avatar sx={{ bgcolor: 'success.main' }}>
                      <CheckCircle />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary="Task completed"
                    secondary="Patient vitals recorded successfully"
                  />
                  <Chip label="1 hour ago" size="small" />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ boxShadow: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                System Status
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary="System Online"
                    secondary="All systems operational"
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemIcon>
                    <Warning color="warning" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Maintenance Required"
                    secondary="Equipment #3 needs attention"
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemIcon>
                    <Info color="info" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Updates Available"
                    secondary="System update ready for deployment"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProviderDashboard;
