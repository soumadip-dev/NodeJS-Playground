const multer = require('multer');
const path = require('path');

// Configure multer disk storage
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, 'uploads/');
  },
  filename: function (req, file, callback) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    callback(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

// File filter to allow only image files
const fileFilter = (req, file, callback) => {
  if (file.mimetype.startsWith('image') || file.mimetype.startsWith('video')) {
    callback(null, true);
  } else {
    callback(new Error('Only image and video files are allowed'));
  }
};

// Multer middleware configuration
const uploadMiddleware = multer({
  storage: storage,
  fileFilter,
  limits: {
    fileSize: 200 * 1024 * 1024, // 200 MB file size limit
  },
});

module.exports = { uploadMiddleware };
