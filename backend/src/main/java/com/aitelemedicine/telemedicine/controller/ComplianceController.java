package com.aitelemedicine.telemedicine.controller;

import com.aitelemedicine.telemedicine.model.*;
import com.aitelemedicine.telemedicine.repository.*;
import com.aitelemedicine.telemedicine.service.AuditLogService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/compliance")
@RequiredArgsConstructor
@Slf4j
public class ComplianceController {

    private final AuditLogRepository auditLogRepository;
    private final ConsentRepository consentRepository;
    private final AuditLogService auditLogService;

    // Audit Log Endpoints

    @GetMapping("/audit-logs")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AuditLog>> getAllAuditLogs(
            @RequestParam(required = false) String action,
            @RequestParam(required = false) String resourceType,
            @RequestParam(required = false) AuditLog.Severity severity,
            @RequestParam(required = false) String riskLevel,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        
        List<AuditLog> logs;
        if (action != null) {
            logs = auditLogRepository.findByActionOrderByCreatedAtDesc(action);
        } else if (resourceType != null) {
            logs = auditLogRepository.findByResourceTypeOrderByCreatedAtDesc(resourceType);
        } else if (severity != null) {
            logs = auditLogRepository.findBySeverityOrderByCreatedAtDesc(severity);
        } else if (riskLevel != null) {
            logs = auditLogRepository.findByRiskLevelOrderByCreatedAtDesc(riskLevel);
        } else {
            logs = auditLogRepository.findAll();
        }
        
        return ResponseEntity.ok(logs);
    }

    @GetMapping("/audit-logs/user/{userId}")
    @PreAuthorize("hasRole('ADMIN') or @securityService.isCurrentUser(#userId)")
    public ResponseEntity<List<AuditLog>> getUserAuditLogs(@PathVariable Long userId) {
        List<AuditLog> logs = auditLogRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return ResponseEntity.ok(logs);
    }

    @GetMapping("/audit-logs/resource/{resourceType}/{resourceId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AuditLog>> getResourceAuditLogs(@PathVariable String resourceType, @PathVariable String resourceId) {
        List<AuditLog> logs = auditLogRepository.findByResourceTypeAndResourceIdOrderByCreatedAtDesc(resourceType, resourceId);
        return ResponseEntity.ok(logs);
    }

    @GetMapping("/audit-logs/ai-usage")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AuditLog>> getAIUsageLogs() {
        List<AuditLog> logs = auditLogRepository.findByAiUsageTrueOrderByCreatedAtDesc();
        return ResponseEntity.ok(logs);
    }

    @GetMapping("/audit-logs/errors")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AuditLog>> getErrorLogs() {
        List<AuditLog> logs = auditLogRepository.findByErrorMessageIsNotNullOrderByCreatedAtDesc();
        return ResponseEntity.ok(logs);
    }

    @GetMapping("/audit-logs/high-risk")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AuditLog>> getHighRiskLogs() {
        List<AuditLog> logs = auditLogRepository.findByRiskLevelInOrderByCreatedAtDesc(List.of("HIGH", "CRITICAL"));
        return ResponseEntity.ok(logs);
    }

    @GetMapping("/audit-logs/date-range")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AuditLog>> getAuditLogsByDateRange(
            @RequestParam LocalDateTime startDate,
            @RequestParam LocalDateTime endDate) {
        List<AuditLog> logs = auditLogRepository.findByCreatedAtBetweenOrderByCreatedAtDesc(startDate, endDate);
        return ResponseEntity.ok(logs);
    }

    @GetMapping("/audit-logs/statistics")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AuditStatistics> getAuditStatistics(
            @RequestParam LocalDateTime startDate,
            @RequestParam LocalDateTime endDate) {
        AuditLogService.AuditStatistics stats = auditLogService.getAuditStatistics(startDate, endDate);
        return ResponseEntity.ok(stats);
    }

    // Consent Management Endpoints

