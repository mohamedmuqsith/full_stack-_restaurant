let orders = [];
let foodsMap = {};

// Load orders on page load
document.addEventListener('DOMContentLoaded', async () => {
    if (!isAuthenticated()) {
        window.location.href = 'index.html';
        return;
    }

    await loadOrders();
});

// Load orders from API
async function loadOrders() {
    try {
        const response = await ordersAPI.getAll();
        orders = response;

        if (orders.length === 0) {
            document.getElementById('loading').style.display = 'none';
            document.getElementById('emptyOrders').style.display = 'block';
            return;
        }

        // Load food details for all orders
        await loadFoodDetails();

        // Display orders
        displayOrders();
    } catch (error) {
        console.error('Error loading orders:', error);
        document.getElementById('loading').textContent = 'Error loading orders. Please try again.';
    }
}

// Load food details for order items
async function loadFoodDetails() {
    try {
        const foodIds = new Set();
        orders.forEach(order => {
            order.items.forEach(item => {
                foodIds.add(item.food_id);
            });
        });

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

// Display orders
function displayOrders() {
    const ordersContainer = document.getElementById('ordersContainer');
    
    ordersContainer.innerHTML = orders.map(order => {
        const orderDate = new Date(order.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        const orderItemsHtml = order.items.map(item => {
            const food = foodsMap[item.food_id];
            const itemTotal = item.price * item.quantity;
            
            return `
                <div class="order-item">
                    <span class="order-item-name">${food ? food.name : `Food #${item.food_id}`}</span>
                    <span class="order-item-quantity">x${item.quantity}</span>
                    <span class="order-item-price">$${itemTotal.toFixed(2)}</span>
                </div>
            `;
        }).join('');

        return `
            <div class="order-card">
                <div class="order-header">
                    <div>
                        <div class="order-id">Order #${order.id}</div>
                        <div class="order-date">${orderDate}</div>
                    </div>
                    <span class="order-status ${order.status}">${order.status.toUpperCase()}</span>
                </div>
                <div class="order-items">
                    ${orderItemsHtml}
                </div>
                <div class="order-footer">
                    <div></div>
                    <div class="order-total">Total: $${order.total_amount.toFixed(2)}</div>
                </div>
            </div>
        `;
    }).join('');

    document.getElementById('loading').style.display = 'none';
    document.getElementById('ordersContainer').style.display = 'block';
}

// Logout
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        authAPI.logout();
        window.location.href = 'index.html';
    }
}

