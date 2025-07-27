package com.aitelemedicine.telemedicine.controller;

import com.aitelemedicine.telemedicine.model.*;
import com.aitelemedicine.telemedicine.repository.*;
import com.aitelemedicine.telemedicine.service.EDIClaimService;
import com.aitelemedicine.telemedicine.service.AuditLogService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/insurance")
@RequiredArgsConstructor
@Slf4j
public class InsuranceController {

    private final InsuranceInfoRepository insuranceInfoRepository;
    private final InsuranceClaimRepository insuranceClaimRepository;
    private final CodeMappingRepository codeMappingRepository;
    private final EDIClaimService ediClaimService;
    private final AuditLogService auditLogService;

    // Insurance Info Endpoints

    @GetMapping("/info/patient/{patientId}")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('ADMIN') or @securityService.isCurrentUser(#patientId)")
    public ResponseEntity<List<InsuranceInfo>> getPatientInsuranceInfo(@PathVariable Long patientId) {
        List<InsuranceInfo> insuranceInfo = insuranceInfoRepository.findByPatientIdOrderByIsPrimaryDescCreatedAtDesc(patientId);
        return ResponseEntity.ok(insuranceInfo);
    }

    @PostMapping("/info")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('ADMIN')")
    public ResponseEntity<InsuranceInfo> createInsuranceInfo(@RequestBody InsuranceInfo insuranceInfo) {
        InsuranceInfo saved = insuranceInfoRepository.save(insuranceInfo);
        auditLogService.logEvent(
            null, // TODO: Get current user
            "INSURANCE_INFO_CREATED",
            "INSURANCE_INFO",
            saved.getId().toString(),
            "Created insurance info for patient " + insuranceInfo.getPatient().getId()
        );
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/info/{id}")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('ADMIN')")
    public ResponseEntity<InsuranceInfo> updateInsuranceInfo(@PathVariable Long id, @RequestBody InsuranceInfo insuranceInfo) {
        if (!insuranceInfoRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        insuranceInfo.setId(id);
        InsuranceInfo saved = insuranceInfoRepository.save(insuranceInfo);
        auditLogService.logEvent(
            null, // TODO: Get current user
            "INSURANCE_INFO_UPDATED",
            "INSURANCE_INFO",
            saved.getId().toString(),
            "Updated insurance info for patient " + insuranceInfo.getPatient().getId()
        );
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/info/{id}")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('ADMIN')")
    public ResponseEntity<Void> deleteInsuranceInfo(@PathVariable Long id) {
        if (!insuranceInfoRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        insuranceInfoRepository.deleteById(id);
        auditLogService.logEvent(
            null, // TODO: Get current user
            "INSURANCE_INFO_DELETED",
            "INSURANCE_INFO",
            id.toString(),
            "Deleted insurance info"
        );
        return ResponseEntity.ok().build();
    }

    // Insurance Claims Endpoints

    @GetMapping("/claims/patient/{patientId}")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('ADMIN') or @securityService.isCurrentUser(#patientId)")
    public ResponseEntity<List<InsuranceClaim>> getPatientClaims(@PathVariable Long patientId) {
        List<InsuranceClaim> claims = insuranceClaimRepository.findByPatientIdOrderByCreatedAtDesc(patientId);
        return ResponseEntity.ok(claims);
    }

    @GetMapping("/claims/appointment/{appointmentId}")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('ADMIN')")
    public ResponseEntity<List<InsuranceClaim>> getAppointmentClaims(@PathVariable Long appointmentId) {
        List<InsuranceClaim> claims = insuranceClaimRepository.findByAppointmentIdOrderByCreatedAtDesc(appointmentId);
        return ResponseEntity.ok(claims);
    }

    @GetMapping("/claims/status/{status}")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('ADMIN')")
    public ResponseEntity<List<InsuranceClaim>> getClaimsByStatus(@PathVariable InsuranceClaim.ClaimStatus status) {
        List<InsuranceClaim> claims = insuranceClaimRepository.findByStatus(status);
        return ResponseEntity.ok(claims);
    }

    @GetMapping("/claims/submission-status/{status}")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('ADMIN')")
    public ResponseEntity<List<InsuranceClaim>> getClaimsBySubmissionStatus(@PathVariable InsuranceClaim.SubmissionStatus status) {
        List<InsuranceClaim> claims = insuranceClaimRepository.findBySubmissionStatus(status);
        return ResponseEntity.ok(claims);
    }

    @PostMapping("/claims/generate/{appointmentId}")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('ADMIN')")
    public ResponseEntity<InsuranceClaim> generateClaim(@PathVariable Long appointmentId) {
        try {
            InsuranceClaim claim = ediClaimService.generateAndSubmitClaim(appointmentId);
            return ResponseEntity.ok(claim);
        } catch (Exception e) {
            log.error("Error generating claim for appointment {}: {}", appointmentId, e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/claims/{id}/status")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('ADMIN')")
    public ResponseEntity<InsuranceClaim> updateClaimStatus(@PathVariable Long id, @RequestParam InsuranceClaim.ClaimStatus status) {
        InsuranceClaim claim = ediClaimService.updateClaimStatus(id, status);
        return ResponseEntity.ok(claim);
    }

    @GetMapping("/claims/{id}")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('ADMIN')")
    public ResponseEntity<InsuranceClaim> getClaim(@PathVariable Long id) {
        Optional<InsuranceClaim> claim = insuranceClaimRepository.findById(id);
        return claim.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    // Code Mappings Endpoints

    @GetMapping("/code-mappings")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('ADMIN')")
    public ResponseEntity<List<CodeMapping>> getAllCodeMappings() {
        List<CodeMapping> mappings = codeMappingRepository.findByIsActiveTrueOrderByPriorityDesc();
        return ResponseEntity.ok(mappings);
    }

    @GetMapping("/code-mappings/appointment-type/{appointmentType}")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('ADMIN')")
    public ResponseEntity<List<CodeMapping>> getCodeMappingsByAppointmentType(@PathVariable String appointmentType) {
        List<CodeMapping> mappings = codeMappingRepository.findByAppointmentTypeAndIsActiveTrueOrderByPriorityDesc(appointmentType);
        return ResponseEntity.ok(mappings);
    }

    @GetMapping("/code-mappings/cpt/{cptCode}")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('ADMIN')")
    public ResponseEntity<List<CodeMapping>> getCodeMappingsByCptCode(@PathVariable String cptCode) {
        List<CodeMapping> mappings = codeMappingRepository.findByCptCodeAndIsActiveTrue(cptCode);
        return ResponseEntity.ok(mappings);
    }

    @GetMapping("/code-mappings/icd10/{icd10Code}")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('ADMIN')")
    public ResponseEntity<List<CodeMapping>> getCodeMappingsByIcd10Code(@PathVariable String icd10Code) {
        List<CodeMapping> mappings = codeMappingRepository.findByIcd10CodeAndIsActiveTrue(icd10Code);
        return ResponseEntity.ok(mappings);
    }

    @PostMapping("/code-mappings")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CodeMapping> createCodeMapping(@RequestBody CodeMapping codeMapping) {
        CodeMapping saved = codeMappingRepository.save(codeMapping);
        auditLogService.logEvent(
            null, // TODO: Get current user
            "CODE_MAPPING_CREATED",
            "CODE_MAPPING",
            saved.getId().toString(),
            "Created code mapping for " + codeMapping.getAppointmentType()
        );
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/code-mappings/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CodeMapping> updateCodeMapping(@PathVariable Long id, @RequestBody CodeMapping codeMapping) {
        if (!codeMappingRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        codeMapping.setId(id);
        CodeMapping saved = codeMappingRepository.save(codeMapping);
        auditLogService.logEvent(
            null, // TODO: Get current user
            "CODE_MAPPING_UPDATED",
            "CODE_MAPPING",
            saved.getId().toString(),
            "Updated code mapping for " + codeMapping.getAppointmentType()
        );
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/code-mappings/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteCodeMapping(@PathVariable Long id) {
        if (!codeMappingRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        codeMappingRepository.deleteById(id);
        auditLogService.logEvent(
            null, // TODO: Get current user
            "CODE_MAPPING_DELETED",
            "CODE_MAPPING",
            id.toString(),
            "Deleted code mapping"
        );
        return ResponseEntity.ok().build();
    }

    // Statistics Endpoints

    @GetMapping("/statistics/claims")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('ADMIN')")
    public ResponseEntity<ClaimStatistics> getClaimStatistics() {
        long totalClaims = insuranceClaimRepository.count();
        long submittedClaims = insuranceClaimRepository.countBySubmissionStatus(InsuranceClaim.SubmissionStatus.SUBMITTED_TO_CLEARINGHOUSE);
        long paidClaims = insuranceClaimRepository.countByStatus(InsuranceClaim.ClaimStatus.PAID);
        long rejectedClaims = insuranceClaimRepository.countByStatus(InsuranceClaim.ClaimStatus.REJECTED);

        ClaimStatistics stats = new ClaimStatistics(totalClaims, submittedClaims, paidClaims, rejectedClaims);
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/statistics/code-mappings")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('ADMIN')")
    public ResponseEntity<CodeMappingStatistics> getCodeMappingStatistics() {
        long totalMappings = codeMappingRepository.count();
        long activeMappings = codeMappingRepository.countByIsActiveTrue();
        long approvedMappings = codeMappingRepository.countByStatus(CodeMapping.MappingStatus.APPROVED);
        long pendingMappings = codeMappingRepository.countByStatus(CodeMapping.MappingStatus.PENDING_APPROVAL);

        CodeMappingStatistics stats = new CodeMappingStatistics(totalMappings, activeMappings, approvedMappings, pendingMappings);
        return ResponseEntity.ok(stats);
    }

    // Statistics classes
    public static class ClaimStatistics {
        private long totalClaims;
        private long submittedClaims;
        private long paidClaims;
        private long rejectedClaims;

        public ClaimStatistics(long totalClaims, long submittedClaims, long paidClaims, long rejectedClaims) {
            this.totalClaims = totalClaims;
            this.submittedClaims = submittedClaims;
            this.paidClaims = paidClaims;
            this.rejectedClaims = rejectedClaims;
        }

        // Getters
        public long getTotalClaims() { return totalClaims; }
        public long getSubmittedClaims() { return submittedClaims; }
        public long getPaidClaims() { return paidClaims; }
        public long getRejectedClaims() { return rejectedClaims; }
    }

    public static class CodeMappingStatistics {
        private long totalMappings;
        private long activeMappings;
        private long approvedMappings;
        private long pendingMappings;

        public CodeMappingStatistics(long totalMappings, long activeMappings, long approvedMappings, long pendingMappings) {
            this.totalMappings = totalMappings;
            this.activeMappings = activeMappings;
            this.approvedMappings = approvedMappings;
            this.pendingMappings = pendingMappings;
        }

        // Getters
        public long getTotalMappings() { return totalMappings; }
        public long getActiveMappings() { return activeMappings; }
        public long getApprovedMappings() { return approvedMappings; }
        public long getPendingMappings() { return pendingMappings; }
    }
} 