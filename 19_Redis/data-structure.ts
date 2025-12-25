import { createClient, type RedisClientType } from 'redis';

const redisClient: RedisClientType = createClient({
  url: 'redis://localhost:6379',
});

// Redis client error event listener
redisClient.on('error', (redisError: Error) => {
  console.error('Redis client error occurred ❌', redisError);
});

// Function to test Redis connection and basic operations
const testRedisConnection = async (): Promise<void> => {
  try {
    // Connect to Redis
    await redisClient.connect();
    console.log('Connected to Redis successfully ✅');

    // Set a key-value pair
    await redisClient.set('name', 'soumadip');
    console.log('Key "name" set successfully 📝');

    // Get the value of a key
    const retrievedName = await redisClient.get('name');
    console.log('Retrieved value from Redis 📦:', retrievedName);

    // Delete the key
    const deletedKeyCount = await redisClient.del('name');
    console.log('Deleted keys count 🗑️:', deletedKeyCount);

    // Set and increment a numeric value
    await redisClient.set('count', 100);
    const incrementedCount = await redisClient.incr('count');
    console.log('Incremented count value ➕:', incrementedCount);

    // Decrement the numeric value
    const decrementedCount = await redisClient.decr('count');
    console.log('Decremented count value ➖:', decrementedCount);
  } catch (error) {
    console.error('Redis connection failed ⚠️', error);
  } finally {
    // Close Redis connection
    await redisClient.quit();
    console.log('Redis connection closed 👋');
  }
};

// Execute Redis test
// testRedisConnection();

// Demonstrate Redis data structures and commands
const demoRedisDataStructures = async (): Promise<void> => {
  try {
    // Connect to Redis
    await redisClient.connect();
    console.log('Connected to Redis successfully ✅');

    // Strings: SET, GET
    await redisClient.set('user:name', 'soumadipMajila');
    const storedUserName = await redisClient.get('user:name');
    console.log('User name 👤:', storedUserName);

    // Multiple set operations: MSET
    await redisClient.mSet([
      'user:email',
      'soumadipmajila@gmail.com',
      'user:age',
      '24',
      'user:country',
      'India',
    ]);

    // Multiple get operations: MGET
    const [storedUserEmail, storedUserAge, storedUserCountry] = await redisClient.mGet([
      'user:email',
      'user:age',
      'user:country',
    ]);

    console.log(
      `User details 📄 → Email: ${storedUserEmail}, Age: ${storedUserAge}, Country: ${storedUserCountry}`
    );

    // Lists: LPUSH, LRANGE, LPOP
    await redisClient.lPush('tasks', ['task1', 'task2', 'task3']);

    const taskList = await redisClient.lRange('tasks', 0, -1);
    console.log('All tasks 📋:', taskList);

    const removedTask = await redisClient.lPop('tasks');
    console.log('Popped first task 🧹:', removedTask);

    const remainingTaskList = await redisClient.lRange('tasks', 0, -1);
    console.log('Remaining tasks 🧾:', remainingTaskList);

    // Sets: SADD, SMEMBERS, SISMEMBER, SREM
    await redisClient.sAdd('user:nickName', ['Babu', 'Bikash', 'Souma']);

    const nicknameSet = await redisClient.sMembers('user:nickName');
    console.log('Nicknames 🎭:', nicknameSet);

    const isNicknamePresent = await redisClient.sIsMember('user:nickName', 'Babu');
    console.log('Is "Babu" a nickname of Soumadip?', isNicknamePresent ? 'Yes ✅' : 'No ❌');

    await redisClient.sRem('user:nickName', 'Babu');

    const updatedNicknameSet = await redisClient.sMembers('user:nickName');
    console.log('Updated nicknames 🔄:', updatedNicknameSet);

    // Sorted Sets: ZADD, ZRANGE, ZRANK
    await redisClient.zAdd('cart', [
      { score: 100, value: 'Cart 1' },
      { score: 150, value: 'Cart 2' },
      { score: 20, value: 'Cart 3' },
    ]);

    const cartItems = await redisClient.zRange('cart', 0, -1);
    console.log('Cart items 🛒:', cartItems);

    const cartItemsWithScores = await redisClient.zRangeWithScores('cart', 0, -1);
    console.log('Cart items with scores 📊:', cartItemsWithScores);

    const cartTwoRank = await redisClient.zRank('cart', 'Cart 2');
    console.log('Rank of Cart 2 🏷️:', cartTwoRank);

    // Hashes: HSET, HGET, HGETALL, HDEL
    await redisClient.hSet('product:1', {
      name: 'Product 1',
      description: 'Product one description',
      rating: '5',
    });

    const productRating = await redisClient.hGet('product:1', 'rating');
    console.log('Product rating ⭐:', productRating);

    const productDetails = await redisClient.hGetAll('product:1');
    console.log('Product details 📦:', productDetails);

    await redisClient.hDel('product:1', 'rating');

    const updatedProductDetails = await redisClient.hGetAll('product:1');
    console.log('Updated product details 🔁:', updatedProductDetails);
  } catch (error) {
    console.error('Error while working with Redis data structures ❌', error);
  } finally {
    // Close Redis connection
    await redisClient.quit();
    console.log('Redis connection closed 👋');
  }
};

// Execute Redis data structure demo
demoRedisDataStructures();
