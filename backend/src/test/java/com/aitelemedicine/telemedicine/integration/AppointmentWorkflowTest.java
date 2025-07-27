package com.aitelemedicine.telemedicine.integration;

import com.aitelemedicine.telemedicine.model.Appointment;
import com.aitelemedicine.telemedicine.model.User;
import com.aitelemedicine.telemedicine.repository.AppointmentRepository;
import com.aitelemedicine.telemedicine.repository.UserRepository;
import com.aitelemedicine.telemedicine.service.AppointmentService;
import com.aitelemedicine.telemedicine.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureWebMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.WebApplicationContext;

import java.time.LocalDateTime;
import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureWebMvc
@ActiveProfiles("test")
@Transactional
class AppointmentWorkflowTest {

    @Autowired
    private WebApplicationContext webApplicationContext;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private AppointmentService appointmentService;

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;

    private User testPatient;
    private User testDoctor;
    private Appointment testAppointment;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
        objectMapper = new ObjectMapper();

        // Create test patient
        testPatient = new User();
        testPatient.setUsername("testpatient");
        testPatient.setEmail("patient@test.com");
        testPatient.setPassword("password123");
        testPatient.setFirstName("John");
        testPatient.setLastName("Patient");
        testPatient.setRole(User.UserRole.PATIENT);
        testPatient.setStatus(User.UserStatus.ACTIVE);
        testPatient.setEmailVerified(true);
        testPatient = userRepository.save(testPatient);

        // Create test doctor
        testDoctor = new User();
        testDoctor.setUsername("testdoctor");
        testDoctor.setEmail("doctor@test.com");
        testDoctor.setPassword("password123");
        testDoctor.setFirstName("Jane");
        testDoctor.setLastName("Doctor");
        testDoctor.setRole(User.UserRole.DOCTOR);
        testDoctor.setStatus(User.UserStatus.ACTIVE);
        testDoctor.setEmailVerified(true);
        testDoctor.setSpecialization("Cardiology");
        testDoctor.setConsultationFee(150.0);
        testDoctor = userRepository.save(testDoctor);

