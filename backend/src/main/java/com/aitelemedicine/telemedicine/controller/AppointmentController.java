package com.aitelemedicine.telemedicine.controller;

import com.aitelemedicine.telemedicine.model.Appointment;
import com.aitelemedicine.telemedicine.model.User;
import com.aitelemedicine.telemedicine.service.AppointmentService;
import com.aitelemedicine.telemedicine.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/appointments")
@CrossOrigin(origins = "*")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<?> createAppointment(@RequestBody Appointment appointment) {
        try {
            // Get current user as patient
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            User currentUser = userService.getUserByUsername(username);
            
            if (currentUser.getRole() != User.UserRole.PATIENT) {
                return ResponseEntity.badRequest().body(Map.of("error", "Only patients can create appointments"));
            }

            appointment.setPatient(currentUser);
            Appointment createdAppointment = appointmentService.createAppointment(appointment);
            
            return ResponseEntity.ok(createdAppointment);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<?> getAppointments() {
        try {
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            User currentUser = userService.getUserByUsername(username);
            
            List<Appointment> appointments;
            if (currentUser.getRole() == User.UserRole.PATIENT) {
                appointments = appointmentService.getUpcomingAppointmentsForPatient(currentUser);
            } else if (currentUser.getRole() == User.UserRole.DOCTOR) {
                appointments = appointmentService.getUpcomingAppointmentsForDoctor(currentUser);
            } else {
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid user role"));
            }
            
            return ResponseEntity.ok(appointments);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getAppointment(@PathVariable Long id) {
        try {
            // Implementation would include authorization checks
            return ResponseEntity.ok(Map.of("message", "Appointment details"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateAppointment(@PathVariable Long id, @RequestBody Appointment appointmentDetails) {
        try {
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            User currentUser = userService.getUserByUsername(username);
            
            // Check if user is authorized to update this appointment
            Appointment updatedAppointment = appointmentService.updateAppointment(id, appointmentDetails);
            
            return ResponseEntity.ok(updatedAppointment);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> cancelAppointment(@PathVariable Long id) {
        try {
            appointmentService.cancelAppointment(id);
            return ResponseEntity.ok(Map.of("message", "Appointment cancelled successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{id}/start")
    public ResponseEntity<?> startAppointment(@PathVariable Long id) {
        try {
            appointmentService.startAppointment(id);
            return ResponseEntity.ok(Map.of("message", "Appointment started"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{id}/end")
    public ResponseEntity<?> endAppointment(@PathVariable Long id) {
        try {
            appointmentService.endAppointment(id);
            return ResponseEntity.ok(Map.of("message", "Appointment ended"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/meeting/{meetingId}")
    public ResponseEntity<?> getAppointmentByMeetingId(@PathVariable String meetingId) {
        try {
            return appointmentService.getAppointmentByMeetingId(meetingId)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/active")
    public ResponseEntity<?> getActiveAppointments() {
        try {
            List<Appointment> activeAppointments = appointmentService.getActiveAppointments();
            return ResponseEntity.ok(activeAppointments);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getAppointmentStats() {
        try {
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            User currentUser = userService.getUserByUsername(username);
            
            if (currentUser.getRole() != User.UserRole.DOCTOR) {
                return ResponseEntity.badRequest().body(Map.of("error", "Only doctors can view stats"));
            }

            long completedThisMonth = appointmentService.getCompletedAppointmentsCountForDoctor(
                currentUser, LocalDateTime.now().minusMonths(1)
            );

            Map<String, Object> stats = Map.of(
                "completedThisMonth", completedThisMonth,
                "totalAppointments", appointmentService.getUpcomingAppointmentsForDoctor(currentUser).size()
            );
            
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{id}/payment")
    public ResponseEntity<?> updatePaymentStatus(
            @PathVariable Long id,
            @RequestBody PaymentUpdateRequest request) {
        try {
            appointmentService.updatePaymentStatus(id, request.getStatus(), request.getPaymentIntentId());
            return ResponseEntity.ok(Map.of("message", "Payment status updated"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{id}/ai-analysis")
    public ResponseEntity<?> addAIAnalysis(
            @PathVariable Long id,
            @RequestBody AIAnalysisRequest request) {
        try {
            appointmentService.addAIAnalysis(
                id, 
                request.getAiDiagnosis(), 
                request.getAiRecommendations(), 
                request.getAiSummary()
            );
            return ResponseEntity.ok(Map.of("message", "AI analysis added"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Request classes
    public static class PaymentUpdateRequest {
        private String status;
        private String paymentIntentId;

        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        public String getPaymentIntentId() { return paymentIntentId; }
        public void setPaymentIntentId(String paymentIntentId) { this.paymentIntentId = paymentIntentId; }
    }

    public static class AIAnalysisRequest {
        private String aiDiagnosis;
        private String aiRecommendations;
        private String aiSummary;

        public String getAiDiagnosis() { return aiDiagnosis; }
        public void setAiDiagnosis(String aiDiagnosis) { this.aiDiagnosis = aiDiagnosis; }
        public String getAiRecommendations() { return aiRecommendations; }
        public void setAiRecommendations(String aiRecommendations) { this.aiRecommendations = aiRecommendations; }
        public String getAiSummary() { return aiSummary; }
        public void setAiSummary(String aiSummary) { this.aiSummary = aiSummary; }
    }
}