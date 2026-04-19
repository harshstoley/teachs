const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../config/db');
const { adminOnly } = require('../middleware/auth');

// ─── STATS ────────────────────────────────────────────────────────────────────
router.get('/stats', ...adminOnly, async (req, res) => {
  try {
    const [[s]] = await db.query("SELECT COUNT(*) as c FROM users WHERE role='student'");
    const [[t]] = await db.query("SELECT COUNT(*) as c FROM users WHERE role='teacher'");
    const [[l]] = await db.query("SELECT COUNT(*) as c FROM leads WHERE status='new'");
    const [[p]] = await db.query("SELECT COALESCE(SUM(amount),0) as total FROM payments WHERE status='captured'");
    const [[pa]] = await db.query("SELECT COUNT(*) as c FROM users WHERE is_approved=0 AND role='student'");
    res.json({ students: s.c, teachers: t.c, new_leads: l.c, total_revenue: p.total, pending_approvals: pa.c });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ─── USERS ────────────────────────────────────────────────────────────────────
router.get('/users', ...adminOnly, async (req, res) => {
  try {
    const { role, search, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    let where = 'WHERE 1=1'; const params = [];
    if (role) { where += ' AND u.role=?'; params.push(role); }
    if (search) { where += ' AND (u.name LIKE ? OR u.email LIKE ?)'; params.push(`%${search}%`, `%${search}%`); }
    let users;
    try {
      [users] = await db.query(
        `SELECT u.id,u.name,u.email,u.phone,u.role,u.is_active,u.is_approved,u.created_at,
                sp.enrollment_no, tp.teacher_code
         FROM users u
         LEFT JOIN student_profiles sp ON u.id=sp.user_id
         LEFT JOIN teacher_profiles tp ON u.id=tp.user_id
         ${where} ORDER BY u.created_at DESC LIMIT ? OFFSET ?`,
        [...params, parseInt(limit), parseInt(offset)]
      );
    } catch (e) {
      [users] = await db.query(
        `SELECT u.id,u.name,u.email,u.phone,u.role,u.is_active,u.is_approved,u.created_at
         FROM users u ${where} ORDER BY u.created_at DESC LIMIT ? OFFSET ?`,
        [...params, parseInt(limit), parseInt(offset)]
      );
    }
    const [[count]] = await db.query(`SELECT COUNT(*) as total FROM users u ${where}`, params);
    res.json({ users, total: count.total });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/users/:id/approve', ...adminOnly, async (req, res) => {
  try { await db.query('UPDATE users SET is_approved=1,is_active=1 WHERE id=?', [req.params.id]); res.json({ message: 'Approved' }); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/users/:id/toggle-active', ...adminOnly, async (req, res) => {
  try { await db.query('UPDATE users SET is_active=NOT is_active WHERE id=?', [req.params.id]); res.json({ message: 'Updated' }); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

router.delete('/users/:id', ...adminOnly, async (req, res) => {
  try { await db.query('DELETE FROM users WHERE id=?', [req.params.id]); res.json({ message: 'Deleted' }); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

// ─── CREATE TEACHER ───────────────────────────────────────────────────────────
router.post('/teachers', ...adminOnly, async (req, res) => {
  try {
    const { name, email, password, phone, subjects, qualification, bio } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'Name, email, password required' });
    const [ex] = await db.query('SELECT id FROM users WHERE email=?', [email]);
    if (ex.length) return res.status(400).json({ error: 'Email already exists' });
    const hashed = await bcrypt.hash(password, 12);
    const [result] = await db.query(
      `INSERT INTO users (name,email,password,phone,role,is_active,is_approved) VALUES (?,?,?,?,'teacher',1,1)`,
      [name, email, hashed, phone || null]
    );
    const [[cr]] = await db.query("SELECT COUNT(*) as c FROM teacher_profiles");
    const code = `TCH-T-${String(cr.c + 1).padStart(4, '0')}`;
    try {
      await db.query(`INSERT INTO teacher_profiles (user_id,subjects,qualification,bio,teacher_code) VALUES (?,?,?,?,?)`,
        [result.insertId, subjects || '', qualification || '', bio || '', code]);
    } catch (e) {
      await db.query(`INSERT INTO teacher_profiles (user_id,subjects,qualification,bio) VALUES (?,?,?,?)`,
        [result.insertId, subjects || '', qualification || '', bio || '']);
    }
    res.status(201).json({ message: 'Teacher created successfully', id: result.insertId });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ─── ASSIGN TEACHER ───────────────────────────────────────────────────────────
router.post('/assign-teacher', ...adminOnly, async (req, res) => {
  try {
    const { student_id, teacher_id, subject, notes } = req.body;
    if (!student_id || !teacher_id) return res.status(400).json({ error: 'Student and teacher required' });
    const [ex] = await db.query('SELECT id FROM teacher_assignments WHERE student_id=? AND teacher_id=? AND subject=?', [student_id, teacher_id, subject || '']);
    if (ex.length) return res.status(400).json({ error: 'Assignment already exists' });
    await db.query('INSERT INTO teacher_assignments (student_id,teacher_id,subject,notes,is_active) VALUES (?,?,?,?,1)', [student_id, teacher_id, subject || '', notes || null]);
    res.status(201).json({ message: 'Teacher assigned' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ─── SCHEDULE ─────────────────────────────────────────────────────────────────
router.post('/schedule', ...adminOnly, async (req, res) => {
  try {
    const { student_id, teacher_id, subject, day_of_week, start_time, duration_min } = req.body;
    await db.query(`INSERT INTO schedules (student_id,teacher_id,subject,day_of_week,start_time,duration_min,is_active) VALUES (?,?,?,?,?,?,1)`,
      [student_id, teacher_id, subject || '', day_of_week || 1, start_time || '17:00', duration_min || 60]);
    res.status(201).json({ message: 'Scheduled' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ─── TESTIMONIALS ─────────────────────────────────────────────────────────────
router.get('/testimonials', ...adminOnly, async (req, res) => {
  try { const [rows] = await db.query('SELECT * FROM testimonials ORDER BY sort_order ASC'); res.json(rows); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/testimonials', ...adminOnly, async (req, res) => {
  try {
    const { name, role, content, rating, image_url, is_active, sort_order } = req.body;
    await db.query('INSERT INTO testimonials (name,role,content,rating,image_url,is_active,sort_order) VALUES (?,?,?,?,?,?,?)',
      [name, role || 'Parent', content, rating || 5, image_url || null, is_active ? 1 : 0, sort_order || 99]);
    res.status(201).json({ message: 'Created' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/testimonials/:id', ...adminOnly, async (req, res) => {
  try {
    const { name, role, content, rating, image_url, is_active, sort_order } = req.body;
    await db.query('UPDATE testimonials SET name=?,role=?,content=?,rating=?,image_url=?,is_active=?,sort_order=? WHERE id=?',
      [name, role, content, rating, image_url, is_active ? 1 : 0, sort_order, req.params.id]);
    res.json({ message: 'Updated' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.delete('/testimonials/:id', ...adminOnly, async (req, res) => {
  try { await db.query('DELETE FROM testimonials WHERE id=?', [req.params.id]); res.json({ message: 'Deleted' }); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

// ─── ANNOUNCEMENTS ────────────────────────────────────────────────────────────
router.post('/announcements', ...adminOnly, async (req, res) => {
  try {
    const { title, message, target_role, is_active } = req.body;
    await db.query('INSERT INTO announcements (title,message,target_role,is_active) VALUES (?,?,?,?)',
      [title || '', message, target_role || 'all', is_active ? 1 : 0]);
    res.status(201).json({ message: 'Created' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/announcements', ...adminOnly, async (req, res) => {
  try { const [rows] = await db.query('SELECT * FROM announcements ORDER BY created_at DESC'); res.json(rows); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/announcements/:id', ...adminOnly, async (req, res) => {
  try { await db.query('UPDATE announcements SET is_active=? WHERE id=?', [req.body.is_active, req.params.id]); res.json({ message: 'Updated' }); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

router.delete('/announcements/:id', ...adminOnly, async (req, res) => {
  try { await db.query('DELETE FROM announcements WHERE id=?', [req.params.id]); res.json({ message: 'Deleted' }); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

// ─── ALL SCHEDULES ────────────────────────────────────────────────────────────
router.get('/all-schedules', ...adminOnly, async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT s.id, s.subject, s.day_of_week, s.start_time, s.duration_min, s.is_active, s.meet_link,
             t.id AS teacher_id, t.name AS teacher_name, tp.teacher_code,
             st.id AS student_id, st.name AS student_name, sp.enrollment_no
      FROM schedules s
      JOIN users t ON s.teacher_id = t.id
      JOIN users st ON s.student_id = st.id
      LEFT JOIN student_profiles sp ON st.id = sp.user_id
      LEFT JOIN teacher_profiles tp ON t.id = tp.user_id
      ORDER BY s.day_of_week ASC, s.start_time ASC
    `);
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/schedules/:id/meet-link', ...adminOnly, async (req, res) => {
  try {
    const link = req.body.meet_link ? req.body.meet_link.trim() : null;
    const [result] = await db.query('UPDATE schedules SET meet_link = ? WHERE id = ?', [link, req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Schedule not found' });
    res.json({ message: link ? 'Meet link saved' : 'Meet link cleared' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ─── ALL ASSIGNMENTS ──────────────────────────────────────────────────────────
router.get('/all-assignments', ...adminOnly, async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT ta.id, ta.subject, ta.is_active,
             st.id AS student_id, st.name AS student_name, sp.enrollment_no,
             t.id AS teacher_id, t.name AS teacher_name, tp.teacher_code
      FROM teacher_assignments ta
      JOIN users st ON ta.student_id = st.id
      JOIN users t ON ta.teacher_id = t.id
      LEFT JOIN student_profiles sp ON st.id = sp.user_id
      LEFT JOIN teacher_profiles tp ON t.id = tp.user_id
      ORDER BY st.name ASC, ta.subject ASC
    `);
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/assignments/:id/reassign', ...adminOnly, async (req, res) => {
  try {
    const { teacher_id } = req.body;
    if (!teacher_id) return res.status(400).json({ error: 'teacher_id required' });
    const [result] = await db.query('UPDATE teacher_assignments SET teacher_id = ? WHERE id = ?', [teacher_id, req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Assignment not found' });
    res.json({ message: 'Teacher reassigned' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ═══════════════════════════════════════════════════════════════════════════════
// ACCOUNTABILITY DASHBOARD
// GET /api/admin/accountability?days=7
// Returns per-teacher stats: attendance marked, topics filled, syllabus coverage
// ═══════════════════════════════════════════════════════════════════════════════
router.get('/accountability', ...adminOnly, async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 7;
    const since = new Date();
    since.setDate(since.getDate() - days);
    const sinceStr = since.toISOString().split('T')[0];

    // All active teachers
    const [teachers] = await db.query(
      `SELECT u.id, u.name FROM users u WHERE u.role = 'teacher' AND u.is_active = 1 ORDER BY u.name`
    );

    const result = [];

    for (const t of teachers) {
      // Attendance records this period
      const [[attStats]] = await db.query(
        `SELECT
           COUNT(*) AS total_attendance,
           SUM(CASE WHEN topic_taught IS NOT NULL AND topic_taught != '' THEN 1 ELSE 0 END) AS with_topic
         FROM attendance
         WHERE teacher_id = ? AND class_date >= ?`,
        [t.id, sinceStr]
      );

      // Students this teacher has
      const [[studentCount]] = await db.query(
        `SELECT COUNT(DISTINCT student_id) AS cnt FROM teacher_assignments WHERE teacher_id = ? AND is_active = 1`,
        [t.id]
      );

      // Syllabus coverage: completed/total subtopics
      const [[syllabusStats]] = await db.query(
        `SELECT
           COUNT(*) AS total_subtopics,
           SUM(CASE WHEN st.status = 'completed' THEN 1 ELSE 0 END) AS completed_subtopics
         FROM syllabus_subjects ss
         JOIN syllabus_chapters sc ON sc.subject_id = ss.id
         JOIN syllabus_subtopics st ON st.chapter_id = sc.id
         WHERE ss.teacher_id = ?`,
        [t.id]
      );

      // Low-attendance students (< 70% in last 30 days)
      const [lowAtt] = await db.query(
        `SELECT u.name as student_name,
                COUNT(*) as classes_total,
                SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) as present
         FROM attendance a
         JOIN users u ON a.student_id = u.id
         WHERE a.teacher_id = ? AND a.class_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
         GROUP BY a.student_id
         HAVING (present / classes_total) < 0.7`,
        [t.id]
      );

      result.push({
        teacher_id: t.id,
        teacher_name: t.name,
        student_count: studentCount.cnt || 0,
        attendance_total: attStats.total_attendance || 0,
        attendance_with_topic: attStats.with_topic || 0,
        topic_fill_rate: attStats.total_attendance > 0
          ? Math.round((attStats.with_topic / attStats.total_attendance) * 100)
          : 0,
        syllabus_total: syllabusStats.total_subtopics || 0,
        syllabus_completed: syllabusStats.completed_subtopics || 0,
        syllabus_pct: syllabusStats.total_subtopics > 0
          ? Math.round((syllabusStats.completed_subtopics / syllabusStats.total_subtopics) * 100)
          : 0,
        low_attendance_students: lowAtt,
      });
    }

    res.json({ days, since: sinceStr, teachers: result });
  } catch (e) {
    console.error('accountability error:', e.message);
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
