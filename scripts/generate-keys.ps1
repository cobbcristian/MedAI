# AI Telemedicine Platform - Key Generation Script
# This script generates all necessary security keys and API configurations

Write-Host "🔑 Generating security keys for AI Telemedicine Platform..." -ForegroundColor Green

# Function to generate random base64 string
function Generate-RandomBase64 {
    param([int]$Length = 32)
    $bytes = New-Object byte[] $Length
    (New-Object Security.Cryptography.RNGCryptoServiceProvider).GetBytes($bytes)
    return [Convert]::ToBase64String($bytes)
}

# Function to generate random string
function Generate-RandomString {
    param([int]$Length = 32)
    $chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*"
    $random = ""
    for ($i = 0; $i -lt $Length; $i++) {
        $random += $chars[(Get-Random -Maximum $chars.Length)]
    }
    return $random
}

Write-Host "📋 Generating security keys..." -ForegroundColor Blue

# Generate JWT Secret (64 bytes)
$JWT_SECRET = Generate-RandomBase64 -Length 64
Write-Host "✅ JWT Secret generated" -ForegroundColor Green

# Generate Encryption Key (32 bytes)
$ENCRYPTION_KEY = Generate-RandomBase64 -Length 32
Write-Host "✅ Encryption Key generated" -ForegroundColor Green

# Generate Database Passwords
$MYSQL_ROOT_PASSWORD = Generate-RandomString -Length 16
$MYSQL_USER_PASSWORD = Generate-RandomString -Length 16
$REDIS_PASSWORD = Generate-RandomString -Length 16
Write-Host "✅ Database passwords generated" -ForegroundColor Green

# Generate Monitoring Passwords
$GRAFANA_PASSWORD = Generate-RandomString -Length 12
$ELASTICSEARCH_PASSWORD = Generate-RandomString -Length 12
Write-Host "✅ Monitoring passwords generated" -ForegroundColor Green

# Create .env file with generated keys
Write-Host "📝 Creating .env file with generated keys..." -ForegroundColor Blue

$envContent = @"
# AI Telemedicine Platform Environment Configuration
# Generated on $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")

# =============================================================================
# DATABASE CONFIGURATION
# =============================================================================
MYSQL_ROOT_PASSWORD=$MYSQL_ROOT_PASSWORD
MYSQL_USER=ai_telemedicine_user
MYSQL_PASSWORD=$MYSQL_USER_PASSWORD
DATABASE_URL=jdbc:mysql://mysql:3306/ai_telemedicine?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC

# =============================================================================
# AI & MACHINE LEARNING CONFIGURATION
# =============================================================================
# Get your API keys from:
# OpenAI: https://platform.openai.com/api-keys
# Hugging Face: https://huggingface.co/settings/tokens
# Google Cloud: https://console.cloud.google.com/
OPENAI_API_KEY=your_openai_api_key_here
HUGGINGFACE_API_KEY=your_huggingface_api_key_here
GOOGLE_CLOUD_API_KEY=your_google_cloud_api_key_here

# AI Model Configuration
AI_MODEL_CACHE_DIR=/app/models
AI_MODEL_DOWNLOAD_ENABLED=true
AI_MODEL_UPDATE_FREQUENCY=weekly
AI_MODEL_VERSION_TRACKING=true

# Voice Analysis Configuration
VOICE_ANALYSIS_ENABLED=true
VOICE_RECORDING_RETENTION_DAYS=90
VOICE_ANALYSIS_MODEL=superb/wav2vec2-base-superb-ks
VOICE_PROCESSING_MODEL=facebook/wav2vec2-base-960h

# Predictive Analytics Configuration
PREDICTIVE_ANALYTICS_ENABLED=true
PREDICTION_MODEL_UPDATE_FREQUENCY=monthly
PREDICTION_CONFIDENCE_THRESHOLD=0.75
PREDICTION_RETENTION_DAYS=1825

# =============================================================================
# SECURITY & COMPLIANCE CONFIGURATION
# =============================================================================
JWT_SECRET=$JWT_SECRET
ENCRYPTION_KEY=$ENCRYPTION_KEY
REDIS_PASSWORD=$REDIS_PASSWORD

# HIPAA Compliance Settings
HIPAA_COMPLIANCE_MODE=true
AUDIT_LOGGING_ENABLED=true
DATA_ENCRYPTION_ENABLED=true
ACCESS_CONTROL_ENABLED=true
DATA_BACKUP_REQUIRED=true

# Security Monitoring
SECURITY_MONITORING_ENABLED=true
SECURITY_ALERT_EMAIL=security@aitelemedicine.com
SECURITY_ALERT_WEBHOOK=https://your-webhook-url.com/security-alerts

