import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import api from '../../utils/api';

const card = { background: '#152238', border: '1px solid rgba(212,168,83,0.15)', borderRadius: 14 };

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Admin Dashboard | Teachs';
    api.get('/admin/stats').then(r => setStats(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const quickLinks = [
    { to: '/admin/leads',           label: 'Manage Leads',     icon: '🎯', desc: 'View & follow up on demos' },
    { to: '/admin/users',           label: 'Manage Users',     icon: '👥', desc: 'Approve & manage accounts' },
    { to: '/admin/assign',          label: 'Assign Teachers',  icon: '🔗', desc: 'Pair teachers with students' },
    { to: '/admin/tests',           label: 'Manage Tests',     icon: '📝', desc: 'Create & publish tests' },
    { to: '/admin/pricing',         label: 'Edit Pricing',     icon: '💰', desc: 'Update plans & prices' },
    { to: '/admin/settings',        label: 'Site Settings',    icon: '⚙️', desc: 'Contact, social, WhatsApp' },
    { to: '/admin/workshop',        label: 'Workshop',         icon: '🎓', desc: 'Manage sessions' },
    { to: '/admin/women',           label: "Women's",          icon: '👩', desc: 'Review applicants' },
    { to: '/admin/accountability',  label: 'Accountability',   icon: '📊', desc: 'Teacher tracking & alerts' },
  ];

  return (
    <AdminLayout title="Admin Dashboard" subtitle="Welcome back. Here's what's happening today.">
      {loading ? <div className="spinner" style={{ margin: '40px auto', borderTopColor: 'var(--gold)' }} /> : (
        <>
          {/* Stats */}
          {stats && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 12, marginBottom: 28 }}>
              {[
                { label: 'Students', value: stats.students,                                                         icon: '👨‍🎓', link: '/admin/users' },
                { label: 'Teachers', value: stats.teachers,                                                         icon: '👨‍🏫', link: '/admin/users' },
                { label: 'New Leads', value: stats.new_leads,                                                       icon: '🎯',  link: '/admin/leads' },
                { label: 'Revenue',  value: `₹${Number(stats.total_revenue||0).toLocaleString('en-IN')}`,           icon: '💰',  link: '/admin/payments' },
                { label: 'Pending',  value: stats.pending_approvals,                                                icon: '⏳',  link: '/admin/users' },
              ].map(s => (
                <Link key={s.label} to={s.link} style={{ textDecoration: 'none' }}>
                  <div style={{ ...card, padding: '16px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ fontSize: '1.4rem' }}>{s.icon}</div>
                    <div>
                      <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', lineHeight: 1, fontFamily: 'var(--font-body)' }}>{s.value}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--slate)', marginTop: 2 }}>{s.label}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Quick Links */}
          <h3 style={{ color: 'var(--gold)', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>Quick Actions</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 10, marginBottom: 24 }}>
            {quickLinks.map(l => (
              <Link key={l.to} to={l.to} style={{ textDecoration: 'none' }}>
                <div style={{ ...card, padding: '16px 14px' }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>{l.icon}</div>
                  <div style={{ fontWeight: 700, fontSize: '0.82rem', color: '#fff', marginBottom: 3 }}>{l.label}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--slate)' }}>{l.desc}</div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pending banner */}
          {stats?.pending_approvals > 0 && (
            <div style={{ background: 'rgba(212,168,83,0.08)', border: '1px solid rgba(212,168,83,0.3)', borderRadius: 12, padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span>⏳</span>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--gold)', fontSize: '0.875rem' }}>{stats.pending_approvals} account{stats.pending_approvals > 1 ? 's' : ''} pending approval</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--slate)' }}>Students can't login until approved.</div>
                </div>
              </div>
              <Link to="/admin/users" style={{ background: 'var(--gold)', color: '#0C1628', fontWeight: 700, padding: '8px 16px', borderRadius: 8, fontSize: '0.82rem', whiteSpace: 'nowrap' }}>Review →</Link>
            </div>
          )}
        </>
      )}
    </AdminLayout>
  );
}
