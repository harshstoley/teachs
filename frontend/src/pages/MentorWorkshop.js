import React, { useEffect, useState } from 'react';
import api from '../utils/api';

export function MentorWorkshop() {
  const [sessions, setSessions] = useState([]);
  useEffect(() => {
    document.title = 'Mentor Workshop | Teachs';
    api.get('/workshop/sessions').then(r => setSessions(r.data)).catch(() => {});
  }, []);

  return (
    <div style={{ background: 'var(--ink)', minHeight: '100vh' }}>
      {/* Hero */}
      <section style={{ padding: '100px 0 60px', borderBottom: '1px solid rgba(212,168,83,0.1)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <span style={{ display: 'inline-block', background: 'rgba(59,114,245,0.10)', color: 'var(--amber2)', fontSize: '0.75rem', fontWeight: 700, padding: '6px 16px', borderRadius: 100, marginBottom: 20, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Mentor Workshop</span>
          <h1 style={{ color: 'white', marginBottom: 18 }}>Expert Workshops for Parents & Students</h1>
          <p style={{ color: 'rgba(255,255,255,0.55)', maxWidth: 540, margin: '0 auto', fontSize: '1rem', lineHeight: 1.75 }}>
            Live sessions on study habits, parenting for academic success, board exam strategies, and more — led by expert educators and child development specialists.
          </p>
        </div>
      </section>

      {/* Why */}
      <section style={{ padding: '64px 0', borderBottom: '1px solid rgba(212,168,83,0.08)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <span style={{ display: 'inline-block', background: 'rgba(59,114,245,0.10)', color: 'var(--amber2)', fontSize: '0.75rem', fontWeight: 700, padding: '6px 16px', borderRadius: 100, marginBottom: 14, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Purpose</span>
            <h2 style={{ color: 'white' }}>Why We Run These Workshops</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 18 }}>
            {[
              ['👨‍👩‍👧', 'Parent Empowerment', 'Help parents understand how to support learning at home without stress or conflict.'],
              ['📖', 'Student Skills', 'Teach students study strategies, time management, and exam techniques that actually work.'],
              ['🎯', 'Expert Guidance', 'Every session is led by verified educators with real classroom experience.'],
            ].map(([icon, title, desc]) => (
              <div key={title} style={{ background: 'var(--ink2)', border: '1px solid rgba(59,114,245,0.15)', borderRadius: 16, padding: '28px 22px', textAlign: 'center' }}>
                <div style={{ fontSize: '2.2rem', marginBottom: 14 }}>{icon}</div>
                <h3 style={{ color: 'white', fontSize: '1rem', marginBottom: 10 }}>{title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.875rem', lineHeight: 1.65 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sessions */}
      <section style={{ padding: '64px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <span style={{ display: 'inline-block', background: 'rgba(59,114,245,0.10)', color: 'var(--amber2)', fontSize: '0.75rem', fontWeight: 700, padding: '6px 16px', borderRadius: 100, marginBottom: 14, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Upcoming Sessions</span>
            <h2 style={{ color: 'white' }}>Register for an Upcoming Workshop</h2>
          </div>
          {sessions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={{ fontSize: '3rem', marginBottom: 16 }}>🗓️</div>
              <p style={{ color: 'rgba(255,255,255,0.55)' }}>No upcoming sessions right now. Follow us on social media for announcements!</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
              {sessions.map(s => (
                <div key={s.id} style={{ background: 'var(--ink2)', border: '1px solid rgba(59,114,245,0.18)', borderRadius: 16, padding: '24px 20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <span style={{ background: 'rgba(42,138,94,0.15)', color: '#5BC8A0', padding: '3px 12px', borderRadius: 100, fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' }}>Upcoming</span>
                    <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.40)' }}>⏱ {s.duration} min</span>
                  </div>
                  <h3 style={{ color: 'white', fontSize: '1.05rem', marginBottom: 10 }}>{s.title}</h3>
                  <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.875rem', marginBottom: 18, lineHeight: 1.65 }}>{s.description}</p>
                  <div style={{ display: 'flex', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.55)' }}>📅 {new Date(s.session_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.55)' }}>🕐 {new Date(s.session_date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                    {s.seats && <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.55)' }}>👥 {s.seats} seats</span>}
                  </div>
                  {s.google_form_url ? (
                    <a href={s.google_form_url} target="_blank" rel="noopener noreferrer" style={{ display: 'block', padding: '12px', background: 'linear-gradient(135deg, var(--amber) 0%, var(--amber2) 100%)', color: 'var(--ink)', fontWeight: 700, textAlign: 'center', borderRadius: 10, fontSize: '0.9rem' }}>Register Free →</a>
                  ) : (
                    <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" style={{ display: 'block', padding: '12px', background: '#25D366', color: 'white', fontWeight: 700, textAlign: 'center', borderRadius: 10, fontSize: '0.9rem' }}>Register via WhatsApp →</a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export function WomensProgram() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', city: '', qualification: '', subjects: '', experience: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => { document.title = "Women's Program | Teachs"; }, []);

  const submit = async e => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await api.post('/women/apply', form);
      setSuccess(res.data.message);
    } catch (err) {
      setError(err.response?.data?.error || 'Submission failed.');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ background: 'var(--ink)', minHeight: '100vh' }}>
      {/* Hero */}
      <section style={{ padding: '100px 0 60px', borderBottom: '1px solid rgba(212,168,83,0.1)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <span style={{ display: 'inline-block', background: 'rgba(0,153,178,0.12)', color: 'var(--teal)', fontSize: '0.75rem', fontWeight: 700, padding: '6px 16px', borderRadius: 100, marginBottom: 20, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Women's Program</span>
          <h1 style={{ color: 'white', marginBottom: 18 }}>Work From Home. Teach. Earn. Grow.</h1>
          <p style={{ color: 'rgba(255,255,255,0.55)', maxWidth: 540, margin: '0 auto', fontSize: '1rem', lineHeight: 1.75 }}>
            Join the Teachs teaching team as a work-from-home educator. Flexible hours, premium students, competitive pay — on your schedule.
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section style={{ padding: '64px 0', borderBottom: '1px solid rgba(212,168,83,0.08)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
            {[
              ['🏠', 'Fully Remote', 'Teach from home. No commute. No compromise.'],
              ['⏰', 'Flexible Hours', 'Choose slots that fit your lifestyle and family.'],
              ['💰', 'Competitive Pay', 'Earn well for your expertise. Transparent structure.'],
              ['🎓', 'Training Provided', 'We onboard and support every teacher on Teachs.'],
              ['📈', 'Grow With Us', 'Performance-based growth and senior roles.'],
              ['👩‍🏫', 'Supportive Community', 'Join educators who love what they do.'],
            ].map(([icon, title, desc]) => (
              <div key={title} style={{ background: 'var(--ink2)', border: '1px solid rgba(212,168,83,0.1)', borderRadius: 14, padding: '22px 18px' }}>
                <div style={{ fontSize: '1.8rem', marginBottom: 12 }}>{icon}</div>
                <h4 style={{ color: 'white', fontFamily: 'var(--font-body)', fontWeight: 700, marginBottom: 8, fontSize: '0.95rem' }}>{title}</h4>
                <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.845rem', lineHeight: 1.65 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section style={{ padding: '64px 0' }}>
        <div className="container">
          <div style={{ maxWidth: 560, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 36 }}>
              <span style={{ display: 'inline-block', background: 'rgba(59,114,245,0.10)', color: 'var(--amber2)', fontSize: '0.75rem', fontWeight: 700, padding: '6px 16px', borderRadius: 100, marginBottom: 14, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Apply Now</span>
              <h2 style={{ color: 'white', marginBottom: 10 }}>Join the Teachs Teaching Team</h2>
              <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.9rem' }}>We review all applications and reach out within 2–3 business days.</p>
            </div>

            {success ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', background: 'var(--ink2)', borderRadius: 20, border: '1px solid rgba(212,168,83,0.2)' }}>
                <div style={{ fontSize: '3rem', marginBottom: 16 }}>🎉</div>
                <h3 style={{ color: 'white', marginBottom: 10 }}>Application Received!</h3>
                <p style={{ color: 'rgba(255,255,255,0.55)' }}>{success}</p>
              </div>
            ) : (
              <div style={{ background: 'var(--ink2)', borderRadius: 20, padding: '32px 24px', border: '1px solid rgba(59,114,245,0.18)' }}>
                {error && <div className="alert alert-error">{error}</div>}
                <form onSubmit={submit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  {[
                    ['name', 'Full Name *', 'text', true],
                    ['phone', 'Phone *', 'text', true],
                    ['email', 'Email', 'email', false],
                    ['city', 'City', 'text', false],
                  ].map(([key, label, type, req]) => (
                    <div key={key} className="form-group" style={{ margin: 0 }}>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'rgba(255,255,255,0.55)', marginBottom: 6 }}>{label}</label>
                      <input type={type} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} required={req}
                        style={{ width: '100%', padding: '11px 14px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(212,168,83,0.2)', borderRadius: 10, color: 'white', fontSize: '0.9rem', fontFamily: 'var(--font-body)', outline: 'none' }} />
                    </div>
                  ))}
                  {[
                    ['qualification', 'Highest Qualification', 'e.g. M.Sc Mathematics, B.Ed'],
                    ['subjects', 'Subjects You Can Teach', 'e.g. Math, Science, English'],
                  ].map(([key, label, ph]) => (
                    <div key={key} className="form-group" style={{ margin: 0, gridColumn: '1/-1' }}>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'rgba(255,255,255,0.55)', marginBottom: 6 }}>{label}</label>
                      <input value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} placeholder={ph}
                        style={{ width: '100%', padding: '11px 14px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(212,168,83,0.2)', borderRadius: 10, color: 'white', fontSize: '0.9rem', fontFamily: 'var(--font-body)', outline: 'none' }} />
                    </div>
                  ))}
                  <div className="form-group" style={{ margin: 0, gridColumn: '1/-1' }}>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'rgba(255,255,255,0.55)', marginBottom: 6 }}>Teaching Experience</label>
                    <textarea value={form.experience} onChange={e => setForm({ ...form, experience: e.target.value })} rows={3} placeholder="Describe your experience..."
                      style={{ width: '100%', padding: '11px 14px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(212,168,83,0.2)', borderRadius: 10, color: 'white', fontSize: '0.9rem', fontFamily: 'var(--font-body)', outline: 'none', resize: 'vertical' }} />
                  </div>
                  <button type="submit" disabled={loading} style={{ gridColumn: '1/-1', padding: '14px', background: 'linear-gradient(135deg, var(--amber) 0%, var(--amber2) 100%)', color: 'var(--ink)', border: 'none', borderRadius: 12, fontWeight: 700, fontSize: '1rem', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                    {loading ? 'Submitting...' : 'Submit Application →'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default MentorWorkshop;
