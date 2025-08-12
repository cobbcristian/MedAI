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
  FormControlLabel,
  InputAdornment,
  Drawer,
  AppBar,
  Toolbar
} from '@mui/material';
import {
  Chat,
  Send,
  AttachFile,
  Image,
  VideoCall,
  Mic,
  MicOff,
  EmojiEmotions,
  MoreVert,
  Search,
  FilterList,
  Archive,
  Delete,
  Block,
  Report,
  Person,
  Group,
  Notifications,
  NotificationsOff,
  Visibility,
  VisibilityOff,
  Add,
  Edit,
  Delete as DeleteIcon,
  CheckCircle,
  Warning,
  Info,
  AccessTime,
  LocationOn,
  Phone,
  Email,
  CalendarToday,
  Event,
  ConfirmationNumber,
  Payment,
  Receipt,
  CameraAlt,
  CameraEnhance,
  CameraFront,
  CameraRear,
  FileCopy,
  Download,
  Share,
  Reply,
  Forward
} from '@mui/icons-material';
import api from '../../services/api';

const ChatPage = () => {
  const [conversations, setConversations] = useState([
    {
      id: 1,
      type: 'doctor',
      name: 'Dr. Sarah Johnson',
      specialty: 'Cardiology',
      avatar: 'SJ',
      lastMessage: 'Your blood pressure results look good',
      timestamp: '2 hours ago',
      unread: 2,
      online: true,
      messages: [
        {
          id: 1,
          sender: 'doctor',
          text: 'Hello John, how are you feeling today?',
          timestamp: '10:30 AM',
          type: 'text'
        },
        {
          id: 2,
          sender: 'patient',
          text: 'I\'m feeling much better, thank you',
          timestamp: '10:32 AM',
          type: 'text'
        },
        {
          id: 3,
          sender: 'doctor',
          text: 'Your blood pressure results look good',
          timestamp: '10:35 AM',
          type: 'text'
        }
      ]
    },
    {
      id: 2,
      type: 'nurse',
      name: 'Nurse Emily Davis',
      specialty: 'Primary Care',
      avatar: 'ED',
      lastMessage: 'Please schedule your follow-up appointment',
      timestamp: '1 day ago',
      unread: 0,
      online: false,
      messages: [
        {
          id: 1,
          sender: 'nurse',
          text: 'Please schedule your follow-up appointment',
          timestamp: 'Yesterday',
          type: 'text'
        }
      ]
    },
    {
      id: 3,
      type: 'support',
      name: 'Support Team',
      specialty: 'Technical Support',
      avatar: 'ST',
      lastMessage: 'Your appointment has been confirmed',
      timestamp: '3 days ago',
      unread: 0,
      online: true,
      messages: [
        {
          id: 1,
          sender: 'support',
          text: 'Your appointment has been confirmed',
          timestamp: '3 days ago',
          type: 'text'
        }
      ]
    }
  ]);

  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const conversationTypes = [
    { value: 'all', label: 'All', icon: <Chat /> },
    { value: 'doctor', label: 'Doctors', icon: <Person /> },
    { value: 'nurse', label: 'Nurses', icon: <Person /> },
    { value: 'support', label: 'Support', icon: <Group /> },
    { value: 'urgent', label: 'Urgent', icon: <Warning /> }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'success';
      case 'offline': return 'default';
      case 'away': return 'warning';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'online': return <CheckCircle />;
      case 'offline': return <Info />;
      case 'away': return <Warning />;
      default: return <Info />;
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'doctor': return <Person />;
      case 'nurse': return <Person />;
      case 'support': return <Group />;
      case 'urgent': return <Warning />;
      default: return <Chat />;
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const message = {
      id: Date.now(),
      sender: 'patient',
      text: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'text'
    };

    // Update conversation with new message
    setConversations(prev => 
      prev.map(conv => 
        conv.id === selectedConversation.id 
          ? {
              ...conv,
              messages: [...conv.messages, message],
              lastMessage: newMessage,
              timestamp: 'Just now',
              unread: 0
            }
          : conv
      )
    );

    setNewMessage('');
    setIsTyping(false);

    // Simulate typing indicator from doctor
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        const reply = {
          id: Date.now() + 1,
          sender: 'doctor',
          text: 'Thank you for the update. I\'ll review this information.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'text'
        };

        setConversations(prev => 
          prev.map(conv => 
            conv.id === selectedConversation.id 
              ? {
                  ...conv,
                  messages: [...conv.messages, reply],
                  lastMessage: reply.text,
                  timestamp: 'Just now'
                }
              : conv
          )
        );
        setIsTyping(false);
      }, 2000);
    }, 1000);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && selectedConversation) {
      const message = {
        id: Date.now(),
        sender: 'patient',
        text: `Sent: ${file.name}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'file',
        fileName: file.name,
        fileSize: file.size
      };

      setConversations(prev => 
        prev.map(conv => 
          conv.id === selectedConversation.id 
            ? {
                ...conv,
                messages: [...conv.messages, message],
                lastMessage: `Sent: ${file.name}`,
                timestamp: 'Just now'
              }
            : conv
        )
      );
    }
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    // Simulate recording
    setTimeout(() => {
      setIsRecording(false);
      const message = {
        id: Date.now(),
        sender: 'patient',
        text: 'Voice message',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'voice'
      };

      setConversations(prev => 
        prev.map(conv => 
          conv.id === selectedConversation.id 
            ? {
                ...conv,
                messages: [...conv.messages, message],
                lastMessage: 'Voice message',
                timestamp: 'Just now'
              }
            : conv
        )
      );
    }, 3000);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedConversation?.messages]);

  const filteredConversations = selectedTab === 0 
    ? conversations 
    : conversations.filter(conv => conv.type === conversationTypes[selectedTab]?.value);

  const searchFilteredConversations = filteredConversations.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container maxWidth="lg" sx={{ height: 'calc(100vh - 100px)' }}>
      <Grid container spacing={2} sx={{ height: '100%' }}>
        {/* Conversations List */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
              <Typography variant="h6" gutterBottom>
                Messages
              </Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: <Search />,
                }}
              />
            </Box>

            {/* Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs 
                value={selectedTab} 
                onChange={(e, newValue) => setSelectedTab(newValue)}
                variant="scrollable"
                scrollButtons="auto"
              >
                <Tab label="All" />
                {conversationTypes.slice(1).map((type) => (
                  <Tab 
                    key={type.value} 
                    label={type.label}
                    icon={type.icon}
                    iconPosition="start"
                  />
                ))}
              </Tabs>
            </Box>

            {/* Conversations */}
            <Box sx={{ flex: 1, overflow: 'auto' }}>
              <List>
                {searchFilteredConversations.map((conversation) => (
                  <ListItem
                    key={conversation.id}
                    button
                    selected={selectedConversation?.id === conversation.id}
                    onClick={() => setSelectedConversation(conversation)}
                    sx={{ borderBottom: 1, borderColor: 'divider' }}
                  >
                    <ListItemIcon>
                      <Badge
                        badgeContent={conversation.unread}
                        color="error"
                        invisible={conversation.unread === 0}
                      >
                        <Avatar sx={{ bgcolor: conversation.online ? 'success.main' : 'grey.400' }}>
                          {conversation.avatar}
                        </Avatar>
                      </Badge>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: conversation.unread > 0 ? 'bold' : 'normal' }}>
                            {conversation.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {conversation.timestamp}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography 
                            variant="body2" 
                            color="text.secondary"
                            sx={{ 
                              fontWeight: conversation.unread > 0 ? 'bold' : 'normal',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center'
                            }}
                          >
                            {conversation.lastMessage}
                            {conversation.online && (
                              <Chip 
                                label="Online" 
                                size="small" 
                                color="success" 
                                variant="outlined"
                              />
                            )}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {conversation.specialty}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          </Paper>
        </Grid>

        {/* Chat Area */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: selectedConversation.online ? 'success.main' : 'grey.400' }}>
                        {selectedConversation.avatar}
                      </Avatar>
                      <Box>
                        <Typography variant="h6">
                          {selectedConversation.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {selectedConversation.specialty}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton size="small">
                        <VideoCall />
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
                  {selectedConversation.messages.map((message) => (
                    <Box
                      key={message.id}
                      sx={{
                        display: 'flex',
                        justifyContent: message.sender === 'patient' ? 'flex-end' : 'flex-start',
                        mb: 2
                      }}
                    >
                      <Box
                        sx={{
                          maxWidth: '70%',
                          bgcolor: message.sender === 'patient' ? 'primary.main' : 'grey.100',
                          color: message.sender === 'patient' ? 'white' : 'text.primary',
                          borderRadius: 2,
                          p: 1.5,
                          position: 'relative'
                        }}
                      >
                        <Typography variant="body2">
                          {message.text}
                        </Typography>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            opacity: 0.7,
                            display: 'block',
                            mt: 0.5
                          }}
                        >
                          {message.timestamp}
                        </Typography>
                        {message.type === 'file' && (
                          <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <AttachFile />
                            <Typography variant="caption">
                              {message.fileName} ({Math.round(message.fileSize / 1024)}KB)
                            </Typography>
                          </Box>
                        )}
                        {message.type === 'voice' && (
                          <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Mic />
                            <Typography variant="caption">
                              Voice message
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </Box>
                  ))}
                  
                  {isTyping && (
                    <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
                      <Box sx={{ bgcolor: 'grey.100', borderRadius: 2, p: 1.5 }}>
                        <Typography variant="body2" color="text.secondary">
                          {selectedConversation.name} is typing...
                        </Typography>
                      </Box>
                    </Box>
                  )}
                  
                  <div ref={messagesEndRef} />
                </Box>

                {/* Message Input */}
                <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <IconButton 
                      size="small"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <AttachFile />
                    </IconButton>
                    <IconButton 
                      size="small"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    >
                      <EmojiEmotions />
                    </IconButton>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              size="small"
                              onClick={isRecording ? handleStopRecording : handleStartRecording}
                              color={isRecording ? 'error' : 'primary'}
                            >
                              {isRecording ? <MicOff /> : <Mic />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                    <IconButton 
                      color="primary"
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                    >
                      <Send />
                    </IconButton>
                  </Box>
                  
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                    accept="image/*,.pdf,.doc,.docx"
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
                p: 3
              }}>
                <Chat sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Select a conversation
                </Typography>
                <Typography variant="body2" color="text.secondary" textAlign="center">
                  Choose a conversation from the list to start messaging
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ChatPage; 