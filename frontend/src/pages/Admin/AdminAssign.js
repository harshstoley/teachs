import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../utils/api';

const inp = { width:'100%', padding:'10px 14px', background:'#0f1f35', border:'1px solid rgba(212,168,83,0.2)', borderRadius:10, color:'#ffffff', fontFamily:'var(--font-body)', fontSize:'0.9rem', outline:'none', boxSizing:'border-box' };
const lbl = { display:'block', fontSize:'0.8rem', color:'var(--slate2)', marginBottom:5, fontWeight:600 };

export default function AdminAssign() {
  const [students,    setStudents]    = useState([]);
  const [teachers,    setTeachers]    = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [form,        setForm]        = useState({ student_id:'', teacher_id:'', subject:'', notes:'' });
  const [reassignMap, setReassignMap] = useState({}); // { assignmentId: newTeacherId }
  const [savingId,    setSavingId]    = useState(null);
  const [msg,         setMsg]         = useState({ text:'', type:'' });

  const showMsg = (text, type='success') => {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text:'', type:'' }), 3000);
  };

  const loadAssignments = useCallback(() => {
    api.get('/admin/all-assignments')
      .then(r => {
        const rows = Array.isArray(r.data) ? r.data : [];
        setAssignments(rows);
        // Pre-fill reassign map with current teacher
        const map = {};
        rows.forEach(a => { map[a.id] = a.teacher_id; });
        setReassignMap(map);
      })
      .catch(() => setAssignments([]));
  }, []);

  useEffect(() => {
    document.title = 'Assign | Admin';
    api.get('/admin/users?role=student&limit=100')
      .then(r => setStudents(Array.isArray(r.data.users) ? r.data.users : []))
      .catch(() => setStudents([]));
    api.get('/admin/users?role=teacher&limit=100')
      .then(r => setTeachers(Array.isArray(r.data.users) ? r.data.users : []))
      .catch(() => setTeachers([]));
    loadAssignments();
  }, [loadAssignments]);

  const assign = async e => {
    e.preventDefault();
    try {
      await api.post('/admin/assign-teacher', form);
      showMsg('Teacher assigned successfully!');
      setForm({ student_id:'', teacher_id:'', subject:'', notes:'' });
      loadAssignments();
    } catch(err) { showMsg(err.response?.data?.error || 'Failed.', 'error'); }
  };

  const saveReassign = async (id) => {
    const newTeacherId = reassignMap[id];
    const assignment   = assignments.find(a => a.id === id);
    if (!newTeacherId || newTeacherId === assignment?.teacher_id) {
      return showMsg('Select a different teacher to reassign.', 'error');
    }
    setSavingId(id);
    try {
      await api.put(`/admin/assignments/${id}/reassign`, { teacher_id: newTeacherId });
      showMsg('Teacher reassigned successfully!');
      loadAssignments();
    } catch(err) { showMsg(err.response?.data?.error || 'Failed to reassign.', 'error'); }
    finally { setSavingId(null); }
  };

  const tblCell = { padding:'12px 10px', fontSize:'0.82rem', color:'#cbd5e1', borderBottom:'1px solid rgba(255,255,255,0.06)', verticalAlign:'middle' };
  const tblHead = { padding:'10px 10px', fontSize:'0.72rem', color:'#94a3b8', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em', borderBottom:'1px solid rgba(212,168,83,0.15)', textAlign:'left' };

  return (
    <AdminLayout title="Assign Teachers to Students" subtitle="Dual-Teacher Model — assign 2 teachers per student">
      {msg.text && <div className={`alert alert-${msg.type}`} style={{ marginBottom:16 }}>{msg.text}</div>}

      {/* ── New Assignment Form ── */}
      <div style={{ background:'#152238', border:'1px solid rgba(212,168,83,0.15)', borderRadius:16, padding:'24px 20px', maxWidth:560, marginBottom:32 }}>
        <h3 style={{ color:'#e2e8f0', fontFamily:'var(--font-display)', fontSize:'1.05rem', marginBottom:20 }}>New Assignment</h3>
        <form onSubmit={assign} style={{ display:'grid', gap:16 }}>
          <div>
            <label style={lbl}>Select Student *</label>
            <select value={form.student_id} onChange={e => setForm({ ...form, student_id:e.target.value })} style={inp} required>
              <option value="">-- Choose Student --</option>
              {students.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} {s.enrollment_no ? `[${s.enrollment_no}]` : ''} ({s.email})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label style={lbl}>Select Teacher *</label>
            <select value={form.teacher_id} onChange={e => setForm({ ...form, teacher_id:e.target.value })} style={inp} required>
              <option value="">-- Choose Teacher --</option>
              {teachers.map(t => (
                <option key={t.id} value={t.id}>
                  {t.name} {t.teacher_code ? `[${t.teacher_code}]` : ''} ({t.email})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label style={lbl}>Subject Group</label>
            <input value={form.subject} onChange={e => setForm({ ...form, subject:e.target.value })} placeholder="e.g. Mathematics + Science" style={inp} />
          </div>
          <div>
            <label style={lbl}>Notes</label>
            <textarea value={form.notes} onChange={e => setForm({ ...form, notes:e.target.value })} rows={2} style={{ ...inp, resize:'vertical' }} />
          </div>
          <button type="submit" style={{ padding:'13px', background:'var(--gold)', color:'var(--navy)', border:'none', borderRadius:10, fontWeight:700, cursor:'pointer', fontSize:'0.95rem', fontFamily:'var(--font-body)' }}>
            Assign Teacher
          </button>
        </form>
      </div>

      {/* ── Current Assignments + Reassign ── */}
      <div style={{ background:'#152238', border:'1px solid rgba(212,168,83,0.15)', borderRadius:16, padding:'20px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18, flexWrap:'wrap', gap:8 }}>
          <h3 style={{ color:'#e2e8f0', fontFamily:'var(--font-display)', fontSize:'1.05rem' }}>
            Current Assignments ({assignments.length})
          </h3>
          <button onClick={loadAssignments} style={{ fontSize:'0.8rem', color:'#94a3b8', background:'none', border:'1px solid rgba(255,255,255,0.1)', borderRadius:8, padding:'5px 12px', cursor:'pointer', fontFamily:'var(--font-body)' }}>
            ↻ Refresh
          </button>
        </div>

        {assignments.length === 0 ? (
          <p style={{ color:'#64748b', fontSize:'0.88rem', padding:'16px 0' }}>No assignments yet.</p>
        ) : (
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', minWidth:640 }}>
              <thead>
                <tr>
                  {['Student','Subject','Current Teacher','Reassign To',''].map(h => (
                    <th key={h} style={tblHead}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {assignments.map(a => {
                  const currentId  = Number(reassignMap[a.id]);
                  const changed    = currentId !== Number(a.teacher_id);
                  return (
                    <tr key={a.id}>
                      <td style={tblCell}>
                        <div style={{ color:'#e2e8f0', fontWeight:600 }}>{a.student_name}</div>
                        {a.enrollment_no && <div style={{ fontSize:'0.7rem', color:'#D4A853', fontWeight:700 }}>{a.enrollment_no}</div>}
                      </td>
                      <td style={tblCell}>
                        <span style={{ background:'rgba(212,168,83,0.12)', color:'#D4A853', padding:'2px 8px', borderRadius:6, fontSize:'0.75rem', fontWeight:600 }}>
                          {a.subject || '—'}
                        </span>
                      </td>
                      <td style={tblCell}>
                        <div style={{ color:'#94a3b8' }}>{a.teacher_name}</div>
                        {a.teacher_code && <div style={{ fontSize:'0.7rem', color:'#0099B2', fontWeight:700 }}>{a.teacher_code}</div>}
                      </td>
                      <td style={{ ...tblCell, minWidth:200 }}>
                        <select
                          value={reassignMap[a.id] ?? a.teacher_id}
                          onChange={e => setReassignMap(prev => ({ ...prev, [a.id]: Number(e.target.value) }))}
                          style={{ ...inp, padding:'7px 10px', fontSize:'0.82rem' }}
                        >
                          {teachers.map(t => (
                            <option key={t.id} value={t.id}>{t.name}{t.teacher_code ? ` [${t.teacher_code}]` : ''}</option>
                          ))}
                        </select>
                      </td>
                      <td style={{ ...tblCell, minWidth:100 }}>
                        <button
                          onClick={() => saveReassign(a.id)}
                          disabled={!changed || savingId === a.id}
                          style={{
                            padding:'7px 14px',
                            background: changed ? '#1B3A6B' : 'rgba(255,255,255,0.05)',
                            color: changed ? '#D4A853' : '#475569',
                            border: changed ? '1px solid rgba(212,168,83,0.4)' : '1px solid rgba(255,255,255,0.08)',
                            borderRadius:8, cursor: changed ? 'pointer' : 'default',
                            fontSize:'0.78rem', fontFamily:'var(--font-body)', fontWeight:700,
                            opacity: savingId === a.id ? 0.6 : 1,
                            transition:'all 0.2s'
                          }}
                        >
                          {savingId === a.id ? '…' : 'Reassign'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
