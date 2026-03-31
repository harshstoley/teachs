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
    { to: '/become-tutor', label: 'Become Tutor' },
  ];

  const isActive = (to) => to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);

  return (
    <>
      <nav style={{
        position:'fixed', top:0, left:0, right:0, zIndex:1000,
        background:'rgba(12,22,40,0.97)',
        backdropFilter:'blur(16px)',
        borderBottom:'1px solid rgba(212,168,83,0.12)',
        height:'var(--nav-height)',
      }}>
        <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 20px', height:'100%', display:'flex', alignItems:'center', justifyContent:'space-between', gap:12 }}>

          {/* Logo + Name */}
          <Link to="/" style={{ display:'flex', alignItems:'center', gap:10, textDecoration:'none', flexShrink:0 }}>
            <img
              src="/logo.png"
              alt="Teachs Logo"
              style={{ width:42, height:42, objectFit:'contain', display:'block' }}
              onError={e => { e.target.style.display='none'; }}
            />
            <span style={{
              fontFamily:'var(--font-display)', fontSize:'1.6rem', fontWeight:800,
              lineHeight:1, letterSpacing:'-0.02em',
            }}>
              <span style={{ color:'white' }}>Teach</span><span style={{ color:'var(--gold)' }}>s</span>
            </span>
          </Link>

          {/* Desktop links */}
          <div style={{ display:'flex', alignItems:'center', gap:2, flex:1, justifyContent:'center' }} className="nd">
            {links.map(l => (
              <Link key={l.to} to={l.to} style={{
                padding:'6px 11px', borderRadius:8, fontSize:'0.84rem',
                fontWeight: isActive(l.to) ? 700 : 500,
                color: isActive(l.to) ? 'var(--gold)' : 'var(--slate2)',
                background: isActive(l.to) ? 'rgba(212,168,83,0.1)' : 'transparent',
                textDecoration:'none', whiteSpace:'nowrap', transition:'all 0.15s',
              }}>{l.label}</Link>
            ))}
          </div>

          {/* CTA */}
          <div style={{ display:'flex', alignItems:'center', gap:8, flexShrink:0 }} className="nd">
            {!loading && (user ? (
              <>
                <Link to={getDash()} style={{ padding:'7px 14px', borderRadius:8, border:'1px solid rgba(212,168,83,0.3)', color:'var(--slate2)', fontSize:'0.83rem', fontWeight:500, textDecoration:'none' }}>Dashboard</Link>
                <button onClick={logout} style={{ padding:'8px 16px', borderRadius:8, background:'var(--gold)', color:'var(--navy)', fontSize:'0.83rem', fontWeight:700, border:'none', cursor:'pointer', fontFamily:'var(--font-body)' }}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" style={{ padding:'7px 12px', color:'var(--slate2)', fontSize:'0.83rem', textDecoration:'none' }}>Login</Link>
                <Link to="/pricing" style={{ padding:'8px 18px', borderRadius:8, background:'var(--gold)', color:'var(--navy)', fontSize:'0.83rem', fontWeight:700, textDecoration:'none' }}>Free Demo</Link>
              </>
            ))}
          </div>

          {/* Hamburger */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="nm" style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(212,168,83,0.2)', borderRadius:8, padding:'7px 9px', cursor:'pointer', display:'none' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round">
              {menuOpen ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></> : <><line x1="3" y1="7" x2="21" y2="7"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="17" x2="21" y2="17"/></>}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{ position:'fixed', top:'var(--nav-height)', left:0, right:0, bottom:0, background:'var(--navy)', zIndex:999, overflowY:'auto', padding:'20px 20px 40px', borderTop:'1px solid rgba(212,168,83,0.12)' }}>
          {links.map(l => (
            <Link key={l.to} to={l.to} style={{
              display:'block', padding:'14px 0', borderBottom:'1px solid rgba(255,255,255,0.05)',
              color: isActive(l.to) ? 'var(--gold)' : 'var(--slate2)',
              fontWeight: isActive(l.to) ? 700 : 400, fontSize:'1rem', textDecoration:'none',
            }}>{l.label}</Link>
          ))}
          <div style={{ marginTop:24, display:'grid', gap:10 }}>
            {!loading && (user ? (
              <>
                <Link to={getDash()} style={{ display:'block', textAlign:'center', padding:'12px', borderRadius:10, border:'1px solid rgba(212,168,83,0.3)', color:'var(--slate2)', fontWeight:600, textDecoration:'none' }}>Dashboard</Link>
                <button onClick={logout} style={{ width:'100%', padding:'13px', borderRadius:10, background:'var(--gold)', color:'var(--navy)', fontWeight:700, border:'none', cursor:'pointer', fontFamily:'var(--font-body)', fontSize:'1rem' }}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" style={{ display:'block', textAlign:'center', padding:'12px', borderRadius:10, border:'1px solid rgba(212,168,83,0.2)', color:'var(--slate2)', fontWeight:500, textDecoration:'none' }}>Login</Link>
                <Link to="/pricing" style={{ display:'block', textAlign:'center', padding:'13px', borderRadius:10, background:'var(--gold)', color:'var(--navy)', fontWeight:700, textDecoration:'none', fontSize:'1rem' }}>Book Free Demo →</Link>
              </>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @media(max-width:900px){ .nd{display:none!important} .nm{display:flex!important} }
      `}</style>
    </>
  );
}
