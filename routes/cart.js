const express = require('express');
const router = express.Router();
const { authenticateToken } = require('./auth');
const { dbHelpers } = require('../database');

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Get user's cart
router.get('/', (req, res) => {
  const userId = req.user.userId;

  dbHelpers.getCartByUserId(userId, (err, cartItems) => {
    if (err) {
      return res.status(500).json({ 
        success: false, 
        message: 'Error fetching cart' 
      });
    }

    res.json({
      success: true,
      cart: cartItems
    });
  });
});

// Add item to cart
router.post('/', (req, res) => {
  try {
    const { food_id, quantity } = req.body;
    const userId = req.user.userId;

    if (!food_id || !quantity) {
      return res.status(400).json({ 
        success: false, 
        message: 'Food ID and quantity are required' 
      });
    }

    if (quantity <= 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Quantity must be greater than 0' 
      });
    }

    dbHelpers.addToCart(userId, food_id, quantity, (err) => {
      if (err) {
        return res.status(500).json({ 
          success: false, 
          message: 'Error adding item to cart' 
        });
      }

      res.json({
        success: true,
        message: 'Item added to cart'
      });
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// Remove item from cart
router.delete('/:id', (req, res) => {
  const cartId = parseInt(req.params.id);
  const userId = req.user.userId;

  if (isNaN(cartId)) {
    return res.status(400).json({ 
      success: false, 
      message: 'Invalid cart item ID' 
    });
  }

  dbHelpers.removeFromCart(userId, cartId, (err) => {
    if (err) {
      return res.status(500).json({ 
        success: false, 
        message: 'Error removing item from cart' 
      });
    }

    res.json({
      success: true,
      message: 'Item removed from cart'
    });
  });
});

// Clear cart
router.delete('/', (req, res) => {
  const userId = req.user.userId;

  dbHelpers.clearCart(userId, (err) => {
    if (err) {
      return res.status(500).json({ 
        success: false, 
        message: 'Error clearing cart' 
      });
    }

    res.json({
      success: true,
      message: 'Cart cleared'
    });
  });
});

module.exports = router;

