const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { adminOnly } = require('../middleware/auth');

// GET /api/settings - Public
router.get('/', async (req, res) => {
  try {
    res.set('Cache-Control','no-store,no-cache,must-revalidate');
    const [rows] = await db.query('SELECT setting_key, setting_value FROM site_settings WHERE is_public = 1');
    const settings = {};
    rows.forEach(r => { settings[r.setting_key] = r.setting_value; });
    res.json(settings);
  } catch (err) { res.status(500).json({ error: 'Failed' }); }
});

// GET /api/settings/all - Admin
router.get('/all', ...adminOnly, async (req, res) => {
  try {
    res.set('Cache-Control','no-store,no-cache,must-revalidate');
    const [rows] = await db.query('SELECT * FROM site_settings ORDER BY setting_key');
    res.json(rows);
  } catch (err) { res.status(500).json({ error: 'Failed' }); }
});

// PUT /api/settings - Admin
router.put('/', ...adminOnly, async (req, res) => {
  try {
    const updates = req.body;
    if (!updates || typeof updates !== 'object') return res.status(400).json({ error: 'Invalid data' });
    for (const [key, value] of Object.entries(updates)) {
      await db.query(
        `INSERT INTO site_settings (setting_key, setting_value, is_public) VALUES (?, ?, 1)
         ON DUPLICATE KEY UPDATE setting_value = ?, updated_at = NOW()`,
        [key, value || '', value || '']
      );
    }
    res.json({ message: 'Settings saved successfully' });
  } catch (err) {
    console.error('Settings save error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/settings/testimonials
router.get('/testimonials', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM testimonials WHERE is_active = 1 ORDER BY sort_order ASC LIMIT 12');
    res.json(rows);
  } catch (err) { res.status(500).json({ error: 'Failed' }); }
});

module.exports = router;
