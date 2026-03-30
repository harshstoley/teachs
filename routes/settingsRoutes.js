const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { adminOnly } = require('../middleware/auth');

// GET /api/settings - Public settings (contact info, social links)
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT setting_key, setting_value FROM site_settings WHERE is_public = 1');
    const settings = {};
    rows.forEach(r => { settings[r.setting_key] = r.setting_value; });
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// GET /api/settings/all - Admin: all settings
router.get('/all', ...adminOnly, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM site_settings ORDER BY setting_key');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// PUT /api/settings - Admin: update settings
router.put('/', ...adminOnly, async (req, res) => {
  try {
    const updates = req.body; // { key: value, ... }
    for (const [key, value] of Object.entries(updates)) {
      await db.query(
        'INSERT INTO site_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?',
        [key, value, value]
      );
    }
    res.json({ message: 'Settings updated' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

// GET /api/settings/testimonials - Public testimonials
router.get('/testimonials', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM testimonials WHERE is_active = 1 ORDER BY sort_order ASC LIMIT 12');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch testimonials' });
  }
});

module.exports = router;
