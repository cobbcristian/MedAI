CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(120) NOT NULL,
    email VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    role ENUM('PATIENT', 'DOCTOR', 'ADMIN') NOT NULL,
    status ENUM('ACTIVE', 'INACTIVE', 'LOCKED', 'PENDING_VERIFICATION') DEFAULT 'ACTIVE',
    phone_number VARCHAR(20),
    date_of_birth VARCHAR(20),
    address TEXT,
    emergency_contact VARCHAR(100),
    emergency_phone VARCHAR(20),
    
    -- Doctor-specific fields
    license_number VARCHAR(50),
    specialization VARCHAR(100),
    qualifications TEXT,
    experience VARCHAR(100),
    bio TEXT,
    consultation_fee DECIMAL(10,2),
    
    -- Patient-specific fields
    blood_type VARCHAR(10),
    allergies TEXT,
    medical_history TEXT,
    current_medications TEXT,
    
    -- Security fields
    two_factor_secret VARCHAR(100),
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    email_verified BOOLEAN DEFAULT FALSE,
    email_verification_token VARCHAR(255),
    email_verification_expiry DATETIME,
    
    -- Timestamps
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login_at DATETIME,
    
    -- Profile image
    profile_image_url VARCHAR(255),
    
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
); 