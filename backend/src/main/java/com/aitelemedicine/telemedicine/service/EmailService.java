package com.aitelemedicine.telemedicine.service;

import com.aitelemedicine.telemedicine.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    public void sendVerificationEmail(User user) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(user.getEmail());
        message.setSubject("Verify your email - AI Telemedicine Platform");
        message.setText(String.format(
            "Hello %s,\n\n" +
            "Thank you for registering with AI Telemedicine Platform. " +
            "Please click the link below to verify your email address:\n\n" +
            "%s/verify-email?token=%s\n\n" +
            "This link will expire in 24 hours.\n\n" +
            "If you didn't create an account, please ignore this email.\n\n" +
            "Best regards,\n" +
            "AI Telemedicine Team",
            user.getFirstName(),
            frontendUrl,
            user.getEmailVerificationToken()
        ));

        mailSender.send(message);
    }

    public void sendPasswordResetEmail(User user, String resetToken) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(user.getEmail());
        message.setSubject("Reset your password - AI Telemedicine Platform");
        message.setText(String.format(
            "Hello %s,\n\n" +
            "You requested a password reset for your AI Telemedicine Platform account. " +
            "Please click the link below to reset your password:\n\n" +
            "%s/reset-password?token=%s\n\n" +
            "This link will expire in 1 hour.\n\n" +
            "If you didn't request a password reset, please ignore this email.\n\n" +
            "Best regards,\n" +
            "AI Telemedicine Team",
            user.getFirstName(),
            frontendUrl,
            resetToken
        ));

        mailSender.send(message);
    }

    public void sendAppointmentConfirmation(User patient, User doctor, String appointmentDate) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(patient.getEmail());
        message.setSubject("Appointment Confirmed - AI Telemedicine Platform");
        message.setText(String.format(
            "Hello %s,\n\n" +
            "Your appointment with Dr. %s %s has been confirmed for %s.\n\n" +
            "You will receive a meeting link 15 minutes before your appointment.\n\n" +
            "Please ensure you have a stable internet connection and are in a quiet environment.\n\n" +
            "Best regards,\n" +
            "AI Telemedicine Team",
            patient.getFirstName(),
            doctor.getFirstName(),
            doctor.getLastName(),
            appointmentDate
        ));

        mailSender.send(message);
    }

    public void sendAppointmentReminder(User patient, User doctor, String appointmentDate, String meetingUrl) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(patient.getEmail());
        message.setSubject("Appointment Reminder - AI Telemedicine Platform");
        message.setText(String.format(
            "Hello %s,\n\n" +
            "This is a reminder for your appointment with Dr. %s %s scheduled for %s.\n\n" +
            "Meeting Link: %s\n\n" +
            "Please join the meeting 5 minutes before your scheduled time.\n\n" +
            "Best regards,\n" +
            "AI Telemedicine Team",
            patient.getFirstName(),
            doctor.getFirstName(),
            doctor.getLastName(),
            appointmentDate,
            meetingUrl
        ));

        mailSender.send(message);
    }

    public void sendWelcomeEmail(User user) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(user.getEmail());
        message.setSubject("Welcome to AI Telemedicine Platform");
        message.setText(String.format(
            "Hello %s,\n\n" +
            "Welcome to AI Telemedicine Platform! Your account has been successfully verified.\n\n" +
            "You can now:\n" +
            "- Schedule appointments with doctors\n" +
            "- Use our AI symptom checker\n" +
            "- Access your medical records\n" +
            "- Chat with healthcare providers\n\n" +
            "If you have any questions, please don't hesitate to contact our support team.\n\n" +
            "Best regards,\n" +
            "AI Telemedicine Team",
            user.getFirstName()
        ));

        mailSender.send(message);
    }

    public void sendTwoFactorSetupEmail(User user, String qrCodeUrl) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(user.getEmail());
        message.setSubject("Two-Factor Authentication Setup - AI Telemedicine Platform");
        message.setText(String.format(
            "Hello %s,\n\n" +
            "You have enabled two-factor authentication for your account.\n\n" +
            "Please scan the QR code in your authenticator app to complete the setup.\n\n" +
            "This adds an extra layer of security to your account.\n\n" +
            "Best regards,\n" +
            "AI Telemedicine Team",
            user.getFirstName()
        ));

        mailSender.send(message);
    }
} 