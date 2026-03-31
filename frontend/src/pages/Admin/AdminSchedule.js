import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../utils/api';

const inp = {width:'100%',padding:'11px 14px',background:'rgba(255,255,255,0.06)',border:'1px solid rgba(212,168,83,0.2)',borderRadius:10,color:'#fff',fontSize:'0.9rem',fontFamily:'var(--font-body)',outline:'none'};
const lbl = {display:'block',fontSize:'0.8rem',color:'var(--slate2)',marginBottom:5,fontWeight:600};
const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];

export default function AdminSchedule() {
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [form, setForm] = useState({student_id:'',teacher_id:'',subject:'',day_of_week:1,start_time:'17:00',duration_min:60});
  const [msg, setMsg] = useState({text:'',type:''});
  const showMsg = (text,type='success') => {setMsg({text,type}); setTimeout(()=>setMsg({text:'',type:''}),3000);};

  useEffect(() => {
    document.title = 'Schedule | Admin';
    api.get('/admin/users?role=student&limit=100')
      .then(r => setStudents(Array.isArray(r.data?.users) ? r.data.users : []))
      .catch(() => setStudents([]));
    api.get('/admin/users?role=teacher&limit=100')
      .then(r => setTeachers(Array.isArray(r.data?.users) ? r.data.users : []))
      .catch(() => setTeachers([]));
  }, []);

  const submit = async e => {
    e.preventDefault();
    try { await api.post('/admin/schedule', form); showMsg('Class scheduled!'); setForm({student_id:'',teacher_id:'',subject:'',day_of_week:1,start_time:'17:00',duration_min:60}); }
    catch(err) { showMsg(err.response?.data?.error||'Failed.','error'); }
  };

  return (
    <AdminLayout title="Schedule Classes">
      {msg.text && <div className={`alert alert-${msg.type}`} style={{marginBottom:16}}>{msg.text}</div>}
      <div style={{background:'#152238',border:'1px solid rgba(212,168,83,0.15)',borderRadius:16,padding:'24px 20px',maxWidth:560}}>
        <form onSubmit={submit} style={{display:'grid',gap:16}}>
          <div>
            <label style={lbl}>Student *</label>
            <select value={form.student_id} onChange={e=>setForm({...form,student_id:e.target.value})} style={inp} required>
              <option value="">-- Select Student --</option>
              {students.map(s=>(
                <option key={s.id} value={s.id}>
                  {s.name}{s.enrollment_no?` [${s.enrollment_no}]`:''} ({s.email})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label style={lbl}>Teacher *</label>
            <select value={form.teacher_id} onChange={e=>setForm({...form,teacher_id:e.target.value})} style={inp} required>
              <option value="">-- Select Teacher --</option>
              {teachers.map(t=>(
                <option key={t.id} value={t.id}>
                  {t.name}{t.teacher_code?` [${t.teacher_code}]`:''} ({t.email})
                </option>
              ))}
            </select>
          </div>
          <div><label style={lbl}>Subject</label><input value={form.subject} onChange={e=>setForm({...form,subject:e.target.value})} placeholder="e.g. Mathematics" style={inp}/></div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
            <div>
              <label style={lbl}>Day</label>
              <select value={form.day_of_week} onChange={e=>setForm({...form,day_of_week:e.target.value})} style={inp}>
                {DAYS.map((d,i)=><option key={i+1} value={i+1}>{d}</option>)}
              </select>
            </div>
            <div><label style={lbl}>Start Time</label><input type="time" value={form.start_time} onChange={e=>setForm({...form,start_time:e.target.value})} style={inp}/></div>
            <div><label style={lbl}>Duration (min)</label><input type="number" value={form.duration_min} onChange={e=>setForm({...form,duration_min:e.target.value})} style={inp}/></div>
          </div>
          <button type="submit" style={{padding:'13px',background:'var(--gold)',color:'var(--navy)',border:'none',borderRadius:10,fontWeight:700,cursor:'pointer',fontFamily:'var(--font-body)',fontSize:'0.95rem'}}>
            Schedule Class
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}
