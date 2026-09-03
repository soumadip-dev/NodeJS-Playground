import { db } from './db';

async function createUserTable() {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        age INTEGER NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL
      );
    `);

    console.log('✅ Table users created successfully');
  } catch (error) {
    console.error('❌ Error creating table users:', error);
  } finally {
    await db.end();
  }
}

createUserTable();
