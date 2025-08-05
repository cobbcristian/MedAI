import React, { useState, useRef, useEffect } from 'react';
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
  Progress
} from '@mui/material';
import {
  Description,
  Download,
  Upload,
  Share,
  Edit,
  Delete,
  Visibility,
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
  Science,
  Medication,
  Vaccines,
  LocalHospital,
  TrendingUp,
  TrendingDown,
  Assessment,
  Psychology,
  Biotech,
  HealthAndSafety,
  MonitorHeart,
  Bloodtype,
  Image,
  ExpandMore,
  Warning as WarningIcon,
  PriorityHigh,
  Schedule,
  CalendarToday,
  AccessTime,
  Star,
  StarBorder,
  VisibilityOff,
  VisibilityOn,
  Refresh,
  Analytics,
} from '@mui/icons-material';

const MedicalRecordsPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [uploadDialog, setUploadDialog] = useState(false);
  const [shareDialog, setShareDialog] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [comprehensiveAnalysis, setComprehensiveAnalysis] = useState(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [surgicalProcedures, setSurgicalProcedures] = useState([]);
  const [selectedProcedure, setSelectedProcedure] = useState(null);
  const [procedureGuide, setProcedureGuide] = useState(null);
  const fileInputRef = useRef();

  // Enhanced medical records data with AI analysis
  const [medicalRecords] = useState([
    {
      id: 1,
      title: 'Comprehensive Blood Work Analysis',
      type: 'Lab Results',
      date: '2024-01-15',
      doctor: 'Dr. Sarah Johnson',
      status: 'completed',
      fileSize: '2.3 MB',
      description: 'Complete blood count, cholesterol panel, and metabolic panel with AI analysis',
      tags: ['lab', 'blood', 'routine', 'ai-analysis'],
      shared: true,
      encrypted: true,
      bloodWork: {
        hemoglobin: { value: 12.5, unit: 'g/dL', normal: '12.0-15.5', status: 'normal', aiAnalysis: 'Normal levels, good oxygen-carrying capacity' },
        whiteBloodCells: { value: 11.2, unit: 'K/µL', normal: '4.5-11.0', status: 'high', aiAnalysis: 'Elevated WBC count suggests possible infection or inflammation' },
        platelets: { value: 250, unit: 'K/µL', normal: '150-450', status: 'normal', aiAnalysis: 'Normal platelet count, good clotting ability' },
        glucose: { value: 95, unit: 'mg/dL', normal: '70-100', status: 'normal', aiAnalysis: 'Normal fasting glucose, no diabetes risk' },
        cholesterol: { value: 220, unit: 'mg/dL', normal: '<200', status: 'high', aiAnalysis: 'Elevated cholesterol increases cardiovascular risk' },
        creatinine: { value: 1.2, unit: 'mg/dL', normal: '0.6-1.2', status: 'borderline', aiAnalysis: 'Borderline high, monitor kidney function' }
      },
      aiRecommendations: {
        riskFactors: ['Elevated cholesterol', 'Borderline creatinine'],
        interventions: ['Diet modification', 'Exercise program', 'Cholesterol monitoring'],
        medications: ['Statins (if needed)', 'Blood pressure medication'],
        cancerRisk: 'Low',
        lifeExpectancy: 'Normal with lifestyle changes'
      }
    },
    {
      id: 2,
      title: 'Chest X-Ray with AI Analysis',
      type: 'Imaging',
      date: '2024-01-10',
      doctor: 'Dr. Michael Chen',
      status: 'completed',
      fileSize: '8.7 MB',
      description: 'Chest X-ray with AI-powered analysis and abnormality detection',
      tags: ['imaging', 'x-ray', 'chest', 'ai-analysis'],
      shared: false,
      encrypted: true,
      xrayAnalysis: {
        findings: 'Small opacity in right lower lobe',
        confidence: 87,
        aiDiagnosis: 'Possible early-stage pneumonia or small mass',
        recommendations: ['Follow-up CT scan', 'Antibiotic treatment', 'Repeat X-ray in 2 weeks'],
        doctorNotes: 'Patient reports mild cough and fatigue. AI detected subtle changes not initially visible.'
      }
    },
    {
      id: 3,
      title: 'Medication History & Impact Analysis',
      type: 'Medication',
      date: '2024-01-08',
      doctor: 'Dr. Emily Davis',
      status: 'active',
      medicationHistory: {
        current: [
          {
            name: 'Lisinopril',
            dosage: '10mg daily',
            reason: 'Hypertension',
            startDate: '2023-06-15',
            effectiveness: 'Good - BP reduced from 150/95 to 125/80',
            sideEffects: ['Mild dry cough', 'Occasional dizziness'],
            aiRecommendation: 'Continue current dosage, monitor kidney function',
            lifeImpact: 'Positive - reduces cardiovascular risk, may need adjustment if kidney function declines'
          },
          {
            name: 'Metformin',
            dosage: '500mg twice daily',
            reason: 'Type 2 Diabetes',
            startDate: '2023-08-20',
            effectiveness: 'Excellent - A1C reduced from 7.2% to 6.1%',
            sideEffects: ['Mild gastrointestinal upset'],
            aiRecommendation: 'Continue current dosage, consider adding exercise',
            lifeImpact: 'Positive - significantly reduces diabetes complications'
          }
        ],
        past: [
          {
            name: 'Ibuprofen',
            dosage: '400mg as needed',
            reason: 'Chronic back pain',
            startDate: '2023-01-10',
            endDate: '2023-05-15',
            effectiveness: 'Moderate - reduced pain by 60%',
            sideEffects: ['Stomach irritation'],
            aiRecommendation: 'Discontinued due to gastrointestinal side effects',
            lifeImpact: 'Mixed - helped with pain but caused stomach issues'
          }
        ]
      }
    },
    {
      id: 4,
      title: 'Vaccination Records & Risk Assessment',
      type: 'Immunization',
      date: '2024-01-05',
      doctor: 'Dr. Lisa Rodriguez',
      status: 'active',
      vaccinationRecords: {
        completed: [
          {
            name: 'COVID-19',
            date: '2023-12-15',
            type: 'Booster',
            reaction: 'Mild arm soreness',
            effectiveness: 'High protection against severe disease'
          },
          {
            name: 'Flu Shot',
            date: '2023-10-20',
            type: 'Annual',
            reaction: 'None',
            effectiveness: 'Good protection for current flu season'
          },
          {
            name: 'Tetanus',
            date: '2022-06-10',
            type: 'Booster',
            reaction: 'Mild arm soreness',
            effectiveness: 'Protection for 10 years'
          }
        ],
        missing: [
          {
            name: 'Pneumonia',
            dueDate: '2024-09-20',
            importance: 'High',
            risk: 'Increased risk of pneumonia complications'
          },
          {
            name: 'Shingles',
            dueDate: '2024-12-15',
            importance: 'Medium',
            risk: 'Prevents shingles in older adults'
          }
        ],
        overallRisk: 'Low',
        recommendations: ['Get pneumonia vaccine', 'Consider shingles vaccine']
      }
    },
    {
      id: 5,
      title: 'Surgical Procedure Guide - Appendectomy',
      type: 'Procedure',
      date: '2024-01-12',
      doctor: 'Dr. Robert Wilson',
      status: 'scheduled',
      surgicalProcedure: {
        name: 'Appendectomy',
        type: 'Laparoscopic',
        duration: '45-60 minutes',
        aiGuide: {
          preOp: [
            'Complete blood work and imaging',
            'Stop blood thinners 7 days prior',
            'Fast for 8 hours before surgery',
            'Arrange post-operative care',
            'Complete pre-operative assessment'
          ],
          procedure: [
            'Administer general anesthesia',
            'Make small incisions in abdomen',
            'Insert laparoscope and instruments',
            'Remove inflamed appendix',
            'Close incisions with sutures'
          ],
          postOp: [
            'Monitor vital signs',
            'Manage pain with prescribed medications',
            'Encourage early ambulation',
            'Monitor for complications',
            'Schedule follow-up appointment'
          ],
          complications: [
            'Infection at surgical site',
            'Bleeding or hematoma',
            'Blood clots (DVT)',
            'Anesthesia complications',
            'Delayed wound healing'
          ]
        }
      }
    }
  ]);

  const [sharedRecords] = useState([
    {
      id: 6,
      title: 'Shared with Dr. Johnson',
      type: 'Lab Results',
      date: '2024-01-15',
      sharedWith: 'Dr. Sarah Johnson',
      accessLevel: 'read-only',
      expiresAt: '2024-02-15'
    },
    {
      id: 7,
      title: 'Shared with Insurance',
      type: 'Imaging',
      date: '2024-01-10',
      sharedWith: 'Blue Cross Blue Shield',
      accessLevel: 'temporary',
      expiresAt: '2024-01-25'
    }
  ]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleRecordClick = (record) => {
    setSelectedRecord(record);
  };

  const handleUpload = () => {
    setUploadDialog(true);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadProgress(0);
      setUploading(true);
      
      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setUploading(false);
            setUploadDialog(false);
            return 100;
          }
          return prev + 10;
        });
      }, 200);
    }
  };

  const handleShare = (record) => {
    setSelectedRecord(record);
    setShareDialog(true);
  };

  const handleDownload = (record) => {
    // Simulate download
    console.log('Downloading:', record.title);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'active': return 'primary';
      case 'scheduled': return 'warning';
      case 'pending': return 'info';
      default: return 'default';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Lab Results': return <Bloodtype color="primary" />;
      case 'Imaging': return <Image color="primary" />;
      case 'Medication': return <Medication color="primary" />;
      case 'Immunization': return <Vaccines color="primary" />;
      case 'Procedure': return <LocalHospital color="primary" />;
      default: return <Description color="primary" />;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Medical Records
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Analytics />}
            onClick={() => setComprehensiveAnalysis({})}
          >
            Comprehensive Analysis
          </Button>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleUpload}
          sx={{ borderRadius: 2 }}
        >
          Upload Record
        </Button>
        </Box>
      </Box>

      <Paper sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab label={`All Records (${medicalRecords.length})`} />
          <Tab label={`Shared Records (${sharedRecords.length})`} />
          <Tab label="Comprehensive Analysis" />
          <Tab label="Surgical Guides" />
          <Tab label="Recent Activity" />
        </Tabs>
      </Paper>

      {activeTab === 0 && (
        <Grid container spacing={3}>
          {medicalRecords.map((record) => (
            <Grid item xs={12} md={6} lg={4} key={record.id}>
              <Card 
                sx={{ 
                  height: '100%',
                  cursor: 'pointer',
                  '&:hover': { boxShadow: 4 }
                }}
                onClick={() => handleRecordClick(record)}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {getTypeIcon(record.type)}
                      <Typography variant="h6" component="h3">
                        {record.title}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {record.encrypted && (
                        <Tooltip title="Encrypted">
                          <Lock fontSize="small" color="success" />
                        </Tooltip>
                      )}
                      {record.shared && (
                        <Tooltip title="Shared">
                          <Share fontSize="small" color="primary" />
                        </Tooltip>
                      )}
                    </Box>
                  </Box>

                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {record.description}
                  </Typography>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                      {record.date} • {record.doctor}
                    </Typography>
                    <Chip 
                      label={record.status} 
                      size="small" 
                      color={getStatusColor(record.status)}
                    />
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    {record.tags.map((tag) => (
                      <Chip key={tag} label={tag} size="small" variant="outlined" />
                    ))}
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" color="text.secondary">
                      {record.fileSize}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleDownload(record); }}>
                        <Download fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleShare(record); }}>
                        <Share fontSize="small" />
                      </IconButton>
                      <IconButton size="small">
                        <Visibility fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {activeTab === 1 && (
        <Grid container spacing={3}>
          {sharedRecords.map((record) => (
            <Grid item xs={12} md={6} key={record.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" component="h3">
                      {record.title}
                    </Typography>
                    <Chip label={record.accessLevel} size="small" color="info" />
                  </Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Shared with: {record.sharedWith}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Expires: {record.expiresAt}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {activeTab === 2 && comprehensiveAnalysis && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>Comprehensive Health Analysis</Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Blood Work Analysis</Typography>
                  <Typography variant="body2">
                    Hemoglobin: 12.5 g/dL (Normal: 12.0-15.5)
                  </Typography>
                  <Typography variant="body2">
                    White Blood Cells: 11.2 K/µL (High: 4.5-11.0)
                  </Typography>
                  <Typography variant="body2">
                    Cholesterol: 220 mg/dL (High: &lt;200)
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>AI Recommendations</Typography>
                  <Typography variant="body2">
                    • Monitor cholesterol levels
                  </Typography>
                  <Typography variant="body2">
                    • Consider statin therapy
                  </Typography>
                  <Typography variant="body2">
                    • Schedule follow-up in 3 months
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>
      )}

      {activeTab === 3 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>Surgical Procedure Guides</Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Appendectomy</Typography>
                  <Typography variant="body2" gutterBottom>
                    Pre-operative Steps:
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircle color="primary" />
                      </ListItemIcon>
                      <ListItemText primary="Complete blood work and imaging" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircle color="primary" />
                      </ListItemIcon>
                      <ListItemText primary="Stop blood thinners 7 days prior" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircle color="primary" />
                      </ListItemIcon>
                      <ListItemText primary="Fast for 8 hours before surgery" />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>
      )}

      {activeTab === 4 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>Recent Activity</Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <CheckCircle color="success" />
              </ListItemIcon>
              <ListItemText 
                primary="Blood test results uploaded"
                secondary="2 hours ago"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Share color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Records shared with Dr. Johnson"
                secondary="1 day ago"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Download color="info" />
              </ListItemIcon>
              <ListItemText 
                primary="Vaccination records downloaded"
                secondary="3 days ago"
              />
            </ListItem>
          </List>
        </Paper>
      )}

      {/* Upload Dialog */}
      <Dialog open={uploadDialog} onClose={() => setUploadDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Upload Medical Record</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Select the type of medical record you're uploading:
            </Typography>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Record Type</InputLabel>
              <Select label="Record Type" defaultValue="">
                <MenuItem value="lab">Lab Results</MenuItem>
                <MenuItem value="imaging">Imaging</MenuItem>
                <MenuItem value="medication">Medication</MenuItem>
                <MenuItem value="immunization">Immunization</MenuItem>
                <MenuItem value="procedure">Procedure</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              fullWidth
              label="Record Title"
              placeholder="e.g., Blood Test Results"
              sx={{ mb: 2 }}
            />
            
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              placeholder="Brief description of the record"
              sx={{ mb: 2 }}
            />

            <Box sx={{ border: '2px dashed', borderColor: 'grey.300', borderRadius: 2, p: 3, textAlign: 'center' }}>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                style={{ display: 'none' }}
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              />
              <Button
                variant="outlined"
                onClick={() => fileInputRef.current.click()}
                startIcon={<CloudUpload />}
              >
                Choose File
              </Button>
              <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                Supported formats: PDF, JPG, PNG, DOC, DOCX (Max 50MB)
              </Typography>
            </Box>

            {uploading && (
              <Box sx={{ mt: 2 }}>
                <LinearProgress variant="determinate" value={uploadProgress} />
                <Typography variant="caption" color="text.secondary">
                  Uploading... {uploadProgress}%
                </Typography>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUploadDialog(false)}>Cancel</Button>
          <Button variant="contained" disabled={uploading}>
            Upload Record
          </Button>
        </DialogActions>
      </Dialog>

      {/* Share Dialog */}
      <Dialog open={shareDialog} onClose={() => setShareDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Share Medical Record</DialogTitle>
        <DialogContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
            Share "{selectedRecord?.title}" with:
              </Typography>
              <TextField
                fullWidth
            label="Recipient Email"
                placeholder="doctor@hospital.com"
                sx={{ mb: 2 }}
              />
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Access Level</InputLabel>
                <Select label="Access Level" defaultValue="read-only">
                  <MenuItem value="read-only">Read Only</MenuItem>
                  <MenuItem value="temporary">Temporary Access</MenuItem>
                  <MenuItem value="full">Full Access</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
            label="Expiration Date"
                type="date"
            defaultValue="2024-02-15"
                sx={{ mb: 2 }}
              />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShareDialog(false)}>Cancel</Button>
          <Button variant="contained">Share Record</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MedicalRecordsPage; 