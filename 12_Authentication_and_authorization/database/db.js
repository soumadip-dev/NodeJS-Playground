const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

// Function to establish a connection with MongoDB
const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed');
    process.exit(1);
  }
};

module.exports = connectDb;
