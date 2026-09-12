import dotenv from 'dotenv';
import { createClient } from 'redis';
import { redisClient } from '../redis/client';

dotenv.config();

const NOTIFICATION_CHANNEL = 'notification';

const REDIS_URL = process.env.REDIS_URL;

if (!REDIS_URL) {
  throw new Error('REDIS_URL environment variable is not defined');
}

export interface NotificationPayload {
  id: string;
  title: string;
  message: string;
  createdAt: string;
}

/**
 * Publishes a notification to the Redis Pub/Sub channel.
 */
export async function publishNotification(notification: NotificationPayload): Promise<void> {
  await redisClient.publish(NOTIFICATION_CHANNEL, JSON.stringify(notification));
}

// A separate Redis client is required for subscribing to a channel.
// A Redis connection used for Pub/Sub subscriptions should not be
// reused for regular Redis commands.
const notificationSubscriber = createClient({
  url: REDIS_URL,
});

notificationSubscriber.on('error', error => {
  console.error('Redis notification subscriber error:', error);
});

/**
 * Connects to Redis and starts listening for notifications.
 */
async function startNotificationSubscriber(): Promise<void> {
  await notificationSubscriber.connect();

  console.info('Redis notification subscriber connected');

  await notificationSubscriber.subscribe(NOTIFICATION_CHANNEL, message => {
    try {
      const notification = JSON.parse(message) as NotificationPayload;

      console.info('New notification received');
      console.info(`Title: ${notification.title}`);
      console.info(`Message: ${notification.message}`);
      console.info(`Created at: ${notification.createdAt}`);
    } catch (error) {
      console.error('Failed to parse notification from Redis Pub/Sub:', error);
    }
  });

  console.info(`Subscribed to Redis channel: ${NOTIFICATION_CHANNEL}`);
}

startNotificationSubscriber().catch(error => {
  console.error('Failed to start the Redis notification subscriber:', error);

  process.exit(1);
});
