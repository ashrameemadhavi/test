const pool = require('../config/database');

const findAll = async (activeOnly = true) => {
  const query = activeOnly
    ? 'SELECT * FROM features WHERE is_active = 1 ORDER BY feature_name'
    : 'SELECT * FROM features ORDER BY feature_name';
  const [rows] = await pool.query(query);
  return rows;
};

const findById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM features WHERE id = ?', [id]);
  return rows[0] || null;
};

const findByIds = async (ids) => {
  if (!ids || ids.length === 0) return [];
  const placeholders = ids.map(() => '?').join(',');
  const [rows] = await pool.query(
    `SELECT * FROM features WHERE id IN (${placeholders}) AND is_active = 1`,
    ids
  );
  return rows;
};

const create = async ({ feature_name, cost, days, complexity_weight, description }) => {
  const [result] = await pool.query(
    'INSERT INTO features (feature_name, cost, days, complexity_weight, description) VALUES (?, ?, ?, ?, ?)',
    [feature_name, cost, days, complexity_weight, description || null]
  );
  return findById(result.insertId);
};

const update = async (id, data) => {
  const fields = [];
  const values = [];

  const allowed = ['feature_name', 'cost', 'days', 'complexity_weight', 'description', 'is_active'];
  for (const key of allowed) {
    if (data[key] !== undefined) {
      fields.push(`${key} = ?`);
      values.push(data[key]);
    }
  }

  if (fields.length === 0) return findById(id);

  values.push(id);
  await pool.query(`UPDATE features SET ${fields.join(', ')} WHERE id = ?`, values);
  return findById(id);
};

const remove = async (id) => {
  const [result] = await pool.query('DELETE FROM features WHERE id = ?', [id]);
  return result.affectedRows > 0;
};

const count = async () => {
  const [rows] = await pool.query('SELECT COUNT(*) as total FROM features');
  return rows[0].total;
};

module.exports = { findAll, findById, findByIds, create, update, remove, count };
