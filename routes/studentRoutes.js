const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticate, requireRole } = require('../middleware/auth');
const auth = [authenticate, requireRole('student', 'admin')];

// GET /api/student/dashboard - Dashboard overview
router.get('/dashboard', ...auth, async (req, res) => {
  try {
    const uid = req.user.id;
    const [profile] = await db.query(
      'SELECT u.name, u.email, u.phone, sp.student_class, sp.parent_name, sp.parent_phone FROM users u LEFT JOIN student_profiles sp ON u.id = sp.user_id WHERE u.id = ?',
      [uid]
    );
    const [teachers] = await db.query(
      `SELECT ta.id, ta.subject, u.name as teacher_name, tp.qualification FROM teacher_assignments ta
       JOIN users u ON ta.teacher_id = u.id LEFT JOIN teacher_profiles tp ON ta.teacher_id = tp.user_id
       WHERE ta.student_id = ? AND ta.is_active = 1`, [uid]
    );
    const [schedule] = await db.query(
      `SELECT s.*, u.name as teacher_name FROM schedules s JOIN users u ON s.teacher_id = u.id
       WHERE s.student_id = ? AND s.is_active = 1 ORDER BY s.day_of_week, s.start_time`, [uid]
    );
    const [announcements] = await db.query(
      `SELECT * FROM announcements WHERE (target_role = 'student' OR target_role = 'all') AND is_active = 1 ORDER BY created_at DESC LIMIT 5`
    );
    const [testResults] = await db.query(
      `SELECT tr.*, t.title as test_title FROM test_results tr JOIN tests t ON tr.test_id = t.id
       WHERE tr.student_id = ? ORDER BY tr.created_at DESC LIMIT 5`, [uid]
    );
    res.json({ profile: profile[0], teachers, schedule, announcements, testResults });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load dashboard' });
  }
});

// GET /api/student/schedule
router.get('/schedule', ...auth, async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT s.*, u.name as teacher_name FROM schedules s JOIN users u ON s.teacher_id = u.id
       WHERE s.student_id = ? AND s.is_active = 1 ORDER BY s.day_of_week, s.start_time`, [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch schedule' });
  }
});

// GET /api/student/homework
router.get('/homework', ...auth, async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT h.*, u.name as teacher_name FROM homework h JOIN users u ON h.teacher_id = u.id
       WHERE h.student_id = ? ORDER BY h.due_date ASC`, [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch homework' });
  }
});

// POST /api/student/homework/:id/submit
router.post('/homework/:id/submit', ...auth, async (req, res) => {
  try {
    const { submission_text } = req.body;
    await db.query(
      'UPDATE homework SET status = ?, submission_text = ?, submitted_at = NOW() WHERE id = ? AND student_id = ?',
      ['submitted', submission_text || '', req.params.id, req.user.id]
    );
    res.json({ message: 'Homework submitted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit homework' });
  }
});

// GET /api/student/progress
router.get('/progress', ...auth, async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT p.*, u.name as teacher_name FROM progress_reports p JOIN users u ON p.teacher_id = u.id
       WHERE p.student_id = ? ORDER BY p.report_date DESC LIMIT 20`, [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
});

// GET /api/student/test-results
router.get('/test-results', ...auth, async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT tr.*, t.title, t.subject, t.class_no FROM test_results tr JOIN tests t ON tr.test_id = t.id
       WHERE tr.student_id = ? ORDER BY tr.created_at DESC`, [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch test results' });
  }
});

// GET /api/student/attendance
router.get('/attendance', ...auth, async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT a.*, u.name as teacher_name FROM attendance a JOIN users u ON a.teacher_id = u.id
       WHERE a.student_id = ? ORDER BY a.class_date DESC`, [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch attendance' });
  }
});

// POST /api/student/doubt - Submit a doubt
router.post('/doubt', ...auth, async (req, res) => {
  try {
    const { subject, question, teacher_id } = req.body;
    if (!question) return res.status(400).json({ error: 'Question is required' });
    await db.query(
      'INSERT INTO doubts (student_id, teacher_id, subject, question, status) VALUES (?, ?, ?, ?, ?)',
      [req.user.id, teacher_id || null, subject || '', question, 'pending']
    );
    res.status(201).json({ message: 'Doubt submitted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit doubt' });
  }
});

// GET /api/student/doubts
router.get('/doubts', ...auth, async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT d.*, u.name as teacher_name FROM doubts d LEFT JOIN users u ON d.teacher_id = u.id
       WHERE d.student_id = ? ORDER BY d.created_at DESC`, [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch doubts' });
  }
});

// GET /api/student/notes
router.get('/notes', ...auth, async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT n.*, u.name as teacher_name FROM notes n JOIN users u ON n.teacher_id = u.id
       WHERE n.student_id = ? OR n.is_public = 1 ORDER BY n.created_at DESC`, [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
});

// GET /api/student/feedback
router.get('/feedback', ...auth, async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT f.*, u.name as teacher_name FROM feedback f LEFT JOIN users u ON f.teacher_id = u.id
       WHERE f.student_id = ? ORDER BY f.created_at DESC`, [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch feedback' });
  }
});

// PUT /api/student/profile - Update profile
router.put('/profile', ...auth, async (req, res) => {
  try {
    const { name, phone } = req.body;
    await db.query('UPDATE users SET name = ?, phone = ? WHERE id = ?', [name, phone, req.user.id]);
    res.json({ message: 'Profile updated' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

module.exports = router;
