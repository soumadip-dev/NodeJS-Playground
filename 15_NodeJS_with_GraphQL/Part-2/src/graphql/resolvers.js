const Product = require('../models/Product.model');

// Resolver functions for GraphQL queries and mutations
const resolvers = {
  Query: {
    // Fetch all products
    Products: async () => {
      return await Product.find({});
    },

    // Fetch a single product by ID
    Product: async (_, { id }) => {
      return await Product.findById(id);
    },
  },

  Mutation: {
    // Create a new product
    CreateProduct: async (_, { title, category, price, inStock }) => {
      const newProduct = await Product.create({
        title,
        category,
        price,
        inStock,
      });
      return newProduct;
    },

    // Delete a product by ID
    DeleteProduct: async (_, { id }) => {
      const deletedProduct = await Product.findByIdAndDelete(id);
      return deletedProduct;
    },

    // Update a product by ID
    UpdateProduct: async (_, { id, ...updates }) => {
      const updatedProduct = await Product.findByIdAndUpdate(id, updates, { new: true });
      return updatedProduct;
    },
  },
};

module.exports = resolvers;
