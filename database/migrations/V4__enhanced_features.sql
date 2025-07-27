-- Enhanced Features Database Migrations
-- Version 4: Advanced AI Features, Security & Compliance

-- Voice Emotion Analysis Table
CREATE TABLE voice_emotion_analysis (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    patient_id VARCHAR(255) NOT NULL,
    session_id VARCHAR(255) NOT NULL,
    emotion VARCHAR(50) NOT NULL,
    confidence DECIMAL(5,4) NOT NULL,
    stress_level DECIMAL(5,4) NOT NULL,
    pain_indicator DECIMAL(5,4) NOT NULL,
    mental_health_risk DECIMAL(5,4) NOT NULL,
    audio_features JSON,
    context TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_patient_id (patient_id),
    INDEX idx_session_id (session_id),
    INDEX idx_created_at (created_at)
);

-- Predictive Analytics Table
CREATE TABLE predictive_analytics (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    patient_id VARCHAR(255) NOT NULL,
    prediction_type ENUM('disease_progression', 'readmission_risk', 'treatment_response', 'mortality_risk') NOT NULL,
    predicted_value DECIMAL(5,4) NOT NULL,
    confidence DECIMAL(5,4) NOT NULL,
    risk_factors JSON,
    recommendations JSON,
    timeline JSON,
    condition VARCHAR(255),
    treatment_plan TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_patient_id (patient_id),
    INDEX idx_prediction_type (prediction_type),
    INDEX idx_created_at (created_at)
);

-- Clinical Decision Support Table
CREATE TABLE clinical_decisions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    patient_id VARCHAR(255) NOT NULL,
    doctor_id VARCHAR(255) NOT NULL,
    primary_diagnosis VARCHAR(255) NOT NULL,
    differential_diagnoses JSON,
    treatment_recommendations JSON,
    risk_assessment JSON,
    evidence_level ENUM('A', 'B', 'C') NOT NULL,
    clinical_guidelines JSON,
    symptoms JSON,
    lab_results JSON,
    imaging_results JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_patient_id (patient_id),
    INDEX idx_doctor_id (doctor_id),
    INDEX idx_primary_diagnosis (primary_diagnosis),
    INDEX idx_created_at (created_at)
);

-- Security Events Table
CREATE TABLE security_events (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    event_type VARCHAR(100) NOT NULL,
    severity ENUM('low', 'medium', 'high', 'critical') NOT NULL,
    user_id VARCHAR(255),
    ip_address VARCHAR(45),
    user_agent TEXT,
    description TEXT NOT NULL,
    details JSON,
    resolved BOOLEAN DEFAULT FALSE,
    resolved_at TIMESTAMP NULL,
    resolved_by VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_event_type (event_type),
    INDEX idx_severity (severity),
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at),
    INDEX idx_resolved (resolved)
);

-- Audit Logs Table
CREATE TABLE audit_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100) NOT NULL,
    resource_id VARCHAR(255) NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    user_agent TEXT,
    success BOOLEAN NOT NULL,
    details JSON,
    session_id VARCHAR(255),
    request_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_action (action),
    INDEX idx_resource_type (resource_type),
    INDEX idx_success (success),
    INDEX idx_created_at (created_at)
);

-- Data Retention Policies Table
CREATE TABLE data_retention_policies (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    data_type VARCHAR(100) NOT NULL,
    retention_days INT NOT NULL,
    retention_type ENUM('automatic', 'manual', 'legal_hold') NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_data_type (data_type),
    INDEX idx_is_active (is_active)
);

-- Compliance Reports Table
CREATE TABLE compliance_reports (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    report_type VARCHAR(100) NOT NULL,
    period_start TIMESTAMP NOT NULL,
    period_end TIMESTAMP NOT NULL,
    total_events INT NOT NULL,
    security_events INT NOT NULL,
    compliance_score DECIMAL(5,2) NOT NULL,
    violations JSON,
    recommendations JSON,
    generated_by VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_report_type (report_type),
    INDEX idx_period_start (period_start),
    INDEX idx_period_end (period_end),
    INDEX idx_compliance_score (compliance_score)
);

-- Model Version Registry Table
CREATE TABLE model_versions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    model_name VARCHAR(255) NOT NULL,
    version VARCHAR(50) NOT NULL,
    model_type VARCHAR(100) NOT NULL,
    performance_metrics JSON,
    training_data_info JSON,
    deployment_date TIMESTAMP NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_model_name (model_name),
    INDEX idx_version (version),
    INDEX idx_is_active (is_active),
    UNIQUE KEY unique_model_version (model_name, version)
);

