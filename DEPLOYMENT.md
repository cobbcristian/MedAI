# AI Telemedicine Platform - Deployment Guide

This guide provides step-by-step instructions for deploying the AI Telemedicine Platform in various environments.

## 🚀 Quick Start with Docker Compose

### Prerequisites
- Docker and Docker Compose installed
- At least 4GB RAM available
- Ports 80, 3000, 8080, 3306 available

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/ai-telemedicine.git
cd ai-telemedicine
```

### 2. Set Environment Variables
Create a `.env` file in the root directory:
```env
# OpenAI API
OPENAI_API_KEY=your_openai_api_key_here

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# Email Configuration
EMAIL_USERNAME=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# JWT Secret (generate a strong secret)
JWT_SECRET=your-super-secret-jwt-key-that-is-at-least-256-bits-long
```

### 3. Start the Platform
```bash
docker-compose up -d
```

### 4. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **API Documentation**: http://localhost:8080/swagger-ui.html
- **Grafana Monitoring**: http://localhost:3001 (admin/admin)

## 🏗️ Manual Deployment

### Backend Deployment (Spring Boot)

#### Prerequisites
- Java 17 or higher
- Maven 3.6 or higher
- MySQL 8.0 or higher

#### Steps
1. **Database Setup**
```sql
CREATE DATABASE telemedicine;
CREATE USER 'telemedicine_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON telemedicine.* TO 'telemedicine_user'@'localhost';
FLUSH PRIVILEGES;
```

2. **Configure Application**
Update `backend/src/main/resources/application.yml`:
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/telemedicine
    username: telemedicine_user
    password: your_password

app:
  openai:
    api-key: your_openai_api_key
  stripe:
    secret-key: your_stripe_secret_key
    publishable-key: your_stripe_publishable_key
  jwt:
    secret: your_jwt_secret_key
```

3. **Build and Run**
```bash
cd backend
mvn clean package
java -jar target/telemedicine-1.0.0.jar
```

### Frontend Deployment (React)

#### Prerequisites
- Node.js 16 or higher
- npm or yarn

#### Steps
1. **Install Dependencies**
```bash
cd frontend
npm install
```

2. **Configure Environment**
Create `.env` file:
```env
REACT_APP_API_URL=http://localhost:8080
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

3. **Build and Run**
```bash
# Development
npm start

# Production
npm run build
npx serve -s build
```

## ☁️ Cloud Deployment

### AWS Deployment

#### Using AWS Elastic Beanstalk

1. **Backend Deployment**
```bash
# Install EB CLI
pip install awsebcli

# Initialize EB application
cd backend
eb init telemedicine-backend --platform java --region us-east-1

# Create environment
eb create telemedicine-prod

# Deploy
eb deploy
```

2. **Frontend Deployment (S3 + CloudFront)**
```bash
# Build frontend
cd frontend
npm run build

# Create S3 bucket
aws s3 mb s3://your-telemedicine-frontend

# Upload files
aws s3 sync build/ s3://your-telemedicine-frontend

# Create CloudFront distribution
aws cloudfront create-distribution --distribution-config file://cloudfront-config.json
```

#### Using AWS ECS

1. **Create ECS Cluster**
```bash
aws ecs create-cluster --cluster-name telemedicine-cluster
```

2. **Deploy with Docker Compose**
```bash
# Install ecs-cli
curl -Lo ecs-cli https://amazon-ecs-cli.s3.amazonaws.com/ecs-cli-linux-amd64-latest

# Configure
ecs-cli configure profile --profile-name telemedicine --access-key YOUR_ACCESS_KEY --secret-key YOUR_SECRET_KEY

# Deploy
ecs-cli compose --project-name telemedicine up
```

### Google Cloud Platform

#### Using Google Cloud Run

1. **Deploy Backend**
```bash
# Build and push image
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/telemedicine-backend

# Deploy to Cloud Run
gcloud run deploy telemedicine-backend \
  --image gcr.io/YOUR_PROJECT_ID/telemedicine-backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

2. **Deploy Frontend**
```bash
# Build and push image
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/telemedicine-frontend

# Deploy to Cloud Run
gcloud run deploy telemedicine-frontend \
  --image gcr.io/YOUR_PROJECT_ID/telemedicine-frontend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

### Azure Deployment

#### Using Azure Container Instances

1. **Deploy Backend**
```bash
# Build and push to Azure Container Registry
az acr build --registry yourregistry --image telemedicine-backend .

# Deploy to Container Instances
az container create \
  --resource-group your-rg \
  --name telemedicine-backend \
  --image yourregistry.azurecr.io/telemedicine-backend \
  --ports 8080
```

## 🔒 Security Configuration

### SSL/TLS Setup

1. **Generate SSL Certificate**
```bash
# Using Let's Encrypt
sudo certbot certonly --standalone -d your-domain.com

