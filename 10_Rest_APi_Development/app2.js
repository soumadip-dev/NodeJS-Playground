const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = 8080;

// Connect to MongoDB
const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB successfully');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
  }
};

// Middleware to parse JSON requests
app.use(express.json());

// User schema definition
const userSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    age: Number,
    isActive: Boolean,
    tags: [String], // Tags may include emojis
  },
  { timestamps: true }
);

// User model
const User = mongoose.model('User', userSchema);

// Example MongoDB create operation
async function runQueryExamples() {
  try {
    await User.create({
      name: 'Soumadip Majila',
      email: 'sfvdf@gmail.com',
      isActive: true,
      tags: ['developer', 'designer'],
    });
    console.log('New user created successfully');
  } catch (error) {
    console.error('MongoDB Query Error:', error);
  } finally {
    await mongoose.connection.close();
  }
}

// Start the server and perform DB operations
const startServer = async () => {
  await connectToDatabase();

  // Fetch users who are inactive
  const inactiveUsers = await User.find({ isActive: false });
  console.log('Fetched inactive users:', inactiveUsers);

  // Fetch one user by name
  const foundUser = await User.findOne({ name: 'Soumadip Majila' });
  console.log('First user found by name:', foundUser);

  // Fetch user by ID with selected fields
  if (foundUser) {
    const userById = await User.findById(foundUser._id, {
      name: 1,
      email: 1,
      _id: 0,
    });
    console.log('User found by ID:', userById);
  }

  // Apply limit and skip
  const limitedSkippedUsers = await User.find().limit(5).skip(1);
  console.log('Users with limit and skip applied:', limitedSkippedUsers);

  // Sort users by age descending
  const usersSortedByAgeDesc = await User.find().sort({ age: -1 });
  console.log('Users sorted by age descending:', usersSortedByAgeDesc);

  // Count inactive users
  const inactiveUserCount = await User.countDocuments({ isActive: false });
  console.log('Inactive user count:', inactiveUserCount);

  // Update user
  if (foundUser) {
    const updatedUser = await User.findByIdAndUpdate(
      foundUser._id,
      {
        $set: { age: 100 },
        $push: { tags: 'updated' },
      },
      { new: true }
    );
    console.log('Updated user:', updatedUser);

    // Delete user
    const deletedUser = await User.findByIdAndDelete(foundUser._id);
    console.log('Deleted user:', deletedUser);
  }

  // Start Express server
  app.listen(port, () => {
    console.log(`Server is now running on port: ${port}`);
  });
};

startServer();
// runQueryExamples();
