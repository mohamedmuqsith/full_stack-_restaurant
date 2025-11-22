# 🚀 Quick Deployment Guide

## 📋 Prerequisites

1. **GitHub Account** (free)
2. **Railway Account** (free tier available)
3. **Git** installed on your computer

## 🎯 Deployment Steps

### Part 1: Deploy Backend to Railway (5 minutes)

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub (easiest)

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - **Important:** Set root directory to `backend`

3. **Configure Environment Variables**
   - Go to your service → Variables tab
   - Add these:
     ```
     PORT=3000
     JWT_SECRET=generate-a-random-secure-string-here
     FRONTEND_URL=https://your-username.github.io
     ```
   - Generate JWT_SECRET: Use [randomkeygen.com](https://randomkeygen.com)

4. **Deploy**
   - Railway auto-deploys on push
   - Wait 2-3 minutes
   - Get your API URL from Settings → Public Domain
   - Example: `https://restaurant-api.up.railway.app`

### Part 2: Deploy Frontend to GitHub Pages (5 minutes)

1. **Create GitHub Repository**
   - Go to [github.com](https://github.com)
   - Click "New repository"
   - Name it (e.g., `restaurant-frontend`)
   - Make it **Public**
   - Create repository

2. **Update API URL**
   - Open `frontend/config.js`
   - Replace `your-app.up.railway.app` with your Railway URL:
     ```javascript
     const PRODUCTION_API_URL = 'https://your-actual-railway-url.up.railway.app/api';
     ```

3. **Upload Files**
   - Go to your repository
   - Click "uploading an existing file"
   - Drag all files from `frontend` folder
   - Commit changes

4. **Enable GitHub Pages**
   - Go to Settings → Pages
   - Source: Deploy from branch
   - Branch: `main` (or `master`)
   - Folder: `/ (root)`
   - Save

5. **Access Your Site**
   - URL: `https://your-username.github.io/repository-name/`
   - Wait 1-2 minutes for first deployment

### Part 3: Update CORS (Important!)

1. **Go back to Railway**
2. **Update Environment Variable:**
   ```
   FRONTEND_URL=https://your-username.github.io/repository-name
   ```
   (Replace with your actual GitHub Pages URL)

3. **Redeploy** (Railway will auto-redeploy)

## ✅ Verification

1. **Test Backend:**
   - Visit: `https://your-railway-url.up.railway.app/api/health`
   - Should return: `{"success":true,"message":"Server is running"}`

2. **Test Frontend:**
   - Visit your GitHub Pages URL
   - Try signing up/login
   - Check browser console for errors

## 🔧 Troubleshooting

### Backend Issues
- **Build fails?** Check Railway logs
- **CORS errors?** Verify FRONTEND_URL matches exactly
- **Database issues?** SQLite auto-creates on Railway

### Frontend Issues
- **API not working?** Check `config.js` has correct Railway URL
- **404 errors?** Ensure `index.html` is in root
- **Images not loading?** Use relative paths: `images/logo.png`

## 📝 Quick Checklist

- [ ] Railway account created
- [ ] Backend deployed to Railway
- [ ] Got Railway API URL
- [ ] Updated `frontend/config.js` with Railway URL
- [ ] GitHub repository created
- [ ] Frontend files uploaded
- [ ] GitHub Pages enabled
- [ ] Updated Railway `FRONTEND_URL` variable
- [ ] Tested both backend and frontend

## 🎉 You're Done!

Your restaurant app is now live:
- **Backend:** `https://your-app.up.railway.app`
- **Frontend:** `https://your-username.github.io/repo-name`

## 💡 Pro Tips

1. **Keep repositories separate** (backend and frontend)
2. **Use environment variables** for all configs
3. **Test locally first** before deploying
4. **Monitor Railway dashboard** for usage
5. **Check GitHub Pages** for deployment status

## 📚 Detailed Guides

- Backend: See `backend/DEPLOYMENT.md`
- Frontend: See `frontend/DEPLOYMENT.md`

