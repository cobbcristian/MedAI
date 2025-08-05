import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Alert,
  Chip,
  LinearProgress,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Warning,
  LocalHospital,
  People,
  TrendingUp,
  Map,
  Notifications,
  Settings,
  Refresh,
  Add,
  Visibility,
} from '@mui/icons-material';
import CrisisModeToggle from './crisis_mode_toggle';
import GlobalSymptomMap from './global_symptom_map.vue';

const CrisisDashboard = () => {
  const [crisisStats, setCrisisStats] = useState({
    activeOutbreaks: 0,
    totalCases: 0,
    riskLevel: 'low',
    responseTime: '0h',
    affectedRegions: [],
    resourceStatus: 'adequate'
  });
  
  const [outbreakAlerts, setOutbreakAlerts] = useState([]);
  const [resourceInventory, setResourceInventory] = useState({});
  const [showResourceDialog, setShowResourceDialog] = useState(false);
  const [newResource, setNewResource] = useState({
    type: '',
    quantity: 0,
    location: '',
    priority: 'medium'
  });

  useEffect(() => {
    // Load crisis data
    loadCrisisData();
    loadOutbreakAlerts();
    loadResourceInventory();
  }, []);

  const loadCrisisData = async () => {
    try {
      // Mock data for demonstration
      setCrisisStats({
        activeOutbreaks: 3,
        totalCases: 1247,
        riskLevel: 'medium',
        responseTime: '2.5h',
        affectedRegions: ['North Region', 'Central District', 'Coastal Area'],
        resourceStatus: 'adequate'
      });
    } catch (error) {
      console.error('Error loading crisis data:', error);
    }
  };

  const loadOutbreakAlerts = async () => {
    // Mock outbreak alerts
    setOutbreakAlerts([
      {
        id: 1,
        type: 'pandemic',
        severity: 'high',
        location: 'North Region',
        symptoms: ['fever', 'cough', 'fatigue'],
        cases: 45,
        timestamp: new Date().toISOString()
      },
      {
        id: 2,
        type: 'disaster',
        severity: 'medium',
        location: 'Central District',
        symptoms: ['respiratory', 'dehydration'],
        cases: 23,
        timestamp: new Date().toISOString()
      }
    ]);
  };

  const loadResourceInventory = async () => {
    setResourceInventory({
      'Personal Protective Equipment': { available: 1500, needed: 2000, priority: 'high' },
      'Ventilators': { available: 45, needed: 60, priority: 'critical' },
      'Oxygen Tanks': { available: 200, needed: 300, priority: 'high' },
      'Test Kits': { available: 5000, needed: 8000, priority: 'medium' },
      'Medications': { available: 800, needed: 1000, priority: 'medium' }
    });
  };

  const getRiskLevelColor = (level) => {
    switch (level) {
      case 'low': return 'success';
      case 'medium': return 'warning';
      case 'high': return 'error';
      case 'critical': return 'error';
      default: return 'default';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'low': return 'success';
      case 'medium': return 'warning';
      case 'high': return 'error';
      case 'critical': return 'error';
      default: return 'default';
    }
  };

  const handleAddResource = () => {
    setShowResourceDialog(true);
  };

  const handleSaveResource = () => {
    if (newResource.type && newResource.quantity > 0) {
      setResourceInventory(prev => ({
        ...prev,
        [newResource.type]: {
          available: newResource.quantity,
          needed: newResource.quantity * 1.2,
          priority: newResource.priority
        }
      }));
      setNewResource({ type: '', quantity: 0, location: '', priority: 'medium' });
      setShowResourceDialog(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Crisis Response Dashboard
        </Typography>
        <CrisisModeToggle />
      </Box>

      {/* Crisis Overview */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Active Outbreaks
              </Typography>
              <Typography variant="h4" component="div">
                {crisisStats.activeOutbreaks}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Across {crisisStats.affectedRegions.length} regions
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Cases
              </Typography>
              <Typography variant="h4" component="div">
                {crisisStats.totalCases.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Cumulative cases
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Risk Level
              </Typography>
              <Chip 
                label={crisisStats.riskLevel.toUpperCase()} 
                color={getRiskLevelColor(crisisStats.riskLevel)}
                sx={{ fontSize: '1.2rem', fontWeight: 'bold' }}
              />
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Response Time
              </Typography>
              <Typography variant="h4" component="div">
                {crisisStats.responseTime}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Average response
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Global Symptom Map */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" component="h2">
              Global Symptom Heatmap
            </Typography>
            <Tooltip title="Refresh map data">
              <IconButton>
                <Refresh />
              </IconButton>
            </Tooltip>
          </Box>
          <Box sx={{ height: 400, position: 'relative' }}>
            <GlobalSymptomMap />
          </Box>
        </CardContent>
      </Card>

      {/* Outbreak Alerts */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" component="h2">
                  Active Outbreak Alerts
                </Typography>
                <Chip label={outbreakAlerts.length} color="primary" />
              </Box>
              
              {outbreakAlerts.map((alert) => (
                <Alert 
                  key={alert.id}
                  severity={getSeverityColor(alert.severity)}
                  sx={{ mb: 2 }}
                  action={
                    <Button color="inherit" size="small">
                      <Visibility />
                    </Button>
                  }
                >
                  <Typography variant="subtitle2">
                    {alert.location} - {alert.type.toUpperCase()}
                  </Typography>
                  <Typography variant="body2">
                    {alert.cases} cases | {alert.symptoms.join(', ')}
                  </Typography>
                </Alert>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Resource Management */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" component="h2">
                  Resource Inventory
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={handleAddResource}
                  size="small"
                >
                  Add Resource
                </Button>
              </Box>
              
              {Object.entries(resourceInventory).map(([resource, data]) => (
                <Box key={resource} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">{resource}</Typography>
                    <Chip 
                      label={data.priority} 
                      color={getRiskLevelColor(data.priority)}
                      size="small"
                    />
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={(data.available / data.needed) * 100}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                  <Typography variant="caption" color="textSecondary">
                    {data.available} / {data.needed} available
                  </Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Resource Dialog */}
      <Dialog open={showResourceDialog} onClose={() => setShowResourceDialog(false)}>
        <DialogTitle>Add Resource</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Resource Type"
            fullWidth
            variant="outlined"
            value={newResource.type}
            onChange={(e) => setNewResource(prev => ({ ...prev, type: e.target.value }))}
          />
          <TextField
            margin="dense"
            label="Quantity"
            type="number"
            fullWidth
            variant="outlined"
            value={newResource.quantity}
            onChange={(e) => setNewResource(prev => ({ ...prev, quantity: parseInt(e.target.value) || 0 }))}
          />
          <TextField
            margin="dense"
            label="Location"
            fullWidth
            variant="outlined"
            value={newResource.location}
            onChange={(e) => setNewResource(prev => ({ ...prev, location: e.target.value }))}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Priority</InputLabel>
            <Select
              value={newResource.priority}
              label="Priority"
              onChange={(e) => setNewResource(prev => ({ ...prev, priority: e.target.value }))}
            >
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
              <MenuItem value="critical">Critical</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowResourceDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveResource} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CrisisDashboard; 