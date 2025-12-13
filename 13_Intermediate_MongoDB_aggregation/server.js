const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const productRouter = require('./routes/Product.routes');
const bookRouter = require('./routes/Book.routes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware to parse JSON
app.use(express.json());

// Routes
app.use('/api/product', productRouter);
app.use('/api/reference', bookRouter);

// Connect to MongoDB and start the server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected successfully ✅');
    startServer();
  })
  .catch(error => {
    console.error('MongoDB connection failed ❌', error.message);
  });

// Function to start the Express server
const startServer = () => {
  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT} 🕸️`);
  });
};
