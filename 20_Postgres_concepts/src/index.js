const dotenv = require('dotenv');
const { createUsersTable, insertUser } = require('./concepts/basic-queries');

dotenv.config();

// Test basic queries
async function testBasicQueries() {
  try {
    // await createUsersTable();

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
  } catch (error) {
    console.error(error);
  }
}

async function runAllQueries() {
  await testBasicQueries();
}

runAllQueries();
