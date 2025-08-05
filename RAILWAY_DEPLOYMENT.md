# Railway Deployment Instructions

## Step 1: Prepare for Deployment

The application is ready for Railway deployment with the following files:

- `railway.json` - Railway configuration
- `Procfile` - Process definition
- `ai_backend/main_simple.py` - Simplified FastAPI app
- `ai_backend/requirements_simple.txt` - Minimal dependencies

## Step 2: Deploy to Railway

### Option A: Deploy via Railway CLI

1. Install Railway CLI:
```bash
npm install -g @railway/cli
```

2. Login to Railway:
```bash
railway login
```

3. Initialize and deploy:
```bash
railway init
railway up
```

### Option B: Deploy via Railway Dashboard

1. Go to [Railway.app](https://railway.app)
2. Create new project
3. Connect your GitHub repository
4. Railway will automatically detect and deploy

## Step 3: Environment Variables

Railway will automatically set:
- `PORT` - Railway assigns this
- `RAILWAY_STATIC_URL` - For static assets

## Step 4: Verify Deployment

1. Check the deployment logs in Railway dashboard
2. Test the health endpoint: `https://your-app.railway.app/health`
3. Test the API docs: `https://your-app.railway.app/docs`

## Step 5: Custom Domain (Optional)

1. In Railway dashboard, go to Settings
2. Add custom domain
3. Configure DNS records

## Expected Live URL

Once deployed, your app will be available at:
**https://your-app-name.railway.app**

## Troubleshooting

- If deployment fails, check the logs in Railway dashboard
- Ensure all dependencies are in `requirements_simple.txt`
- Verify the `main_simple.py` file is in the `ai_backend` directory 