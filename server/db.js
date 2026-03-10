const mysql = require('mysql2/promise');

const config = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'NewsGuard',
};

let pool;

function getPool() {
  if (!pool) {
    throw new Error('Database pool has not been initialized.');
  }

  return pool;
}

async function ensureDatabaseSetup() {
  pool = mysql.createPool({
    ...config,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  await pool.query('SELECT 1 FROM users LIMIT 1');
  await pool.query('SELECT 1 FROM roles LIMIT 1');
  await pool.query('SELECT 1 FROM userroles LIMIT 1');
  await pool.query(`
    INSERT INTO roles (name, description)
    SELECT 'general-reader', 'General reader access'
    WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name = 'general-reader')
  `);
  await pool.query(`
    INSERT INTO roles (name, description)
    SELECT 'journalist', 'Journalist access'
    WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name = 'journalist')
  `);
  await pool.query(`
    INSERT INTO roles (name, description)
    SELECT 'student', 'Student access'
    WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name = 'student')
  `);
  await pool.query(`
    INSERT INTO roles (name, description)
    SELECT 'developer', 'Developer access'
    WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name = 'developer')
  `);
}

module.exports = {
  getPool,
  ensureDatabaseSetup,
};
