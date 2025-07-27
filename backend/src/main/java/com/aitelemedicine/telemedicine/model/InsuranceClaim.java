package com.aitelemedicine.telemedicine.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "insurance_claims")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = true)
public class InsuranceClaim extends BaseEntity {
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "appointment_id", nullable = false)
    private Appointment appointment;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private User patient;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doctor_id", nullable = false)
    private User doctor;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "insurance_info_id", nullable = false)
    private InsuranceInfo insuranceInfo;
    
    @Column(name = "claim_number", unique = true)
    private String claimNumber;
    
    @Column(name = "control_number", unique = true)
    private String controlNumber;
    
    @Column(name = "claim_date", nullable = false)
    private LocalDateTime claimDate;
    
    @Column(name = "service_date", nullable = false)
    private LocalDateTime serviceDate;
    
    @Column(name = "cpt_code", nullable = false)
    private String cptCode;
    
    @Column(name = "icd_10_code", nullable = false)
    private String icd10Code;
    
    @Column(name = "diagnosis_pointer")
    private String diagnosisPointer;
    
    @Column(name = "billed_amount", nullable = false)
    private BigDecimal billedAmount;
    
    @Column(name = "allowed_amount")
    private BigDecimal allowedAmount;
    
    @Column(name = "paid_amount")
    private BigDecimal paidAmount;
    
    @Column(name = "patient_responsibility")
    private BigDecimal patientResponsibility;
    
    @Column(name = "copay_amount")
    private BigDecimal copayAmount;
    
    @Column(name = "deductible_amount")
    private BigDecimal deductibleAmount;
    
    @Column(name = "coinsurance_amount")
    private BigDecimal coinsuranceAmount;
    
    @Column(name = "place_of_service")
    private String placeOfService; // 11 = Office, 12 = Home, etc.
    
    @Column(name = "modifier_1")
    private String modifier1;
    
    @Column(name = "modifier_2")
    private String modifier2;
    
    @Column(name = "modifier_3")
    private String modifier3;
    
    @Column(name = "modifier_4")
    private String modifier4;
    
    @Column(name = "units")
    private Integer units = 1;
    
    @Column(name = "days_supplied")
    private Integer daysSupplied;
    
    @Column(name = "prescription_number")
    private String prescriptionNumber;
    
    @Column(name = "refill_number")
    private Integer refillNumber;
    
    @Column(name = "prior_authorization")
    private String priorAuthorization;
    
    @Column(name = "referring_provider_npi")
    private String referringProviderNpi;
    
    @Column(name = "rendering_provider_npi", nullable = false)
    private String renderingProviderNpi;
    
    @Column(name = "billing_provider_npi", nullable = false)
    private String billingProviderNpi;
    
    @Column(name = "facility_npi")
    private String facilityNpi;
    
    @Column(name = "edi_file_path")
    private String ediFilePath;
    
    @Column(name = "edi_content", columnDefinition = "TEXT")
    private String ediContent;
    
    @Column(name = "submission_date")
    private LocalDateTime submissionDate;
    
    @Column(name = "clearinghouse_response")
    private String clearinghouseResponse;
    
    @Column(name = "payer_response")
    private String payerResponse;
    
    @Column(name = "response_date")
    private LocalDateTime responseDate;
    
    @Column(name = "rejection_reason")
    private String rejectionReason;
    
    @Column(name = "appeal_deadline")
    private LocalDateTime appealDeadline;
    
    @Column(name = "notes")
    private String notes;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private ClaimStatus status = ClaimStatus.DRAFT;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "submission_status")
    private SubmissionStatus submissionStatus = SubmissionStatus.NOT_SUBMITTED;
    
    public enum ClaimStatus {
        DRAFT, READY_TO_SUBMIT, SUBMITTED, ACCEPTED, REJECTED, PAID, DENIED, APPEALED, CLOSED
    }
    
    public enum SubmissionStatus {
        NOT_SUBMITTED, SUBMITTED_TO_CLEARINGHOUSE, ACCEPTED_BY_CLEARINGHOUSE, 
        REJECTED_BY_CLEARINGHOUSE, SUBMITTED_TO_PAYER, ACCEPTED_BY_PAYER, 
        REJECTED_BY_PAYER, PAID, DENIED
    }
} 