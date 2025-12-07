// Check whether products are available in the inventory
function checkInventory(callback) {
  setTimeout(() => {
    console.log('Checking inventory 📦');
    callback();
  }, 2000);
}

// Create a new order after the inventory is confirmed
function createOrder(callback) {
  setTimeout(() => {
    console.log('Creating order 📝');
    const error = new Error('Order creation failed ❌');
    callback(error);
  }, 1000);
}

// Charge the customer for the order
function chargePayment(callback) {
  setTimeout(() => {
    console.log('Charging payment 💳');
    const error = null;
    const chargedAmount = 100;
    callback(error, chargedAmount);
  }, 2000);
}

// Send the invoice to the customer
function sendInvoice(callback) {
  setTimeout(() => {
    console.log('Sending invoice 📧');
    callback();
  }, 1000);
}

function main() {
  // Callback hell (also known as the pyramid of doom )
  checkInventory(() => {
    createOrder(error => {
      if (error) {
        console.error('Error while creating order:', error.message);
        // return;
      }

      chargePayment((error, chargedAmount) => {
        if (error) {
          console.error('Error while charging payment:', error.message);
          return;
        }

        console.log('Charged amount: ₹', chargedAmount);

        sendInvoice(() => {
          console.log('All operations completed ✅');
        });
      });
    });
  });

  // Other tasks can continue executing in parallel
  console.log('Processing other requests ⚙️');
}

main();
