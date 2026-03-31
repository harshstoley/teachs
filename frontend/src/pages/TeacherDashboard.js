import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const TABS = ['Overview','My Students','Schedule Class','Homework','Doubts','Progress','Attendance','Notes','Feedback'];
const DAY = ['','Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const STATUS_COLORS = { pending:'badge-amber', submitted:'badge-sapphire', graded:'badge-emerald', completed:'badge-emerald' };

const DAY_NAMES = ['','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];

function ScheduleTab({ students, showMsg }) {
  const [form, setForm] = useState({ student_id:'', subject:'', day_of_week:1, start_time:'17:00', duration_min:60 });
  const [schedules, setSchedules] = useState(null);
  const [reschedule, setReschedule] = useState(null);

  const load = () => api.get('/teacher/my-schedules').then(r=>setSchedules(r.data)).catch(()=>setSchedules([]));
  useEffect(()=>{ load(); }, []);

  const submit = async e => {
    e.preventDefault();
    try { await api.post('/teacher/schedule-class', form); showMsg('Class scheduled!'); setForm({student_id:'',subject:'',day_of_week:1,start_time:'17:00',duration_min:60}); load(); }
    catch { showMsg('Failed to schedule.','error'); }
  };

  const cancel = async id => {
    if (!window.confirm('Cancel this class?')) return;
    try { await api.put(`/teacher/schedules/${id}/cancel`); showMsg('Class cancelled.'); load(); }
    catch { showMsg('Failed.','error'); }
  };

  const submitReschedule = async e => {
    e.preventDefault();
    try { await api.put(`/teacher/schedules/${reschedule.id}/reschedule`, reschedule); showMsg('Rescheduled!'); setReschedule(null); load(); }
    catch { showMsg('Failed.','error'); }
  };

  const card = { background:'white', borderRadius:16, padding:24, border:'1px solid var(--border)', boxShadow:'var(--shadow-xs)' };

  return (
    <div style={{display:'grid',gap:24}}>
      {/* Add new class */}
      <div style={{...card,maxWidth:540}}>
        <h4 style={{marginBottom:20,color:'var(--text)'}}>Schedule a Class</h4>
        <form onSubmit={submit}>
          <div className="form-group">
            <label className="form-label">Student *</label>
            <select value={form.student_id} onChange={e=>setForm({...form,student_id:e.target.value})} className="form-input" required>
              <option value="">Select Student</option>
              {students.map(s=><option key={`${s.id}-${s.subject}`} value={s.id}>{s.name} (Cl {s.student_class}) – {s.subject}</option>)}
            </select>
          </div>
          <div className="form-group"><label className="form-label">Subject</label><input value={form.subject} onChange={e=>setForm({...form,subject:e.target.value})} className="form-input" placeholder="e.g. Mathematics"/></div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
            <div className="form-group">
              <label className="form-label">Day of Week</label>
              <select value={form.day_of_week} onChange={e=>setForm({...form,day_of_week:e.target.value})} className="form-input">
                {DAY_NAMES.slice(1).map((d,i)=><option key={i+1} value={i+1}>{d}</option>)}
              </select>
            </div>
            <div className="form-group"><label className="form-label">Start Time</label><input type="time" value={form.start_time} onChange={e=>setForm({...form,start_time:e.target.value})} className="form-input"/></div>
            <div className="form-group"><label className="form-label">Duration (min)</label><input type="number" value={form.duration_min} onChange={e=>setForm({...form,duration_min:e.target.value})} className="form-input"/></div>
          </div>
          <button type="submit" style={{background:'linear-gradient(135deg, var(--sapphire) 0%, var(--sapphire2) 100%)',color:'white',fontWeight:700,padding:'11px 22px',borderRadius:10,border:'none',cursor:'pointer',fontFamily:'var(--font-body)',width:'100%'}}>Schedule Class →</button>
        </form>
      </div>

      {/* Reschedule modal */}
      {reschedule && (
        <div className="modal-overlay" onClick={()=>setReschedule(null)}>
          <div className="modal-box" onClick={e=>e.stopPropagation()} style={{background:'white'}}>
            <h4 style={{marginBottom:20,color:'var(--text)'}}>Reschedule Class — {reschedule.student_name}</h4>
            <form onSubmit={submitReschedule}>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
                <div className="form-group">
                  <label className="form-label">New Day</label>
                  <select value={reschedule.day_of_week} onChange={e=>setReschedule({...reschedule,day_of_week:e.target.value})} className="form-input">
                    {DAY_NAMES.slice(1).map((d,i)=><option key={i+1} value={i+1}>{d}</option>)}
                  </select>
                </div>
                <div className="form-group"><label className="form-label">New Time</label><input type="time" value={reschedule.start_time} onChange={e=>setReschedule({...reschedule,start_time:e.target.value})} className="form-input"/></div>
                <div className="form-group"><label className="form-label">Duration (min)</label><input type="number" value={reschedule.duration_min} onChange={e=>setReschedule({...reschedule,duration_min:e.target.value})} className="form-input"/></div>
              </div>
              <div style={{display:'flex',gap:10}}>
                <button type="submit" style={{flex:1,padding:'11px',background:'linear-gradient(135deg, var(--sapphire) 0%, var(--sapphire2) 100%)',color:'white',border:'none',borderRadius:10,fontWeight:700,cursor:'pointer',fontFamily:'var(--font-body)'}}>Confirm Reschedule</button>
                <button type="button" onClick={()=>setReschedule(null)} style={{flex:1,padding:'11px',border:'1px solid var(--border)',borderRadius:10,background:'white',cursor:'pointer',fontFamily:'var(--font-body)',fontWeight:600}}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Schedule list */}
      <div style={card}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
          <h4 style={{color:'var(--text)'}}>My Scheduled Classes</h4>
          <button onClick={load} style={{fontSize:'0.8rem',color:'var(--sapphire)',background:'none',border:'none',cursor:'pointer',fontFamily:'var(--font-body)',fontWeight:600}}>↻ Refresh</button>
        </div>
        {!schedules ? <div style={{display:'flex',justifyContent:'center',padding:24}}><div className="spinner"/></div> :
         schedules.length===0 ? <p style={{color:'var(--text3)',fontSize:'0.88rem'}}>No classes scheduled yet.</p> : (
          schedules.map(s=>(
            <div key={s.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px 0',borderBottom:'1px solid var(--border)',flexWrap:'wrap',gap:8}}>
              <div>
                <div style={{fontWeight:600,fontSize:'0.9rem',color:'var(--text)'}}>{s.student_name} — {s.subject}</div>
                <div style={{fontSize:'0.75rem',color:'var(--text3)',marginTop:2}}>{DAY_NAMES[s.day_of_week]} · {s.start_time?.slice(0,5)} · {s.duration_min} min</div>
              </div>
              <div style={{display:'flex',gap:8}}>
                <button onClick={()=>setReschedule({...s})} style={{padding:'5px 12px',background:'rgba(59,114,245,0.08)',color:'var(--sapphire)',border:'1px solid rgba(59,114,245,0.2)',borderRadius:7,cursor:'pointer',fontSize:'0.78rem',fontFamily:'var(--font-body)',fontWeight:600}}>↻ Reschedule</button>
                <button onClick={()=>cancel(s.id)} style={{padding:'5px 12px',background:'rgba(220,38,38,0.08)',color:'#dc2626',border:'1px solid rgba(220,38,38,0.2)',borderRadius:7,cursor:'pointer',fontSize:'0.78rem',fontFamily:'var(--font-body)',fontWeight:600}}>✕ Cancel</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default function TeacherDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('Overview');
  const [data, setData] = useState(null);
  const [tabData, setTabData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState({ text:'', type:'' });
  const showMsg = (text, type='success') => { setMsg({text,type}); setTimeout(()=>setMsg({text:'',type:''}),3000); };

  // Forms
  const [hwForm, setHwForm] = useState({ student_id:'', subject:'', title:'', description:'', due_date:'' });
  const [progForm, setProgForm] = useState({ student_id:'', subject:'', score:'', remarks:'', report_date:'' });
  const [attForm, setAttForm] = useState({ student_id:'', class_date:'', status:'present', subject:'' });
  const [noteForm, setNoteForm] = useState({ student_id:'', subject:'', title:'', content:'', is_public:false });
  const [fbForm, setFbForm] = useState({ student_id:'', subject:'', feedback:'', rating:5 });
  const [schedForm, setSchedForm] = useState({ student_id:'', subject:'', day_of_week:1, start_time:'17:00', duration_min:60 });
  const [doubtAnswer, setDoubtAnswer] = useState({});
  const [editHw, setEditHw] = useState(null); // homework being edited

  useEffect(() => {
    document.title = 'Teacher Dashboard | Teachs';
    api.get('/teacher/dashboard').then(r=>setData(r.data)).catch(()=>{}).finally(()=>setLoading(false));
  }, []);

  useEffect(() => {
    if (activeTab === 'Overview') return;
    setTabData(null);
    const ep = {
      'My Students': '/teacher/students',
      'Homework': '/teacher/homework-all',
      'Doubts': '/teacher/doubts-for-me',
    };
    if (ep[activeTab]) { api.get(ep[activeTab]).then(r=>setTabData(r.data)).catch(()=>setTabData([])); }
  }, [activeTab]);

  const reload = () => {
    if (activeTab === 'Homework') api.get('/teacher/homework-all').then(r=>setTabData(r.data)).catch(()=>{});
    if (activeTab === 'Doubts') api.get('/teacher/doubts-for-me').then(r=>setTabData(r.data)).catch(()=>{});
  };

  const submitHw = async e => {
    e.preventDefault();
    try { await api.post('/teacher/homework', hwForm); showMsg('Homework assigned!'); setHwForm({student_id:'',subject:'',title:'',description:'',due_date:''}); reload(); }
    catch { showMsg('Failed.','error'); }
  };

  const updateHw = async e => {
    e.preventDefault();
    try { await api.put(`/teacher/homework/${editHw.id}`, editHw); showMsg('Homework updated!'); setEditHw(null); reload(); }
    catch { showMsg('Failed.','error'); }
  };

  const markHwStatus = async (id, status) => {
    try { await api.put(`/teacher/homework/${id}`, { ...tabData.find(h=>h.id===id), status }); showMsg(`Marked as ${status}!`); reload(); }
    catch { showMsg('Failed.','error'); }
  };

  const answerDoubt = async (id, markExplained=false) => {
    const answer = doubtAnswer[id];
    if (!answer && !markExplained) return showMsg('Type an answer first','error');
    try {
      await api.put(`/teacher/doubts/${id}`, { answer: answer || 'Explained in class', status: 'answered' });
      showMsg(markExplained ? 'Marked as explained!' : 'Doubt answered!');
      setDoubtAnswer(prev => { const n={...prev}; delete n[id]; return n; });
      reload();
    } catch { showMsg('Failed.','error'); }
  };

  const submitProg = async e => { e.preventDefault(); try { await api.post('/teacher/progress', progForm); showMsg('Progress added!'); setProgForm({student_id:'',subject:'',score:'',remarks:'',report_date:''}); } catch { showMsg('Failed.','error'); } };
  const submitAtt  = async e => { e.preventDefault(); try { await api.post('/teacher/attendance', attForm); showMsg('Attendance marked!'); } catch { showMsg('Failed.','error'); } };
  const submitNote = async e => { e.preventDefault(); try { await api.post('/teacher/notes', noteForm); showMsg('Notes saved!'); setNoteForm({student_id:'',subject:'',title:'',content:'',is_public:false}); } catch { showMsg('Failed.','error'); } };
  const submitFb   = async e => { e.preventDefault(); try { await api.post('/teacher/feedback', fbForm); showMsg('Feedback submitted!'); setFbForm({student_id:'',subject:'',feedback:'',rating:5}); } catch { showMsg('Failed.','error'); } };
  const submitSched= async e => { e.preventDefault(); try { await api.post('/teacher/schedule-class', schedForm); showMsg('Class scheduled!'); setSchedForm({student_id:'',subject:'',day_of_week:1,start_time:'17:00',duration_min:60}); } catch { showMsg('Failed.','error'); } };

  const students = data?.students || [];

  if (loading) return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',background:'var(--ink)',flexDirection:'column',gap:16}}>
      <div className="spinner" style={{width:48,height:48}}/><p style={{color:'rgba(255,255,255,0.35)',fontSize:'0.85rem'}}>Loading teacher portal…</p>
    </div>
  );

  const StudentSelect = ({ value, onChange }) => (
    <select value={value} onChange={onChange} className="form-input" required>
      <option value="">Select Student</option>
      {students.map(s=><option key={`${s.id}-${s.subject}`} value={s.id}>{s.name} (Cl {s.student_class}) – {s.subject}</option>)}
    </select>
  );

  const card = { background:'white', borderRadius:16, padding:28, border:'1px solid var(--border)', boxShadow:'var(--shadow-xs)' };
  const fgrid = { display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 };
  const btn = (color='sapphire') => ({ background:`linear-gradient(135deg, var(--${color}) 0%, var(--${color}2) 100%)`, color:'white', fontWeight:700, padding:'11px 22px', borderRadius:10, border:'none', cursor:'pointer', fontFamily:'var(--font-body)', width:'100%' });

  return (
    <div style={{minHeight:'100vh',background:'var(--bg)',display:'flex',flexDirection:'column'}}>
      {/* Topbar */}
      <div style={{background:'var(--ink)',height:66,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 24px',position:'sticky',top:0,zIndex:50,borderBottom:'1px solid rgba(59,114,245,0.15)',backdropFilter:'blur(12px)'}}>
        <div style={{display:'flex',alignItems:'center',gap:14}}>
          <span style={{fontFamily:'var(--font-display)',fontSize:'1.4rem',fontWeight:700,color:'white'}}>Teach<span style={{color:'var(--amber2)'}}>s</span></span>
          <div style={{height:20,width:1,background:'rgba(255,255,255,0.12)'}}/><span style={{fontSize:'0.75rem',color:'rgba(255,255,255,0.35)',fontWeight:500,letterSpacing:'0.08em',textTransform:'uppercase'}}>Teacher Portal</span>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <div style={{background:'rgba(59,114,245,0.15)',border:'1px solid rgba(59,114,245,0.25)',borderRadius:10,padding:'6px 14px',display:'flex',alignItems:'center',gap:8}}>
            <div style={{width:28,height:28,borderRadius:'50%',background:'linear-gradient(135deg, var(--sapphire) 0%, var(--sky) 100%)',display:'flex',alignItems:'center',justifyContent:'center',color:'white',fontWeight:700,fontSize:'0.85rem'}}>{user?.name?.[0]}</div>
            <span style={{color:'rgba(255,255,255,0.75)',fontSize:'0.87rem',fontWeight:500}}>{user?.name?.split(' ')[0]}</span>
          </div>
          <button onClick={logout} style={{background:'rgba(255,255,255,0.07)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:10,padding:'8px 16px',color:'rgba(255,255,255,0.65)',fontSize:'0.84rem',cursor:'pointer',fontFamily:'var(--font-body)'}}>Logout</button>
        </div>
      </div>

      <div style={{maxWidth:1120,margin:'0 auto',width:'100%',padding:'28px 20px'}}>
        {msg.text && <div className={`alert alert-${msg.type}`} style={{marginBottom:20}}>{msg.text}</div>}

        <div className="tab-scroll" style={{marginBottom:28}}>
          {TABS.map(t=><button key={t} onClick={()=>setActiveTab(t)} className={`tab-btn${activeTab===t?' active':''}`}>{t}</button>)}
        </div>

        {/* OVERVIEW */}
        {activeTab==='Overview' && data && (
          <div>
            <div style={{background:'linear-gradient(135deg, var(--sapphire) 0%, var(--ink2) 100%)',borderRadius:20,padding:'24px 28px',marginBottom:24,position:'relative',overflow:'hidden'}}>
              <div style={{position:'absolute',right:-20,top:-20,width:120,height:120,borderRadius:'50%',background:'rgba(59,114,245,0.15)'}}/>
              <h3 style={{color:'white',marginBottom:4,fontFamily:'var(--font-display)',fontSize:'1.4rem'}}>Welcome, {user?.name?.split(' ')[0]}! 👨‍🏫</h3>
              <p style={{color:'rgba(255,255,255,0.55)',fontSize:'0.87rem'}}>Manage your students and classes.</p>
            </div>
            <div className="grid-4" style={{marginBottom:24}}>
              {[
                {label:'My Students',value:students.length,icon:'👨‍🎓',bg:'rgba(59,114,245,0.10)',border:'rgba(59,114,245,0.20)'},
                {label:'Classes/Week',value:data.schedule?.length||0,icon:'📅',bg:'rgba(11,122,94,0.10)',border:'rgba(11,122,94,0.20)'},
                {label:'Pending Doubts',value:data.pendingDoubts?.length||0,icon:'❓',bg:'rgba(200,130,10,0.10)',border:'rgba(200,130,10,0.20)'},
                {label:'Homework Given',value:data.homework?.length||0,icon:'📝',bg:'rgba(26,58,143,0.10)',border:'rgba(26,58,143,0.20)'},
              ].map(s=>(
                <div key={s.label} style={{background:s.bg,borderRadius:16,padding:'18px 16px',border:`1px solid ${s.border}`,display:'flex',alignItems:'center',gap:14}}>
                  <div style={{width:48,height:48,borderRadius:13,background:'white',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.3rem',boxShadow:'var(--shadow-xs)'}}>{s.icon}</div>
                  <div><div style={{fontSize:'1.6rem',fontWeight:800,color:'var(--text)',lineHeight:1,fontFamily:'var(--font-body)'}}>{s.value}</div><div style={{fontSize:'0.75rem',color:'var(--text3)',marginTop:3,fontWeight:500}}>{s.label}</div></div>
                </div>
              ))}
            </div>
            <div className="grid-2">
              <div style={card}>
                <h4 style={{marginBottom:16,color:'var(--text)'}}>Today's Pending Doubts</h4>
                {data.pendingDoubts?.length ? data.pendingDoubts.slice(0,4).map(d=>(
                  <div key={d.id} style={{padding:'10px 0',borderBottom:'1px solid var(--border)'}}>
                    <div style={{fontWeight:600,fontSize:'0.85rem',color:'var(--sapphire)',marginBottom:2}}>{d.student_name} – {d.subject||'General'}</div>
                    <p style={{fontSize:'0.82rem',color:'var(--text2)',marginBottom:6}}>{d.question?.slice(0,80)}...</p>
                    <button onClick={()=>setActiveTab('Doubts')} style={{fontSize:'0.75rem',color:'var(--sapphire)',background:'none',border:'none',cursor:'pointer',padding:0,fontFamily:'var(--font-body)',fontWeight:600}}>Answer →</button>
                  </div>
                )) : <p style={{color:'var(--text3)',fontSize:'0.88rem'}}>No pending doubts 🎉</p>}
              </div>
              <div style={card}>
                <h4 style={{marginBottom:16,color:'var(--text)'}}>Schedule</h4>
                {data.schedule?.length ? data.schedule.map(s=>(
                  <div key={s.id} style={{display:'flex',justifyContent:'space-between',padding:'9px 0',borderBottom:'1px solid var(--border)',fontSize:'0.875rem'}}>
                    <div><strong style={{color:'var(--text)'}}>{s.student_name}</strong> <span style={{color:'var(--text2)'}}>– {s.subject}</span></div>
                    <span className="badge badge-sapphire" style={{fontSize:'0.68rem'}}>{DAY[s.day_of_week]} {s.start_time?.slice(0,5)}</span>
                  </div>
                )) : <p style={{color:'var(--text3)',fontSize:'0.88rem'}}>No schedule assigned.</p>}
              </div>
            </div>
          </div>
        )}

        {/* MY STUDENTS */}
        {activeTab==='My Students' && (
          <div style={card}>
            <h4 style={{marginBottom:20,color:'var(--text)'}}>My Students</h4>
            {!tabData ? <div style={{display:'flex',justifyContent:'center',padding:32}}><div className="spinner"/></div> :
             tabData.length===0 ? <p style={{color:'var(--text3)',fontSize:'0.88rem'}}>No students assigned yet.</p> : (
              tabData.map((s,i)=>(
                <div key={`${s.id}-${i}`} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px 0',borderBottom:'1px solid var(--border)',flexWrap:'wrap',gap:8}}>
                  <div style={{display:'flex',alignItems:'center',gap:12}}>
                    <div style={{width:38,height:38,borderRadius:'50%',background:'linear-gradient(135deg, var(--sapphire) 0%, var(--sky) 100%)',display:'flex',alignItems:'center',justifyContent:'center',color:'white',fontWeight:700}}>{s.name[0]}</div>
                    <div><div style={{fontWeight:600,fontSize:'0.9rem',color:'var(--text)'}}>{s.name}</div><div style={{fontSize:'0.75rem',color:'var(--text3)'}}>Class {s.student_class} · {s.parent_name||'No parent info'}</div></div>
                  </div>
                  <span className="badge badge-sapphire">{s.subject}</span>
                </div>
              ))
            )}
          </div>
        )}

        {/* SCHEDULE CLASS */}
        {activeTab==='Schedule Class' && (
          <ScheduleTab students={students} showMsg={showMsg} />
        )}

        {/* HOMEWORK — assign + manage */}
        {activeTab==='Homework' && (
          <div style={{display:'grid',gap:24}}>
            {/* Assign form */}
            <div style={{...card,maxWidth:560}}>
              <h4 style={{marginBottom:20,color:'var(--text)'}}>Assign New Homework</h4>
              <form onSubmit={submitHw}>
                <div className="form-group"><label className="form-label">Student *</label><StudentSelect value={hwForm.student_id} onChange={e=>setHwForm({...hwForm,student_id:e.target.value})}/></div>
                <div style={fgrid}>
                  <div className="form-group"><label className="form-label">Subject</label><input value={hwForm.subject} onChange={e=>setHwForm({...hwForm,subject:e.target.value})} className="form-input"/></div>
                  <div className="form-group"><label className="form-label">Due Date</label><input type="date" value={hwForm.due_date} onChange={e=>setHwForm({...hwForm,due_date:e.target.value})} className="form-input"/></div>
                </div>
                <div className="form-group"><label className="form-label">Title *</label><input value={hwForm.title} onChange={e=>setHwForm({...hwForm,title:e.target.value})} required className="form-input" placeholder="Homework title"/></div>
                <div className="form-group"><label className="form-label">Description</label><textarea value={hwForm.description} onChange={e=>setHwForm({...hwForm,description:e.target.value})} className="form-input" rows={3} placeholder="Instructions..."/></div>
                <button type="submit" style={btn()}>Assign Homework →</button>
              </form>
            </div>

            {/* Edit modal */}
            {editHw && (
              <div className="modal-overlay" onClick={()=>setEditHw(null)}>
                <div className="modal-box" onClick={e=>e.stopPropagation()} style={{background:'white'}}>
                  <h4 style={{marginBottom:20,color:'var(--text)'}}>Edit Homework</h4>
                  <form onSubmit={updateHw}>
                    <div className="form-group"><label className="form-label">Title *</label><input value={editHw.title} onChange={e=>setEditHw({...editHw,title:e.target.value})} required className="form-input"/></div>
                    <div className="form-group"><label className="form-label">Description</label><textarea value={editHw.description||''} onChange={e=>setEditHw({...editHw,description:e.target.value})} className="form-input" rows={3}/></div>
                    <div style={fgrid}>
                      <div className="form-group"><label className="form-label">Due Date</label><input type="date" value={editHw.due_date?.slice(0,10)||''} onChange={e=>setEditHw({...editHw,due_date:e.target.value})} className="form-input"/></div>
                      <div className="form-group"><label className="form-label">Status</label>
                        <select value={editHw.status} onChange={e=>setEditHw({...editHw,status:e.target.value})} className="form-input">
                          <option value="pending">Pending</option><option value="submitted">Submitted</option><option value="graded">Graded</option>
                        </select>
                      </div>
                    </div>
                    {editHw.status==='graded' && (
                      <div className="form-group"><label className="form-label">Grade</label><input value={editHw.grade||''} onChange={e=>setEditHw({...editHw,grade:e.target.value})} className="form-input" placeholder="e.g. A, 90%"/></div>
                    )}
                    <div style={{display:'flex',gap:10}}>
                      <button type="submit" style={{...btn(),flex:1}}>Save Changes</button>
                      <button type="button" onClick={()=>setEditHw(null)} style={{flex:1,padding:'11px',borderRadius:10,border:'1px solid var(--border)',background:'white',cursor:'pointer',fontFamily:'var(--font-body)',fontWeight:600}}>Cancel</button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Homework list */}
            <div style={card}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16,flexWrap:'wrap',gap:8}}>
                <h4 style={{color:'var(--text)'}}>All Assigned Homework</h4>
                <button onClick={reload} style={{fontSize:'0.8rem',color:'var(--sapphire)',background:'none',border:'none',cursor:'pointer',fontFamily:'var(--font-body)',fontWeight:600}}>↻ Refresh</button>
              </div>
              {!tabData ? <div style={{display:'flex',justifyContent:'center',padding:32}}><div className="spinner"/></div> :
               tabData.length===0 ? <p style={{color:'var(--text3)',fontSize:'0.88rem'}}>No homework assigned yet.</p> : (
                <div>
                  {tabData.map(hw=>(
                    <div key={hw.id} style={{padding:'14px 0',borderBottom:'1px solid var(--border)'}}>
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',flexWrap:'wrap',gap:8,marginBottom:6}}>
                        <div>
                          <div style={{fontWeight:700,fontSize:'0.9rem',color:'var(--text)'}}>{hw.title}</div>
                          <div style={{fontSize:'0.75rem',color:'var(--text3)',marginTop:2}}>
                            For: <strong>{hw.student_name}</strong> · {hw.subject}
                            {hw.created_at && <span> · Assigned: {new Date(hw.created_at).toLocaleDateString('en-IN')}</span>}
                            {hw.due_date && <span> · Due: {new Date(hw.due_date).toLocaleDateString('en-IN')}</span>}
                          </div>
                          {hw.description && <p style={{fontSize:'0.82rem',color:'var(--text2)',marginTop:4}}>{hw.description}</p>}
                          {hw.grade && <div style={{fontSize:'0.82rem',fontWeight:700,color:'var(--emerald2)',marginTop:4}}>Grade: {hw.grade}</div>}
                          {hw.submission_text && <div style={{fontSize:'0.8rem',color:'var(--sapphire)',marginTop:4,background:'rgba(59,114,245,0.06)',padding:'6px 10px',borderRadius:8}}>Student: {hw.submission_text?.slice(0,100)}</div>}
                        </div>
                        <span className={`badge ${STATUS_COLORS[hw.status]||'badge-amber'}`}>{hw.status}</span>
                      </div>
                      {/* Action buttons */}
                      <div style={{display:'flex',gap:8,flexWrap:'wrap',marginTop:8}}>
                        <button onClick={()=>setEditHw({...hw})} style={{padding:'5px 12px',background:'rgba(59,114,245,0.08)',color:'var(--sapphire)',border:'1px solid rgba(59,114,245,0.2)',borderRadius:7,cursor:'pointer',fontSize:'0.78rem',fontFamily:'var(--font-body)',fontWeight:600}}>✏️ Edit</button>
                        {hw.status==='pending' && <button onClick={()=>markHwStatus(hw.id,'completed')} style={{padding:'5px 12px',background:'rgba(11,122,94,0.08)',color:'var(--emerald2)',border:'1px solid rgba(11,122,94,0.2)',borderRadius:7,cursor:'pointer',fontSize:'0.78rem',fontFamily:'var(--font-body)',fontWeight:600}}>✓ Mark Completed</button>}
                        {hw.status==='submitted' && <button onClick={()=>setEditHw({...hw,status:'graded'})} style={{padding:'5px 12px',background:'rgba(200,130,10,0.08)',color:'var(--amber)',border:'1px solid rgba(200,130,10,0.2)',borderRadius:7,cursor:'pointer',fontSize:'0.78rem',fontFamily:'var(--font-body)',fontWeight:600}}>⭐ Grade</button>}
                        {hw.status==='completed'&&<span style={{fontSize:'0.75rem',color:'var(--emerald2)',fontWeight:600}}>✓ Completed</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* DOUBTS — from students */}
        {activeTab==='Doubts' && (
          <div style={card}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20,flexWrap:'wrap',gap:8}}>
              <h4 style={{color:'var(--text)'}}>Doubts From My Students</h4>
              <button onClick={reload} style={{fontSize:'0.8rem',color:'var(--sapphire)',background:'none',border:'none',cursor:'pointer',fontFamily:'var(--font-body)',fontWeight:600}}>↻ Refresh</button>
            </div>
            {!tabData ? <div style={{display:'flex',justifyContent:'center',padding:32}}><div className="spinner"/></div> :
             tabData.length===0 ? <p style={{color:'var(--text3)',fontSize:'0.88rem'}}>No doubts yet 🎉</p> : (
              <div>
                {tabData.map(d=>(
                  <div key={d.id} style={{padding:'16px 0',borderBottom:'1px solid var(--border)'}}>
                    <div style={{display:'flex',justifyContent:'space-between',marginBottom:8,flexWrap:'wrap',gap:6}}>
                      <div style={{display:'flex',gap:8,alignItems:'center'}}>
                        <div style={{width:32,height:32,borderRadius:'50%',background:'linear-gradient(135deg, var(--sapphire) 0%, var(--sky) 100%)',display:'flex',alignItems:'center',justifyContent:'center',color:'white',fontWeight:700,fontSize:'0.85rem'}}>{d.student_name?.[0]}</div>
                        <div>
                          <span style={{fontWeight:700,fontSize:'0.88rem',color:'var(--sapphire)'}}>{d.student_name}</span>
                          {d.subject && <span className="badge badge-sapphire" style={{marginLeft:8,fontSize:'0.65rem'}}>{d.subject}</span>}
                        </div>
                      </div>
                      <div style={{display:'flex',gap:6,alignItems:'center'}}>
                        <span className={`badge ${d.status==='answered'?'badge-emerald':'badge-amber'}`}>{d.status==='answered'?'✓ Answered':'⏳ Pending'}</span>
                        <span style={{fontSize:'0.72rem',color:'var(--text3)'}}>{new Date(d.created_at).toLocaleDateString('en-IN')}</span>
                      </div>
                    </div>
                    <p style={{fontSize:'0.88rem',color:'var(--text)',fontWeight:500,marginBottom:d.status==='pending'?12:d.answer?8:0,background:'rgba(59,114,245,0.04)',padding:'10px 14px',borderRadius:8,borderLeft:'3px solid rgba(59,114,245,0.3)'}}>{d.question}</p>
                    {d.answer && <div style={{background:'var(--lavender)',borderRadius:8,padding:'10px 14px',fontSize:'0.84rem',color:'var(--sapphire)',borderLeft:'3px solid var(--sky)',marginBottom:d.status==='pending'?8:0}}><strong>Answer:</strong> {d.answer}</div>}
                    {d.status==='pending' && (
                      <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                        <input value={doubtAnswer[d.id]||''} onChange={e=>setDoubtAnswer({...doubtAnswer,[d.id]:e.target.value})} placeholder="Type your answer..." className="form-input" style={{flex:1,minWidth:200}}/>
                        <button onClick={()=>answerDoubt(d.id)} style={{padding:'10px 18px',background:`linear-gradient(135deg, var(--sapphire) 0%, var(--sapphire2) 100%)`,color:'white',border:'none',borderRadius:10,fontWeight:700,cursor:'pointer',fontFamily:'var(--font-body)',whiteSpace:'nowrap'}}>Send Answer</button>
                        <button onClick={()=>answerDoubt(d.id,true)} style={{padding:'10px 16px',background:'rgba(11,122,94,0.1)',color:'var(--emerald2)',border:'1px solid rgba(11,122,94,0.25)',borderRadius:10,fontWeight:600,cursor:'pointer',fontFamily:'var(--font-body)',whiteSpace:'nowrap',fontSize:'0.85rem'}}>✓ Mark Explained</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PROGRESS */}
        {activeTab==='Progress' && (
          <div style={{...card,maxWidth:540}}>
            <h4 style={{marginBottom:20,color:'var(--text)'}}>Add Progress Report</h4>
            <form onSubmit={submitProg}>
              <div className="form-group"><label className="form-label">Student *</label><StudentSelect value={progForm.student_id} onChange={e=>setProgForm({...progForm,student_id:e.target.value})}/></div>
              <div style={fgrid}>
                <div className="form-group"><label className="form-label">Subject</label><input value={progForm.subject} onChange={e=>setProgForm({...progForm,subject:e.target.value})} className="form-input"/></div>
                <div className="form-group"><label className="form-label">Score (%)</label><input type="number" min="0" max="100" value={progForm.score} onChange={e=>setProgForm({...progForm,score:e.target.value})} className="form-input" placeholder="85"/></div>
                <div className="form-group"><label className="form-label">Report Date</label><input type="date" value={progForm.report_date} onChange={e=>setProgForm({...progForm,report_date:e.target.value})} className="form-input"/></div>
              </div>
              <div className="form-group"><label className="form-label">Remarks</label><textarea value={progForm.remarks} onChange={e=>setProgForm({...progForm,remarks:e.target.value})} rows={3} className="form-input" placeholder="Teacher remarks for parents..."/></div>
              <button type="submit" style={btn()}>Save Report →</button>
            </form>
          </div>
        )}

        {/* ATTENDANCE */}
        {activeTab==='Attendance' && (
          <div style={{...card,maxWidth:480}}>
            <h4 style={{marginBottom:20,color:'var(--text)'}}>Mark Attendance</h4>
            <form onSubmit={submitAtt}>
              <div className="form-group"><label className="form-label">Student *</label><StudentSelect value={attForm.student_id} onChange={e=>setAttForm({...attForm,student_id:e.target.value})}/></div>
              <div style={fgrid}>
                <div className="form-group"><label className="form-label">Subject</label><input value={attForm.subject} onChange={e=>setAttForm({...attForm,subject:e.target.value})} className="form-input"/></div>
                <div className="form-group"><label className="form-label">Date *</label><input type="date" value={attForm.class_date} onChange={e=>setAttForm({...attForm,class_date:e.target.value})} required className="form-input"/></div>
              </div>
              <div className="form-group"><label className="form-label">Status</label><select value={attForm.status} onChange={e=>setAttForm({...attForm,status:e.target.value})} className="form-input"><option value="present">Present</option><option value="absent">Absent</option><option value="late">Late</option></select></div>
              <button type="submit" style={btn()}>Mark Attendance →</button>
            </form>
          </div>
        )}

        {/* NOTES */}
        {activeTab==='Notes' && (
          <div style={{...card,maxWidth:540}}>
            <h4 style={{marginBottom:20,color:'var(--text)'}}>Upload Study Notes</h4>
            <form onSubmit={submitNote}>
              <div className="form-group"><label className="form-label">Student (blank = all)</label><StudentSelect value={noteForm.student_id} onChange={e=>setNoteForm({...noteForm,student_id:e.target.value})}/></div>
              <div style={fgrid}>
                <div className="form-group"><label className="form-label">Subject</label><input value={noteForm.subject} onChange={e=>setNoteForm({...noteForm,subject:e.target.value})} className="form-input"/></div>
                <div className="form-group"><label className="form-label">Title *</label><input value={noteForm.title} onChange={e=>setNoteForm({...noteForm,title:e.target.value})} required className="form-input"/></div>
              </div>
              <div className="form-group"><label className="form-label">Content</label><textarea value={noteForm.content} onChange={e=>setNoteForm({...noteForm,content:e.target.value})} rows={5} className="form-input"/></div>
              <label style={{display:'flex',gap:8,alignItems:'center',color:'var(--text2)',fontSize:'0.88rem',cursor:'pointer',marginBottom:16}}><input type="checkbox" checked={noteForm.is_public} onChange={e=>setNoteForm({...noteForm,is_public:e.target.checked})}/>Visible to all my students</label>
              <button type="submit" style={btn()}>Save Notes →</button>
            </form>
          </div>
        )}

        {/* FEEDBACK */}
        {activeTab==='Feedback' && (
          <div style={{...card,maxWidth:480}}>
            <h4 style={{marginBottom:20,color:'var(--text)'}}>Give Student Feedback</h4>
            <form onSubmit={submitFb}>
              <div className="form-group"><label className="form-label">Student *</label><StudentSelect value={fbForm.student_id} onChange={e=>setFbForm({...fbForm,student_id:e.target.value})}/></div>
              <div style={fgrid}>
                <div className="form-group"><label className="form-label">Subject</label><input value={fbForm.subject} onChange={e=>setFbForm({...fbForm,subject:e.target.value})} className="form-input"/></div>
                <div className="form-group"><label className="form-label">Rating</label><select value={fbForm.rating} onChange={e=>setFbForm({...fbForm,rating:e.target.value})} className="form-input">{[5,4,3,2,1].map(r=><option key={r} value={r}>{r} ⭐</option>)}</select></div>
              </div>
              <div className="form-group"><label className="form-label">Feedback *</label><textarea value={fbForm.feedback} onChange={e=>setFbForm({...fbForm,feedback:e.target.value})} rows={4} required className="form-input" placeholder="Detailed feedback for student and parent..."/></div>
              <button type="submit" style={btn()}>Submit Feedback →</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
