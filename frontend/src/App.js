import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Container, Typography, Box, Button, Grid, Card, CardContent, CardActions } from '@mui/material';

// Layout
import Layout from './components/layout/Layout';

// Import functional components
import AppointmentsPage from './components/appointments/AppointmentsPage';
import VideoCallsPage from './components/video-calls/VideoCallsPage';
import ChatPage from './components/chat/ChatPage';
import SymptomCheckerPage from './components/symptom-checker/SymptomCheckerPage';
import MedicalRecordsPage from './components/medical-records/MedicalRecordsPage';
import AdvancedAIFeaturesPage from './components/advanced-ai/AdvancedAIFeaturesPage';
import PatientManagementPage from './components/patient-management/PatientManagementPage';
import AnalyticsDashboardPage from './components/analytics/AnalyticsDashboardPage';
import SecurityPrivacyPage from './components/security/SecurityPrivacyPage';
import CrisisDashboardPage from './components/crisis/CrisisDashboardPage';

// Create a modern theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#2196f3',
      light: '#64b5f6',
      dark: '#1976d2',
    },
    secondary: {
      main: '#f50057',
      light: '#ff5983',
      dark: '#c51162',
    },
    background: {
      default: '#f8f9fa',
      paper: '#ffffff',
    },
    text: {
      primary: '#2c3e50',
      secondary: '#7f8c8d',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 8,
          padding: '10px 24px',
          fontSize: '0.875rem',
        },
        contained: {
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          '&:hover': {
            boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
    },
        },
      },
    },
  },
});

// Landing page component
const LandingPage = () => {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '20px',
        padding: '40px',
        textAlign: 'center',
        maxWidth: '600px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{
          color: '#2c3e50',
          marginBottom: '20px',
          fontSize: '2.5rem',
          fontWeight: '700'
        }}>
          AI Telemedicine Platform
        </h1>
        <p style={{
          color: '#7f8c8d',
          fontSize: '1.2rem',
          marginBottom: '30px',
          lineHeight: '1.6'
        }}>
          Experience the future of healthcare with AI-powered diagnostics, 
          real-time consultations, and advanced medical insights.
        </p>
        <div style={{
          display: 'flex',
          gap: '20px',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => window.location.href = '/dashboard'}
            style={{
              background: '#2196f3',
              color: 'white',
              border: 'none',
              padding: '12px 30px',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => e.target.style.background = '#1976d2'}
            onMouseOut={(e) => e.target.style.background = '#2196f3'}
          >
            Enter Dashboard
          </button>
          <button
            onClick={() => window.location.href = '/register'}
            style={{
              background: 'transparent',
              color: '#2196f3',
              border: '2px solid #2196f3',
              padding: '12px 30px',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.background = '#2196f3';
              e.target.style.color = 'white';
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.color = '#2196f3';
            }}
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

// Dashboard component
const Dashboard = () => (
  <Container maxWidth="lg">
    <Box sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Welcome to AI Telemedicine
      </Typography>
      <Typography variant="h5" component="h2" gutterBottom color="text.secondary">
        Your healthcare dashboard
      </Typography>
      <Typography variant="body1" paragraph>
        This is your main dashboard where you can access all telemedicine features.
      </Typography>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Quick Actions:
        </Typography>
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Book Appointment
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Schedule your next consultation
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary" onClick={() => window.location.href = '/appointments'}>
                  Book Now
                </Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Medical Records
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  View your health history
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary" onClick={() => window.location.href = '/medical-records'}>
                  View Records
                </Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  AI Symptom Checker
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Get AI-powered diagnosis
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="secondary" onClick={() => window.location.href = '/symptom-checker'}>
                  Check Symptoms
                </Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Video Consultation
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Start a video call
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary" onClick={() => window.location.href = '/video-calls'}>
                  Start Call
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  </Container>
);

// Feature page component
const FeaturePage = ({ title, description, features = [] }) => (
  <Container maxWidth="lg">
    <Box sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        {title}
      </Typography>
      <Typography variant="h5" component="h2" gutterBottom color="text.secondary">
        {description}
      </Typography>
      <Grid container spacing={3} sx={{ mt: 4 }}>
        {features.map((feature, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  </Container>
);

// All functional components are now imported at the top

// Analytics page
const AnalyticsPage = () => (
  <FeaturePage
    title="Analytics Dashboard"
    description="Healthcare analytics and insights"
    features={[
      { title: "Health Metrics", description: "Track key health indicators" },
      { title: "Trend Analysis", description: "Analyze health trends over time" },
      { title: "Performance Reports", description: "Generate detailed health reports" },
      { title: "Predictive Models", description: "AI-powered health predictions" }
    ]}
  />
);

// Security page
const SecurityPage = () => (
  <FeaturePage
    title="Security & Privacy"
    description="Protect your health information"
    features={[
      { title: "Data Encryption", description: "End-to-end encryption for all data" },
      { title: "Access Control", description: "Manage who can access your information" },
      { title: "Audit Logs", description: "Track all access to your health data" },
      { title: "Compliance", description: "HIPAA and GDPR compliance features" }
    ]}
  />
);

// Remove the old placeholder component since we're using the functional one

// Simple register page
const RegisterPage = () => (
  <Container maxWidth="sm">
    <Box sx={{ mt: 8, textAlign: 'center' }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Register
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Create your account
      </Typography>
      <Button 
        variant="contained" 
        color="primary" 
        size="large" 
        sx={{ mt: 3 }}
        onClick={() => window.location.href = '/'}
      >
        Back to Home
      </Button>
    </Box>
  </Container>
);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
          <Route path="/appointments" element={<Layout><AppointmentsPage /></Layout>} />
          <Route path="/video-calls" element={<Layout><VideoCallsPage /></Layout>} />
          <Route path="/chat" element={<Layout><ChatPage /></Layout>} />
          <Route path="/symptom-checker" element={<Layout><SymptomCheckerPage /></Layout>} />
          <Route path="/medical-records" element={<Layout><MedicalRecordsPage /></Layout>} />
          <Route path="/advanced-ai" element={<Layout><AdvancedAIFeaturesPage /></Layout>} />
          <Route path="/patients" element={<Layout><PatientManagementPage /></Layout>} />
          <Route path="/analytics" element={<Layout><AnalyticsDashboardPage /></Layout>} />
          <Route path="/security" element={<Layout><SecurityPrivacyPage /></Layout>} />
          <Route path="/crisis-dashboard" element={<Layout><CrisisDashboardPage /></Layout>} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<LandingPage />} />
            </Routes>
          </Router>
      </ThemeProvider>
  );
}

export default App; 