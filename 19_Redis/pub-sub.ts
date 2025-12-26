// Publisher → sends messages → channel → subscriber consumes the messages
import redis, { type RedisClientType } from 'redis';

const redisClient: RedisClientType = redis.createClient({
  url: 'redis://localhost:6379',
});

redisClient.on('error', (error: Error) => {
  console.error('Redis client error occurred ❌', error);
});

// Demonstrates Redis publish–subscribe functionality
async function testAdditionalRedisFeatures(): Promise<void> {
  try {
    // Connect publisher client to Redis
    await redisClient.connect();
    console.log('Connected to Redis successfully ✅');

    // Create a dedicated subscriber client
    const redisSubscriber: RedisClientType = redisClient.duplicate();
    await redisSubscriber.connect();

    // Subscribe to a channel and consume messages
    await redisSubscriber.subscribe('dummy-channel', (message, channel) => {
      console.log(`Message received from ${channel}: ${message} 📩`);
    });

    // Publish messages to the channel
    await redisClient.publish('dummy-channel', 'Some dummy data from publisher');
    await redisClient.publish('dummy-channel', 'Another message from publisher');

    // Allow some time for message consumption
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Unsubscribe and close subscriber connection
    await redisSubscriber.unsubscribe('dummy-channel');
    await redisSubscriber.quit();
    console.log('Redis subscriber connection closed 👋');
  } catch (error) {
    console.error('Redis operation failed ⚠️', error);
  } finally {
    // Close publisher Redis connection
    await redisClient.quit();
    console.log('Redis publisher connection closed 👋');
  }
}

// Execute Redis Pub/Sub example
testAdditionalRedisFeatures();
