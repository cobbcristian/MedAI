package com.aitelemedicine.telemedicine.repository;

import com.aitelemedicine.telemedicine.model.Consent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ConsentRepository extends JpaRepository<Consent, Long> {

    /**
     * Find consents by patient
     */
    List<Consent> findByPatientIdOrderByCreatedAtDesc(Long patientId);

    /**
     * Find consents by witness
     */
    List<Consent> findByWitnessIdOrderByCreatedAtDesc(Long witnessId);

    /**
     * Find consents by type
     */
    List<Consent> findByConsentTypeOrderByCreatedAtDesc(String consentType);

    /**
     * Find consents by status
     */
    List<Consent> findByStatus(Consent.ConsentStatus status);

    /**
     * Find consents by compliance level
     */
    List<Consent> findByComplianceLevel(Consent.ComplianceLevel complianceLevel);

    /**
     * Find active consents by patient
     */
    List<Consent> findByPatientIdAndStatus(Long patientId, Consent.ConsentStatus status);

    /**
     * Find active consents by patient and type
     */
    List<Consent> findByPatientIdAndConsentTypeAndStatus(Long patientId, String consentType, Consent.ConsentStatus status);

    /**
     * Find consents by version
     */
    List<Consent> findByConsentVersionOrderByCreatedAtDesc(String consentVersion);

    /**
     * Find consents by language
     */
    List<Consent> findByLanguageOrderByCreatedAtDesc(String language);

    /**
     * Find consents by consent date range
     */
    List<Consent> findByConsentDateBetweenOrderByConsentDateDesc(LocalDateTime startDate, LocalDateTime endDate);

    /**
     * Find consents by expiration date range
     */
    List<Consent> findByExpirationDateBetweenOrderByExpirationDateDesc(LocalDateTime startDate, LocalDateTime endDate);

    /**
     * Find consents by revocation date range
     */
    List<Consent> findByRevocationDateBetweenOrderByRevocationDateDesc(LocalDateTime startDate, LocalDateTime endDate);

    /**
     * Find consents by signature timestamp range
     */
    List<Consent> findBySignatureTimestampBetweenOrderBySignatureTimestampDesc(LocalDateTime startDate, LocalDateTime endDate);

    /**
     * Find consents by IP address
     */
    List<Consent> findByIpAddressOrderByCreatedAtDesc(String ipAddress);

    /**
     * Find consents by location
     */
    List<Consent> findByLocationOrderByCreatedAtDesc(String location);

    /**
     * Find consents with accessibility mode
     */
    List<Consent> findByAccessibilityModeTrue();

    /**
     * Find consents by patient and witness
     */
    List<Consent> findByPatientIdAndWitnessIdOrderByCreatedAtDesc(Long patientId, Long witnessId);

    /**
     * Find consents by patient and type
     */
    List<Consent> findByPatientIdAndConsentTypeOrderByCreatedAtDesc(Long patientId, String consentType);

    /**
     * Find consents by patient and compliance level
     */
    List<Consent> findByPatientIdAndComplianceLevelOrderByCreatedAtDesc(Long patientId, Consent.ComplianceLevel complianceLevel);

    /**
     * Find consents by witness and status
     */
    List<Consent> findByWitnessIdAndStatus(Long witnessId, Consent.ConsentStatus status);

    /**
     * Find consents by type and status
     */
    List<Consent> findByConsentTypeAndStatus(String consentType, Consent.ConsentStatus status);

    /**
     * Find consents by compliance level and status
     */
    List<Consent> findByComplianceLevelAndStatus(Consent.ComplianceLevel complianceLevel, Consent.ConsentStatus status);

    /**
     * Find consents by type and compliance level
     */
    List<Consent> findByConsentTypeAndComplianceLevel(String consentType, Consent.ComplianceLevel complianceLevel);

    /**
     * Find consents by patient and date range
     */
    List<Consent> findByPatientIdAndConsentDateBetweenOrderByConsentDateDesc(Long patientId, LocalDateTime startDate, LocalDateTime endDate);

    /**
     * Find consents by witness and date range
     */
    List<Consent> findByWitnessIdAndConsentDateBetweenOrderByConsentDateDesc(Long witnessId, LocalDateTime startDate, LocalDateTime endDate);

    /**
     * Find consents by type and date range
     */
    List<Consent> findByConsentTypeAndConsentDateBetweenOrderByConsentDateDesc(String consentType, LocalDateTime startDate, LocalDateTime endDate);

    /**
     * Find consents by status and date range
     */
    List<Consent> findByStatusAndConsentDateBetweenOrderByConsentDateDesc(Consent.ConsentStatus status, LocalDateTime startDate, LocalDateTime endDate);

    /**
     * Find consents by compliance level and date range
     */
    List<Consent> findByComplianceLevelAndConsentDateBetweenOrderByConsentDateDesc(Consent.ComplianceLevel complianceLevel, LocalDateTime startDate, LocalDateTime endDate);

    /**
     * Find expiring consents
     */
    @Query("SELECT c FROM Consent c WHERE c.expirationDate BETWEEN :startDate AND :endDate")
    List<Consent> findExpiringConsents(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    /**
     * Find consents that need renewal
     */
    @Query("SELECT c FROM Consent c WHERE c.expirationDate < :date AND c.status = 'ACTIVE'")
    List<Consent> findConsentsNeedingRenewal(@Param("date") LocalDateTime date);

    /**
     * Find consents by patient and type and status
     */
    Optional<Consent> findByPatientIdAndConsentTypeAndStatus(Long patientId, String consentType, Consent.ConsentStatus status);

    /**
     * Count consents by patient
     */
    long countByPatientId(Long patientId);

    /**
     * Count consents by witness
     */
    long countByWitnessId(Long witnessId);

    /**
     * Count consents by type
     */
    long countByConsentType(String consentType);

    /**
     * Count consents by status
     */
    long countByStatus(Consent.ConsentStatus status);

    /**
     * Count consents by compliance level
     */
    long countByComplianceLevel(Consent.ComplianceLevel complianceLevel);

    /**
     * Count active consents by patient
     */
    long countByPatientIdAndStatus(Long patientId, Consent.ConsentStatus status);

    /**
     * Count consents by patient and type
     */
    long countByPatientIdAndConsentType(Long patientId, String consentType);

    /**
     * Count consents by witness and status
     */
    long countByWitnessIdAndStatus(Long witnessId, Consent.ConsentStatus status);

    /**
     * Count consents by type and status
     */
    long countByConsentTypeAndStatus(String consentType, Consent.ConsentStatus status);

    /**
     * Count consents by compliance level and status
     */
    long countByComplianceLevelAndStatus(Consent.ComplianceLevel complianceLevel, Consent.ConsentStatus status);

    /**
     * Count consents by date range
     */
    long countByConsentDateBetween(LocalDateTime startDate, LocalDateTime endDate);

    /**
     * Count consents by patient and date range
     */
    long countByPatientIdAndConsentDateBetween(Long patientId, LocalDateTime startDate, LocalDateTime endDate);

    /**
     * Count consents by witness and date range
     */
    long countByWitnessIdAndConsentDateBetween(Long witnessId, LocalDateTime startDate, LocalDateTime endDate);

    /**
     * Count consents by type and date range
     */
    long countByConsentTypeAndConsentDateBetween(String consentType, LocalDateTime startDate, LocalDateTime endDate);

    /**
     * Count consents by status and date range
     */
    long countByStatusAndConsentDateBetween(Consent.ConsentStatus status, LocalDateTime startDate, LocalDateTime endDate);

    /**
     * Count consents by compliance level and date range
     */
    long countByComplianceLevelAndConsentDateBetween(Consent.ComplianceLevel complianceLevel, LocalDateTime startDate, LocalDateTime endDate);

    /**
     * Find consents by notes containing
     */
    List<Consent> findByNotesContainingOrderByCreatedAtDesc(String notes);

    /**
     * Find consents by revocation reason containing
     */
    List<Consent> findByRevocationReasonContainingOrderByCreatedAtDesc(String revocationReason);

    /**
     * Find consents by consent title containing
     */
    List<Consent> findByConsentTitleContainingOrderByCreatedAtDesc(String consentTitle);

    /**
     * Find consents by consent content containing
     */
    List<Consent> findByConsentContentContainingOrderByCreatedAtDesc(String consentContent);

    /**
     * Find consents by device info containing
     */
    List<Consent> findByDeviceInfoContainingOrderByCreatedAtDesc(String deviceInfo);

    /**
     * Find consents by user agent containing
     */
    List<Consent> findByUserAgentContainingOrderByCreatedAtDesc(String userAgent);
} 