import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Chip,
  LinearProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  Upload as UploadIcon,
  PlayArrow as PlayIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  ExpandMore as ExpandMoreIcon,
  Info as InfoIcon,
  Security as SecurityIcon,
  Timeline as TimelineIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { aiService } from '../../services/aiService';

const AITrainingSandbox = () => {
  const { user } = useAuth();
  const [datasets, setDatasets] = useState([]);
  const [trainings, setTrainings] = useState([]);
  const [uploadDialog, setUploadDialog] = useState(false);
  const [trainingDialog, setTrainingDialog] = useState(false);
  const [selectedDataset, setSelectedDataset] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Upload form state
  const [uploadForm, setUploadForm] = useState({
    datasetName: '',
    targetColumn: '',
    description: '',
    dataFile: null
  });

  // Training form state
  const [trainingForm, setTrainingForm] = useState({
    modelType: 'classification',
    architecture: 'transformer',
    epochs: 100,
    batchSize: 32,
    learningRate: 0.001,
    federatedLearning: false,
    privacyLevel: 'high'
  });

  useEffect(() => {
    loadDatasets();
    loadTrainings();
  }, []);

  const loadDatasets = async () => {
    try {
      setLoading(true);
      const response = await aiService.getDatasets(user.clinicId);
      setDatasets(response.data || []);
    } catch (err) {
      setError('Failed to load datasets');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadTrainings = async () => {
    try {
      const response = await aiService.getTrainings(user.clinicId);
      setTrainings(response.data || []);
    } catch (err) {
      console.error('Failed to load trainings:', err);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadForm(prev => ({ ...prev, dataFile: file }));
    }
  };

  const handleUploadSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      const formData = new FormData();
      formData.append('clinicId', user.clinicId);
      formData.append('datasetName', uploadForm.datasetName);
      formData.append('targetColumn', uploadForm.targetColumn);
      formData.append('description', uploadForm.description);
      formData.append('dataFile', uploadForm.dataFile);

      const response = await aiService.uploadDataset(formData);
      
      setSuccess('Dataset uploaded successfully!');
      setUploadDialog(false);
      setUploadForm({
        datasetName: '',
        targetColumn: '',
        description: '',
        dataFile: null
      });
      
      loadDatasets();
    } catch (err) {
      setError('Failed to upload dataset');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTrainingSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      const trainingData = {
        clinicId: user.clinicId,
        datasetName: selectedDataset.name,
        config: trainingForm
      };

      const response = await aiService.startTraining(trainingData);
      
      setSuccess('Training started successfully!');
      setTrainingDialog(false);
      setTrainingForm({
        modelType: 'classification',
        architecture: 'transformer',
        epochs: 100,
        batchSize: 32,
        learningRate: 0.001,
        federatedLearning: false,
        privacyLevel: 'high'
      });
      
      loadTrainings();
    } catch (err) {
      setError('Failed to start training');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getTrainingStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'training': return 'warning';
      case 'failed': return 'error';
      default: return 'default';
    }
  };

  const getTrainingStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckIcon />;
      case 'training': return <TimelineIcon />;
      case 'failed': return <ErrorIcon />;
      default: return <InfoIcon />;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        AI Training Sandbox
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Upload anonymized data and train custom AI models with federated learning support
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Datasets Section */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Datasets</Typography>
                <Button
                  variant="contained"
                  startIcon={<UploadIcon />}
                  onClick={() => setUploadDialog(true)}
                >
                  Upload Dataset
                </Button>
              </Box>

              {loading ? (
                <LinearProgress />
              ) : datasets.length === 0 ? (
                <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
                  No datasets uploaded yet
                </Typography>
              ) : (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Records</TableCell>
                        <TableCell>Quality Score</TableCell>
                        <TableCell>Upload Date</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {datasets.map((dataset) => (
                        <TableRow key={dataset.dataset_name}>
                          <TableCell>{dataset.dataset_name}</TableCell>
                          <TableCell>{dataset.record_count}</TableCell>
                          <TableCell>
                            <Chip
                              label={`${(dataset.data_quality_score * 100).toFixed(1)}%`}
                              color={dataset.data_quality_score > 0.8 ? 'success' : 'warning'}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            {new Date(dataset.upload_date).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Button
                              size="small"
                              onClick={() => {
                                setSelectedDataset(dataset);
                                setTrainingDialog(true);
                              }}
                            >
                              Train Model
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Trainings Section */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Active Trainings
              </Typography>

              {trainings.length === 0 ? (
                <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
                  No active trainings
                </Typography>
              ) : (
                <Box>
                  {trainings.map((training) => (
                    <Accordion key={training.training_id} sx={{ mb: 1 }}>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                          <Chip
                            icon={getTrainingStatusIcon(training.status)}
                            label={training.status}
                            color={getTrainingStatusColor(training.status)}
                            sx={{ mr: 2 }}
                          />
                          <Typography variant="subtitle1">
                            {training.dataset_name} - {training.model_type}
                          </Typography>
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">
                              Training ID: {training.training_id}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Architecture: {training.architecture}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Federated Learning: {training.federated_learning ? 'Yes' : 'No'}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">
                              Started: {new Date(training.start_time).toLocaleString()}
                            </Typography>
                            {training.end_time && (
                              <Typography variant="body2" color="text.secondary">
                                Completed: {new Date(training.end_time).toLocaleString()}
                              </Typography>
                            )}
                            {training.results && (
                              <Typography variant="body2" color="text.secondary">
                                Final Accuracy: {(training.results.final_accuracy * 100).toFixed(1)}%
                              </Typography>
                            )}
                          </Grid>
                        </Grid>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Federated Learning Status */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Federated Learning Status
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <SecurityIcon sx={{ mr: 1 }} />
                <Typography variant="body2">
                  Participating Clinics: {trainings.filter(t => t.federated_learning).length}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <TimelineIcon sx={{ mr: 1 }} />
                <Typography variant="body2">
                  Aggregation Rounds: {trainings.filter(t => t.federated_learning).length}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <InfoIcon sx={{ mr: 1 }} />
                <Typography variant="body2">
                  Global Model: Available
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Upload Dataset Dialog */}
      <Dialog open={uploadDialog} onClose={() => setUploadDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Upload Anonymized Dataset</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Dataset Name"
                value={uploadForm.datasetName}
                onChange={(e) => setUploadForm(prev => ({ ...prev, datasetName: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Target Column"
                value={uploadForm.targetColumn}
                onChange={(e) => setUploadForm(prev => ({ ...prev, targetColumn: e.target.value }))}
                helperText="Column name for the target variable (e.g., 'diagnosis')"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                value={uploadForm.description}
                onChange={(e) => setUploadForm(prev => ({ ...prev, description: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="outlined"
                component="label"
                startIcon={<UploadIcon />}
                fullWidth
              >
                Choose CSV/JSON File
                <input
                  type="file"
                  hidden
                  accept=".csv,.json"
                  onChange={handleFileUpload}
                />
              </Button>
              {uploadForm.dataFile && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Selected: {uploadForm.dataFile.name}
                </Typography>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUploadDialog(false)}>Cancel</Button>
          <Button
            onClick={handleUploadSubmit}
            variant="contained"
            disabled={!uploadForm.datasetName || !uploadForm.targetColumn || !uploadForm.dataFile}
          >
            Upload Dataset
          </Button>
        </DialogActions>
      </Dialog>

      {/* Start Training Dialog */}
      <Dialog open={trainingDialog} onClose={() => setTrainingDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Start Model Training</DialogTitle>
        <DialogContent>
          {selectedDataset && (
            <Alert severity="info" sx={{ mb: 2 }}>
              Training on dataset: {selectedDataset.dataset_name} ({selectedDataset.record_count} records)
            </Alert>
          )}
          
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Model Type</InputLabel>
                <Select
                  value={trainingForm.modelType}
                  onChange={(e) => setTrainingForm(prev => ({ ...prev, modelType: e.target.value }))}
                >
                  <MenuItem value="classification">Classification</MenuItem>
                  <MenuItem value="regression">Regression</MenuItem>
                  <MenuItem value="custom">Custom</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Architecture</InputLabel>
                <Select
                  value={trainingForm.architecture}
                  onChange={(e) => setTrainingForm(prev => ({ ...prev, architecture: e.target.value }))}
                >
                  <MenuItem value="transformer">Transformer</MenuItem>
                  <MenuItem value="cnn">CNN</MenuItem>
                  <MenuItem value="lstm">LSTM</MenuItem>
                  <MenuItem value="mlp">MLP</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="number"
                label="Epochs"
                value={trainingForm.epochs}
                onChange={(e) => setTrainingForm(prev => ({ ...prev, epochs: parseInt(e.target.value) }))}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="number"
                label="Batch Size"
                value={trainingForm.batchSize}
                onChange={(e) => setTrainingForm(prev => ({ ...prev, batchSize: parseInt(e.target.value) }))}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="number"
                label="Learning Rate"
                value={trainingForm.learningRate}
                onChange={(e) => setTrainingForm(prev => ({ ...prev, learningRate: parseFloat(e.target.value) }))}
                inputProps={{ step: 0.001 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Privacy Level</InputLabel>
                <Select
                  value={trainingForm.privacyLevel}
                  onChange={(e) => setTrainingForm(prev => ({ ...prev, privacyLevel: e.target.value }))}
                >
                  <MenuItem value="low">Low (Basic anonymization)</MenuItem>
                  <MenuItem value="medium">Medium (Enhanced privacy)</MenuItem>
                  <MenuItem value="high">High (Maximum privacy)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                <Tooltip title="Enable federated learning to collaborate with other clinics">
                  <Button
                    variant={trainingForm.federatedLearning ? "contained" : "outlined"}
                    onClick={() => setTrainingForm(prev => ({ 
                      ...prev, 
                      federatedLearning: !prev.federatedLearning 
                    }))}
                    startIcon={<SecurityIcon />}
                  >
                    Federated Learning
                  </Button>
                </Tooltip>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTrainingDialog(false)}>Cancel</Button>
          <Button
            onClick={handleTrainingSubmit}
            variant="contained"
            startIcon={<PlayIcon />}
            disabled={!selectedDataset}
          >
            Start Training
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AITrainingSandbox; 