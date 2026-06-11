const pool = require('../config/database');

const create = async (data) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [result] = await connection.query(
      `INSERT INTO estimations
        (client_name, email, project_type_id, total_cost, total_days, complexity, technology_stack, cost_breakdown, timeline_breakdown)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.client_name,
        data.email,
        data.project_type_id,
        data.total_cost,
        data.total_days,
        data.complexity,
        JSON.stringify(data.technology_stack),
        JSON.stringify(data.cost_breakdown),
        JSON.stringify(data.timeline_breakdown),
      ]
    );

    const estimationId = result.insertId;

    if (data.feature_ids && data.feature_ids.length > 0) {
      const values = data.feature_ids.map((fid) => [estimationId, fid]);
      await connection.query(
        'INSERT INTO estimation_features (estimation_id, feature_id) VALUES ?',
        [values]
      );
    }

    await connection.commit();
    return findById(estimationId);
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

const findById = async (id) => {
  const [rows] = await pool.query(
    `SELECT e.*, pt.name as project_type_name
     FROM estimations e
     JOIN project_types pt ON e.project_type_id = pt.id
     WHERE e.id = ?`,
    [id]
  );

  if (!rows[0]) return null;

  const estimation = rows[0];
  estimation.technology_stack = parseJson(estimation.technology_stack);
  estimation.cost_breakdown = parseJson(estimation.cost_breakdown);
  estimation.timeline_breakdown = parseJson(estimation.timeline_breakdown);

  const [features] = await pool.query(
    `SELECT f.id, f.feature_name, f.cost, f.days, f.complexity_weight
     FROM estimation_features ef
     JOIN features f ON ef.feature_id = f.id
     WHERE ef.estimation_id = ?`,
    [id]
  );
  estimation.features = features;

  return estimation;
};

const findAll = async ({ search, project_type_id, complexity, page = 1, limit = 20 } = {}) => {
  let where = 'WHERE 1=1';
  const params = [];

  if (search) {
    where += ' AND (e.client_name LIKE ? OR e.email LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }
  if (project_type_id) {
    where += ' AND e.project_type_id = ?';
    params.push(project_type_id);
  }
  if (complexity) {
    where += ' AND e.complexity = ?';
    params.push(complexity);
  }

  const offset = (page - 1) * limit;

  const [countResult] = await pool.query(
    `SELECT COUNT(*) as total FROM estimations e ${where}`,
    params
  );

  const [rows] = await pool.query(
    `SELECT e.*, pt.name as project_type_name
     FROM estimations e
     JOIN project_types pt ON e.project_type_id = pt.id
     ${where}
     ORDER BY e.created_at DESC
     LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  const estimations = rows.map((row) => ({
    ...row,
    technology_stack: parseJson(row.technology_stack),
    cost_breakdown: parseJson(row.cost_breakdown),
    timeline_breakdown: parseJson(row.timeline_breakdown),
  }));

  return {
    data: estimations,
    pagination: {
      total: countResult[0].total,
      page,
      limit,
      totalPages: Math.ceil(countResult[0].total / limit),
    },
  };
};

const count = async () => {
  const [rows] = await pool.query('SELECT COUNT(*) as total FROM estimations');
  return rows[0].total;
};

const parseJson = (value) => {
  if (typeof value === 'object') return value;
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
};

module.exports = { create, findById, findAll, count };
