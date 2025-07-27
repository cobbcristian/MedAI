package com.aitelemedicine.telemedicine.repository;

import com.aitelemedicine.telemedicine.model.MedicalRecord;
import com.aitelemedicine.telemedicine.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface MedicalRecordRepository extends JpaRepository<MedicalRecord, Long> {
    
    List<MedicalRecord> findByPatient(User patient);
    List<MedicalRecord> findByDoctor(User doctor);
    
    @Query("SELECT mr FROM MedicalRecord mr WHERE mr.patient = :patient AND mr.category = :category")
    List<MedicalRecord> findByPatientAndCategory(@Param("patient") User patient, @Param("category") String category);
    
    @Query("SELECT mr FROM MedicalRecord mr WHERE mr.patient = :patient ORDER BY mr.createdAt DESC")
    List<MedicalRecord> findByPatientOrderByCreatedAtDesc(@Param("patient") User patient);
    
    @Query("SELECT mr FROM MedicalRecord mr WHERE mr.doctor = :doctor AND mr.createdAt >= :since")
    List<MedicalRecord> findByDoctorAndCreatedAfter(@Param("doctor") User doctor, @Param("since") LocalDateTime since);
    
    @Query("SELECT mr FROM MedicalRecord mr WHERE mr.patient = :patient AND mr.fileType = :fileType")
    List<MedicalRecord> findByPatientAndFileType(@Param("patient") User patient, @Param("fileType") String fileType);
    
    @Query("SELECT COUNT(mr) FROM MedicalRecord mr WHERE mr.patient = :patient")
    long countByPatient(@Param("patient") User patient);
    
    @Query("SELECT mr FROM MedicalRecord mr WHERE mr.patient = :patient AND mr.isEncrypted = true")
    List<MedicalRecord> findEncryptedRecordsByPatient(@Param("patient") User patient);
    
    @Query("SELECT DISTINCT mr.category FROM MedicalRecord mr WHERE mr.patient = :patient")
    List<String> findDistinctCategoriesByPatient(@Param("patient") User patient);
} 