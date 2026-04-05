import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Login() {
  const [role, setRole] = useState('student');
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
      setError(err.response?.data?.error || 'Invalid email or password');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--navy)', display: 'flex', flexDirection: 'column' }}>
      {/* Top nav */}
      <div style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link to="/" style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--white)', textDecoration: 'none' }}>
          Teach<span style={{ color: 'var(--gold)' }}>s</span>
        </Link>
        <Link to="/" style={{ color: 'var(--slate2)', fontSize: '0.9rem' }}>← Back to Home</Link>
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 20px' }}>
        <div style={{ width: '100%', maxWidth: 400 }}>
          <div style={{ background: 'var(--white)', borderRadius: 24, padding: '36px 32px', boxShadow: '0 24px 80px rgba(0,0,0,0.3)' }}>
            <h2 style={{ textAlign: 'center', marginBottom: 6, color: 'var(--text)' }}>Welcome to Teachs</h2>
            <p style={{ textAlign: 'center', color: 'var(--text2)', fontSize: '0.9rem', marginBottom: 28 }}>Sign in to access your dashboard</p>

            {/* Role Tabs */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 28, background: 'var(--cream2)', padding: 4, borderRadius: 12 }}>
              {['student', 'teacher', 'admin'].map(r => (
                <button key={r} onClick={() => setRole(r)} style={{
                  flex: 1, padding: '9px 8px', borderRadius: 9, border: 'none', cursor: 'pointer',
                  background: role === r ? 'var(--navy)' : 'transparent',
                  color: role === r ? 'var(--white)' : 'var(--text2)',
                  fontWeight: role === r ? 700 : 500, fontSize: '0.9rem',
                  transition: 'all 0.2s', fontFamily: 'var(--font-body)',
                  textTransform: 'capitalize',
                }}>{r}</button>
              ))}
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            <form onSubmit={submit}>
              <div className="form-group">
                <label className="form-label">Email / Mobile</label>
                <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                  className="form-input" placeholder="your@email.com" required style={{ background: 'var(--cream)' }} />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                  className="form-input" placeholder="••••••••" required style={{ background: 'var(--cream)' }} />
              </div>
              <button type="submit" disabled={loading} style={{
                width: '100%', padding: '14px', background: '#1B3A6B', color: '#ffffff',
                border: 'none', borderRadius: 12, fontWeight: 700, fontSize: '1rem',
                cursor: 'pointer', marginTop: 8, transition: 'all 0.2s', fontFamily: 'var(--font-body)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}>
                {loading ? 'Signing in...' : 'Sign In →'}
              </button>
            </form>

            <p style={{ textAlign: 'center', marginTop: 20, fontSize: '0.875rem', color: 'var(--text2)' }}>
              Don't have an account? <Link to="/signup" style={{ color: 'var(--navy)', fontWeight: 700 }}>Sign Up</Link>
            </p>
          </div>

          {/* Footer note */}
          <p style={{ textAlign: 'center', color: 'var(--slate)', fontSize: '0.8rem', marginTop: 20 }}>
            India's #1 Dual-Teacher Tutoring Platform
          </p>
        </div>
      </div>

      {/* Bottom */}
      <div style={{ padding: '24px', borderTop: '1px solid rgba(212,168,83,0.1)' }}>
        <div style={{ maxWidth: 400, margin: '0 auto' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 700, color: 'var(--white)', marginBottom: 10 }}>
            Teach<span style={{ color: 'var(--gold)' }}>s</span>
          </div>
          <p style={{ color: 'var(--slate)', fontSize: '0.85rem', lineHeight: 1.7 }}>
            India's first Dual-Teacher tutoring model. Two subject specialists, structured learning, and weekly progress tracking — built for every parent who wants more than just a tutor.
          </p>
          <div style={{ marginTop: 16, display: 'flex', gap: 24 }}>
            {[['Home', '/'], ['Pricing', '/pricing'], ['Practice Tests', '/practice-tests']].map(([l, to]) => (
              <Link key={to} to={to} style={{ color: 'var(--slate2)', fontSize: '0.85rem' }}>{l}</Link>
            ))}
          </div>
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
  const api = require('../utils/api').default;

  const submit = async e => {
    e.preventDefault();
    if (form.password.length < 6) return setError('Password must be at least 6 characters');
    setLoading(true); setError('');
    try { const res = await api.post('/auth/signup', form); setSuccess(res.data.message); }
    catch (err) { setError(err.response?.data?.error || 'Registration failed.'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--navy)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link to="/" style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--white)', textDecoration: 'none' }}>Teach<span style={{ color: 'var(--gold)' }}>s</span></Link>
        <Link to="/login" style={{ color: 'var(--slate2)', fontSize: '0.9rem' }}>Already have account? Login</Link>
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 20px' }}>
        <div style={{ width: '100%', maxWidth: 500 }}>
          <div style={{ background: 'var(--white)', borderRadius: 24, padding: '36px 32px', boxShadow: '0 24px 80px rgba(0,0,0,0.3)' }}>
            <h2 style={{ textAlign: 'center', marginBottom: 6 }}>Create Account</h2>
            <p style={{ textAlign: 'center', color: 'var(--text2)', fontSize: '0.88rem', marginBottom: 24 }}>Pending admin approval after signup</p>
            {success ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ fontSize: '3rem', marginBottom: 12 }}>🎉</div>
                <h3 style={{ marginBottom: 8 }}>Registration Successful!</h3>
                <p style={{ color: 'var(--text2)', marginBottom: 20 }}>{success}</p>
                <Link to="/login" style={{ background: 'var(--navy)', color: 'var(--white)', padding: '12px 28px', borderRadius: 10, fontWeight: 700, display: 'inline-block' }}>Go to Login</Link>
              </div>
            ) : (
              <>
                {error && <div className="alert alert-error">{error}</div>}
                <form onSubmit={submit}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <div className="form-group" style={{ margin: 0 }}><label className="form-label">Full Name *</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="form-input" style={{ background: 'var(--cream)' }} required /></div>
                    <div className="form-group" style={{ margin: 0 }}><label className="form-label">Email *</label><input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="form-input" style={{ background: 'var(--cream)' }} required /></div>
                    <div className="form-group" style={{ margin: 0 }}><label className="form-label">Phone</label><input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="form-input" style={{ background: 'var(--cream)' }} /></div>
                    <div className="form-group" style={{ margin: 0 }}><label className="form-label">Password *</label><input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="form-input" style={{ background: 'var(--cream)' }} required /></div>
                    <div className="form-group" style={{ margin: 0 }}><label className="form-label">Student's Class</label><select value={form.student_class} onChange={e => setForm({ ...form, student_class: e.target.value })} className="form-input" style={{ background: 'var(--cream)' }}><option value="">Select Class</option>{['1','2','3','4','5','6','7','8','9','10','11','12'].map(c => <option key={c} value={c}>Class {c}</option>)}</select></div>
                    <div className="form-group" style={{ margin: 0 }}><label className="form-label">Parent Name</label><input value={form.parent_name} onChange={e => setForm({ ...form, parent_name: e.target.value })} className="form-input" style={{ background: 'var(--cream)' }} /></div>
                  </div>
                  <button type="submit" disabled={loading} style={{ width: '100%', padding: '14px', background: 'var(--navy)', color: 'var(--white)', border: 'none', borderRadius: 12, fontWeight: 700, fontSize: '1rem', cursor: 'pointer', marginTop: 16, fontFamily: 'var(--font-body)' }}>
                    {loading ? 'Creating...' : 'Create Account →'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
