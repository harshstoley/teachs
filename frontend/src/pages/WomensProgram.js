import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const Tag = ({text}) => <div style={{ display:'inline-flex',alignItems:'center',gap:6,background:'rgba(212,168,83,0.1)',border:'1px solid rgba(212,168,83,0.25)',color:'var(--gold)',fontSize:'0.72rem',fontWeight:700,padding:'5px 14px',borderRadius:100,marginBottom:16,letterSpacing:'0.5px'}}><span style={{width:5,height:5,borderRadius:'50%',background:'var(--gold)',display:'inline-block'}}/>{text}</div>;

export default function WomensProgram() {
  const [form, setForm] = useState({name:'',email:'',phone:'',city:'',qualification:'',subjects:'',experience:'',availability:'',message:''});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  useEffect(()=>{document.title="Women's Teaching Program | Teachs";}, []);
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  const submit=async e=>{
    e.preventDefault();setLoading(true);setError('');
    try{const res=await api.post('/women/apply',form);setSuccess(res.data.message||'Application submitted!');}
    catch(err){setError(err.response?.data?.error||'Submission failed.');}
    finally{setLoading(false);}
  };
  const inp={width:'100%',padding:'12px 14px',background:'rgba(255,255,255,0.05)',border:'1px solid rgba(212,168,83,0.2)',borderRadius:10,color:'white',fontSize:'0.9rem',fontFamily:'var(--font-body)',outline:'none',boxSizing:'border-box'};
  const lbl={display:'block',fontSize:'0.8rem',color:'var(--slate2)',marginBottom:5,fontWeight:600};

  return (
    <div style={{background:'var(--navy)',minHeight:'100vh'}}>

      {/* HERO */}
      <section style={{paddingTop:'calc(var(--nav-height) + 60px)',paddingBottom:60,position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,backgroundImage:'linear-gradient(rgba(212,168,83,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(212,168,83,0.03) 1px,transparent 1px)',backgroundSize:'60px 60px'}}/>
        <div style={{position:'absolute',top:-80,right:-80,width:320,height:320,borderRadius:'50%',background:'radial-gradient(circle,rgba(212,168,83,0.08),transparent 70%)'}}/>
        <div style={{maxWidth:1100,margin:'0 auto',padding:'0 20px',position:'relative'}}>
          <Tag text="WOMEN'S PROGRAM"/>
          <h1 style={{color:'white',marginBottom:16,maxWidth:540}}>Teach. <em style={{color:'var(--gold)',fontStyle:'normal'}}>Earn.</em> Grow.<br/>On Your Terms.</h1>
          <p style={{color:'var(--slate2)',maxWidth:480,marginBottom:32,lineHeight:1.75}}>Join India's most trusted tutoring platform. Flexible hours, premium students, competitive pay — all from the comfort of your home.</p>
          <div style={{display:'flex',gap:12,flexWrap:'wrap',marginBottom:48}}>
            <a href="#apply" style={{display:'inline-block',background:'var(--gold)',color:'var(--navy)',fontWeight:700,padding:'13px 26px',borderRadius:10,textDecoration:'none',fontSize:'0.95rem'}}>Apply Now →</a>
            <a href="#benefits" style={{display:'inline-block',background:'transparent',color:'white',fontWeight:600,padding:'13px 26px',borderRadius:10,textDecoration:'none',border:'1.5px solid rgba(255,255,255,0.2)',fontSize:'0.95rem'}}>Learn More</a>
          </div>
          <div style={{display:'flex',gap:32,paddingTop:32,borderTop:'1px solid rgba(255,255,255,0.08)',flexWrap:'wrap'}}>
            {[['200+','Women Educators'],['₹25K+','Avg Monthly'],['100%','Work From Home'],['Free','Training']].map(([v,l])=>(
              <div key={l}><div style={{fontFamily:'var(--font-display)',fontSize:'1.5rem',fontWeight:700,color:'var(--gold)',lineHeight:1}}>{v}</div><div style={{fontSize:'0.75rem',color:'var(--slate)',marginTop:3}}>{l}</div></div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <div style={{background:'var(--navy2)',borderTop:'1px solid rgba(212,168,83,0.1)',borderBottom:'1px solid rgba(212,168,83,0.1)',padding:'14px 20px'}}>
        <div style={{display:'flex',justifyContent:'center',gap:24,flexWrap:'wrap'}}>
          {['🏠 Work From Home','💰 Competitive Pay','⏰ Flexible Hours','🎓 Free Training','🏆 Official Certificate'].map(t=>(
            <span key={t} style={{color:'var(--slate2)',fontSize:'0.82rem',fontWeight:500}}>{t}</span>
          ))}
        </div>
      </div>

      {/* BENEFITS */}
      <section id="benefits" style={{background:'var(--white)',padding:'64px 0'}}>
        <div style={{maxWidth:1100,margin:'0 auto',padding:'0 20px'}}>
          <div style={{textAlign:'center',marginBottom:40}}><Tag text="WHY TEACHS"/><h2 style={{color:'var(--text)',margin:0}}>Everything You Need to Succeed</h2></div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(min(220px,100%),1fr))',gap:16}}>
            {[['🏠','Work From Home','No commute. Teach from your home.'],['⏰','Your Schedule','Set your own timetable.'],['💰','₹15K–₹50K/Month','Competitive pay, timely payments.'],['📚','Curriculum Provided','Lesson plans & materials provided.'],['🎓','Free Training','Full onboarding, no experience needed.'],['📈','Career Growth','Performance rewards & senior roles.'],['🤝','Community','200+ supportive women educators.'],['🏆','Certificate','Official Teachs Certified Educator badge.']].map(([icon,title,desc])=>(
              <div key={title} style={{background:'var(--cream)',borderRadius:14,padding:'22px 18px',border:'1px solid rgba(0,0,0,0.06)'}}>
                <div style={{fontSize:'1.6rem',marginBottom:12}}>{icon}</div>
                <h3 style={{color:'var(--text)',fontSize:'0.9rem',marginBottom:6,fontFamily:'var(--font-body)',fontWeight:700}}>{title}</h3>
                <p style={{color:'var(--text2)',fontSize:'0.82rem',lineHeight:1.6,margin:0}}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CERTIFICATE */}
      <section style={{background:'var(--navy2)',padding:'64px 0',borderTop:'1px solid rgba(212,168,83,0.1)'}}>
        <div style={{maxWidth:1100,margin:'0 auto',padding:'0 20px'}}>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(min(280px,100%),1fr))',gap:48,alignItems:'center'}}>
            <div>
              <Tag text="RECOGNITION"/>
              <h2 style={{color:'white',marginBottom:14}}>Earn Your Teachs Certificate</h2>
              <p style={{color:'var(--slate2)',lineHeight:1.8,marginBottom:24}}>Every educator receives an official digital certificate. Display it on LinkedIn, share with parents, and build your professional reputation.</p>
              <div style={{display:'grid',gap:12}}>
                {[['🏆','Certified Educator Badge','On your public profile'],['📄','Digital Certificate','Shareable on LinkedIn'],['⭐','Performance Awards','Quarterly recognition'],['🎯','Subject Certificates','Subject-specific credentials']].map(([icon,title,sub])=>(
                  <div key={title} style={{display:'flex',gap:12,alignItems:'center'}}>
                    <div style={{width:36,height:36,borderRadius:9,background:'rgba(212,168,83,0.1)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1rem',flexShrink:0}}>{icon}</div>
                    <div><div style={{color:'white',fontWeight:600,fontSize:'0.875rem'}}>{title}</div><div style={{color:'var(--slate)',fontSize:'0.76rem',marginTop:1}}>{sub}</div></div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{background:'rgba(212,168,83,0.05)',borderRadius:20,padding:'36px 28px',border:'1px solid rgba(212,168,83,0.2)',textAlign:'center'}}>
              <div style={{fontSize:'2.5rem',marginBottom:10}}>🏅</div>
              <div style={{color:'var(--gold)',fontWeight:700,fontSize:'0.75rem',textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:6}}>Teachs Learning Pvt Ltd</div>
              <div style={{color:'white',fontWeight:800,fontSize:'1.3rem',fontFamily:'var(--font-display)',marginBottom:4}}>Certified Educator</div>
              <div style={{color:'var(--gold)',fontSize:'0.82rem',marginBottom:18}}>Mathematics Specialist</div>
              <div style={{border:'1px solid rgba(212,168,83,0.2)',borderRadius:10,padding:'10px',fontSize:'0.75rem',color:'var(--slate)'}}>Verified · 2025 · Digital Certificate</div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{background:'var(--white)',padding:'64px 0'}}>
        <div style={{maxWidth:1100,margin:'0 auto',padding:'0 20px'}}>
          <div style={{textAlign:'center',marginBottom:40}}><Tag text="PROCESS"/><h2 style={{color:'var(--text)',margin:0}}>Simple 4-Step Process</h2></div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(min(180px,100%),1fr))',gap:20}}>
            {[['1','Apply Online','Fill the form in 5 minutes.'],['2','Interview','20-min video call.'],['3','Training','3-day online onboarding.'],['4','Start Earning','Get students within 7 days!']].map(([num,title,desc])=>(
              <div key={num} style={{textAlign:'center',padding:'28px 16px',background:'var(--cream)',borderRadius:18,border:'1px solid rgba(0,0,0,0.06)'}}>
                <div style={{width:50,height:50,borderRadius:'50%',background:'var(--navy)',color:'var(--gold)',fontSize:'1.2rem',fontWeight:800,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px',fontFamily:'var(--font-body)'}}>{num}</div>
                <h3 style={{color:'var(--text)',fontSize:'0.95rem',marginBottom:6,fontFamily:'var(--font-body)',fontWeight:700}}>{title}</h3>
                <p style={{color:'var(--text2)',fontSize:'0.83rem',margin:0}}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{background:'var(--navy2)',padding:'64px 0',borderTop:'1px solid rgba(212,168,83,0.1)'}}>
        <div style={{maxWidth:1100,margin:'0 auto',padding:'0 20px'}}>
          <div style={{textAlign:'center',marginBottom:36}}><Tag text="STORIES"/><h2 style={{color:'white',margin:0}}>Our Educators Love Teachs</h2></div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(min(240px,100%),1fr))',gap:20}}>
            {[['Priya S.','Maths Teacher, Delhi','Mother of 2','Teachs changed my life. I earn ₹32,000/month teaching from home.'],['Meera R.','Science Teacher, Mumbai','Ex-school Teacher','Better pay, no commute, and I actually enjoy teaching again.'],['Kavya M.','English Teacher, Bangalore','Homemaker','Teachs gave me financial independence and a career I am proud of.']].map(([name,role,tag2,quote])=>(
              <div key={name} style={{background:'rgba(255,255,255,0.04)',borderRadius:18,padding:'24px 20px',border:'1px solid rgba(212,168,83,0.1)'}}>
                <div style={{display:'flex',gap:12,alignItems:'center',marginBottom:14}}>
                  <div style={{width:40,height:40,borderRadius:'50%',background:'linear-gradient(135deg,var(--navy3),var(--teal))',display:'flex',alignItems:'center',justifyContent:'center',color:'white',fontWeight:700,fontSize:'1rem',flexShrink:0}}>{name[0]}</div>
                  <div><div style={{fontWeight:700,color:'white',fontSize:'0.875rem'}}>{name}</div><div style={{fontSize:'0.72rem',color:'var(--teal)',fontWeight:600}}>{role}</div><div style={{fontSize:'0.7rem',color:'var(--slate)'}}>{tag2}</div></div>
                </div>
                <p style={{color:'var(--slate2)',fontSize:'0.875rem',lineHeight:1.7,fontStyle:'italic',margin:0}}>"{quote}"</p>
                <div style={{marginTop:10,color:'var(--gold)',fontSize:'0.85rem'}}>★★★★★</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FORM */}
      <section id="apply" style={{background:'var(--navy)',padding:'64px 0',borderTop:'1px solid rgba(212,168,83,0.1)'}}>
        <div style={{maxWidth:580,margin:'0 auto',padding:'0 20px'}}>
          <div style={{textAlign:'center',marginBottom:32}}><Tag text="APPLY NOW"/><h2 style={{color:'white',marginBottom:8}}>Join the Teaching Team</h2><p style={{color:'var(--slate2)',fontSize:'0.9rem'}}>We review all applications within 2–3 business days.</p></div>
          {success ? (
            <div style={{textAlign:'center',padding:'48px 20px',background:'var(--navy2)',borderRadius:20,border:'1px solid rgba(212,168,83,0.15)'}}>
              <div style={{fontSize:'3rem',marginBottom:14}}>🎉</div>
              <h3 style={{color:'white',marginBottom:8}}>Application Received!</h3>
              <p style={{color:'var(--slate2)'}}>{success}</p>
            </div>
          ) : (
            <div style={{background:'var(--navy2)',borderRadius:20,padding:'32px 24px',border:'1px solid rgba(212,168,83,0.15)'}}>
              {error&&<div style={{background:'rgba(192,57,43,0.12)',border:'1px solid rgba(192,57,43,0.3)',borderRadius:10,padding:'12px',marginBottom:16,color:'#e74c3c',fontSize:'0.875rem'}}>{error}</div>}
              <form onSubmit={submit} style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(min(180px,100%),1fr))',gap:14}}>
                <div style={{gridColumn:'1/-1'}}><label style={lbl}>Full Name *</label><input value={form.name} onChange={e=>set('name',e.target.value)} required style={inp} placeholder="Your full name"/></div>
                <div><label style={lbl}>Phone *</label><input value={form.phone} onChange={e=>set('phone',e.target.value)} required style={inp} placeholder="+91 XXXXX"/></div>
                <div><label style={lbl}>Email</label><input type="email" value={form.email} onChange={e=>set('email',e.target.value)} style={inp} placeholder="your@email.com"/></div>
                <div><label style={lbl}>City</label><input value={form.city} onChange={e=>set('city',e.target.value)} style={inp}/></div>
                <div><label style={lbl}>Qualification</label><input value={form.qualification} onChange={e=>set('qualification',e.target.value)} placeholder="e.g. B.Ed, M.Sc" style={inp}/></div>
                <div style={{gridColumn:'1/-1'}}><label style={lbl}>Subjects You Can Teach *</label><input value={form.subjects} onChange={e=>set('subjects',e.target.value)} required placeholder="e.g. Mathematics, Science" style={inp}/></div>
                <div><label style={lbl}>Classes</label><input value={form.availability} onChange={e=>set('availability',e.target.value)} placeholder="e.g. Class 6–10" style={inp}/></div>
                <div><label style={lbl}>Availability</label><input value={form.message} onChange={e=>set('message',e.target.value)} placeholder="Evenings, Weekends" style={inp}/></div>
                <div style={{gridColumn:'1/-1'}}><label style={lbl}>Teaching Experience</label><textarea value={form.experience} onChange={e=>set('experience',e.target.value)} rows={3} placeholder="Your background..." style={{...inp,resize:'vertical'}}/></div>
                <div style={{gridColumn:'1/-1'}}>
                  <button type="submit" disabled={loading} style={{width:'100%',padding:'14px',background:'var(--gold)',color:'var(--navy)',border:'none',borderRadius:12,fontWeight:700,fontSize:'1rem',cursor:'pointer',fontFamily:'var(--font-body)'}}>
                    {loading?'Submitting...':'Submit Application →'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
