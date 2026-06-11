const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

async function seed() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true,
  });

  try {
    console.log('Running schema...');
    const schema = fs.readFileSync(path.join(__dirname, '../../database/schema.sql'), 'utf8');
    await connection.query(schema);

    console.log('Clearing existing seed data...');
    await connection.query('USE smart_it_estimation');
    await connection.query('SET FOREIGN_KEY_CHECKS = 0');
    await connection.query('TRUNCATE TABLE estimation_features');
    await connection.query('TRUNCATE TABLE estimations');
    await connection.query('TRUNCATE TABLE stack_feature_rules');
    await connection.query('TRUNCATE TABLE technology_stacks');
    await connection.query('TRUNCATE TABLE features');
    await connection.query('TRUNCATE TABLE project_types');
    await connection.query('TRUNCATE TABLE users');
    await connection.query('SET FOREIGN_KEY_CHECKS = 1');

    const hashedPassword = await bcrypt.hash('admin123', 10);
    await connection.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      ['System Admin', 'admin@smartit.com', hashedPassword, 'admin']
    );

    console.log('Seeding project types, features, and stacks...');
    const seed = fs.readFileSync(path.join(__dirname, '../../database/seed.sql'), 'utf8');
    const seedWithoutAdmin = seed
      .replace(/USE smart_it_estimation;\s*/i, '')
      .replace(/-- Default Admin[\s\S]*?'admin'\);\s*/i, '');
    await connection.query(seedWithoutAdmin);

    console.log('Database seeded successfully!');
    console.log('Admin credentials: admin@smartit.com / admin123');
  } catch (error) {
    console.error('Seed failed:', error.message);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

seed();
