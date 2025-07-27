package com.aitelemedicine.telemedicine.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "code_mappings")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = true)
public class CodeMapping extends BaseEntity {
    
    @NotBlank
    @Column(name = "appointment_type", nullable = false)
    private String appointmentType; // CONSULTATION, FOLLOW_UP, EMERGENCY, etc.
    
    @Column(name = "ai_diagnosis")
    private String aiDiagnosis; // AI-generated diagnosis
    
    @Column(name = "manual_diagnosis")
    private String manualDiagnosis; // Doctor's manual diagnosis
    
    @NotBlank
    @Column(name = "cpt_code", nullable = false)
    private String cptCode;
    
    @Column(name = "cpt_description")
    private String cptDescription;
    
    @NotBlank
    @Column(name = "icd_10_code", nullable = false)
    private String icd10Code;
    
    @Column(name = "icd_10_description")
    private String icd10Description;
    
    @Column(name = "default_billed_amount")
    private BigDecimal defaultBilledAmount;
    
    @Column(name = "typical_allowed_amount")
    private BigDecimal typicalAllowedAmount;
    
    @Column(name = "modifier_1")
    private String modifier1;
    
    @Column(name = "modifier_2")
    private String modifier2;
    
    @Column(name = "modifier_3")
    private String modifier3;
    
    @Column(name = "modifier_4")
    private String modifier4;
    
    @Column(name = "place_of_service")
    private String placeOfService; // 11 = Office, 12 = Home, etc.
    
    @Column(name = "units")
    private Integer units = 1;
    
    @Column(name = "is_active")
    private Boolean isActive = true;
    
    @Column(name = "priority")
    private Integer priority = 1; // Higher priority mappings are used first
    
    @Column(name = "notes")
    private String notes;
    
    @Column(name = "created_by")
    private String createdBy;
    
    @Column(name = "approved_by")
    private String approvedBy;
    
    @Column(name = "approval_date")
    private LocalDateTime approvalDate;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private MappingStatus status = MappingStatus.DRAFT;
    
    public enum MappingStatus {
        DRAFT, PENDING_APPROVAL, APPROVED, REJECTED, INACTIVE
    }
} 