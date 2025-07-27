document.addEventListener("DOMContentLoaded", function () {
  // Mobile Menu Toggle
  const mobileMenuBtn = document.querySelector(".mobile-menu");
  const navMenu = document.querySelector("nav ul");

  mobileMenuBtn.addEventListener("click", function () {
    navMenu.classList.toggle("active");
    mobileMenuBtn.innerHTML = navMenu.classList.contains("active")
      ? '<i class="fas fa-times"></i>'
      : '<i class="fas fa-bars"></i>';
  });

  // Close mobile menu when clicking on a link
  const navLinks = document.querySelectorAll("nav ul li a");
  navLinks.forEach((link) => {
    link.addEventListener("click", function () {
      if (navMenu.classList.contains("active")) {
        navMenu.classList.remove("active");
        mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
      }
    });
  });

  // Header scroll effect
  const header = document.querySelector("header");
  window.addEventListener("scroll", function () {
    if (window.scrollY > 100) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });

  // Cart functionality
  const cartIcon = document.getElementById("cart-icon");
  const cartSidebar = document.getElementById("cart-sidebar");
  const closeCart = document.querySelector(".close-cart");
  const overlay = document.createElement("div");
  overlay.className = "overlay";
  document.body.appendChild(overlay);

  cartIcon.addEventListener("click", function (e) {
    e.preventDefault();
    cartSidebar.classList.add("active");
    overlay.classList.add("active");
    document.body.style.overflow = "hidden";
  });

  closeCart.addEventListener("click", function () {
    cartSidebar.classList.remove("active");
    overlay.classList.remove("active");
    document.body.style.overflow = "";
  });

  overlay.addEventListener("click", function () {
    cartSidebar.classList.remove("active");
    overlay.classList.remove("active");
    document.body.style.overflow = "";
  });

  // Initialize cart
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  updateCartCount();

  // Display products
  displayFeaturedProducts();
  displayAllProducts();

  // Filter products
  const categoryFilter = document.getElementById("category-filter");
  const priceFilter = document.getElementById("price-filter");

  categoryFilter.addEventListener("change", filterProducts);
  priceFilter.addEventListener("change", filterProducts);

  // Contact form submission
  const contactForm = document.getElementById("contactForm");
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const subject = document.getElementById("subject").value;
    const message = document.getElementById("message").value;

    // Here you would typically send the form data to a server
    console.log("Form submitted:", { name, email, subject, message });

    // Show success message
    alert("Thank you for your message! We will get back to you soon.");
    contactForm.reset();
  });

  // Newsletter form submission
  const newsletterForm = document.getElementById("newsletterForm");
  newsletterForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const email = newsletterForm.querySelector('input[type="email"]').value;

    // Here you would typically send the email to a server
    console.log("Newsletter subscription:", email);

    // Show success message
    alert("Thank you for subscribing to our newsletter!");
    newsletterForm.reset();
  });

  // Functions
  function displayFeaturedProducts() {
    const featuredContainer = document.getElementById("featured-products");
    featuredContainer.innerHTML = "";

    // Get 4 random featured products
    const featuredProducts = [...products]
      .sort(() => 0.5 - Math.random())
      .slice(0, 4);

    featuredProducts.forEach((product) => {
      featuredContainer.appendChild(createProductCard(product));
    });

    // Add event listeners to "Add to Cart" buttons
    addCartEventListeners();
  }

  function displayAllProducts() {
    const allProductsContainer = document.getElementById("all-products");
    allProductsContainer.innerHTML = "";

    products.forEach((product) => {
      allProductsContainer.appendChild(createProductCard(product));
    });

    // Add event listeners to "Add to Cart" buttons
    addCartEventListeners();
  }

  function filterProducts() {
    const category = categoryFilter.value;
    const priceRange = priceFilter.value;
    const allProductsContainer = document.getElementById("all-products");

    let filteredProducts = [...products];

    // Filter by category
    if (category !== "all") {
      filteredProducts = filteredProducts.filter(
        (product) => product.category === category
      );
    }

    // Filter by price
    if (priceRange !== "all") {
      const [min, max] = priceRange.split("-").map(Number);

      if (priceRange === "500+") {
        filteredProducts = filteredProducts.filter(
          (product) => product.price >= 500
        );
      } else {
        filteredProducts = filteredProducts.filter(
          (product) => product.price >= min && product.price <= max
        );
      }
    }

    // Display filtered products
    allProductsContainer.innerHTML = "";
    filteredProducts.forEach((product) => {
      allProductsContainer.appendChild(createProductCard(product));
    });

    // Add event listeners to "Add to Cart" buttons
    addCartEventListeners();
  }

  function createProductCard(product) {
    const productCard = document.createElement("div");
    productCard.className = "product-card";
    productCard.innerHTML = `
            <div class="product-img">
                <img src="${product.image}" alt="${product.name}">
                ${product.isNew ? '<span class="product-badge">New</span>' : ""}
                ${
                  product.discount
                    ? `<span class="product-badge" style="background: var(--success-color);">${product.discount}% Off</span>`
                    : ""
                }
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="product-price">
                    <div>
                        ${
                          product.oldPrice
                            ? `<span class="old-price">$${product.oldPrice.toFixed(
                                2
                              )}</span>`
                            : ""
                        }
                        <span class="price">$${product.price.toFixed(2)}</span>
                    </div>
                    <button class="add-to-cart" data-id="${product.id}">
                        <i class="fas fa-shopping-cart"></i>
                    </button>
                </div>
            </div>
        `;
    return productCard;
  }

  function addCartEventListeners() {
    const addToCartButtons = document.querySelectorAll(".add-to-cart");

    addToCartButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const productId = parseInt(this.getAttribute("data-id"));
        const product = products.find((p) => p.id === productId);

        if (product) {
          addToCart(product);
          animateAddToCart(this);
        }
      });
    });
  }

  function addToCart(product) {
    const existingItem = cart.find((item) => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        ...product,
        quantity: 1,
      });
    }

    updateCart();
  }

  function updateCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    updateCartSidebar();
  }

  function updateCartCount() {
    const cartCount = document.getElementById("cart-count");
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
  }

  function updateCartSidebar() {
    const cartItemsContainer = document.getElementById("cart-items");
    const cartTotalElement = document.getElementById("cart-total");

    if (cart.length === 0) {
      cartItemsContainer.innerHTML =
        '<p class="empty-cart">Your cart is empty</p>';
      cartTotalElement.textContent = "$0.00";
      return;
    }

    cartItemsContainer.innerHTML = "";

    let total = 0;

    cart.forEach((item) => {
      const itemTotal = item.price * item.quantity;
      total += itemTotal;

      const cartItemElement = document.createElement("div");
      cartItemElement.className = "cart-item";
      cartItemElement.innerHTML = `
                <div class="cart-item-img">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                    <div class="cart-item-quantity">
                        <button class="decrease-quantity" data-id="${
                          item.id
                        }">-</button>
                        <span>${item.quantity}</span>
                        <button class="increase-quantity" data-id="${
                          item.id
                        }">+</button>
                    </div>
                </div>
                <button class="remove-item" data-id="${item.id}">
                    <i class="fas fa-trash"></i>
                </button>
            `;

      cartItemsContainer.appendChild(cartItemElement);
    });

    // Add event listeners to quantity buttons
    document.querySelectorAll(".decrease-quantity").forEach((button) => {
      button.addEventListener("click", function () {
        const productId = parseInt(this.getAttribute("data-id"));
        updateQuantity(productId, -1);
      });
    });

    document.querySelectorAll(".increase-quantity").forEach((button) => {
      button.addEventListener("click", function () {
        const productId = parseInt(this.getAttribute("data-id"));
        updateQuantity(productId, 1);
      });
    });

    // Add event listeners to remove buttons
    document.querySelectorAll(".remove-item").forEach((button) => {
      button.addEventListener("click", function () {
        const productId = parseInt(this.getAttribute("data-id"));
        removeFromCart(productId);
      });
    });

    cartTotalElement.textContent = `$${total.toFixed(2)}`;

    // Add checkout button event listener
    const checkoutBtn = document.querySelector(".checkout-btn");
    checkoutBtn.addEventListener("click", function () {
      alert(
        "Proceeding to checkout! This would typically redirect to a checkout page."
      );
    });
  }

  function updateQuantity(productId, change) {
    const itemIndex = cart.findIndex((item) => item.id === productId);

    if (itemIndex !== -1) {
      cart[itemIndex].quantity += change;

      if (cart[itemIndex].quantity <= 0) {
        cart.splice(itemIndex, 1);
      }

      updateCart();
    }
  }

  function removeFromCart(productId) {
    cart = cart.filter((item) => item.id !== productId);
    updateCart();
  }

  function animateAddToCart(button) {
    button.style.transform = "scale(1.3)";
    button.style.backgroundColor = "var(--success-color)";

    setTimeout(() => {
      button.style.transform = "scale(1)";
      button.style.backgroundColor = "var(--primary-color)";
    }, 300);
  }

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: "smooth",
        });
      }
    });
  });
});
