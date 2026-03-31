const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { authenticate } = require('../middleware/auth');

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// POST /api/auth/signup - Student registration (requires admin approval)
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, phone, student_class, parent_name, parent_phone } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'Name, email and password required' });
    if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' });

    const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length) return res.status(400).json({ error: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 12);
    const [result] = await db.query(
      `INSERT INTO users (name, email, password, phone, role, is_active, is_approved) VALUES (?, ?, ?, ?, 'student', 0, 0)`,
      [name, email, hashed, phone || null]
    );
    const userId = result.insertId;

    // Generate unique enrollment number: TCH-YEAR-XXXX
    const year = new Date().getFullYear();
    const [[countRow]] = await db.query("SELECT COUNT(*) as count FROM student_profiles");
    const num = String(countRow.count + 1).padStart(4, '0');
    const enrollment_no = `TCH-${year}-${num}`;

    // Create student profile with enrollment number
    await db.query(
      `INSERT INTO student_profiles (user_id, student_class, parent_name, parent_phone, enrollment_no) VALUES (?, ?, ?, ?, ?)`,
      [userId, student_class || null, parent_name || null, parent_phone || null, enrollment_no]
    );

    res.status(201).json({
      message: `Registration successful! Your Enrollment ID is ${enrollment_no}. Account is pending admin approval.`
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email.toLowerCase().trim()]);
    if (!rows.length) return res.status(401).json({ error: 'Invalid email or password' });

    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid email or password' });

    if (!user.is_approved && user.role === 'student') {
      return res.status(403).json({ error: 'Your account is pending admin approval' });
    }
    if (!user.is_active) {
      return res.status(403).json({ error: 'Account has been deactivated. Contact support.' });
    }

    const token = generateToken(user);
    await db.query('UPDATE users SET last_login = NOW() WHERE id = ?', [user.id]);

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// GET /api/auth/me - Get current user
router.get('/me', authenticate, async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, name, email, phone, role, created_at FROM users WHERE id = ?',
      [req.user.id]
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// POST /api/auth/change-password
router.post('/change-password', authenticate, async (req, res) => {
  try {
    const { current_password, new_password } = req.body;
    if (!current_password || !new_password) return res.status(400).json({ error: 'Both passwords required' });
    if (new_password.length < 6) return res.status(400).json({ error: 'New password must be at least 6 characters' });

    const [rows] = await db.query('SELECT password FROM users WHERE id = ?', [req.user.id]);
    const valid = await bcrypt.compare(current_password, rows[0].password);
    if (!valid) return res.status(400).json({ error: 'Current password is incorrect' });

    const hashed = await bcrypt.hash(new_password, 12);
    await db.query('UPDATE users SET password = ? WHERE id = ?', [hashed, req.user.id]);
    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to change password' });
  }
});

module.exports = router;

// Helper to generate enrollment number
async function generateEnrollmentNo(db) {
  const year = new Date().getFullYear();
  const [[row]] = await db.query("SELECT COUNT(*) as count FROM users WHERE role='student'");
  const num = String(row.count + 1).padStart(4, '0');
  return `TCH-${year}-${num}`;
}
