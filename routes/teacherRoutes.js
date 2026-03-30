const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticate, requireRole } = require('../middleware/auth');
const auth = [authenticate, requireRole('teacher', 'admin')];

// GET /api/teacher/dashboard
router.get('/dashboard', ...auth, async (req, res) => {
  try {
    const tid = req.user.id;
    const [students] = await db.query(
      `SELECT DISTINCT u.id, u.name, sp.student_class, ta.subject FROM teacher_assignments ta
       JOIN users u ON ta.student_id = u.id LEFT JOIN student_profiles sp ON u.id = sp.user_id
       WHERE ta.teacher_id = ? AND ta.is_active = 1`, [tid]
    );
    const [schedule] = await db.query(
      `SELECT s.*, u.name as student_name FROM schedules s JOIN users u ON s.student_id = u.id
       WHERE s.teacher_id = ? AND s.is_active = 1 ORDER BY s.day_of_week, s.start_time`, [tid]
    );
    const [pendingDoubts] = await db.query(
      `SELECT d.*, u.name as student_name FROM doubts d JOIN users u ON d.student_id = u.id
       WHERE d.teacher_id = ? AND d.status = 'pending'`, [tid]
    );
    const [homework] = await db.query(
      `SELECT h.*, u.name as student_name FROM homework h JOIN users u ON h.student_id = u.id
       WHERE h.teacher_id = ? ORDER BY h.due_date DESC LIMIT 10`, [tid]
    );
    res.json({ students, schedule, pendingDoubts, homework });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load dashboard' });
  }
});

