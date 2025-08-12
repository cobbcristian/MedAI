import React, { useState, useRef, useEffect } from 'react';
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
  Tab,
  Avatar,
  Badge,
  Fab,
  Tooltip,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  VideoCall,
  Call,
  CallEnd,
  Mic,
  MicOff,
  Videocam,
  VideocamOff,
  ScreenShare,
  StopScreenShare,
  Chat,
  Settings,
  People,
  RecordVoiceOver,
  VolumeUp,
  VolumeOff,
  Fullscreen,
  FullscreenExit,
  Add,
  Edit,
  Delete,
  Visibility,
  CheckCircle,
  Warning,
  Info,
  AccessTime,
  LocationOn,
  Phone,
  Email,
  CalendarToday,
  Event,
  Notifications,
  ConfirmationNumber,
  Payment,
  Receipt,
  CameraAlt,
  CameraEnhance,
  CameraFront,
  CameraRear,
  Schedule,
  Person
} from '@mui/icons-material';
import api from '../../services/api';

const VideoCallsPage = () => {
  const [calls, setCalls] = useState([
    {
      id: 1,
      type: 'consultation',
      title: 'Follow-up Consultation',
      date: '2024-01-20',
      time: '14:00',
      duration: 30,
      doctor: 'Dr. Cobb',
      specialty: 'Cardiology',
      status: 'scheduled',
      patient: 'John Smith',
      notes: 'Review blood pressure medication',
      meetingId: 'abc-defg-hij',
      meetingLink: 'https://meet.google.com/abc-defg-hij',
      cost: 150,
      recording: false
    },
    {
      id: 2,
      type: 'emergency',
      title: 'Emergency Consultation',
      date: '2024-01-18',
      time: '09:00',
      duration: 45,
      doctor: 'Dr. Emily Davis',
      specialty: 'Emergency Medicine',
      status: 'completed',
      patient: 'John Smith',
      notes: 'Chest pain evaluation',
      meetingId: 'xyz-uvw-rst',
      meetingLink: 'https://meet.google.com/xyz-uvw-rst',
      cost: 300,
      recording: true
    }
  ]);

  const [selectedTab, setSelectedTab] = useState(0);
  const [createDialog, setCreateDialog] = useState(false);
  const [viewDialog, setViewDialog] = useState(false);
  const [selectedCall, setSelectedCall] = useState(null);
  const [creating, setCreating] = useState(false);
  const [inCall, setInCall] = useState(false);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [callDuration, setCallDuration] = useState(0);

  const videoRef = useRef();
  const localVideoRef = useRef();
  const peerConnection = useRef();
  const callTimerRef = useRef();

  const callTypes = [
    { value: 'consultation', label: 'Consultation', icon: <VideoCall /> },
    { value: 'emergency', label: 'Emergency', icon: <Warning /> },
    { value: 'followup', label: 'Follow-up', icon: <Event /> },
    { value: 'surgery', label: 'Surgery', icon: <CameraAlt /> },
    { value: 'imaging', label: 'Imaging', icon: <CameraEnhance /> },
    { value: 'training', label: 'Training', icon: <RecordVoiceOver /> }
  ];

  const doctors = [
    { id: 1, name: 'Dr. Cobb', specialty: 'Cardiology', available: true },
    { id: 2, name: 'Dr. Michael Chen', specialty: 'Primary Care', available: true },
    { id: 3, name: 'Dr. Emily Davis', specialty: 'Emergency Medicine', available: true },
    { id: 4, name: 'Dr. Lisa Rodriguez', specialty: 'Dermatology', available: false }
  ];

  // Initialize WebRTC peer connection
  const initializePeerConnection = () => {
    const configuration = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    };
    
    peerConnection.current = new RTCPeerConnection(configuration);
    
    // Add local stream tracks to peer connection
    if (localStream) {
      localStream.getTracks().forEach(track => {
        peerConnection.current.addTrack(track, localStream);
      });
    }
    
    // Handle incoming remote stream
    peerConnection.current.ontrack = (event) => {
      setRemoteStream(event.streams[0]);
      if (videoRef.current) {
        videoRef.current.srcObject = event.streams[0];
      }
    };
    
    // Handle connection state changes
    peerConnection.current.onconnectionstatechange = () => {
      setConnectionStatus(peerConnection.current.connectionState);
    };
    
    // Handle ICE connection state changes
    peerConnection.current.oniceconnectionstatechange = () => {
      console.log('ICE Connection State:', peerConnection.current.iceConnectionState);
    };
  };

  // Start call timer
  const startCallTimer = () => {
    callTimerRef.current = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
  };

  // Stop call timer
  const stopCallTimer = () => {
    if (callTimerRef.current) {
      clearInterval(callTimerRef.current);
      callTimerRef.current = null;
    }
  };

  // Format call duration
  const formatCallDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'scheduled': return 'primary';
      case 'pending': return 'warning';
      case 'completed': return 'info';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <Call />;
      case 'scheduled': return <Schedule />;
      case 'pending': return <Warning />;
      case 'completed': return <CheckCircle />;
      case 'cancelled': return <CallEnd />;
      default: return <Info />;
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'consultation': return <VideoCall />;
      case 'emergency': return <Warning />;
      case 'followup': return <Event />;
      case 'surgery': return <CameraAlt />;
      case 'imaging': return <CameraEnhance />;
      case 'training': return <RecordVoiceOver />;
      default: return <VideoCall />;
    }
  };

  const handleCreateCall = async (callData) => {
    setCreating(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newCall = {
        id: calls.length + 1,
        ...callData,
        status: 'scheduled',
        patient: 'John Smith',
        meetingId: Math.random().toString(36).substr(2, 9),
        meetingLink: `https://meet.google.com/${Math.random().toString(36).substr(2, 9)}`
      };

      setCalls([newCall, ...calls]);
      setCreateDialog(false);
    } catch (error) {
      console.error('Call creation failed:', error);
    } finally {
      setCreating(false);
    }
  };

  const handleJoinCall = async (call) => {
    try {
      setConnectionStatus('connecting');
      
      // Request camera and microphone permissions
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        }, 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
      setLocalStream(stream);
      
      // Set local video
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      
      // Initialize peer connection
      initializePeerConnection();
      
      setInCall(true);
      setSelectedCall(call);
      setConnectionStatus('connected');
      startCallTimer();
      
      // Simulate remote participant joining
      setTimeout(() => {
        // In a real implementation, this would be the remote stream from another participant
        setRemoteStream(stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 2000);
      
    } catch (error) {
      console.error('Failed to join call:', error);
      setConnectionStatus('failed');
      alert('Failed to access camera/microphone. Please check permissions.');
    }
  };

  const handleEndCall = () => {
    // Stop all tracks
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    if (remoteStream) {
      remoteStream.getTracks().forEach(track => track.stop());
    }
    
    // Close peer connection
    if (peerConnection.current) {
      peerConnection.current.close();
    }
    
    // Stop timer
    stopCallTimer();
    
    // Reset state
    setLocalStream(null);
    setRemoteStream(null);
    setInCall(false);
    setSelectedCall(null);
    setIsMuted(false);
    setIsVideoOff(false);
    setIsScreenSharing(false);
    setIsRecording(false);
    setIsFullscreen(false);
    setConnectionStatus('disconnected');
    setCallDuration(0);
  };

  const toggleMute = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOff(!videoTrack.enabled);
      }
    }
  };

  const toggleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ 
          video: {
            cursor: 'always',
            displaySurface: 'monitor'
          },
          audio: false
        });
        
        // Replace video track in peer connection
        const videoTrack = screenStream.getVideoTracks()[0];
        const sender = peerConnection.current.getSenders().find(s => s.track?.kind === 'video');
        if (sender) {
          sender.replaceTrack(videoTrack);
        }
        
        setLocalStream(screenStream);
        setIsScreenSharing(true);
        
        // Handle screen share stop
        videoTrack.onended = () => {
          toggleScreenShare();
        };
      } else {
        const userStream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: 'user'
          }, 
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          }
        });
        
        // Replace video track back to camera
        const videoTrack = userStream.getVideoTracks()[0];
        const sender = peerConnection.current.getSenders().find(s => s.track?.kind === 'video');
        if (sender) {
          sender.replaceTrack(videoTrack);
        }
        
        setLocalStream(userStream);
        setIsScreenSharing(false);
      }
    } catch (error) {
      console.error('Screen sharing failed:', error);
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // In a real implementation, this would start/stop recording the call
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      } else if (videoRef.current.webkitRequestFullscreen) {
        videoRef.current.webkitRequestFullscreen();
      } else if (videoRef.current.msRequestFullscreen) {
        videoRef.current.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
      if (peerConnection.current) {
        peerConnection.current.close();
      }
      stopCallTimer();
    };
  }, []);

  const filteredCalls = selectedTab === 0 
    ? calls 
    : calls.filter(call => call.type === callTypes[selectedTab - 1]?.value);

  const activeCalls = calls.filter(call => call.status === 'active');
  const scheduledCalls = calls.filter(call => call.status === 'scheduled');

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Video Calls
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setCreateDialog(true)}
        >
          Create Call
        </Button>
      </Box>

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <VideoCall color="primary" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h6">{activeCalls.length}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active Calls
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Event color="success" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h6">{scheduledCalls.length}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Scheduled
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CheckCircle color="info" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h6">
                    {calls.filter(call => call.status === 'completed').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Completed
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <RecordVoiceOver color="secondary" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h6">
                    {calls.filter(call => call.recording).length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Recorded
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs 
          value={selectedTab} 
          onChange={(e, newValue) => setSelectedTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="All Calls" />
          {callTypes.map((type) => (
            <Tab 
              key={type.value} 
              label={type.label}
              icon={type.icon}
              iconPosition="start"
            />
          ))}
        </Tabs>
      </Paper>

      {/* Calls Grid */}
      <Grid container spacing={3}>
        {filteredCalls.map((call) => (
          <Grid item xs={12} sm={6} md={4} key={call.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  {getTypeIcon(call.type)}
                  <Typography variant="h6" sx={{ ml: 1 }}>
                    {call.title}
                  </Typography>
                </Box>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {call.notes}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Chip
                    icon={getStatusIcon(call.status)}
                    label={call.status}
                    color={getStatusColor(call.status)}
                    size="small"
                  />
                  <Typography variant="caption" sx={{ ml: 1 }}>
                    {call.date} at {call.time}
                  </Typography>
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  <strong>Doctor:</strong> {call.doctor}
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  <strong>Duration:</strong> {call.duration} minutes
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Chip 
                    label={call.recording ? 'Recorded' : 'Not Recorded'} 
                    size="small" 
                    variant="outlined"
                    color={call.recording ? 'success' : 'default'}
                  />
                  <Typography variant="caption" sx={{ ml: 1 }}>
                    ${call.cost}
                  </Typography>
                </Box>
              </CardContent>

              <CardActions>
                <Button 
                  size="small" 
                  startIcon={<Visibility />}
                  onClick={() => {
                    setSelectedCall(call);
                    setViewDialog(true);
                  }}
                >
                  View
                </Button>
                {call.status === 'scheduled' && (
                  <Button 
                    size="small" 
                    variant="contained"
                    startIcon={<VideoCall />}
                    onClick={() => handleJoinCall(call)}
                  >
                    Join
                  </Button>
                )}
                {call.status === 'active' && (
                  <Button 
                    size="small" 
                    color="error"
                    startIcon={<CallEnd />}
                    onClick={handleEndCall}
                  >
                    End
                  </Button>
                )}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Create Call Dialog */}
      <Dialog open={createDialog} onClose={() => setCreateDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create New Video Call</DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>Call Details</Typography>
              
              <TextField
                fullWidth
                label="Call Title"
                placeholder="e.g., Follow-up Consultation"
                sx={{ mb: 2 }}
              />

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Call Type</InputLabel>
                <Select label="Call Type">
                  {callTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Select Doctor</InputLabel>
                <Select label="Select Doctor">
                  {doctors.filter(d => d.available).map((doctor) => (
                    <MenuItem key={doctor.id} value={doctor.id}>
                      {doctor.name} - {doctor.specialty}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                multiline
                rows={3}
                label="Notes"
                placeholder="Describe the purpose of this call..."
                sx={{ mb: 2 }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>Schedule</Typography>
              
              <TextField
                fullWidth
                type="date"
                label="Date"
                InputLabelProps={{ shrink: true }}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                type="time"
                label="Time"
                InputLabelProps={{ shrink: true }}
                sx={{ mb: 2 }}
              />

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Duration</InputLabel>
                <Select label="Duration" defaultValue={30}>
                  <MenuItem value={15}>15 minutes</MenuItem>
                  <MenuItem value={30}>30 minutes</MenuItem>
                  <MenuItem value={45}>45 minutes</MenuItem>
                  <MenuItem value={60}>1 hour</MenuItem>
                </Select>
              </FormControl>

              <FormControlLabel
                control={<Switch />}
                label="Record Call"
                sx={{ mb: 2 }}
              />

              {creating && (
                <Box sx={{ width: '100%' }}>
                  <LinearProgress />
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Creating call...
                  </Typography>
                </Box>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialog(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={() => handleCreateCall({
              title: 'New Video Call',
              type: 'consultation',
              doctor: 'Dr. Cobb',
              date: '2024-01-30',
              time: '14:00',
              duration: 30,
              notes: 'General consultation',
              cost: 150,
              recording: false
            })}
            disabled={creating}
          >
            Create Call
          </Button>
        </DialogActions>
      </Dialog>

      {/* Video Call Interface */}
      {inCall && selectedCall && (
        <Dialog 
          open={inCall} 
          onClose={handleEndCall} 
          maxWidth="lg" 
          fullWidth
          PaperProps={{
            sx: { height: '80vh' }
          }}
        >
          <DialogTitle>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="h6">
                  {selectedCall.title} - {selectedCall.doctor}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {formatCallDuration(callDuration)} • {connectionStatus}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Chip 
                  label={isRecording ? 'Recording' : 'Not Recording'} 
                  color={isRecording ? 'error' : 'default'}
                  size="small"
                />
                <IconButton onClick={handleEndCall} color="error">
                  <CallEnd />
                </IconButton>
              </Box>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ position: 'relative', height: '100%' }}>
              {/* Main Video */}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  backgroundColor: '#000',
                  borderRadius: '8px'
                }}
              />
              
              {/* Connection Status Overlay */}
              {connectionStatus === 'connecting' && (
                <Box sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  bgcolor: 'rgba(0,0,0,0.8)',
                  color: 'white',
                  p: 2,
                  borderRadius: 2,
                  textAlign: 'center'
                }}>
                  <Typography variant="h6">Connecting...</Typography>
                  <LinearProgress sx={{ mt: 1 }} />
                </Box>
              )}
              
              {/* Local Video (Picture-in-Picture) */}
              <Box sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                width: 200,
                height: 150,
                border: '2px solid white',
                borderRadius: 1,
                overflow: 'hidden',
                boxShadow: 3
              }}>
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </Box>

              {/* Call Controls */}
              <Box sx={{
                position: 'absolute',
                bottom: 16,
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: 2,
                bgcolor: 'rgba(0,0,0,0.8)',
                borderRadius: 3,
                p: 1
              }}>
                <Tooltip title={isMuted ? 'Unmute' : 'Mute'}>
                  <IconButton onClick={toggleMute} color={isMuted ? 'error' : 'inherit'}>
                    {isMuted ? <MicOff /> : <Mic />}
                  </IconButton>
                </Tooltip>
                <Tooltip title={isVideoOff ? 'Turn on camera' : 'Turn off camera'}>
                  <IconButton onClick={toggleVideo} color={isVideoOff ? 'error' : 'inherit'}>
                    {isVideoOff ? <VideocamOff /> : <Videocam />}
                  </IconButton>
                </Tooltip>
                <Tooltip title={isScreenSharing ? 'Stop sharing' : 'Share screen'}>
                  <IconButton onClick={toggleScreenShare} color={isScreenSharing ? 'primary' : 'inherit'}>
                    {isScreenSharing ? <StopScreenShare /> : <ScreenShare />}
                  </IconButton>
                </Tooltip>
                <Tooltip title={isRecording ? 'Stop recording' : 'Start recording'}>
                  <IconButton onClick={toggleRecording} color={isRecording ? 'error' : 'inherit'}>
                    <RecordVoiceOver />
                  </IconButton>
                </Tooltip>
                <Tooltip title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}>
                  <IconButton onClick={toggleFullscreen} color="inherit">
                    {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
                  </IconButton>
                </Tooltip>
                <Tooltip title="End call">
                  <IconButton color="error" onClick={handleEndCall}>
                    <CallEnd />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </DialogContent>
        </Dialog>
      )}

      {/* View Call Dialog */}
      <Dialog open={viewDialog} onClose={() => setViewDialog(false)} maxWidth="md" fullWidth>
        {selectedCall && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {getTypeIcon(selectedCall.type)}
                <Typography variant="h6" sx={{ ml: 1 }}>
                  {selectedCall.title}
                </Typography>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>Call Details</Typography>
                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        <CalendarToday />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Date & Time" 
                        secondary={`${selectedCall.date} at ${selectedCall.time}`} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <AccessTime />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Duration" 
                        secondary={`${selectedCall.duration} minutes`} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Person />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Doctor" 
                        secondary={selectedCall.doctor} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <VideoCall />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Meeting ID" 
                        secondary={selectedCall.meetingId} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Payment />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Cost" 
                        secondary={`$${selectedCall.cost}`} 
                      />
                    </ListItem>
                  </List>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>Status & Notes</Typography>
                  <Box sx={{ mb: 2 }}>
                    <Chip
                      icon={getStatusIcon(selectedCall.status)}
                      label={selectedCall.status}
                      color={getStatusColor(selectedCall.status)}
                      size="medium"
                    />
                  </Box>
                  
                  <Typography variant="body2" paragraph>
                    <strong>Notes:</strong> {selectedCall.notes}
                  </Typography>

                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Meeting Link:
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<VideoCall />}
                      href={selectedCall.meetingLink}
                      target="_blank"
                      fullWidth
                    >
                      Join Video Call
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setViewDialog(false)}>Close</Button>
              {selectedCall.status === 'scheduled' && (
                <Button 
                  variant="contained" 
                  startIcon={<VideoCall />}
                  onClick={() => {
                    setViewDialog(false);
                    handleJoinCall(selectedCall);
                  }}
                >
                  Join Call
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default VideoCallsPage; 