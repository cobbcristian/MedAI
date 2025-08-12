import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Chip,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  LinearProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormLabel
} from '@mui/material';
import {
  Psychology,
  LocalHospital,
  Warning,
  CheckCircle,
  Info,
  ExpandMore,
  Medication,
  Schedule,
  TrendingUp,
  Description,
  Assessment,
  Upload,
  Send,
  Save,
  History
} from '@mui/icons-material';

const PatientReporting = () => {
  const [symptomDescription, setSymptomDescription] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [labWork, setLabWork] = useState({
    hasLabWork: false,
    labResults: '',
    labDate: '',
    labType: ''
  });
  const [medicalHistory, setMedicalHistory] = useState({
    currentMedications: '',
    allergies: '',
    chronicConditions: '',
    recentSurgeries: ''
  });
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const comprehensiveSymptoms = [
    // Physical Symptoms
    'Headache', 'Fever', 'Cough', 'Fatigue', 'Nausea', 'Dizziness',
    'Chest Pain', 'Shortness of Breath', 'Joint Pain', 'Abdominal Pain',
    'Rash', 'Swelling', 'Loss of Appetite', 'Insomnia', 'Anxiety', 'Depression',
    'Back Pain', 'Neck Pain', 'Sore Throat', 'Runny Nose', 'Sneezing',
    'Muscle Pain', 'Stiffness', 'Tingling', 'Numbness', 'Vision Problems',
    'Hearing Problems', 'Balance Issues', 'Tremors', 'Seizures',
    'Palpitations', 'Irregular Heartbeat', 'High Blood Pressure',
    'Low Blood Pressure', 'Edema', 'Weight Loss', 'Weight Gain',
    'Night Sweats', 'Hot Flashes', 'Cold Intolerance', 'Heat Intolerance',
    'Hair Loss', 'Skin Changes', 'Bruising', 'Bleeding', 'Constipation',
    'Diarrhea', 'Vomiting', 'Acid Reflux', 'Heartburn', 'Bloating',
    'Gas', 'Urinary Problems', 'Sexual Dysfunction', 'Menstrual Problems',
    'Erectile Dysfunction', 'Infertility', 'Pregnancy Symptoms',
    'Menopausal Symptoms', 'Memory Problems', 'Confusion', 'Mood Changes',
    'Irritability', 'Panic Attacks', 'Phobias', 'Obsessive Thoughts',
    'Compulsive Behaviors', 'Hallucinations', 'Delusions', 'Suicidal Thoughts'
  ];

  const labWorkTypes = [
    'Blood Test', 'Urine Test', 'Stool Test', 'X-Ray', 'CT Scan', 'MRI',
    'Ultrasound', 'EKG/ECG', 'Stress Test', 'Endoscopy', 'Colonoscopy',
    'Biopsy', 'Genetic Testing', 'Allergy Testing', 'Hormone Testing',
    'Tumor Markers', 'Inflammatory Markers', 'Autoimmune Testing',
    'Infectious Disease Testing', 'Drug Testing', 'Pregnancy Test',
    'Other'
  ];

  const handleSymptomToggle = (symptom) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptom) 
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const handleLabWorkChange = (field, value) => {
    setLabWork(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleMedicalHistoryChange = (field, value) => {
    setMedicalHistory(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const submitReport = () => {
    if (!symptomDescription.trim() && selectedSymptoms.length === 0) {
      return;
    }

    setIsAnalyzing(true);

    // Simulate AI analysis
    setTimeout(() => {
      const allSymptoms = [...selectedSymptoms, ...symptomDescription.split(',').map(s => s.trim()).filter(s => s)];
      
      // Comprehensive AI analysis
      const analysis = performComprehensiveAnalysis(allSymptoms, labWork, medicalHistory);
      setAnalysisResult(analysis);
      setIsAnalyzing(false);
    }, 3000);
  };

  const performComprehensiveAnalysis = (symptoms, labWork, medicalHistory) => {
    const symptomSet = new Set(symptoms.map(s => s.toLowerCase()));
    
    // Cardiac conditions
    if (symptomSet.has('chest pain') || symptomSet.has('shortness of breath') || symptomSet.has('palpitations')) {
      return {
        urgency: 'HIGH',
        confidence: 90,
        diagnosis: 'Cardiac Symptoms - Requires Immediate Evaluation',
        summary: 'Your symptoms suggest potential cardiac issues. Chest pain, shortness of breath, and palpitations require immediate medical attention.',
        recommendations: [
          'Call emergency services immediately',
          'Do not drive yourself to the hospital',
          'Stay calm and rest while waiting for help',
          'Bring any recent lab work to the emergency room'
        ],
        suggestedActions: [
          'Emergency room evaluation required',
          'Cardiac workup including EKG, troponin, and chest X-ray',
          'Follow up with cardiologist',
          'Consider stress test and echocardiogram'
        ],
        severity: 'critical',
        labWorkRecommendations: [
          'Troponin levels',
          'Complete blood count (CBC)',
          'Basic metabolic panel',
          'EKG/ECG',
          'Chest X-ray'
        ]
      };
    }

    // Neurological conditions
    if (symptomSet.has('seizures') || symptomSet.has('confusion') || symptomSet.has('memory problems')) {
      return {
        urgency: 'HIGH',
        confidence: 85,
        diagnosis: 'Neurological Symptoms - Requires Evaluation',
        summary: 'Your symptoms suggest potential neurological issues that require prompt medical evaluation.',
        recommendations: [
          'Seek immediate medical attention',
          'Do not drive if experiencing symptoms',
          'Bring someone with you to appointments',
          'Document all symptoms and their frequency'
        ],
        suggestedActions: [
          'Neurology consultation',
          'Brain imaging (MRI/CT)',
          'EEG if seizures suspected',
          'Comprehensive neurological exam'
        ],
        severity: 'critical',
        labWorkRecommendations: [
          'Complete blood count (CBC)',
          'Comprehensive metabolic panel',
          'Thyroid function tests',
          'Vitamin B12 and folate levels',
          'Brain MRI or CT scan'
        ]
      };
    }

    // Respiratory conditions
    if (symptomSet.has('cough') && symptomSet.has('fever') && symptomSet.has('sore throat')) {
      return {
        urgency: 'MEDIUM',
        confidence: 85,
        diagnosis: 'Upper Respiratory Infection (URI)',
        summary: 'Based on your symptoms, you likely have a viral upper respiratory infection. This is common and usually resolves on its own.',
        recommendations: [
          'Rest and stay hydrated',
          'Use over-the-counter pain relievers for fever',
          'Gargle with warm salt water for sore throat',
          'Monitor symptoms for worsening',
          'Consider COVID-19 testing'
        ],
        suggestedActions: [
          'Schedule a follow-up if symptoms persist beyond 10 days',
          'Seek immediate care if breathing becomes difficult',
          'Consider COVID-19 testing if exposed',
          'Monitor oxygen levels if available'
        ],
        severity: 'moderate',
        labWorkRecommendations: [
          'COVID-19 PCR test',
          'Rapid strep test',
          'Complete blood count (CBC)',
          'Chest X-ray if symptoms persist'
        ]
      };
    }

    // Mental health conditions
    if (symptomSet.has('anxiety') || symptomSet.has('depression') || symptomSet.has('suicidal thoughts')) {
      return {
        urgency: 'MEDIUM',
        confidence: 80,
        diagnosis: 'Mental Health Symptoms',
        summary: 'Your symptoms suggest mental health concerns that require professional evaluation and support.',
        recommendations: [
          'Contact a mental health professional immediately',
          'If having suicidal thoughts, call emergency services',
          'Practice stress-reduction techniques',
          'Maintain regular sleep schedule',
          'Consider medication evaluation'
        ],
        suggestedActions: [
          'Schedule appointment with psychiatrist or psychologist',
          'Consider therapy or counseling',
          'Discuss medication options with doctor',
          'Create safety plan if needed'
        ],
        severity: 'moderate',
        labWorkRecommendations: [
          'Thyroid function tests',
          'Vitamin D levels',
          'B12 and folate levels',
          'Complete blood count (CBC)',
          'Comprehensive metabolic panel'
        ]
      };
    }

    // Gastrointestinal conditions
    if (symptomSet.has('abdominal pain') && symptomSet.has('nausea')) {
      return {
        urgency: 'MEDIUM',
        confidence: 75,
        diagnosis: 'Gastroenteritis or Food Poisoning',
        summary: 'Your symptoms suggest a gastrointestinal issue, possibly viral gastroenteritis or food poisoning.',
        recommendations: [
          'Stay hydrated with clear fluids',
          'Rest and avoid solid foods initially',
          'Gradually reintroduce bland foods',
          'Monitor for signs of dehydration',
          'Practice good hand hygiene'
        ],
        suggestedActions: [
          'Seek care if symptoms persist beyond 48 hours',
          'Contact doctor if severe abdominal pain develops',
          'Consider anti-nausea medications',
          'Monitor for signs of appendicitis'
        ],
        severity: 'moderate',
        labWorkRecommendations: [
          'Complete blood count (CBC)',
          'Comprehensive metabolic panel',
          'Stool culture if persistent',
          'Abdominal imaging if severe pain'
        ]
      };
    }

    // Default analysis
    return {
      urgency: 'LOW',
      confidence: 65,
      diagnosis: 'General Symptoms - Further Evaluation Recommended',
      summary: 'Your symptoms require further evaluation by a healthcare provider for accurate diagnosis.',
      recommendations: [
        'Schedule an appointment with your primary care physician',
        'Keep a detailed symptom diary',
        'Monitor for new or worsening symptoms',
        'Bring all lab work to your appointment'
      ],
      suggestedActions: [
        'Primary care consultation recommended',
        'Consider specialist referral based on symptoms',
        'Follow up if symptoms persist',
        'Consider comprehensive lab workup'
      ],
      severity: 'mild',
      labWorkRecommendations: [
        'Complete blood count (CBC)',
        'Comprehensive metabolic panel',
        'Thyroid function tests',
        'Inflammatory markers',
        'Based on specific symptoms'
      ]
    };
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'HIGH': return 'error';
      case 'MEDIUM': return 'warning';
      case 'LOW': return 'success';
      default: return 'info';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical': return <Warning color="error" />;
      case 'moderate': return <Warning color="warning" />;
      case 'mild': return <CheckCircle color="success" />;
      default: return <Info color="info" />;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
        Comprehensive Patient Reporting
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Provide detailed information about your symptoms, lab work, and medical history for comprehensive AI analysis
      </Typography>

      <Grid container spacing={4}>
        {/* Input Section */}
        <Grid item xs={12} md={6}>
          <Card sx={{ boxShadow: 2, mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Symptom Description
              </Typography>
              
              <TextField
                fullWidth
                multiline
                rows={6}
                label="Describe your symptoms in detail"
                value={symptomDescription}
                onChange={(e) => setSymptomDescription(e.target.value)}
                sx={{ mb: 3 }}
                placeholder="Please describe your symptoms in detail, including when they started, how long they last, what makes them better or worse, and any other relevant information..."
              />

              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Select Symptoms (check all that apply)
              </Typography>
              <Box sx={{ maxHeight: 300, overflow: 'auto', mb: 3 }}>
                <Grid container spacing={1}>
                  {comprehensiveSymptoms.map((symptom) => (
                    <Grid item xs={6} key={symptom}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={selectedSymptoms.includes(symptom)}
                            onChange={() => handleSymptomToggle(symptom)}
                          />
                        }
                        label={symptom}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ boxShadow: 2, mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Lab Work Information
              </Typography>
              
              <FormControlLabel
                control={
                  <Checkbox
                    checked={labWork.hasLabWork}
                    onChange={(e) => handleLabWorkChange('hasLabWork', e.target.checked)}
                  />
                }
                label="I have recent lab work to include"
                sx={{ mb: 2 }}
              />

              {labWork.hasLabWork && (
                <Box>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Type of Lab Work</InputLabel>
                    <Select
                      value={labWork.labType}
                      label="Type of Lab Work"
                      onChange={(e) => handleLabWorkChange('labType', e.target.value)}
                    >
                      {labWorkTypes.map((type) => (
                        <MenuItem key={type} value={type}>{type}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <TextField
                    fullWidth
                    label="Date of Lab Work"
                    type="date"
                    value={labWork.labDate}
                    onChange={(e) => handleLabWorkChange('labDate', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    sx={{ mb: 2 }}
                  />

                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Lab Results Summary"
                    value={labWork.labResults}
                    onChange={(e) => handleLabWorkChange('labResults', e.target.value)}
                    placeholder="Please describe your lab results, including any abnormal values, normal ranges, and what your doctor said about the results..."
                  />
                </Box>
              )}
            </CardContent>
          </Card>

          <Card sx={{ boxShadow: 2, mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Medical History
              </Typography>
              
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Current Medications"
                value={medicalHistory.currentMedications}
                onChange={(e) => handleMedicalHistoryChange('currentMedications', e.target.value)}
                sx={{ mb: 2 }}
                placeholder="List all current medications, including dosages and how long you've been taking them..."
              />

              <TextField
                fullWidth
                multiline
                rows={2}
                label="Allergies"
                value={medicalHistory.allergies}
                onChange={(e) => handleMedicalHistoryChange('allergies', e.target.value)}
                sx={{ mb: 2 }}
                placeholder="List any known allergies to medications, foods, or environmental factors..."
              />

              <TextField
                fullWidth
                multiline
                rows={3}
                label="Chronic Conditions"
                value={medicalHistory.chronicConditions}
                onChange={(e) => handleMedicalHistoryChange('chronicConditions', e.target.value)}
                sx={{ mb: 2 }}
                placeholder="List any chronic medical conditions, when they were diagnosed, and how they're being managed..."
              />

              <TextField
                fullWidth
                multiline
                rows={2}
                label="Recent Surgeries or Procedures"
                value={medicalHistory.recentSurgeries}
                onChange={(e) => handleMedicalHistoryChange('recentSurgeries', e.target.value)}
                placeholder="List any recent surgeries, procedures, or hospitalizations..."
              />
            </CardContent>
          </Card>

          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={submitReport}
            disabled={isAnalyzing || (!symptomDescription.trim() && selectedSymptoms.length === 0)}
            startIcon={<Send />}
            sx={{ py: 1.5 }}
          >
            {isAnalyzing ? 'Analyzing...' : 'SUBMIT COMPREHENSIVE REPORT'}
          </Button>

          {isAnalyzing && (
            <Box sx={{ mt: 2 }}>
              <LinearProgress />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                AI is analyzing your comprehensive report...
              </Typography>
            </Box>
          )}
        </Grid>

        {/* Results Section */}
        <Grid item xs={12} md={6}>
          <Card sx={{ boxShadow: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                AI Analysis Results
              </Typography>

              {analysisResult ? (
                <Box>
                  <Alert 
                    severity={getUrgencyColor(analysisResult.urgency)} 
                    sx={{ mb: 3 }}
                    icon={getSeverityIcon(analysisResult.severity)}
                  >
                    <Typography variant="h6">
                      Urgency: {analysisResult.urgency}
                    </Typography>
                  </Alert>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Chip 
                      label={`Confidence: ${analysisResult.confidence}%`} 
                      color="primary" 
                      sx={{ mr: 2 }}
                    />
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {analysisResult.diagnosis}
                    </Typography>
                  </Box>

                  <Typography variant="body1" paragraph>
                    {analysisResult.summary}
                  </Typography>

                  <Accordion sx={{ mb: 2 }}>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        Recommendations
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <List dense>
                        {analysisResult.recommendations.map((rec, index) => (
                          <ListItem key={index}>
                            <ListItemIcon>
                              <CheckCircle color="success" />
                            </ListItemIcon>
                            <ListItemText primary={rec} />
                          </ListItem>
                        ))}
                      </List>
                    </AccordionDetails>
                  </Accordion>

                  <Accordion sx={{ mb: 2 }}>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        Suggested Actions
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <List dense>
                        {analysisResult.suggestedActions.map((action, index) => (
                          <ListItem key={index}>
                            <ListItemIcon>
                              <Schedule color="primary" />
                            </ListItemIcon>
                            <ListItemText primary={action} />
                          </ListItem>
                        ))}
                      </List>
                    </AccordionDetails>
                  </Accordion>

                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        Recommended Lab Work
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <List dense>
                        {analysisResult.labWorkRecommendations.map((lab, index) => (
                          <ListItem key={index}>
                            <ListItemIcon>
                              <Assessment color="secondary" />
                            </ListItemIcon>
                            <ListItemText primary={lab} />
                          </ListItem>
                        ))}
                      </List>
                    </AccordionDetails>
                  </Accordion>
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Description sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
                  <Typography variant="body1" color="text.secondary">
                    Submit your comprehensive report to get AI analysis
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Alert severity="info" sx={{ mt: 4 }}>
        <Typography variant="body2">
          <strong>Disclaimer:</strong> This AI analysis is for informational purposes only and should not replace professional medical advice. Always consult with a healthcare provider for proper diagnosis and treatment.
        </Typography>
      </Alert>
    </Container>
  );
};

export default PatientReporting;
