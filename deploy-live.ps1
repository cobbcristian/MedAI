# AI Telemedicine Platform - Live Deployment Script
# This script will help you deploy your application to Railway

Write-Host "🚀 AI Telemedicine Platform - Live Deployment" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green

# Check if Railway CLI is installed
Write-Host "Checking Railway CLI installation..." -ForegroundColor Yellow
try {
    $railwayVersion = railway --version
    Write-Host "✅ Railway CLI is installed: $railwayVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Railway CLI not found. Installing..." -ForegroundColor Red
    Write-Host "Please install Railway CLI from: https://railway.app/cli" -ForegroundColor Yellow
    Write-Host "Or run: npm install -g @railway/cli" -ForegroundColor Yellow
    exit 1
}

# Check if user is logged in to Railway
Write-Host "Checking Railway login status..." -ForegroundColor Yellow
try {
    $userInfo = railway whoami
    Write-Host "✅ Logged in as: $userInfo" -ForegroundColor Green
} catch {
    Write-Host "❌ Not logged in to Railway. Please login first:" -ForegroundColor Red
    Write-Host "railway login" -ForegroundColor Yellow
    exit 1
}

# Create .env file if it doesn't exist
if (-not (Test-Path ".env")) {
    Write-Host "Creating .env file with required environment variables..." -ForegroundColor Yellow
    @"
# OpenAI API Key (Required for AI features)
OPENAI_API_KEY=your_openai_api_key_here

# Stripe Configuration (Required for payments)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# Email Configuration (Required for notifications)
EMAIL_USERNAME=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# JWT Secret (Required for authentication)
JWT_SECRET=your-super-secret-jwt-key-that-is-at-least-256-bits-long

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=telemedicine
DB_USER=telemedicine_user
DB_PASSWORD=telemedicine_password
"@ | Out-File -FilePath ".env" -Encoding UTF8
    
    Write-Host "✅ Created .env file" -ForegroundColor Green
    Write-Host "⚠️  Please update the .env file with your actual API keys before deploying!" -ForegroundColor Red
    Write-Host "   - Get OpenAI API key from: https://platform.openai.com/api-keys" -ForegroundColor Yellow
    Write-Host "   - Get Stripe keys from: https://dashboard.stripe.com/apikeys" -ForegroundColor Yellow
    Write-Host "   - Set up Gmail app password: https://support.google.com/accounts/answer/185833" -ForegroundColor Yellow
}

# Initialize Railway project if not already done
if (-not (Test-Path "railway.json")) {
    Write-Host "Initializing Railway project..." -ForegroundColor Yellow
    railway init
}

# Deploy to Railway
Write-Host "Deploying to Railway..." -ForegroundColor Yellow
railway up

Write-Host "✅ Deployment completed!" -ForegroundColor Green
Write-Host "Your application should be live at: https://your-app-name.railway.app" -ForegroundColor Green
Write-Host "Check the Railway dashboard for the exact URL." -ForegroundColor Yellow

Write-Host "`n📋 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Update your .env file with real API keys" -ForegroundColor White
Write-Host "2. Run this script again to deploy with proper configuration" -ForegroundColor White
Write-Host "3. Set up your custom domain in Railway dashboard" -ForegroundColor White
Write-Host "4. Configure SSL certificates" -ForegroundColor White
