const pool = require('../config/database');

const findByEmail = async (email) => {
  const [rows] = await pool.query(
    'SELECT id, name, email, password, role FROM users WHERE email = ?',
    [email]
  );
  return rows[0] || null;
};

const findById = async (id) => {
  const [rows] = await pool.query(
    'SELECT id, name, email, role FROM users WHERE id = ?',
    [id]
  );
  return rows[0] || null;
};

module.exports = { findByEmail, findById };
