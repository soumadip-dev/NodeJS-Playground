const products = require('../data/products');

// Resolver functions for GraphQL queries and mutations
const resolvers = {
  Query: {
    Products: () => products,
    Product: (_, { id }) => products.find(product => product.id === id),
  },

  Mutation: {
    CreateProduct: (_, { title, category, price, inStock }) => {
      const newProduct = {
        id: String(products.length + 1),
        title,
        category,
        price,
        inStock,
      };

      products.push(newProduct);
      return newProduct;
    },

    DeleteProduct: (_, { id }) => {
      const productIndex = products.findIndex(product => product.id === id);

      if (productIndex === -1) {
        return null;
      }

      const deletedProduct = products[productIndex];
      products.splice(productIndex, 1);

      return deletedProduct;
    },

    UpdateProduct: (_, { id, ...updates }) => {
      const productIndex = products.findIndex(product => product.id === id);

      if (productIndex === -1) {
        return null;
      }
      const updatedProduct = {
        ...products[productIndex],
        ...updates,
      };

      products[productIndex] = updatedProduct;

      return updatedProduct;
    },
  },
};

module.exports = resolvers;
