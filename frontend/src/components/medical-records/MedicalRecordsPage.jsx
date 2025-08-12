import React, { useState } from 'react';
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
  Tab
} from '@mui/material';
import {
  Description,
  Upload,
  Download,
  Share,
  Delete,
  Visibility,
  Add,
  Edit,
  History,
  LocalHospital,
  Medication,
  Vaccines,
  Image,
  Timeline,
  CheckCircle,
  Warning,
  Info
} from '@mui/icons-material';
import api from '../../services/api';

const MedicalRecordsPage = () => {
  const [records, setRecords] = useState([
    {
      id: 1,
      type: 'lab_result',
      title: 'Blood Test Results',
      date: '2024-01-15',
      status: 'completed',
      doctor: 'Dr. Johnson',
      description: 'Complete blood count and metabolic panel',
      fileSize: '2.3 MB',
      tags: ['blood', 'lab', 'routine']
    },
    {
      id: 2,
      type: 'imaging',
      title: 'Chest X-Ray',
      date: '2024-01-10',
      status: 'completed',
      doctor: 'Dr. Smith',
      description: 'Chest X-Ray for respiratory evaluation',
      fileSize: '5.1 MB',
      tags: ['imaging', 'chest', 'respiratory']
    },
    {
      id: 3,
      type: 'prescription',
      title: 'Medication Prescription',
      date: '2024-01-08',
      status: 'active',
      doctor: 'Dr. Johnson',
      description: 'Metformin 500mg twice daily',
      fileSize: '0.5 MB',
      tags: ['medication', 'diabetes']
    },
    {
      id: 4,
      type: 'vaccination',
      title: 'Flu Shot Record',
      date: '2023-12-15',
      status: 'completed',
      doctor: 'Dr. Williams',
      description: 'Annual influenza vaccination',
      fileSize: '1.2 MB',
      tags: ['vaccination', 'flu', 'annual']
    }
  ]);

  const [selectedTab, setSelectedTab] = useState(0);
  const [uploadDialog, setUploadDialog] = useState(false);
  const [viewDialog, setViewDialog] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const recordTypes = [
    { value: 'lab_result', label: 'Lab Results', icon: <LocalHospital /> },
    { value: 'imaging', label: 'Imaging', icon: <Image /> },
    { value: 'prescription', label: 'Prescription', icon: <Medication /> },
    { value: 'vaccination', label: 'Vaccination', icon: <Vaccines /> },
    { value: 'consultation', label: 'Consultation', icon: <Timeline /> },
    { value: 'surgery', label: 'Surgery', icon: <LocalHospital /> }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'active': return 'primary';
      case 'pending': return 'warning';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle />;
      case 'active': return <Info />;
      case 'pending': return <Warning />;
      case 'cancelled': return <Warning />;
      default: return <Info />;
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'lab_result': return <LocalHospital />;
      case 'imaging': return <Image />;
      case 'prescription': return <Medication />;
      case 'vaccination': return <Vaccines />;
      case 'consultation': return <Timeline />;
      case 'surgery': return <LocalHospital />;
      default: return <Description />;
    }
  };

  const handleUpload = async (fileData) => {
    setUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newRecord = {
        id: records.length + 1,
        ...fileData,
        date: new Date().toISOString().split('T')[0],
        status: 'completed',
        fileSize: '1.5 MB'
      };

      setRecords([newRecord, ...records]);
      setUploadDialog(false);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleViewRecord = (record) => {
    setSelectedRecord(record);
    setViewDialog(true);
  };

  const handleDeleteRecord = (recordId) => {
    setRecords(records.filter(r => r.id !== recordId));
  };

  const filteredRecords = selectedTab === 0 
    ? records 
    : records.filter(r => r.type === recordTypes[selectedTab - 1]?.value);

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Medical Records
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setUploadDialog(true)}
        >
          Upload Record
        </Button>
      </Box>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs 
          value={selectedTab} 
          onChange={(e, newValue) => setSelectedTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="All Records" />
          {recordTypes.map((type, index) => (
            <Tab 
              key={type.value} 
              label={type.label}
              icon={type.icon}
              iconPosition="start"
            />
          ))}
        </Tabs>
      </Paper>

      {/* Records Grid */}
      <Grid container spacing={3}>
        {filteredRecords.map((record) => (
          <Grid item xs={12} sm={6} md={4} key={record.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  {getTypeIcon(record.type)}
                  <Typography variant="h6" sx={{ ml: 1 }}>
                    {record.title}
                  </Typography>
                </Box>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {record.description}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Chip
                    icon={getStatusIcon(record.status)}
                    label={record.status}
                    color={getStatusColor(record.status)}
                    size="small"
                  />
                  <Typography variant="caption" sx={{ ml: 1 }}>
                    {record.date}
                  </Typography>
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  <strong>Doctor:</strong> {record.doctor}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  <strong>Size:</strong> {record.fileSize}
                </Typography>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 2 }}>
                  {record.tags.map((tag) => (
                    <Chip key={tag} label={tag} size="small" variant="outlined" />
                  ))}
                </Box>
              </CardContent>

              <CardActions>
                <Button 
                  size="small" 
                  startIcon={<Visibility />}
                  onClick={() => handleViewRecord(record)}
                >
                  View
                </Button>
                <Button 
                  size="small" 
                  startIcon={<Download />}
                >
                  Download
                </Button>
                <Button 
                  size="small" 
                  startIcon={<Share />}
                >
                  Share
                </Button>
                <IconButton 
                  size="small" 
                  color="error"
                  onClick={() => handleDeleteRecord(record.id)}
                >
                  <Delete />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Upload Dialog */}
      <Dialog open={uploadDialog} onClose={() => setUploadDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Upload Medical Record</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Record Title"
                placeholder="e.g., Blood Test Results"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Record Type</InputLabel>
                <Select label="Record Type">
                  {recordTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                placeholder="Describe the medical record..."
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="outlined"
                component="label"
                fullWidth
                startIcon={<Upload />}
              >
                Choose File
                <input type="file" hidden />
              </Button>
            </Grid>
            {uploading && (
              <Grid item xs={12}>
                <Box sx={{ width: '100%' }}>
                  <LinearProgress variant="determinate" value={uploadProgress} />
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Uploading... {uploadProgress}%
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUploadDialog(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={() => handleUpload({
              title: 'New Medical Record',
              type: 'lab_result',
              description: 'Uploaded medical record'
            })}
            disabled={uploading}
          >
            Upload
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Record Dialog */}
      <Dialog open={viewDialog} onClose={() => setViewDialog(false)} maxWidth="md" fullWidth>
        {selectedRecord && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {getTypeIcon(selectedRecord.type)}
                <Typography variant="h6" sx={{ ml: 1 }}>
                  {selectedRecord.title}
                </Typography>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>Record Details</Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText 
                        primary="Date" 
                        secondary={selectedRecord.date} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Doctor" 
                        secondary={selectedRecord.doctor} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Status" 
                        secondary={
                          <Chip
                            icon={getStatusIcon(selectedRecord.status)}
                            label={selectedRecord.status}
                            color={getStatusColor(selectedRecord.status)}
                            size="small"
                          />
                        } 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="File Size" 
                        secondary={selectedRecord.fileSize} 
                      />
                    </ListItem>
                  </List>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>Description</Typography>
                  <Typography variant="body2" paragraph>
                    {selectedRecord.description}
                  </Typography>
                  
                  <Typography variant="subtitle1" gutterBottom>Tags</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {selectedRecord.tags.map((tag) => (
                      <Chip key={tag} label={tag} size="small" />
                    ))}
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle1" gutterBottom>Preview</Typography>
                  <Paper sx={{ p: 2, bgcolor: 'grey.100', textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Medical record preview would be displayed here
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setViewDialog(false)}>Close</Button>
              <Button variant="contained" startIcon={<Download />}>
                Download
              </Button>
              <Button variant="outlined" startIcon={<Share />}>
                Share
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default MedicalRecordsPage; 