document.addEventListener("DOMContentLoaded", function () {
  const cart = JSON.parse(localStorage.getItem("cartItems")) || [];

  // Function to update the order summary
  function updateOrderSummary() {
    const orderSummaryContainer = document.getElementById("orderSummary");
    const orderTotalElement = document.getElementById("orderTotal");
    orderSummaryContainer.innerHTML = "";
    if (cart.length > 0) {
      cart.forEach((item) => {
        orderSummaryContainer.innerHTML += `
          <li class="list-group-item d-flex justify-content-between align-items-center">
            <div class="d-flex align-items-center">
              <img src="${item.image}" alt="${item.title}" class="img-thumbnail me-3" style="width: 50px; height: 50px; object-fit: cover;">
              ${item.title}
            </div>
            <span class="fw-bold">$${item.price}</span>
          </li>`;
      });

      const total = cart.reduce((sum, item) => sum + item.price, 0).toFixed(2);
      orderTotalElement.textContent = total;
    } else {
      orderSummaryContainer.innerHTML = '<li class="list-group-item">Your cart is empty.</li>';
      orderTotalElement.textContent = "0.00";
    }
  }

  // Call this function when the page loads
  updateOrderSummary();
});
