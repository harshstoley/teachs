import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminSidebar from '../../components/AdminSidebar';
import api from '../../utils/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Admin Dashboard | Teachs';
    api.get('/admin/stats').then(r => setStats(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const statCards = stats ? [
    { label: 'Total Students', value: stats.students, icon: '👨‍🎓', color: '#dbeafe', link: '/admin/users?role=student' },
    { label: 'Total Teachers', value: stats.teachers, icon: '👨‍🏫', color: '#d1fae5', link: '/admin/users?role=teacher' },
    { label: 'New Leads', value: stats.new_leads, icon: '🎯', color: '#fef3c7', link: '/admin/leads' },
    { label: 'Total Revenue', value: `₹${Number(stats.total_revenue || 0).toLocaleString('en-IN')}`, icon: '💰', color: '#ede9fe', link: '/admin/payments' },
    { label: 'Pending Approvals', value: stats.pending_approvals, icon: '⏳', color: '#fee2e2', link: '/admin/users' },
  ] : [];

  const quickLinks = [
    { to: '/admin/leads', label: 'Manage Leads', icon: '🎯', desc: 'View & follow up on demo requests' },
    { to: '/admin/users', label: 'Manage Users', icon: '👥', desc: 'Approve, assign & manage accounts' },
    { to: '/admin/assign', label: 'Assign Teachers', icon: '🔗', desc: 'Pair teachers with students' },
    { to: '/admin/tests', label: 'Manage Tests', icon: '📝', desc: 'Create & publish practice tests' },
    { to: '/admin/pricing', label: 'Edit Pricing', icon: '💰', desc: 'Update plans, prices, features' },
    { to: '/admin/settings', label: 'Site Settings', icon: '⚙️', desc: 'Contact, social, WhatsApp links' },
    { to: '/admin/workshop', label: 'Workshop Sessions', icon: '🎓', desc: 'Schedule & manage sessions' },
    { to: '/admin/women', label: "Women's Applications", icon: '👩', desc: 'Review & respond to applicants' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <AdminSidebar />
      <main style={{ flex: 1, padding: '32px', background: 'var(--ice)', overflowY: 'auto' }}>
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ color: 'var(--ink)', marginBottom: 4 }}>Admin Dashboard</h2>
          <p style={{ color: 'var(--ink-lighter)' }}>Welcome back. Here's what's happening at Teachs today.</p>
        </div>

        {loading ? <div className="spinner" style={{ margin: '60px auto' }} /> : (
          <>
            {/* Stats */}
            <div className="grid-4" style={{ marginBottom: 32, gridTemplateColumns: 'repeat(5, 1fr)' }}>
              {statCards.map(s => (
                <Link key={s.label} to={s.link} style={{ textDecoration: 'none' }}>
                  <div className="stat-card" style={{ cursor: 'pointer', transition: 'all 0.2s' }}>
                    <div className="stat-icon" style={{ background: s.color, fontSize: '1.5rem' }}>{s.icon}</div>
                    <div><div className="stat-value">{s.value}</div><div className="stat-label">{s.label}</div></div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Quick Links */}
            <div style={{ marginBottom: 32 }}>
              <h3 style={{ marginBottom: 20, color: 'var(--ink)' }}>Quick Actions</h3>
              <div className="grid-4">
                {quickLinks.map(l => (
                  <Link key={l.to} to={l.to} style={{ textDecoration: 'none' }}>
                    <div style={{ background: 'white', borderRadius: 12, padding: '20px', border: '1px solid var(--border)', transition: 'all 0.2s', cursor: 'pointer' }}
                      onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--shadow-md)'}
                      onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}>
                      <div style={{ fontSize: '1.8rem', marginBottom: 10 }}>{l.icon}</div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--ink)', marginBottom: 4 }}>{l.label}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--ink-lighter)' }}>{l.desc}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Pending Approvals Banner */}
            {stats?.pending_approvals > 0 && (
              <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 12, padding: '18px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: '1.5rem' }}>⏳</span>
                  <div>
                    <div style={{ fontWeight: 700, color: '#92400e' }}>{stats.pending_approvals} student account{stats.pending_approvals > 1 ? 's' : ''} pending approval</div>
                    <div style={{ fontSize: '0.85rem', color: '#b45309' }}>Students cannot login until their accounts are approved.</div>
                  </div>
                </div>
                <Link to="/admin/users" className="btn btn-amber btn-sm">Review Now →</Link>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
