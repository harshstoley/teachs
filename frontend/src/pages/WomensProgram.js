import React, { useState, useEffect } from 'react';
import api from '../utils/api';

export default function WomensProgram() {
  const [form, setForm] = useState({ name:'', email:'', phone:'', city:'', qualification:'', subjects:'', experience:'', availability:'', message:'' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = "Women's Teaching Program | Teachs – Work From Home & Earn";
    const meta = document.querySelector('meta[name="description"]') || document.createElement('meta');
    meta.name = 'description';
    meta.content = "Join Teachs Women's Program. Work from home as an online tutor. Flexible hours, competitive pay, full training, and a supportive community of women educators across India.";
    document.head.appendChild(meta);
  }, []);

  const set = (k, v) => setForm(f => ({...f, [k]: v}));
  const submit = async e => {
    e.preventDefault(); setLoading(true); setError('');
    try {
      const res = await api.post('/women/apply', form);
      setSuccess(res.data.message || 'Application submitted!');
    } catch(err) { setError(err.response?.data?.error || 'Submission failed.'); }
    finally { setLoading(false); }
  };

  const inp = { width:'100%', padding:'12px 16px', background:'white', border:'1.5px solid rgba(0,0,0,0.1)', borderRadius:10, color:'var(--text)', fontSize:'0.9rem', fontFamily:'var(--font-body)', outline:'none', transition:'border-color 0.2s', boxSizing:'border-box' };
  const lbl = { display:'block', fontSize:'0.82rem', color:'var(--text2)', marginBottom:6, fontWeight:600 };

  return (
    <div style={{ background:'var(--cream)' }}>
      {/* Hero */}
      <section style={{ background:'linear-gradient(135deg, #1B3A6B 0%, #0099B2 100%)', padding:'100px 0 80px', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:-80, right:-80, width:350, height:350, borderRadius:'50%', background:'rgba(255,255,255,0.05)' }}/>
        <div style={{ position:'absolute', bottom:-40, left:100, width:200, height:200, borderRadius:'50%', background:'rgba(255,255,255,0.04)' }}/>
        <div className="container" style={{ position:'relative' }}>
          <div style={{ maxWidth:620 }}>
            <span className="section-tag" style={{ background:'rgba(255,255,255,0.15)', color:'white' }}>Women's Program</span>
            <h1 style={{ color:'white', marginBottom:18, marginTop:14 }}>Teach. Earn. Grow.<br/>On Your Terms.</h1>
            <p style={{ color:'rgba(255,255,255,0.8)', fontSize:'1.05rem', lineHeight:1.8, marginBottom:32 }}>
              Join India's most trusted personalized tutoring platform as a work-from-home educator. Flexible hours, premium students, and a career that fits around your life.
            </p>
            <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
              <a href="#apply" className="btn btn-gold btn-lg">Apply Now →</a>
              <a href="#benefits" className="btn btn-outline-white btn-lg">Learn More</a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div style={{ background:'white', padding:'32px 0', boxShadow:'0 4px 20px rgba(0,0,0,0.06)' }}>
        <div className="container" style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:24 }}>
          {[['200+','Women Educators'],['₹25,000+','Avg Monthly Earning'],['Flexible','Work Hours'],['100%','Work From Home'],['Free','Training Provided']].map(([n,l]) => (
            <div key={l} style={{ textAlign:'center', padding:'8px 0' }}>
              <div style={{ fontSize:'1.6rem', fontWeight:800, color:'var(--navy)', fontFamily:'var(--font-body)' }}>{n}</div>
              <div style={{ fontSize:'0.78rem', color:'var(--text2)', fontWeight:500, marginTop:2 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits */}
      <section id="benefits" style={{ background:'white', padding:'80px 0' }}>
        <div className="container">
          <div className="section-header center" style={{ marginBottom:52 }}>
            <span className="section-tag">Why Teachs</span>
            <h2 className="section-title">Everything You Need to Succeed</h2>
            <p className="section-sub" style={{ margin:'0 auto' }}>We designed this program specifically for women who want a professional career without compromising on family time.</p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:24 }}>
            {[
              ['🏠','100% Work From Home','Teach from your living room. No commute, no childcare worries. Your home, your schedule.','var(--teal)'],
              ['⏰','You Choose Your Hours','Set your own timetable. Morning, evening, weekend — teach when it suits you best.','#9B59B6'],
              ['💰','Competitive Pay','Earn ₹15,000–₹50,000/month based on experience. Timely payments, no delays.','#2A8A5E'],
              ['📚','Structured Curriculum','We provide lesson plans, tests, and materials. Just show up and teach.','#E67E22'],
              ['🎓','Free Training & Onboarding','No prior online teaching experience? No problem. We train you completely.','var(--navy)'],
              ['📈','Career Growth','Performance rewards, senior roles, and mentorship opportunities as you grow.','#C0392B'],
              ['🤝','Supportive Community','Join a network of 200+ women educators who support and inspire each other.','#1ABC9C'],
              ['🏆','Recognition & Certificates','Earn Teachs Certified Educator badge displayed on your profile.','var(--gold)'],
            ].map(([icon,title,desc,accent]) => (
              <div key={title} style={{ background:'var(--cream)', borderRadius:16, padding:'28px 24px', border:'1px solid rgba(0,0,0,0.06)', transition:'transform 0.2s, box-shadow 0.2s' }}>
                <div style={{ width:52, height:52, borderRadius:14, background:`${accent}15`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.5rem', marginBottom:16 }}>{icon}</div>
                <h3 style={{ color:'var(--text)', fontSize:'1rem', marginBottom:8, fontFamily:'var(--font-body)', fontWeight:700 }}>{title}</h3>
                <p style={{ color:'var(--text2)', fontSize:'0.875rem', lineHeight:1.65, margin:0 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certificate Section */}
      <section style={{ background:'linear-gradient(135deg, var(--navy) 0%, #1a3a6e 100%)', padding:'80px 0' }}>
        <div className="container">
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:60, alignItems:'center' }}>
            <div>
              <span className="section-tag">Recognition</span>
              <h2 style={{ color:'white', marginTop:14, marginBottom:18 }}>Earn Your Teachs Educator Certificate</h2>
              <p style={{ color:'var(--slate2)', lineHeight:1.8, marginBottom:28 }}>
                Every Teachs educator receives an official digital certificate upon completing our training program. Display it on LinkedIn, share it with parents, and build your professional reputation.
              </p>
              <div style={{ display:'grid', gap:14 }}>
                {[
                  ['🏆','Teachs Certified Educator Badge','Displayed on your public profile'],
                  ['📄','Official Digital Certificate','Shareable on LinkedIn & WhatsApp'],
                  ['⭐','Performance Awards','Quarterly recognition for top teachers'],
                  ['🎯','Specialization Certificates','Subject-specific credentials'],
                ].map(([icon,title,sub]) => (
                  <div key={title} style={{ display:'flex', gap:14, alignItems:'flex-start' }}>
                    <div style={{ width:40, height:40, borderRadius:10, background:'rgba(212,168,83,0.15)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.1rem', flexShrink:0 }}>{icon}</div>
                    <div><div style={{ color:'white', fontWeight:600, fontSize:'0.9rem' }}>{title}</div><div style={{ color:'var(--slate)', fontSize:'0.8rem', marginTop:2 }}>{sub}</div></div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background:'rgba(255,255,255,0.05)', borderRadius:24, padding:'40px', border:'1px solid rgba(212,168,83,0.2)', textAlign:'center' }}>
              <div style={{ fontSize:'3rem', marginBottom:16 }}>🏅</div>
              <div style={{ color:'var(--gold)', fontWeight:700, fontSize:'1.1rem', marginBottom:8 }}>Teachs Certified Educator</div>
              <div style={{ color:'white', fontWeight:800, fontSize:'1.4rem', fontFamily:'var(--font-display)', marginBottom:6 }}>Your Name Here</div>
              <div style={{ color:'var(--slate2)', fontSize:'0.85rem', marginBottom:20 }}>Specialization: Mathematics & Science</div>
              <div style={{ border:'1px solid rgba(212,168,83,0.3)', borderRadius:12, padding:'12px 20px' }}>
                <div style={{ fontSize:'0.72rem', color:'var(--slate)', marginBottom:4 }}>Issued by</div>
                <div style={{ color:'var(--gold)', fontWeight:700 }}>Teachs Learning Pvt Ltd</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ background:'var(--cream)', padding:'80px 0' }}>
        <div className="container">
          <div className="section-header center" style={{ marginBottom:52 }}>
            <span className="section-tag">Process</span>
            <h2 className="section-title">How to Join</h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:24 }}>
            {[
              ['1','Apply Online','Fill the form below. Takes 5 minutes.'],
              ['2','Interview Call','Short 20-min video call with our team.'],
              ['3','Training','3-day online onboarding program.'],
              ['4','Start Teaching','Get your first student within 7 days!'],
            ].map(([num,title,desc]) => (
              <div key={num} style={{ textAlign:'center', padding:'32px 20px', background:'white', borderRadius:20, boxShadow:'0 4px 20px rgba(0,0,0,0.06)' }}>
                <div style={{ width:56, height:56, borderRadius:'50%', background:'var(--navy)', color:'var(--gold)', fontSize:'1.4rem', fontWeight:800, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px', fontFamily:'var(--font-body)' }}>{num}</div>
                <h3 style={{ color:'var(--text)', fontSize:'1rem', marginBottom:8, fontFamily:'var(--font-body)', fontWeight:700 }}>{title}</h3>
                <p style={{ color:'var(--text2)', fontSize:'0.875rem', margin:0 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ background:'white', padding:'80px 0' }}>
        <div className="container">
          <div className="section-header center" style={{ marginBottom:48 }}>
            <span className="section-tag">Stories</span>
            <h2 className="section-title">Our Educators Love Teachs</h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:24 }}>
            {[
              ['Priya S.','Mathematics Teacher, Delhi','Mother of 2','Teachs changed my life. I earn ₹32,000/month teaching from home. My kids see me work hard and it sets a great example.'],
              ['Meera R.','Science Teacher, Mumbai','Former School Teacher','I left my school job for Teachs and never looked back. Better pay, no commute, and I actually enjoy teaching again.'],
              ['Kavya M.','English Teacher, Bangalore','Homemaker turned Educator','I was a homemaker for 5 years. Teachs gave me financial independence and a career I am proud of.'],
            ].map(([name,role,tag,quote]) => (
              <div key={name} style={{ background:'var(--cream)', borderRadius:20, padding:'28px 24px', border:'1px solid rgba(0,0,0,0.06)' }}>
                <div style={{ display:'flex', gap:14, alignItems:'center', marginBottom:18 }}>
                  <div style={{ width:48, height:48, borderRadius:'50%', background:'linear-gradient(135deg, var(--navy) 0%, var(--teal) 100%)', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontWeight:700, fontSize:'1.1rem', flexShrink:0 }}>{name[0]}</div>
                  <div>
                    <div style={{ fontWeight:700, color:'var(--text)', fontSize:'0.9rem' }}>{name}</div>
                    <div style={{ fontSize:'0.75rem', color:'var(--teal)', fontWeight:600 }}>{role}</div>
                    <div style={{ fontSize:'0.72rem', color:'var(--text2)' }}>{tag}</div>
                  </div>
                </div>
                <p style={{ color:'var(--text2)', fontSize:'0.875rem', lineHeight:1.7, fontStyle:'italic', margin:0 }}>"{quote}"</p>
                <div style={{ marginTop:12, color:'var(--gold)', fontSize:'0.9rem' }}>★★★★★</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section id="apply" style={{ background:'var(--cream)', padding:'80px 0' }}>
        <div className="container">
          <div style={{ maxWidth:640, margin:'0 auto' }}>
            <div className="section-header center" style={{ marginBottom:40 }}>
              <span className="section-tag">Apply Now</span>
              <h2 className="section-title">Join the Teachs Teaching Team</h2>
              <p className="section-sub" style={{ margin:'0 auto' }}>We review all applications within 2–3 business days.</p>
            </div>
            {success ? (
              <div style={{ textAlign:'center', padding:'60px 20px', background:'white', borderRadius:24, boxShadow:'0 4px 30px rgba(0,0,0,0.08)' }}>
                <div style={{ fontSize:'3.5rem', marginBottom:16 }}>🎉</div>
                <h3 style={{ color:'var(--text)', marginBottom:10 }}>Application Received!</h3>
                <p style={{ color:'var(--text2)' }}>{success}</p>
              </div>
            ) : (
              <div style={{ background:'white', borderRadius:24, padding:'40px 32px', boxShadow:'0 4px 30px rgba(0,0,0,0.08)' }}>
                {error && <div style={{ background:'rgba(192,57,43,0.08)', border:'1px solid rgba(192,57,43,0.2)', borderRadius:10, padding:'12px 16px', marginBottom:20, color:'var(--error)', fontSize:'0.88rem' }}>{error}</div>}
                <form onSubmit={submit} style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
                  <div style={{ gridColumn:'1/-1' }}><label style={lbl}>Full Name *</label><input value={form.name} onChange={e=>set('name',e.target.value)} required style={inp}/></div>
                  <div><label style={lbl}>Phone *</label><input value={form.phone} onChange={e=>set('phone',e.target.value)} required style={inp}/></div>
                  <div><label style={lbl}>Email</label><input type="email" value={form.email} onChange={e=>set('email',e.target.value)} style={inp}/></div>
                  <div><label style={lbl}>City</label><input value={form.city} onChange={e=>set('city',e.target.value)} style={inp}/></div>
                  <div><label style={lbl}>Highest Qualification</label><input value={form.qualification} onChange={e=>set('qualification',e.target.value)} placeholder="e.g. B.Ed, M.Sc" style={inp}/></div>
                  <div style={{ gridColumn:'1/-1' }}><label style={lbl}>Subjects You Can Teach *</label><input value={form.subjects} onChange={e=>set('subjects',e.target.value)} required placeholder="e.g. Mathematics, Science, English" style={inp}/></div>
                  <div><label style={lbl}>Availability</label><input value={form.availability} onChange={e=>set('availability',e.target.value)} placeholder="Evenings, Weekends" style={inp}/></div>
                  <div><label style={lbl}>Experience (years)</label><input value={form.message} onChange={e=>set('message',e.target.value)} placeholder="e.g. 3 years" style={inp}/></div>
                  <div style={{ gridColumn:'1/-1' }}><label style={lbl}>Tell Us About Yourself</label><textarea value={form.experience} onChange={e=>set('experience',e.target.value)} rows={4} placeholder="Your teaching background, motivation to join Teachs..." style={{...inp, resize:'vertical'}}/></div>
                  <div style={{ gridColumn:'1/-1' }}>
                    <button type="submit" disabled={loading} className="btn btn-gold btn-lg" style={{ width:'100%', justifyContent:'center' }}>
                      {loading ? 'Submitting...' : 'Submit Application →'}
                    </button>
                    <p style={{ textAlign:'center', color:'var(--text2)', fontSize:'0.78rem', marginTop:12 }}>By submitting, you agree to our terms. We will contact you within 2–3 business days.</p>
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
