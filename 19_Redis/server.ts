/*
import type { Express, Request, Response } from 'express';

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
*/
import { createClient, type RedisClientType } from 'redis';

const redisClient: RedisClientType = createClient({
  url: 'redis://localhost:6379',
});

// Redis client error event listener
redisClient.on('error', (error: Error) => {
  console.error('Redis client error occurred ❌', error);
});

// Function to test Redis connection and basic operations
const testRedisConnection = async (): Promise<void> => {
  try {
    // Connect to Redis
    await redisClient.connect();
    console.log('Connected to Redis successfully 🚀');

    // Set a key-value pair
    await redisClient.set('name', 'soumadip');
    console.log('Key "name" set successfully 📝');

    // Get the value of a key
    const retrievedName = await redisClient.get('name');
    console.log('Retrieved value from Redis:', retrievedName, '📦');

    // Delete the key
    const deletedKeyCount = await redisClient.del('name');
    console.log('Deleted keys count:', deletedKeyCount, '🗑️');

    // Set and increment a numeric value
    await redisClient.set('count', 100);
    const incrementedCount = await redisClient.incr('count');
    console.log('Incremented count value:', incrementedCount, '➕');

    // Decrement the numeric value
    const decrementedCount = await redisClient.decr('count');
    console.log('Decremented count value:', decrementedCount, '➖');
  } catch (error) {
    console.error('Redis connection failed ⚠️', error);
  } finally {
    // Close Redis connection
    await redisClient.quit();
    console.log('Redis connection closed 👋');
  }
};

// Execute Redis test
testRedisConnection();

/*
dotenv.config();


const app: Express = express();
const PORT: number = Number(process.env.PORT) || 8080;

app.use(express.json()); // Express JSON body parser
app.use(cors()); // CORS configuration

// Home route
app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    message: 'Home route is running ✅',
    success: true,
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT} 🌐`);
});
*/
