import React, { useState, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  LinearProgress,
  Alert,
  Chip,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Description as DescriptionIcon,
  Image as ImageIcon
} from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';

const FileUpload = ({ onFileUpload, onAnalysisComplete, analysisResults }) => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    setError(null);
    const newFiles = acceptedFiles.map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      status: 'pending',
      progress: 0
    }));
    
    setUploadedFiles(prev => [...prev, ...newFiles]);
    handleUpload(newFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.dcm'],
      'application/pdf': ['.pdf'],
      'text/csv': ['.csv']
    },
    multiple: true
  });

  const handleUpload = async (files) => {
    setUploading(true);
    setUploadProgress(0);

    try {
      for (let i = 0; i < files.length; i++) {
        const fileData = files[i];
        
        // Update progress
        setUploadProgress((i / files.length) * 100);
        
        // Simulate upload delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Update file status
        setUploadedFiles(prev => 
          prev.map(f => 
            f.id === fileData.id 
              ? { ...f, status: 'uploading', progress: 50 }
              : f
          )
        );

        // Call upload handler
        if (onFileUpload) {
          try {
            const result = await onFileUpload(fileData.file);
            
            // Update file status to success
            setUploadedFiles(prev => 
              prev.map(f => 
                f.id === fileData.id 
                  ? { ...f, status: 'success', progress: 100, result }
                  : f
              )
            );
          } catch (err) {
            // Update file status to error
            setUploadedFiles(prev => 
              prev.map(f => 
                f.id === fileData.id 
                  ? { ...f, status: 'error', error: err.message }
                  : f
              )
            );
            setError(err.message);
          }
        }
      }
      
      setUploadProgress(100);
    } catch (err) {
      setError('Upload failed: ' + err.message);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const removeFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/')) return <ImageIcon />;
    if (fileType === 'application/pdf') return <DescriptionIcon />;
    return <DescriptionIcon />;
  };

  const getFileTypeLabel = (fileType) => {
    if (fileType.startsWith('image/')) return 'Medical Scan';
    if (fileType === 'application/pdf') return 'Lab Report (PDF)';
    if (fileType === 'text/csv') return 'Lab Report (CSV)';
    return 'Document';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'success';
      case 'error': return 'error';
      case 'uploading': return 'warning';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return <CheckCircleIcon />;
      case 'error': return <ErrorIcon />;
      case 'uploading': return <LinearProgress />;
      default: return null;
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Upload Medical Files for AI Analysis
      </Typography>
      
      <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
        Upload medical scans (DICOM, PNG, JPG) or lab reports (PDF, CSV) for AI-powered analysis
      </Typography>

      {/* Drop Zone */}
      <Card 
        {...getRootProps()} 
        sx={{ 
          border: '2px dashed',
          borderColor: isDragActive ? 'primary.main' : 'grey.300',
          backgroundColor: isDragActive ? 'action.hover' : 'background.paper',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          '&:hover': {
            borderColor: 'primary.main',
            backgroundColor: 'action.hover'
          }
        }}
      >
        <CardContent sx={{ textAlign: 'center', py: 4 }}>
          <input {...getInputProps()} />
          <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
          </Typography>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            or click to select files
          </Typography>
          <Button variant="outlined" sx={{ mt: 2 }}>
            Select Files
          </Button>
          
          <Box sx={{ mt: 2 }}>
            <Typography variant="caption" color="textSecondary">
              Supported formats:
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 1 }}>
              <Chip label="DICOM" size="small" />
              <Chip label="PNG/JPG" size="small" />
              <Chip label="PDF" size="small" />
              <Chip label="CSV" size="small" />
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Upload Progress */}
      {uploading && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" gutterBottom>
            Uploading files...
          </Typography>
          <LinearProgress 
            variant="determinate" 
            value={uploadProgress} 
            sx={{ height: 8, borderRadius: 4 }}
          />
        </Box>
      )}

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mt: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Uploaded Files
          </Typography>
          
          <List>
            {uploadedFiles.map((fileData) => (
              <ListItem
                key={fileData.id}
                sx={{
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 1,
                  mb: 1,
                  backgroundColor: 'background.paper'
                }}
              >
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {getFileIcon(fileData.file.type)}
                      <Typography variant="subtitle2">
                        {fileData.file.name}
                      </Typography>
                      <Chip
                        label={getFileTypeLabel(fileData.file.type)}
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" color="textSecondary">
                        Size: {(fileData.file.size / 1024 / 1024).toFixed(2)} MB
                      </Typography>
                      {fileData.status === 'uploading' && (
                        <LinearProgress 
                          variant="determinate" 
                          value={fileData.progress} 
                          sx={{ mt: 1, height: 4 }}
                        />
                      )}
                      {fileData.error && (
                        <Typography variant="body2" color="error">
                          Error: {fileData.error}
                        </Typography>
                      )}
                    </Box>
                  }
                />
                
                <ListItemSecondaryAction>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {fileData.status === 'success' && (
                      <Chip
                        icon={<CheckCircleIcon />}
                        label="Analyzed"
                        color="success"
                        size="small"
                      />
                    )}
                    {fileData.status === 'error' && (
                      <Chip
                        icon={<ErrorIcon />}
                        label="Failed"
                        color="error"
                        size="small"
                      />
                    )}
                    <IconButton
                      edge="end"
                      onClick={() => removeFile(fileData.id)}
                      color="error"
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Box>
      )}

      {/* Analysis Results */}
      {analysisResults && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Analysis Results
          </Typography>
          
          <Grid container spacing={2}>
            {analysisResults.scan_analysis && (
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                      Scan Analysis
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Confidence: {(analysisResults.scan_analysis.overall_confidence * 100).toFixed(1)}%
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Conditions found: {analysisResults.scan_analysis.conditions?.length || 0}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            )}
            
            {analysisResults.bloodwork_analysis && (
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                      Bloodwork Analysis
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Urgency: {analysisResults.bloodwork_analysis.urgency_level}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Abnormalities: {analysisResults.bloodwork_analysis.abnormalities?.length || 0}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            )}
            
            {analysisResults.recovery_prediction && (
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                      Recovery Prediction
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Estimated recovery: {analysisResults.recovery_prediction.estimated_recovery_days} days
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Complication risk: {(analysisResults.recovery_prediction.complication_risk * 100).toFixed(1)}%
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            )}
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default FileUpload; 