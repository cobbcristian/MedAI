CREATE TABLE appointments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    patient_id BIGINT NOT NULL,
    doctor_id BIGINT NOT NULL,
    scheduled_at DATETIME NOT NULL,
    started_at DATETIME,
    ended_at DATETIME,
    duration INT,
    status ENUM('SCHEDULED', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW') DEFAULT 'SCHEDULED',
    type ENUM('VIDEO', 'AUDIO', 'CHAT', 'IN_PERSON') DEFAULT 'VIDEO',
    notes TEXT,
    symptoms TEXT,
    diagnosis TEXT,
    prescription TEXT,
    soap_notes TEXT,
    
    -- Payment
    fee DECIMAL(10,2),
    payment_status VARCHAR(20) DEFAULT 'PENDING',
    stripe_payment_intent_id VARCHAR(255),
    
    -- Video call
    meeting_id VARCHAR(255),
    meeting_url VARCHAR(500),
    recording_url VARCHAR(500),
    
    -- AI features
    ai_diagnosis TEXT,
    ai_recommendations TEXT,
    ai_summary TEXT,
    
    -- Timestamps
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (patient_id) REFERENCES users(id),
    FOREIGN KEY (doctor_id) REFERENCES users(id),
    
    INDEX idx_patient_id (patient_id),
    INDEX idx_doctor_id (doctor_id),
    INDEX idx_scheduled_at (scheduled_at),
    INDEX idx_status (status),
    INDEX idx_meeting_id (meeting_id)
); 