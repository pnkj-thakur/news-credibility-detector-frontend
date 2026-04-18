require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const { getPool, ensureDatabaseSetup } = require('./db');

const app = express();
const port = Number(process.env.PORT || 5001);

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
  })
);
app.use(express.json());

app.get('/api/health', async (_req, res) => {
  try {
    await getPool().query('SELECT 1');
    res.json({ status: 'ok', database: 'connected' });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Database connection failed',
      details: error.message,
    });
  }
});

app.post('/api/auth/signup', async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required.' });
  }

  if (password.length < 8) {
    return res.status(400).json({ message: 'Password must be at least 8 characters.' });
  }

  try {
    const [existingUsers] = await getPool().query(
      'SELECT id FROM users WHERE email = ? LIMIT 1',
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({ message: 'An account with that email already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const connection = await getPool().getConnection();

    try {
      await connection.beginTransaction();

      const [roleRows] = await connection.query(
        'SELECT id, name FROM roles WHERE name = ? LIMIT 1',
        [role || 'general-reader']
      );

      if (roleRows.length === 0) {
        await connection.rollback();
        return res.status(400).json({
          message: `Role "${role || 'general-reader'}" was not found in the database.`,
        });
      }

      const [result] = await connection.query(
        `
          INSERT INTO users (email, password_hash, full_name, status)
          VALUES (?, ?, ?, 'active')
        `,
        [email, passwordHash, name]
      );

      await connection.query(
        `
          INSERT INTO userroles (user_id, role_id)
          VALUES (?, ?)
        `,
        [result.insertId, roleRows[0].id]
      );

      await connection.commit();

      return res.status(201).json({
        user: {
          id: result.insertId,
          name,
          email,
          role: roleRows[0].name,
          roles: [roleRows[0].name],
          status: 'active',
        },
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    return res.status(500).json({
      message: 'Unable to create account.',
      details: error.message,
    });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    const [users] = await getPool().query(
      `
        SELECT
          u.id,
          u.full_name,
          u.email,
          u.status,
          u.password_hash,
          GROUP_CONCAT(r.name ORDER BY r.name SEPARATOR ',') AS role_names
        FROM users u
        LEFT JOIN userroles ur ON ur.user_id = u.id
        LEFT JOIN roles r ON r.id = ur.role_id
        WHERE u.email = ?
        GROUP BY u.id, u.full_name, u.email, u.status, u.password_hash
        LIMIT 1
      `,
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const user = users[0];

    if (user.status !== 'active') {
      return res.status(403).json({ message: `Account is ${user.status}.` });
    }

    const passwordMatches = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatches) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const roles = user.role_names ? user.role_names.split(',') : [];

    return res.json({
      user: {
        id: user.id,
        name: user.full_name,
        email: user.email,
        role: roles[0] || null,
        roles,
        status: user.status,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Unable to log in.',
      details: error.message,
    });
  }
});

async function startServer() {
  try {
    await ensureDatabaseSetup();
    app.listen(port, () => {
      console.log(`API server running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Server startup failed:', error.message);
    process.exit(1);
  }
}


app.get('/api/articles', async (req, res) => {
  const { userId} = req.query;
  if (!userId) {
    return res.status(400).json({ message: "userID required" });
  }
  try {
    const [rows] = await getPool().query(
      `SELECT
        article_id AS id,
        title,
        content,
        source,
        label,
        score,
        summary,
        analyzed_at
      FROM analysis_results
      WHERE user_id = ?
      ORDER BY analyzed_at DESC`,
      [userId]
    );
    res.json(rows);
  } catch (error) {
     res.status(500).json({ message: 'Failed to load articles', error: error.message});
  }
});

app.post('/api/articles', async (req, res) => {
  const { userId, title, content, source, score, label, summary} = req.body;
  try {
    const [result] = await getPool().query(
      `INSERT INTO analysis_results
        (user_id, title, content, source, score, label, summary)
       VALUES (? ,? ,?, ?, ?, ?, ?)`,
        [userId, title, content, source, score, label, summary]
    );
    res.status(201).json({ message: 'Analysis saved!', articleId: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Failed to save analysis', error: error.message });
  }
});

startServer();
