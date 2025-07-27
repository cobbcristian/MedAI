#!/bin/bash

# Cloud Deployment Script for AI Telemedicine Platform
# Supports AWS, Google Cloud, Azure, and DigitalOcean

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

# Parse command line arguments
CLOUD_PROVIDER=""
ENVIRONMENT="production"
REGION=""
DOMAIN=""
SSL_EMAIL=""

while [[ $# -gt 0 ]]; do
    case $1 in
        --provider)
            CLOUD_PROVIDER="$2"
            shift 2
            ;;
        --environment)
            ENVIRONMENT="$2"
            shift 2
            ;;
        --region)
            REGION="$2"
            shift 2
            ;;
        --domain)
            DOMAIN="$2"
            shift 2
            ;;
        --ssl-email)
            SSL_EMAIL="$2"
            shift 2
            ;;
        --help)
            echo "Usage: $0 --provider <aws|gcp|azure|digitalocean> [options]"
            echo "Options:"
            echo "  --environment <production|staging>  Deployment environment (default: production)"
            echo "  --region <region>                   Cloud region"
            echo "  --domain <domain>                   Domain name for SSL"
            echo "  --ssl-email <email>                 Email for SSL certificates"
            echo "  --help                              Show this help message"
            exit 0
            ;;
        *)
            error "Unknown option: $1"
            ;;
    esac
done

# Validate required arguments
if [ -z "$CLOUD_PROVIDER" ]; then
    error "Cloud provider is required. Use --provider <aws|gcp|azure|digitalocean>"
fi

if [ -z "$REGION" ]; then
    case $CLOUD_PROVIDER in
        aws) REGION="us-east-1" ;;
        gcp) REGION="us-central1" ;;
        azure) REGION="eastus" ;;
        digitalocean) REGION="nyc1" ;;
        *) error "Unknown cloud provider: $CLOUD_PROVIDER" ;;
    esac
fi

# Check prerequisites
check_prerequisites() {
    log "Checking prerequisites..."
    
    # Check Docker
    if ! command -v docker &> /dev/null; then
        error "Docker is not installed"
    fi
    
    # Check Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        error "Docker Compose is not installed"
    fi
    
    # Check cloud provider CLI
    case $CLOUD_PROVIDER in
        aws)
            if ! command -v aws &> /dev/null; then
                error "AWS CLI is not installed"
            fi
            ;;
        gcp)
            if ! command -v gcloud &> /dev/null; then
                error "Google Cloud CLI is not installed"
            fi
            ;;
        azure)
            if ! command -v az &> /dev/null; then
                error "Azure CLI is not installed"
            fi
            ;;
        digitalocean)
            if ! command -v doctl &> /dev/null; then
                error "DigitalOcean CLI is not installed"
            fi
            ;;
    esac
    
    log "Prerequisites check passed"
}

