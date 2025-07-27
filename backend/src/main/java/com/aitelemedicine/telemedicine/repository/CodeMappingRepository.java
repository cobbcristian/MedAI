package com.aitelemedicine.telemedicine.repository;

import com.aitelemedicine.telemedicine.model.CodeMapping;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CodeMappingRepository extends JpaRepository<CodeMapping, Long> {

    /**
     * Find mappings by appointment type
     */
    List<CodeMapping> findByAppointmentTypeAndIsActiveTrueOrderByPriorityDesc(String appointmentType);

    /**
     * Find mappings by AI diagnosis
     */
    List<CodeMapping> findByAiDiagnosisContainingAndIsActiveTrueOrderByPriorityDesc(String aiDiagnosis);

    /**
     * Find mappings by manual diagnosis
     */
    List<CodeMapping> findByManualDiagnosisContainingAndIsActiveTrueOrderByPriorityDesc(String manualDiagnosis);

    /**
     * Find mappings by CPT code
     */
    List<CodeMapping> findByCptCodeAndIsActiveTrue(String cptCode);

    /**
     * Find mappings by ICD-10 code
     */
    List<CodeMapping> findByIcd10CodeAndIsActiveTrue(String icd10Code);

    /**
     * Find mappings by status
     */
    List<CodeMapping> findByStatus(CodeMapping.MappingStatus status);

    /**
     * Find active mappings
     */
    List<CodeMapping> findByIsActiveTrueOrderByPriorityDesc();

    /**
     * Find mappings by priority
     */
    List<CodeMapping> findByPriorityOrderByPriorityDesc(Integer priority);

    /**
     * Find mappings by created by
     */
    List<CodeMapping> findByCreatedByOrderByCreatedAtDesc(String createdBy);

    /**
     * Find mappings by approved by
     */
    List<CodeMapping> findByApprovedByOrderByApprovalDateDesc(String approvedBy);

    /**
     * Find mappings by appointment type and status
     */
    List<CodeMapping> findByAppointmentTypeAndStatus(String appointmentType, CodeMapping.MappingStatus status);

    /**
     * Find mappings by CPT and ICD-10 codes
     */
    Optional<CodeMapping> findByCptCodeAndIcd10CodeAndIsActiveTrue(String cptCode, String icd10Code);

    /**
     * Find mappings by appointment type and AI diagnosis
     */
    Optional<CodeMapping> findByAppointmentTypeAndAiDiagnosisAndIsActiveTrue(String appointmentType, String aiDiagnosis);

    /**
     * Find mappings by appointment type and manual diagnosis
     */
    Optional<CodeMapping> findByAppointmentTypeAndManualDiagnosisAndIsActiveTrue(String appointmentType, String manualDiagnosis);

    /**
     * Find mappings by place of service
     */
    List<CodeMapping> findByPlaceOfServiceAndIsActiveTrue(String placeOfService);

    /**
     * Find mappings by modifier
     */
    @Query("SELECT c FROM CodeMapping c WHERE c.modifier1 = :modifier OR c.modifier2 = :modifier OR c.modifier3 = :modifier OR c.modifier4 = :modifier")
    List<CodeMapping> findByModifier(@Param("modifier") String modifier);

    /**
     * Find mappings by billed amount range
     */
    @Query("SELECT c FROM CodeMapping c WHERE c.defaultBilledAmount BETWEEN :minAmount AND :maxAmount")
    List<CodeMapping> findByBilledAmountRange(@Param("minAmount") java.math.BigDecimal minAmount,
                                             @Param("maxAmount") java.math.BigDecimal maxAmount);

    /**
     * Find mappings by allowed amount range
     */
    @Query("SELECT c FROM CodeMapping c WHERE c.typicalAllowedAmount BETWEEN :minAmount AND :maxAmount")
    List<CodeMapping> findByAllowedAmountRange(@Param("minAmount") java.math.BigDecimal minAmount,
                                              @Param("maxAmount") java.math.BigDecimal maxAmount);



    /**
     * Count mappings by status
     */
    long countByStatus(CodeMapping.MappingStatus status);

    /**
     * Count active mappings
     */
    long countByIsActiveTrue();

    /**
     * Count mappings by appointment type
     */
    long countByAppointmentType(String appointmentType);

    /**
     * Find mappings by priority range
     */
    List<CodeMapping> findByPriorityBetweenOrderByPriorityDesc(Integer minPriority, Integer maxPriority);

    /**
     * Find mappings with notes
     */
    List<CodeMapping> findByNotesIsNotNull();

    /**
     * Find mappings by created by and status
     */
    List<CodeMapping> findByCreatedByAndStatus(String createdBy, CodeMapping.MappingStatus status);

    /**
     * Find mappings by approved by and status
     */
    List<CodeMapping> findByApprovedByAndStatus(String approvedBy, CodeMapping.MappingStatus status);

    /**
     * Find mappings by units
     */
    List<CodeMapping> findByUnitsAndIsActiveTrue(Integer units);

    /**
     * Find mappings by CPT description
     */
    List<CodeMapping> findByCptDescriptionContainingIgnoreCaseAndIsActiveTrue(String cptDescription);

    /**
     * Find mappings by ICD-10 description
     */
    List<CodeMapping> findByIcd10DescriptionContainingIgnoreCaseAndIsActiveTrue(String icd10Description);
} 