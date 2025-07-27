package com.aitelemedicine.telemedicine.service;

import com.aitelemedicine.telemedicine.model.ChatMessage;
import com.aitelemedicine.telemedicine.model.User;
import com.aitelemedicine.telemedicine.repository.ChatMessageRepository;
import com.aitelemedicine.telemedicine.repository.UserRepository;
import com.aitelemedicine.telemedicine.repository.AppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class ChatService {

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private AIService aiService;

    @Autowired
    private AppointmentRepository appointmentRepository;

    // Track online users
    private final Map<String, User> onlineUsers = new ConcurrentHashMap<>();

    public void sendMessage(ChatMessage message) {
        // Save message to database
        message.setCreatedAt(LocalDateTime.now());
        message.setStatus(ChatMessage.MessageStatus.SENT);
        chatMessageRepository.save(message);

        // Send to WebSocket
        String destination = "/topic/chat/" + getConversationId(message.getSender(), message.getReceiver());
        messagingTemplate.convertAndSend(destination, message);

        // Send delivery notification
        sendDeliveryNotification(message);
    }

    public void sendAIMessage(String senderUsername, String receiverUsername, String content, Long appointmentId) {
        User sender = userRepository.findByUsername(senderUsername)
                .orElseThrow(() -> new RuntimeException("Sender not found"));

        User receiver = userRepository.findByUsername(receiverUsername)
                .orElseThrow(() -> new RuntimeException("Receiver not found"));

        ChatMessage aiMessage = new ChatMessage();
        aiMessage.setSender(sender);
        aiMessage.setReceiver(receiver);
        aiMessage.setMessage(content);
        aiMessage.setType(ChatMessage.MessageType.TEXT);
        aiMessage.setAiGenerated(true);
        aiMessage.setAiModel("gpt-4");

        sendMessage(aiMessage);
    }

    public List<ChatMessage> getConversationHistory(String user1Username, String user2Username) {
        User user1 = userRepository.findByUsername(user1Username)
                .orElseThrow(() -> new RuntimeException("User 1 not found"));
        User user2 = userRepository.findByUsername(user2Username)
                .orElseThrow(() -> new RuntimeException("User 2 not found"));

        return chatMessageRepository.findConversationBetweenUsers(user1, user2);
    }

    public List<ChatMessage> getUnreadMessages(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return chatMessageRepository.findUnreadMessagesForUser(user);
    }

    public long getUnreadMessageCount(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return chatMessageRepository.countUnreadMessagesForUser(user);
    }

    public void markMessageAsRead(Long messageId) {
        ChatMessage message = chatMessageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found"));

        message.setStatus(ChatMessage.MessageStatus.READ);
        message.setReadAt(LocalDateTime.now());
        chatMessageRepository.save(message);

        // Send read receipt
        sendReadReceipt(message);
    }

    public void markMessageAsDelivered(Long messageId) {
        ChatMessage message = chatMessageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found"));

        message.setStatus(ChatMessage.MessageStatus.DELIVERED);
        message.setDeliveredAt(LocalDateTime.now());
        chatMessageRepository.save(message);
    }

    public void userConnected(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        onlineUsers.put(username, user);

        // Notify other users
        messagingTemplate.convertAndSend("/topic/presence", Map.of(
            "type", "USER_ONLINE",
            "username", username,
            "userId", user.getId()
        ));
    }

    public void userDisconnected(String username) {
        onlineUsers.remove(username);

        // Notify other users
        messagingTemplate.convertAndSend("/topic/presence", Map.of(
            "type", "USER_OFFLINE",
            "username", username
        ));
    }

    public boolean isUserOnline(String username) {
        return onlineUsers.containsKey(username);
    }

    public List<User> getOnlineUsers() {
        return List.copyOf(onlineUsers.values());
    }

    public void sendTypingNotification(String senderUsername, String receiverUsername, boolean isTyping) {
        String destination = "/topic/typing/" + getConversationId(senderUsername, receiverUsername);
        messagingTemplate.convertAndSend(destination, Map.of(
            "sender", senderUsername,
            "isTyping", isTyping
        ));
    }

    public void sendAppointmentReminder(Long appointmentId, String patientUsername, String doctorUsername) {
        String message = "Your appointment is starting in 5 minutes. Please join the video call.";
        
        User systemUser = userRepository.findByUsername("system")
                .orElseGet(() -> {
                    User system = new User();
                    system.setUsername("system");
                    system.setFirstName("System");
                    system.setLastName("Notification");
                    system.setRole(User.UserRole.ADMIN);
                    return userRepository.save(system);
                });

        // Send to patient
        ChatMessage patientMessage = new ChatMessage();
        patientMessage.setSender(systemUser);
        patientMessage.setReceiver(userRepository.findByUsername(patientUsername).orElse(null));
        patientMessage.setMessage(message);
        patientMessage.setType(ChatMessage.MessageType.SYSTEM);
        if (appointmentId != null) {
            appointmentRepository.findById(appointmentId).ifPresent(patientMessage::setAppointment);
        }
        sendMessage(patientMessage);

        // Send to doctor
        ChatMessage doctorMessage = new ChatMessage();
        doctorMessage.setSender(systemUser);
        doctorMessage.setReceiver(userRepository.findByUsername(doctorUsername).orElse(null));
        doctorMessage.setMessage(message);
        doctorMessage.setType(ChatMessage.MessageType.SYSTEM);
        if (appointmentId != null) {
            appointmentRepository.findById(appointmentId).ifPresent(doctorMessage::setAppointment);
        }
        sendMessage(doctorMessage);
    }

    public void generateAIResponse(String userMessage, String senderUsername, String receiverUsername, Long appointmentId) {
        // Generate AI response based on context
        String aiResponse = generateAIResponseContent(userMessage, appointmentId);
        
        // Send AI response
        sendAIMessage("ai-assistant", receiverUsername, aiResponse, appointmentId);
    }

    private String generateAIResponseContent(String userMessage, Long appointmentId) {
        // This would integrate with the AI service for context-aware responses
        // For now, return a simple response
        return "Thank you for your message. I'm here to help with any medical questions you may have.";
    }

    private String getConversationId(User user1, User user2) {
        // Create a consistent conversation ID regardless of sender/receiver order
        return user1.getId() < user2.getId() 
            ? user1.getId() + "_" + user2.getId()
            : user2.getId() + "_" + user1.getId();
    }

    private String getConversationId(String username1, String username2) {
        User user1 = userRepository.findByUsername(username1).orElse(null);
        User user2 = userRepository.findByUsername(username2).orElse(null);
        
        if (user1 == null || user2 == null) {
            return username1 + "_" + username2;
        }
        
        return getConversationId(user1, user2);
    }

    private void sendDeliveryNotification(ChatMessage message) {
        String destination = "/topic/delivery/" + message.getReceiver().getUsername();
        messagingTemplate.convertAndSend(destination, Map.of(
            "messageId", message.getId(),
            "status", "DELIVERED",
            "timestamp", LocalDateTime.now()
        ));
    }

    private void sendReadReceipt(ChatMessage message) {
        String destination = "/topic/read/" + message.getSender().getUsername();
        messagingTemplate.convertAndSend(destination, Map.of(
            "messageId", message.getId(),
            "status", "READ",
            "timestamp", LocalDateTime.now()
        ));
    }
} 