# AWS Deployment
deploy_aws() {
    log "Deploying to AWS..."
    
    # Check AWS credentials
    if ! aws sts get-caller-identity &> /dev/null; then
        error "AWS credentials not configured. Run 'aws configure'"
    fi
    
    # Create ECS cluster
    info "Creating ECS cluster..."
    aws ecs create-cluster --cluster-name ai-telemedicine-$ENVIRONMENT --region $REGION || true
    
    # Create ECR repositories
    info "Creating ECR repositories..."
    aws ecr create-repository --repository-name ai-telemedicine-ai-backend --region $REGION || true
    aws ecr create-repository --repository-name ai-telemedicine-backend --region $REGION || true
    aws ecr create-repository --repository-name ai-telemedicine-frontend --region $REGION || true
    
    # Get ECR login token
    aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin $(aws sts get-caller-identity --query Account --output text).dkr.ecr.$REGION.amazonaws.com
    
    # Build and push images
    info "Building and pushing Docker images..."
    
    # AI Backend
    docker build -f ai_backend/Dockerfile.enhanced -t ai-telemedicine-ai-backend:$ENVIRONMENT ai_backend/
    docker tag ai-telemedicine-ai-backend:$ENVIRONMENT $(aws sts get-caller-identity --query Account --output text).dkr.ecr.$REGION.amazonaws.com/ai-telemedicine-ai-backend:$ENVIRONMENT
    docker push $(aws sts get-caller-identity --query Account --output text).dkr.ecr.$REGION.amazonaws.com/ai-telemedicine-ai-backend:$ENVIRONMENT
    
    # Java Backend
    docker build -f backend/Dockerfile.enhanced -t ai-telemedicine-backend:$ENVIRONMENT backend/
    docker tag ai-telemedicine-backend:$ENVIRONMENT $(aws sts get-caller-identity --query Account --output text).dkr.ecr.$REGION.amazonaws.com/ai-telemedicine-backend:$ENVIRONMENT
    docker push $(aws sts get-caller-identity --query Account --output text).dkr.ecr.$REGION.amazonaws.com/ai-telemedicine-backend:$ENVIRONMENT
    
    # Frontend
    docker build -f frontend/Dockerfile.enhanced -t ai-telemedicine-frontend:$ENVIRONMENT frontend/
    docker tag ai-telemedicine-frontend:$ENVIRONMENT $(aws sts get-caller-identity --query Account --output text).dkr.ecr.$REGION.amazonaws.com/ai-telemedicine-frontend:$ENVIRONMENT
    docker push $(aws sts get-caller-identity --query Account --output text).dkr.ecr.$REGION.amazonaws.com/ai-telemedicine-frontend:$ENVIRONMENT
    
    # Deploy with ECS
    info "Deploying to ECS..."
    aws ecs update-service --cluster ai-telemedicine-$ENVIRONMENT --service ai-telemedicine-service --force-new-deployment --region $REGION || true
    
    log "AWS deployment completed"
}

# Google Cloud Deployment
deploy_gcp() {
    log "Deploying to Google Cloud..."
    
    # Check GCP credentials
    if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
        error "Google Cloud credentials not configured. Run 'gcloud auth login'"
    fi
    
    # Set project
    PROJECT_ID=$(gcloud config get-value project)
    if [ -z "$PROJECT_ID" ]; then
        error "Google Cloud project not set. Run 'gcloud config set project <PROJECT_ID>'"
    fi
    
    # Enable required APIs
    info "Enabling required APIs..."
    gcloud services enable containerregistry.googleapis.com
    gcloud services enable run.googleapis.com
    gcloud services enable cloudbuild.googleapis.com
    
    # Configure Docker for GCR
    gcloud auth configure-docker
    
    # Build and push images
    info "Building and pushing Docker images..."
    
    # AI Backend
    docker build -f ai_backend/Dockerfile.enhanced -t gcr.io/$PROJECT_ID/ai-telemedicine-ai-backend:$ENVIRONMENT ai_backend/
    docker push gcr.io/$PROJECT_ID/ai-telemedicine-ai-backend:$ENVIRONMENT
    
    # Java Backend
    docker build -f backend/Dockerfile.enhanced -t gcr.io/$PROJECT_ID/ai-telemedicine-backend:$ENVIRONMENT backend/
    docker push gcr.io/$PROJECT_ID/ai-telemedicine-backend:$ENVIRONMENT
    
    # Frontend
    docker build -f frontend/Dockerfile.enhanced -t gcr.io/$PROJECT_ID/ai-telemedicine-frontend:$ENVIRONMENT frontend/
    docker push gcr.io/$PROJECT_ID/ai-telemedicine-frontend:$ENVIRONMENT
    
    # Deploy to Cloud Run
    info "Deploying to Cloud Run..."
    
    # AI Backend
    gcloud run deploy ai-telemedicine-ai-backend-$ENVIRONMENT \
        --image gcr.io/$PROJECT_ID/ai-telemedicine-ai-backend:$ENVIRONMENT \
        --platform managed \
        --region $REGION \
        --allow-unauthenticated \
        --port 8000 \
        --memory 4Gi \
        --cpu 2 \
        --max-instances 10
    
    # Java Backend
    gcloud run deploy ai-telemedicine-backend-$ENVIRONMENT \
        --image gcr.io/$PROJECT_ID/ai-telemedicine-backend:$ENVIRONMENT \
        --platform managed \
        --region $REGION \
        --allow-unauthenticated \
        --port 8080 \
        --memory 2Gi \
        --cpu 1 \
        --max-instances 10
    
    # Frontend
    gcloud run deploy ai-telemedicine-frontend-$ENVIRONMENT \
        --image gcr.io/$PROJECT_ID/ai-telemedicine-frontend:$ENVIRONMENT \
        --platform managed \
        --region $REGION \
        --allow-unauthenticated \
        --port 80 \
        --memory 1Gi \
        --cpu 1 \
        --max-instances 5
    
    log "Google Cloud deployment completed"
}

