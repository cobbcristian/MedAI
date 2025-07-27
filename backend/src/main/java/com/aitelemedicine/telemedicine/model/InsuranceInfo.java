package com.aitelemedicine.telemedicine.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.time.LocalDateTime;

@Entity
@Table(name = "insurance_info")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = true)
public class InsuranceInfo extends BaseEntity {
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private User patient;
    
    @NotBlank
    @Column(name = "provider_name", nullable = false)
    private String providerName;
    
    @NotBlank
    @Column(name = "payer_id", nullable = false)
    private String payerId;
    
    @NotBlank
    @Column(name = "member_id", nullable = false)
    private String memberId;
    
    @Column(name = "group_number")
    private String groupNumber;
    
    @Column(name = "subscriber_first_name")
    private String subscriberFirstName;
    
    @Column(name = "subscriber_last_name")
    private String subscriberLastName;
    
    @Column(name = "subscriber_dob")
    private LocalDateTime subscriberDob;
    
    @Column(name = "relationship_to_patient")
    private String relationshipToPatient; // SELF, SPOUSE, CHILD, etc.
    
    @Column(name = "policy_number")
    private String policyNumber;
    
    @Column(name = "plan_type")
    private String planType; // PPO, HMO, EPO, etc.
    
    @Column(name = "copay_amount")
    private Double copayAmount;
    
    @Column(name = "deductible_amount")
    private Double deductibleAmount;
    
    @Column(name = "coinsurance_percentage")
    private Double coinsurancePercentage;
    
    @Column(name = "is_primary")
    private Boolean isPrimary = true;
    
    @Column(name = "effective_date")
    private LocalDateTime effectiveDate;
    
    @Column(name = "expiration_date")
    private LocalDateTime expirationDate;
    
    @Column(name = "authorization_number")
    private String authorizationNumber;
    
    @Column(name = "authorization_date")
    private LocalDateTime authorizationDate;
    
    @Column(name = "notes")
    private String notes;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private InsuranceStatus status = InsuranceStatus.ACTIVE;
    
    public enum InsuranceStatus {
        ACTIVE, INACTIVE, EXPIRED, PENDING_VERIFICATION
    }
} 