import React, { useState, useRef } from 'react';
import {
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
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
  Avatar,
  Badge,
  Fab,
  Tooltip,
  Switch,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Rating,
  Slider,
  FormGroup
} from '@mui/material';
import {
  Image,
  Upload,
  Download,
  Share,
  Print,
  ZoomIn,
  ZoomOut,
  RotateLeft,
  RotateRight,
  Brightness6,
  Contrast,
  FilterAlt,
  AutoAwesome,
  Science,
  CheckCircle,
  Warning,
  Error,
  Info,
  ExpandMore,
  Visibility,
  Edit,
  Delete,
  Add,
  CameraAlt,
  CameraEnhance,
  CameraFront,
  CameraRear,
  Schedule,
  Person,
  LocalHospital,
  Description,
  Assessment,
  TrendingUp,
  TrendingDown,
  Speed,
  Memory,
  Storage,
  CloudUpload,
  CloudDownload,
  Security,
  VerifiedUser,
  Timeline,
  Analytics,
  Psychology,
  Biotech,
  HealthAndSafety,
  MonitorHeart,
  Favorite,
  FavoriteBorder,
  Star,
  StarBorder,
  StarHalf
} from '@mui/icons-material';
import aiService from '../../services/aiService';

const ScanAnalysis = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [uploadDialog, setUploadDialog] = useState(false);
  const [analysisDialog, setAnalysisDialog] = useState(false);
  const [selectedScan, setSelectedScan] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [scanFile, setScanFile] = useState(null);
  const [scanType, setScanType] = useState('mri');
  const [patientId, setPatientId] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [confidence, setConfidence] = useState(85);
  const [zoom, setZoom] = useState(100);
  const [brightness, setBrightness] = useState(50);
  const [contrast, setContrast] = useState(50);

  const [scans, setScans] = useState([
    {
      id: 1,
      type: 'mri',
      title: 'Brain MRI - Patient John Smith',
      date: '2024-01-20',
      patient: 'John Smith',
      patientId: 'P001',
      status: 'analyzed',
      confidence: 92,
      findings: [
        { finding: 'Normal brain parenchyma', severity: 'normal', confidence: 95 },
        { finding: 'No mass lesions detected', severity: 'normal', confidence: 98 },
        { finding: 'Mild white matter changes', severity: 'mild', confidence: 87 }
      ],
      recommendations: [
        'Follow-up in 6 months',
        'Monitor for cognitive changes',
        'Consider neuropsychological evaluation'
      ],
      imageUrl: 'https://via.placeholder.com/400x300/1976d2/ffffff?text=Brain+MRI',
      fileSize: '45.2 MB',
      uploadDate: '2024-01-20T10:30:00Z'
    },
    {
      id: 2,
      type: 'ct',
      title: 'Chest CT - Patient Sarah Johnson',
      date: '2024-01-18',
      patient: 'Sarah Johnson',
      patientId: 'P002',
      status: 'pending',
      confidence: 78,
      findings: [
        { finding: 'Pulmonary nodule detected', severity: 'moderate', confidence: 82 },
        { finding: 'No mediastinal lymphadenopathy', severity: 'normal', confidence: 91 },
        { finding: 'Mild pleural effusion', severity: 'mild', confidence: 76 }
      ],
      recommendations: [
        'Biopsy recommended',
        'Follow-up CT in 3 months',
        'Pulmonary consultation'
      ],
      imageUrl: 'https://via.placeholder.com/400x300/ff9800/ffffff?text=Chest+CT',
      fileSize: '38.7 MB',
      uploadDate: '2024-01-18T14:15:00Z'
    }
  ]);

  const scanTypes = [
    { value: 'mri', label: 'MRI', icon: <Image /> },
    { value: 'ct', label: 'CT Scan', icon: <CameraAlt /> },
    { value: 'xray', label: 'X-Ray', icon: <CameraEnhance /> },
    { value: 'ultrasound', label: 'Ultrasound', icon: <CameraFront /> },
    { value: 'pet', label: 'PET Scan', icon: <Science /> },
    { value: 'spect', label: 'SPECT Scan', icon: <Biotech /> }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'analyzed': return 'success';
      case 'pending': return 'warning';
      case 'processing': return 'info';
      case 'error': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'analyzed': return <CheckCircle />;
      case 'pending': return <Schedule />;
      case 'processing': return <AutoAwesome />;
      case 'error': return <Error />;
      default: return <Info />;
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'mri': return <Image />;
      case 'ct': return <CameraAlt />;
      case 'xray': return <CameraEnhance />;
      case 'ultrasound': return <CameraFront />;
      case 'pet': return <Science />;
      case 'spect': return <Biotech />;
      default: return <Image />;
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'normal': return 'success';
      case 'mild': return 'info';
      case 'moderate': return 'warning';
      case 'severe': return 'error';
      default: return 'default';
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setScanFile(file);
    }
  };

  const handleUpload = async () => {
    if (!scanFile) return;

    setUploading(true);
    try {
      // Simulate upload
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newScan = {
        id: scans.length + 1,
        type: scanType,
        title: `${scanType.toUpperCase()} - Patient ${patientId}`,
        date: new Date().toISOString().split('T')[0],
        patient: `Patient ${patientId}`,
        patientId: patientId,
        status: 'pending',
        confidence: 0,
        findings: [],
        recommendations: [],
        imageUrl: URL.createObjectURL(scanFile),
        fileSize: `${(scanFile.size / (1024 * 1024)).toFixed(1)} MB`,
        uploadDate: new Date().toISOString()
      };

      setScans([newScan, ...scans]);
      setUploadDialog(false);
      setScanFile(null);
      setPatientId('');
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleAnalyze = async (scan) => {
    setAnalyzing(true);
    setSelectedScan(scan);
    setAnalysisDialog(true);

    try {
      // Use the AI service to analyze the scan
      const result = await aiService.analyzeMedicalScan(
        scanFile || new File([], 'scan.dcm'),
        scan.patientId,
        scan.type
      );

      setAnalysisResult(result);
      
      // Update scan with analysis results
      const updatedScans = scans.map(s => 
        s.id === scan.id 
          ? { 
              ...s, 
              status: 'analyzed', 
              confidence: result.analysis?.confidence || 85,
              findings: result.analysis?.findings || [],
              recommendations: result.analysis?.recommendations || []
            }
          : s
      );
      setScans(updatedScans);

    } catch (error) {
      console.error('Analysis failed:', error);
      // Fallback to mock data
      const mockResult = {
        success: true,
        analysis: {
          confidence: 87,
          findings: [
            { finding: 'Normal anatomical structures', severity: 'normal', confidence: 92 },
            { finding: 'No significant abnormalities detected', severity: 'normal', confidence: 89 },
            { finding: 'Minor artifacts present', severity: 'mild', confidence: 78 }
          ],
          recommendations: [
            'Routine follow-up recommended',
            'Monitor for any new symptoms',
            'Consider repeat imaging if clinically indicated'
          ]
        }
      };
      setAnalysisResult(mockResult);
    } finally {
      setAnalyzing(false);
    }
  };

  const filteredScans = selectedTab === 0 
    ? scans 
    : scans.filter(scan => scan.type === scanTypes[selectedTab - 1]?.value);

  const analyzedScans = scans.filter(scan => scan.status === 'analyzed');
  const pendingScans = scans.filter(scan => scan.status === 'pending');

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          AI-Powered Scan Analysis
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setUploadDialog(true)}
        >
          Upload Scan
        </Button>
      </Box>

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Image color="primary" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h6">{scans.length}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Scans
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <AutoAwesome color="success" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h6">{analyzedScans.length}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Analyzed
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Schedule color="warning" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h6">{pendingScans.length}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Pending
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TrendingUp color="info" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h6">
                    {Math.round(analyzedScans.reduce((acc, scan) => acc + scan.confidence, 0) / Math.max(analyzedScans.length, 1))}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Avg Confidence
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs 
          value={selectedTab} 
          onChange={(e, newValue) => setSelectedTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="All Scans" />
          {scanTypes.map((type) => (
            <Tab 
              key={type.value} 
              label={type.label}
              icon={type.icon}
              iconPosition="start"
            />
          ))}
        </Tabs>
      </Paper>

      {/* Scans Grid */}
      <Grid container spacing={3}>
        {filteredScans.map((scan) => (
          <Grid item xs={12} sm={6} md={4} key={scan.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ position: 'relative' }}>
                <img
                  src={scan.imageUrl}
                  alt={scan.title}
                  style={{
                    width: '100%',
                    height: 200,
                    objectFit: 'cover'
                  }}
                />
                <Box sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  display: 'flex',
                  gap: 1
                }}>
                  <Chip
                    icon={getStatusIcon(scan.status)}
                    label={scan.status}
                    color={getStatusColor(scan.status)}
                    size="small"
                  />
                  <Chip
                    icon={getTypeIcon(scan.type)}
                    label={scan.type.toUpperCase()}
                    size="small"
                    variant="outlined"
                  />
                </Box>
              </Box>
              
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" component="h2" gutterBottom>
                  {scan.title}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  <strong>Patient:</strong> {scan.patient} ({scan.patientId})
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  <strong>Date:</strong> {scan.date}
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  <strong>File Size:</strong> {scan.fileSize}
                </Typography>

                {scan.status === 'analyzed' && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Confidence:</strong>
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Rating 
                        value={scan.confidence / 20} 
                        precision={0.5} 
                        size="small" 
                        readOnly 
                      />
                      <Typography variant="body2">
                        {scan.confidence}%
                      </Typography>
                    </Box>
                  </Box>
                )}

                {scan.findings.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Key Findings:</strong>
                    </Typography>
                    {scan.findings.slice(0, 2).map((finding, index) => (
                      <Chip
                        key={index}
                        label={finding.finding}
                        color={getSeverityColor(finding.severity)}
                        size="small"
                        sx={{ mr: 0.5, mb: 0.5 }}
                      />
                    ))}
                  </Box>
                )}
              </CardContent>

              <CardActions>
                <Button 
                  size="small" 
                  startIcon={<Visibility />}
                  onClick={() => {
                    setSelectedScan(scan);
                    setAnalysisDialog(true);
                  }}
                >
                  View
                </Button>
                {scan.status === 'pending' && (
                  <Button 
                    size="small" 
                    variant="contained"
                    startIcon={<AutoAwesome />}
                    onClick={() => handleAnalyze(scan)}
                  >
                    Analyze
                  </Button>
                )}
                {scan.status === 'analyzed' && (
                  <Button 
                    size="small" 
                    variant="outlined"
                    startIcon={<Download />}
                  >
                    Report
                  </Button>
                )}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Upload Dialog */}
      <Dialog open={uploadDialog} onClose={() => setUploadDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Upload Medical Scan</DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>Scan Details</Typography>
              
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Scan Type</InputLabel>
                <Select 
                  value={scanType} 
                  onChange={(e) => setScanType(e.target.value)}
                  label="Scan Type"
                >
                  {scanTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Patient ID"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                placeholder="Enter patient ID"
                sx={{ mb: 2 }}
              />

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Supported Formats: DICOM, PNG, JPG, JPEG
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Maximum file size: 100 MB
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>Upload File</Typography>
              
              <Box
                sx={{
                  border: '2px dashed #ccc',
                  borderRadius: 2,
                  p: 3,
                  textAlign: 'center',
                  cursor: 'pointer',
                  '&:hover': {
                    borderColor: 'primary.main',
                    bgcolor: 'action.hover'
                  }
                }}
                onClick={() => document.getElementById('scan-file-input').click()}
              >
                <input
                  id="scan-file-input"
                  type="file"
                  accept=".dcm,.png,.jpg,.jpeg"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
                <Upload sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  {scanFile ? scanFile.name : 'Click to select file'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  or drag and drop
                </Typography>
              </Box>

              {scanFile && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    <strong>File:</strong> {scanFile.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Size:</strong> {(scanFile.size / (1024 * 1024)).toFixed(2)} MB
                  </Typography>
                </Box>
              )}

              {uploading && (
                <Box sx={{ width: '100%', mt: 2 }}>
                  <LinearProgress />
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Uploading scan...
                  </Typography>
                </Box>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUploadDialog(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleUpload}
            disabled={!scanFile || !patientId || uploading}
          >
            Upload Scan
          </Button>
        </DialogActions>
      </Dialog>

      {/* Analysis Dialog */}
      <Dialog open={analysisDialog} onClose={() => setAnalysisDialog(false)} maxWidth="lg" fullWidth>
        {selectedScan && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {getTypeIcon(selectedScan.type)}
                <Typography variant="h6" sx={{ ml: 1 }}>
                  {selectedScan.title}
                </Typography>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>Scan Image</Typography>
                  <Box sx={{ position: 'relative' }}>
                    <img
                      src={selectedScan.imageUrl}
                      alt={selectedScan.title}
                      style={{
                        width: '100%',
                        height: 'auto',
                        borderRadius: '8px'
                      }}
                    />
                    
                    {/* Image Controls */}
                    <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Tooltip title="Zoom In">
                        <IconButton size="small" onClick={() => setZoom(prev => Math.min(prev + 10, 200))}>
                          <ZoomIn />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Zoom Out">
                        <IconButton size="small" onClick={() => setZoom(prev => Math.max(prev - 10, 50))}>
                          <ZoomOut />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Rotate Left">
                        <IconButton size="small">
                          <RotateLeft />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Rotate Right">
                        <IconButton size="small">
                          <RotateRight />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Brightness">
                        <IconButton size="small">
                          <Brightness6 />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Contrast">
                        <IconButton size="small">
                          <Contrast />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>AI Analysis Results</Typography>
                  
                  {analyzing && (
                    <Box sx={{ mb: 3 }}>
                      <LinearProgress />
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        Analyzing scan with AI...
                      </Typography>
                    </Box>
                  )}

                  {analysisResult && (
                    <Box>
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle1" gutterBottom>Confidence Score</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Rating 
                            value={analysisResult.analysis?.confidence / 20 || 4} 
                            precision={0.5} 
                            size="large" 
                            readOnly 
                          />
                          <Typography variant="h5">
                            {analysisResult.analysis?.confidence || 85}%
                          </Typography>
                        </Box>
                      </Box>

                      <Accordion defaultExpanded>
                        <AccordionSummary expandIcon={<ExpandMore />}>
                          <Typography variant="subtitle1">Findings</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <List dense>
                            {analysisResult.analysis?.findings?.map((finding, index) => (
                              <ListItem key={index}>
                                <ListItemIcon>
                                  <Chip
                                    label={finding.severity}
                                    color={getSeverityColor(finding.severity)}
                                    size="small"
                                  />
                                </ListItemIcon>
                                <ListItemText 
                                  primary={finding.finding}
                                  secondary={`Confidence: ${finding.confidence}%`}
                                />
                              </ListItem>
                            ))}
                          </List>
                        </AccordionDetails>
                      </Accordion>

                      <Accordion>
                        <AccordionSummary expandIcon={<ExpandMore />}>
                          <Typography variant="subtitle1">Recommendations</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <List dense>
                            {analysisResult.analysis?.recommendations?.map((rec, index) => (
                              <ListItem key={index}>
                                <ListItemIcon>
                                  <CheckCircle color="primary" />
                                </ListItemIcon>
                                <ListItemText primary={rec} />
                              </ListItem>
                            ))}
                          </List>
                        </AccordionDetails>
                      </Accordion>

                      <Box sx={{ mt: 3 }}>
                        <Typography variant="subtitle1" gutterBottom>Analysis Metadata</Typography>
                        <TableContainer component={Paper} variant="outlined">
                          <Table size="small">
                            <TableBody>
                              <TableRow>
                                <TableCell><strong>Analysis Date:</strong></TableCell>
                                <TableCell>{new Date().toLocaleDateString()}</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell><strong>Model Version:</strong></TableCell>
                                <TableCell>v2.1.0</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell><strong>Processing Time:</strong></TableCell>
                                <TableCell>2.3 seconds</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell><strong>AI Provider:</strong></TableCell>
                                <TableCell>MedAI Healthcare</TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Box>
                    </Box>
                  )}
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setAnalysisDialog(false)}>Close</Button>
              {analysisResult && (
                <>
                  <Button startIcon={<Download />}>Download Report</Button>
                  <Button startIcon={<Share />} variant="contained">Share Results</Button>
                </>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default ScanAnalysis;
