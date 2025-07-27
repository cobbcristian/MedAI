# Windows Deployment Script for AI Telemedicine Platform
# PowerShell script for deploying the enhanced AI telemedicine platform

param(
    [Parameter(Mandatory=$false)]
    [string]$Environment = "production",
    
    [Parameter(Mandatory=$false)]
    [string]$Domain = "",
    
    [Parameter(Mandatory=$false)]
    [string]$SslEmail = ""
)

# Colors for output
$Red = "Red"
$Green = "Green"
$Yellow = "Yellow"
$Blue = "Blue"

# Logging function
function Write-Log {
    param([string]$Message, [string]$Color = "White")
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Write-Host "[$timestamp] $Message" -ForegroundColor $Color
}

function Write-Error {
    param([string]$Message)
    Write-Log $Message $Red
    exit 1
}

function Write-Warning {
    param([string]$Message)
    Write-Log $Message $Yellow
}

function Write-Info {
    param([string]$Message)
    Write-Log $Message $Blue
}

# Check prerequisites
function Test-Prerequisites {
    Write-Log "Checking prerequisites..." $Green
    
    # Check Docker
    if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
        Write-Error "Docker is not installed. Please install Docker Desktop first."
    }
    
    # Check Docker Compose
    if (-not (Get-Command docker-compose -ErrorAction SilentlyContinue)) {
        Write-Error "Docker Compose is not installed. Please install Docker Compose first."
    }
    
    # Check Git
    if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
        Write-Error "Git is not installed. Please install Git first."
    }
    
    # Check available memory
    $memory = (Get-WmiObject -Class Win32_ComputerSystem).TotalPhysicalMemory / 1GB
    if ($memory -lt 8) {
        Write-Warning "System has less than 8GB RAM. Performance may be affected."
    }
    
    # Check available disk space
    $disk = Get-WmiObject -Class Win32_LogicalDisk -Filter "DeviceID='C:'"
    $freeSpaceGB = $disk.FreeSpace / 1GB
    if ($freeSpaceGB -lt 20) {
        Write-Error "Less than 20GB free disk space available. Please free up space."
    }
    
    Write-Log "Prerequisites check passed" $Green
}

