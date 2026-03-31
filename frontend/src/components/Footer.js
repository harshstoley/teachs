import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

const SocialIcon = ({ href, label, color, children }) => (
  href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" title={label}
      style={{ width:38, height:38, borderRadius:'50%', background:color, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
      {children}
    </a>
  ) : null
);

export default function Footer() {
  const year = new Date().getFullYear();
  const [s, setS] = useState({});

  useEffect(() => {
    api.get('/settings').then(r => setS(r.data || {})).catch(() => {});
  }, []);

  const phone = s.phone || '+91 98765 43210';
  const email = s.email || 'hello@teachs.in';
  const address = s.address || 'New Delhi, India';
  const whatsapp = s.whatsapp || '919876543210';

  return (
    <footer style={{ background:'var(--navy)', color:'white', paddingTop:64 }}>
      <div className="container">
        <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1.5fr', gap:40, paddingBottom:48 }}>

          {/* Brand + Social */}
          <div>
            <div style={{ fontFamily:'var(--font-display)', fontSize:'1.5rem', fontWeight:700, marginBottom:6 }}>
              Teach<span style={{ color:'var(--gold)' }}>s</span>
            </div>
            <div style={{ fontSize:'0.78rem', color:'var(--slate)', marginBottom:16 }}>Your Child's Most Trusted Personalized Tutor</div>
            <p style={{ color:'var(--slate)', fontSize:'0.88rem', lineHeight:1.8, maxWidth:280, marginBottom:24 }}>
              India's first Dual-Teacher tutoring model. Two subject specialists, structured learning, and weekly progress tracking.
            </p>
            {/* Social Icons */}
            <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
              <SocialIcon href={s.instagram} label="Instagram" color="linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </SocialIcon>
              <SocialIcon href={s.facebook} label="Facebook" color="#1877f2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M24 12.073C24 5.404 18.627 0 12 0S0 5.404 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.513c-1.491 0-1.956.928-1.956 1.879v2.256h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/></svg>
              </SocialIcon>
              <SocialIcon href={s.youtube} label="YouTube" color="#ff0000">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/></svg>
              </SocialIcon>
              <SocialIcon href={s.twitter} label="Twitter/X" color="#000">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </SocialIcon>
              <SocialIcon href={s.linkedin} label="LinkedIn" color="#0077b5">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </SocialIcon>
              <SocialIcon href={`https://wa.me/${whatsapp}`} label="WhatsApp" color="#25d366">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
              </SocialIcon>
            </div>
          </div>

          {/* Learn */}
          <div>
            <h5 style={{ color:'var(--slate2)', fontFamily:'var(--font-body)', fontWeight:700, fontSize:'0.78rem', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:18 }}>Learn</h5>
            {[['Pricing','/pricing'],['Practice Tests','/practice-tests'],['Book Free Demo','/pricing'],['Sign Up','/signup'],['Become a Tutor','/become-tutor']].map(([l,to]) => (
              <Link key={to+l} to={to} style={{ display:'block', color:'var(--slate)', fontSize:'0.88rem', marginBottom:10 }}>{l}</Link>
            ))}
          </div>

          {/* Company */}
          <div>
            <h5 style={{ color:'var(--slate2)', fontFamily:'var(--font-body)', fontWeight:700, fontSize:'0.78rem', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:18 }}>Company</h5>
            {[['About','/'],['Workshop','/mentor-workshop'],["Women's Program",'/womens-program'],["Become a Tutor",'/become-tutor'],['Login','/login']].map(([l,to]) => (
              <Link key={to+l} to={to} style={{ display:'block', color:'var(--slate)', fontSize:'0.88rem', marginBottom:10 }}>{l}</Link>
            ))}
          </div>

          {/* Contact - from settings */}
          <div>
            <h5 style={{ color:'var(--slate2)', fontFamily:'var(--font-body)', fontWeight:700, fontSize:'0.78rem', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:18 }}>Contact</h5>
            <a href={`tel:${phone}`} style={{ display:'flex', gap:10, marginBottom:12, textDecoration:'none' }}>
              <span>📞</span><span style={{ color:'var(--slate)', fontSize:'0.88rem' }}>{phone}</span>
            </a>
            <a href={`mailto:${email}`} style={{ display:'flex', gap:10, marginBottom:12, textDecoration:'none' }}>
              <span>✉️</span><span style={{ color:'var(--slate)', fontSize:'0.88rem' }}>{email}</span>
            </a>
            <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer" style={{ display:'flex', gap:10, marginBottom:12, textDecoration:'none' }}>
              <span>💬</span><span style={{ color:'var(--slate)', fontSize:'0.88rem' }}>WhatsApp Us</span>
            </a>
            <div style={{ display:'flex', gap:10, marginBottom:12 }}>
              <span>📍</span><span style={{ color:'var(--slate)', fontSize:'0.88rem' }}>{address}</span>
            </div>
            <div style={{ marginTop:16, padding:'12px 16px', background:'rgba(212,168,83,0.1)', borderRadius:10, border:'1px solid rgba(212,168,83,0.2)' }}>
              <div style={{ fontSize:'0.78rem', color:'var(--gold)', fontWeight:600, marginBottom:3 }}>🎯 7-Day Refund Guarantee</div>
              <div style={{ fontSize:'0.74rem', color:'var(--slate)' }}>No questions asked.</div>
            </div>
          </div>
        </div>

        <div style={{ borderTop:'1px solid rgba(212,168,83,0.1)', padding:'22px 0', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:10 }}>
          <p style={{ color:'var(--slate)', fontSize:'0.82rem', margin:0 }}>© {year} Teachs Learning Pvt Ltd. All rights reserved.</p>
          <div style={{ display:'flex', gap:20 }}>
            {['Privacy Policy','Terms','Refund Policy'].map(l => (
              <a key={l} href="#" style={{ color:'var(--slate)', fontSize:'0.8rem' }}>{l}</a>
            ))}
          </div>
        </div>
      </div>
      <style>{`
        @media(max-width:860px){ footer .container>div:first-child{ grid-template-columns:1fr 1fr!important } }
        @media(max-width:560px){ footer .container>div:first-child{ grid-template-columns:1fr!important } }
        footer a:hover{ color:var(--gold)!important; }
      `}</style>
    </footer>
  );
}
