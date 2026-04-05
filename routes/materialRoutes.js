const express = require('express');
const router = express.Router();
const db = require('../db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');

// Multer for materials (PDFs, docs, images)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../uploads/materials');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `material_${Date.now()}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage, limits: { fileSize: 20 * 1024 * 1024 } });

const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try { req.user = jwt.verify(token, process.env.JWT_SECRET); next(); }
  catch { res.status(401).json({ error: 'Invalid token' }); }
};
const adminAuth = (req, res, next) => { auth(req, res, () => { if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' }); next(); }); };

// Create table
db.query(`CREATE TABLE IF NOT EXISTS materials (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  file_url VARCHAR(500),
  thumbnail_url VARCHAR(500),
  file_type VARCHAR(50),
  file_size VARCHAR(50),
  category VARCHAR(100),
  subject VARCHAR(100),
  class_no VARCHAR(20),
  is_free TINYINT(1) DEFAULT 1,
  published TINYINT(1) DEFAULT 1,
  downloads INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`).catch(() => {});

// PUBLIC: Get all published materials
router.get('/', async (req, res) => {
  try {
    const { category, subject, class_no, search } = req.query;
    let q = 'SELECT id,title,description,file_url,thumbnail_url,file_type,file_size,category,subject,class_no,is_free,downloads,created_at FROM materials WHERE published=1';
    const params = [];
    if (category && category !== 'All') { q += ' AND category=?'; params.push(category); }
    if (subject && subject !== 'All') { q += ' AND subject=?'; params.push(subject); }
    if (class_no && class_no !== 'All') { q += ' AND class_no=?'; params.push(class_no); }
    if (search) { q += ' AND (title LIKE ? OR description LIKE ?)'; params.push(`%${search}%`, `%${search}%`); }
    q += ' ORDER BY created_at DESC';
    const [rows] = await db.query(q, params);
    res.json(rows);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// PUBLIC: Track download
router.patch('/:id/download', async (req, res) => {
  try {
    await db.query('UPDATE materials SET downloads=downloads+1 WHERE id=?', [req.params.id]);
    res.json({ message: 'OK' });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// ADMIN: Get all
router.get('/admin/all', adminAuth, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM materials ORDER BY created_at DESC');
    res.json(rows);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// ADMIN: Create
router.post('/', adminAuth, upload.fields([{ name: 'file', maxCount: 1 }, { name: 'thumbnail', maxCount: 1 }]), async (req, res) => {
  try {
    const { title, description, category, subject, class_no, is_free, published } = req.body;
    const fileObj = req.files?.file?.[0];
    const thumbObj = req.files?.thumbnail?.[0];
    const file_url = fileObj ? `/uploads/materials/${fileObj.filename}` : null;
    const thumbnail_url = thumbObj ? `/uploads/materials/${thumbObj.filename}` : null;
    const file_type = fileObj ? path.extname(fileObj.originalname).replace('.','').toUpperCase() : null;
    const file_size = fileObj ? `${(fileObj.size/1024/1024).toFixed(1)} MB` : null;
    const [r] = await db.query('INSERT INTO materials (title,description,file_url,thumbnail_url,file_type,file_size,category,subject,class_no,is_free,published) VALUES (?,?,?,?,?,?,?,?,?,?,?)',
      [title, description, file_url, thumbnail_url, file_type, file_size, category, subject, class_no, is_free ? 1 : 0, published ? 1 : 0]);
    res.json({ id: r.insertId, message: 'Material created' });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// ADMIN: Update
router.put('/:id', adminAuth, upload.fields([{ name: 'file', maxCount: 1 }, { name: 'thumbnail', maxCount: 1 }]), async (req, res) => {
  try {
    const { title, description, category, subject, class_no, is_free, published } = req.body;
    let q = 'UPDATE materials SET title=?,description=?,category=?,subject=?,class_no=?,is_free=?,published=?';
    const params = [title, description, category, subject, class_no, is_free ? 1 : 0, published ? 1 : 0];
    if (req.files?.file?.[0]) { q += ',file_url=?,file_type=?,file_size=?'; const f = req.files.file[0]; params.push(`/uploads/materials/${f.filename}`, path.extname(f.originalname).replace('.','').toUpperCase(), `${(f.size/1024/1024).toFixed(1)} MB`); }
    if (req.files?.thumbnail?.[0]) { q += ',thumbnail_url=?'; params.push(`/uploads/materials/${req.files.thumbnail[0].filename}`); }
    q += ' WHERE id=?'; params.push(req.params.id);
    await db.query(q, params);
    res.json({ message: 'Updated' });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// ADMIN: Delete
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    await db.query('DELETE FROM materials WHERE id=?', [req.params.id]);
    res.json({ message: 'Deleted' });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// ADMIN: Toggle publish
router.patch('/:id/toggle', adminAuth, async (req, res) => {
  try {
    await db.query('UPDATE materials SET published=NOT published WHERE id=?', [req.params.id]);
    res.json({ message: 'Toggled' });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
