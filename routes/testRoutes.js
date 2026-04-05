const express = require('express');
const router = express.Router();
const db = require('../config/db');
const jwt = require('jsonwebtoken');
const { authenticate, adminOnly } = require('../middleware/auth');

// ── Helper: try to get user from token, return null if no token/invalid ──
function getOptionalUser(req) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return null;
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (e) {
    return null;
  }
}

// GET /api/tests - List tests (public)
router.get('/', async (req, res) => {
  try {
    const { class_no, subject, chapter, is_published } = req.query;
    let where = 'WHERE 1=1';
    const params = [];
    if (class_no) { where += ' AND class_no = ?'; params.push(class_no); }
    if (subject) { where += ' AND subject = ?'; params.push(subject); }
    if (chapter) { where += ' AND chapter LIKE ?'; params.push(`%${chapter}%`); }
    if (is_published !== undefined) { where += ' AND is_published = ?'; params.push(is_published === 'true' ? 1 : 0); }
    else { where += ' AND is_published = 1'; }

    const [tests] = await db.query(
      `SELECT id, title, class_no, subject, chapter, duration_min, total_marks, question_count, created_at
       FROM tests ${where} ORDER BY class_no ASC, subject ASC, created_at DESC`,
      params
    );
    res.json(tests);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tests' });
  }
});

// GET /api/tests/:id - Get test with questions
// PUBLIC — guests who filled lead form can access
router.get('/:id', async (req, res) => {
  try {
    const user = getOptionalUser(req);

    const [tests] = await db.query('SELECT * FROM tests WHERE id = ?', [req.params.id]);
    if (!tests.length) return res.status(404).json({ error: 'Test not found' });
    const test = tests[0];

    const [questions] = await db.query(
      `SELECT id, question_text, option_a, option_b, option_c, option_d, marks, difficulty
       FROM questions WHERE test_id = ? ORDER BY sort_order ASC`,
      [req.params.id]
    );

    // Only admins/teachers see answers in the question list
    if (!user || !['admin', 'teacher'].includes(user.role)) {
      questions.forEach(q => { delete q.correct_answer; delete q.solution; });
    }

    res.json({ ...test, questions });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch test' });
  }
});

// POST /api/tests/:id/submit - Submit test answers
// PUBLIC — guests get score back, logged-in users also get result saved to DB
router.post('/:id/submit', async (req, res) => {
  try {
    const user = getOptionalUser(req);
    const { answers } = req.body;
    if (!answers) return res.status(400).json({ error: 'Answers required' });

    const [questions] = await db.query(
      'SELECT id, correct_answer, marks FROM questions WHERE test_id = ?',
      [req.params.id]
    );

    let score = 0;
    let total = 0;
    const results = questions.map(q => {
      total += q.marks || 1;
      const isCorrect = answers[q.id] === q.correct_answer;
      if (isCorrect) score += q.marks || 1;
      return { question_id: q.id, selected: answers[q.id], correct: q.correct_answer, is_correct: isCorrect };
    });

    const [test] = await db.query('SELECT total_marks FROM tests WHERE id = ?', [req.params.id]);
    const totalMarks = test[0]?.total_marks || total;

    // Only save to DB if logged-in student
    if (user && user.id) {
      await db.query(
        'INSERT INTO test_results (student_id, test_id, score, total, answers_json) VALUES (?, ?, ?, ?, ?)',
        [user.id, req.params.id, score, totalMarks, JSON.stringify(results)]
      );
    }

    res.json({
      score,
      total: totalMarks,
      percentage: Math.round((score / total) * 100),
      results,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit test' });
  }
});

// GET /api/tests/:id/solutions - Get solutions after test
// PUBLIC — shown after submission, no auth needed
router.get('/:id/solutions', async (req, res) => {
  try {
    const [questions] = await db.query(
      `SELECT id, question_text, option_a, option_b, option_c, option_d,
              correct_answer, solution, marks
       FROM questions WHERE test_id = ? ORDER BY sort_order ASC`,
      [req.params.id]
    );
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch solutions' });
  }
});

// ── ADMIN TEST MANAGEMENT ──

// POST /api/tests - Create test
router.post('/', ...adminOnly, async (req, res) => {
  try {
    const { title, class_no, subject, chapter, duration_min, total_marks, description, is_published } = req.body;
    if (!title || !class_no || !subject) return res.status(400).json({ error: 'Title, class, subject required' });
    const [result] = await db.query(
      `INSERT INTO tests (title, class_no, subject, chapter, duration_min, total_marks, description, is_published, question_count)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)`,
      [title, class_no, subject, chapter || '', duration_min || 30, total_marks || 20, description || '', is_published ? 1 : 0]
    );
    res.status(201).json({ id: result.insertId, message: 'Test created' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create test' });
  }
});

// PUT /api/tests/:id - Update test
router.put('/:id', ...adminOnly, async (req, res) => {
  try {
    const { title, class_no, subject, chapter, duration_min, total_marks, description, is_published } = req.body;
    await db.query(
      'UPDATE tests SET title=?, class_no=?, subject=?, chapter=?, duration_min=?, total_marks=?, description=?, is_published=? WHERE id=?',
      [title, class_no, subject, chapter, duration_min, total_marks, description, is_published ? 1 : 0, req.params.id]
    );
    res.json({ message: 'Test updated' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update test' });
  }
});

// DELETE /api/tests/:id
router.delete('/:id', ...adminOnly, async (req, res) => {
  try {
    await db.query('DELETE FROM questions WHERE test_id = ?', [req.params.id]);
    await db.query('DELETE FROM tests WHERE id = ?', [req.params.id]);
    res.json({ message: 'Test deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete test' });
  }
});

// POST /api/tests/:id/questions - Add question
router.post('/:id/questions', ...adminOnly, async (req, res) => {
  try {
    const { question_text, option_a, option_b, option_c, option_d, correct_answer, solution, marks, difficulty, sort_order } = req.body;
    if (!question_text || !correct_answer) return res.status(400).json({ error: 'Question and answer required' });
    await db.query(
      `INSERT INTO questions (test_id, question_text, option_a, option_b, option_c, option_d, correct_answer, solution, marks, difficulty, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [req.params.id, question_text, option_a || '', option_b || '', option_c || '', option_d || '',
       correct_answer, solution || '', marks || 1, difficulty || 'medium', sort_order || 99]
    );
    await db.query(
      'UPDATE tests SET question_count = (SELECT COUNT(*) FROM questions WHERE test_id = ?) WHERE id = ?',
      [req.params.id, req.params.id]
    );
    res.status(201).json({ message: 'Question added' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add question' });
  }
});

// DELETE /api/tests/questions/:qid
router.delete('/questions/:qid', ...adminOnly, async (req, res) => {
  try {
    const [q] = await db.query('SELECT test_id FROM questions WHERE id = ?', [req.params.qid]);
    await db.query('DELETE FROM questions WHERE id = ?', [req.params.qid]);
    if (q.length) {
      await db.query(
        'UPDATE tests SET question_count = (SELECT COUNT(*) FROM questions WHERE test_id = ?) WHERE id = ?',
        [q[0].test_id, q[0].test_id]
      );
    }
    res.json({ message: 'Question deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete question' });
  }
});

module.exports = router;
