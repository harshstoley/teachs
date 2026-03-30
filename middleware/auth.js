const jwt = require('jsonwebtoken');
const db = require('../config/db');

// Verify JWT token
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get fresh user from DB
    const [rows] = await db.query('SELECT id, name, email, role, is_active FROM users WHERE id = ?', [decoded.id]);
    if (!rows.length) return res.status(401).json({ error: 'User not found' });
    if (!rows[0].is_active) return res.status(401).json({ error: 'Account deactivated' });
    
    req.user = rows[0];
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') return res.status(401).json({ error: 'Token expired' });
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Require specific role(s)
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    next();
  };
};

// Admin only
const adminOnly = [authenticate, requireRole('admin')];

// Teacher or Admin
const teacherOrAdmin = [authenticate, requireRole('teacher', 'admin')];

// Student or Admin
const studentOrAdmin = [authenticate, requireRole('student', 'admin')];

module.exports = { authenticate, requireRole, adminOnly, teacherOrAdmin, studentOrAdmin };
