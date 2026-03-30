import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer style={{ background: 'var(--ink)', color: 'white', padding: '72px 0 0' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.5fr', gap: 48, paddingBottom: 56 }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <svg width="36" height="36" viewBox="0 0 100 100" fill="none">
                <circle cx="50" cy="22" r="14" fill="#0099B2"/>
                <path d="M50 36 C50 36 20 46 20 58 L50 52 L80 58 C80 46 50 36 50 36Z" fill="white" opacity="0.9"/>
                <rect x="44" y="52" width="12" height="28" rx="6" fill="white" opacity="0.9"/>
              </svg>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700, color: 'white' }}>
                Teach<span style={{ color: 'var(--teal)' }}>s</span>
              </span>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', lineHeight: 1.8, maxWidth: 280, marginBottom: 24 }}>
              A premium tutoring brand built on the Flexible Dual-Teacher Model — personalizing education for every student, Class 1 to 12.
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              {[
                { href: '#', icon: '📸', label: 'Instagram' },
                { href: '#', icon: '🐦', label: 'Twitter' },
                { href: '#', icon: '📘', label: 'Facebook' },
                { href: '#', icon: '▶️', label: 'YouTube' },
              ].map(s => (
                <a key={s.label} href={s.href} title={s.label} style={{
                  width: 38, height: 38, borderRadius: '50%', background: 'rgba(255,255,255,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem',
                  transition: 'background 0.2s',
                }}>
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h5 style={{ color: 'white', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 20 }}>Learn</h5>
            {[
              { to: '/pricing', label: 'Pricing Plans' },
              { to: '/practice-tests', label: 'Practice Tests' },
              { to: '/signup', label: 'Get Started' },
              { to: '/pricing', label: 'Book Free Demo' },
            ].map(l => (
              <Link key={l.to + l.label} to={l.to} style={{ display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', marginBottom: 12, transition: 'color 0.2s' }}>{l.label}</Link>
            ))}
          </div>

          <div>
            <h5 style={{ color: 'white', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 20 }}>Company</h5>
            {[
              { to: '/', label: 'About Teachs' },
              { to: '/mentor-workshop', label: 'Mentor Workshop' },
              { to: '/womens-program', label: "Women's Program" },
              { to: '/login', label: 'Sign In' },
            ].map(l => (
              <Link key={l.to + l.label} to={l.to} style={{ display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', marginBottom: 12, transition: 'color 0.2s' }}>{l.label}</Link>
            ))}
          </div>

          {/* Contact */}
          <div>
            <h5 style={{ color: 'white', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 20 }}>Contact</h5>
            {[
              { icon: '📞', text: '+91 98765 43210' },
              { icon: '✉️', text: 'hello@teachs.in' },
              { icon: '💬', text: 'WhatsApp Available' },
              { icon: '📍', text: 'New Delhi, India' },
            ].map((c, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 14 }}>
                <span style={{ fontSize: '1rem' }}>{c.icon}</span>
                <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>{c.text}</span>
              </div>
            ))}
            <div style={{ marginTop: 20, padding: '14px 18px', background: 'rgba(0,153,178,0.15)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(0,153,178,0.3)' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--teal)', fontWeight: 600, marginBottom: 4 }}>🎯 7-Day Refund Guarantee</div>
              <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)' }}>No questions asked within 7 days.</div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', padding: '24px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', margin: 0 }}>
            © {year} Teachs Learning Pvt Ltd. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: 24 }}>
            {['Privacy Policy', 'Terms of Service', 'Refund Policy'].map(l => (
              <a key={l} href="#" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.82rem', transition: 'color 0.2s' }}>{l}</a>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          footer .container > div:first-child { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 560px) {
          footer .container > div:first-child { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}
