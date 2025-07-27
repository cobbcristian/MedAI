package com.aitelemedicine.telemedicine.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "prescriptions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Prescription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private User patient;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doctor_id", nullable = false)
    private User doctor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "appointment_id")
    private Appointment appointment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "medication_id", nullable = false)
    private Medication medication;

    @Column(name = "dosage_strength", nullable = false)
    private String dosageStrength;

    @Column(name = "dosage_form", nullable = false)
    private String dosageForm;

    @Column(name = "frequency", nullable = false)
    private String frequency; // e.g., "twice daily", "every 8 hours"

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @Column(name = "days_supply")
    private Integer daysSupply;

    @Column(name = "instructions", columnDefinition = "TEXT")
    private String instructions;

    @Column(name = "diagnosis_code")
    private String diagnosisCode;

    @Column(name = "diagnosis_description")
    private String diagnosisDescription;

    @Column(name = "prescription_date", nullable = false)
    private LocalDateTime prescriptionDate;

    @Column(name = "expiration_date")
    private LocalDateTime expirationDate;

    @Column(name = "refills_remaining")
    private Integer refillsRemaining = 0;

    @Column(name = "refills_authorized")
    private Integer refillsAuthorized = 0;

    @Column(name = "prior_authorization_number")
    private String priorAuthorizationNumber;

    @Column(name = "prior_authorization_expiry")
    private LocalDateTime priorAuthorizationExpiry;

    @Column(name = "step_therapy_completed")
    private Boolean stepTherapyCompleted = false;

    @Column(name = "quantity_limit_override")
    private Boolean quantityLimitOverride = false;

    @Column(name = "cost_with_insurance")
    private BigDecimal costWithInsurance;

    @Column(name = "cost_without_insurance")
    private BigDecimal costWithoutInsurance;

    @Column(name = "copay_amount")
    private BigDecimal copayAmount;

    @Column(name = "coinsurance_amount")
    private BigDecimal coinsuranceAmount;

    @Column(name = "deductible_applied")
    private BigDecimal deductibleApplied;

    @Column(name = "insurance_coverage_status")
    @Enumerated(EnumType.STRING)
    private Medication.CoverageStatus insuranceCoverageStatus;

    @Column(name = "preferred_tier")
    private String preferredTier;

    @Column(name = "generic_substitution_allowed")
    private Boolean genericSubstitutionAllowed = true;

    @Column(name = "generic_substitution_made")
    private Boolean genericSubstitutionMade = false;

    @Column(name = "brand_name_dispensed")
    private String brandNameDispensed;

    @Column(name = "generic_name_dispensed")
    private String genericNameDispensed;

    @Column(name = "ndc_code")
    private String ndcCode;

    @Column(name = "pharmacy_notes", columnDefinition = "TEXT")
    private String pharmacyNotes;

    @Column(name = "patient_notes", columnDefinition = "TEXT")
    private String patientNotes;

    @Column(name = "doctor_notes", columnDefinition = "TEXT")
    private String doctorNotes;

    @Column(name = "allergy_check_passed")
    private Boolean allergyCheckPassed = true;

    @Column(name = "drug_interaction_check_passed")
    private Boolean drugInteractionCheckPassed = true;

    @Column(name = "clinical_appropriateness_score")
    private Double clinicalAppropriatenessScore;

    @Column(name = "cost_effectiveness_score")
    private Double costEffectivenessScore;

    @Column(name = "safety_score")
    private Double safetyScore;

    @Column(name = "overall_recommendation_score")
    private Double overallRecommendationScore;

    @Column(name = "recommendation_reasoning", columnDefinition = "TEXT")
    private String recommendationReasoning;

    @Column(name = "alternative_medications_considered", columnDefinition = "TEXT")
    private String alternativeMedicationsConsidered; // JSON array

    @Column(name = "clinical_guidelines_followed", columnDefinition = "TEXT")
    private String clinicalGuidelinesFollowed; // JSON array

    @Column(name = "evidence_level")
    private String evidenceLevel;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "created_by")
    private String createdBy;

    @Column(name = "updated_by")
    private String updatedBy;

    // Enums for prescription status
    public enum PrescriptionStatus {
        DRAFT, ACTIVE, DISPENSED, COMPLETED, DISCONTINUED, EXPIRED, CANCELLED
    }

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private PrescriptionStatus status = PrescriptionStatus.DRAFT;

    // Enums for prescription type
    public enum PrescriptionType {
        NEW, REFILL, TRANSFER, EMERGENCY, DISPENSE_AS_WRITTEN
    }

    @Enumerated(EnumType.STRING)
    @Column(name = "prescription_type", nullable = false)
    private PrescriptionType prescriptionType = PrescriptionType.NEW;

    // Enums for urgency
    public enum UrgencyLevel {
        ROUTINE, URGENT, STAT, EMERGENCY
    }

    @Enumerated(EnumType.STRING)
    @Column(name = "urgency_level", nullable = false)
    private UrgencyLevel urgencyLevel = UrgencyLevel.ROUTINE;

    // Enums for dispensing status
    public enum DispensingStatus {
        PENDING, DISPENSED, PARTIALLY_DISPENSED, CANCELLED, ON_HOLD
    }

    @Enumerated(EnumType.STRING)
    @Column(name = "dispensing_status")
    private DispensingStatus dispensingStatus = DispensingStatus.PENDING;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        prescriptionDate = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
} 