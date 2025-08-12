#!/usr/bin/env python3
"""
AI Telemedicine Platform - Simple Deployment Script
This script helps deploy your application to Railway or other platforms.
"""

import os
import sys
import subprocess
import json
from pathlib import Path

def print_banner():
    print("🚀 AI Telemedicine Platform - Live Deployment")
    print("=" * 50)

def check_git():
    """Check if git is available and repository is clean"""
    try:
        result = subprocess.run(['git', 'status', '--porcelain'], 
                              capture_output=True, text=True)
        if result.stdout.strip():
            print("⚠️  Warning: You have uncommitted changes")
            response = input("Continue anyway? (y/N): ")
            if response.lower() != 'y':
                sys.exit(1)
        print("✅ Git repository is ready")
    except FileNotFoundError:
        print("❌ Git not found. Please install Git first.")
        sys.exit(1)

def create_env_file():
    """Create .env file if it doesn't exist"""
    env_file = Path('.env')
    if not env_file.exists():
        print("📝 Creating .env file...")
        env_content = """# AI Telemedicine Platform Environment Variables
# Replace these with your actual API keys

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
"""
        env_file.write_text(env_content)
        print("✅ Created .env file")
        print("⚠️  IMPORTANT: Update .env file with your actual API keys before deploying!")
        print("   - Get OpenAI API key from: https://platform.openai.com/api-keys")
        print("   - Get Stripe keys from: https://dashboard.stripe.com/apikeys")
        print("   - Set up Gmail app password: https://support.google.com/accounts/answer/185833")
    else:
        print("✅ .env file already exists")

def check_railway_cli():
    """Check if Railway CLI is installed"""
    try:
        result = subprocess.run(['railway', '--version'], 
                              capture_output=True, text=True)
        print(f"✅ Railway CLI is installed: {result.stdout.strip()}")
        return True
    except FileNotFoundError:
        print("❌ Railway CLI not found")
        print("📦 Installing Railway CLI...")
        try:
            subprocess.run(['npm', 'install', '-g', '@railway/cli'], check=True)
            print("✅ Railway CLI installed successfully")
            return True
        except subprocess.CalledProcessError:
            print("❌ Failed to install Railway CLI")
            print("Please install manually: npm install -g @railway/cli")
            return False

def check_railway_login():
    """Check if user is logged in to Railway"""
    try:
        result = subprocess.run(['railway', 'whoami'], 
                              capture_output=True, text=True)
        print(f"✅ Logged in as: {result.stdout.strip()}")
        return True
    except subprocess.CalledProcessError:
        print("❌ Not logged in to Railway")
        print("🔐 Please login to Railway:")
        print("   railway login")
        return False

def deploy_to_railway():
    """Deploy to Railway"""
    print("🚀 Deploying to Railway...")
    
    # Initialize Railway project if needed
    if not Path('railway.json').exists():
        print("📋 Initializing Railway project...")
        subprocess.run(['railway', 'init'], check=True)
    
    # Deploy
    try:
        subprocess.run(['railway', 'up'], check=True)
        print("✅ Deployment completed!")
        print("🌐 Your application should be live at: https://your-app-name.railway.app")
        print("📊 Check the Railway dashboard for the exact URL")
    except subprocess.CalledProcessError as e:
        print(f"❌ Deployment failed: {e}")
        return False
    
    return True

def deploy_to_vercel():
    """Deploy frontend to Vercel"""
    print("🌐 Deploying frontend to Vercel...")
    
    # Check if Vercel CLI is installed
    try:
        subprocess.run(['vercel', '--version'], capture_output=True, check=True)
    except (FileNotFoundError, subprocess.CalledProcessError):
        print("📦 Installing Vercel CLI...")
        subprocess.run(['npm', 'install', '-g', 'vercel'], check=True)
    
    # Deploy frontend
    try:
        os.chdir('frontend')
        subprocess.run(['vercel', '--prod'], check=True)
        os.chdir('..')
        print("✅ Frontend deployed to Vercel!")
    except subprocess.CalledProcessError as e:
        print(f"❌ Vercel deployment failed: {e}")
        return False
    
    return True

def main():
    print_banner()
    
    # Check prerequisites
    check_git()
    create_env_file()
    
    print("\n🎯 Choose deployment option:")
    print("1. Railway (Full-stack - Recommended)")
    print("2. Vercel + Railway (Frontend + Backend)")
    print("3. Render (Full-stack)")
    print("4. Docker Compose (Self-hosted)")
    
    choice = input("\nEnter your choice (1-4): ").strip()
    
    if choice == "1":
        if check_railway_cli() and check_railway_login():
            deploy_to_railway()
        else:
            print("❌ Railway setup incomplete. Please fix the issues above.")
    
    elif choice == "2":
        if check_railway_cli() and check_railway_login():
            if deploy_to_railway():
                deploy_to_vercel()
        else:
            print("❌ Railway setup incomplete. Please fix the issues above.")
    
    elif choice == "3":
        print("📋 Render Deployment Instructions:")
        print("1. Go to https://render.com")
        print("2. Sign up/Login with GitHub")
        print("3. Click 'New +' → 'Web Service'")
        print("4. Connect your GitHub repository")
        print("5. Set build command: ./mvnw clean package")
        print("6. Set start command: java -jar target/telemedicine-1.0.0.jar")
        print("7. Add environment variables from .env file")
        print("8. Deploy!")
    
    elif choice == "4":
        print("📋 Docker Compose Deployment Instructions:")
        print("1. Get a VPS (DigitalOcean, Linode, Vultr)")
        print("2. SSH into your server")
        print("3. Install Docker: curl -fsSL https://get.docker.com -o get-docker.sh && sh get-docker.sh")
        print("4. Clone repository: git clone <your-repo-url>")
        print("5. Update .env file with production values")
        print("6. Run: docker-compose up -d")
        print("7. Configure domain and SSL")
    
    else:
        print("❌ Invalid choice. Please select 1-4.")
        return
    
    print("\n📋 Next Steps:")
    print("1. Update your .env file with real API keys")
    print("2. Test your deployed application")
    print("3. Set up custom domain")
    print("4. Configure SSL certificates")
    print("5. Set up monitoring and alerts")
    
    print("\n🎉 Happy Deploying!")

if __name__ == "__main__":
    main() 