# Or self-signed for development
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout private.key -out certificate.crt
```

2. **Configure Nginx**
```nginx
server {
    listen 443 ssl;
    server_name your-domain.com;
    
    ssl_certificate /etc/nginx/ssl/certificate.crt;
    ssl_certificate_key /etc/nginx/ssl/private.key;
    
    location / {
        proxy_pass http://frontend:3000;
    }
    
    location /api {
        proxy_pass http://backend:8080;
    }
}
```

### Environment Variables Security

1. **Use AWS Secrets Manager**
```bash
# Store secrets
aws secretsmanager create-secret \
  --name telemedicine/database \
  --secret-string '{"username":"telemedicine_user","password":"your_password"}'

# Retrieve in application
aws secretsmanager get-secret-value --secret-id telemedicine/database
```

2. **Use Google Secret Manager**
```bash
# Store secrets
echo -n "your_password" | gcloud secrets create db-password --data-file=-

# Access in application
gcloud secrets versions access latest --secret="db-password"
```

## 📊 Monitoring and Logging

### Application Monitoring

1. **Prometheus Configuration**
```yaml
# prometheus.yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'telemedicine-backend'
    static_configs:
      - targets: ['backend:8080']
    metrics_path: '/actuator/prometheus'
```

2. **Grafana Dashboards**
- Import dashboard templates for Spring Boot metrics
- Set up alerts for high error rates
- Monitor response times and throughput

### Logging Setup

1. **ELK Stack Integration**
```yaml
# logstash.conf
input {
  beats {
    port => 5044
  }
}

filter {
  if [fields][service] == "telemedicine-backend" {
    grok {
      match => { "message" => "%{TIMESTAMP_ISO8601:timestamp} %{LOGLEVEL:level} %{GREEDYDATA:message}" }
    }
  }
}

output {
  elasticsearch {
    hosts => ["elasticsearch:9200"]
    index => "telemedicine-%{+YYYY.MM.dd}"
  }
}
```

## 🔄 CI/CD Pipeline

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Test Backend
        run: |
          cd backend
          mvn test
      - name: Test Frontend
        run: |
          cd frontend
          npm test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to AWS
        run: |
          aws ecs update-service --cluster telemedicine-cluster --service telemedicine-service --force-new-deployment
```

### GitLab CI

```yaml
# .gitlab-ci.yml
stages:
  - test
  - build
  - deploy

test:
  stage: test
  script:
    - cd backend && mvn test
    - cd frontend && npm test

build:
  stage: build
  script:
    - docker build -t telemedicine-backend ./backend
    - docker build -t telemedicine-frontend ./frontend

deploy:
  stage: deploy
  script:
    - docker-compose up -d
```

## 🚨 Troubleshooting

### Common Issues

1. **Database Connection Issues**
```bash
# Check MySQL status
docker-compose logs mysql

# Reset database
docker-compose down -v
docker-compose up -d mysql
```

2. **Memory Issues**
```bash
# Increase Docker memory limit
# In Docker Desktop: Settings > Resources > Memory: 4GB
```

3. **Port Conflicts**
```bash
# Check port usage
netstat -tulpn | grep :8080

# Change ports in docker-compose.yml
ports:
  - "8081:8080"  # Use 8081 instead of 8080
```

### Performance Optimization

1. **Database Optimization**
```sql
-- Add indexes for better performance
CREATE INDEX idx_appointments_scheduled ON appointments(scheduled_at);
CREATE INDEX idx_users_email ON users(email);
```

2. **Application Tuning**
```yaml
# application.yml
spring:
  jpa:
    properties:
      hibernate:
        jdbc:
          batch_size: 20
        order_inserts: true
        order_updates: true
```

## 📈 Scaling

### Horizontal Scaling

1. **Load Balancer Setup**
```nginx
upstream backend {
    server backend1:8080;
    server backend2:8080;
    server backend3:8080;
}

server {
    location /api {
        proxy_pass http://backend;
    }
}
```

2. **Database Scaling**
```yaml
# docker-compose.yml
services:
  mysql-master:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
    command: --log-bin=mysql-bin --binlog-format=ROW

  mysql-slave:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
    command: --read-only
```

## 🔐 Security Checklist

- [ ] SSL/TLS certificates configured
- [ ] Environment variables secured
- [ ] Database passwords encrypted
- [ ] JWT secrets rotated regularly
- [ ] API rate limiting implemented
- [ ] CORS properly configured
- [ ] Input validation enabled
- [ ] SQL injection prevention
- [ ] XSS protection enabled
- [ ] Regular security updates

## 📞 Support

For deployment issues:
1. Check the logs: `docker-compose logs`
2. Verify environment variables
3. Ensure all ports are available
4. Check system resources

Contact: support@aitelemedicine.com 