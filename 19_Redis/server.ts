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
    await redisClient.connect();
    console.log('Connected to Redis successfully 🚀');

    await redisClient.set('name', 'soumadip');
    console.log('Key "name" set successfully 📝');

    const retrievedValue = await redisClient.get('name');
    console.log('Retrieved value from Redis:', retrievedValue, '📦');
  } catch (error) {
    console.error('Redis connection failed ⚠️', error);
  } finally {
    await redisClient.quit();
    console.log('Redis connection closed 👋');
  }
};

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
