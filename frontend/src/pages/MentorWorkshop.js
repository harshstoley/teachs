import React, { useState, useEffect } from 'react';
import api from '../utils/api';

export function MentorWorkshop() {
  const [sessions, setSessions] = useState([]);
  useEffect(() => {
    document.title = 'Mentor Workshop | Teachs – Expert Sessions for Parents & Students';
    api.get('/workshop/sessions').then(r => setSessions(r.data)).catch(() => {});
  }, []);

  return (
    <div>
      <section style={{ background: 'var(--navy)', padding: '100px 0 72px' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <span className="badge badge-teal" style={{ marginBottom: 16 }}>Mentor Workshop</span>
          <h1 style={{ color: 'white', marginBottom: 20 }}>Expert Workshops for Parents & Students</h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', maxWidth: 560, margin: '0 auto', fontSize: '1.05rem' }}>
            Live sessions on study habits, parenting for academic success, board exam strategies, and more — led by expert educators and child development specialists.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="overline">Purpose</span>
            <h2>Why We Run These Workshops</h2>
          </div>
          <div className="grid-3">
            {[
              { icon: '👨‍👩‍👧', title: 'Parent Empowerment', desc: 'Help parents understand how to support learning at home without stress or conflict.' },
              { icon: '📖', title: 'Student Skills', desc: 'Teach students study strategies, time management, and exam techniques that actually work.' },
              { icon: '🎯', title: 'Expert Guidance', desc: 'Every session is led by verified educators with real classroom experience.' },
            ].map(w => (
              <div key={w.title} className="card" style={{ padding: 28, textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: 16 }}>{w.icon}</div>
                <h4 style={{ marginBottom: 8 }}>{w.title}</h4>
                <p style={{ fontSize: '0.9rem' }}>{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-ice">
        <div className="container">
          <div className="section-header">
            <span className="overline">Upcoming Sessions</span>
            <h2>Register for an Upcoming Workshop</h2>
          </div>
          {sessions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--ink-lighter)' }}>
              <div style={{ fontSize: '3rem', marginBottom: 16 }}>🗓️</div>
              <p>No upcoming sessions right now. Check back soon or follow us on social media for announcements!</p>
            </div>
          ) : (
            <div className="grid-2">
              {sessions.map(s => (
                <div key={s.id} className="card" style={{ padding: 32 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                    <span className="badge badge-teal">Upcoming</span>
                    <span style={{ fontSize: '0.82rem', color: 'var(--ink-lighter)' }}>⏱ {s.duration} min</span>
                  </div>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: 8 }}>{s.title}</h3>
                  <p style={{ fontSize: '0.9rem', marginBottom: 20 }}>{s.description}</p>
                  <div style={{ display: 'flex', gap: 16, marginBottom: 24, fontSize: '0.85rem', color: 'var(--ink-lighter)' }}>
                    <span>📅 {new Date(s.session_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    <span>🕐 {new Date(s.session_date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                    {s.seats && <span>👥 {s.seats} seats</span>}
                  </div>
                  {s.google_form_url ? (
                    <a href={s.google_form_url} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ width: '100%', textAlign: 'center' }}>Register Free →</a>
                  ) : (
                    <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ width: '100%', textAlign: 'center' }}>Register via WhatsApp →</a>
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

  useEffect(() => { document.title = "Women's Program | Teachs – Work From Home Teaching Opportunities"; }, []);

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
    <div>
      <section style={{ background: 'linear-gradient(135deg, var(--navy) 0%, #0a4a5e 100%)', padding: '100px 0 72px' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <span className="badge badge-teal" style={{ marginBottom: 16 }}>Women's Program</span>
          <h1 style={{ color: 'white', marginBottom: 20 }}>Work From Home. Teach. Earn. Grow.</h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', maxWidth: 580, margin: '0 auto', fontSize: '1.1rem' }}>
            Join the Teachs teaching team as a work-from-home educator. Flexible hours, premium students, competitive pay — on your schedule.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid-3">
            {[
              { icon: '🏠', title: 'Fully Remote', desc: 'Teach from the comfort of your home. No commute. No compromise.' },
              { icon: '⏰', title: 'Flexible Hours', desc: 'Choose your teaching slots that fit around your lifestyle and family.' },
              { icon: '💰', title: 'Competitive Pay', desc: 'Earn well for your expertise. Transparent payment structure.' },
              { icon: '🎓', title: 'Training Provided', desc: 'We onboard, train, and support every teacher on the Teachs platform.' },
              { icon: '📈', title: 'Grow With Us', desc: 'Performance-based growth opportunities, senior teacher roles, and more.' },
              { icon: '👩‍🏫', title: 'Supportive Community', desc: 'Join a community of like-minded educators who love teaching.' },
            ].map(b => (
              <div key={b.title} className="card" style={{ padding: 24 }}>
                <div style={{ fontSize: '2rem', marginBottom: 12 }}>{b.icon}</div>
                <h4 style={{ marginBottom: 8 }}>{b.title}</h4>
                <p style={{ fontSize: '0.875rem' }}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-ice">
        <div className="container">
          <div style={{ maxWidth: 600, margin: '0 auto' }}>
            <div className="section-header" style={{ marginBottom: 40 }}>
              <span className="overline">Apply Now</span>
              <h2>Join the Teachs Teaching Team</h2>
              <p>Fill out the form below. Our team reviews all applications and reaches out within 2–3 business days.</p>
            </div>

            {success ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{ fontSize: '3rem', marginBottom: 16 }}>🎉</div>
                <h3 style={{ color: 'var(--navy)', marginBottom: 12 }}>Application Received!</h3>
                <p>{success}</p>
              </div>
            ) : (
              <div className="card-flat" style={{ padding: 36 }}>
                {error && <div className="alert alert-error">{error}</div>}
                <form onSubmit={submit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div className="form-group" style={{ margin: 0 }}><label className="form-label">Full Name *</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="form-input" required /></div>
                  <div className="form-group" style={{ margin: 0 }}><label className="form-label">Phone *</label><input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="form-input" required /></div>
                  <div className="form-group" style={{ margin: 0 }}><label className="form-label">Email</label><input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="form-input" /></div>
                  <div className="form-group" style={{ margin: 0 }}><label className="form-label">City</label><input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} className="form-input" /></div>
                  <div className="form-group" style={{ margin: 0, gridColumn: '1/-1' }}><label className="form-label">Highest Qualification</label><input value={form.qualification} onChange={e => setForm({ ...form, qualification: e.target.value })} className="form-input" placeholder="e.g. M.Sc Mathematics, B.Ed" /></div>
                  <div className="form-group" style={{ margin: 0, gridColumn: '1/-1' }}><label className="form-label">Subjects You Can Teach</label><input value={form.subjects} onChange={e => setForm({ ...form, subjects: e.target.value })} className="form-input" placeholder="e.g. Math, Science, English" /></div>
                  <div className="form-group" style={{ margin: 0, gridColumn: '1/-1' }}><label className="form-label">Teaching Experience</label><textarea value={form.experience} onChange={e => setForm({ ...form, experience: e.target.value })} className="form-input" rows={3} placeholder="Describe your experience..." /></div>
                  <div className="form-group" style={{ margin: 0, gridColumn: '1/-1' }}><label className="form-label">Anything else you'd like to share?</label><textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} className="form-input" rows={2} /></div>
                  <button type="submit" className="btn btn-primary btn-lg" style={{ gridColumn: '1/-1' }} disabled={loading}>{loading ? 'Submitting...' : 'Submit Application →'}</button>
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
