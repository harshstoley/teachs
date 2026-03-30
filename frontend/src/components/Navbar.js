import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  const getDashboardLink = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/admin';
    if (user.role === 'teacher') return '/dashboard/teacher';
    return '/dashboard/student';
  };

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, height: 'var(--nav-height)',
      background: scrolled ? 'rgba(255,255,255,0.97)' : 'transparent',
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      borderBottom: scrolled ? '1px solid var(--border)' : 'none',
      transition: 'all 0.3s ease',
      boxShadow: scrolled ? 'var(--shadow-sm)' : 'none',
    }}>
      <div className="container flex-between" style={{ height: '100%' }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <svg width="38" height="38" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="22" r="14" fill="#0099B2"/>
            <path d="M50 36 C50 36 20 46 20 58 L50 52 L80 58 C80 46 50 36 50 36Z" fill="#1B3A6B" rx="8"/>
            <rect x="44" y="52" width="12" height="28" rx="6" fill="#1B3A6B"/>
          </svg>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.45rem', fontWeight: 700, color: 'var(--navy)', letterSpacing: '-0.01em' }}>
            Teach<span style={{ color: 'var(--teal)' }}>s</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }} className="desktop-nav">
          {[
            { to: '/', label: 'Home' },
            { to: '/pricing', label: 'Pricing' },
            { to: '/practice-tests', label: 'Practice Tests' },
            { to: '/mentor-workshop', label: 'Workshop' },
            { to: '/womens-program', label: "Women's Program" },
          ].map(link => (
            <Link key={link.to} to={link.to} style={{
              fontSize: '0.9rem', fontWeight: 600, color: location.pathname === link.to ? 'var(--teal)' : 'var(--ink)',
              transition: 'color 0.2s', textDecoration: 'none',
              borderBottom: location.pathname === link.to ? '2px solid var(--teal)' : '2px solid transparent',
              paddingBottom: 2,
            }}>
              {link.label}
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }} className="desktop-nav">
          {user ? (
            <>
              <Link to={getDashboardLink()} className="btn btn-outline btn-sm">Dashboard</Link>
              <button onClick={logout} className="btn btn-ghost btn-sm">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
              <Link to="/pricing#demo" className="btn btn-primary btn-sm">Book Free Demo</Link>
            </>
          )}
        </div>

        {/* Hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ display: 'none', background: 'none', border: 'none', padding: 8, cursor: 'pointer' }}
          className="hamburger"
          aria-label="Menu"
        >
          <div style={{ width: 24, height: 2, background: 'var(--ink)', margin: '5px 0', transition: 'all 0.3s', transform: menuOpen ? 'rotate(45deg) translateY(7px)' : 'none' }} />
          <div style={{ width: 24, height: 2, background: 'var(--ink)', margin: '5px 0', opacity: menuOpen ? 0 : 1 }} />
          <div style={{ width: 24, height: 2, background: 'var(--ink)', margin: '5px 0', transition: 'all 0.3s', transform: menuOpen ? 'rotate(-45deg) translateY(-7px)' : 'none' }} />
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{
          background: 'white', borderTop: '1px solid var(--border)', padding: '20px 24px',
          boxShadow: 'var(--shadow-lg)',
        }}>
          {[
            { to: '/', label: 'Home' },
            { to: '/pricing', label: 'Pricing' },
            { to: '/practice-tests', label: 'Practice Tests' },
            { to: '/mentor-workshop', label: 'Workshop' },
            { to: "/womens-program", label: "Women's Program" },
          ].map(link => (
            <Link key={link.to} to={link.to} style={{
              display: 'block', padding: '12px 0', fontWeight: 600, color: 'var(--ink)',
              borderBottom: '1px solid var(--border)',
            }}>{link.label}</Link>
          ))}
          <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
            {user ? (
              <>
                <Link to={getDashboardLink()} className="btn btn-primary btn-sm" style={{ flex: 1, textAlign: 'center' }}>Dashboard</Link>
                <button onClick={logout} className="btn btn-ghost btn-sm" style={{ flex: 1 }}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost btn-sm" style={{ flex: 1, textAlign: 'center' }}>Login</Link>
                <Link to="/pricing" className="btn btn-primary btn-sm" style={{ flex: 1, textAlign: 'center' }}>Free Demo</Link>
              </>
            )}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 860px) {
          .desktop-nav { display: none !important; }
          .hamburger { display: block !important; }
        }
      `}</style>
    </nav>
  );
}
