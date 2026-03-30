import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const TeachsLogo = ({ size = 36 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="18" r="13" fill="#0099B2"/>
    <path d="M50 31 C50 31 18 42 18 55 C18 55 34 50 50 48 C66 50 82 55 82 55 C82 42 50 31 50 31Z" fill="#1B3A6B" rx="8"/>
    <rect x="44" y="48" width="12" height="30" rx="6" fill="#1B3A6B"/>
  </svg>
);

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
  ];

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        height: 'var(--nav-height)',
        background: scrolled ? 'rgba(12,22,40,0.97)' : 'rgba(12,22,40,0.96)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(212,168,83,0.15)',
        transition: 'all 0.3s',
        boxShadow: scrolled ? '0 4px 24px rgba(0,0,0,0.2)' : 'none',
      }}>
        <div className="container flex-between" style={{ height: '100%' }}>
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <TeachsLogo size={34} />
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.45rem', fontWeight: 700, color: 'var(--white)', lineHeight: 1, letterSpacing: '-0.5px' }}>
                Teach<span style={{ color: 'var(--gold)' }}>s</span>
              </div>
              <div style={{ fontSize: '0.6rem', color: 'var(--slate)', letterSpacing: '0.02em', lineHeight: 1, marginTop: 2 }}>
                Your Child's Most Trusted Tutor
              </div>
            </div>
          </Link>

          {/* Desktop Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }} className="desk-nav">
            {links.map(l => (
              <Link key={l.to} to={l.to} style={{
                color: location.pathname === l.to ? 'var(--gold)' : 'var(--slate2)',
                fontSize: '0.9rem', fontWeight: 500, padding: '8px 14px', borderRadius: 8,
                transition: 'all 0.2s', background: location.pathname === l.to ? 'rgba(212,168,83,0.08)' : 'transparent',
              }}>{l.label}</Link>
            ))}
          </div>

          {/* CTA */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }} className="desk-nav">
            {!loading && user ? (
              <>
                <Link to={getDash()} style={{ color: 'var(--slate2)', fontSize: '0.88rem', fontWeight: 500, padding: '8px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.06)' }}>Dashboard</Link>
                <button onClick={logout} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, padding: '8px 16px', color: 'var(--slate2)', fontSize: '0.85rem', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>Logout</button>
              </>
            ) : !loading ? (
              <>
                <Link to="/login" style={{ color: 'var(--slate2)', fontSize: '0.88rem', fontWeight: 500, padding: '8px 14px', borderRadius: 8, transition: 'color 0.2s' }}>Login</Link>
                <Link to="/pricing" style={{ background: 'var(--gold)', color: 'var(--navy)', fontWeight: 700, padding: '9px 20px', borderRadius: 8, fontSize: '0.9rem', transition: 'all 0.2s' }}>Book Free Demo</Link>
              </>
            ) : null}
          </div>

          {/* Hamburger */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="ham-btn" style={{ display: 'none', background: 'none', border: 'none', padding: 8, flexDirection: 'column', gap: 5 }}>
            <span style={{ width: 24, height: 2, background: 'var(--white)', display: 'block', transition: 'all 0.3s', transform: menuOpen ? 'rotate(45deg) translateY(7px)' : 'none' }} />
            <span style={{ width: 24, height: 2, background: 'var(--white)', display: 'block', opacity: menuOpen ? 0 : 1 }} />
            <span style={{ width: 24, height: 2, background: 'var(--white)', display: 'block', transition: 'all 0.3s', transform: menuOpen ? 'rotate(-45deg) translateY(-7px)' : 'none' }} />
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div style={{ background: 'var(--navy)', borderTop: '1px solid rgba(212,168,83,0.15)', padding: '16px 20px' }}>
            {links.map(l => (
              <Link key={l.to} to={l.to} style={{ display: 'block', color: location.pathname === l.to ? 'var(--gold)' : 'var(--slate2)', padding: '12px 0', fontWeight: 500, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{l.label}</Link>
            ))}
            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              {!loading && user ? (
                <>
                  <Link to={getDash()} style={{ flex: 1, textAlign: 'center', background: 'var(--gold)', color: 'var(--navy)', fontWeight: 700, padding: '10px', borderRadius: 8, fontSize: '0.9rem' }}>Dashboard</Link>
                  <button onClick={logout} style={{ flex: 1, background: 'rgba(255,255,255,0.08)', color: 'var(--white)', fontWeight: 600, padding: '10px', borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" style={{ flex: 1, textAlign: 'center', background: 'rgba(255,255,255,0.08)', color: 'var(--white)', fontWeight: 600, padding: '10px', borderRadius: 8, fontSize: '0.9rem' }}>Login</Link>
                  <Link to="/pricing" style={{ flex: 1, textAlign: 'center', background: 'var(--gold)', color: 'var(--navy)', fontWeight: 700, padding: '10px', borderRadius: 8, fontSize: '0.9rem' }}>Free Demo</Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
      <style>{`@media(max-width:860px){.desk-nav{display:none!important}.ham-btn{display:flex!important}}`}</style>
    </>
  );
}
