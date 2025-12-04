const cloudinary = require('../config/cloudinary.config.js');

// Upload a file to Cloudinary and return required details
const uploadToCloudinary = async (filePath, resourceType) => {
  try {
    const uploadResult = await cloudinary.uploader.upload(filePath, {
      resource_type: resourceType,
    });

    return {
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      duration: uploadResult.duration,
      format: uploadResult.format,
    };
  } catch (error) {
    console.log('Error while uploading to Cloudinary:', error);
    throw new Error(error.message || 'Cloudinary upload failed');
  }
};

module.exports = { uploadToCloudinary };
