import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Grid,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Slider,
  Rating,
  Divider,
  IconButton,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  LocalPharmacy as PharmacyIcon,
  AttachMoney as MoneyIcon,
  Security as SecurityIcon,
  Science as ScienceIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Send as SendIcon
} from '@mui/icons-material';

const MedicationRecommendation = ({ patientId, doctorId, appointmentId, onPrescriptionCreated }) => {
  const [symptoms, setSymptoms] = useState([]);
  const [currentSymptom, setCurrentSymptom] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [diagnosisCode, setDiagnosisCode] = useState('');
  const [allergies, setAllergies] = useState([]);
  const [currentAllergy, setCurrentAllergy] = useState('');
  const [currentMedications, setCurrentMedications] = useState([]);
  const [currentMedication, setCurrentMedication] = useState('');
  const [ageGroup, setAgeGroup] = useState('ADULT');
  const [isPregnant, setIsPregnant] = useState(false);
  const [isBreastfeeding, setIsBreastfeeding] = useState(false);
  const [hasRenalImpairment, setIsRenalImpairment] = useState(false);
  const [hasHepaticImpairment, setIsHepaticImpairment] = useState(false);
  const [maxBudget, setMaxBudget] = useState(100);
  const [preferGeneric, setPreferGeneric] = useState(true);
  const [urgencyLevel, setUrgencyLevel] = useState('ROUTINE');
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedRecommendation, setSelectedRecommendation] = useState(null);
  const [prescriptionDialogOpen, setPrescriptionDialogOpen] = useState(false);
  const [prescriptionForm, setPrescriptionForm] = useState({
    dosageStrength: '',
    dosageForm: '',
    frequency: '',
    quantity: 30,
    daysSupply: 30,
    instructions: '',
    genericSubstitutionAllowed: true
  });

  const commonSymptoms = [
    'Fever', 'Cough', 'Headache', 'Nausea', 'Vomiting', 'Diarrhea', 'Constipation',
    'Fatigue', 'Insomnia', 'Anxiety', 'Depression', 'Pain', 'Inflammation',
    'High Blood Pressure', 'Diabetes', 'Asthma', 'Allergies', 'Rash', 'Itching'
  ];

  const commonAllergies = [
    'Penicillin', 'Sulfa', 'Aspirin', 'Ibuprofen', 'Codeine', 'Morphine',
    'Latex', 'Peanuts', 'Shellfish', 'Eggs', 'Milk', 'Soy', 'Wheat'
  ];

  const addSymptom = () => {
    if (currentSymptom && !symptoms.includes(currentSymptom)) {
      setSymptoms([...symptoms, currentSymptom]);
      setCurrentSymptom('');
    }
  };

  const removeSymptom = (symptom) => {
    setSymptoms(symptoms.filter(s => s !== symptom));
  };

  const addAllergy = () => {
    if (currentAllergy && !allergies.includes(currentAllergy)) {
      setAllergies([...allergies, currentAllergy]);
      setCurrentAllergy('');
    }
  };

  const removeAllergy = (allergy) => {
    setAllergies(allergies.filter(a => a !== allergy));
  };

  const addCurrentMedication = () => {
    if (currentMedication && !currentMedications.includes(currentMedication)) {
      setCurrentMedications([...currentMedications, currentMedication]);
      setCurrentMedication('');
    }
  };

  const removeCurrentMedication = (medication) => {
    setCurrentMedications(currentMedications.filter(m => m !== medication));
  };

  const getRecommendations = async () => {
    if (symptoms.length === 0) {
      setError('Please add at least one symptom');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const request = {
        symptoms,
        diagnosis,
        diagnosisCode,
        patientId,
        doctorId,
        appointmentId,
        allergies,
        currentMedications,
        ageGroup,
        isPregnant,
        isBreastfeeding,
        hasRenalImpairment,
        hasHepaticImpairment,
        maxBudget: maxBudget * 100, // Convert to cents
        preferGeneric,
        urgencyLevel
      };

      const response = await fetch('/api/medications/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (response.ok) {
        const data = await response.json();
        setRecommendations(data);
      } else {
        setError('Failed to get recommendations');
      }
    } catch (err) {
      setError('Failed to get recommendations');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createPrescription = async () => {
    if (!selectedRecommendation) return;

    setLoading(true);
    try {
      const response = await fetch('/api/medications/recommendations/prescription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recommendation: selectedRecommendation,
          patientId,
          doctorId,
          appointmentId
        }),
      });

      if (response.ok) {
        const prescription = await response.json();
        setPrescriptionDialogOpen(false);
        setSelectedRecommendation(null);
        if (onPrescriptionCreated) {
          onPrescriptionCreated(prescription);
        }
      } else {
        setError('Failed to create prescription');
      }
    } catch (err) {
      setError('Failed to create prescription');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 0.8) return 'success';
    if (score >= 0.6) return 'warning';
    return 'error';
  };

  const getScoreIcon = (score) => {
    if (score >= 0.8) return <CheckCircleIcon />;
    if (score >= 0.6) return <WarningIcon />;
    return <ErrorIcon />;
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'EMERGENCY': return 'error';
      case 'STAT': return 'warning';
      case 'URGENT': return 'info';
      default: return 'default';
    }
  };

  const renderRecommendationCard = (recommendation, index) => (
    <Card key={index} sx={{ mb: 2, border: selectedRecommendation === recommendation ? 2 : 1, borderColor: selectedRecommendation === recommendation ? 'primary.main' : 'divider' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="h6" gutterBottom>
              {recommendation.medication.brandName || recommendation.medication.genericName}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {recommendation.medication.genericName}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {recommendation.medication.drugClass} • {recommendation.medication.therapeuticCategory}
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Chip
              label={`Score: ${(recommendation.overallScore * 100).toFixed(0)}%`}
              color={getScoreColor(recommendation.overallScore)}
              icon={getScoreIcon(recommendation.overallScore)}
              size="small"
            />
            {recommendation.medication.controlledSubstance && (
              <Chip label="Controlled" color="warning" size="small" sx={{ ml: 1 }} />
            )}
          </Box>
        </Box>

        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <ScienceIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="body2">Clinical: {(recommendation.clinicalScore * 100).toFixed(0)}%</Typography>
            </Box>
            <Chip
              label={recommendation.clinicalScore >= 0.8 ? 'Excellent' : recommendation.clinicalScore >= 0.6 ? 'Good' : 'Moderate'}
              color={getScoreColor(recommendation.clinicalScore)}
              size="small"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <MoneyIcon sx={{ mr: 1, color: 'success.main' }} />
              <Typography variant="body2">Cost: {(recommendation.costScore * 100).toFixed(0)}%</Typography>
            </Box>
            <Chip
              label={recommendation.costScore >= 0.8 ? 'Very Cost-Effective' : recommendation.costScore >= 0.6 ? 'Cost-Effective' : 'Higher Cost'}
              color={getScoreColor(recommendation.costScore)}
              size="small"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <SecurityIcon sx={{ mr: 1, color: 'info.main' }} />
              <Typography variant="body2">Safety: {(recommendation.safetyScore * 100).toFixed(0)}%</Typography>
            </Box>
            <Chip
              label={recommendation.safetyScore >= 0.9 ? 'Excellent' : recommendation.safetyScore >= 0.7 ? 'Good' : 'Monitor'}
              color={getScoreColor(recommendation.safetyScore)}
              size="small"
            />
          </Grid>
        </Grid>

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="textSecondary">
            <strong>Reasoning:</strong> {recommendation.reasoning}
          </Typography>
        </Box>

        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="textSecondary">
              <strong>Estimated Cost:</strong> ${recommendation.estimatedCost?.toFixed(2) || 'N/A'}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              <strong>Insurance:</strong> {recommendation.insuranceCoverage}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              <strong>Evidence Level:</strong> {recommendation.evidenceLevel}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="textSecondary">
              <strong>Dosage Forms:</strong> {recommendation.medication.dosageForms}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              <strong>Typical Dosage:</strong> {recommendation.medication.typicalDosage}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              <strong>Duration:</strong> {recommendation.medication.durationOfTreatment}
            </Typography>
          </Grid>
        </Grid>

        {recommendation.warnings.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="error" sx={{ fontWeight: 'bold', mb: 1 }}>
              Warnings:
            </Typography>
            {recommendation.warnings.map((warning, idx) => (
              <Chip key={idx} label={warning} color="error" size="small" sx={{ mr: 1, mb: 1 }} />
            ))}
          </Box>
        )}

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => setSelectedRecommendation(recommendation)}
          >
            Select
          </Button>
          <Button
            variant="outlined"
            size="small"
            startIcon={<ViewIcon />}
          >
            Details
          </Button>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ p: 2 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Typography variant="h5" gutterBottom>
        Medication Recommendations
      </Typography>

      <Grid container spacing={3}>
        {/* Symptoms Section */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Symptoms
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <TextField
                  fullWidth
                  label="Add Symptom"
                  value={currentSymptom}
                  onChange={(e) => setCurrentSymptom(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addSymptom()}
                />
                <Button variant="contained" onClick={addSymptom}>
                  <AddIcon />
                </Button>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {symptoms.map((symptom, index) => (
                  <Chip
                    key={index}
                    label={symptom}
                    onDelete={() => removeSymptom(symptom)}
                    color="primary"
                  />
                ))}
              </Box>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Common Symptoms:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {commonSymptoms.slice(0, 10).map((symptom) => (
                  <Chip
                    key={symptom}
                    label={symptom}
                    variant="outlined"
                    size="small"
                    onClick={() => !symptoms.includes(symptom) && setSymptoms([...symptoms, symptom])}
                  />
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Patient Factors Section */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Patient Factors
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Diagnosis"
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Diagnosis Code (ICD-10)"
                    value={diagnosisCode}
                    onChange={(e) => setDiagnosisCode(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Age Group</InputLabel>
                    <Select value={ageGroup} onChange={(e) => setAgeGroup(e.target.value)}>
                      <MenuItem value="PEDIATRIC">Pediatric</MenuItem>
                      <MenuItem value="ADULT">Adult</MenuItem>
                      <MenuItem value="GERIATRIC">Geriatric</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={<Checkbox checked={isPregnant} onChange={(e) => setIsPregnant(e.target.checked)} />}
                    label="Pregnant"
                  />
                  <FormControlLabel
                    control={<Checkbox checked={isBreastfeeding} onChange={(e) => setIsBreastfeeding(e.target.checked)} />}
                    label="Breastfeeding"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={<Checkbox checked={hasRenalImpairment} onChange={(e) => setIsRenalImpairment(e.target.checked)} />}
                    label="Renal Impairment"
                  />
                  <FormControlLabel
                    control={<Checkbox checked={hasHepaticImpairment} onChange={(e) => setIsHepaticImpairment(e.target.checked)} />}
                    label="Hepatic Impairment"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Allergies Section */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Allergies
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <TextField
                  fullWidth
                  label="Add Allergy"
                  value={currentAllergy}
                  onChange={(e) => setCurrentAllergy(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addAllergy()}
                />
                <Button variant="contained" onClick={addAllergy}>
                  <AddIcon />
                </Button>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {allergies.map((allergy, index) => (
                  <Chip
                    key={index}
                    label={allergy}
                    onDelete={() => removeAllergy(allergy)}
                    color="error"
                  />
                ))}
              </Box>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Common Allergies:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {commonAllergies.slice(0, 8).map((allergy) => (
                  <Chip
                    key={allergy}
                    label={allergy}
                    variant="outlined"
                    size="small"
                    color="error"
                    onClick={() => !allergies.includes(allergy) && setAllergies([...allergies, allergy])}
                  />
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Current Medications Section */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Current Medications
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <TextField
                  fullWidth
                  label="Add Current Medication"
                  value={currentMedication}
                  onChange={(e) => setCurrentMedication(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addCurrentMedication()}
                />
                <Button variant="contained" onClick={addCurrentMedication}>
                  <AddIcon />
                </Button>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {currentMedications.map((medication, index) => (
                  <Chip
                    key={index}
                    label={medication}
                    onDelete={() => removeCurrentMedication(medication)}
                    color="info"
                  />
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Preferences Section */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Preferences & Constraints
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" gutterBottom>
                    Max Budget: ${maxBudget}
                  </Typography>
                  <Slider
                    value={maxBudget}
                    onChange={(e, value) => setMaxBudget(value)}
                    min={10}
                    max={500}
                    step={10}
                    marks
                    valueLabelDisplay="auto"
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControlLabel
                    control={<Checkbox checked={preferGeneric} onChange={(e) => setPreferGeneric(e.target.checked)} />}
                    label="Prefer Generic"
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <InputLabel>Urgency Level</InputLabel>
                    <Select value={urgencyLevel} onChange={(e) => setUrgencyLevel(e.target.value)}>
                      <MenuItem value="ROUTINE">Routine</MenuItem>
                      <MenuItem value="URGENT">Urgent</MenuItem>
                      <MenuItem value="STAT">Stat</MenuItem>
                      <MenuItem value="EMERGENCY">Emergency</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Button
          variant="contained"
          size="large"
          onClick={getRecommendations}
          disabled={loading || symptoms.length === 0}
          startIcon={loading ? <CircularProgress size={20} /> : <PharmacyIcon />}
        >
          {loading ? 'Getting Recommendations...' : 'Get Medication Recommendations'}
        </Button>
      </Box>

      {/* Recommendations Section */}
      {recommendations.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Recommendations ({recommendations.length})
          </Typography>
          {recommendations.map((recommendation, index) => renderRecommendationCard(recommendation, index))}
        </Box>
      )}

      {/* Prescription Dialog */}
      <Dialog open={prescriptionDialogOpen} onClose={() => setPrescriptionDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create Prescription</DialogTitle>
        <DialogContent>
          {selectedRecommendation && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  {selectedRecommendation.medication.brandName || selectedRecommendation.medication.genericName}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Dosage Strength"
                  value={prescriptionForm.dosageStrength}
                  onChange={(e) => setPrescriptionForm({...prescriptionForm, dosageStrength: e.target.value})}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Dosage Form"
                  value={prescriptionForm.dosageForm}
                  onChange={(e) => setPrescriptionForm({...prescriptionForm, dosageForm: e.target.value})}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Frequency"
                  value={prescriptionForm.frequency}
                  onChange={(e) => setPrescriptionForm({...prescriptionForm, frequency: e.target.value})}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Quantity"
                  type="number"
                  value={prescriptionForm.quantity}
                  onChange={(e) => setPrescriptionForm({...prescriptionForm, quantity: parseInt(e.target.value)})}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Days Supply"
                  type="number"
                  value={prescriptionForm.daysSupply}
                  onChange={(e) => setPrescriptionForm({...prescriptionForm, daysSupply: parseInt(e.target.value)})}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={<Checkbox checked={prescriptionForm.genericSubstitutionAllowed} onChange={(e) => setPrescriptionForm({...prescriptionForm, genericSubstitutionAllowed: e.target.checked})} />}
                  label="Allow Generic Substitution"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Instructions"
                  value={prescriptionForm.instructions}
                  onChange={(e) => setPrescriptionForm({...prescriptionForm, instructions: e.target.value})}
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPrescriptionDialogOpen(false)}>Cancel</Button>
          <Button onClick={createPrescription} variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={20} /> : 'Create Prescription'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MedicationRecommendation; 