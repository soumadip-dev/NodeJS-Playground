const dotenv = require('dotenv');
const { createUsersTable } = require('./concepts/basic-queries');

dotenv.config();

// Test basic queries
async function testBasicQueries() {
  try {
    // await createUsersTable();
  } catch (error) {
    console.error(error);
  }
}

async function runAllQueries() {
  await testBasicQueries();
}

runAllQueries();
