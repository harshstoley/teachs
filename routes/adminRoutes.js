const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../config/db');
const { adminOnly } = require('../middleware/auth');

// ---- DASHBOARD STATS ----
router.get('/stats', ...adminOnly, async (req, res) => {
  try {
    const [[students]] = await db.query("SELECT COUNT(*) as count FROM users WHERE role='student'");
    const [[teachers]] = await db.query("SELECT COUNT(*) as count FROM users WHERE role='teacher'");
    const [[leads]] = await db.query("SELECT COUNT(*) as count FROM leads WHERE status='new'");
    const [[payments]] = await db.query("SELECT COALESCE(SUM(amount),0) as total FROM payments WHERE status='captured'");
    const [[pendingApprovals]] = await db.query("SELECT COUNT(*) as count FROM users WHERE is_approved=0 AND role='student'");
    res.json({ students: students.count, teachers: teachers.count, new_leads: leads.count, total_revenue: payments.total, pending_approvals: pendingApprovals.count });
  } catch (err) { res.status(500).json({ error: 'Failed to fetch stats' }); }
});

// ---- USER MANAGEMENT ----
router.get('/users', ...adminOnly, async (req, res) => {
  try {
    const { role, search, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    let where = 'WHERE 1=1';
    const params = [];
    if (role) { where += ' AND u.role = ?'; params.push(role); }
    if (search) { where += ' AND (u.name LIKE ? OR u.email LIKE ?)'; params.push(`%${search}%`, `%${search}%`); }
    const [users] = await db.query(
      `SELECT u.id, u.name, u.email, u.phone, u.role, u.is_active, u.is_approved, u.created_at, u.last_login,
       sp.enrollment_no, tp.teacher_code
       FROM users u
       LEFT JOIN student_profiles sp ON u.id = sp.user_id
       LEFT JOIN teacher_profiles tp ON u.id = tp.user_id
       ${where} ORDER BY u.created_at DESC LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), parseInt(offset)]
    );
    const [count] = await db.query(`SELECT COUNT(*) as total FROM users u ${where}`, params);
    res.json({ users, total: count[0].total });
  } catch (err) {
    console.error('users error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

router.put('/users/:id/approve', ...adminOnly, async (req, res) => {
  try { await db.query('UPDATE users SET is_approved=1, is_active=1 WHERE id=?', [req.params.id]); res.json({ message: 'Approved' }); }
  catch (err) { res.status(500).json({ error: 'Failed' }); }
});

router.put('/users/:id/toggle-active', ...adminOnly, async (req, res) => {
  try { await db.query('UPDATE users SET is_active = NOT is_active WHERE id=?', [req.params.id]); res.json({ message: 'Updated' }); }
  catch (err) { res.status(500).json({ error: 'Failed' }); }
});

router.delete('/users/:id', ...adminOnly, async (req, res) => {
  try { await db.query('DELETE FROM users WHERE id=?', [req.params.id]); res.json({ message: 'Deleted' }); }
  catch (err) { res.status(500).json({ error: 'Failed' }); }
});

// Create teacher account
router.post('/teachers', ...adminOnly, async (req, res) => {
  try {
    const { name, email, password, phone, subjects, qualification, bio } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'Name, email, password required' });
    const [ex] = await db.query('SELECT id FROM users WHERE email=?', [email]);
    if (ex.length) return res.status(400).json({ error: 'Email already exists' });
    const hashed = await bcrypt.hash(password, 12);
    const [result] = await db.query(
      `INSERT INTO users (name, email, password, phone, role, is_active, is_approved) VALUES (?,?,?,?,'teacher',1,1)`,
      [name, email, hashed, phone || null]
    );
    // Generate teacher code safely
    const [[countRow]] = await db.query("SELECT COUNT(*) as count FROM teacher_profiles");
    const teacherCode = `TCH-T-${String(countRow.count + 1).padStart(4, '0')}`;
    try {
      await db.query(
        `INSERT INTO teacher_profiles (user_id, subjects, qualification, bio, teacher_code) VALUES (?,?,?,?,?)`,
        [result.insertId, subjects || '', qualification || '', bio || '', teacherCode]
      );
    } catch(e) {
      // teacher_code column may not exist yet, insert without it
      await db.query(
        `INSERT INTO teacher_profiles (user_id, subjects, qualification, bio) VALUES (?,?,?,?)`,
        [result.insertId, subjects || '', qualification || '']
      );
    }
    res.status(201).json({ message: 'Teacher account created', id: result.insertId });
  } catch (err) {
    console.error('create teacher error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ---- TEACHER ASSIGNMENT ----
router.post('/assign-teacher', ...adminOnly, async (req, res) => {
  try {
    const { student_id, teacher_id, subject, notes } = req.body;
    if (!student_id || !teacher_id) return res.status(400).json({ error: 'Student and teacher required' });
    const [ex] = await db.query('SELECT id FROM teacher_assignments WHERE student_id=? AND teacher_id=? AND subject=?', [student_id, teacher_id, subject || '']);
    if (ex.length) return res.status(400).json({ error: 'Assignment already exists' });
    await db.query('INSERT INTO teacher_assignments (student_id, teacher_id, subject, notes, is_active) VALUES (?,?,?,?,1)', [student_id, teacher_id, subject || '', notes || null]);
    res.status(201).json({ message: 'Teacher assigned' });
  } catch (err) { res.status(500).json({ error: 'Failed' }); }
});

router.put('/assign-teacher/:id', ...adminOnly, async (req, res) => {
  try {
    const { teacher_id, subject, notes } = req.body;
    await db.query('UPDATE teacher_assignments SET teacher_id=?, subject=?, notes=? WHERE id=?', [teacher_id, subject, notes || null, req.params.id]);
    res.json({ message: 'Reassigned' });
  } catch (err) { res.status(500).json({ error: 'Failed' }); }
});

// ---- SCHEDULE ----
router.post('/schedule', ...adminOnly, async (req, res) => {
  try {
    const { student_id, teacher_id, subject, day_of_week, start_time, duration_min, notes } = req.body;
    await db.query(
      `INSERT INTO schedules (student_id, teacher_id, subject, day_of_week, start_time, duration_min, notes, is_active) VALUES (?,?,?,?,?,?,?,1)`,
      [student_id, teacher_id, subject, day_of_week, start_time, duration_min || 60, notes || null]
    );
    res.status(201).json({ message: 'Scheduled' });
  } catch (err) { res.status(500).json({ error: 'Failed' }); }
});

// ---- TESTIMONIALS ----
router.get('/testimonials', ...adminOnly, async (req, res) => {
  try { const [rows] = await db.query('SELECT * FROM testimonials ORDER BY sort_order ASC'); res.json(rows); }
  catch (err) { res.status(500).json({ error: 'Failed' }); }
});
router.post('/testimonials', ...adminOnly, async (req, res) => {
  try {
    const { name, role, content, rating, image_url, is_active, sort_order } = req.body;
    await db.query('INSERT INTO testimonials (name, role, content, rating, image_url, is_active, sort_order) VALUES (?,?,?,?,?,?,?)', [name, role || 'Parent', content, rating || 5, image_url || null, is_active ? 1 : 0, sort_order || 99]);
    res.status(201).json({ message: 'Created' });
  } catch (err) { res.status(500).json({ error: 'Failed' }); }
});
router.put('/testimonials/:id', ...adminOnly, async (req, res) => {
  try {
    const { name, role, content, rating, image_url, is_active, sort_order } = req.body;
    await db.query('UPDATE testimonials SET name=?,role=?,content=?,rating=?,image_url=?,is_active=?,sort_order=? WHERE id=?', [name, role, content, rating, image_url, is_active ? 1 : 0, sort_order, req.params.id]);
    res.json({ message: 'Updated' });
  } catch (err) { res.status(500).json({ error: 'Failed' }); }
});
router.delete('/testimonials/:id', ...adminOnly, async (req, res) => {
  try { await db.query('DELETE FROM testimonials WHERE id=?', [req.params.id]); res.json({ message: 'Deleted' }); }
  catch (err) { res.status(500).json({ error: 'Failed' }); }
});

// ---- ANNOUNCEMENTS ----
router.post('/announcements', ...adminOnly, async (req, res) => {
  try {
    const { title, message, target_role, is_active } = req.body;
    await db.query('INSERT INTO announcements (title, message, target_role, is_active) VALUES (?,?,?,?)', [title, message, target_role || 'all', is_active ? 1 : 0]);
    res.status(201).json({ message: 'Created' });
  } catch (err) { res.status(500).json({ error: 'Failed' }); }
});
router.get('/announcements', ...adminOnly, async (req, res) => {
  try { const [rows] = await db.query('SELECT * FROM announcements ORDER BY created_at DESC'); res.json(rows); }
  catch (err) { res.status(500).json({ error: 'Failed' }); }
});
router.put('/announcements/:id', ...adminOnly, async (req, res) => {
  try {
    const { is_active } = req.body;
    await db.query('UPDATE announcements SET is_active=? WHERE id=?', [is_active, req.params.id]);
    res.json({ message: 'Updated' });
  } catch (err) { res.status(500).json({ error: 'Failed' }); }
});
router.delete('/announcements/:id', ...adminOnly, async (req, res) => {
  try { await db.query('DELETE FROM announcements WHERE id=?', [req.params.id]); res.json({ message: 'Deleted' }); }
  catch (err) { res.status(500).json({ error: 'Failed' }); }
});

module.exports = router;
