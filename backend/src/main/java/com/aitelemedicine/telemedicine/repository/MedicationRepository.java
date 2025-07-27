package com.aitelemedicine.telemedicine.repository;

import com.aitelemedicine.telemedicine.model.Medication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface MedicationRepository extends JpaRepository<Medication, Long> {

    /**
     * Find medications by generic name
     */
    List<Medication> findByGenericNameContainingIgnoreCase(String genericName);

    /**
     * Find medications by brand name
     */
    List<Medication> findByBrandNameContainingIgnoreCase(String brandName);

    /**
     * Find medications by drug class
     */
    List<Medication> findByDrugClassContainingIgnoreCase(String drugClass);

    /**
     * Find medications by therapeutic category
     */
    List<Medication> findByTherapeuticCategoryContainingIgnoreCase(String therapeuticCategory);

    /**
     * Find medications by symptom indicators
     */
    List<Medication> findBySymptomIndicatorsContainingIgnoreCase(String symptom);

    /**
     * Find medications by indications
     */
    List<Medication> findByIndicationsContainingIgnoreCase(String indication);

    /**
     * Find medications by status
     */
    List<Medication> findByStatus(Medication.MedicationStatus status);

    /**
     * Find active medications
     */
    List<Medication> findByIsActiveTrue();

    /**
     * Find medications by availability status
     */
    List<Medication> findByAvailabilityStatus(Medication.AvailabilityStatus availabilityStatus);

    /**
     * Find medications by coverage status
     */
    List<Medication> findByCoverageStatus(Medication.CoverageStatus coverageStatus);

    /**
     * Find medications by FDA approval status
     */
    List<Medication> findByFdaApproved(Boolean fdaApproved);

    /**
     * Find medications by controlled substance status
     */
    List<Medication> findByControlledSubstance(Boolean controlledSubstance);

    /**
     * Find medications by schedule
     */
    List<Medication> findBySchedule(String schedule);

    /**
     * Find medications by generic availability
     */
    List<Medication> findByGenericAvailable(Boolean genericAvailable);

    /**
     * Find medications by OTC availability
     */
    List<Medication> findByOtcAvailable(Boolean otcAvailable);

    /**
     * Find medications by pregnancy category
     */
    List<Medication> findByPregnancyCategory(String pregnancyCategory);

    /**
     * Find medications safe for breastfeeding
     */
    List<Medication> findByBreastfeedingSafe(Boolean breastfeedingSafe);

    /**
     * Find medications safe for pediatric use
     */
    List<Medication> findByPediatricSafe(Boolean pediatricSafe);

    /**
     * Find medications safe for geriatric use
     */
    List<Medication> findByGeriatricSafe(Boolean geriatricSafe);

    /**
     * Find medications requiring renal dose adjustment
     */
    List<Medication> findByRenalDoseAdjustment(Boolean renalDoseAdjustment);

    /**
     * Find medications requiring hepatic dose adjustment
     */
    List<Medication> findByHepaticDoseAdjustment(Boolean hepaticDoseAdjustment);

    /**
     * Find medications by preferred tier
     */
    List<Medication> findByPreferredTier(String preferredTier);

    /**
     * Find medications requiring prior authorization
     */
    List<Medication> findByPriorAuthorizationRequired(Boolean priorAuthorizationRequired);

    /**
     * Find medications requiring step therapy
     */
    List<Medication> findByStepTherapyRequired(Boolean stepTherapyRequired);

    /**
     * Find medications by evidence level
     */
    List<Medication> findByEvidenceLevel(String evidenceLevel);

    /**
     * Find medications by cost range
     */
    @Query("SELECT m FROM Medication m WHERE m.costGeneric BETWEEN :minCost AND :maxCost OR m.costBrand BETWEEN :minCost AND :maxCost")
    List<Medication> findByCostRange(@Param("minCost") BigDecimal minCost, @Param("maxCost") BigDecimal maxCost);

    /**
     * Find medications by clinical effectiveness score range
     */
    @Query("SELECT m FROM Medication m WHERE m.clinicalEffectivenessScore BETWEEN :minScore AND :maxScore")
    List<Medication> findByClinicalEffectivenessScoreRange(@Param("minScore") Double minScore, @Param("maxScore") Double maxScore);

    /**
     * Find medications by cost effectiveness score range
     */
    @Query("SELECT m FROM Medication m WHERE m.costEffectivenessScore BETWEEN :minScore AND :maxScore")
    List<Medication> findByCostEffectivenessScoreRange(@Param("minScore") Double minScore, @Param("maxScore") Double maxScore);

    /**
     * Find medications by safety score range
     */
    @Query("SELECT m FROM Medication m WHERE m.safetyScore BETWEEN :minScore AND :maxScore")
    List<Medication> findBySafetyScoreRange(@Param("minScore") Double minScore, @Param("maxScore") Double maxScore);

    /**
     * Find medications by overall recommendation score range
     */
    @Query("SELECT m FROM Medication m WHERE m.overallRecommendationScore BETWEEN :minScore AND :maxScore")
    List<Medication> findByOverallRecommendationScoreRange(@Param("minScore") Double minScore, @Param("maxScore") Double maxScore);

    /**
     * Find medications by approval date range
     */
    List<Medication> findByApprovalDateBetween(LocalDateTime startDate, LocalDateTime endDate);

    /**
     * Find medications by last updated date range
     */
    List<Medication> findByLastUpdatedBetween(LocalDateTime startDate, LocalDateTime endDate);

    /**
     * Find medications by data source
     */
    List<Medication> findByDataSource(String dataSource);

    /**
     * Find medications by notes containing
     */
    List<Medication> findByNotesContainingIgnoreCase(String notes);

    /**
     * Find medications by mechanism of action containing
     */
    List<Medication> findByMechanismOfActionContainingIgnoreCase(String mechanismOfAction);

    /**
     * Find medications by contraindications containing
     */
    List<Medication> findByContraindicationsContainingIgnoreCase(String contraindications);

    /**
     * Find medications by side effects containing
     */
    List<Medication> findBySideEffectsContainingIgnoreCase(String sideEffects);

    /**
     * Find medications by typical dosage containing
     */
    List<Medication> findByTypicalDosageContainingIgnoreCase(String typicalDosage);

    /**
     * Find medications by duration of treatment containing
     */
    List<Medication> findByDurationOfTreatmentContainingIgnoreCase(String durationOfTreatment);

    /**
     * Find medications by dosage forms containing
     */
    List<Medication> findByDosageFormsContainingIgnoreCase(String dosageForms);

    /**
     * Find medications by strengths containing
     */
    List<Medication> findByStrengthsContainingIgnoreCase(String strengths);

    /**
     * Find medications by drug interactions containing
     */
    List<Medication> findByDrugInteractionsContainingIgnoreCase(String drugInteractions);

    /**
     * Find medications by allergy contraindications containing
     */
    List<Medication> findByAllergyContraindicationsContainingIgnoreCase(String allergyContraindications);

    /**
     * Find medications by alternative medications containing
     */
    List<Medication> findByAlternativeMedicationsContainingIgnoreCase(String alternativeMedications);

    /**
     * Find medications by insurance coverage containing
     */
    List<Medication> findByInsuranceCoverageContainingIgnoreCase(String insuranceCoverage);

    /**
     * Find medications by prior authorization criteria containing
     */
    List<Medication> findByPriorAuthorizationCriteriaContainingIgnoreCase(String priorAuthorizationCriteria);

    /**
     * Find medications by step therapy criteria containing
     */
    List<Medication> findByStepTherapyCriteriaContainingIgnoreCase(String stepTherapyCriteria);

    /**
     * Find medications by clinical guidelines containing
     */
    List<Medication> findByClinicalGuidelinesContainingIgnoreCase(String clinicalGuidelines);

    /**
     * Find medications by studies references containing
     */
    List<Medication> findByStudiesReferencesContainingIgnoreCase(String studiesReferences);

    /**
     * Count medications by status
     */
    long countByStatus(Medication.MedicationStatus status);

    /**
     * Count active medications
     */
    long countByIsActiveTrue();

    /**
     * Count medications by availability status
     */
    long countByAvailabilityStatus(Medication.AvailabilityStatus availabilityStatus);

    /**
     * Count medications by coverage status
     */
    long countByCoverageStatus(Medication.CoverageStatus coverageStatus);

    /**
     * Count medications by FDA approval status
     */
    long countByFdaApproved(Boolean fdaApproved);

    /**
     * Count medications by controlled substance status
     */
    long countByControlledSubstance(Boolean controlledSubstance);

    /**
     * Count medications by generic availability
     */
    long countByGenericAvailable(Boolean genericAvailable);

    /**
     * Count medications by OTC availability
     */
    long countByOtcAvailable(Boolean otcAvailable);

    /**
     * Count medications by pregnancy category
     */
    long countByPregnancyCategory(String pregnancyCategory);

    /**
     * Count medications by preferred tier
     */
    long countByPreferredTier(String preferredTier);

    /**
     * Count medications by evidence level
     */
    long countByEvidenceLevel(String evidenceLevel);

    /**
     * Count medications by drug class
     */
    long countByDrugClass(String drugClass);

    /**
     * Count medications by therapeutic category
     */
    long countByTherapeuticCategory(String therapeuticCategory);

    /**
     * Find medications by status and availability status
     */
    List<Medication> findByStatusAndAvailabilityStatus(Medication.MedicationStatus status, Medication.AvailabilityStatus availabilityStatus);

    /**
     * Find medications by status and coverage status
     */
    List<Medication> findByStatusAndCoverageStatus(Medication.MedicationStatus status, Medication.CoverageStatus coverageStatus);

    /**
     * Find medications by generic availability and OTC availability
     */
    List<Medication> findByGenericAvailableAndOtcAvailable(Boolean genericAvailable, Boolean otcAvailable);

    /**
     * Find medications by controlled substance and schedule
     */
    List<Medication> findByControlledSubstanceAndSchedule(Boolean controlledSubstance, String schedule);

    /**
     * Find medications by pregnancy category and breastfeeding safe
     */
    List<Medication> findByPregnancyCategoryAndBreastfeedingSafe(String pregnancyCategory, Boolean breastfeedingSafe);

    /**
     * Find medications by pediatric safe and geriatric safe
     */
    List<Medication> findByPediatricSafeAndGeriatricSafe(Boolean pediatricSafe, Boolean geriatricSafe);

    /**
     * Find medications by renal dose adjustment and hepatic dose adjustment
     */
    List<Medication> findByRenalDoseAdjustmentAndHepaticDoseAdjustment(Boolean renalDoseAdjustment, Boolean hepaticDoseAdjustment);

    /**
     * Find medications by preferred tier and prior authorization required
     */
    List<Medication> findByPreferredTierAndPriorAuthorizationRequired(String preferredTier, Boolean priorAuthorizationRequired);

    /**
     * Find medications by evidence level and clinical effectiveness score range
     */
    @Query("SELECT m FROM Medication m WHERE m.evidenceLevel = :evidenceLevel AND m.clinicalEffectivenessScore BETWEEN :minScore AND :maxScore")
    List<Medication> findByEvidenceLevelAndClinicalEffectivenessScoreRange(
        @Param("evidenceLevel") String evidenceLevel,
        @Param("minScore") Double minScore,
        @Param("maxScore") Double maxScore
    );

    /**
     * Find medications by cost range and safety score range
     */
    @Query("SELECT m FROM Medication m WHERE (m.costGeneric BETWEEN :minCost AND :maxCost OR m.costBrand BETWEEN :minCost AND :maxCost) AND m.safetyScore BETWEEN :minScore AND :maxScore")
    List<Medication> findByCostRangeAndSafetyScoreRange(
        @Param("minCost") BigDecimal minCost,
        @Param("maxCost") BigDecimal maxCost,
        @Param("minScore") Double minScore,
        @Param("maxScore") Double maxScore
    );

    /**
     * Find medications by overall recommendation score range and status
     */
    @Query("SELECT m FROM Medication m WHERE m.overallRecommendationScore BETWEEN :minScore AND :maxScore AND m.status = :status")
    List<Medication> findByOverallRecommendationScoreRangeAndStatus(
        @Param("minScore") Double minScore,
        @Param("maxScore") Double maxScore,
        @Param("status") Medication.MedicationStatus status
    );

    /**
     * Find medications by approval date range and FDA approval status
     */
    List<Medication> findByApprovalDateBetweenAndFdaApproved(LocalDateTime startDate, LocalDateTime endDate, Boolean fdaApproved);

    /**
     * Find medications by last updated date range and is active
     */
    List<Medication> findByLastUpdatedBetweenAndIsActive(LocalDateTime startDate, LocalDateTime endDate, Boolean isActive);

    /**
     * Find medications by data source and status
     */
    List<Medication> findByDataSourceAndStatus(String dataSource, Medication.MedicationStatus status);

    /**
     * Find medications by notes containing and is active
     */
    List<Medication> findByNotesContainingIgnoreCaseAndIsActive(String notes, Boolean isActive);

    /**
     * Find medications by mechanism of action containing and FDA approved
     */
    List<Medication> findByMechanismOfActionContainingIgnoreCaseAndFdaApproved(String mechanismOfAction, Boolean fdaApproved);

    /**
     * Find medications by contraindications containing and controlled substance
     */
    List<Medication> findByContraindicationsContainingIgnoreCaseAndControlledSubstance(String contraindications, Boolean controlledSubstance);

    /**
     * Find medications by side effects containing and safety score range
     */
    @Query("SELECT m FROM Medication m WHERE m.sideEffects LIKE %:sideEffects% AND m.safetyScore BETWEEN :minScore AND :maxScore")
    List<Medication> findBySideEffectsContainingIgnoreCaseAndSafetyScoreRange(
        @Param("sideEffects") String sideEffects,
        @Param("minScore") Double minScore,
        @Param("maxScore") Double maxScore
    );

    /**
     * Find medications by typical dosage containing and evidence level
     */
    List<Medication> findByTypicalDosageContainingIgnoreCaseAndEvidenceLevel(String typicalDosage, String evidenceLevel);

    /**
     * Find medications by duration of treatment containing and preferred tier
     */
    List<Medication> findByDurationOfTreatmentContainingIgnoreCaseAndPreferredTier(String durationOfTreatment, String preferredTier);

    /**
     * Find medications by dosage forms containing and generic available
     */
    List<Medication> findByDosageFormsContainingIgnoreCaseAndGenericAvailable(String dosageForms, Boolean genericAvailable);

    /**
     * Find medications by strengths containing and OTC available
     */
    List<Medication> findByStrengthsContainingIgnoreCaseAndOtcAvailable(String strengths, Boolean otcAvailable);

    /**
     * Find medications by drug interactions containing and clinical effectiveness score range
     */
    @Query("SELECT m FROM Medication m WHERE m.drugInteractions LIKE %:drugInteractions% AND m.clinicalEffectivenessScore BETWEEN :minScore AND :maxScore")
    List<Medication> findByDrugInteractionsContainingIgnoreCaseAndClinicalEffectivenessScoreRange(
        @Param("drugInteractions") String drugInteractions,
        @Param("minScore") Double minScore,
        @Param("maxScore") Double maxScore
    );

    /**
     * Find medications by allergy contraindications containing and safety score range
     */
    @Query("SELECT m FROM Medication m WHERE m.allergyContraindications LIKE %:allergyContraindications% AND m.safetyScore BETWEEN :minScore AND :maxScore")
    List<Medication> findByAllergyContraindicationsContainingIgnoreCaseAndSafetyScoreRange(
        @Param("allergyContraindications") String allergyContraindications,
        @Param("minScore") Double minScore,
        @Param("maxScore") Double maxScore
    );

    /**
     * Find medications by alternative medications containing and cost effectiveness score range
     */
    @Query("SELECT m FROM Medication m WHERE m.alternativeMedications LIKE %:alternativeMedications% AND m.costEffectivenessScore BETWEEN :minScore AND :maxScore")
    List<Medication> findByAlternativeMedicationsContainingIgnoreCaseAndCostEffectivenessScoreRange(
        @Param("alternativeMedications") String alternativeMedications,
        @Param("minScore") Double minScore,
        @Param("maxScore") Double maxScore
    );

    /**
     * Find medications by insurance coverage containing and coverage status
     */
    List<Medication> findByInsuranceCoverageContainingIgnoreCaseAndCoverageStatus(String insuranceCoverage, Medication.CoverageStatus coverageStatus);

    /**
     * Find medications by prior authorization criteria containing and prior authorization required
     */
    List<Medication> findByPriorAuthorizationCriteriaContainingIgnoreCaseAndPriorAuthorizationRequired(String priorAuthorizationCriteria, Boolean priorAuthorizationRequired);

    /**
     * Find medications by step therapy criteria containing and step therapy required
     */
    List<Medication> findByStepTherapyCriteriaContainingIgnoreCaseAndStepTherapyRequired(String stepTherapyCriteria, Boolean stepTherapyRequired);

    /**
     * Find medications by clinical guidelines containing and evidence level
     */
    List<Medication> findByClinicalGuidelinesContainingIgnoreCaseAndEvidenceLevel(String clinicalGuidelines, String evidenceLevel);

    /**
     * Find medications by studies references containing and FDA approved
     */
    List<Medication> findByStudiesReferencesContainingIgnoreCaseAndFdaApproved(String studiesReferences, Boolean fdaApproved);
} 