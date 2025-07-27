package com.aitelemedicine.telemedicine.service;

import com.aitelemedicine.telemedicine.model.User;
import com.aitelemedicine.telemedicine.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));
        
        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);
        
        return user;
    }

    public User createUser(User user) {
        // Check if username or email already exists
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        // Encode password
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        
        // Generate email verification token
        String verificationToken = UUID.randomUUID().toString();
        user.setEmailVerificationToken(verificationToken);
        user.setEmailVerificationExpiry(LocalDateTime.now().plusHours(24));
        user.setEmailVerified(false);
        
        // Set default status
        if (user.getStatus() == null) {
            user.setStatus(User.UserStatus.PENDING_VERIFICATION);
        }

        User savedUser = userRepository.save(user);
        
        // Send verification email
        emailService.sendVerificationEmail(savedUser);
        
        return savedUser;
    }

    public User updateUser(Long userId, User userDetails) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Update fields
        if (userDetails.getFirstName() != null) {
            user.setFirstName(userDetails.getFirstName());
        }
        if (userDetails.getLastName() != null) {
            user.setLastName(userDetails.getLastName());
        }
        if (userDetails.getPhoneNumber() != null) {
            user.setPhoneNumber(userDetails.getPhoneNumber());
        }
        if (userDetails.getAddress() != null) {
            user.setAddress(userDetails.getAddress());
        }
        if (userDetails.getProfileImageUrl() != null) {
            user.setProfileImageUrl(userDetails.getProfileImageUrl());
        }

        // Doctor-specific fields
        if (user.getRole() == User.UserRole.DOCTOR) {
            if (userDetails.getLicenseNumber() != null) {
                user.setLicenseNumber(userDetails.getLicenseNumber());
            }
            if (userDetails.getSpecialization() != null) {
                user.setSpecialization(userDetails.getSpecialization());
            }
            if (userDetails.getQualifications() != null) {
                user.setQualifications(userDetails.getQualifications());
            }
            if (userDetails.getExperience() != null) {
                user.setExperience(userDetails.getExperience());
            }
            if (userDetails.getBio() != null) {
                user.setBio(userDetails.getBio());
            }
            if (userDetails.getConsultationFee() != null) {
                user.setConsultationFee(userDetails.getConsultationFee());
            }
        }

        // Patient-specific fields
        if (user.getRole() == User.UserRole.PATIENT) {
            if (userDetails.getBloodType() != null) {
                user.setBloodType(userDetails.getBloodType());
            }
            if (userDetails.getAllergies() != null) {
                user.setAllergies(userDetails.getAllergies());
            }
            if (userDetails.getMedicalHistory() != null) {
                user.setMedicalHistory(userDetails.getMedicalHistory());
            }
            if (userDetails.getCurrentMedications() != null) {
                user.setCurrentMedications(userDetails.getCurrentMedications());
            }
        }

        return userRepository.save(user);
    }

    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.setStatus(User.UserStatus.INACTIVE);
        userRepository.save(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public List<User> getUsersByRole(User.UserRole role) {
        return userRepository.findByRoleAndActive(role);
    }

    public List<User> getDoctorsBySpecialization(String specialization) {
        return userRepository.findDoctorsBySpecialization(specialization);
    }

    public List<User> getActiveDoctors() {
        return userRepository.findActiveDoctorsOrderByFee();
    }

    public User getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public boolean verifyEmail(String token) {
        User user = userRepository.findByEmailVerificationToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid verification token"));

        if (user.getEmailVerificationExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Verification token has expired");
        }

        user.setEmailVerified(true);
        user.setEmailVerificationToken(null);
        user.setEmailVerificationExpiry(null);
        user.setStatus(User.UserStatus.ACTIVE);
        
        userRepository.save(user);
        return true;
    }

    public void resendVerificationEmail(String email) {
        User user = getUserByEmail(email);
        
        if (user.isEmailVerified()) {
            throw new RuntimeException("Email is already verified");
        }

        String verificationToken = UUID.randomUUID().toString();
        user.setEmailVerificationToken(verificationToken);
        user.setEmailVerificationExpiry(LocalDateTime.now().plusHours(24));
        
        userRepository.save(user);
        emailService.sendVerificationEmail(user);
    }

    public void changePassword(Long userId, String currentPassword, String newPassword) {
        User user = getUserById(userId);
        
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    public void resetPassword(String email) {
        User user = getUserByEmail(email);
        
        String resetToken = UUID.randomUUID().toString();
        // In a real implementation, you'd store this token with expiry
        // For now, we'll just send a reset email
        
        emailService.sendPasswordResetEmail(user, resetToken);
    }

    public long getUserCountByRole(User.UserRole role) {
        return userRepository.countByRole(role);
    }

    public List<User> getActiveUsersSince(LocalDateTime since) {
        return userRepository.findUsersActiveSince(since);
    }
}