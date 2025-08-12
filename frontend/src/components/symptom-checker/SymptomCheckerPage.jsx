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
  LinearProgress
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
  TrendingUp
} from '@mui/icons-material';

const SymptomCheckerPage = () => {
  const [symptoms, setSymptoms] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const commonSymptoms = [
    'Headache', 'Fever', 'Cough', 'Fatigue', 'Nausea', 'Dizziness',
    'Chest Pain', 'Shortness of Breath', 'Joint Pain', 'Abdominal Pain',
    'Rash', 'Swelling', 'Loss of Appetite', 'Insomnia', 'Anxiety', 'Depression',
    'Back Pain', 'Neck Pain', 'Sore Throat', 'Runny Nose', 'Sneezing',
    'Muscle Pain', 'Stiffness', 'Tingling', 'Numbness', 'Vision Problems'
  ];

  const handleSymptomToggle = (symptom) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptom) 
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const analyzeSymptoms = () => {
    if (!symptoms.trim() && selectedSymptoms.length === 0) {
      return;
    }

    setIsAnalyzing(true);

    // Simulate AI analysis
    setTimeout(() => {
      const allSymptoms = [...selectedSymptoms, ...symptoms.split(',').map(s => s.trim()).filter(s => s)];
      
      // AI analysis logic based on symptoms
      const analysis = performAIAnalysis(allSymptoms);
      setAnalysisResult(analysis);
      setIsAnalyzing(false);
    }, 2000);
  };

  const performAIAnalysis = (symptoms) => {
    const symptomSet = new Set(symptoms.map(s => s.toLowerCase()));
    
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
          'Monitor symptoms for worsening'
        ],
        suggestedActions: [
          'Schedule a follow-up if symptoms persist beyond 10 days',
          'Seek immediate care if breathing becomes difficult',
          'Consider COVID-19 testing if exposed'
        ],
        severity: 'moderate'
      };
    }

    // Migraine
    if (symptomSet.has('headache') && (symptomSet.has('nausea') || symptomSet.has('dizziness'))) {
      return {
        urgency: 'LOW',
        confidence: 78,
        diagnosis: 'Migraine Headache',
        summary: 'Your symptoms suggest a migraine headache. Migraines are neurological conditions that can be triggered by various factors.',
        recommendations: [
          'Rest in a quiet, dark room',
          'Stay hydrated',
          'Avoid bright lights and loud noises',
          'Consider over-the-counter pain relievers'
        ],
        suggestedActions: [
          'Keep a headache diary to identify triggers',
          'Consult a neurologist if migraines are frequent',
          'Consider preventive medications if needed'
        ],
        severity: 'mild'
      };
    }

    // Anxiety/Stress
    if (symptomSet.has('anxiety') || symptomSet.has('insomnia') || symptomSet.has('depression')) {
      return {
        urgency: 'LOW',
        confidence: 82,
        diagnosis: 'Anxiety or Stress-Related Symptoms',
        summary: 'Your symptoms may be related to anxiety, stress, or mood disorders. These are common and treatable conditions.',
        recommendations: [
          'Practice stress-reduction techniques',
          'Maintain regular sleep schedule',
          'Consider counseling or therapy',
          'Exercise regularly'
        ],
        suggestedActions: [
          'Schedule an appointment with a mental health professional',
          'Consider mindfulness or meditation practices',
          'Discuss medication options with your doctor'
        ],
        severity: 'mild'
      };
    }

    // Chest pain - urgent
    if (symptomSet.has('chest pain') || symptomSet.has('shortness of breath')) {
      return {
        urgency: 'HIGH',
        confidence: 90,
        diagnosis: 'Cardiac Symptoms - Requires Immediate Evaluation',
        summary: 'Chest pain and shortness of breath are serious symptoms that require immediate medical attention.',
        recommendations: [
          'Call emergency services immediately',
          'Do not drive yourself to the hospital',
          'Stay calm and rest while waiting for help'
        ],
        suggestedActions: [
          'Emergency room evaluation required',
          'Cardiac workup may be necessary',
          'Follow up with cardiologist'
        ],
        severity: 'critical'
      };
    }

    // Gastrointestinal
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
          'Monitor for signs of dehydration'
        ],
        suggestedActions: [
          'Seek care if symptoms persist beyond 48 hours',
          'Contact doctor if severe abdominal pain develops',
          'Consider anti-nausea medications'
        ],
        severity: 'moderate'
      };
    }

    // General viral illness
    if (symptomSet.has('fever') && symptomSet.has('fatigue')) {
      return {
        urgency: 'LOW',
        confidence: 70,
        diagnosis: 'Viral Illness',
        summary: 'Your symptoms suggest a common viral illness. Most viral infections resolve on their own with supportive care.',
        recommendations: [
          'Rest and stay hydrated',
          'Use fever-reducing medications as needed',
          'Monitor temperature',
          'Isolate if COVID-19 is suspected'
        ],
        suggestedActions: [
          'Seek care if fever persists beyond 3 days',
          'Consider COVID-19 testing',
          'Contact doctor if symptoms worsen'
        ],
        severity: 'mild'
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
        'Keep a symptom diary',
        'Monitor for new or worsening symptoms'
      ],
      suggestedActions: [
        'Primary care consultation recommended',
        'Consider specialist referral based on symptoms',
        'Follow up if symptoms persist'
      ],
      severity: 'mild'
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
        AI Symptom Checker
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Describe your symptoms and receive AI-powered analysis and recommendations
      </Typography>

      <Grid container spacing={4}>
        {/* Input Section */}
        <Grid item xs={12} md={6}>
          <Card sx={{ boxShadow: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Select Your Symptoms
              </Typography>
              
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Describe your symptoms in detail"
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                sx={{ mb: 3 }}
                placeholder="Describe your symptoms, when they started, and any other relevant details..."
              />

              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Common Symptoms (select all that apply)
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                {commonSymptoms.map((symptom) => (
                  <Chip
                    key={symptom}
                    label={symptom}
                    onClick={() => handleSymptomToggle(symptom)}
                    color={selectedSymptoms.includes(symptom) ? 'primary' : 'default'}
                    variant={selectedSymptoms.includes(symptom) ? 'filled' : 'outlined'}
                    sx={{ cursor: 'pointer' }}
                  />
                ))}
              </Box>

              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={analyzeSymptoms}
                disabled={isAnalyzing || (!symptoms.trim() && selectedSymptoms.length === 0)}
                startIcon={<Psychology />}
                sx={{ py: 1.5 }}
              >
                {isAnalyzing ? 'Analyzing...' : 'ANALYZE SYMPTOMS'}
              </Button>

              {isAnalyzing && (
                <Box sx={{ mt: 2 }}>
                  <LinearProgress />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    AI is analyzing your symptoms...
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
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

                  <Accordion>
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
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Psychology sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
                  <Typography variant="body1" color="text.secondary">
                    Enter your symptoms to get AI analysis
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

export default SymptomCheckerPage; 