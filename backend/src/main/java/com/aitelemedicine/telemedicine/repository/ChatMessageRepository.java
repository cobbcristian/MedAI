package com.aitelemedicine.telemedicine.repository;

import com.aitelemedicine.telemedicine.model.ChatMessage;
import com.aitelemedicine.telemedicine.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    
    @Query("SELECT cm FROM ChatMessage cm WHERE (cm.sender = :user1 AND cm.receiver = :user2) OR (cm.sender = :user2 AND cm.receiver = :user1) ORDER BY cm.createdAt ASC")
    List<ChatMessage> findConversationBetweenUsers(@Param("user1") User user1, @Param("user2") User user2);
    
    @Query("SELECT cm FROM ChatMessage cm WHERE cm.receiver = :user AND cm.status = 'SENT' ORDER BY cm.createdAt DESC")
    List<ChatMessage> findUnreadMessagesForUser(@Param("user") User user);
    
    @Query("SELECT COUNT(cm) FROM ChatMessage cm WHERE cm.receiver = :user AND cm.status = 'SENT'")
    long countUnreadMessagesForUser(@Param("user") User user);
    
    @Query("SELECT cm FROM ChatMessage cm WHERE cm.appointment = :appointmentId ORDER BY cm.createdAt ASC")
    List<ChatMessage> findByAppointmentId(@Param("appointmentId") Long appointmentId);
    
    @Query("SELECT cm FROM ChatMessage cm WHERE cm.sender = :user OR cm.receiver = :user ORDER BY cm.createdAt DESC")
    List<ChatMessage> findAllMessagesForUser(@Param("user") User user);
    
    @Query("SELECT cm FROM ChatMessage cm WHERE cm.createdAt >= :since AND (cm.sender = :user OR cm.receiver = :user)")
    List<ChatMessage> findRecentMessagesForUser(@Param("user") User user, @Param("since") LocalDateTime since);
    
    @Query("SELECT cm FROM ChatMessage cm WHERE cm.isAiGenerated = true AND cm.sender = :user ORDER BY cm.createdAt DESC")
    List<ChatMessage> findAiGeneratedMessagesByUser(@Param("user") User user);
} 