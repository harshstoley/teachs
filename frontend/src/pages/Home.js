import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LeadForm from '../components/LeadForm';
import api from '../utils/api';

const FAQS = [
  { q: 'What makes Teachs different from local tutors?', a: 'Unlike local tutors who often teach one-size-fits-all, Teachs pairs your child with two specialized teachers — one per subject group. This means deeper expertise, structured lesson plans, weekly assessments, and clear progress visibility for parents.' },
  { q: 'How does the Flexible Dual-Teacher Model work?', a: 'Based on your child\'s needs, we pair them with two teachers — e.g., Math+Science specialist and English+SST specialist. The pairing is flexible and can be adjusted as the student progresses.' },
  { q: 'Is there a free trial before I commit?', a: 'Absolutely! We offer a completely FREE demo class. You meet the teacher, experience the quality, and then decide. No registration fee, no obligation.' },
  { q: 'What classes do you cover?', a: 'We cover Class 1–12. Our flagship Dual-Teacher model runs for Class 1–10. For Class 11–12 Arts and Commerce, we offer custom plans.' },
  { q: 'How are parents kept in the loop?', a: 'Every week, parents receive progress updates including test scores, attendance, teacher feedback, and upcoming topics. You can also log in to the parent view of the student dashboard anytime.' },
  { q: 'What is the refund policy?', a: 'We offer a 7-day no-questions-asked refund on all paid plans. If you\'re not satisfied in the first 7 days, contact us for a full refund.' },
];

