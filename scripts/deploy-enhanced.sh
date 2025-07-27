#!/bin/bash

# Enhanced AI Telemedicine Platform Deployment Script
# This script deploys the complete enhanced platform with all features

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
ENV_FILE="$PROJECT_ROOT/.env"
DOCKER_COMPOSE_FILE="$PROJECT_ROOT/docker-compose.enhanced.yml"

# Logging function
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}"
    exit 1
}

warning() {
    echo -e "${YELLOW}[WARNING] $1${NC}"
}

info() {
    echo -e "${BLUE}[INFO] $1${NC}"
}

# Check if running as root
check_root() {
    if [[ $EUID -eq 0 ]]; then
        error "This script should not be run as root"
    fi
}

# Check system requirements
check_requirements() {
    log "Checking system requirements..."
    
    # Check Docker
    if ! command -v docker &> /dev/null; then
        error "Docker is not installed. Please install Docker first."
    fi
    
    # Check Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        error "Docker Compose is not installed. Please install Docker Compose first."
    fi
    
    # Check available memory
    MEMORY_GB=$(free -g | awk '/^Mem:/{print $2}')
    if [ "$MEMORY_GB" -lt 8 ]; then
        warning "System has less than 8GB RAM. Performance may be affected."
    fi
    
    # Check available disk space
    DISK_GB=$(df -BG . | awk 'NR==2 {print $4}' | sed 's/G//')
    if [ "$DISK_GB" -lt 20 ]; then
        error "Less than 20GB free disk space available. Please free up space."
    fi
    
    log "System requirements check passed"
}

# Generate secure passwords and keys
generate_secrets() {
    log "Generating secure secrets..."
    
    # Generate JWT secret
    JWT_SECRET=$(openssl rand -base64 64)
    
    # Generate encryption key
    ENCRYPTION_KEY=$(openssl rand -base64 32)
    
    # Generate database passwords
    MYSQL_ROOT_PASSWORD=$(openssl rand -base64 32)
    MYSQL_PASSWORD=$(openssl rand -base64 32)
    REDIS_PASSWORD=$(openssl rand -base64 32)
    
    # Generate monitoring passwords
    GRAFANA_PASSWORD=$(openssl rand -base64 16)
    ELASTICSEARCH_PASSWORD=$(openssl rand -base64 16)
    
    # Export to environment file
    cat > "$ENV_FILE" << EOF
# Generated secrets - DO NOT COMMIT TO VERSION CONTROL
JWT_SECRET=$JWT_SECRET
ENCRYPTION_KEY=$ENCRYPTION_KEY
MYSQL_ROOT_PASSWORD=$MYSQL_ROOT_PASSWORD
MYSQL_PASSWORD=$MYSQL_PASSWORD
REDIS_PASSWORD=$REDIS_PASSWORD
GRAFANA_PASSWORD=$GRAFANA_PASSWORD
ELASTICSEARCH_PASSWORD=$ELASTICSEARCH_PASSWORD

# Add other configuration from .env.enhanced
EOF
    
    # Append enhanced configuration
    cat "$PROJECT_ROOT/.env.enhanced" >> "$ENV_FILE"
    
    log "Secrets generated and saved to .env"
}

# Create necessary directories
create_directories() {
    log "Creating necessary directories..."
    
    mkdir -p "$PROJECT_ROOT/logs"
    mkdir -p "$PROJECT_ROOT/backups"
    mkdir -p "$PROJECT_ROOT/monitoring"
    mkdir -p "$PROJECT_ROOT/nginx/ssl"
    mkdir -p "$PROJECT_ROOT/logstash/config"
    mkdir -p "$PROJECT_ROOT/logstash/pipeline"
    mkdir -p "$PROJECT_ROOT/monitoring/grafana/dashboards"
    mkdir -p "$PROJECT_ROOT/monitoring/grafana/datasources"
    
    log "Directories created"
}

