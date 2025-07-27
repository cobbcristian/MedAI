package com.aitelemedicine.telemedicine.repository;

import com.aitelemedicine.telemedicine.model.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

    /**
     * Find audit logs by user
     */
    List<AuditLog> findByUserIdOrderByCreatedAtDesc(Long userId);

    /**
     * Find audit logs by action
     */
    List<AuditLog> findByActionOrderByCreatedAtDesc(String action);

    /**
     * Find audit logs by resource type
     */
    List<AuditLog> findByResourceTypeOrderByCreatedAtDesc(String resourceType);

    /**
     * Find audit logs by resource type and ID
     */
    List<AuditLog> findByResourceTypeAndResourceIdOrderByCreatedAtDesc(String resourceType, String resourceId);

    /**
     * Find audit logs by severity
     */
    List<AuditLog> findBySeverityOrderByCreatedAtDesc(AuditLog.Severity severity);

    /**
     * Find AI usage logs
     */
    List<AuditLog> findByAiUsageTrueOrderByCreatedAtDesc();

    /**
     * Find audit logs by date range
     */
    List<AuditLog> findByCreatedAtBetweenOrderByCreatedAtDesc(LocalDateTime startDate, LocalDateTime endDate);

    /**
     * Find audit logs by compliance category
     */
    List<AuditLog> findByComplianceCategoryOrderByCreatedAtDesc(String complianceCategory);

    /**
     * Find audit logs by risk level
     */
    List<AuditLog> findByRiskLevelOrderByCreatedAtDesc(String riskLevel);

    /**
     * Find high-risk audit logs
     */
    List<AuditLog> findByRiskLevelInOrderByCreatedAtDesc(List<String> riskLevels);

    /**
     * Find audit logs by data access level
     */
    List<AuditLog> findByDataAccessLevelOrderByCreatedAtDesc(String dataAccessLevel);

    /**
     * Find audit logs by IP address
     */
    List<AuditLog> findByIpAddressOrderByCreatedAtDesc(String ipAddress);

    /**
     * Find audit logs by session ID
     */
    List<AuditLog> findBySessionIdOrderByCreatedAtDesc(String sessionId);

    /**
     * Find audit logs by user agent
     */
    List<AuditLog> findByUserAgentContainingOrderByCreatedAtDesc(String userAgent);

    /**
     * Find audit logs with errors
     */
    List<AuditLog> findByErrorMessageIsNotNullOrderByCreatedAtDesc();

    /**
     * Find audit logs by response status
     */
    List<AuditLog> findByResponseStatusOrderByCreatedAtDesc(Integer responseStatus);

    /**
     * Find audit logs by AI model
     */
    List<AuditLog> findByAiModelUsedOrderByCreatedAtDesc(String aiModelUsed);

    /**
     * Find audit logs by location
     */
    List<AuditLog> findByLocationOrderByCreatedAtDesc(String location);

    /**
     * Find audit logs by device info
     */
    List<AuditLog> findByDeviceInfoContainingOrderByCreatedAtDesc(String deviceInfo);

    /**
     * Count audit logs by user
     */
    long countByUserId(Long userId);

    /**
     * Count audit logs by action
     */
    long countByAction(String action);

    /**
     * Count audit logs by severity
     */
    long countBySeverity(AuditLog.Severity severity);

    /**
     * Count AI usage logs
     */
    long countByAiUsageTrue();

    /**
     * Count audit logs by date range
     */
    long countByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);

    /**
     * Count audit logs by compliance category
     */
    long countByComplianceCategory(String complianceCategory);

    /**
     * Count audit logs by risk level
     */
    long countByRiskLevel(String riskLevel);

    /**
     * Count high-risk audit logs
     */
    long countByRiskLevelIn(List<String> riskLevels);

    /**
     * Count audit logs by severity and date range
     */
    long countBySeverityAndCreatedAtBetween(AuditLog.Severity severity, LocalDateTime startDate, LocalDateTime endDate);

    /**
     * Count AI usage logs by date range
     */
    long countByAiUsageTrueAndCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);

    /**
     * Find audit logs by user and action
     */
    List<AuditLog> findByUserIdAndActionOrderByCreatedAtDesc(Long userId, String action);

    /**
     * Find audit logs by user and resource type
     */
    List<AuditLog> findByUserIdAndResourceTypeOrderByCreatedAtDesc(Long userId, String resourceType);

    /**
     * Find audit logs by user and severity
     */
    List<AuditLog> findByUserIdAndSeverityOrderByCreatedAtDesc(Long userId, AuditLog.Severity severity);

    /**
     * Find audit logs by action and date range
     */
    List<AuditLog> findByActionAndCreatedAtBetweenOrderByCreatedAtDesc(String action, LocalDateTime startDate, LocalDateTime endDate);

    /**
     * Find audit logs by resource type and date range
     */
    List<AuditLog> findByResourceTypeAndCreatedAtBetweenOrderByCreatedAtDesc(String resourceType, LocalDateTime startDate, LocalDateTime endDate);

    /**
     * Find audit logs by severity and date range
     */
    List<AuditLog> findBySeverityAndCreatedAtBetweenOrderByCreatedAtDesc(AuditLog.Severity severity, LocalDateTime startDate, LocalDateTime endDate);

    /**
     * Find audit logs by compliance category and date range
     */
    List<AuditLog> findByComplianceCategoryAndCreatedAtBetweenOrderByCreatedAtDesc(String complianceCategory, LocalDateTime startDate, LocalDateTime endDate);

    /**
     * Find audit logs by risk level and date range
     */
    List<AuditLog> findByRiskLevelAndCreatedAtBetweenOrderByCreatedAtDesc(String riskLevel, LocalDateTime startDate, LocalDateTime endDate);

    /**
     * Find audit logs by data access level and date range
     */
    List<AuditLog> findByDataAccessLevelAndCreatedAtBetweenOrderByCreatedAtDesc(String dataAccessLevel, LocalDateTime startDate, LocalDateTime endDate);

    /**
     * Find audit logs with response time above threshold
     */
    @Query("SELECT a FROM AuditLog a WHERE a.responseTimeMs > :threshold ORDER BY a.createdAt DESC")
    List<AuditLog> findByResponseTimeAboveThreshold(@Param("threshold") Long threshold);

    /**
     * Find audit logs by request method
     */
    List<AuditLog> findByRequestMethodOrderByCreatedAtDesc(String requestMethod);

    /**
     * Find audit logs by request URL containing
     */
    List<AuditLog> findByRequestUrlContainingOrderByCreatedAtDesc(String requestUrl);

    /**
     * Find audit logs by notes containing
     */
    List<AuditLog> findByNotesContainingOrderByCreatedAtDesc(String notes);

    /**
     * Find audit logs by error message containing
     */
    List<AuditLog> findByErrorMessageContainingOrderByCreatedAtDesc(String errorMessage);
} 