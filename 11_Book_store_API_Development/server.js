const dotenv = require('dotenv');
const express = require('express');
const connectDatabase = require('./database/db.js');
const booksRoutes = require('./routes/book.routes.js');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware to parse incoming JSON requests
app.use(express.json());

// Home route
app.get('/', (req, res) => {
  res.json({
    message: 'Home Route',
  });
});

//Routes
app.use('/api/books', booksRoutes);

// Function to start the server after database connection
const startServer = async () => {
  try {
    await connectDatabase();
    app.listen(PORT, () => {
      console.log('Server is running on port:', PORT);
    });
  } catch (error) {
    console.error('Failed to start the server');
  }
};

startServer();