    @GetMapping("/consents/patient/{patientId}")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('ADMIN') or @securityService.isCurrentUser(#patientId)")
    public ResponseEntity<List<Consent>> getPatientConsents(@PathVariable Long patientId) {
        List<Consent> consents = consentRepository.findByPatientIdOrderByCreatedAtDesc(patientId);
        return ResponseEntity.ok(consents);
    }

    @GetMapping("/consents/patient/{patientId}/active")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('ADMIN') or @securityService.isCurrentUser(#patientId)")
    public ResponseEntity<List<Consent>> getPatientActiveConsents(@PathVariable Long patientId) {
        List<Consent> consents = consentRepository.findByPatientIdAndStatus(patientId, Consent.ConsentStatus.ACTIVE);
        return ResponseEntity.ok(consents);
    }

    @GetMapping("/consents/patient/{patientId}/type/{consentType}")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('ADMIN') or @securityService.isCurrentUser(#patientId)")
    public ResponseEntity<List<Consent>> getPatientConsentsByType(@PathVariable Long patientId, @PathVariable String consentType) {
        List<Consent> consents = consentRepository.findByPatientIdAndConsentTypeOrderByCreatedAtDesc(patientId, consentType);
        return ResponseEntity.ok(consents);
    }

    @GetMapping("/consents/patient/{patientId}/type/{consentType}/active")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('ADMIN') or @securityService.isCurrentUser(#patientId)")
    public ResponseEntity<Optional<Consent>> getPatientActiveConsentByType(@PathVariable Long patientId, @PathVariable String consentType) {
        Optional<Consent> consent = consentRepository.findByPatientIdAndConsentTypeAndStatus(patientId, consentType, Consent.ConsentStatus.ACTIVE);
        return ResponseEntity.ok(consent);
    }

    @PostMapping("/consents")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('ADMIN')")
    public ResponseEntity<Consent> createConsent(@RequestBody Consent consent) {
        Consent saved = consentRepository.save(consent);
        auditLogService.logEvent(
            null, // TODO: Get current user
            "CONSENT_CREATED",
            "CONSENT",
            saved.getId().toString(),
            "Created consent for patient " + consent.getPatient().getId() + " type: " + consent.getConsentType()
        );
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/consents/{id}")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('ADMIN')")
    public ResponseEntity<Consent> updateConsent(@PathVariable Long id, @RequestBody Consent consent) {
        if (!consentRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        consent.setId(id);
        Consent saved = consentRepository.save(consent);
        auditLogService.logEvent(
            null, // TODO: Get current user
            "CONSENT_UPDATED",
            "CONSENT",
            saved.getId().toString(),
            "Updated consent for patient " + consent.getPatient().getId()
        );
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/consents/{id}/revoke")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('ADMIN')")
    public ResponseEntity<Consent> revokeConsent(@PathVariable Long id, @RequestParam String reason) {
        Optional<Consent> consentOpt = consentRepository.findById(id);
        if (consentOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        Consent consent = consentOpt.get();
        consent.setStatus(Consent.ConsentStatus.REVOKED);
        consent.setRevocationDate(LocalDateTime.now());
        consent.setRevocationReason(reason);
        
        Consent saved = consentRepository.save(consent);
        auditLogService.logEvent(
            null, // TODO: Get current user
            "CONSENT_REVOKED",
            "CONSENT",
            saved.getId().toString(),
            "Revoked consent for patient " + consent.getPatient().getId() + " reason: " + reason
        );
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/consents/expiring")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('ADMIN')")
    public ResponseEntity<List<Consent>> getExpiringConsents(
            @RequestParam LocalDateTime startDate,
            @RequestParam LocalDateTime endDate) {
        List<Consent> consents = consentRepository.findExpiringConsents(startDate, endDate);
        return ResponseEntity.ok(consents);
    }

    @GetMapping("/consents/needing-renewal")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('ADMIN')")
    public ResponseEntity<List<Consent>> getConsentsNeedingRenewal() {
        List<Consent> consents = consentRepository.findConsentsNeedingRenewal(LocalDateTime.now());
        return ResponseEntity.ok(consents);
    }

    @GetMapping("/consents/statistics")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('ADMIN')")
    public ResponseEntity<ConsentStatistics> getConsentStatistics() {
        long totalConsents = consentRepository.count();
        long activeConsents = consentRepository.countByStatus(Consent.ConsentStatus.ACTIVE);
        long revokedConsents = consentRepository.countByStatus(Consent.ConsentStatus.REVOKED);
        long expiredConsents = consentRepository.countByStatus(Consent.ConsentStatus.EXPIRED);

        ConsentStatistics stats = new ConsentStatistics(totalConsents, activeConsents, revokedConsents, expiredConsents);
        return ResponseEntity.ok(stats);
    }

    // Statistics classes
    public static class ConsentStatistics {
        private long totalConsents;
        private long activeConsents;
        private long revokedConsents;
        private long expiredConsents;

        public ConsentStatistics(long totalConsents, long activeConsents, long revokedConsents, long expiredConsents) {
            this.totalConsents = totalConsents;
            this.activeConsents = activeConsents;
            this.revokedConsents = revokedConsents;
            this.expiredConsents = expiredConsents;
        }

        // Getters
        public long getTotalConsents() { return totalConsents; }
        public long getActiveConsents() { return activeConsents; }
        public long getRevokedConsents() { return revokedConsents; }
        public long getExpiredConsents() { return expiredConsents; }
    }
} 