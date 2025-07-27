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
@Table(name = "consents")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = true)
public class Consent extends BaseEntity {
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private User patient;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "witness_id")
    private User witness; // Doctor or staff member who witnessed consent
    
    @NotBlank
    @Column(name = "consent_type", nullable = false)
    private String consentType; // TELEMEDICINE, AI_ASSISTANCE, DATA_SHARING, etc.
    
    @NotBlank
    @Column(name = "consent_version", nullable = false)
    private String consentVersion; // Version of the consent form
    
    @Column(name = "consent_title")
    private String consentTitle;
    
    @Column(name = "consent_content", columnDefinition = "TEXT")
    private String consentContent; // Full text of the consent form
    
    @Column(name = "consent_date", nullable = false)
    private LocalDateTime consentDate;
    
    @Column(name = "expiration_date")
    private LocalDateTime expirationDate;
    
    @Column(name = "revocation_date")
    private LocalDateTime revocationDate;
    
    @Column(name = "revocation_reason")
    private String revocationReason;
    
    @Column(name = "digital_signature")
    private String digitalSignature; // Encrypted signature data
    
    @Column(name = "signature_timestamp")
    private LocalDateTime signatureTimestamp;
    
    @Column(name = "ip_address")
    private String ipAddress;
    
    @Column(name = "user_agent")
    private String userAgent;
    
    @Column(name = "device_info")
    private String deviceInfo;
    
    @Column(name = "location")
    private String location; // Geographic location when consent was given
    
    @Column(name = "language")
    private String language = "en"; // Language of the consent form
    
    @Column(name = "accessibility_mode")
    private Boolean accessibilityMode = false; // If consent was given with accessibility features
    
    @Column(name = "ai_explanation_provided")
    private Boolean aiExplanationProvided = false;
    
    @Column(name = "ai_risks_explained")
    private Boolean aiRisksExplained = false;
    
    @Column(name = "data_usage_explained")
    private Boolean dataUsageExplained = false;
    
    @Column(name = "right_to_revoke_explained")
    private Boolean rightToRevokeExplained = false;
    
    @Column(name = "questions_answered")
    private Boolean questionsAnswered = false;
    
    @Column(name = "patient_understood")
    private Boolean patientUnderstood = false;
    
    @Column(name = "witness_present")
    private Boolean witnessPresent = false;
    
    @Column(name = "notes")
    private String notes;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private ConsentStatus status = ConsentStatus.ACTIVE;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "compliance_level")
    private ComplianceLevel complianceLevel = ComplianceLevel.BASIC;
    
    public enum ConsentStatus {
        DRAFT, ACTIVE, EXPIRED, REVOKED, SUPERSEDED
    }
    
    public enum ComplianceLevel {
        BASIC, STANDARD, ENHANCED, RESEARCH
    }
} 