# Data Retention Policies (in days)
PATIENT_PHI_RETENTION_DAYS=2555
AUDIT_LOG_RETENTION_DAYS=2555
VOICE_RECORDING_RETENTION_DAYS=90
AI_ANALYSIS_RETENTION_DAYS=1825
SECURITY_EVENT_RETENTION_DAYS=2555
COMPLIANCE_REPORT_RETENTION_DAYS=3650

# =============================================================================
# MONITORING & OBSERVABILITY
# =============================================================================
PROMETHEUS_ENABLED=true
GRAFANA_ENABLED=true
ELASTICSEARCH_ENABLED=true
KIBANA_ENABLED=true
LOGSTASH_ENABLED=true

# Monitoring Passwords
GRAFANA_PASSWORD=$GRAFANA_PASSWORD
ELASTICSEARCH_PASSWORD=$ELASTICSEARCH_PASSWORD

# =============================================================================
# CLOUD & DEPLOYMENT CONFIGURATION
# =============================================================================
ENVIRONMENT=production
REGION=us-east-1
AVAILABILITY_ZONE=us-east-1a

# Cloud Provider Configuration
# Get your cloud provider keys from:
# AWS: https://console.aws.amazon.com/iam/
# Google Cloud: https://console.cloud.google.com/iam-admin/
# Azure: https://portal.azure.com/#blade/Microsoft_Azure_ProjectOxford/ProjectOxfordSettingsBlade
AWS_ACCESS_KEY_ID=your_aws_access_key_here
AWS_SECRET_ACCESS_KEY=your_aws_secret_key_here
AWS_REGION=us-east-1

# Google Cloud Configuration
GOOGLE_CLOUD_PROJECT_ID=your_project_id_here
GOOGLE_CLOUD_CREDENTIALS_FILE=/path/to/credentials.json

# Azure Configuration
AZURE_SUBSCRIPTION_ID=your_subscription_id_here
AZURE_TENANT_ID=your_tenant_id_here
AZURE_CLIENT_ID=your_client_id_here
AZURE_CLIENT_SECRET=your_client_secret_here

# =============================================================================
# PERFORMANCE & SCALING CONFIGURATION
# =============================================================================
MAX_CONCURRENT_REQUESTS=100
REQUEST_TIMEOUT_SECONDS=30
AI_MODEL_CACHE_SIZE_MB=2048
DATABASE_CONNECTION_POOL_SIZE=20
REDIS_CONNECTION_POOL_SIZE=10

# Auto-scaling Configuration
AUTO_SCALING_ENABLED=true
MIN_INSTANCES=2
MAX_INSTANCES=10
SCALE_UP_THRESHOLD=70
SCALE_DOWN_THRESHOLD=30

# =============================================================================
# FEATURE FLAGS
# =============================================================================
ENABLE_VOICE_ANALYSIS=true
ENABLE_PREDICTIVE_ANALYTICS=true
ENABLE_AI_TRAINING_SANDBOX=true
ENABLE_MODEL_COMPARISON=true
ENABLE_PATIENT_FEEDBACK=true
ENABLE_FEDERATED_LEARNING=true
ENABLE_REAL_TIME_MONITORING=true
ENABLE_OFFLINE_MODE=true
ENABLE_MULTI_LANGUAGE=true

# =============================================================================
# INTEGRATION CONFIGURATION
# =============================================================================
# Payment Processing (Stripe)
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here
STRIPE_SECRET_KEY=your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret_here

# Email Service (SendGrid)
SENDGRID_API_KEY=your_sendgrid_api_key_here
SENDGRID_FROM_EMAIL=noreply@aitelemedicine.com
SENDGRID_FROM_NAME=AI Telemedicine Platform

# SMS Service (Twilio)
TWILIO_ACCOUNT_SID=your_twilio_account_sid_here
TWILIO_AUTH_TOKEN=your_twilio_auth_token_here
TWILIO_PHONE_NUMBER=your_twilio_phone_number_here

# Video Calling (WebRTC)
WEBRTC_ICE_SERVERS=stun:stun.l.google.com:19302,stun:stun1.l.google.com:19302
WEBRTC_TURN_SERVER=your_turn_server_here
WEBRTC_TURN_USERNAME=your_turn_username_here
WEBRTC_TURN_CREDENTIAL=your_turn_credential_here

# =============================================================================
# DEVELOPMENT & TESTING CONFIGURATION
# =============================================================================
DEBUG_MODE=false
LOG_LEVEL=INFO
ENABLE_MOCK_AI_SERVICES=true
ENABLE_TEST_DATA=true
ENABLE_DEVELOPMENT_TOOLS=false

# Test Configuration
TEST_DATABASE_URL=jdbc:mysql://test-mysql:3306/ai_telemedicine_test
TEST_REDIS_URL=redis://test-redis:6379
TEST_AI_BACKEND_URL=http://test-ai-backend:8000

