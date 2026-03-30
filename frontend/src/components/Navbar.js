import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Logo = ({ size = 36 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="18" r="13" fill="#3B72F5"/>
    <path d="M50 31 C50 31 18 42 18 55 C18 55 34 50 50 48 C66 50 82 55 82 55 C82 42 50 31 50 31Z" fill="#1A3A8F"/>
    <rect x="44" y="48" width="12" height="30" rx="6" fill="#1A3A8F"/>
  </svg>
);

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout, loading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 12);
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

  const isActive = (to) => to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        height: 'var(--nav-h)',
        background: scrolled ? 'rgba(11,17,32,0.96)' : 'rgba(11,17,32,0.92)',
        backdropFilter: 'blur(16px)',
        borderBottom: scrolled ? '1px solid rgba(59,114,245,0.20)' : '1px solid rgba(59,114,245,0.10)',
        transition: 'all 0.3s',
        boxShadow: scrolled ? '0 4px 32px rgba(0,0,0,0.25)' : 'none',
      }}>
        <div className="container flex-between" style={{ height: '100%' }}>
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 11, textDecoration: 'none' }}>
            <Logo size={34} />
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.55rem', fontWeight: 700, color: 'white', lineHeight: 1, letterSpacing: '-0.5px' }}>
                Teach<span style={{ color: 'var(--amber2)' }}>s</span>
              </div>
              <div style={{ fontSize: '0.58rem', color: 'rgba(255,255,255,0.40)', letterSpacing: '0.12em', lineHeight: 1, marginTop: 2, textTransform: 'uppercase' }}>
                Dual-Teacher Platform
              </div>
            </div>
          </Link>

          {/* Desktop Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 2 }} className="desk-nav">
            {links.map(l => (
              <Link key={l.to} to={l.to} style={{
                color: isActive(l.to) ? 'var(--amber2)' : 'rgba(255,255,255,0.65)',
                fontSize: '0.88rem', fontWeight: 500, padding: '8px 15px', borderRadius: 10,
                transition: 'all 0.2s',
                background: isActive(l.to) ? 'rgba(224,156,26,0.10)' : 'transparent',
                borderBottom: isActive(l.to) ? '2px solid var(--amber2)' : '2px solid transparent',
              }}>{l.label}</Link>
            ))}
          </div>

          {/* CTA */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }} className="desk-nav">
            {!loading && user ? (
              <>
                <Link to={getDash()} style={{
                  color: 'rgba(255,255,255,0.80)', fontSize: '0.87rem', fontWeight: 500,
                  padding: '8px 16px', borderRadius: 10,
                  background: 'rgba(59,114,245,0.15)', border: '1px solid rgba(59,114,245,0.25)',
                }}>Dashboard</Link>
                <button onClick={logout} style={{
                  background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: 10, padding: '8px 16px', color: 'rgba(255,255,255,0.65)',
                  fontSize: '0.85rem', cursor: 'pointer', fontFamily: 'var(--font-body)',
                  transition: 'all 0.2s',
                }}>Logout</button>
              </>
            ) : !loading ? (
              <>
                <Link to="/login" style={{
                  color: 'rgba(255,255,255,0.65)', fontSize: '0.87rem', fontWeight: 500,
                  padding: '8px 16px', borderRadius: 10, transition: 'color 0.2s',
                }}>Login</Link>
                <Link to="/pricing" style={{
                  background: 'linear-gradient(135deg, var(--amber) 0%, var(--amber2) 100%)',
                  color: 'var(--ink)', fontWeight: 700, padding: '9px 20px',
                  borderRadius: 10, fontSize: '0.88rem', transition: 'all 0.2s',
                  boxShadow: '0 4px 16px rgba(200,130,10,0.35)',
                }}>Book Free Demo</Link>
              </>
            ) : null}
          </div>

          {/* Hamburger */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="ham-btn" style={{
            display: 'none', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: 10, padding: '8px 10px', flexDirection: 'column', gap: 5, cursor: 'pointer',
          }}>
            {[0,1,2].map(i => (
              <span key={i} style={{
                width: 22, height: 2, background: 'white', display: 'block', transition: 'all 0.3s',
                transform: menuOpen ? (i === 0 ? 'rotate(45deg) translateY(7px)' : i === 2 ? 'rotate(-45deg) translateY(-7px)' : 'scaleX(0)') : 'none',
                opacity: menuOpen && i === 1 ? 0 : 1,
              }} />
            ))}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div style={{
            background: 'rgba(11,17,32,0.98)', borderTop: '1px solid rgba(59,114,245,0.15)',
            padding: '16px 20px 24px', backdropFilter: 'blur(20px)',
          }}>
            {links.map(l => (
              <Link key={l.to} to={l.to} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                color: isActive(l.to) ? 'var(--amber2)' : 'rgba(255,255,255,0.75)',
                padding: '13px 4px', fontWeight: 500, fontSize: '0.95rem',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
              }}>{l.label}</Link>
            ))}
            <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
              {!loading && user ? (
                <>
                  <Link to={getDash()} style={{ flex: 1, textAlign: 'center', background: 'linear-gradient(135deg,var(--amber),var(--amber2))', color: 'var(--ink)', fontWeight: 700, padding: '12px', borderRadius: 10, fontSize: '0.9rem' }}>Dashboard</Link>
                  <button onClick={logout} style={{ flex: 1, background: 'rgba(255,255,255,0.08)', color: 'white', fontWeight: 600, padding: '12px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.15)', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" style={{ flex: 1, textAlign: 'center', background: 'rgba(59,114,245,0.15)', color: 'rgba(255,255,255,0.85)', fontWeight: 600, padding: '12px', borderRadius: 10, fontSize: '0.9rem', border: '1px solid rgba(59,114,245,0.25)' }}>Login</Link>
                  <Link to="/pricing" style={{ flex: 1, textAlign: 'center', background: 'linear-gradient(135deg,var(--amber),var(--amber2))', color: 'var(--ink)', fontWeight: 700, padding: '12px', borderRadius: 10, fontSize: '0.9rem' }}>Free Demo</Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
