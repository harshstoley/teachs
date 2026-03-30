import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer style={{ background: 'var(--navy)', color: 'white', paddingTop: 64 }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.5fr', gap: 48, paddingBottom: 48 }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, marginBottom: 6 }}>
              Teach<span style={{ color: 'var(--gold)' }}>s</span>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--slate)', marginBottom: 16 }}>Your Child's Most Trusted Personalized Tutor</div>
            <p style={{ color: 'var(--slate)', fontSize: '0.88rem', lineHeight: 1.8, maxWidth: 280, marginBottom: 24 }}>
              India's first Dual-Teacher tutoring model. Two subject specialists, structured learning, and weekly progress tracking.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              {[['📸','Instagram'],['🐦','Twitter'],['📘','Facebook'],['▶️','YouTube']].map(([icon, label]) => (
                <a key={label} href="#" title={label} style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem' }}>{icon}</a>
              ))}
            </div>
          </div>
          <div>
            <h5 style={{ color: 'var(--slate2)', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 18 }}>Learn</h5>
            {[['Pricing','/pricing'],['Practice Tests','/practice-tests'],['Book Free Demo','/pricing'],['Sign Up','/signup']].map(([l,to]) => (
              <Link key={to+l} to={to} style={{ display: 'block', color: 'var(--slate)', fontSize: '0.88rem', marginBottom: 10, transition: 'color 0.2s' }}>{l}</Link>
            ))}
          </div>
          <div>
            <h5 style={{ color: 'var(--slate2)', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 18 }}>Company</h5>
            {[['About','/'],['Workshop','/mentor-workshop'],["Women's Program",'/womens-program'],['Login','/login']].map(([l,to]) => (
              <Link key={to+l} to={to} style={{ display: 'block', color: 'var(--slate)', fontSize: '0.88rem', marginBottom: 10 }}>{l}</Link>
            ))}
          </div>
          <div>
            <h5 style={{ color: 'var(--slate2)', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 18 }}>Contact</h5>
            {[['📞','+91 98765 43210'],['✉️','hello@teachs.in'],['💬','WhatsApp Available'],['📍','New Delhi, India']].map(([icon,text],i) => (
              <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
                <span>{icon}</span><span style={{ color: 'var(--slate)', fontSize: '0.88rem' }}>{text}</span>
              </div>
            ))}
            <div style={{ marginTop: 16, padding: '12px 16px', background: 'rgba(212,168,83,0.1)', borderRadius: 10, border: '1px solid rgba(212,168,83,0.2)' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--gold)', fontWeight: 600, marginBottom: 3 }}>🎯 7-Day Refund Guarantee</div>
              <div style={{ fontSize: '0.74rem', color: 'var(--slate)' }}>No questions asked.</div>
            </div>
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(212,168,83,0.1)', padding: '22px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
          <p style={{ color: 'var(--slate)', fontSize: '0.82rem', margin: 0 }}>© {year} Teachs Learning Pvt Ltd. All rights reserved.</p>
          <div style={{ display: 'flex', gap: 20 }}>
            {['Privacy Policy','Terms','Refund Policy'].map(l => (
              <a key={l} href="#" style={{ color: 'var(--slate)', fontSize: '0.8rem' }}>{l}</a>
            ))}
          </div>
        </div>
      </div>
      <style>{`@media(max-width:860px){footer .container>div:first-child{grid-template-columns:1fr 1fr!important}}@media(max-width:560px){footer .container>div:first-child{grid-template-columns:1fr!important}}`}</style>
    </footer>
  );
}
