// Redis Pub/Sub
//
// The publisher sends messages to a Redis channel.
// Subscribers listen to the channel and receive published messages.
// The Redis channel acts as the shared topic between publishers and subscribers.

import dotenv from 'dotenv';
import { createClient } from 'redis';

dotenv.config();

const redisUrl = process.env.REDIS_URL;
const notificationChannel = 'demo:notification';

if (!redisUrl) {
  throw new Error('REDIS_URL is not defined');
}

async function runPubSubDemo() {
  // Redis Pub/Sub requires separate Redis clients for publishing and subscribing.
  const publisherClient = createClient({ url: redisUrl });
  const subscriberClient = createClient({ url: redisUrl });

  publisherClient.on('error', error => {
    console.error('Redis publisher client error:', error);
  });

  subscriberClient.on('error', error => {
    console.error('Redis subscriber client error:', error);
  });

  await publisherClient.connect();
  await subscriberClient.connect();

  console.log('Redis publisher connected');
  console.log('Publisher ping:', await publisherClient.ping());

  console.log('Redis subscriber connected');
  console.log('Subscriber ping:', await subscriberClient.ping());

  // Subscribe to the channel before publishing so the subscriber
  // is ready to receive incoming messages.
  await subscriberClient.subscribe(notificationChannel, message => {
    try {
      const notificationEvent = JSON.parse(message);

      console.log('Subscriber received a notification:');
      console.log('Title:', notificationEvent.title);
      console.log('Message:', notificationEvent.message);
    } catch (error) {
      console.error('Failed to parse Pub/Sub message:', error);
    }
  });

  console.log('Subscriber subscribed to channel:', notificationChannel);

  console.log('Publishing notification event...');

  const notificationEvent = {
    title: 'Hello World',
    message: 'This is a test message',
  };

  // Publish the event as a JSON string because Redis Pub/Sub
  // messages are transmitted as strings.
  const subscriberCount = await publisherClient.publish(
    notificationChannel,
    JSON.stringify(notificationEvent)
  );

  console.log('Notification event published successfully');
  console.log('Active subscribers:', subscriberCount);

  // Wait briefly so the subscriber has time to process the message.
  // This delay is only needed for this standalone demonstration.
  await new Promise(resolve => setTimeout(resolve, 1000));

  await subscriberClient.unsubscribe(notificationChannel);

  console.log('Subscriber unsubscribed from channel:', notificationChannel);

  await publisherClient.quit();
  await subscriberClient.quit();

  console.log('Redis Pub/Sub demo completed successfully');
}

runPubSubDemo().catch(error => {
  console.error('Redis Pub/Sub demo failed:', error);
  process.exit(1);
});
