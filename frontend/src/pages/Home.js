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
      <section style={{ background: 'var(--navy)', minHeight: '100vh', paddingTop: 'var(--nav-height)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 60% 40%,rgba(212,168,83,0.08) 0%,transparent 60%)' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(212,168,83,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(212,168,83,0.04) 1px,transparent 1px)', backgroundSize: '60px 60px' }} />

        <div className="container" style={{ position: 'relative', zIndex: 1, padding: '60px 20px 80px' }}>
          {/* Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(212,168,83,0.12)', border: '1px solid rgba(212,168,83,0.3)', color: 'var(--gold)', fontSize: '0.78rem', fontWeight: 700, padding: '6px 14px', borderRadius: 100, marginBottom: 24, letterSpacing: '0.5px' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--gold)', display: 'inline-block' }} />
            Now enrolling · Class 1–12
          </div>

          {/* Heading */}
          <h1 style={{ color: 'var(--white)', marginBottom: 20, lineHeight: 1.15, maxWidth: 640 }}>
            Flexible <em style={{ color: 'var(--gold)', fontStyle: 'normal' }}>Dual-Teacher</em> Model for Personalized Tutoring
          </h1>

          <p style={{ color: 'var(--slate2)', fontSize: '1rem', marginBottom: 32, maxWidth: 520, lineHeight: 1.75 }}>
            Not a marketplace. We assign expert teachers under our own brand — two specialized tutors, structured lesson plans, weekly progress tracking, and parent updates.
          </p>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 48 }}>
            <button onClick={() => setShowForm(true)} style={{ background: 'var(--gold)', color: 'var(--navy)', fontWeight: 700, padding: '14px 28px', borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: '0.95rem', fontFamily: 'var(--font-body)' }}>
              Book Free Demo →
            </button>
            <Link to="/pricing" style={{ background: 'transparent', color: 'var(--white)', fontWeight: 600, padding: '14px 28px', borderRadius: 10, border: '1.5px solid rgba(255,255,255,0.25)', fontSize: '0.95rem', display: 'inline-block' }}>
              View Pricing
            </Link>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', gap: 32, paddingTop: 32, borderTop: '1px solid rgba(255,255,255,0.08)', flexWrap: 'wrap' }}>
            {[['500+','Students'],['4.9/5','Rating'],['7-day','Refund'],['Free','Demo']].map(([val, label]) => (
              <div key={label}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 700, color: 'var(--gold)', lineHeight: 1 }}>{val}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--slate)', marginTop: 3 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUST BAR ── */}
      <div style={{ background: 'var(--navy2)', borderTop: '1px solid rgba(212,168,83,0.1)', borderBottom: '1px solid rgba(212,168,83,0.1)', padding: '16px 20px', overflowX: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, flexWrap: 'wrap', minWidth: 'max-content', margin: '0 auto' }}>
          {['✅ Free Demo','✅ No Registration Fee','✅ 7-Day Refund','✅ Progress Tracking'].map(t => (
            <span key={t} style={{ color: 'var(--slate2)', fontSize: '0.82rem', fontWeight: 500, whiteSpace: 'nowrap' }}>{t}</span>
          ))}
        </div>
      </div>

      {/* ── WHY TEACHS ── */}
      <section style={{ background: 'var(--white)', padding: '72px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <span className="section-tag">Why Teachs</span>
            <h2 className="section-title">Education Deserves Better</h2>
            <p className="section-sub" style={{ margin: '0 auto' }}>Most tutors are generalists. Your child's needs are specific. Teachs bridges that gap.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {[
              ['🎯','Specialized Expertise','Each teacher focuses on their strongest subjects — depth, not breadth.'],
              ['🔄','Flexible Pairing','Assignments adjust as subjects evolve or interests shift.'],
              ['📊','Visible Progress','Weekly reports, test scores, attendance — transparent for parents.'],
              ['📋','Structured Plans','Every session follows a curriculum. Nothing is missed.'],
              ['💬','Doubt Resolution','Students submit doubts anytime. Answered before next class.'],
              ['🏆','Board Exam Ready','Class 9–10 programs built around board exam patterns.'],
            ].map(([icon, title, desc]) => (
              <div key={title} style={{ background: 'var(--cream)', borderRadius: 16, padding: '24px 22px', border: '1px solid rgba(30,49,80,0.06)', transition: 'all 0.3s' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = 'var(--shadow)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(212,168,83,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', marginBottom: 16 }}>{icon}</div>
                <h3 style={{ fontSize: '1rem', marginBottom: 8, color: 'var(--text)' }}>{title}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text2)', lineHeight: 1.65 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ background: 'var(--navy)', padding: '72px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <span className="section-tag">How It Works</span>
            <h2 style={{ color: 'var(--white)', marginBottom: 12 }}>Get Started in 4 Simple Steps</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24 }}>
            {[
              ['01','Book Free Demo','Fill the form. We contact you within 24 hours.'],
              ['02','Meet Your Teachers','Two specialized teachers assigned to your child.'],
              ['03','Start Learning','Lesson plans, homework, and regular tests begin.'],
              ['04','Track Progress','Weekly progress reports and test results for parents.'],
            ].map(([step, title, desc], i) => (
              <div key={step} style={{ textAlign: 'center', padding: '24px 16px' }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: i % 2 === 0 ? 'var(--gold)' : 'rgba(212,168,83,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', color: i % 2 === 0 ? 'var(--navy)' : 'var(--gold)' }}>{step}</div>
                <h4 style={{ color: 'var(--white)', fontFamily: 'var(--font-body)', fontWeight: 700, marginBottom: 8, fontSize: '0.95rem' }}>{title}</h4>
                <p style={{ color: 'var(--slate)', fontSize: '0.85rem', lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 36 }}>
            <button onClick={() => setShowForm(true)} style={{ background: 'var(--gold)', color: 'var(--navy)', fontWeight: 700, padding: '14px 32px', borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: '0.95rem', fontFamily: 'var(--font-body)' }}>
              Start with a Free Demo →
            </button>
          </div>
        </div>
      </section>

      {/* ── COMPARISON ── */}
      <section style={{ background: 'var(--white)', padding: '72px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <span className="section-tag">Why Teachs</span>
            <h2 className="section-title">Teachs vs Local Tutors</h2>
          </div>
          <div style={{ overflowX: 'auto', borderRadius: 16, boxShadow: 'var(--shadow)' }}>
            <table style={{ width: '100%', minWidth: 480, borderCollapse: 'collapse', background: 'white' }}>
              <thead>
                <tr>
                  <th style={{ padding: '16px 20px', background: 'var(--cream2)', textAlign: 'left', fontFamily: 'var(--font-body)', color: 'var(--text2)', fontWeight: 600, fontSize: '0.85rem' }}>Feature</th>
                  <th style={{ padding: '16px 20px', background: 'var(--navy)', textAlign: 'center', color: 'white', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '0.9rem' }}>Teachs ✓</th>
                  <th style={{ padding: '16px 20px', background: 'var(--cream2)', textAlign: 'center', color: 'var(--text2)', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.9rem' }}>Local Tutor</th>
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
                    <td style={{ padding: '12px 20px', fontWeight: 500, borderTop: '1px solid var(--cream2)', fontSize: '0.88rem' }}>{f}</td>
                    <td style={{ textAlign: 'center', borderTop: '1px solid var(--cream2)', color: 'var(--success)', fontWeight: 700 }}>{t === true ? '✓' : t}</td>
                    <td style={{ textAlign: 'center', borderTop: '1px solid var(--cream2)', color: 'var(--error)' }}>{l === false ? '✗' : l}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      {testimonials.length > 0 && (
        <section style={{ background: 'var(--cream)', padding: '72px 0' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
              <span className="section-tag">Reviews</span>
              <h2 className="section-title">What Parents Are Saying</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
              {testimonials.map(t => (
                <div key={t.id} style={{ background: 'var(--white)', borderRadius: 16, padding: 24, border: '1px solid rgba(30,49,80,0.06)' }}>
                  <div style={{ display: 'flex', gap: 2, marginBottom: 12 }}>
                    {Array.from({ length: t.rating || 5 }).map((_, i) => <span key={i} style={{ color: 'var(--gold)' }}>★</span>)}
                  </div>
                  <p style={{ fontStyle: 'italic', marginBottom: 16, fontSize: '0.9rem', color: 'var(--text2)', lineHeight: 1.7 }}>"{t.content}"</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'var(--navy)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)', fontWeight: 700, flexShrink: 0 }}>{t.name[0]}</div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text)' }}>{t.name}</div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--gold)' }}>{t.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── WORKSHOP + WOMEN ── */}
      <section style={{ background: 'var(--navy)', padding: '72px 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            <div style={{ background: 'var(--navy2)', borderRadius: 16, padding: 28, border: '1px solid var(--border)' }}>
              <span className="badge badge-gold" style={{ marginBottom: 14 }}>Mentor Workshop</span>
              <h3 style={{ color: 'var(--white)', marginBottom: 10, fontSize: '1.2rem' }}>Workshops for Parents & Students</h3>
              <p style={{ color: 'var(--slate2)', marginBottom: 20, fontSize: '0.88rem', lineHeight: 1.7 }}>Live expert sessions on study habits, board exam strategies, and parenting for academic success.</p>
              <Link to="/mentor-workshop" style={{ background: 'var(--gold)', color: 'var(--navy)', fontWeight: 700, padding: '11px 22px', borderRadius: 10, display: 'inline-block', fontSize: '0.9rem' }}>Explore Workshops →</Link>
            </div>
            <div style={{ background: 'rgba(212,168,83,0.06)', borderRadius: 16, padding: 28, border: '1px solid var(--border)' }}>
              <span className="badge badge-teal" style={{ marginBottom: 14 }}>Women's Program</span>
              <h3 style={{ color: 'var(--white)', marginBottom: 10, fontSize: '1.2rem' }}>Work From Home. Teach. Earn.</h3>
              <p style={{ color: 'var(--slate2)', marginBottom: 20, fontSize: '0.88rem', lineHeight: 1.7 }}>Qualified women educators — join the Teachs team with flexible hours and competitive pay.</p>
              <Link to="/womens-program" style={{ background: 'var(--teal)', color: 'var(--white)', fontWeight: 700, padding: '11px 22px', borderRadius: 10, display: 'inline-block', fontSize: '0.9rem' }}>Learn More →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ background: 'var(--white)', padding: '72px 0' }} itemScope itemType="https://schema.org/FAQPage">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <span className="section-tag">FAQ</span>
            <h2 className="section-title">Frequently Asked Questions</h2>
          </div>
          <div style={{ maxWidth: 680, margin: '0 auto' }}>
            {FAQS.map((faq, i) => (
              <div key={i} itemScope itemProp="mainEntity" itemType="https://schema.org/Question"
                style={{ border: '1px solid rgba(30,49,80,0.08)', borderRadius: 12, marginBottom: 10, background: 'var(--cream)', overflow: 'hidden' }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ width: '100%', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', gap: 12 }}>
                  <span style={{ fontWeight: 600, color: 'var(--text)', fontSize: '0.9rem', fontFamily: 'var(--font-body)' }} itemProp="name">{faq.q}</span>
                  <span style={{ color: 'var(--gold)', fontSize: '1.3rem', flexShrink: 0, fontWeight: 300, lineHeight: 1 }}>{openFaq === i ? '−' : '+'}</span>
                </button>
                {openFaq === i && (
                  <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer" style={{ padding: '0 20px 16px' }}>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text2)', lineHeight: 1.7 }} itemProp="text">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{ background: 'var(--navy2)', padding: '72px 20px', textAlign: 'center', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <h2 style={{ color: 'var(--white)', marginBottom: 14 }}>Ready to Transform Your Child's Learning?</h2>
          <p style={{ color: 'var(--slate2)', maxWidth: 480, margin: '0 auto 32px', fontSize: '0.95rem', lineHeight: 1.7 }}>
            Book a free demo class today. Meet the teachers. No fees. No commitment.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => setShowForm(true)} style={{ background: 'var(--gold)', color: 'var(--navy)', fontWeight: 700, padding: '14px 28px', borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: '0.95rem', fontFamily: 'var(--font-body)' }}>
              Book Free Demo Class
            </button>
            <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" style={{ background: '#25D366', color: 'white', fontWeight: 700, padding: '14px 28px', borderRadius: 10, fontSize: '0.95rem', display: 'inline-block' }}>
              💬 WhatsApp Us
            </a>
          </div>
        </div>
      </section>

      {/* ── LEAD FORM MODAL ── */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()} style={{ position: 'relative' }}>
            <button onClick={() => setShowForm(false)} style={{ position: 'absolute', top: 12, right: 16, background: 'none', border: 'none', fontSize: '1.3rem', cursor: 'pointer', color: 'var(--text2)' }}>✕</button>
            <LeadForm />
          </div>
        </div>
      )}
    </div>
  );
}
