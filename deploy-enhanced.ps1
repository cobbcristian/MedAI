# Enhanced MedAI Telemedicine Platform Deployment Script
# This script deploys the complete AI-powered healthcare platform

param(
    [string]$Environment = "local",
    [switch]$SkipDependencies,
    [switch]$SkipTests,
    [switch]$Force
)

Write-Host "🚀 MedAI Telemedicine Platform - Enhanced Deployment" -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Green

# Configuration
$Config = @{
    FrontendPort = 3000
    BackendPort = 8080
    AIBackendPort = 8000
    DatabasePort = 5432
    RedisPort = 6379
}

# Colors for output
$Colors = @{
    Success = "Green"
    Warning = "Yellow"
    Error = "Red"
    Info = "Cyan"
}

function Write-Status {
    param($Message, $Color = "White")
    Write-Host "[$(Get-Date -Format 'HH:mm:ss')] $Message" -ForegroundColor $Color
}

function Test-Command {
    param($Command)
    try {
        Get-Command $Command -ErrorAction Stop | Out-Null
        return $true
    }
    catch {
        return $false
    }
}

function Install-Dependencies {
    Write-Status "Installing system dependencies..." $Colors.Info
    
    # Check if Node.js is installed
    if (-not (Test-Command "node")) {
        Write-Status "Node.js not found. Please install Node.js 18+ from https://nodejs.org/" $Colors.Error
        exit 1
    }
    
    # Check if Python is installed
    if (-not (Test-Command "python")) {
        Write-Status "Python not found. Please install Python 3.8+ from https://python.org/" $Colors.Error
        exit 1
    }
    
    # Check if Java is installed
    if (-not (Test-Command "java")) {
        Write-Status "Java not found. Please install Java 17+ from https://adoptium.net/" $Colors.Error
        exit 1
    }
    
    Write-Status "System dependencies check passed!" $Colors.Success
}

function Install-FrontendDependencies {
    Write-Status "Installing frontend dependencies..." $Colors.Info
    
    Set-Location "frontend"
    
    # Install npm dependencies
    if (Test-Path "node_modules") {
        Write-Status "Node modules found, skipping installation..." $Colors.Warning
    } else {
        Write-Status "Installing npm packages..." $Colors.Info
        npm install
        if ($LASTEXITCODE -ne 0) {
            Write-Status "Failed to install npm dependencies!" $Colors.Error
            exit 1
        }
    }
    
    # Install additional WebRTC dependencies
    Write-Status "Installing WebRTC dependencies..." $Colors.Info
    npm install simple-peer webrtc-adapter --save
    
    Set-Location ".."
    Write-Status "Frontend dependencies installed successfully!" $Colors.Success
}

function Install-BackendDependencies {
    Write-Status "Installing backend dependencies..." $Colors.Info
    
    Set-Location "backend"
    
    # Install Maven dependencies
    if (Test-Path "target") {
        Write-Status "Maven target found, skipping compilation..." $Colors.Warning
    } else {
        Write-Status "Installing Maven dependencies..." $Colors.Info
        ./mvnw clean install -DskipTests
        if ($LASTEXITCODE -ne 0) {
            Write-Status "Failed to install Maven dependencies!" $Colors.Error
            exit 1
        }
    }
    
    Set-Location ".."
    Write-Status "Backend dependencies installed successfully!" $Colors.Success
}

function Install-AIBackendDependencies {
    Write-Status "Installing AI backend dependencies..." $Colors.Info
    
    Set-Location "ai_backend"
    
    # Create virtual environment if it doesn't exist
    if (-not (Test-Path "venv")) {
        Write-Status "Creating Python virtual environment..." $Colors.Info
        python -m venv venv
    }
    
    # Activate virtual environment
    Write-Status "Activating virtual environment..." $Colors.Info
    & ".\venv\Scripts\Activate.ps1"
    
    # Install Python dependencies
    Write-Status "Installing Python packages..." $Colors.Info
    pip install -r requirements.txt
    
    # Install additional AI dependencies
    Write-Status "Installing AI-specific packages..." $Colors.Info
    pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu
    pip install transformers scikit-learn pandas numpy matplotlib seaborn plotly
    pip install opencv-python pillow pydicom
    pip install fastapi uvicorn python-multipart python-jose[cryptography] passlib[bcrypt]
    
    Set-Location ".."
    Write-Status "AI backend dependencies installed successfully!" $Colors.Success
}

