const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { adminOnly } = require('../middleware/auth');

// GET /api/pricing - Get all active plans
router.get('/', async (req, res) => {
  try {
    const [plans] = await db.query(
      'SELECT * FROM pricing_plans WHERE is_active = 1 ORDER BY sort_order ASC'
    );
    res.json(plans);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch pricing' });
  }
});

// GET /api/pricing/all - Admin: get all plans
router.get('/all', ...adminOnly, async (req, res) => {
  try {
    const [plans] = await db.query('SELECT * FROM pricing_plans ORDER BY sort_order ASC');
    res.json(plans);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch pricing' });
  }
});

// POST /api/pricing - Admin: create plan
router.post('/', ...adminOnly, async (req, res) => {
  try {
    const { title, plan_type, class_range, label, regular_price, discounted_price, features, is_recommended, sort_order } = req.body;
    if (!title || !regular_price) return res.status(400).json({ error: 'Title and price required' });

    const [result] = await db.query(
      `INSERT INTO pricing_plans (title, plan_type, class_range, label, regular_price, discounted_price, features, is_recommended, is_active, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?)`,
      [title, plan_type || 'individual', class_range || '', label || '', regular_price, discounted_price || null,
       JSON.stringify(features || []), is_recommended ? 1 : 0, sort_order || 99]
    );
    res.status(201).json({ id: result.insertId, message: 'Plan created' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create plan' });
  }
});

// PUT /api/pricing/:id - Admin: update plan
router.put('/:id', ...adminOnly, async (req, res) => {
  try {
    const { title, plan_type, class_range, label, regular_price, discounted_price, features, is_recommended, is_active, sort_order } = req.body;
    await db.query(
      `UPDATE pricing_plans SET title=?, plan_type=?, class_range=?, label=?, regular_price=?, discounted_price=?,
       features=?, is_recommended=?, is_active=?, sort_order=? WHERE id=?`,
      [title, plan_type, class_range, label, regular_price, discounted_price,
       JSON.stringify(features || []), is_recommended ? 1 : 0, is_active ? 1 : 0, sort_order || 99, req.params.id]
    );
    res.json({ message: 'Plan updated' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update plan' });
  }
});

// DELETE /api/pricing/:id - Admin: delete plan
router.delete('/:id', ...adminOnly, async (req, res) => {
  try {
    await db.query('DELETE FROM pricing_plans WHERE id = ?', [req.params.id]);
    res.json({ message: 'Plan deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete plan' });
  }
});

module.exports = router;
