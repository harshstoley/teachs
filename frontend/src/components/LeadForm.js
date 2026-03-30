import React, { useState } from 'react';
import api from '../utils/api';

export default function LeadForm({ title = 'Book Your Free Demo Class', compact = false }) {
  const [form, setForm] = useState({ name: '', phone: '', email: '', student_class: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async e => {
    e.preventDefault();
    if (!form.name || !form.phone) return setError('Name and phone are required');
    setLoading(true); setError(''); setSuccess('');
    try {
      const res = await api.post('/leads', { ...form, source: 'demo_form' });
      setSuccess(res.data.message);
      setForm({ name: '', phone: '', email: '', student_class: '', subject: '', message: '' });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit. Try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) return (
    <div style={{ textAlign: 'center', padding: '40px 20px' }}>
      <div style={{ fontSize: '3rem', marginBottom: 16 }}>🎉</div>
      <h3 style={{ color: 'var(--navy)', marginBottom: 12 }}>Demo Booked!</h3>
      <p style={{ color: 'var(--ink-light)', maxWidth: 360, margin: '0 auto 24px' }}>{success}</p>
      <button className="btn btn-outline" onClick={() => setSuccess('')}>Book Another</button>
    </div>
  );

  return (
    <form onSubmit={submit}>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: compact ? '1.3rem' : '1.6rem', color: 'var(--ink)', marginBottom: 8 }}>{title}</h3>
      <p style={{ color: 'var(--ink-lighter)', fontSize: '0.9rem', marginBottom: 24 }}>Free. No registration fee. No commitment.</p>

      {error && <div className="alert alert-error">{error}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: compact ? '1fr' : '1fr 1fr', gap: 16 }}>
        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label">Full Name *</label>
          <input name="name" value={form.name} onChange={handle} placeholder="Parent / Student name" className="form-input" required />
        </div>
        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label">Phone Number *</label>
          <input name="phone" value={form.phone} onChange={handle} placeholder="+91 XXXXX XXXXX" className="form-input" required />
        </div>
        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label">Email (Optional)</label>
          <input name="email" type="email" value={form.email} onChange={handle} placeholder="your@email.com" className="form-input" />
        </div>
        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label">Student's Class</label>
          <select name="student_class" value={form.student_class} onChange={handle} className="form-input">
            <option value="">Select Class</option>
            {['1','2','3','4','5','6','7','8','9','10','11 Arts','11 Commerce','12 Arts','12 Commerce'].map(c => (
              <option key={c} value={c}>Class {c}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-group" style={{ marginTop: 16 }}>
        <label className="form-label">Subjects of Interest</label>
        <input name="subject" value={form.subject} onChange={handle} placeholder="e.g. Math + Science, English + SST" className="form-input" />
      </div>

      {!compact && (
        <div className="form-group">
          <label className="form-label">Any specific concerns? (Optional)</label>
          <textarea name="message" value={form.message} onChange={handle} placeholder="Tell us about your child's learning needs..." className="form-input" rows={3} />
        </div>
      )}

      <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width: '100%', marginTop: 8 }}>
        {loading ? 'Submitting...' : '🎯 Book My Free Demo Class'}
      </button>
      <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--ink-lighter)', marginTop: 12 }}>
        ✅ No fees &nbsp;·&nbsp; ✅ No commitment &nbsp;·&nbsp; ✅ 7-day refund on paid plans
      </p>
    </form>
  );
}
