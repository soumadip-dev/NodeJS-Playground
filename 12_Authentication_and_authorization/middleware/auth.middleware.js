const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

// Authentication middleware to verify JWT and protect routes
const authenticateRequest = (req, res, next) => {
  const authorizationHeader = req.headers['authorization'];
  const token = authorizationHeader && authorizationHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized access 🚫',
    });
  }

  // Verify and decode the JWT token
  try {
    const decodedPayload = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.userInfo = decodedPayload;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. Invalid or expired token.',
    });
  }
};

// Authorization middleware to allow only admin users
const authorizeAdminRequest = (req, res, next) => {
  const authorizationHeader = req.headers['authorization'];
  const token = authorizationHeader && authorizationHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized access 🚫',
    });
  }

  // Verify token and check user role
  try {
    const decodedPayload = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (decodedPayload.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. Admin access required.',
      });
    }

    req.userInfo = decodedPayload;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. Invalid or expired token.',
    });
  }
};

module.exports = {
  authenticateRequest,
  authorizeAdminRequest,
};
