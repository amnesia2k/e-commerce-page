"use strict";

document.addEventListener("DOMContentLoaded", function () {
  // Variables
  let navbar = document.querySelector(".navbar");
  let heroSection = document.getElementById("heroSection");
  let backToTopBtn = document.querySelector(".btt-btn");
  let productsContainer = document.querySelector(".products");
  let cartCountElement = document.querySelector(".cart-num");
  let cartItemsContainer = document.querySelector(".cart-items");
  let cartTotal = document.getElementById("cartTotal");
  let modalBody = document.querySelector(".products-modal-body");
  let modalTitle = document.getElementById("productsModalLabel");

  // Cart array to store items
  let cart = JSON.parse(localStorage.getItem("cartItems")) || [];

  // Initialize cart count and cart modal from local storage
  updateCartCount();
  updateCartModal();

  // Function to update the cart count
  function updateCartCount() {
    let cartCount = cart.length;
    cartCountElement.textContent = cartCount;
    localStorage.setItem("cartItems", JSON.stringify(cart));
  }

  // Function to update the cart modal and total
  function updateCartModal() {
    cartItemsContainer.innerHTML = "";
    if (cart.length > 0) {
      cart.forEach((item) => {
        cartItemsContainer.innerHTML += `
        <li class="list-group-item d-flex justify-content-between align-items-center">
          <div class="d-flex align-items-center">
            <img src="${item.image}" alt="${item.title}" class="img-thumbnail me-3" style="width: 50px; height: 50px; object-fit: cover;">
            ${item.title}
          </div>
          <span class="fw-bold">$${item.price}</span>
        </li>`;
      });

      const total = cart.reduce((sum, item) => sum + item.price, 0).toFixed(2);
      cartTotal.textContent = total;
    } else {
      cartItemsContainer.innerHTML =
        '<li class="list-group-item">Your cart is empty.</li>';
      cartTotal.textContent = "0.00";
    }
  }

  // Scroll Event Listener
  window.addEventListener("scroll", function () {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }

    // Toggle back-to-top button
    let heroSectionHeight = heroSection.offsetHeight;
    if (window.scrollY > heroSectionHeight) {
      backToTopBtn.style.display = "block";
    } else {
      backToTopBtn.style.display = "none";
    }
  });

  // Function to fetch products
  async function fetchProducts(url) {
    try {
      let response = await fetch(url);
      let products = await response.json();
      displayProducts(products);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  }

  // Function to display products
  function displayProducts(products) {
    productsContainer.innerHTML = "";
    products.forEach((product) => {
      let productCard = `
          <div class="col-lg-4 col-sm-6 mb-4">
            <a href="#!" data-bs-toggle="modal" data-bs-target="#productModal" class="text-decoration-none text-dark product-card" data-product-id="${product.id}">
              <div class="card h-100">
                <img 
                  src="${product.image}" 
                  class="card-img-top img-fluid" 
                  style="height: 15rem; object-fit: contain; padding: 1rem;" 
                  alt="${product.title}" 
                />
                <div class="card-body text-center">
                  <h2 class="card-title fs-5 fw-bolder mb-2">${product.title}</h2>
                  <h4 class="card-category text-uppercase fs-6 fw-medium mb-3">${product.category}</h4>
                  <p class="card-text fs-5 pb-2 fw-bold">$${product.price}</p>
                  <a href="#!" data-product-id="${product.id}" class="btn btn-primary btn-1 add-to-cart-btn fs-6">
                    <i class="bi bi-cart3 fs-6 fw-bold pe-2"></i>Add to Cart
                  </a>
                </div>
              </div>
            </a>
          </div>
        `;
      productsContainer.innerHTML += productCard;
    });

    attachProductListeners(products);
  }

  // Attach event listeners to product cards and "Add to Cart" buttons
  function attachProductListeners(products) {
    document.querySelectorAll(".product-card").forEach((card) => {
      card.addEventListener("click", function (event) {
        event.preventDefault();
        const productId = this.getAttribute("data-product-id");
        const product = products.find((prod) => prod.id == productId);
        populateModal(product);
      });
    });

    document.querySelectorAll(".add-to-cart-btn").forEach((button) => {
      button.addEventListener("click", function (event) {
        event.preventDefault();
        const productId = this.getAttribute("data-product-id");
        const product = products.find((prod) => prod.id == productId);
        addToCart(product);
      });
    });
  }

  // Function to populate the modal with product details
  function populateModal(product) {
    document.getElementById("modalProductImage").src = product.image;
    document.getElementById("modalProductTitle").textContent = product.title;
    document.getElementById("modalProductCategory").textContent =
      product.category;
    document.getElementById("modalProductDescription").textContent =
      product.description;
    document.getElementById(
      "modalProductPrice"
    ).textContent = `$${product.price}`;
    document
      .getElementById("modalAddToCartBtn")
      .setAttribute("data-product-id", product.id);
  }

  // Function to add items to the cart
  function addToCart(product) {
    cart.push(product);
    updateCartCount();
    updateCartModal();
  }

  // Event listener for the "Delete All" button
  document.getElementById("clearCartBtn").addEventListener("click", () => {
    cart = [];
    updateCartCount();
    updateCartModal();
  });

  // Initial fetch calls
  fetchProducts("https://fakestoreapi.com/products");

  // Initial cart update
  updateCartModal();
});
