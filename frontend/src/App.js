import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout';
import Dashboard from './components/dashboard/Dashboard';
import PatientDashboard from './components/dashboard/PatientDashboard';
import MedicalRecordsPage from './components/medical-records/MedicalRecordsPage';
import SymptomCheckerPage from './components/symptom-checker/SymptomCheckerPage';
import AppointmentsPage from './components/appointments/AppointmentsPage';
import ChatPage from './components/chat/ChatPage';
import VideoCallsPage from './components/video-calls/VideoCallsPage';
import PatientManagementPage from './components/patient-management/PatientManagementPage';
import SecurityPrivacyPage from './components/security/SecurityPrivacyPage';
import AdvancedAIFeaturesPage from './components/advanced-ai/AdvancedAIFeaturesPage';
import AnalyticsDashboardPage from './components/analytics/AnalyticsDashboardPage';
import CrisisDashboardPage from './components/crisis/CrisisDashboardPage';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/patient-dashboard" element={<PatientDashboard />} />
              <Route path="/medical-records" element={<MedicalRecordsPage />} />
              <Route path="/symptom-checker" element={<SymptomCheckerPage />} />
              <Route path="/appointments" element={<AppointmentsPage />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/video-calls" element={<VideoCallsPage />} />
              <Route path="/patient-management" element={<PatientManagementPage />} />
              <Route path="/security-privacy" element={<SecurityPrivacyPage />} />
              <Route path="/advanced-ai" element={<AdvancedAIFeaturesPage />} />
              <Route path="/analytics" element={<AnalyticsDashboardPage />} />
              <Route path="/crisis-dashboard" element={<CrisisDashboardPage />} />
            </Routes>
          </Layout>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App; 