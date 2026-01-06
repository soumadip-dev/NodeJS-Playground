const dotenv = require('dotenv');
const {
  createUsersTable,
  insertUser,
  fetchAllUsers,
  updateEmailOfUser,
  deleteUser,
} = require('./concepts/basic-queries');
const { getUserWhere, getSortedUser } = require('./concepts/filtering-sorting');

dotenv.config();

// Test basic queries
// async function testBasicQueries() {
//   try {
// await createUsersTable();
// await insertUser('Soumadip Majila', 'soumadipmajila@gmail.com');
// await insertUser('Amit Kumar', 'amit.kumar@gmail.com');
// await insertUser('Riya Sharma', 'riya.sharma@gmail.com');
// await insertUser('Ankit Verma', 'ankit.verma@gmail.com');
// await insertUser('Priya Das', 'priya.das@gmail.com');
// await insertUser('Rahul Sen', 'rahul.sen@gmail.com');
// await insertUser('Neha Gupta', 'neha.gupta@gmail.com');
// await insertUser('Sourav Paul', 'sourav.paul@gmail.com');
// await insertUser('Pooja Singh', 'pooja.singh@gmail.com');
// await insertUser('Arjun Malhotra', 'arjun.malhotra@gmail.com');
// await fetchAllUsers();
// await updateEmailOfUser('Soumadip Majila', 'soumadip.majila02@gmail.com');
// await deleteUser('Soumadip Majila');
//   } catch (error) {
//     console.error(error);
//   }
// }

// Filter and Sorting
async function testFilterAndSortQueries() {
  try {
    // const rFilteredUsers = await getUserWhere("username LIKE 'R%'");
    // console.log(rFilteredUsers);

    const sortedUserByUserName = await getSortedUser('username', 'DESC');
    console.log(sortedUserByUserName);
  } catch (error) {
    console.error(error);
  }
}

async function runAllQueries() {
  // await testBasicQueries();
  await testFilterAndSortQueries();
}

runAllQueries();
