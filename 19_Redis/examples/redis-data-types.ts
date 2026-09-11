/**
 * Redis Data Types:
 *
 * - String
 * - Hash
 * - List
 * - Set
 * - Sorted Set
 * - TTL (Time To Live)
 */

import dotenv from 'dotenv';
import { createClient } from 'redis';

dotenv.config();

const redisUrl = process.env.REDIS_URL;

const redisClient = createClient({ url: redisUrl });

async function runRedisDemo() {
  // Establish a connection with the Redis server.
  await redisClient.connect();

  console.log('Connected to Redis');
  console.log('PING:', await redisClient.ping());

  // --------------------------------------------------
  // String
  // --------------------------------------------------
  // A Redis String stores a single value under a key.
  // It can be used for text, numbers, counters, JSON strings, etc.
  //
  // Example:
  // Key   -> demo:page_views
  // Value -> "100"

  const pageViewsKey = 'demo:page_views';

  await redisClient.set(pageViewsKey, '100');

  const pageViews = await redisClient.get(pageViewsKey);

  console.log('Page views:', pageViews);

  // Redis Strings can also be used as counters.
  // INCR increases the numeric value stored at the key by 1.
  const updatedPageViews = await redisClient.incr(pageViewsKey);

  console.log('Page views after increment:', updatedPageViews);

  // --------------------------------------------------
  // Hash
  // --------------------------------------------------
  // A Redis Hash stores multiple field-value pairs under a single key.
  // It is useful for representing small objects or records.
  //
  // Example:
  // Key -> demo:user:profile
  //
  // Fields:
  //   name
  //   age
  //   email
  //   phone

  const userProfileKey = 'demo:user:profile';

  await redisClient.hSet(userProfileKey, {
    name: 'John Doe',
    age: '30',
    email: 'john@example.com',
    phone: '+1 (555) 555-5555',
  });

  const userProfile = await redisClient.hGetAll(userProfileKey);

  console.log('User profile:', userProfile);

  // --------------------------------------------------
  // List
  // --------------------------------------------------
  // A Redis List is an ordered collection of values stored under one key.
  //
  // Common List commands:
  // - LPUSH  -> Adds a value to the beginning of the list.
  // - RPUSH  -> Adds a value to the end of the list.
  // - LRANGE -> Returns values within a specified range.
  // - LSET   -> Updates the value at a specific index.
  // - LTRIM  -> Keeps only the specified range of elements.

  const friendsListKey = 'demo:user:friends';

  // LPUSH adds each value to the beginning of the list.
  await redisClient.lPush(friendsListKey, 'John');
  await redisClient.lPush(friendsListKey, 'Jane');
  await redisClient.lPush(friendsListKey, 'Bob');

  const friendsAfterLeftPush = await redisClient.lRange(friendsListKey, 0, -1);

  console.log('Friends after LPUSH:', friendsAfterLeftPush);

  // RPUSH adds values to the end of the list.
  await redisClient.rPush(friendsListKey, 'Dave');
  await redisClient.rPush(friendsListKey, 'Alice');

  const friendsAfterRightPush = await redisClient.lRange(friendsListKey, 0, -1);

  console.log('Friends after RPUSH:', friendsAfterRightPush);

  // LSET updates the value at a specific index.
  await redisClient.lSet(friendsListKey, 0, 'Dave');
  await redisClient.lSet(friendsListKey, 1, 'Alice');

  const friendsAfterSet = await redisClient.lRange(friendsListKey, 0, -1);

  console.log('Friends after LSET:', friendsAfterSet);

  // LTRIM keeps only the elements within the specified range
  // and removes all elements outside that range.
  //
  // Example:
  // LTRIM key 0 2 -> keeps indexes 0, 1, and 2.
  await redisClient.lTrim(friendsListKey, 0, 2);

  const friendsAfterTrim = await redisClient.lRange(friendsListKey, 0, -1);

  console.log('Friends after LTRIM:', friendsAfterTrim);

  // --------------------------------------------------
  // Set
  // --------------------------------------------------
  // A Redis Set is an unordered collection of unique values.
  // Duplicate values are automatically ignored.
  //
  // Common Set commands:
  // - SADD     -> Adds one or more members to the Set.
  // - SCARD    -> Returns the number of members in the Set.
  // - SMEMBERS -> Returns all members of the Set.

  const tagsSetKey = 'demo:tags';

  await redisClient.sAdd(tagsSetKey, 'nodejs');
  await redisClient.sAdd(tagsSetKey, 'typescript');
  await redisClient.sAdd(tagsSetKey, 'react');

  // Adding a duplicate member has no effect.
  await redisClient.sAdd(tagsSetKey, 'react');

  // SCARD returns the number of unique members in the Set.
  const tagsCount = await redisClient.sCard(tagsSetKey);

  console.log('Number of tags:', tagsCount);

  // SMEMBERS returns all members of the Set.
  const tags = await redisClient.sMembers(tagsSetKey);

  console.log('Set members:', tags);

  // --------------------------------------------------
  // Sorted Set
  // --------------------------------------------------
  // A Redis Sorted Set stores unique members along with a score.
  // Members are automatically ordered by their scores.
  //
  // Common Sorted Set commands:
  // - ZADD      -> Adds a member with a score.
  // - ZINCRBY   -> Increases a member's score.
  // - ZRANK     -> Returns the zero-based rank in ascending order.
  // - ZREVRANK  -> Returns the zero-based rank in descending order.
  //
  // Example:
  // player1 -> 100
  // player2 -> 200

  const leaderboardKey = 'demo:leaderboard';

  await redisClient.zAdd(leaderboardKey, {
    score: 100,
    value: 'player1',
  });

  await redisClient.zAdd(leaderboardKey, {
    score: 200,
    value: 'player2',
  });

  // ZINCRBY increases the score of an existing member.
  //
  // player1: 100 + 10 = 110
  const updatedPlayerScore = await redisClient.zIncrBy(leaderboardKey, 10, 'player1');

  console.log('Player1 new score:', updatedPlayerScore);

  // ZRANK returns the zero-based rank in ascending order.
  //
  // Current scores:
  // player1 -> 110
  // player2 -> 200
  //
  // Ascending order:
  // 0 -> player1
  // 1 -> player2

  const playerAscendingRank = await redisClient.zRank(leaderboardKey, 'player1');

  // ZREVRANK returns the zero-based rank in descending order.
  //
  // Descending order:
  // 0 -> player2
  // 1 -> player1

  const playerDescendingRank = await redisClient.zRevRank(leaderboardKey, 'player1');

  console.log('Player1 ascending rank:', playerAscendingRank);
  console.log('Player1 descending rank:', playerDescendingRank);

  // --------------------------------------------------
  // TTL / Expiration
  // --------------------------------------------------
  // TTL (Time To Live) defines how long a key should remain
  // in Redis before it is automatically deleted.
  //
  // Example:
  // Key   -> demo:otp
  // Value -> "345"
  // TTL   -> 60 seconds
  //
  // After 60 seconds, Redis automatically deletes the key.

  const otpKey = 'demo:otp';

  await redisClient.set(otpKey, '345');

  // EXPIRE sets an expiration time for the key in seconds.
  await redisClient.expire(otpKey, 60);

  // TTL returns the remaining lifetime of the key in seconds.
  const remainingTtl = await redisClient.ttl(otpKey);

  console.log('Remaining TTL:', remainingTtl);

  // Close the connection with the Redis server.
  await redisClient.quit();
}

runRedisDemo().catch(error => {
  console.error('Redis demo failed:', error);
  process.exit(1);
});
