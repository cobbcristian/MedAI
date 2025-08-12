# AI Telemedicine Platform - Local Deployment Script
Write-Host "🚀 Starting AI Telemedicine Platform locally..." -ForegroundColor Green

# Check if Docker is running
try {
    docker version | Out-Null
    Write-Host "✅ Docker is running" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker is not running. Please start Docker Desktop first." -ForegroundColor Red
    exit 1
}

# Create .env file if it doesn't exist
if (!(Test-Path ".env")) {
    Write-Host "Creating .env file with default values..." -ForegroundColor Yellow
    @"
# OpenAI API (Optional - platform works without this)
OPENAI_API_KEY=your_openai_api_key_here

# Stripe Configuration (Optional)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# Email Configuration (Optional)
EMAIL_USERNAME=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
"@ | Out-File -FilePath ".env" -Encoding UTF8
}

# Start the platform
Write-Host "Starting AI Telemedicine Platform..." -ForegroundColor Yellow
docker-compose up -d

# Wait for services to start
Write-Host "Waiting for services to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

# Check if services are running
Write-Host "Checking service status..." -ForegroundColor Yellow
docker-compose ps

Write-Host "✅ AI Telemedicine Platform is now running!" -ForegroundColor Green
Write-Host "`n🌐 Access your platform:" -ForegroundColor Cyan
Write-Host "   • Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "   • Backend API: http://localhost:8080" -ForegroundColor White
Write-Host "   • API Documentation: http://localhost:8080/swagger-ui.html" -ForegroundColor White
Write-Host "   • Grafana Monitoring: http://localhost:3001 (admin/admin)" -ForegroundColor White

Write-Host "`n🎯 Features Available:" -ForegroundColor Yellow
Write-Host "   • AI Symptom Analysis" -ForegroundColor White
Write-Host "   • Medical Scan Analysis" -ForegroundColor White
Write-Host "   • Bloodwork Analysis" -ForegroundColor White
Write-Host "   • Recovery Prediction" -ForegroundColor White
Write-Host "   • Real-time Chat" -ForegroundColor White
Write-Host "   • Video Consultations" -ForegroundColor White
Write-Host "   • Payment Integration" -ForegroundColor White

Write-Host "`n🛑 To stop the platform: docker-compose down" -ForegroundColor Yellow 