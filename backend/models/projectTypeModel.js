const pool = require('../config/database');

const findAll = async (activeOnly = true) => {
  const query = activeOnly
    ? 'SELECT * FROM project_types WHERE is_active = 1 ORDER BY name'
    : 'SELECT * FROM project_types ORDER BY name';
  const [rows] = await pool.query(query);
  return rows;
};

const findById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM project_types WHERE id = ?', [id]);
  return rows[0] || null;
};

const create = async ({ name, base_cost, base_days, description }) => {
  const [result] = await pool.query(
    'INSERT INTO project_types (name, base_cost, base_days, description) VALUES (?, ?, ?, ?)',
    [name, base_cost, base_days, description || null]
  );
  return findById(result.insertId);
};

const update = async (id, { name, base_cost, base_days, description, is_active }) => {
  await pool.query(
    `UPDATE project_types SET
      name = COALESCE(?, name),
      base_cost = COALESCE(?, base_cost),
      base_days = COALESCE(?, base_days),
      description = COALESCE(?, description),
      is_active = COALESCE(?, is_active)
    WHERE id = ?`,
    [name, base_cost, base_days, description, is_active, id]
  );
  return findById(id);
};

const remove = async (id) => {
  const [result] = await pool.query('DELETE FROM project_types WHERE id = ?', [id]);
  return result.affectedRows > 0;
};

const count = async () => {
  const [rows] = await pool.query('SELECT COUNT(*) as total FROM project_types');
  return rows[0].total;
};

module.exports = { findAll, findById, create, update, remove, count };
