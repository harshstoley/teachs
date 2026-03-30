import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const TABS = ['Overview', 'My Students', 'Homework', 'Progress', 'Attendance', 'Doubts', 'Notes', 'Feedback'];
const DAY = ['', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function TeacherDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('Overview');
  const [data, setData] = useState(null);
  const [tabData, setTabData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState({ text: '', type: '' });
  const showMsg = (text, type = 'success') => { setMsg({ text, type }); setTimeout(() => setMsg({ text: '', type: '' }), 3000); };

  const [hwForm, setHwForm] = useState({ student_id: '', subject: '', title: '', description: '', due_date: '' });
  const [progForm, setProgForm] = useState({ student_id: '', subject: '', score: '', remarks: '', report_date: '' });
  const [attForm, setAttForm] = useState({ student_id: '', class_date: '', status: 'present', subject: '' });
  const [noteForm, setNoteForm] = useState({ student_id: '', subject: '', title: '', content: '', is_public: false });
  const [fbForm, setFbForm] = useState({ student_id: '', subject: '', feedback: '', rating: 5 });
  const [doubtAnswer, setDoubtAnswer] = useState({});

  useEffect(() => {
    document.title = 'Teacher Dashboard | Teachs';
    api.get('/teacher/dashboard').then(r => setData(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (activeTab === 'Overview') return;
    if (activeTab === 'My Students') { api.get('/teacher/students').then(r => setTabData(r.data)).catch(() => setTabData([])); return; }
    setTabData(null);
  }, [activeTab]);

  const submitHw  = async e => { e.preventDefault(); try { await api.post('/teacher/homework', hwForm); showMsg('Homework assigned!'); setHwForm({ student_id:'', subject:'', title:'', description:'', due_date:'' }); } catch { showMsg('Failed.','error'); } };
  const submitProg= async e => { e.preventDefault(); try { await api.post('/teacher/progress', progForm); showMsg('Progress added!'); setProgForm({ student_id:'', subject:'', score:'', remarks:'', report_date:'' }); } catch { showMsg('Failed.','error'); } };
  const submitAtt = async e => { e.preventDefault(); try { await api.post('/teacher/attendance', attForm); showMsg('Attendance marked!'); } catch { showMsg('Failed.','error'); } };
  const submitNote= async e => { e.preventDefault(); try { await api.post('/teacher/notes', noteForm); showMsg('Notes saved!'); setNoteForm({ student_id:'', subject:'', title:'', content:'', is_public:false }); } catch { showMsg('Failed.','error'); } };
  const submitFb  = async e => { e.preventDefault(); try { await api.post('/teacher/feedback', fbForm); showMsg('Feedback submitted!'); setFbForm({ student_id:'', subject:'', feedback:'', rating:5 }); } catch { showMsg('Failed.','error'); } };
  const answerDoubt= async id => { try { await api.put(`/teacher/doubts/${id}`, { answer: doubtAnswer[id] }); showMsg('Doubt answered!'); api.get('/teacher/dashboard').then(r => setData(r.data)); } catch { showMsg('Failed.','error'); } };

  const students = data?.students || [];

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', background:'var(--ink)', flexDirection:'column', gap:16 }}>
      <div className="spinner" style={{ width:48, height:48 }} />
      <p style={{ color:'rgba(255,255,255,0.35)', fontSize:'0.85rem' }}>Loading teacher portal…</p>
    </div>
  );

  const StudentSelect = ({ value, onChange }) => (
    <select value={value} onChange={onChange} className="form-input" required>
      <option value="">Select Student</option>
      {students.map(s => <option key={`${s.id}-${s.subject}`} value={s.id}>{s.name} (Class {s.student_class}) – {s.subject}</option>)}
    </select>
  );

  const card = { background:'white', borderRadius:16, padding:28, border:'1px solid var(--border)', boxShadow:'var(--shadow-xs)' };
  const formGrid = { display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 };

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)' }}>
      {/* Top Bar */}
      <div style={{ background:'var(--ink)', height:66, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 28px', position:'sticky', top:0, zIndex:50, borderBottom:'1px solid rgba(59,114,245,0.15)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:14 }}>
          <Link to="/" style={{ fontFamily:'var(--font-display)', fontSize:'1.4rem', fontWeight:700, color:'white', textDecoration:'none' }}>
            Teach<span style={{ color:'var(--amber2)' }}>s</span>
          </Link>
          <div style={{ height:20, width:1, background:'rgba(255,255,255,0.12)' }} />
          <span style={{ fontSize:'0.72rem', color:'rgba(255,255,255,0.35)', fontWeight:500, letterSpacing:'0.10em', textTransform:'uppercase' }}>Teacher Portal</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ background:'rgba(11,122,94,0.15)', border:'1px solid rgba(11,122,94,0.25)', borderRadius:10, padding:'6px 14px', display:'flex', alignItems:'center', gap:8 }}>
            <div style={{ width:28, height:28, borderRadius:'50%', background:'linear-gradient(135deg, var(--emerald) 0%, var(--emerald2) 100%)', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontWeight:700, fontSize:'0.85rem' }}>{user?.name?.[0]}</div>
            <span style={{ color:'rgba(255,255,255,0.75)', fontSize:'0.87rem', fontWeight:500 }}>👨‍🏫 {user?.name}</span>
          </div>
          <button onClick={logout} style={{ background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:10, padding:'8px 16px', color:'rgba(255,255,255,0.60)', fontSize:'0.84rem', cursor:'pointer', fontFamily:'var(--font-body)' }}>Logout</button>
        </div>
      </div>

      <div style={{ maxWidth:1120, margin:'0 auto', padding:'28px 20px' }}>
        {msg.text && <div className={`alert alert-${msg.type}`} style={{ marginBottom:20 }}>{msg.text}</div>}

        {/* Tabs */}
        <div className="tab-scroll" style={{ marginBottom:28 }}>
          {TABS.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`tab-btn${activeTab===tab?' active':''}`}
              style={activeTab===tab ? { background:'var(--emerald)', color:'white', fontWeight:600 } : {}}>
              {tab}
            </button>
          ))}
        </div>

        {/* ── OVERVIEW ── */}
        {activeTab==='Overview' && data && (
          <div>
            {/* Welcome Banner */}
            <div style={{ background:'linear-gradient(135deg, var(--emerald) 0%, var(--ink2) 100%)', borderRadius:20, padding:'24px 28px', marginBottom:24, position:'relative', overflow:'hidden' }}>
              <div style={{ position:'absolute', right:-20, top:-20, width:120, height:120, borderRadius:'50%', background:'rgba(18,166,126,0.15)' }} />
              <h3 style={{ color:'white', marginBottom:4, fontFamily:'var(--font-display)', fontSize:'1.4rem' }}>Welcome back, {user?.name?.split(' ')[0]}! 👋</h3>
              <p style={{ color:'rgba(255,255,255,0.55)', fontSize:'0.87rem' }}>Your students are waiting — let's make today count.</p>
            </div>

            <div className="grid-4" style={{ marginBottom:28 }}>
              {[
                { label:'My Students', value:students.length, icon:'👨‍🎓', bg:'rgba(59,114,245,0.10)', border:'rgba(59,114,245,0.20)' },
                { label:'Classes/Week', value:data.schedule?.length||0, icon:'📅', bg:'rgba(11,122,94,0.10)', border:'rgba(11,122,94,0.20)' },
                { label:'Pending Doubts', value:data.pendingDoubts?.length||0, icon:'❓', bg:'rgba(200,130,10,0.10)', border:'rgba(200,130,10,0.20)' },
                { label:'Homework Given', value:data.homework?.length||0, icon:'📝', bg:'rgba(26,58,143,0.10)', border:'rgba(26,58,143,0.20)' },
              ].map(s => (
                <div key={s.label} style={{ background:s.bg, borderRadius:16, padding:'18px 16px', border:`1px solid ${s.border}`, display:'flex', alignItems:'center', gap:14 }}>
                  <div style={{ width:48, height:48, borderRadius:13, background:'white', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.3rem', boxShadow:'var(--shadow-xs)' }}>{s.icon}</div>
                  <div>
                    <div style={{ fontSize:'1.6rem', fontWeight:800, color:'var(--text)', lineHeight:1, fontFamily:'var(--font-body)' }}>{s.value}</div>
                    <div style={{ fontSize:'0.75rem', color:'var(--text3)', marginTop:3, fontWeight:500 }}>{s.label}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:24 }}>
              <div style={card}>
                <h4 style={{ marginBottom:18, color:'var(--text)' }}>📅 This Week's Schedule</h4>
                {data.schedule?.length ? data.schedule.map(s => (
                  <div key={s.id} style={{ display:'flex', justifyContent:'space-between', padding:'10px 0', borderBottom:'1px solid var(--border)', fontSize:'0.875rem' }}>
                    <div><strong style={{ color:'var(--text)' }}>{s.student_name}</strong> <span style={{ color:'var(--text2)' }}>– {s.subject}</span></div>
                    <span className="badge badge-emerald" style={{ fontSize:'0.68rem' }}>{DAY[s.day_of_week]} {s.start_time?.slice(0,5)}</span>
                  </div>
                )) : <p style={{ color:'var(--text3)', fontSize:'0.88rem' }}>No schedule assigned.</p>}
              </div>
              <div style={card}>
                <h4 style={{ marginBottom:18, color:'var(--text)' }}>❓ Pending Doubts</h4>
                {data.pendingDoubts?.length ? data.pendingDoubts.map(d => (
                  <div key={d.id} style={{ padding:'12px 0', borderBottom:'1px solid var(--border)' }}>
                    <div style={{ fontSize:'0.87rem', fontWeight:600, color:'var(--text)', marginBottom:4 }}>{d.student_name} – {d.subject}</div>
                    <p style={{ fontSize:'0.82rem', color:'var(--text2)', marginBottom:8 }}>{d.question}</p>
                    <div style={{ display:'flex', gap:8 }}>
                      <input value={doubtAnswer[d.id]||''} onChange={e => setDoubtAnswer({...doubtAnswer,[d.id]:e.target.value})}
                        placeholder="Type answer…" className="form-input" style={{ flex:1, padding:'8px 12px', fontSize:'0.83rem' }} />
                      <button onClick={() => answerDoubt(d.id)} style={{ background:'linear-gradient(135deg,var(--emerald),var(--emerald2))', color:'white', fontWeight:700, padding:'8px 16px', borderRadius:8, border:'none', cursor:'pointer', fontSize:'0.83rem', fontFamily:'var(--font-body)', whiteSpace:'nowrap' }}>Answer</button>
                    </div>
                  </div>
                )) : <p style={{ color:'var(--text3)', fontSize:'0.88rem' }}>No pending doubts 🎉</p>}
              </div>
            </div>
          </div>
        )}

        {/* ── MY STUDENTS ── */}
        {activeTab==='My Students' && (
          <div style={card}>
            <h3 style={{ marginBottom:24, color:'var(--text)' }}>My Students</h3>
            {!tabData ? <div style={{ display:'flex', justifyContent:'center', padding:32 }}><div className="spinner"/></div>
              : tabData.length===0 ? <p style={{ color:'var(--text3)' }}>No students assigned yet.</p>
              : (
                <div className="table-wrap">
                  <table>
                    <thead><tr><th>Name</th><th>Class</th><th>Subject</th><th>Parent</th><th>Phone</th></tr></thead>
                    <tbody>
                      {tabData.map((s,i) => (
                        <tr key={`${s.id}-${i}`}>
                          <td><strong style={{ color:'var(--text)' }}>{s.name}</strong></td>
                          <td>Class {s.student_class}</td>
                          <td><span className="badge badge-emerald">{s.subject}</span></td>
                          <td style={{ color:'var(--text2)' }}>{s.parent_name||'-'}</td>
                          <td style={{ color:'var(--text2)' }}>{s.parent_phone||s.phone||'-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
          </div>
        )}

        {/* ── HOMEWORK ── */}
        {activeTab==='Homework' && (
          <div style={card}>
            <h3 style={{ marginBottom:24, color:'var(--text)' }}>Assign Homework</h3>
            <form onSubmit={submitHw} style={formGrid}>
              <div className="form-group" style={{ margin:0 }}><label className="form-label">Student *</label><StudentSelect value={hwForm.student_id} onChange={e => setHwForm({...hwForm,student_id:e.target.value})} /></div>
              <div className="form-group" style={{ margin:0 }}><label className="form-label">Subject</label><input value={hwForm.subject} onChange={e => setHwForm({...hwForm,subject:e.target.value})} className="form-input" placeholder="Subject" /></div>
              <div className="form-group" style={{ margin:0, gridColumn:'1/-1' }}><label className="form-label">Title *</label><input value={hwForm.title} onChange={e => setHwForm({...hwForm,title:e.target.value})} className="form-input" placeholder="Homework title" required /></div>
              <div className="form-group" style={{ margin:0, gridColumn:'1/-1' }}><label className="form-label">Description</label><textarea value={hwForm.description} onChange={e => setHwForm({...hwForm,description:e.target.value})} className="form-input" rows={3} placeholder="Instructions…" /></div>
              <div className="form-group" style={{ margin:0 }}><label className="form-label">Due Date</label><input type="date" value={hwForm.due_date} onChange={e => setHwForm({...hwForm,due_date:e.target.value})} className="form-input" /></div>
              <div style={{ display:'flex', alignItems:'flex-end' }}>
                <button type="submit" style={{ width:'100%', background:'linear-gradient(135deg,var(--emerald),var(--emerald2))', color:'white', fontWeight:700, padding:'13px', borderRadius:10, border:'none', cursor:'pointer', fontFamily:'var(--font-body)', boxShadow:'0 4px 16px rgba(11,122,94,0.30)' }}>Assign Homework →</button>
              </div>
            </form>
          </div>
        )}

        {/* ── PROGRESS ── */}
        {activeTab==='Progress' && (
          <div style={card}>
            <h3 style={{ marginBottom:24, color:'var(--text)' }}>Add Progress Report</h3>
            <form onSubmit={submitProg} style={formGrid}>
              <div className="form-group" style={{ margin:0 }}><label className="form-label">Student *</label><StudentSelect value={progForm.student_id} onChange={e => setProgForm({...progForm,student_id:e.target.value})} /></div>
              <div className="form-group" style={{ margin:0 }}><label className="form-label">Subject</label><input value={progForm.subject} onChange={e => setProgForm({...progForm,subject:e.target.value})} className="form-input" placeholder="Subject" /></div>
              <div className="form-group" style={{ margin:0 }}><label className="form-label">Score (%)</label><input type="number" min="0" max="100" value={progForm.score} onChange={e => setProgForm({...progForm,score:e.target.value})} className="form-input" placeholder="e.g. 85" /></div>
              <div className="form-group" style={{ margin:0 }}><label className="form-label">Report Date</label><input type="date" value={progForm.report_date} onChange={e => setProgForm({...progForm,report_date:e.target.value})} className="form-input" /></div>
              <div className="form-group" style={{ margin:0, gridColumn:'1/-1' }}><label className="form-label">Remarks</label><textarea value={progForm.remarks} onChange={e => setProgForm({...progForm,remarks:e.target.value})} className="form-input" rows={3} placeholder="Teacher's remarks for parents…" /></div>
              <button type="submit" style={{ gridColumn:'1/-1', background:'linear-gradient(135deg,var(--sapphire),var(--sapphire2))', color:'white', fontWeight:700, padding:'13px', borderRadius:10, border:'none', cursor:'pointer', fontFamily:'var(--font-body)', boxShadow:'0 4px 16px rgba(26,58,143,0.30)' }}>Save Progress Report →</button>
            </form>
          </div>
        )}

        {/* ── ATTENDANCE ── */}
        {activeTab==='Attendance' && (
          <div style={card}>
            <h3 style={{ marginBottom:24, color:'var(--text)' }}>Mark Attendance</h3>
            <form onSubmit={submitAtt} style={formGrid}>
              <div className="form-group" style={{ margin:0 }}><label className="form-label">Student *</label><StudentSelect value={attForm.student_id} onChange={e => setAttForm({...attForm,student_id:e.target.value})} /></div>
              <div className="form-group" style={{ margin:0 }}><label className="form-label">Subject</label><input value={attForm.subject} onChange={e => setAttForm({...attForm,subject:e.target.value})} className="form-input" placeholder="Subject" /></div>
              <div className="form-group" style={{ margin:0 }}><label className="form-label">Date *</label><input type="date" value={attForm.class_date} onChange={e => setAttForm({...attForm,class_date:e.target.value})} className="form-input" required /></div>
              <div className="form-group" style={{ margin:0 }}><label className="form-label">Status</label>
                <select value={attForm.status} onChange={e => setAttForm({...attForm,status:e.target.value})} className="form-input">
                  <option value="present">✅ Present</option>
                  <option value="absent">❌ Absent</option>
                  <option value="late">⏰ Late</option>
                </select>
              </div>
              <button type="submit" style={{ gridColumn:'1/-1', background:'linear-gradient(135deg,var(--amber),var(--amber2))', color:'var(--ink)', fontWeight:700, padding:'13px', borderRadius:10, border:'none', cursor:'pointer', fontFamily:'var(--font-body)', boxShadow:'0 4px 16px rgba(200,130,10,0.30)' }}>Mark Attendance →</button>
            </form>
          </div>
        )}

        {/* ── DOUBTS ── */}
        {activeTab==='Doubts' && (
          <div style={card}>
            <h3 style={{ marginBottom:24, color:'var(--text)' }}>Student Doubts</h3>
            {!data?.pendingDoubts?.length ? <p style={{ color:'var(--text3)' }}>No pending doubts. 🎉</p> :
              data.pendingDoubts.map(d => (
                <div key={d.id} style={{ padding:'16px 0', borderBottom:'1px solid var(--border)' }}>
                  <div style={{ display:'flex', gap:10, marginBottom:8, alignItems:'center' }}>
                    <span className="badge badge-sapphire">{d.subject}</span>
                    <span style={{ fontSize:'0.82rem', color:'var(--text2)', fontWeight:600 }}>{d.student_name}</span>
                  </div>
                  <p style={{ fontSize:'0.87rem', color:'var(--text2)', marginBottom:10 }}>{d.question}</p>
                  <div style={{ display:'flex', gap:10 }}>
                    <input value={doubtAnswer[d.id]||''} onChange={e => setDoubtAnswer({...doubtAnswer,[d.id]:e.target.value})}
                      placeholder="Type your answer…" className="form-input" style={{ flex:1, padding:'10px 14px' }} />
                    <button onClick={() => answerDoubt(d.id)} style={{ background:'linear-gradient(135deg,var(--emerald),var(--emerald2))', color:'white', fontWeight:700, padding:'10px 20px', borderRadius:10, border:'none', cursor:'pointer', fontFamily:'var(--font-body)', whiteSpace:'nowrap' }}>Answer →</button>
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* ── NOTES ── */}
        {activeTab==='Notes' && (
          <div style={card}>
            <h3 style={{ marginBottom:24, color:'var(--text)' }}>Upload Study Notes</h3>
            <form onSubmit={submitNote} style={formGrid}>
              <div className="form-group" style={{ margin:0 }}><label className="form-label">Student (blank = all)</label><StudentSelect value={noteForm.student_id} onChange={e => setNoteForm({...noteForm,student_id:e.target.value})} /></div>
              <div className="form-group" style={{ margin:0 }}><label className="form-label">Subject</label><input value={noteForm.subject} onChange={e => setNoteForm({...noteForm,subject:e.target.value})} className="form-input" placeholder="Subject" /></div>
              <div className="form-group" style={{ margin:0, gridColumn:'1/-1' }}><label className="form-label">Title *</label><input value={noteForm.title} onChange={e => setNoteForm({...noteForm,title:e.target.value})} className="form-input" placeholder="Notes title" required /></div>
              <div className="form-group" style={{ margin:0, gridColumn:'1/-1' }}><label className="form-label">Content</label><textarea value={noteForm.content} onChange={e => setNoteForm({...noteForm,content:e.target.value})} className="form-input" rows={5} placeholder="Write notes content…" /></div>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <input type="checkbox" id="public" checked={noteForm.is_public} onChange={e => setNoteForm({...noteForm,is_public:e.target.checked})} style={{ width:16, height:16, accentColor:'var(--emerald2)' }} />
                <label htmlFor="public" style={{ fontSize:'0.88rem', fontWeight:600, cursor:'pointer', color:'var(--text2)' }}>Visible to all students</label>
              </div>
              <button type="submit" style={{ background:'linear-gradient(135deg,var(--sapphire),var(--sapphire2))', color:'white', fontWeight:700, padding:'13px', borderRadius:10, border:'none', cursor:'pointer', fontFamily:'var(--font-body)', boxShadow:'0 4px 16px rgba(26,58,143,0.30)' }}>Save Notes →</button>
            </form>
          </div>
        )}

        {/* ── FEEDBACK ── */}
        {activeTab==='Feedback' && (
          <div style={card}>
            <h3 style={{ marginBottom:24, color:'var(--text)' }}>Give Student Feedback</h3>
            <form onSubmit={submitFb} style={formGrid}>
              <div className="form-group" style={{ margin:0 }}><label className="form-label">Student *</label><StudentSelect value={fbForm.student_id} onChange={e => setFbForm({...fbForm,student_id:e.target.value})} /></div>
              <div className="form-group" style={{ margin:0 }}><label className="form-label">Subject</label><input value={fbForm.subject} onChange={e => setFbForm({...fbForm,subject:e.target.value})} className="form-input" placeholder="Subject" /></div>
              <div className="form-group" style={{ margin:0, gridColumn:'1/-1' }}><label className="form-label">Feedback *</label><textarea value={fbForm.feedback} onChange={e => setFbForm({...fbForm,feedback:e.target.value})} className="form-input" rows={4} placeholder="Detailed feedback for student and parent…" required /></div>
              <div className="form-group" style={{ margin:0 }}><label className="form-label">Rating (1–5)</label>
                <select value={fbForm.rating} onChange={e => setFbForm({...fbForm,rating:e.target.value})} className="form-input">
                  {[5,4,3,2,1].map(r => <option key={r} value={r}>{r} ⭐</option>)}
                </select>
              </div>
              <div style={{ display:'flex', alignItems:'flex-end' }}>
                <button type="submit" style={{ width:'100%', background:'linear-gradient(135deg,var(--emerald),var(--emerald2))', color:'white', fontWeight:700, padding:'13px', borderRadius:10, border:'none', cursor:'pointer', fontFamily:'var(--font-body)', boxShadow:'0 4px 16px rgba(11,122,94,0.30)' }}>Submit Feedback →</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
