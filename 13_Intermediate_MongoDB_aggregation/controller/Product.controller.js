const Product = require('../models/Product.model');

// Controller to insert sample products
const insertSampleProducts = async (req, res) => {
  try {
    const sampleProducts = [
      {
        name: 'Laptop',
        category: 'Electronics',
        price: 999,
        inStock: true,
        tags: ['computer', 'tech'],
      },
      {
        name: 'Smartphone',
        category: 'Electronics',
        price: 699,
        inStock: true,
        tags: ['mobile', 'tech'],
      },
      {
        name: 'Headphones',
        category: 'Electronics',
        price: 199,
        inStock: false,
        tags: ['audio', 'tech'],
      },
      {
        name: 'Running Shoes',
        category: 'Sports',
        price: 89,
        inStock: true,
        tags: ['footwear', 'running'],
      },
      {
        name: 'Novel',
        category: 'Books',
        price: 15,
        inStock: true,
        tags: ['fiction', 'bestseller'],
      },
    ];

    const insertedProducts = await Product.insertMany(sampleProducts);

    res.status(201).json({
      success: true,
      message: `Inserted ${insertedProducts.length} sample products 🎉`,
      data: insertedProducts,
    });
  } catch (error) {
    console.log('Error inserting sample products ❌', error.message);
    res.status(500).json({
      success: false,
      message: 'Something went wrong while inserting products ⚠️',
    });
  }
};

// Controller to get product statistics using aggregation
const getProductStats = async (req, res) => {
  try {
    const stats = await Product.aggregate([
      // Filter in-stock products with price >= 100
      {
        $match: {
          inStock: true,
          price: { $gte: 100 },
        },
      },
      // Group products by category
      {
        $group: {
          _id: '$category',
          averagePrice: { $avg: '$price' },
          totalProducts: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      message: 'Product statistics fetched successfully 📊',
      data: stats,
    });
  } catch (error) {
    console.log('Error fetching product statistics ❌', error.message);
    res.status(500).json({
      success: false,
      message: 'Something went wrong while fetching product stats ⚠️',
    });
  }
};

// Controller to get product analysis
const getProductAnalysis = async (req, res) => {
  try {
    const analysis = await Product.aggregate([
      // Match electronics category
      {
        $match: {
          category: 'Electronics',
        },
      },
      // Calculate revenue and pricing metrics
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$price' },
          averagePrice: { $avg: '$price' },
          maxProductPrice: { $max: '$price' },
          minProductPrice: { $min: '$price' },
        },
      },
      // Shape the final response
      {
        $project: {
          _id: 0,
          totalRevenue: 1,
          averagePrice: 1,
          maxProductPrice: 1,
          minProductPrice: 1,
          priceRange: {
            $subtract: ['$maxProductPrice', '$minProductPrice'],
          },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      message: 'Product analysis fetched successfully 📊',
      data: analysis,
    });
  } catch (error) {
    console.log('Error fetching product analysis ❌', error.message);
    res.status(500).json({
      success: false,
      message: 'Something went wrong while fetching product analysis ⚠️',
    });
  }
};

module.exports = {
  insertSampleProducts,
  getProductStats,
  getProductAnalysis,
};
