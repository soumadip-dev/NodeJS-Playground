const Image = require('../model/image.model');
const { uploadToCloudinary } = require('../helper/cloudinary.helper');
const fs = require('fs').promises;
const cloudinary = require('../config/cloudinary.config.js');

// Controller to handle image upload
const uploadImage = async (req, res) => {
  try {
    // Validate file existence in request
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'File is required. Please upload an image 📷',
      });
    }

    // Upload image to Cloudinary
    const { url, publicId } = await uploadToCloudinary(req.file.path);

    // Save image details in the database
    const uploadedImage = new Image({
      url,
      publicId,
      uploadedBy: req.userInfo.userId,
    });

    await uploadedImage.save();

    // Remove temporary file from server
    try {
      await fs.unlink(req.file.path);
    } catch (error) {
      console.log('Temporary file cleanup failed:', error.message);
    }

    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully ✅',
      data: uploadedImage,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Something went wrong ❌',
    });
  }
};

// Controller to fetch all uploaded images
const fetchImages = async (req, res) => {
  try {
    // page  -> current page number (default: 1)
    const page = Math.max(parseInt(req.query.page) || 1, 1);

    // limit -> number of records per page (default: 5)
    const limit = Math.max(parseInt(req.query.limit) || 5, 1);

    /**
     * Calculate how many records to skip
     * Example:
     * page = 2, limit = 5
     * skip = (2 - 1) * 5 = 5
     */
    const skip = (page - 1) * limit;

    // sortBy    -> field name to sort by (default: createdAt)
    const sortBy = req.query.sortBy || 'createdAt';

    // sortOrder -> asc | desc (default: desc)
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

    /**
     * Build dynamic sort object
     * Example:
     * { createdAt: -1 }
     */
    const sortObj = {};
    sortObj[sortBy] = sortOrder;

    const totalImages = await Image.countDocuments();

    const totalPages = Math.ceil(totalImages / limit);

    const images = await Image.find().sort(sortObj).skip(skip).limit(limit);

    if (!images || images.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No images found 🪹',
        data: [],
      });
    }

    res.status(200).json({
      success: true,
      message: 'Images fetched successfully ✅',
      currentPage: page,
      totalPages: totalPages,
      totalImages: totalImages,
      data: images,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Something went wrong ❌',
    });
  }
};

// Controller to delete an image
const deleteImage = async (req, res) => {
  try {
    const imageId = req.params.id;
    const userId = req.userInfo.userId;

    const imageToDelete = await Image.findById(imageId);

    if (!imageToDelete) {
      return res.status(404).json({
        success: false,
        message: 'Image not found ❌',
      });
    }

    // Authorization check: only uploader can delete the image
    if (imageToDelete.uploadedBy.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this image 🚫',
      });
    }

    // Delete image from Cloudinary
    await cloudinary.uploader.destroy(imageToDelete.publicId);

    // Delete image record from database
    await Image.findByIdAndDelete(imageId);

    res.status(200).json({
      success: true,
      message: 'Image deleted successfully 🗑️',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Something went wrong ❌',
    });
  }
};

module.exports = {
  uploadImage,
  fetchImages,
  deleteImage,
};
