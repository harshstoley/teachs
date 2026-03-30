import React, { useState } from 'react';
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
  { to: '/admin/women', label: "Women's Program", icon: '👩' },
  { to: '/admin/announcements', label: 'Announcements', icon: '📢' },
  { to: '/admin/settings', label: 'Site Settings', icon: '⚙️' },
];

export default function AdminSidebar() {
  const { logout, user } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (item) => item.exact ? location.pathname === item.to : location.pathname.startsWith(item.to);

  return (
    <aside style={{
      width: collapsed ? 64 : 240, minHeight: '100vh', background: 'var(--ink)',
      display: 'flex', flexDirection: 'column', transition: 'width 0.3s ease',
      position: 'sticky', top: 0, flexShrink: 0,
    }}>
      {/* Header */}
      <div style={{ padding: '20px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: 10 }}>
        {!collapsed && (
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 700, color: 'white' }}>
            Teach<span style={{ color: 'var(--teal)' }}>s</span>
          </span>
        )}
        <button onClick={() => setCollapsed(!collapsed)} style={{
          marginLeft: 'auto', background: 'rgba(255,255,255,0.1)', border: 'none',
          borderRadius: 6, padding: '6px 8px', cursor: 'pointer', color: 'white', fontSize: '0.8rem',
        }}>
          {collapsed ? '→' : '←'}
        </button>
      </div>

      {/* User Info */}
      {!collapsed && (
        <div style={{ padding: '14px 16px', background: 'rgba(0,153,178,0.1)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginBottom: 2 }}>Logged in as</div>
          <div style={{ color: 'white', fontWeight: 600, fontSize: '0.9rem' }}>{user?.name}</div>
          <span className="badge badge-teal" style={{ marginTop: 4, fontSize: '0.68rem' }}>Admin</span>
        </div>
      )}

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '12px 0', overflowY: 'auto' }}>
        {NAV.map(item => (
          <Link key={item.to} to={item.to} title={item.label} style={{
            display: 'flex', alignItems: 'center', gap: 12, padding: collapsed ? '12px' : '11px 16px',
            justifyContent: collapsed ? 'center' : 'flex-start',
            color: isActive(item) ? 'white' : 'rgba(255,255,255,0.55)',
            background: isActive(item) ? 'rgba(0,153,178,0.2)' : 'transparent',
            borderLeft: isActive(item) ? '3px solid var(--teal)' : '3px solid transparent',
            fontSize: '0.875rem', fontWeight: isActive(item) ? 600 : 400,
            transition: 'all 0.15s', textDecoration: 'none',
          }}>
            <span style={{ fontSize: '1.05rem', flexShrink: 0 }}>{item.icon}</span>
            {!collapsed && item.label}
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div style={{ padding: '12px 0', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <button onClick={logout} style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: collapsed ? '12px' : '11px 16px',
          justifyContent: collapsed ? 'center' : 'flex-start',
          background: 'none', border: 'none', color: 'rgba(255,255,255,0.55)', cursor: 'pointer',
          fontSize: '0.875rem', transition: 'color 0.15s',
        }}>
          <span>🚪</span>
          {!collapsed && 'Logout'}
        </button>
      </div>
    </aside>
  );
}
