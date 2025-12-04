const express = require('express');
const { registerUser, loginUser, changePassword } = require('../controllers/auth.controller');
const { authenticateRequest } = require('../middleware/auth.middleware');

const router = express.Router();

// User registration route
router.post('/register', registerUser);

// User login route
router.post('/login', loginUser);

// change the password
router.post('/change-pass', authenticateRequest, changePassword);

module.exports = router;
