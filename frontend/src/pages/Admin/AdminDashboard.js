import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import api from '../../utils/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Admin Dashboard | Teachs';
    api.get('/admin/stats').then(r => setStats(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const quickLinks = [
    { to: '/admin/leads', label: 'Manage Leads', icon: '◎', desc: 'View & follow up on demos', color: 'rgba(59,114,245,0.12)', accent: 'var(--sky)' },
    { to: '/admin/users', label: 'Manage Users', icon: '◉', desc: 'Approve & manage accounts', color: 'rgba(11,122,94,0.12)', accent: 'var(--emerald2)' },
    { to: '/admin/assign', label: 'Assign Teachers', icon: '⇆', desc: 'Pair teachers with students', color: 'rgba(200,130,10,0.12)', accent: 'var(--amber2)' },
    { to: '/admin/tests', label: 'Manage Tests', icon: '◧', desc: 'Create & publish tests', color: 'rgba(26,58,143,0.12)', accent: 'var(--sapphire2)' },
    { to: '/admin/pricing', label: 'Edit Pricing', icon: '◇', desc: 'Update plans & prices', color: 'rgba(59,114,245,0.12)', accent: 'var(--sky)' },
    { to: '/admin/settings', label: 'Site Settings', icon: '⚙', desc: 'Contact, social, WhatsApp', color: 'rgba(11,122,94,0.12)', accent: 'var(--emerald2)' },
    { to: '/admin/workshop', label: 'Workshop', icon: '◐', desc: 'Manage sessions', color: 'rgba(200,130,10,0.12)', accent: 'var(--amber2)' },
    { to: '/admin/women', label: "Women's", icon: '◑', desc: 'Review applicants', color: 'rgba(26,58,143,0.12)', accent: 'var(--sapphire2)' },
  ];

  return (
    <AdminLayout title="Admin Dashboard" subtitle="Welcome back — here's what's happening today.">
      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200 }}>
          <div className="spinner" style={{ width: 44, height: 44 }} />
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          {stats && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 14, marginBottom: 32 }}>
              {[
                { label: 'Students', value: stats.students, icon: '👨‍🎓', link: '/admin/users', color: 'rgba(59,114,245,0.10)', accent: 'var(--sky)' },
                { label: 'Teachers', value: stats.teachers, icon: '👨‍🏫', link: '/admin/users', color: 'rgba(11,122,94,0.10)', accent: 'var(--emerald2)' },
                { label: 'New Leads', value: stats.new_leads, icon: '🎯', link: '/admin/leads', color: 'rgba(200,130,10,0.10)', accent: 'var(--amber2)' },
                { label: 'Revenue', value: `₹${Number(stats.total_revenue||0).toLocaleString('en-IN')}`, icon: '💰', link: '/admin/payments', color: 'rgba(26,58,143,0.10)', accent: 'var(--sapphire2)' },
                { label: 'Pending', value: stats.pending_approvals, icon: '⏳', link: '/admin/users', color: 'rgba(192,57,43,0.10)', accent: '#C0392B' },
              ].map(s => (
                <Link key={s.label} to={s.link} style={{ textDecoration: 'none' }}>
                  <div style={{
                    background: s.color, border: `1px solid ${s.accent}28`,
                    borderRadius: 16, padding: '18px 16px', display: 'flex', alignItems: 'center',
                    gap: 14, transition: 'all 0.2s', cursor: 'pointer',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = s.accent + '55'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.borderColor = s.accent + '28'; }}>
                    <div style={{ fontSize: '1.5rem' }}>{s.icon}</div>
                    <div>
                      <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white', lineHeight: 1, fontFamily: 'var(--font-body)' }}>{s.value}</div>
                      <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.45)', marginTop: 3, fontWeight: 500 }}>{s.label}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Quick Actions */}
          <div style={{ marginBottom: 6 }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'rgba(255,255,255,0.30)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 14 }}>Quick Actions</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 12 }}>
              {quickLinks.map(l => (
                <Link key={l.to} to={l.to} style={{ textDecoration: 'none' }}>
                  <div style={{
                    background: l.color, border: `1px solid ${l.accent}22`,
                    borderRadius: 14, padding: '18px 16px', transition: 'all 0.25s',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.borderColor = l.accent + '55'; e.currentTarget.style.background = l.color.replace('0.12)', '0.20)').replace('0.10)', '0.18)'); }}
                    onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.borderColor = l.accent + '22'; e.currentTarget.style.background = l.color; }}>
                    <div style={{ fontSize: '1.4rem', marginBottom: 10, color: l.accent }}>{l.icon}</div>
                    <div style={{ fontWeight: 700, fontSize: '0.84rem', color: 'white', marginBottom: 4 }}>{l.label}</div>
                    <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.38)' }}>{l.desc}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Pending Banner */}
          {stats?.pending_approvals > 0 && (
            <div style={{ background: 'rgba(200,130,10,0.08)', border: '1px solid rgba(200,130,10,0.25)', borderRadius: 14, padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginTop: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(200,130,10,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>⏳</div>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--amber2)', fontSize: '0.88rem' }}>{stats.pending_approvals} account{stats.pending_approvals > 1 ? 's' : ''} pending approval</div>
                  <div style={{ fontSize: '0.76rem', color: 'rgba(255,255,255,0.40)', marginTop: 2 }}>Students can't login until approved.</div>
                </div>
              </div>
              <Link to="/admin/users" style={{ background: 'linear-gradient(135deg, var(--amber) 0%, var(--amber2) 100%)', color: 'var(--ink)', fontWeight: 700, padding: '9px 18px', borderRadius: 9, fontSize: '0.83rem', whiteSpace: 'nowrap', boxShadow: '0 4px 14px rgba(200,130,10,0.30)' }}>Review Now →</Link>
            </div>
          )}
        </>
      )}
    </AdminLayout>
  );
}
