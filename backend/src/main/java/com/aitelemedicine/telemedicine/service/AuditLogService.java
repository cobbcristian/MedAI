package com.aitelemedicine.telemedicine.service;

import com.aitelemedicine.telemedicine.model.AuditLog;
import com.aitelemedicine.telemedicine.model.User;
import com.aitelemedicine.telemedicine.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuditLogService {
    
    private final AuditLogRepository auditLogRepository;
    private final HttpServletRequest request;
    
    /**
     * Log a user action for audit purposes
     */
    @Transactional
    public AuditLog logEvent(User user, String action, String resourceType, String resourceId, String notes) {
        try {
            AuditLog auditLog = AuditLog.builder()
                .user(user)
                .action(action)
                .resourceType(resourceType)
                .resourceId(resourceId)
                .notes(notes)
                .ipAddress(getClientIpAddress())
                .userAgent(getUserAgent())
                .sessionId(getSessionId())
                .requestUrl(getRequestUrl())
                .requestMethod(getRequestMethod())
                .responseStatus(200) // Default success
                .responseTimeMs(System.currentTimeMillis())
                .dataAccessLevel(determineDataAccessLevel(resourceType))
                .complianceCategory("HIPAA")
                .riskLevel(determineRiskLevel(action, resourceType))
                .severity(AuditLog.Severity.INFO)
                .build();
            
            return auditLogRepository.save(auditLog);
            
        } catch (Exception e) {
            log.error("Error logging audit event: {}", e.getMessage());
            // Don't throw exception to avoid breaking main functionality
            return null;
        }
    }
    
    /**
     * Log AI usage for compliance tracking
     */
    @Transactional
    public AuditLog logAIUsage(User user, String action, String aiModel, String inputData, String outputData) {
        try {
            AuditLog auditLog = AuditLog.builder()
                .user(user)
                .action(action)
                .resourceType("AI_ASSISTANCE")
                .aiUsage(true)
                .aiModelUsed(aiModel)
                .aiInputData(inputData)
                .aiOutputData(outputData)
                .ipAddress(getClientIpAddress())
                .userAgent(getUserAgent())
                .sessionId(getSessionId())
                .requestUrl(getRequestUrl())
                .requestMethod(getRequestMethod())
                .dataAccessLevel("PHI")
                .complianceCategory("HIPAA")
                .riskLevel("MEDIUM")
                .severity(AuditLog.Severity.INFO)
                .build();
            
            return auditLogRepository.save(auditLog);
            
        } catch (Exception e) {
            log.error("Error logging AI usage: {}", e.getMessage());
            return null;
        }
    }
    
    /**
     * Log error events
     */
    @Transactional
    public AuditLog logError(User user, String action, String resourceType, String errorMessage) {
        try {
            AuditLog auditLog = AuditLog.builder()
                .user(user)
                .action(action)
                .resourceType(resourceType)
                .errorMessage(errorMessage)
                .ipAddress(getClientIpAddress())
                .userAgent(getUserAgent())
                .sessionId(getSessionId())
                .requestUrl(getRequestUrl())
                .requestMethod(getRequestMethod())
                .responseStatus(500)
                .dataAccessLevel("SYSTEM")
                .complianceCategory("HIPAA")
                .riskLevel("HIGH")
                .severity(AuditLog.Severity.ERROR)
                .build();
            
            return auditLogRepository.save(auditLog);
            
        } catch (Exception e) {
            log.error("Error logging error event: {}", e.getMessage());
            return null;
        }
    }
    
    /**
     * Log security events
     */
    @Transactional
    public AuditLog logSecurityEvent(User user, String action, String resourceType, String notes) {
        try {
            AuditLog auditLog = AuditLog.builder()
                .user(user)
                .action(action)
                .resourceType(resourceType)
                .notes(notes)
                .ipAddress(getClientIpAddress())
                .userAgent(getUserAgent())
                .sessionId(getSessionId())
                .requestUrl(getRequestUrl())
                .requestMethod(getRequestMethod())
                .dataAccessLevel("SYSTEM")
                .complianceCategory("HIPAA")
                .riskLevel("HIGH")
                .severity(AuditLog.Severity.WARNING)
                .build();
            
            return auditLogRepository.save(auditLog);
            
        } catch (Exception e) {
            log.error("Error logging security event: {}", e.getMessage());
            return null;
        }
    }
    
    /**
     * Get audit logs for a specific user
     */
    public List<AuditLog> getAuditLogsByUser(Long userId) {
        return auditLogRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }
    
    /**
     * Get audit logs for a specific resource
     */
    public List<AuditLog> getAuditLogsByResource(String resourceType, String resourceId) {
        return auditLogRepository.findByResourceTypeAndResourceIdOrderByCreatedAtDesc(resourceType, resourceId);
    }
    
    /**
     * Get audit logs by action type
     */
    public List<AuditLog> getAuditLogsByAction(String action) {
        return auditLogRepository.findByActionOrderByCreatedAtDesc(action);
    }
    
    /**
     * Get audit logs by severity level
     */
    public List<AuditLog> getAuditLogsBySeverity(AuditLog.Severity severity) {
        return auditLogRepository.findBySeverityOrderByCreatedAtDesc(severity);
    }
    
    /**
     * Get AI usage logs
     */
    public List<AuditLog> getAIUsageLogs() {
        return auditLogRepository.findByAiUsageTrueOrderByCreatedAtDesc();
    }
    
    /**
     * Get audit logs within date range
     */
    public List<AuditLog> getAuditLogsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return auditLogRepository.findByCreatedAtBetweenOrderByCreatedAtDesc(startDate, endDate);
    }
    
    /**
     * Get audit logs for compliance reporting
     */
    public List<AuditLog> getComplianceLogs(String complianceCategory) {
        return auditLogRepository.findByComplianceCategoryOrderByCreatedAtDesc(complianceCategory);
    }
    
    /**
     * Get high-risk audit logs
     */
    public List<AuditLog> getHighRiskLogs() {
        return auditLogRepository.findByRiskLevelInOrderByCreatedAtDesc(List.of("HIGH", "CRITICAL"));
    }
    
    /**
     * Determine data access level based on resource type
     */
    private String determineDataAccessLevel(String resourceType) {
        switch (resourceType) {
            case "PATIENT":
            case "MEDICAL_RECORD":
            case "APPOINTMENT":
            case "INSURANCE_CLAIM":
                return "PHI";
            case "USER":
            case "CONSENT":
                return "PII";
            case "SYSTEM":
            case "AUDIT_LOG":
                return "SYSTEM";
            default:
                return "ANONYMOUS";
        }
    }
    
    /**
     * Determine risk level based on action and resource type
     */
    private String determineRiskLevel(String action, String resourceType) {
        // High-risk actions
        if (action.contains("DELETE") || action.contains("REVOKE") || action.contains("TERMINATE")) {
            return "HIGH";
        }
        
        // Medium-risk actions
        if (action.contains("EDIT") || action.contains("UPDATE") || action.contains("MODIFY")) {
            return "MEDIUM";
        }
        
        // PHI access
        if (resourceType.equals("PATIENT") || resourceType.equals("MEDICAL_RECORD")) {
            return "MEDIUM";
        }
        
        return "LOW";
    }
    
    /**
     * Get client IP address
     */
    private String getClientIpAddress() {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        
        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty()) {
            return xRealIp;
        }
        
        return request.getRemoteAddr();
    }
    
    /**
     * Get user agent
     */
    private String getUserAgent() {
        return request.getHeader("User-Agent");
    }
    
    /**
     * Get session ID
     */
    private String getSessionId() {
        return request.getSession(false) != null ? request.getSession().getId() : null;
    }
    
    /**
     * Get request URL
     */
    private String getRequestUrl() {
        return request.getRequestURL().toString();
    }
    
    /**
     * Get request method
     */
    private String getRequestMethod() {
        return request.getMethod();
    }
    
    /**
     * Get audit statistics for reporting
     */
    public AuditStatistics getAuditStatistics(LocalDateTime startDate, LocalDateTime endDate) {
        long totalEvents = auditLogRepository.countByCreatedAtBetween(startDate, endDate);
        long aiUsageEvents = auditLogRepository.countByAiUsageTrueAndCreatedAtBetween(startDate, endDate);
        long errorEvents = auditLogRepository.countBySeverityAndCreatedAtBetween(AuditLog.Severity.ERROR, startDate, endDate);
        long highRiskEvents = auditLogRepository.countByRiskLevelInAndCreatedAtBetween(List.of("HIGH", "CRITICAL"), startDate, endDate);
        
        return AuditStatistics.builder()
            .totalEvents(totalEvents)
            .aiUsageEvents(aiUsageEvents)
            .errorEvents(errorEvents)
            .highRiskEvents(highRiskEvents)
            .startDate(startDate)
            .endDate(endDate)
            .build();
    }
    
    /**
     * Audit statistics for reporting
     */
    public static class AuditStatistics {
        private long totalEvents;
        private long aiUsageEvents;
        private long errorEvents;
        private long highRiskEvents;
        private LocalDateTime startDate;
        private LocalDateTime endDate;
        
        // Builder pattern
        public static AuditStatisticsBuilder builder() {
            return new AuditStatisticsBuilder();
        }
        
        public static class AuditStatisticsBuilder {
            private AuditStatistics statistics = new AuditStatistics();
            
            public AuditStatisticsBuilder totalEvents(long totalEvents) {
                statistics.totalEvents = totalEvents;
                return this;
            }
            
            public AuditStatisticsBuilder aiUsageEvents(long aiUsageEvents) {
                statistics.aiUsageEvents = aiUsageEvents;
                return this;
            }
            
            public AuditStatisticsBuilder errorEvents(long errorEvents) {
                statistics.errorEvents = errorEvents;
                return this;
            }
            
            public AuditStatisticsBuilder highRiskEvents(long highRiskEvents) {
                statistics.highRiskEvents = highRiskEvents;
                return this;
            }
            
            public AuditStatisticsBuilder startDate(LocalDateTime startDate) {
                statistics.startDate = startDate;
                return this;
            }
            
            public AuditStatisticsBuilder endDate(LocalDateTime endDate) {
                statistics.endDate = endDate;
                return this;
            }
            
            public AuditStatistics build() {
                return statistics;
            }
        }
        
        // Getters
        public long getTotalEvents() { return totalEvents; }
        public long getAiUsageEvents() { return aiUsageEvents; }
        public long getErrorEvents() { return errorEvents; }
        public long getHighRiskEvents() { return highRiskEvents; }
        public LocalDateTime getStartDate() { return startDate; }
        public LocalDateTime getEndDate() { return endDate; }
    }
} 