# =============================================================================
# BACKUP & RECOVERY CONFIGURATION
# =============================================================================
BACKUP_ENABLED=true
BACKUP_FREQUENCY_HOURS=24
BACKUP_RETENTION_DAYS=30
BACKUP_STORAGE_TYPE=s3
BACKUP_S3_BUCKET=ai-telemedicine-backups
BACKUP_ENCRYPTION_ENABLED=true

# Disaster Recovery
DISASTER_RECOVERY_ENABLED=true
DR_REPLICATION_INTERVAL_MINUTES=15
DR_FAILOVER_AUTOMATIC=true
DR_BACKUP_LOCATION=us-west-2

# =============================================================================
# COMPLIANCE & AUDITING CONFIGURATION
# =============================================================================
# HIPAA Compliance
HIPAA_AUDIT_ENABLED=true
HIPAA_AUDIT_RETENTION_DAYS=2555
HIPAA_BREACH_NOTIFICATION_ENABLED=true
HIPAA_BAA_REQUIRED=true

# GDPR Compliance
GDPR_COMPLIANCE_ENABLED=true
GDPR_DATA_PORTABILITY_ENABLED=true
GDPR_RIGHT_TO_BE_FORGOTTEN_ENABLED=true
GDPR_CONSENT_MANAGEMENT_ENABLED=true

# SOC 2 Compliance
SOC2_COMPLIANCE_ENABLED=true
SOC2_CONTROL_MONITORING_ENABLED=true
SOC2_SECURITY_CONTROLS_ENABLED=true

# =============================================================================
# ANALYTICS & REPORTING CONFIGURATION
# =============================================================================
ANALYTICS_ENABLED=true
ANALYTICS_PROVIDER=mixpanel
MIXPANEL_TOKEN=your_mixpanel_token_here
GOOGLE_ANALYTICS_ID=your_ga_id_here

# Business Intelligence
BI_ENABLED=true
BI_DASHBOARD_REFRESH_INTERVAL_MINUTES=15
BI_REPORT_GENERATION_ENABLED=true
BI_DATA_WAREHOUSE_ENABLED=true

# =============================================================================
# MOBILE APP CONFIGURATION
# =============================================================================
# React Native Configuration
REACT_NATIVE_BUNDLE_ID=com.aitelemedicine.app
REACT_NATIVE_APP_NAME=AI Telemedicine
REACT_NATIVE_APP_VERSION=1.0.0
REACT_NATIVE_BUILD_NUMBER=1

# Push Notifications
PUSH_NOTIFICATION_ENABLED=true
FIREBASE_SERVER_KEY=your_firebase_server_key_here
APNS_KEY_ID=your_apns_key_id_here
APNS_TEAM_ID=your_apns_team_id_here
APNS_AUTH_KEY=your_apns_auth_key_here

# =============================================================================
# DESKTOP APP CONFIGURATION
# =============================================================================
# Electron Configuration
ELECTRON_APP_NAME=AI Telemedicine Desktop
ELECTRON_APP_VERSION=1.0.0
ELECTRON_APP_DESCRIPTION=AI-powered telemedicine platform for desktop
ELECTRON_APP_AUTHOR=AI Telemedicine Team
ELECTRON_APP_LICENSE=MIT

# Auto-update Configuration
ELECTRON_AUTO_UPDATE_ENABLED=true
ELECTRON_UPDATE_SERVER=https://updates.aitelemedicine.com
ELECTRON_UPDATE_CHECK_INTERVAL_HOURS=24

# =============================================================================
# API RATE LIMITING & THROTTLING
# =============================================================================
RATE_LIMITING_ENABLED=true
RATE_LIMIT_REQUESTS_PER_MINUTE=100
RATE_LIMIT_REQUESTS_PER_HOUR=1000
RATE_LIMIT_REQUESTS_PER_DAY=10000

# AI Model Rate Limiting
AI_MODEL_RATE_LIMIT_REQUESTS_PER_MINUTE=10
AI_MODEL_RATE_LIMIT_REQUESTS_PER_HOUR=100
AI_MODEL_RATE_LIMIT_REQUESTS_PER_DAY=1000

# =============================================================================
# CACHING CONFIGURATION
# =============================================================================
CACHE_ENABLED=true
CACHE_TTL_SECONDS=3600
CACHE_MAX_SIZE_MB=1024
CACHE_EVICTION_POLICY=LRU

# AI Model Caching
AI_MODEL_CACHE_ENABLED=true
AI_MODEL_CACHE_TTL_HOURS=24
AI_MODEL_CACHE_MAX_SIZE_GB=10

# =============================================================================
# LOGGING CONFIGURATION
# =============================================================================
LOG_LEVEL=INFO
LOG_FORMAT=json
LOG_OUTPUT=file
LOG_FILE_PATH=/var/log/ai-telemedicine
LOG_ROTATION_ENABLED=true
LOG_ROTATION_MAX_SIZE_MB=100
LOG_ROTATION_MAX_FILES=10

