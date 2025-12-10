const express = require('express');
const path = require('path');

const app = express();
const port = 8080;

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Set the directory for view templates
app.set('views', path.join(__dirname, 'views'));

// Sample product data
const productsList = [
  { id: 1, label: 'Product 1 🛒' },
  { id: 2, label: 'Product 2 🛍️' },
  { id: 3, label: 'Product 3 📦' },
  { id: 4, label: 'Product 4 🎁' },
];

// Home route
app.get('/', (req, res) => {
  res.render('home', { title: 'Home Page', products: productsList });
});

// About route
app.get('/about', (req, res) => {
  res.render('about', { title: 'About Page' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is listening on PORT: ${port}`);
});
