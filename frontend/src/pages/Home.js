import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LeadForm from '../components/LeadForm';
import api from '../utils/api';

const FAQS = [
  { q: 'What is the Flexible Dual-Teacher Model?', a: 'We pair your child with two expert teachers — one for STEM subjects and one for Languages. This means deeper expertise, not one teacher spreading thin.' },
  { q: 'How much does Teachs cost?', a: 'Plans start from ₹1,499/month. We have options for Class 1–12. We also offer a FREE demo class with no registration fee.' },
  { q: 'Is there a free trial?', a: 'Yes! We offer a completely free demo class. No registration fee, no commitment.' },
  { q: 'What classes do you teach?', a: 'We cover Class 1–12. For Class 1–10 we offer our full Dual-Teacher model. For Class 11–12 Arts and Commerce, we have custom pricing.' },
  { q: 'How does progress tracking work?', a: 'Every student gets weekly progress reports, chapter-wise test results, attendance tracking, and parent updates — all visible in the dashboard.' },
  { q: 'What is the refund policy?', a: 'We have a 7-day no-questions-asked refund policy on all paid plans.' },
];

export default function Home() {
  const [testimonials, setTestimonials] = useState([]);
  const [openFaq, setOpenFaq] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    document.title = 'Teachs – Flexible Dual-Teacher Model for Personalized Tutoring';
    api.get('/settings/testimonials').then(r => setTestimonials(r.data)).catch(() => {});
  }, []);

  return (
    <div>
      {/* HERO */}
      <section style={{ background: 'var(--navy)', minHeight: '100vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden', paddingTop: 'var(--nav-height)' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 60% 40%,rgba(212,168,83,0.08) 0%,transparent 60%),radial-gradient(ellipse 50% 40% at 20% 80%,rgba(30,49,80,0.9) 0%,transparent 70%)' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(212,168,83,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(212,168,83,0.04) 1px,transparent 1px)', backgroundSize: '60px 60px' }} />
        <div className="container" style={{ position: 'relative', zIndex: 1, padding: '80px 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
            <div className="animate-fadeup">
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(212,168,83,0.12)', border: '1px solid rgba(212,168,83,0.3)', color: 'var(--gold)', fontSize: '0.8rem', fontWeight: 700, padding: '7px 16px', borderRadius: 100, marginBottom: 28, letterSpacing: '0.5px' }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--gold)', display: 'inline-block' }} />
                Now enrolling for Class 1–12
              </div>
              <h1 style={{ color: 'var(--white)', marginBottom: 24, lineHeight: 1.15 }}>
                Flexible <em style={{ color: 'var(--gold)', fontStyle: 'normal' }}>Dual-Teacher</em> Model for Personalized Tutoring
              </h1>
              <p style={{ color: 'var(--slate2)', fontSize: '1.05rem', marginBottom: 36, maxWidth: 480, lineHeight: 1.75 }}>
                Not a marketplace. We assign expert teachers under our own brand. Two specialized tutors, structured lesson plans, weekly progress tracking, and parent updates.
              </p>
              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 48 }}>
                <button onClick={() => setShowForm(true)} style={{ background: 'var(--gold)', color: 'var(--navy)', fontWeight: 700, padding: '14px 28px', borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: '0.95rem', transition: 'all 0.25s', fontFamily: 'var(--font-body)' }}>
                  Book Free Demo →
                </button>
                <Link to="/pricing" style={{ background: 'transparent', color: 'var(--white)', fontWeight: 600, padding: '14px 28px', borderRadius: 10, border: '1.5px solid rgba(255,255,255,0.25)', fontSize: '0.95rem', transition: 'all 0.25s' }}>View Pricing</Link>
              </div>
              <div style={{ display: 'flex', gap: 32, paddingTop: 32, borderTop: '1px solid rgba(255,255,255,0.08)', flexWrap: 'wrap' }}>
                {[['500+','Students'],['4.9/5','Rating'],['7-day','Refund'],['Free','Demo']].map(([val,label]) => (
                  <div key={label}>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 700, color: 'var(--gold)', lineHeight: 1 }}>{val}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--slate)', marginTop: 3 }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
            {/* Hero Card */}
            <div className="animate-fadeup" style={{ animationDelay: '0.2s' }}>
              <div style={{ background: 'var(--navy2)', border: '1px solid rgba(212,168,83,0.2)', borderRadius: 20, padding: 28, position: 'relative' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg,var(--gold),var(--gold2),transparent)', borderRadius: '20px 20px 0 0' }} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>
                  {[['🔬','Mr. Vikram','Math + Science','STEM'],['📝','Ms. Divya','English + SST','Languages']].map(([icon,name,subj,tag]) => (
                    <div key={name} style={{ background: 'var(--navy3)', borderRadius: 12, padding: 18, textAlign: 'center', border: '1px solid rgba(212,168,83,0.1)' }}>
                      <div style={{ width: 48, height: 48, borderRadius: '50%', margin: '0 auto 10px', background: 'rgba(212,168,83,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>{icon}</div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--white)', marginBottom: 3 }}>{name}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--slate)' }}>{subj}</div>
                      <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 100, fontSize: '0.68rem', fontWeight: 600, marginTop: 8, background: tag==='STEM'?'rgba(42,138,94,0.15)':'rgba(212,168,83,0.15)', color: tag==='STEM'?'#5BC8A0':'var(--gold)' }}>{tag}</span>
                    </div>
                  ))}
                </div>
                {[['Math Progress','82%'],['English','91%']].map(([label,pct]) => (
                  <div key={label} style={{ marginBottom: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--slate)', marginBottom: 6 }}><span>{label}</span><span>{pct}</span></div>
                    <div style={{ height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 3 }}>
                      <div style={{ height: '100%', width: pct, background: 'linear-gradient(90deg,var(--gold),var(--gold2))', borderRadius: 3 }} />
                    </div>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 18, paddingTop: 16, borderTop: '1px solid rgba(212,168,83,0.1)' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--slate)' }}>This week's classes</div>
                  <span style={{ background: 'rgba(212,168,83,0.12)', color: 'var(--gold)', padding: '4px 12px', borderRadius: 100, fontSize: '0.75rem', fontWeight: 700 }}>3 Scheduled</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <style>{`@media(max-width:860px){section > .container > div{grid-template-columns:1fr!important}}`}</style>
      </section>

      {/* TRUST BAR */}
      <div style={{ background: 'var(--navy2)', padding: '18px 24px', borderTop: '1px solid rgba(212,168,83,0.1)', borderBottom: '1px solid rgba(212,168,83,0.1)' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 40, flexWrap: 'wrap' }}>
          {['✅ Free Demo Class','✅ No Registration Fee','✅ 7-Day Refund','✅ No Commitment','✅ Progress Tracking'].map(t => (
            <span key={t} style={{ color: 'var(--slate2)', fontSize: '0.85rem', fontWeight: 500 }}>{t}</span>
          ))}
        </div>
      </div>

      {/* WHY TEACHS */}
      <section className="section section-white">
        <div className="container">
          <div className="section-header center">
            <span className="section-tag">Why Teachs</span>
            <h2 className="section-title">Education Deserves Better Than Generic Tutoring</h2>
            <p className="section-sub">Most tutors are generalists. Your child's learning needs are specific. Teachs was built to bridge that gap.</p>
          </div>
          <div className="grid-3">
            {[
              ['🎯','Specialized Expertise','Each teacher focuses on their strongest subjects — not a jack of all trades.'],
              ['🔄','Flexible Pairing','Teacher assignments adjust as subjects evolve or interests shift.'],
              ['📊','Visible Progress','Weekly reports, test scores, and attendance — all transparent for parents.'],
              ['📋','Structured Plans','Every session follows a curriculum. Chapter-wise plans ensure nothing is missed.'],
              ['💬','Doubt Resolution','Students submit doubts anytime. Teachers respond before the next class.'],
              ['🏆','Board Exam Ready','Class 9–10 programs are built around board exam patterns with mock tests.'],
            ].map(([icon,title,desc]) => (
              <div key={title} style={{ background: 'var(--cream)', borderRadius: 20, padding: 28, border: '1px solid rgba(30,49,80,0.06)', transition: 'all 0.3s', position: 'relative', overflow: 'hidden', cursor: 'default' }}
                onMouseEnter={e => { e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow='var(--shadow)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow=''; }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: 'rgba(212,168,83,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', marginBottom: 18 }}>{icon}</div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: 8, color: 'var(--text)' }}>{title}</h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text2)', lineHeight: 1.7 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section section-navy">
        <div className="container">
          <div className="section-header center">
            <span className="section-tag">How It Works</span>
            <h2 className="section-title light">Get Started in 4 Simple Steps</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 24 }}>
            {[
              ['01','Book Free Demo','Fill the form. We contact you within 24 hours.'],
              ['02','Meet Your Teachers','We assign two specialized teachers based on your child\'s needs.'],
              ['03','Start Learning','Classes begin with lesson plans, homework, and regular tests.'],
              ['04','Track Progress','Parents receive weekly progress reports and test results.'],
            ].map(([step,title,desc],i) => (
              <div key={step} style={{ textAlign: 'center', padding: '28px 16px' }}>
                <div style={{ width: 60, height: 60, borderRadius: '50%', background: i%2===0?'var(--gold)':'rgba(212,168,83,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.2rem', color: i%2===0?'var(--navy)':'var(--gold)' }}>{step}</div>
                <h4 style={{ color: 'var(--white)', fontFamily: 'var(--font-body)', fontWeight: 700, marginBottom: 8, fontSize: '1rem' }}>{title}</h4>
                <p style={{ color: 'var(--slate)', fontSize: '0.875rem', lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 36 }}>
            <button onClick={() => setShowForm(true)} style={{ background: 'var(--gold)', color: 'var(--navy)', fontWeight: 700, padding: '14px 32px', borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: '1rem', fontFamily: 'var(--font-body)' }}>Start with a Free Demo →</button>
          </div>
        </div>
        <style>{`@media(max-width:700px){section .container>div{grid-template-columns:1fr 1fr!important}}`}</style>
      </section>

      {/* COMPARISON TABLE */}
      <section className="section section-white">
        <div className="container">
          <div className="section-header center">
            <span className="section-tag">Why Teachs</span>
            <h2 className="section-title">Teachs vs Local Tutors</h2>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', maxWidth: 760, margin: '0 auto', borderCollapse: 'collapse', background: 'white', borderRadius: 16, overflow: 'hidden', boxShadow: 'var(--shadow)' }}>
              <thead>
                <tr>
                  <th style={{ padding: '18px 24px', background: 'var(--cream2)', textAlign: 'left', fontFamily: 'var(--font-body)', color: 'var(--text2)', fontWeight: 600, fontSize: '0.88rem' }}>Feature</th>
                  <th style={{ padding: '18px 24px', background: 'var(--navy)', textAlign: 'center', color: 'white', fontFamily: 'var(--font-body)', fontWeight: 700 }}>Teachs ✓</th>
                  <th style={{ padding: '18px 24px', background: 'var(--cream2)', textAlign: 'center', color: 'var(--text2)', fontFamily: 'var(--font-body)', fontWeight: 600 }}>Local Tutor</th>
                </tr>
              </thead>
              <tbody>
                {[['Dual-Teacher Model',true,false],['Structured Lesson Plans',true,false],['Weekly Progress Reports',true,false],['Chapter-wise Tests',true,'⚠️ Rare'],['Parent Dashboard',true,false],['7-day Refund Guarantee',true,false],['Consistent Quality',true,'⚠️ Varies'],['Homework Tracking',true,false]].map(([f,t,l],i) => (
                  <tr key={i}>
                    <td style={{ padding: '13px 24px', fontWeight: 500, borderTop: '1px solid var(--cream2)' }}>{f}</td>
                    <td style={{ textAlign: 'center', borderTop: '1px solid var(--cream2)', color: 'var(--success)', fontWeight: 700 }}>{t===true?'✓':t}</td>
                    <td style={{ textAlign: 'center', borderTop: '1px solid var(--cream2)', color: 'var(--error)' }}>{l===false?'✗':l}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      {testimonials.length > 0 && (
        <section className="section section-cream">
          <div className="container">
            <div className="section-header center">
              <span className="section-tag">Reviews</span>
              <h2 className="section-title">What Parents Are Saying</h2>
            </div>
            <div className="grid-3">
              {testimonials.map(t => (
                <div key={t.id} style={{ background: 'var(--white)', borderRadius: 20, padding: 28, border: '1px solid rgba(30,49,80,0.06)' }}>
                  <div style={{ fontSize: '2rem', color: 'rgba(212,168,83,0.3)', fontFamily: 'Georgia', lineHeight: 1, marginBottom: 8 }}>"</div>
                  <div style={{ display: 'flex', gap: 2, marginBottom: 12 }}>{Array.from({length:t.rating||5}).map((_,i) => <span key={i} style={{ color: 'var(--gold)' }}>★</span>)}</div>
                  <p style={{ fontStyle: 'italic', marginBottom: 20, fontSize: '0.93rem', color: 'var(--text2)', lineHeight: 1.7 }}>"{t.content}"</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--navy)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)', fontWeight: 700 }}>{t.name[0]}</div>
                    <div><div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text)' }}>{t.name}</div><div style={{ fontSize: '0.76rem', color: 'var(--gold)' }}>{t.role}</div></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* WORKSHOP + WOMEN */}
      <section className="section section-navy">
        <div className="container">
          <div className="grid-2">
            <div style={{ background: 'var(--navy2)', borderRadius: 20, padding: 32, border: '1px solid var(--border)' }}>
              <span className="badge badge-gold" style={{ marginBottom: 16 }}>Mentor Workshop</span>
              <h3 style={{ color: 'var(--white)', marginBottom: 12 }}>Workshops for Parents & Students</h3>
              <p style={{ color: 'var(--slate2)', marginBottom: 24, fontSize: '0.9rem', lineHeight: 1.7 }}>Live expert sessions on study habits, board exam strategies, and parenting for academic success.</p>
              <Link to="/mentor-workshop" style={{ background: 'var(--gold)', color: 'var(--navy)', fontWeight: 700, padding: '12px 24px', borderRadius: 10, display: 'inline-block' }}>Explore Workshops →</Link>
            </div>
            <div style={{ background: 'linear-gradient(135deg,rgba(212,168,83,0.1),rgba(0,153,178,0.08))', borderRadius: 20, padding: 32, border: '1px solid var(--border)' }}>
              <span className="badge badge-teal" style={{ marginBottom: 16 }}>Women's Program</span>
              <h3 style={{ color: 'var(--white)', marginBottom: 12 }}>Work From Home. Teach. Earn.</h3>
              <p style={{ color: 'var(--slate2)', marginBottom: 24, fontSize: '0.9rem', lineHeight: 1.7 }}>Qualified women educators — join the Teachs teaching team with flexible hours and competitive pay.</p>
              <Link to="/womens-program" style={{ background: 'var(--teal)', color: 'var(--white)', fontWeight: 700, padding: '12px 24px', borderRadius: 10, display: 'inline-block' }}>Learn More →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section section-white" itemScope itemType="https://schema.org/FAQPage">
        <div className="container">
          <div className="section-header center">
            <span className="section-tag">FAQ</span>
            <h2 className="section-title">Frequently Asked Questions</h2>
          </div>
          <div style={{ maxWidth: 720, margin: '0 auto' }}>
            {FAQS.map((faq,i) => (
              <div key={i} itemScope itemProp="mainEntity" itemType="https://schema.org/Question" style={{ border: '1px solid rgba(30,49,80,0.08)', borderRadius: 12, marginBottom: 10, background: 'var(--cream)', overflow: 'hidden' }}>
                <button onClick={() => setOpenFaq(openFaq===i?null:i)} style={{ width: '100%', padding: '18px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text)', fontSize: '0.95rem', fontFamily: 'var(--font-body)' }} itemProp="name">{faq.q}</span>
                  <span style={{ color: 'var(--gold)', fontSize: '1.2rem', flexShrink: 0, marginLeft: 12, fontWeight: 300 }}>{openFaq===i?'−':'+'}</span>
                </button>
                {openFaq===i && (
                  <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer" style={{ padding: '0 22px 18px' }}>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text2)' }} itemProp="text">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{ background: 'var(--navy2)', padding: '80px 24px', textAlign: 'center', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <h2 style={{ color: 'var(--white)', marginBottom: 14 }}>Ready to Transform Your Child's Learning?</h2>
          <p style={{ color: 'var(--slate2)', maxWidth: 500, margin: '0 auto 36px', fontSize: '1rem' }}>Book a free demo class today. Meet the teachers. No fees. No commitment.</p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => setShowForm(true)} style={{ background: 'var(--gold)', color: 'var(--navy)', fontWeight: 700, padding: '14px 32px', borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: '1rem', fontFamily: 'var(--font-body)' }}>Book Free Demo Class</button>
            <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" style={{ background: '#25D366', color: 'white', fontWeight: 700, padding: '14px 32px', borderRadius: 10, fontSize: '1rem', display: 'inline-block' }}>💬 WhatsApp Us</a>
          </div>
        </div>
      </section>

      {/* Modal Form */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowForm(false)} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', fontSize: '1.3rem', cursor: 'pointer', color: 'var(--text2)' }}>✕</button>
            <LeadForm />
          </div>
        </div>
      )}
    </div>
  );
}
