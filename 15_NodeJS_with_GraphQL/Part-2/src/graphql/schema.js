// This file defines the structure (schema) of the GraphQL API

const { gql } = require('graphql-tag');

// Scalar types provided by GraphQL
/*
1. String
2. Int
3. Float
4. Boolean
5. ID    => unique identifier
*/

const typeDefs = gql`
  type Product {
    id: ID!
    title: String!
    category: String!
    price: Float!
    inStock: Boolean
  }

  type Query {
    Products: [Product!]!
    Product(id: ID!): Product
  }

  type Mutation {
    CreateProduct(title: String!, category: String!, price: Float!, inStock: Boolean!): Product

    DeleteProduct(id: ID!): Product

    UpdateProduct(id: ID!, title: String, category: String, price: Float, inStock: Boolean): Product
  }
`;

module.exports = typeDefs;
