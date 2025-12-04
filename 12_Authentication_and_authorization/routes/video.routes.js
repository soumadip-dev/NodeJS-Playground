const express = require('express');
const { uploadVideo, fetchVideos } = require('../controllers/video.controller');
const { authorizeAdminRequest, authenticateRequest } = require('../middleware/auth.middleware.js');
const { uploadMiddleware } = require('../middleware/multer.middleware.js');

const router = express.Router();

// upload the image
router.post('/upload', authenticateRequest, uploadMiddleware.single('video'), uploadVideo);

// Get all images
router.get('/get-video', authorizeAdminRequest, fetchVideos);

module.exports = router;
