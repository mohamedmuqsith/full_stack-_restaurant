# Restaurant Full Stack Web Application

A full-stack restaurant management system with Node.js backend and vanilla JavaScript frontend.

## Project Structure

```
resturant_fullsatck_web/
├── backend/          # Node.js API server
│   ├── routes/      # API routes
│   ├── server.js    # Main server file
│   ├── database.js  # Database setup
│   └── package.json # Backend dependencies
│
└── frontend/        # Frontend application
    ├── *.html       # HTML pages
    ├── *.css        # Stylesheets
    ├── *.js         # JavaScript files
    └── images/      # Image assets
```

## Quick Start

### Backend Setup

```bash
cd backend
npm install
npm start
```

Backend runs on `http://localhost:3000`

### Frontend Setup

1. Open `frontend/index.html` in a browser
2. Or use a local server:
```bash
cd frontend
# Using Python
python -m http.server 8000

# Using Node.js (http-server)
npx http-server -p 8000
```

Frontend runs on `http://localhost:8000`

## Deployment

### Backend → Railway

See `backend/DEPLOYMENT.md` for detailed instructions.

**Quick Steps:**
1. Create Railway account
2. Connect GitHub repository
3. Set root directory to `backend`
4. Add environment variables
5. Deploy!

### Frontend → GitHub Pages

See `frontend/DEPLOYMENT.md` for detailed instructions.

**Quick Steps:**
1. Create GitHub repository
2. Upload frontend files
3. Enable GitHub Pages in Settings
4. Update API URL in `api.js`
5. Done!

## Environment Variables

### Backend (.env)
```
PORT=3000
JWT_SECRET=your-secret-key
FRONTEND_URL=https://your-username.github.io
```

### Frontend (api.js)
Update `API_BASE_URL` with your Railway backend URL:
```javascript
const API_BASE_URL = 'https://your-app.up.railway.app/api';
```

## Features

- ✅ User authentication (signup/login)
- ✅ Food menu management
- ✅ Shopping cart
- ✅ Order management
- ✅ Responsive design
- ✅ RESTful API

## Tech Stack

**Backend:**
- Node.js + Express
- SQLite
- JWT Authentication
- bcryptjs

**Frontend:**
- Vanilla JavaScript
- HTML5 + CSS3
- Responsive Design

## License

ISC
