import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const TABS = ['Overview', 'My Students', 'Homework', 'Progress', 'Attendance', 'Doubts', 'Notes', 'Feedback'];
const DAY = ['', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function TeacherDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('Overview');
  const [data, setData] = useState(null);
  const [tabData, setTabData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState({ text: '', type: '' });
  const showMsg = (text, type = 'success') => { setMsg({ text, type }); setTimeout(() => setMsg({ text: '', type: '' }), 3000); };

  // Forms
  const [hwForm, setHwForm] = useState({ student_id: '', subject: '', title: '', description: '', due_date: '' });
  const [progForm, setProgForm] = useState({ student_id: '', subject: '', score: '', remarks: '', report_date: '' });
  const [attForm, setAttForm] = useState({ student_id: '', class_date: '', status: 'present', subject: '' });
  const [noteForm, setNoteForm] = useState({ student_id: '', subject: '', title: '', content: '', is_public: false });
  const [fbForm, setFbForm] = useState({ student_id: '', subject: '', feedback: '', rating: 5 });
  const [doubtAnswer, setDoubtAnswer] = useState({});

  useEffect(() => {
    document.title = 'Teacher Dashboard | Teachs';
    api.get('/teacher/dashboard').then(r => setData(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (activeTab === 'Overview') return;
    if (activeTab === 'My Students') { api.get('/teacher/students').then(r => setTabData(r.data)).catch(() => setTabData([])); return; }
    setTabData(null);
  }, [activeTab]);

  const submitHw = async e => {
    e.preventDefault();
    try { await api.post('/teacher/homework', hwForm); showMsg('Homework assigned!'); setHwForm({ student_id: '', subject: '', title: '', description: '', due_date: '' }); } catch { showMsg('Failed.', 'error'); }
  };
  const submitProg = async e => {
    e.preventDefault();
    try { await api.post('/teacher/progress', progForm); showMsg('Progress report added!'); setProgForm({ student_id: '', subject: '', score: '', remarks: '', report_date: '' }); } catch { showMsg('Failed.', 'error'); }
  };
  const submitAtt = async e => {
    e.preventDefault();
    try { await api.post('/teacher/attendance', attForm); showMsg('Attendance marked!'); } catch { showMsg('Failed.', 'error'); }
  };
  const submitNote = async e => {
    e.preventDefault();
    try { await api.post('/teacher/notes', noteForm); showMsg('Notes saved!'); setNoteForm({ student_id: '', subject: '', title: '', content: '', is_public: false }); } catch { showMsg('Failed.', 'error'); }
  };
  const submitFb = async e => {
    e.preventDefault();
    try { await api.post('/teacher/feedback', fbForm); showMsg('Feedback submitted!'); setFbForm({ student_id: '', subject: '', feedback: '', rating: 5 }); } catch { showMsg('Failed.', 'error'); }
  };
  const answerDoubt = async (id) => {
    try { await api.put(`/teacher/doubts/${id}`, { answer: doubtAnswer[id] }); showMsg('Doubt answered!'); api.get('/teacher/dashboard').then(r => setData(r.data)); } catch { showMsg('Failed.', 'error'); }
  };

  const students = data?.students || [];

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}><div className="spinner" /></div>;

  const StudentSelect = ({ value, onChange, name }) => (
    <select name={name} value={value} onChange={onChange} className="form-input" required>
      <option value="">Select Student</option>
      {students.map(s => <option key={`${s.id}-${s.subject}`} value={s.id}>{s.name} (Class {s.student_class}) – {s.subject}</option>)}
    </select>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'var(--ice)' }}>
      <div style={{ background: 'var(--navy)', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link to="/" style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 700, color: 'white', textDecoration: 'none' }}>Teach<span style={{ color: 'var(--teal)' }}>s</span> <span style={{ fontSize: '0.8rem', fontWeight: 400, color: 'rgba(255,255,255,0.6)' }}>Teacher</span></Link>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>👨‍🏫 {user?.name}</span>
          <button onClick={logout} className="btn btn-ghost btn-sm" style={{ color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>Logout</button>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>
        {msg.text && <div className={`alert alert-${msg.type}`} style={{ marginBottom: 20 }}>{msg.text}</div>}

        <div style={{ display: 'flex', gap: 4, overflowX: 'auto', marginBottom: 28, background: 'white', borderRadius: 12, padding: 6, boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)' }}>
          {TABS.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              padding: '8px 14px', borderRadius: 8, border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
              background: activeTab === tab ? 'var(--teal)' : 'transparent',
              color: activeTab === tab ? 'white' : 'var(--ink-light)',
              fontWeight: activeTab === tab ? 600 : 400, fontSize: '0.875rem', transition: 'all 0.15s',
            }}>{tab}</button>
          ))}
        </div>

        {/* Overview */}
        {activeTab === 'Overview' && data && (
          <div>
            <div className="grid-4" style={{ marginBottom: 28 }}>
              {[
                { label: 'My Students', value: students.length, icon: '👨‍🎓', color: '#e8f4fd' },
                { label: 'Classes/Week', value: data.schedule?.length || 0, icon: '📅', color: '#e8fdf4' },
                { label: 'Pending Doubts', value: data.pendingDoubts?.length || 0, icon: '❓', color: '#fdf4e8' },
                { label: 'Homework Given', value: data.homework?.length || 0, icon: '📝', color: '#f4e8fd' },
              ].map(s => (
                <div key={s.label} className="stat-card">
                  <div className="stat-icon" style={{ background: s.color, fontSize: '1.6rem' }}>{s.icon}</div>
                  <div><div className="stat-value">{s.value}</div><div className="stat-label">{s.label}</div></div>
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              <div className="card-flat" style={{ padding: 24 }}>
                <h4 style={{ marginBottom: 16 }}>This Week's Schedule</h4>
                {data.schedule?.length ? data.schedule.map(s => (
                  <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)', fontSize: '0.875rem' }}>
                    <div><strong>{s.student_name}</strong> – {s.subject}</div>
                    <span className="badge badge-navy" style={{ fontSize: '0.72rem' }}>{DAY[s.day_of_week]} {s.start_time?.slice(0,5)}</span>
                  </div>
                )) : <p style={{ color: 'var(--ink-lighter)' }}>No schedule assigned.</p>}
              </div>
              <div className="card-flat" style={{ padding: 24 }}>
                <h4 style={{ marginBottom: 16 }}>Pending Doubts</h4>
                {data.pendingDoubts?.length ? data.pendingDoubts.map(d => (
                  <div key={d.id} style={{ padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: 4 }}>{d.student_name} – {d.subject}</div>
                    <p style={{ fontSize: '0.82rem', marginBottom: 8 }}>{d.question}</p>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <input value={doubtAnswer[d.id] || ''} onChange={e => setDoubtAnswer({ ...doubtAnswer, [d.id]: e.target.value })} placeholder="Type answer..." className="form-input" style={{ flex: 1, padding: '6px 10px', fontSize: '0.82rem' }} />
                      <button onClick={() => answerDoubt(d.id)} className="btn btn-primary btn-sm">Answer</button>
                    </div>
                  </div>
                )) : <p style={{ color: 'var(--ink-lighter)' }}>No pending doubts. 🎉</p>}
              </div>
            </div>
          </div>
        )}

        {/* My Students */}
        {activeTab === 'My Students' && (
          <div className="card-flat" style={{ padding: 28 }}>
            <h3 style={{ marginBottom: 24 }}>My Students</h3>
            {!tabData ? <div className="spinner" style={{ margin: '0 auto' }} /> : tabData.length === 0 ? (
              <p style={{ color: 'var(--ink-lighter)' }}>No students assigned yet.</p>
            ) : (
              <div className="table-wrap">
                <table>
                  <thead><tr><th>Name</th><th>Class</th><th>Subject</th><th>Parent</th><th>Phone</th></tr></thead>
                  <tbody>
                    {tabData.map((s, i) => (
                      <tr key={`${s.id}-${i}`}>
                        <td><strong>{s.name}</strong></td>
                        <td>Class {s.student_class}</td>
                        <td><span className="badge badge-teal">{s.subject}</span></td>
                        <td>{s.parent_name || '-'}</td>
                        <td>{s.parent_phone || s.phone || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Homework */}
        {activeTab === 'Homework' && (
          <div className="card-flat" style={{ padding: 28 }}>
            <h3 style={{ marginBottom: 24 }}>Assign Homework</h3>
            <form onSubmit={submitHw} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group" style={{ margin: 0 }}><label className="form-label">Student *</label><StudentSelect value={hwForm.student_id} onChange={e => setHwForm({ ...hwForm, student_id: e.target.value })} /></div>
              <div className="form-group" style={{ margin: 0 }}><label className="form-label">Subject</label><input value={hwForm.subject} onChange={e => setHwForm({ ...hwForm, subject: e.target.value })} className="form-input" placeholder="Subject" /></div>
              <div className="form-group" style={{ margin: 0, gridColumn: '1/-1' }}><label className="form-label">Title *</label><input value={hwForm.title} onChange={e => setHwForm({ ...hwForm, title: e.target.value })} className="form-input" placeholder="Homework title" required /></div>
              <div className="form-group" style={{ margin: 0, gridColumn: '1/-1' }}><label className="form-label">Description</label><textarea value={hwForm.description} onChange={e => setHwForm({ ...hwForm, description: e.target.value })} className="form-input" rows={3} placeholder="Instructions..." /></div>
              <div className="form-group" style={{ margin: 0 }}><label className="form-label">Due Date</label><input type="date" value={hwForm.due_date} onChange={e => setHwForm({ ...hwForm, due_date: e.target.value })} className="form-input" /></div>
              <div style={{ display: 'flex', alignItems: 'flex-end' }}><button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Assign Homework</button></div>
            </form>
          </div>
        )}

        {/* Progress */}
        {activeTab === 'Progress' && (
          <div className="card-flat" style={{ padding: 28 }}>
            <h3 style={{ marginBottom: 24 }}>Add Progress Report</h3>
            <form onSubmit={submitProg} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group" style={{ margin: 0 }}><label className="form-label">Student *</label><StudentSelect value={progForm.student_id} onChange={e => setProgForm({ ...progForm, student_id: e.target.value })} /></div>
              <div className="form-group" style={{ margin: 0 }}><label className="form-label">Subject</label><input value={progForm.subject} onChange={e => setProgForm({ ...progForm, subject: e.target.value })} className="form-input" placeholder="Subject" /></div>
              <div className="form-group" style={{ margin: 0 }}><label className="form-label">Score (%)</label><input type="number" min="0" max="100" value={progForm.score} onChange={e => setProgForm({ ...progForm, score: e.target.value })} className="form-input" placeholder="e.g. 85" /></div>
              <div className="form-group" style={{ margin: 0 }}><label className="form-label">Report Date</label><input type="date" value={progForm.report_date} onChange={e => setProgForm({ ...progForm, report_date: e.target.value })} className="form-input" /></div>
              <div className="form-group" style={{ margin: 0, gridColumn: '1/-1' }}><label className="form-label">Remarks</label><textarea value={progForm.remarks} onChange={e => setProgForm({ ...progForm, remarks: e.target.value })} className="form-input" rows={3} placeholder="Teacher's remarks for parents..." /></div>
              <button type="submit" className="btn btn-primary" style={{ gridColumn: '1/-1' }}>Save Progress Report</button>
            </form>
          </div>
        )}

        {/* Attendance */}
        {activeTab === 'Attendance' && (
          <div className="card-flat" style={{ padding: 28 }}>
            <h3 style={{ marginBottom: 24 }}>Mark Attendance</h3>
            <form onSubmit={submitAtt} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group" style={{ margin: 0 }}><label className="form-label">Student *</label><StudentSelect value={attForm.student_id} onChange={e => setAttForm({ ...attForm, student_id: e.target.value })} /></div>
              <div className="form-group" style={{ margin: 0 }}><label className="form-label">Subject</label><input value={attForm.subject} onChange={e => setAttForm({ ...attForm, subject: e.target.value })} className="form-input" placeholder="Subject" /></div>
              <div className="form-group" style={{ margin: 0 }}><label className="form-label">Date *</label><input type="date" value={attForm.class_date} onChange={e => setAttForm({ ...attForm, class_date: e.target.value })} className="form-input" required /></div>
              <div className="form-group" style={{ margin: 0 }}><label className="form-label">Status</label><select value={attForm.status} onChange={e => setAttForm({ ...attForm, status: e.target.value })} className="form-input"><option value="present">Present</option><option value="absent">Absent</option><option value="late">Late</option></select></div>
              <button type="submit" className="btn btn-primary" style={{ gridColumn: '1/-1' }}>Mark Attendance</button>
            </form>
          </div>
        )}

        {/* Notes */}
        {activeTab === 'Notes' && (
          <div className="card-flat" style={{ padding: 28 }}>
            <h3 style={{ marginBottom: 24 }}>Upload Study Notes</h3>
            <form onSubmit={submitNote} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group" style={{ margin: 0 }}><label className="form-label">Student (leave blank for all)</label><StudentSelect value={noteForm.student_id} onChange={e => setNoteForm({ ...noteForm, student_id: e.target.value })} /></div>
              <div className="form-group" style={{ margin: 0 }}><label className="form-label">Subject</label><input value={noteForm.subject} onChange={e => setNoteForm({ ...noteForm, subject: e.target.value })} className="form-input" placeholder="Subject" /></div>
              <div className="form-group" style={{ margin: 0, gridColumn: '1/-1' }}><label className="form-label">Title *</label><input value={noteForm.title} onChange={e => setNoteForm({ ...noteForm, title: e.target.value })} className="form-input" placeholder="Notes title" required /></div>
              <div className="form-group" style={{ margin: 0, gridColumn: '1/-1' }}><label className="form-label">Content</label><textarea value={noteForm.content} onChange={e => setNoteForm({ ...noteForm, content: e.target.value })} className="form-input" rows={5} placeholder="Write notes content..." /></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><input type="checkbox" id="public" checked={noteForm.is_public} onChange={e => setNoteForm({ ...noteForm, is_public: e.target.checked })} /><label htmlFor="public" style={{ fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer' }}>Make visible to all students</label></div>
              <button type="submit" className="btn btn-primary">Save Notes</button>
            </form>
          </div>
        )}

        {/* Feedback */}
        {activeTab === 'Feedback' && (
          <div className="card-flat" style={{ padding: 28 }}>
            <h3 style={{ marginBottom: 24 }}>Give Student Feedback</h3>
            <form onSubmit={submitFb} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group" style={{ margin: 0 }}><label className="form-label">Student *</label><StudentSelect value={fbForm.student_id} onChange={e => setFbForm({ ...fbForm, student_id: e.target.value })} /></div>
              <div className="form-group" style={{ margin: 0 }}><label className="form-label">Subject</label><input value={fbForm.subject} onChange={e => setFbForm({ ...fbForm, subject: e.target.value })} className="form-input" placeholder="Subject" /></div>
              <div className="form-group" style={{ margin: 0, gridColumn: '1/-1' }}><label className="form-label">Feedback *</label><textarea value={fbForm.feedback} onChange={e => setFbForm({ ...fbForm, feedback: e.target.value })} className="form-input" rows={4} placeholder="Detailed feedback for student and parent..." required /></div>
              <div className="form-group" style={{ margin: 0 }}><label className="form-label">Rating (1–5)</label><select value={fbForm.rating} onChange={e => setFbForm({ ...fbForm, rating: e.target.value })} className="form-input">{[5,4,3,2,1].map(r => <option key={r} value={r}>{r} ⭐</option>)}</select></div>
              <div style={{ display: 'flex', alignItems: 'flex-end' }}><button type="submit" className="btn btn-secondary" style={{ width: '100%' }}>Submit Feedback</button></div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
