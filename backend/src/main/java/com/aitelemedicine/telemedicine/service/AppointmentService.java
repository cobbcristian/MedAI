package com.aitelemedicine.telemedicine.service;

import com.aitelemedicine.telemedicine.model.Appointment;
import com.aitelemedicine.telemedicine.model.User;
import com.aitelemedicine.telemedicine.repository.AppointmentRepository;
import com.aitelemedicine.telemedicine.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    public Appointment createAppointment(Appointment appointment) {
        // Validate appointment time
        if (appointment.getScheduledAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Appointment cannot be scheduled in the past");
        }

        // Check if doctor is available
        if (!isDoctorAvailable(appointment.getDoctor(), appointment.getScheduledAt())) {
            throw new RuntimeException("Doctor is not available at this time");
        }

        // Generate meeting ID for video calls
        if (appointment.getType() == Appointment.AppointmentType.VIDEO) {
            appointment.setMeetingId(UUID.randomUUID().toString());
            appointment.setMeetingUrl("/video-call/" + appointment.getMeetingId());
        }

        // Set default fee if not provided
        if (appointment.getFee() == null && appointment.getDoctor().getConsultationFee() != null) {
            appointment.setFee(appointment.getDoctor().getConsultationFee());
        }

        Appointment savedAppointment = appointmentRepository.save(appointment);

        // Send confirmation emails
        emailService.sendAppointmentConfirmation(
            appointment.getPatient(),
            appointment.getDoctor(),
            appointment.getScheduledAt().toString()
        );

        return savedAppointment;
    }

    public Appointment updateAppointment(Long appointmentId, Appointment appointmentDetails) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        // Update fields
        if (appointmentDetails.getScheduledAt() != null) {
            appointment.setScheduledAt(appointmentDetails.getScheduledAt());
        }
        if (appointmentDetails.getStatus() != null) {
            appointment.setStatus(appointmentDetails.getStatus());
        }
        if (appointmentDetails.getNotes() != null) {
            appointment.setNotes(appointmentDetails.getNotes());
        }
        if (appointmentDetails.getSymptoms() != null) {
            appointment.setSymptoms(appointmentDetails.getSymptoms());
        }
        if (appointmentDetails.getDiagnosis() != null) {
            appointment.setDiagnosis(appointmentDetails.getDiagnosis());
        }
        if (appointmentDetails.getPrescription() != null) {
            appointment.setPrescription(appointmentDetails.getPrescription());
        }
        if (appointmentDetails.getSoapNotes() != null) {
            appointment.setSoapNotes(appointmentDetails.getSoapNotes());
        }

        return appointmentRepository.save(appointment);
    }

    public void cancelAppointment(Long appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        if (appointment.getStatus() == Appointment.AppointmentStatus.COMPLETED) {
            throw new RuntimeException("Cannot cancel completed appointment");
        }

        appointment.setStatus(Appointment.AppointmentStatus.CANCELLED);
        appointmentRepository.save(appointment);
    }

    public void startAppointment(Long appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        if (appointment.getStatus() != Appointment.AppointmentStatus.CONFIRMED) {
            throw new RuntimeException("Appointment must be confirmed before starting");
        }

        appointment.setStatus(Appointment.AppointmentStatus.IN_PROGRESS);
        appointment.setStartedAt(LocalDateTime.now());
        appointmentRepository.save(appointment);
    }

    public void endAppointment(Long appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        if (appointment.getStatus() != Appointment.AppointmentStatus.IN_PROGRESS) {
            throw new RuntimeException("Appointment must be in progress to end");
        }

        appointment.setStatus(Appointment.AppointmentStatus.COMPLETED);
        appointment.setEndedAt(LocalDateTime.now());
        
        // Calculate duration
        if (appointment.getStartedAt() != null) {
            long durationMinutes = java.time.Duration.between(
                appointment.getStartedAt(), 
                appointment.getEndedAt()
            ).toMinutes();
            appointment.setDuration((int) durationMinutes);
        }

        appointmentRepository.save(appointment);
    }

    public List<Appointment> getUpcomingAppointmentsForPatient(User patient) {
        return appointmentRepository.findUpcomingAppointmentsForPatient(patient, LocalDateTime.now());
    }

    public List<Appointment> getUpcomingAppointmentsForDoctor(User doctor) {
        return appointmentRepository.findUpcomingAppointmentsForDoctor(doctor, LocalDateTime.now());
    }

    public List<Appointment> getAppointmentsByStatus(Appointment.AppointmentStatus status) {
        return appointmentRepository.findUpcomingAppointmentsByStatus(status, LocalDateTime.now());
    }

    public Optional<Appointment> getAppointmentByMeetingId(String meetingId) {
        return appointmentRepository.findByMeetingId(meetingId);
    }

    public Optional<Appointment> getAppointmentByPaymentIntent(String paymentIntentId) {
        return appointmentRepository.findByStripePaymentIntentId(paymentIntentId);
    }

    public List<Appointment> getActiveAppointments() {
        return appointmentRepository.findActiveAppointments();
    }

    public long getCompletedAppointmentsCountForDoctor(User doctor, LocalDateTime since) {
        return appointmentRepository.countCompletedAppointmentsForDoctorSince(doctor, since);
    }

    private boolean isDoctorAvailable(User doctor, LocalDateTime scheduledTime) {
        // Check if doctor has any conflicting appointments
        LocalDateTime endTime = scheduledTime.plusMinutes(30); // Default 30-minute appointment
        
        List<Appointment> conflictingAppointments = appointmentRepository.findByScheduledAtBetween(
            scheduledTime, endTime
        );
        
        return conflictingAppointments.stream()
                .noneMatch(apt -> apt.getDoctor().equals(doctor) && 
                        apt.getStatus() != Appointment.AppointmentStatus.CANCELLED);
    }

    public void updatePaymentStatus(Long appointmentId, String paymentStatus, String paymentIntentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        appointment.setPaymentStatus(paymentStatus);
        if (paymentIntentId != null) {
            appointment.setStripePaymentIntentId(paymentIntentId);
        }

        appointmentRepository.save(appointment);
    }

    public void addAIAnalysis(Long appointmentId, String aiDiagnosis, String aiRecommendations, String aiSummary) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        appointment.setAiDiagnosis(aiDiagnosis);
        appointment.setAiRecommendations(aiRecommendations);
        appointment.setAiSummary(aiSummary);

        appointmentRepository.save(appointment);
    }
} 