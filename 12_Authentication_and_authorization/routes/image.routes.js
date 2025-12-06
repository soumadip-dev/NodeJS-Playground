const express = require('express');
const { uploadImage } = require('../controllers/image.controller');
const { authorizeAdminRequest, authenticateRequest } = require('../middleware/auth.middleware.js');
const { uploadMiddleware } = require('../middleware/multer.middleware.js');

const router = express.Router();

// upload the image
router.post('/upload', authorizeAdminRequest, uploadMiddleware.single('image'), uploadImage);

// Get all images
// router.get('/get-image', authorizeAdminRequest, uploadImage);

module.exports = router;
