import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../utils/api';

const inp = { width:'100%', padding:'10px 14px', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(212,168,83,0.2)', borderRadius:10, color:'#fff', fontSize:'0.88rem', fontFamily:'var(--font-body)', outline:'none' };
const cardDark = { background:'#152238', border:'1px solid rgba(212,168,83,0.15)', borderRadius:14 };

export default function AdminUsers() {
  const [users, setUsers] = useState([]); const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true); const [role, setRole] = useState('');
  const [search, setSearch] = useState(''); const [msg, setMsg] = useState({ text:'', type:'' });
  const [showCreate, setShowCreate] = useState(false);
  const [tf, setTf] = useState({ name:'', email:'', password:'', phone:'', subjects:'', qualification:'', bio:'' });
  const showMsg = (text, type='success') => { setMsg({text,type}); setTimeout(()=>setMsg({text:'',type:''}),3000); };

  const load = useCallback(() => {
    setLoading(true);
    api.get(`/admin/users?role=${role}&search=${search}&limit=50`)
      .then(r => { setUsers(r.data.users); setTotal(r.data.total); }).catch(()=>{}).finally(()=>setLoading(false));
  }, [role, search]);

  useEffect(() => { document.title='Users | Admin'; load(); }, [load]);

  const approve = async id => { try { await api.put(`/admin/users/${id}/approve`); showMsg('Approved!'); load(); } catch { showMsg('Failed.','error'); } };
  const toggle = async id => { try { await api.put(`/admin/users/${id}/toggle-active`); showMsg('Updated!'); load(); } catch { showMsg('Failed.','error'); } };
  const del = async (id, name) => { if(!window.confirm(`Delete "${name}"?`)) return; try { await api.delete(`/admin/users/${id}`); showMsg('Deleted.'); load(); } catch { showMsg('Failed.','error'); } };
  const createTeacher = async e => {
    e.preventDefault();
    try { await api.post('/admin/teachers', tf); showMsg('Teacher created!'); setShowCreate(false); setTf({name:'',email:'',password:'',phone:'',subjects:'',qualification:'',bio:''}); load(); }
    catch(err) { showMsg(err.response?.data?.error||'Failed.','error'); }
  };

  const roleColors = { admin:'rgba(212,168,83,0.15)', teacher:'rgba(0,153,178,0.15)', student:'rgba(42,138,94,0.15)' };
  const roleText = { admin:'var(--gold)', teacher:'var(--teal)', student:'#5BC8A0' };

  return (
    <AdminLayout title="Manage Users" subtitle={`${total} total users`}>
      {msg.text && <div className={`alert alert-${msg.type}`} style={{marginBottom:16}}>{msg.text}</div>}

      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20,flexWrap:'wrap',gap:12}}>
        <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
          {['','admin','teacher','student'].map(r=>(
            <button key={r} onClick={()=>setRole(r)} style={{padding:'7px 14px',borderRadius:8,border:'none',cursor:'pointer',background:role===r?'var(--gold)':'rgba(255,255,255,0.08)',color:role===r?'var(--navy)':'#fff',fontWeight:role===r?700:400,fontSize:'0.82rem',fontFamily:'var(--font-body)'}}>{r||'All'}</button>
          ))}
        </div>
        <button onClick={()=>setShowCreate(!showCreate)} style={{padding:'9px 18px',background:'var(--gold)',color:'var(--navy)',border:'none',borderRadius:10,fontWeight:700,cursor:'pointer',fontSize:'0.88rem',fontFamily:'var(--font-body)'}}>+ Add Teacher</button>
      </div>

      <div style={{display:'flex',gap:10,marginBottom:20}}>
        <input value={search} onChange={e=>setSearch(e.target.value)} onKeyDown={e=>e.key==='Enter'&&load()} placeholder="Search name/email..." className="admin-inp" style={{...inp,maxWidth:280}}/>
        <button onClick={load} style={{padding:'10px 18px',background:'rgba(212,168,83,0.15)',color:'var(--gold)',border:'1px solid rgba(212,168,83,0.2)',borderRadius:10,cursor:'pointer',fontWeight:600,fontFamily:'var(--font-body)'}}>Search</button>
      </div>

      {showCreate && (
        <div style={{...cardDark,padding:'24px 20px',marginBottom:20}}>
          <h4 style={{color:'#fff',marginBottom:18,fontFamily:'var(--font-body)',fontWeight:700}}>Create Teacher Account</h4>
          <form onSubmit={createTeacher} style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:14}}>
            {[['name','Name *'],['email','Email *'],['password','Password *'],['phone','Phone'],['subjects','Subjects'],['qualification','Qualification']].map(([k,l])=>(
              <div key={k}><label style={{display:'block',fontSize:'0.78rem',color:'var(--slate2)',marginBottom:5,fontWeight:600}}>{l}</label><input value={tf[k]} onChange={e=>setTf({...tf,[k]:e.target.value})} style={inp} required={['name','email','password'].includes(k)}/></div>
            ))}
            <div style={{display:'flex',gap:10,alignItems:'flex-end'}}>
              <button type="submit" style={{padding:'10px 20px',background:'var(--gold)',color:'var(--navy)',border:'none',borderRadius:10,fontWeight:700,cursor:'pointer',fontFamily:'var(--font-body)'}}>Create</button>
              <button type="button" onClick={()=>setShowCreate(false)} style={{padding:'10px 16px',background:'rgba(255,255,255,0.08)',color:'#fff',border:'none',borderRadius:10,cursor:'pointer',fontFamily:'var(--font-body)'}}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {loading ? <div className="spinner" style={{margin:'40px auto',borderTopColor:'var(--gold)'}}/> : (
        <div style={{overflowX:'auto',borderRadius:12,border:'1px solid rgba(212,168,83,0.12)'}}>
          <table style={{width:'100%',borderCollapse:'collapse',minWidth:500}}>
            <thead><tr>{['Name','Email','Role','Status','Joined','Actions'].map(h=><th key={h} style={{padding:'11px 14px',background:'#0f1e35',textAlign:'left',fontSize:'0.75rem',fontWeight:700,color:'var(--slate2)',textTransform:'uppercase',letterSpacing:'0.05em'}}>{h}</th>)}</tr></thead>
            <tbody>
              {users.map(u=>(
                <tr key={u.id}>
                  <td style={{padding:'11px 14px',borderTop:'1px solid rgba(255,255,255,0.05)',color:'#fff',fontWeight:600,fontSize:'0.875rem'}}>{u.name}<div style={{fontSize:'0.72rem',color:'var(--slate)'}}>{u.phone}</div>{u.enrollment_no&&<div style={{fontSize:'0.68rem',color:'var(--gold)',fontWeight:700,marginTop:2}}>{u.enrollment_no}</div>}{u.teacher_code&&<div style={{fontSize:'0.68rem',color:'#0099B2',fontWeight:700,marginTop:2}}>{u.teacher_code}</div>}</td>
                  <td style={{padding:'11px 14px',borderTop:'1px solid rgba(255,255,255,0.05)',color:'var(--slate2)',fontSize:'0.82rem'}}>{u.email}</td>
                  <td style={{padding:'11px 14px',borderTop:'1px solid rgba(255,255,255,0.05)'}}><span style={{background:roleColors[u.role],color:roleText[u.role],padding:'3px 10px',borderRadius:100,fontSize:'0.7rem',fontWeight:700}}>{u.role}</span></td>
                  <td style={{padding:'11px 14px',borderTop:'1px solid rgba(255,255,255,0.05)'}}>
                    {!u.is_approved&&u.role==='student'?<span style={{background:'rgba(212,168,83,0.15)',color:'var(--gold)',padding:'3px 10px',borderRadius:100,fontSize:'0.7rem',fontWeight:700}}>Pending</span>:
                    <span style={{background:u.is_active?'rgba(42,138,94,0.15)':'rgba(192,57,43,0.15)',color:u.is_active?'#5BC8A0':'#e74c3c',padding:'3px 10px',borderRadius:100,fontSize:'0.7rem',fontWeight:700}}>{u.is_active?'Active':'Inactive'}</span>}
                  </td>
                  <td style={{padding:'11px 14px',borderTop:'1px solid rgba(255,255,255,0.05)',fontSize:'0.78rem',color:'var(--slate)'}}>{new Date(u.created_at).toLocaleDateString('en-IN')}</td>
                  <td style={{padding:'11px 14px',borderTop:'1px solid rgba(255,255,255,0.05)'}}>
                    <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
                      {!u.is_approved&&<button onClick={()=>approve(u.id)} style={{padding:'5px 10px',background:'rgba(42,138,94,0.2)',color:'#5BC8A0',border:'1px solid rgba(42,138,94,0.3)',borderRadius:7,cursor:'pointer',fontSize:'0.75rem',fontFamily:'var(--font-body)'}}>Approve</button>}
                      <button onClick={()=>toggle(u.id)} style={{padding:'5px 10px',background:'rgba(255,255,255,0.06)',color:'var(--slate2)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:7,cursor:'pointer',fontSize:'0.75rem',fontFamily:'var(--font-body)'}}>{u.is_active?'Deactivate':'Activate'}</button>
                      <button onClick={()=>del(u.id,u.name)} style={{padding:'5px 10px',background:'rgba(192,57,43,0.15)',color:'#e74c3c',border:'1px solid rgba(192,57,43,0.2)',borderRadius:7,cursor:'pointer',fontSize:'0.75rem',fontFamily:'var(--font-body)'}}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}
