const db = require('../db/db');

async function createUsersTable() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(50) UNIQUE NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await db.query(createTableQuery);
    console.log('Users table created or already exists');
  } catch (error) {
    console.error('Error creating users table:', error);
    throw error;
  }
}

async function insertUser(username, email) {
  const insertUserQuery = `
    INSERT INTO users (username, email)
    VALUES ($1, $2)
    RETURNING *
  `;

  try {
    const res = await db.query(insertUserQuery, [username, email]);
    console.log('User inserted:', res.rows[0]);
    return res.rows[0];
  } catch (error) {
    console.error('Error inserting user:', error);
    throw error;
  }
}

async function fetchAllUsers() {
  const fetchUsersQuery = `
    SELECT * FROM users;
  `;

  try {
    const res = await db.query(fetchUsersQuery);
    console.log('Fetched users:', res.rows);
    return res.rows;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

async function updateEmailOfUser(username, newEmail) {
  const updateUserQuery = `
    UPDATE users
    SET email = $2
    WHERE username = $1
    RETURNING *
  `;

  try {
    const res = await db.query(updateUserQuery, [username, newEmail]);
    console.log('User updated:', res.rows[0]);
    return res.rows[0];
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}

async function deleteUser(username) {
  const deleteUserQuery = `
    DELETE FROM users
    WHERE username = $1
    RETURNING *
  `;

  try {
    const res = await db.query(deleteUserQuery, [username]);
    console.log('User deleted:', res.rows[0]);
    return res.rows[0];
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
}

module.exports = {
  createUsersTable,
  insertUser,
  fetchAllUsers,
  updateEmailOfUser,
  deleteUser,
};