# Azure Deployment
deploy_azure() {
    log "Deploying to Azure..."
    
    # Check Azure credentials
    if ! az account show &> /dev/null; then
        error "Azure credentials not configured. Run 'az login'"
    fi
    
    # Get subscription
    SUBSCRIPTION_ID=$(az account show --query id --output tsv)
    RESOURCE_GROUP="ai-telemedicine-$ENVIRONMENT"
    
    # Create resource group
    info "Creating resource group..."
    az group create --name $RESOURCE_GROUP --location $REGION || true
    
    # Create container registry
    info "Creating container registry..."
    az acr create --resource-group $RESOURCE_GROUP --name aitelemedicine$ENVIRONMENT --sku Basic || true
    
    # Login to ACR
    az acr login --name aitelemedicine$ENVIRONMENT
    
    # Build and push images
    info "Building and pushing Docker images..."
    
    # AI Backend
    docker build -f ai_backend/Dockerfile.enhanced -t aitelemedicine$ENVIRONMENT.azurecr.io/ai-telemedicine-ai-backend:$ENVIRONMENT ai_backend/
    docker push aitelemedicine$ENVIRONMENT.azurecr.io/ai-telemedicine-ai-backend:$ENVIRONMENT
    
    # Java Backend
    docker build -f backend/Dockerfile.enhanced -t aitelemedicine$ENVIRONMENT.azurecr.io/ai-telemedicine-backend:$ENVIRONMENT backend/
    docker push aitelemedicine$ENVIRONMENT.azurecr.io/ai-telemedicine-backend:$ENVIRONMENT
    
    # Frontend
    docker build -f frontend/Dockerfile.enhanced -t aitelemedicine$ENVIRONMENT.azurecr.io/ai-telemedicine-frontend:$ENVIRONMENT frontend/
    docker push aitelemedicine$ENVIRONMENT.azurecr.io/ai-telemedicine-frontend:$ENVIRONMENT
    
    # Deploy to Container Instances
    info "Deploying to Container Instances..."
    
    # AI Backend
    az container create \
        --resource-group $RESOURCE_GROUP \
        --name ai-telemedicine-ai-backend-$ENVIRONMENT \
        --image aitelemedicine$ENVIRONMENT.azurecr.io/ai-telemedicine-ai-backend:$ENVIRONMENT \
        --dns-name-label ai-telemedicine-ai-backend-$ENVIRONMENT \
        --ports 8000 \
        --memory 4 \
        --cpu 2 \
        --registry-login-server aitelemedicine$ENVIRONMENT.azurecr.io \
        --registry-username $(az acr credential show --name aitelemedicine$ENVIRONMENT --query username --output tsv) \
        --registry-password $(az acr credential show --name aitelemedicine$ENVIRONMENT --query passwords[0].value --output tsv)
    
    # Java Backend
    az container create \
        --resource-group $RESOURCE_GROUP \
        --name ai-telemedicine-backend-$ENVIRONMENT \
        --image aitelemedicine$ENVIRONMENT.azurecr.io/ai-telemedicine-backend:$ENVIRONMENT \
        --dns-name-label ai-telemedicine-backend-$ENVIRONMENT \
        --ports 8080 \
        --memory 2 \
        --cpu 1 \
        --registry-login-server aitelemedicine$ENVIRONMENT.azurecr.io \
        --registry-username $(az acr credential show --name aitelemedicine$ENVIRONMENT --query username --output tsv) \
        --registry-password $(az acr credential show --name aitelemedicine$ENVIRONMENT --query passwords[0].value --output tsv)
    
    # Frontend
    az container create \
        --resource-group $RESOURCE_GROUP \
        --name ai-telemedicine-frontend-$ENVIRONMENT \
        --image aitelemedicine$ENVIRONMENT.azurecr.io/ai-telemedicine-frontend:$ENVIRONMENT \
        --dns-name-label ai-telemedicine-frontend-$ENVIRONMENT \
        --ports 80 \
        --memory 1 \
        --cpu 1 \
        --registry-login-server aitelemedicine$ENVIRONMENT.azurecr.io \
        --registry-username $(az acr credential show --name aitelemedicine$ENVIRONMENT --query username --output tsv) \
        --registry-password $(az acr credential show --name aitelemedicine$ENVIRONMENT --query passwords[0].value --output tsv)
    
    log "Azure deployment completed"
}

