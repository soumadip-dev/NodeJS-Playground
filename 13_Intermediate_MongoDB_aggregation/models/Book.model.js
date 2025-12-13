const mongoose = require('mongoose');

// Book schema definition
const BookSchema = new mongoose.Schema({
  title: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author',
  },
});

// Export Book model
module.exports = mongoose.model('Book', BookSchema);
