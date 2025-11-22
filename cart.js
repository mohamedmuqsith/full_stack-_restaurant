let cartItems = [];
let foodsMap = {}; // Map to store food details

// Load cart on page load
document.addEventListener('DOMContentLoaded', async () => {
    if (!isAuthenticated()) {
        window.location.href = 'index.html';
        return;
    }

    await loadCart();
});

// Load cart from API
async function loadCart() {
    try {
        const response = await cartAPI.get();
        cartItems = response;

        if (cartItems.length === 0) {
            document.getElementById('loading').style.display = 'none';
            document.getElementById('emptyCart').style.display = 'block';
            return;
        }

        // Load food details for all items
        await loadFoodDetails();

        // Display cart
        displayCart();
        calculateTotal();
    } catch (error) {
        console.error('Error loading cart:', error);
        document.getElementById('loading').textContent = 'Error loading cart. Please try again.';
    }
}

// Load food details for cart items
async function loadFoodDetails() {
    try {
        const foodIds = [...new Set(cartItems.map(item => item.food_id))];
        
        for (const foodId of foodIds) {
            try {
                const food = await foodsAPI.getById(foodId);
                foodsMap[foodId] = food;
            } catch (error) {
                console.error(`Error loading food ${foodId}:`, error);
            }
        }
    } catch (error) {
        console.error('Error loading food details:', error);
    }
}

// Display cart items
function displayCart() {
    const cartItemsContainer = document.getElementById('cartItems');
    
    cartItemsContainer.innerHTML = cartItems.map(item => {
        const food = foodsMap[item.food_id];
        const itemTotal = (food ? food.price : 0) * item.quantity;
        
        return `
            <div class="cart-item" data-cart-id="${item.id}">
                <img src="images/${item.image || (food ? food.image : 'product-1.jpg')}" 
                     alt="${item.name || (food ? food.name : 'Item')}" 
                     class="cart-item-image">
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name || (food ? food.name : 'Food Item')}</div>
                    <div class="cart-item-price">$${(food ? food.price : 0).toFixed(2)} each</div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                        <span>Quantity: ${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                    </div>
                    <div style="margin-top: 0.5rem; font-weight: bold;">
                        Total: $${itemTotal.toFixed(2)}
                    </div>
                    <button class="remove-btn" onclick="removeItem(${item.id})">
                        <i class="fas fa-trash"></i> Remove
                    </button>
                </div>
            </div>
        `;
    }).join('');

    document.getElementById('loading').style.display = 'none';
    document.getElementById('cartContainer').style.display = 'block';
}

// Update quantity
async function updateQuantity(cartId, newQuantity) {
    if (newQuantity < 1) {
        removeItem(cartId);
        return;
    }

    try {
        // Remove old item
        await cartAPI.remove(cartId);
        
        // Find the item
        const item = cartItems.find(i => i.id === cartId);
        if (item) {
            // Add with new quantity
            await cartAPI.add(item.food_id, newQuantity);
        }
        
        // Reload cart
        await loadCart();
    } catch (error) {
        console.error('Error updating quantity:', error);
        alert('Failed to update quantity. Please try again.');
    }
}

// Remove item from cart
async function removeItem(cartId) {
    if (!confirm('Are you sure you want to remove this item?')) {
        return;
    }

    try {
        await cartAPI.remove(cartId);
        await loadCart();
    } catch (error) {
        console.error('Error removing item:', error);
        alert('Failed to remove item. Please try again.');
    }
}

// Calculate total
function calculateTotal() {
    let subtotal = 0;

    cartItems.forEach(item => {
        const food = foodsMap[item.food_id];
        if (food) {
            subtotal += food.price * item.quantity;
        }
    });

    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + tax;

    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;

    // Enable/disable checkout button
    const checkoutBtn = document.getElementById('checkoutBtn');
    checkoutBtn.disabled = cartItems.length === 0;
}

// Checkout
async function checkout() {
    if (cartItems.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    try {
        // Prepare order items
        const orderItems = cartItems.map(item => {
            const food = foodsMap[item.food_id];
            return {
                food_id: item.food_id,
                quantity: item.quantity,
                price: food ? food.price : 0
            };
        });

        // Calculate total
        const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const tax = subtotal * 0.1;
        const totalAmount = subtotal + tax;

        // Create order
        const response = await ordersAPI.create(orderItems, totalAmount);

        if (response.success) {
            alert('Order placed successfully!');
            window.location.href = 'orders.html';
        } else {
            alert('Failed to place order. Please try again.');
        }
    } catch (error) {
        console.error('Error during checkout:', error);
        alert('Failed to place order. Please try again.');
    }
}

// Logout
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        authAPI.logout();
        window.location.href = 'index.html';
    }
}

