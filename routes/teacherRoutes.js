const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticate, requireRole } = require('../middleware/auth');

const auth = [authenticate, requireRole('teacher', 'admin')];

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
router.get('/dashboard', ...auth, async (req, res) => {
  try {
    const tid = req.user.id;
    let students;
    try {
      [students] = await db.query(
        `SELECT DISTINCT u.id, u.name, sp.student_class, sp.enrollment_no, ta.subject
         FROM teacher_assignments ta JOIN users u ON ta.student_id = u.id
         LEFT JOIN student_profiles sp ON u.id = sp.user_id
         WHERE ta.teacher_id = ? AND ta.is_active = 1`, [tid]
      );
    } catch (e) {
      [students] = await db.query(
        `SELECT DISTINCT u.id, u.name, sp.student_class, ta.subject
         FROM teacher_assignments ta JOIN users u ON ta.student_id = u.id
         LEFT JOIN student_profiles sp ON u.id = sp.user_id
         WHERE ta.teacher_id = ? AND ta.is_active = 1`, [tid]
      );
    }
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
    console.error(err);
    res.status(500).json({ error: 'Failed to load dashboard' });
  }
});

// ─── HOMEWORK ─────────────────────────────────────────────────────────────────
router.post('/homework', ...auth, async (req, res) => {
  try {
    const { student_id, subject, title, description, due_date } = req.body;
    if (!student_id || !title) return res.status(400).json({ error: 'Student and title required' });
    const [result] = await db.query(
      'INSERT INTO homework (teacher_id, student_id, subject, title, description, due_date, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [req.user.id, student_id, subject || '', title, description || '', due_date || null, 'pending']
    );
    res.status(201).json({ message: 'Homework assigned', id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/homework-all', ...auth, async (req, res) => {
  try {
    let rows;
    try {
      [rows] = await db.query(
        `SELECT h.*, u.name as student_name, sp.enrollment_no FROM homework h
         JOIN users u ON h.student_id = u.id
         LEFT JOIN student_profiles sp ON u.id = sp.user_id
         WHERE h.teacher_id = ? ORDER BY h.id DESC`, [req.user.id]
      );
    } catch (e) {
      [rows] = await db.query(
        `SELECT h.*, u.name as student_name FROM homework h JOIN users u ON h.student_id = u.id
         WHERE h.teacher_id = ? ORDER BY h.id DESC`, [req.user.id]
      );
    }
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/homework-submitted', ...auth, async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT h.*, u.name as student_name FROM homework h JOIN users u ON h.student_id = u.id
       WHERE h.teacher_id = ? AND h.status = 'submitted' ORDER BY h.submitted_at DESC`, [req.user.id]
    );
    res.json(rows);
  } catch (err) { res.status(500).json({ error: 'Failed to fetch homework' }); }
});

router.put('/homework/:id', ...auth, async (req, res) => {
  try {
    const { title, description, due_date, status } = req.body;
    await db.query(
      'UPDATE homework SET title=?, description=?, due_date=?, status=? WHERE id=? AND teacher_id=?',
      [title, description || '', due_date || null, status, req.params.id, req.user.id]
    );
    res.json({ message: 'Homework updated' });
  } catch (err) { res.status(500).json({ error: 'Failed to update homework' }); }
});

router.put('/homework/:id/grade', ...auth, async (req, res) => {
  try {
    const { grade, remarks } = req.body;
    await db.query(
      'UPDATE homework SET grade=?, status=?, remarks=? WHERE id=? AND teacher_id=?',
      [grade, 'graded', remarks || null, req.params.id, req.user.id]
    );
    res.json({ message: 'Homework graded' });
  } catch (err) { res.status(500).json({ error: 'Failed to grade homework' }); }
});

// ─── DOUBTS ───────────────────────────────────────────────────────────────────
router.get('/doubts-for-me', ...auth, async (req, res) => {
  try {
    let rows;
    try {
      [rows] = await db.query(
        `SELECT d.*, u.name as student_name, sp.enrollment_no FROM doubts d
         JOIN users u ON d.student_id = u.id
         LEFT JOIN student_profiles sp ON u.id = sp.user_id
         WHERE d.teacher_id = ? ORDER BY FIELD(d.status,'pending','answered'), d.created_at DESC`,
        [req.user.id]
      );
    } catch (e) {
      [rows] = await db.query(
        `SELECT d.*, u.name as student_name FROM doubts d JOIN users u ON d.student_id = u.id
         WHERE d.teacher_id = ? ORDER BY d.created_at DESC`, [req.user.id]
      );
    }
    res.json(rows);
  } catch (err) { res.status(500).json({ error: 'Failed to fetch doubts' }); }
});

router.put('/doubts/:id', ...auth, async (req, res) => {
  try {
    const { answer, status } = req.body;
    await db.query(
      'UPDATE doubts SET answer=?, status=?, answered_at=NOW() WHERE id=? AND teacher_id=?',
      [answer, status || 'answered', req.params.id, req.user.id]
    );
    res.json({ message: 'Doubt updated' });
  } catch (err) { res.status(500).json({ error: 'Failed to update doubt' }); }
});

// ─── PROGRESS ─────────────────────────────────────────────────────────────────
router.post('/progress', ...auth, async (req, res) => {
  try {
    const { student_id, subject, score, remarks, report_date } = req.body;
    if (!student_id) return res.status(400).json({ error: 'Student required' });
    await db.query(
      'INSERT INTO progress_reports (teacher_id, student_id, subject, score, remarks, report_date) VALUES (?,?,?,?,?,?)',
      [req.user.id, student_id, subject || '', score || null, remarks || '', report_date || new Date().toISOString().split('T')[0]]
    );
    res.status(201).json({ message: 'Progress report added' });
  } catch (err) { res.status(500).json({ error: 'Failed to add progress report' }); }
});

// ─── ATTENDANCE (enhanced with topic tracking) ────────────────────────────────
// POST /api/teacher/attendance
router.post('/attendance', ...auth, async (req, res) => {
  try {
    const { student_id, class_date, status, subject, remarks,
            topic_taught, sub_topic, homework_given, class_rating } = req.body;
    if (!student_id || !class_date) return res.status(400).json({ error: 'Student and date required' });
    if (!topic_taught || !topic_taught.trim()) {
      return res.status(400).json({ error: 'Topic taught is required' });
    }
    await db.query(
      `INSERT INTO attendance
         (teacher_id, student_id, class_date, status, subject, remarks,
          topic_taught, sub_topic, homework_given, class_rating)
       VALUES (?,?,?,?,?,?,?,?,?,?)`,
      [
        req.user.id, student_id, class_date,
        status || 'present', subject || '', remarks || null,
        topic_taught.trim(), sub_topic || null,
        homework_given || null,
        class_rating ? parseInt(class_rating) : null,
      ]
    );
    res.status(201).json({ message: 'Attendance marked' });
  } catch (err) {
    console.error('attendance error:', err.message);
    res.status(500).json({ error: 'Failed to mark attendance' });
  }
});

// GET /api/teacher/attendance-history?student_id=X  (teacher can review past entries)
router.get('/attendance-history', ...auth, async (req, res) => {
  try {
    const { student_id } = req.query;
    let query = `SELECT a.*, u.name as student_name
                 FROM attendance a JOIN users u ON a.student_id = u.id
                 WHERE a.teacher_id = ?`;
    const params = [req.user.id];
    if (student_id) { query += ' AND a.student_id = ?'; params.push(student_id); }
    query += ' ORDER BY a.class_date DESC LIMIT 60';
    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) { res.status(500).json({ error: 'Failed to fetch attendance history' }); }
});

// ─── NOTES ────────────────────────────────────────────────────────────────────
router.post('/notes', ...auth, async (req, res) => {
  try {
    const { student_id, subject, title, content, is_public } = req.body;
    await db.query(
      'INSERT INTO notes (teacher_id, student_id, subject, title, content, is_public) VALUES (?,?,?,?,?,?)',
      [req.user.id, student_id || null, subject || '', title, content || '', is_public ? 1 : 0]
    );
    res.status(201).json({ message: 'Notes saved' });
  } catch (err) { res.status(500).json({ error: 'Failed to save notes' }); }
});

// ─── FEEDBACK ─────────────────────────────────────────────────────────────────
router.post('/feedback', ...auth, async (req, res) => {
  try {
    const { student_id, subject, feedback, rating } = req.body;
    if (!student_id || !feedback) return res.status(400).json({ error: 'Student and feedback required' });
    await db.query(
      'INSERT INTO feedback (teacher_id, student_id, subject, feedback, rating) VALUES (?,?,?,?,?)',
      [req.user.id, student_id, subject || '', feedback, rating || null]
    );
    res.status(201).json({ message: 'Feedback submitted' });
  } catch (err) { res.status(500).json({ error: 'Failed to submit feedback' }); }
});

// ─── SCHEDULES ────────────────────────────────────────────────────────────────
router.get('/my-schedules', ...auth, async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT s.*, u.name as student_name FROM schedules s JOIN users u ON s.student_id = u.id
       WHERE s.teacher_id = ? AND s.is_active = 1 ORDER BY s.day_of_week, s.start_time`, [req.user.id]
    );
    res.json(rows);
  } catch (err) { res.status(500).json({ error: 'Failed to fetch schedules' }); }
});

router.put('/schedules/:id/cancel', ...auth, async (req, res) => {
  try {
    await db.query('UPDATE schedules SET is_active = 0 WHERE id = ? AND teacher_id = ?', [req.params.id, req.user.id]);
    res.json({ message: 'Class cancelled' });
  } catch (err) { res.status(500).json({ error: 'Failed to cancel' }); }
});

router.put('/schedules/:id/reschedule', ...auth, async (req, res) => {
  try {
    const { day_of_week, start_time, duration_min } = req.body;
    await db.query(
      'UPDATE schedules SET day_of_week=?, start_time=?, duration_min=? WHERE id=? AND teacher_id=?',
      [day_of_week, start_time, duration_min || 60, req.params.id, req.user.id]
    );
    res.json({ message: 'Class rescheduled' });
  } catch (err) { res.status(500).json({ error: 'Failed to reschedule' }); }
});

router.post('/schedule-class', ...auth, async (req, res) => {
  try {
    const { student_id, subject, day_of_week, start_time, duration_min } = req.body;
    if (!student_id) return res.status(400).json({ error: 'Student required' });
    await db.query(
      `INSERT INTO schedules (student_id, teacher_id, subject, day_of_week, start_time, duration_min, is_active)
       VALUES (?,?,?,?,?,?,1)`,
      [student_id, req.user.id, subject || '', day_of_week || 1, start_time || '17:00', duration_min || 60]
    );
    res.status(201).json({ message: 'Class scheduled' });
  } catch (err) { res.status(500).json({ error: 'Failed to schedule class' }); }
});

// ─── STUDENTS ─────────────────────────────────────────────────────────────────
router.get('/students', ...auth, async (req, res) => {
  try {
    let rows;
    try {
      [rows] = await db.query(
        `SELECT DISTINCT u.id, u.name, u.email, u.phone, sp.student_class, sp.parent_name, sp.parent_phone, sp.enrollment_no, ta.subject
         FROM teacher_assignments ta JOIN users u ON ta.student_id = u.id
         LEFT JOIN student_profiles sp ON u.id = sp.user_id
         WHERE ta.teacher_id = ? AND ta.is_active = 1`, [req.user.id]
      );
    } catch (e) {
      [rows] = await db.query(
        `SELECT DISTINCT u.id, u.name, u.email, u.phone, sp.student_class, sp.parent_name, sp.parent_phone, ta.subject
         FROM teacher_assignments ta JOIN users u ON ta.student_id = u.id
         LEFT JOIN student_profiles sp ON u.id = sp.user_id
         WHERE ta.teacher_id = ? AND ta.is_active = 1`, [req.user.id]
      );
    }
    res.json(rows);
  } catch (err) { res.status(500).json({ error: 'Failed to fetch students' }); }
});

// ═══════════════════════════════════════════════════════════════════════════════
// SYLLABUS MANAGER
// ═══════════════════════════════════════════════════════════════════════════════

// GET /api/teacher/syllabus?student_id=X  — fetch full tree for one student
router.get('/syllabus', ...auth, async (req, res) => {
  try {
    const { student_id } = req.query;
    if (!student_id) return res.status(400).json({ error: 'student_id required' });

    const [subjects] = await db.query(
      `SELECT * FROM syllabus_subjects WHERE teacher_id = ? AND student_id = ? ORDER BY created_at`,
      [req.user.id, student_id]
    );

    for (const sub of subjects) {
      const [chapters] = await db.query(
        `SELECT * FROM syllabus_chapters WHERE subject_id = ? ORDER BY sort_order, id`,
        [sub.id]
      );
      for (const ch of chapters) {
        const [subtopics] = await db.query(
          `SELECT * FROM syllabus_subtopics WHERE chapter_id = ? ORDER BY sort_order, id`,
          [ch.id]
        );
        ch.subtopics = subtopics;
      }
      sub.chapters = chapters;
    }

    res.json(subjects);
  } catch (err) {
    console.error('syllabus fetch error:', err.message);
    res.status(500).json({ error: 'Failed to fetch syllabus' });
  }
});

// POST /api/teacher/syllabus/subject
router.post('/syllabus/subject', ...auth, async (req, res) => {
  try {
    const { student_id, subject_name } = req.body;
    if (!student_id || !subject_name) return res.status(400).json({ error: 'student_id and subject_name required' });
    const [result] = await db.query(
      `INSERT INTO syllabus_subjects (teacher_id, student_id, subject_name) VALUES (?,?,?)`,
      [req.user.id, student_id, subject_name.trim()]
    );
    res.status(201).json({ message: 'Subject created', id: result.insertId });
  } catch (err) { res.status(500).json({ error: 'Failed to create subject' }); }
});

// POST /api/teacher/syllabus/chapter
router.post('/syllabus/chapter', ...auth, async (req, res) => {
  try {
    const { subject_id, chapter_name } = req.body;
    if (!subject_id || !chapter_name) return res.status(400).json({ error: 'subject_id and chapter_name required' });
    // verify ownership
    const [sub] = await db.query(`SELECT id FROM syllabus_subjects WHERE id = ? AND teacher_id = ?`, [subject_id, req.user.id]);
    if (!sub.length) return res.status(403).json({ error: 'Not your subject' });
    const [result] = await db.query(
      `INSERT INTO syllabus_chapters (subject_id, chapter_name) VALUES (?,?)`,
      [subject_id, chapter_name.trim()]
    );
    res.status(201).json({ message: 'Chapter created', id: result.insertId });
  } catch (err) { res.status(500).json({ error: 'Failed to create chapter' }); }
});

// POST /api/teacher/syllabus/subtopic
router.post('/syllabus/subtopic', ...auth, async (req, res) => {
  try {
    const { chapter_id, subtopic_name } = req.body;
    if (!chapter_id || !subtopic_name) return res.status(400).json({ error: 'chapter_id and subtopic_name required' });
    const [result] = await db.query(
      `INSERT INTO syllabus_subtopics (chapter_id, subtopic_name) VALUES (?,?)`,
      [chapter_id, subtopic_name.trim()]
    );
    res.status(201).json({ message: 'Subtopic created', id: result.insertId });
  } catch (err) { res.status(500).json({ error: 'Failed to create subtopic' }); }
});

// PUT /api/teacher/syllabus/subtopic/:id  — mark status
router.put('/syllabus/subtopic/:id', ...auth, async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['not_started', 'in_progress', 'completed'];
    if (!allowed.includes(status)) return res.status(400).json({ error: 'Invalid status' });
    await db.query(
      `UPDATE syllabus_subtopics SET status = ? WHERE id = ?`,
      [status, req.params.id]
    );
    res.json({ message: 'Status updated' });
  } catch (err) { res.status(500).json({ error: 'Failed to update subtopic' }); }
});

// DELETE endpoints
router.delete('/syllabus/subject/:id', ...auth, async (req, res) => {
  try {
    await db.query(`DELETE FROM syllabus_subjects WHERE id = ? AND teacher_id = ?`, [req.params.id, req.user.id]);
    res.json({ message: 'Subject deleted' });
  } catch (err) { res.status(500).json({ error: 'Failed to delete' }); }
});

router.delete('/syllabus/chapter/:id', ...auth, async (req, res) => {
  try {
    await db.query(`DELETE FROM syllabus_chapters WHERE id = ?`, [req.params.id]);
    res.json({ message: 'Chapter deleted' });
  } catch (err) { res.status(500).json({ error: 'Failed to delete' }); }
});

router.delete('/syllabus/subtopic/:id', ...auth, async (req, res) => {
  try {
    await db.query(`DELETE FROM syllabus_subtopics WHERE id = ?`, [req.params.id]);
    res.json({ message: 'Subtopic deleted' });
  } catch (err) { res.status(500).json({ error: 'Failed to delete' }); }
});

module.exports = router;
