const express = require('express');
const {
  insertSampleProducts,
  getProductStats,
  getProductAnalysis,
} = require('../controller/Product.controller');

const router = express.Router();

// Route to seed sample product data
router.post('/seed-data', insertSampleProducts);

// Route to get product status
router.get('/get-stat', getProductStats);

// Route to get Product analysis
router.get('/get-analysis', getProductAnalysis);

module.exports = router;
