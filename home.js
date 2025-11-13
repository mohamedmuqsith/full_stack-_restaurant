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