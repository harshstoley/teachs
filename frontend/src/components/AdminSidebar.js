import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: '◈', exact: true },
  { to: '/admin/leads', label: 'Leads & Demos', icon: '◎' },
  { to: '/admin/users', label: 'Users', icon: '◉' },
  { to: '/admin/assign', label: 'Assign Teachers', icon: '⇆' },
  { to: '/admin/schedule', label: 'Schedule', icon: '▦' },
  { to: '/admin/tests', label: 'Practice Tests', icon: '◧' },
  { to: '/admin/pricing', label: 'Pricing Plans', icon: '◈' },
  { to: '/admin/payments', label: 'Payments', icon: '◇' },
  { to: '/admin/testimonials', label: 'Testimonials', icon: '★' },
  { to: '/admin/workshop', label: 'Workshop', icon: '◐' },
  { to: '/admin/women', label: "Women's Program", icon: '◑' },
  { to: '/admin/announcements', label: 'Announcements', icon: '◈' },
  { to: '/admin/settings', label: 'Site Settings', icon: '⚙' },
];

const GROUPS = [
  { label: 'Overview', items: ['Dashboard'] },
  { label: 'Students', items: ['Leads & Demos','Users','Assign Teachers'] },
  { label: 'Academics', items: ['Schedule','Practice Tests'] },
  { label: 'Business', items: ['Pricing Plans','Payments','Testimonials'] },
  { label: 'Programs', items: ['Workshop',"Women's Program",'Announcements'] },
  { label: 'System', items: ['Site Settings'] },
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
  useEffect(() => { setOpen(false); }, [location]);

  const isActive = (item) => item.exact
    ? location.pathname === item.to
    : location.pathname.startsWith(item.to);

  const SidebarContent = () => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto' }}>
      {/* Logo */}
      <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid rgba(59,114,245,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700, color: 'white', letterSpacing: '-0.5px' }}>
            Teach<span style={{ color: 'var(--amber2)' }}>s</span>
          </div>
          <div style={{ fontSize: '0.60rem', color: 'rgba(255,255,255,0.30)', letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 2 }}>Admin Console</div>
        </div>
        {isMobile && (
          <button onClick={() => setOpen(false)} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, width: 32, height: 32, color: 'white', fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
        )}
      </div>

      {/* User pill */}
      <div style={{ margin: '12px 14px', padding: '12px 14px', background: 'rgba(59,114,245,0.10)', borderRadius: 12, border: '1px solid rgba(59,114,245,0.20)' }}>
        <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.35)', marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Logged in as</div>
        <div style={{ color: 'white', fontWeight: 600, fontSize: '0.88rem', marginBottom: 5 }}>{user?.name}</div>
        <span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: 100, background: 'rgba(224,156,26,0.15)', color: 'var(--amber2)', fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', border: '1px solid rgba(224,156,26,0.25)' }}>ADMIN</span>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '6px 0', overflowY: 'auto' }}>
        {GROUPS.map(group => {
          const groupItems = NAV.filter(n => group.items.includes(n.label));
          if (!groupItems.length) return null;
          return (
            <div key={group.label}>
              <div style={{ padding: '10px 20px 4px', fontSize: '0.60rem', fontWeight: 700, color: 'rgba(255,255,255,0.22)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>{group.label}</div>
              {groupItems.map(item => (
                <Link key={item.to} to={item.to} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '9px 16px 9px 20px',
                  color: isActive(item) ? 'white' : 'rgba(255,255,255,0.50)',
                  background: isActive(item) ? 'rgba(59,114,245,0.18)' : 'transparent',
                  borderLeft: `3px solid ${isActive(item) ? 'var(--sky)' : 'transparent'}`,
                  fontSize: '0.85rem', fontWeight: isActive(item) ? 600 : 400,
                  textDecoration: 'none', transition: 'all 0.15s', margin: '1px 0',
                  borderRadius: '0 10px 10px 0', marginRight: 8,
                }}>
                  <span style={{ fontSize: '1rem', opacity: isActive(item) ? 1 : 0.6, color: isActive(item) ? 'var(--sky)' : 'inherit' }}>{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </div>
          );
        })}
      </nav>

      {/* Logout */}
      <div style={{ borderTop: '1px solid rgba(59,114,245,0.12)', padding: '10px 14px 14px', flexShrink: 0 }}>
        <button onClick={logout} style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 10,
          padding: '10px 14px', background: 'rgba(192,57,43,0.10)', border: '1px solid rgba(192,57,43,0.20)',
          borderRadius: 10, color: 'rgba(255,100,80,0.85)', fontSize: '0.85rem', fontWeight: 600,
          cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'all 0.2s',
        }}>
          <span>⎋</span> Logout
        </button>
      </div>
    </div>
  );

  const sidebarStyle = {
    width: 'var(--sidebar-w, 256px)', background: 'var(--ink)',
    borderRight: '1px solid rgba(59,114,245,0.12)',
    height: '100vh', position: 'sticky', top: 0, flexShrink: 0,
    display: 'flex', flexDirection: 'column',
    boxShadow: '4px 0 24px rgba(0,0,0,0.20)',
  };

  if (isMobile) {
    return (
      <>
        {/* Mobile top bar */}
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200, height: 60, background: 'var(--ink)', borderBottom: '1px solid rgba(59,114,245,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 700, color: 'white' }}>Teach<span style={{ color: 'var(--amber2)' }}>s</span></span>
          <button onClick={() => setOpen(true)} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, padding: '8px', color: 'white', cursor: 'pointer', fontSize: '1rem' }}>☰</button>
        </div>
        {open && (
          <>
            <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(0,0,0,0.60)', backdropFilter: 'blur(4px)' }} />
            <div style={{ ...sidebarStyle, position: 'fixed', left: 0, top: 0, zIndex: 400, animation: 'slideInLeft 0.25s ease' }}>
              <SidebarContent />
            </div>
          </>
        )}
        <style>{`@keyframes slideInLeft{from{transform:translateX(-100%)}to{transform:translateX(0)}}`}</style>
      </>
    );
  }

  return <aside style={sidebarStyle}><SidebarContent /></aside>;
}
