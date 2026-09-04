let cart = [];
let selectedDeliveryFee = 0;

const formspreeEndpoint =
  "https://formspree.io/f/mppanypa";


// =====================================
// ADD NORMAL ITEM
// =====================================

function addToOrder(name, price) {

  const existingItem =
    cart.find(item => item.name === name);

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

  const orderSection =
    document.getElementById("order");

  if (orderSection) {
    orderSection.scrollIntoView({
      behavior: "smooth"
    });
  }
}


// =====================================
// ADD OXTAIL WITH RICE CHOICE
// =====================================

function addOxtail(size, price) {

  const rice =
    document.getElementById("oxtailRice").value;

  const name =
    `Oxtail - ${size} - ${rice}`;

  addToOrder(name, price);
}


// =====================================
// CHANGE QUANTITY
// =====================================

function changeQuantity(index, amount) {

  if (!cart[index]) return;

  cart[index].quantity += amount;

  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
  }

  updateCart();
}


// =====================================
// REMOVE ITEM
// =====================================

function removeItem(index) {

  if (!cart[index]) return;

  cart.splice(index, 1);

  updateCart();
}


// =====================================
// FOOD SUBTOTAL
// =====================================

function getFoodTotal() {

  return cart.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );
}


// =====================================
// FINAL TOTAL
// =====================================

function getFinalTotal() {

  return getFoodTotal() + selectedDeliveryFee;
}


// =====================================
// CART DISPLAY
// =====================================

