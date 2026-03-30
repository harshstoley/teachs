const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { adminOnly } = require('../middleware/auth');

// POST /api/women/apply
router.post('/apply', async (req, res) => {
  try {
    const { name, email, phone, city, qualification, subjects, experience, message } = req.body;
    if (!name || !phone) return res.status(400).json({ error: 'Name and phone required' });
    await db.query(
      `INSERT INTO women_applications (name, email, phone, city, qualification, subjects, experience, message, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [name, email || null, phone, city || '', qualification || '', subjects || '', experience || '', message || '']
    );
    res.status(201).json({ message: 'Application submitted! We will reach out to you soon.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit application' });
  }
});

// GET /api/women/applications - Admin
router.get('/applications', ...adminOnly, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM women_applications ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

// PUT /api/women/applications/:id - Admin: update status
router.put('/applications/:id', ...adminOnly, async (req, res) => {
  try {
    const { status, notes } = req.body;
    await db.query('UPDATE women_applications SET status = ?, notes = ? WHERE id = ?', [status, notes || null, req.params.id]);
    res.json({ message: 'Application updated' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update application' });
  }
});

module.exports = router;
