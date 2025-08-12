import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Paper,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton
} from '@mui/material';
import {
  LocalHospital,
  PlayArrow,
  Pause,
  Stop,
  VolumeUp,
  VolumeOff,
  Fullscreen,
  FullscreenExit,
  Build,
  Warning,
  CheckCircle,
  Info,
  VideoCall,
  Description,
  Assessment,
  Timeline,
  People,
  Schedule,
  Security
} from '@mui/icons-material';

const SurgicalGuide = () => {
  const [selectedSpecialty, setSelectedSpecialty] = useState('cardiology');
  const [selectedProcedure, setSelectedProcedure] = useState(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [openVideoDialog, setOpenVideoDialog] = useState(false);

  const specialties = [
    { value: 'cardiology', label: 'Cardiology', icon: <LocalHospital /> },
    { value: 'neurology', label: 'Neurology', icon: <LocalHospital /> },
    { value: 'orthopedics', label: 'Orthopedics', icon: <LocalHospital /> },
    { value: 'general', label: 'General Surgery', icon: <LocalHospital /> },
    { value: 'oncology', label: 'Oncology', icon: <LocalHospital /> },
    { value: 'pediatrics', label: 'Pediatrics', icon: <LocalHospital /> },
    { value: 'urology', label: 'Urology', icon: <LocalHospital /> },
    { value: 'gynecology', label: 'Gynecology', icon: <LocalHospital /> },
    { value: 'ophthalmology', label: 'Ophthalmology', icon: <LocalHospital /> },
    { value: 'dermatology', label: 'Dermatology', icon: <LocalHospital /> }
  ];

  const procedures = {
    cardiology: [
      {
        id: 'coronary-bypass',
        name: 'Coronary Artery Bypass Graft (CABG)',
        duration: '3-6 hours',
        complexity: 'High',
        risk: 'Medium',
        description: 'Surgical procedure to improve blood flow to the heart',
        videoUrl: 'https://www.youtube.com/embed/8QHn5j9uh8o',
        steps: [
          'Patient preparation and anesthesia',
          'Chest incision and sternotomy',
          'Harvesting of graft vessels',
          'Cardiopulmonary bypass initiation',
          'Graft anastomosis',
          'Chest closure and recovery'
        ],
        equipment: ['Heart-lung machine', 'Surgical instruments', 'Monitoring devices'],
        team: ['Cardiothoracic surgeon', 'Anesthesiologist', 'Perfusionist', 'Nurses']
      },
      {
        id: 'angioplasty',
        name: 'Percutaneous Coronary Intervention (PCI)',
        duration: '1-2 hours',
        complexity: 'Medium',
        risk: 'Low',
        description: 'Minimally invasive procedure to open blocked arteries',
        videoUrl: 'https://www.youtube.com/embed/9Q6sijdzH14',
        steps: [
          'Catheter insertion',
          'Angiography',
          'Balloon inflation',
          'Stent placement',
          'Catheter removal'
        ],
        equipment: ['Catheter', 'Balloon', 'Stent', 'X-ray machine'],
        team: ['Interventional cardiologist', 'Nurses', 'Technicians']
      },
      {
        id: 'valve-replacement',
        name: 'Heart Valve Replacement',
        duration: '4-6 hours',
        complexity: 'High',
        risk: 'High',
        description: 'Surgical replacement of damaged heart valves',
        videoUrl: 'https://www.youtube.com/embed/6ZP2NL9Y9wY',
        steps: [
          'Chest incision',
          'Heart-lung bypass',
          'Valve removal',
          'Prosthetic valve placement',
          'Closure and recovery'
        ],
        equipment: ['Heart-lung machine', 'Prosthetic valve', 'Surgical instruments'],
        team: ['Cardiothoracic surgeon', 'Anesthesiologist', 'Perfusionist']
      }
    ],
    neurology: [
      {
        id: 'craniotomy',
        name: 'Craniotomy',
        duration: '4-8 hours',
        complexity: 'High',
        risk: 'High',
        description: 'Surgical opening of the skull to access the brain',
        videoUrl: 'https://www.youtube.com/embed/8QHn5j9uh8o',
        steps: [
          'Patient positioning',
          'Scalp incision',
          'Bone flap creation',
          'Dura opening',
          'Surgical procedure',
          'Closure'
        ],
        equipment: ['Craniotome', 'Microscope', 'Monitoring devices'],
        team: ['Neurosurgeon', 'Anesthesiologist', 'Nurses']
      },
      {
        id: 'spinal-fusion',
        name: 'Spinal Fusion',
        duration: '3-6 hours',
        complexity: 'High',
        risk: 'Medium',
        description: 'Surgical procedure to join vertebrae together',
        videoUrl: 'https://www.youtube.com/embed/9Q6sijdzH14',
        steps: [
          'Patient positioning',
          'Incision and exposure',
          'Bone preparation',
          'Graft placement',
          'Instrumentation',
          'Closure'
        ],
        equipment: ['Surgical instruments', 'Bone graft', 'Implants'],
        team: ['Neurosurgeon', 'Anesthesiologist', 'Nurses']
      }
    ],
    orthopedics: [
      {
        id: 'hip-replacement',
        name: 'Total Hip Replacement',
        duration: '2-3 hours',
        complexity: 'High',
        risk: 'Medium',
        description: 'Surgical replacement of damaged hip joint',
        videoUrl: 'https://www.youtube.com/embed/6ZP2NL9Y9wY',
        steps: [
          'Patient positioning',
          'Hip incision',
          'Joint exposure',
          'Implant placement',
          'Closure and recovery'
        ],
        equipment: ['Surgical instruments', 'Implants', 'X-ray'],
        team: ['Orthopedic surgeon', 'Anesthesiologist', 'Nurses']
      },
      {
        id: 'knee-replacement',
        name: 'Total Knee Replacement',
        duration: '2-3 hours',
        complexity: 'High',
        risk: 'Medium',
        description: 'Surgical replacement of damaged knee joint',
        videoUrl: 'https://www.youtube.com/embed/8QHn5j9uh8o',
        steps: [
          'Patient positioning',
          'Knee incision',
          'Joint exposure',
          'Implant placement',
          'Closure and recovery'
        ],
        equipment: ['Surgical instruments', 'Implants', 'X-ray'],
        team: ['Orthopedic surgeon', 'Anesthesiologist', 'Nurses']
      },
      {
        id: 'shoulder-replacement',
        name: 'Shoulder Replacement',
        duration: '2-3 hours',
        complexity: 'High',
        risk: 'Medium',
        description: 'Surgical replacement of damaged shoulder joint',
        videoUrl: 'https://www.youtube.com/embed/9Q6sijdzH14',
        steps: [
          'Patient positioning',
          'Shoulder incision',
          'Joint exposure',
          'Implant placement',
          'Closure and recovery'
        ],
        equipment: ['Surgical instruments', 'Implants', 'X-ray'],
        team: ['Orthopedic surgeon', 'Anesthesiologist', 'Nurses']
      }
    ],
    general: [
      {
        id: 'appendectomy',
        name: 'Appendectomy',
        duration: '1-2 hours',
        complexity: 'Low',
        risk: 'Low',
        description: 'Surgical removal of the appendix',
        videoUrl: 'https://www.youtube.com/embed/6ZP2NL9Y9wY',
        steps: [
          'Anesthesia',
          'Abdominal incision',
          'Appendix identification',
          'Removal',
          'Closure'
        ],
        equipment: ['Laparoscope', 'Surgical instruments'],
        team: ['General surgeon', 'Anesthesiologist', 'Nurses']
      },
      {
        id: 'cholecystectomy',
        name: 'Laparoscopic Cholecystectomy',
        duration: '1-2 hours',
        complexity: 'Medium',
        risk: 'Low',
        description: 'Minimally invasive removal of gallbladder',
        videoUrl: 'https://www.youtube.com/embed/8QHn5j9uh8o',
        steps: [
          'Anesthesia',
          'Small incisions',
          'Laparoscope insertion',
          'Gallbladder removal',
          'Closure'
        ],
        equipment: ['Laparoscope', 'Surgical instruments', 'Camera'],
        team: ['General surgeon', 'Anesthesiologist', 'Nurses']
      },
      {
        id: 'hernia-repair',
        name: 'Hernia Repair',
        duration: '1-2 hours',
        complexity: 'Medium',
        risk: 'Low',
        description: 'Surgical repair of abdominal wall hernia',
        videoUrl: 'https://www.youtube.com/embed/9Q6sijdzH14',
        steps: [
          'Anesthesia',
          'Incision',
          'Hernia identification',
          'Mesh placement',
          'Closure'
        ],
        equipment: ['Surgical instruments', 'Mesh', 'Sutures'],
        team: ['General surgeon', 'Anesthesiologist', 'Nurses']
      }
    ],
    oncology: [
      {
        id: 'mastectomy',
        name: 'Mastectomy',
        duration: '2-4 hours',
        complexity: 'High',
        risk: 'Medium',
        description: 'Surgical removal of breast tissue',
        videoUrl: 'https://www.youtube.com/embed/6ZP2NL9Y9wY',
        steps: [
          'Patient positioning',
          'Incision planning',
          'Tissue removal',
          'Lymph node biopsy',
          'Closure'
        ],
        equipment: ['Surgical instruments', 'Pathology tools'],
        team: ['Surgical oncologist', 'Anesthesiologist', 'Nurses']
      },
      {
        id: 'prostatectomy',
        name: 'Prostatectomy',
        duration: '3-4 hours',
        complexity: 'High',
        risk: 'Medium',
        description: 'Surgical removal of the prostate gland',
        videoUrl: 'https://www.youtube.com/embed/8QHn5j9uh8o',
        steps: [
          'Patient positioning',
          'Abdominal incision',
          'Prostate exposure',
          'Gland removal',
          'Closure'
        ],
        equipment: ['Surgical instruments', 'Robotic system'],
        team: ['Urologist', 'Anesthesiologist', 'Nurses']
      }
    ],
    urology: [
      {
        id: 'kidney-transplant',
        name: 'Kidney Transplant',
        duration: '3-4 hours',
        complexity: 'High',
        risk: 'High',
        description: 'Surgical transplantation of kidney',
        videoUrl: 'https://www.youtube.com/embed/9Q6sijdzH14',
        steps: [
          'Donor kidney preparation',
          'Recipient incision',
          'Vessel anastomosis',
          'Ureter connection',
          'Closure'
        ],
        equipment: ['Surgical instruments', 'Transplant tools'],
        team: ['Transplant surgeon', 'Anesthesiologist', 'Nurses']
      }
    ],
    gynecology: [
      {
        id: 'hysterectomy',
        name: 'Hysterectomy',
        duration: '2-3 hours',
        complexity: 'High',
        risk: 'Medium',
        description: 'Surgical removal of the uterus',
        videoUrl: 'https://www.youtube.com/embed/6ZP2NL9Y9wY',
        steps: [
          'Patient positioning',
          'Abdominal incision',
          'Uterus exposure',
          'Organ removal',
          'Closure'
        ],
        equipment: ['Surgical instruments', 'Laparoscope'],
        team: ['Gynecologist', 'Anesthesiologist', 'Nurses']
      }
    ],
    ophthalmology: [
      {
        id: 'cataract-surgery',
        name: 'Cataract Surgery',
        duration: '30-60 minutes',
        complexity: 'Medium',
        risk: 'Low',
        description: 'Surgical removal of cataract and lens replacement',
        videoUrl: 'https://www.youtube.com/embed/8QHn5j9uh8o',
        steps: [
          'Eye preparation',
          'Small incision',
          'Cataract removal',
          'Lens implantation',
          'Closure'
        ],
        equipment: ['Microscope', 'Phacoemulsification machine'],
        team: ['Ophthalmologist', 'Anesthesiologist', 'Nurses']
      }
    ]
  };

  const handleProcedureSelect = (procedure) => {
    setSelectedProcedure(procedure);
    setOpenVideoDialog(true);
  };

  const getComplexityColor = (complexity) => {
    switch (complexity.toLowerCase()) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getRiskColor = (risk) => {
    switch (risk.toLowerCase()) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
        Surgical Procedures Guide
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Comprehensive surgical procedures with video guides and detailed instructions
      </Typography>

      {/* Specialty Selection */}
      <Card sx={{ mb: 4, boxShadow: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
            Select Medical Specialty
          </Typography>
          <FormControl fullWidth>
            <InputLabel>Specialty</InputLabel>
            <Select
              value={selectedSpecialty}
              label="Specialty"
              onChange={(e) => setSelectedSpecialty(e.target.value)}
            >
              {specialties.map((specialty) => (
                <MenuItem key={specialty.value} value={specialty.value}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {specialty.icon}
                    <Typography sx={{ ml: 1 }}>{specialty.label}</Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </CardContent>
      </Card>

      {/* Procedures Grid */}
      <Grid container spacing={3}>
        {procedures[selectedSpecialty]?.map((procedure) => (
          <Grid item xs={12} md={6} lg={4} key={procedure.id}>
            <Card sx={{ height: '100%', boxShadow: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  {procedure.name}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {procedure.description}
                </Typography>

                <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                  <Chip 
                    label={`Duration: ${procedure.duration}`} 
                    size="small" 
                    color="primary" 
                  />
                  <Chip 
                    label={`Complexity: ${procedure.complexity}`} 
                    size="small" 
                    color={getComplexityColor(procedure.complexity)} 
                  />
                  <Chip 
                    label={`Risk: ${procedure.risk}`} 
                    size="small" 
                    color={getRiskColor(procedure.risk)} 
                  />
                </Box>

                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<PlayArrow />}
                  onClick={() => handleProcedureSelect(procedure)}
                  sx={{ mb: 2 }}
                >
                  Watch Procedure Video
                </Button>

                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Description />}
                  onClick={() => handleProcedureSelect(procedure)}
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Video Dialog */}
      <Dialog
        open={openVideoDialog}
        onClose={() => setOpenVideoDialog(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {selectedProcedure?.name}
            </Typography>
            <IconButton onClick={() => setOpenVideoDialog(false)}>
              <FullscreenExit />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedProcedure && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Card sx={{ boxShadow: 2 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                      Surgical Video Guide
                    </Typography>
                    <Box sx={{ position: 'relative', width: '100%', height: 400, bgcolor: 'black', borderRadius: 1 }}>
                      <iframe
                        width="100%"
                        height="100%"
                        src={selectedProcedure.videoUrl}
                        title={selectedProcedure.name}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        style={{ borderRadius: '4px' }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Card sx={{ boxShadow: 2, mb: 2 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                      Procedure Details
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemIcon>
                          <Timeline />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Duration" 
                          secondary={selectedProcedure.duration} 
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <Build />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Complexity" 
                          secondary={selectedProcedure.complexity} 
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <Warning />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Risk Level" 
                          secondary={selectedProcedure.risk} 
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>

                <Card sx={{ boxShadow: 2, mb: 2 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                      Surgical Steps
                    </Typography>
                    <List dense>
                      {selectedProcedure.steps.map((step, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <Avatar sx={{ width: 24, height: 24, fontSize: 12 }}>
                              {index + 1}
                            </Avatar>
                          </ListItemIcon>
                          <ListItemText primary={step} />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>

                <Card sx={{ boxShadow: 2, mb: 2 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                      Required Equipment
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {selectedProcedure.equipment.map((item, index) => (
                        <Chip key={index} label={item} size="small" variant="outlined" />
                      ))}
                    </Box>
                  </CardContent>
                </Card>

                <Card sx={{ boxShadow: 2 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                      Surgical Team
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {selectedProcedure.team.map((member, index) => (
                        <Chip key={index} label={member} size="small" color="primary" />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenVideoDialog(false)}>Close</Button>
          <Button variant="contained" startIcon={<Description />}>
            Download Guide
          </Button>
        </DialogActions>
      </Dialog>

      {/* Additional Features */}
      <Grid container spacing={3} sx={{ mt: 4 }}>
        <Grid item xs={12} md={6}>
          <Card sx={{ boxShadow: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                AI-Powered Surgical Assistance
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <LocalHospital color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Real-time Guidance" 
                    secondary="AI provides step-by-step guidance during procedures" 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Assessment color="secondary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Risk Assessment" 
                    secondary="AI analyzes patient data to assess surgical risks" 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <People color="success" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Team Coordination" 
                    secondary="AI helps coordinate surgical team activities" 
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ boxShadow: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Training & Certification
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <VideoCall color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Virtual Reality Training" 
                    secondary="Immersive VR surgical training simulations" 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Security color="secondary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Certification Tracking" 
                    secondary="Track surgical certifications and requirements" 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Schedule color="success" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Continuing Education" 
                    secondary="Access to latest surgical techniques and research" 
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SurgicalGuide;
