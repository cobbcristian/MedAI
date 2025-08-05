import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  CircularProgress,
  Alert,
  Chip,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
  Tooltip,
  Badge,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Container
} from '@mui/material';
import {
  Security,
  CheckCircle,
  Error,
  Warning,
  Info,
  Timeline,
  Assessment,
  Lock,
  Visibility,
  VisibilityOff,
  Download,
  Refresh,
  ExpandMore,
  Shield,
  Gavel,
  Storage,
  History,
  QrCode
} from '@mui/icons-material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import aiService from '../services/aiService';

const SecurityDashboard = () => {
  const [hipaaCompliance, setHipaaCompliance] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [securityEvents, setSecurityEvents] = useState([]);
  const [dataRetention, setDataRetention] = useState(null);
  const [complianceReport, setComplianceReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSensitiveData, setShowSensitiveData] = useState(false);
  const [smartcardData, setSmartcardData] = useState(null);
  const [isGeneratingSmartcard, setIsGeneratingSmartcard] = useState(false);

  useEffect(() => {
    loadSecurityData();
  }, []);

  const loadSecurityData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Load HIPAA compliance status
      const hipaaResponse = await fetch('/api/security/hipaa-compliance');
      if (hipaaResponse.ok) {
        const hipaaData = await hipaaResponse.json();
        setHipaaCompliance(hipaaData);
      }

      // Load data retention report
      const retentionResponse = await fetch('/api/security/data-retention');
      if (retentionResponse.ok) {
        const retentionData = await retentionResponse.json();
        setDataRetention(retentionData);
      }

      // Mock audit logs and security events for demo
      setAuditLogs([
        {
          timestamp: '2024-01-15T10:30:00Z',
          user_id: 'doctor_123',
          action: 'read',
          resource_type: 'patient_data',
          resource_id: 'patient_456',
          ip_address: '192.168.1.100',
          success: true
        },
        {
          timestamp: '2024-01-15T10:25:00Z',
          user_id: 'patient_789',
          action: 'read',
          resource_type: 'own_data',
          resource_id: 'patient_789',
          ip_address: '192.168.1.101',
          success: true
        },
        {
          timestamp: '2024-01-15T10:20:00Z',
          user_id: 'unknown_user',
          action: 'read',
          resource_type: 'patient_data',
          resource_id: 'patient_456',
          ip_address: '192.168.1.102',
          success: false
        }
      ]);

      setSecurityEvents([
        {
          event_type: 'failed_access',
          severity: 'medium',
          timestamp: '2024-01-15T10:20:00Z',
          user_id: 'unknown_user',
          ip_address: '192.168.1.102',
          description: 'Failed access attempt to patient data'
        },
        {
          event_type: 'sensitive_action',
          severity: 'medium',
          timestamp: '2024-01-15T09:45:00Z',
          user_id: 'admin_001',
          ip_address: '192.168.1.103',
          description: 'Data export performed'
        }
      ]);

    } catch (err) {
      setError('Error loading security data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const generateComplianceReport = async () => {
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('report_type', 'hipaa_compliance');
      formData.append('period_start', '2024-01-01T00:00:00Z');
      formData.append('period_end', '2024-01-31T23:59:59Z');

      const response = await fetch('/api/security/compliance-report', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to generate compliance report');
      }

      const result = await response.json();
      setComplianceReport(result);
    } catch (err) {
      setError('Error generating compliance report: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity) => {
    const colors = {
      'low': '#4caf50',
      'medium': '#ff9800',
      'high': '#f44336',
      'critical': '#d32f2f'
    };
    return colors[severity] || '#9e9e9e';
  };

  const getComplianceColor = (score) => {
    if (score >= 90) return '#4caf50';
    if (score >= 70) return '#ff9800';
    return '#f44336';
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const complianceData = hipaaCompliance ? [
    { name: 'Compliant', value: hipaaCompliance.overall_compliance, color: getComplianceColor(hipaaCompliance.overall_compliance) },
    { name: 'Non-Compliant', value: 100 - hipaaCompliance.overall_compliance, color: '#e0e0e0' }
  ] : [];

  // Smartcard Generation
  const handleGenerateSmartcard = async () => {
    setIsGeneratingSmartcard(true);
    try {
      const patientInfo = {
        name: "John Doe",
        dob: "1980-01-01",
        gender: "male",
        id: "1234567890"
      };
      
      const vaccineInfo = {
        vaccine: "COVID-19 mRNA",
        manufacturer: "Pfizer",
        date: "2023-12-01",
        lot: "AB1234"
      };
      
      const testInfo = {
        type: "PCR",
        result: "negative",
        date: "2023-12-10"
      };
      
      const result = await aiService.generateSmartcard(patientInfo, vaccineInfo, testInfo);
      setSmartcardData(result);
    } catch (error) {
      console.error('Error generating smartcard:', error);
    } finally {
      setIsGeneratingSmartcard(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">
          Security & Compliance Dashboard
        </Typography>
        <Box display="flex" gap={1}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={loadSecurityData}
            disabled={loading}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<Assessment />}
            onClick={generateComplianceReport}
            disabled={loading}
          >
            Generate Report
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading && (
        <Box display="flex" justifyContent="center" mb={2}>
          <CircularProgress />
        </Box>
      )}

      <Grid container spacing={3}>
        {/* HIPAA Compliance Status */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Shield color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">HIPAA Compliance Status</Typography>
              </Box>

              {hipaaCompliance ? (
                <Box>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Typography variant="h4" color="primary" sx={{ mr: 2 }}>
                      {hipaaCompliance.overall_compliance.toFixed(1)}%
                    </Typography>
                    <Chip
                      label="Compliant"
                      color="success"
                      icon={<CheckCircle />}
                    />
                  </Box>

                  <Box mb={3}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Overall Compliance
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={hipaaCompliance.overall_compliance}
                      sx={{
                        height: 10,
                        borderRadius: 5,
                        backgroundColor: '#e0e0e0',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: getComplianceColor(hipaaCompliance.overall_compliance)
                        }
                      }}
                    />
                  </Box>

                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Typography variant="subtitle1">Compliance Details</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <List dense>
                        {Object.entries(hipaaCompliance.compliance_details).map(([key, details]) => (
                          <ListItem key={key} sx={{ py: 0.5 }}>
                            <ListItemText
                              primary={details.description}
                              secondary={`Status: ${details.status}`}
                              primaryTypographyProps={{ variant: 'body2' }}
                              secondaryTypographyProps={{ variant: 'caption' }}
                            />
                            <Chip
                              label={details.status}
                              color={details.status === 'compliant' ? 'success' : 'error'}
                              size="small"
                            />
                          </ListItem>
                        ))}
                      </List>
                    </AccordionDetails>
                  </Accordion>
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Loading compliance status...
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Compliance Overview Chart */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Compliance Overview
              </Typography>
              
              {complianceData.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={complianceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {complianceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <Box display="flex" justifyContent="center" alignItems="center" height={200}>
                  <Typography variant="body2" color="text.secondary">
                    No compliance data available
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Security Events */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Warning color="error" sx={{ mr: 1 }} />
                <Typography variant="h6">Security Events</Typography>
                <Badge badgeContent={securityEvents.length} color="error" sx={{ ml: 1 }}>
                  <Security />
                </Badge>
              </Box>

              <TableContainer component={Paper} sx={{ maxHeight: 300 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Time</TableCell>
                      <TableCell>Event</TableCell>
                      <TableCell>Severity</TableCell>
                      <TableCell>User</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {securityEvents.map((event, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Typography variant="caption">
                            {formatTimestamp(event.timestamp)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {event.description}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={event.severity}
                            size="small"
                            sx={{
                              backgroundColor: getSeverityColor(event.severity),
                              color: 'white'
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {event.user_id}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Data Retention */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Storage color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Data Retention</Typography>
              </Box>

              {dataRetention ? (
                <Box>
                  <Box mb={2}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Total Patients
                    </Typography>
                    <Typography variant="h4" color="primary">
                      {dataRetention.data_summary.total_patients.toLocaleString()}
                    </Typography>
                  </Box>

                  <Box mb={2}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Total Records
                    </Typography>
                    <Typography variant="h5">
                      {dataRetention.data_summary.total_records.toLocaleString()}
                    </Typography>
                  </Box>

                  <Box mb={2}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Records Eligible for Deletion
                    </Typography>
                    <Typography variant="h6" color="warning.main">
                      {dataRetention.data_summary.records_eligible_for_deletion}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Compliance Status
                    </Typography>
                    <Chip
                      label={dataRetention.compliance_status}
                      color={dataRetention.compliance_status === 'compliant' ? 'success' : 'error'}
                      icon={dataRetention.compliance_status === 'compliant' ? <CheckCircle /> : <Error />}
                    />
                  </Box>
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Loading data retention information...
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Audit Logs */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <History color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Recent Audit Logs</Typography>
                <IconButton
                  size="small"
                  onClick={() => setShowSensitiveData(!showSensitiveData)}
                  sx={{ ml: 'auto' }}
                >
                  {showSensitiveData ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </Box>

              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Timestamp</TableCell>
                      <TableCell>User</TableCell>
                      <TableCell>Action</TableCell>
                      <TableCell>Resource</TableCell>
                      <TableCell>IP Address</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {auditLogs.map((log, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Typography variant="caption">
                            {formatTimestamp(log.timestamp)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {showSensitiveData ? log.user_id : '***'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {log.action}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {log.resource_type}: {showSensitiveData ? log.resource_id : '***'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {showSensitiveData ? log.ip_address : '***.***.***.***'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={log.success ? 'Success' : 'Failed'}
                            color={log.success ? 'success' : 'error'}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Compliance Report */}
        {complianceReport && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <Gavel color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Compliance Report</Typography>
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={12} md={3}>
                    <Box textAlign="center">
                      <Typography variant="h4" color="primary">
                        {complianceReport.compliance_score.toFixed(1)}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Compliance Score
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={3}>
                    <Box textAlign="center">
                      <Typography variant="h4" color="primary">
                        {complianceReport.total_events}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Events
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={3}>
                    <Box textAlign="center">
                      <Typography variant="h4" color="error">
                        {complianceReport.security_events}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Security Events
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={3}>
                    <Box textAlign="center">
                      <Typography variant="h4" color="warning.main">
                        {complianceReport.violations.length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Violations
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom>
                      Recommendations
                    </Typography>
                    <List dense>
                      {complianceReport.recommendations.map((rec, index) => (
                        <ListItem key={index} sx={{ py: 0.5 }}>
                          <ListItemText
                            primary={rec}
                            primaryTypographyProps={{ variant: 'body2' }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Smartcard Generation Section */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                🆔 Smart Health Card Generator
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Generate DCC/SMART health cards for vaccine and test certificates
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Button
                  variant="contained"
                  onClick={handleGenerateSmartcard}
                  disabled={isGeneratingSmartcard}
                  startIcon={isGeneratingSmartcard ? <CircularProgress size={20} /> : <QrCode />}
                >
                  {isGeneratingSmartcard ? 'Generating...' : 'Generate Health Card'}
                </Button>
              </Box>
              
              {smartcardData && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Generated Health Card
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" gutterBottom>
                        Card JSON:
                      </Typography>
                      <Paper sx={{ p: 2, bgcolor: '#f5f5f5', maxHeight: 200, overflow: 'auto' }}>
                        <Typography variant="body2" component="pre" sx={{ fontSize: '0.75rem' }}>
                          {smartcardData.card_json}
                        </Typography>
                      </Paper>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" gutterBottom>
                        QR Code:
                      </Typography>
                      <Box sx={{ textAlign: 'center' }}>
                        <img
                          src={`data:image/png;base64,${smartcardData.qr_code_base64}`}
                          alt="Health Card QR Code"
                          style={{ maxWidth: '200px', height: 'auto' }}
                        />
                      </Box>
                    </Grid>
                  </Grid>
                  
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      This QR code contains the patient's vaccine and test information in a standardized format
                      that can be verified by healthcare providers and border control systems.
                    </Typography>
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SecurityDashboard; 