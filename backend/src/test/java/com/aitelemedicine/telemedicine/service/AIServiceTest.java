package com.aitelemedicine.telemedicine.service;

import com.theokanning.openai.completion.chat.ChatCompletionRequest;
import com.theokanning.openai.completion.chat.ChatMessage;
import com.theokanning.openai.service.OpenAiService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AIServiceTest {

    @Mock
    private OpenAiService openAiService;

    @InjectMocks
    private AIService aiService;

    @BeforeEach
    void setUp() {
        // Set required properties using ReflectionTestUtils
        ReflectionTestUtils.setField(aiService, "model", "gpt-4");
        ReflectionTestUtils.setField(aiService, "maxTokens", 1000);
    }

    @Test
    void analyzeSymptoms_Success() {
        // Arrange
        String symptoms = "headache, fever, fatigue";
        String patientAge = "30";
        String patientGender = "male";
        String medicalHistory = "hypertension";

        // Mock OpenAI response
        var mockResponse = mock(com.theokanning.openai.completion.chat.ChatCompletionResult.class);
        var mockChoice = mock(com.theokanning.openai.completion.chat.ChatCompletionChoice.class);
        var mockMessage = mock(ChatMessage.class);
        
        when(mockMessage.getContent()).thenReturn("{\"possibleConditions\":[{\"condition\":\"Common Cold\",\"confidence\":\"70%\"}]}");
        when(mockChoice.getMessage()).thenReturn(mockMessage);
        when(mockResponse.getChoices()).thenReturn(java.util.List.of(mockChoice));
        when(openAiService.createChatCompletion(any(ChatCompletionRequest.class))).thenReturn(mockResponse);

        // Act
        Map<String, Object> result = aiService.analyzeSymptoms(symptoms, patientAge, patientGender, medicalHistory);

        // Assert
        assertNotNull(result);
        assertTrue(result.containsKey("analysis"));
        verify(openAiService).createChatCompletion(any(ChatCompletionRequest.class));
    }

    @Test
    void analyzeSymptoms_Exception() {
        // Arrange
        String symptoms = "headache";
        String patientAge = "30";
        String patientGender = "male";
        String medicalHistory = "";

        when(openAiService.createChatCompletion(any(ChatCompletionRequest.class)))
                .thenThrow(new RuntimeException("OpenAI API error"));

        // Act
        Map<String, Object> result = aiService.analyzeSymptoms(symptoms, patientAge, patientGender, medicalHistory);

        // Assert
        assertNotNull(result);
        assertTrue(result.containsKey("error"));
        assertTrue(result.get("error").toString().contains("Failed to analyze symptoms"));
    }

    @Test
    void analyzeMedicalRecord_Success() {
        // Arrange
        String recordContent = "Blood pressure: 120/80, Heart rate: 72 bpm";
        String recordType = "Vital Signs";

        // Mock OpenAI response
        var mockResponse = mock(com.theokanning.openai.completion.chat.ChatCompletionResult.class);
        var mockChoice = mock(com.theokanning.openai.completion.chat.ChatCompletionChoice.class);
        var mockMessage = mock(ChatMessage.class);
        
        when(mockMessage.getContent()).thenReturn("{\"keyFindings\":[\"Normal blood pressure\",\"Normal heart rate\"]}");
        when(mockChoice.getMessage()).thenReturn(mockMessage);
        when(mockResponse.getChoices()).thenReturn(java.util.List.of(mockChoice));
        when(openAiService.createChatCompletion(any(ChatCompletionRequest.class))).thenReturn(mockResponse);

        // Act
        Map<String, Object> result = aiService.analyzeMedicalRecord(recordContent, recordType);

        // Assert
        assertNotNull(result);
        assertTrue(result.containsKey("analysis"));
        verify(openAiService).createChatCompletion(any(ChatCompletionRequest.class));
    }

    @Test
    void analyzeMedicalRecord_Exception() {
        // Arrange
        String recordContent = "Test record";
        String recordType = "Test";

        when(openAiService.createChatCompletion(any(ChatCompletionRequest.class)))
                .thenThrow(new RuntimeException("OpenAI API error"));

        // Act
        Map<String, Object> result = aiService.analyzeMedicalRecord(recordContent, recordType);

        // Assert
        assertNotNull(result);
        assertTrue(result.containsKey("error"));
        assertTrue(result.get("error").toString().contains("Failed to analyze medical record"));
    }

    @Test
    void generatePrescriptionSuggestions_Success() {
        // Arrange
        String diagnosis = "Hypertension";
        String symptoms = "High blood pressure";
        String patientAllergies = "None";

        // Mock OpenAI response
        var mockResponse = mock(com.theokanning.openai.completion.chat.ChatCompletionResult.class);
        var mockChoice = mock(com.theokanning.openai.completion.chat.ChatCompletionChoice.class);
        var mockMessage = mock(ChatMessage.class);
        
        when(mockMessage.getContent()).thenReturn("{\"medications\":[{\"name\":\"Lisinopril\",\"dosage\":\"10mg daily\"}]}");
        when(mockChoice.getMessage()).thenReturn(mockMessage);
        when(mockResponse.getChoices()).thenReturn(java.util.List.of(mockChoice));
        when(openAiService.createChatCompletion(any(ChatCompletionRequest.class))).thenReturn(mockResponse);

        // Act
        Map<String, Object> result = aiService.generatePrescriptionSuggestions(diagnosis, symptoms, patientAllergies);

        // Assert
        assertNotNull(result);
        assertTrue(result.containsKey("suggestions"));
        verify(openAiService).createChatCompletion(any(ChatCompletionRequest.class));
    }

    @Test
    void generatePrescriptionSuggestions_Exception() {
        // Arrange
        String diagnosis = "Test diagnosis";
        String symptoms = "Test symptoms";
        String patientAllergies = "None";

        when(openAiService.createChatCompletion(any(ChatCompletionRequest.class)))
                .thenThrow(new RuntimeException("OpenAI API error"));

        // Act
        Map<String, Object> result = aiService.generatePrescriptionSuggestions(diagnosis, symptoms, patientAllergies);

        // Assert
        assertNotNull(result);
        assertTrue(result.containsKey("error"));
        assertTrue(result.get("error").toString().contains("Failed to generate prescription suggestions"));
    }

    @Test
    void generateSOAPNotes_Success() {
        // Arrange
        String patientSymptoms = "Chest pain, shortness of breath";
        String diagnosis = "Angina";
        String treatment = "Nitroglycerin, lifestyle changes";
        String patientHistory = "Previous heart attack";

        // Mock OpenAI response
        var mockResponse = mock(com.theokanning.openai.completion.chat.ChatCompletionResult.class);
        var mockChoice = mock(com.theokanning.openai.completion.chat.ChatCompletionChoice.class);
        var mockMessage = mock(ChatMessage.class);
        
        when(mockMessage.getContent()).thenReturn("{\"subjective\":\"Patient reports chest pain\",\"objective\":\"BP 140/90\",\"assessment\":\"Angina\",\"plan\":\"Continue current treatment\"}");
        when(mockChoice.getMessage()).thenReturn(mockMessage);
        when(mockResponse.getChoices()).thenReturn(java.util.List.of(mockChoice));
        when(openAiService.createChatCompletion(any(ChatCompletionRequest.class))).thenReturn(mockResponse);

        // Act
        Map<String, Object> result = aiService.generateSOAPNotes(patientSymptoms, diagnosis, treatment, patientHistory);

        // Assert
        assertNotNull(result);
        assertTrue(result.containsKey("soapNotes"));
        verify(openAiService).createChatCompletion(any(ChatCompletionRequest.class));
    }

    @Test
    void generateSOAPNotes_Exception() {
        // Arrange
        String patientSymptoms = "Test symptoms";
        String diagnosis = "Test diagnosis";
        String treatment = "Test treatment";
        String patientHistory = "Test history";

        when(openAiService.createChatCompletion(any(ChatCompletionRequest.class)))
                .thenThrow(new RuntimeException("OpenAI API error"));

        // Act
        Map<String, Object> result = aiService.generateSOAPNotes(patientSymptoms, diagnosis, treatment, patientHistory);

        // Assert
        assertNotNull(result);
        assertTrue(result.containsKey("error"));
        assertTrue(result.get("error").toString().contains("Failed to generate SOAP notes"));
    }

    @Test
    void buildSymptomAnalysisPrompt_ContainsAllFields() {
        // Arrange
        String symptoms = "headache, fever";
        String patientAge = "25";
        String patientGender = "female";
        String medicalHistory = "migraine";

        // Act
        String prompt = aiService.buildSymptomAnalysisPrompt(symptoms, patientAge, patientGender, medicalHistory);

        // Assert
        assertNotNull(prompt);
        assertTrue(prompt.contains(symptoms));
        assertTrue(prompt.contains(patientAge));
        assertTrue(prompt.contains(patientGender));
        assertTrue(prompt.contains(medicalHistory));
        assertTrue(prompt.contains("possibleConditions"));
        assertTrue(prompt.contains("urgencyLevel"));
    }

    @Test
    void buildMedicalRecordAnalysisPrompt_ContainsAllFields() {
        // Arrange
        String recordContent = "Blood pressure: 120/80";
        String recordType = "Vital Signs";

        // Act
        String prompt = aiService.buildMedicalRecordAnalysisPrompt(recordContent, recordType);

        // Assert
        assertNotNull(prompt);
        assertTrue(prompt.contains(recordContent));
        assertTrue(prompt.contains(recordType));
        assertTrue(prompt.contains("keyFindings"));
        assertTrue(prompt.contains("abnormalValues"));
    }

    @Test
    void buildPrescriptionPrompt_ContainsAllFields() {
        // Arrange
        String diagnosis = "Hypertension";
        String symptoms = "High blood pressure";
        String patientAllergies = "Penicillin";

        // Act
        String prompt = aiService.buildPrescriptionPrompt(diagnosis, symptoms, patientAllergies);

        // Assert
        assertNotNull(prompt);
        assertTrue(prompt.contains(diagnosis));
        assertTrue(prompt.contains(symptoms));
        assertTrue(prompt.contains(patientAllergies));
        assertTrue(prompt.contains("medications"));
        assertTrue(prompt.contains("contraindications"));
    }

    @Test
    void buildSOAPNotesPrompt_ContainsAllFields() {
        // Arrange
        String patientSymptoms = "Chest pain";
        String diagnosis = "Angina";
        String treatment = "Nitroglycerin";
        String patientHistory = "Previous MI";

        // Act
        String prompt = aiService.buildSOAPNotesPrompt(patientSymptoms, diagnosis, treatment, patientHistory);

        // Assert
        assertNotNull(prompt);
        assertTrue(prompt.contains(patientSymptoms));
        assertTrue(prompt.contains(diagnosis));
        assertTrue(prompt.contains(treatment));
        assertTrue(prompt.contains(patientHistory));
        assertTrue(prompt.contains("subjective"));
        assertTrue(prompt.contains("objective"));
        assertTrue(prompt.contains("assessment"));
        assertTrue(prompt.contains("plan"));
    }

    @Test
    void parseSymptomAnalysis_ReturnsCorrectStructure() {
        // Arrange
        String response = "Test analysis response";

        // Act
        Map<String, Object> result = aiService.parseSymptomAnalysis(response);

        // Assert
        assertNotNull(result);
        assertTrue(result.containsKey("analysis"));
        assertTrue(result.containsKey("timestamp"));
        assertEquals(response, result.get("analysis"));
    }

    @Test
    void parseMedicalRecordAnalysis_ReturnsCorrectStructure() {
        // Arrange
        String response = "Test medical record analysis";

        // Act
        Map<String, Object> result = aiService.parseMedicalRecordAnalysis(response);

        // Assert
        assertNotNull(result);
        assertTrue(result.containsKey("analysis"));
        assertTrue(result.containsKey("timestamp"));
        assertEquals(response, result.get("analysis"));
    }

    @Test
    void parsePrescriptionSuggestions_ReturnsCorrectStructure() {
        // Arrange
        String response = "Test prescription suggestions";

        // Act
        Map<String, Object> result = aiService.parsePrescriptionSuggestions(response);

        // Assert
        assertNotNull(result);
        assertTrue(result.containsKey("suggestions"));
        assertTrue(result.containsKey("timestamp"));
        assertEquals(response, result.get("suggestions"));
    }

    @Test
    void parseSOAPNotes_ReturnsCorrectStructure() {
        // Arrange
        String response = "Test SOAP notes";

        // Act
        Map<String, Object> result = aiService.parseSOAPNotes(response);

        // Assert
        assertNotNull(result);
        assertTrue(result.containsKey("soapNotes"));
        assertTrue(result.containsKey("timestamp"));
        assertEquals(response, result.get("soapNotes"));
    }
} 