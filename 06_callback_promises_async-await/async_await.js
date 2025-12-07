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
      const orderAmount = 5; // total number of items in the order
      resolve(orderAmount);
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

async function main() {
  try {
    await checkInventory();
    const orderAmount = await createOrder();
    console.log('Order quantity:', orderAmount);
    await chargePayment();
    await sendInvoice();

    console.log('All operations completed ✅');
  } catch (error) {
    console.error('An error occurred:', error.message);
  }
}

main();
