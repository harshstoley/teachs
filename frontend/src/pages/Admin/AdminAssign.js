import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../utils/api';

const inp = {width:'100%',padding:'11px 14px',background:'rgba(255,255,255,0.06)',border:'1px solid rgba(212,168,83,0.2)',borderRadius:10,color:'#fff',fontSize:'0.9rem',fontFamily:'var(--font-body)',outline:'none'};

export default function AdminAssign() {
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [form, setForm] = useState({student_id:'',teacher_id:'',subject:'',notes:''});
  const [msg, setMsg] = useState({text:'',type:''});
  const showMsg = (text,type='success') => {setMsg({text,type}); setTimeout(()=>setMsg({text:'',type:''}),3000);};

  useEffect(() => {
    document.title = 'Assign | Admin';
    api.get('/admin/users?role=student&limit=100')
      .then(r => setStudents(Array.isArray(r.data.users) ? r.data.users : []))
      .catch(() => setStudents([]));
    api.get('/admin/users?role=teacher&limit=100')
      .then(r => setTeachers(Array.isArray(r.data.users) ? r.data.users : []))
      .catch(() => setTeachers([]));
  }, []);

  const assign = async e => {
    e.preventDefault();
    try {
      await api.post('/admin/assign-teacher', form);
      showMsg('Teacher assigned successfully!');
      setForm({student_id:'',teacher_id:'',subject:'',notes:''});
    } catch(err) { showMsg(err.response?.data?.error||'Failed.','error'); }
  };

  return (
    <AdminLayout title="Assign Teachers to Students" subtitle="Dual-Teacher Model — assign 2 teachers per student">
      {msg.text && <div className={`alert alert-${msg.type}`} style={{marginBottom:16}}>{msg.text}</div>}
      <div style={{background:'#152238',border:'1px solid rgba(212,168,83,0.15)',borderRadius:16,padding:'24px 20px',maxWidth:560}}>
        <form onSubmit={assign} style={{display:'grid',gap:16}}>
          <div>
            <label style={{display:'block',fontSize:'0.8rem',color:'var(--slate2)',marginBottom:5,fontWeight:600}}>Select Student *</label>
            <select value={form.student_id} onChange={e=>setForm({...form,student_id:e.target.value})} style={inp} required>
              <option value="">-- Choose Student --</option>
              {students.map(s=>(
                <option key={s.id} value={s.id}>
                  {s.name} {s.enrollment_no?`[${s.enrollment_no}]`:''} ({s.email})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label style={{display:'block',fontSize:'0.8rem',color:'var(--slate2)',marginBottom:5,fontWeight:600}}>Select Teacher *</label>
            <select value={form.teacher_id} onChange={e=>setForm({...form,teacher_id:e.target.value})} style={inp} required>
              <option value="">-- Choose Teacher --</option>
              {teachers.map(t=>(
                <option key={t.id} value={t.id}>
                  {t.name} {t.teacher_code?`[${t.teacher_code}]`:''} ({t.email})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label style={{display:'block',fontSize:'0.8rem',color:'var(--slate2)',marginBottom:5,fontWeight:600}}>Subject Group</label>
            <input value={form.subject} onChange={e=>setForm({...form,subject:e.target.value})} placeholder="e.g. Mathematics + Science" style={inp}/>
          </div>
          <div>
            <label style={{display:'block',fontSize:'0.8rem',color:'var(--slate2)',marginBottom:5,fontWeight:600}}>Notes</label>
            <textarea value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} rows={2} style={{...inp,resize:'vertical'}}/>
          </div>
          <button type="submit" style={{padding:'13px',background:'var(--gold)',color:'var(--navy)',border:'none',borderRadius:10,fontWeight:700,cursor:'pointer',fontSize:'0.95rem',fontFamily:'var(--font-body)'}}>
            Assign Teacher
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}
