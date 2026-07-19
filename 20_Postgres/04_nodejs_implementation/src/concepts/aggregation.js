const db = require('../db/db');

async function countPostByUsers() {
  const countPostByUsersQuery = `
    SELECT users.username, COUNT(posts.id) AS post_count
    FROM users
    LEFT JOIN posts ON users.id = posts.user_id
    GROUP BY users.id, users.username
  `;

  try {
    const res = await db.query(countPostByUsersQuery);
    console.log('Fetched users with their post counts (LEFT JOIN)');
    return res.rows;
  } catch (error) {
    console.error('Error fetching users with post counts (LEFT JOIN):', error);
    throw error;
  }
}

async function averagePostsPerUser() {
  const averagePostsPerUserQuery = `
    SELECT AVG(post_count) AS average_post
    FROM (
      SELECT COUNT(posts.id) AS post_count
      FROM users
      LEFT JOIN posts ON users.id = posts.user_id
      GROUP BY users.id
    ) AS user_per_counts
  `;

  try {
    const res = await db.query(averagePostsPerUserQuery);
    console.log('Fetched average posts per user');
    return res.rows[0].average_post; // Return single numeric value
  } catch (error) {
    console.error('Error fetching average posts per user:', error);
    throw error;
  }
}

module.exports = { countPostByUsers, averagePostsPerUser };
