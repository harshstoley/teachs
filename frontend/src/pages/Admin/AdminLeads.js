import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../utils/api';

export default function AdminLeads() {
  const [leads, setLeads] = useState([]); const [total, setTotal] = useState(0);
  const [status, setStatus] = useState(''); const [msg, setMsg] = useState('');
  const showMsg = m => { setMsg(m); setTimeout(()=>setMsg(''),3000); };
  const load = useCallback(() => {
    api.get(`/leads?status=${status}&limit=100`).then(r=>{setLeads(r.data.leads);setTotal(r.data.total);}).catch(()=>{});
  },[status]);
  useEffect(()=>{document.title='Leads | Admin';load();},[load]);
  const update = async(id,s)=>{await api.put(`/leads/${id}`,{status:s});showMsg('Updated!');load();};
  const del = async id=>{if(!window.confirm('Delete?'))return;await api.delete(`/leads/${id}`);load();showMsg('Deleted.');};
  const sColor={new:'rgba(212,168,83,0.15)',contacted:'rgba(0,153,178,0.15)',converted:'rgba(42,138,94,0.15)',closed:'rgba(192,57,43,0.15)'};
  const sText={new:'var(--gold)',contacted:'var(--teal)',converted:'#5BC8A0',closed:'#e74c3c'};
  return (
    <AdminLayout title="Leads & Demo Requests" subtitle={`${total} leads total`}>
      {msg&&<div className="alert alert-success" style={{marginBottom:16}}>{msg}</div>}
      <div style={{display:'flex',gap:8,marginBottom:20,flexWrap:'wrap'}}>
        {['','new','contacted','converted','closed'].map(s=>(
          <button key={s} onClick={()=>setStatus(s)} style={{padding:'7px 14px',borderRadius:8,border:'none',cursor:'pointer',background:status===s?'var(--gold)':'rgba(255,255,255,0.08)',color:status===s?'var(--navy)':'#fff',fontWeight:status===s?700:400,fontSize:'0.82rem',fontFamily:'var(--font-body)'}}>{s||'All'}</button>
        ))}
      </div>
      <div style={{overflowX:'auto',borderRadius:12,border:'1px solid rgba(212,168,83,0.12)'}}>
        <table style={{width:'100%',borderCollapse:'collapse',minWidth:600}}>
          <thead><tr>{['Name','Phone','Class','Subject','Status','Date','Actions'].map(h=><th key={h} style={{padding:'11px 14px',background:'#0f1e35',textAlign:'left',fontSize:'0.75rem',fontWeight:700,color:'var(--slate2)',textTransform:'uppercase',letterSpacing:'0.05em'}}>{h}</th>)}</tr></thead>
          <tbody>
            {leads.map(l=>(
              <tr key={l.id}>
                <td style={{padding:'11px 14px',borderTop:'1px solid rgba(255,255,255,0.05)',color:'#fff',fontWeight:600,fontSize:'0.875rem'}}>{l.name}<div style={{fontSize:'0.72rem',color:'var(--slate)'}}>{l.email}</div></td>
                <td style={{padding:'11px 14px',borderTop:'1px solid rgba(255,255,255,0.05)'}}><a href={`tel:${l.phone}`} style={{color:'var(--gold)',fontSize:'0.875rem'}}>{l.phone}</a></td>
                <td style={{padding:'11px 14px',borderTop:'1px solid rgba(255,255,255,0.05)',color:'var(--slate2)',fontSize:'0.875rem'}}>{l.student_class||'-'}</td>
                <td style={{padding:'11px 14px',borderTop:'1px solid rgba(255,255,255,0.05)',color:'var(--slate2)',fontSize:'0.875rem'}}>{l.subject||'-'}</td>
                <td style={{padding:'11px 14px',borderTop:'1px solid rgba(255,255,255,0.05)'}}><span style={{background:sColor[l.status],color:sText[l.status],padding:'3px 10px',borderRadius:100,fontSize:'0.7rem',fontWeight:700}}>{l.status}</span></td>
                <td style={{padding:'11px 14px',borderTop:'1px solid rgba(255,255,255,0.05)',fontSize:'0.78rem',color:'var(--slate)'}}>{new Date(l.created_at).toLocaleDateString('en-IN')}</td>
                <td style={{padding:'11px 14px',borderTop:'1px solid rgba(255,255,255,0.05)'}}>
                  <div style={{display:'flex',gap:5,flexWrap:'wrap'}}>
                    {l.status==='new'&&<button onClick={()=>update(l.id,'contacted')} style={{padding:'5px 8px',background:'rgba(0,153,178,0.15)',color:'var(--teal)',border:'1px solid rgba(0,153,178,0.2)',borderRadius:7,cursor:'pointer',fontSize:'0.72rem',fontFamily:'var(--font-body)'}}>Contacted</button>}
                    {l.status==='contacted'&&<button onClick={()=>update(l.id,'converted')} style={{padding:'5px 8px',background:'rgba(42,138,94,0.15)',color:'#5BC8A0',border:'1px solid rgba(42,138,94,0.2)',borderRadius:7,cursor:'pointer',fontSize:'0.72rem',fontFamily:'var(--font-body)'}}>Convert</button>}
                    <a href={`https://wa.me/${l.phone?.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer" style={{padding:'5px 8px',background:'rgba(37,211,102,0.15)',color:'#25D366',border:'1px solid rgba(37,211,102,0.2)',borderRadius:7,fontSize:'0.72rem'}}>WA</a>
                    <button onClick={()=>del(l.id)} style={{padding:'5px 8px',background:'rgba(192,57,43,0.15)',color:'#e74c3c',border:'1px solid rgba(192,57,43,0.2)',borderRadius:7,cursor:'pointer',fontSize:'0.72rem',fontFamily:'var(--font-body)'}}>Del</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