-- AI Model Performance Tracking Table
CREATE TABLE model_performance (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    model_name VARCHAR(255) NOT NULL,
    model_version VARCHAR(50) NOT NULL,
    metric_name VARCHAR(100) NOT NULL,
    metric_value DECIMAL(10,4) NOT NULL,
    sample_size INT,
    confidence_interval JSON,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_model_name (model_name),
    INDEX idx_model_version (model_version),
    INDEX idx_metric_name (metric_name),
    INDEX idx_recorded_at (recorded_at)
);

-- Enhanced Patient Demographics for Bias Analysis
ALTER TABLE patients 
ADD COLUMN race VARCHAR(50) NULL,
ADD COLUMN ethnicity VARCHAR(50) NULL,
ADD COLUMN socioeconomic_status VARCHAR(50) NULL,
ADD COLUMN education_level VARCHAR(50) NULL,
ADD COLUMN insurance_type VARCHAR(50) NULL,
ADD COLUMN primary_language VARCHAR(50) NULL,
ADD COLUMN disability_status BOOLEAN DEFAULT FALSE,
ADD COLUMN veteran_status BOOLEAN DEFAULT FALSE,
ADD INDEX idx_demographics (race, ethnicity, socioeconomic_status);

-- Enhanced Medical Records for AI Analysis
ALTER TABLE medical_records 
ADD COLUMN ai_analysis JSON NULL,
ADD COLUMN confidence_score DECIMAL(5,4) NULL,
ADD COLUMN model_version VARCHAR(50) NULL,
ADD COLUMN analysis_timestamp TIMESTAMP NULL,
ADD COLUMN bias_metrics JSON NULL,
ADD INDEX idx_ai_analysis (confidence_score, model_version);

-- Enhanced Appointments for Voice Analysis
ALTER TABLE appointments 
ADD COLUMN voice_analysis_session_id VARCHAR(255) NULL,
ADD COLUMN emotion_detected VARCHAR(50) NULL,
ADD COLUMN stress_level DECIMAL(5,4) NULL,
ADD COLUMN ai_notes JSON NULL,
ADD COLUMN copilot_suggestions JSON NULL,
ADD INDEX idx_voice_analysis (voice_analysis_session_id);

-- Enhanced Prescriptions for AI Tracking
ALTER TABLE prescriptions 
ADD COLUMN ai_recommendation BOOLEAN DEFAULT FALSE,
ADD COLUMN treatment_response_prediction DECIMAL(5,4) NULL,
ADD COLUMN risk_factors JSON NULL,
ADD COLUMN alternative_treatments JSON NULL,
ADD COLUMN monitoring_plan JSON NULL,
ADD INDEX idx_ai_recommendation (ai_recommendation);

-- Insert default data retention policies
INSERT INTO data_retention_policies (data_type, retention_days, retention_type, description) VALUES
('patient_phi', 2555, 'automatic', 'HIPAA requirement: 7 years'),
('audit_logs', 2555, 'automatic', 'HIPAA requirement: 7 years'),
('voice_recordings', 90, 'automatic', 'Temporary voice analysis data'),
('ai_analysis_results', 1825, 'automatic', '5 years for research and improvement'),
('security_events', 2555, 'automatic', 'Security monitoring retention'),
('compliance_reports', 3650, 'automatic', '10 years for regulatory compliance');

-- Insert default model versions
INSERT INTO model_versions (model_name, version, model_type, performance_metrics, training_data_info, deployment_date) VALUES
('multimodal_diagnosis', 'v1.3.7', 'diagnosis', '{"accuracy": 0.89, "precision": 0.87, "recall": 0.91}', '{"size": "10GB", "samples": 50000}', NOW()),
('voice_emotion', 'v2.0.0', 'emotion_detection', '{"accuracy": 0.85, "f1_score": 0.83}', '{"size": "5GB", "samples": 25000}', NOW()),
('predictive_analytics', 'v1.2.1', 'prediction', '{"auc": 0.92, "precision": 0.88}', '{"size": "15GB", "samples": 75000}', NOW()),
('clinical_decision', 'v1.4.2', 'decision_support', '{"accuracy": 0.91, "confidence": 0.89}', '{"size": "20GB", "samples": 100000}', NOW()),
('bias_fairness', 'v1.1.0', 'bias_detection', '{"demographic_parity": 0.95, "equalized_odds": 0.93}', '{"size": "8GB", "samples": 40000}', NOW());

-- Create indexes for performance optimization
CREATE INDEX idx_audit_logs_composite ON audit_logs (user_id, action, created_at);
CREATE INDEX idx_security_events_composite ON security_events (event_type, severity, created_at);
CREATE INDEX idx_voice_emotion_composite ON voice_emotion_analysis (patient_id, emotion, created_at);
CREATE INDEX idx_predictive_analytics_composite ON predictive_analytics (patient_id, prediction_type, created_at);
CREATE INDEX idx_clinical_decisions_composite ON clinical_decisions (patient_id, primary_diagnosis, created_at); 