const express = require('express');
const router = express.Router();
const { dbHelpers } = require('../database');

// Get all foods
router.get('/', (req, res) => {
  dbHelpers.getAllFoods((err, foods) => {
    if (err) {
      return res.status(500).json({ 
        success: false, 
        message: 'Error fetching foods' 
      });
    }

    res.json({
      success: true,
      foods
    });
  });
});

// Get food by ID
router.get('/:id', (req, res) => {
  const foodId = parseInt(req.params.id);

  if (isNaN(foodId)) {
    return res.status(400).json({ 
      success: false, 
      message: 'Invalid food ID' 
    });
  }

  dbHelpers.getFoodById(foodId, (err, food) => {
    if (err) {
      return res.status(500).json({ 
        success: false, 
        message: 'Error fetching food' 
      });
    }

    if (!food) {
      return res.status(404).json({ 
        success: false, 
        message: 'Food not found' 
      });
    }

    res.json({
      success: true,
      food
    });
  });
});

module.exports = router;

