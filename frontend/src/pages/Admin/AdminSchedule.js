import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../utils/api';

const inp = { width:'100%', padding:'10px 14px', background:'#0f1f35', border:'1px solid rgba(212,168,83,0.2)', borderRadius:10, color:'#ffffff', fontFamily:'var(--font-body)', fontSize:'0.9rem', outline:'none', boxSizing:'border-box' };
const lbl = { display:'block', fontSize:'0.78rem', color:'#b8c5d9', marginBottom:5, fontWeight:600 };
const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
const DAY_SHORT = ['','Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

export default function AdminSchedule() {
  const [students, setStudents]   = useState([]);
  const [teachers, setTeachers]   = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [form, setForm]           = useState({ student_id:'', teacher_id:'', subject:'', day_of_week:1, start_time:'17:00', duration_min:60 });
  const [meetInputs, setMeetInputs] = useState({}); // { scheduleId: linkString }
  const [savingLink, setSavingLink] = useState(null);
  const [msg, setMsg]             = useState({ text:'', type:'' });

  const showMsg = (text, type='success') => {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text:'', type:'' }), 3000);
  };

  const loadSchedules = useCallback(() => {
    api.get('/admin/all-schedules')
      .then(r => {
        const rows = Array.isArray(r.data) ? r.data : [];
        setSchedules(rows);
        // Pre-fill meet inputs with existing links
        const links = {};
        rows.forEach(s => { links[s.id] = s.meet_link || ''; });
        setMeetInputs(links);
      })
      .catch(() => setSchedules([]));
  }, []);

  useEffect(() => {
    document.title = 'Schedule | Admin';
    api.get('/admin/users?role=student&limit=100')
      .then(r => setStudents(Array.isArray(r.data?.users) ? r.data.users : []))
      .catch(() => setStudents([]));
    api.get('/admin/users?role=teacher&limit=100')
      .then(r => setTeachers(Array.isArray(r.data?.users) ? r.data.users : []))
      .catch(() => setTeachers([]));
    loadSchedules();
  }, [loadSchedules]);

  const submit = async e => {
    e.preventDefault();
    try {
      await api.post('/admin/schedule', form);
      showMsg('Class scheduled!');
      setForm({ student_id:'', teacher_id:'', subject:'', day_of_week:1, start_time:'17:00', duration_min:60 });
      loadSchedules();
    } catch(err) { showMsg(err.response?.data?.error || 'Failed.', 'error'); }
  };

  const saveMeetLink = async (id) => {
    setSavingLink(id);
    try {
      await api.put(`/admin/schedules/${id}/meet-link`, { meet_link: meetInputs[id] || '' });
      showMsg(meetInputs[id] ? 'Meet link saved!' : 'Meet link cleared.');
      loadSchedules();
    } catch(err) { showMsg(err.response?.data?.error || 'Failed to save link.', 'error'); }
    finally { setSavingLink(null); }
  };

  const tblCell = { padding:'12px 10px', fontSize:'0.82rem', color:'#cbd5e1', borderBottom:'1px solid rgba(255,255,255,0.06)', verticalAlign:'middle' };
  const tblHead = { padding:'10px 10px', fontSize:'0.72rem', color:'#94a3b8', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em', borderBottom:'1px solid rgba(212,168,83,0.15)', textAlign:'left' };

  return (
    <AdminLayout title="Schedule Classes">
      {msg.text && <div className={`alert alert-${msg.type}`} style={{ marginBottom:16 }}>{msg.text}</div>}

      {/* ── Create Schedule Form ── */}
      <div style={{ background:'#152238', border:'1px solid rgba(212,168,83,0.15)', borderRadius:16, padding:'24px 20px', maxWidth:560, marginBottom:32 }}>
        <h3 style={{ color:'#e2e8f0', fontFamily:'var(--font-display)', fontSize:'1.05rem', marginBottom:20 }}>Schedule a New Class</h3>
        <form onSubmit={submit} style={{ display:'grid', gap:16 }}>
          <div>
            <label style={lbl}>Student *</label>
            <select value={form.student_id} onChange={e => setForm({ ...form, student_id:e.target.value })} style={inp} required>
              <option value="">-- Select Student --</option>
              {students.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name}{s.enrollment_no ? ` [${s.enrollment_no}]` : ''} ({s.email})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label style={lbl}>Teacher *</label>
            <select value={form.teacher_id} onChange={e => setForm({ ...form, teacher_id:e.target.value })} style={inp} required>
              <option value="">-- Select Teacher --</option>
              {teachers.map(t => (
                <option key={t.id} value={t.id}>
                  {t.name}{t.teacher_code ? ` [${t.teacher_code}]` : ''} ({t.email})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label style={lbl}>Subject</label>
            <input value={form.subject} onChange={e => setForm({ ...form, subject:e.target.value })} placeholder="e.g. Mathematics" style={inp} />
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <div>
              <label style={lbl}>Day</label>
              <select value={form.day_of_week} onChange={e => setForm({ ...form, day_of_week:e.target.value })} style={inp}>
                {DAYS.map((d, i) => <option key={i+1} value={i+1}>{d}</option>)}
              </select>
            </div>
            <div>
              <label style={lbl}>Start Time</label>
              <input type="time" value={form.start_time} onChange={e => setForm({ ...form, start_time:e.target.value })} style={inp} />
            </div>
            <div>
              <label style={lbl}>Duration (min)</label>
              <input type="number" value={form.duration_min} onChange={e => setForm({ ...form, duration_min:e.target.value })} style={inp} />
            </div>
          </div>
          <button type="submit" style={{ padding:'13px', background:'var(--gold)', color:'var(--navy)', border:'none', borderRadius:10, fontWeight:700, cursor:'pointer', fontFamily:'var(--font-body)', fontSize:'0.95rem' }}>
            Schedule Class
          </button>
        </form>
      </div>

      {/* ── All Schedules Table ── */}
      <div style={{ background:'#152238', border:'1px solid rgba(212,168,83,0.15)', borderRadius:16, padding:'20px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18, flexWrap:'wrap', gap:8 }}>
          <h3 style={{ color:'#e2e8f0', fontFamily:'var(--font-display)', fontSize:'1.05rem' }}>
            All Scheduled Classes ({schedules.length})
          </h3>
          <button onClick={loadSchedules} style={{ fontSize:'0.8rem', color:'#94a3b8', background:'none', border:'1px solid rgba(255,255,255,0.1)', borderRadius:8, padding:'5px 12px', cursor:'pointer', fontFamily:'var(--font-body)' }}>
            ↻ Refresh
          </button>
        </div>

        {schedules.length === 0 ? (
          <p style={{ color:'#64748b', fontSize:'0.88rem', padding:'16px 0' }}>No schedules yet.</p>
        ) : (
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', minWidth:740 }}>
              <thead>
                <tr>
                  {['Teacher','Student','Subject','Day & Time','Duration','Meet Link'].map(h => (
                    <th key={h} style={tblHead}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {schedules.map(s => (
                  <tr key={s.id} style={{ background: s.is_active ? 'transparent' : 'rgba(255,255,255,0.02)', opacity: s.is_active ? 1 : 0.5 }}>
                    <td style={tblCell}>
                      <span style={{ color:'#e2e8f0', fontWeight:600 }}>{s.teacher_name}</span>
                    </td>
                    <td style={tblCell}>
                      <span style={{ color:'#e2e8f0' }}>{s.student_name}</span>
                    </td>
                    <td style={tblCell}>
                      <span style={{ background:'rgba(212,168,83,0.12)', color:'#D4A853', padding:'2px 8px', borderRadius:6, fontSize:'0.75rem', fontWeight:600 }}>
                        {s.subject || '—'}
                      </span>
                    </td>
                    <td style={tblCell}>
                      <div style={{ fontWeight:600, color:'#e2e8f0' }}>{DAY_SHORT[s.day_of_week]}</div>
                      <div style={{ fontSize:'0.75rem', color:'#94a3b8', marginTop:2 }}>{s.start_time?.slice(0,5)}</div>
                    </td>
                    <td style={{ ...tblCell, color:'#94a3b8' }}>{s.duration_min} min</td>
                    <td style={{ ...tblCell, minWidth:280 }}>
                      <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                        <input
                          type="url"
                          value={meetInputs[s.id] ?? ''}
                          onChange={e => setMeetInputs(prev => ({ ...prev, [s.id]: e.target.value }))}
                          placeholder="https://meet.google.com/..."
                          style={{ ...inp, padding:'7px 10px', fontSize:'0.78rem', flex:1, minWidth:160 }}
                        />
                        <button
                          onClick={() => saveMeetLink(s.id)}
                          disabled={savingLink === s.id}
                          style={{ padding:'7px 12px', background: s.meet_link ? '#0099B2' : 'rgba(0,153,178,0.2)', color: s.meet_link ? 'white' : '#0099B2', border:'1px solid rgba(0,153,178,0.4)', borderRadius:8, cursor:'pointer', fontSize:'0.75rem', fontFamily:'var(--font-body)', fontWeight:700, whiteSpace:'nowrap', opacity: savingLink === s.id ? 0.6 : 1 }}
                        >
                          {savingLink === s.id ? '…' : s.meet_link ? '✓ Update' : 'Save'}
                        </button>
                      </div>
                      {s.meet_link && (
                        <div style={{ marginTop:4, display:'flex', alignItems:'center', gap:6 }}>
                          <span style={{ fontSize:'0.7rem', color:'#22c55e', fontWeight:600 }}>● Link set</span>
                          <a href={s.meet_link} target="_blank" rel="noreferrer" style={{ fontSize:'0.7rem', color:'#0099B2' }}>Open ↗</a>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
