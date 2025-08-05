import React, { useState, useEffect, useRef } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  Paper,
  Divider,
  Badge,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  InputAdornment,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemSecondaryAction,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Chat,
  Send,
  AttachFile,
  Mic,
  MicOff,
  RecordVoiceOver,
  Stop,
  MoreVert,
  Search,
  Person,
  Group,
  Notifications,
  NotificationsOff,
  Block,
  Report,
  Archive,
  Delete,
  Edit,
  Reply,
  Forward,
  Download,
  PlayArrow,
  Pause,
  VolumeUp,
  VolumeOff,
  Videocam,
  Phone,
  Schedule,
  AccessTime,
  CheckCircle,
  CheckCircleOutline,
  Error,
  Warning,
  Info,
  Image,
  Description,
  VideoFile,
  AudioFile,
  InsertDriveFile,
} from '@mui/icons-material';

// Mock data for demonstration
const mockContacts = [
  {
    id: 1,
    name: 'Dr. Sarah Johnson',
    specialty: 'Cardiology',
    avatar: 'SJ',
    status: 'online',
    lastMessage: 'How are you feeling today?',
    lastMessageTime: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    unreadCount: 2,
  },
  {
    id: 2,
    name: 'Dr. Michael Chen',
    specialty: 'Dermatology',
    avatar: 'MC',
    status: 'offline',
    lastMessage: 'Your test results are ready',
    lastMessageTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    unreadCount: 0,
  },
  {
    id: 3,
    name: 'Nurse Emily Rodriguez',
    specialty: 'Pediatrics',
    avatar: 'ER',
    status: 'online',
    lastMessage: 'Please schedule your follow-up',
    lastMessageTime: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    unreadCount: 1,
  },
];

const mockMessages = [
  {
    id: 1,
    senderId: 1,
    senderName: 'Dr. Sarah Johnson',
    content: 'Hello! How are you feeling today?',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    type: 'text',
    status: 'read',
  },
  {
    id: 2,
    senderId: 'user',
    senderName: 'You',
    content: 'I\'m feeling much better, thank you!',
    timestamp: new Date(Date.now() - 25 * 60 * 1000),
    type: 'text',
    status: 'read',
  },
  {
    id: 3,
    senderId: 1,
    senderName: 'Dr. Sarah Johnson',
    content: 'That\'s great to hear. Any side effects from the medication?',
    timestamp: new Date(Date.now() - 20 * 60 * 1000),
    type: 'text',
    status: 'read',
  },
  {
    id: 4,
    senderId: 'user',
    senderName: 'You',
    content: 'Just a slight headache in the morning',
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    type: 'text',
    status: 'delivered',
  },
  {
    id: 5,
    senderId: 1,
    senderName: 'Dr. Sarah Johnson',
    content: 'That\'s normal. Let\'s monitor it for a few more days.',
    timestamp: new Date(Date.now() - 10 * 60 * 1000),
    type: 'text',
    status: 'sent',
  },
];

