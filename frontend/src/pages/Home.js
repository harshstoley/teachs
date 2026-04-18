import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LeadForm from '../components/LeadForm';
import api from '../utils/api';

const FAQS = [
  { q: 'What is the Flexible Dual-Teacher Model?', a: 'We pair your child with two expert teachers — one for STEM subjects and one for Languages. Deeper expertise, not one teacher spreading thin.' },
  { q: 'How much does Teachs cost?', a: 'Plans start from ₹1,499/month for Class 1–12. We also offer a FREE demo class with no registration fee.' },
  { q: 'Is there a free trial?', a: 'Yes! Completely free demo class. No registration fee, no commitment.' },
  { q: 'What classes do you teach?', a: 'Class 1–12. Full Dual-Teacher model for Class 1–10. Custom pricing for Class 11–12 Arts and Commerce.' },
  { q: 'How does progress tracking work?', a: 'Weekly progress reports, chapter-wise test results, attendance tracking, and parent updates — all in the dashboard.' },
  { q: 'What is the refund policy?', a: '7-day no-questions-asked refund on all paid plans.' },
];

const FEATURES = [
  { icon: '🎯', title: 'Specialized Expertise', desc: 'Each teacher focuses on their strongest subjects — depth, not breadth.', color: 'rgba(59,114,245,0.10)', accent: 'var(--sky)' },
  { icon: '🔄', title: 'Flexible Pairing', desc: 'Assignments adjust as subjects evolve or interests shift.', color: 'rgba(11,122,94,0.10)', accent: 'var(--emerald2)' },
  { icon: '📊', title: 'Visible Progress', desc: 'Weekly reports, test scores, attendance — transparent for parents.', color: 'rgba(200,130,10,0.10)', accent: 'var(--amber2)' },
  { icon: '📋', title: 'Structured Plans', desc: 'Every session follows a curriculum. Nothing is missed.', color: 'rgba(26,58,143,0.10)', accent: 'var(--sapphire2)' },
  { icon: '💬', title: 'Doubt Resolution', desc: 'Students submit doubts anytime. Answered before next class.', color: 'rgba(59,114,245,0.10)', accent: 'var(--sky)' },
  { icon: '🏆', title: 'Board Exam Ready', desc: 'Class 9–10 programs built around board exam patterns.', color: 'rgba(11,122,94,0.10)', accent: 'var(--emerald2)' },
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
      {/* ── HERO ── */}
      <section style={{
        background: 'var(--ink)',
        minHeight: '100vh', paddingTop: 'var(--nav-h)',
        position: 'relative', overflow: 'hidden',
        display: 'flex', alignItems: 'center',
      }}>
        {/* Background layers */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 70% 60% at 65% 45%, rgba(59,114,245,0.12) 0%, transparent 60%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 40% 40% at 20% 70%, rgba(11,122,94,0.07) 0%, transparent 55%)' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(59,114,245,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(59,114,245,0.04) 1px,transparent 1px)', backgroundSize: '64px 64px' }} />
        {/* Floating orbs */}
        <div style={{ position: 'absolute', top: '20%', right: '8%', width: 280, height: 280, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,114,245,0.15) 0%, transparent 70%)', animation: 'float 8s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', bottom: '15%', left: '5%', width: 180, height: 180, borderRadius: '50%', background: 'radial-gradient(circle, rgba(11,122,94,0.12) 0%, transparent 70%)', animation: 'float 10s ease-in-out infinite reverse' }} />

        <div className="container" style={{ position: 'relative', zIndex: 1, padding: '80px 28px', width: '100%' }}>
          {/* Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(224,156,26,0.10)', border: '1px solid rgba(224,156,26,0.28)', color: 'var(--amber2)', fontSize: '0.75rem', fontWeight: 700, padding: '7px 16px', borderRadius: 100, marginBottom: 28, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--amber2)', display: 'inline-block', animation: 'pulse 2s ease-in-out infinite' }} />
            Now enrolling · Class 1–12
          </div>

          <h1 style={{ color: 'white', marginBottom: 22, lineHeight: 1.12, maxWidth: 660 }}>
            Flexible <em style={{ color: 'var(--amber2)', fontStyle: 'italic' }}>Dual-Teacher</em>{' '}
            Model for Personalized Tutoring
          </h1>

          <p style={{ color: 'rgba(255,255,255,0.58)', fontSize: '1.05rem', marginBottom: 36, maxWidth: 520, lineHeight: 1.80 }}>
            Not a marketplace. We assign expert teachers under our own brand — two specialized tutors, structured lesson plans, weekly progress tracking, and parent updates.
          </p>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 52 }}>
            <button onClick={() => setShowForm(true)} style={{
              background: 'linear-gradient(135deg, var(--amber) 0%, var(--amber2) 100%)',
              color: 'var(--ink)', fontWeight: 700, padding: '15px 30px', borderRadius: 12,
              border: 'none', cursor: 'pointer', fontSize: '0.96rem', fontFamily: 'var(--font-body)',
              boxShadow: '0 6px 28px rgba(200,130,10,0.40)', transition: 'all 0.25s',
            }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
               onMouseLeave={e => e.currentTarget.style.transform = ''}>
              Book Free Demo →
            </button>
            <Link to="/pricing" style={{
              background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.80)',
              fontWeight: 600, padding: '15px 30px', borderRadius: 12,
              border: '1.5px solid rgba(255,255,255,0.18)', fontSize: '0.96rem',
              display: 'inline-flex', alignItems: 'center', gap: 8, transition: 'all 0.2s',
            }}>View Pricing</Link>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', gap: 0, flexWrap: 'wrap' }}>
            {[['500+','Students Enrolled'],['4.9★','Parent Rating'],['7-day','Refund Policy'],['Free','Demo Class']].map(([val, label], i) => (
              <div key={label} style={{
                paddingRight: 32, marginRight: 32, borderRight: i < 3 ? '1px solid rgba(255,255,255,0.10)' : 'none',
              }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 700, color: 'var(--amber2)', lineHeight: 1 }}>{val}</div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.38)', marginTop: 4, letterSpacing: '0.04em' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUST BAR ── */}
      <div style={{ background: 'linear-gradient(90deg, var(--sapphire) 0%, var(--ink2) 40%, var(--ink2) 60%, var(--sapphire) 100%)', padding: '18px 20px', borderTop: '1px solid rgba(59,114,245,0.20)', borderBottom: '1px solid rgba(59,114,245,0.20)', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24, flexWrap: 'wrap' }}>
          {[
            ['✦','Free Demo Class'],
            ['✦','No Registration Fee'],
            ['✦','7-Day Refund'],
            ['✦','Progress Tracking'],
            ['✦','Dual Teachers'],
          ].map(([dot, t]) => (
            <span key={t} style={{ color: 'rgba(255,255,255,0.70)', fontSize: '0.82rem', fontWeight: 500, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 7 }}>
              <span style={{ color: 'var(--amber2)', fontSize: '0.65rem' }}>{dot}</span> {t}
            </span>
          ))}
        </div>
      </div>

      {/* ── WHY TEACHS ── */}
      <section style={{ background: 'var(--white)', padding: '88px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span className="section-tag">Why Teachs</span>
            <h2 className="section-title">Education Deserves Better</h2>
            <p className="section-sub" style={{ margin: '0 auto' }}>Most tutors are generalists. Your child's needs are specific. Teachs bridges that gap with specialized dual expertise.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: 22 }}>
            {FEATURES.map(({ icon, title, desc, color, accent }) => (
              <div key={title} style={{ background: 'var(--ice)', borderRadius: 18, padding: '26px 24px', border: '1px solid var(--border)', transition: 'all 0.3s', cursor: 'default' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; e.currentTarget.style.borderColor = accent; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; e.currentTarget.style.borderColor = 'var(--border)'; }}>
                <div style={{ width: 50, height: 50, borderRadius: 14, background: color, border: `1px solid ${accent}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', marginBottom: 18 }}>{icon}</div>
                <h3 style={{ fontSize: '1.05rem', marginBottom: 8, color: 'var(--text)', fontFamily: 'var(--font-display)' }}>{title}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text2)', lineHeight: 1.68 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ background: 'var(--ink)', padding: '88px 0', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(59,114,245,0.07) 0%, transparent 70%)' }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span className="section-tag">How It Works</span>
            <h2 style={{ color: 'white', marginBottom: 12 }}>Get Started in 4 Simple Steps</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 2, position: 'relative' }}>
            {[
              ['01','Book Free Demo','Fill the form. We contact you within 24 hours.', 'var(--amber2)'],
              ['02','Meet Your Teachers','Two specialized teachers assigned to your child.', 'var(--sky)'],
              ['03','Start Learning','Lesson plans, homework, and regular tests begin.', 'var(--emerald2)'],
              ['04','Track Progress','Weekly progress reports and test results for parents.', 'var(--sky2)'],
            ].map(([step, title, desc, color], i) => (
              <div key={step} style={{ textAlign: 'center', padding: '32px 24px', background: 'rgba(255,255,255,0.03)', borderRadius: 20, border: '1px solid rgba(255,255,255,0.07)', margin: 8, transition: 'all 0.3s' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = color+'44'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; }}>
                <div style={{ width: 60, height: 60, borderRadius: '50%', background: `rgba(${color === 'var(--amber2)' ? '224,156,26' : color === 'var(--sky)' ? '59,114,245' : color === 'var(--emerald2)' ? '11,122,94' : '94,141,247'},0.15)`, border: `2px solid ${color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.2rem', color }}>{step}</div>
                <h4 style={{ color: 'white', fontFamily: 'var(--font-body)', fontWeight: 700, marginBottom: 10, fontSize: '1rem' }}>{title}</h4>
                <p style={{ color: 'rgba(255,255,255,0.48)', fontSize: '0.86rem', lineHeight: 1.65 }}>{desc}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 44 }}>
            <button onClick={() => setShowForm(true)} style={{
              background: 'linear-gradient(135deg, var(--amber) 0%, var(--amber2) 100%)',
              color: 'var(--ink)', fontWeight: 700, padding: '15px 34px', borderRadius: 12,
              border: 'none', cursor: 'pointer', fontSize: '0.96rem', fontFamily: 'var(--font-body)',
              boxShadow: '0 8px 32px rgba(200,130,10,0.35)', transition: 'all 0.25s',
            }}>Start with a Free Demo →</button>
          </div>
        </div>
      </section>

      {/* ── COMPARISON ── */}
      <section style={{ background: 'var(--lavender)', padding: '88px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <span className="section-tag">Comparison</span>
            <h2 className="section-title">Teachs vs Local Tutors</h2>
          </div>
          <div style={{ overflowX: 'auto', borderRadius: 20, boxShadow: 'var(--shadow-lg)', maxWidth: 700, margin: '0 auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: 20, overflow: 'hidden' }}>
              <thead>
                <tr>
                  <th style={{ padding: '16px 22px', background: 'var(--lavender)', textAlign: 'left', fontFamily: 'var(--font-body)', color: 'var(--text2)', fontWeight: 600, fontSize: '0.84rem' }}>Feature</th>
                  <th style={{ padding: '16px 22px', background: 'var(--sapphire)', textAlign: 'center', color: 'white', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '0.9rem' }}>Teachs ✓</th>
                  <th style={{ padding: '16px 22px', background: 'var(--lavender)', textAlign: 'center', color: 'var(--text2)', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.9rem' }}>Local Tutor</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Dual-Teacher Model', true, false],
                  ['Structured Lesson Plans', true, false],
                  ['Weekly Progress Reports', true, false],
                  ['Chapter-wise Tests', true, '⚠️ Rare'],
                  ['Parent Dashboard', true, false],
                  ['7-day Refund', true, false],
                  ['Homework Tracking', true, false],
                ].map(([f, t, l], i) => (
                  <tr key={i}>
                    <td style={{ padding: '12px 22px', fontWeight: 500, borderTop: '1px solid var(--lavender)', fontSize: '0.88rem', color: 'var(--text)' }}>{f}</td>
                    <td style={{ textAlign: 'center', borderTop: '1px solid var(--lavender)', color: 'var(--emerald2)', fontWeight: 700, fontSize: '1.1rem' }}>{t === true ? '✓' : t}</td>
                    <td style={{ textAlign: 'center', borderTop: '1px solid var(--lavender)', color: '#C0392B', fontWeight: 600 }}>{l === false ? '✗' : l}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      {testimonials.length > 0 && (
        <section style={{ background: 'var(--white)', padding: '88px 0' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <span className="section-tag">Reviews</span>
              <h2 className="section-title">What Parents Are Saying</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: 22 }}>
              {testimonials.map(t => (
                <div key={t.id} style={{ background: 'var(--ice)', borderRadius: 18, padding: 26, border: '1px solid var(--border)', transition: 'all 0.3s' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}>
                  <div style={{ display: 'flex', gap: 2, marginBottom: 14 }}>
                    {Array.from({ length: t.rating || 5 }).map((_, i) => <span key={i} style={{ color: 'var(--amber2)', fontSize: '1rem' }}>★</span>)}
                  </div>
                  <p style={{ fontStyle: 'italic', marginBottom: 18, fontSize: '0.9rem', color: 'var(--text2)', lineHeight: 1.74 }}>"{t.content}"</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, var(--sapphire) 0%, var(--sky) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, flexShrink: 0, fontSize: '1rem' }}>{t.name[0]}</div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.87rem', color: 'var(--text)' }}>{t.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--emerald2)', fontWeight: 600 }}>{t.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── WORKSHOP + WOMEN ── */}
      <section style={{ background: 'var(--ink)', padding: '88px 0', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 50% 60% at 80% 50%, rgba(11,122,94,0.08) 0%, transparent 60%)' }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
            <div style={{ background: 'rgba(59,114,245,0.08)', borderRadius: 20, padding: 32, border: '1px solid rgba(59,114,245,0.20)', transition: 'all 0.3s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(59,114,245,0.13)'; e.currentTarget.style.borderColor = 'rgba(59,114,245,0.40)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(59,114,245,0.08)'; e.currentTarget.style.borderColor = 'rgba(59,114,245,0.20)'; }}>
              <span className="badge badge-sky" style={{ marginBottom: 16 }}>Mentor Workshop</span>
              <h3 style={{ color: 'white', marginBottom: 12, fontSize: '1.25rem' }}>Workshops for Parents & Students</h3>
              <p style={{ color: 'rgba(255,255,255,0.55)', marginBottom: 22, fontSize: '0.88rem', lineHeight: 1.74 }}>Live expert sessions on study habits, board exam strategies, and parenting for academic success.</p>
              <Link to="/mentor-workshop" style={{ background: 'linear-gradient(135deg, var(--sapphire) 0%, var(--sky) 100%)', color: 'white', fontWeight: 700, padding: '12px 24px', borderRadius: 10, display: 'inline-block', fontSize: '0.9rem', boxShadow: '0 4px 16px rgba(59,114,245,0.35)' }}>Explore Workshops →</Link>
            </div>
            <div style={{ background: 'rgba(11,122,94,0.08)', borderRadius: 20, padding: 32, border: '1px solid rgba(11,122,94,0.20)', transition: 'all 0.3s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(11,122,94,0.14)'; e.currentTarget.style.borderColor = 'rgba(11,122,94,0.40)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(11,122,94,0.08)'; e.currentTarget.style.borderColor = 'rgba(11,122,94,0.20)'; }}>
              <span className="badge badge-emerald" style={{ marginBottom: 16 }}>Women's Program</span>
              <h3 style={{ color: 'white', marginBottom: 12, fontSize: '1.25rem' }}>Work From Home. Teach. Earn.</h3>
              <p style={{ color: 'rgba(255,255,255,0.55)', marginBottom: 22, fontSize: '0.88rem', lineHeight: 1.74 }}>Qualified women educators — join the Teachs team with flexible hours and competitive pay.</p>
              <Link to="/womens-program" style={{ background: 'linear-gradient(135deg, var(--emerald) 0%, var(--emerald2) 100%)', color: 'white', fontWeight: 700, padding: '12px 24px', borderRadius: 10, display: 'inline-block', fontSize: '0.9rem', boxShadow: '0 4px 16px rgba(11,122,94,0.35)' }}>Learn More →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      {/* JSON-LD: Google reads this regardless of accordion state — fixes "invalid item" error */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": FAQS.map(f => ({
          "@type": "Question",
          "name": f.q,
          "acceptedAnswer": { "@type": "Answer", "text": f.a }
        }))
      })}} />
      <section style={{ background: 'var(--white)', padding: '88px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <span className="section-tag">FAQ</span>
            <h2 className="section-title">Frequently Asked Questions</h2>
          </div>
          <div style={{ maxWidth: 700, margin: '0 auto' }}>
            {FAQS.map((faq, i) => (
              <div key={i}
                style={{ border: '1px solid var(--border)', borderRadius: 14, marginBottom: 10, background: 'var(--ice)', overflow: 'hidden', transition: 'all 0.2s', boxShadow: openFaq === i ? 'var(--shadow)' : 'var(--shadow-xs)' }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{
                  width: '100%', padding: '18px 22px', display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', gap: 12,
                }}>
                  <span style={{ fontWeight: 600, color: 'var(--text)', fontSize: '0.92rem', fontFamily: 'var(--font-body)' }}>{faq.q}</span>
                  <span style={{ width: 28, height: 28, borderRadius: '50%', background: openFaq === i ? 'var(--sapphire)' : 'var(--lavender)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: openFaq === i ? 'white' : 'var(--sapphire)', fontSize: '1.1rem', flexShrink: 0, transition: 'all 0.2s', fontWeight: 300 }}>
                    {openFaq === i ? '−' : '+'}
                  </span>
                </button>
                {openFaq === i && (
                  <div style={{ padding: '0 22px 18px' }}>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text2)', lineHeight: 1.74 }}>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{ background: 'linear-gradient(135deg, var(--sapphire) 0%, var(--ink2) 60%, var(--ink) 100%)', padding: '88px 20px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(59,114,245,0.15) 0%, transparent 70%)' }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-block', background: 'rgba(224,156,26,0.12)', border: '1px solid rgba(224,156,26,0.25)', color: 'var(--amber2)', fontSize: '0.75rem', fontWeight: 700, padding: '6px 16px', borderRadius: 100, marginBottom: 20, letterSpacing: '0.08em', textTransform: 'uppercase' }}>🎓 Start Learning Today</div>
          <h2 style={{ color: 'white', marginBottom: 16 }}>Ready to Transform Your Child's Learning?</h2>
          <p style={{ color: 'rgba(255,255,255,0.60)', maxWidth: 480, margin: '0 auto 36px', fontSize: '0.96rem', lineHeight: 1.78 }}>
            Book a free demo class today. Meet the teachers. No fees. No commitment.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => setShowForm(true)} style={{
              background: 'linear-gradient(135deg, var(--amber) 0%, var(--amber2) 100%)',
              color: 'var(--ink)', fontWeight: 700, padding: '15px 30px', borderRadius: 12,
              border: 'none', cursor: 'pointer', fontSize: '0.96rem', fontFamily: 'var(--font-body)',
              boxShadow: '0 8px 32px rgba(200,130,10,0.40)',
            }}>Book Free Demo Class</button>
            <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" style={{
              background: '#25D366', color: 'white', fontWeight: 700, padding: '15px 30px',
              borderRadius: 12, fontSize: '0.96rem', display: 'inline-flex', alignItems: 'center', gap: 8,
              boxShadow: '0 8px 32px rgba(37,211,102,0.30)',
            }}>💬 WhatsApp Us</a>
          </div>
        </div>
      </section>

      {/* ── MODAL ── */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()} style={{ position: 'relative' }}>
            <button onClick={() => setShowForm(false)} style={{ position: 'absolute', top: 14, right: 18, background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: 'var(--text2)', width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}>✕</button>
            <LeadForm />
          </div>
        </div>
      )}

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(0.8); }
        }
      `}</style>
    </div>
  );
}