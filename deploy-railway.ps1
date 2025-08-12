# AI Telemedicine Platform - Railway Deployment Script
Write-Host "🚀 Deploying AI Telemedicine Platform to Railway..." -ForegroundColor Green

# Check if Railway CLI is installed
if (!(Get-Command railway -ErrorAction SilentlyContinue)) {
    Write-Host "Installing Railway CLI..." -ForegroundColor Yellow
    npm install -g @railway/cli
}

# Login to Railway
Write-Host "Logging into Railway..." -ForegroundColor Yellow
railway login

# Initialize Railway project
Write-Host "Initializing Railway project..." -ForegroundColor Yellow
railway init

# Deploy to Railway
Write-Host "Deploying to Railway..." -ForegroundColor Yellow
railway up

Write-Host "✅ Deployment complete!" -ForegroundColor Green
Write-Host "Your AI Telemedicine Platform is now live!" -ForegroundColor Green
Write-Host "Check the Railway dashboard for your live URL" -ForegroundColor Cyan 