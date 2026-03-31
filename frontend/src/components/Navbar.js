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
  useEffect(() => setMenuOpen(false), [location]);

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
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? 'rgba(255,255,255,0.97)' : 'white',
        boxShadow: scrolled ? '0 2px 20px rgba(12,22,40,0.1)' : '0 1px 0 rgba(212,168,83,0.15)',
        backdropFilter: 'blur(12px)',
        transition: 'all 0.3s',
        height: 'var(--nav-height)',
      }}>
        <div className="container" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <img src="/logo.png" alt="Teachs Logo" style={{ width: 42, height: 42, objectFit: 'contain' }} />
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800, color: 'var(--navy)', lineHeight: 1, letterSpacing: '-0.02em' }}>
                Teach<span style={{ color: 'var(--teal)' }}>s</span>
              </div>
              <div style={{ fontSize: '0.6rem', color: 'var(--slate)', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Your Child's Most Trusted Tutor</div>
            </div>
          </Link>

          {/* Desktop Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }} className="nav-desktop">
            {links.map(l => (
              <Link key={l.to} to={l.to} style={{
                padding: '6px 14px', borderRadius: 8, fontSize: '0.88rem', fontWeight: isActive(l.to) ? 700 : 500,
                color: isActive(l.to) ? 'var(--teal)' : 'var(--text2)',
                background: isActive(l.to) ? 'rgba(0,153,178,0.08)' : 'transparent',
                transition: 'all 0.2s',
              }}>{l.label}</Link>
            ))}
          </div>

          {/* Right Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }} className="nav-desktop">
            {!loading && (
              user ? (
                <>
                  <Link to={getDash()} className="btn btn-sm btn-outline-white" style={{ color: 'var(--navy)', borderColor: 'var(--navy)' }}>Dashboard</Link>
                  <button onClick={logout} className="btn btn-sm btn-gold">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="btn btn-sm" style={{ color: 'var(--text2)', fontWeight: 500 }}>Login</Link>
                  <Link to="/pricing" className="btn btn-sm btn-gold">Book Free Demo</Link>
                </>
              )
            )}
          </div>

          {/* Hamburger */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="nav-mobile-btn" style={{ background: 'none', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 8, padding: '6px 10px', display: 'none' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--navy)" strokeWidth="2">
              {menuOpen ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></> : <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{ position: 'fixed', top: 'var(--nav-height)', left: 0, right: 0, bottom: 0, background: 'white', zIndex: 99, overflowY: 'auto', padding: '20px 24px' }}>
          {links.map(l => (
            <Link key={l.to} to={l.to} style={{ display: 'block', padding: '14px 0', borderBottom: '1px solid rgba(0,0,0,0.06)', color: isActive(l.to) ? 'var(--teal)' : 'var(--text)', fontWeight: isActive(l.to) ? 700 : 500, fontSize: '1rem' }}>{l.label}</Link>
          ))}
          <div style={{ display: 'grid', gap: 10, marginTop: 20 }}>
            {!loading && (user ? (
              <>
                <Link to={getDash()} className="btn btn-outline" style={{ justifyContent: 'center' }}>Dashboard</Link>
                <button onClick={logout} className="btn btn-gold" style={{ width: '100%' }}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline" style={{ justifyContent: 'center' }}>Login</Link>
                <Link to="/pricing" className="btn btn-gold" style={{ justifyContent: 'center' }}>Book Free Demo →</Link>
              </>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @media(max-width:900px){ .nav-desktop{ display:none!important } .nav-mobile-btn{ display:flex!important } }
      `}</style>
    </>
  );
}