export default function Home() {
  const [testimonials, setTestimonials] = useState([]);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    api.get('/settings/testimonials').then(r => setTestimonials(r.data)).catch(() => {});
    document.title = 'Teachs – Flexible Dual-Teacher Model for Personalized Tutoring | Class 1–12';
  }, []);

  return (
    <div>
      {/* ───── HERO ───── */}
      <section style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        background: 'linear-gradient(135deg, #0d243f 0%, var(--navy) 50%, #0a4a5e 100%)',
        position: 'relative', overflow: 'hidden', paddingTop: 'var(--nav-height)',
      }}>
        {/* Background elements */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.05 }}>
          <div style={{ position: 'absolute', width: 600, height: 600, borderRadius: '50%', background: 'var(--teal)', top: -200, right: -200 }} />
          <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'var(--amber)', bottom: -100, left: -100 }} />
        </div>

        <div className="container" style={{ position: 'relative', zIndex: 1, padding: '80px 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
            {/* Left */}
            <div className="animate-fadeup">
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(0,153,178,0.15)', border: '1px solid rgba(0,153,178,0.3)', borderRadius: 24, padding: '6px 16px', marginBottom: 24 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--teal)', display: 'inline-block' }} />
                <span style={{ color: 'var(--teal)', fontSize: '0.82rem', fontWeight: 600 }}>Now enrolling for Class 1–12</span>
              </div>

              <h1 style={{ color: 'white', marginBottom: 24, lineHeight: 1.15 }}>
                Flexible <span style={{ color: 'var(--teal)' }}>Dual-Teacher</span> Model for Personalized Tutoring
              </h1>

              <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1.1rem', marginBottom: 36, maxWidth: 520 }}>
                Not a marketplace. We assign expert teachers under our own brand. Your child gets two specialized tutors, structured lesson plans, weekly progress tracking, and regular parent updates.
              </p>

              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 48 }}>
                <Link to="/pricing" className="btn btn-amber btn-lg">Book Free Demo →</Link>
                <Link to="/pricing" className="btn btn-lg" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '2px solid rgba(255,255,255,0.3)' }}>View Pricing</Link>
              </div>

              {/* Trust badges */}
              <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap' }}>
                {[['🎓', '500+', 'Students Taught'], ['⭐', '4.9/5', 'Average Rating'], ['🔄', '7-day', 'Refund Policy'], ['✅', 'Free', 'Demo Class']].map(([icon, val, label]) => (
                  <div key={label} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.1rem', marginBottom: 2 }}>{icon}</div>
                    <div style={{ color: 'white', fontWeight: 700, fontSize: '1rem' }}>{val}</div>
                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.72rem' }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - Lead Form */}
            <div className="animate-fadeup" style={{ animationDelay: '0.2s' }}>
              <div style={{ background: 'white', borderRadius: 24, padding: 36, boxShadow: '0 24px 80px rgba(0,0,0,0.25)' }} id="demo">
                <LeadForm />
              </div>
            </div>
          </div>
        </div>

        <style>{`@media (max-width:860px) { section > .container > div { grid-template-columns: 1fr !important; } }`}</style>
      </section>

      {/* ───── WHY TEACHS ───── */}
      <section className="section section-ice">
        <div className="container">
          <div className="section-header">
            <span className="overline">Why Teachs Exists</span>
            <h2>Education Deserves Better Than Generic Tutoring</h2>
            <p>Most tutors are generalists. Your child's learning needs are specific. Teachs was built to bridge that gap.</p>
          </div>

          <div className="grid-3">
            {[
              { icon: '🎯', title: 'Specialized Expertise', desc: 'Each teacher focuses on their strongest subjects — not a jack of all trades. Your child gets depth, not breadth.' },
              { icon: '🔄', title: 'Flexible Pairing', desc: 'Teacher assignments are flexible. As subjects evolve or interests shift, we re-pair to keep learning optimized.' },
              { icon: '📊', title: 'Visible Progress', desc: 'Every parent gets weekly reports, test scores, and attendance. No more wondering how your child is doing.' },
              { icon: '📋', title: 'Structured Lesson Plans', desc: 'Every session follows a curriculum — not improvised. Chapter-wise plans ensure nothing is missed.' },
              { icon: '💬', title: 'Real Doubt Resolution', desc: 'Students can submit doubts anytime. Teachers respond within the session or before the next class.' },
              { icon: '🏆', title: 'Board Exam Ready', desc: 'For Class 9–10, our programs are designed around board exam patterns — with mock tests and performance analysis.' },
            ].map(item => (
              <div key={item.title} className="card" style={{ padding: 28 }}>
                <div style={{ fontSize: '2rem', marginBottom: 16 }}>{item.icon}</div>
                <h4 style={{ color: 'var(--ink)', marginBottom: 8 }}>{item.title}</h4>
                <p style={{ fontSize: '0.9rem' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── HOW IT WORKS ───── */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="overline">How It Works</span>
            <h2>Get Started in 4 Simple Steps</h2>
          </div>
          <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
            {[
              { step: '01', title: 'Book Free Demo', desc: 'Fill the form. We contact you within 24 hours to schedule a free class.' },
              { step: '02', title: 'Meet Your Teachers', desc: 'We assign two specialized teachers based on your child\'s class and subjects.' },
              { step: '03', title: 'Start Learning', desc: 'Classes begin with personalized lesson plans, homework, and regular tests.' },
              { step: '04', title: 'Track Progress', desc: 'Parents receive weekly progress reports. Students access their full dashboard.' },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: 'center', padding: '32px 20px', position: 'relative' }}>
                <div style={{
                  width: 64, height: 64, borderRadius: '50%', background: i % 2 === 0 ? 'var(--navy)' : 'var(--teal)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px',
                  fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.3rem', color: 'white',
                }}>
                  {s.step}
                </div>
                <h4 style={{ marginBottom: 8 }}>{s.title}</h4>
                <p style={{ fontSize: '0.9rem' }}>{s.desc}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <Link to="/pricing" className="btn btn-primary btn-lg">Start with a Free Demo →</Link>
          </div>
        </div>
        <style>{`@media (max-width:700px) { section .container > div { grid-template-columns: 1fr 1fr !important; } }`}</style>
      </section>

      {/* ───── TEACHS vs LOCAL TUTORS ───── */}
      <section className="section section-ice">
        <div className="container">
          <div className="section-header">
            <span className="overline">Why Teachs</span>
            <h2>Teachs vs Local Tutors</h2>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', maxWidth: 800, margin: '0 auto', borderCollapse: 'collapse', background: 'white', borderRadius: 16, overflow: 'hidden', boxShadow: 'var(--shadow-md)' }}>
              <thead>
                <tr>
                  <th style={{ padding: '18px 24px', background: 'var(--ice)', textAlign: 'left', fontFamily: 'var(--font-body)', color: 'var(--ink-lighter)', fontWeight: 600 }}>Feature</th>
                  <th style={{ padding: '18px 24px', background: 'var(--navy)', textAlign: 'center', color: 'white', fontFamily: 'var(--font-body)', fontWeight: 700 }}>Teachs ✓</th>
                  <th style={{ padding: '18px 24px', background: 'var(--ice)', textAlign: 'center', color: 'var(--ink-lighter)', fontFamily: 'var(--font-body)', fontWeight: 600 }}>Local Tutor</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Dual-Teacher Model', true, false],
                  ['Structured Lesson Plans', true, false],
                  ['Weekly Progress Reports', true, false],
                  ['Chapter-wise Tests', true, '⚠️ Rare'],
                  ['Parent Dashboard', true, false],
                  ['Doubt Submission System', true, false],
                  ['7-day Refund Guarantee', true, false],
                  ['Consistent Teaching Quality', true, '⚠️ Varies'],
                  ['Homework Tracking', true, false],
                  ['Board Exam Focused', true, '⚠️ Maybe'],
                ].map(([feature, teachs, local], i) => (
                  <tr key={i}>
                    <td style={{ padding: '14px 24px', fontWeight: 500, borderTop: '1px solid var(--border)' }}>{feature}</td>
                    <td style={{ textAlign: 'center', borderTop: '1px solid var(--border)', color: 'var(--success)', fontWeight: 700 }}>
                      {teachs === true ? '✓' : teachs}
                    </td>
                    <td style={{ textAlign: 'center', borderTop: '1px solid var(--border)', color: 'var(--error)' }}>
                      {local === false ? '✗' : local}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ───── TESTIMONIALS ───── */}
      {testimonials.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-header">
              <span className="overline">Parent Reviews</span>
              <h2>What Parents Are Saying</h2>
            </div>
            <div className="grid-3">
              {testimonials.map(t => (
                <div key={t.id} className="card" style={{ padding: 28 }}>
                  <div style={{ display: 'flex', gap: 2, marginBottom: 16 }}>
                    {Array.from({ length: t.rating || 5 }).map((_, i) => <span key={i} style={{ color: 'var(--amber)' }}>★</span>)}
                  </div>
                  <p style={{ fontStyle: 'italic', marginBottom: 20, fontSize: '0.95rem', color: 'var(--ink-light)' }}>"{t.content}"</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'var(--navy)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700 }}>
                      {t.name[0]}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--ink)' }}>{t.name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--teal)' }}>{t.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ───── MENTOR WORKSHOP TEASER ───── */}
      <section className="section section-ice">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>
            <div>
              <span className="badge badge-teal" style={{ marginBottom: 16 }}>Mentor Workshop</span>
              <h2 style={{ marginBottom: 16 }}>Workshops for Parents & Students</h2>
              <p style={{ marginBottom: 24 }}>Live expert sessions on parenting for academic success, study habits, board exam strategies, and more. Limited seats every session.</p>
              <Link to="/mentor-workshop" className="btn btn-primary">Explore Workshops →</Link>
            </div>
            <div style={{ background: 'var(--navy)', borderRadius: 20, padding: 36, color: 'white' }}>
              <div style={{ fontSize: '2rem', marginBottom: 16 }}>🎓</div>
              <h3 style={{ color: 'white', marginBottom: 12 }}>Upcoming: Parent Masterclass</h3>
              <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: 20 }}>How to support your child's learning at home without conflict. Expert-led, 90 minutes, limited to 50 parents.</p>
              <Link to="/mentor-workshop" className="btn btn-amber">Register Free →</Link>
            </div>
          </div>
        </div>
        <style>{`@media(max-width:700px){section .container > div{grid-template-columns:1fr!important}}`}</style>
      </section>

      {/* ───── WOMEN'S PROGRAM TEASER ───── */}
      <section className="section" style={{ background: 'linear-gradient(135deg, var(--navy) 0%, #0d5572 100%)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <span className="badge badge-teal" style={{ marginBottom: 16 }}>Women's Program</span>
          <h2 style={{ color: 'white', marginBottom: 16 }}>Work From Home. Teach. Earn.</h2>
          <p style={{ color: 'rgba(255,255,255,0.75)', maxWidth: 560, margin: '0 auto 32px', fontSize: '1.05rem' }}>
            Are you a qualified woman educator looking for flexible, remote teaching opportunities? Join the Teachs teaching team and make a difference — on your own schedule.
          </p>
          <Link to="/womens-program" className="btn btn-amber btn-lg">Learn About the Program →</Link>
        </div>
      </section>

      {/* ───── FAQ ───── */}
      <section className="section section-ice" itemScope itemType="https://schema.org/FAQPage">
        <div className="container">
          <div className="section-header">
            <span className="overline">FAQ</span>
            <h2>Frequently Asked Questions</h2>
          </div>
          <div style={{ maxWidth: 740, margin: '0 auto' }}>
            {FAQS.map((faq, i) => (
              <div key={i} itemScope itemProp="mainEntity" itemType="https://schema.org/Question"
                style={{ border: '1px solid var(--border)', borderRadius: 12, marginBottom: 12, background: 'white', overflow: 'hidden' }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{
                  width: '100%', padding: '18px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
                }}>
                  <span style={{ fontWeight: 600, color: 'var(--ink)', fontSize: '0.95rem' }} itemProp="name">{faq.q}</span>
                  <span style={{ color: 'var(--teal)', fontSize: '1.2rem', flexShrink: 0, marginLeft: 12 }}>{openFaq === i ? '−' : '+'}</span>
                </button>
                {openFaq === i && (
                  <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer" style={{ padding: '0 24px 20px' }}>
                    <p style={{ margin: 0, fontSize: '0.93rem' }} itemProp="text">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── FINAL CTA ───── */}
      <section className="section" style={{ background: 'var(--navy)', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ color: 'white', marginBottom: 16 }}>Ready to Transform Your Child's Learning?</h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', maxWidth: 520, margin: '0 auto 36px', fontSize: '1.05rem' }}>
            Book a free demo class today. Meet the teachers. No fees. No commitment.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/pricing" className="btn btn-amber btn-lg">Book Free Demo Class</Link>
            <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="btn btn-lg" style={{ background: '#25D366', color: 'white' }}>
              💬 WhatsApp Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
