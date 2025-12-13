const mongoose = require('mongoose');

// Product schema definition
const productSchema = new mongoose.Schema({
  name: String,
  category: String,
  price: Number,
  inStock: Boolean,
  tags: [String],
});

// Export Product model
module.exports = mongoose.model('Product', productSchema);