function updateCart() {

  const cartItems =
    document.getElementById("cartItems");

  const cartTotal =
    document.getElementById("cartTotal");

  const deliveryLine =
    document.getElementById("deliveryTotalLine");

  const deliveryTotal =
    document.getElementById("deliveryTotal");


  if (!cartItems || !cartTotal) {
    return;
  }


  if (cart.length === 0) {

    cartItems.innerHTML = `
      <p class="empty-cart">
        Your order is currently empty.
      </p>
    `;

  } else {

    cartItems.innerHTML = "";

    cart.forEach((item, index) => {

      const lineTotal =
        item.price * item.quantity;

      const div =
        document.createElement("div");

      div.className = "cart-item";

      div.innerHTML = `
        <div class="cart-item-left">

          <div class="cart-item-name">
            ${item.name}
          </div>

          <div class="quantity-controls">

            <button
              type="button"
              onclick="changeQuantity(${index}, -1)"
            >
              −
            </button>

            <span>
              ${item.quantity}
            </span>

            <button
              type="button"
              onclick="changeQuantity(${index}, 1)"
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

      cartItems.appendChild(div);
    });
  }


  if (deliveryLine && deliveryTotal) {

    if (selectedDeliveryFee > 0) {

      deliveryLine.style.display = "flex";

      deliveryTotal.textContent =
        `$${selectedDeliveryFee.toFixed(2)}`;

    } else {

      deliveryLine.style.display = "none";
    }
  }


  cartTotal.textContent =
    `$${getFinalTotal().toFixed(2)}`;
}


// =====================================
// CREATE ORDER SUMMARY
// =====================================

function createOrderSummary() {

  let summary = "";

  cart.forEach(item => {

    const amount =
      item.price * item.quantity;

    summary +=
      `${item.quantity} x ${item.name} - $${amount.toFixed(2)}\n`;
  });

  return summary;
}


// =====================================
// PAGE READY
// =====================================

document.addEventListener(
  "DOMContentLoaded",
  function () {


    const orderForm =
      document.getElementById("orderForm");

    const deliverySelect =
      document.getElementById("deliveryFee");

    const deliverySection =
      document.getElementById("deliveryFeeSelection");

    const fulfillmentOptions =
      document.querySelectorAll(
        'input[name="fulfillment"]'
      );


    // =================================
    // FULFILLMENT CHANGE
    // =================================

    fulfillmentOptions.forEach(option => {

      option.addEventListener(
        "change",
        function () {

          if (this.value === "Delivery") {

            if (deliverySection) {
              deliverySection.style.display =
                "block";
            }

            if (deliverySelect) {
              selectedDeliveryFee =
                Number(deliverySelect.value);
            }

          } else {

            if (deliverySection) {
              deliverySection.style.display =
                "none";
            }

            selectedDeliveryFee = 0;
          }

          updateCart();
        }
      );
    });


    // =================================
    // DELIVERY FEE CHANGE
    // =================================

    if (deliverySelect) {

      deliverySelect.addEventListener(
        "change",
        function () {

          selectedDeliveryFee =
            Number(this.value);

          updateCart();
        }
      );
    }


    // =================================
    // SUBMIT ORDER
    // =================================

    if (orderForm) {

      orderForm.addEventListener(
        "submit",
        async function (event) {

          event.preventDefault();


          if (cart.length === 0) {

            alert(
              "Please add at least one item to your order."
            );

            return;
          }


          const customerName =
            document
              .getElementById("customerName")
              .value
              .trim();

          const phone =
            document
              .getElementById("phone")
              .value
              .trim();

          const email =
            document
              .getElementById("email")
              .value
              .trim();

          const address =
            document
              .getElementById("address")
              .value
              .trim();

          const notes =
            document
              .getElementById("notes")
              .value
              .trim();

          const fulfillmentOption =
            document.querySelector(
              'input[name="fulfillment"]:checked'
            );


          if (!fulfillmentOption) {

            alert(
              "Please choose pickup, delivery, or meet halfway."
            );

            return;
          }


          const fulfillment =
            fulfillmentOption.value;


          // =================================
          // VALIDATION
          // =================================

          if (customerName === "") {

            alert(
              "Please enter your full name."
            );

            return;
          }


          if (phone === "") {

            alert(
              "Please enter your phone number."
            );

            return;
          }


          if (
            fulfillment === "Delivery" &&
            address === ""
          ) {

            alert(
              "Please enter your delivery address."
            );

            return;
          }


          if (
            fulfillment === "Meet Halfway" &&
            address === ""
          ) {

            alert(
              "Please enter your preferred meeting area."
            );

            return;
          }


          // =================================
          // TOTALS
          // =================================

          const foodTotal =
            getFoodTotal();

          const finalTotal =
            getFinalTotal();

          const summary =
            createOrderSummary();


          // =================================
          // ORDER EMAIL DATA
          // =================================

          const emailData = {

            subject:
              `New Oshuny Order - ${customerName}`,

            customer_name:
              customerName,

            customer_phone:
              phone,

            customer_email:
              email || "Not provided",

            fulfillment:
              fulfillment,

            address_or_meeting_area:
              address || "Not required",

            order_items:
              summary,

            food_subtotal:
              `$${foodTotal.toFixed(2)}`,

            delivery_fee:
              `$${selectedDeliveryFee.toFixed(2)}`,

            order_total:
              `$${finalTotal.toFixed(2)}`,

            special_instructions:
              notes || "None"
          };


          // =================================
          // SEND THROUGH FORMSPREE
          // =================================

          try {

            const response =
              await fetch(
                formspreeEndpoint,
                {
                  method: "POST",

                  headers: {
                    "Content-Type":
                      "application/json",

                    "Accept":
                      "application/json"
                  },

                  body:
                    JSON.stringify(emailData)
                }
              );


            if (!response.ok) {

              throw new Error(
                "Order submission failed."
              );
            }


            // =================================
            // SUCCESS MESSAGE
            // =================================

            alert(

              `Thank you, ${customerName}!\n\n` +

              `Your Oshuny order has been submitted.\n\n` +

              `Food: $${foodTotal.toFixed(2)}\n` +

              `${
                selectedDeliveryFee > 0
                  ? `Delivery: $${selectedDeliveryFee.toFixed(2)}\n`
                  : ""
              }` +

              `Total: $${finalTotal.toFixed(2)}\n\n` +

              `We will contact you at ${phone} to confirm availability and your order details.`
            );


            // =================================
            // RESET AFTER SUCCESS
            // =================================

            cart = [];

            selectedDeliveryFee = 0;

            orderForm.reset();


            if (deliverySection) {

              deliverySection.style.display =
                "none";
            }


            updateCart();


          } catch (error) {

            console.error(error);

            alert(
              "Your order could not be sent.\n\n" +
              "Please try again or contact Oshuny Caribbean Catering at 514-295-7170."
            );
          }

        }
      );
    }


    updateCart();

  }
);