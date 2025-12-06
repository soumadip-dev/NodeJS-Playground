const express = require('express');
const { authorizeAdminRequest } = require('../middleware/auth.middleware.js');

const router = express.Router();

router.get('/welcome', authorizeAdminRequest, (req, res) => {
  const { userId, username, role } = req.userInfo;

  res.status(200).json({
    success: true,
    message: 'Welcome to the admin page 🏠',
    user: {
      username,
      userId,
      role,
    },
  });
});

module.exports = router;