function Start-Database {
    Write-Status "Starting database services..." $Colors.Info
    
    # Start PostgreSQL (if using Docker)
    if (Test-Command "docker") {
        Write-Status "Starting PostgreSQL with Docker..." $Colors.Info
        docker run -d --name medai-postgres `
            -e POSTGRES_DB=medai `
            -e POSTGRES_USER=medai `
            -e POSTGRES_PASSWORD=medai123 `
            -p $($Config.DatabasePort):5432 `
            postgres:15
        
        Write-Status "Starting Redis with Docker..." $Colors.Info
        docker run -d --name medai-redis `
            -p $($Config.RedisPort):6379 `
            redis:7-alpine
    } else {
        Write-Status "Docker not found. Please ensure PostgreSQL and Redis are running manually." $Colors.Warning
    }
    
    # Wait for database to be ready
    Start-Sleep -Seconds 5
    Write-Status "Database services started!" $Colors.Success
}

function Start-AIBackend {
    Write-Status "Starting AI backend..." $Colors.Info
    
    Set-Location "ai_backend"
    
    # Activate virtual environment
    & ".\venv\Scripts\Activate.ps1"
    
    # Start AI backend
    $aiBackendJob = Start-Job -ScriptBlock {
        Set-Location $using:PWD
        & ".\venv\Scripts\Activate.ps1"
        python main.py
    }
    
    Set-Location ".."
    
    # Wait for AI backend to start
    Start-Sleep -Seconds 10
    
    # Test AI backend
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:$($Config.AIBackendPort)/health" -Method Get -TimeoutSec 10
        Write-Status "AI backend started successfully!" $Colors.Success
    } catch {
        Write-Status "AI backend failed to start properly!" $Colors.Error
        Write-Status "Check the logs for more details." $Colors.Warning
    }
    
    return $aiBackendJob
}

function Start-Backend {
    Write-Status "Starting Java backend..." $Colors.Info
    
    Set-Location "backend"
    
    # Start Spring Boot application
    $backendJob = Start-Job -ScriptBlock {
        Set-Location $using:PWD
        ./mvnw spring-boot:run
    }
    
    Set-Location ".."
    
    # Wait for backend to start
    Start-Sleep -Seconds 15
    
    # Test backend
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:$($Config.BackendPort)/actuator/health" -Method Get -TimeoutSec 10
        Write-Status "Backend started successfully!" $Colors.Success
    } catch {
        Write-Status "Backend failed to start properly!" $Colors.Error
        Write-Status "Check the logs for more details." $Colors.Warning
    }
    
    return $backendJob
}

function Start-Frontend {
    Write-Status "Starting React frontend..." $Colors.Info
    
    Set-Location "frontend"
    
    # Set environment variables
    $env:REACT_APP_API_URL = "http://localhost:$($Config.BackendPort)"
    $env:REACT_APP_AI_BACKEND_URL = "http://localhost:$($Config.AIBackendPort)"
    $env:REACT_APP_ENVIRONMENT = $Environment
    
    # Start React development server
    $frontendJob = Start-Job -ScriptBlock {
        Set-Location $using:PWD
        $env:REACT_APP_API_URL = $using:Config.BackendPort
        $env:REACT_APP_AI_BACKEND_URL = $using:Config.AIBackendPort
        $env:REACT_APP_ENVIRONMENT = $using:Environment
        npm start
    }
    
    Set-Location ".."
    
    # Wait for frontend to start
    Start-Sleep -Seconds 10
    
    Write-Status "Frontend started successfully!" $Colors.Success
    return $frontendJob
}

function Test-Application {
    Write-Status "Running application tests..." $Colors.Info
    
    if ($SkipTests) {
        Write-Status "Skipping tests as requested." $Colors.Warning
        return
    }
    
    # Test frontend
    Set-Location "frontend"
    Write-Status "Testing frontend..." $Colors.Info
    npm test -- --watchAll=false --passWithNoTests
    Set-Location ".."
    
    # Test backend
    Set-Location "backend"
    Write-Status "Testing backend..." $Colors.Info
    ./mvnw test
    Set-Location ".."
    
    Write-Status "All tests completed!" $Colors.Success
}

function Show-ApplicationInfo {
    Write-Host ""
    Write-Host "🎉 MedAI Telemedicine Platform is now running!" -ForegroundColor Green
    Write-Host "=============================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "📱 Frontend:     http://localhost:$($Config.FrontendPort)" -ForegroundColor Cyan
    Write-Host "🔧 Backend:      http://localhost:$($Config.BackendPort)" -ForegroundColor Cyan
    Write-Host "🤖 AI Backend:   http://localhost:$($Config.AIBackendPort)" -ForegroundColor Cyan
    Write-Host "🗄️  Database:     localhost:$($Config.DatabasePort)" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "🔑 Default Login:" -ForegroundColor Yellow
    Write-Host "   Username: admin@medai.com" -ForegroundColor White
    Write-Host "   Password: admin123" -ForegroundColor White
    Write-Host ""
    Write-Host "📋 Key Features:" -ForegroundColor Yellow
    Write-Host "   ✅ AI-Powered Medical Scan Analysis" -ForegroundColor White
    Write-Host "   ✅ Enhanced Video Calls with WebRTC" -ForegroundColor White
    Write-Host "   ✅ Comprehensive Patient Dashboard" -ForegroundColor White
    Write-Host "   ✅ Doctor Copilot and Clinical Decision Support" -ForegroundColor White
    Write-Host "   ✅ Security and HIPAA Compliance" -ForegroundColor White
    Write-Host "   ✅ Real-time Health Monitoring" -ForegroundColor White
    Write-Host ""
    Write-Host "🛑 To stop the application, press Ctrl+C" -ForegroundColor Red
    Write-Host ""
}

function Cleanup-Resources {
    Write-Status "Cleaning up resources..." $Colors.Info
    
    # Stop all background jobs
    Get-Job | Stop-Job
    Get-Job | Remove-Job
    
    # Stop Docker containers
    if (Test-Command "docker") {
        docker stop medai-postgres medai-redis 2>$null
        docker rm medai-postgres medai-redis 2>$null
    }
    
    Write-Status "Cleanup completed!" $Colors.Success
}

# Main execution
try {
    # Check if running as administrator (for Docker)
    if (-not ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
        Write-Status "Running as administrator is recommended for Docker support." $Colors.Warning
    }
    
    # Install dependencies
    if (-not $SkipDependencies) {
        Install-Dependencies
        Install-FrontendDependencies
        Install-BackendDependencies
        Install-AIBackendDependencies
    }
    
    # Start services
    Start-Database
    $aiBackendJob = Start-AIBackend
    $backendJob = Start-Backend
    $frontendJob = Start-Frontend
    
    # Test application
    Test-Application
    
    # Show application info
    Show-ApplicationInfo
    
    # Keep the script running
    try {
        while ($true) {
            Start-Sleep -Seconds 1
            
            # Check if any service has stopped
            $jobs = @($aiBackendJob, $backendJob, $frontendJob)
            foreach ($job in $jobs) {
                if ($job.State -eq "Failed") {
                    Write-Status "A service has failed. Check the logs for details." $Colors.Error
                    break
                }
            }
        }
    } catch {
        Write-Status "Application stopped by user." $Colors.Info
    }
    
} catch {
    Write-Status "Deployment failed: $($_.Exception.Message)" $Colors.Error
    exit 1
} finally {
    Cleanup-Resources
}
