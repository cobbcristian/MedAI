package com.aitelemedicine.telemedicine.repository;

import com.aitelemedicine.telemedicine.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    Optional<User> findByEmailVerificationToken(String token);
    
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    
    @Query("SELECT u FROM User u WHERE u.role = :role AND u.status = 'ACTIVE'")
    List<User> findByRoleAndActive(@Param("role") User.UserRole role);
    
    @Query("SELECT u FROM User u WHERE u.role = 'DOCTOR' AND u.specialization = :specialization AND u.status = 'ACTIVE'")
    List<User> findDoctorsBySpecialization(@Param("specialization") String specialization);
    
    @Query("SELECT u FROM User u WHERE u.role = 'DOCTOR' AND u.status = 'ACTIVE' ORDER BY u.consultationFee ASC")
    List<User> findActiveDoctorsOrderByFee();
    
    @Query("SELECT u FROM User u WHERE u.status = :status")
    List<User> findByStatus(@Param("status") User.UserStatus status);
    
    @Query("SELECT COUNT(u) FROM User u WHERE u.role = :role")
    long countByRole(@Param("role") User.UserRole role);
    
    @Query("SELECT u FROM User u WHERE u.lastLoginAt >= :since")
    List<User> findUsersActiveSince(@Param("since") java.time.LocalDateTime since);
}