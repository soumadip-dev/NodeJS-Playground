const mongoose = require('mongoose');

// Product schema definition
const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Product title is required 🏷️'],
    trim: true,
  },
  category: {
    type: String,
    required: [true, 'Product category is required 📦'],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'Product price is required 💰'],
    min: 0,
  },
  inStock: {
    type: Boolean,
    required: [true, 'Stock status is required 📊'],
    default: true,
  },
});

module.exports = mongoose.model('Product', productSchema);
