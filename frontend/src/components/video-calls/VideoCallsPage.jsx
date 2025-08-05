import React, { useState, useEffect, useRef } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  Alert,
  CircularProgress,
  Paper,
  Divider,
  Badge,
  Fab,
  Tooltip,
  Switch,
  FormControlLabel,
  Slider,
  Tabs,
  Tab,
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
  RecordVoiceOver,
  Stop,
  Settings,
  People,
  Chat,
  MoreVert,
  Add,
  Schedule,
  AccessTime,
  Person,
  CheckCircle,
  Warning,
  Info,
  VolumeUp,
  VolumeOff,
  Fullscreen,
  FullscreenExit,
  CameraAlt,
  CameraAltOutlined,
  Phone,
  PhoneDisabled,
} from '@mui/icons-material';

// Mock data for demonstration
const mockMeetings = [
  {
    id: 1,
    title: 'Cardiology Consultation',
    doctor: 'Dr. Sarah Johnson',
    date: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
    duration: 30,
    status: 'scheduled',
    type: 'video',
    participants: ['Dr. Sarah Johnson', 'Patient'],
  },
  {
    id: 2,
    title: 'Dermatology Follow-up',
    doctor: 'Dr. Michael Chen',
    date: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    duration: 45,
    status: 'completed',
    type: 'video',
    participants: ['Dr. Michael Chen', 'Patient'],
  },
];

