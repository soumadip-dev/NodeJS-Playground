const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const typeDefs = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');
const dotenv = require('dotenv');
const connectDb = require('../database/db');

dotenv.config();

// Function to initialize and start the Apollo GraphQL server
async function startServer() {
  await connectDb();
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  const { url } = await startStandaloneServer(server, {
    listen: { port: process.env.PORT || 8080 },
  });

  console.log(`GraphQL server is running at ${url} 🔗`);
}

// Start the server
startServer();
