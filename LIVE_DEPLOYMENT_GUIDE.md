# 🚀 Live Deployment Guide - AI Telemedicine Platform

This guide will help you deploy your AI Telemedicine platform live on the internet.

## 🎯 Quick Start Options

### Option 1: Railway (Recommended - Easiest)
**Deployment Time**: 5-10 minutes
**Cost**: Free tier available
**Best for**: Quick deployment with database included

### Option 2: Vercel + Railway
**Deployment Time**: 10-15 minutes
**Cost**: Free tier available
**Best for**: Frontend on Vercel, Backend on Railway

### Option 3: Render
**Deployment Time**: 15-20 minutes
**Cost**: Free tier available
**Best for**: Full-stack deployment with auto-scaling

### Option 4: Docker Compose (Self-hosted)
**Deployment Time**: 30-45 minutes
**Cost**: VPS costs (~$5-20/month)
**Best for**: Full control and customization

---

## 🚀 Option 1: Railway Deployment (Recommended)

### Step 1: Install Railway CLI
```bash
npm install -g @railway/cli
```

### Step 2: Login to Railway
```bash
railway login
```

### Step 3: Run Deployment Script
```bash
# On Windows
.\deploy-live.ps1

# On Mac/Linux
chmod +x deploy-live.sh
./deploy-live.sh
```

### Step 4: Configure Environment Variables
1. Go to Railway Dashboard
2. Select your project
3. Go to Variables tab
4. Add these required variables:

```env
# OpenAI API (Required for AI features)
OPENAI_API_KEY=sk-your-openai-api-key

# Stripe (Required for payments)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable

# Email (Required for notifications)
EMAIL_USERNAME=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password

# JWT Secret (Required for auth)
JWT_SECRET=your-super-secret-jwt-key-256-bits

# Database (Auto-configured by Railway)
DATABASE_URL=mysql://user:pass@host:port/db
```

### Step 5: Deploy
```bash
railway up
```

**Your app will be live at**: `https://your-app-name.railway.app`

---

## 🌐 Option 2: Vercel + Railway (Frontend + Backend)

### Frontend Deployment (Vercel)

1. **Connect to Vercel**
```bash
npm install -g vercel
vercel login
```

2. **Deploy Frontend**
```bash
cd frontend
vercel --prod
```

3. **Configure Environment Variables in Vercel Dashboard**
```env
REACT_APP_API_URL=https://your-backend-url.railway.app
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key
```

### Backend Deployment (Railway)
Follow Option 1 steps for backend deployment.

---

## 🐳 Option 3: Render Deployment

### Step 1: Connect to Render
1. Go to [render.com](https://render.com)
2. Sign up/Login with GitHub
3. Click "New +" → "Web Service"

### Step 2: Configure Service
- **Name**: `ai-telemedicine-backend`
- **Repository**: Your GitHub repo
- **Root Directory**: `backend`
- **Build Command**: `./mvnw clean package`
- **Start Command**: `java -jar target/telemedicine-1.0.0.jar`

### Step 3: Set Environment Variables
Add all the environment variables from Option 1.

### Step 4: Deploy Frontend
1. Create another Web Service
2. **Root Directory**: `frontend`
3. **Build Command**: `npm install && npm run build`
4. **Start Command**: `npx serve -s build`

---

## 🐳 Option 4: Docker Compose (Self-hosted)

### Step 1: Get a VPS
- **DigitalOcean**: $5/month droplet
- **Linode**: $5/month instance
- **Vultr**: $5/month instance

### Step 2: SSH into your server
```bash
ssh root@your-server-ip
```

### Step 3: Install Docker
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
```

### Step 4: Clone and Deploy
```bash
git clone https://github.com/your-username/ai-telemedicine.git
cd ai-telemedicine
docker-compose up -d
```

### Step 5: Configure Domain
1. Point your domain to your server IP
2. Configure SSL with Let's Encrypt
3. Update nginx configuration

---

## 🔑 Required API Keys

### 1. OpenAI API Key
- Go to [OpenAI Platform](https://platform.openai.com/api-keys)
- Create a new API key
- Add to environment variables

### 2. Stripe Keys
- Go to [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
- Get your test keys (publishable and secret)
- Add to environment variables

### 3. Gmail App Password
- Go to [Google Account Settings](https://myaccount.google.com/apppasswords)
- Generate an app password for your email
- Add to environment variables

---

## 🧪 Testing Your Deployment

### Health Checks
```bash
# Backend Health
curl https://your-backend-url/actuator/health

# Frontend
curl https://your-frontend-url
```

### Feature Testing
1. **User Registration**: Create a test account
2. **AI Features**: Test symptom checker
3. **Payment**: Test with Stripe test cards
4. **Chat**: Test real-time messaging

---

## 🔧 Troubleshooting

### Common Issues

1. **Database Connection Error**
```bash
# Check if database is running
docker-compose logs mysql
```

2. **Environment Variables Missing**
```bash
# Verify all required variables are set
railway variables
```

3. **Build Failures**
```bash
# Check build logs
railway logs
```

4. **Port Conflicts**
```bash
# Check what's using the port
netstat -tulpn | grep :8080
```

---

## 📊 Monitoring Your Deployment

### Railway Dashboard
- View logs in real-time
- Monitor resource usage
- Set up alerts

### Application Monitoring
- Health checks: `/actuator/health`
- Metrics: `/actuator/metrics`
- Prometheus: `/actuator/prometheus`

---

## 🔒 Security Checklist

- [ ] SSL/TLS certificates configured
- [ ] Environment variables secured
- [ ] Database passwords encrypted
- [ ] JWT secrets rotated
- [ ] API rate limiting enabled
- [ ] CORS properly configured
- [ ] Input validation enabled

---

## 🚀 Next Steps After Deployment

1. **Set up Custom Domain**
   - Configure DNS records
   - Set up SSL certificates
   - Update environment variables

2. **Configure Monitoring**
   - Set up alerts for downtime
   - Monitor performance metrics
   - Configure log aggregation

3. **Scale Your Application**
   - Add more resources as needed
   - Implement load balancing
   - Set up auto-scaling

4. **Backup Strategy**
   - Set up database backups
   - Configure disaster recovery
   - Test restore procedures

---

## 📞 Support

If you encounter issues:

1. **Check Logs**: `railway logs` or `docker-compose logs`
2. **Verify Environment**: Ensure all variables are set
3. **Test Locally**: Run `docker-compose up` locally first
4. **Community**: Check GitHub issues or create new ones

**Happy Deploying! 🎉**