# Application Logging
APP_LOG_LEVEL=INFO
APP_LOG_ENABLED=true
APP_LOG_FILE=app.log

# AI Model Logging
AI_LOG_LEVEL=INFO
AI_LOG_ENABLED=true
AI_LOG_FILE=ai.log

# Security Logging
SECURITY_LOG_LEVEL=WARN
SECURITY_LOG_ENABLED=true
SECURITY_LOG_FILE=security.log

# =============================================================================
# HEALTH CHECK CONFIGURATION
# =============================================================================
HEALTH_CHECK_ENABLED=true
HEALTH_CHECK_INTERVAL_SECONDS=30
HEALTH_CHECK_TIMEOUT_SECONDS=10
HEALTH_CHECK_RETRY_ATTEMPTS=3

# Service Health Checks
DATABASE_HEALTH_CHECK_ENABLED=true
REDIS_HEALTH_CHECK_ENABLED=true
AI_BACKEND_HEALTH_CHECK_ENABLED=true
FRONTEND_HEALTH_CHECK_ENABLED=true

# =============================================================================
# ALERTING CONFIGURATION
# =============================================================================
ALERTING_ENABLED=true
ALERT_EMAIL_ENABLED=true
ALERT_SMS_ENABLED=true
ALERT_WEBHOOK_ENABLED=true

# Alert Thresholds
ALERT_CPU_THRESHOLD_PERCENT=80
ALERT_MEMORY_THRESHOLD_PERCENT=80
ALERT_DISK_THRESHOLD_PERCENT=85
ALERT_ERROR_RATE_THRESHOLD_PERCENT=5

# =============================================================================
# FEATURE-SPECIFIC CONFIGURATION
# =============================================================================
# AI Training Sandbox
AI_TRAINING_SANDBOX_ENABLED=true
AI_TRAINING_MAX_DATASET_SIZE_MB=100
AI_TRAINING_MAX_TRAINING_TIME_HOURS=24
AI_TRAINING_FEDERATED_LEARNING_ENABLED=true

# Model Comparison Dashboard
MODEL_COMPARISON_ENABLED=true
MODEL_COMPARISON_MAX_MODELS=5
MODEL_COMPARISON_HISTORY_RETENTION_DAYS=90

# Patient Feedback Loop
PATIENT_FEEDBACK_ENABLED=true
PATIENT_FEEDBACK_TRUST_THRESHOLD=0.7
PATIENT_FEEDBACK_RETENTION_DAYS=365

# Voice Analysis
VOICE_ANALYSIS_ENABLED=true
VOICE_ANALYSIS_MAX_DURATION_SECONDS=300
VOICE_ANALYSIS_QUALITY_THRESHOLD=0.8

# Predictive Analytics
PREDICTIVE_ANALYTICS_ENABLED=true
PREDICTIVE_ANALYTICS_CONFIDENCE_THRESHOLD=0.75
PREDICTIVE_ANALYTICS_UPDATE_FREQUENCY_HOURS=24

# =============================================================================
# SECURITY HARDENING CONFIGURATION
# =============================================================================
# SSL/TLS Configuration
SSL_ENABLED=true
SSL_CERT_PATH=/etc/ssl/certs/aitelemedicine.crt
SSL_KEY_PATH=/etc/ssl/private/aitelemedicine.key
SSL_CIPHER_SUITE=TLS_AES_256_GCM_SHA384

# Security Headers
SECURITY_HEADERS_ENABLED=true
CSP_ENABLED=true
HSTS_ENABLED=true
X_FRAME_OPTIONS_ENABLED=true
X_CONTENT_TYPE_OPTIONS_ENABLED=true

# Input Validation
INPUT_VALIDATION_ENABLED=true
SQL_INJECTION_PROTECTION_ENABLED=true
XSS_PROTECTION_ENABLED=true
CSRF_PROTECTION_ENABLED=true

# =============================================================================
# PERFORMANCE OPTIMIZATION CONFIGURATION
# =============================================================================
# Database Optimization
DB_CONNECTION_POOL_SIZE=20
DB_QUERY_TIMEOUT_SECONDS=30
DB_INDEX_OPTIMIZATION_ENABLED=true

# AI Model Optimization
AI_MODEL_QUANTIZATION_ENABLED=true
AI_MODEL_PRUNING_ENABLED=true
AI_MODEL_DISTILLATION_ENABLED=true

# Frontend Optimization
FRONTEND_BUNDLE_OPTIMIZATION_ENABLED=true
FRONTEND_LAZY_LOADING_ENABLED=true
FRONTEND_CACHE_STRATEGY=aggressive

