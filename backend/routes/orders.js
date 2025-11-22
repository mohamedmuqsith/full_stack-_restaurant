const express = require('express');
const router = express.Router();
const { authenticateToken } = require('./auth');
const { dbHelpers } = require('../database');

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Create new order
router.post('/', (req, res) => {
  try {
    const { items, total_amount } = req.body;
    const userId = req.user.userId;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Order items are required' 
      });
    }

    if (!total_amount || total_amount <= 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Valid total amount is required' 
      });
    }

    // Create order
    dbHelpers.createOrder({ user_id: userId, total_amount, status: 'pending' }, (err, orderId) => {
      if (err) {
        return res.status(500).json({ 
          success: false, 
          message: 'Error creating order' 
        });
      }

      // Add order items
      let itemsAdded = 0;
      let hasError = false;

      items.forEach((item) => {
        dbHelpers.addOrderItem(orderId, item, (err) => {
          if (err && !hasError) {
            hasError = true;
            return res.status(500).json({ 
              success: false, 
              message: 'Error adding order items' 
            });
          }

          itemsAdded++;
          if (itemsAdded === items.length && !hasError) {
            // Clear user's cart after successful order
            dbHelpers.clearCart(userId, () => {
              res.status(201).json({
                success: true,
                message: 'Order created successfully',
                order: {
                  id: orderId,
                  user_id: userId,
                  total_amount,
                  status: 'pending'
                }
              });
            });
          }
        });
      });
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// Get user's orders
router.get('/', (req, res) => {
  const userId = req.user.userId;

  dbHelpers.getOrdersByUserId(userId, (err, orders) => {
    if (err) {
      return res.status(500).json({ 
        success: false, 
        message: 'Error fetching orders' 
      });
    }

    // Parse order items
    const formattedOrders = orders.map(order => {
      const items = order.items 
        ? order.items.split(',').map(item => {
            const [food_id, quantity, price] = item.split(':');
            return { food_id: parseInt(food_id), quantity: parseInt(quantity), price: parseFloat(price) };
          })
        : [];
      
      return {
        id: order.id,
        user_id: order.user_id,
        total_amount: order.total_amount,
        status: order.status,
        created_at: order.created_at,
        items
      };
    });

    res.json({
      success: true,
      orders: formattedOrders
    });
  });
});

// Get order by ID
router.get('/:id', (req, res) => {
  const orderId = parseInt(req.params.id);
  const userId = req.user.userId;

  if (isNaN(orderId)) {
    return res.status(400).json({ 
      success: false, 
      message: 'Invalid order ID' 
    });
  }

  dbHelpers.getOrdersByUserId(userId, (err, orders) => {
    if (err) {
      return res.status(500).json({ 
        success: false, 
        message: 'Error fetching order' 
      });
    }

    const order = orders.find(o => o.id === orderId);
    
    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found' 
      });
    }

    // Parse order items
    const items = order.items 
      ? order.items.split(',').map(item => {
          const [food_id, quantity, price] = item.split(':');
          return { food_id: parseInt(food_id), quantity: parseInt(quantity), price: parseFloat(price) };
        })
      : [];

    res.json({
      success: true,
      order: {
        id: order.id,
        user_id: order.user_id,
        total_amount: order.total_amount,
        status: order.status,
        created_at: order.created_at,
        items
      }
    });
  });
});

module.exports = router;

