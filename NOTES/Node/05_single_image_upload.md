# **Complete Image Upload System with Cloudinary & Multer**

## **🔗 Complete Flow Diagram**

```
Client Request
    ↓
[Express Router]
    ↓
[Auth Middleware] → Verify JWT & Admin Role
    ↓
[Multer Middleware] → Validate & Store Temporarily
    ↓
[Controller]
    ├── Check File Exists
    ├── Upload to Cloudinary
    ├── Save Metadata to DB
    ├── Delete Temp File
    └── Send Response
    ↓
[Cloudinary CDN] → Permanent Storage
    ↓
[MongoDB] → Store Metadata Only
```

---

## **📄 1. Cloudinary Configuration**

### `config/cloudinary.config.js`

```javascript
const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');

dotenv.config();

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true, // Force HTTPS
});

module.exports = cloudinary;
```

---

## **📄 2. Multer Middleware**

### `middleware/multer.middleware.js`

```javascript
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directory exists
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(
      file.originalname
    )}`;
    cb(null, uniqueName);
  },
});

// File type validation
const fileFilter = (req, file, callback) => {
  if (file.mimetype.startsWith('image')) {
    callback(null, true);
  } else {
    callback(new Error('Only image files are allowed'));
  }
};

// Multer middleware configuration
const uploadMiddleware = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB file size limit
  },
});

module.exports = { uploadMiddleware };
```

---

## **📄 3. Cloudinary Helper**

### `helpers/cloudinary.helper.js`

```javascript
const cloudinary = require('../config/cloudinary.config.js');

// Upload a file to Cloudinary and return required details
const uploadToCloudinary = async filePath => {
  try {
    const uploadResult = await cloudinary.uploader.upload(filePath);

    return {
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
    };
  } catch (error) {
    console.log('Error while uploading to Cloudinary:', error);
    throw new Error(error.message || 'Cloudinary upload failed');
  }
};

module.exports = { uploadToCloudinary };
```

---

## **📄 4. Image Model**

### `models/image.model.js`

```javascript
const mongoose = require('mongoose');

// Schema for storing uploaded image metadata
const imageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      required: true,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Image', imageSchema);
```

---

## **📄 5. Image Controller**

### `controllers/image.controller.js`

```javascript
const Image = require('../model/image.model');
const { uploadToCloudinary } = require('../helper/cloudinary.helper');
const fs = require('fs').promises;

// Controller to handle image upload
const uploadImage = async (req, res) => {
  try {
    // Check if the file is missing in the request object
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'File is required. Please upload an image 📷',
      });
    }

    // Upload image to Cloudinary
    const { url, publicId } = await uploadToCloudinary(req.file.path);

    // Store image details along with the uploading user ID
    const uploadedImage = new Image({
      url,
      publicId,
      uploadedBy: req.userInfo.userId,
    });

    await uploadedImage.save();

    // Delete the temporary file using promises
    try {
      await fs.unlink(req.file.path);
      console.log('Temporary file deleted successfully');
    } catch (error) {
      console.log('Failed to delete temp file:', error.message);
    }

    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully ✅',
      image: uploadedImage,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Something went wrong ❌',
    });
  }
};

module.exports = { uploadImage };
```

---

## **📄 6. Image Routes**

### `routes/image.routes.js`

```javascript
const express = require('express');
const { uploadImage } = require('../controllers/image.controller');
const { authorizeAdminRequest, authenticateRequest } = require('../middleware/auth.middleware.js');
const { uploadMiddleware } = require('../middleware/multer.middleware.js');

const router = express.Router();

// upload the image
router.post('/upload', authorizeAdminRequest, uploadMiddleware.single('image'), uploadImage);

module.exports = router;
```
