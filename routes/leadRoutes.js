const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { adminOnly } = require('../middleware/auth');

// POST /api/leads - Submit demo booking / lead form
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, student_class, subject, message, source } = req.body;
    if (!name || !phone) return res.status(400).json({ error: 'Name and phone required' });

    await db.query(
      `INSERT INTO leads (name, email, phone, student_class, subject, message, source, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'new')`,
      [name, email || null, phone, student_class || null, subject || null, message || null, source || 'website']
    );
    res.status(201).json({ message: 'Demo request submitted! Our team will contact you within 24 hours.' });
  } catch (err) {
    console.error('Lead error:', err);
    res.status(500).json({ error: 'Failed to submit request' });
  }
});

// GET /api/leads - Admin: get all leads
router.get('/', ...adminOnly, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    let where = '';
    const params = [];
    if (status) { where = 'WHERE status = ?'; params.push(status); }
    const [leads] = await db.query(
      `SELECT * FROM leads ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), parseInt(offset)]
    );
    const [count] = await db.query(`SELECT COUNT(*) as total FROM leads ${where}`, params);
    res.json({ leads, total: count[0].total });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch leads' });
  }
});

// PUT /api/leads/:id - Admin: update lead status
router.put('/:id', ...adminOnly, async (req, res) => {
  try {
    const { status, notes } = req.body;
    await db.query('UPDATE leads SET status = ?, notes = ? WHERE id = ?', [status, notes || null, req.params.id]);
    res.json({ message: 'Lead updated' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update lead' });
  }
});

// DELETE /api/leads/:id - Admin: delete lead
router.delete('/:id', ...adminOnly, async (req, res) => {
  try {
    await db.query('DELETE FROM leads WHERE id = ?', [req.params.id]);
    res.json({ message: 'Lead deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete lead' });
  }
});

module.exports = router;
