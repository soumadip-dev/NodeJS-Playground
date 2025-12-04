const userModel = require('../model/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

// Register a new user
const registerUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Check if user already exists by email or username
    const existingUser = await userModel.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists ⚠️',
      });
    }

    // Hash password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await userModel.create({
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

// Login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const existingUser = await userModel.findOne({ email });
    if (!existingUser) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials ❌',
      });
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials ❌',
      });
    }

    // Generate JWT token
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

// Change password
const chnagePassword = async (req, res) => {};

module.exports = {
  registerUser,
  loginUser,
  chnagePassword,
};
