CREATE TABLE chat_messages (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    sender_id BIGINT NOT NULL,
    receiver_id BIGINT NOT NULL,
    appointment_id BIGINT,
    message TEXT NOT NULL,
    type ENUM('TEXT', 'IMAGE', 'FILE', 'AUDIO', 'VIDEO', 'SYSTEM') DEFAULT 'TEXT',
    attachment_url VARCHAR(500),
    attachment_type VARCHAR(50),
    attachment_name VARCHAR(255),
    attachment_size BIGINT,
    
    -- Message status
    status ENUM('SENT', 'DELIVERED', 'READ', 'FAILED') DEFAULT 'SENT',
    read_at DATETIME,
    delivered_at DATETIME,
    
    -- AI features
    is_ai_generated BOOLEAN DEFAULT FALSE,
    ai_context TEXT,
    ai_model VARCHAR(100),
    
    -- Timestamps
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (sender_id) REFERENCES users(id),
    FOREIGN KEY (receiver_id) REFERENCES users(id),
    FOREIGN KEY (appointment_id) REFERENCES appointments(id),
    
    INDEX idx_sender_id (sender_id),
    INDEX idx_receiver_id (receiver_id),
    INDEX idx_appointment_id (appointment_id),
    INDEX idx_created_at (created_at),
    INDEX idx_status (status)
); 