import React, { useState, useEffect } from 'react';
import api from '../utils/api';

export default function WomensProgram() {
  const [form, setForm] = useState({ name:'',email:'',phone:'',city:'',qualification:'',subjects:'',experience:'',availability:'',message:'' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => { document.title = "Women's Teaching Program | Teachs – Work From Home & Earn"; }, []);

  const set = (k,v) => setForm(f => ({...f,[k]:v}));
  const submit = async e => {
    e.preventDefault(); setLoading(true); setError('');
    try { const res = await api.post('/women/apply', form); setSuccess(res.data.message || 'Application submitted!'); }
    catch(err) { setError(err.response?.data?.error || 'Submission failed.'); }
    finally { setLoading(false); }
  };

  const inp = { width:'100%', padding:'12px 14px', background:'white', border:'1.5px solid rgba(27,58,107,0.15)', borderRadius:10, color:'#1B3A6B', fontSize:'0.9rem', fontFamily:'var(--font-body)', outline:'none', boxSizing:'border-box' };
  const lbl = { display:'block', fontSize:'0.8rem', color:'#4A5E7A', marginBottom:5, fontWeight:600 };
  const tag = (text,color='#1B3A6B') => (
    <span style={{ display:'inline-block', background:`${color}12`, color, fontSize:'0.72rem', fontWeight:700, padding:'5px 14px', borderRadius:100, letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:14 }}>{text}</span>
  );

  return (
    <div style={{ background:'#FAF7F2' }}>

      {/* HERO */}
      <section style={{ background:'linear-gradient(135deg,#1B3A6B 0%,#0099B2 100%)', padding:'80px 0 60px', overflow:'hidden', position:'relative' }}>
        <div style={{ position:'absolute', top:-60, right:-60, width:280, height:280, borderRadius:'50%', background:'rgba(255,255,255,0.04)' }}/>
        <div style={{ position:'absolute', bottom:-40, left:20, width:200, height:200, borderRadius:'50%', background:'rgba(245,166,35,0.08)' }}/>
        <div style={{ maxWidth:1100, margin:'0 auto', padding:'0 20px', position:'relative' }}>
          {tag("Women's Program",'#F5A623')}
          <h1 style={{ color:'white', marginBottom:16, maxWidth:520 }}>Teach. Earn. Grow.<br/>On Your Terms.</h1>
          <p style={{ color:'rgba(255,255,255,0.8)', maxWidth:480, marginBottom:32, lineHeight:1.75 }}>Join India's most trusted tutoring platform. Flexible hours, premium students, competitive pay — all from home.</p>
          <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
            <a href="#apply" style={{ display:'inline-block', background:'#F5A623', color:'#1B3A6B', fontWeight:700, padding:'13px 26px', borderRadius:10, textDecoration:'none' }}>Apply Now →</a>
            <a href="#benefits" style={{ display:'inline-block', background:'rgba(255,255,255,0.12)', color:'white', fontWeight:600, padding:'13px 26px', borderRadius:10, textDecoration:'none', border:'1px solid rgba(255,255,255,0.2)' }}>Learn More</a>
          </div>
        </div>
      </section>

      {/* STATS */}
      <div style={{ background:'white', padding:'28px 20px', boxShadow:'0 2px 12px rgba(27,58,107,0.06)' }}>
        <div style={{ maxWidth:1100, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(120px,1fr))', gap:20 }}>
          {[['200+','Women Educators'],['₹25K+','Avg Monthly'],['Flexible','Work Hours'],['100%','Work From Home'],['Free','Training']].map(([n,l]) => (
            <div key={l} style={{ textAlign:'center' }}>
              <div style={{ fontSize:'1.5rem', fontWeight:800, color:'#1B3A6B', fontFamily:'var(--font-body)' }}>{n}</div>
              <div style={{ fontSize:'0.75rem', color:'#4A5E7A', marginTop:2 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* BENEFITS */}
      <section id="benefits" style={{ background:'white', padding:'60px 0' }}>
        <div style={{ maxWidth:1100, margin:'0 auto', padding:'0 20px' }}>
          <div style={{ textAlign:'center', marginBottom:40 }}>
            {tag('Why Teachs','#0099B2')}
            <h2 style={{ color:'#1B3A6B', margin:0 }}>Everything You Need to Succeed</h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:16 }}>
            {[['🏠','Work From Home','Teach from your home, no commute.','#1B3A6B'],['⏰','Your Hours','Set your own timetable.','#0099B2'],['💰','Great Pay','₹15,000–₹50,000/month.','#2A8A5E'],['📚','Curriculum Provided','Lesson plans & materials provided.','#F5A623'],['🎓','Free Training','Full onboarding, no experience needed.','#1B3A6B'],['📈','Career Growth','Performance rewards & senior roles.','#0099B2'],['🤝','Community','200+ supportive women educators.','#2A8A5E'],['🏆','Certificate','Official Teachs Certified Educator badge.','#F5A623']].map(([icon,title,desc,accent]) => (
              <div key={title} style={{ background:'#FAF7F2', borderRadius:14, padding:'22px 18px', border:'1px solid rgba(27,58,107,0.07)' }}>
                <div style={{ width:46, height:46, borderRadius:12, background:`${accent}12`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.3rem', marginBottom:12 }}>{icon}</div>
                <h3 style={{ color:'#1B3A6B', fontSize:'0.9rem', marginBottom:6, fontFamily:'var(--font-body)', fontWeight:700 }}>{title}</h3>
                <p style={{ color:'#4A5E7A', fontSize:'0.82rem', lineHeight:1.6, margin:0 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CERTIFICATE */}
      <section style={{ background:'linear-gradient(135deg,#1B3A6B,#0a1e40)', padding:'60px 0' }}>
        <div style={{ maxWidth:1100, margin:'0 auto', padding:'0 20px' }}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:40, alignItems:'center' }}>
            <div>
              {tag('Recognition','#F5A623')}
              <h2 style={{ color:'white', marginBottom:16 }}>Earn Your Teachs Certificate</h2>
              <p style={{ color:'rgba(255,255,255,0.7)', lineHeight:1.8, marginBottom:24 }}>Every Teachs educator receives an official digital certificate. Display it on LinkedIn, share with parents, build your reputation.</p>
              <div style={{ display:'grid', gap:12 }}>
                {[['🏆','Certified Educator Badge','On your public profile'],['📄','Digital Certificate','Shareable on LinkedIn'],['⭐','Performance Awards','Quarterly recognition'],['🎯','Subject Certificates','Subject-specific credentials']].map(([icon,title,sub]) => (
                  <div key={title} style={{ display:'flex', gap:12, alignItems:'center' }}>
                    <div style={{ width:36, height:36, borderRadius:9, background:'rgba(245,166,35,0.12)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1rem', flexShrink:0 }}>{icon}</div>
                    <div><div style={{ color:'white', fontWeight:600, fontSize:'0.875rem' }}>{title}</div><div style={{ color:'rgba(255,255,255,0.5)', fontSize:'0.76rem', marginTop:1 }}>{sub}</div></div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background:'rgba(255,255,255,0.06)', borderRadius:20, padding:'32px 24px', border:'1px solid rgba(245,166,35,0.2)', textAlign:'center' }}>
              <div style={{ fontSize:'2.5rem', marginBottom:10 }}>🏅</div>
              <div style={{ color:'#F5A623', fontWeight:700, fontSize:'0.8rem', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:6 }}>Teachs Learning Pvt Ltd</div>
              <div style={{ color:'white', fontWeight:800, fontSize:'1.3rem', fontFamily:'var(--font-display)', marginBottom:4 }}>Certified Educator</div>
              <div style={{ color:'#F5A623', fontSize:'0.82rem', marginBottom:18 }}>Mathematics Specialist</div>
              <div style={{ border:'1px solid rgba(245,166,35,0.25)', borderRadius:10, padding:'10px 16px', fontSize:'0.75rem', color:'rgba(255,255,255,0.5)' }}>Verified · 2025 · Digital Certificate</div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ background:'#FAF7F2', padding:'60px 0' }}>
        <div style={{ maxWidth:1100, margin:'0 auto', padding:'0 20px' }}>
          <div style={{ textAlign:'center', marginBottom:40 }}>
            {tag('Process','#1B3A6B')}
            <h2 style={{ color:'#1B3A6B', margin:0 }}>Simple 4-Step Process</h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:20 }}>
            {[['1','Apply Online','Fill the form below in 5 minutes.'],['2','Interview','20-min video call with our team.'],['3','Training','3-day online onboarding program.'],['4','Start Earning','Get your first student in 7 days!']].map(([num,title,desc]) => (
              <div key={num} style={{ textAlign:'center', padding:'28px 16px', background:'white', borderRadius:18, boxShadow:'0 2px 12px rgba(27,58,107,0.06)' }}>
                <div style={{ width:50, height:50, borderRadius:'50%', background:'#1B3A6B', color:'#F5A623', fontSize:'1.2rem', fontWeight:800, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px', fontFamily:'var(--font-body)' }}>{num}</div>
                <h3 style={{ color:'#1B3A6B', fontSize:'0.95rem', marginBottom:6, fontFamily:'var(--font-body)', fontWeight:700 }}>{title}</h3>
                <p style={{ color:'#4A5E7A', fontSize:'0.83rem', margin:0 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ background:'white', padding:'60px 0' }}>
        <div style={{ maxWidth:1100, margin:'0 auto', padding:'0 20px' }}>
          <div style={{ textAlign:'center', marginBottom:36 }}>
            {tag('Stories','#F5A623')}
            <h2 style={{ color:'#1B3A6B', margin:0 }}>Our Educators Love Teachs</h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:20 }}>
            {[['Priya S.','Maths Teacher, Delhi','Mother of 2','Teachs changed my life. I earn ₹32,000/month teaching from home. My kids see me work hard and that sets a great example.'],['Meera R.','Science Teacher, Mumbai','Ex-school Teacher','Better pay, no commute, and I actually enjoy teaching again. Best decision I made.'],['Kavya M.','English Teacher, Bangalore','Homemaker','I was a homemaker for 5 years. Teachs gave me financial independence and a career I am proud of.']].map(([name,role,tag2,quote]) => (
              <div key={name} style={{ background:'#FAF7F2', borderRadius:18, padding:'24px 20px', border:'1px solid rgba(27,58,107,0.07)' }}>
                <div style={{ display:'flex', gap:12, alignItems:'center', marginBottom:14 }}>
                  <div style={{ width:44, height:44, borderRadius:'50%', background:'linear-gradient(135deg,#1B3A6B,#0099B2)', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontWeight:700, fontSize:'1rem', flexShrink:0 }}>{name[0]}</div>
                  <div><div style={{ fontWeight:700, color:'#1B3A6B', fontSize:'0.875rem' }}>{name}</div><div style={{ fontSize:'0.74rem', color:'#0099B2', fontWeight:600 }}>{role}</div><div style={{ fontSize:'0.72rem', color:'#4A5E7A' }}>{tag2}</div></div>
                </div>
                <p style={{ color:'#4A5E7A', fontSize:'0.875rem', lineHeight:1.7, fontStyle:'italic', margin:0 }}>"{quote}"</p>
                <div style={{ marginTop:10, color:'#F5A623' }}>★★★★★</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FORM */}
      <section id="apply" style={{ background:'#FAF7F2', padding:'60px 0' }}>
        <div style={{ maxWidth:620, margin:'0 auto', padding:'0 20px' }}>
          <div style={{ textAlign:'center', marginBottom:32 }}>
            {tag('Apply Now','#1B3A6B')}
            <h2 style={{ color:'#1B3A6B', marginBottom:8 }}>Join the Teaching Team</h2>
            <p style={{ color:'#4A5E7A', fontSize:'0.9rem' }}>We review all applications within 2–3 business days.</p>
          </div>
          {success ? (
            <div style={{ textAlign:'center', padding:'48px 20px', background:'white', borderRadius:20, border:'1px solid rgba(27,58,107,0.1)' }}>
              <div style={{ fontSize:'3rem', marginBottom:14 }}>🎉</div>
              <h3 style={{ color:'#1B3A6B', marginBottom:8 }}>Application Received!</h3>
              <p style={{ color:'#4A5E7A' }}>{success}</p>
            </div>
          ) : (
            <div style={{ background:'white', borderRadius:20, padding:'32px 24px', border:'1px solid rgba(27,58,107,0.1)', boxShadow:'0 4px 24px rgba(27,58,107,0.08)' }}>
              {error && <div style={{ background:'rgba(192,57,43,0.08)', border:'1px solid rgba(192,57,43,0.2)', borderRadius:10, padding:'12px', marginBottom:16, color:'#C0392B', fontSize:'0.875rem' }}>{error}</div>}
              <form onSubmit={submit} style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                <div style={{ gridColumn:'1/-1' }}><label style={lbl}>Full Name *</label><input value={form.name} onChange={e=>set('name',e.target.value)} required style={inp} placeholder="Your full name"/></div>
                <div><label style={lbl}>Phone *</label><input value={form.phone} onChange={e=>set('phone',e.target.value)} required style={inp} placeholder="+91 XXXXX XXXXX"/></div>
                <div><label style={lbl}>Email</label><input type="email" value={form.email} onChange={e=>set('email',e.target.value)} style={inp} placeholder="your@email.com"/></div>
                <div><label style={lbl}>City</label><input value={form.city} onChange={e=>set('city',e.target.value)} style={inp}/></div>
                <div><label style={lbl}>Qualification</label><input value={form.qualification} onChange={e=>set('qualification',e.target.value)} placeholder="e.g. B.Ed, M.Sc" style={inp}/></div>
                <div style={{ gridColumn:'1/-1' }}><label style={lbl}>Subjects You Can Teach *</label><input value={form.subjects} onChange={e=>set('subjects',e.target.value)} required placeholder="e.g. Mathematics, Science" style={inp}/></div>
                <div><label style={lbl}>Classes</label><input value={form.availability} onChange={e=>set('availability',e.target.value)} placeholder="e.g. Class 6–10" style={inp}/></div>
                <div><label style={lbl}>Availability</label><input value={form.message} onChange={e=>set('message',e.target.value)} placeholder="Evenings, Weekends" style={inp}/></div>
                <div style={{ gridColumn:'1/-1' }}><label style={lbl}>Teaching Experience</label><textarea value={form.experience} onChange={e=>set('experience',e.target.value)} rows={3} placeholder="Your background and why you want to join..." style={{...inp,resize:'vertical'}}/></div>
                <div style={{ gridColumn:'1/-1' }}>
                  <button type="submit" disabled={loading} style={{ width:'100%', padding:'14px', background:'#1B3A6B', color:'white', border:'none', borderRadius:12, fontWeight:700, fontSize:'1rem', cursor:'pointer', fontFamily:'var(--font-body)' }}>
                    {loading ? 'Submitting...' : 'Submit Application →'}
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
