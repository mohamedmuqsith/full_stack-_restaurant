const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const DB_PATH = path.join(__dirname, 'restaurant.db');

// Initialize database connection
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('✅ Connected to SQLite database');
    initializeDatabase();
  }
});

// Initialize database tables
function initializeDatabase() {
  // Users table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`, (err) => {
    if (err) {
      console.error('Error creating users table:', err.message);
    } else {
      console.log('✅ Users table ready');
    }
  });

  // Foods table
  db.run(`CREATE TABLE IF NOT EXISTS foods (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    image TEXT NOT NULL,
    description TEXT,
    tags TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`, (err) => {
    if (err) {
      console.error('Error creating foods table:', err.message);
    } else {
      console.log('✅ Foods table ready');
      seedFoods();
    }
  });

  // Orders table
  db.run(`CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    total_amount REAL NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`, (err) => {
    if (err) {
      console.error('Error creating orders table:', err.message);
    } else {
      console.log('✅ Orders table ready');
    }
  });

  // Order items table
  db.run(`CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    food_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    price REAL NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (food_id) REFERENCES foods(id)
  )`, (err) => {
    if (err) {
      console.error('Error creating order_items table:', err.message);
    } else {
      console.log('✅ Order items table ready');
    }
  });

  // Cart table (for temporary cart storage)
  db.run(`CREATE TABLE IF NOT EXISTS cart (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    food_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (food_id) REFERENCES foods(id)
  )`, (err) => {
    if (err) {
      console.error('Error creating cart table:', err.message);
    } else {
      console.log('✅ Cart table ready');
    }
  });
}

// Seed initial food data
function seedFoods() {
  db.get('SELECT COUNT(*) as count FROM foods', (err, row) => {
    if (err) {
      console.error('Error checking foods:', err.message);
      return;
    }

    if (row.count === 0) {
      const foods = [
        {
          name: 'The Classic Burger',
          price: 15.99,
          image: 'product-1.jpg',
          description: 'A delicious handmade burger made with premium beef, topped with melted cheddar cheese, fresh lettuce, juicy tomato, crispy bacon, and our special sauce. Served with crispy fries and a refreshing drink. Perfect for lunch or dinner!',
          tags: JSON.stringify(['Beef Patty', 'Cheddar Cheese', 'Lettuce'])
        },
        {
          name: 'Brownies',
          price: 20.99,
          image: 'product-2.jpg',
          description: 'Rich and fudgy chocolate brownies made with premium cocoa and topped with chocolate chips. Fresh baked daily for the perfect moist and chewy texture.',
          tags: JSON.stringify(['Chocolate', 'Dessert', 'Premium'])
        },
        {
          name: 'Puff Pastry',
          price: 12.99,
          image: 'product-3.jpg',
          description: 'Delicate and buttery puff pastry with layers of crispy golden goodness. Perfect with coffee or as a light snack.',
          tags: JSON.stringify(['Pastry', 'Butter', 'Fresh Baked'])
        },
        {
          name: 'Doughnuts',
          price: 14.99,
          image: 'product-1.jpg',
          description: 'Fresh glazed doughnuts made daily with premium ingredients. Soft, fluffy, and perfectly sweet.',
          tags: JSON.stringify(['Glazed', 'Donuts', 'Sweet'])
        }
      ];

      const stmt = db.prepare(`INSERT INTO foods (name, price, image, description, tags) 
                               VALUES (?, ?, ?, ?, ?)`);

      foods.forEach(food => {
        stmt.run([food.name, food.price, food.image, food.description, food.tags]);
      });

      stmt.finalize((err) => {
        if (err) {
          console.error('Error seeding foods:', err.message);
        } else {
          console.log('✅ Seeded initial food data');
        }
      });
    }
  });
}

// Database helper functions
const dbHelpers = {
  // User operations
  createUser: (userData, callback) => {
    bcrypt.hash(userData.password, 10, (err, hash) => {
      if (err) return callback(err);
      
      db.run(
        'INSERT INTO users (username, email, phone, password) VALUES (?, ?, ?, ?)',
        [userData.username, userData.email, userData.phone, hash],
        function(err) {
          if (err) return callback(err);
          callback(null, { id: this.lastID, ...userData, password: undefined });
        }
      );
    });
  },

  getUserByEmail: (email, callback) => {
    db.get('SELECT * FROM users WHERE email = ?', [email], callback);
  },

  getUserById: (id, callback) => {
    db.get('SELECT id, username, email, phone, created_at FROM users WHERE id = ?', [id], callback);
  },

  // Food operations
  getAllFoods: (callback) => {
    db.all('SELECT * FROM foods ORDER BY id', (err, rows) => {
      if (err) return callback(err);
      const foods = rows.map(row => ({
        ...row,
        tags: JSON.parse(row.tags || '[]')
      }));
      callback(null, foods);
    });
  },

  getFoodById: (id, callback) => {
    db.get('SELECT * FROM foods WHERE id = ?', [id], (err, row) => {
      if (err) return callback(err);
      if (row) {
        row.tags = JSON.parse(row.tags || '[]');
      }
      callback(err, row);
    });
  },

  // Order operations
  createOrder: (orderData, callback) => {
    db.run(
      'INSERT INTO orders (user_id, total_amount, status) VALUES (?, ?, ?)',
      [orderData.user_id, orderData.total_amount, orderData.status || 'pending'],
      function(err) {
        if (err) return callback(err);
        callback(null, this.lastID);
      }
    );
  },

  addOrderItem: (orderId, item, callback) => {
    db.run(
      'INSERT INTO order_items (order_id, food_id, quantity, price) VALUES (?, ?, ?, ?)',
      [orderId, item.food_id, item.quantity, item.price],
      callback
    );
  },

  getOrdersByUserId: (userId, callback) => {
    db.all(
      `SELECT o.*, 
       GROUP_CONCAT(oi.food_id || ':' || oi.quantity || ':' || oi.price) as items
       FROM orders o
       LEFT JOIN order_items oi ON o.id = oi.order_id
       WHERE o.user_id = ?
       GROUP BY o.id
       ORDER BY o.created_at DESC`,
      [userId],
      callback
    );
  },

  // Cart operations
  addToCart: (userId, foodId, quantity, callback) => {
    // Check if item already in cart
    db.get(
      'SELECT * FROM cart WHERE user_id = ? AND food_id = ?',
      [userId, foodId],
      (err, row) => {
        if (err) return callback(err);
        
        if (row) {
          // Update quantity
          db.run(
            'UPDATE cart SET quantity = quantity + ? WHERE id = ?',
            [quantity, row.id],
            callback
          );
        } else {
          // Insert new item
          db.run(
            'INSERT INTO cart (user_id, food_id, quantity) VALUES (?, ?, ?)',
            [userId, foodId, quantity],
            callback
          );
        }
      }
    );
  },

  getCartByUserId: (userId, callback) => {
    db.all(
      `SELECT c.*, f.name, f.price, f.image 
       FROM cart c
       JOIN foods f ON c.food_id = f.id
       WHERE c.user_id = ?
       ORDER BY c.created_at DESC`,
      [userId],
      callback
    );
  },

  removeFromCart: (userId, cartId, callback) => {
    db.run('DELETE FROM cart WHERE id = ? AND user_id = ?', [cartId, userId], callback);
  },

  clearCart: (userId, callback) => {
    db.run('DELETE FROM cart WHERE user_id = ?', [userId], callback);
  }
};

module.exports = { db, dbHelpers };

