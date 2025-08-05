import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  IconButton,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
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
  Badge,
  Tooltip,
  Fab,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Switch,
  FormControlLabel,
  Slider,
  Radio,
  RadioGroup,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  Security,
  Lock,
  Public,
  Verified,
  Warning,
  CheckCircle,
  Error,
  Info,
  ExpandMore,
  PlayArrow,
  Stop,
  Refresh,
  Download,
  Upload,
  Settings,
  Visibility,
  Edit,
  Delete,
  Add,
  History,
  CloudUpload,
  FileCopy,
  Print,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Timeline as TimelineIcon,
  Analytics as AnalyticsIcon,
  Psychology as PsychologyIcon,
  Science as ScienceIcon,
  Compare as CompareIcon,
  School as SchoolIcon,
  AutoFixHigh as AutoFixHighIcon,
  Lightbulb as LightbulbIcon,
  People,
  LocalHospital,
  Medication,
  Assignment,
  Shield,
  Key,
  Fingerprint,
  VpnKey,
  Security as SecurityIcon,
  PrivacyTip,
  GppGood,
  AdminPanelSettings,
  Person,
  Group,
  Block,
  Check,
  Close
} from '@mui/icons-material';

const SecurityPrivacyPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedSecurity, setSelectedSecurity] = useState(null);
  const [encryptionDialog, setEncryptionDialog] = useState(false);
  const [accessDialog, setAccessDialog] = useState(false);
  const [auditDialog, setAuditDialog] = useState(false);

  // Mock security data
  const [securitySettings] = useState([
    {
      id: 1,
      name: 'Data Encryption',
      status: 'enabled',
      level: 'AES-256',
      description: 'End-to-end encryption for all data',
      lastUpdated: '2024-01-15',
      compliance: 'HIPAA',
      icon: <Lock color="success" />
    },
    {
      id: 2,
      name: 'Access Control',
      status: 'enabled',
      level: 'Role-based',
      description: 'Manage who can access your information',
      lastUpdated: '2024-01-14',
      compliance: 'GDPR',
      icon: <Shield color="primary" />
    },
    {
      id: 3,
      name: 'Audit Logs',
      status: 'enabled',
      level: 'Comprehensive',
      description: 'Track all access to your health data',
      lastUpdated: '2024-01-13',
      compliance: 'HIPAA',
      icon: <History color="info" />
    },
    {
      id: 4,
      name: 'Two-Factor Authentication',
      status: 'enabled',
      level: 'SMS + App',
      description: 'Additional security layer for account access',
      lastUpdated: '2024-01-12',
      compliance: 'GDPR',
      icon: <Fingerprint color="warning" />
    },
    {
      id: 5,
      name: 'Data Backup',
      status: 'enabled',
      level: 'Real-time',
      description: 'Automatic backup with encryption',
      lastUpdated: '2024-01-11',
      compliance: 'HIPAA',
      icon: <CloudUpload color="success" />
    },
    {
      id: 6,
      name: 'Privacy Controls',
      status: 'enabled',
      level: 'Granular',
      description: 'Control data sharing and visibility',
      lastUpdated: '2024-01-10',
      compliance: 'GDPR',
      icon: <PrivacyTip color="info" />
    }
  ]);

  const [auditLogs] = useState([
    {
      id: 1,
      action: 'Login',
      user: 'Dr. Sarah Johnson',
      timestamp: '2024-01-15 14:30:22',
      ip: '192.168.1.100',
      status: 'success',
      details: 'Successful login from authorized device'
    },
    {
      id: 2,
      action: 'View Medical Records',
      user: 'Dr. Michael Chen',
      timestamp: '2024-01-15 13:45:18',
      ip: '192.168.1.101',
      status: 'success',
      details: 'Accessed patient records for consultation'
    },
    {
      id: 3,
      action: 'Export Data',
      user: 'Admin User',
      timestamp: '2024-01-15 12:20:45',
      ip: '192.168.1.102',
      status: 'success',
      details: 'Exported patient data for backup'
    },
    {
      id: 4,
      action: 'Failed Login',
      user: 'Unknown',
      timestamp: '2024-01-15 11:15:33',
      ip: '203.45.67.89',
      status: 'failed',
      details: 'Multiple failed login attempts'
    },
    {
      id: 5,
      action: 'Update Settings',
      user: 'Dr. Emily Davis',
      timestamp: '2024-01-15 10:30:12',
      ip: '192.168.1.103',
      status: 'success',
      details: 'Updated privacy settings'
    }
  ]);

  const [accessControl] = useState([
    {
      id: 1,
      user: 'Dr. Sarah Johnson',
      role: 'Primary Care Physician',
      permissions: ['View Records', 'Edit Records', 'Export Data'],
      status: 'active',
      lastAccess: '2024-01-15 14:30:22'
    },
    {
      id: 2,
      user: 'Dr. Michael Chen',
      role: 'Specialist',
      permissions: ['View Records', 'Edit Records'],
      status: 'active',
      lastAccess: '2024-01-15 13:45:18'
    },
    {
      id: 3,
      user: 'Nurse Lisa Thompson',
      role: 'Nurse',
      permissions: ['View Records'],
      status: 'active',
      lastAccess: '2024-01-15 12:20:45'
    },
    {
      id: 4,
      user: 'Admin User',
      role: 'System Administrator',
      permissions: ['Full Access'],
      status: 'active',
      lastAccess: '2024-01-15 10:30:12'
    }
  ]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleSecurityClick = (security) => {
    setSelectedSecurity(security);
  };

  const handleEncryption = () => {
    setEncryptionDialog(true);
  };

  const handleAccessControl = () => {
    setAccessDialog(true);
  };

  const handleAuditLogs = () => {
    setAuditDialog(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'enabled': return 'success';
      case 'disabled': return 'error';
      case 'active': return 'success';
      case 'inactive': return 'error';
      case 'success': return 'success';
      case 'failed': return 'error';
      default: return 'default';
    }
  };

  const getComplianceColor = (compliance) => {
    switch (compliance) {
      case 'HIPAA': return 'primary';
      case 'GDPR': return 'secondary';
      case 'Both': return 'success';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Security & Privacy
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Shield />}
            onClick={handleAccessControl}
          >
            Access Control
          </Button>
          <Button
            variant="contained"
            startIcon={<Lock />}
            onClick={handleEncryption}
          >
            Encryption Settings
          </Button>
        </Box>
      </Box>

      <Paper sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab label="Security Settings" />
          <Tab label="Access Control" />
          <Tab label="Audit Logs" />
          <Tab label="Compliance" />
        </Tabs>
      </Paper>

      {activeTab === 0 && (
        <Grid container spacing={3}>
          {securitySettings.map((security) => (
            <Grid item xs={12} md={6} lg={4} key={security.id}>
              <Card 
                sx={{ 
                  height: '100%',
                  cursor: 'pointer',
                  '&:hover': { boxShadow: 4 }
                }}
                onClick={() => handleSecurityClick(security)}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {security.icon}
                      <Typography variant="h6" component="h3">
                        {security.name}
                      </Typography>
                    </Box>
                    <Chip 
                      label={security.status} 
                      size="small" 
                      color={getStatusColor(security.status)}
                    />
                  </Box>

                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {security.description}
                  </Typography>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                      Level: {security.level}
                    </Typography>
                    <Chip 
                      label={security.compliance} 
                      size="small" 
                      color={getComplianceColor(security.compliance)}
                    />
                  </Box>

                  <Typography variant="caption" color="text.secondary">
                    Last updated: {security.lastUpdated}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {activeTab === 1 && (
        <Box>
          <Typography variant="h6" gutterBottom>User Access Control</Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Active Users</Typography>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>User</TableCell>
                          <TableCell>Role</TableCell>
                          <TableCell>Permissions</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Last Access</TableCell>
                          <TableCell>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {accessControl.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Avatar sx={{ width: 32, height: 32 }}>
                                  {user.user.split(' ').map(n => n[0]).join('')}
                                </Avatar>
                                <Typography variant="body2">{user.user}</Typography>
                              </Box>
                            </TableCell>
                            <TableCell>{user.role}</TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                                {user.permissions.map((permission) => (
                                  <Chip key={permission} label={permission} size="small" variant="outlined" />
                                ))}
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Chip label={user.status} size="small" color={getStatusColor(user.status)} />
                            </TableCell>
                            <TableCell>{user.lastAccess}</TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', gap: 1 }}>
                                <IconButton size="small">
                                  <Edit fontSize="small" />
                                </IconButton>
                                <IconButton size="small">
                                  <Visibility fontSize="small" />
                                </IconButton>
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Access Summary</Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Active Users
                      </Typography>
                      <Typography variant="h4" color="primary">
                        {accessControl.filter(u => u.status === 'active').length}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Total Permissions
                      </Typography>
                      <Typography variant="h4" color="success.main">
                        {accessControl.reduce((acc, user) => acc + user.permissions.length, 0)}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Security Level
                      </Typography>
                      <Typography variant="h4" color="warning.main">
                        High
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}

      {activeTab === 2 && (
        <Box>
          <Typography variant="h6" gutterBottom>Audit Logs</Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Recent Activity</Typography>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Action</TableCell>
                          <TableCell>User</TableCell>
                          <TableCell>Timestamp</TableCell>
                          <TableCell>IP Address</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Details</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {auditLogs.map((log) => (
                          <TableRow key={log.id}>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                {log.status === 'success' ? (
                                  <CheckCircle color="success" fontSize="small" />
                                ) : (
                                  <Error color="error" fontSize="small" />
                                )}
                                {log.action}
                              </Box>
                            </TableCell>
                            <TableCell>{log.user}</TableCell>
                            <TableCell>{log.timestamp}</TableCell>
                            <TableCell>{log.ip}</TableCell>
                            <TableCell>
                              <Chip label={log.status} size="small" color={getStatusColor(log.status)} />
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" color="text.secondary">
                                {log.details}
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
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Security Alerts</Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Alert severity="warning">
                      <Typography variant="body2">
                        Failed login attempt from unknown IP
                      </Typography>
                    </Alert>
                    <Alert severity="info">
                      <Typography variant="body2">
                        New user access granted
                      </Typography>
                    </Alert>
                    <Alert severity="success">
                      <Typography variant="body2">
                        All systems operating normally
                      </Typography>
                    </Alert>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}

      {activeTab === 3 && (
        <Box>
          <Typography variant="h6" gutterBottom>Compliance & Certifications</Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>HIPAA Compliance</Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2">Data Encryption</Typography>
                      <CheckCircle color="success" />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2">Access Controls</Typography>
                      <CheckCircle color="success" />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2">Audit Logs</Typography>
                      <CheckCircle color="success" />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2">Data Backup</Typography>
                      <CheckCircle color="success" />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2">Breach Notification</Typography>
                      <CheckCircle color="success" />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>GDPR Compliance</Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2">Data Protection</Typography>
                      <CheckCircle color="success" />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2">User Consent</Typography>
                      <CheckCircle color="success" />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2">Right to Erasure</Typography>
                      <CheckCircle color="success" />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2">Data Portability</Typography>
                      <CheckCircle color="success" />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2">Privacy by Design</Typography>
                      <CheckCircle color="success" />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Encryption Settings Dialog */}
      <Dialog open={encryptionDialog} onClose={() => setEncryptionDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Encryption Settings</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Configure data encryption settings:
            </Typography>
            
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Encryption Algorithm</InputLabel>
              <Select label="Encryption Algorithm" defaultValue="aes256">
                <MenuItem value="aes256">AES-256 (Recommended)</MenuItem>
                <MenuItem value="aes192">AES-192</MenuItem>
                <MenuItem value="aes128">AES-128</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Key Management</InputLabel>
              <Select label="Key Management" defaultValue="aws">
                <MenuItem value="aws">AWS KMS</MenuItem>
                <MenuItem value="azure">Azure Key Vault</MenuItem>
                <MenuItem value="gcp">Google Cloud KMS</MenuItem>
              </Select>
            </FormControl>

            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Enable end-to-end encryption"
            />
            
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Encrypt data at rest"
            />
            
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Encrypt data in transit"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEncryptionDialog(false)}>Cancel</Button>
          <Button variant="contained">
            Save Settings
          </Button>
        </DialogActions>
      </Dialog>

      {/* Access Control Dialog */}
      <Dialog open={accessDialog} onClose={() => setAccessDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Access Control Management</DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>Add New User</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField fullWidth label="User Name" />
                <TextField fullWidth label="Email" type="email" />
                <FormControl fullWidth>
                  <InputLabel>Role</InputLabel>
                  <Select label="Role">
                    <MenuItem value="doctor">Doctor</MenuItem>
                    <MenuItem value="nurse">Nurse</MenuItem>
                    <MenuItem value="admin">Administrator</MenuItem>
                    <MenuItem value="specialist">Specialist</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>Permissions</InputLabel>
                  <Select multiple label="Permissions">
                    <MenuItem value="view">View Records</MenuItem>
                    <MenuItem value="edit">Edit Records</MenuItem>
                    <MenuItem value="export">Export Data</MenuItem>
                    <MenuItem value="admin">Administrative Access</MenuItem>
                  </Select>
                </FormControl>
                <Button variant="contained">Add User</Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>Security Policies</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Require two-factor authentication"
                />
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Session timeout after 30 minutes"
                />
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Log all access attempts"
                />
                <FormControlLabel
                  control={<Switch />}
                  label="Require password change every 90 days"
                />
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAccessDialog(false)}>Cancel</Button>
          <Button variant="contained">Save Changes</Button>
        </DialogActions>
      </Dialog>

      {/* Security Details Dialog */}
      <Dialog open={!!selectedSecurity} onClose={() => setSelectedSecurity(null)} maxWidth="md" fullWidth>
        {selectedSecurity && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h5">{selectedSecurity.name}</Typography>
                <Chip label={selectedSecurity.status} color={getStatusColor(selectedSecurity.status)} />
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>Configuration</Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Level:</strong> {selectedSecurity.level}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Compliance:</strong> {selectedSecurity.compliance}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Last Updated:</strong> {selectedSecurity.lastUpdated}
                    </Typography>
                  </Box>
                  
                  <Typography variant="h6" gutterBottom>Description</Typography>
                  <Typography variant="body2" paragraph>
                    {selectedSecurity.description}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>Quick Actions</Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Button variant="outlined" startIcon={<Settings />}>
                      Configure
                    </Button>
                    <Button variant="outlined" startIcon={<Visibility />}>
                      View Details
                    </Button>
                    <Button variant="outlined" startIcon={<History />}>
                      View Logs
                    </Button>
                    <Button variant="outlined" startIcon={<Download />}>
                      Export Settings
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSelectedSecurity(null)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default SecurityPrivacyPage; 