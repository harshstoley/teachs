import React, { useState, useEffect, useCallback } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import api from '../../utils/api';

// ─── ADMIN TESTS ───────────────────────────────────────────────────────────────
export function AdminTests() {
  const [tests, setTests] = useState([]);
  const [selected, setSelected] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [msg, setMsg] = useState('');
  const [form, setForm] = useState({ title: '', class_no: '', subject: '', chapter: '', duration_min: 30, total_marks: 20, description: '', is_published: false });
  const [qForm, setQForm] = useState({ question_text: '', option_a: '', option_b: '', option_c: '', option_d: '', correct_answer: 'A', solution: '', marks: 1, difficulty: 'medium', sort_order: 99 });
  const showMsg = m => { setMsg(m); setTimeout(() => setMsg(''), 3000); };

  const loadTests = () => api.get('/tests?is_published=').then(r => setTests(r.data)).catch(() => {});
  const loadQuestions = (tid) => api.get(`/tests/${tid}`).then(r => setQuestions(r.data.questions || [])).catch(() => {});

  useEffect(() => { document.title = 'Tests | Admin'; loadTests(); }, []);

  const createTest = async e => {
    e.preventDefault();
    try { const r = await api.post('/tests', form); showMsg('Test created!'); loadTests(); setSelected(r.data.id); loadQuestions(r.data.id); } catch (err) { showMsg('Failed.'); }
  };
  const togglePublish = async (t) => {
    await api.put(`/tests/${t.id}`, { ...t, is_published: t.is_published ? 0 : 1 }); showMsg('Updated!'); loadTests();
  };
  const delTest = async (id) => {
    if (!window.confirm('Delete this test and all its questions?')) return;
    await api.delete(`/tests/${id}`); loadTests(); setSelected(null); setQuestions([]); showMsg('Deleted.');
  };
  const addQuestion = async e => {
    e.preventDefault();
    try { await api.post(`/tests/${selected}/questions`, qForm); showMsg('Question added!'); loadQuestions(selected); setQForm({ question_text: '', option_a: '', option_b: '', option_c: '', option_d: '', correct_answer: 'A', solution: '', marks: 1, difficulty: 'medium', sort_order: 99 }); } catch { showMsg('Failed.'); }
  };
  const delQuestion = async (qid) => {
    await api.delete(`/tests/questions/${qid}`); loadQuestions(selected);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--navy)' }}>
      <AdminSidebar />
      <main style={{ flex: 1, padding: '64px 16px 24px', background: 'var(--navy2)', minWidth: 0, overflowY: 'auto' }}>
        <h2 style={{ marginBottom: 24, color: 'var(--white)' }}>Manage Practice Tests</h2>
        {msg && <div className="alert alert-success">{msg}</div>}

        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 24 }}>
          {/* Test List */}
          <div>
            <div style={{ background: 'var(--navy2)', borderRadius: 16, padding: 24, border: '1px solid rgba(212,168,83,0.15)', marginBottom: 20 }}>
              <h4 style={{ marginBottom: 16 }}>Create Test</h4>
              <form onSubmit={createTest} style={{ display: 'grid', gap: 10 }}>
                <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="form-input" placeholder="Test title *" required />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <input type="number" min="1" max="12" value={form.class_no} onChange={e => setForm({ ...form, class_no: e.target.value })} className="form-input" placeholder="Class *" required />
                  <input value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} className="form-input" placeholder="Subject *" required />
                </div>
                <input value={form.chapter} onChange={e => setForm({ ...form, chapter: e.target.value })} className="form-input" placeholder="Chapter" />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <input type="number" value={form.duration_min} onChange={e => setForm({ ...form, duration_min: e.target.value })} className="form-input" placeholder="Duration (min)" />
                  <input type="number" value={form.total_marks} onChange={e => setForm({ ...form, total_marks: e.target.value })} className="form-input" placeholder="Total marks" />
                </div>
                <label style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: '0.875rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={form.is_published} onChange={e => setForm({ ...form, is_published: e.target.checked })} /> Publish immediately
                </label>
                <button type="submit" className="btn btn-primary btn-sm">Create Test</button>
              </form>
            </div>

            <div style={{ display: 'grid', gap: 8 }}>
              {tests.map(t => (
                <div key={t.id} style={{ padding: '12px 16px', borderRadius: 10, border: `2px solid ${selected === t.id ? 'var(--teal)' : 'var(--border)'}`, background: 'white', cursor: 'pointer' }} onClick={() => { setSelected(t.id); loadQuestions(t.id); }}>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: 4 }}>{t.title}</div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span className="badge badge-navy" style={{ fontSize: '0.65rem' }}>Cl {t.class_no}</span>
                    <span className="badge badge-teal" style={{ fontSize: '0.65rem' }}>{t.subject}</span>
                    <span className={`badge ${t.is_published ? 'badge-success' : 'badge-amber'}`} style={{ fontSize: '0.65rem' }}>{t.is_published ? '● Live' : '○ Draft'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Questions */}
          {selected ? (
            <div>
              <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
                <button onClick={() => togglePublish(tests.find(t => t.id === selected))} className="btn btn-secondary btn-sm">Toggle Publish</button>
                <button onClick={() => delTest(selected)} className="btn btn-sm" style={{ background: 'rgba(229,62,62,0.1)', color: 'var(--error)', border: '1px solid rgba(229,62,62,0.2)' }}>Delete Test</button>
              </div>

              <div style={{ background: 'var(--navy2)', borderRadius: 16, padding: 24, border: '1px solid rgba(212,168,83,0.15)', marginBottom: 20 }}>
                <h4 style={{ marginBottom: 16 }}>Add Question</h4>
                <form onSubmit={addQuestion} style={{ display: 'grid', gap: 12 }}>
                  <textarea value={qForm.question_text} onChange={e => setQForm({ ...qForm, question_text: e.target.value })} className="form-input" rows={2} placeholder="Question text *" required />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    <input value={qForm.option_a} onChange={e => setQForm({ ...qForm, option_a: e.target.value })} className="form-input" placeholder="Option A" />
                    <input value={qForm.option_b} onChange={e => setQForm({ ...qForm, option_b: e.target.value })} className="form-input" placeholder="Option B" />
                    <input value={qForm.option_c} onChange={e => setQForm({ ...qForm, option_c: e.target.value })} className="form-input" placeholder="Option C" />
                    <input value={qForm.option_d} onChange={e => setQForm({ ...qForm, option_d: e.target.value })} className="form-input" placeholder="Option D" />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                    <div>
                      <label className="form-label">Correct Answer</label>
                      <select value={qForm.correct_answer} onChange={e => setQForm({ ...qForm, correct_answer: e.target.value })} className="form-input">
                        {['A','B','C','D'].map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    </div>
                    <div><label className="form-label">Marks</label><input type="number" value={qForm.marks} onChange={e => setQForm({ ...qForm, marks: e.target.value })} className="form-input" /></div>
                    <div><label className="form-label">Difficulty</label><select value={qForm.difficulty} onChange={e => setQForm({ ...qForm, difficulty: e.target.value })} className="form-input"><option value="easy">Easy</option><option value="medium">Medium</option><option value="hard">Hard</option></select></div>
                  </div>
                  <textarea value={qForm.solution} onChange={e => setQForm({ ...qForm, solution: e.target.value })} className="form-input" rows={2} placeholder="Solution/Explanation (shown after test)" />
                  <button type="submit" className="btn btn-secondary btn-sm">Add Question</button>
                </form>
              </div>

              <h4 style={{ marginBottom: 12 }}>Questions ({questions.length})</h4>
              {questions.map((q, i) => (
                <div key={q.id} style={{ padding: '14px 18px', borderRadius: 10, border: '1px solid var(--border)', background: 'white', marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: 6 }}>Q{i+1}. {q.question_text}</div>
                    <div style={{ display: 'flex', gap: 12, fontSize: '0.78rem', color: 'var(--ink-lighter)' }}>
                      <span>A: {q.option_a}</span><span>B: {q.option_b}</span>
                      <span style={{ color: 'var(--success)', fontWeight: 700 }}>✓ {q.correct_answer}</span>
                      <span className={`badge ${q.difficulty === 'easy' ? 'badge-success' : q.difficulty === 'hard' ? 'badge-error' : 'badge-amber'}`} style={{ fontSize: '0.65rem' }}>{q.difficulty}</span>
                    </div>
                  </div>
                  <button onClick={() => delQuestion(q.id)} style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer', fontSize: '1rem', flexShrink: 0 }}>✕</button>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-lighter)', fontSize: '1.1rem' }}>
              ← Select a test to manage questions
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// ─── ADMIN TESTIMONIALS ─────────────────────────────────────────────────────────
export function AdminTestimonials() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: '', role: 'Parent', content: '', rating: 5, is_active: true, sort_order: 99 });
  const [editing, setEditing] = useState(null);
  const [msg, setMsg] = useState('');
  const showMsg = m => { setMsg(m); setTimeout(() => setMsg(''), 3000); };

  const load = () => api.get('/admin/testimonials').then(r => setItems(r.data)).catch(() => {});
  useEffect(() => { document.title = 'Testimonials | Admin'; load(); }, []);

  const save = async e => {
    e.preventDefault();
    try {
      if (editing) { await api.put(`/admin/testimonials/${editing}`, form); showMsg('Updated!'); }
      else { await api.post('/admin/testimonials', form); showMsg('Created!'); }
      setEditing(null); setForm({ name: '', role: 'Parent', content: '', rating: 5, is_active: true, sort_order: 99 }); load();
    } catch { showMsg('Failed.'); }
  };
  const del = async (id) => { if (!window.confirm('Delete?')) return; await api.delete(`/admin/testimonials/${id}`); load(); };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--navy)' }}>
      <AdminSidebar />
      <main style={{ flex: 1, padding: '64px 16px 24px', background: 'var(--navy2)', minWidth: 0, overflowY: 'auto' }}>
        <h2 style={{ marginBottom: 24, color: 'var(--white)' }}>Manage Testimonials</h2>
        {msg && <div className="alert alert-success">{msg}</div>}
        <div style={{ background: 'var(--navy2)', borderRadius: 16, padding: 24, border: '1px solid rgba(212,168,83,0.15)', marginBottom: 20 }}>
          <h3 style={{ marginBottom: 20 }}>{editing ? 'Edit' : 'Add'} Testimonial</h3>
          <form onSubmit={save} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group" style={{ margin: 0 }}><label className="form-label">Name</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="form-input" required /></div>
            <div className="form-group" style={{ margin: 0 }}><label className="form-label">Role</label><input value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className="form-input" placeholder="e.g. Parent of Class 8 Student" /></div>
            <div className="form-group" style={{ margin: 0, gridColumn: '1/-1' }}><label className="form-label">Review</label><textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} className="form-input" rows={3} required /></div>
            <div className="form-group" style={{ margin: 0 }}><label className="form-label">Rating (1–5)</label><select value={form.rating} onChange={e => setForm({ ...form, rating: e.target.value })} className="form-input">{[5,4,3,2,1].map(r => <option key={r} value={r}>{r}⭐</option>)}</select></div>
            <div className="form-group" style={{ margin: 0 }}><label className="form-label">Sort Order</label><input type="number" value={form.sort_order} onChange={e => setForm({ ...form, sort_order: e.target.value })} className="form-input" /></div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <label style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: '0.9rem', cursor: 'pointer' }}><input type="checkbox" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} /> Active</label>
              <button type="submit" className="btn btn-primary">{editing ? 'Update' : 'Add'}</button>
              {editing && <button type="button" onClick={() => { setEditing(null); setForm({ name: '', role: 'Parent', content: '', rating: 5, is_active: true, sort_order: 99 }); }} className="btn btn-ghost">Cancel</button>}
            </div>
          </form>
        </div>
        <div className="grid-3">
          {items.map(t => (
            <div key={t.id} className="card" style={{ padding: 20 }}>
              <div style={{ display: 'flex', gap: 2, marginBottom: 8 }}>{Array.from({ length: t.rating }).map((_, i) => <span key={i} style={{ color: 'var(--amber)' }}>★</span>)}</div>
              <p style={{ fontSize: '0.875rem', marginBottom: 12, fontStyle: 'italic' }}>{t.content?.slice(0, 100)}...</p>
              <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{t.name}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--teal)' }}>{t.role}</div>
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <button onClick={() => { setEditing(t.id); const f = typeof t.features === 'string' ? JSON.parse(t.features || '[]') : (t.features || []); setForm({ ...t, is_active: !!t.is_active }); }} className="btn btn-sm btn-outline">Edit</button>
                <button onClick={() => del(t.id)} className="btn btn-sm" style={{ background: 'rgba(229,62,62,0.1)', color: 'var(--error)', border: '1px solid rgba(229,62,62,0.2)' }}>Del</button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

// ─── ADMIN WORKSHOP ────────────────────────────────────────────────────────────
export function AdminWorkshop() {
  const [sessions, setSessions] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', session_date: '', duration: 60, google_form_url: '', seats: 30, is_active: true });
  const [msg, setMsg] = useState('');
  const showMsg = m => { setMsg(m); setTimeout(() => setMsg(''), 3000); };

  const load = () => api.get('/workshop/sessions').then(r => setSessions(r.data)).catch(() => {});
  useEffect(() => { document.title = 'Workshop | Admin'; load(); }, []);

  const save = async e => {
    e.preventDefault();
    try { await api.post('/workshop/sessions', { ...form, is_active: form.is_active ? 1 : 0 }); showMsg('Session created!'); load(); setForm({ title: '', description: '', session_date: '', duration: 60, google_form_url: '', seats: 30, is_active: true }); } catch { showMsg('Failed.'); }
  };
  const del = async (id) => { if (!window.confirm('Delete?')) return; await api.delete(`/workshop/sessions/${id}`); load(); };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--navy)' }}>
      <AdminSidebar />
      <main style={{ flex: 1, padding: '64px 16px 24px', background: 'var(--navy2)', minWidth: 0, overflowY: 'auto' }}>
        <h2 style={{ marginBottom: 24, color: 'var(--white)' }}>Manage Workshop Sessions</h2>
        {msg && <div className="alert alert-success">{msg}</div>}
        <div style={{ background: 'var(--navy2)', borderRadius: 16, padding: 24, border: '1px solid rgba(212,168,83,0.15)', marginBottom: 20 }}>
          <h3 style={{ marginBottom: 20 }}>Create Session</h3>
          <form onSubmit={save} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group" style={{ margin: 0, gridColumn: '1/-1' }}><label className="form-label">Title *</label><input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="form-input" required /></div>
            <div className="form-group" style={{ margin: 0 }}><label className="form-label">Date & Time *</label><input type="datetime-local" value={form.session_date} onChange={e => setForm({ ...form, session_date: e.target.value })} className="form-input" required /></div>
            <div className="form-group" style={{ margin: 0 }}><label className="form-label">Duration (min)</label><input type="number" value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} className="form-input" /></div>
            <div className="form-group" style={{ margin: 0, gridColumn: '1/-1' }}><label className="form-label">Description</label><textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="form-input" rows={3} /></div>
            <div className="form-group" style={{ margin: 0, gridColumn: '1/-1' }}><label className="form-label">Google Form Registration URL</label><input value={form.google_form_url} onChange={e => setForm({ ...form, google_form_url: e.target.value })} className="form-input" placeholder="https://forms.google.com/..." /></div>
            <div className="form-group" style={{ margin: 0 }}><label className="form-label">Seats</label><input type="number" value={form.seats} onChange={e => setForm({ ...form, seats: e.target.value })} className="form-input" /></div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12 }}>
              <label style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: '0.9rem', cursor: 'pointer' }}><input type="checkbox" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} /> Active</label>
              <button type="submit" className="btn btn-primary">Create Session</button>
            </div>
          </form>
        </div>
        <div className="grid-2">
          {sessions.map(s => (
            <div key={s.id} className="card" style={{ padding: 24 }}>
              <h4 style={{ marginBottom: 8 }}>{s.title}</h4>
              <p style={{ fontSize: '0.85rem', marginBottom: 12 }}>{s.description}</p>
              <div style={{ fontSize: '0.82rem', color: 'var(--ink-lighter)', marginBottom: 12 }}>📅 {new Date(s.session_date).toLocaleString('en-IN')} · {s.duration} min · {s.seats} seats</div>
              {s.google_form_url && <a href={s.google_form_url} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline" style={{ marginBottom: 12, display: 'inline-block' }}>View Form</a>}
              <div><button onClick={() => del(s.id)} className="btn btn-sm" style={{ background: 'rgba(229,62,62,0.1)', color: 'var(--error)', border: '1px solid rgba(229,62,62,0.2)' }}>Delete</button></div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

// ─── ADMIN WOMEN ───────────────────────────────────────────────────────────────
export function AdminWomen() {
  const [apps, setApps] = useState([]);
  const [msg, setMsg] = useState('');
  const showMsg = m => { setMsg(m); setTimeout(() => setMsg(''), 3000); };
  const load = () => api.get('/women/applications').then(r => setApps(r.data)).catch(() => {});
  useEffect(() => { document.title = "Women's Program | Admin"; load(); }, []);

  const update = async (id, status) => { await api.put(`/women/applications/${id}`, { status }); showMsg('Updated!'); load(); };
  const statusColor = s => ({ pending: 'badge-amber', reviewing: 'badge-teal', accepted: 'badge-success', rejected: 'badge-error' }[s] || 'badge-navy');

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--navy)' }}>
      <AdminSidebar />
      <main style={{ flex: 1, padding: '64px 16px 24px', background: 'var(--navy2)', minWidth: 0, overflowY: 'auto' }}>
        <h2 style={{ marginBottom: 24, color: 'var(--white)' }}>Women's Program Applications</h2>
        {msg && <div className="alert alert-success">{msg}</div>}
        <div className="table-wrap">
          <table>
            <thead><tr><th>Name</th><th>Phone</th><th>City</th><th>Qualification</th><th>Subjects</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
            <tbody>
              {apps.map(a => (
                <tr key={a.id}>
                  <td><strong>{a.name}</strong><div style={{ fontSize: '0.75rem', color: 'var(--ink-lighter)' }}>{a.email}</div></td>
                  <td><a href={`tel:${a.phone}`} style={{ color: 'var(--teal)' }}>{a.phone}</a></td>
                  <td>{a.city}</td>
                  <td style={{ maxWidth: 160 }}>{a.qualification}</td>
                  <td>{a.subjects}</td>
                  <td><span className={`badge ${statusColor(a.status)}`}>{a.status}</span></td>
                  <td style={{ fontSize: '0.8rem' }}>{new Date(a.created_at).toLocaleDateString('en-IN')}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button onClick={() => update(a.id, 'reviewing')} className="btn btn-sm btn-outline">Review</button>
                      <button onClick={() => update(a.id, 'accepted')} className="btn btn-sm btn-secondary">Accept</button>
                      <button onClick={() => update(a.id, 'rejected')} className="btn btn-sm" style={{ background: 'rgba(229,62,62,0.1)', color: 'var(--error)', border: '1px solid rgba(229,62,62,0.2)' }}>Reject</button>
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

// ─── ADMIN ASSIGN ──────────────────────────────────────────────────────────────
export function AdminAssign() {
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [form, setForm] = useState({ student_id: '', teacher_id: '', subject: '', notes: '' });
  const [msg, setMsg] = useState({ text: '', type: '' });
  const showMsg = (text, type = 'success') => { setMsg({ text, type }); setTimeout(() => setMsg({ text: '', type: '' }), 3000); };

  useEffect(() => {
    document.title = 'Assign Teachers | Admin';
    api.get('/admin/users?role=student&limit=100').then(r => setStudents(r.data.users)).catch(() => {});
    api.get('/admin/users?role=teacher&limit=100').then(r => setTeachers(r.data.users)).catch(() => {});
  }, []);

  const assign = async e => {
    e.preventDefault();
    try { await api.post('/admin/assign-teacher', form); showMsg('Teacher assigned!'); setForm({ student_id: '', teacher_id: '', subject: '', notes: '' }); } catch (err) { showMsg(err.response?.data?.error || 'Failed.', 'error'); }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--navy)' }}>
      <AdminSidebar />
      <main style={{ flex: 1, padding: '64px 16px 24px', background: 'var(--navy2)', minWidth: 0, overflowY: 'auto' }}>
        <h2 style={{ marginBottom: 24, color: 'var(--white)' }}>Assign Teachers to Students</h2>
        {msg.text && <div className={`alert alert-${msg.type}`} style={{ marginBottom: 16 }}>{msg.text}</div>}
        <div style={{ background: 'var(--navy2)', borderRadius: 16, padding: 24, border: '1px solid rgba(212,168,83,0.15)', marginBottom: 20 }}>
          <p style={{ color: 'var(--ink-lighter)', marginBottom: 24, fontSize: '0.9rem' }}>Use this to implement the Dual-Teacher Model — assign 2 teachers per student for different subject groups.</p>
          <form onSubmit={assign} style={{ display: 'grid', gap: 16 }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Select Student *</label>
              <select value={form.student_id} onChange={e => setForm({ ...form, student_id: e.target.value })} className="form-input" required>
                <option value="">-- Choose Student --</option>
                {students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.email})</option>)}
              </select>
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Select Teacher *</label>
              <select value={form.teacher_id} onChange={e => setForm({ ...form, teacher_id: e.target.value })} className="form-input" required>
                <option value="">-- Choose Teacher --</option>
                {teachers.map(t => <option key={t.id} value={t.id}>{t.name} ({t.email})</option>)}
              </select>
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Subject Group</label>
              <input value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} className="form-input" placeholder="e.g. Mathematics + Science" />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Notes (optional)</label>
              <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} className="form-input" rows={2} />
            </div>
            <button type="submit" className="btn btn-primary">Assign Teacher</button>
          </form>
        </div>
      </main>
    </div>
  );
}

// ─── ADMIN SCHEDULE ────────────────────────────────────────────────────────────
export function AdminSchedule() {
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [form, setForm] = useState({ student_id: '', teacher_id: '', subject: '', day_of_week: 1, start_time: '17:00', duration_min: 60, notes: '' });
  const [msg, setMsg] = useState({ text: '', type: '' });
  const showMsg = (text, type = 'success') => { setMsg({ text, type }); setTimeout(() => setMsg({ text: '', type: '' }), 3000); };
  const DAYS = ['', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  useEffect(() => {
    document.title = 'Schedule | Admin';
    api.get('/admin/users?role=student&limit=100').then(r => setStudents(r.data.users)).catch(() => {});
    api.get('/admin/users?role=teacher&limit=100').then(r => setTeachers(r.data.users)).catch(() => {});
  }, []);

  const schedule = async e => {
    e.preventDefault();
    try { await api.post('/admin/schedule', form); showMsg('Class scheduled!'); } catch (err) { showMsg(err.response?.data?.error || 'Failed.', 'error'); }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--navy)' }}>
      <AdminSidebar />
      <main style={{ flex: 1, padding: '64px 16px 24px', background: 'var(--navy2)', minWidth: 0, overflowY: 'auto' }}>
        <h2 style={{ marginBottom: 24, color: 'var(--white)' }}>Schedule Classes</h2>
        {msg.text && <div className={`alert alert-${msg.type}`} style={{ marginBottom: 16 }}>{msg.text}</div>}
        <div style={{ background: 'var(--navy2)', borderRadius: 16, padding: 24, border: '1px solid rgba(212,168,83,0.15)', marginBottom: 20 }}>
          <form onSubmit={schedule} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group" style={{ margin: 0, gridColumn: '1/-1' }}>
              <label className="form-label">Student *</label>
              <select value={form.student_id} onChange={e => setForm({ ...form, student_id: e.target.value })} className="form-input" required>
                <option value="">-- Select Student --</option>
                {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div className="form-group" style={{ margin: 0, gridColumn: '1/-1' }}>
              <label className="form-label">Teacher *</label>
              <select value={form.teacher_id} onChange={e => setForm({ ...form, teacher_id: e.target.value })} className="form-input" required>
                <option value="">-- Select Teacher --</option>
                {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
            <div className="form-group" style={{ margin: 0 }}><label className="form-label">Subject</label><input value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} className="form-input" /></div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Day of Week</label>
              <select value={form.day_of_week} onChange={e => setForm({ ...form, day_of_week: e.target.value })} className="form-input">
                {DAYS.slice(1).map((d, i) => <option key={i+1} value={i+1}>{d}</option>)}
              </select>
            </div>
            <div className="form-group" style={{ margin: 0 }}><label className="form-label">Start Time</label><input type="time" value={form.start_time} onChange={e => setForm({ ...form, start_time: e.target.value })} className="form-input" /></div>
            <div className="form-group" style={{ margin: 0 }}><label className="form-label">Duration (min)</label><input type="number" value={form.duration_min} onChange={e => setForm({ ...form, duration_min: e.target.value })} className="form-input" /></div>
            <button type="submit" className="btn btn-primary" style={{ gridColumn: '1/-1' }}>Schedule Class</button>
          </form>
        </div>
      </main>
    </div>
  );
}

// ─── ADMIN ANNOUNCEMENTS ───────────────────────────────────────────────────────
export function AdminAnnouncements() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ title: '', message: '', target_role: 'all', is_active: true });
  const [msg, setMsg] = useState('');
  const showMsg = m => { setMsg(m); setTimeout(() => setMsg(''), 3000); };
  const load = () => api.get('/admin/announcements').then(r => setItems(r.data)).catch(() => {});
  useEffect(() => { document.title = 'Announcements | Admin'; load(); }, []);

  const create = async e => {
    e.preventDefault();
    try { await api.post('/admin/announcements', { ...form, is_active: form.is_active ? 1 : 0 }); showMsg('Announcement created!'); load(); setForm({ title: '', message: '', target_role: 'all', is_active: true }); } catch { showMsg('Failed.'); }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--navy)' }}>
      <AdminSidebar />
      <main style={{ flex: 1, padding: '64px 16px 24px', background: 'var(--navy2)', minWidth: 0, overflowY: 'auto' }}>
        <h2 style={{ marginBottom: 24, color: 'var(--white)' }}>Announcements</h2>
        {msg && <div className="alert alert-success">{msg}</div>}
        <div style={{ background: 'var(--navy2)', borderRadius: 16, padding: 24, border: '1px solid rgba(212,168,83,0.15)', marginBottom: 20 }}>
          <h3 style={{ marginBottom: 20 }}>Create Announcement</h3>
          <form onSubmit={create} style={{ display: 'grid', gap: 16 }}>
            <div className="form-group" style={{ margin: 0 }}><label className="form-label">Title</label><input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="form-input" /></div>
            <div className="form-group" style={{ margin: 0 }}><label className="form-label">Message *</label><textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} className="form-input" rows={3} required /></div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Target Audience</label>
              <select value={form.target_role} onChange={e => setForm({ ...form, target_role: e.target.value })} className="form-input"><option value="all">All Users</option><option value="student">Students Only</option><option value="teacher">Teachers Only</option></select>
            </div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <label style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: '0.9rem', cursor: 'pointer' }}><input type="checkbox" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} /> Show immediately</label>
              <button type="submit" className="btn btn-primary">Create</button>
            </div>
          </form>
        </div>

        <div style={{ display: 'grid', gap: 12 }}>
          {items.map(a => (
            <div key={a.id} style={{ padding: '14px 20px', borderRadius: 10, border: '1px solid var(--border)', background: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: 4 }}>{a.title}</div>
                <p style={{ fontSize: '0.875rem', margin: 0 }}>{a.message}</p>
                <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
                  <span className="badge badge-teal" style={{ fontSize: '0.65rem' }}>{a.target_role}</span>
                  <span className={`badge ${a.is_active ? 'badge-success' : 'badge-error'}`} style={{ fontSize: '0.65rem' }}>{a.is_active ? 'Active' : 'Hidden'}</span>
                </div>
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--ink-lighter)', flexShrink: 0 }}>{new Date(a.created_at).toLocaleDateString('en-IN')}</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default AdminTests;
