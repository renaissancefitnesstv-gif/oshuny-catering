let cart = [];

// ===============================
// ADD ITEM TO CART
// ===============================

function addToOrder(name, price) {
  const existingItem = cart.find(item => item.name === name);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      name: name,
      price: price,
      quantity: 1
    });
  }

  updateCart();

  // Scroll user toward the order section
  const orderSection = document.getElementById("order");

  if (orderSection) {
    orderSection.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }
}


// ===============================
// UPDATE CART DISPLAY
// ===============================

function updateCart() {
  const cartItems = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");

  if (!cartItems || !cartTotal) {
    return;
  }

  if (cart.length === 0) {
    cartItems.innerHTML = `
      <p class="empty-cart">
        Your order is currently empty.
      </p>
    `;

    cartTotal.textContent = "$0.00";
    return;
  }

  cartItems.innerHTML = "";

  let total = 0;

  cart.forEach((item, index) => {
    const lineTotal = item.price * item.quantity;

    total += lineTotal;

    const cartItem = document.createElement("div");

    cartItem.classList.add("cart-item");

    cartItem.innerHTML = `
      <div class="cart-item-left">

        <div class="cart-item-name">
          ${item.name}
        </div>

        <div class="quantity-controls">

          <button
            type="button"
            onclick="changeQuantity(${index}, -1)"
            aria-label="Decrease quantity"
          >
            −
          </button>

          <span>
            ${item.quantity}
          </span>

          <button
            type="button"
            onclick="changeQuantity(${index}, 1)"
            aria-label="Increase quantity"
          >
            +
          </button>

        </div>

      </div>

      <div class="cart-item-right">

        <div class="cart-item-price">
          $${lineTotal.toFixed(2)}
        </div>

        <button
          type="button"
          class="remove-btn"
          onclick="removeItem(${index})"
        >
          Remove
        </button>

      </div>
    `;

    cartItems.appendChild(cartItem);
  });

  cartTotal.textContent = `$${total.toFixed(2)}`;
}


// ===============================
// CHANGE QUANTITY
// ===============================

function changeQuantity(index, amount) {
  if (!cart[index]) {
    return;
  }

  cart[index].quantity += amount;

  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
  }

  updateCart();
}


// ===============================
// REMOVE ITEM
// ===============================

function removeItem(index) {
  if (!cart[index]) {
    return;
  }

  cart.splice(index, 1);

  updateCart();
}


// ===============================
// GET ORDER TOTAL
// ===============================

function getOrderTotal() {
  let total = 0;

  cart.forEach(item => {
    total += item.price * item.quantity;
  });

  return total;
}


// ===============================
// CREATE ORDER SUMMARY
// ===============================

function createOrderSummary() {
  let summary = "";

  cart.forEach(item => {
    const lineTotal = item.price * item.quantity;

    summary +=
      `${item.quantity} x ${item.name} - $${lineTotal.toFixed(2)}\n`;
  });

  return summary;
}


// ===============================
// ORDER FORM
// ===============================

document.addEventListener("DOMContentLoaded", function () {
  const orderForm = document.getElementById("orderForm");

  if (!orderForm) {
    return;
  }

  orderForm.addEventListener("submit", function (event) {
    event.preventDefault();

    // Make sure food is selected
    if (cart.length === 0) {
      alert(
        "Please add at least one menu item before submitting your order."
      );

      return;
    }


    // ===============================
    // CUSTOMER INFO
    // ===============================

    const customerName =
      document.getElementById("customerName").value.trim();

    const phone =
      document.getElementById("phone").value.trim();

    const email =
      document.getElementById("email").value.trim();

    const address =
      document.getElementById("address").value.trim();

    const notes =
      document.getElementById("notes").value.trim();


    const fulfillmentInput =
      document.querySelector(
        'input[name="fulfillment"]:checked'
      );

    const fulfillment =
      fulfillmentInput
        ? fulfillmentInput.value
        : "Pickup";


    // ===============================
    // VALIDATION
    // ===============================

    if (customerName === "") {
      alert("Please enter your full name.");
      return;
    }

    if (phone === "") {
      alert("Please enter your phone number.");
      return;
    }


    // If delivery is selected, require address
    if (
      fulfillment === "Delivery" &&
      address === ""
    ) {
      alert(
        "Please enter a delivery address."
      );

      return;
    }


    // If meet halfway, require location
    if (
      fulfillment === "Meet Halfway" &&
      address === ""
    ) {
      alert(
        "Please enter your preferred meeting area."
      );

      return;
    }


    // ===============================
    // ORDER INFORMATION
    // ===============================

    const total =
      getOrderTotal();

    const orderSummary =
      createOrderSummary();


    // ===============================
    // FULL ORDER MESSAGE
    // ===============================

    const fullOrder = `
OSHUNY CARIBBEAN CATERING
--------------------------------

CUSTOMER INFORMATION

Name:
${customerName}

Phone:
${phone}

Email:
${email || "Not provided"}

FULFILLMENT

${fulfillment}

Address / Meeting Area:
${address || "Not required"}

ORDER
--------------------------------

${orderSummary}

TOTAL:
$${total.toFixed(2)}

SPECIAL INSTRUCTIONS

${notes || "None"}

--------------------------------
Weekend Pre-Order
Orders close Thursday at 8 PM
Saturday Service: 2 PM - 6 PM
    `;


    // For testing in browser console
    console.log(fullOrder);


    // ===============================
    // SUCCESS MESSAGE
    // ===============================

    alert(
      `Thank you, ${customerName}!\n\n` +
      `Your Oshuny pre-order has been created.\n\n` +
      `Order Total: $${total.toFixed(2)}\n` +
      `Fulfillment: ${fulfillment}\n\n` +
      `We will contact you at ${phone} to confirm your order.`
    );


    // ===============================
    // RESET ORDER
    // ===============================

    cart = [];

    updateCart();

    orderForm.reset();
  });
});


// ===============================
// AUTO UPDATE CART WHEN PAGE LOADS
// ===============================

document.addEventListener("DOMContentLoaded", function () {
  updateCart();
});