import React, { useState } from 'react';
import api from '../utils/api';

export function hasGuestAccess() {
  return !!localStorage.getItem('teachs_guest');
}

export default function GuestGate({ children, pageLabel = 'this content' }) {
  const [unlocked, setUnlocked] = useState(hasGuestAccess);
  const [form, setForm] = useState({ name: '', phone: '', student_class: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async () => {
    if (!form.name.trim()) return setError('Please enter your name.');
    if (!form.phone.trim() || form.phone.length < 10) return setError('Please enter a valid 10-digit phone number.');
    if (!form.student_class) return setError('Please select your class.');
    setLoading(true);
    setError('');
    try {
      await api.post('/leads', {
        name: form.name,
        phone: form.phone,
        student_class: form.student_class,
        source: 'guest_access',
        message: `Requested free access to: ${pageLabel}`,
      });
    } catch (_) {}
    localStorage.setItem('teachs_guest', JSON.stringify(form));
    setLoading(false);
    setUnlocked(true);
  };

  if (unlocked) return children;

  const inputStyle = {
    width: '100%',
    padding: '13px 16px',
    borderRadius: 10,
    background: 'rgba(255,255,255,0.07)',
    border: '1.5px solid rgba(0,153,178,0.25)',
    color: '#fff',
    fontSize: '0.92rem',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: "'DM Sans', system-ui, sans-serif",
    transition: 'border-color 0.2s',
  };

  const labelStyle = {
    display: 'block',
    color: '#B8C5D9',
    fontSize: '0.82rem',
    fontWeight: 600,
    marginBottom: 7,
    fontFamily: "'DM Sans', system-ui, sans-serif",
    letterSpacing: '0.02em',
  };

  return (
    <div style={{
      background: 'linear-gradient(145deg, #1A1F2E 0%, #1B3A6B 60%, #0d2a52 100%)',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 16px',
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* Decorative blobs */}
      <div style={{ position: 'absolute', top: '-10%', right: '-8%', width: 380, height: 380, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,153,178,0.13) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-5%', left: '-6%', width: 280, height: 280, borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,166,35,0.09) 0%, transparent 70%)', pointerEvents: 'none' }} />
      {/* Grid */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(0,153,178,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,153,178,0.04) 1px,transparent 1px)', backgroundSize: '56px 56px', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: 460, position: 'relative', zIndex: 1 }}>

        {/* Card */}
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(0,153,178,0.25)',
          borderRadius: 24,
          padding: '44px 38px',
          boxShadow: '0 32px 80px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06)',
          backdropFilter: 'blur(12px)',
        }}>

          {/* Teachs badge */}
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(245,166,35,0.12)',
              border: '1px solid rgba(245,166,35,0.28)',
              borderRadius: 100, padding: '8px 22px',
            }}>
              <span style={{ fontSize: '1rem' }}>🎓</span>
              <span style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontWeight: 700, color: '#F5A623',
                fontSize: '1.15rem', letterSpacing: '0.02em',
              }}>Teachs</span>
            </div>
          </div>

          {/* Heading */}
          <h2 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            color: '#ffffff',
            fontSize: 'clamp(1.4rem, 4vw, 1.85rem)',
            fontWeight: 700,
            textAlign: 'center',
            marginBottom: 10,
            lineHeight: 1.25,
          }}>
            Free Access to{' '}
            <em style={{ color: '#F5A623', fontStyle: 'italic' }}>{pageLabel}</em>
          </h2>
          <p style={{
            fontFamily: "'DM Sans', system-ui, sans-serif",
            color: '#B8C5D9',
            textAlign: 'center',
            fontSize: '0.9rem',
            marginBottom: 30,
            lineHeight: 1.65,
          }}>
            No account needed — fill your details and get instant free access.
          </p>

          {/* Error */}
          {error && (
            <div style={{
              background: 'rgba(192,57,43,0.12)',
              border: '1px solid rgba(192,57,43,0.28)',
              color: '#e74c3c', padding: '10px 14px',
              borderRadius: 10, marginBottom: 18,
              fontSize: '0.84rem',
              fontFamily: "'DM Sans', system-ui, sans-serif",
            }}>
              ⚠️ {error}
            </div>
          )}

          {/* Fields */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            <div>
              <label style={labelStyle}>Full Name *</label>
              <input
                name="name" value={form.name} onChange={handle}
                placeholder="Parent / Student name"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#0099B2'}
                onBlur={e => e.target.style.borderColor = 'rgba(0,153,178,0.25)'}
              />
            </div>

            <div>
              <label style={labelStyle}>Phone Number *</label>
              <input
                name="phone" value={form.phone} onChange={handle}
                placeholder="+91 XXXXX XXXXX" type="tel"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#0099B2'}
                onBlur={e => e.target.style.borderColor = 'rgba(0,153,178,0.25)'}
              />
            </div>

            <div>
              <label style={labelStyle}>Student's Class *</label>
              <select
                name="student_class" value={form.student_class} onChange={handle}
                style={{
                  ...inputStyle,
                  background: '#0d2244',
                  cursor: 'pointer',
                  color: form.student_class ? '#fff' : '#8A9BBD',
                }}
                onFocus={e => e.target.style.borderColor = '#0099B2'}
                onBlur={e => e.target.style.borderColor = 'rgba(0,153,178,0.25)'}
              >
                <option value="" style={{ background: '#0d2244' }}>Select Class</option>
                {['1','2','3','4','5','6','7','8','9','10','11 Arts','11 Commerce','12 Arts','12 Commerce'].map(c => (
                  <option key={c} value={c} style={{ background: '#0d2244', color: '#fff' }}>Class {c}</option>
                ))}
              </select>
            </div>

            {/* CTA Button — amber brand color */}
            <button
              onClick={submit}
              disabled={loading}
              style={{
                width: '100%', padding: '15px', marginTop: 4,
                background: loading
                  ? 'rgba(245,166,35,0.4)'
                  : 'linear-gradient(135deg, #F5A623 0%, #d4881a 100%)',
                color: '#1A1F2E',
                border: 'none', borderRadius: 12,
                fontWeight: 700, fontSize: '0.97rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: "'DM Sans', system-ui, sans-serif",
                boxShadow: loading ? 'none' : '0 6px 24px rgba(245,166,35,0.35)',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; }}
            >
              {loading ? '⏳ Please wait...' : '🎯 Get Free Access →'}
            </button>
          </div>

          {/* Trust chips */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 20, flexWrap: 'wrap' }}>
            {['✅ No registration fee', '✅ Instant access', '✅ 100% Free'].map(t => (
              <span key={t} style={{ color: '#8A9BBD', fontSize: '0.73rem', fontFamily: "'DM Sans', system-ui, sans-serif" }}>{t}</span>
            ))}
          </div>
        </div>

        {/* Teal accent line */}
        <div style={{ height: 3, background: 'linear-gradient(90deg, transparent, #0099B2, transparent)', borderRadius: 2, marginTop: -2 }} />

        {/* Login link */}
        <p style={{ textAlign: 'center', color: '#8A9BBD', fontSize: '0.8rem', marginTop: 18, fontFamily: "'DM Sans', system-ui, sans-serif" }}>
          Already have an account?{' '}
          <a href="/login" style={{ color: '#0099B2', fontWeight: 700, textDecoration: 'none' }}>Login →</a>
        </p>
      </div>
    </div>
  );
}
