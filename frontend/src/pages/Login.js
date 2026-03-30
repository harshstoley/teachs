import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async e => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const user = await login(form.email, form.password);
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'teacher') navigate('/dashboard/teacher');
      else navigate('/dashboard/student');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--ice)', padding: '80px 24px' }}>
      <div style={{ width: '100%', maxWidth: 440 }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
            <svg width="36" height="36" viewBox="0 0 100 100" fill="none"><circle cx="50" cy="22" r="14" fill="#0099B2"/><path d="M50 36 C50 36 20 46 20 58 L50 52 L80 58 C80 46 50 36 50 36Z" fill="#1B3A6B"/><rect x="44" y="52" width="12" height="28" rx="6" fill="#1B3A6B"/></svg>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--navy)' }}>Teach<span style={{ color: 'var(--teal)' }}>s</span></span>
          </Link>
          <h2 style={{ color: 'var(--ink)', marginBottom: 8 }}>Welcome back</h2>
          <p style={{ color: 'var(--ink-lighter)' }}>Sign in to your Teachs account</p>
        </div>

        <div className="card-flat" style={{ padding: 36 }}>
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={submit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="form-input" placeholder="your@email.com" required />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="form-input" placeholder="••••••••" required />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 8 }} disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <p style={{ textAlign: 'center', marginTop: 20, fontSize: '0.9rem', color: 'var(--ink-lighter)' }}>
            Don't have an account? <Link to="/signup" style={{ color: 'var(--teal)', fontWeight: 600 }}>Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', student_class: '', parent_name: '', parent_phone: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const api = require('../utils/api').default;

  const submit = async e => {
    e.preventDefault();
    if (form.password.length < 6) return setError('Password must be at least 6 characters');
    setLoading(true); setError('');
    try {
      const res = await api.post('/auth/signup', form);
      setSuccess(res.data.message);
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed.');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--ice)', padding: '80px 24px' }}>
      <div style={{ width: '100%', maxWidth: 540 }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--navy)' }}>Teach<span style={{ color: 'var(--teal)' }}>s</span></span>
          </Link>
          <h2 style={{ color: 'var(--ink)', marginBottom: 8 }}>Create your account</h2>
          <p style={{ color: 'var(--ink-lighter)' }}>Join Teachs · Pending admin approval after signup</p>
        </div>

        <div className="card-flat" style={{ padding: 36 }}>
          {success ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ fontSize: '3rem', marginBottom: 16 }}>🎉</div>
              <h3 style={{ color: 'var(--navy)', marginBottom: 12 }}>Registration Successful!</h3>
              <p style={{ color: 'var(--ink-light)', marginBottom: 24 }}>{success}</p>
              <Link to="/login" className="btn btn-primary">Go to Login</Link>
            </div>
          ) : (
            <>
              {error && <div className="alert alert-error">{error}</div>}
              <form onSubmit={submit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Full Name *</label>
                    <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="form-input" placeholder="Student's full name" required />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Email *</label>
                    <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="form-input" placeholder="email@example.com" required />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Phone *</label>
                    <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="form-input" placeholder="+91 XXXXX XXXXX" />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Password *</label>
                    <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="form-input" placeholder="Min. 6 characters" required />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Student's Class</label>
                    <select value={form.student_class} onChange={e => setForm({ ...form, student_class: e.target.value })} className="form-input">
                      <option value="">Select Class</option>
                      {['1','2','3','4','5','6','7','8','9','10','11','12'].map(c => <option key={c} value={c}>Class {c}</option>)}
                    </select>
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Parent Name</label>
                    <input value={form.parent_name} onChange={e => setForm({ ...form, parent_name: e.target.value })} className="form-input" placeholder="Parent/Guardian name" />
                  </div>
                </div>
                <div className="form-group" style={{ marginTop: 16 }}>
                  <label className="form-label">Parent Phone</label>
                  <input value={form.parent_phone} onChange={e => setForm({ ...form, parent_phone: e.target.value })} className="form-input" placeholder="Parent contact number" />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 8 }} disabled={loading}>
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>
              </form>
            </>
          )}
          <p style={{ textAlign: 'center', marginTop: 20, fontSize: '0.9rem', color: 'var(--ink-lighter)' }}>
            Already have an account? <Link to="/login" style={{ color: 'var(--teal)', fontWeight: 600 }}>Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