const ChatPage = () => {
  const [contacts, setContacts] = useState(mockContacts);
  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState(0);
  const [openFileDialog, setOpenFileDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isNotificationsOn, setIsNotificationsOn] = useState(true);
  
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const audioRecorderRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Simulate typing indicator
    if (selectedContact) {
      const timer = setTimeout(() => {
        setIsTyping(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [selectedContact]);

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedContact) {
      const message = {
        id: Date.now(),
        senderId: 'user',
        senderName: 'You',
        content: newMessage,
        timestamp: new Date(),
        type: 'text',
        status: 'sent',
      };
      
      setMessages([...messages, message]);
      setNewMessage('');
      
      // Simulate reply
      setTimeout(() => {
        const reply = {
          id: Date.now() + 1,
          senderId: selectedContact.id,
          senderName: selectedContact.name,
          content: 'Thanks for the update! I\'ll review this information.',
          timestamp: new Date(),
          type: 'text',
          status: 'read',
        };
        setMessages(prev => [...prev, reply]);
      }, 2000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    // In real app, this would start audio recording
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    // In real app, this would stop recording and send audio file
    const audioMessage = {
      id: Date.now(),
      senderId: 'user',
      senderName: 'You',
      content: 'Voice message',
      timestamp: new Date(),
      type: 'audio',
      status: 'sent',
      duration: '0:15',
    };
    setMessages([...messages, audioMessage]);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const fileMessage = {
        id: Date.now(),
        senderId: 'user',
        senderName: 'You',
        content: file.name,
        timestamp: new Date(),
        type: 'file',
        status: 'sent',
        fileSize: file.size,
        fileType: file.type,
      };
      setMessages([...messages, fileMessage]);
    }
  };

  const handleContactSelect = (contact) => {
    setSelectedContact(contact);
    // Mark messages as read
    setContacts(contacts.map(c => 
      c.id === contact.id ? { ...c, unreadCount: 0 } : c
    ));
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'sent': return <CheckCircleOutline />;
      case 'delivered': return <CheckCircle />;
      case 'read': return <CheckCircle color="primary" />;
      default: return <Error />;
    }
  };

  const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/')) return <Image />;
    if (fileType.startsWith('video/')) return <VideoFile />;
    if (fileType.startsWith('audio/')) return <AudioFile />;
    if (fileType.includes('pdf') || fileType.includes('document')) return <Description />;
    return <InsertDriveFile />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.specialty.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredMessages = messages.filter(message =>
    selectedContact ? 
      (message.senderId === selectedContact.id || message.senderId === 'user') :
      true
  );

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Chat
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={isNotificationsOn}
                  onChange={(e) => setIsNotificationsOn(e.target.checked)}
                />
              }
              label="Notifications"
            />
            <Button
              variant="outlined"
              startIcon={<Group />}
            >
              New Group
            </Button>
          </Box>
        </Box>

        <Grid container spacing={3} sx={{ height: '70vh' }}>
          {/* Contacts List */}
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ p: 0 }}>
                <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                  <TextField
                    fullWidth
                    placeholder="Search contacts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
                
                <List sx={{ p: 0 }}>
                  {filteredContacts.map((contact) => (
                    <ListItem
                      key={contact.id}
                      button
                      selected={selectedContact?.id === contact.id}
                      onClick={() => handleContactSelect(contact)}
                      sx={{
                        borderBottom: 1,
                        borderColor: 'divider',
                        '&:hover': { bgcolor: 'action.hover' },
                      }}
                    >
                      <ListItemAvatar>
                        <Badge
                          color={contact.status === 'online' ? 'success' : 'default'}
                          variant="dot"
                          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        >
                          <Avatar sx={{ bgcolor: 'primary.main' }}>
                            {contact.avatar}
                          </Avatar>
                        </Badge>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="subtitle1">{contact.name}</Typography>
                            {contact.unreadCount > 0 && (
                              <Badge badgeContent={contact.unreadCount} color="primary" />
                            )}
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {contact.specialty}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" noWrap>
                              {contact.lastMessage}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {contact.lastMessageTime.toLocaleTimeString()}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Chat Area */}
          <Grid item xs={12} md={8}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              {selectedContact ? (
                <>
                  {/* Chat Header */}
                  <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Badge
                          color={selectedContact.status === 'online' ? 'success' : 'default'}
                          variant="dot"
                          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        >
                          <Avatar sx={{ bgcolor: 'primary.main' }}>
                            {selectedContact.avatar}
                          </Avatar>
                        </Badge>
                        <Box>
                          <Typography variant="h6">{selectedContact.name}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {selectedContact.specialty}
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton size="small">
                          <Videocam />
                        </IconButton>
                        <IconButton size="small">
                          <Phone />
                        </IconButton>
                        <IconButton size="small">
                          <MoreVert />
                        </IconButton>
                      </Box>
                    </Box>
                  </Box>

                  {/* Messages */}
                  <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
                    {filteredMessages.map((message) => (
                      <Box
                        key={message.id}
                        sx={{
                          display: 'flex',
                          justifyContent: message.senderId === 'user' ? 'flex-end' : 'flex-start',
                          mb: 2,
                        }}
                      >
                        <Box
                          sx={{
                            maxWidth: '70%',
                            bgcolor: message.senderId === 'user' ? 'primary.main' : 'grey.100',
                            color: message.senderId === 'user' ? 'white' : 'text.primary',
                            borderRadius: 2,
                            p: 1.5,
                            position: 'relative',
                          }}
                        >
                          {message.type === 'text' && (
                            <Typography variant="body1">{message.content}</Typography>
                          )}
                          
                          {message.type === 'file' && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              {getFileIcon(message.fileType)}
                              <Box>
                                <Typography variant="body2">{message.content}</Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {formatFileSize(message.fileSize)}
                                </Typography>
                              </Box>
                              <IconButton size="small">
                                <Download />
                              </IconButton>
                            </Box>
                          )}
                          
                          {message.type === 'audio' && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <IconButton size="small">
                                <PlayArrow />
                              </IconButton>
                              <Typography variant="body2">{message.content}</Typography>
                              <Typography variant="caption" color="text.secondary">
                                {message.duration}
                              </Typography>
                            </Box>
                          )}
                          
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
                            <Typography variant="caption" color="text.secondary">
                              {message.timestamp.toLocaleTimeString()}
                            </Typography>
                            {message.senderId === 'user' && (
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                {getStatusIcon(message.status)}
                              </Box>
                            )}
                          </Box>
                        </Box>
                      </Box>
                    ))}
                    
                    {isTyping && (
                      <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
                        <Box sx={{ bgcolor: 'grey.100', borderRadius: 2, p: 1.5 }}>
                          <Typography variant="body2" color="text.secondary">
                            {selectedContact.name} is typing...
                          </Typography>
                        </Box>
                      </Box>
                    )}
                    
                    <div ref={messagesEndRef} />
                  </Box>

                  {/* Message Input */}
                  <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
                      <IconButton
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isRecording}
                      >
                        <AttachFile />
                      </IconButton>
                      
                      <TextField
                        fullWidth
                        multiline
                        maxRows={4}
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={isRecording}
                        sx={{ flex: 1 }}
                      />
                      
                      <IconButton
                        onClick={isRecording ? handleStopRecording : handleStartRecording}
                        color={isRecording ? 'error' : 'primary'}
                      >
                        {isRecording ? <Stop /> : <Mic />}
                      </IconButton>
                      
                      <IconButton
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim() || isRecording}
                        color="primary"
                      >
                        <Send />
                      </IconButton>
                    </Box>
                    
                    <input
                      ref={fileInputRef}
                      type="file"
                      style={{ display: 'none' }}
                      onChange={handleFileUpload}
                      accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
                    />
                  </Box>
                </>
              ) : (
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  height: '100%',
                  p: 4
                }}>
                  <Chat sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Select a contact to start chatting
                  </Typography>
                  <Typography variant="body2" color="text.secondary" textAlign="center">
                    Choose a healthcare provider from the list to begin your conversation
                  </Typography>
                </Box>
              )}
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default ChatPage; 