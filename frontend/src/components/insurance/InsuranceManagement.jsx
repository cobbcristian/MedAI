import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon
} from '@mui/icons-material';

const InsuranceManagement = ({ userRole, patientId }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [insuranceInfo, setInsuranceInfo] = useState([]);
  const [claims, setClaims] = useState([]);
  const [codeMappings, setCodeMappings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({});

  // Insurance Info Form
  const [insuranceForm, setInsuranceForm] = useState({
    providerName: '',
    payerId: '',
    memberId: '',
    groupNumber: '',
    subscriberFirstName: '',
    subscriberLastName: '',
    subscriberDob: '',
    relationshipToPatient: 'SELF',
    policyNumber: '',
    planType: 'PPO',
    copayAmount: '',
    deductibleAmount: '',
    coinsurancePercentage: '',
    isPrimary: true,
    effectiveDate: '',
    expirationDate: '',
    authorizationNumber: '',
    notes: ''
  });

  // Code Mapping Form
  const [codeMappingForm, setCodeMappingForm] = useState({
    appointmentType: '',
    aiDiagnosis: '',
    manualDiagnosis: '',
    cptCode: '',
    cptDescription: '',
    icd10Code: '',
    icd10Description: '',
    defaultBilledAmount: '',
    typicalAllowedAmount: '',
    modifier1: '',
    modifier2: '',
    modifier3: '',
    modifier4: '',
    placeOfService: '11',
    units: 1,
    priority: 1,
    notes: ''
  });

  useEffect(() => {
    loadData();
  }, [patientId]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (patientId) {
        const [insuranceResponse, claimsResponse] = await Promise.all([
          fetch(`/api/insurance/info/patient/${patientId}`),
          fetch(`/api/insurance/claims/patient/${patientId}`)
        ]);
        
        if (insuranceResponse.ok) {
          const insuranceData = await insuranceResponse.json();
          setInsuranceInfo(insuranceData);
        }
        
        if (claimsResponse.ok) {
          const claimsData = await claimsResponse.json();
          setClaims(claimsData);
        }
      }

      if (userRole === 'ADMIN') {
        const mappingsResponse = await fetch('/api/insurance/code-mappings');
        if (mappingsResponse.ok) {
          const mappingsData = await mappingsResponse.json();
          setCodeMappings(mappingsData);
        }
      }
    } catch (err) {
      setError('Failed to load insurance data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const openDialog = (type, item = null) => {
    setDialogType(type);
    setSelectedItem(item);
    if (item) {
      setFormData(item);
    } else {
      setFormData(type === 'insurance' ? insuranceForm : codeMappingForm);
    }
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setDialogType('');
    setSelectedItem(null);
    setFormData({});
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const url = dialogType === 'insurance' 
        ? '/api/insurance/info'
        : '/api/insurance/code-mappings';
      
      const method = selectedItem ? 'PUT' : 'POST';
      const finalUrl = selectedItem ? `${url}/${selectedItem.id}` : url;

      const response = await fetch(finalUrl, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        closeDialog();
        loadData();
      } else {
        setError('Failed to save data');
      }
    } catch (err) {
      setError('Failed to save data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, type) => {
    if (!window.confirm('Are you sure you want to delete this item?')) {
      return;
    }

    setLoading(true);
    try {
      const url = type === 'insurance' 
        ? `/api/insurance/info/${id}`
        : `/api/insurance/code-mappings/${id}`;

      const response = await fetch(url, {
        method: 'DELETE',
      });

      if (response.ok) {
        loadData();
      } else {
        setError('Failed to delete item');
      }
    } catch (err) {
      setError('Failed to delete item');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const generateClaim = async (appointmentId) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/insurance/claims/generate/${appointmentId}`, {
        method: 'POST',
      });

      if (response.ok) {
        loadData();
      } else {
        setError('Failed to generate claim');
      }
    } catch (err) {
      setError('Failed to generate claim');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE':
      case 'PAID':
      case 'APPROVED':
        return 'success';
      case 'PENDING':
      case 'SUBMITTED':
        return 'warning';
      case 'REJECTED':
      case 'DENIED':
      case 'REVOKED':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ACTIVE':
      case 'PAID':
      case 'APPROVED':
        return <CheckCircleIcon />;
      case 'PENDING':
      case 'SUBMITTED':
        return <WarningIcon />;
      case 'REJECTED':
      case 'DENIED':
      case 'REVOKED':
        return <ErrorIcon />;
      default:
        return <InfoIcon />;
    }
  };

  const renderInsuranceInfo = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Insurance Information</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => openDialog('insurance')}
        >
          Add Insurance
        </Button>
      </Box>

      <Grid container spacing={2}>
        {insuranceInfo.map((insurance) => (
          <Grid item xs={12} md={6} key={insurance.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">{insurance.providerName}</Typography>
                  <Box>
                    <Chip
                      label={insurance.status}
                      color={getStatusColor(insurance.status)}
                      icon={getStatusIcon(insurance.status)}
                      size="small"
                    />
                    {insurance.isPrimary && (
                      <Chip label="Primary" color="primary" size="small" sx={{ ml: 1 }} />
                    )}
                  </Box>
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">Member ID</Typography>
                    <Typography variant="body1">{insurance.memberId}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">Group Number</Typography>
                    <Typography variant="body1">{insurance.groupNumber || 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">Plan Type</Typography>
                    <Typography variant="body1">{insurance.planType}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">Copay</Typography>
                    <Typography variant="body1">
                      {insurance.copayAmount ? `$${insurance.copayAmount}` : 'N/A'}
                    </Typography>
                  </Grid>
                </Grid>

                <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                  <Tooltip title="Edit">
                    <IconButton size="small" onClick={() => openDialog('insurance', insurance)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton size="small" onClick={() => handleDelete(insurance.id, 'insurance')}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const renderClaims = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Insurance Claims</Typography>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={loadData}
        >
          Refresh
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Claim Number</TableCell>
              <TableCell>Service Date</TableCell>
              <TableCell>CPT Code</TableCell>
              <TableCell>ICD-10 Code</TableCell>
              <TableCell>Billed Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Submission Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {claims.map((claim) => (
              <TableRow key={claim.id}>
                <TableCell>{claim.claimNumber}</TableCell>
                <TableCell>
                  {new Date(claim.serviceDate).toLocaleDateString()}
                </TableCell>
                <TableCell>{claim.cptCode}</TableCell>
                <TableCell>{claim.icd10Code}</TableCell>
                <TableCell>${claim.billedAmount}</TableCell>
                <TableCell>
                  <Chip
                    label={claim.status}
                    color={getStatusColor(claim.status)}
                    icon={getStatusIcon(claim.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={claim.submissionStatus}
                    color={getStatusColor(claim.submissionStatus)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="View Details">
                      <IconButton size="small">
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                    {claim.status === 'DRAFT' && (
                      <Tooltip title="Generate Claim">
                        <IconButton 
                          size="small" 
                          onClick={() => generateClaim(claim.appointment.id)}
                        >
                          <DownloadIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  const renderCodeMappings = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Code Mappings</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => openDialog('mapping')}
        >
          Add Mapping
        </Button>
      </Box>

      <Grid container spacing={2}>
        {codeMappings.map((mapping) => (
          <Grid item xs={12} md={6} key={mapping.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">{mapping.appointmentType}</Typography>
                  <Chip
                    label={mapping.status}
                    color={getStatusColor(mapping.status)}
                    size="small"
                  />
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">CPT Code</Typography>
                    <Typography variant="body1">{mapping.cptCode}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">ICD-10 Code</Typography>
                    <Typography variant="body1">{mapping.icd10Code}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">Billed Amount</Typography>
                    <Typography variant="body1">
                      {mapping.defaultBilledAmount ? `$${mapping.defaultBilledAmount}` : 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">Priority</Typography>
                    <Typography variant="body1">{mapping.priority}</Typography>
                  </Grid>
                </Grid>

                <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                  <Tooltip title="Edit">
                    <IconButton size="small" onClick={() => openDialog('mapping', mapping)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton size="small" onClick={() => handleDelete(mapping.id, 'mapping')}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const renderDialog = () => {
    if (dialogType === 'insurance') {
      return (
        <Dialog open={dialogOpen} onClose={closeDialog} maxWidth="md" fullWidth>
          <DialogTitle>
            {selectedItem ? 'Edit Insurance Information' : 'Add Insurance Information'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Provider Name"
                  value={formData.providerName || ''}
                  onChange={(e) => handleFormChange('providerName', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Payer ID"
                  value={formData.payerId || ''}
                  onChange={(e) => handleFormChange('payerId', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Member ID"
                  value={formData.memberId || ''}
                  onChange={(e) => handleFormChange('memberId', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Group Number"
                  value={formData.groupNumber || ''}
                  onChange={(e) => handleFormChange('groupNumber', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Subscriber First Name"
                  value={formData.subscriberFirstName || ''}
                  onChange={(e) => handleFormChange('subscriberFirstName', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Subscriber Last Name"
                  value={formData.subscriberLastName || ''}
                  onChange={(e) => handleFormChange('subscriberLastName', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Policy Number"
                  value={formData.policyNumber || ''}
                  onChange={(e) => handleFormChange('policyNumber', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Plan Type</InputLabel>
                  <Select
                    value={formData.planType || 'PPO'}
                    onChange={(e) => handleFormChange('planType', e.target.value)}
                  >
                    <MenuItem value="PPO">PPO</MenuItem>
                    <MenuItem value="HMO">HMO</MenuItem>
                    <MenuItem value="EPO">EPO</MenuItem>
                    <MenuItem value="POS">POS</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Copay Amount"
                  type="number"
                  value={formData.copayAmount || ''}
                  onChange={(e) => handleFormChange('copayAmount', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Deductible Amount"
                  type="number"
                  value={formData.deductibleAmount || ''}
                  onChange={(e) => handleFormChange('deductibleAmount', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Coinsurance %"
                  type="number"
                  value={formData.coinsurancePercentage || ''}
                  onChange={(e) => handleFormChange('coinsurancePercentage', e.target.value)}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDialog}>Cancel</Button>
            <Button onClick={handleSubmit} variant="contained" disabled={loading}>
              {loading ? <CircularProgress size={20} /> : 'Save'}
            </Button>
          </DialogActions>
        </Dialog>
      );
    }

    if (dialogType === 'mapping') {
      return (
        <Dialog open={dialogOpen} onClose={closeDialog} maxWidth="md" fullWidth>
          <DialogTitle>
            {selectedItem ? 'Edit Code Mapping' : 'Add Code Mapping'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Appointment Type"
                  value={formData.appointmentType || ''}
                  onChange={(e) => handleFormChange('appointmentType', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="CPT Code"
                  value={formData.cptCode || ''}
                  onChange={(e) => handleFormChange('cptCode', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="ICD-10 Code"
                  value={formData.icd10Code || ''}
                  onChange={(e) => handleFormChange('icd10Code', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Default Billed Amount"
                  type="number"
                  value={formData.defaultBilledAmount || ''}
                  onChange={(e) => handleFormChange('defaultBilledAmount', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="AI Diagnosis"
                  value={formData.aiDiagnosis || ''}
                  onChange={(e) => handleFormChange('aiDiagnosis', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Manual Diagnosis"
                  value={formData.manualDiagnosis || ''}
                  onChange={(e) => handleFormChange('manualDiagnosis', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="CPT Description"
                  value={formData.cptDescription || ''}
                  onChange={(e) => handleFormChange('cptDescription', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="ICD-10 Description"
                  value={formData.icd10Description || ''}
                  onChange={(e) => handleFormChange('icd10Description', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Modifier 1"
                  value={formData.modifier1 || ''}
                  onChange={(e) => handleFormChange('modifier1', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Modifier 2"
                  value={formData.modifier2 || ''}
                  onChange={(e) => handleFormChange('modifier2', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Place of Service"
                  value={formData.placeOfService || '11'}
                  onChange={(e) => handleFormChange('placeOfService', e.target.value)}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDialog}>Cancel</Button>
            <Button onClick={handleSubmit} variant="contained" disabled={loading}>
              {loading ? <CircularProgress size={20} /> : 'Save'}
            </Button>
          </DialogActions>
        </Dialog>
      );
    }

    return null;
  };

  if (loading && !insuranceInfo.length && !claims.length) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="Insurance Information" />
        <Tab label="Claims" />
        {userRole === 'ADMIN' && <Tab label="Code Mappings" />}
      </Tabs>

      {activeTab === 0 && renderInsuranceInfo()}
      {activeTab === 1 && renderClaims()}
      {activeTab === 2 && userRole === 'ADMIN' && renderCodeMappings()}

      {renderDialog()}
    </Box>
  );
};

export default InsuranceManagement; 