        // Create test appointment
        testAppointment = new Appointment();
        testAppointment.setPatient(testPatient);
        testAppointment.setDoctor(testDoctor);
        testAppointment.setScheduledAt(LocalDateTime.now().plusHours(1));
        testAppointment.setStatus(Appointment.AppointmentStatus.SCHEDULED);
        testAppointment.setType(Appointment.AppointmentType.VIDEO);
        testAppointment.setFee(150.0);
        testAppointment = appointmentRepository.save(testAppointment);
    }

    @Test
    @WithMockUser(username = "testpatient", roles = {"PATIENT"})
    void testPatientBooksAppointment() throws Exception {
        // Arrange
        Appointment newAppointment = new Appointment();
        newAppointment.setDoctor(testDoctor);
        newAppointment.setScheduledAt(LocalDateTime.now().plusDays(1));
        newAppointment.setType(Appointment.AppointmentType.VIDEO);
        newAppointment.setSymptoms("Chest pain, shortness of breath");

        // Act & Assert
        mockMvc.perform(post("/api/appointments")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(newAppointment)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.patient.id").value(testPatient.getId()))
                .andExpect(jsonPath("$.doctor.id").value(testDoctor.getId()))
                .andExpect(jsonPath("$.status").value("SCHEDULED"));
    }

    @Test
    @WithMockUser(username = "testdoctor", roles = {"DOCTOR"})
    void testDoctorViewsAppointments() throws Exception {
        // Act & Assert
        mockMvc.perform(get("/api/appointments"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].patient.id").value(testPatient.getId()))
                .andExpect(jsonPath("$[0].doctor.id").value(testDoctor.getId()));
    }

    @Test
    @WithMockUser(username = "testdoctor", roles = {"DOCTOR"})
    void testDoctorStartsAppointment() throws Exception {
        // Arrange - Confirm the appointment first
        testAppointment.setStatus(Appointment.AppointmentStatus.CONFIRMED);
        appointmentRepository.save(testAppointment);

        // Act & Assert
        mockMvc.perform(post("/api/appointments/{id}/start", testAppointment.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Appointment started"));
    }

    @Test
    @WithMockUser(username = "testdoctor", roles = {"DOCTOR"})
    void testDoctorEndsAppointment() throws Exception {
        // Arrange - Start the appointment first
        testAppointment.setStatus(Appointment.AppointmentStatus.IN_PROGRESS);
        testAppointment.setStartedAt(LocalDateTime.now());
        appointmentRepository.save(testAppointment);

        // Act & Assert
        mockMvc.perform(post("/api/appointments/{id}/end", testAppointment.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Appointment ended"));
    }

    @Test
    @WithMockUser(username = "testpatient", roles = {"PATIENT"})
    void testPatientCancelsAppointment() throws Exception {
        // Act & Assert
        mockMvc.perform(delete("/api/appointments/{id}", testAppointment.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Appointment cancelled successfully"));
    }

    @Test
    @WithMockUser(username = "testdoctor", roles = {"DOCTOR"})
    void testDoctorUpdatesAppointment() throws Exception {
        // Arrange
        Appointment updateData = new Appointment();
        updateData.setSymptoms("Updated symptoms");
        updateData.setDiagnosis("Hypertension");
        updateData.setPrescription("Lisinopril 10mg daily");

        // Act & Assert
        mockMvc.perform(put("/api/appointments/{id}", testAppointment.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateData)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.symptoms").value("Updated symptoms"))
                .andExpect(jsonPath("$.diagnosis").value("Hypertension"));
    }

    @Test
    @WithMockUser(username = "testdoctor", roles = {"DOCTOR"})
    void testDoctorViewsAppointmentStats() throws Exception {
        // Act & Assert
        mockMvc.perform(get("/api/appointments/stats"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.completedThisMonth").exists())
                .andExpect(jsonPath("$.totalAppointments").exists());
    }

    @Test
    @WithMockUser(username = "testpatient", roles = {"PATIENT"})
    void testPatientCannotAccessDoctorStats() throws Exception {
        // Act & Assert
        mockMvc.perform(get("/api/appointments/stats"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Only doctors can view stats"));
    }

    @Test
    @WithMockUser(username = "testdoctor", roles = {"DOCTOR"})
    void testDoctorCannotBookAppointment() throws Exception {
        // Arrange
        Appointment newAppointment = new Appointment();
        newAppointment.setPatient(testPatient);
        newAppointment.setDoctor(testDoctor);
        newAppointment.setScheduledAt(LocalDateTime.now().plusDays(1));

        // Act & Assert
        mockMvc.perform(post("/api/appointments")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(newAppointment)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Only patients can create appointments"));
    }

    @Test
    @WithMockUser(username = "testpatient", roles = {"PATIENT"})
    void testPatientViewsMeetingDetails() throws Exception {
        // Arrange - Set meeting ID
        testAppointment.setMeetingId(UUID.randomUUID().toString());
        appointmentRepository.save(testAppointment);

        // Act & Assert
        mockMvc.perform(get("/api/appointments/meeting/{meetingId}", testAppointment.getMeetingId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(testAppointment.getId()));
    }

    @Test
    @WithMockUser(username = "testpatient", roles = {"PATIENT"})
    void testPatientViewsActiveAppointments() throws Exception {
        // Act & Assert
        mockMvc.perform(get("/api/appointments/active"))
                .andExpect(status().isOk());
    }

    @Test
    void testAppointmentValidation() throws Exception {
        // Arrange - Invalid appointment (past date)
        Appointment invalidAppointment = new Appointment();
        invalidAppointment.setDoctor(testDoctor);
        invalidAppointment.setScheduledAt(LocalDateTime.now().minusHours(1));

        // Act & Assert
        mockMvc.perform(post("/api/appointments")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidAppointment)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(username = "testdoctor", roles = {"DOCTOR"})
    void testAIAnalysisIntegration() throws Exception {
        // Arrange
        var aiAnalysisRequest = new Object() {
            public final String aiDiagnosis = "Hypertension";
            public final String aiRecommendations = "Lifestyle changes, medication";
            public final String aiSummary = "Patient shows signs of hypertension";
        };

        // Act & Assert
        mockMvc.perform(post("/api/appointments/{id}/ai-analysis", testAppointment.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(aiAnalysisRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("AI analysis added"));
    }

    @Test
    @WithMockUser(username = "testdoctor", roles = {"DOCTOR"})
    void testPaymentStatusUpdate() throws Exception {
        // Arrange
        var paymentRequest = new Object() {
            public final String status = "PAID";
            public final String paymentIntentId = "pi_test_123";
        };

        // Act & Assert
        mockMvc.perform(post("/api/appointments/{id}/payment", testAppointment.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(paymentRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Payment status updated"));
    }
} 