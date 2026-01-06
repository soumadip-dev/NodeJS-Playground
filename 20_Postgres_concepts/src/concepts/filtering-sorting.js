const db = require('../db/db');

async function getUserWhere(condition) {
  const fetchUsersQuery = `
    SELECT * FROM users
    WHERE ${condition}
  `;

  try {
    const res = await db.query(fetchUsersQuery);
    return res.rows;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

async function getSortedUser(column, order = 'ASC') {
  const fetchSortedUsersQuery = `
    SELECT * FROM users
    ORDER BY ${column} ${order}
  `;

  try {
    const res = await db.query(fetchSortedUsersQuery);
    return res.rows;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

module.exports = { getUserWhere, getSortedUser };
