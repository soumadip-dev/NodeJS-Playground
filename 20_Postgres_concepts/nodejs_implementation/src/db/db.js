const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

// Create a new pool instance to manage database connections
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function query(text, params) {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);

    // execution time
    const duration = Date.now() - start;

    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

module.exports = { query };
