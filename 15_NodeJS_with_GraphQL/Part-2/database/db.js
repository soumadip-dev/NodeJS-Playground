const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// Function to establish MongoDB connection
const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected successfully ✅');
  } catch (error) {
    console.log('MongoDB connection failed 👎', error.message);
  }
};

module.exports = connectDb;
