// Check whether products are available in the inventory
function checkInventory() {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log('Checking inventory 📦');
      resolve();
    }, 2000);
  });
}

// Create a new order after the inventory is confirmed
function createOrder() {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log('Creating order 📝');
      resolve();
    }, 1000);
  });
}

// Charge the customer for the order
function chargePayment() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('Charging payment 💳');
      // Simulate a payment failure
      reject(new Error('Payment failed ❌'));
    }, 2000);
  });
}

// Send the invoice to the customer
function sendInvoice() {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log('Sending invoice 📧');
      resolve();
    }, 1000);
  });
}

function main() {
  checkInventory()
    .then(createOrder)
    .then(chargePayment)
    .then(sendInvoice)
    .then(() => {
      console.log('All operations completed ✅');
    })
    .catch(error => {
      console.error('Error occurred:', error.message);
    });

  // Other tasks can continue executing in parallel
  console.log('Processing other requests ⚙️');
}

main();
