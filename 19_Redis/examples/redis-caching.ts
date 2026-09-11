import dotenv from 'dotenv';
import { createClient } from 'redis';

dotenv.config();

const redisUrl = process.env.REDIS_URL;

const redisClient = createClient({ url: redisUrl });

const productsCacheKey = 'demo:products';
const cacheTtlSeconds = 60;

// Simulating products stored in a database.
let dbProducts = ['Keyboard', 'Mouse', 'Headphones', 'Headset'];

async function main() {
  await redisClient.connect();

  console.log('Connected to Redis');
  console.log('PING:', await redisClient.ping());

  // --------------------------------------------------
  // Cache-Aside Pattern
  // --------------------------------------------------
  // 1. Check Redis for the requested data.
  // 2. If the data exists, return the cached data.
  // 3. If the data does not exist, fetch it from the database.
  // 4. Store the database result in Redis.
  // 5. Return the data.

  const cachedProducts = await redisClient.get(productsCacheKey);

  if (cachedProducts !== null) {
    // Cache hit:
    // The requested data was found in Redis.
    const products = JSON.parse(cachedProducts);

    console.log('Cache hit:', products);
  } else {
    // Cache miss:
    // The requested data was not found in Redis.
    console.log('Cache miss');

    // Simulate fetching products from the database.
    const products = dbProducts;

    console.log('Fetched from database:', products);

    // Store the database result in Redis.
    // SETEX stores the value and automatically deletes it
    // after the specified TTL.
    await redisClient.setEx(productsCacheKey, cacheTtlSeconds, JSON.stringify(products));

    console.log('Products cached in Redis:', products);
  }

  // --------------------------------------------------
  // Stale Cache Problem
  // --------------------------------------------------
  // Imagine that the data in the database changes while
  // the old version is still stored in Redis.
  //
  // Database:
  // ['Keyboard', 'Mouse', 'Headphones', 'Headset', 'Monitor']
  //
  // Redis may still contain:
  // ['Keyboard', 'Mouse', 'Headphones', 'Headset']

  dbProducts = ['Keyboard', 'Mouse', 'Headphones', 'Headset', 'Monitor'];

  console.log('Database updated:', dbProducts);

  // --------------------------------------------------
  // Cache Invalidation
  // --------------------------------------------------
  // When the database data changes, delete the corresponding
  // cached data so that the next request fetches fresh data.
  await redisClient.del(productsCacheKey);

  console.log('Cache invalidated');

  // --------------------------------------------------
  // Fetch Fresh Data
  // --------------------------------------------------
  // The cache has been deleted, so the next request results
  // in a cache miss and retrieves the latest data from the database.

  const freshCachedProducts = await redisClient.get(productsCacheKey);

  if (freshCachedProducts === null) {
    console.log('Cache miss after invalidation');

    const freshProducts = dbProducts;

    console.log('Fetched fresh data from database:', freshProducts);

    // Store the fresh database data in Redis.
    await redisClient.setEx(productsCacheKey, cacheTtlSeconds, JSON.stringify(freshProducts));

    console.log('Fresh products cached in Redis:', freshProducts);
  }

  await redisClient.quit();
}

main().catch(error => {
  console.error('Redis demo failed:', error);
  process.exit(1);
});
