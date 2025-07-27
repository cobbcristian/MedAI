package com.aitelemedicine.telemedicine.controller;

import com.aitelemedicine.telemedicine.model.*;
import com.aitelemedicine.telemedicine.repository.*;
import com.aitelemedicine.telemedicine.service.MedicationRecommendationService;
import com.aitelemedicine.telemedicine.service.AuditLogService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/medications")
@RequiredArgsConstructor
@Slf4j
public class MedicationController {

    private final MedicationRepository medicationRepository;
    private final PrescriptionRepository prescriptionRepository;
    private final MedicationRecommendationService recommendationService;
    private final AuditLogService auditLogService;

    // Medication Information Endpoints

    @GetMapping
    @PreAuthorize("hasRole('DOCTOR') or hasRole('ADMIN')")
    public ResponseEntity<List<Medication>> getAllMedications(
            @RequestParam(required = false) String drugClass,
            @RequestParam(required = false) String therapeuticCategory,
            @RequestParam(required = false) Boolean fdaApproved,
            @RequestParam(required = false) Boolean genericAvailable,
            @RequestParam(required = false) String preferredTier) {
        
        List<Medication> medications;
        if (drugClass != null) {
            medications = medicationRepository.findByDrugClassContainingIgnoreCase(drugClass);
        } else if (therapeuticCategory != null) {
            medications = medicationRepository.findByTherapeuticCategoryContainingIgnoreCase(therapeuticCategory);
        } else if (fdaApproved != null) {
            medications = medicationRepository.findByFdaApproved(fdaApproved);
        } else if (genericAvailable != null) {
            medications = medicationRepository.findByGenericAvailable(genericAvailable);
        } else if (preferredTier != null) {
            medications = medicationRepository.findByPreferredTier(preferredTier);
        } else {
            medications = medicationRepository.findByIsActiveTrue();
        }
        
        return ResponseEntity.ok(medications);
    }

