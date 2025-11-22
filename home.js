    const menuIcon = document.querySelector(".menu-icon");
    const mobileMenu = document.querySelector(".mobile-menu");

    menuIcon.addEventListener("click", () => {
      mobileMenu.classList.toggle("active");

      const icon = menuIcon.querySelector("i");
      icon.classList.toggle("fa-bars");
      icon.classList.toggle("fa-xmark");
    });

    // Close mobile menu when clicking on a link
    const mobileLinks = document.querySelectorAll(".mobile-menu ul li");
    mobileLinks.forEach(link => {
      link.addEventListener("click", () => {
        mobileMenu.classList.remove("active");
        const icon = menuIcon.querySelector("i");
        icon.classList.add("fa-bars");
        icon.classList.remove("fa-xmark");
      });
    });

    // Load featured dishes from API
    async function loadFeaturedDishes() {
      try {
        const foods = await foodsAPI.getAll();
        const featuredContainer = document.querySelector('.dish-container');
        
        if (featuredContainer && foods.length > 0) {
          // Show first 3 foods as featured
          const featuredFoods = foods.slice(0, 3);
          
          featuredContainer.innerHTML = featuredFoods.map(food => `
            <div class="dish-card">
              <img src="images/${food.image}" alt="${food.name}" />
              <h3>${food.name}</h3>
              <p>$${food.price.toFixed(2)}</p>
              <button><a class="button" href="food_item.html?id=${food.id}">Book Now</a></button>
            </div>
          `).join('');
        }
      } catch (error) {
        console.error('Error loading featured dishes:', error);
      }
    }

    // Load featured dishes on page load
    loadFeaturedDishes();