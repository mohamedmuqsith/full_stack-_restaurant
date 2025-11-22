# Deploy Frontend to GitHub Pages

## Step-by-Step Guide

### 1. Prepare Your Code

Make sure your `frontend` folder contains all HTML, CSS, JS files and images.

### 2. Update API Configuration

Before deploying, update `api.js` with your Railway backend URL:

```javascript
// In frontend/api.js, update this line:
const API_BASE_URL = 'https://your-railway-app.up.railway.app/api';
```

Replace `your-railway-app.up.railway.app` with your actual Railway backend URL.

### 3. Create GitHub Repository

1. Go to [github.com](https://github.com)
2. Click **"New repository"**
3. Name it (e.g., `restaurant-frontend`)
4. Make it **Public** (required for free GitHub Pages)
5. **Don't** initialize with README (if you have files already)
6. Click **"Create repository"**

### 4. Upload Your Code

**Option A: Using GitHub Desktop**
1. Download [GitHub Desktop](https://desktop.github.com)
2. Clone your repository
3. Copy all files from `frontend` folder to repository folder
4. Commit and push

**Option B: Using Git Command Line**
```bash
cd frontend

# Initialize git (if not already)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit"

# Add remote (replace with your repo URL)
git remote add origin https://github.com/your-username/restaurant-frontend.git

# Push
git branch -M main
git push -u origin main
```

**Option C: Using GitHub Web Interface**
1. Go to your repository
2. Click **"uploading an existing file"**
3. Drag and drop all files from `frontend` folder
4. Click **"Commit changes"**

### 5. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **"Settings"** tab
3. Scroll down to **"Pages"** section (left sidebar)
4. Under **"Source"**, select **"Deploy from a branch"**
5. Select **"main"** branch (or `master`)
6. Select **"/ (root)"** folder
7. Click **"Save"**

### 6. Access Your Site

Your site will be available at:
```
https://your-username.github.io/repository-name/
```

For example:
```
https://johndoe.github.io/restaurant-frontend/
```

**Note:** It may take 1-2 minutes for the site to be available.

### 7. Update API URL (If Needed)

If you need to change the API URL after deployment:

1. Edit `api.js` in your repository
2. Update the `API_BASE_URL` constant
3. Commit and push changes
4. GitHub Pages will automatically update

### 8. Custom Domain (Optional)

1. In repository **Settings** → **Pages**
2. Enter your custom domain
3. Add CNAME file to repository root with your domain
4. Update DNS records as instructed

## Troubleshooting

### Site Not Loading
- Wait 1-2 minutes after enabling Pages
- Check repository is **Public**
- Verify files are in root or correct folder
- Check **Settings** → **Pages** for errors

### API Not Working
- Check CORS settings in backend
- Verify API URL in `api.js` is correct
- Check browser console for errors
- Ensure Railway backend is running

### 404 Errors
- Make sure `index.html` is in root folder
- Check file paths are relative (not absolute)
- Verify all files are committed and pushed

### Images Not Loading
- Use relative paths: `images/logo.png` (not `/images/logo.png`)
- Ensure `images` folder is in repository
- Check file names match exactly (case-sensitive)

## Updating Your Site

1. Make changes to files locally
2. Commit changes:
   ```bash
   git add .
   git commit -m "Update description"
   git push
   ```
3. GitHub Pages automatically updates (may take 1-2 minutes)

## Best Practices

- Keep repository public for free hosting
- Use relative paths for all assets
- Test locally before deploying
- Update API URL before first deployment
- Commit frequently with clear messages

