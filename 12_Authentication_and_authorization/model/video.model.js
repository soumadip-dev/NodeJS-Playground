const mongoose = require('mongoose');

// Schema for storing uploaded video metadata
const videoSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: [true, 'Video URL is required'],
    },
    publicId: {
      type: String,
      required: [true, 'Cloudinary publicId is required'],
    },
    thumbnail: {
      type: String,
    },
    duration: {
      type: Number,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Video', videoSchema);
