import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const Tag = ({text}) => <div style={{display:'inline-flex',alignItems:'center',gap:6,background:'rgba(212,168,83,0.1)',border:'1px solid rgba(212,168,83,0.25)',color:'var(--gold)',fontSize:'0.72rem',fontWeight:700,padding:'5px 14px',borderRadius:100,marginBottom:16,letterSpacing:'0.5px'}}><span style={{width:5,height:5,borderRadius:'50%',background:'var(--gold)',display:'inline-block'}}/>{text}</div>;

export default function BecomeTutor() {
  const [form,setForm]=useState({name:'',email:'',phone:'',city:'',qualification:'',subjects:'',experience:'',availability:'',message:''});
  const [loading,setLoading]=useState(false);
  const [success,setSuccess]=useState('');
  const [error,setError]=useState('');
  useEffect(()=>{document.title='Become an Online Tutor | Teachs';}, []);
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  const submit=async e=>{
    e.preventDefault();setLoading(true);setError('');
    try{const payload={...form,message:`Classes: ${form.message}\nAvailability: ${form.availability}\n${form.experience}`};const res=await api.post('/women/apply',payload);setSuccess(res.data.message||'Application submitted!');}
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
        <div style={{maxWidth:1100,margin:'0 auto',padding:'0 20px',position:'relative'}}>
          <Tag text="JOIN OUR TEAM"/>
          <h1 style={{color:'white',marginBottom:16,maxWidth:540}}>Turn Your Knowledge<br/>Into a Career</h1>
          <p style={{color:'var(--slate2)',maxWidth:480,marginBottom:32,lineHeight:1.75}}>Become a certified Teachs educator. Work from home, earn well, make a real difference in students' lives — all on your schedule.</p>
          <div style={{display:'flex',gap:12,flexWrap:'wrap',alignItems:'center',marginBottom:48}}>
            <a href="#apply" style={{display:'inline-block',background:'var(--gold)',color:'var(--navy)',fontWeight:700,padding:'13px 26px',borderRadius:10,textDecoration:'none',fontSize:'0.95rem'}}>Apply Now — Free →</a>
            <span style={{color:'var(--slate)',fontSize:'0.85rem'}}>⚡ Response within 48 hours</span>
          </div>
          <div style={{display:'flex',gap:32,paddingTop:32,borderTop:'1px solid rgba(255,255,255,0.08)',flexWrap:'wrap'}}>
            {[['1000+','Students Impacted'],['₹25K+','Avg Monthly Pay'],['4.8★','Teacher Rating'],['48hrs','Hiring Time']].map(([v,l])=>(
              <div key={l}><div style={{fontFamily:'var(--font-display)',fontSize:'1.5rem',fontWeight:700,color:'var(--gold)',lineHeight:1}}>{v}</div><div style={{fontSize:'0.75rem',color:'var(--slate)',marginTop:3}}>{l}</div></div>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section style={{background:'var(--white)',padding:'64px 0'}}>
        <div style={{maxWidth:1100,margin:'0 auto',padding:'0 20px'}}>
          <div style={{textAlign:'center',marginBottom:40}}><Tag text="BENEFITS"/><h2 style={{color:'var(--text)',margin:0}}>Why Teach With Teachs?</h2></div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(min(220px,100%),1fr))',gap:16}}>
            {[['💰','Earn ₹15K–₹50K/Month','Competitive pay. Paid monthly, on time.'],['🏠','100% Work From Home','Teach from anywhere in India.'],['⏰','Your Schedule','Morning, evening — you decide.'],['📚','Curriculum Provided','All lesson plans & materials provided.'],['🎓','Official Certificate','Teachs Certified Educator badge.'],['📈','Growth Opportunities','Senior roles & performance rewards.']].map(([icon,title,desc])=>(
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
              <Tag text="OFFICIAL RECOGNITION"/>
              <h2 style={{color:'white',marginBottom:14}}>Get Certified by Teachs</h2>
              <p style={{color:'var(--slate2)',lineHeight:1.8,marginBottom:24}}>Complete our training program and earn an official Teachs Certified Educator certificate — recognized by parents and schools across India.</p>
              <div style={{display:'grid',gap:12}}>
                {[['🏆','Digital Badge','LinkedIn, resume & social media'],['📜','Certificate of Completion','Official PDF with Teachs seal'],['⭐','Subject Specialization','Per-subject certification'],['🎖','Annual Excellence Award','Top 10% recognized yearly']].map(([icon,title,sub])=>(
                  <div key={title} style={{display:'flex',gap:12,alignItems:'center'}}>
                    <div style={{width:36,height:36,borderRadius:9,background:'rgba(212,168,83,0.1)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1rem',flexShrink:0}}>{icon}</div>
                    <div><div style={{color:'white',fontWeight:600,fontSize:'0.875rem'}}>{title}</div><div style={{color:'var(--slate)',fontSize:'0.75rem',marginTop:1}}>{sub}</div></div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{background:'rgba(212,168,83,0.05)',borderRadius:20,padding:'36px 28px',border:'1px solid rgba(212,168,83,0.2)',textAlign:'center'}}>
              <div style={{fontSize:'2.5rem',marginBottom:10}}>🏅</div>
              <div style={{color:'var(--gold)',fontWeight:700,fontSize:'0.75rem',textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:6}}>Teachs Learning Pvt Ltd</div>
              <div style={{color:'white',fontWeight:800,fontSize:'1.3rem',fontFamily:'var(--font-display)',marginBottom:4}}>Certified Educator</div>
              <div style={{color:'var(--gold)',fontSize:'0.82rem',marginBottom:18}}>Mathematics Specialist</div>
              <div style={{border:'1px solid rgba(212,168,83,0.2)',borderRadius:10,padding:'10px',fontSize:'0.75rem',color:'var(--slate)'}}>Verified · 2025 · Digital</div>
            </div>
          </div>
        </div>
      </section>

      {/* ELIGIBILITY + PROCESS */}
      <section style={{background:'var(--white)',padding:'64px 0'}}>
        <div style={{maxWidth:1100,margin:'0 auto',padding:'0 20px'}}>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(min(280px,100%),1fr))',gap:48}}>
            <div>
              <Tag text="ELIGIBILITY"/>
              <h2 style={{color:'var(--text)',marginBottom:20}}>Who Can Apply?</h2>
              <div style={{display:'grid',gap:10}}>
                {['Graduate or postgraduate in any subject','Minimum 1 year teaching experience','Good communication in English or Hindi','Laptop with working camera','Stable internet (min 5 Mbps)','Passion for teaching'].map(item=>(
                  <div key={item} style={{display:'flex',gap:10,alignItems:'center',background:'var(--cream)',borderRadius:10,padding:'10px 14px',border:'1px solid rgba(0,0,0,0.06)'}}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="rgba(0,153,178,0.1)"/><path d="M8 12l3 3 5-5" stroke="var(--teal)" strokeWidth="2" strokeLinecap="round"/></svg>
                    <span style={{color:'var(--text)',fontSize:'0.85rem',fontWeight:500}}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Tag text="PROCESS"/>
              <h2 style={{color:'var(--text)',marginBottom:20}}>4 Simple Steps</h2>
              <div style={{display:'grid',gap:16}}>
                {[['1','Apply Online','Fill our form in 5 minutes.'],['2','Demo Session','20-min demo class for our evaluator.'],['3','Training','3-day online onboarding program.'],['4','Start Earning','Get matched with students!']].map(([num,title,desc])=>(
                  <div key={num} style={{display:'flex',gap:14,alignItems:'flex-start'}}>
                    <div style={{width:38,height:38,borderRadius:'50%',background:'var(--navy)',color:'var(--gold)',fontSize:'0.95rem',fontWeight:800,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,fontFamily:'var(--font-body)'}}>{num}</div>
                    <div style={{paddingTop:4}}><div style={{fontWeight:700,color:'var(--text)',fontSize:'0.9rem'}}>{title}</div><div style={{color:'var(--text2)',fontSize:'0.82rem',marginTop:2}}>{desc}</div></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FORM */}
      <section id="apply" style={{background:'var(--navy)',padding:'64px 0',borderTop:'1px solid rgba(212,168,83,0.1)'}}>
        <div style={{maxWidth:580,margin:'0 auto',padding:'0 20px'}}>
          <div style={{textAlign:'center',marginBottom:32}}><Tag text="GET STARTED"/><h2 style={{color:'white',marginBottom:8}}>Apply to Join Teachs</h2><p style={{color:'var(--slate2)',fontSize:'0.9rem'}}>Free application. Response within 48 hours.</p></div>
          {success ? (
            <div style={{textAlign:'center',padding:'48px 20px',background:'var(--navy2)',borderRadius:20,border:'1px solid rgba(212,168,83,0.15)'}}>
              <div style={{fontSize:'3rem',marginBottom:14}}>🎉</div>
              <h3 style={{color:'white',marginBottom:8}}>Application Received!</h3>
              <p style={{color:'var(--slate2)'}}>{success}</p>
            </div>
          ):(
            <div style={{background:'var(--navy2)',borderRadius:20,padding:'32px 24px',border:'1px solid rgba(212,168,83,0.15)'}}>
              {error&&<div style={{background:'rgba(192,57,43,0.12)',border:'1px solid rgba(192,57,43,0.3)',borderRadius:10,padding:'12px',marginBottom:16,color:'#e74c3c',fontSize:'0.875rem'}}>{error}</div>}
              <form onSubmit={submit} style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(min(180px,100%),1fr))',gap:14}}>
                <div style={{gridColumn:'1/-1'}}><label style={lbl}>Full Name *</label><input value={form.name} onChange={e=>set('name',e.target.value)} required style={inp} placeholder="Your full name"/></div>
                <div><label style={lbl}>Phone *</label><input value={form.phone} onChange={e=>set('phone',e.target.value)} required style={inp} placeholder="+91 XXXXX"/></div>
                <div><label style={lbl}>Email</label><input type="email" value={form.email} onChange={e=>set('email',e.target.value)} style={inp} placeholder="your@email.com"/></div>
                <div><label style={lbl}>City</label><input value={form.city} onChange={e=>set('city',e.target.value)} style={inp}/></div>
                <div><label style={lbl}>Qualification</label><input value={form.qualification} onChange={e=>set('qualification',e.target.value)} placeholder="e.g. B.Ed, M.Sc" style={inp}/></div>
                <div style={{gridColumn:'1/-1'}}><label style={lbl}>Subjects You Can Teach *</label><input value={form.subjects} onChange={e=>set('subjects',e.target.value)} required placeholder="e.g. Mathematics, Science" style={inp}/></div>
                <div><label style={lbl}>Classes</label><input value={form.message} onChange={e=>set('message',e.target.value)} placeholder="e.g. Class 6–10" style={inp}/></div>
                <div><label style={lbl}>Availability</label><input value={form.availability} onChange={e=>set('availability',e.target.value)} placeholder="Evenings, Weekends" style={inp}/></div>
                <div style={{gridColumn:'1/-1'}}><label style={lbl}>Teaching Experience</label><textarea value={form.experience} onChange={e=>set('experience',e.target.value)} rows={3} placeholder="Your background and motivation..." style={{...inp,resize:'vertical'}}/></div>
                <div style={{gridColumn:'1/-1'}}>
                  <button type="submit" disabled={loading} style={{width:'100%',padding:'14px',background:'var(--gold)',color:'var(--navy)',border:'none',borderRadius:12,fontWeight:700,fontSize:'1rem',cursor:'pointer',fontFamily:'var(--font-body)'}}>
                    {loading?'Submitting...':'Submit Application →'}
                  </button>
                  <p style={{textAlign:'center',color:'var(--slate)',fontSize:'0.76rem',marginTop:10}}>Free to apply. We contact you within 48 hours.</p>
                </div>
              </form>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