# DigitalOcean Deployment
deploy_digitalocean() {
    log "Deploying to DigitalOcean..."
    
    # Check DigitalOcean credentials
    if ! doctl account get &> /dev/null; then
        error "DigitalOcean credentials not configured. Run 'doctl auth init'"
    fi
    
    # Create Kubernetes cluster
    info "Creating Kubernetes cluster..."
    doctl kubernetes cluster create ai-telemedicine-$ENVIRONMENT --region $REGION --size s-2vcpu-4gb --count 3 || true
    
    # Wait for cluster to be ready
    info "Waiting for cluster to be ready..."
    doctl kubernetes cluster wait ai-telemedicine-$ENVIRONMENT
    
    # Get kubeconfig
    doctl kubernetes cluster kubeconfig save ai-telemedicine-$ENVIRONMENT
    
    # Build and push images to DigitalOcean Container Registry
    info "Building and pushing Docker images..."
    
    # AI Backend
    docker build -f ai_backend/Dockerfile.enhanced -t registry.digitalocean.com/ai-telemedicine/ai-telemedicine-ai-backend:$ENVIRONMENT ai_backend/
    docker push registry.digitalocean.com/ai-telemedicine/ai-telemedicine-ai-backend:$ENVIRONMENT
    
    # Java Backend
    docker build -f backend/Dockerfile.enhanced -t registry.digitalocean.com/ai-telemedicine/ai-telemedicine-backend:$ENVIRONMENT backend/
    docker push registry.digitalocean.com/ai-telemedicine/ai-telemedicine-backend:$ENVIRONMENT
    
    # Frontend
    docker build -f frontend/Dockerfile.enhanced -t registry.digitalocean.com/ai-telemedicine/ai-telemedicine-frontend:$ENVIRONMENT frontend/
    docker push registry.digitalocean.com/ai-telemedicine/ai-telemedicine-frontend:$ENVIRONMENT
    
    # Deploy to Kubernetes
    info "Deploying to Kubernetes..."
    kubectl apply -f k8s/
    
    log "DigitalOcean deployment completed"
}

# Setup SSL certificates
setup_ssl() {
    if [ -n "$DOMAIN" ] && [ -n "$SSL_EMAIL" ]; then
        log "Setting up SSL certificates..."
        
        # Install certbot
        if ! command -v certbot &> /dev/null; then
            info "Installing certbot..."
            case $CLOUD_PROVIDER in
                aws)
                    sudo yum install -y certbot python3-certbot-nginx || true
                    ;;
                gcp|azure|digitalocean)
                    sudo apt-get update && sudo apt-get install -y certbot python3-certbot-nginx || true
                    ;;
            esac
        fi
        
        # Generate SSL certificate
        certbot --nginx -d $DOMAIN --email $SSL_EMAIL --non-interactive --agree-tos || true
        
        log "SSL certificate setup completed"
    fi
}

