import React, { useState, useEffect } from 'react';
import api from '../utils/api';

export default function BecomeTutor() {
  const [form, setForm] = useState({ name:'',email:'',phone:'',city:'',qualification:'',subjects:'',experience:'',availability:'',message:'' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => { document.title = 'Become an Online Tutor | Teachs – Earn From Home'; }, []);

  const set = (k,v) => setForm(f => ({...f,[k]:v}));
  const submit = async e => {
    e.preventDefault(); setLoading(true); setError('');
    try {
      const payload = {...form, message:`Classes: ${form.message}\nAvailability: ${form.availability}\n${form.experience}`};
      const res = await api.post('/women/apply', payload);
      setSuccess(res.data.message || 'Application submitted!');
    } catch(err) { setError(err.response?.data?.error || 'Submission failed.'); }
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
      <section style={{ background:'linear-gradient(135deg,#1B3A6B,#0a1e40)', padding:'80px 0 60px', overflow:'hidden', position:'relative' }}>
        <div style={{ position:'absolute', top:-60, right:-60, width:280, height:280, borderRadius:'50%', background:'rgba(245,166,35,0.07)' }}/>
        <div style={{ maxWidth:1100, margin:'0 auto', padding:'0 20px', position:'relative' }}>
          {tag('Join Our Team','#F5A623')}
          <h1 style={{ color:'white', marginBottom:16, maxWidth:520 }}>Turn Your Knowledge Into a Career</h1>
          <p style={{ color:'rgba(255,255,255,0.8)', maxWidth:480, marginBottom:32, lineHeight:1.75 }}>Become a certified Teachs educator. Work from home, earn well, make a real difference in students' lives — on your schedule.</p>
          <div style={{ display:'flex', gap:12, flexWrap:'wrap', alignItems:'center' }}>
            <a href="#apply" style={{ display:'inline-block', background:'#F5A623', color:'#1B3A6B', fontWeight:700, padding:'13px 26px', borderRadius:10, textDecoration:'none' }}>Apply Now — Free →</a>
            <span style={{ color:'rgba(255,255,255,0.55)', fontSize:'0.85rem' }}>⚡ Response within 48 hours</span>
          </div>
        </div>
      </section>

      {/* STATS */}
      <div style={{ background:'white', padding:'26px 20px', borderBottom:'1px solid rgba(27,58,107,0.07)' }}>
        <div style={{ maxWidth:1100, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(110px,1fr))', gap:16 }}>
          {[['1000+','Students Impacted'],['₹25K+','Avg Monthly Pay'],['4.8★','Teacher Rating'],['48hrs','Hiring Time'],['Free','Training']].map(([n,l]) => (
            <div key={l} style={{ textAlign:'center' }}>
              <div style={{ fontSize:'1.3rem', fontWeight:800, color:'#1B3A6B', fontFamily:'var(--font-body)' }}>{n}</div>
              <div style={{ fontSize:'0.72rem', color:'#4A5E7A', marginTop:2 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* BENEFITS */}
      <section style={{ background:'white', padding:'60px 0' }}>
        <div style={{ maxWidth:1100, margin:'0 auto', padding:'0 20px' }}>
          <div style={{ textAlign:'center', marginBottom:36 }}>
            {tag('Benefits','#0099B2')}
            <h2 style={{ color:'#1B3A6B', margin:0 }}>Why Teach With Teachs?</h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:16 }}>
            {[['💰','Earn ₹15K–₹50K/Month','Competitive pay based on experience. Paid monthly, on time.','#2A8A5E'],['🏠','100% Work From Home','Teach from anywhere in India with stable internet.','#1B3A6B'],['⏰','Your Schedule','Morning, evening, weekends — you decide.','#0099B2'],['📚','Curriculum Provided','Lesson plans, worksheets, tests — all provided.','#F5A623'],['🎓','Official Certificate','Teachs Certified Educator badge & digital certificate.','#1B3A6B'],['📈','Growth','Top teachers get senior roles and higher pay.','#0099B2']].map(([icon,title,desc,accent]) => (
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
              {tag('Official Recognition','#F5A623')}
              <h2 style={{ color:'white', marginBottom:16 }}>Get Certified by Teachs</h2>
              <p style={{ color:'rgba(255,255,255,0.7)', lineHeight:1.8, marginBottom:24 }}>Complete training and earn an official Teachs Certified Educator certificate — recognized by parents and schools across India.</p>
              <div style={{ display:'grid', gap:12 }}>
                {[['🏆','Digital Badge','LinkedIn, resume, social media'],['📜','Certificate of Completion','Official PDF with Teachs seal'],['⭐','Subject Specialization','Per-subject certification'],['🎖','Annual Excellence Award','Top 10% recognized yearly']].map(([icon,title,sub]) => (
                  <div key={title} style={{ display:'flex', gap:12, alignItems:'center' }}>
                    <div style={{ width:36, height:36, borderRadius:9, background:'rgba(245,166,35,0.12)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1rem', flexShrink:0 }}>{icon}</div>
                    <div><div style={{ color:'white', fontWeight:600, fontSize:'0.875rem' }}>{title}</div><div style={{ color:'rgba(255,255,255,0.5)', fontSize:'0.75rem', marginTop:1 }}>{sub}</div></div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background:'rgba(255,255,255,0.06)', borderRadius:20, padding:'32px 24px', border:'1px solid rgba(245,166,35,0.2)', textAlign:'center' }}>
              <div style={{ fontSize:'2.5rem', marginBottom:10 }}>🏅</div>
              <div style={{ color:'#F5A623', fontWeight:700, fontSize:'0.78rem', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:6 }}>Teachs Learning Pvt Ltd</div>
              <div style={{ color:'white', fontWeight:800, fontSize:'1.3rem', fontFamily:'var(--font-display)', marginBottom:4 }}>Certified Educator</div>
              <div style={{ color:'#F5A623', fontSize:'0.82rem', marginBottom:16 }}>Mathematics Specialist</div>
              <div style={{ border:'1px solid rgba(245,166,35,0.2)', borderRadius:10, padding:'10px', fontSize:'0.75rem', color:'rgba(255,255,255,0.4)' }}>Verified · 2025 · Digital</div>
            </div>
          </div>
        </div>
      </section>

      {/* ELIGIBILITY + PROCESS */}
      <section style={{ background:'#FAF7F2', padding:'60px 0' }}>
        <div style={{ maxWidth:1100, margin:'0 auto', padding:'0 20px' }}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:40 }}>
            <div>
              {tag('Eligibility','#0099B2')}
              <h2 style={{ color:'#1B3A6B', marginBottom:20 }}>Who Can Apply?</h2>
              <div style={{ display:'grid', gap:10 }}>
                {['Graduate or postgraduate in any subject','Minimum 1 year teaching experience','Good communication in English or Hindi','Laptop with working camera','Stable internet (min 5 Mbps)','Passion for teaching'].map(item => (
                  <div key={item} style={{ display:'flex', gap:10, alignItems:'center', background:'white', borderRadius:10, padding:'10px 14px', border:'1px solid rgba(27,58,107,0.07)' }}>
                    <div style={{ width:22, height:22, borderRadius:'50%', background:'rgba(0,153,178,0.1)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#0099B2" strokeWidth="2.5" strokeLinecap="round"/></svg>
                    </div>
                    <span style={{ color:'#1B3A6B', fontSize:'0.85rem', fontWeight:500 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              {tag('Process','#1B3A6B')}
              <h2 style={{ color:'#1B3A6B', marginBottom:20 }}>4 Simple Steps</h2>
              <div style={{ display:'grid', gap:14 }}>
                {[['1','Apply Online','Fill our form. Takes 5 minutes.'],['2','Demo Session','20-min demo class for our evaluator.'],['3','Training','3-day online onboarding program.'],['4','Start Earning','Get matched with students!']].map(([num,title,desc]) => (
                  <div key={num} style={{ display:'flex', gap:14, alignItems:'flex-start' }}>
                    <div style={{ width:38, height:38, borderRadius:'50%', background:'#1B3A6B', color:'#F5A623', fontSize:'0.95rem', fontWeight:800, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontFamily:'var(--font-body)' }}>{num}</div>
                    <div style={{ paddingTop:4 }}><div style={{ fontWeight:700, color:'#1B3A6B', fontSize:'0.9rem' }}>{title}</div><div style={{ color:'#4A5E7A', fontSize:'0.82rem', marginTop:2 }}>{desc}</div></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FORM */}
      <section id="apply" style={{ background:'white', padding:'60px 0' }}>
        <div style={{ maxWidth:600, margin:'0 auto', padding:'0 20px' }}>
          <div style={{ textAlign:'center', marginBottom:32 }}>
            {tag('Get Started','#F5A623')}
            <h2 style={{ color:'#1B3A6B', marginBottom:8 }}>Apply to Join Teachs</h2>
            <p style={{ color:'#4A5E7A', fontSize:'0.9rem' }}>Free application. Response within 48 hours.</p>
          </div>
          {success ? (
            <div style={{ textAlign:'center', padding:'48px 20px', background:'#FAF7F2', borderRadius:20, border:'1px solid rgba(27,58,107,0.1)' }}>
              <div style={{ fontSize:'3rem', marginBottom:14 }}>🎉</div>
              <h3 style={{ color:'#1B3A6B', marginBottom:8 }}>Application Received!</h3>
              <p style={{ color:'#4A5E7A' }}>{success}</p>
            </div>
          ) : (
            <div style={{ background:'#FAF7F2', borderRadius:20, padding:'32px 24px', border:'1px solid rgba(27,58,107,0.1)' }}>
              {error && <div style={{ background:'rgba(192,57,43,0.08)', border:'1px solid rgba(192,57,43,0.2)', borderRadius:10, padding:'12px', marginBottom:16, color:'#C0392B', fontSize:'0.875rem' }}>{error}</div>}
              <form onSubmit={submit} style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                <div style={{ gridColumn:'1/-1' }}><label style={lbl}>Full Name *</label><input value={form.name} onChange={e=>set('name',e.target.value)} required style={inp} placeholder="Your full name"/></div>
                <div><label style={lbl}>Phone *</label><input value={form.phone} onChange={e=>set('phone',e.target.value)} required style={inp} placeholder="+91 XXXXX"/></div>
                <div><label style={lbl}>Email</label><input type="email" value={form.email} onChange={e=>set('email',e.target.value)} style={inp} placeholder="your@email.com"/></div>
                <div><label style={lbl}>City</label><input value={form.city} onChange={e=>set('city',e.target.value)} style={inp}/></div>
                <div><label style={lbl}>Qualification</label><input value={form.qualification} onChange={e=>set('qualification',e.target.value)} placeholder="e.g. B.Ed, M.Sc" style={inp}/></div>
                <div style={{ gridColumn:'1/-1' }}><label style={lbl}>Subjects You Can Teach *</label><input value={form.subjects} onChange={e=>set('subjects',e.target.value)} required placeholder="e.g. Mathematics, Science, English" style={inp}/></div>
                <div><label style={lbl}>Classes</label><input value={form.message} onChange={e=>set('message',e.target.value)} placeholder="e.g. Class 6–10" style={inp}/></div>
                <div><label style={lbl}>Availability</label><input value={form.availability} onChange={e=>set('availability',e.target.value)} placeholder="Evenings, Weekends" style={inp}/></div>
                <div style={{ gridColumn:'1/-1' }}><label style={lbl}>Teaching Experience</label><textarea value={form.experience} onChange={e=>set('experience',e.target.value)} rows={3} placeholder="Your background and motivation..." style={{...inp,resize:'vertical'}}/></div>
                <div style={{ gridColumn:'1/-1' }}>
                  <button type="submit" disabled={loading} style={{ width:'100%', padding:'14px', background:'#1B3A6B', color:'white', border:'none', borderRadius:12, fontWeight:700, fontSize:'1rem', cursor:'pointer', fontFamily:'var(--font-body)' }}>
                    {loading ? 'Submitting...' : 'Submit Application →'}
                  </button>
                  <p style={{ textAlign:'center', color:'#4A5E7A', fontSize:'0.76rem', marginTop:10 }}>Free to apply. We contact you within 48 hours.</p>
                </div>
              </form>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
