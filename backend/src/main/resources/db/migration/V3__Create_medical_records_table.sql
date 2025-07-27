CREATE TABLE medical_records (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    patient_id BIGINT NOT NULL,
    doctor_id BIGINT,
    appointment_id BIGINT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    file_type VARCHAR(50),
    file_url VARCHAR(500),
    file_name VARCHAR(255),
    file_size BIGINT,
    
    -- Medical data
    diagnosis TEXT,
    symptoms TEXT,
    treatment TEXT,
    medications TEXT,
    allergies TEXT,
    vital_signs TEXT, -- JSON string
    lab_results TEXT, -- JSON string
    
    -- AI analysis
    ai_analysis TEXT,
    ai_recommendations TEXT,
    ai_extracted_data TEXT, -- JSON string
    
    -- Security and compliance
    encryption_key VARCHAR(255),
    hash_value VARCHAR(255),
    is_encrypted BOOLEAN DEFAULT TRUE,
    access_level VARCHAR(20) DEFAULT 'PRIVATE',
    
    -- Timestamps
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_accessed_at DATETIME,
    
    FOREIGN KEY (patient_id) REFERENCES users(id),
    FOREIGN KEY (doctor_id) REFERENCES users(id),
    FOREIGN KEY (appointment_id) REFERENCES appointments(id),
    
    INDEX idx_patient_id (patient_id),
    INDEX idx_doctor_id (doctor_id),
    INDEX idx_category (category),
    INDEX idx_created_at (created_at)
); 