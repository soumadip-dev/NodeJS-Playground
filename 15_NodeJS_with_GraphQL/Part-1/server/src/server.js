const express = require('express');
const cors = require('cors');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@as-integrations/express5');
const axios = require('axios');

const PORT = 8080;

// Function to start the GraphQL server
const startServer = async () => {
  const app = express();

  // GraphQL schema definitions
  // "!" indicates a required field
  const server = new ApolloServer({
    typeDefs: `
      type User {
        id: ID!
        name: String!
        username: String!
        email: String!
        phone: String!
        website: String!
      }

      type Todo {
        id: ID!
        title: String!
        completed: Boolean
        user: User
      }

      type Query {
        getTodos: [Todo]
        getAllUsers: [User]
        getUser(id: ID!): User
      }
    `,

    // Resolver functions
    resolvers: {
      Todo: {
        // Resolve the user field for each todo
        user: async todo => {
          const response = await axios.get(
            `https://jsonplaceholder.typicode.com/users/${todo.userId}`
          );
          return response.data;
        },
      },
      Query: {
        // Fetch all todos
        getTodos: async () => {
          const response = await axios.get('https://jsonplaceholder.typicode.com/todos');
          return response.data;
        },

        // Fetch all users
        getAllUsers: async () => {
          const response = await axios.get('https://jsonplaceholder.typicode.com/users');
          return response.data;
        },

        // Fetch a single user by ID
        getUser: async (parent, { id }) => {
          const response = await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`);
          return response.data;
        },
      },
    },
  });

  await server.start();

  // Middleware setup
  app.use(express.json());
  app.use(cors());

  // GraphQL endpoint
  app.use('/graphql', expressMiddleware(server));

  // Start Express server
  app.listen(PORT, () => {
    console.log(`GraphQL server running at http://localhost:${PORT}/graphql 🕸️`);
  });
};

// Initialize the server
startServer();
