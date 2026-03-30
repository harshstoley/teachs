import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer style={{ background: 'var(--ink)', color: 'white', paddingTop: 72 }}>
      {/* Top gradient bar */}
      <div style={{ height: 3, background: 'linear-gradient(90deg, var(--sapphire) 0%, var(--sky) 40%, var(--emerald2) 70%, var(--amber2) 100%)' }} />
      
      <div className="container" style={{ paddingTop: 56 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.5fr', gap: 48, paddingBottom: 52 }}>
          {/* Brand */}
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 700, marginBottom: 4, letterSpacing: '-0.5px' }}>
              Teach<span style={{ color: 'var(--amber2)' }}>s</span>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', marginBottom: 18, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Your Child's Most Trusted Tutor</div>
            <p style={{ color: 'rgba(255,255,255,0.50)', fontSize: '0.87rem', lineHeight: 1.82, maxWidth: 280, marginBottom: 28 }}>
              India's first Dual-Teacher tutoring model. Two subject specialists, structured learning, and weekly progress tracking.
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              {[['📸','Instagram'],['🐦','Twitter'],['📘','Facebook'],['▶️','YouTube']].map(([icon, label]) => (
                <a key={label} href="#" title={label} style={{
                  width: 38, height: 38, borderRadius: 10,
                  background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.10)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.95rem',
                  transition: 'all 0.2s',
                }}>{icon}</a>
              ))}
            </div>
          </div>

          {/* Learn */}
          <div>
            <h5 style={{ color: 'var(--amber2)', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '0.76rem', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 20 }}>Learn</h5>
            {[['Pricing','/pricing'],['Practice Tests','/practice-tests'],['Book Free Demo','/pricing'],['Sign Up','/signup']].map(([l,to]) => (
              <Link key={to+l} to={to} style={{ display: 'block', color: 'rgba(255,255,255,0.50)', fontSize: '0.87rem', marginBottom: 12, transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = 'var(--amber2)'}
                onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.50)'}
              >{l}</Link>
            ))}
          </div>

          {/* Company */}
          <div>
            <h5 style={{ color: 'var(--sky)', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '0.76rem', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 20 }}>Company</h5>
            {[['About','/'],['Workshop','/mentor-workshop'],["Women's Program",'/womens-program'],['Login','/login']].map(([l,to]) => (
              <Link key={to+l} to={to} style={{ display: 'block', color: 'rgba(255,255,255,0.50)', fontSize: '0.87rem', marginBottom: 12, transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = 'var(--sky)'}
                onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.50)'}
              >{l}</Link>
            ))}
          </div>

          {/* Contact */}
          <div>
            <h5 style={{ color: 'var(--emerald2)', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '0.76rem', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 20 }}>Contact</h5>
            {[['📞','+91 98765 43210'],['✉️','hello@teachs.in'],['💬','WhatsApp Available'],['📍','New Delhi, India']].map(([icon,text],i) => (
              <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 12, alignItems: 'center' }}>
                <span style={{ fontSize: '0.9rem' }}>{icon}</span>
                <span style={{ color: 'rgba(255,255,255,0.50)', fontSize: '0.87rem' }}>{text}</span>
              </div>
            ))}
            <div style={{ marginTop: 18, padding: '14px 16px', background: 'rgba(11,122,94,0.12)', borderRadius: 12, border: '1px solid rgba(11,122,94,0.25)' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--emerald2)', fontWeight: 700, marginBottom: 3 }}>🛡️ 7-Day Refund Guarantee</div>
              <div style={{ fontSize: '0.74rem', color: 'rgba(255,255,255,0.40)' }}>No questions asked.</div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', padding: '22px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
          <p style={{ color: 'rgba(255,255,255,0.30)', fontSize: '0.80rem', margin: 0 }}>
            © {year} Teachs Learning Pvt Ltd. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: 20 }}>
            {['Privacy Policy','Terms','Refund Policy'].map(l => (
              <a key={l} href="#" style={{ color: 'rgba(255,255,255,0.30)', fontSize: '0.79rem', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = 'var(--sky)'}
                onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.30)'}
              >{l}</a>
            ))}
          </div>
        </div>
      </div>
      <style>{`@media(max-width:860px){footer .container>div:first-child{grid-template-columns:1fr 1fr!important}}@media(max-width:560px){footer .container>div:first-child{grid-template-columns:1fr!important}}`}</style>
    </footer>
  );
}