# =============================================================================
# TESTING CONFIGURATION
# =============================================================================
# Unit Testing
UNIT_TESTING_ENABLED=true
UNIT_TEST_COVERAGE_THRESHOLD=80
UNIT_TEST_TIMEOUT_SECONDS=30

# Integration Testing
INTEGRATION_TESTING_ENABLED=true
INTEGRATION_TEST_ENVIRONMENT=staging
INTEGRATION_TEST_TIMEOUT_SECONDS=60

# Load Testing
LOAD_TESTING_ENABLED=true
LOAD_TEST_MAX_CONCURRENT_USERS=1000
LOAD_TEST_DURATION_MINUTES=30

# =============================================================================
# DEPLOYMENT CONFIGURATION
# =============================================================================
# Docker Configuration
DOCKER_REGISTRY=your-registry.com
DOCKER_IMAGE_TAG=latest
DOCKER_BUILD_CONTEXT=.

# Kubernetes Configuration
KUBERNETES_NAMESPACE=ai-telemedicine
KUBERNETES_REPLICAS=3
KUBERNETES_RESOURCE_LIMITS_CPU=1000m
KUBERNETES_RESOURCE_LIMITS_MEMORY=2Gi

# CI/CD Configuration
CI_CD_ENABLED=true
CI_CD_PROVIDER=github-actions
CI_CD_AUTO_DEPLOY_ENABLED=true
CI_CD_DEPLOYMENT_ENVIRONMENT=production

# =============================================================================
# MONITORING & OBSERVABILITY CONFIGURATION
# =============================================================================
# Application Performance Monitoring
APM_ENABLED=true
APM_PROVIDER=datadog
DATADOG_API_KEY=your_datadog_api_key_here
DATADOG_APP_KEY=your_datadog_app_key_here

# Error Tracking
ERROR_TRACKING_ENABLED=true
ERROR_TRACKING_PROVIDER=sentry
SENTRY_DSN=your_sentry_dsn_here

# Metrics Collection
METRICS_COLLECTION_ENABLED=true
METRICS_PROVIDER=prometheus
PROMETHEUS_ENDPOINT=http://prometheus:9090

# =============================================================================
# INTERNATIONALIZATION CONFIGURATION
# =============================================================================
# Multi-language Support
I18N_ENABLED=true
I18N_DEFAULT_LOCALE=en
I18N_SUPPORTED_LOCALES=en,es,fr,de,zh,ar
I18N_FALLBACK_LOCALE=en

# Localization
LOCALIZATION_ENABLED=true
LOCALIZATION_TIMEZONE=UTC
LOCALIZATION_DATE_FORMAT=YYYY-MM-DD
LOCALIZATION_TIME_FORMAT=HH:mm:ss

# =============================================================================
# ACCESSIBILITY CONFIGURATION
# =============================================================================
# WCAG Compliance
WCAG_COMPLIANCE_ENABLED=true
WCAG_LEVEL=AA
SCREEN_READER_SUPPORT_ENABLED=true
KEYBOARD_NAVIGATION_ENABLED=true

# Color and Contrast
ACCESSIBILITY_HIGH_CONTRAST_ENABLED=true
ACCESSIBILITY_COLOR_BLIND_SUPPORT_ENABLED=true
ACCESSIBILITY_FONT_SIZE_ADJUSTMENT_ENABLED=true

# =============================================================================
# COMPLIANCE REPORTING CONFIGURATION
# =============================================================================
# HIPAA Reporting
HIPAA_REPORTING_ENABLED=true
HIPAA_REPORT_FREQUENCY=monthly
HIPAA_REPORT_RETENTION_YEARS=6

# GDPR Reporting
GDPR_REPORTING_ENABLED=true
GDPR_REPORT_FREQUENCY=quarterly
GDPR_REPORT_RETENTION_YEARS=3

# SOC 2 Reporting
SOC2_REPORTING_ENABLED=true
SOC2_REPORT_FREQUENCY=annually
SOC2_REPORT_RETENTION_YEARS=7

# =============================================================================
# BACKUP & DISASTER RECOVERY CONFIGURATION
# =============================================================================
# Automated Backups
BACKUP_AUTOMATION_ENABLED=true
BACKUP_SCHEDULE=0 2 * * *
BACKUP_VERIFICATION_ENABLED=true
BACKUP_ENCRYPTION_ENABLED=true

# Disaster Recovery
DR_AUTOMATION_ENABLED=true
DR_FAILOVER_TESTING_ENABLED=true
DR_RECOVERY_TIME_OBJECTIVE_HOURS=4
DR_RECOVERY_POINT_OBJECTIVE_MINUTES=15

# =============================================================================
# SECURITY MONITORING CONFIGURATION
# =============================================================================
# Intrusion Detection
IDS_ENABLED=true
IDS_PROVIDER=wazuh
WAZUH_MANAGER_URL=https://wazuh-manager:1514
WAZUH_API_URL=https://wazuh-manager:55000

