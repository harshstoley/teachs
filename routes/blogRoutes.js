const express = require('express');
const router = express.Router();
const db = require('../config/db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');

// Multer setup for blog images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../uploads/blog');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `blog_${Date.now()}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 }, fileFilter: (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) cb(null, true);
  else cb(new Error('Images only'));
}});

// Auth middleware
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try { req.user = jwt.verify(token, process.env.JWT_SECRET); next(); }
  catch { res.status(401).json({ error: 'Invalid token' }); }
};
const adminAuth = (req, res, next) => { auth(req, res, () => { if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' }); next(); }); };

// Create table
db.query(`CREATE TABLE IF NOT EXISTS blog_posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  excerpt TEXT,
  content LONGTEXT,
  cover_image VARCHAR(500),
  category VARCHAR(100),
  tags VARCHAR(500),
  author VARCHAR(100) DEFAULT 'Teachs Team',
  published TINYINT(1) DEFAULT 0,
  views INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)`).catch(() => {});

// PUBLIC: Get all published posts
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    let q = 'SELECT id,title,slug,excerpt,cover_image,category,tags,author,views,created_at FROM blog_posts WHERE published=1';
    const params = [];
    if (category && category !== 'All') { q += ' AND category=?'; params.push(category); }
    if (search) { q += ' AND (title LIKE ? OR excerpt LIKE ?)'; params.push(`%${search}%`, `%${search}%`); }
    q += ' ORDER BY created_at DESC';
    const [rows] = await db.query(q, params);
    res.json(rows);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// PUBLIC: Get single post by slug
router.get('/:slug', async (req, res) => {
  try {
    const [[post]] = await db.query('SELECT * FROM blog_posts WHERE slug=? AND published=1', [req.params.slug]);
    if (!post) return res.status(404).json({ error: 'Not found' });
    await db.query('UPDATE blog_posts SET views=views+1 WHERE id=?', [post.id]);
    res.json(post);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// ADMIN: Get all posts
router.get('/admin/all', adminAuth, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM blog_posts ORDER BY created_at DESC');
    res.json(rows);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// ADMIN: Create post
router.post('/', adminAuth, upload.single('cover_image'), async (req, res) => {
  try {
    const { title, excerpt, content, category, tags, author, published } = req.body;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now();
    const cover_image = req.file ? `/uploads/blog/${req.file.filename}` : null;
    const [r] = await db.query('INSERT INTO blog_posts (title,slug,excerpt,content,cover_image,category,tags,author,published) VALUES (?,?,?,?,?,?,?,?,?)',
      [title, slug, excerpt, content, cover_image, category, tags, author || 'Teachs Team', published ? 1 : 0]);
    res.json({ id: r.insertId, slug, message: 'Post created' });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// ADMIN: Update post
router.put('/:id', adminAuth, upload.single('cover_image'), async (req, res) => {
  try {
    const { title, excerpt, content, category, tags, author, published } = req.body;
    let q = 'UPDATE blog_posts SET title=?,excerpt=?,content=?,category=?,tags=?,author=?,published=?';
    const params = [title, excerpt, content, category, tags, author, published ? 1 : 0];
    if (req.file) { q += ',cover_image=?'; params.push(`/uploads/blog/${req.file.filename}`); }
    q += ' WHERE id=?'; params.push(req.params.id);
    await db.query(q, params);
    res.json({ message: 'Updated' });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// ADMIN: Delete post
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    await db.query('DELETE FROM blog_posts WHERE id=?', [req.params.id]);
    res.json({ message: 'Deleted' });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// ADMIN: Toggle publish
router.patch('/:id/toggle', adminAuth, async (req, res) => {
  try {
    await db.query('UPDATE blog_posts SET published=NOT published WHERE id=?', [req.params.id]);
    res.json({ message: 'Toggled' });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
