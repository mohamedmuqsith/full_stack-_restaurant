// Frontend Configuration
// Update this file with your Railway backend URL before deploying

// For local development
const LOCAL_API_URL = 'http://localhost:3000/api';

// For production (Railway backend URL)
// Replace with your actual Railway URL: https://your-app.up.railway.app/api
const PRODUCTION_API_URL = 'https://your-app.up.railway.app/api';

// Automatically detect environment
const isProduction = window.location.hostname !== 'localhost' && 
                     window.location.hostname !== '127.0.0.1';

// Set API base URL
window.API_BASE_URL = isProduction ? PRODUCTION_API_URL : LOCAL_API_URL;

