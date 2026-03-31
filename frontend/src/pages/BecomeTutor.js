import React, { useState, useEffect } from 'react';
import api from '../utils/api';

export default function BecomeTutor() {
  const [form, setForm] = useState({ name:'', email:'', phone:'', city:'', qualification:'', subjects:'', experience:'', availability:'', message:'' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = 'Become an Online Tutor | Teachs – Earn From Home';
    const meta = document.querySelector('meta[name="description"]') || document.createElement('meta');
    meta.name = 'description';
    meta.content = 'Join Teachs as an online tutor. Work from home, earn ₹15,000–₹50,000/month, flexible hours, free training, official certification. Apply now for home tutor jobs in India.';
    document.head.appendChild(meta);
  }, []);

  const set = (k, v) => setForm(f => ({...f, [k]: v}));
  const submit = async e => {
    e.preventDefault(); setLoading(true); setError('');
    try {
      const payload = {...form, message: `Classes: ${form.message}\nAvailability: ${form.availability}\n${form.experience}`};
      const res = await api.post('/women/apply', payload);
      setSuccess(res.data.message || 'Application submitted successfully!');
    } catch(err) { setError(err.response?.data?.error || 'Submission failed. Please try again.'); }
    finally { setLoading(false); }
  };

  const inp = { width:'100%', padding:'12px 16px', background:'white', border:'1.5px solid rgba(0,0,0,0.1)', borderRadius:10, color:'var(--text)', fontSize:'0.9rem', fontFamily:'var(--font-body)', outline:'none', boxSizing:'border-box' };
  const lbl = { display:'block', fontSize:'0.82rem', color:'var(--text2)', marginBottom:6, fontWeight:600 };

  return (
    <div style={{ background:'var(--cream)' }}>
      {/* Hero */}
      <section style={{ background:'linear-gradient(135deg, var(--navy) 0%, #1a3a6e 100%)', padding:'100px 0 80px', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:-100, right:-100, width:400, height:400, borderRadius:'50%', background:'rgba(212,168,83,0.07)' }}/>
        <div className="container" style={{ position:'relative' }}>
          <div style={{ maxWidth:640 }}>
            <span className="section-tag">Join Our Team</span>
            <h1 style={{ color:'white', marginTop:14, marginBottom:18 }}>Turn Your Knowledge<br/>Into a Career</h1>
            <p style={{ color:'rgba(255,255,255,0.8)', fontSize:'1.05rem', lineHeight:1.8, marginBottom:36 }}>
              Become a certified Teachs educator. Work from home, earn well, make a real difference in students' lives — all on your schedule.
            </p>
            <div style={{ display:'flex', gap:16, flexWrap:'wrap' }}>
              <a href="#apply" className="btn btn-gold btn-lg">Apply Now — It's Free →</a>
              <div style={{ display:'flex', alignItems:'center', gap:8, color:'rgba(255,255,255,0.6)', fontSize:'0.88rem' }}>
                <span>⚡</span> Response within 48 hours
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick stats */}
      <div style={{ background:'white', padding:'28px 0', borderBottom:'1px solid rgba(0,0,0,0.07)' }}>
        <div className="container" style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(130px,1fr))', gap:20 }}>
          {[['1000+','Students Impacted'],['₹25K+','Avg Monthly Pay'],['4.8★','Teacher Rating'],['48hrs','Hiring Time'],['Free','Training']].map(([n,l]) => (
            <div key={l} style={{ textAlign:'center' }}>
              <div style={{ fontSize:'1.4rem', fontWeight:800, color:'var(--navy)', fontFamily:'var(--font-body)' }}>{n}</div>
              <div style={{ fontSize:'0.75rem', color:'var(--text2)', marginTop:2 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* What you get */}
      <section style={{ background:'white', padding:'80px 0' }}>
        <div className="container">
          <div className="section-header center" style={{ marginBottom:52 }}>
            <span className="section-tag">Benefits</span>
            <h2 className="section-title">Why Teach With Teachs?</h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:20 }}>
            {[
              ['💰','Earn ₹15K–₹50K/Month','Competitive pay based on experience, classes, and performance. Paid every month, on time.','#2A8A5E'],
              ['🏠','100% Work From Home','No commute, no fixed location. Teach from anywhere in India with a stable internet connection.','var(--teal)'],
              ['⏰','Your Schedule, Your Rules','Morning or evening, weekdays or weekends — you decide when you work.','#9B59B6'],
              ['📚','We Handle the Curriculum','Lesson plans, worksheets, and test papers — all provided. Just focus on teaching.','#E67E22'],
              ['🎓','Official Certification','Earn a Teachs Certified Educator badge and digital certificate to boost your profile.','var(--navy)'],
              ['📈','Growth Opportunities','Top teachers get senior roles, higher pay, and opportunities to mentor new educators.','#C0392B'],
            ].map(([icon,title,desc,accent]) => (
              <div key={title} style={{ background:'var(--cream)', borderRadius:18, padding:'28px 22px', border:'1px solid rgba(0,0,0,0.05)' }}>
                <div style={{ width:50, height:50, borderRadius:13, background:`${accent}12`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.4rem', marginBottom:16 }}>{icon}</div>
                <h3 style={{ color:'var(--text)', fontSize:'0.95rem', marginBottom:8, fontFamily:'var(--font-body)', fontWeight:700 }}>{title}</h3>
                <p style={{ color:'var(--text2)', fontSize:'0.855rem', lineHeight:1.65, margin:0 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certification */}
      <section style={{ background:'linear-gradient(135deg, #1B3A6B 0%, #0a1e40 100%)', padding:'80px 0' }}>
        <div className="container">
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:60, alignItems:'center' }}>
            <div>
              <span className="section-tag">Official Recognition</span>
              <h2 style={{ color:'white', marginTop:14, marginBottom:18 }}>Get Certified by Teachs</h2>
              <p style={{ color:'var(--slate2)', lineHeight:1.8, marginBottom:28 }}>
                Complete our training program and earn an official Teachs Certified Educator certificate — recognized by parents, schools, and coaching institutes across India.
              </p>
              <div style={{ display:'grid', gap:16 }}>
                {[
                  ['🏆','Digital Badge','Add to LinkedIn, resume, and social media'],
                  ['📜','Certificate of Completion','Official PDF with Teachs seal and signature'],
                  ['⭐','Subject Specialization','Math, Science, English — get certified per subject'],
                  ['🎖','Annual Excellence Award','Top 10% teachers recognized every year'],
                ].map(([icon,title,sub]) => (
                  <div key={title} style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
                    <div style={{ width:38, height:38, borderRadius:10, background:'rgba(212,168,83,0.12)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1rem', flexShrink:0 }}>{icon}</div>
                    <div><div style={{ color:'white', fontWeight:600, fontSize:'0.88rem' }}>{title}</div><div style={{ color:'var(--slate)', fontSize:'0.78rem', marginTop:2 }}>{sub}</div></div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background:'rgba(255,255,255,0.06)', borderRadius:24, padding:'40px 32px', border:'1px solid rgba(212,168,83,0.25)', textAlign:'center' }}>
              <div style={{ fontSize:'2.5rem', marginBottom:12 }}>🏅</div>
              <div style={{ color:'var(--gold)', fontWeight:700, fontSize:'0.8rem', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:6 }}>Teachs Learning Pvt Ltd</div>
              <div style={{ color:'white', fontWeight:800, fontSize:'1.5rem', fontFamily:'var(--font-display)', marginBottom:4 }}>Certified Educator</div>
              <div style={{ color:'var(--gold)', fontSize:'0.85rem', marginBottom:20 }}>Mathematics & Science Specialist</div>
              <div style={{ borderTop:'1px solid rgba(255,255,255,0.1)', paddingTop:16, fontSize:'0.78rem', color:'var(--slate)' }}>
                Verified • Issued 2025 • Digital Certificate
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who can apply */}
      <section style={{ background:'var(--cream)', padding:'80px 0' }}>
        <div className="container">
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:60, alignItems:'center' }}>
            <div>
              <span className="section-tag">Eligibility</span>
              <h2 className="section-title" style={{ marginTop:14 }}>Who Can Apply?</h2>
              <div style={{ display:'grid', gap:12, marginTop:24 }}>
                {[
                  'Graduate or postgraduate in any subject','Minimum 1 year of teaching experience','Strong communication skills in English or Hindi','Laptop/desktop with working camera','Stable internet connection (minimum 5 Mbps)','Passion for teaching and student growth',
                ].map(item => (
                  <div key={item} style={{ display:'flex', gap:12, alignItems:'center', padding:'12px 16px', background:'white', borderRadius:10, border:'1px solid rgba(0,0,0,0.06)' }}>
                    <div style={{ width:28, height:28, borderRadius:'50%', background:'rgba(0,153,178,0.1)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="var(--teal)" strokeWidth="2.5" strokeLinecap="round"/></svg>
                    </div>
                    <span style={{ color:'var(--text)', fontSize:'0.875rem', fontWeight:500 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <span className="section-tag">Process</span>
              <h2 className="section-title" style={{ marginTop:14 }}>Simple 4-Step Process</h2>
              <div style={{ display:'grid', gap:16, marginTop:24 }}>
                {[['1','Apply Online','Fill our simple form. Takes less than 5 minutes.'],['2','Demo Session','Conduct a 20-min demo class for our evaluator.'],['3','Training','Complete our 3-day online onboarding training.'],['4','Start Earning','Get matched with students and start earning!']].map(([num,title,desc]) => (
                  <div key={num} style={{ display:'flex', gap:16, alignItems:'flex-start' }}>
                    <div style={{ width:40, height:40, borderRadius:'50%', background:'var(--navy)', color:'var(--gold)', fontSize:'1rem', fontWeight:800, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontFamily:'var(--font-body)' }}>{num}</div>
                    <div style={{ paddingTop:4 }}><div style={{ fontWeight:700, color:'var(--text)', fontSize:'0.9rem' }}>{title}</div><div style={{ color:'var(--text2)', fontSize:'0.83rem', marginTop:2 }}>{desc}</div></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Form */}
      <section id="apply" style={{ background:'white', padding:'80px 0' }}>
        <div className="container">
          <div style={{ maxWidth:640, margin:'0 auto' }}>
            <div className="section-header center" style={{ marginBottom:40 }}>
              <span className="section-tag">Get Started</span>
              <h2 className="section-title">Apply to Join Teachs</h2>
              <p className="section-sub" style={{ margin:'0 auto' }}>Free application. Response within 48 hours. No commitment required.</p>
            </div>
            {success ? (
              <div style={{ textAlign:'center', padding:'60px 20px', background:'var(--cream)', borderRadius:24, border:'1px solid rgba(0,0,0,0.07)' }}>
                <div style={{ fontSize:'3.5rem', marginBottom:16 }}>🎉</div>
                <h3 style={{ color:'var(--text)', marginBottom:10 }}>Application Received!</h3>
                <p style={{ color:'var(--text2)' }}>{success}</p>
              </div>
            ) : (
              <div style={{ background:'var(--cream)', borderRadius:24, padding:'40px 32px', border:'1px solid rgba(0,0,0,0.07)' }}>
                {error && <div style={{ background:'rgba(192,57,43,0.08)', border:'1px solid rgba(192,57,43,0.2)', borderRadius:10, padding:'12px 16px', marginBottom:20, color:'var(--error)', fontSize:'0.88rem' }}>{error}</div>}
                <form onSubmit={submit} style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
                  <div style={{ gridColumn:'1/-1' }}><label style={lbl}>Full Name *</label><input value={form.name} onChange={e=>set('name',e.target.value)} required style={inp} placeholder="Your full name"/></div>
                  <div><label style={lbl}>Phone *</label><input value={form.phone} onChange={e=>set('phone',e.target.value)} required style={inp} placeholder="+91 XXXXX XXXXX"/></div>
                  <div><label style={lbl}>Email Address</label><input type="email" value={form.email} onChange={e=>set('email',e.target.value)} style={inp} placeholder="your@email.com"/></div>
                  <div><label style={lbl}>City</label><input value={form.city} onChange={e=>set('city',e.target.value)} style={inp} placeholder="Your city"/></div>
                  <div><label style={lbl}>Highest Qualification</label><input value={form.qualification} onChange={e=>set('qualification',e.target.value)} placeholder="e.g. B.Ed, M.Sc Maths" style={inp}/></div>
                  <div style={{ gridColumn:'1/-1' }}><label style={lbl}>Subjects You Can Teach *</label><input value={form.subjects} onChange={e=>set('subjects',e.target.value)} required placeholder="e.g. Mathematics, Physics, English" style={inp}/></div>
                  <div><label style={lbl}>Classes (e.g. 6–10)</label><input value={form.message} onChange={e=>set('message',e.target.value)} placeholder="Class 6–10" style={inp}/></div>
                  <div><label style={lbl}>Availability</label><input value={form.availability} onChange={e=>set('availability',e.target.value)} placeholder="Evenings, Weekends" style={inp}/></div>
                  <div style={{ gridColumn:'1/-1' }}><label style={lbl}>Teaching Experience & Motivation</label><textarea value={form.experience} onChange={e=>set('experience',e.target.value)} rows={4} placeholder="Tell us about your teaching background and why you want to join Teachs..." style={{...inp, resize:'vertical'}}/></div>
                  <div style={{ gridColumn:'1/-1' }}>
                    <button type="submit" disabled={loading} className="btn btn-gold btn-lg" style={{ width:'100%', justifyContent:'center' }}>
                      {loading ? 'Submitting...' : 'Submit Application →'}
                    </button>
                    <p style={{ textAlign:'center', color:'var(--text2)', fontSize:'0.78rem', marginTop:12, margin:'12px 0 0' }}>Free to apply. We will contact you within 48 hours.</p>
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
