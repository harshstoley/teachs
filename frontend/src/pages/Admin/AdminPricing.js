import React, { useState, useEffect, useCallback } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import api from '../../utils/api';

// ─────────────────────────────────────────
// ADMIN PRICING
// ─────────────────────────────────────────
export function AdminPricing() {
  const [plans, setPlans] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', plan_type: 'individual', class_range: '', label: '', regular_price: '', discounted_price: '', features: '', is_recommended: false, is_active: true, sort_order: 99 });
  const [msg, setMsg] = useState('');
  const showMsg = m => { setMsg(m); setTimeout(() => setMsg(''), 3000); };

  const load = () => api.get('/pricing/all').then(r => setPlans(r.data)).catch(() => {});
  useEffect(() => { document.title = 'Pricing | Admin'; load(); }, []);

  const startEdit = (p) => {
    const features = typeof p.features === 'string' ? JSON.parse(p.features) : p.features || [];
    setEditing(p.id);
    setForm({ ...p, features: features.join('\n'), is_recommended: !!p.is_recommended, is_active: !!p.is_active });
  };
  const resetForm = () => { setEditing(null); setForm({ title: '', plan_type: 'individual', class_range: '', label: '', regular_price: '', discounted_price: '', features: '', is_recommended: false, is_active: true, sort_order: 99 }); };

  const save = async e => {
    e.preventDefault();
    const payload = { ...form, features: form.features.split('\n').filter(f => f.trim()), is_recommended: form.is_recommended ? 1 : 0 };
    try {
      if (editing) { await api.put(`/pricing/${editing}`, payload); showMsg('Plan updated!'); }
      else { await api.post('/pricing', payload); showMsg('Plan created!'); }
      resetForm(); load();
    } catch (err) { showMsg('Failed: ' + (err.response?.data?.error || 'error')); }
  };

  const del = async (id) => {
    if (!window.confirm('Delete this plan?')) return;
    await api.delete(`/pricing/${id}`); load(); showMsg('Deleted.');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <AdminSidebar />
      <main style={{ flex: 1, padding: 32, background: 'var(--ice)', overflowY: 'auto' }}>
        <h2 style={{ marginBottom: 24 }}>Manage Pricing Plans</h2>
        {msg && <div className="alert alert-success">{msg}</div>}

        <div className="card-flat" style={{ padding: 28, marginBottom: 28 }}>
          <h3 style={{ marginBottom: 20 }}>{editing ? 'Edit Plan' : 'Add New Plan'}</h3>
          <form onSubmit={save} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            <div className="form-group" style={{ margin: 0, gridColumn: '1/-1' }}><label className="form-label">Title *</label><input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="form-input" required /></div>
            <div className="form-group" style={{ margin: 0 }}><label className="form-label">Type</label><select value={form.plan_type} onChange={e => setForm({ ...form, plan_type: e.target.value })} className="form-input"><option value="demo">Demo</option><option value="individual">Individual</option><option value="group">Group</option><option value="music">Music</option><option value="board">Board (11-12)</option></select></div>
            <div className="form-group" style={{ margin: 0 }}><label className="form-label">Class Range</label><input value={form.class_range} onChange={e => setForm({ ...form, class_range: e.target.value })} className="form-input" placeholder="e.g. Class 6–8" /></div>
            <div className="form-group" style={{ margin: 0 }}><label className="form-label">Label/Badge</label><input value={form.label} onChange={e => setForm({ ...form, label: e.target.value })} className="form-input" placeholder="e.g. Most Popular" /></div>
            <div className="form-group" style={{ margin: 0 }}><label className="form-label">Regular Price (₹)</label><input type="number" value={form.regular_price} onChange={e => setForm({ ...form, regular_price: e.target.value })} className="form-input" /></div>
            <div className="form-group" style={{ margin: 0 }}><label className="form-label">Discounted Price (₹)</label><input type="number" value={form.discounted_price} onChange={e => setForm({ ...form, discounted_price: e.target.value })} className="form-input" /></div>
            <div className="form-group" style={{ margin: 0 }}><label className="form-label">Sort Order</label><input type="number" value={form.sort_order} onChange={e => setForm({ ...form, sort_order: e.target.value })} className="form-input" /></div>
            <div className="form-group" style={{ margin: 0, gridColumn: '1/-1' }}><label className="form-label">Features (one per line)</label><textarea value={form.features} onChange={e => setForm({ ...form, features: e.target.value })} className="form-input" rows={5} placeholder="2 Subjects&#10;Weekly Tests&#10;Progress Reports" /></div>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              <label style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: '0.9rem', cursor: 'pointer' }}><input type="checkbox" checked={form.is_recommended} onChange={e => setForm({ ...form, is_recommended: e.target.checked })} /> Recommended</label>
              <label style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: '0.9rem', cursor: 'pointer' }}><input type="checkbox" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} /> Active</label>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button type="submit" className="btn btn-primary">{editing ? 'Update Plan' : 'Create Plan'}</button>
              {editing && <button type="button" onClick={resetForm} className="btn btn-ghost">Cancel</button>}
            </div>
          </form>
        </div>

        <div className="table-wrap">
          <table>
            <thead><tr><th>Title</th><th>Type</th><th>Class</th><th>Regular</th><th>Discounted</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {plans.map(p => (
                <tr key={p.id}>
                  <td><strong>{p.title}</strong>{p.is_recommended ? <span className="badge badge-amber" style={{ marginLeft: 8, fontSize: '0.65rem' }}>★ Pick</span> : null}</td>
                  <td><span className="badge badge-navy">{p.plan_type}</span></td>
                  <td>{p.class_range}</td>
                  <td>{p.regular_price > 0 ? `₹${Number(p.regular_price).toLocaleString('en-IN')}` : 'Free'}</td>
                  <td style={{ fontWeight: 700, color: 'var(--teal)' }}>{p.discounted_price > 0 ? `₹${Number(p.discounted_price).toLocaleString('en-IN')}` : '—'}</td>
                  <td><span className={`badge ${p.is_active ? 'badge-success' : 'badge-error'}`}>{p.is_active ? 'Active' : 'Hidden'}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => startEdit(p)} className="btn btn-sm btn-outline">Edit</button>
                      <button onClick={() => del(p.id)} className="btn btn-sm" style={{ background: 'rgba(229,62,62,0.1)', color: 'var(--error)', border: '1px solid rgba(229,62,62,0.2)' }}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

// ─────────────────────────────────────────
// ADMIN LEADS
// ─────────────────────────────────────────
export function AdminLeads() {
  const [leads, setLeads] = useState([]);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState('');
  const [msg, setMsg] = useState('');
  const showMsg = m => { setMsg(m); setTimeout(() => setMsg(''), 3000); };

  const load = useCallback(() => {
    api.get(`/leads?status=${status}&limit=100`).then(r => { setLeads(r.data.leads); setTotal(r.data.total); }).catch(() => {});
  }, [status]);
  useEffect(() => { document.title = 'Leads | Admin'; load(); }, [load]);

  const update = async (id, newStatus) => {
    await api.put(`/leads/${id}`, { status: newStatus }); showMsg('Updated!'); load();
  };
  const del = async (id) => {
    if (!window.confirm('Delete this lead?')) return;
    await api.delete(`/leads/${id}`); load(); showMsg('Deleted.');
  };

  const statusColor = s => ({ new: 'badge-amber', contacted: 'badge-teal', converted: 'badge-success', closed: 'badge-error' }[s] || 'badge-navy');

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <AdminSidebar />
      <main style={{ flex: 1, padding: 32, background: 'var(--ice)', overflowY: 'auto' }}>
        <h2 style={{ marginBottom: 8 }}>Leads & Demo Requests</h2>
        <p style={{ color: 'var(--ink-lighter)', marginBottom: 24 }}>{total} leads total</p>
        {msg && <div className="alert alert-success">{msg}</div>}

        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          {['', 'new', 'contacted', 'converted', 'closed'].map(s => (
            <button key={s} onClick={() => setStatus(s)} className={`btn btn-sm ${status === s ? 'btn-primary' : 'btn-ghost'}`}>{s || 'All'}</button>
          ))}
        </div>

        <div className="table-wrap">
          <table>
            <thead><tr><th>Name</th><th>Phone</th><th>Class</th><th>Subject</th><th>Source</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
            <tbody>
              {leads.map(l => (
                <tr key={l.id}>
                  <td><strong>{l.name}</strong><div style={{ fontSize: '0.75rem', color: 'var(--ink-lighter)' }}>{l.email}</div></td>
                  <td><a href={`tel:${l.phone}`} style={{ color: 'var(--teal)' }}>{l.phone}</a></td>
                  <td>{l.student_class || '-'}</td>
                  <td>{l.subject || '-'}</td>
                  <td><span className="badge badge-navy" style={{ fontSize: '0.68rem' }}>{l.source}</span></td>
                  <td><span className={`badge ${statusColor(l.status)}`}>{l.status}</span></td>
                  <td style={{ fontSize: '0.8rem' }}>{new Date(l.created_at).toLocaleDateString('en-IN')}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                      {l.status === 'new' && <button onClick={() => update(l.id, 'contacted')} className="btn btn-sm btn-secondary">Mark Contacted</button>}
                      {l.status === 'contacted' && <button onClick={() => update(l.id, 'converted')} className="btn btn-sm btn-primary">Convert</button>}
                      <a href={`https://wa.me/${l.phone?.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="btn btn-sm" style={{ background: '#25D366', color: 'white' }}>WA</a>
                      <button onClick={() => del(l.id)} className="btn btn-sm" style={{ background: 'rgba(229,62,62,0.1)', color: 'var(--error)', border: '1px solid rgba(229,62,62,0.2)' }}>Del</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

// ─────────────────────────────────────────
// ADMIN PAYMENTS
// ─────────────────────────────────────────
export function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [msg, setMsg] = useState({ text: '', type: '' });
  const showMsg = (text, type = 'success') => { setMsg({ text, type }); setTimeout(() => setMsg({ text: '', type: '' }), 3000); };

  useEffect(() => { document.title = 'Payments | Admin'; api.get('/payments/all').then(r => setPayments(r.data)).catch(() => {}); }, []);

  const refund = async (paymentId) => {
    const reason = prompt('Reason for refund:');
    if (!reason) return;
    try { await api.post('/payments/refund', { payment_id: paymentId, reason }); showMsg('Refund processed!'); } catch (err) { showMsg('Refund failed: ' + (err.response?.data?.error || 'error'), 'error'); }
  };

  const total = payments.filter(p => p.status === 'captured').reduce((s, p) => s + Number(p.amount), 0);

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <AdminSidebar />
      <main style={{ flex: 1, padding: 32, background: 'var(--ice)', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
          <div>
            <h2 style={{ marginBottom: 4 }}>Payments</h2>
            <p style={{ color: 'var(--ink-lighter)' }}>Total revenue: <strong style={{ color: 'var(--success)' }}>₹{total.toLocaleString('en-IN')}</strong></p>
          </div>
        </div>
        {msg.text && <div className={`alert alert-${msg.type}`} style={{ marginBottom: 16 }}>{msg.text}</div>}

        <div className="table-wrap">
          <table>
            <thead><tr><th>User</th><th>Plan</th><th>Amount</th><th>Payment ID</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
            <tbody>
              {payments.map(p => (
                <tr key={p.id}>
                  <td><strong>{p.user_name}</strong><div style={{ fontSize: '0.75rem', color: 'var(--ink-lighter)' }}>{p.email}</div></td>
                  <td>{p.plan_title || '-'}</td>
                  <td style={{ fontWeight: 700 }}>₹{Number(p.amount).toLocaleString('en-IN')}</td>
                  <td style={{ fontSize: '0.78rem', fontFamily: 'monospace' }}>{p.razorpay_payment_id}</td>
                  <td><span className={`badge ${p.status === 'captured' ? 'badge-success' : p.status === 'refunded' ? 'badge-error' : 'badge-amber'}`}>{p.status}</span></td>
                  <td style={{ fontSize: '0.82rem' }}>{new Date(p.created_at).toLocaleDateString('en-IN')}</td>
                  <td>
                    {p.status === 'captured' && <button onClick={() => refund(p.razorpay_payment_id)} className="btn btn-sm" style={{ background: 'rgba(229,62,62,0.1)', color: 'var(--error)', border: '1px solid rgba(229,62,62,0.2)' }}>Refund</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

// ─────────────────────────────────────────
// ADMIN SETTINGS
// ─────────────────────────────────────────
export function AdminSettings() {
  const [settings, setSettings] = useState({});
  const [msg, setMsg] = useState({ text: '', type: '' });
  const showMsg = (text, type = 'success') => { setMsg({ text, type }); setTimeout(() => setMsg({ text: '', type: '' }), 3000); };

  useEffect(() => {
    document.title = 'Settings | Admin';
    api.get('/settings/all').then(r => {
      const s = {}; r.data.forEach(row => { s[row.setting_key] = row.setting_value; }); setSettings(s);
    }).catch(() => {});
  }, []);

  const save = async e => {
    e.preventDefault();
    try { await api.put('/settings', settings); showMsg('Settings saved!'); } catch { showMsg('Failed.', 'error'); }
  };

  const fields = [
    { key: 'site_name', label: 'Site Name' },
    { key: 'tagline', label: 'Tagline' },
    { key: 'phone', label: 'Phone Number' },
    { key: 'email', label: 'Support Email' },
    { key: 'whatsapp', label: 'WhatsApp Number (with country code, no +)' },
    { key: 'address', label: 'Address' },
    { key: 'instagram', label: 'Instagram URL' },
    { key: 'twitter', label: 'Twitter/X URL' },
    { key: 'facebook', label: 'Facebook URL' },
    { key: 'youtube', label: 'YouTube URL' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <AdminSidebar />
      <main style={{ flex: 1, padding: 32, background: 'var(--ice)', overflowY: 'auto' }}>
        <h2 style={{ marginBottom: 24 }}>Site Settings</h2>
        {msg.text && <div className={`alert alert-${msg.type}`} style={{ marginBottom: 16 }}>{msg.text}</div>}
        <div className="card-flat" style={{ padding: 32, maxWidth: 700 }}>
          <form onSubmit={save}>
            {fields.map(f => (
              <div key={f.key} className="form-group">
                <label className="form-label">{f.label}</label>
                <input value={settings[f.key] || ''} onChange={e => setSettings({ ...settings, [f.key]: e.target.value })} className="form-input" />
              </div>
            ))}
            <button type="submit" className="btn btn-primary">Save Settings</button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default AdminPricing;
