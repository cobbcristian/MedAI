package com.aitelemedicine.telemedicine.service;

import com.aitelemedicine.telemedicine.model.User;
import com.aitelemedicine.telemedicine.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private EmailService emailService;

    @InjectMocks
    private UserService userService;

    private User testUser;
    private User testDoctor;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testuser");
        testUser.setEmail("test@example.com");
        testUser.setPassword("password123");
        testUser.setFirstName("John");
        testUser.setLastName("Doe");
        testUser.setRole(User.UserRole.PATIENT);
        testUser.setStatus(User.UserStatus.ACTIVE);

        testDoctor = new User();
        testDoctor.setId(2L);
        testDoctor.setUsername("dr.smith");
        testDoctor.setEmail("dr.smith@example.com");
        testDoctor.setPassword("password123");
        testDoctor.setFirstName("Jane");
        testDoctor.setLastName("Smith");
        testDoctor.setRole(User.UserRole.DOCTOR);
        testDoctor.setStatus(User.UserStatus.ACTIVE);
        testDoctor.setSpecialization("Cardiology");
        testDoctor.setConsultationFee(150.0);
    }

    @Test
    void loadUserByUsername_Success() {
        // Arrange
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // Act
        var result = userService.loadUserByUsername("testuser");

        // Assert
        assertNotNull(result);
        assertEquals("testuser", result.getUsername());
        verify(userRepository).save(any(User.class));
    }

    @Test
    void loadUserByUsername_UserNotFound() {
        // Arrange
        when(userRepository.findByUsername("nonexistent")).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(UsernameNotFoundException.class, () -> {
            userService.loadUserByUsername("nonexistent");
        });
    }

    @Test
    void createUser_Success() {
        // Arrange
        when(userRepository.existsByUsername("newuser")).thenReturn(false);
        when(userRepository.existsByEmail("new@example.com")).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        User newUser = new User();
        newUser.setUsername("newuser");
        newUser.setEmail("new@example.com");
        newUser.setPassword("password123");
        newUser.setFirstName("New");
        newUser.setLastName("User");
        newUser.setRole(User.UserRole.PATIENT);

        // Act
        User result = userService.createUser(newUser);

        // Assert
        assertNotNull(result);
        assertEquals("newuser", result.getUsername());
        verify(passwordEncoder).encode("password123");
        verify(emailService).sendVerificationEmail(any(User.class));
    }

    @Test
    void createUser_UsernameExists() {
        // Arrange
        when(userRepository.existsByUsername("existinguser")).thenReturn(true);

        User newUser = new User();
        newUser.setUsername("existinguser");
        newUser.setEmail("new@example.com");

        // Act & Assert
        assertThrows(RuntimeException.class, () -> {
            userService.createUser(newUser);
        });
    }

    @Test
    void createUser_EmailExists() {
        // Arrange
        when(userRepository.existsByUsername("newuser")).thenReturn(false);
        when(userRepository.existsByEmail("existing@example.com")).thenReturn(true);

        User newUser = new User();
        newUser.setUsername("newuser");
        newUser.setEmail("existing@example.com");

        // Act & Assert
        assertThrows(RuntimeException.class, () -> {
            userService.createUser(newUser);
        });
    }

    @Test
    void updateUser_Success() {
        // Arrange
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        User updateData = new User();
        updateData.setFirstName("Updated");
        updateData.setLastName("Name");
        updateData.setPhoneNumber("1234567890");

        // Act
        User result = userService.updateUser(1L, updateData);

        // Assert
        assertNotNull(result);
        verify(userRepository).save(any(User.class));
    }

    @Test
    void updateUser_UserNotFound() {
        // Arrange
        when(userRepository.findById(999L)).thenReturn(Optional.empty());

        User updateData = new User();
        updateData.setFirstName("Updated");

        // Act & Assert
        assertThrows(RuntimeException.class, () -> {
            userService.updateUser(999L, updateData);
        });
    }

    @Test
    void updateUser_DoctorSpecificFields() {
        // Arrange
        when(userRepository.findById(2L)).thenReturn(Optional.of(testDoctor));
        when(userRepository.save(any(User.class))).thenReturn(testDoctor);

        User updateData = new User();
        updateData.setSpecialization("Neurology");
        updateData.setConsultationFee(200.0);
        updateData.setBio("Experienced neurologist");

        // Act
        User result = userService.updateUser(2L, updateData);

        // Assert
        assertNotNull(result);
        verify(userRepository).save(any(User.class));
    }

    @Test
    void updateUser_PatientSpecificFields() {
        // Arrange
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        User updateData = new User();
        updateData.setBloodType("O+");
        updateData.setAllergies("Peanuts, Shellfish");
        updateData.setMedicalHistory("Hypertension");

        // Act
        User result = userService.updateUser(1L, updateData);

        // Assert
        assertNotNull(result);
        verify(userRepository).save(any(User.class));
    }

    @Test
    void deleteUser_Success() {
        // Arrange
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // Act
        userService.deleteUser(1L);

        // Assert
        verify(userRepository).save(any(User.class));
        assertEquals(User.UserStatus.INACTIVE, testUser.getStatus());
    }

    @Test
    void getAllUsers_Success() {
        // Arrange
        List<User> users = Arrays.asList(testUser, testDoctor);
        when(userRepository.findAll()).thenReturn(users);

        // Act
        List<User> result = userService.getAllUsers();

        // Assert
        assertEquals(2, result.size());
        verify(userRepository).findAll();
    }

    @Test
    void getUsersByRole_Success() {
        // Arrange
        List<User> doctors = Arrays.asList(testDoctor);
        when(userRepository.findByRoleAndActive(User.UserRole.DOCTOR)).thenReturn(doctors);

        // Act
        List<User> result = userService.getUsersByRole(User.UserRole.DOCTOR);

        // Assert
        assertEquals(1, result.size());
        assertEquals(User.UserRole.DOCTOR, result.get(0).getRole());
        verify(userRepository).findByRoleAndActive(User.UserRole.DOCTOR);
    }

    @Test
    void getDoctorsBySpecialization_Success() {
        // Arrange
        List<User> cardiologists = Arrays.asList(testDoctor);
        when(userRepository.findDoctorsBySpecialization("Cardiology")).thenReturn(cardiologists);

        // Act
        List<User> result = userService.getDoctorsBySpecialization("Cardiology");

        // Assert
        assertEquals(1, result.size());
        assertEquals("Cardiology", result.get(0).getSpecialization());
        verify(userRepository).findDoctorsBySpecialization("Cardiology");
    }

    @Test
    void getActiveDoctors_Success() {
        // Arrange
        List<User> doctors = Arrays.asList(testDoctor);
        when(userRepository.findActiveDoctorsOrderByFee()).thenReturn(doctors);

        // Act
        List<User> result = userService.getActiveDoctors();

        // Assert
        assertEquals(1, result.size());
        assertEquals(User.UserRole.DOCTOR, result.get(0).getRole());
        verify(userRepository).findActiveDoctorsOrderByFee();
    }

    @Test
    void getUserById_Success() {
        // Arrange
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));

        // Act
        User result = userService.getUserById(1L);

        // Assert
        assertNotNull(result);
        assertEquals(1L, result.getId());
        verify(userRepository).findById(1L);
    }

    @Test
    void getUserById_NotFound() {
        // Arrange
        when(userRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(RuntimeException.class, () -> {
            userService.getUserById(999L);
        });
    }

    @Test
    void getUserByUsername_Success() {
        // Arrange
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));

        // Act
        User result = userService.getUserByUsername("testuser");

        // Assert
        assertNotNull(result);
        assertEquals("testuser", result.getUsername());
        verify(userRepository).findByUsername("testuser");
    }

    @Test
    void getUserByUsername_NotFound() {
        // Arrange
        when(userRepository.findByUsername("nonexistent")).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(RuntimeException.class, () -> {
            userService.getUserByUsername("nonexistent");
        });
    }

    @Test
    void getUserByEmail_Success() {
        // Arrange
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));

        // Act
        User result = userService.getUserByEmail("test@example.com");

        // Assert
        assertNotNull(result);
        assertEquals("test@example.com", result.getEmail());
        verify(userRepository).findByEmail("test@example.com");
    }

    @Test
    void getUserByEmail_NotFound() {
        // Arrange
        when(userRepository.findByEmail("nonexistent@example.com")).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(RuntimeException.class, () -> {
            userService.getUserByEmail("nonexistent@example.com");
        });
    }

    @Test
    void verifyEmail_Success() {
        // Arrange
        testUser.setEmailVerificationToken("valid-token");
        testUser.setEmailVerificationExpiry(LocalDateTime.now().plusHours(1));
        when(userRepository.findByEmailVerificationToken("valid-token")).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // Act
        boolean result = userService.verifyEmail("valid-token");

        // Assert
        assertTrue(result);
        assertTrue(testUser.isEmailVerified());
        assertNull(testUser.getEmailVerificationToken());
        assertEquals(User.UserStatus.ACTIVE, testUser.getStatus());
        verify(userRepository).save(testUser);
    }

    @Test
    void verifyEmail_InvalidToken() {
        // Arrange
        when(userRepository.findByEmailVerificationToken("invalid-token")).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(RuntimeException.class, () -> {
            userService.verifyEmail("invalid-token");
        });
    }

    @Test
    void verifyEmail_ExpiredToken() {
        // Arrange
        testUser.setEmailVerificationToken("expired-token");
        testUser.setEmailVerificationExpiry(LocalDateTime.now().minusHours(1));
        when(userRepository.findByEmailVerificationToken("expired-token")).thenReturn(Optional.of(testUser));

        // Act & Assert
        assertThrows(RuntimeException.class, () -> {
            userService.verifyEmail("expired-token");
        });
    }

    @Test
    void resendVerificationEmail_Success() {
        // Arrange
        testUser.setEmailVerified(false);
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // Act
        userService.resendVerificationEmail("test@example.com");

        // Assert
        verify(userRepository).save(any(User.class));
        verify(emailService).sendVerificationEmail(any(User.class));
    }

    @Test
    void resendVerificationEmail_AlreadyVerified() {
        // Arrange
        testUser.setEmailVerified(true);
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));

        // Act & Assert
        assertThrows(RuntimeException.class, () -> {
            userService.resendVerificationEmail("test@example.com");
        });
    }

    @Test
    void changePassword_Success() {
        // Arrange
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("oldPassword", "encodedPassword")).thenReturn(true);
        when(passwordEncoder.encode("newPassword")).thenReturn("newEncodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // Act
        userService.changePassword(1L, "oldPassword", "newPassword");

        // Assert
        verify(passwordEncoder).matches("oldPassword", "encodedPassword");
        verify(passwordEncoder).encode("newPassword");
        verify(userRepository).save(any(User.class));
    }

    @Test
    void changePassword_WrongCurrentPassword() {
        // Arrange
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("wrongPassword", "encodedPassword")).thenReturn(false);

        // Act & Assert
        assertThrows(RuntimeException.class, () -> {
            userService.changePassword(1L, "wrongPassword", "newPassword");
        });
    }

    @Test
    void resetPassword_Success() {
        // Arrange
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));

        // Act
        userService.resetPassword("test@example.com");

        // Assert
        verify(emailService).sendPasswordResetEmail(any(User.class), anyString());
    }

    @Test
    void getUserCountByRole_Success() {
        // Arrange
        when(userRepository.countByRole(User.UserRole.DOCTOR)).thenReturn(5L);

        // Act
        long result = userService.getUserCountByRole(User.UserRole.DOCTOR);

        // Assert
        assertEquals(5L, result);
        verify(userRepository).countByRole(User.UserRole.DOCTOR);
    }

    @Test
    void getActiveUsersSince_Success() {
        // Arrange
        LocalDateTime since = LocalDateTime.now().minusDays(7);
        List<User> users = Arrays.asList(testUser);
        when(userRepository.findUsersActiveSince(since)).thenReturn(users);

        // Act
        List<User> result = userService.getActiveUsersSince(since);

        // Assert
        assertEquals(1, result.size());
        verify(userRepository).findUsersActiveSince(since);
    }
} 