# Vulnerability Scanning
VULNERABILITY_SCANNING_ENABLED=true
VULNERABILITY_SCAN_FREQUENCY=daily
VULNERABILITY_SCAN_PROVIDER=nessus
NESSUS_API_KEY=your_nessus_api_key_here

# Security Information and Event Management
SIEM_ENABLED=true
SIEM_PROVIDER=splunk
SPLUNK_HEC_URL=https://splunk:8088
SPLUNK_HEC_TOKEN=your_splunk_hec_token_here

# =============================================================================
# API DOCUMENTATION CONFIGURATION
# =============================================================================
# Swagger/OpenAPI
API_DOCUMENTATION_ENABLED=true
API_DOCUMENTATION_PROVIDER=swagger
SWAGGER_UI_ENABLED=true
SWAGGER_UI_PATH=/api/docs

# API Versioning
API_VERSIONING_ENABLED=true
API_VERSION=v1
API_VERSION_DEPRECATION_NOTICE_DAYS=90

# =============================================================================
# DEVELOPMENT TOOLS CONFIGURATION
# =============================================================================
# Development Mode
DEV_MODE_ENABLED=false
DEV_TOOLS_ENABLED=false
HOT_RELOAD_ENABLED=false

# Debugging
DEBUG_MODE_ENABLED=false
DEBUG_PORT=9229
DEBUG_BREAK_ON_START=false

# =============================================================================
# END OF CONFIGURATION
# =============================================================================
"@

# Save the .env file
Set-Content -Path ".env" -Value $envContent

Write-Host "✅ .env file created with generated security keys" -ForegroundColor Green

# Create API keys guide
Write-Host "📋 Creating API keys guide..." -ForegroundColor Blue

$apiKeysGuide = @"
# 🔑 API Keys Setup Guide

## Required API Keys for Full Functionality

### 1. OpenAI API Key (Recommended)
- **Purpose**: GPT-4 integration, AI model comparison, advanced AI features
- **Get from**: https://platform.openai.com/api-keys
- **Cost**: Pay-per-use (very affordable for testing)
- **Update in**: .env file - OPENAI_API_KEY

### 2. Hugging Face API Key (Optional)
- **Purpose**: BioGPT, medical AI models, model comparison
- **Get from**: https://huggingface.co/settings/tokens
- **Cost**: Free tier available
- **Update in**: .env file - HUGGINGFACE_API_KEY

### 3. Google Cloud API Key (Optional)
- **Purpose**: Cloud AI services, speech recognition, advanced features
- **Get from**: https://console.cloud.google.com/
- **Cost**: Free tier available
- **Update in**: .env file - GOOGLE_CLOUD_API_KEY

## Optional API Keys for Advanced Features

### 4. Stripe API Keys (Payment Processing)
- **Purpose**: Payment processing for consultations
- **Get from**: https://dashboard.stripe.com/apikeys
- **Update in**: .env file - STRIPE_PUBLISHABLE_KEY, STRIPE_SECRET_KEY

### 5. SendGrid API Key (Email)
- **Purpose**: Email notifications and alerts
- **Get from**: https://app.sendgrid.com/settings/api_keys
- **Update in**: .env file - SENDGRID_API_KEY

### 6. Twilio API Keys (SMS)
- **Purpose**: SMS notifications and alerts
- **Get from**: https://console.twilio.com/
- **Update in**: .env file - TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN

## Quick Setup Instructions

1. **For Basic Testing (No API Keys Needed):**
   ```bash
   docker-compose up -d
   # Access at: http://localhost:3000
   ```

2. **For Full AI Features:**
   - Get OpenAI API key
   - Update OPENAI_API_KEY in .env file
   - Restart: docker-compose restart

3. **For Production:**
   - Get all recommended API keys
   - Update all keys in .env file
   - Deploy to cloud provider

## Security Keys Generated

The following security keys have been automatically generated:
- JWT_SECRET: $JWT_SECRET
- ENCRYPTION_KEY: $ENCRYPTION_KEY
- Database passwords: Generated and secure
- Monitoring passwords: Generated and secure

## Next Steps

1. Create GitHub repository
2. Push code to GitHub
3. Get API keys (optional but recommended)
4. Deploy to production

Your AI Telemedicine Platform is ready to use!
"@

Set-Content -Path "API_KEYS_GUIDE.md" -Value $apiKeysGuide

Write-Host "✅ API keys guide created" -ForegroundColor Green

# Create GitHub deployment script
Write-Host "🚀 Creating GitHub deployment script..." -ForegroundColor Blue

$deployScript = @"
# AI Telemedicine Platform - GitHub Deployment Script

Write-Host "🚀 Deploying AI Telemedicine Platform to GitHub..." -ForegroundColor Green

