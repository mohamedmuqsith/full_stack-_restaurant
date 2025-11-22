# Restaurant Backend API

Backend API for Ceylon Kitchen Restaurant built with Node.js, Express, and SQLite.

## Features

- User authentication (signup/login) with JWT tokens
- Food menu management
- Shopping cart functionality
- Order management
- RESTful API design

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **SQLite** - Database
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **CORS** - Cross-origin resource sharing

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```env
PORT=3000
JWT_SECRET=your-secret-key-change-in-production
FRONTEND_URL=http://localhost:3000
```

3. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

The server will start on `http://localhost:3000`

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile (requires auth)

### Foods

- `GET /api/foods` - Get all food items
- `GET /api/foods/:id` - Get food item by ID

### Cart

- `GET /api/cart` - Get user's cart (requires auth)
- `POST /api/cart` - Add item to cart (requires auth)
- `DELETE /api/cart/:id` - Remove item from cart (requires auth)
- `DELETE /api/cart` - Clear entire cart (requires auth)

### Orders

- `POST /api/orders` - Create new order (requires auth)
- `GET /api/orders` - Get user's orders (requires auth)
- `GET /api/orders/:id` - Get order by ID (requires auth)

## Deployment to Railway

See `DEPLOYMENT.md` for detailed deployment instructions.

