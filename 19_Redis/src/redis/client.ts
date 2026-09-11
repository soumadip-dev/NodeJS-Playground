import dotenv from 'dotenv';
dotenv.config();

import { createClient } from 'redis';

const redisUrl = process.env.REDIS_URL;

export const redisClient = createClient({ url: redisUrl });

redisClient.on('ready', () => {
  console.log('Redis client connected');
});

redisClient.on('error', error => {
  console.error('Redis client error:', error);
});

redisClient.on('end', () => {
  console.log('Redis client disconnected');
});

export async function connectRedis(): Promise<void> {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
  const pong = await redisClient.ping();
  console.log('Redis ping:', pong);
}

export async function disconnectRedis(): Promise<void> {
  if (redisClient.isOpen) {
    await redisClient.quit();
  }
}
