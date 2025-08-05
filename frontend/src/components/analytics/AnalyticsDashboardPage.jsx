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
  Analytics,
  TrendingUp,
  TrendingDown,
  Assessment,
  Timeline,
  BarChart,
  PieChart,
  ShowChart,
  Download,
  Upload,
  Settings,
  Visibility,
  Edit,
  Delete,
  Add,
  History,
  Security,
  CloudUpload,
  FileCopy,
  Print,
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
  Assignment
} from '@mui/icons-material';

const AnalyticsDashboardPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedMetric, setSelectedMetric] = useState(null);
  const [reportDialog, setReportDialog] = useState(false);
  const [predictionDialog, setPredictionDialog] = useState(false);
  const [exportDialog, setExportDialog] = useState(false);

  // Mock analytics data
  const [healthMetrics] = useState([
    {
      id: 1,
      name: 'Blood Pressure',
      value: '120/80',
      trend: 'stable',
      status: 'normal',
      change: '+2%',
      lastUpdated: '2024-01-15'
    },
    {
      id: 2,
      name: 'Heart Rate',
      value: '72 bpm',
      trend: 'decreasing',
      status: 'excellent',
      change: '-5%',
      lastUpdated: '2024-01-15'
    },
    {
      id: 3,
      name: 'Blood Sugar',
      value: '95 mg/dL',
      trend: 'stable',
      status: 'normal',
      change: '0%',
      lastUpdated: '2024-01-15'
    },
    {
      id: 4,
      name: 'Weight',
      value: '70 kg',
      trend: 'decreasing',
      status: 'improving',
      change: '-1.2%',
      lastUpdated: '2024-01-15'
    },
    {
      id: 5,
      name: 'Sleep Quality',
      value: '8.2 hours',
      trend: 'increasing',
      status: 'excellent',
      change: '+12%',
      lastUpdated: '2024-01-15'
    },
    {
      id: 6,
      name: 'Activity Level',
      value: '8,500 steps',
      trend: 'increasing',
      status: 'good',
      change: '+8%',
      lastUpdated: '2024-01-15'
    }
  ]);

  const [trends] = useState([
    {
      id: 1,
      metric: 'Blood Pressure',
      period: 'Last 30 days',
      trend: 'stable',
      data: [120, 118, 122, 119, 121, 120, 118, 120, 122, 119, 121, 120, 118, 120, 122, 119, 121, 120, 118, 120, 122, 119, 121, 120, 118, 120, 122, 119, 121, 120],
      prediction: 'Stable trend expected'
    },
    {
      id: 2,
      metric: 'Heart Rate',
      period: 'Last 30 days',
      trend: 'decreasing',
      data: [75, 74, 73, 72, 71, 72, 73, 72, 71, 70, 71, 72, 71, 70, 69, 70, 71, 72, 71, 70, 71, 72, 71, 70, 69, 70, 71, 72, 71, 72],
      prediction: 'Continued improvement expected'
    },
    {
      id: 3,
      metric: 'Weight',
      period: 'Last 30 days',
      trend: 'decreasing',
      data: [71.5, 71.3, 71.1, 70.9, 70.7, 70.5, 70.3, 70.1, 69.9, 69.7, 69.5, 69.3, 69.1, 68.9, 68.7, 68.5, 68.3, 68.1, 67.9, 67.7, 67.5, 67.3, 67.1, 66.9, 66.7, 66.5, 66.3, 66.1, 65.9, 65.7],
      prediction: 'Healthy weight loss trend'
    }
  ]);

  const [predictions] = useState([
    {
      id: 1,
      metric: 'Diabetes Risk',
      probability: 15,
      confidence: 85,
      factors: ['Family history', 'Age', 'BMI'],
      recommendation: 'Continue monitoring blood sugar levels'
    },
    {
      id: 2,
      metric: 'Cardiovascular Risk',
      probability: 8,
      confidence: 92,
      factors: ['Blood pressure', 'Cholesterol', 'Activity level'],
      recommendation: 'Maintain current healthy lifestyle'
    },
    {
      id: 3,
      metric: 'Sleep Apnea Risk',
      probability: 25,
      confidence: 78,
      factors: ['BMI', 'Neck circumference', 'Sleep patterns'],
      recommendation: 'Consider sleep study consultation'
    }
  ]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleMetricClick = (metric) => {
    setSelectedMetric(metric);
  };

  const handleGenerateReport = () => {
    setReportDialog(true);
  };

  const handlePredictions = () => {
    setPredictionDialog(true);
  };

  const handleExport = () => {
    setExportDialog(true);
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'increasing': return 'success';
      case 'decreasing': return 'error';
      case 'stable': return 'primary';
      default: return 'default';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'excellent': return 'success';
      case 'good': return 'primary';
      case 'normal': return 'info';
      case 'improving': return 'success';
      case 'warning': return 'warning';
      case 'critical': return 'error';
      default: return 'default';
    }
  };

  const getChangeColor = (change) => {
    if (change.startsWith('+')) return 'success';
    if (change.startsWith('-')) return 'error';
    return 'info';
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Analytics Dashboard
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Assessment />}
            onClick={handleGenerateReport}
          >
            Generate Report
          </Button>
          <Button
            variant="contained"
            startIcon={<Analytics />}
            onClick={handlePredictions}
          >
            View Predictions
          </Button>
        </Box>
      </Box>

      <Paper sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab label="Health Metrics" />
          <Tab label="Trend Analysis" />
          <Tab label="Predictive Models" />
          <Tab label="Performance Reports" />
        </Tabs>
      </Paper>

      {activeTab === 0 && (
        <Grid container spacing={3}>
          {healthMetrics.map((metric) => (
            <Grid item xs={12} md={6} lg={4} key={metric.id}>
              <Card 
                sx={{ 
                  height: '100%',
                  cursor: 'pointer',
                  '&:hover': { boxShadow: 4 }
                }}
                onClick={() => handleMetricClick(metric)}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" component="h3">
                      {metric.name}
                    </Typography>
                    <Chip 
                      label={metric.status} 
                      size="small" 
                      color={getStatusColor(metric.status)}
                    />
                  </Box>

                  <Typography variant="h4" component="div" gutterBottom>
                    {metric.value}
                  </Typography>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {metric.trend === 'increasing' ? (
                        <TrendingUp color="success" fontSize="small" />
                      ) : metric.trend === 'decreasing' ? (
                        <TrendingDown color="error" fontSize="small" />
                      ) : (
                        <Timeline color="primary" fontSize="small" />
                      )}
                      <Typography variant="body2" color="text.secondary">
                        {metric.trend}
                      </Typography>
                    </Box>
                    <Chip 
                      label={metric.change} 
                      size="small" 
                      color={getChangeColor(metric.change)}
                    />
                  </Box>

                  <Typography variant="caption" color="text.secondary">
                    Last updated: {metric.lastUpdated}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {activeTab === 1 && (
        <Box>
          <Typography variant="h6" gutterBottom>Health Trends Analysis</Typography>
          <Grid container spacing={3}>
            {trends.map((trend) => (
              <Grid item xs={12} md={6} key={trend.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h6">{trend.metric}</Typography>
                      <Chip label={trend.trend} size="small" color={getTrendColor(trend.trend)} />
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {trend.period}
                    </Typography>
                    
                    <Box sx={{ height: 100, display: 'flex', alignItems: 'end', gap: 0.5, mb: 2 }}>
                      {trend.data.slice(-10).map((value, index) => (
                        <Box
                          key={index}
                          sx={{
                            width: 20,
                            height: `${(value / Math.max(...trend.data)) * 80}px`,
                            backgroundColor: 'primary.main',
                            borderRadius: '2px 2px 0 0'
                          }}
                        />
                      ))}
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary">
                      Prediction: {trend.prediction}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {activeTab === 2 && (
        <Box>
          <Typography variant="h6" gutterBottom>AI-Powered Health Predictions</Typography>
          <Grid container spacing={3}>
            {predictions.map((prediction) => (
              <Grid item xs={12} md={6} lg={4} key={prediction.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h6">{prediction.metric}</Typography>
                      <Chip 
                        label={`${prediction.probability}%`} 
                        size="small" 
                        color={prediction.probability > 20 ? 'error' : prediction.probability > 10 ? 'warning' : 'success'}
                      />
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Confidence: {prediction.confidence}%
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={prediction.confidence} 
                        color={prediction.confidence > 90 ? 'success' : prediction.confidence > 80 ? 'primary' : 'warning'}
                        sx={{ height: 6, borderRadius: 3 }}
                      />
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Risk Factors:
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                      {prediction.factors.map((factor) => (
                        <Chip key={factor} label={factor} size="small" variant="outlined" />
                      ))}
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary">
                      Recommendation: {prediction.recommendation}
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
          <Typography variant="h6" gutterBottom>Performance Reports</Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Health Summary Report</Typography>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Metric</TableCell>
                          <TableCell>Current Value</TableCell>
                          <TableCell>Target</TableCell>
                          <TableCell>Progress</TableCell>
                          <TableCell>Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {healthMetrics.slice(0, 5).map((metric) => (
                          <TableRow key={metric.id}>
                            <TableCell>{metric.name}</TableCell>
                            <TableCell>{metric.value}</TableCell>
                            <TableCell>Optimal Range</TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <LinearProgress 
                                  variant="determinate" 
                                  value={80} 
                                  color={getStatusColor(metric.status)}
                                  sx={{ width: 60, height: 6 }}
                                />
                                <Typography variant="body2">80%</Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Chip label={metric.status} size="small" color={getStatusColor(metric.status)} />
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
                  <Typography variant="h6" gutterBottom>Quick Stats</Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Overall Health Score
                      </Typography>
                      <Typography variant="h4" color="success.main">
                        85/100
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Metrics in Range
                      </Typography>
                      <Typography variant="h4" color="primary">
                        5/6
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Improvement This Month
                      </Typography>
                      <Typography variant="h4" color="success.main">
                        +12%
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Generate Report Dialog */}
      <Dialog open={reportDialog} onClose={() => setReportDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Generate Health Report</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Select the type of report you want to generate:
            </Typography>
            
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Report Type</InputLabel>
              <Select label="Report Type" defaultValue="">
                <MenuItem value="comprehensive">Comprehensive Health Report</MenuItem>
                <MenuItem value="trends">Trend Analysis Report</MenuItem>
                <MenuItem value="predictions">Predictive Analytics Report</MenuItem>
                <MenuItem value="performance">Performance Summary</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Date Range"
              placeholder="Last 30 days"
              sx={{ mb: 2 }}
            />
            
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Include predictions"
            />
            
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Include recommendations"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReportDialog(false)}>Cancel</Button>
          <Button variant="contained">
            Generate Report
          </Button>
        </DialogActions>
      </Dialog>

      {/* Predictions Dialog */}
      <Dialog open={predictionDialog} onClose={() => setPredictionDialog(false)} maxWidth="lg" fullWidth>
        <DialogTitle>AI Health Predictions</DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>Risk Assessment</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {predictions.map((prediction) => (
                  <Box key={prediction.id} sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="h6">{prediction.metric}</Typography>
                      <Chip 
                        label={`${prediction.probability}%`} 
                        color={prediction.probability > 20 ? 'error' : prediction.probability > 10 ? 'warning' : 'success'}
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Confidence: {prediction.confidence}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {prediction.recommendation}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>Health Insights</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Alert severity="success">
                  <Typography variant="body2">
                    Your overall health is improving with a 12% positive trend this month.
                  </Typography>
                </Alert>
                <Alert severity="info">
                  <Typography variant="body2">
                    Blood pressure is stable and within normal range.
                  </Typography>
                </Alert>
                <Alert severity="warning">
                  <Typography variant="body2">
                    Consider increasing physical activity to improve cardiovascular health.
                  </Typography>
                </Alert>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPredictionDialog(false)}>Close</Button>
          <Button variant="contained">Export Predictions</Button>
        </DialogActions>
      </Dialog>

      {/* Metric Details Dialog */}
      <Dialog open={!!selectedMetric} onClose={() => setSelectedMetric(null)} maxWidth="md" fullWidth>
        {selectedMetric && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h5">{selectedMetric.name}</Typography>
                <Chip label={selectedMetric.status} color={getStatusColor(selectedMetric.status)} />
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>Current Status</Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="h4" gutterBottom>
                      {selectedMetric.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Last updated: {selectedMetric.lastUpdated}
                    </Typography>
                  </Box>
                  
                  <Typography variant="h6" gutterBottom>Trend Analysis</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Typography variant="body2">
                      Trend: {selectedMetric.trend}
                    </Typography>
                    <Chip label={selectedMetric.change} color={getChangeColor(selectedMetric.change)} />
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>Historical Data</Typography>
                  <Box sx={{ height: 200, display: 'flex', alignItems: 'end', gap: 0.5 }}>
                    {Array.from({ length: 30 }, (_, i) => (
                      <Box
                        key={i}
                        sx={{
                          width: 8,
                          height: `${Math.random() * 100}px`,
                          backgroundColor: 'primary.main',
                          borderRadius: '2px 2px 0 0'
                        }}
                      />
                    ))}
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSelectedMetric(null)}>Close</Button>
              <Button variant="contained">Export Data</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default AnalyticsDashboardPage; 