const mongoose = require('mongoose');

// Author schema definition
const AuthorSchema = new mongoose.Schema({
  name: String,
  bio: String,
});

// Export Author model
module.exports = mongoose.model('Author', AuthorSchema);
