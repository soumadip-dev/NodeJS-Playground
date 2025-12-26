import Redis from 'ioredis';

// Create Redis client instance
const redisClient = new Redis();

// Demonstrates basic ioredis operations
async function runIoRedisDemo(): Promise<void> {
  try {
    // Set a key-value pair in Redis
    await redisClient.set('sample:key', 'sample value');

    // Retrieve the value from Redis
    const storedValue = await redisClient.get('sample:key');
    console.log('Value fetched from Redis 🧾', storedValue);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Redis operation failed ⚠️', error.message);
    } else {
      console.error('Redis operation failed ⚠️', error);
    }
  } finally {
    // Close Redis connection
    await redisClient.quit();
    console.log('Redis connection closed 👋');
  }
}

// Execute ioredis example
runIoRedisDemo();
