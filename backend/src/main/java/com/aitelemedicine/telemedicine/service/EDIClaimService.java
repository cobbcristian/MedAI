package com.aitelemedicine.telemedicine.service;

import com.aitelemedicine.telemedicine.model.*;
import com.aitelemedicine.telemedicine.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class EDIClaimService {
    
    private final InsuranceClaimRepository insuranceClaimRepository;
    private final CodeMappingRepository codeMappingRepository;
    private final InsuranceInfoRepository insuranceInfoRepository;
    private final AppointmentRepository appointmentRepository;
    private final AuditLogService auditLogService;
    
    @Value("${app.edi.output-directory:edi-files}")
    private String ediOutputDirectory;
    
    @Value("${app.edi.sender-id:123456789}")
    private String senderId;
    
    @Value("${app.edi.receiver-id:987654321}")
    private String receiverId;
    
    @Value("${app.edi.clearinghouse-url}")
    private String clearinghouseUrl;
    
    @Value("${app.edi.clearinghouse-username}")
    private String clearinghouseUsername;
    
    @Value("${app.edi.clearinghouse-password}")
    private String clearinghousePassword;
    
    /**
     * Automatically generate and submit insurance claim for an appointment
     */
    @Transactional
    public InsuranceClaim generateAndSubmitClaim(Long appointmentId) {
        try {
            Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
            
            // Get patient's primary insurance
            InsuranceInfo insuranceInfo = insuranceInfoRepository.findByPatientIdAndIsPrimaryTrue(appointment.getPatient().getId())
                .orElseThrow(() -> new RuntimeException("No primary insurance found for patient"));
            
            // Generate claim
            InsuranceClaim claim = generateClaim(appointment, insuranceInfo);
            
            // Generate EDI 837 file
            String ediContent = generateEDI837(claim);
            claim.setEdiContent(ediContent);
            
            // Save claim
            claim = insuranceClaimRepository.save(claim);
            
            // Submit to clearinghouse
            submitToClearinghouse(claim);
            
            // Log audit event
            auditLogService.logEvent(
                appointment.getDoctor(),
                "CLAIM_GENERATED",
                "INSURANCE_CLAIM",
                claim.getId().toString(),
                "Generated EDI 837 claim for appointment " + appointmentId
            );
            
            return claim;
            
        } catch (Exception e) {
            log.error("Error generating claim for appointment {}: {}", appointmentId, e.getMessage());
            throw new RuntimeException("Failed to generate insurance claim", e);
        }
    }
    
    /**
     * Generate insurance claim from appointment data
     */
    private InsuranceClaim generateClaim(Appointment appointment, InsuranceInfo insuranceInfo) {
        // Find appropriate code mapping
        CodeMapping codeMapping = findCodeMapping(appointment);
        
        // Generate unique claim number
        String claimNumber = generateClaimNumber();
        String controlNumber = generateControlNumber();
        
        // Calculate billed amount
        BigDecimal billedAmount = codeMapping.getDefaultBilledAmount() != null 
            ? codeMapping.getDefaultBilledAmount() 
            : new BigDecimal("150.00");
        
        return InsuranceClaim.builder()
            .appointment(appointment)
            .patient(appointment.getPatient())
            .doctor(appointment.getDoctor())
            .insuranceInfo(insuranceInfo)
            .claimNumber(claimNumber)
            .controlNumber(controlNumber)
            .claimDate(LocalDateTime.now())
            .serviceDate(appointment.getStartTime())
            .cptCode(codeMapping.getCptCode())
            .icd10Code(codeMapping.getIcd10Code())
            .billedAmount(billedAmount)
            .placeOfService(codeMapping.getPlaceOfService())
            .modifier1(codeMapping.getModifier1())
            .modifier2(codeMapping.getModifier2())
            .modifier3(codeMapping.getModifier3())
            .modifier4(codeMapping.getModifier4())
            .units(codeMapping.getUnits())
            .renderingProviderNpi(appointment.getDoctor().getLicense()) // Assuming NPI is stored in license field
            .billingProviderNpi(appointment.getDoctor().getLicense())
            .status(InsuranceClaim.ClaimStatus.READY_TO_SUBMIT)
            .submissionStatus(InsuranceClaim.SubmissionStatus.NOT_SUBMITTED)
            .build();
    }
    
    /**
     * Find appropriate CPT/ICD-10 code mapping based on appointment type and diagnosis
     */
    private CodeMapping findCodeMapping(Appointment appointment) {
        String appointmentType = appointment.getType() != null ? appointment.getType().name() : "CONSULTATION";
        
        // Try to find mapping based on AI diagnosis first
        if (appointment.getAiAnalysis() != null && !appointment.getAiAnalysis().isEmpty()) {
            List<CodeMapping> aiMappings = codeMappingRepository.findByAiDiagnosisContainingAndIsActiveTrueOrderByPriorityDesc(
                appointment.getAiAnalysis()
            );
            if (!aiMappings.isEmpty()) {
                return aiMappings.get(0);
            }
        }
        
        // Try manual diagnosis
        if (appointment.getDiagnosis() != null && !appointment.getDiagnosis().isEmpty()) {
            List<CodeMapping> manualMappings = codeMappingRepository.findByManualDiagnosisContainingAndIsActiveTrueOrderByPriorityDesc(
                appointment.getDiagnosis()
            );
            if (!manualMappings.isEmpty()) {
                return manualMappings.get(0);
            }
        }
        
        // Fall back to appointment type mapping
        List<CodeMapping> typeMappings = codeMappingRepository.findByAppointmentTypeAndIsActiveTrueOrderByPriorityDesc(
            appointmentType
        );
        
        if (!typeMappings.isEmpty()) {
            return typeMappings.get(0);
        }
        
        // Default mapping
        return codeMappingRepository.findByAppointmentTypeAndIsActiveTrueOrderByPriorityDesc("CONSULTATION")
            .stream()
            .findFirst()
            .orElseThrow(() -> new RuntimeException("No default code mapping found"));
    }
    
    /**
     * Generate EDI 837 Professional claim
     */
    private String generateEDI837(InsuranceClaim claim) {
        StringBuilder edi = new StringBuilder();
        
        // ISA - Interchange Control Header
        edi.append("ISA*00*          *00*          *ZZ*").append(senderId).append("*ZZ*").append(receiverId)
            .append("*").append(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyMMdd")))
            .append("*").append(LocalDateTime.now().format(DateTimeFormatter.ofPattern("HHmm")))
            .append("*^*00501*").append(generateControlNumber()).append("*0*P*:~\n");
        
        // GS - Functional Group Header
        edi.append("GS*HC*").append(senderId).append("*").append(receiverId)
            .append("*").append(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd")))
            .append("*").append(LocalDateTime.now().format(DateTimeFormatter.ofPattern("HHmm")))
            .append("*1*X*005010X222A1~\n");
        
        // ST - Transaction Set Header
        edi.append("ST*837*0001*005010X222A1~\n");
        
        // BHT - Beginning of Hierarchical Transaction
        edi.append("BHT*0019*00*").append(claim.getControlNumber())
            .append("*").append(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd")))
            .append("*").append(LocalDateTime.now().format(DateTimeFormatter.ofPattern("HHmm")))
            .append("*CH~\n");
        
        // NM1 - Submitter Name
        edi.append("NM1*41*2*AI TELEMEDICINE PLATFORM*****46*").append(senderId).append("~\n");
        
        // PER - Submitter EDI Contact Information
        edi.append("PER*IC*CONTACT PERSON*TE*555-123-4567*EM*claims@aitelemedicine.com~\n");
        
        // NM1 - Receiver Name
        edi.append("NM1*40*2*CLEARINGHOUSE NAME*****46*").append(receiverId).append("~\n");
        
        // HL - Hierarchical Level
        edi.append("HL*1**20*1~\n");
        
        // PRV - Provider Information
        edi.append("PRV*BI*PXC*207Q00000X~\n"); // Primary Care
        
        // NM1 - Billing Provider
        edi.append("NM1*85*2*").append(claim.getDoctor().getName())
            .append("*****XX*").append(claim.getBillingProviderNpi()).append("~\n");
        
        // N3 - Billing Provider Address
        edi.append("N3*123 MAIN STREET~\n");
        
        // N4 - Billing Provider City/State/ZIP
        edi.append("N4*ANYTOWN*NY*12345~\n");
        
        // HL - Hierarchical Level (Patient)
        edi.append("HL*2*1*22*0~\n");
        
        // SBR - Subscriber Information
        edi.append("SBR*P*18*").append(claim.getInsuranceInfo().getGroupNumber())
            .append("*****CI~\n");
        
        // NM1 - Subscriber Name
        edi.append("NM1*IL*1*").append(claim.getInsuranceInfo().getSubscriberLastName())
            .append("*").append(claim.getInsuranceInfo().getSubscriberFirstName())
            .append("*****MI*").append(claim.getInsuranceInfo().getMemberId()).append("~\n");
        
        // N3 - Subscriber Address
        edi.append("N3*456 PATIENT STREET~\n");
        
        // N4 - Subscriber City/State/ZIP
        edi.append("N4*PATIENT CITY*NY*54321~\n");
        
        // DMG - Subscriber Demographic Information
        if (claim.getInsuranceInfo().getSubscriberDob() != null) {
            edi.append("DMG*D8*").append(claim.getInsuranceInfo().getSubscriberDob().format(DateTimeFormatter.ofPattern("yyyyMMdd")))
                .append("*M~\n");
        }
        
        // NM1 - Payer Name
        edi.append("NM1*PR*2*").append(claim.getInsuranceInfo().getProviderName())
            .append("*****PI*").append(claim.getInsuranceInfo().getPayerId()).append("~\n");
        
        // HL - Hierarchical Level (Claim)
        edi.append("HL*3*2*23*0~\n");
        
        // LX - Service Line Counter
        edi.append("LX*1~\n");
        
        // SV1 - Professional Service
        edi.append("SV1*").append(claim.getCptCode()).append("*")
            .append(claim.getBilledAmount().toString()).append("*UN*1*")
            .append(claim.getUnits()).append("*N~\n");
        
        // DTP - Date/Time Reference
        edi.append("DTP*472*D8*").append(claim.getServiceDate().format(DateTimeFormatter.ofPattern("yyyyMMdd"))).append("~\n");
        
        // REF - Service Identification
        edi.append("REF*6R*").append(claim.getClaimNumber()).append("~\n");
        
        // SE - Transaction Set Trailer
        edi.append("SE*1*0001~\n");
        
        // GE - Functional Group Trailer
        edi.append("GE*1*1~\n");
        
        // IEA - Interchange Control Trailer
        edi.append("IEA*1*").append(generateControlNumber()).append("~\n");
        
        return edi.toString();
    }
    
    /**
     * Submit claim to clearinghouse
     */
    private void submitToClearinghouse(InsuranceClaim claim) {
        try {
            // Save EDI file
            String fileName = "837_" + claim.getClaimNumber() + "_" + 
                LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss")) + ".edi";
            
            File outputDir = new File(ediOutputDirectory);
            if (!outputDir.exists()) {
                outputDir.mkdirs();
            }
            
            File ediFile = new File(outputDir, fileName);
            try (FileWriter writer = new FileWriter(ediFile)) {
                writer.write(claim.getEdiContent());
            }
            
            claim.setEdiFilePath(ediFile.getAbsolutePath());
            claim.setSubmissionDate(LocalDateTime.now());
            claim.setSubmissionStatus(InsuranceClaim.SubmissionStatus.SUBMITTED_TO_CLEARINGHOUSE);
            claim.setStatus(InsuranceClaim.ClaimStatus.SUBMITTED);
            
            insuranceClaimRepository.save(claim);
            
            log.info("Submitted claim {} to clearinghouse", claim.getClaimNumber());
            
        } catch (IOException e) {
            log.error("Error submitting claim to clearinghouse: {}", e.getMessage());
            throw new RuntimeException("Failed to submit claim to clearinghouse", e);
        }
    }
    
    /**
     * Process clearinghouse response
     */
    public void processClearinghouseResponse(String response) {
        // Parse 999/277CA response
        // Update claim status based on response
        // Log audit events
    }
    
    /**
     * Process payer response (835)
     */
    public void processPayerResponse(String response) {
        // Parse 835 response
        // Update claim with payment information
        // Log audit events
    }
    
    /**
     * Generate unique claim number
     */
    private String generateClaimNumber() {
        return "CLM" + System.currentTimeMillis() + UUID.randomUUID().toString().substring(0, 8);
    }
    
    /**
     * Generate unique control number
     */
    private String generateControlNumber() {
        return String.valueOf(System.currentTimeMillis());
    }
    
    /**
     * Get claims by status
     */
    public List<InsuranceClaim> getClaimsByStatus(InsuranceClaim.ClaimStatus status) {
        return insuranceClaimRepository.findByStatus(status);
    }
    
    /**
     * Get claims by submission status
     */
    public List<InsuranceClaim> getClaimsBySubmissionStatus(InsuranceClaim.SubmissionStatus status) {
        return insuranceClaimRepository.findBySubmissionStatus(status);
    }
    
    /**
     * Get claims for patient
     */
    public List<InsuranceClaim> getClaimsByPatient(Long patientId) {
        return insuranceClaimRepository.findByPatientIdOrderByCreatedAtDesc(patientId);
    }
    
    /**
     * Get claims for appointment
     */
    public List<InsuranceClaim> getClaimsByAppointment(Long appointmentId) {
        return insuranceClaimRepository.findByAppointmentIdOrderByCreatedAtDesc(appointmentId);
    }
    
    /**
     * Update claim status
     */
    @Transactional
    public InsuranceClaim updateClaimStatus(Long claimId, InsuranceClaim.ClaimStatus status) {
        InsuranceClaim claim = insuranceClaimRepository.findById(claimId)
            .orElseThrow(() -> new RuntimeException("Claim not found"));
        
        claim.setStatus(status);
        return insuranceClaimRepository.save(claim);
    }
} 