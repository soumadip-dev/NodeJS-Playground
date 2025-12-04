const Video = require('../model/video.model');
const { uploadToCloudinary } = require('../helper/cloudinary.helper');
const fs = require('fs').promises;

// Controller to handle video upload
const uploadVideo = async (req, res) => {
  try {
    // Validate file presence in the request
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'File is required. Please upload a video 📹',
      });
    }

    // Upload video to Cloudinary with resource type set to video
    const { url, publicId, duration, format } = await uploadToCloudinary(req.file.path, 'video');

    // Create a new video document
    const uploadedVideo = new Video({
      url,
      publicId,
      duration,
      format,
      uploadedBy: req.userInfo.userId,
    });

    await uploadedVideo.save();

    // Remove temporary file after successful upload
    try {
      await fs.unlink(req.file.path);
      console.log('Temporary file deleted successfully');
    } catch (fileError) {
      console.log('Failed to delete temporary file:', fileError.message);
    }

    res.status(200).json({
      success: true,
      message: 'Video uploaded successfully',
      video: uploadedVideo,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Something went wrong',
    });
  }
};

// Controller to fetch all uploaded videos
const fetchVideos = async (req, res) => {
  try {
    const videos = await Video.find({});

    if (!videos || videos.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No videos found',
        data: [],
      });
    }

    res.status(200).json({
      success: true,
      message: 'Videos fetched successfully',
      data: videos,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Something went wrong',
    });
  }
};

module.exports = { uploadVideo, fetchVideos };
