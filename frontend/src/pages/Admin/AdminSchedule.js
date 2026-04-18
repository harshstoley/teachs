import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../utils/api';

const inp = { width:'100%', padding:'10px 14px', background:'#0f1f35', border:'1px solid rgba(212,168,83,0.2)', borderRadius:10, color:'#ffffff', fontFamily:'var(--font-body)', fontSize:'0.9rem', outline:'none', boxSizing:'border-box' };
const lbl = { display:'block', fontSize:'0.78rem', color:'#b8c5d9', marginBottom:5, fontWeight:600 };
const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
const DAY_SHORT = ['','Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

export default function AdminSchedule() {
  const [students,   setStudents]   = useState([]);
  const [teachers,   setTeachers]   = useState([]);
  const [schedules,  setSchedules]  = useState([]);
  const [expanded,   setExpanded]   = useState(null);
  const [form,       setForm]       = useState({ student_id:'', teacher_id:'', subject:'', day_of_week:1, start_time:'17:00', duration_min:60 });
  const [meetInputs, setMeetInputs] = useState({});
  const [savingLink, setSavingLink] = useState(null);
  const [msg,        setMsg]        = useState({ text:'', type:'' });

  const showMsg = (text, type='success') => {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text:'', type:'' }), 3000);
  };

  const loadSchedules = useCallback(() => {
    api.get('/admin/all-schedules').then(r => {
      const rows = Array.isArray(r.data) ? r.data : [];
      setSchedules(rows);
      const links = {};
      rows.forEach(s => { links[s.id] = s.meet_link || ''; });
      setMeetInputs(links);
    }).catch(() => setSchedules([]));
  }, []);

  useEffect(() => {
    document.title = 'Schedule | Admin';
    api.get('/admin/users?role=student&limit=100').then(r => setStudents(Array.isArray(r.data?.users) ? r.data.users : [])).catch(() => setStudents([]));
    api.get('/admin/users?role=teacher&limit=100').then(r => setTeachers(Array.isArray(r.data?.users) ? r.data.users : [])).catch(() => setTeachers([]));
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

  const saveMeetLink = async id => {
    setSavingLink(id);
    try {
      await api.put(`/admin/schedules/${id}/meet-link`, { meet_link: meetInputs[id] || '' });
      showMsg(meetInputs[id] ? 'Meet link saved!' : 'Meet link cleared.');
      loadSchedules();
    } catch { showMsg('Failed to save link.', 'error'); }
    finally { setSavingLink(null); }
  };

  // Group schedules by student
  const byStudent = schedules.reduce((acc, s) => {
    if (!acc[s.student_id]) acc[s.student_id] = { student_id: s.student_id, student_name: s.student_name, enrollment_no: s.enrollment_no, items: [] };
    acc[s.student_id].items.push(s);
    return acc;
  }, {});
  const studentGroups = Object.values(byStudent);

  return (
    <AdminLayout title="Schedule Classes">
      {msg.text && <div className={`alert alert-${msg.type}`} style={{ marginBottom:16 }}>{msg.text}</div>}

      {/* ── Create Form ── */}
      <div style={{ background:'#152238', border:'1px solid rgba(212,168,83,0.15)', borderRadius:16, padding:'24px 20px', maxWidth:560, marginBottom:32 }}>
        <h3 style={{ color:'#e2e8f0', fontFamily:'var(--font-display)', fontSize:'1.05rem', marginBottom:20 }}>Schedule a New Class</h3>
        <form onSubmit={submit} style={{ display:'grid', gap:16 }}>
          <div>
            <label style={lbl}>Student *</label>
            <select value={form.student_id} onChange={e => setForm({ ...form, student_id:e.target.value })} style={inp} required>
              <option value="">-- Select Student --</option>
              {students.map(s => <option key={s.id} value={s.id}>{s.name}{s.enrollment_no ? ` [${s.enrollment_no}]` : ''} ({s.email})</option>)}
            </select>
          </div>
          <div>
            <label style={lbl}>Teacher *</label>
            <select value={form.teacher_id} onChange={e => setForm({ ...form, teacher_id:e.target.value })} style={inp} required>
              <option value="">-- Select Teacher --</option>
              {teachers.map(t => <option key={t.id} value={t.id}>{t.name}{t.teacher_code ? ` [${t.teacher_code}]` : ''} ({t.email})</option>)}
            </select>
          </div>
          <div><label style={lbl}>Subject</label><input value={form.subject} onChange={e => setForm({ ...form, subject:e.target.value })} placeholder="e.g. Mathematics" style={inp} /></div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <div>
              <label style={lbl}>Day</label>
              <select value={form.day_of_week} onChange={e => setForm({ ...form, day_of_week:e.target.value })} style={inp}>
                {DAYS.map((d, i) => <option key={i+1} value={i+1}>{d}</option>)}
              </select>
            </div>
            <div><label style={lbl}>Start Time</label><input type="time" value={form.start_time} onChange={e => setForm({ ...form, start_time:e.target.value })} style={inp} /></div>
            <div><label style={lbl}>Duration (min)</label><input type="number" value={form.duration_min} onChange={e => setForm({ ...form, duration_min:e.target.value })} style={inp} /></div>
          </div>
          <button type="submit" style={{ padding:'13px', background:'var(--gold)', color:'var(--navy)', border:'none', borderRadius:10, fontWeight:700, cursor:'pointer', fontFamily:'var(--font-body)', fontSize:'0.95rem' }}>
            Schedule Class
          </button>
        </form>
      </div>

      {/* ── Student Accordion ── */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
        <h3 style={{ color:'#e2e8f0', fontFamily:'var(--font-display)', fontSize:'1.05rem' }}>
          All Schedules — {studentGroups.length} Student{studentGroups.length !== 1 ? 's' : ''}
        </h3>
        <button onClick={loadSchedules} style={{ fontSize:'0.8rem', color:'#94a3b8', background:'none', border:'1px solid rgba(255,255,255,0.1)', borderRadius:8, padding:'5px 12px', cursor:'pointer', fontFamily:'var(--font-body)' }}>↻ Refresh</button>
      </div>

      {studentGroups.length === 0 && <p style={{ color:'#64748b', fontSize:'0.88rem' }}>No schedules yet.</p>}

      <div style={{ display:'grid', gap:10 }}>
        {studentGroups.map(group => {
          const isOpen = expanded === group.student_id;
          return (
            <div key={group.student_id} style={{ background:'#152238', border:`1px solid ${isOpen ? 'rgba(212,168,83,0.5)' : 'rgba(212,168,83,0.12)'}`, borderRadius:14, overflow:'hidden' }}>

              {/* Student header */}
              <button
                onClick={() => setExpanded(isOpen ? null : group.student_id)}
                style={{ width:'100%', background:'none', border:'none', cursor:'pointer', padding:'16px 20px', display:'flex', justifyContent:'space-between', alignItems:'center', fontFamily:'var(--font-body)' }}
              >
                <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                  <div style={{ width:42, height:42, borderRadius:'50%', background:'linear-gradient(135deg, #1B3A6B 0%, #0099B2 100%)', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontWeight:700, fontSize:'1.05rem', flexShrink:0 }}>
                    {group.student_name?.[0]}
                  </div>
                  <div style={{ textAlign:'left' }}>
                    <div style={{ color:'#e2e8f0', fontWeight:700, fontSize:'0.95rem' }}>{group.student_name}</div>
                    {group.enrollment_no && <div style={{ fontSize:'0.72rem', color:'#D4A853', fontWeight:700, marginTop:2 }}>ID: {group.enrollment_no}</div>}
                  </div>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <span style={{ fontSize:'0.73rem', color:'#94a3b8', background:'rgba(255,255,255,0.06)', padding:'3px 10px', borderRadius:20 }}>
                    {group.items.length} class{group.items.length !== 1 ? 'es' : ''}
                  </span>
                  <span style={{ color:'#D4A853', fontSize:'1.1rem', display:'inline-block', transform: isOpen ? 'rotate(180deg)' : 'rotate(0)', transition:'transform 0.2s' }}>▾</span>
                </div>
              </button>

              {/* Expanded rows */}
              {isOpen && (
                <div style={{ borderTop:'1px solid rgba(255,255,255,0.07)' }}>
                  {/* Header row */}
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 100px 90px 1fr', gap:12, padding:'8px 20px', background:'rgba(0,0,0,0.2)' }}>
                    {['Teacher / Subject','Day & Time','Link','Meet Link'].map(h => (
                      <div key={h} style={{ fontSize:'0.68rem', color:'#64748b', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em' }}>{h}</div>
                    ))}
                  </div>

                  {group.items.map((s, i) => (
                    <div key={s.id} style={{ display:'grid', gridTemplateColumns:'1fr 100px 90px 1fr', gap:12, padding:'13px 20px', alignItems:'center', borderBottom: i < group.items.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)' }}>

                      <div>
                        <div style={{ fontSize:'0.83rem', color:'#e2e8f0', fontWeight:600 }}>{s.teacher_name}</div>
                        {s.teacher_code && <div style={{ fontSize:'0.68rem', color:'#0099B2', fontWeight:700 }}>{s.teacher_code}</div>}
                        <span style={{ display:'inline-block', marginTop:5, background:'rgba(212,168,83,0.12)', color:'#D4A853', padding:'2px 8px', borderRadius:6, fontSize:'0.72rem', fontWeight:600 }}>{s.subject || '—'}</span>
                      </div>

                      <div>
                        <div style={{ fontSize:'0.83rem', fontWeight:700, color:'#e2e8f0' }}>{DAY_SHORT[s.day_of_week]}</div>
                        <div style={{ fontSize:'0.73rem', color:'#94a3b8', marginTop:2 }}>{s.start_time?.slice(0,5)}</div>
                        <div style={{ fontSize:'0.7rem', color:'#64748b' }}>{s.duration_min} min</div>
                      </div>

                      <div>
                        {s.meet_link
                          ? <span style={{ fontSize:'0.68rem', color:'#22c55e', fontWeight:700, background:'rgba(34,197,94,0.1)', padding:'3px 8px', borderRadius:20, display:'inline-block' }}>● Set</span>
                          : <span style={{ fontSize:'0.68rem', color:'#64748b', background:'rgba(255,255,255,0.05)', padding:'3px 8px', borderRadius:20, display:'inline-block' }}>None</span>
                        }
                      </div>

                      <div style={{ display:'flex', gap:6, alignItems:'center' }}>
                        <input
                          type="url"
                          value={meetInputs[s.id] ?? ''}
                          onChange={e => setMeetInputs(prev => ({ ...prev, [s.id]: e.target.value }))}
                          placeholder="https://meet.google.com/..."
                          style={{ ...inp, padding:'6px 10px', fontSize:'0.75rem', flex:1 }}
                        />
                        <button
                          onClick={() => saveMeetLink(s.id)}
                          disabled={savingLink === s.id}
                          style={{ padding:'6px 12px', background: s.meet_link ? '#0099B2' : 'rgba(0,153,178,0.2)', color: s.meet_link ? 'white' : '#0099B2', border:'1px solid rgba(0,153,178,0.4)', borderRadius:8, cursor:'pointer', fontSize:'0.72rem', fontFamily:'var(--font-body)', fontWeight:700, whiteSpace:'nowrap', opacity: savingLink === s.id ? 0.6 : 1 }}
                        >
                          {savingLink === s.id ? '…' : s.meet_link ? '✓ Update' : 'Save'}
                        </button>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </AdminLayout>
  );
}
