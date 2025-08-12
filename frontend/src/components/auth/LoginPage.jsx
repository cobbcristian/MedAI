import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  Card,
  CardContent,
  Avatar,
  Tabs,
  Tab,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Person,
  LocalHospital,
  Security,
  AccountBalance,
  Build,
  Medication,
  LocalShipping,
  AdminPanelSettings
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    role: 'patient'
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setLoginData(prev => ({
      ...prev,
      role: newValue === 0 ? 'patient' : 'provider'
    }));
  };

  const handleInputChange = (field, value) => {
    setLoginData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLogin = () => {
    if (!loginData.email || !loginData.password) {
      setError('Please fill in all fields');
      return;
    }

    // Simulate authentication
    if (loginData.role === 'patient') {
      navigate('/patient-dashboard');
    } else {
      // For providers, show role selection
      navigate('/provider-dashboard');
    }
  };

  const providerRoles = [
    { value: 'doctor', label: 'Doctor', icon: <LocalHospital />, color: 'primary.main' },
    { value: 'nurse', label: 'Nurse', icon: <Medication />, color: 'secondary.main' },
    { value: 'admin', label: 'Administrator', icon: <AdminPanelSettings />, color: 'error.main' },
    { value: 'accounting', label: 'Accounting', icon: <AccountBalance />, color: 'success.main' },
    { value: 'ambulance', label: 'Ambulance', icon: <LocalShipping />, color: 'warning.main' },
    { value: 'maintenance', label: 'Maintenance', icon: <Build />, color: 'info.main' }
  ];

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Avatar sx={{ width: 80, height: 80, mx: 'auto', mb: 2, bgcolor: 'primary.main' }}>
            <Security sx={{ fontSize: 40 }} />
          </Avatar>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            MedAI Healthcare Platform
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Secure login for patients and healthcare providers
          </Typography>
        </Box>

        <Tabs value={activeTab} onChange={handleTabChange} centered sx={{ mb: 4 }}>
          <Tab 
            label="Patient Login" 
            icon={<Person />} 
            iconPosition="start"
          />
          <Tab 
            label="Provider Login" 
            icon={<LocalHospital />} 
            iconPosition="start"
          />
        </Tabs>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={loginData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={loginData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                required
              />
            </Grid>
            
            {activeTab === 1 && (
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Provider Role</InputLabel>
                  <Select
                    value={loginData.role}
                    label="Provider Role"
                    onChange={(e) => handleInputChange('role', e.target.value)}
                  >
                    {providerRoles.map((role) => (
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
              </Grid>
            )}

            <Grid item xs={12}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{ py: 1.5 }}
              >
                {activeTab === 0 ? 'Patient Login' : 'Provider Login'}
              </Button>
            </Grid>
          </Grid>
        </Box>

        {activeTab === 1 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Provider Roles & Access:
            </Typography>
            <Grid container spacing={2}>
              {providerRoles.map((role) => (
                <Grid item xs={12} sm={6} md={4} key={role.value}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Box sx={{ color: role.color, mb: 1 }}>
                        {role.icon}
                      </Box>
                      <Typography variant="h6" gutterBottom>
                        {role.label}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {role.value === 'doctor' && 'Patient care, diagnosis, treatment'}
                        {role.value === 'nurse' && 'Patient monitoring, medication, care'}
                        {role.value === 'admin' && 'System administration, user management'}
                        {role.value === 'accounting' && 'Billing, insurance, financial management'}
                        {role.value === 'ambulance' && 'Emergency response, transport'}
                        {role.value === 'maintenance' && 'Equipment maintenance, facilities'}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default LoginPage;
