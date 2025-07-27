package com.aitelemedicine.telemedicine.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = true)
public class AuditLog extends BaseEntity {
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
    
    @NotBlank
    @Column(name = "action", nullable = false)
    private String action; // LOGIN, LOGOUT, VIEW_RECORD, EDIT_RECORD, etc.
    
    @NotBlank
    @Column(name = "resource_type", nullable = false)
    private String resourceType; // PATIENT, APPOINTMENT, MEDICAL_RECORD, etc.
    
    @Column(name = "resource_id")
    private String resourceId;
    
    @Column(name = "resource_name")
    private String resourceName;
    
    @Column(name = "ip_address")
    private String ipAddress;
    
    @Column(name = "user_agent")
    private String userAgent;
    
    @Column(name = "session_id")
    private String sessionId;
    
    @Column(name = "request_url")
    private String requestUrl;
    
    @Column(name = "request_method")
    private String requestMethod;
    
    @Column(name = "request_params", columnDefinition = "TEXT")
    private String requestParams;
    
    @Column(name = "response_status")
    private Integer responseStatus;
    
    @Column(name = "response_time_ms")
    private Long responseTimeMs;
    
    @Column(name = "error_message")
    private String errorMessage;
    
    @Column(name = "ai_usage")
    private Boolean aiUsage = false;
    
    @Column(name = "ai_model_used")
    private String aiModelUsed;
    
    @Column(name = "ai_input_data")
    private String aiInputData;
    
    @Column(name = "ai_output_data")
    private String aiOutputData;
    
    @Column(name = "data_access_level")
    private String dataAccessLevel; // PHI, PII, ANONYMOUS
    
    @Column(name = "compliance_category")
    private String complianceCategory; // HIPAA, GDPR, etc.
    
    @Column(name = "risk_level")
    private String riskLevel; // LOW, MEDIUM, HIGH, CRITICAL
    
    @Column(name = "location")
    private String location; // Geographic location if available
    
    @Column(name = "device_info")
    private String deviceInfo;
    
    @Column(name = "notes")
    private String notes;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "severity")
    private Severity severity = Severity.INFO;
    
    public enum Severity {
        DEBUG, INFO, WARNING, ERROR, CRITICAL
    }
} 