# Configuration
`$GITHUB_USERNAME = "cobbcristian17"
`$REPO_NAME = "AI_Telemedicine"

Write-Host "📋 Configuration:" -ForegroundColor Blue
Write-Host "GitHub Username: `$GITHUB_USERNAME"
Write-Host "Repository Name: `$REPO_NAME"

# Check if git is installed
if (!(Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Git is not installed. Please install Git first." -ForegroundColor Red
    exit 1
}

# Configure git
Write-Host "⚙️  Configuring Git..." -ForegroundColor Blue
git config --global user.name "`$GITHUB_USERNAME"
git config --global user.email "cobbcristian17@gmail.com"

# Add all files
Write-Host "📁 Adding all files to Git..." -ForegroundColor Blue
git add .

# Commit changes
Write-Host "💾 Committing changes..." -ForegroundColor Blue
git commit -m "🚀 Complete AI Telemedicine Platform deployment with all features

✨ Features Deployed:
- Custom AI Training Sandbox with federated learning
- AI Model Comparison Dashboard
- Patient-Centered AI Feedback Loop
- Multi-Platform Deployment (Desktop, Web, Mobile)
- Security & Compliance Tools (HIPAA/GDPR)
- Global Health Features

🔧 Technical Implementation:
- Python FastAPI backend for AI services
- React frontend with Material-UI
- Docker containerization
- CI/CD pipeline with GitHub Actions
- Multi-region cloud deployment
- Offline-first PWA support

📱 Platform Support:
- Desktop application (Electron)
- Web application (React PWA)
- Mobile apps (React Native)
- Cloud deployment (AWS/GCP/Azure)

🛡️ Security & Compliance:
- HIPAA/GDPR compliance
- Data anonymization
- Real-time compliance monitoring
- Audit logging and reporting

🌍 Global Features:
- Multi-language support
- Offline functionality
- Global deployment readiness
- Performance monitoring

🔑 Security Keys Generated:
- JWT Secret: Generated and secure
- Encryption Key: Generated and secure
- Database passwords: Generated and secure
- Monitoring passwords: Generated and secure

📋 API Keys Guide:
- OpenAI API key (recommended for AI features)
- Hugging Face API key (optional)
- Google Cloud API key (optional)
- All other keys documented in API_KEYS_GUIDE.md

🎉 Ready for production deployment!"

# Set remote URL
Write-Host "🔗 Setting remote URL..." -ForegroundColor Blue
git remote set-url origin https://github.com/`$GITHUB_USERNAME/`$REPO_NAME.git

# Push to GitHub
Write-Host "🚀 Pushing to GitHub..." -ForegroundColor Blue
git push -u origin main

Write-Host "✅ Deployment complete!" -ForegroundColor Green
Write-Host "🌐 Repository URL: https://github.com/`$GITHUB_USERNAME/`$REPO_NAME" -ForegroundColor Blue
Write-Host "📖 Documentation: https://`$GITHUB_USERNAME.github.io/`$REPO_NAME" -ForegroundColor Blue
Write-Host "🔑 API Keys Guide: API_KEYS_GUIDE.md" -ForegroundColor Blue
Write-Host "📋 Next Steps:" -ForegroundColor Blue
Write-Host "1. Get API keys (optional but recommended)" -ForegroundColor Yellow
Write-Host "2. Deploy to production cloud" -ForegroundColor Yellow
Write-Host "3. Set up monitoring and alerts" -ForegroundColor Yellow
Write-Host "4. Configure CI/CD pipeline" -ForegroundColor Yellow
"@

Set-Content -Path "scripts/deploy-to-github.ps1" -Value $deployScript

Write-Host "✅ GitHub deployment script created" -ForegroundColor Green

# Create quick start script
Write-Host "⚡ Creating quick start script..." -ForegroundColor Blue

$quickStartScript = @"
# AI Telemedicine Platform - Quick Start Script

Write-Host "⚡ Starting AI Telemedicine Platform..." -ForegroundColor Green

# Check if Docker is installed
if (!(Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Docker is not installed. Please install Docker Desktop first." -ForegroundColor Red
    Write-Host "Download from: https://www.docker.com/products/docker-desktop" -ForegroundColor Yellow
    exit 1
}

# Check if Docker Compose is available
if (!(Get-Command docker-compose -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Docker Compose is not available. Please install Docker Desktop." -ForegroundColor Red
    exit 1
}

# Start the application
Write-Host "🚀 Starting AI Telemedicine Platform with Docker Compose..." -ForegroundColor Blue
docker-compose up -d

# Wait for services to start
Write-Host "⏳ Waiting for services to start..." -ForegroundColor Blue
Start-Sleep -Seconds 30

# Check service status
Write-Host "🔍 Checking service status..." -ForegroundColor Blue

# Check frontend
try {
    `$frontendResponse = Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 10
    if (`$frontendResponse.StatusCode -eq 200) {
        Write-Host "✅ Frontend is running at http://localhost:3000" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠️  Frontend may still be starting..." -ForegroundColor Yellow
}

# Check AI backend
try {
    `$aiResponse = Invoke-WebRequest -Uri "http://localhost:8000/health" -TimeoutSec 10
    if (`$aiResponse.StatusCode -eq 200) {
        Write-Host "✅ AI Backend is running at http://localhost:8000" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠️  AI Backend may still be starting..." -ForegroundColor Yellow
}

# Check main backend
try {
    `$backendResponse = Invoke-WebRequest -Uri "http://localhost:8080/api/health" -TimeoutSec 10
    if (`$backendResponse.StatusCode -eq 200) {
        Write-Host "✅ Main Backend is running at http://localhost:8080" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠️  Main Backend may still be starting..." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🎉 AI Telemedicine Platform is starting!" -ForegroundColor Green
Write-Host ""
Write-Host "📱 Access Points:" -ForegroundColor Blue
Write-Host "   🌐 Web Application: http://localhost:3000" -ForegroundColor Cyan
Write-Host "   🔧 API Documentation: http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host "   📊 Monitoring: http://localhost:3001" -ForegroundColor Cyan
Write-Host ""
Write-Host "🔑 Default Login:" -ForegroundColor Blue
Write-Host "   👤 Username: admin" -ForegroundColor Cyan
Write-Host "   🔒 Password: admin123" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 Useful Commands:" -ForegroundColor Blue
Write-Host "   📊 View logs: docker-compose logs -f" -ForegroundColor Cyan
Write-Host "   🛑 Stop services: docker-compose down" -ForegroundColor Cyan
Write-Host "   🔄 Restart services: docker-compose restart" -ForegroundColor Cyan
Write-Host "   🧹 Clean up: docker-compose down -v" -ForegroundColor Cyan
Write-Host ""
Write-Host "📖 Documentation:" -ForegroundColor Blue
Write-Host "   📋 API Keys Guide: API_KEYS_GUIDE.md" -ForegroundColor Cyan
Write-Host "   🚀 Deployment Guide: DEPLOYMENT_SUMMARY.md" -ForegroundColor Cyan
Write-Host "   🌍 Multi-Platform Guide: MULTI_PLATFORM_DEPLOYMENT.md" -ForegroundColor Cyan
Write-Host ""
Write-Host "🎯 Next Steps:" -ForegroundColor Blue
Write-Host "   1. Open http://localhost:3000 in your browser" -ForegroundColor Yellow
Write-Host "   2. Log in with admin/admin123" -ForegroundColor Yellow
Write-Host "   3. Explore the AI features" -ForegroundColor Yellow
Write-Host "   4. Get API keys for full functionality" -ForegroundColor Yellow
Write-Host "   5. Deploy to GitHub and production" -ForegroundColor Yellow
"@

Set-Content -Path "scripts/quick-start.ps1" -Value $quickStartScript

Write-Host "✅ Quick start script created" -ForegroundColor Green

# Display summary
Write-Host ""
Write-Host "🎉 COMPLETE SETUP SUMMARY" -ForegroundColor Green
Write-Host "=========================" -ForegroundColor Green
Write-Host ""
Write-Host "✅ Generated Security Keys:" -ForegroundColor Blue
Write-Host "   🔐 JWT Secret: Generated" -ForegroundColor Cyan
Write-Host "   🔑 Encryption Key: Generated" -ForegroundColor Cyan
Write-Host "   🗄️  Database Passwords: Generated" -ForegroundColor Cyan
Write-Host "   📊 Monitoring Passwords: Generated" -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ Created Configuration Files:" -ForegroundColor Blue
Write-Host "   📄 .env - Environment configuration" -ForegroundColor Cyan
Write-Host "   📋 API_KEYS_GUIDE.md - API keys guide" -ForegroundColor Cyan
Write-Host "   🚀 scripts/deploy-to-github.ps1 - GitHub deployment" -ForegroundColor Cyan
Write-Host "   ⚡ scripts/quick-start.ps1 - Quick start script" -ForegroundColor Cyan
Write-Host ""
Write-Host "🎯 Ready for Deployment:" -ForegroundColor Blue
Write-Host "   1. Run: .\scripts\quick-start.ps1" -ForegroundColor Yellow
Write-Host "   2. Create GitHub repository" -ForegroundColor Yellow
Write-Host "   3. Run: .\scripts\deploy-to-github.ps1" -ForegroundColor Yellow
Write-Host "   4. Get API keys (optional)" -ForegroundColor Yellow
Write-Host ""
Write-Host "🌐 Your AI Telemedicine Platform is ready!" -ForegroundColor Green 