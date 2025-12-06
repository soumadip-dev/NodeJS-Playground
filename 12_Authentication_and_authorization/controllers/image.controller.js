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