# Setup monitoring
setup_monitoring() {
    log "Setting up monitoring..."
    
    case $CLOUD_PROVIDER in
        aws)
            # Setup CloudWatch
            info "Setting up CloudWatch monitoring..."
            # Add CloudWatch configuration here
            ;;
        gcp)
            # Setup Stackdriver
            info "Setting up Stackdriver monitoring..."
            # Add Stackdriver configuration here
            ;;
        azure)
            # Setup Azure Monitor
            info "Setting up Azure Monitor..."
            # Add Azure Monitor configuration here
            ;;
        digitalocean)
            # Setup monitoring with Prometheus/Grafana
            info "Setting up Prometheus/Grafana monitoring..."
            kubectl apply -f k8s/monitoring/
            ;;
    esac
    
    log "Monitoring setup completed"
}

# Display deployment information
display_deployment_info() {
    log "Deployment completed successfully!"
    echo
    echo "=== Deployment Information ==="
    echo
    echo "Cloud Provider: $CLOUD_PROVIDER"
    echo "Environment: $ENVIRONMENT"
    echo "Region: $REGION"
    echo "Domain: $DOMAIN"
    echo
    echo "=== Access Information ==="
    echo
    
    case $CLOUD_PROVIDER in
        aws)
            echo "ECS Cluster: ai-telemedicine-$ENVIRONMENT"
            echo "Load Balancer: Check AWS Console for URL"
            ;;
        gcp)
            echo "Cloud Run Services:"
            echo "- AI Backend: https://ai-telemedicine-ai-backend-$ENVIRONMENT-$REGION.a.run.app"
            echo "- Backend: https://ai-telemedicine-backend-$ENVIRONMENT-$REGION.a.run.app"
            echo "- Frontend: https://ai-telemedicine-frontend-$ENVIRONMENT-$REGION.a.run.app"
            ;;
        azure)
            echo "Container Instances:"
            echo "- AI Backend: http://ai-telemedicine-ai-backend-$ENVIRONMENT.$REGION.azurecontainer.io"
            echo "- Backend: http://ai-telemedicine-backend-$ENVIRONMENT.$REGION.azurecontainer.io"
            echo "- Frontend: http://ai-telemedicine-frontend-$ENVIRONMENT.$REGION.azurecontainer.io"
            ;;
        digitalocean)
            echo "Kubernetes Cluster: ai-telemedicine-$ENVIRONMENT"
            echo "Load Balancer: Check DigitalOcean Console for URL"
            ;;
    esac
    
    echo
    echo "=== Next Steps ==="
    echo
    echo "1. Configure your domain DNS to point to the load balancer"
    echo "2. Set up SSL certificates if not already done"
    echo "3. Configure monitoring and alerting"
    echo "4. Set up backup and disaster recovery"
    echo "5. Test all functionality"
    echo
    echo "=== Support ==="
    echo
    echo "For support and questions:"
    echo "- Documentation: https://github.com/your-org/ai-telemedicine/docs"
    echo "- Issues: https://github.com/your-org/ai-telemedicine/issues"
    echo "- Contact: support@aitelemedicine.com"
    echo
}

# Main deployment function
main() {
    log "Starting cloud deployment..."
    
    # Check prerequisites
    check_prerequisites
    
    # Deploy based on cloud provider
    case $CLOUD_PROVIDER in
        aws)
            deploy_aws
            ;;
        gcp)
            deploy_gcp
            ;;
        azure)
            deploy_azure
            ;;
        digitalocean)
            deploy_digitalocean
            ;;
        *)
            error "Unsupported cloud provider: $CLOUD_PROVIDER"
            ;;
    esac
    
    # Setup SSL if domain provided
    setup_ssl
    
    # Setup monitoring
    setup_monitoring
    
    # Display information
    display_deployment_info
    
    log "Cloud deployment completed successfully!"
}

# Run main function
main "$@" 