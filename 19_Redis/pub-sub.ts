// Publisher → sends messages → channel → subscriber consumes the messages
import redis, { type RedisClientType } from 'redis';

// Create Redis publisher client
const redisPublisherClient: RedisClientType = redis.createClient({
  url: 'redis://localhost:6379',
});

// Handle Redis client errors
redisPublisherClient.on('error', (error: Error) => {
  console.error('Redis client error occurred ❌', error);
});

// Demonstrates Redis publish–subscribe, transactions, and pipelines
async function runRedisExamples(): Promise<void> {
  try {
    // Connect publisher client to Redis
    await redisPublisherClient.connect();
    console.log('Connected to Redis successfully ✅');

    // Create and connect a dedicated subscriber client
    const redisSubscriberClient: RedisClientType = redisPublisherClient.duplicate();
    await redisSubscriberClient.connect();

    // Subscribe to a channel and consume messages
    await redisSubscriberClient.subscribe('dummy-channel', (message: string, channel: string) => {
      console.log(`Message received from ${channel}: ${message} 📩`);
    });

    // Publish messages to the channel
    await redisPublisherClient.publish('dummy-channel', 'Some dummy data from publisher');
    await redisPublisherClient.publish('dummy-channel', 'Another message from publisher');

    // Allow time for message consumption
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Unsubscribe and close subscriber connection
    await redisSubscriberClient.unsubscribe('dummy-channel');
    await redisSubscriberClient.quit();
    console.log('Redis subscriber connection closed 👋');

    // Transaction example
    const transaction = redisPublisherClient.multi();
    transaction.set('key-transaction1', 'value1');
    transaction.set('key-transaction2', 'value2');
    transaction.get('key-transaction1');
    transaction.get('key-transaction2');

    const transactionResult = await transaction.exec();
    console.log('Transaction result 🧾', transactionResult);

    // Pipeline example
    const pipeline = redisPublisherClient.multi();
    pipeline.set('key-pipeline1', 'value1');
    pipeline.set('key-pipeline2', 'value2');
    pipeline.get('key-pipeline1');
    pipeline.get('key-pipeline2');

    const pipelineResult = await pipeline.exec();
    console.log('Pipeline result 🔄', pipelineResult);

    // Batch data operation using pipeline
    const batchPipeline = redisPublisherClient.multi();
    for (let index = 0; index < 1000; index++) {
      batchPipeline.set(`User:${index}:action`, `Action${index}`);
    }

    const batchPipelineResult = await batchPipeline.exec();
    console.log('Batch pipeline result 📦', batchPipelineResult);

    // Atomic balance transfer example
    const balanceTransferTransaction = redisPublisherClient.multi();
    balanceTransferTransaction.decrBy('account:1234:balance', 100);
    balanceTransferTransaction.incrBy('account:0000:balance', 100);

    const balanceTransferResult = await balanceTransferTransaction.exec();
    console.log('Balance transfer result 💸', balanceTransferResult);
  } catch (error) {
    console.error('Redis operation failed ⚠️', error);
  } finally {
    // Close publisher Redis connection
    await redisPublisherClient.quit();
    console.log('Redis publisher connection closed 👋');
  }
}

// Execute Redis example
runRedisExamples();
