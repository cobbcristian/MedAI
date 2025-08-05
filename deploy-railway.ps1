# Railway Deployment Script for AI Telemedicine
Write-Host "🚀 Deploying AI Telemedicine to Railway..." -ForegroundColor Green

# Check if Railway CLI is installed
try {
    $railwayVersion = railway --version
    Write-Host "✅ Railway CLI found: $railwayVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Railway CLI not found. Installing..." -ForegroundColor Yellow
    npm install -g @railway/cli
}

# Login to Railway
Write-Host "🔐 Logging into Railway..." -ForegroundColor Blue
railway login

# Initialize project if not already done
if (!(Test-Path ".railway")) {
    Write-Host "📁 Initializing Railway project..." -ForegroundColor Blue
    railway init
}

# Deploy to Railway
Write-Host "🚀 Deploying to Railway..." -ForegroundColor Blue
railway up

Write-Host "✅ Deployment complete!" -ForegroundColor Green
Write-Host "🌐 Your app will be available at: https://your-app-name.railway.app" -ForegroundColor Cyan
Write-Host "📊 API Documentation: https://your-app-name.railway.app/docs" -ForegroundColor Cyan
Write-Host "🏥 Health Check: https://your-app-name.railway.app/health" -ForegroundColor Cyan

Write-Host "`n🎯 Features Available:" -ForegroundColor Yellow
Write-Host "   • Bloodwork Analysis with Cancer Risk Assessment" -ForegroundColor White
Write-Host "   • X-ray AI Analysis with Doctor Notes" -ForegroundColor White
Write-Host "   • Medication Tracking and Life Impact Analysis" -ForegroundColor White
Write-Host "   • Vaccination Records and Missing Vaccines" -ForegroundColor White
Write-Host "   • Surgical Procedure Guides for Doctors" -ForegroundColor White 