package com.aitelemedicine.telemedicine.controller;

import com.aitelemedicine.telemedicine.service.AIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*")
public class AIController {

    @Autowired
    private AIService aiService;

    @PostMapping("/symptom-check")
    public ResponseEntity<?> analyzeSymptoms(@RequestBody SymptomCheckRequest request) {
        try {
            Map<String, Object> analysis = aiService.analyzeSymptoms(
                request.getSymptoms(),
                request.getPatientAge(),
                request.getPatientGender(),
                request.getMedicalHistory()
            );
            
            if (analysis.containsKey("error")) {
                return ResponseEntity.badRequest().body(analysis);
            }
            
            return ResponseEntity.ok(analysis);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/analyze-records")
    public ResponseEntity<?> analyzeMedicalRecord(@RequestBody MedicalRecordAnalysisRequest request) {
        try {
            Map<String, Object> analysis = aiService.analyzeMedicalRecord(
                request.getRecordContent(),
                request.getRecordType()
            );
            
            if (analysis.containsKey("error")) {
                return ResponseEntity.badRequest().body(analysis);
            }
            
            return ResponseEntity.ok(analysis);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/prescription-suggestions")
    public ResponseEntity<?> generatePrescriptionSuggestions(@RequestBody PrescriptionRequest request) {
        try {
            Map<String, Object> suggestions = aiService.generatePrescriptionSuggestions(
                request.getDiagnosis(),
                request.getSymptoms(),
                request.getPatientAllergies()
            );
            
            if (suggestions.containsKey("error")) {
                return ResponseEntity.badRequest().body(suggestions);
            }
            
            return ResponseEntity.ok(suggestions);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/soap-notes")
    public ResponseEntity<?> generateSOAPNotes(@RequestBody SOAPNotesRequest request) {
        try {
            Map<String, Object> soapNotes = aiService.generateSOAPNotes(
                request.getPatientSymptoms(),
                request.getDiagnosis(),
                request.getTreatment(),
                request.getPatientHistory()
            );
            
            if (soapNotes.containsKey("error")) {
                return ResponseEntity.badRequest().body(soapNotes);
            }
            
            return ResponseEntity.ok(soapNotes);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Request classes
    public static class SymptomCheckRequest {
        private String symptoms;
        private String patientAge;
        private String patientGender;
        private String medicalHistory;

        public String getSymptoms() { return symptoms; }
        public void setSymptoms(String symptoms) { this.symptoms = symptoms; }
        public String getPatientAge() { return patientAge; }
        public void setPatientAge(String patientAge) { this.patientAge = patientAge; }
        public String getPatientGender() { return patientGender; }
        public void setPatientGender(String patientGender) { this.patientGender = patientGender; }
        public String getMedicalHistory() { return medicalHistory; }
        public void setMedicalHistory(String medicalHistory) { this.medicalHistory = medicalHistory; }
    }

    public static class MedicalRecordAnalysisRequest {
        private String recordContent;
        private String recordType;

        public String getRecordContent() { return recordContent; }
        public void setRecordContent(String recordContent) { this.recordContent = recordContent; }
        public String getRecordType() { return recordType; }
        public void setRecordType(String recordType) { this.recordType = recordType; }
    }

    public static class PrescriptionRequest {
        private String diagnosis;
        private String symptoms;
        private String patientAllergies;

        public String getDiagnosis() { return diagnosis; }
        public void setDiagnosis(String diagnosis) { this.diagnosis = diagnosis; }
        public String getSymptoms() { return symptoms; }
        public void setSymptoms(String symptoms) { this.symptoms = symptoms; }
        public String getPatientAllergies() { return patientAllergies; }
        public void setPatientAllergies(String patientAllergies) { this.patientAllergies = patientAllergies; }
    }

    public static class SOAPNotesRequest {
        private String patientSymptoms;
        private String diagnosis;
        private String treatment;
        private String patientHistory;

        public String getPatientSymptoms() { return patientSymptoms; }
        public void setPatientSymptoms(String patientSymptoms) { this.patientSymptoms = patientSymptoms; }
        public String getDiagnosis() { return diagnosis; }
        public void setDiagnosis(String diagnosis) { this.diagnosis = diagnosis; }
        public String getTreatment() { return treatment; }
        public void setTreatment(String treatment) { this.treatment = treatment; }
        public String getPatientHistory() { return patientHistory; }
        public void setPatientHistory(String patientHistory) { this.patientHistory = patientHistory; }
    }
} 