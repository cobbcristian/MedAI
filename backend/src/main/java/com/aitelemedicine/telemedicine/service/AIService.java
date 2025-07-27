package com.aitelemedicine.telemedicine.service;

import com.theokanning.openai.completion.chat.ChatCompletionRequest;
import com.theokanning.openai.completion.chat.ChatMessage;
import com.theokanning.openai.service.OpenAiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AIService {

    @Value("${app.openai.api-key}")
    private String openaiApiKey;

    @Value("${app.openai.model}")
    private String model;

    @Value("${app.openai.max-tokens}")
    private Integer maxTokens;

    private OpenAiService openAiService;

    @Autowired
    public AIService() {
        this.openAiService = new OpenAiService(openaiApiKey, Duration.ofSeconds(60));
    }

    public Map<String, Object> analyzeSymptoms(String symptoms, String patientAge, String patientGender, String medicalHistory) {
        try {
            String prompt = buildSymptomAnalysisPrompt(symptoms, patientAge, patientGender, medicalHistory);
            
            List<ChatMessage> messages = new ArrayList<>();
            messages.add(new ChatMessage("system", "You are a medical AI assistant. Provide analysis based on symptoms but always recommend consulting a healthcare professional for proper diagnosis."));
            messages.add(new ChatMessage("user", prompt));

            ChatCompletionRequest request = ChatCompletionRequest.builder()
                    .model(model)
                    .messages(messages)
                    .maxTokens(maxTokens)
                    .temperature(0.3)
                    .build();

            String response = openAiService.createChatCompletion(request).getChoices().get(0).getMessage().getContent();

            return parseSymptomAnalysis(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to analyze symptoms: " + e.getMessage());
            return errorResponse;
        }
    }

    public Map<String, Object> analyzeMedicalRecord(String recordContent, String recordType) {
        try {
            String prompt = buildMedicalRecordAnalysisPrompt(recordContent, recordType);
            
            List<ChatMessage> messages = new ArrayList<>();
            messages.add(new ChatMessage("system", "You are a medical AI assistant. Analyze medical records and provide insights while maintaining patient privacy."));
            messages.add(new ChatMessage("user", prompt));

            ChatCompletionRequest request = ChatCompletionRequest.builder()
                    .model(model)
                    .messages(messages)
                    .maxTokens(maxTokens)
                    .temperature(0.2)
                    .build();

            String response = openAiService.createChatCompletion(request).getChoices().get(0).getMessage().getContent();

            return parseMedicalRecordAnalysis(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to analyze medical record: " + e.getMessage());
            return errorResponse;
        }
    }

    public Map<String, Object> generatePrescriptionSuggestions(String diagnosis, String symptoms, String patientAllergies) {
        try {
            String prompt = buildPrescriptionPrompt(diagnosis, symptoms, patientAllergies);
            
            List<ChatMessage> messages = new ArrayList<>();
            messages.add(new ChatMessage("system", "You are a medical AI assistant. Suggest medications based on diagnosis but always recommend consulting a healthcare professional."));
            messages.add(new ChatMessage("user", prompt));

            ChatCompletionRequest request = ChatCompletionRequest.builder()
                    .model(model)
                    .messages(messages)
                    .maxTokens(maxTokens)
                    .temperature(0.2)
                    .build();

            String response = openAiService.createChatCompletion(request).getChoices().get(0).getMessage().getContent();

            return parsePrescriptionSuggestions(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to generate prescription suggestions: " + e.getMessage());
            return errorResponse;
        }
    }

    public Map<String, Object> generateSOAPNotes(String patientSymptoms, String diagnosis, String treatment, String patientHistory) {
        try {
            String prompt = buildSOAPNotesPrompt(patientSymptoms, diagnosis, treatment, patientHistory);
            
            List<ChatMessage> messages = new ArrayList<>();
            messages.add(new ChatMessage("system", "You are a medical AI assistant. Generate SOAP notes based on the provided information."));
            messages.add(new ChatMessage("user", prompt));

            ChatCompletionRequest request = ChatCompletionRequest.builder()
                    .model(model)
                    .messages(messages)
                    .maxTokens(maxTokens)
                    .temperature(0.3)
                    .build();

            String response = openAiService.createChatCompletion(request).getChoices().get(0).getMessage().getContent();

            return parseSOAPNotes(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to generate SOAP notes: " + e.getMessage());
            return errorResponse;
        }
    }

    public String buildSymptomAnalysisPrompt(String symptoms, String patientAge, String patientGender, String medicalHistory) {
        return String.format("""
            Analyze the following symptoms and provide a comprehensive assessment:
            
            Symptoms: %s
            Patient Age: %s
            Patient Gender: %s
            Medical History: %s
            
            Please provide:
            1. Possible conditions (with confidence levels)
            2. Recommended follow-up questions
            3. Urgency level (Low/Medium/High/Emergency)
            4. Recommended next steps
            5. Red flags to watch for
            
            Format the response as JSON with the following structure:
            {
                "possibleConditions": [{"condition": "name", "confidence": "percentage", "description": "explanation"}],
                "followUpQuestions": ["question1", "question2"],
                "urgencyLevel": "level",
                "nextSteps": ["step1", "step2"],
                "redFlags": ["flag1", "flag2"],
                "recommendations": "general advice"
            }
            """, symptoms, patientAge, patientGender, medicalHistory);
    }

    public String buildMedicalRecordAnalysisPrompt(String recordContent, String recordType) {
        return String.format("""
            Analyze the following medical record and provide insights:
            
            Record Type: %s
            Content: %s
            
            Please provide:
            1. Key findings
            2. Abnormal values (if any)
            3. Recommendations
            4. Follow-up suggestions
            
            Format the response as JSON with the following structure:
            {
                "keyFindings": ["finding1", "finding2"],
                "abnormalValues": [{"test": "name", "value": "result", "normal": "range"}],
                "recommendations": ["rec1", "rec2"],
                "followUp": ["followup1", "followup2"],
                "summary": "overall assessment"
            }
            """, recordType, recordContent);
    }

    public String buildPrescriptionPrompt(String diagnosis, String symptoms, String patientAllergies) {
        return String.format("""
            Suggest medications for the following diagnosis:
            
            Diagnosis: %s
            Symptoms: %s
            Patient Allergies: %s
            
            Please provide:
            1. Recommended medications
            2. Dosage suggestions
            3. Contraindications
            4. Side effects to monitor
            
            Format the response as JSON with the following structure:
            {
                "medications": [{"name": "medication", "dosage": "dosage", "frequency": "frequency"}],
                "contraindications": ["contra1", "contra2"],
                "sideEffects": ["effect1", "effect2"],
                "monitoring": ["monitor1", "monitor2"],
                "notes": "additional notes"
            }
            """, diagnosis, symptoms, patientAllergies);
    }

    public String buildSOAPNotesPrompt(String patientSymptoms, String diagnosis, String treatment, String patientHistory) {
        return String.format("""
            Generate SOAP notes based on the following information:
            
            Patient Symptoms: %s
            Diagnosis: %s
            Treatment: %s
            Patient History: %s
            
            Please provide structured SOAP notes with:
            1. Subjective (patient's symptoms and history)
            2. Objective (clinical findings)
            3. Assessment (diagnosis and differential)
            4. Plan (treatment and follow-up)
            
            Format the response as JSON with the following structure:
            {
                "subjective": "patient's reported symptoms and history",
                "objective": "clinical findings and observations",
                "assessment": "diagnosis and differential diagnosis",
                "plan": "treatment plan and follow-up"
            }
            """, patientSymptoms, diagnosis, treatment, patientHistory);
    }

    public Map<String, Object> parseSymptomAnalysis(String response) {
        // Simple parsing - in production, you'd want more robust JSON parsing
        Map<String, Object> result = new HashMap<>();
        result.put("analysis", response);
        result.put("timestamp", System.currentTimeMillis());
        return result;
    }

    public Map<String, Object> parseMedicalRecordAnalysis(String response) {
        Map<String, Object> result = new HashMap<>();
        result.put("analysis", response);
        result.put("timestamp", System.currentTimeMillis());
        return result;
    }

    public Map<String, Object> parsePrescriptionSuggestions(String response) {
        Map<String, Object> result = new HashMap<>();
        result.put("suggestions", response);
        result.put("timestamp", System.currentTimeMillis());
        return result;
    }

    public Map<String, Object> parseSOAPNotes(String response) {
        Map<String, Object> result = new HashMap<>();
        result.put("soapNotes", response);
        result.put("timestamp", System.currentTimeMillis());
        return result;
    }
} 