// POST /api/teacher/homework - Assign homework
router.post('/homework', ...auth, async (req, res) => {
  try {
    const { student_id, subject, title, description, due_date } = req.body;
    if (!student_id || !title) return res.status(400).json({ error: 'Student and title required' });
    await db.query(
      'INSERT INTO homework (teacher_id, student_id, subject, title, description, due_date, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [req.user.id, student_id, subject || '', title, description || '', due_date || null, 'pending']
    );
    res.status(201).json({ message: 'Homework assigned' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to assign homework' });
  }
});

// POST /api/teacher/progress - Add progress report
router.post('/progress', ...auth, async (req, res) => {
  try {
    const { student_id, subject, score, remarks, report_date } = req.body;
    if (!student_id) return res.status(400).json({ error: 'Student required' });
    await db.query(
      'INSERT INTO progress_reports (teacher_id, student_id, subject, score, remarks, report_date) VALUES (?, ?, ?, ?, ?, ?)',
      [req.user.id, student_id, subject || '', score || null, remarks || '', report_date || new Date().toISOString().split('T')[0]]
    );
    res.status(201).json({ message: 'Progress report added' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add progress report' });
  }
});

// POST /api/teacher/attendance - Mark attendance
router.post('/attendance', ...auth, async (req, res) => {
  try {
    const { student_id, class_date, status, subject, remarks } = req.body;
    if (!student_id || !class_date) return res.status(400).json({ error: 'Student and date required' });
    await db.query(
      'INSERT INTO attendance (teacher_id, student_id, class_date, status, subject, remarks) VALUES (?, ?, ?, ?, ?, ?)',
      [req.user.id, student_id, class_date, status || 'present', subject || '', remarks || null]
    );
    res.status(201).json({ message: 'Attendance marked' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to mark attendance' });
  }
});

// POST /api/teacher/notes - Upload notes
router.post('/notes', ...auth, async (req, res) => {
  try {
    const { student_id, subject, title, content, is_public } = req.body;
    await db.query(
      'INSERT INTO notes (teacher_id, student_id, subject, title, content, is_public) VALUES (?, ?, ?, ?, ?, ?)',
      [req.user.id, student_id || null, subject || '', title, content || '', is_public ? 1 : 0]
    );
    res.status(201).json({ message: 'Notes saved' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save notes' });
  }
});

// POST /api/teacher/feedback - Give feedback to student
router.post('/feedback', ...auth, async (req, res) => {
  try {
    const { student_id, subject, feedback, rating } = req.body;
    if (!student_id || !feedback) return res.status(400).json({ error: 'Student and feedback required' });
    await db.query(
      'INSERT INTO feedback (teacher_id, student_id, subject, feedback, rating) VALUES (?, ?, ?, ?, ?)',
      [req.user.id, student_id, subject || '', feedback, rating || null]
    );
    res.status(201).json({ message: 'Feedback submitted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
});

// PUT /api/teacher/doubts/:id - Answer a doubt
router.put('/doubts/:id', ...auth, async (req, res) => {
  try {
    const { answer } = req.body;
    await db.query(
      'UPDATE doubts SET answer = ?, status = ?, answered_at = NOW() WHERE id = ? AND teacher_id = ?',
      [answer, 'answered', req.params.id, req.user.id]
    );
    res.json({ message: 'Doubt answered' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to answer doubt' });
  }
});

// POST /api/teacher/test-scores - Record test score
router.post('/test-scores', ...auth, async (req, res) => {
  try {
    const { student_id, test_id, score, total, remarks } = req.body;
    const [ex] = await db.query('SELECT id FROM test_results WHERE student_id = ? AND test_id = ?', [student_id, test_id]);
    if (ex.length) {
      await db.query('UPDATE test_results SET score = ?, total = ?, remarks = ? WHERE student_id = ? AND test_id = ?',
        [score, total, remarks || null, student_id, test_id]);
    } else {
      await db.query('INSERT INTO test_results (student_id, test_id, teacher_id, score, total, remarks) VALUES (?, ?, ?, ?, ?, ?)',
        [student_id, test_id, req.user.id, score, total, remarks || null]);
    }
    res.json({ message: 'Score recorded' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to record score' });
  }
});

// GET /api/teacher/students
router.get('/students', ...auth, async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT DISTINCT u.id, u.name, u.email, u.phone, sp.student_class, sp.parent_name, sp.parent_phone, ta.subject
       FROM teacher_assignments ta JOIN users u ON ta.student_id = u.id
       LEFT JOIN student_profiles sp ON u.id = sp.user_id
       WHERE ta.teacher_id = ? AND ta.is_active = 1`, [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

module.exports = router;

// GET /api/teacher/doubts-for-me
router.get('/doubts-for-me', ...auth, async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT d.*, u.name as student_name FROM doubts d JOIN users u ON d.student_id = u.id
       WHERE d.teacher_id = ? ORDER BY d.status ASC, d.created_at DESC`, [req.user.id]
    );
    res.json(rows);
  } catch (err) { res.status(500).json({ error: 'Failed to fetch doubts' }); }
});

// GET /api/teacher/homework-submitted
router.get('/homework-submitted', ...auth, async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT h.*, u.name as student_name FROM homework h JOIN users u ON h.student_id = u.id
       WHERE h.teacher_id = ? AND h.status = 'submitted' ORDER BY h.submitted_at DESC`, [req.user.id]
    );
    res.json(rows);
  } catch (err) { res.status(500).json({ error: 'Failed to fetch homework' }); }
});

// PUT /api/teacher/homework/:id/grade
router.put('/homework/:id/grade', ...auth, async (req, res) => {
  try {
    const { grade, remarks } = req.body;
    await db.query(
      'UPDATE homework SET grade = ?, status = ?, remarks = ? WHERE id = ? AND teacher_id = ?',
      [grade, 'graded', remarks || null, req.params.id, req.user.id]
    );
    res.json({ message: 'Homework graded' });
  } catch (err) { res.status(500).json({ error: 'Failed to grade homework' }); }
});

// POST /api/teacher/schedule-class
router.post('/schedule-class', ...auth, async (req, res) => {
  try {
    const { student_id, subject, day_of_week, start_time, duration_min, class_date } = req.body;
    if (!student_id) return res.status(400).json({ error: 'Student required' });
    await db.query(
      `INSERT INTO schedules (student_id, teacher_id, subject, day_of_week, start_time, duration_min, is_active)
       VALUES (?, ?, ?, ?, ?, ?, 1)`,
      [student_id, req.user.id, subject || '', day_of_week || 1, start_time || '17:00', duration_min || 60]
    );
    res.status(201).json({ message: 'Class scheduled successfully' });
  } catch (err) { res.status(500).json({ error: 'Failed to schedule class' }); }
});
