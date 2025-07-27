package com.aitelemedicine.telemedicine.service;

import com.aitelemedicine.telemedicine.model.*;
import com.aitelemedicine.telemedicine.repository.*;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class MedicationRecommendationService {

    private final MedicationRepository medicationRepository;
    private final PrescriptionRepository prescriptionRepository;
    private final InsuranceInfoRepository insuranceInfoRepository;
    private final AuditLogService auditLogService;
    private final ObjectMapper objectMapper;

    public static class MedicationRecommendation {
        private Medication medication;
        private Double clinicalScore;
        private Double costScore;
        private Double safetyScore;
        private Double overallScore;
        private String reasoning;
        private BigDecimal estimatedCost;
        private String insuranceCoverage;
        private List<String> warnings;
        private List<String> alternatives;
        private String evidenceLevel;
        private String clinicalGuidelines;

        public MedicationRecommendation(Medication medication) {
            this.medication = medication;
            this.warnings = new ArrayList<>();
            this.alternatives = new ArrayList<>();
        }

        // Getters and setters
        public Medication getMedication() { return medication; }
        public void setMedication(Medication medication) { this.medication = medication; }
        public Double getClinicalScore() { return clinicalScore; }
        public void setClinicalScore(Double clinicalScore) { this.clinicalScore = clinicalScore; }
        public Double getCostScore() { return costScore; }
        public void setCostScore(Double costScore) { this.costScore = costScore; }
        public Double getSafetyScore() { return safetyScore; }
        public void setSafetyScore(Double safetyScore) { this.safetyScore = safetyScore; }
        public Double getOverallScore() { return overallScore; }
        public void setOverallScore(Double overallScore) { this.overallScore = overallScore; }
        public String getReasoning() { return reasoning; }
        public void setReasoning(String reasoning) { this.reasoning = reasoning; }
        public BigDecimal getEstimatedCost() { return estimatedCost; }
        public void setEstimatedCost(BigDecimal estimatedCost) { this.estimatedCost = estimatedCost; }
        public String getInsuranceCoverage() { return insuranceCoverage; }
        public void setInsuranceCoverage(String insuranceCoverage) { this.insuranceCoverage = insuranceCoverage; }
        public List<String> getWarnings() { return warnings; }
        public void setWarnings(List<String> warnings) { this.warnings = warnings; }
        public List<String> getAlternatives() { return alternatives; }
        public void setAlternatives(List<String> alternatives) { this.alternatives = alternatives; }
        public String getEvidenceLevel() { return evidenceLevel; }
        public void setEvidenceLevel(String evidenceLevel) { this.evidenceLevel = evidenceLevel; }
        public String getClinicalGuidelines() { return clinicalGuidelines; }
        public void setClinicalGuidelines(String clinicalGuidelines) { this.clinicalGuidelines = clinicalGuidelines; }
    }

    public static class RecommendationRequest {
        private List<String> symptoms;
        private String diagnosis;
        private String diagnosisCode;
        private Long patientId;
        private Long doctorId;
        private Long appointmentId;
        private List<String> allergies;
        private List<String> currentMedications;
        private String ageGroup; // PEDIATRIC, ADULT, GERIATRIC
        private Boolean isPregnant;
        private Boolean isBreastfeeding;
        private Boolean hasRenalImpairment;
        private Boolean hasHepaticImpairment;
        private String insuranceProvider;
        private String preferredTier;
        private BigDecimal maxBudget;
        private Boolean preferGeneric;
        private String urgencyLevel;

        // Getters and setters
        public List<String> getSymptoms() { return symptoms; }
        public void setSymptoms(List<String> symptoms) { this.symptoms = symptoms; }
        public String getDiagnosis() { return diagnosis; }
        public void setDiagnosis(String diagnosis) { this.diagnosis = diagnosis; }
        public String getDiagnosisCode() { return diagnosisCode; }
        public void setDiagnosisCode(String diagnosisCode) { this.diagnosisCode = diagnosisCode; }
        public Long getPatientId() { return patientId; }
        public void setPatientId(Long patientId) { this.patientId = patientId; }
        public Long getDoctorId() { return doctorId; }
        public void setDoctorId(Long doctorId) { this.doctorId = doctorId; }
        public Long getAppointmentId() { return appointmentId; }
        public void setAppointmentId(Long appointmentId) { this.appointmentId = appointmentId; }
        public List<String> getAllergies() { return allergies; }
        public void setAllergies(List<String> allergies) { this.allergies = allergies; }
        public List<String> getCurrentMedications() { return currentMedications; }
        public void setCurrentMedications(List<String> currentMedications) { this.currentMedications = currentMedications; }
        public String getAgeGroup() { return ageGroup; }
        public void setAgeGroup(String ageGroup) { this.ageGroup = ageGroup; }
        public Boolean getIsPregnant() { return isPregnant; }
        public void setIsPregnant(Boolean isPregnant) { this.isPregnant = isPregnant; }
        public Boolean getIsBreastfeeding() { return isBreastfeeding; }
        public void setIsBreastfeeding(Boolean isBreastfeeding) { this.isBreastfeeding = isBreastfeeding; }
        public Boolean getHasRenalImpairment() { return hasRenalImpairment; }
        public void setHasRenalImpairment(Boolean hasRenalImpairment) { this.hasRenalImpairment = hasRenalImpairment; }
        public Boolean getHasHepaticImpairment() { return hasHepaticImpairment; }
        public void setHasHepaticImpairment(Boolean hasHepaticImpairment) { this.hasHepaticImpairment = hasHepaticImpairment; }
        public String getInsuranceProvider() { return insuranceProvider; }
        public void setInsuranceProvider(String insuranceProvider) { this.insuranceProvider = insuranceProvider; }
        public String getPreferredTier() { return preferredTier; }
        public void setPreferredTier(String preferredTier) { this.preferredTier = preferredTier; }
        public BigDecimal getMaxBudget() { return maxBudget; }
        public void setMaxBudget(BigDecimal maxBudget) { this.maxBudget = maxBudget; }
        public Boolean getPreferGeneric() { return preferGeneric; }
        public void setPreferGeneric(Boolean preferGeneric) { this.preferGeneric = preferGeneric; }
        public String getUrgencyLevel() { return urgencyLevel; }
        public void setUrgencyLevel(String urgencyLevel) { this.urgencyLevel = urgencyLevel; }
    }

    public List<MedicationRecommendation> getMedicationRecommendations(RecommendationRequest request) {
        try {
            // Log the recommendation request
            auditLogService.logEvent(
                request.getDoctorId(),
                "MEDICATION_RECOMMENDATION_REQUESTED",
                "MEDICATION_RECOMMENDATION",
                request.getPatientId().toString(),
                "Requested medication recommendations for symptoms: " + String.join(", ", request.getSymptoms())
            );

            // Step 1: Find medications that treat the symptoms
            List<Medication> candidateMedications = findMedicationsForSymptoms(request.getSymptoms(), request.getDiagnosis());

            // Step 2: Filter by safety criteria
            candidateMedications = filterBySafetyCriteria(candidateMedications, request);

            // Step 3: Check for drug interactions
            candidateMedications = filterByDrugInteractions(candidateMedications, request.getCurrentMedications());

            // Step 4: Check for allergies
            candidateMedications = filterByAllergies(candidateMedications, request.getAllergies());

            // Step 5: Calculate insurance coverage and costs
            List<MedicationRecommendation> recommendations = calculateRecommendations(candidateMedications, request);

            // Step 6: Sort by overall score
            recommendations.sort((a, b) -> Double.compare(b.getOverallScore(), a.getOverallScore()));

            // Step 7: Add alternatives and warnings
            addAlternativesAndWarnings(recommendations, request);

            // Log the recommendations
            auditLogService.logEvent(
                request.getDoctorId(),
                "MEDICATION_RECOMMENDATIONS_GENERATED",
                "MEDICATION_RECOMMENDATION",
                request.getPatientId().toString(),
                "Generated " + recommendations.size() + " medication recommendations"
            );

            return recommendations;

        } catch (Exception e) {
            log.error("Error generating medication recommendations: {}", e.getMessage(), e);
            auditLogService.logError(
                request.getDoctorId(),
                "MEDICATION_RECOMMENDATION_ERROR",
                "MEDICATION_RECOMMENDATION",
                request.getPatientId().toString(),
                "Error generating medication recommendations: " + e.getMessage()
            );
            throw new RuntimeException("Failed to generate medication recommendations", e);
        }
    }

    private List<Medication> findMedicationsForSymptoms(List<String> symptoms, String diagnosis) {
        List<Medication> medications = new ArrayList<>();

        // Find medications by symptom indicators
        for (String symptom : symptoms) {
            List<Medication> symptomMedications = medicationRepository.findBySymptomIndicatorsContainingIgnoreCase(symptom);
            medications.addAll(symptomMedications);
        }

        // Find medications by diagnosis
        if (diagnosis != null) {
            List<Medication> diagnosisMedications = medicationRepository.findByIndicationsContainingIgnoreCase(diagnosis);
            medications.addAll(diagnosisMedications);
        }

        // Remove duplicates and filter active medications
        return medications.stream()
            .filter(m -> m.getIsActive() && m.getStatus() == Medication.MedicationStatus.ACTIVE)
            .distinct()
            .collect(Collectors.toList());
    }

    private List<Medication> filterBySafetyCriteria(List<Medication> medications, RecommendationRequest request) {
        return medications.stream()
            .filter(medication -> {
                // Age group safety
                if ("PEDIATRIC".equals(request.getAgeGroup()) && !medication.getPediatricSafe()) {
                    return false;
                }
                if ("GERIATRIC".equals(request.getAgeGroup()) && !medication.getGeriatricSafe()) {
                    return false;
                }

                // Pregnancy safety
                if (Boolean.TRUE.equals(request.getIsPregnant()) && "X".equals(medication.getPregnancyCategory())) {
                    return false;
                }

                // Breastfeeding safety
                if (Boolean.TRUE.equals(request.getIsBreastfeeding()) && !Boolean.TRUE.equals(medication.getBreastfeedingSafe())) {
                    return false;
                }

                // Renal impairment
                if (Boolean.TRUE.equals(request.getHasRenalImpairment()) && !Boolean.TRUE.equals(medication.getRenalDoseAdjustment())) {
                    return false;
                }

                // Hepatic impairment
                if (Boolean.TRUE.equals(request.getHasHepaticImpairment()) && !Boolean.TRUE.equals(medication.getHepaticDoseAdjustment())) {
                    return false;
                }

                return true;
            })
            .collect(Collectors.toList());
    }

    private List<Medication> filterByDrugInteractions(List<Medication> medications, List<String> currentMedications) {
        if (currentMedications == null || currentMedications.isEmpty()) {
            return medications;
        }

        return medications.stream()
            .filter(medication -> {
                try {
                    if (medication.getDrugInteractions() != null) {
                        List<String> interactions = objectMapper.readValue(
                            medication.getDrugInteractions(), 
                            new TypeReference<List<String>>() {}
                        );
                        
                        // Check if any current medications are in the interactions list
                        return currentMedications.stream()
                            .noneMatch(currentMed -> interactions.stream()
                                .anyMatch(interaction -> interaction.toLowerCase().contains(currentMed.toLowerCase())));
                    }
                    return true;
                } catch (Exception e) {
                    log.warn("Error parsing drug interactions for medication {}: {}", medication.getId(), e.getMessage());
                    return true;
                }
            })
            .collect(Collectors.toList());
    }

    private List<Medication> filterByAllergies(List<Medication> medications, List<String> allergies) {
        if (allergies == null || allergies.isEmpty()) {
            return medications;
        }

        return medications.stream()
            .filter(medication -> {
                try {
                    if (medication.getAllergyContraindications() != null) {
                        List<String> contraindications = objectMapper.readValue(
                            medication.getAllergyContraindications(), 
                            new TypeReference<List<String>>() {}
                        );
                        
                        // Check if any allergies are in the contraindications list
                        return allergies.stream()
                            .noneMatch(allergy -> contraindications.stream()
                                .anyMatch(contraindication -> contraindication.toLowerCase().contains(allergy.toLowerCase())));
                    }
                    return true;
                } catch (Exception e) {
                    log.warn("Error parsing allergy contraindications for medication {}: {}", medication.getId(), e.getMessage());
                    return true;
                }
            })
            .collect(Collectors.toList());
    }

    private List<MedicationRecommendation> calculateRecommendations(List<Medication> medications, RecommendationRequest request) {
        List<MedicationRecommendation> recommendations = new ArrayList<>();

        for (Medication medication : medications) {
            MedicationRecommendation recommendation = new MedicationRecommendation(medication);

            // Calculate clinical score
            recommendation.setClinicalScore(calculateClinicalScore(medication, request));

            // Calculate cost score
            recommendation.setCostScore(calculateCostScore(medication, request));

            // Calculate safety score
            recommendation.setSafetyScore(calculateSafetyScore(medication, request));

            // Calculate overall score
            recommendation.setOverallScore(calculateOverallScore(recommendation));

            // Set reasoning
            recommendation.setReasoning(generateReasoning(recommendation, request));

            // Calculate estimated cost
            recommendation.setEstimatedCost(calculateEstimatedCost(medication, request));

            // Set insurance coverage
            recommendation.setInsuranceCoverage(determineInsuranceCoverage(medication, request));

            // Set evidence level
            recommendation.setEvidenceLevel(medication.getEvidenceLevel());

            // Set clinical guidelines
            recommendation.setClinicalGuidelines(medication.getClinicalGuidelines());

            recommendations.add(recommendation);
        }

        return recommendations;
    }

    private Double calculateClinicalScore(Medication medication, RecommendationRequest request) {
        double score = 0.0;

        // Base clinical effectiveness score
        if (medication.getClinicalEffectivenessScore() != null) {
            score += medication.getClinicalEffectivenessScore() * 0.4;
        }

        // Symptom match score
        if (medication.getSymptomIndicators() != null) {
            try {
                List<String> symptomIndicators = objectMapper.readValue(
                    medication.getSymptomIndicators(), 
                    new TypeReference<List<String>>() {}
                );
                
                long matchingSymptoms = request.getSymptoms().stream()
                    .filter(symptom -> symptomIndicators.stream()
                        .anyMatch(indicator -> indicator.toLowerCase().contains(symptom.toLowerCase())))
                    .count();
                
                score += (double) matchingSymptoms / request.getSymptoms().size() * 0.3;
            } catch (Exception e) {
                log.warn("Error parsing symptom indicators for medication {}: {}", medication.getId(), e.getMessage());
            }
        }

        // Evidence level score
        if ("A".equals(medication.getEvidenceLevel())) {
            score += 0.2;
        } else if ("B".equals(medication.getEvidenceLevel())) {
            score += 0.15;
        } else if ("C".equals(medication.getEvidenceLevel())) {
            score += 0.1;
        }

        // FDA approval score
        if (Boolean.TRUE.equals(medication.getFdaApproved())) {
            score += 0.1;
        }

        return Math.min(score, 1.0);
    }

    private Double calculateCostScore(Medication medication, RecommendationRequest request) {
        double score = 1.0; // Start with perfect score

        // Generic preference
        if (Boolean.TRUE.equals(request.getPreferGeneric()) && Boolean.TRUE.equals(medication.getGenericAvailable())) {
            score += 0.2;
        }

        // Cost comparison
        BigDecimal cost = medication.getCostGeneric() != null ? medication.getCostGeneric() : medication.getCostBrand();
        if (cost != null && request.getMaxBudget() != null) {
            if (cost.compareTo(request.getMaxBudget()) <= 0) {
                score += 0.3;
            } else {
                score -= 0.5;
            }
        }

        // Insurance tier preference
        if (request.getPreferredTier() != null && medication.getPreferredTier() != null) {
            if (request.getPreferredTier().equals(medication.getPreferredTier())) {
                score += 0.2;
            } else if ("Tier 1".equals(medication.getPreferredTier())) {
                score += 0.1;
            }
        }

        // OTC availability
        if (Boolean.TRUE.equals(medication.getOtcAvailable())) {
            score += 0.1;
        }

        return Math.max(0.0, Math.min(score, 1.0));
    }

    private Double calculateSafetyScore(Medication medication, RecommendationRequest request) {
        double score = 1.0; // Start with perfect score

        // Safety score from medication
        if (medication.getSafetyScore() != null) {
            score = medication.getSafetyScore();
        }

        // Age-specific safety adjustments
        if ("PEDIATRIC".equals(request.getAgeGroup()) && Boolean.TRUE.equals(medication.getPediatricSafe())) {
            score += 0.1;
        }
        if ("GERIATRIC".equals(request.getAgeGroup()) && Boolean.TRUE.equals(medication.getGeriatricSafe())) {
            score += 0.1;
        }

        // Pregnancy safety
        if (Boolean.TRUE.equals(request.getIsPregnant())) {
            if ("A".equals(medication.getPregnancyCategory())) {
                score += 0.2;
            } else if ("B".equals(medication.getPregnancyCategory())) {
                score += 0.1;
            } else if ("C".equals(medication.getPregnancyCategory())) {
                score -= 0.1;
            } else if ("D".equals(medication.getPregnancyCategory())) {
                score -= 0.3;
            } else if ("X".equals(medication.getPregnancyCategory())) {
                score -= 0.5;
            }
        }

        // Breastfeeding safety
        if (Boolean.TRUE.equals(request.getIsBreastfeeding()) && Boolean.TRUE.equals(medication.getBreastfeedingSafe())) {
            score += 0.1;
        }

        // Controlled substance penalty
        if (Boolean.TRUE.equals(medication.getControlledSubstance())) {
            score -= 0.2;
        }

        return Math.max(0.0, Math.min(score, 1.0));
    }

    private Double calculateOverallScore(MedicationRecommendation recommendation) {
        double clinicalWeight = 0.5;
        double costWeight = 0.3;
        double safetyWeight = 0.2;

        return (recommendation.getClinicalScore() * clinicalWeight) +
               (recommendation.getCostScore() * costWeight) +
               (recommendation.getSafetyScore() * safetyWeight);
    }

    private String generateReasoning(MedicationRecommendation recommendation, RecommendationRequest request) {
        StringBuilder reasoning = new StringBuilder();

        // Clinical reasoning
        if (recommendation.getClinicalScore() > 0.8) {
            reasoning.append("Excellent clinical match for symptoms. ");
        } else if (recommendation.getClinicalScore() > 0.6) {
            reasoning.append("Good clinical match for symptoms. ");
        } else {
            reasoning.append("Moderate clinical match for symptoms. ");
        }

        // Cost reasoning
        if (recommendation.getCostScore() > 0.8) {
            reasoning.append("Very cost-effective option. ");
        } else if (recommendation.getCostScore() > 0.6) {
            reasoning.append("Cost-effective option. ");
        } else {
            reasoning.append("Higher cost option. ");
        }

        // Safety reasoning
        if (recommendation.getSafetyScore() > 0.9) {
            reasoning.append("Excellent safety profile. ");
        } else if (recommendation.getSafetyScore() > 0.7) {
            reasoning.append("Good safety profile. ");
        } else {
            reasoning.append("Requires careful monitoring. ");
        }

        // Evidence level
        if ("A".equals(recommendation.getEvidenceLevel())) {
            reasoning.append("Strong evidence supports use. ");
        } else if ("B".equals(recommendation.getEvidenceLevel())) {
            reasoning.append("Moderate evidence supports use. ");
        }

        return reasoning.toString();
    }

    private BigDecimal calculateEstimatedCost(Medication medication, RecommendationRequest request) {
        // Get insurance info for the patient
        List<InsuranceInfo> insuranceInfos = insuranceInfoRepository.findByPatientIdAndIsPrimaryTrue(request.getPatientId());
        
        if (!insuranceInfos.isEmpty()) {
            InsuranceInfo insurance = insuranceInfos.get(0);
            
            // Calculate cost based on insurance coverage
            if (medication.getCopayAmount() != null) {
                return medication.getCopayAmount();
            } else if (medication.getCoinsurancePercentage() != null) {
                BigDecimal baseCost = medication.getCostGeneric() != null ? medication.getCostGeneric() : medication.getCostBrand();
                if (baseCost != null) {
                    return baseCost.multiply(medication.getCoinsurancePercentage()).divide(new BigDecimal("100"));
                }
            }
        }

        // Return generic cost if available, otherwise brand cost
        return medication.getCostGeneric() != null ? medication.getCostGeneric() : medication.getCostBrand();
    }

    private String determineInsuranceCoverage(Medication medication, RecommendationRequest request) {
        // Get insurance info for the patient
        List<InsuranceInfo> insuranceInfos = insuranceInfoRepository.findByPatientIdAndIsPrimaryTrue(request.getPatientId());
        
        if (!insuranceInfos.isEmpty()) {
            InsuranceInfo insurance = insuranceInfos.get(0);
            
            // Check if medication is covered by this insurance
            if (medication.getInsuranceCoverage() != null) {
                try {
                    Map<String, Object> coverage = objectMapper.readValue(
                        medication.getInsuranceCoverage(), 
                        new TypeReference<Map<String, Object>>() {}
                    );
                    
                    if (coverage.containsKey(insurance.getProviderName())) {
                        return "Covered";
                    }
                } catch (Exception e) {
                    log.warn("Error parsing insurance coverage for medication {}: {}", medication.getId(), e.getMessage());
                }
            }
        }

        return "Not covered";
    }

    private void addAlternativesAndWarnings(List<MedicationRecommendation> recommendations, RecommendationRequest request) {
        for (MedicationRecommendation recommendation : recommendations) {
            // Add warnings
            if (Boolean.TRUE.equals(recommendation.getMedication().getControlledSubstance())) {
                recommendation.getWarnings().add("Controlled substance - requires special monitoring");
            }
            if (Boolean.TRUE.equals(recommendation.getMedication().getPriorAuthorizationRequired())) {
                recommendation.getWarnings().add("Prior authorization required");
            }
            if (Boolean.TRUE.equals(recommendation.getMedication().getStepTherapyRequired())) {
                recommendation.getWarnings().add("Step therapy required");
            }

            // Add alternatives
            if (recommendation.getMedication().getAlternativeMedications() != null) {
                try {
                    List<String> alternatives = objectMapper.readValue(
                        recommendation.getMedication().getAlternativeMedications(), 
                        new TypeReference<List<String>>() {}
                    );
                    recommendation.getAlternatives().addAll(alternatives);
                } catch (Exception e) {
                    log.warn("Error parsing alternative medications for medication {}: {}", recommendation.getMedication().getId(), e.getMessage());
                }
            }
        }
    }

    public Prescription createPrescriptionFromRecommendation(MedicationRecommendation recommendation, RecommendationRequest request) {
        Prescription prescription = Prescription.builder()
            .patient(new User(request.getPatientId()))
            .doctor(new User(request.getDoctorId()))
            .appointment(request.getAppointmentId() != null ? new Appointment(request.getAppointmentId()) : null)
            .medication(recommendation.getMedication())
            .diagnosisCode(request.getDiagnosisCode())
            .diagnosisDescription(request.getDiagnosis())
            .clinicalAppropriatenessScore(recommendation.getClinicalScore())
            .costEffectivenessScore(recommendation.getCostScore())
            .safetyScore(recommendation.getSafetyScore())
            .overallRecommendationScore(recommendation.getOverallScore())
            .recommendationReasoning(recommendation.getReasoning())
            .evidenceLevel(recommendation.getEvidenceLevel())
            .clinicalGuidelinesFollowed(recommendation.getClinicalGuidelines())
            .alternativeMedicationsConsidered(objectMapper.writeValueAsString(recommendation.getAlternatives()))
            .status(Prescription.PrescriptionStatus.DRAFT)
            .prescriptionType(Prescription.PrescriptionType.NEW)
            .urgencyLevel(Prescription.UrgencyLevel.valueOf(request.getUrgencyLevel() != null ? request.getUrgencyLevel().toUpperCase() : "ROUTINE"))
            .dispensingStatus(Prescription.DispensingStatus.PENDING)
            .createdBy(request.getDoctorId().toString())
            .build();

        return prescriptionRepository.save(prescription);
    }
} 