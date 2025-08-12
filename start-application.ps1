# MedAI Telemedicine Platform - Quick Start Script
# This script starts the enhanced telemedicine application

Write-Host "🏥 MedAI Telemedicine Platform - Starting..." -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green

# Check if we're in the right directory
if (-not (Test-Path "frontend") -or -not (Test-Path "backend") -or -not (Test-Path "ai_backend")) {
    Write-Host "❌ Error: Please run this script from the project root directory" -ForegroundColor Red
    exit 1
}

# Function to check if a port is available
function Test-Port {
    param($Port)
    try {
        $connection = New-Object System.Net.Sockets.TcpClient
        $connection.Connect("localhost", $Port)
        $connection.Close()
        return $true
    }
    catch {
        return $false
    }
}

# Function to wait for a service to be ready
function Wait-ForService {
    param($Url, $ServiceName, $Timeout = 60)
    Write-Host "⏳ Waiting for $ServiceName to be ready..." -ForegroundColor Yellow
    $startTime = Get-Date
    while ((Get-Date) -lt $startTime.AddSeconds($Timeout)) {
        try {
            $response = Invoke-WebRequest -Uri $Url -Method Get -TimeoutSec 5 -UseBasicParsing
            if ($response.StatusCode -eq 200) {
                Write-Host "✅ $ServiceName is ready!" -ForegroundColor Green
                return $true
            }
        }
        catch {
            Start-Sleep -Seconds 2
        }
    }
    Write-Host "❌ $ServiceName failed to start within $Timeout seconds" -ForegroundColor Red
    return $false
}

# Start AI Backend
Write-Host "🤖 Starting AI Backend..." -ForegroundColor Cyan
Set-Location "ai_backend"

# Check if virtual environment exists
if (-not (Test-Path "venv")) {
    Write-Host "📦 Creating Python virtual environment..." -ForegroundColor Yellow
    python -m venv venv
}

# Activate virtual environment and start AI backend
$aiBackendJob = Start-Job -ScriptBlock {
    Set-Location $using:PWD
    & ".\venv\Scripts\Activate.ps1"
    python main.py
}

Set-Location ".."

# Start Java Backend
Write-Host "🔧 Starting Java Backend..." -ForegroundColor Cyan
Set-Location "backend"

$backendJob = Start-Job -ScriptBlock {
    Set-Location $using:PWD
    ./mvnw spring-boot:run
}

Set-Location ".."

# Start Frontend
Write-Host "📱 Starting React Frontend..." -ForegroundColor Cyan
Set-Location "frontend"

# Set environment variables
$env:REACT_APP_API_URL = "http://localhost:8080"
$env:REACT_APP_AI_BACKEND_URL = "http://localhost:8000"
$env:REACT_APP_ENVIRONMENT = "development"

$frontendJob = Start-Job -ScriptBlock {
    Set-Location $using:PWD
    $env:REACT_APP_API_URL = "http://localhost:8080"
    $env:REACT_APP_AI_BACKEND_URL = "http://localhost:8000"
    $env:REACT_APP_ENVIRONMENT = "development"
    npm start
}

Set-Location ".."

# Wait for services to be ready
Write-Host "⏳ Waiting for services to start..." -ForegroundColor Yellow

# Wait for AI Backend
if (Wait-ForService "http://localhost:8000/health" "AI Backend" 30) {
    Write-Host "✅ AI Backend is running on http://localhost:8000" -ForegroundColor Green
} else {
    Write-Host "⚠️  AI Backend may not be fully ready" -ForegroundColor Yellow
}

# Wait for Java Backend
if (Wait-ForService "http://localhost:8080/actuator/health" "Java Backend" 45) {
    Write-Host "✅ Java Backend is running on http://localhost:8080" -ForegroundColor Green
} else {
    Write-Host "⚠️  Java Backend may not be fully ready" -ForegroundColor Yellow
}

# Wait for Frontend
Start-Sleep -Seconds 10
Write-Host "✅ Frontend is starting on http://localhost:3000" -ForegroundColor Green

# Show application status
Write-Host ""
Write-Host "🎉 MedAI Telemedicine Platform is starting up!" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green
Write-Host ""
Write-Host "📱 Frontend:     http://localhost:3000" -ForegroundColor Cyan
Write-Host "🔧 Backend:      http://localhost:8080" -ForegroundColor Cyan
Write-Host "🤖 AI Backend:   http://localhost:8000" -ForegroundColor Cyan
Write-Host ""
Write-Host "🔑 Default Login:" -ForegroundColor Yellow
Write-Host "   Username: admin@medai.com" -ForegroundColor White
Write-Host "   Password: admin123" -ForegroundColor White
Write-Host ""
Write-Host "📋 Enhanced Features:" -ForegroundColor Yellow
Write-Host "   ✅ AI-Powered Medical Scan Analysis" -ForegroundColor White
Write-Host "   ✅ Enhanced Video Calls with WebRTC" -ForegroundColor White
Write-Host "   ✅ Comprehensive Patient Dashboard" -ForegroundColor White
    Write-Host "   ✅ Doctor Copilot and Clinical Decision Support" -ForegroundColor White
    Write-Host "   ✅ Security and HIPAA Compliance" -ForegroundColor White
    Write-Host "   ✅ Real-time Health Monitoring" -ForegroundColor White
    Write-Host ""
    Write-Host "🛑 To stop the application, press Ctrl+C" -ForegroundColor Red
Write-Host ""

# Function to cleanup on exit
function Cleanup {
    Write-Host ""
    Write-Host "🛑 Stopping MedAI Telemedicine Platform..." -ForegroundColor Yellow
    
    # Stop all background jobs
    Get-Job | Stop-Job
    Get-Job | Remove-Job
    
    Write-Host "✅ Application stopped successfully!" -ForegroundColor Green
}

# Register cleanup function to run on script exit
Register-EngineEvent PowerShell.Exiting -Action { Cleanup }

# Keep the script running and monitor services
try {
    while ($true) {
        Start-Sleep -Seconds 5
        
        # Check if any service has failed
        $jobs = @($aiBackendJob, $backendJob, $frontendJob)
        foreach ($job in $jobs) {
            if ($job.State -eq "Failed") {
                Write-Host "❌ A service has failed. Check the logs for details." -ForegroundColor Red
                Write-Host "Job: $($job.Name), State: $($job.State)" -ForegroundColor Red
            }
        }
        
        # Show status every 30 seconds
        if ((Get-Date).Second % 30 -eq 0) {
            Write-Host "🔄 Services are running... $(Get-Date -Format 'HH:mm:ss')" -ForegroundColor Gray
        }
    }
} catch {
    Write-Host "Application stopped by user." -ForegroundColor Yellow
} finally {
    Cleanup
}
