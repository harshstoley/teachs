import React, { useState, useEffect } from 'react';
import api from '../utils/api';

export default function BecomeTutor() {
  const [form, setForm] = useState({ name:'', email:'', phone:'', city:'', qualification:'', subjects:'', experience:'', availability:'', message:'' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => { document.title = 'Become a Tutor | Teachs'; }, []);

  const set = (k, v) => setForm(f => ({...f, [k]: v}));

  const submit = async e => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const payload = { ...form, message: `Availability: ${form.availability}\n${form.message}` };
      const res = await api.post('/women/apply', payload);
      setSuccess(res.data.message || 'Application submitted! We will contact you within 2–3 business days.');
    } catch(err) {
      setError(err.response?.data?.error || 'Submission failed. Please try again.');
    } finally { setLoading(false); }
  };

  const inp = { width:'100%', padding:'11px 14px', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(212,168,83,0.2)', borderRadius:10, color:'#fff', fontSize:'0.9rem', fontFamily:'var(--font-body)', outline:'none', boxSizing:'border-box' };
  const lbl = { display:'block', fontSize:'0.8rem', color:'rgba(184,197,217,0.7)', marginBottom:5, fontWeight:600 };

  return (
    <div style={{background:'var(--navy)',minHeight:'100vh'}}>
      {/* Hero */}
      <section style={{padding:'100px 0 56px',borderBottom:'1px solid rgba(212,168,83,0.1)'}}>
        <div className="container" style={{textAlign:'center'}}>
          <span style={{display:'inline-block',background:'rgba(212,168,83,0.1)',color:'var(--gold)',fontSize:'0.75rem',fontWeight:700,padding:'6px 16px',borderRadius:100,marginBottom:20,letterSpacing:'0.8px',textTransform:'uppercase'}}>Join Our Team</span>
          <h1 style={{color:'#fff',marginBottom:16}}>Become a Tutor at Teachs</h1>
          <p style={{color:'rgba(184,197,217,0.7)',maxWidth:500,margin:'0 auto',fontSize:'1rem',lineHeight:1.75}}>
            Teach from home. Flexible hours, premium students, competitive pay — on your schedule.
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section style={{padding:'56px 0',borderBottom:'1px solid rgba(212,168,83,0.08)'}}>
        <div className="container">
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:14}}>
            {[['🏠','Work From Home','No commute. Teach from comfort.'],['⏰','Flexible Hours','Choose slots that fit you.'],['💰','Competitive Pay','Transparent, timely payments.'],['📚','Structured Plans','We provide lesson plans.'],['📈','Grow With Us','Performance incentives.'],['🎓','Training Provided','Full onboarding support.']].map(([icon,title,desc])=>(
              <div key={title} style={{background:'#152238',border:'1px solid rgba(212,168,83,0.1)',borderRadius:14,padding:'20px 16px'}}>
                <div style={{fontSize:'1.6rem',marginBottom:10}}>{icon}</div>
                <h4 style={{color:'#fff',fontFamily:'var(--font-body)',fontWeight:700,marginBottom:6,fontSize:'0.9rem'}}>{title}</h4>
                <p style={{color:'rgba(184,197,217,0.65)',fontSize:'0.82rem',lineHeight:1.6}}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section style={{padding:'56px 0'}}>
        <div className="container">
          <div style={{maxWidth:580,margin:'0 auto'}}>
            <div style={{textAlign:'center',marginBottom:32}}>
              <h2 style={{color:'#fff',marginBottom:8}}>Apply Now</h2>
              <p style={{color:'rgba(184,197,217,0.65)',fontSize:'0.9rem'}}>We review all applications and contact you within 2–3 business days.</p>
            </div>

            {success ? (
              <div style={{textAlign:'center',padding:'48px 24px',background:'#152238',borderRadius:20,border:'1px solid rgba(212,168,83,0.2)'}}>
                <div style={{fontSize:'3rem',marginBottom:16}}>🎉</div>
                <h3 style={{color:'#fff',marginBottom:10}}>Application Received!</h3>
                <p style={{color:'rgba(184,197,217,0.7)'}}>{success}</p>
              </div>
            ) : (
              <div style={{background:'#152238',borderRadius:20,padding:'32px 24px',border:'1px solid rgba(212,168,83,0.15)'}}>
                {error && <div style={{background:'rgba(192,57,43,0.15)',border:'1px solid rgba(192,57,43,0.3)',borderRadius:10,padding:'12px 16px',marginBottom:16,color:'#e74c3c',fontSize:'0.88rem'}}>{error}</div>}
                <form onSubmit={submit} style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
                  <div style={{gridColumn:'1/-1'}}><label style={lbl}>Full Name *</label><input value={form.name} onChange={e=>set('name',e.target.value)} required style={inp}/></div>
                  <div><label style={lbl}>Phone *</label><input value={form.phone} onChange={e=>set('phone',e.target.value)} required style={inp}/></div>
                  <div><label style={lbl}>Email</label><input type="email" value={form.email} onChange={e=>set('email',e.target.value)} style={inp}/></div>
                  <div><label style={lbl}>City</label><input value={form.city} onChange={e=>set('city',e.target.value)} style={inp}/></div>
                  <div><label style={lbl}>Highest Qualification</label><input value={form.qualification} onChange={e=>set('qualification',e.target.value)} style={inp} placeholder="e.g. B.Ed, M.Sc"/></div>
                  <div style={{gridColumn:'1/-1'}}><label style={lbl}>Subjects You Can Teach *</label><input value={form.subjects} onChange={e=>set('subjects',e.target.value)} required style={inp} placeholder="e.g. Mathematics, Science, English"/></div>
                  <div><label style={lbl}>Classes (e.g. Class 6–10)</label><input value={form.availability} onChange={e=>set('availability',e.target.value)} style={inp} placeholder="Class 6–10"/></div>
                  <div><label style={lbl}>Availability</label><input value={form.message} onChange={e=>set('message',e.target.value)} style={inp} placeholder="Evenings, Weekends"/></div>
                  <div style={{gridColumn:'1/-1'}}><label style={lbl}>Teaching Experience</label><textarea value={form.experience} onChange={e=>set('experience',e.target.value)} rows={3} placeholder="Describe your background..." style={{...inp,resize:'vertical'}}/></div>
                  <div style={{gridColumn:'1/-1'}}>
                    <button type="submit" disabled={loading} style={{width:'100%',padding:'14px',background:'var(--gold)',color:'var(--navy)',border:'none',borderRadius:12,fontWeight:700,fontSize:'1rem',cursor:'pointer',fontFamily:'var(--font-body)'}}>
                      {loading ? 'Submitting...' : 'Submit Application →'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
