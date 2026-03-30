import React, { useState, useEffect, useCallback } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import api from '../../utils/api';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState('');
  const [search, setSearch] = useState('');
  const [msg, setMsg] = useState({ text: '', type: '' });
  const [showCreate, setShowCreate] = useState(false);
  const [teacherForm, setTeacherForm] = useState({ name: '', email: '', password: '', phone: '', subjects: '', qualification: '', bio: '' });

  const showMsg = (text, type = 'success') => { setMsg({ text, type }); setTimeout(() => setMsg({ text: '', type: '' }), 3000); };

  const load = useCallback(() => {
    setLoading(true);
    api.get(`/admin/users?role=${role}&search=${search}&limit=50`)
      .then(r => { setUsers(r.data.users); setTotal(r.data.total); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [role, search]);

  useEffect(() => { document.title = 'Manage Users | Teachs Admin'; load(); }, [load]);

  const approve = async (id) => {
    try { await api.put(`/admin/users/${id}/approve`); showMsg('User approved!'); load(); } catch { showMsg('Failed.', 'error'); }
  };
  const toggleActive = async (id) => {
    try { await api.put(`/admin/users/${id}/toggle-active`); showMsg('Status updated!'); load(); } catch { showMsg('Failed.', 'error'); }
  };
  const deleteUser = async (id, name) => {
    if (!window.confirm(`Delete account for "${name}"? This cannot be undone.`)) return;
    try { await api.delete(`/admin/users/${id}`); showMsg('User deleted.'); load(); } catch { showMsg('Failed.', 'error'); }
  };
  const createTeacher = async e => {
    e.preventDefault();
    try { await api.post('/admin/teachers', teacherForm); showMsg('Teacher created!'); setShowCreate(false); setTeacherForm({ name: '', email: '', password: '', phone: '', subjects: '', qualification: '', bio: '' }); load(); } catch (err) { showMsg(err.response?.data?.error || 'Failed.', 'error'); }
  };

  const roleColor = r => ({ admin: 'badge-navy', teacher: 'badge-teal', student: 'badge-amber' }[r] || 'badge-navy');

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <AdminSidebar />
      <main style={{ flex: 1, padding: '32px', background: 'var(--ice)', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <h2 style={{ color: 'var(--ink)', marginBottom: 4 }}>Manage Users</h2>
            <p style={{ color: 'var(--ink-lighter)' }}>{total} total users</p>
          </div>
          <button onClick={() => setShowCreate(!showCreate)} className="btn btn-primary">+ Add Teacher</button>
        </div>

        {msg.text && <div className={`alert alert-${msg.type}`} style={{ marginBottom: 16 }}>{msg.text}</div>}

        {/* Create Teacher Form */}
        {showCreate && (
          <div className="card-flat" style={{ padding: 28, marginBottom: 24 }}>
            <h3 style={{ marginBottom: 20 }}>Create Teacher Account</h3>
            <form onSubmit={createTeacher} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              <div className="form-group" style={{ margin: 0 }}><label className="form-label">Name *</label><input value={teacherForm.name} onChange={e => setTeacherForm({ ...teacherForm, name: e.target.value })} className="form-input" required /></div>
              <div className="form-group" style={{ margin: 0 }}><label className="form-label">Email *</label><input type="email" value={teacherForm.email} onChange={e => setTeacherForm({ ...teacherForm, email: e.target.value })} className="form-input" required /></div>
              <div className="form-group" style={{ margin: 0 }}><label className="form-label">Password *</label><input type="password" value={teacherForm.password} onChange={e => setTeacherForm({ ...teacherForm, password: e.target.value })} className="form-input" required /></div>
              <div className="form-group" style={{ margin: 0 }}><label className="form-label">Phone</label><input value={teacherForm.phone} onChange={e => setTeacherForm({ ...teacherForm, phone: e.target.value })} className="form-input" /></div>
              <div className="form-group" style={{ margin: 0 }}><label className="form-label">Subjects</label><input value={teacherForm.subjects} onChange={e => setTeacherForm({ ...teacherForm, subjects: e.target.value })} className="form-input" placeholder="Math, Science" /></div>
              <div className="form-group" style={{ margin: 0 }}><label className="form-label">Qualification</label><input value={teacherForm.qualification} onChange={e => setTeacherForm({ ...teacherForm, qualification: e.target.value })} className="form-input" /></div>
              <div style={{ gridColumn: '1/-1', display: 'flex', gap: 12 }}>
                <button type="submit" className="btn btn-primary">Create Teacher</button>
                <button type="button" onClick={() => setShowCreate(false)} className="btn btn-ghost">Cancel</button>
              </div>
            </form>
          </div>
        )}

        {/* Filters */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
          <input value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && load()} placeholder="Search name/email..." className="form-input" style={{ width: 260 }} />
          {['', 'admin', 'teacher', 'student'].map(r => (
            <button key={r} onClick={() => setRole(r)} className={`btn btn-sm ${role === r ? 'btn-primary' : 'btn-ghost'}`}>{r || 'All'}</button>
          ))}
          <button onClick={load} className="btn btn-secondary btn-sm">Search</button>
        </div>

        {loading ? <div className="spinner" style={{ margin: '40px auto' }} /> : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Joined</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td><strong>{u.name}</strong><div style={{ fontSize: '0.75rem', color: 'var(--ink-lighter)' }}>{u.phone}</div></td>
                    <td>{u.email}</td>
                    <td><span className={`badge ${roleColor(u.role)}`}>{u.role}</span></td>
                    <td>
                      {!u.is_approved && u.role === 'student' ? (
                        <span className="badge badge-amber">Pending</span>
                      ) : (
                        <span className={`badge ${u.is_active ? 'badge-success' : 'badge-error'}`}>{u.is_active ? 'Active' : 'Inactive'}</span>
                      )}
                    </td>
                    <td style={{ fontSize: '0.82rem' }}>{new Date(u.created_at).toLocaleDateString('en-IN')}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        {!u.is_approved && <button onClick={() => approve(u.id)} className="btn btn-sm btn-secondary">Approve</button>}
                        <button onClick={() => toggleActive(u.id)} className="btn btn-sm btn-ghost">{u.is_active ? 'Deactivate' : 'Activate'}</button>
                        <button onClick={() => deleteUser(u.id, u.name)} className="btn btn-sm" style={{ background: 'rgba(229,62,62,0.1)', color: 'var(--error)', border: '1px solid rgba(229,62,62,0.2)' }}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
