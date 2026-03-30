const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { adminOnly } = require('../middleware/auth');

// GET /api/workshop/sessions
router.get('/sessions', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM workshop_sessions WHERE is_active = 1 ORDER BY session_date ASC'
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});

// POST /api/workshop/sessions - Admin
router.post('/sessions', ...adminOnly, async (req, res) => {
  try {
    const { title, description, session_date, duration, google_form_url, seats, is_active } = req.body;
    if (!title || !session_date) return res.status(400).json({ error: 'Title and date required' });
    await db.query(
      'INSERT INTO workshop_sessions (title, description, session_date, duration, google_form_url, seats, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [title, description || '', session_date, duration || 60, google_form_url || null, seats || 30, is_active ? 1 : 0]
    );
    res.status(201).json({ message: 'Session created' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create session' });
  }
});

router.put('/sessions/:id', ...adminOnly, async (req, res) => {
  try {
    const { title, description, session_date, duration, google_form_url, seats, is_active } = req.body;
    await db.query(
      'UPDATE workshop_sessions SET title=?, description=?, session_date=?, duration=?, google_form_url=?, seats=?, is_active=? WHERE id=?',
      [title, description, session_date, duration, google_form_url, seats, is_active ? 1 : 0, req.params.id]
    );
    res.json({ message: 'Session updated' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update session' });
  }
});

router.delete('/sessions/:id', ...adminOnly, async (req, res) => {
  try {
    await db.query('DELETE FROM workshop_sessions WHERE id = ?', [req.params.id]);
    res.json({ message: 'Session deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete session' });
  }
});

module.exports = router;