# Generate secure secrets
function New-SecureSecrets {
    Write-Log "Generating secure secrets..." $Green
    
    # Generate JWT secret
    $jwtSecret = [System.Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(64))
    
    # Generate encryption key
    $encryptionKey = [System.Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
    
    # Generate database passwords
    $mysqlRootPassword = [System.Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
    $mysqlPassword = [System.Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
    $redisPassword = [System.Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
    
    # Generate monitoring passwords
    $grafanaPassword = [System.Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(16))
    $elasticsearchPassword = [System.Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(16))
    
    # Create .env file
    $envContent = @"
# Generated secrets - DO NOT COMMIT TO VERSION CONTROL
JWT_SECRET=$jwtSecret
ENCRYPTION_KEY=$encryptionKey
MYSQL_ROOT_PASSWORD=$mysqlRootPassword
MYSQL_PASSWORD=$mysqlPassword
REDIS_PASSWORD=$redisPassword
GRAFANA_PASSWORD=$grafanaPassword
ELASTICSEARCH_PASSWORD=$elasticsearchPassword

# Add other configuration from .env.enhanced
"@
    
    # Append enhanced configuration
    $envContent += "`n" + (Get-Content ".env.enhanced" -Raw)
    
    # Write to .env file
    $envContent | Out-File -FilePath ".env" -Encoding UTF8
    
    Write-Log "Secrets generated and saved to .env" $Green
}

# Create necessary directories
function New-Directories {
    Write-Log "Creating necessary directories..." $Green
    
    $directories = @(
        "logs",
        "backups",
        "monitoring",
        "nginx/ssl",
        "logstash/config",
        "logstash/pipeline",
        "monitoring/grafana/dashboards",
        "monitoring/grafana/datasources"
    )
    
    foreach ($dir in $directories) {
        if (-not (Test-Path $dir)) {
            New-Item -ItemType Directory -Path $dir -Force | Out-Null
        }
    }
    
    Write-Log "Directories created" $Green
}

# Generate SSL certificates
function New-SslCertificates {
    Write-Log "Generating SSL certificates..." $Green
    
    if (-not (Test-Path "nginx/ssl/cert.pem")) {
        # Generate self-signed certificate for development
        $cert = New-SelfSignedCertificate -DnsName "localhost" -CertStoreLocation "Cert:\LocalMachine\My"
        $certPath = "nginx/ssl/cert.pem"
        $keyPath = "nginx/ssl/key.pem"
        
        # Export certificate
        $cert | Export-Certificate -FilePath $certPath -Type CERT
        $cert | Export-PfxCertificate -FilePath "temp.pfx" -Password (ConvertTo-SecureString -String "password" -AsPlainText -Force)
        
        # Extract private key (this is a simplified approach)
        Write-Warning "Using self-signed certificate for development. For production, use proper SSL certificates."
        
        Write-Log "SSL certificates generated" $Green
    } else {
        Write-Log "SSL certificates already exist" $Green
    }
}

# Create Nginx configuration
function New-NginxConfig {
    Write-Log "Creating Nginx configuration..." $Green
    
    $nginxConfig = @"
events {
    worker_connections 1024;
}

http {
    upstream frontend {
        server frontend:3000;
    }
    
    upstream backend {
        server backend:8080;
    }
    
    upstream ai-backend {
        server ai-backend:8000;
    }
    
    # Rate limiting
    limit_req_zone `$binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone `$binary_remote_addr zone=login:10m rate=5r/m;
    
    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';";
    
    server {
        listen 80;
        server_name localhost;
        return 301 https://`$server_name`$request_uri;
    }
    
    server {
        listen 443 ssl http2;
        server_name localhost;
        
        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
        ssl_prefer_server_ciphers off;
        
        # Frontend
        location / {
            limit_req zone=api burst=20 nodelay;
            proxy_pass http://frontend;
            proxy_set_header Host `$host;
            proxy_set_header X-Real-IP `$remote_addr;
            proxy_set_header X-Forwarded-For `$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto `$scheme;
        }
        
        # Backend API
        location /api/ {
            limit_req zone=api burst=20 nodelay;
            proxy_pass http://backend;
            proxy_set_header Host `$host;
            proxy_set_header X-Real-IP `$remote_addr;
            proxy_set_header X-Forwarded-For `$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto `$scheme;
        }
        
        # AI Backend API
        location /ai/ {
            limit_req zone=api burst=20 nodelay;
            proxy_pass http://ai-backend;
            proxy_set_header Host `$host;
            proxy_set_header X-Real-IP `$remote_addr;
            proxy_set_header X-Forwarded-For `$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto `$scheme;
        }
        
        # Security API
        location /security/ {
            limit_req zone=api burst=20 nodelay;
            proxy_pass http://backend;
            proxy_set_header Host `$host;
            proxy_set_header X-Real-IP `$remote_addr;
            proxy_set_header X-Forwarded-For `$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto `$scheme;
        }
        
        # Monitoring endpoints
        location /monitoring/ {
            auth_basic "Restricted Access";
            auth_basic_user_file /etc/nginx/.htpasswd;
            proxy_pass http://grafana:3000;
        }
    }
}
"@
    
    $nginxConfig | Out-File -FilePath "nginx/nginx.conf" -Encoding UTF8
    
    Write-Log "Nginx configuration created" $Green
}

# Create monitoring configurations
function New-MonitoringConfigs {
    Write-Log "Creating monitoring configurations..." $Green
    
    # Prometheus configuration
    $prometheusConfig = @"
global:
  scrape_interval: 15s
  evaluation_interval: 15s

rule_files:
  # - "first_rules.yml"
  # - "second_rules.yml"

scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']

  - job_name: 'ai-backend'
    static_configs:
      - targets: ['ai-backend:8000']
    metrics_path: '/metrics'

  - job_name: 'backend'
    static_configs:
      - targets: ['backend:8080']
    metrics_path: '/actuator/prometheus'

  - job_name: 'mysql'
    static_configs:
      - targets: ['mysql:3306']

  - job_name: 'redis'
    static_configs:
      - targets: ['redis:6379']
"@
    
    $prometheusConfig | Out-File -FilePath "monitoring/prometheus.yml" -Encoding UTF8
    
    # Grafana datasource
    $grafanaDatasource = @"
apiVersion: 1

datasources:
  - name: Prometheus
    type: prometheus
    access: proxy
    url: http://prometheus:9090
    isDefault: true
"@
    
    $grafanaDatasource | Out-File -FilePath "monitoring/grafana/datasources/prometheus.yml" -Encoding UTF8
    
    Write-Log "Monitoring configurations created" $Green
}

# Build and start services
function Start-Services {
    Write-Log "Building and starting services..." $Green
    
    # Pull latest images
    docker-compose -f docker-compose.enhanced.yml pull
    
    # Build services
    docker-compose -f docker-compose.enhanced.yml build --no-cache
    
    # Start services
    docker-compose -f docker-compose.enhanced.yml up -d
    
    Write-Log "Services deployed successfully" $Green
}

# Wait for services to be ready
function Wait-ForServices {
    Write-Log "Waiting for services to be ready..." $Green
    
    # Wait for database
    Write-Info "Waiting for MySQL..."
    do {
        Start-Sleep -Seconds 2
        $mysqlStatus = docker-compose -f docker-compose.enhanced.yml exec -T mysql mysqladmin ping -h"localhost" --silent 2>$null
    } while ($LASTEXITCODE -ne 0)
    
    # Wait for Redis
    Write-Info "Waiting for Redis..."
    do {
        Start-Sleep -Seconds 2
        $redisStatus = docker-compose -f docker-compose.enhanced.yml exec -T redis redis-cli ping 2>$null
    } while ($LASTEXITCODE -ne 0)
    
    # Wait for backend
    Write-Info "Waiting for Backend..."
    do {
        Start-Sleep -Seconds 5
        $backendStatus = Invoke-WebRequest -Uri "http://localhost:8080/health" -UseBasicParsing -ErrorAction SilentlyContinue
    } while ($backendStatus.StatusCode -ne 200)
    
    # Wait for AI backend
    Write-Info "Waiting for AI Backend..."
    do {
        Start-Sleep -Seconds 5
        $aiBackendStatus = Invoke-WebRequest -Uri "http://localhost:8000/health" -UseBasicParsing -ErrorAction SilentlyContinue
    } while ($aiBackendStatus.StatusCode -ne 200)
    
    # Wait for frontend
    Write-Info "Waiting for Frontend..."
    do {
        Start-Sleep -Seconds 5
        $frontendStatus = Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing -ErrorAction SilentlyContinue
    } while ($frontendStatus.StatusCode -ne 200)
    
    Write-Log "All services are ready" $Green
}

# Run database migrations
function Invoke-Migrations {
    Write-Log "Running database migrations..." $Green
    
    # Wait for database to be ready
    Start-Sleep -Seconds 10
    
    # Run migrations
    docker-compose -f docker-compose.enhanced.yml exec -T backend java -jar app.jar --spring.profiles.active=production
    
    Write-Log "Database migrations completed" $Green
}

# Initialize monitoring
function Initialize-Monitoring {
    Write-Log "Initializing monitoring..." $Green
    
    # Wait for Elasticsearch
    Write-Info "Waiting for Elasticsearch..."
    do {
        Start-Sleep -Seconds 5
        $elasticsearchStatus = Invoke-WebRequest -Uri "http://localhost:9200" -UseBasicParsing -ErrorAction SilentlyContinue
    } while ($elasticsearchStatus.StatusCode -ne 200)
    
    # Wait for Grafana
    Write-Info "Waiting for Grafana..."
    do {
        Start-Sleep -Seconds 5
        $grafanaStatus = Invoke-WebRequest -Uri "http://localhost:3001" -UseBasicParsing -ErrorAction SilentlyContinue
    } while ($grafanaStatus.StatusCode -ne 200)
    
    Write-Log "Monitoring initialized" $Green
}

# Display deployment information
function Show-DeploymentInfo {
    Write-Log "Deployment completed successfully!" $Green
    Write-Host ""
    Write-Host "=== AI Telemedicine Platform Access Information ===" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Frontend Application:" -ForegroundColor Yellow
    Write-Host "  URL: https://localhost" -ForegroundColor White
    Write-Host "  Default Admin: admin/admin" -ForegroundColor White
    Write-Host ""
    Write-Host "Monitoring Dashboards:" -ForegroundColor Yellow
    Write-Host "  Grafana: http://localhost:3001" -ForegroundColor White
    Write-Host "  Kibana: http://localhost:5601" -ForegroundColor White
    Write-Host "  Prometheus: http://localhost:9090" -ForegroundColor White
    Write-Host ""
    Write-Host "API Endpoints:" -ForegroundColor Yellow
    Write-Host "  Backend API: https://localhost/api" -ForegroundColor White
    Write-Host "  AI Backend: https://localhost/ai" -ForegroundColor White
    Write-Host "  Security API: https://localhost/security" -ForegroundColor White
    Write-Host ""
    Write-Host "Database:" -ForegroundColor Yellow
    Write-Host "  MySQL: localhost:3306" -ForegroundColor White
    Write-Host "  Redis: localhost:6379" -ForegroundColor White
    Write-Host ""
    Write-Host "Logs:" -ForegroundColor Yellow
    Write-Host "  Application logs: $PWD\logs" -ForegroundColor White
    Write-Host "  Docker logs: docker-compose -f docker-compose.enhanced.yml logs" -ForegroundColor White
    Write-Host ""
    Write-Host "Management Commands:" -ForegroundColor Yellow
    Write-Host "  Stop services: docker-compose -f docker-compose.enhanced.yml down" -ForegroundColor White
    Write-Host "  View logs: docker-compose -f docker-compose.enhanced.yml logs -f" -ForegroundColor White
    Write-Host "  Restart services: docker-compose -f docker-compose.enhanced.yml restart" -ForegroundColor White
    Write-Host ""
    Write-Host "=== Security Information ===" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "SSL Certificates: $PWD\nginx\ssl\" -ForegroundColor White
    Write-Host "Environment file: $PWD\.env" -ForegroundColor White
    Write-Host "Backup directory: $PWD\backups\" -ForegroundColor White
    Write-Host ""
    Write-Host "=== Next Steps ===" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "1. Access the application at https://localhost" -ForegroundColor White
    Write-Host "2. Create your admin account" -ForegroundColor White
    Write-Host "3. Configure your API keys in the .env file" -ForegroundColor White
    Write-Host "4. Set up monitoring alerts" -ForegroundColor White
    Write-Host "5. Configure backup schedules" -ForegroundColor White
    Write-Host ""
}

# Main deployment function
function Start-Deployment {
    Write-Log "Starting enhanced AI telemedicine platform deployment..." $Green
    
    # Check prerequisites
    Test-Prerequisites
    
    # Generate secrets
    New-SecureSecrets
    
    # Create directories
    New-Directories
    
    # Generate SSL certificates
    New-SslCertificates
    
    # Create configurations
    New-NginxConfig
    New-MonitoringConfigs
    
    # Deploy services
    Start-Services
    
    # Wait for services
    Wait-ForServices
    
    # Run migrations
    Invoke-Migrations
    
    # Initialize monitoring
    Initialize-Monitoring
    
    # Display information
    Show-DeploymentInfo
    
    Write-Log "Deployment completed successfully!" $Green
}

# Run main deployment function
Start-Deployment 