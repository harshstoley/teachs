import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: '📊', exact: true },
  { to: '/admin/leads', label: 'Leads & Demos', icon: '🎯' },
  { to: '/admin/users', label: 'Users', icon: '👥' },
  { to: '/admin/assign', label: 'Assign Teachers', icon: '🔗' },
  { to: '/admin/schedule', label: 'Schedule', icon: '📅' },
  { to: '/admin/tests', label: 'Practice Tests', icon: '📝' },
  { to: '/admin/pricing', label: 'Pricing Plans', icon: '💰' },
  { to: '/admin/payments', label: 'Payments', icon: '💳' },
  { to: '/admin/testimonials', label: 'Testimonials', icon: '⭐' },
  { to: '/admin/workshop', label: 'Workshop', icon: '🎓' },
    { to: '/admin/blog', label: 'Blog Posts', icon: '✍️' },
    { to: '/admin/materials', label: 'Materials', icon: '📚' },
  { to: '/admin/women', label: "Women's Program", icon: '👩' },
  { to: '/admin/announcements', label: 'Announcements', icon: '📢' },
  { to: '/admin/settings', label: 'Site Settings', icon: '⚙️' },
];

export default function AdminSidebar() {
  const { logout, user } = useAuth();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Close on route change
  useEffect(() => { setOpen(false); }, [location]);

  const isActive = (item) => item.exact
    ? location.pathname === item.to
    : location.pathname.startsWith(item.to);

  const navList = (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Logo */}
      <div style={{ padding: '16px', borderBottom: '1px solid rgba(212,168,83,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 700, color: '#fff' }}>
          Teach<span style={{ color: 'var(--gold)' }}>s</span>
        </span>
        {isMobile && (
          <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
        )}
      </div>

      {/* User info */}
      <div style={{ padding: '12px 16px', background: 'rgba(212,168,83,0.08)', borderBottom: '1px solid rgba(212,168,83,0.1)' }}>
        <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', marginBottom: 2 }}>Logged in as</div>
        <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.875rem' }}>{user?.name}</div>
        <div style={{ display: 'inline-block', marginTop: 4, padding: '2px 10px', borderRadius: 100, background: 'rgba(212,168,83,0.15)', color: 'var(--gold)', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.05em' }}>ADMIN</div>
      </div>

      {/* Nav links */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
        {NAV.map(item => (
          <Link key={item.to} to={item.to} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 16px',
            color: isActive(item) ? '#fff' : 'rgba(255,255,255,0.55)',
            background: isActive(item) ? 'rgba(212,168,83,0.15)' : 'transparent',
            borderLeft: `3px solid ${isActive(item) ? 'var(--gold)' : 'transparent'}`,
            fontSize: '0.875rem', fontWeight: isActive(item) ? 600 : 400,
            textDecoration: 'none', transition: 'all 0.15s',
          }}>
            <span style={{ fontSize: '1rem' }}>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div style={{ borderTop: '1px solid rgba(212,168,83,0.1)', padding: '8px 0' }}>
        <button onClick={logout} style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 10,
          padding: '10px 16px', background: 'none', border: 'none',
          color: 'rgba(255,255,255,0.5)', cursor: 'pointer',
          fontSize: '0.875rem', fontFamily: 'var(--font-body)',
        }}>
          <span>🚪</span> Logout
        </button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <>
        {/* Mobile top bar */}
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, height: 52,
          background: '#0C1628', zIndex: 500,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 16px', borderBottom: '1px solid rgba(212,168,83,0.2)',
        }}>
          <button onClick={() => setOpen(true)} style={{
            background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: 8, padding: '6px 12px', color: '#fff',
            fontSize: '1rem', cursor: 'pointer',
          }}>☰</button>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700, color: '#fff' }}>
            Teach<span style={{ color: 'var(--gold)' }}>s</span>
            <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', marginLeft: 6, fontFamily: 'var(--font-body)', fontWeight: 400 }}>Admin</span>
          </span>
          <button onClick={logout} style={{
            background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: 8, padding: '6px 10px', color: '#fff',
            fontSize: '0.78rem', cursor: 'pointer', fontFamily: 'var(--font-body)',
          }}>Logout</button>
        </div>

        {/* Backdrop */}
        {open && (
          <div onClick={() => setOpen(false)} style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', zIndex: 600,
          }} />
        )}

        {/* Drawer */}
        <div style={{
          position: 'fixed', top: 0, left: open ? 0 : '-260px',
          width: 240, height: '100vh', background: '#0C1628',
          zIndex: 700, transition: 'left 0.3s ease', overflowY: 'auto',
        }}>
          {navList}
        </div>
      </>
    );
  }

  // Desktop sidebar
  return (
    <aside style={{
      width: 220, minHeight: '100vh', background: '#0C1628',
      flexShrink: 0, position: 'sticky', top: 0, height: '100vh', overflowY: 'auto',
    }}>
      {navList}
    </aside>
  );
}
