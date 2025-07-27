import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Phone as PhoneIcon,
  Tablet as TabletIcon,
  Laptop as LaptopIcon,
  Download as DownloadIcon,
  QrCode as QrCodeIcon,
  Info as InfoIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Android as AndroidIcon,
  Apple as AppleIcon,
  Language as LanguageIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  Storage as StorageIcon
} from '@mui/icons-material';

const MobileAppStarter = () => {
  const [downloadDialog, setDownloadDialog] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [userInfo, setUserInfo] = useState({
    email: '',
    device: '',
    platform: ''
  });

  const mobileFeatures = [
    {
      title: 'AI Symptom Checker',
      description: 'Get instant AI-powered symptom analysis and preliminary diagnosis',
      icon: <CheckIcon color="primary" />,
      status: 'available'
    },
    {
      title: 'Video Consultations',
      description: 'High-quality video calls with doctors from anywhere',
      icon: <PhoneIcon color="primary" />,
      status: 'available'
    },
    {
      title: 'Medical Records',
      description: 'Access your complete medical history and test results',
      icon: <StorageIcon color="primary" />,
      status: 'available'
    },
    {
      title: 'AI Training Sandbox',
      description: 'Upload anonymized data for custom AI model training',
      icon: <SecurityIcon color="primary" />,
      status: 'coming_soon'
    },
    {
      title: 'Model Comparison',
      description: 'Compare multiple AI models for diagnosis accuracy',
      icon: <SpeedIcon color="primary" />,
      status: 'coming_soon'
    },
    {
      title: 'Patient Feedback Loop',
      description: 'Rate AI explanations and help improve the system',
      icon: <InfoIcon color="primary" />,
      status: 'available'
    }
  ];

  const platformInfo = {
    ios: {
      name: 'iOS App',
      icon: <AppleIcon />,
      features: [
        'Native iOS performance',
        'Face ID/Touch ID integration',
        'Apple Health integration',
        'Offline mode support',
        'Push notifications',
        'Siri voice commands'
      ],
      requirements: 'iOS 14.0 or later',
      size: '45 MB'
    },
    android: {
      name: 'Android App',
      icon: <AndroidIcon />,
      features: [
        'Native Android performance',
        'Fingerprint/Face unlock',
        'Google Fit integration',
        'Offline mode support',
        'Push notifications',
        'Google Assistant integration'
      ],
      requirements: 'Android 8.0 or later',
      size: '42 MB'
    },
    web: {
      name: 'Progressive Web App',
      icon: <LaptopIcon />,
      features: [
        'Cross-platform compatibility',
        'No installation required',
        'Automatic updates',
        'Offline functionality',
        'Responsive design',
        'Browser-based security'
      ],
      requirements: 'Modern web browser',
      size: '15 MB'
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'success';
      case 'coming_soon': return 'warning';
      case 'beta': return 'info';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'available': return <CheckIcon />;
      case 'coming_soon': return <WarningIcon />;
      case 'beta': return <InfoIcon />;
      default: return <ErrorIcon />;
    }
  };

  const handleDownload = () => {
    if (!userInfo.email || !userInfo.device || !userInfo.platform) {
      return;
    }
    
    // Simulate download process
    setDownloadDialog(false);
    // In real implementation, this would trigger actual app download
    console.log('Downloading app for:', userInfo);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Mobile App Platform
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Access AI-powered telemedicine on your mobile device with native apps and progressive web app
      </Typography>

      <Grid container spacing={3}>
        {/* Platform Selection */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Choose Your Platform
              </Typography>
              
              <Grid container spacing={2}>
                {Object.entries(platformInfo).map(([key, platform]) => (
                  <Grid item xs={12} key={key}>
                    <Card variant="outlined" sx={{ cursor: 'pointer' }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          {platform.icon}
                          <Typography variant="h6" sx={{ ml: 1 }}>
                            {platform.name}
                          </Typography>
                        </Box>
                        
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Requirements: {platform.requirements}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Size: {platform.size}
                        </Typography>
                        
                        <List dense>
                          {platform.features.map((feature, index) => (
                            <ListItem key={index} dense>
                              <ListItemIcon>
                                <CheckIcon color="success" fontSize="small" />
                              </ListItemIcon>
                              <ListItemText primary={feature} />
                            </ListItem>
                          ))}
                        </List>
                        
                        <Button
                          variant="contained"
                          fullWidth
                          startIcon={<DownloadIcon />}
                          onClick={() => {
                            setSelectedPlatform(key);
                            setDownloadDialog(true);
                          }}
                        >
                          Download {platform.name}
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Mobile Features */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Mobile Features
              </Typography>
              
              <Grid container spacing={2}>
                {mobileFeatures.map((feature, index) => (
                  <Grid item xs={12} key={index}>
                    <Card variant="outlined">
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          {feature.icon}
                          <Typography variant="subtitle1" sx={{ ml: 1, flexGrow: 1 }}>
                            {feature.title}
                          </Typography>
                          <Chip
                            icon={getStatusIcon(feature.status)}
                            label={feature.status.replace('_', ' ')}
                            color={getStatusColor(feature.status)}
                            size="small"
                          />
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {feature.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* QR Code Download */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Download
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Scan the QR code with your mobile device to download the app
              </Typography>
              
              <Grid container spacing={2} alignItems="center">
                <Grid item>
                  <Box sx={{ 
                    width: 120, 
                    height: 120, 
                    border: '2px solid #ccc',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 1
                  }}>
                    <QrCodeIcon sx={{ fontSize: 80, color: '#ccc' }} />
                  </Box>
                </Grid>
                <Grid item xs>
                  <Typography variant="body2" color="text.secondary">
                    Point your camera at this QR code to download the AI Telemedicine app
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* System Requirements */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                System Requirements
              </Typography>
              
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <PhoneIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="iOS 14.0+ or Android 8.0+" 
                    secondary="Minimum operating system version"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <StorageIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="100 MB free space" 
                    secondary="For app installation and data"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <SpeedIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Stable internet connection" 
                    secondary="For video calls and AI features"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <SecurityIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Camera and microphone access" 
                    secondary="For video consultations"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Global Features */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Global Features
              </Typography>
              
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <LanguageIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Multi-language Support" 
                    secondary="English, Spanish, French, German, Chinese, Arabic"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <SecurityIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Offline Mode" 
                    secondary="Basic features available without internet"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <SpeedIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Low-bandwidth Mode" 
                    secondary="Optimized for slow internet connections"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <StorageIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Local Data Storage" 
                    secondary="Secure local storage for sensitive data"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Download Dialog */}
      <Dialog open={downloadDialog} onClose={() => setDownloadDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Download {platformInfo[selectedPlatform]?.name}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={userInfo.email}
                onChange={(e) => setUserInfo(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter your email for download link"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Device Name"
                value={userInfo.device}
                onChange={(e) => setUserInfo(prev => ({ ...prev, device: e.target.value }))}
                placeholder="e.g., iPhone 13, Samsung Galaxy S21"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Platform</InputLabel>
                <Select
                  value={userInfo.platform}
                  onChange={(e) => setUserInfo(prev => ({ ...prev, platform: e.target.value }))}
                >
                  <MenuItem value="ios">iOS</MenuItem>
                  <MenuItem value="android">Android</MenuItem>
                  <MenuItem value="web">Web Browser</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDownloadDialog(false)}>Cancel</Button>
          <Button
            onClick={handleDownload}
            variant="contained"
            disabled={!userInfo.email || !userInfo.device || !userInfo.platform}
          >
            Download App
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MobileAppStarter;