    @GetMapping("/search")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('ADMIN')")
    public ResponseEntity<List<Medication>> searchMedications(
            @RequestParam String query,
            @RequestParam(required = false) String searchType) {
        
        List<Medication> medications;
        switch (searchType) {
            case "generic":
                medications = medicationRepository.findByGenericNameContainingIgnoreCase(query);
                break;
            case "brand":
                medications = medicationRepository.findByBrandNameContainingIgnoreCase(query);
                break;
            case "symptoms":
                medications = medicationRepository.findBySymptomIndicatorsContainingIgnoreCase(query);
                break;
            case "indications":
                medications = medicationRepository.findByIndicationsContainingIgnoreCase(query);
                break;
            default:
                // Search across multiple fields
                List<Medication> genericResults = medicationRepository.findByGenericNameContainingIgnoreCase(query);
                List<Medication> brandResults = medicationRepository.findByBrandNameContainingIgnoreCase(query);
                List<Medication> symptomResults = medicationRepository.findBySymptomIndicatorsContainingIgnoreCase(query);
                
                medications = new java.util.ArrayList<>();
                medications.addAll(genericResults);
                medications.addAll(brandResults);
                medications.addAll(symptomResults);
                
                // Remove duplicates
                medications = medications.stream().distinct().toList();
                break;
        }
        
        return ResponseEntity.ok(medications);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('ADMIN')")
    public ResponseEntity<Medication> getMedication(@PathVariable Long id) {
        Optional<Medication> medication = medicationRepository.findById(id);
        return medication.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/alternatives")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('ADMIN')")
    public ResponseEntity<List<Medication>> getAlternativeMedications(@PathVariable Long id) {
        Optional<Medication> medication = medicationRepository.findById(id);
        if (medication.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        // Get alternative medications based on therapeutic category and drug class
        List<Medication> alternatives = medicationRepository.findByTherapeuticCategoryContainingIgnoreCase(
            medication.get().getTherapeuticCategory()
        );

        // Filter out the current medication and limit results
        alternatives = alternatives.stream()
            .filter(m -> !m.getId().equals(id))
            .limit(10)
            .toList();

        return ResponseEntity.ok(alternatives);
    }

    // Medication Recommendation Endpoints

    @PostMapping("/recommendations")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('ADMIN')")
    public ResponseEntity<List<MedicationRecommendationService.MedicationRecommendation>> getMedicationRecommendations(
            @RequestBody MedicationRecommendationService.RecommendationRequest request) {
        try {
            List<MedicationRecommendationService.MedicationRecommendation> recommendations = 
                recommendationService.getMedicationRecommendations(request);
            return ResponseEntity.ok(recommendations);
        } catch (Exception e) {
            log.error("Error getting medication recommendations: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/recommendations/prescription")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('ADMIN')")
    public ResponseEntity<Prescription> createPrescriptionFromRecommendation(
            @RequestBody MedicationRecommendationService.MedicationRecommendation recommendation,
            @RequestParam Long patientId,
            @RequestParam Long doctorId,
            @RequestParam(required = false) Long appointmentId) {
        try {
            MedicationRecommendationService.RecommendationRequest request = new MedicationRecommendationService.RecommendationRequest();
            request.setPatientId(patientId);
            request.setDoctorId(doctorId);
            request.setAppointmentId(appointmentId);

            Prescription prescription = recommendationService.createPrescriptionFromRecommendation(recommendation, request);
            return ResponseEntity.ok(prescription);
        } catch (Exception e) {
            log.error("Error creating prescription from recommendation: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    // Prescription Endpoints

    @GetMapping("/prescriptions/patient/{patientId}")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('ADMIN') or @securityService.isCurrentUser(#patientId)")
    public ResponseEntity<List<Prescription>> getPatientPrescriptions(@PathVariable Long patientId) {
        List<Prescription> prescriptions = prescriptionRepository.findByPatientIdOrderByCreatedAtDesc(patientId);
        return ResponseEntity.ok(prescriptions);
    }

    @GetMapping("/prescriptions/doctor/{doctorId}")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('ADMIN')")
    public ResponseEntity<List<Prescription>> getDoctorPrescriptions(@PathVariable Long doctorId) {
        List<Prescription> prescriptions = prescriptionRepository.findByDoctorIdOrderByCreatedAtDesc(doctorId);
        return ResponseEntity.ok(prescriptions);
    }

    @GetMapping("/prescriptions/status/{status}")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('ADMIN')")
    public ResponseEntity<List<Prescription>> getPrescriptionsByStatus(@PathVariable Prescription.PrescriptionStatus status) {
        List<Prescription> prescriptions = prescriptionRepository.findByStatus(status);
        return ResponseEntity.ok(prescriptions);
    }

    @GetMapping("/prescriptions/{id}")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('ADMIN')")
    public ResponseEntity<Prescription> getPrescription(@PathVariable Long id) {
        Optional<Prescription> prescription = prescriptionRepository.findById(id);
        return prescription.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/prescriptions")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('ADMIN')")
    public ResponseEntity<Prescription> createPrescription(@RequestBody Prescription prescription) {
        Prescription saved = prescriptionRepository.save(prescription);
        auditLogService.logEvent(
            prescription.getDoctor().getId(),
            "PRESCRIPTION_CREATED",
            "PRESCRIPTION",
            saved.getId().toString(),
            "Created prescription for patient " + prescription.getPatient().getId() + " - " + prescription.getMedication().getGenericName()
        );
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/prescriptions/{id}")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('ADMIN')")
    public ResponseEntity<Prescription> updatePrescription(@PathVariable Long id, @RequestBody Prescription prescription) {
        if (!prescriptionRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        prescription.setId(id);
        Prescription saved = prescriptionRepository.save(prescription);
        auditLogService.logEvent(
            prescription.getDoctor().getId(),
            "PRESCRIPTION_UPDATED",
            "PRESCRIPTION",
            saved.getId().toString(),
            "Updated prescription for patient " + prescription.getPatient().getId()
        );
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/prescriptions/{id}")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('ADMIN')")
    public ResponseEntity<Void> deletePrescription(@PathVariable Long id) {
        if (!prescriptionRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        prescriptionRepository.deleteById(id);
        auditLogService.logEvent(
            null, // TODO: Get current user
            "PRESCRIPTION_DELETED",
            "PRESCRIPTION",
            id.toString(),
            "Deleted prescription"
        );
        return ResponseEntity.ok().build();
    }

    // Statistics Endpoints

    @GetMapping("/statistics")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('ADMIN')")
    public ResponseEntity<MedicationStatistics> getMedicationStatistics() {
        long totalMedications = medicationRepository.count();
        long activeMedications = medicationRepository.countByIsActiveTrue();
        long fdaApproved = medicationRepository.countByFdaApproved(true);
        long genericAvailable = medicationRepository.countByGenericAvailable(true);
        long controlledSubstances = medicationRepository.countByControlledSubstance(true);

        MedicationStatistics stats = new MedicationStatistics(
            totalMedications, activeMedications, fdaApproved, genericAvailable, controlledSubstances
        );
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/prescriptions/statistics")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('ADMIN')")
    public ResponseEntity<PrescriptionStatistics> getPrescriptionStatistics() {
        long totalPrescriptions = prescriptionRepository.count();
        long activePrescriptions = prescriptionRepository.countByStatus(Prescription.PrescriptionStatus.ACTIVE);
        long dispensedPrescriptions = prescriptionRepository.countByStatus(Prescription.PrescriptionStatus.DISPENSED);
        long completedPrescriptions = prescriptionRepository.countByStatus(Prescription.PrescriptionStatus.COMPLETED);

        PrescriptionStatistics stats = new PrescriptionStatistics(
            totalPrescriptions, activePrescriptions, dispensedPrescriptions, completedPrescriptions
        );
        return ResponseEntity.ok(stats);
    }

    // Statistics classes
    public static class MedicationStatistics {
        private long totalMedications;
        private long activeMedications;
        private long fdaApproved;
        private long genericAvailable;
        private long controlledSubstances;

        public MedicationStatistics(long totalMedications, long activeMedications, long fdaApproved, long genericAvailable, long controlledSubstances) {
            this.totalMedications = totalMedications;
            this.activeMedications = activeMedications;
            this.fdaApproved = fdaApproved;
            this.genericAvailable = genericAvailable;
            this.controlledSubstances = controlledSubstances;
        }

        // Getters
        public long getTotalMedications() { return totalMedications; }
        public long getActiveMedications() { return activeMedications; }
        public long getFdaApproved() { return fdaApproved; }
        public long getGenericAvailable() { return genericAvailable; }
        public long getControlledSubstances() { return controlledSubstances; }
    }

    public static class PrescriptionStatistics {
        private long totalPrescriptions;
        private long activePrescriptions;
        private long dispensedPrescriptions;
        private long completedPrescriptions;

        public PrescriptionStatistics(long totalPrescriptions, long activePrescriptions, long dispensedPrescriptions, long completedPrescriptions) {
            this.totalPrescriptions = totalPrescriptions;
            this.activePrescriptions = activePrescriptions;
            this.dispensedPrescriptions = dispensedPrescriptions;
            this.completedPrescriptions = completedPrescriptions;
        }

        // Getters
        public long getTotalPrescriptions() { return totalPrescriptions; }
        public long getActivePrescriptions() { return activePrescriptions; }
        public long getDispensedPrescriptions() { return dispensedPrescriptions; }
        public long getCompletedPrescriptions() { return completedPrescriptions; }
    }
} 