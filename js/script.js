"use strict";

// script for dark navbar when scrolled
document.addEventListener("DOMContentLoaded", function () {
  let navbar = document.querySelector(".navbar");

  window.addEventListener("scroll", function () {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  let productsContainer = document.querySelector(".products");
  let cartCountElement = document.querySelector(".cart-num");
  let cartCount = localStorage.getItem("cartCount")
    ? parseInt(localStorage.getItem("cartCount"))
    : 0;

  // Initialize cart count from local storage
  cartCountElement.textContent = cartCount;

  // Function to update the cart count
  function updateCartCount() {
    cartCount += 1;
    cartCountElement.textContent = cartCount;
    localStorage.setItem("cartCount", cartCount);
  }

  // Function to fetch products and display them
  async function fetchProducts(url) {
    try {
      let response = await fetch(url);
      let products = await response.json();

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
                  <h4 class="card-category text-uppercase fs-6 mb-3">${product.category}</h4>
                  <p class="card-text fs-5 fw-bold">$${product.price}</p>
                  <a href="#!" data-product-id="${product.id}" class="btn btn-primary btn-1 add-to-cart-btn fs-6">
                    <i class="bi bi-cart3 fs-6 pe-2"></i>Add to Cart
                  </a>
                </div>
              </div>
            </a>
          </div>
        `;

        productsContainer.innerHTML += productCard;
      });

      // Attach event listeners to "Add to Cart" buttons
      document.querySelectorAll(".add-to-cart-btn").forEach((button) => {
        button.addEventListener("click", function (event) {
          event.preventDefault(); // Prevent the default action
          updateCartCount();
        });
      });

      // Attach event listeners to product cards
      document.querySelectorAll(".product-card").forEach((card) => {
        card.addEventListener("click", function (event) {
          event.preventDefault(); // Prevent the default action
          const productId = this.getAttribute("data-product-id");
          const product = products.find((prod) => prod.id == productId);
          populateModal(product);
        });
      });
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  }

  // Function to populate the modal with product details
  function populateModal(product) {
    document.getElementById("modalProductImage").src = product.image;
    document.getElementById("modalProductTitle").textContent = product.title;
    document.getElementById("modalProductCategory").textContent =
      product.category;
    document.getElementById("modalProductDescription").textContent =
      product.description;
    document.getElementById("modalProductPrice").textContent = product.price;
    document
      .getElementById("modalAddToCartBtn")
      .setAttribute("data-product-id", product.id);
  }

  fetchProducts("https://fakestoreapi.com/products?limit=12");
});

// Function for product categories
document.addEventListener("DOMContentLoaded", function () {
  let categoriesContainer = document.querySelector(".categories");
  let modalBody = document.querySelector(".products-modal-body");
  let modalTitle = document.getElementById("productsModalLabel");
  let cartCountElement = document.querySelector(".cart-num");
  let cartCount = localStorage.getItem("cartCount")
    ? parseInt(localStorage.getItem("cartCount"))
    : 0;

  // Initialize cart count from local storage
  cartCountElement.textContent = cartCount;

  // Function to update the cart count
  function updateCartCount() {
    cartCount += 1;
    cartCountElement.textContent = cartCount;
    localStorage.setItem("cartCount", cartCount);
  }

  async function fetchCategories() {
    try {
      let data = await fetch("https://fakestoreapi.com/products/categories");
      let categories = await data.json();

      categoriesContainer.innerHTML = categories
        .map(
          (category) => `
          <div class="col-lg-4 col-sm-6 mb-4">
            <div class="card h-100">
              <div class="card-body text-center">
                <h4 class="card-category text-uppercase fs-5 fw-bold">${category}</h4>
                <a href="#" class="btn btn-outline-primary mt-3" data-category="${category}" data-bs-toggle="modal" data-bs-target="#productsModal">View Products</a>
              </div>
            </div>
          </div>
        `
        )
        .join("");

      addCategoryClickListeners();
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }

  function addCategoryClickListeners() {
    const categoryButtons = document.querySelectorAll("[data-category]");
    categoryButtons.forEach((button) =>
      button.addEventListener("click", function () {
        const category = this.getAttribute("data-category");
        modalTitle.innerText = `Products in ${category}`;
        fetchProductsByCategory(category);
      })
    );
  }

  async function fetchProductsByCategory(category) {
    try {
      let data = await fetch(
        `https://fakestoreapi.com/products/category/${category}`
      );
      let products = await data.json();

      modalBody.innerHTML = products
        .map(
          (product) => `
          <div class="col-md-6 mb-4">
            <div class="card h-100">
              <img 
                src="${product.image}" 
                class="card-img-top img-fluid" 
                style="height: 15rem; object-fit: contain;" 
                alt="${product.title}" 
              />
              <div class="card-body text-center">
                <h5 class="card-title">${product.title}</h5>
                <p class="card-text">$${product.price}</p>
                <a href="#" class="btn btn-primary add-to-cart-btn" data-productId="${product.id}">Add to Cart</a>
              </div>
            </div>
          </div>
        `
        )
        .join("");

      // Attach event listeners to "Add to Cart" buttons in the modal
      document.querySelectorAll(".add-to-cart-btn").forEach((button) => {
        button.addEventListener("click", function () {
          updateCartCount();
        });
      });
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }

  fetchCategories();
});
