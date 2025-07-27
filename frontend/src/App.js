import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';

// Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import PatientDashboard from './components/dashboard/PatientDashboard';
import DoctorDashboard from './components/dashboard/DoctorDashboard';
import AdminDashboard from './components/dashboard/AdminDashboard';
import AppointmentBooking from './components/appointments/AppointmentBooking';
import VideoCall from './components/video/VideoCall';
import ChatWindow from './components/chat/ChatWindow';
import SymptomChecker from './components/ai/SymptomChecker';
import MedicalRecords from './components/records/MedicalRecords';
import Profile from './components/profile/Profile';
import PaymentPage from './components/payment/PaymentPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Layout from './components/layout/Layout';
import AdvancedAIFeatures from './components/AdvancedAIFeatures';
import SecurityDashboard from './components/SecurityDashboard';
import AITrainingSandbox from './components/ai/AITrainingSandbox';
import ModelComparisonDashboard from './components/ai/ModelComparisonDashboard';
import PatientFeedbackLoop from './components/ai/PatientFeedbackLoop';

// Context
import { AuthProvider } from './context/AuthContext';

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: '#2196f3',
    },
    secondary: {
      main: '#f50057',
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
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
});

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <Router>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
              }}
            />
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/verify-email" element={<div>Email Verification</div>} />
              <Route path="/reset-password" element={<div>Reset Password</div>} />
              
              {/* Protected routes */}
              <Route path="/" element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              } />
              
              <Route path="/patient" element={
                <ProtectedRoute allowedRoles={['PATIENT']}>
                  <Layout>
                    <PatientDashboard />
                  </Layout>
                </ProtectedRoute>
              } />
              
              <Route path="/doctor" element={
                <ProtectedRoute allowedRoles={['DOCTOR']}>
                  <Layout>
                    <DoctorDashboard />
                  </Layout>
                </ProtectedRoute>
              } />
              
              <Route path="/admin" element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <Layout>
                    <AdminDashboard />
                  </Layout>
                </ProtectedRoute>
              } />
              
              <Route path="/appointments" element={
                <ProtectedRoute>
                  <Layout>
                    <AppointmentBooking />
                  </Layout>
                </ProtectedRoute>
              } />
              
              <Route path="/video-call/:appointmentId" element={
                <ProtectedRoute>
                  <VideoCall />
                </ProtectedRoute>
              } />
              
              <Route path="/chat" element={
                <ProtectedRoute>
                  <Layout>
                    <ChatWindow />
                  </Layout>
                </ProtectedRoute>
              } />
              
              <Route path="/symptom-checker" element={
                <ProtectedRoute>
                  <Layout>
                    <SymptomChecker />
                  </Layout>
                </ProtectedRoute>
              } />
              
              <Route path="/medical-records" element={
                <ProtectedRoute>
                  <Layout>
                    <MedicalRecords />
                  </Layout>
                </ProtectedRoute>
              } />
              
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Layout>
                    <Profile />
                  </Layout>
                </ProtectedRoute>
              } />
              
              <Route path="/payment" element={
                <ProtectedRoute>
                  <Layout>
                    <PaymentPage />
                  </Layout>
                </ProtectedRoute>
              } />
              
              <Route path="/advanced-ai" element={
                <ProtectedRoute allowedRoles={['DOCTOR', 'ADMIN']}>
                  <Layout>
                    <AdvancedAIFeatures />
                  </Layout>
                </ProtectedRoute>
              } />
              
              <Route path="/security" element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <Layout>
                    <SecurityDashboard />
                  </Layout>
                </ProtectedRoute>
              } />
              
              <Route path="/ai-training-sandbox" element={
                <ProtectedRoute allowedRoles={['DOCTOR', 'ADMIN']}>
                  <Layout>
                    <AITrainingSandbox />
                  </Layout>
                </ProtectedRoute>
              } />
              
              <Route path="/model-comparison" element={
                <ProtectedRoute allowedRoles={['DOCTOR', 'ADMIN']}>
                  <Layout>
                    <ModelComparisonDashboard />
                  </Layout>
                </ProtectedRoute>
              } />
              
              <Route path="/patient-feedback" element={
                <ProtectedRoute>
                  <Layout>
                    <PatientFeedbackLoop />
                  </Layout>
                </ProtectedRoute>
              } />
              
              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App; 