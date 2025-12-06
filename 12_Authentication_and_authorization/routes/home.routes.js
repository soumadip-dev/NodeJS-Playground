const express = require('express');
const { authenticateRequest } = require('../middleware/auth.middleware.js');

const router = express.Router();

router.get('/welcome', authenticateRequest, (req, res) => {
  const { userId, username, role } = req.userInfo;

  res.status(200).json({
    success: true,
    message: 'Welcome to the home page 🏠',
    user: {
      username,
      userId,
      role,
    },
  });
});

module.exports = router;
