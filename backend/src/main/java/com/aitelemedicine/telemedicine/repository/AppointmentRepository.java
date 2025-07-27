package com.aitelemedicine.telemedicine.repository;

import com.aitelemedicine.telemedicine.model.Appointment;
import com.aitelemedicine.telemedicine.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    
    List<Appointment> findByPatient(User patient);
    List<Appointment> findByDoctor(User doctor);
    
    @Query("SELECT a FROM Appointment a WHERE a.patient = :patient AND a.status = :status")
    List<Appointment> findByPatientAndStatus(@Param("patient") User patient, @Param("status") Appointment.AppointmentStatus status);
    
    @Query("SELECT a FROM Appointment a WHERE a.doctor = :doctor AND a.status = :status")
    List<Appointment> findByDoctorAndStatus(@Param("doctor") User doctor, @Param("status") Appointment.AppointmentStatus status);
    
    @Query("SELECT a FROM Appointment a WHERE a.scheduledAt BETWEEN :start AND :end")
    List<Appointment> findByScheduledAtBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
    
    @Query("SELECT a FROM Appointment a WHERE a.doctor = :doctor AND a.scheduledAt >= :now ORDER BY a.scheduledAt ASC")
    List<Appointment> findUpcomingAppointmentsForDoctor(@Param("doctor") User doctor, @Param("now") LocalDateTime now);
    
    @Query("SELECT a FROM Appointment a WHERE a.patient = :patient AND a.scheduledAt >= :now ORDER BY a.scheduledAt ASC")
    List<Appointment> findUpcomingAppointmentsForPatient(@Param("patient") User patient, @Param("now") LocalDateTime now);
    
    @Query("SELECT a FROM Appointment a WHERE a.status = :status AND a.scheduledAt >= :now")
    List<Appointment> findUpcomingAppointmentsByStatus(@Param("status") Appointment.AppointmentStatus status, @Param("now") LocalDateTime now);
    
    @Query("SELECT COUNT(a) FROM Appointment a WHERE a.doctor = :doctor AND a.status = 'COMPLETED' AND a.endedAt >= :since")
    long countCompletedAppointmentsForDoctorSince(@Param("doctor") User doctor, @Param("since") LocalDateTime since);
    
    @Query("SELECT a FROM Appointment a WHERE a.meetingId = :meetingId")
    Optional<Appointment> findByMeetingId(@Param("meetingId") String meetingId);
    
    @Query("SELECT a FROM Appointment a WHERE a.stripePaymentIntentId = :paymentIntentId")
    Optional<Appointment> findByStripePaymentIntentId(@Param("paymentIntentId") String paymentIntentId);
    
    @Query("SELECT a FROM Appointment a WHERE a.status = 'IN_PROGRESS'")
    List<Appointment> findActiveAppointments();
} 