import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout, loading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);
  useEffect(() => { setMenuOpen(false); }, [location]);

  const getDash = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/admin';
    if (user.role === 'teacher') return '/dashboard/teacher';
    return '/dashboard/student';
  };

  const links = [
    { to: '/', label: 'Home' },
    { to: '/pricing', label: 'Pricing' },
    { to: '/practice-tests', label: 'Tests' },
    { to: '/mentor-workshop', label: 'Workshop' },
    { to: '/womens-program', label: "Women's" },
    { to: '/become-tutor', label: 'Become a Tutor' },
  ];

  const isActive = (to) => to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        background: 'white',
        boxShadow: scrolled ? '0 2px 20px rgba(27,58,107,0.12)' : '0 1px 0 rgba(27,58,107,0.08)',
        height: 'var(--nav-height)',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', flexShrink: 0 }}>
            <img src="/logo.png" alt="Teachs" style={{ width: 40, height: 40, objectFit: 'contain' }} />
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 800, lineHeight: 1, letterSpacing: '-0.02em' }}>
                <span style={{ color: '#1B3A6B' }}>Teach</span><span style={{ color: '#F5A623' }}>s</span>
              </div>
              <div style={{ fontSize: '0.55rem', color: '#0099B2', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 1 }}>Your Child's Most Trusted Tutor</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, justifyContent: 'center' }} className="nav-links-desktop">
            {links.map(l => (
              <Link key={l.to} to={l.to} style={{
                padding: '6px 12px', borderRadius: 8, fontSize: '0.85rem',
                fontWeight: isActive(l.to) ? 700 : 500,
                color: isActive(l.to) ? '#1B3A6B' : '#4A5E7A',
                background: isActive(l.to) ? 'rgba(27,58,107,0.07)' : 'transparent',
                textDecoration: 'none', whiteSpace: 'nowrap',
              }}>{l.label}</Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }} className="nav-cta-desktop">
            {!loading && (user ? (
              <>
                <Link to={getDash()} style={{ padding: '8px 16px', borderRadius: 8, border: '1.5px solid #1B3A6B', color: '#1B3A6B', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none' }}>Dashboard</Link>
                <button onClick={logout} style={{ padding: '8px 18px', borderRadius: 8, background: '#1B3A6B', color: 'white', fontSize: '0.85rem', fontWeight: 700, border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" style={{ padding: '8px 14px', borderRadius: 8, color: '#4A5E7A', fontSize: '0.85rem', fontWeight: 500, textDecoration: 'none' }}>Login</Link>
                <Link to="/pricing" style={{ padding: '9px 20px', borderRadius: 8, background: '#F5A623', color: '#1B3A6B', fontSize: '0.85rem', fontWeight: 700, textDecoration: 'none' }}>Book Free Demo</Link>
              </>
            ))}
          </div>

          {/* Hamburger */}
          <button onClick={() => setMenuOpen(!menuOpen)} style={{ display: 'none', background: 'none', border: '1px solid rgba(27,58,107,0.15)', borderRadius: 8, padding: '7px 10px', cursor: 'pointer' }} className="nav-hamburger">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1B3A6B" strokeWidth="2" strokeLinecap="round">
              {menuOpen ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></> : <><line x1="3" y1="7" x2="21" y2="7"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="17" x2="21" y2="17"/></>}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {menuOpen && (
        <div style={{ position: 'fixed', top: 'var(--nav-height)', left: 0, right: 0, bottom: 0, background: 'white', zIndex: 999, overflowY: 'auto', padding: '16px 20px 40px' }}>
          {links.map(l => (
            <Link key={l.to} to={l.to} style={{
              display: 'block', padding: '14px 0', borderBottom: '1px solid rgba(27,58,107,0.06)',
              color: isActive(l.to) ? '#1B3A6B' : '#4A5E7A',
              fontWeight: isActive(l.to) ? 700 : 500, fontSize: '1rem', textDecoration: 'none',
            }}>{l.label}</Link>
          ))}
          <div style={{ marginTop: 24, display: 'grid', gap: 10 }}>
            {!loading && (user ? (
              <>
                <Link to={getDash()} style={{ display: 'block', textAlign: 'center', padding: '12px', borderRadius: 10, border: '1.5px solid #1B3A6B', color: '#1B3A6B', fontWeight: 600, textDecoration: 'none' }}>Dashboard</Link>
                <button onClick={logout} style={{ width: '100%', padding: '12px', borderRadius: 10, background: '#1B3A6B', color: 'white', fontWeight: 700, border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '1rem' }}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" style={{ display: 'block', textAlign: 'center', padding: '12px', borderRadius: 10, border: '1.5px solid rgba(27,58,107,0.2)', color: '#4A5E7A', fontWeight: 600, textDecoration: 'none' }}>Login</Link>
                <Link to="/pricing" style={{ display: 'block', textAlign: 'center', padding: '12px', borderRadius: 10, background: '#F5A623', color: '#1B3A6B', fontWeight: 700, textDecoration: 'none' }}>Book Free Demo →</Link>
              </>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @media(max-width:900px){
          .nav-links-desktop { display: none !important; }
          .nav-cta-desktop { display: none !important; }
          .nav-hamburger { display: flex !important; }
        }
      `}</style>
    </>
  );
}