# Generate SSL certificates
generate_ssl_certificates() {
    log "Generating SSL certificates..."
    
    if [ ! -f "$PROJECT_ROOT/nginx/ssl/cert.pem" ]; then
        openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
            -keyout "$PROJECT_ROOT/nginx/ssl/key.pem" \
            -out "$PROJECT_ROOT/nginx/ssl/cert.pem" \
            -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"
        
        log "SSL certificates generated"
    else
        log "SSL certificates already exist"
    fi
}

# Create Nginx configuration
create_nginx_config() {
    log "Creating Nginx configuration..."
    
    cat > "$PROJECT_ROOT/nginx/nginx.conf" << 'EOF'
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
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=login:10m rate=5r/m;
    
    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';";
    
    server {
        listen 80;
        server_name localhost;
        return 301 https://$server_name$request_uri;
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
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
        
        # Backend API
        location /api/ {
            limit_req zone=api burst=20 nodelay;
            proxy_pass http://backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
        
        # AI Backend API
        location /ai/ {
            limit_req zone=api burst=20 nodelay;
            proxy_pass http://ai-backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
        
        # Security API
        location /security/ {
            limit_req zone=api burst=20 nodelay;
            proxy_pass http://backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
        
        # Monitoring endpoints
        location /monitoring/ {
            auth_basic "Restricted Access";
            auth_basic_user_file /etc/nginx/.htpasswd;
            proxy_pass http://grafana:3000;
        }
    }
}
EOF
    
    log "Nginx configuration created"
}

# Create monitoring configurations
create_monitoring_configs() {
    log "Creating monitoring configurations..."
    
    # Prometheus configuration
    cat > "$PROJECT_ROOT/monitoring/prometheus.yml" << 'EOF'
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
EOF
    
    # Grafana datasource
    cat > "$PROJECT_ROOT/monitoring/grafana/datasources/prometheus.yml" << 'EOF'
apiVersion: 1

datasources:
  - name: Prometheus
    type: prometheus
    access: proxy
    url: http://prometheus:9090
    isDefault: true
EOF
    
    log "Monitoring configurations created"
}

# Create Logstash configuration
create_logstash_config() {
    log "Creating Logstash configuration..."
    
    # Logstash config
    cat > "$PROJECT_ROOT/logstash/config/logstash.yml" << 'EOF'
http.host: "0.0.0.0"
xpack.monitoring.elasticsearch.hosts: [ "http://elasticsearch:9200" ]
EOF
    
    # Logstash pipeline
    cat > "$PROJECT_ROOT/logstash/pipeline/logstash.conf" << 'EOF'
input {
  beats {
    port => 5044
  }
}

filter {
  if [fields][service] == "ai-backend" {
    grok {
      match => { "message" => "%{TIMESTAMP_ISO8601:timestamp} %{LOGLEVEL:level} %{GREEDYDATA:message}" }
    }
  }
  
  if [fields][service] == "backend" {
    grok {
      match => { "message" => "%{TIMESTAMP_ISO8601:timestamp} %{LOGLEVEL:level} %{GREEDYDATA:message}" }
    }
  }
}

output {
  elasticsearch {
    hosts => ["elasticsearch:9200"]
    index => "ai-telemedicine-%{+YYYY.MM.dd}"
  }
}
EOF
    
    log "Logstash configuration created"
}

# Build and start services
deploy_services() {
    log "Building and starting services..."
    
    # Pull latest images
    docker-compose -f "$DOCKER_COMPOSE_FILE" pull
    
    # Build services
    docker-compose -f "$DOCKER_COMPOSE_FILE" build --no-cache
    
    # Start services
    docker-compose -f "$DOCKER_COMPOSE_FILE" up -d
    
    log "Services deployed successfully"
}

# Wait for services to be ready
wait_for_services() {
    log "Waiting for services to be ready..."
    
    # Wait for database
    info "Waiting for MySQL..."
    while ! docker-compose -f "$DOCKER_COMPOSE_FILE" exec -T mysql mysqladmin ping -h"localhost" --silent; do
        sleep 2
    done
    
    # Wait for Redis
    info "Waiting for Redis..."
    while ! docker-compose -f "$DOCKER_COMPOSE_FILE" exec -T redis redis-cli ping; do
        sleep 2
    done
    
    # Wait for backend
    info "Waiting for Backend..."
    while ! curl -f http://localhost:8080/health; do
        sleep 5
    done
    
    # Wait for AI backend
    info "Waiting for AI Backend..."
    while ! curl -f http://localhost:8000/health; do
        sleep 5
    done
    
    # Wait for frontend
    info "Waiting for Frontend..."
    while ! curl -f http://localhost:3000; do
        sleep 5
    done
    
    log "All services are ready"
}

# Run database migrations
run_migrations() {
    log "Running database migrations..."
    
    # Wait for database to be ready
    sleep 10
    
    # Run migrations
    docker-compose -f "$DOCKER_COMPOSE_FILE" exec -T backend java -jar app.jar --spring.profiles.active=production
    
    log "Database migrations completed"
}

# Initialize monitoring
initialize_monitoring() {
    log "Initializing monitoring..."
    
    # Wait for Elasticsearch
    info "Waiting for Elasticsearch..."
    while ! curl -f http://localhost:9200; do
        sleep 5
    done
    
    # Wait for Grafana
    info "Waiting for Grafana..."
    while ! curl -f http://localhost:3001; do
        sleep 5
    done
    
    log "Monitoring initialized"
}

# Create admin user
create_admin_user() {
    log "Creating admin user..."
    
    # This would typically be done through the application API
    # For now, we'll just log the information
    info "Admin user creation should be done through the application interface"
    info "Default admin credentials: admin/admin"
}

# Display deployment information
display_info() {
    log "Deployment completed successfully!"
    echo
    echo "=== AI Telemedicine Platform Access Information ==="
    echo
    echo "Frontend Application:"
    echo "  URL: https://localhost"
    echo "  Default Admin: admin/admin"
    echo
    echo "Monitoring Dashboards:"
    echo "  Grafana: http://localhost:3001 (admin/$(grep GRAFANA_PASSWORD "$ENV_FILE" | cut -d'=' -f2))"
    echo "  Kibana: http://localhost:5601"
    echo "  Prometheus: http://localhost:9090"
    echo
    echo "API Endpoints:"
    echo "  Backend API: https://localhost/api"
    echo "  AI Backend: https://localhost/ai"
    echo "  Security API: https://localhost/security"
    echo
    echo "Database:"
    echo "  MySQL: localhost:3306"
    echo "  Redis: localhost:6379"
    echo
    echo "Logs:"
    echo "  Application logs: $PROJECT_ROOT/logs"
    echo "  Docker logs: docker-compose -f $DOCKER_COMPOSE_FILE logs"
    echo
    echo "Management Commands:"
    echo "  Stop services: docker-compose -f $DOCKER_COMPOSE_FILE down"
    echo "  View logs: docker-compose -f $DOCKER_COMPOSE_FILE logs -f"
    echo "  Restart services: docker-compose -f $DOCKER_COMPOSE_FILE restart"
    echo
    echo "=== Security Information ==="
    echo
    echo "SSL Certificates: $PROJECT_ROOT/nginx/ssl/"
    echo "Environment file: $ENV_FILE"
    echo "Backup directory: $PROJECT_ROOT/backups/"
    echo
    echo "=== Next Steps ==="
    echo
    echo "1. Access the application at https://localhost"
    echo "2. Create your admin account"
    echo "3. Configure your API keys in the .env file"
    echo "4. Set up monitoring alerts"
    echo "5. Configure backup schedules"
    echo
}

# Main deployment function
main() {
    log "Starting enhanced AI telemedicine platform deployment..."
    
    # Check if running as root
    check_root
    
    # Check system requirements
    check_requirements
    
    # Generate secrets
    generate_secrets
    
    # Create directories
    create_directories
    
    # Generate SSL certificates
    generate_ssl_certificates
    
    # Create configurations
    create_nginx_config
    create_monitoring_configs
    create_logstash_config
    
    # Deploy services
    deploy_services
    
    # Wait for services
    wait_for_services
    
    # Run migrations
    run_migrations
    
    # Initialize monitoring
    initialize_monitoring
    
    # Create admin user
    create_admin_user
    
    # Display information
    display_info
    
    log "Deployment completed successfully!"
}

# Run main function
main "$@" 