const express = require('express');

const app = express();
const port = 8080;

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to our home page 🏡');
});

// Products route
app.get('/products', (req, res) => {
  const products = [
    { id: 1, label: 'Product 1 🛒' },
    { id: 2, label: 'Product 2 🛍️' },
    { id: 3, label: 'Product 3 📦' },
    { id: 4, label: 'Product 4 🎁' },
  ];
  res.json(products);
});

// Get a single product (dynamic route)
app.get('/products/:id', (req, res) => {
  const productID = parseInt(req.params.id);

  const products = [
    { id: 1, label: 'Product 1 🛒' },
    { id: 2, label: 'Product 2 🛍️' },
    { id: 3, label: 'Product 3 📦' },
    { id: 4, label: 'Product 4 🎁' },
  ];

  const singleProduct = products.find(product => product.id === productID);

  if (singleProduct) {
    res.status(200).json({
      message: 'Product fetched successfully ✅',
      data: singleProduct,
      success: true,
    });
  } else {
    res.status(404).json({
      message: 'Product not found ❌',
      data: null,
      success: false,
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is listening on PORT: ${port}`);
});
