package com.aitelemedicine.telemedicine.repository;

import com.aitelemedicine.telemedicine.model.InsuranceClaim;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface InsuranceClaimRepository extends JpaRepository<InsuranceClaim, Long> {

    /**
     * Find claims by appointment
     */
    List<InsuranceClaim> findByAppointmentIdOrderByCreatedAtDesc(Long appointmentId);

    /**
     * Find claims by patient
     */
    List<InsuranceClaim> findByPatientIdOrderByCreatedAtDesc(Long patientId);

    /**
     * Find claims by doctor
     */
    List<InsuranceClaim> findByDoctorIdOrderByCreatedAtDesc(Long doctorId);

    /**
     * Find claims by status
     */
    List<InsuranceClaim> findByStatus(InsuranceClaim.ClaimStatus status);

    /**
     * Find claims by submission status
     */
    List<InsuranceClaim> findBySubmissionStatus(InsuranceClaim.SubmissionStatus submissionStatus);

    /**
     * Find claims by claim number
     */
    Optional<InsuranceClaim> findByClaimNumber(String claimNumber);

    /**
     * Find claims by control number
     */
    Optional<InsuranceClaim> findByControlNumber(String controlNumber);

    /**
     * Find claims by service date range
     */
    List<InsuranceClaim> findByServiceDateBetweenOrderByServiceDateDesc(LocalDateTime startDate, LocalDateTime endDate);

    /**
     * Find claims by claim date range
     */
    List<InsuranceClaim> findByClaimDateBetweenOrderByClaimDateDesc(LocalDateTime startDate, LocalDateTime endDate);

    /**
     * Find claims by CPT code
     */
    List<InsuranceClaim> findByCptCode(String cptCode);

    /**
     * Find claims by ICD-10 code
     */
    List<InsuranceClaim> findByIcd10Code(String icd10Code);

    /**
     * Find claims by insurance info
     */
    List<InsuranceClaim> findByInsuranceInfoIdOrderByCreatedAtDesc(Long insuranceInfoId);

    /**
     * Find claims that need submission
     */
    List<InsuranceClaim> findByStatusAndSubmissionStatus(InsuranceClaim.ClaimStatus status, 
                                                        InsuranceClaim.SubmissionStatus submissionStatus);

    /**
     * Find claims with rejection reasons
     */
    List<InsuranceClaim> findByRejectionReasonIsNotNull();

    /**
     * Find claims by billed amount range
     */
    @Query("SELECT c FROM InsuranceClaim c WHERE c.billedAmount BETWEEN :minAmount AND :maxAmount")
    List<InsuranceClaim> findByBilledAmountRange(@Param("minAmount") java.math.BigDecimal minAmount,
                                                @Param("maxAmount") java.math.BigDecimal maxAmount);

    /**
     * Find claims by paid amount range
     */
    @Query("SELECT c FROM InsuranceClaim c WHERE c.paidAmount BETWEEN :minAmount AND :maxAmount")
    List<InsuranceClaim> findByPaidAmountRange(@Param("minAmount") java.math.BigDecimal minAmount,
                                              @Param("maxAmount") java.math.BigDecimal maxAmount);

    /**
     * Find claims with appeal deadlines approaching
     */
    @Query("SELECT c FROM InsuranceClaim c WHERE c.appealDeadline IS NOT NULL AND c.appealDeadline BETWEEN :startDate AND :endDate")
    List<InsuranceClaim> findClaimsWithAppealDeadlines(@Param("startDate") LocalDateTime startDate,
                                                       @Param("endDate") LocalDateTime endDate);

    /**
     * Count claims by status
     */
    long countByStatus(InsuranceClaim.ClaimStatus status);

    /**
     * Count claims by submission status
     */
    long countBySubmissionStatus(InsuranceClaim.SubmissionStatus submissionStatus);

    /**
     * Find claims by patient and status
     */
    List<InsuranceClaim> findByPatientIdAndStatus(Long patientId, InsuranceClaim.ClaimStatus status);

    /**
     * Find claims by doctor and status
     */
    List<InsuranceClaim> findByDoctorIdAndStatus(Long doctorId, InsuranceClaim.ClaimStatus status);

    /**
     * Find claims by appointment and status
     */
    List<InsuranceClaim> findByAppointmentIdAndStatus(Long appointmentId, InsuranceClaim.ClaimStatus status);

    /**
     * Find claims submitted within date range
     */
    List<InsuranceClaim> findBySubmissionDateBetweenOrderBySubmissionDateDesc(LocalDateTime startDate, LocalDateTime endDate);

    /**
     * Find claims with responses within date range
     */
    List<InsuranceClaim> findByResponseDateBetweenOrderByResponseDateDesc(LocalDateTime startDate, LocalDateTime endDate);

    /**
     * Find claims by rendering provider NPI
     */
    List<InsuranceClaim> findByRenderingProviderNpi(String renderingProviderNpi);

    /**
     * Find claims by billing provider NPI
     */
    List<InsuranceClaim> findByBillingProviderNpi(String billingProviderNpi);

    /**
     * Find claims with prior authorization
     */
    List<InsuranceClaim> findByPriorAuthorizationIsNotNull();

    /**
     * Find claims by place of service
     */
    List<InsuranceClaim> findByPlaceOfService(String placeOfService);
} 