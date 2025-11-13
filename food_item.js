const foodsDB = [
    {
        id: 1,
        name: 'The Classic Burger',
        price: 15.99,
        image: 'product-1.jpg',
        description: 'A delicious handmade burger made with premium beef, topped with melted cheddar cheese, fresh lettuce, juicy tomato, crispy bacon, and our special sauce. Served with crispy fries and a refreshing drink. Perfect for lunch or dinner!',
        tags: ['Beef Patty', 'Cheddar Cheese', 'Lettuce']
    },
    {
        id: 2,
        name: 'Brownies',
        price: 20.99,
        image: 'product-2.jpg',
        description: 'Rich and fudgy chocolate brownies made with premium cocoa and topped with chocolate chips. Fresh baked daily for the perfect moist and chewy texture.',
        tags: ['Chocolate', 'Dessert', 'Premium']
    },
    {
        id: 3,
        name: 'Puff Pastry',
        price: 12.99,
        image: 'product-3.jpg',
        description: 'Delicate and buttery puff pastry with layers of crispy golden goodness. Perfect with coffee or as a light snack.',
        tags: ['Pastry', 'Butter', 'Fresh Baked']
    },
    {
        id: 4,
        name: 'Doughnuts',
        price: 14.99,
        image: 'product-1.jpg',
        description: 'Fresh glazed doughnuts made daily with premium ingredients. Soft, fluffy, and perfectly sweet.',
        tags: ['Glazed', 'Donuts', 'Sweet']
    }
];

let currentFoodId = 1;
let cartItems = [];

// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', () => {
    const menuIcon = document.querySelector('.menu-icon');
    const mobileMenu = document.querySelector('.mobile-menu');

    menuIcon?.addEventListener('click', () => {
        mobileMenu?.classList.toggle('active');
    });

    // Load initial food item
    loadFoodItem(1);

    // Close mobile menu on link click
    document.querySelectorAll('.mobile-menu li').forEach(li => {
        li.addEventListener('click', () => {
            mobileMenu?.classList.remove('active');
        });
    });
});

// Load Food Item
function loadFoodItem(foodId) {
    const food = foodsDB.find(f => f.id === foodId);
    
    if (food) {
        currentFoodId = foodId;
        
        // Update elements
        document.getElementById('foodImage').src = `images/${food.image}`;
        document.getElementById('foodTitle').textContent = food.name;
        document.getElementById('foodPrice').textContent = `$${food.price.toFixed(2)}`;
        document.getElementById('foodDescription').textContent = food.description;
        
        // Update tags
        const tags = document.querySelectorAll('.tag');
        food.tags.forEach((tag, index) => {
            if (tags[index]) {
                tags[index].textContent = tag;
            }
        });
        
        // Reset quantity
        document.getElementById('quantityInput').value = 1;
        
        // Close mobile menu if open
        document.querySelector('.mobile-menu')?.classList.remove('active');
        
        // Scroll to top
        window.scrollTo(0, 0);
        
        console.log(`✅ Loaded food item: ${food.name}`);
    }
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
function addToCart() {
    const food = foodsDB.find(f => f.id === currentFoodId);
    const quantity = parseInt(document.getElementById('quantityInput').value);
    const availability = document.getElementById('availability').value;
    
    if (availability === 'out-stock') {
        alert('❌ This item is out of stock!');
        return;
    }
    
    const cartItem = {
        id: food.id,
        name: food.name,
        price: food.price,
        image: food.image,
        quantity: quantity,
        addedAt: new Date().toLocaleString()
    };
    
    cartItems.push(cartItem);
    localStorage.setItem('foodCart', JSON.stringify(cartItems));
    
    alert(`✅ Added ${quantity}x ${food.name} to cart!`);
    document.getElementById('quantityInput').value = 1;
    
    console.log('Cart:', cartItems);
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