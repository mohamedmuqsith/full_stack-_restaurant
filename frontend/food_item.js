let foodsDB = [];
let currentFoodId = 1;

// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', async () => {
    const menuIcon = document.querySelector('.menu-icon');
    const mobileMenu = document.querySelector('.mobile-menu');

    menuIcon?.addEventListener('click', () => {
        mobileMenu?.classList.toggle('active');
    });

    // Check authentication
    if (!isAuthenticated()) {
        window.location.href = 'index.html';
        return;
    }

    // Load foods from API
    try {
        foodsDB = await foodsAPI.getAll();
        console.log('✅ Loaded foods from API:', foodsDB);
        
        // Get food ID from URL parameter or default to 1
        const urlParams = new URLSearchParams(window.location.search);
        const foodId = urlParams.get('id') ? parseInt(urlParams.get('id')) : 1;
        
        // Load initial food item
        await loadFoodItem(foodId);
    } catch (error) {
        console.error('Error loading foods:', error);
        showError('Failed to load food items. Please refresh the page.');
    }

    // Close mobile menu on link click
    document.querySelectorAll('.mobile-menu li').forEach(li => {
        li.addEventListener('click', () => {
            mobileMenu?.classList.remove('active');
        });
    });
});

// Load Food Item
async function loadFoodItem(foodId) {
    try {
        // Try to find in local cache first
        let food = foodsDB.find(f => f.id === foodId);
        
        // If not found, fetch from API
        if (!food) {
            food = await foodsAPI.getById(foodId);
        }
        
        if (food) {
            currentFoodId = foodId;
            
            // Update elements
            document.getElementById('foodImage').src = `images/${food.image}`;
            document.getElementById('foodTitle').textContent = food.name;
            document.getElementById('foodPrice').textContent = `$${food.price.toFixed(2)}`;
            document.getElementById('foodDescription').textContent = food.description;
            
            // Update tags
            const tags = document.querySelectorAll('.tag');
            const foodTags = food.tags || [];
            tags.forEach((tagEl, index) => {
                if (foodTags[index]) {
                    tagEl.textContent = foodTags[index];
                    tagEl.style.display = 'inline-block';
                } else {
                    tagEl.style.display = 'none';
                }
            });
            
            // Reset quantity
            document.getElementById('quantityInput').value = 1;
            
            // Close mobile menu if open
            document.querySelector('.mobile-menu')?.classList.remove('active');
            
            // Scroll to top
            window.scrollTo(0, 0);
            
            console.log(`✅ Loaded food item: ${food.name}`);
        } else {
            console.error('Food not found');
            showError('Food item not found');
        }
    } catch (error) {
        console.error('Error loading food item:', error);
        showError('Failed to load food item. Please try again.');
    }
}

// Show error message
function showError(message) {
    alert(message);
}

// Increase Quantity
function increaseQty() {
    const input = document.getElementById('quantityInput');
    input.value = parseInt(input.value) + 1;
}

// Decrease Quantity
function decreaseQty() {
    const input = document.getElementById('quantityInput');
    if (parseInt(input.value) > 1) {
        input.value = parseInt(input.value) - 1;
    }
}

// Add to Cart
async function addToCart() {
    if (!isAuthenticated()) {
        alert('Please login to add items to cart');
        window.location.href = 'index.html';
        return;
    }

    const food = foodsDB.find(f => f.id === currentFoodId);
    if (!food) {
        alert('Food item not found');
        return;
    }

    const quantity = parseInt(document.getElementById('quantityInput').value);
    const availability = document.getElementById('availability').value;
    
    if (availability === 'out-stock') {
        alert('❌ This item is out of stock!');
        return;
    }

    if (quantity <= 0) {
        alert('Please enter a valid quantity');
        return;
    }
    
    try {
        // Disable button
        const addBtn = document.querySelector('.add-to-cart-btn');
        addBtn.disabled = true;
        addBtn.textContent = 'Adding...';

        await cartAPI.add(currentFoodId, quantity);
        
        alert(`✅ Added ${quantity}x ${food.name} to cart!`);
        document.getElementById('quantityInput').value = 1;
        
        // Re-enable button
        addBtn.disabled = false;
        addBtn.textContent = 'Add to Cart';
        
        console.log('✅ Item added to cart');
    } catch (error) {
        console.error('Error adding to cart:', error);
        alert('Failed to add item to cart. Please try again.');
        const addBtn = document.querySelector('.add-to-cart-btn');
        addBtn.disabled = false;
        addBtn.textContent = 'Add to Cart';
    }
}

// Navigation Functions
function goToHome() {
    window.location.href = 'index.html';
}

function goToMenu() {
    window.location.href = 'food_item.html';
}

function goToOrder() {
    alert('🛒 Proceeding to order...');
}

function goBack() {
    window.history.back();
}

function closeItem() {
    goToHome();
}

console.log('✅ Food Item Page Script Loaded');