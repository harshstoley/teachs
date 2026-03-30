import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LogoMark = () => (
  <svg width="40" height="40" viewBox="0 0 100 100" fill="none">
    <circle cx="50" cy="18" r="13" fill="#3B72F5"/>
    <path d="M50 31 C50 31 18 42 18 55 C18 55 34 50 50 48 C66 50 82 55 82 55 C82 42 50 31 50 31Z" fill="#1A3A8F"/>
    <rect x="44" y="48" width="12" height="30" rx="6" fill="#1A3A8F"/>
  </svg>
);

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
    <div style={{ minHeight: '100vh', background: 'var(--ink)', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      {/* Background */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 70% at 70% 40%, rgba(59,114,245,0.12) 0%, transparent 60%)' }} />
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(59,114,245,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(59,114,245,0.04) 1px,transparent 1px)', backgroundSize: '60px 60px' }} />

      {/* Nav */}
      <div style={{ padding: '20px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <LogoMark />
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, color: 'white', letterSpacing: '-0.5px' }}>
            Teach<span style={{ color: 'var(--amber2)' }}>s</span>
          </span>
        </Link>
        <Link to="/" style={{ color: 'rgba(255,255,255,0.50)', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: 6 }}>← Back to Home</Link>
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 20px', position: 'relative', zIndex: 1 }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          <div style={{ background: 'rgba(255,255,255,0.98)', borderRadius: 24, padding: '40px 36px', boxShadow: '0 32px 80px rgba(0,0,0,0.35)', border: '1px solid rgba(59,114,245,0.10)' }}>
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <h2 style={{ color: 'var(--text)', marginBottom: 6, fontSize: '1.8rem' }}>Welcome Back</h2>
              <p style={{ color: 'var(--text2)', fontSize: '0.88rem' }}>Sign in to access your dashboard</p>
            </div>

            {/* Role Tabs */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 28, background: 'var(--lavender)', padding: 5, borderRadius: 14 }}>
              {['student', 'teacher', 'admin'].map(r => (
                <button key={r} onClick={() => setRole(r)} style={{
                  flex: 1, padding: '10px 8px', borderRadius: 10, border: 'none', cursor: 'pointer',
                  background: role === r ? 'white' : 'transparent',
                  color: role === r ? 'var(--sapphire)' : 'var(--text2)',
                  fontWeight: role === r ? 700 : 500, fontSize: '0.88rem',
                  transition: 'all 0.2s', fontFamily: 'var(--font-body)',
                  textTransform: 'capitalize',
                  boxShadow: role === r ? 'var(--shadow-sm)' : 'none',
                }}>{r}</button>
              ))}
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            <form onSubmit={submit}>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input type="email" value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="form-input" placeholder="your@email.com" required
                  style={{ background: 'var(--ice)' }} />
              </div>
              <div className="form-group" style={{ marginBottom: 24 }}>
                <label className="form-label">Password</label>
                <input type="password" value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  className="form-input" placeholder="••••••••" required
                  style={{ background: 'var(--ice)' }} />
              </div>
              <button type="submit" disabled={loading} style={{
                width: '100%', padding: '14px',
                background: loading ? 'var(--lavender2)' : 'linear-gradient(135deg, var(--sapphire) 0%, var(--sapphire2) 100%)',
                color: loading ? 'var(--text3)' : 'white',
                border: 'none', borderRadius: 12, fontWeight: 700, fontSize: '1rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s', fontFamily: 'var(--font-body)',
                boxShadow: loading ? 'none' : '0 6px 24px rgba(26,58,143,0.35)',
              }}>
                {loading ? 'Signing in…' : `Sign In as ${role.charAt(0).toUpperCase() + role.slice(1)} →`}
              </button>
            </form>

            <p style={{ textAlign: 'center', marginTop: 22, fontSize: '0.875rem', color: 'var(--text2)' }}>
              Don't have an account?{' '}
              <Link to="/signup" style={{ color: 'var(--sapphire)', fontWeight: 700 }}>Sign Up</Link>
            </p>
          </div>

          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.28)', fontSize: '0.78rem', marginTop: 22 }}>
            India's #1 Dual-Teacher Tutoring Platform
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
    <div style={{ minHeight: '100vh', background: 'var(--ink)', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 50% 60% at 30% 50%, rgba(11,122,94,0.08) 0%, transparent 60%)' }} />
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(59,114,245,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(59,114,245,0.04) 1px,transparent 1px)', backgroundSize: '60px 60px' }} />

      <div style={{ padding: '20px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <LogoMark />
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, color: 'white', letterSpacing: '-0.5px' }}>Teach<span style={{ color: 'var(--amber2)' }}>s</span></span>
        </Link>
        <Link to="/login" style={{ color: 'rgba(255,255,255,0.50)', fontSize: '0.88rem' }}>Already have account? Login →</Link>
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 20px', position: 'relative', zIndex: 1 }}>
        <div style={{ width: '100%', maxWidth: 540 }}>
          <div style={{ background: 'rgba(255,255,255,0.98)', borderRadius: 24, padding: '40px 36px', boxShadow: '0 32px 80px rgba(0,0,0,0.35)', border: '1px solid rgba(59,114,245,0.10)' }}>
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <h2 style={{ color: 'var(--text)', marginBottom: 6, fontSize: '1.8rem' }}>Create Account</h2>
              <p style={{ color: 'var(--text2)', fontSize: '0.88rem' }}>Pending admin approval after signup</p>
            </div>

            {success ? (
              <div style={{ textAlign: 'center', padding: '28px 0' }}>
                <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(11,122,94,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '2rem' }}>🎉</div>
                <h3 style={{ marginBottom: 10, color: 'var(--text)' }}>Registration Successful!</h3>
                <p style={{ color: 'var(--text2)', marginBottom: 24, fontSize: '0.9rem' }}>{success}</p>
                <Link to="/login" style={{ background: 'linear-gradient(135deg, var(--sapphire) 0%, var(--sapphire2) 100%)', color: 'white', padding: '12px 28px', borderRadius: 10, fontWeight: 700, display: 'inline-block', boxShadow: '0 6px 24px rgba(26,58,143,0.30)' }}>Go to Login →</Link>
              </div>
            ) : (
              <>
                {error && <div className="alert alert-error">{error}</div>}
                <form onSubmit={submit}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    {[
                      ['Full Name *', 'name', 'text', 'Enter full name'],
                      ['Email *', 'email', 'email', 'your@email.com'],
                      ['Phone', 'phone', 'tel', '+91 98765 43210'],
                      ['Password *', 'password', 'password', '••••••••'],
                    ].map(([lbl, key, type, ph]) => (
                      <div key={key} className="form-group" style={{ margin: 0 }}>
                        <label className="form-label">{lbl}</label>
                        <input type={type} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
                          className="form-input" placeholder={ph} required={lbl.includes('*')} style={{ background: 'var(--ice)' }} />
                      </div>
                    ))}
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Student's Class</label>
                      <select value={form.student_class} onChange={e => setForm({ ...form, student_class: e.target.value })}
                        className="form-input" style={{ background: 'var(--ice)' }}>
                        <option value="">Select Class</option>
                        {['1','2','3','4','5','6','7','8','9','10','11','12'].map(c => <option key={c} value={c}>Class {c}</option>)}
                      </select>
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Parent Name</label>
                      <input value={form.parent_name} onChange={e => setForm({ ...form, parent_name: e.target.value })}
                        className="form-input" placeholder="Parent's full name" style={{ background: 'var(--ice)' }} />
                    </div>
                  </div>
                  <button type="submit" disabled={loading} style={{
                    width: '100%', padding: '14px',
                    background: 'linear-gradient(135deg, var(--sapphire) 0%, var(--sapphire2) 100%)',
                    color: 'white', border: 'none', borderRadius: 12, fontWeight: 700,
                    fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer',
                    marginTop: 20, fontFamily: 'var(--font-body)',
                    boxShadow: '0 6px 24px rgba(26,58,143,0.30)',
                    opacity: loading ? 0.7 : 1,
                  }}>
                    {loading ? 'Creating Account…' : 'Create Account →'}
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