const VideoCallsPage = () => {
  const [meetings, setMeetings] = useState(mockMeetings);
  const [selectedTab, setSelectedTab] = useState(0);
  const [openMeetingDialog, setOpenMeetingDialog] = useState(false);
  const [openJoinDialog, setOpenJoinDialog] = useState(false);
  const [isInCall, setIsInCall] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [meetingId, setMeetingId] = useState('');
  const [meetingTitle, setMeetingTitle] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [meetingDate, setMeetingDate] = useState(new Date());
  const [meetingDuration, setMeetingDuration] = useState(30);
  const [loading, setLoading] = useState(false);
  
  // Video refs
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const screenShareRef = useRef(null);

  // Mock WebRTC functionality
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [peerConnection, setPeerConnection] = useState(null);

  const handleStartCall = () => {
    setOpenMeetingDialog(true);
  };

  const handleJoinMeeting = () => {
    setOpenJoinDialog(true);
  };

  const handleCreateMeeting = () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const newMeeting = {
        id: Date.now(),
        title: meetingTitle,
        doctor: selectedDoctor,
        date: meetingDate,
        duration: meetingDuration,
        status: 'scheduled',
        type: 'video',
        participants: [selectedDoctor, 'Patient'],
      };
      
      setMeetings([...meetings, newMeeting]);
      setOpenMeetingDialog(false);
      setLoading(false);
      setMeetingTitle('');
      setSelectedDoctor('');
      setMeetingDate(new Date());
      setMeetingDuration(30);
    }, 1000);
  };

  const handleJoinExistingMeeting = () => {
    setLoading(true);
    
    setTimeout(() => {
      setIsInCall(true);
      setOpenJoinDialog(false);
      setLoading(false);
      setMeetingId('');
      // Initialize video call
      initializeVideoCall();
    }, 1000);
  };

  const initializeVideoCall = async () => {
    try {
      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      
      setLocalStream(stream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      
      // Mock remote stream (in real app, this would come from WebRTC)
      setTimeout(() => {
        setRemoteStream(stream.clone());
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = stream.clone();
        }
      }, 2000);
      
    } catch (error) {
      console.error('Error accessing media devices:', error);
    }
  };

  const handleEndCall = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    setIsInCall(false);
    setLocalStream(null);
    setRemoteStream(null);
    setIsRecording(false);
    setIsScreenSharing(false);
    setIsMuted(false);
    setIsVideoOn(true);
  };

  const handleToggleMute = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
      }
    }
    setIsMuted(!isMuted);
  };

  const handleToggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
      }
    }
    setIsVideoOn(!isVideoOn);
  };

  const handleToggleScreenShare = async () => {
    if (!isScreenSharing) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
        });
        setIsScreenSharing(true);
        if (screenShareRef.current) {
          screenShareRef.current.srcObject = screenStream;
        }
      } catch (error) {
        console.error('Error sharing screen:', error);
      }
    } else {
      setIsScreenSharing(false);
      if (screenShareRef.current) {
        screenShareRef.current.srcObject = null;
      }
    }
  };

  const handleToggleRecording = () => {
    setIsRecording(!isRecording);
    // In real app, this would start/stop recording
  };

  const handleToggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    // In real app, this would toggle fullscreen mode
  };

  const upcomingMeetings = meetings.filter(meeting => 
    meeting.status === 'scheduled' && meeting.date > new Date()
  );

  const pastMeetings = meetings.filter(meeting => 
    meeting.status === 'completed' || meeting.date < new Date()
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'primary';
      case 'completed': return 'success';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'scheduled': return <Schedule />;
      case 'completed': return <CheckCircle />;
      case 'cancelled': return <Warning />;
      default: return <Info />;
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Video Calls
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<Add />}
              onClick={handleJoinMeeting}
            >
              Join Meeting
            </Button>
            <Button
              variant="contained"
              startIcon={<VideoCall />}
              onClick={handleStartCall}
            >
              Start Call
            </Button>
          </Box>
        </Box>

        <Paper sx={{ mb: 3 }}>
          <Tabs value={selectedTab} onChange={(e, newValue) => setSelectedTab(newValue)}>
            <Tab label={`Upcoming (${upcomingMeetings.length})`} />
            <Tab label={`Past (${pastMeetings.length})`} />
          </Tabs>
        </Paper>

        {/* Upcoming Meetings */}
        {selectedTab === 0 && (
          <Grid container spacing={3}>
            {upcomingMeetings.length === 0 ? (
              <Grid item xs={12}>
                <Card>
                  <CardContent sx={{ textAlign: 'center', py: 4 }}>
                    <VideoCall sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      No upcoming video calls
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Schedule a video consultation to get started
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ) : (
              upcomingMeetings.map((meeting) => (
                <Grid item xs={12} md={6} key={meeting.id}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Typography variant="h6">{meeting.title}</Typography>
                        <Chip
                          icon={getStatusIcon(meeting.status)}
                          label={meeting.status}
                          color={getStatusColor(meeting.status)}
                          size="small"
                        />
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <Person color="action" />
                        <Typography variant="body2">{meeting.doctor}</Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <AccessTime color="action" />
                        <Typography variant="body2">
                          {meeting.date.toLocaleDateString()} at {meeting.date.toLocaleTimeString()}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <Schedule color="action" />
                        <Typography variant="body2">{meeting.duration} minutes</Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                        <Button
                          size="small"
                          variant="contained"
                          startIcon={<VideoCall />}
                          onClick={() => {
                            setIsInCall(true);
                            initializeVideoCall();
                          }}
                        >
                          Join Now
                        </Button>
                        <Button
                          size="small"
                          startIcon={<Schedule />}
                        >
                          Reschedule
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>
        )}

        {/* Past Meetings */}
        {selectedTab === 1 && (
          <Grid container spacing={3}>
            {pastMeetings.map((meeting) => (
              <Grid item xs={12} md={6} key={meeting.id}>
                <Card sx={{ height: '100%', opacity: 0.7 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h6">{meeting.title}</Typography>
                      <Chip
                        icon={<CheckCircle />}
                        label="Completed"
                        color="success"
                        size="small"
                      />
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <Person color="action" />
                      <Typography variant="body2">{meeting.doctor}</Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <AccessTime color="action" />
                      <Typography variant="body2">
                        {meeting.date.toLocaleDateString()} at {meeting.date.toLocaleTimeString()}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Schedule color="action" />
                      <Typography variant="body2">{meeting.duration} minutes</Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* Video Call Interface */}
      {isInCall && (
        <Dialog
          open={isInCall}
          onClose={handleEndCall}
          maxWidth="xl"
          fullWidth
          PaperProps={{
            sx: {
              height: '90vh',
              maxHeight: '90vh',
              bgcolor: 'black',
              color: 'white',
            }
          }}
        >
          <Box sx={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Video Container */}
            <Box sx={{ flex: 1, position: 'relative', display: 'flex' }}>
              {/* Main Video */}
              <Box sx={{ flex: 1, position: 'relative' }}>
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  playsInline
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
                
                {/* Local Video (Picture-in-Picture) */}
                <Box sx={{
                  position: 'absolute',
                  top: 20,
                  right: 20,
                  width: 200,
                  height: 150,
                  borderRadius: 2,
                  overflow: 'hidden',
                  border: '2px solid white',
                }}>
                  <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                </Box>
                
                {/* Screen Share Overlay */}
                {isScreenSharing && (
                  <Box sx={{
                    position: 'absolute',
                    top: 20,
                    left: 20,
                    width: 300,
                    height: 200,
                    borderRadius: 2,
                    overflow: 'hidden',
                    border: '2px solid #2196f3',
                  }}>
                    <video
                      ref={screenShareRef}
                      autoPlay
                      playsInline
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  </Box>
                )}
              </Box>
            </Box>

            {/* Call Controls */}
            <Box sx={{
              position: 'absolute',
              bottom: 20,
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: 2,
              bgcolor: 'rgba(0,0,0,0.8)',
              borderRadius: 4,
              padding: 2,
            }}>
              <Tooltip title={isMuted ? 'Unmute' : 'Mute'}>
                <IconButton
                  onClick={handleToggleMute}
                  sx={{ 
                    bgcolor: isMuted ? 'error.main' : 'rgba(255,255,255,0.2)',
                    color: 'white',
                    '&:hover': { bgcolor: isMuted ? 'error.dark' : 'rgba(255,255,255,0.3)' }
                  }}
                >
                  {isMuted ? <MicOff /> : <Mic />}
                </IconButton>
              </Tooltip>

              <Tooltip title={isVideoOn ? 'Turn off video' : 'Turn on video'}>
                <IconButton
                  onClick={handleToggleVideo}
                  sx={{ 
                    bgcolor: !isVideoOn ? 'error.main' : 'rgba(255,255,255,0.2)',
                    color: 'white',
                    '&:hover': { bgcolor: !isVideoOn ? 'error.dark' : 'rgba(255,255,255,0.3)' }
                  }}
                >
                  {isVideoOn ? <Videocam /> : <VideocamOff />}
                </IconButton>
              </Tooltip>

              <Tooltip title={isScreenSharing ? 'Stop sharing' : 'Share screen'}>
                <IconButton
                  onClick={handleToggleScreenShare}
                  sx={{ 
                    bgcolor: isScreenSharing ? '#2196f3' : 'rgba(255,255,255,0.2)',
                    color: 'white',
                    '&:hover': { bgcolor: isScreenSharing ? '#1976d2' : 'rgba(255,255,255,0.3)' }
                  }}
                >
                  {isScreenSharing ? <StopScreenShare /> : <ScreenShare />}
                </IconButton>
              </Tooltip>

              <Tooltip title={isRecording ? 'Stop recording' : 'Start recording'}>
                <IconButton
                  onClick={handleToggleRecording}
                  sx={{ 
                    bgcolor: isRecording ? 'error.main' : 'rgba(255,255,255,0.2)',
                    color: 'white',
                    '&:hover': { bgcolor: isRecording ? 'error.dark' : 'rgba(255,255,255,0.3)' }
                  }}
                >
                  {isRecording ? <Stop /> : <RecordVoiceOver />}
                </IconButton>
              </Tooltip>

              <Tooltip title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}>
                <IconButton
                  onClick={handleToggleFullscreen}
                  sx={{ 
                    bgcolor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
                  }}
                >
                  {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
                </IconButton>
              </Tooltip>

              <Tooltip title="End call">
                <IconButton
                  onClick={handleEndCall}
                  sx={{ 
                    bgcolor: 'error.main',
                    color: 'white',
                    '&:hover': { bgcolor: 'error.dark' }
                  }}
                >
                  <CallEnd />
                </IconButton>
              </Tooltip>
            </Box>

            {/* Call Info */}
            <Box sx={{
              position: 'absolute',
              top: 20,
              left: 20,
              bgcolor: 'rgba(0,0,0,0.8)',
              borderRadius: 2,
              padding: 1,
            }}>
              <Typography variant="body2" color="white">
                Cardiology Consultation
              </Typography>
              <Typography variant="caption" color="rgba(255,255,255,0.7)">
                Dr. Sarah Johnson
              </Typography>
            </Box>

            {/* Recording Indicator */}
            {isRecording && (
              <Box sx={{
                position: 'absolute',
                top: 20,
                left: '50%',
                transform: 'translateX(-50%)',
                bgcolor: 'error.main',
                borderRadius: 2,
                padding: '4px 12px',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}>
                <Box sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: 'white',
                  animation: 'pulse 1s infinite',
                }} />
                <Typography variant="caption" color="white">
                  RECORDING
                </Typography>
              </Box>
            )}
          </Box>
        </Dialog>
      )}

      {/* Create Meeting Dialog */}
      <Dialog open={openMeetingDialog} onClose={() => setOpenMeetingDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Schedule Video Call</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Meeting Title"
            value={meetingTitle}
            onChange={(e) => setMeetingTitle(e.target.value)}
            sx={{ mt: 2 }}
          />
          
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Select Doctor</InputLabel>
            <Select
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(e.target.value)}
              label="Select Doctor"
            >
              <MenuItem value="Dr. Sarah Johnson">Dr. Sarah Johnson - Cardiology</MenuItem>
              <MenuItem value="Dr. Michael Chen">Dr. Michael Chen - Dermatology</MenuItem>
              <MenuItem value="Dr. Emily Rodriguez">Dr. Emily Rodriguez - Pediatrics</MenuItem>
              <MenuItem value="Dr. James Wilson">Dr. James Wilson - Neurology</MenuItem>
            </Select>
          </FormControl>
          
          <TextField
            fullWidth
            label="Duration (minutes)"
            type="number"
            value={meetingDuration}
            onChange={(e) => setMeetingDuration(parseInt(e.target.value))}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenMeetingDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleCreateMeeting}
            disabled={loading || !meetingTitle || !selectedDoctor}
          >
            {loading ? <CircularProgress size={20} /> : 'Schedule Call'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Join Meeting Dialog */}
      <Dialog open={openJoinDialog} onClose={() => setOpenJoinDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Join Meeting</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Meeting ID"
            value={meetingId}
            onChange={(e) => setMeetingId(e.target.value)}
            placeholder="Enter meeting ID or link"
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenJoinDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleJoinExistingMeeting}
            disabled={loading || !meetingId}
          >
            {loading ? <CircularProgress size={20} /> : 'Join Meeting'}
          </Button>
        </DialogActions>
      </Dialog>

      <style jsx>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
    </Container>
  );
};

export default VideoCallsPage; 