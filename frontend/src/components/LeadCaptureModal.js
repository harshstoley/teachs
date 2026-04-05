import React, { useState } from 'react';
import api from '../utils/api';

// Check if user already submitted lead form
export function hasGuestAccess() {
  return !!localStorage.getItem('teachs_guest');
}

// Call this before any gated action. 
// If already filled → runs onSuccess immediately.
// Otherwise → shows modal, on submit → saves to backend → runs onSuccess.
export default function LeadCaptureModal({ onSuccess, onClose, actionLabel = 'continue' }) {
  const [form, setForm] = useState({ name: '', phone: '', student_class: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async () => {
    if (!form.name.trim()) return setError('Please enter your name.');
    if (!form.phone.trim() || form.phone.replace(/\s/g,'').length < 10)
      return setError('Please enter a valid 10-digit phone number.');
    if (!form.student_class) return setError('Please select your class.');

    setLoading(true);
    setError('');
    try {
      await api.post('/leads', {
        name: form.name,
        phone: form.phone,
        student_class: form.student_class,
        source: 'guest_access',
        message: `Accessed: ${actionLabel}`,
      });
    } catch (_) {
      // still proceed even if API fails
    }
    localStorage.setItem('teachs_guest', JSON.stringify(form));
    setLoading(false);
    onSuccess();
  };

  const inputStyle = {
    width: '100%', padding: '12px 14px', borderRadius: 10,
    background: 'rgba(255,255,255,0.07)',
    border: '1.5px solid rgba(0,153,178,0.25)',
    color: '#fff', fontSize: '0.91rem', outline: 'none',
    boxSizing: 'border-box',
    fontFamily: "'DM Sans', system-ui, sans-serif",
    transition: 'border-color 0.2s',
  };

  return (
    /* Overlay */
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 2000,
        background: 'rgba(10,18,35,0.82)',
        backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px',
        animation: 'fadeIn 0.2s ease',
      }}
    >
      {/* Card */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 440, position: 'relative',
          background: 'linear-gradient(160deg, #1A1F2E 0%, #1B3A6B 100%)',
          border: '1px solid rgba(0,153,178,0.28)',
          borderRadius: 22,
          padding: '38px 34px',
          boxShadow: '0 32px 80px rgba(0,0,0,0.55)',
          animation: 'fadeUp 0.3s ease',
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 14, right: 16,
            background: 'rgba(255,255,255,0.07)', border: 'none',
            width: 30, height: 30, borderRadius: '50%',
            color: '#8A9BBD', fontSize: '1rem', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >✕</button>

        {/* Teachs brand badge */}
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            background: 'rgba(245,166,35,0.12)',
            border: '1px solid rgba(245,166,35,0.28)',
            borderRadius: 100, padding: '6px 18px',
          }}>
            <span style={{ fontSize: '0.95rem' }}>🎓</span>
            <span style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontWeight: 700, color: '#F5A623', fontSize: '1.05rem',
            }}>Teachs</span>
          </span>
        </div>

        {/* Heading */}
        <h3 style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          color: '#fff', fontSize: '1.4rem', fontWeight: 700,
          textAlign: 'center', marginBottom: 8, lineHeight: 1.3,
        }}>
          Quick Details to <em style={{ color: '#F5A623', fontStyle: 'italic' }}>Continue</em>
        </h3>
        <p style={{
          fontFamily: "'DM Sans', system-ui, sans-serif",
          color: '#B8C5D9', textAlign: 'center',
          fontSize: '0.87rem', marginBottom: 24, lineHeight: 1.6,
        }}>
          Free access — no account needed. Just tell us who you are.
        </p>

        {/* Error */}
        {error && (
          <div style={{
            background: 'rgba(192,57,43,0.12)', border: '1px solid rgba(192,57,43,0.3)',
            color: '#e74c3c', padding: '9px 13px', borderRadius: 9,
            marginBottom: 16, fontSize: '0.83rem',
            fontFamily: "'DM Sans', system-ui, sans-serif",
          }}>⚠️ {error}</div>
        )}

        {/* Fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ display: 'block', color: '#B8C5D9', fontSize: '0.8rem', fontWeight: 600, marginBottom: 6, fontFamily: "'DM Sans', system-ui, sans-serif" }}>
              Full Name *
            </label>
            <input
              name="name" value={form.name} onChange={handle}
              placeholder="Parent / Student name"
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = '#0099B2'}
              onBlur={e => e.target.style.borderColor = 'rgba(0,153,178,0.25)'}
            />
          </div>

          <div>
            <label style={{ display: 'block', color: '#B8C5D9', fontSize: '0.8rem', fontWeight: 600, marginBottom: 6, fontFamily: "'DM Sans', system-ui, sans-serif" }}>
              Phone Number *
            </label>
            <input
              name="phone" value={form.phone} onChange={handle}
              placeholder="+91 XXXXX XXXXX" type="tel"
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = '#0099B2'}
              onBlur={e => e.target.style.borderColor = 'rgba(0,153,178,0.25)'}
            />
          </div>

          <div>
            <label style={{ display: 'block', color: '#B8C5D9', fontSize: '0.8rem', fontWeight: 600, marginBottom: 6, fontFamily: "'DM Sans', system-ui, sans-serif" }}>
              Student's Class *
            </label>
            <select
              name="student_class" value={form.student_class} onChange={handle}
              style={{ ...inputStyle, background: '#0d2244', cursor: 'pointer', color: form.student_class ? '#fff' : '#8A9BBD' }}
              onFocus={e => e.target.style.borderColor = '#0099B2'}
              onBlur={e => e.target.style.borderColor = 'rgba(0,153,178,0.25)'}
            >
              <option value="" style={{ background: '#0d2244' }}>Select Class</option>
              {['1','2','3','4','5','6','7','8','9','10','11 Arts','11 Commerce','12 Arts','12 Commerce'].map(c => (
                <option key={c} value={c} style={{ background: '#0d2244', color: '#fff' }}>Class {c}</option>
              ))}
            </select>
          </div>

          <button
            onClick={submit} disabled={loading}
            style={{
              width: '100%', padding: '14px', marginTop: 4,
              background: loading ? 'rgba(245,166,35,0.4)' : 'linear-gradient(135deg, #F5A623 0%, #d4881a 100%)',
              color: '#1A1F2E', border: 'none', borderRadius: 12,
              fontWeight: 700, fontSize: '0.95rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: "'DM Sans', system-ui, sans-serif",
              boxShadow: loading ? 'none' : '0 6px 24px rgba(245,166,35,0.30)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = ''; }}
          >
            {loading ? '⏳ Please wait...' : '🎯 Continue for Free →'}
          </button>
        </div>

        {/* Trust */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 14, marginTop: 16, flexWrap: 'wrap' }}>
          {['✅ Free access', '✅ No account needed', '✅ No spam'].map(t => (
            <span key={t} style={{ color: '#8A9BBD', fontSize: '0.72rem', fontFamily: "'DM Sans', system-ui, sans-serif" }}>{t}</span>
          ))}
        </div>

        {/* Teal bottom line */}
        <div style={{ height: 3, background: 'linear-gradient(90deg, transparent, #0099B2, transparent)', borderRadius: 2, marginTop: 22, marginLeft: -34, marginRight: -34 }} />
      </div>
    </div>
  );
}
