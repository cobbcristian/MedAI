package com.aitelemedicine.telemedicine.repository;

import com.aitelemedicine.telemedicine.model.InsuranceInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InsuranceInfoRepository extends JpaRepository<InsuranceInfo, Long> {

    /**
     * Find all insurance info for a patient
     */
    List<InsuranceInfo> findByPatientIdOrderByIsPrimaryDescCreatedAtDesc(Long patientId);

    /**
     * Find primary insurance for a patient
     */
    Optional<InsuranceInfo> findByPatientIdAndIsPrimaryTrue(Long patientId);

    /**
     * Find active insurance info for a patient
     */
    List<InsuranceInfo> findByPatientIdAndStatus(InsuranceInfo.InsuranceStatus status);

    /**
     * Find insurance by provider name
     */
    List<InsuranceInfo> findByProviderNameContainingIgnoreCase(String providerName);

    /**
     * Find insurance by payer ID
     */
    List<InsuranceInfo> findByPayerId(String payerId);

    /**
     * Find insurance by member ID
     */
    Optional<InsuranceInfo> findByMemberId(String memberId);

    /**
     * Find insurance by group number
     */
    List<InsuranceInfo> findByGroupNumber(String groupNumber);

    /**
     * Find insurance by status
     */
    List<InsuranceInfo> findByStatus(InsuranceInfo.InsuranceStatus status);

    /**
     * Find insurance that expires within a certain date range
     */
    @Query("SELECT i FROM InsuranceInfo i WHERE i.expirationDate BETWEEN :startDate AND :endDate")
    List<InsuranceInfo> findExpiringInsurance(@Param("startDate") java.time.LocalDateTime startDate,
                                             @Param("endDate") java.time.LocalDateTime endDate);

    /**
     * Find insurance by patient and provider
     */
    Optional<InsuranceInfo> findByPatientIdAndProviderName(Long patientId, String providerName);

    /**
     * Count active insurance policies for a patient
     */
    long countByPatientIdAndStatus(InsuranceInfo.InsuranceStatus status);

    /**
     * Find insurance that needs verification
     */
    List<InsuranceInfo> findByStatusAndCreatedAtBefore(InsuranceInfo.InsuranceStatus status,
                                                       java.time.LocalDateTime date);

    /**
     * Find insurance by plan type
     */
    List<InsuranceInfo> findByPlanType(String planType);

    /**
     * Find insurance with authorization expiring soon
     */
    @Query("SELECT i FROM InsuranceInfo i WHERE i.authorizationDate IS NOT NULL AND i.authorizationDate < :date")
    List<InsuranceInfo> findInsuranceWithExpiringAuthorization(@Param("date") java.time.LocalDateTime date);
} 