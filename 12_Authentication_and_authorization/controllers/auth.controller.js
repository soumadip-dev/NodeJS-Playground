const User = require('../model/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

// Register a new user
const registerUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Check if the user already exists using email or username
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists ⚠️',
      });
    }

    // Hash the password before saving it to the database
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role,
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully 🎉',
      data: newUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Something went wrong',
    });
  }
};

// Login an existing user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials ❌',
      });
    }

    // Compare entered password with stored hashed password
    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials ❌',
      });
    }

    // Generate JWT access token
    const accessToken = jwt.sign(
      {
        userId: existingUser._id,
        username: existingUser.username,
        role: existingUser.role,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '15m' }
    );

    res.status(200).json({
      success: true,
      message: 'Login successful ✅',
      accessToken,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Something went wrong',
    });
  }
};

<<<<<<< HEAD
// Change user password
const changePassword = async (req, res) => {
  try {
    const userId = req.userInfo.userId;

    // Extract old and new passwords from request body
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({
        message: 'User not found. Please login to change your password',
        success: false,
      });
    }

    // Verify old password
    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isOldPasswordValid) {
      return res.status(400).json({
        message: 'Old password is incorrect',
        success: false,
      });
    }

    // Ensure new password is different from the old one
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return res.status(400).json({
        message: 'New password must be different from the old password',
        success: false,
      });
    }

    // Hash and update the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      message: 'Password updated successfully 🔐',
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Something went wrong',
    });
  }
};
=======
// Change password
const chnagePassword = async (req, res) => {};
>>>>>>> b80361ac8d076aad00866eae3f72eceb58aefc7e

module.exports = {
  registerUser,
  loginUser,
<<<<<<< HEAD
  changePassword,
=======
  chnagePassword,
>>>>>>> b80361ac8d076aad00866eae3f72eceb58aefc7e
};
