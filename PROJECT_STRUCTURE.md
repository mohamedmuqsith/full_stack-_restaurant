# 📁 Project Structure

## Current Structure

```
resturant_fullsatck_web/
│
├── backend/                    # Backend API Server
│   ├── routes/                # API route handlers
│   │   ├── auth.js           # Authentication routes
│   │   ├── foods.js          # Food/menu routes
│   │   ├── orders.js         # Order routes
│   │   └── cart.js           # Cart routes
│   ├── server.js             # Main server file
│   ├── database.js           # Database setup & helpers
│   ├── package.json          # Backend dependencies
│   ├── package-lock.json     # Lock file
│   ├── .gitignore           # Backend gitignore
│   ├── railway.json          # Railway deployment config
│   ├── Procfile             # Railway process file
│   ├── README.md            # Backend documentation
│   └── DEPLOYMENT.md        # Railway deployment guide
│
├── frontend/                  # Frontend Application
│   ├── images/               # Image assets
│   ├── *.html                # HTML pages
│   ├── *.css                 # Stylesheets
│   ├── *.js                  # JavaScript files
│   ├── config.js            # API configuration
│   ├── api.js               # API client
│   └── DEPLOYMENT.md        # GitHub Pages guide
│
├── .gitignore                # Root gitignore
├── README.md                # Main project README
├── QUICK_DEPLOY.md          # Quick deployment guide
└── PROJECT_STRUCTURE.md     # This file
```

## File Organization

### Backend Files
- **server.js** - Express server setup
- **database.js** - SQLite database initialization
- **routes/** - All API endpoints
- **package.json** - Node.js dependencies

### Frontend Files
- **HTML files** - All page templates
- **CSS files** - Styling
- **JavaScript files** - Client-side logic
- **config.js** - API URL configuration
- **images/** - All image assets

## Development Workflow

### Local Development

1. **Start Backend:**
   ```bash
   cd backend
   npm install
   npm start
   ```

2. **Start Frontend:**
   - Open `frontend/index.html` in browser
   - Or use local server (Python/Node.js)

### Production Deployment

1. **Deploy Backend to Railway**
   - See `backend/DEPLOYMENT.md`

2. **Deploy Frontend to GitHub Pages**
   - See `frontend/DEPLOYMENT.md`

## Important Notes

- Backend and frontend are **completely separate**
- Frontend calls backend via API
- Update `frontend/config.js` with Railway URL before deploying
- Backend CORS is configured for frontend domain

