const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const db = require('../config/db');
const { authenticate, adminOnly } = require('../middleware/auth');

const getRazorpay = () => new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// POST /api/payments/create-order
router.post('/create-order', authenticate, async (req, res) => {
  try {
    const { plan_id, amount } = req.body;
    if (!plan_id || !amount) return res.status(400).json({ error: 'Plan and amount required' });
    const razorpay = getRazorpay();
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // in paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      notes: { plan_id: plan_id.toString(), user_id: req.user.id.toString() }
    });
    res.json({ order_id: order.id, amount: order.amount, currency: order.currency, key: process.env.RAZORPAY_KEY_ID });
  } catch (err) {
    console.error('Razorpay order error:', err);
    res.status(500).json({ error: 'Failed to create payment order' });
  }
});

// POST /api/payments/verify
router.post('/verify', authenticate, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan_id, amount } = req.body;
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(body).digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ error: 'Payment verification failed' });
    }

    await db.query(
      `INSERT INTO payments (user_id, plan_id, razorpay_order_id, razorpay_payment_id, amount, status)
       VALUES (?, ?, ?, ?, ?, 'captured')`,
      [req.user.id, plan_id || null, razorpay_order_id, razorpay_payment_id, amount]
    );
    res.json({ message: 'Payment verified and recorded', payment_id: razorpay_payment_id });
  } catch (err) {
    console.error('Verify error:', err);
    res.status(500).json({ error: 'Failed to verify payment' });
  }
});

// GET /api/payments/my-payments
router.get('/my-payments', authenticate, async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT p.*, pp.title as plan_title FROM payments p LEFT JOIN pricing_plans pp ON p.plan_id = pp.id
       WHERE p.user_id = ? ORDER BY p.created_at DESC`, [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
});

// GET /api/payments/all - Admin
router.get('/all', ...adminOnly, async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT p.*, u.name as user_name, u.email, pp.title as plan_title FROM payments p
       JOIN users u ON p.user_id = u.id LEFT JOIN pricing_plans pp ON p.plan_id = pp.id
       ORDER BY p.created_at DESC LIMIT 100`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
});

// POST /api/payments/refund - Admin
router.post('/refund', ...adminOnly, async (req, res) => {
  try {
    const { payment_id, amount, reason } = req.body;
    const razorpay = getRazorpay();
    const refund = await razorpay.payments.refund(payment_id, {
      amount: amount ? Math.round(amount * 100) : undefined,
      notes: { reason: reason || 'Refund requested' }
    });
    await db.query(
      'UPDATE payments SET status = ?, refund_id = ? WHERE razorpay_payment_id = ?',
      ['refunded', refund.id, payment_id]
    );
    res.json({ message: 'Refund processed', refund_id: refund.id });
  } catch (err) {
    console.error('Refund error:', err);
    res.status(500).json({ error: 'Failed to process refund: ' + err.message });
  }
});

module.exports = router;
