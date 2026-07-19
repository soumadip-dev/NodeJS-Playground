const dotenv = require('dotenv');
const {
  createUsersTable,
  insertUser,
  fetchAllUsers,
  updateEmailOfUser,
  deleteUser,
} = require('./concepts/basic-queries');
const { getUserWhere, getSortedUser, getPaginatedUser } = require('./concepts/filtering-sorting');
const { createPostTable, insertNewPost } = require('./concepts/relationships');
const {
  getUsersWithPost,
  getAllUsersWithTheirPosts,
  getAllPostsWithTheirUsers,
} = require('./concepts/joins');
const { countPostByUsers, averagePostsPerUser } = require('./concepts/aggregation');

dotenv.config();

//* Test basic CRUD queries
async function testBasicQueries() {
  try {
    await createUsersTable();
    await insertUser('Soumadip Majila', 'soumadipmajila@gmail.com');
    await insertUser('Amit Kumar', 'amit.kumar@gmail.com');
    await insertUser('Riya Sharma', 'riya.sharma@gmail.com');
    await insertUser('Ankit Verma', 'ankit.verma@gmail.com');
    await insertUser('Priya Das', 'priya.das@gmail.com');
    await insertUser('Rahul Sen', 'rahul.sen@gmail.com');
    await insertUser('Neha Gupta', 'neha.gupta@gmail.com');
    await insertUser('Sourav Paul', 'sourav.paul@gmail.com');
    await insertUser('Pooja Singh', 'pooja.singh@gmail.com');
    await insertUser('Arjun Malhotra', 'arjun.malhotra@gmail.com');
    await fetchAllUsers();
    await updateEmailOfUser('Soumadip Majila', 'soumadip.majila02@gmail.com');
    await deleteUser('Soumadip Majila');
  } catch (error) {
    console.error(error);
  }
}

//* Test filtering, sorting, and pagination queries
async function testFilterAndSortQueries() {
  try {
    const rFilteredUsers = await getUserWhere("username LIKE 'R%'");
    console.log(rFilteredUsers);

    const sortedUserByUserName = await getSortedUser('username', 'DESC');
    console.log(sortedUserByUserName);

    const paginatedUser = await getPaginatedUser(2, 3);
    console.log(paginatedUser);
  } catch (error) {
    console.error(error);
  }
}

//* Test relationship (foreign key) queries
async function testRelationshipQueries() {
  try {
    await createPostTable();
    const newPost = await insertNewPost('My first post', 'This is post content', 3);
    console.log(newPost);
  } catch (error) {
    console.error(error);
  }
}

//* Test JOIN queries
async function testJoinsQueries() {
  try {
    const userWithPost = await getUsersWithPost();
    console.log(userWithPost);

    const allUserswithPosts = await getAllUsersWithTheirPosts();
    console.log(allUserswithPosts);

    const allPostsWithUser = await getAllPostsWithTheirUsers();
    console.log(allPostsWithUser);
  } catch (error) {
    console.error(error);
  }
}

//* Test aggregation queries
async function testAggregationQueries() {
  try {
    const usersWithPostCount = await countPostByUsers();
    console.log(usersWithPostCount);
    const avgPostPerUser = await averagePostsPerUser();
    console.log(avgPostPerUser);
  } catch (error) {
    console.error(error);
  }
}

//* Run selected test suites
async function runAllQueries() {
  // await testBasicQueries();
  // await testFilterAndSortQueries();
  // await testRelationshipQueries();
  // await testJoinsQueries();
  await testAggregationQueries();
}

runAllQueries();
