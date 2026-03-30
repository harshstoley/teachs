import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../utils/api';
export default function AdminPayments() {
  const [payments, setPayments] = useState([]); const [msg, setMsg] = useState({text:'',type:''});
  const showMsg=(text,type='success')=>{setMsg({text,type});setTimeout(()=>setMsg({text:'',type:''}),3000);};
  useEffect(()=>{document.title='Payments | Admin';api.get('/payments/all').then(r=>setPayments(r.data)).catch(()=>{});}, []);
  const refund = async pid => { const reason=prompt('Reason for refund:'); if(!reason)return; try{await api.post('/payments/refund',{payment_id:pid,reason});showMsg('Refund processed!');}catch(err){showMsg('Refund failed: '+(err.response?.data?.error||'error'),'error');} };
  const total=payments.filter(p=>p.status==='captured').reduce((s,p)=>s+Number(p.amount),0);
  const sColor={captured:'rgba(42,138,94,0.15)',refunded:'rgba(192,57,43,0.15)',created:'rgba(212,168,83,0.15)',failed:'rgba(192,57,43,0.15)'};
  const sText={captured:'#5BC8A0',refunded:'#e74c3c',created:'var(--gold)',failed:'#e74c3c'};
  return (
    <AdminLayout title="Payments" subtitle={`Total revenue: ₹${total.toLocaleString('en-IN')}`}>
      {msg.text&&<div className={`alert alert-${msg.type}`} style={{marginBottom:16}}>{msg.text}</div>}
      <div style={{overflowX:'auto',borderRadius:12,border:'1px solid rgba(212,168,83,0.12)'}}>
        <table style={{width:'100%',borderCollapse:'collapse',minWidth:500}}>
          <thead><tr>{['User','Plan','Amount','Payment ID','Status','Date','Actions'].map(h=><th key={h} style={{padding:'11px 14px',background:'#0f1e35',textAlign:'left',fontSize:'0.75rem',fontWeight:700,color:'var(--slate2)',textTransform:'uppercase',letterSpacing:'0.05em'}}>{h}</th>)}</tr></thead>
          <tbody>
            {payments.map(p=>(
              <tr key={p.id}>
                <td style={{padding:'11px 14px',borderTop:'1px solid rgba(255,255,255,0.05)',color:'#fff',fontWeight:600,fontSize:'0.875rem'}}>{p.user_name}<div style={{fontSize:'0.72rem',color:'var(--slate)'}}>{p.email}</div></td>
                <td style={{padding:'11px 14px',borderTop:'1px solid rgba(255,255,255,0.05)',color:'var(--slate2)',fontSize:'0.875rem'}}>{p.plan_title||'-'}</td>
                <td style={{padding:'11px 14px',borderTop:'1px solid rgba(255,255,255,0.05)',color:'var(--gold)',fontWeight:700,fontSize:'0.9rem'}}>₹{Number(p.amount).toLocaleString('en-IN')}</td>
                <td style={{padding:'11px 14px',borderTop:'1px solid rgba(255,255,255,0.05)',fontSize:'0.72rem',fontFamily:'monospace',color:'var(--slate)'}}>{p.razorpay_payment_id}</td>
                <td style={{padding:'11px 14px',borderTop:'1px solid rgba(255,255,255,0.05)'}}><span style={{background:sColor[p.status],color:sText[p.status],padding:'3px 10px',borderRadius:100,fontSize:'0.7rem',fontWeight:700}}>{p.status}</span></td>
                <td style={{padding:'11px 14px',borderTop:'1px solid rgba(255,255,255,0.05)',fontSize:'0.78rem',color:'var(--slate)'}}>{new Date(p.created_at).toLocaleDateString('en-IN')}</td>
                <td style={{padding:'11px 14px',borderTop:'1px solid rgba(255,255,255,0.05)'}}>
                  {p.status==='captured'&&<button onClick={()=>refund(p.razorpay_payment_id)} style={{padding:'5px 10px',background:'rgba(192,57,43,0.15)',color:'#e74c3c',border:'1px solid rgba(192,57,43,0.2)',borderRadius:7,cursor:'pointer',fontSize:'0.75rem',fontFamily:'var(--font-body)'}}>Refund</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
