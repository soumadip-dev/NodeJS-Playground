const express = require('express');
const { uploadImage, fetchImages, deleteImage } = require('../controllers/image.controller');
const { authorizeAdminRequest, authenticateRequest } = require('../middleware/auth.middleware.js');
const { uploadMiddleware } = require('../middleware/multer.middleware.js');

const router = express.Router();

// upload the image
router.post('/upload', authenticateRequest, uploadMiddleware.single('image'), uploadImage);

// Get all images
router.get('/get-image', authorizeAdminRequest, fetchImages);

// Delete Image
router.delete('/delete/:id', authenticateRequest, deleteImage);

module.exports = router;
