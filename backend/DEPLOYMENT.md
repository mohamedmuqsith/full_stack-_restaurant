# Deploy Backend to Railway

## Step-by-Step Guide

### 1. Prepare Your Code

Make sure your `backend` folder contains:
- `server.js`
- `package.json`
- `database.js`
- `routes/` folder
- `.gitignore`
- `railway.json` (optional)

### 2. Create Railway Account

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub (recommended) or email
3. Verify your email if needed

### 3. Create New Project

1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"** (if using GitHub)
   - OR select **"Empty Project"** and connect later

### 4. Connect Repository

**Option A: Deploy from GitHub**
1. Select your repository
2. Railway will auto-detect it's a Node.js project
3. Set root directory to `backend` (if repo is at root level)

**Option B: Deploy from CLI**
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize project
cd backend
railway init

# Deploy
railway up
```

### 5. Configure Environment Variables

In Railway dashboard:
1. Go to your project
2. Click on your service
3. Go to **"Variables"** tab
4. Add these variables:

```
PORT=3000
JWT_SECRET=your-very-secure-secret-key-here-change-this
FRONTEND_URL=https://your-username.github.io
```

**Important:** 
- Generate a secure JWT_SECRET (use a random string generator)
- Update FRONTEND_URL with your GitHub Pages URL

### 6. Deploy

1. Railway will automatically detect changes and deploy
2. Wait for deployment to complete (usually 2-3 minutes)
3. Your API will be available at: `https://your-project-name.up.railway.app`

### 7. Get Your API URL

1. In Railway dashboard, go to your service
2. Click **"Settings"**
3. Copy the **"Public Domain"** URL
4. This is your API base URL (e.g., `https://restaurant-api.up.railway.app`)

### 8. Update Frontend

Update your frontend `api.js` file with the Railway URL:

```javascript
const API_BASE_URL = 'https://your-project-name.up.railway.app/api';
```

Or use environment variable in your frontend build process.

## Troubleshooting

### Database Issues
- Railway provides persistent storage
- SQLite database will be created automatically
- Data persists between deployments

### CORS Issues
- Make sure `FRONTEND_URL` environment variable is set correctly
- Check that your frontend URL matches exactly

### Build Failures
- Check Railway logs in the dashboard
- Ensure `package.json` has correct start script
- Verify all dependencies are listed

### Port Issues
- Railway automatically sets `PORT` environment variable
- Your code should use `process.env.PORT || 3000`

## Railway Free Tier Limits

- 500 hours/month free
- $5 credit monthly
- Perfect for small projects

## Monitoring

- View logs in Railway dashboard
- Set up alerts for errors
- Monitor usage in dashboard

## Custom Domain (Optional)

1. Go to **Settings** → **Networking**
2. Add custom domain
3. Update DNS records as instructed

