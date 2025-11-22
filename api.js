// API Configuration
const API_BASE_URL = 'http://localhost:3000/api';

// Get stored token
function getToken() {
  return localStorage.getItem('auth_token');
}

// Save token
function saveToken(token) {
  localStorage.setItem('auth_token', token);
}

// Remove token (logout)
function removeToken() {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('current_user');
}

// Get current user
function getCurrentUser() {
  const user = localStorage.getItem('current_user');
  return user ? JSON.parse(user) : null;
}

// Save current user
function saveCurrentUser(user) {
  localStorage.setItem('current_user', JSON.stringify(user));
}

// Make API request
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getToken();

  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // Add token if available
  if (token) {
    defaultOptions.headers['Authorization'] = `Bearer ${token}`;
  }

  // Merge with provided options
  const finalOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...(options.headers || {}),
    },
  };

  try {
    const response = await fetch(url, finalOptions);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Request failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Auth API
const authAPI = {
  signup: async (userData) => {
    const response = await apiRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    if (response.success && response.token) {
      saveToken(response.token);
      saveCurrentUser(response.user);
    }
    
    return response;
  },

  login: async (email, password) => {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (response.success && response.token) {
      saveToken(response.token);
      saveCurrentUser(response.user);
    }
    
    return response;
  },

  getCurrentUser: async () => {
    return await apiRequest('/auth/me');
  },

  logout: () => {
    removeToken();
  },
};

// Foods API
const foodsAPI = {
  getAll: async () => {
    const response = await apiRequest('/foods');
    return response.foods || [];
  },

  getById: async (id) => {
    const response = await apiRequest(`/foods/${id}`);
    return response.food;
  },
};

// Cart API
const cartAPI = {
  get: async () => {
    const response = await apiRequest('/cart');
    return response.cart || [];
  },

  add: async (foodId, quantity) => {
    return await apiRequest('/cart', {
      method: 'POST',
      body: JSON.stringify({ food_id: foodId, quantity }),
    });
  },

  remove: async (cartId) => {
    return await apiRequest(`/cart/${cartId}`, {
      method: 'DELETE',
    });
  },

  clear: async () => {
    return await apiRequest('/cart', {
      method: 'DELETE',
    });
  },
};

// Orders API
const ordersAPI = {
  create: async (items, totalAmount) => {
    return await apiRequest('/orders', {
      method: 'POST',
      body: JSON.stringify({
        items,
        total_amount: totalAmount,
      }),
    });
  },

  getAll: async () => {
    const response = await apiRequest('/orders');
    return response.orders || [];
  },

  getById: async (id) => {
    const response = await apiRequest(`/orders/${id}`);
    return response.order;
  },
};

// Check if user is authenticated
function isAuthenticated() {
  return !!getToken();
}

// Redirect to login if not authenticated
function requireAuth() {
  if (!isAuthenticated()) {
    window.location.href = 'index.html';
    return false;
  }
  return true;
}

