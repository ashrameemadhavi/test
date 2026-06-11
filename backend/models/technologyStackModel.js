const pool = require('../config/database');

const findByProjectTypeId = async (projectTypeId) => {
  const [rows] = await pool.query(
    'SELECT * FROM technology_stacks WHERE project_type_id = ?',
    [projectTypeId]
  );
  return rows[0] || null;
};

const findAll = async () => {
  const [rows] = await pool.query(
    `SELECT ts.*, pt.name as project_type_name
     FROM technology_stacks ts
     JOIN project_types pt ON ts.project_type_id = pt.id
     ORDER BY pt.name`
  );
  return rows;
};

const upsert = async ({ project_type_id, frontend, backend, database_name, ai_service, additional_notes }) => {
  const existing = await findByProjectTypeId(project_type_id);

  if (existing) {
    await pool.query(
      `UPDATE technology_stacks SET
        frontend = ?, backend = ?, database_name = ?, ai_service = ?, additional_notes = ?
       WHERE project_type_id = ?`,
      [frontend, backend, database_name, ai_service, additional_notes, project_type_id]
    );
    return findByProjectTypeId(project_type_id);
  }

  const [result] = await pool.query(
    `INSERT INTO technology_stacks (project_type_id, frontend, backend, database_name, ai_service, additional_notes)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [project_type_id, frontend, backend, database_name, ai_service, additional_notes]
  );

  const [rows] = await pool.query('SELECT * FROM technology_stacks WHERE id = ?', [result.insertId]);
  return rows[0];
};

const getFeatureRules = async () => {
  const [rows] = await pool.query(
    `SELECT sfr.*, f.feature_name
     FROM stack_feature_rules sfr
     JOIN features f ON sfr.feature_id = f.id`
  );
  return rows;
};

const getFeatureRulesForFeatures = async (featureIds) => {
  if (!featureIds || featureIds.length === 0) return [];
  const placeholders = featureIds.map(() => '?').join(',');
  const [rows] = await pool.query(
    `SELECT sfr.*, f.feature_name
     FROM stack_feature_rules sfr
     JOIN features f ON sfr.feature_id = f.id
     WHERE sfr.feature_id IN (${placeholders})`,
    featureIds
  );
  return rows;
};

const upsertFeatureRule = async ({ feature_id, stack_key, stack_value }) => {
  await pool.query(
    `INSERT INTO stack_feature_rules (feature_id, stack_key, stack_value)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE stack_value = VALUES(stack_value)`,
    [feature_id, stack_key, stack_value]
  );
  const [rows] = await pool.query(
    'SELECT * FROM stack_feature_rules WHERE feature_id = ? AND stack_key = ?',
    [feature_id, stack_key]
  );
  return rows[0];
};

const deleteFeatureRule = async (id) => {
  const [result] = await pool.query('DELETE FROM stack_feature_rules WHERE id = ?', [id]);
  return result.affectedRows > 0;
};

module.exports = {
  findByProjectTypeId,
  findAll,
  upsert,
  getFeatureRules,
  getFeatureRulesForFeatures,
  upsertFeatureRule,
  deleteFeatureRule,
};
