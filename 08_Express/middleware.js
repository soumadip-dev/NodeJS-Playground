const express = require('express');

const app = express();
const port = 8080;

// Define global middleware function
const globalRequestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(
    `Global middleware executed. Method: ${req.method}, URL: ${req.url}, Timestamp: ${timestamp}`
  );
  next();
};

// Apply global middleware
app.use(globalRequestLogger);

// Home route
app.get('/', (req, res) => {
  res.send('Home page 🏠');
});

// Middleware specific to the About page
const aboutPageLogger = (req, res, next) => {
  console.log('Middleware for About page executed');
  next();
};

app.get('/about', aboutPageLogger, (req, res) => {
  res.send('About page ℹ️');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is listening on PORT: ${port}`);
});
