package com.aitelemedicine.telemedicine.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "medications")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = true)
public class Medication extends BaseEntity {

    @Column(name = "generic_name", nullable = false)
    private String genericName;

    @Column(name = "brand_name")
    private String brandName;

    @Column(name = "drug_class", nullable = false)
    private String drugClass;

    @Column(name = "therapeutic_category")
    private String therapeuticCategory;

    @Column(name = "mechanism_of_action", columnDefinition = "TEXT")
    private String mechanismOfAction;

    @Column(name = "indications", columnDefinition = "TEXT")
    private String indications;

    @Column(name = "contraindications", columnDefinition = "TEXT")
    private String contraindications;

    @Column(name = "side_effects", columnDefinition = "TEXT")
    private String sideEffects;

    @Column(name = "dosage_forms")
    private String dosageForms; // JSON array of available forms

    @Column(name = "strengths")
    private String strengths; // JSON array of available strengths

    @Column(name = "typical_dosage", columnDefinition = "TEXT")
    private String typicalDosage;

    @Column(name = "duration_of_treatment")
    private String durationOfTreatment;

    @Column(name = "cost_generic")
    private BigDecimal costGeneric;

    @Column(name = "cost_brand")
    private BigDecimal costBrand;

    @Column(name = "requires_prescription")
    private Boolean requiresPrescription = true;

    @Column(name = "controlled_substance")
    private Boolean controlledSubstance = false;

    @Column(name = "schedule")
    private String schedule; // I, II, III, IV, V, or null

    @Column(name = "fda_approved")
    private Boolean fdaApproved = true;

    @Column(name = "approval_date")
    private LocalDateTime approvalDate;

    @Column(name = "patent_expiry")
    private LocalDateTime patentExpiry;

    @Column(name = "generic_available")
    private Boolean genericAvailable = false;

    @Column(name = "otc_available")
    private Boolean otcAvailable = false;

    @Column(name = "pregnancy_category")
    private String pregnancyCategory; // A, B, C, D, X

    @Column(name = "breastfeeding_safe")
    private Boolean breastfeedingSafe;

    @Column(name = "pediatric_safe")
    private Boolean pediatricSafe;

    @Column(name = "geriatric_safe")
    private Boolean geriatricSafe;

    @Column(name = "renal_dose_adjustment")
    private Boolean renalDoseAdjustment;

    @Column(name = "hepatic_dose_adjustment")
    private Boolean hepaticDoseAdjustment;

    @Column(name = "drug_interactions", columnDefinition = "TEXT")
    private String drugInteractions; // JSON array of interactions

    @Column(name = "allergy_contraindications", columnDefinition = "TEXT")
    private String allergyContraindications; // JSON array of allergy contraindications

    @Column(name = "symptom_indicators", columnDefinition = "TEXT")
    private String symptomIndicators; // JSON array of symptoms this treats

    @Column(name = "alternative_medications", columnDefinition = "TEXT")
    private String alternativeMedications; // JSON array of alternative drug IDs

    @Column(name = "insurance_coverage", columnDefinition = "TEXT")
    private String insuranceCoverage; // JSON object with insurance coverage details

    @Column(name = "prior_authorization_required")
    private Boolean priorAuthorizationRequired = false;

    @Column(name = "step_therapy_required")
    private Boolean stepTherapyRequired = false;

    @Column(name = "quantity_limit")
    private Integer quantityLimit;

    @Column(name = "refill_limit")
    private Integer refillLimit;

    @Column(name = "preferred_tier")
    private String preferredTier; // Tier 1, 2, 3, 4, or Non-Preferred

    @Column(name = "copay_amount")
    private BigDecimal copayAmount;

    @Column(name = "coinsurance_percentage")
    private BigDecimal coinsurancePercentage;

    @Column(name = "deductible_applies")
    private Boolean deductibleApplies = true;

    @Column(name = "max_benefit_amount")
    private BigDecimal maxBenefitAmount;

    @Column(name = "prior_authorization_criteria", columnDefinition = "TEXT")
    private String priorAuthorizationCriteria;

    @Column(name = "step_therapy_criteria", columnDefinition = "TEXT")
    private String stepTherapyCriteria;

    @Column(name = "clinical_effectiveness_score")
    private Double clinicalEffectivenessScore;

    @Column(name = "cost_effectiveness_score")
    private Double costEffectivenessScore;

    @Column(name = "safety_score")
    private Double safetyScore;

    @Column(name = "overall_recommendation_score")
    private Double overallRecommendationScore;

    @Column(name = "evidence_level")
    private String evidenceLevel; // A, B, C, D

    @Column(name = "clinical_guidelines", columnDefinition = "TEXT")
    private String clinicalGuidelines; // JSON array of guideline references

    @Column(name = "studies_references", columnDefinition = "TEXT")
    private String studiesReferences; // JSON array of study references

    @Column(name = "last_updated")
    private LocalDateTime lastUpdated;

    @Column(name = "data_source")
    private String dataSource; // FDA, ClinicalTrials.gov, etc.

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    // Enums for status management
    public enum MedicationStatus {
        ACTIVE, INACTIVE, DISCONTINUED, RECALLED, INVESTIGATIONAL
    }

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private MedicationStatus status = MedicationStatus.ACTIVE;

    // Enums for availability
    public enum AvailabilityStatus {
        AVAILABLE, SHORTAGE, BACKORDER, DISCONTINUED
    }

    @Enumerated(EnumType.STRING)
    @Column(name = "availability_status")
    private AvailabilityStatus availabilityStatus = AvailabilityStatus.AVAILABLE;

    // Enums for insurance coverage
    public enum CoverageStatus {
        COVERED, NOT_COVERED, PRIOR_AUTH_REQUIRED, STEP_THERAPY_REQUIRED, QUANTITY_LIMIT
    }

    @Enumerated(EnumType.STRING)
    @Column(name = "coverage_status")
    private CoverageStatus coverageStatus = CoverageStatus.COVERED;
} 