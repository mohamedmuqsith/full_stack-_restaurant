const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const foodRoutes = require('./routes/foods');
const orderRoutes = require('./routes/orders');
const cartRoutes = require('./routes/cart');

// Initialize database 
require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*', // Allow frontend to access API
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', authRoutes.router);
app.use('/api/foods', foodRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Ceylon Kitchen API Server',
    version: '1.0.0',
    endpoints: '/api'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
  console.log(` API endpoints available at http://localhost:${PORT}/api`);
  console.log(`\nAvailable endpoints:`);
  console.log(`  POST   /api/auth/signup - Register new user`);
  console.log(`  POST   /api/auth/login - Login user`);
  console.log(`  GET    /api/auth/me - Get current user (requires auth)`);
  console.log(`  GET    /api/foods - Get all foods`);
  console.log(`  GET    /api/foods/:id - Get food by ID`);
  console.log(`  GET    /api/cart - Get user's cart (requires auth)`);
  console.log(`  POST   /api/cart - Add item to cart (requires auth)`);
  console.log(`  DELETE /api/cart/:id - Remove item from cart (requires auth)`);
  console.log(`  DELETE /api/cart - Clear cart (requires auth)`);
  console.log(`  POST   /api/orders - Create new order (requires auth)`);
  console.log(`  GET    /api/orders - Get user's orders (requires auth)`);
  console.log(`  GET    /api/orders/:id - Get order by ID (requires auth)`);
});

