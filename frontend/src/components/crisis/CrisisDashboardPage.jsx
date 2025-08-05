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
  RadioGroup
} from '@mui/material';
import {
  Warning,
  LocalHospital,
  People,
  Assignment,
  Notifications,
  Settings,
  Visibility,
  Edit,
  Delete,
  Add,
  History,
  CloudUpload,
  FileCopy,
  Print,
  Lock,
  Public,
  Verified,
  CheckCircle,
  Error,
  Info,
  ExpandMore,
  PlayArrow,
  Stop,
  Refresh,
  Download,
  Upload,
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
  LocalHospital as LocalHospitalIcon,
  Phone,
  Email,
  LocationOn,
  AccessTime,
  Person,
  Group,
  Block,
  Check,
  Close,
  PriorityHigh,
  Sms,
  Call,
  LocationCity,
  DirectionsRun,
  LocalFireDepartment,
  LocalPolice,
  Ambulance
} from '@mui/icons-material';

const CrisisDashboardPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [emergencyDialog, setEmergencyDialog] = useState(false);
  const [protocolDialog, setProtocolDialog] = useState(false);
  const [resourceDialog, setResourceDialog] = useState(false);

  // Mock crisis data
  const [emergencyAlerts] = useState([
    {
      id: 1,
      type: 'Critical',
      title: 'Cardiac Arrest - Emergency Room',
      description: 'Patient experiencing cardiac arrest in ER bay 3',
      location: 'Emergency Room - Bay 3',
      time: '2024-01-15 14:30:22',
      status: 'active',
      priority: 'critical',
      assignedTeam: 'Cardiac Response Team',
      eta: '2 minutes'
    },
    {
      id: 2,
      type: 'High',
      title: 'Trauma Case - Multiple Injuries',
      description: 'Motor vehicle accident victim with multiple injuries',
      location: 'Trauma Bay 1',
      time: '2024-01-15 14:25:15',
      status: 'active',
      priority: 'high',
      assignedTeam: 'Trauma Team',
      eta: '5 minutes'
    },
    {
      id: 3,
      type: 'Medium',
      title: 'Respiratory Distress',
      description: 'Patient experiencing severe breathing difficulties',
      location: 'ICU - Room 205',
      time: '2024-01-15 14:20:45',
      status: 'resolved',
      priority: 'medium',
      assignedTeam: 'Respiratory Team',
      eta: 'Resolved'
    },
    {
      id: 4,
      type: 'Low',
      title: 'Equipment Malfunction',
      description: 'Ventilator showing warning signs',
      location: 'ICU - Room 208',
      time: '2024-01-15 14:15:30',
      status: 'active',
      priority: 'low',
      assignedTeam: 'Biomedical Team',
      eta: '10 minutes'
    }
  ]);

  const [crisisProtocols] = useState([
    {
      id: 1,
      name: 'Cardiac Arrest Protocol',
      type: 'Medical Emergency',
      status: 'active',
      lastUpdated: '2024-01-15',
      steps: [
        'Assess patient responsiveness',
        'Call for help and activate emergency response',
        'Begin chest compressions',
        'Apply AED if available',
        'Continue until advanced life support arrives'
      ],
      team: 'Cardiac Response Team',
      estimatedTime: '5-10 minutes'
    },
    {
      id: 2,
      name: 'Trauma Protocol',
      type: 'Trauma Emergency',
      status: 'active',
      lastUpdated: '2024-01-14',
      steps: [
        'Assess airway, breathing, circulation',
        'Control bleeding',
        'Stabilize spine',
        'Prepare for surgery if needed',
        'Coordinate with trauma team'
      ],
      team: 'Trauma Team',
      estimatedTime: '15-30 minutes'
    },
    {
      id: 3,
      name: 'Mass Casualty Protocol',
      type: 'Disaster Response',
      status: 'active',
      lastUpdated: '2024-01-13',
      steps: [
        'Activate emergency operations center',
        'Triage patients by severity',
        'Coordinate with external agencies',
        'Manage resources efficiently',
        'Communicate with families'
      ],
      team: 'Emergency Management Team',
      estimatedTime: '30-60 minutes'
    }
  ]);

  const [responseTeams] = useState([
    {
      id: 1,
      name: 'Cardiac Response Team',
      members: ['Dr. Sarah Johnson', 'Dr. Michael Chen', 'Nurse Lisa Thompson'],
      status: 'available',
      currentLocation: 'Emergency Room',
      lastActivity: '2024-01-15 14:30:22',
      specializations: ['Cardiology', 'Emergency Medicine']
    },
    {
      id: 2,
      name: 'Trauma Team',
      members: ['Dr. Robert Wilson', 'Dr. Emily Davis', 'Nurse John Smith'],
      status: 'busy',
      currentLocation: 'Trauma Bay 1',
      lastActivity: '2024-01-15 14:25:15',
      specializations: ['Trauma Surgery', 'Emergency Medicine']
    },
    {
      id: 3,
      name: 'Respiratory Team',
      members: ['Dr. David Brown', 'Respiratory Therapist Amy White'],
      status: 'available',
      currentLocation: 'ICU',
      lastActivity: '2024-01-15 14:20:45',
      specializations: ['Pulmonology', 'Respiratory Therapy']
    }
  ]);

  const [resources] = useState([
    {
      id: 1,
      name: 'Ventilators',
      total: 15,
      available: 12,
      inUse: 3,
      location: 'ICU',
      status: 'adequate'
    },
    {
      id: 2,
      name: 'ICU Beds',
      total: 20,
      available: 8,
      inUse: 12,
      location: 'ICU',
      status: 'limited'
    },
    {
      id: 3,
      name: 'Emergency Room Beds',
      total: 10,
      available: 3,
      inUse: 7,
      location: 'Emergency Room',
      status: 'critical'
    },
    {
      id: 4,
      name: 'Ambulances',
      total: 5,
      available: 4,
      inUse: 1,
      location: 'Garage',
      status: 'adequate'
    }
  ]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleAlertClick = (alert) => {
    setSelectedAlert(alert);
  };

  const handleEmergency = () => {
    setEmergencyDialog(true);
  };

  const handleProtocol = () => {
    setProtocolDialog(true);
  };

  const handleResource = () => {
    setResourceDialog(true);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'error';
      case 'resolved': return 'success';
      case 'available': return 'success';
      case 'busy': return 'warning';
      case 'adequate': return 'success';
      case 'limited': return 'warning';
      case 'critical': return 'error';
      default: return 'default';
    }
  };

  const getResourceStatus = (available, total) => {
    const percentage = (available / total) * 100;
    if (percentage >= 70) return 'adequate';
    if (percentage >= 30) return 'limited';
    return 'critical';
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Crisis Dashboard
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
                            startIcon={<Warning />}
            onClick={handleEmergency}
            color="error"
          >
            Emergency Alert
          </Button>
          <Button
            variant="contained"
            startIcon={<LocalHospital />}
            onClick={handleProtocol}
            color="error"
          >
            Activate Protocol
          </Button>
        </Box>
      </Box>

      <Paper sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab label="Emergency Alerts" />
          <Tab label="Crisis Protocols" />
          <Tab label="Response Teams" />
          <Tab label="Resource Management" />
        </Tabs>
      </Paper>

      {activeTab === 0 && (
        <Grid container spacing={3}>
          {emergencyAlerts.map((alert) => (
            <Grid item xs={12} md={6} lg={4} key={alert.id}>
              <Card 
                sx={{ 
                  height: '100%',
                  cursor: 'pointer',
                  '&:hover': { boxShadow: 4 },
                  border: alert.priority === 'critical' ? '2px solid #f44336' : 'none'
                }}
                onClick={() => handleAlertClick(alert)}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Warning color="error" />
                      <Typography variant="h6" component="h3">
                        {alert.title}
                      </Typography>
                    </Box>
                    <Chip 
                      label={alert.priority} 
                      size="small" 
                      color={getPriorityColor(alert.priority)}
                    />
                  </Box>

                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {alert.description}
                  </Typography>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      <LocationOn fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
                      {alert.location}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      <AccessTime fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
                      {alert.time}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      <Group fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
                      {alert.assignedTeam}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Chip 
                      label={alert.status} 
                      size="small" 
                      color={getStatusColor(alert.status)}
                    />
                    <Typography variant="caption" color="text.secondary">
                      ETA: {alert.eta}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {activeTab === 1 && (
        <Box>
          <Typography variant="h6" gutterBottom>Crisis Response Protocols</Typography>
          <Grid container spacing={3}>
            {crisisProtocols.map((protocol) => (
              <Grid item xs={12} md={6} lg={4} key={protocol.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h6">{protocol.name}</Typography>
                      <Chip label={protocol.status} size="small" color={getStatusColor(protocol.status)} />
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Type: {protocol.type}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Team: {protocol.team}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Estimated Time: {protocol.estimatedTime}
                    </Typography>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Steps:
                      </Typography>
                      <List dense>
                        {protocol.steps.map((step, index) => (
                          <ListItem key={index} sx={{ py: 0 }}>
                            <ListItemIcon sx={{ minWidth: 30 }}>
                              <Typography variant="caption" color="primary">
                                {index + 1}.
                              </Typography>
                            </ListItemIcon>
                            <ListItemText 
                              primary={step}
                              primaryTypographyProps={{ variant: 'body2' }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button size="small" variant="contained" color="error">
                        Activate
                      </Button>
                      <Button size="small" variant="outlined">
                        View Details
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {activeTab === 2 && (
        <Box>
          <Typography variant="h6" gutterBottom>Response Teams</Typography>
          <Grid container spacing={3}>
            {responseTeams.map((team) => (
              <Grid item xs={12} md={6} lg={4} key={team.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h6">{team.name}</Typography>
                      <Chip label={team.status} size="small" color={getStatusColor(team.status)} />
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      <LocationOn fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
                      {team.currentLocation}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Members:
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      {team.members.map((member) => (
                        <Chip key={member} label={member} size="small" variant="outlined" sx={{ mr: 0.5, mb: 0.5 }} />
                      ))}
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Specializations:
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 0.5, mb: 2, flexWrap: 'wrap' }}>
                      {team.specializations.map((spec) => (
                        <Chip key={spec} label={spec} size="small" color="primary" />
                      ))}
                    </Box>
                    
                    <Typography variant="caption" color="text.secondary">
                      Last Activity: {team.lastActivity}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {activeTab === 3 && (
        <Box>
          <Typography variant="h6" gutterBottom>Resource Management</Typography>
          <Grid container spacing={3}>
            {resources.map((resource) => (
              <Grid item xs={12} md={6} lg={3} key={resource.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h6">{resource.name}</Typography>
                      <Chip label={resource.status} size="small" color={getStatusColor(resource.status)} />
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      <LocationOn fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
                      {resource.location}
                    </Typography>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Availability: {resource.available}/{resource.total}
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={(resource.available / resource.total) * 100} 
                        color={getStatusColor(getResourceStatus(resource.available, resource.total))}
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="caption" color="text.secondary">
                        In Use: {resource.inUse}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Available: {resource.available}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Emergency Alert Dialog */}
      <Dialog open={emergencyDialog} onClose={() => setEmergencyDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Emergency Alert</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Create a new emergency alert:
            </Typography>
            
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Alert Type</InputLabel>
              <Select label="Alert Type" defaultValue="">
                <MenuItem value="medical">Medical Emergency</MenuItem>
                <MenuItem value="trauma">Trauma Emergency</MenuItem>
                <MenuItem value="cardiac">Cardiac Emergency</MenuItem>
                <MenuItem value="respiratory">Respiratory Emergency</MenuItem>
                <MenuItem value="equipment">Equipment Failure</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Alert Title"
              placeholder="Brief description of the emergency"
              sx={{ mb: 2 }}
            />
            
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              placeholder="Detailed description of the emergency situation"
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Location"
              placeholder="Where is the emergency occurring?"
              sx={{ mb: 2 }}
            />

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Priority Level</InputLabel>
              <Select label="Priority Level" defaultValue="">
                <MenuItem value="critical">Critical</MenuItem>
                <MenuItem value="high">High</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="low">Low</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Assign Team</InputLabel>
              <Select label="Assign Team" defaultValue="">
                <MenuItem value="cardiac">Cardiac Response Team</MenuItem>
                <MenuItem value="trauma">Trauma Team</MenuItem>
                <MenuItem value="respiratory">Respiratory Team</MenuItem>
                <MenuItem value="general">General Emergency Team</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEmergencyDialog(false)}>Cancel</Button>
          <Button variant="contained" color="error">
            Send Emergency Alert
          </Button>
        </DialogActions>
      </Dialog>

      {/* Protocol Activation Dialog */}
      <Dialog open={protocolDialog} onClose={() => setProtocolDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Activate Crisis Protocol</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Select a protocol to activate:
            </Typography>
            
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Protocol</InputLabel>
              <Select label="Protocol" defaultValue="">
                <MenuItem value="cardiac">Cardiac Arrest Protocol</MenuItem>
                <MenuItem value="trauma">Trauma Protocol</MenuItem>
                <MenuItem value="mass-casualty">Mass Casualty Protocol</MenuItem>
                <MenuItem value="respiratory">Respiratory Emergency Protocol</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Location"
              placeholder="Where is the emergency occurring?"
              sx={{ mb: 2 }}
            />

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Response Team</InputLabel>
              <Select label="Response Team" defaultValue="">
                <MenuItem value="cardiac">Cardiac Response Team</MenuItem>
                <MenuItem value="trauma">Trauma Team</MenuItem>
                <MenuItem value="respiratory">Respiratory Team</MenuItem>
                <MenuItem value="emergency">Emergency Management Team</MenuItem>
              </Select>
            </FormControl>

            <Alert severity="warning" sx={{ mb: 2 }}>
              <Typography variant="body2">
                Activating a protocol will notify all relevant team members and initiate emergency procedures.
              </Typography>
            </Alert>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setProtocolDialog(false)}>Cancel</Button>
          <Button variant="contained" color="error">
            Activate Protocol
          </Button>
        </DialogActions>
      </Dialog>

      {/* Alert Details Dialog */}
      <Dialog open={!!selectedAlert} onClose={() => setSelectedAlert(null)} maxWidth="md" fullWidth>
        {selectedAlert && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h5">{selectedAlert.title}</Typography>
                <Chip label={selectedAlert.priority} color={getPriorityColor(selectedAlert.priority)} />
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>Emergency Details</Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Description:</strong> {selectedAlert.description}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Location:</strong> {selectedAlert.location}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Time:</strong> {selectedAlert.time}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Status:</strong> {selectedAlert.status}
                    </Typography>
                  </Box>
                  
                  <Typography variant="h6" gutterBottom>Response Team</Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Assigned Team:</strong> {selectedAlert.assignedTeam}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>ETA:</strong> {selectedAlert.eta}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>Quick Actions</Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Button variant="contained" color="error" startIcon={<Call />}>
                      Call Team
                    </Button>
                    <Button variant="outlined" startIcon={<Sms />}>
                      Send Message
                    </Button>
                    <Button variant="outlined" startIcon={<LocationOn />}>
                      Track Location
                    </Button>
                    <Button variant="outlined" startIcon={<Assignment />}>
                      View Protocol
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSelectedAlert(null)}>Close</Button>
              <Button variant="contained" color="error">
                Resolve Alert
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default CrisisDashboardPage; 