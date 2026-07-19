const db = require('../db/db');

// INNER JOIN: returns only users who have posts
// LEFT JOIN: returns all users, even if they have no posts
// RIGHT JOIN: returns all posts, even if they have no matching users

async function getUsersWithPosts() {
  const getUsersWithPostsQuery = `
    SELECT users.id, users.username, posts.title
    FROM users
    INNER JOIN posts ON users.id = posts.user_id
  `;

  try {
    const res = await db.query(getUsersWithPostsQuery);
    console.log('Fetched users with their posts (INNER JOIN)');
    return res.rows;
  } catch (error) {
    console.error('Error fetching users with posts (INNER JOIN):', error);
    throw error;
  }
}

async function getAllUsersWithTheirPosts() {
  const getAllUsersWithTheirPostsQuery = `
    SELECT users.id, users.username, posts.title
    FROM users
    LEFT JOIN posts ON users.id = posts.user_id
  `;

  try {
    const res = await db.query(getAllUsersWithTheirPostsQuery);
    console.log('Fetched all users with their posts (LEFT JOIN)');
    return res.rows;
  } catch (error) {
    console.error('Error fetching users with posts (LEFT JOIN):', error);
    throw error;
  }
}

async function getAllPostsWithTheirUsers() {
  const getAllPostsWithTheirUsersQuery = `
    SELECT users.id, users.username, posts.title
    FROM users
    RIGHT JOIN posts ON users.id = posts.user_id
  `;

  try {
    const res = await db.query(getAllPostsWithTheirUsersQuery);
    console.log('Fetched all posts with their users (RIGHT JOIN)');
    return res.rows;
  } catch (error) {
    console.error('Error fetching posts with users (RIGHT JOIN):', error);
    throw error;
  }
}

module.exports = {
  getUsersWithPosts,
  getAllUsersWithTheirPosts,
  getAllPostsWithTheirUsers,
};
