import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const TABS = ['Overview', 'My Students', 'Schedule Class', 'Homework', 'Doubts', 'Progress', 'Attendance', 'Syllabus', 'Notes', 'Feedback'];
const DAY = ['', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const DAY_NAMES = ['', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const STATUS_COLORS = { pending: 'badge-amber', submitted: 'badge-sapphire', graded: 'badge-emerald', completed: 'badge-emerald' };
const SUBTOPIC_STATUS = { not_started: '#94a3b8', in_progress: '#F5A623', completed: '#22c55e' };
const SUBTOPIC_LABEL  = { not_started: 'Not Started', in_progress: 'In Progress', completed: 'Done ✓' };

function isClassJoinable(dayOfWeek, startTime, durationMin) {
  if (!startTime) return false;
  const now = new Date();
  const jsDay = now.getDay();
  const dbDay = jsDay === 0 ? 7 : jsDay;
  if (dbDay !== parseInt(dayOfWeek)) return false;
  const [h, m] = startTime.split(':').map(Number);
  const startMin = h * 60 + m;
  const nowMin = now.getHours() * 60 + now.getMinutes();
  return nowMin >= startMin - 10 && nowMin <= startMin + parseInt(durationMin || 60);
}

// ─── SCHEDULE TAB ─────────────────────────────────────────────────────────────
function ScheduleTab({ students, showMsg }) {
  const [form, setForm] = useState({ student_id: '', subject: '', day_of_week: 1, start_time: '17:00', duration_min: 60 });
  const [schedules, setSchedules] = useState(null);
  const [reschedule, setReschedule] = useState(null);
  const [, setTick] = useState(0);

  const load = () => api.get('/teacher/my-schedules').then(r => setSchedules(r.data)).catch(() => setSchedules([]));
  useEffect(() => { load(); }, []); // eslint-disable-line
  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 30000);
    return () => clearInterval(interval);
  }, []);

  const submit = async e => {
    e.preventDefault();
    try { await api.post('/teacher/schedule-class', form); showMsg('Class scheduled!'); setForm({ student_id: '', subject: '', day_of_week: 1, start_time: '17:00', duration_min: 60 }); load(); }
    catch { showMsg('Failed to schedule.', 'error'); }
  };
  const cancel = async id => {
    if (!window.confirm('Cancel this class?')) return;
    try { await api.put(`/teacher/schedules/${id}/cancel`); showMsg('Class cancelled.'); load(); }
    catch { showMsg('Failed.', 'error'); }
  };
  const submitReschedule = async e => {
    e.preventDefault();
    try { await api.put(`/teacher/schedules/${reschedule.id}/reschedule`, reschedule); showMsg('Rescheduled!'); setReschedule(null); load(); }
    catch { showMsg('Failed.', 'error'); }
  };

  const card = { background: 'white', borderRadius: 16, padding: 24, border: '1px solid var(--border)', boxShadow: 'var(--shadow-xs)' };
  return (
    <div style={{ display: 'grid', gap: 24 }}>
      <div style={{ ...card, maxWidth: 540 }}>
        <h4 style={{ marginBottom: 20, color: 'var(--text)' }}>Schedule a Class</h4>
        <form onSubmit={submit}>
          <div className="form-group">
            <label className="form-label">Student *</label>
            <select value={form.student_id} onChange={e => setForm({ ...form, student_id: e.target.value })} className="form-input" required>
              <option value="">Select Student</option>
              {students.map(s => <option key={`${s.id}-${s.subject}`} value={s.id}>{s.enrollment_no ? `[${s.enrollment_no}] ` : ''}{s.name} · Cl {s.student_class} · {s.subject}</option>)}
            </select>
          </div>
          <div className="form-group"><label className="form-label">Subject</label><input value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} className="form-input" placeholder="e.g. Mathematics" /></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Day of Week</label>
              <select value={form.day_of_week} onChange={e => setForm({ ...form, day_of_week: e.target.value })} className="form-input">
                {DAY_NAMES.slice(1).map((d, i) => <option key={i + 1} value={i + 1}>{d}</option>)}
              </select>
            </div>
            <div className="form-group"><label className="form-label">Start Time</label><input type="time" value={form.start_time} onChange={e => setForm({ ...form, start_time: e.target.value })} className="form-input" /></div>
            <div className="form-group"><label className="form-label">Duration (min)</label><input type="number" value={form.duration_min} onChange={e => setForm({ ...form, duration_min: e.target.value })} className="form-input" /></div>
          </div>
          <button type="submit" style={{ background: 'linear-gradient(135deg, var(--sapphire) 0%, var(--sapphire2) 100%)', color: 'white', fontWeight: 700, padding: '11px 22px', borderRadius: 10, border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)', width: '100%' }}>Schedule Class →</button>
        </form>
      </div>

      {reschedule && (
        <div className="modal-overlay" onClick={() => setReschedule(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()} style={{ background: 'white' }}>
            <h4 style={{ marginBottom: 20, color: 'var(--text)' }}>Reschedule — {reschedule.student_name}</h4>
            <form onSubmit={submitReschedule}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">New Day</label>
                  <select value={reschedule.day_of_week} onChange={e => setReschedule({ ...reschedule, day_of_week: e.target.value })} className="form-input">
                    {DAY_NAMES.slice(1).map((d, i) => <option key={i + 1} value={i + 1}>{d}</option>)}
                  </select>
                </div>
                <div className="form-group"><label className="form-label">New Time</label><input type="time" value={reschedule.start_time} onChange={e => setReschedule({ ...reschedule, start_time: e.target.value })} className="form-input" /></div>
                <div className="form-group"><label className="form-label">Duration (min)</label><input type="number" value={reschedule.duration_min} onChange={e => setReschedule({ ...reschedule, duration_min: e.target.value })} className="form-input" /></div>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button type="submit" style={{ flex: 1, padding: '11px', background: 'linear-gradient(135deg, var(--sapphire) 0%, var(--sapphire2) 100%)', color: 'white', border: 'none', borderRadius: 10, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>Confirm Reschedule</button>
                <button type="button" onClick={() => setReschedule(null)} style={{ flex: 1, padding: '11px', border: '1px solid var(--border)', borderRadius: 10, background: 'white', cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: 600 }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div style={card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h4 style={{ color: 'var(--text)' }}>My Scheduled Classes</h4>
          <button onClick={load} style={{ fontSize: '0.8rem', color: 'var(--sapphire)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: 600 }}>↻ Refresh</button>
        </div>
        {!schedules ? <div style={{ display: 'flex', justifyContent: 'center', padding: 24 }}><div className="spinner" /></div> :
          schedules.length === 0 ? <p style={{ color: 'var(--text3)', fontSize: '0.88rem' }}>No classes scheduled yet.</p> : (
            schedules.map(s => (
              <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border)', flexWrap: 'wrap', gap: 8 }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text)' }}>{s.student_name} — {s.subject}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text3)', marginTop: 2 }}>{DAY_NAMES[s.day_of_week]} · {s.start_time?.slice(0, 5)} · {s.duration_min} min</div>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                  {s.meet_link && isClassJoinable(s.day_of_week, s.start_time, s.duration_min) && (
                    <a href={s.meet_link} target="_blank" rel="noreferrer" style={{ padding: '5px 14px', background: '#0099B2', color: 'white', borderRadius: 7, fontWeight: 700, fontSize: '0.78rem', textDecoration: 'none', fontFamily: 'var(--font-body)', whiteSpace: 'nowrap' }}>🔴 Join Class</a>
                  )}
                  <button onClick={() => setReschedule({ ...s })} style={{ padding: '5px 12px', background: 'rgba(59,114,245,0.08)', color: 'var(--sapphire)', border: '1px solid rgba(59,114,245,0.2)', borderRadius: 7, cursor: 'pointer', fontSize: '0.78rem', fontFamily: 'var(--font-body)', fontWeight: 600 }}>↻ Reschedule</button>
                  <button onClick={() => cancel(s.id)} style={{ padding: '5px 12px', background: 'rgba(220,38,38,0.08)', color: '#dc2626', border: '1px solid rgba(220,38,38,0.2)', borderRadius: 7, cursor: 'pointer', fontSize: '0.78rem', fontFamily: 'var(--font-body)', fontWeight: 600 }}>✕ Cancel</button>
                </div>
              </div>
            ))
          )}
      </div>
    </div>
  );
}

// ─── SYLLABUS TAB ─────────────────────────────────────────────────────────────
function SyllabusTab({ students, showMsg }) {
  const [selectedStudent, setSelectedStudent] = useState('');
  const [syllabus, setSyllabus] = useState([]);
  const [loading, setSylLoading] = useState(false);
  const [newSubject, setNewSubject] = useState('');
  const [addingChapter, setAddingChapter] = useState({});   // { subjectId: name }
  const [addingSubtopic, setAddingSubtopic] = useState({}); // { chapterId: name }
  const [expandedSubjects, setExpandedSubjects] = useState({});

  const loadSyllabus = useCallback(async (sid) => {
    if (!sid) return;
    setSylLoading(true);
    try {
      const r = await api.get(`/teacher/syllabus?student_id=${sid}`);
      setSyllabus(r.data);
      const exp = {};
      r.data.forEach(s => { exp[s.id] = true; });
      setExpandedSubjects(exp);
    } catch (e) {
      console.error('syllabus load error:', e?.response?.data || e.message);
    } finally {
      setSylLoading(false);
    }
  }, []); // eslint-disable-line

  useEffect(() => { if (selectedStudent) loadSyllabus(selectedStudent); }, [selectedStudent, loadSyllabus]);

  const addSubject = async () => {
    if (!newSubject.trim()) return showMsg('Enter subject name', 'error');
    try {
      await api.post('/teacher/syllabus/subject', { student_id: selectedStudent, subject_name: newSubject.trim() });
      setNewSubject('');
      loadSyllabus(selectedStudent);
      showMsg('Subject added!');
    } catch { showMsg('Failed', 'error'); }
  };

  const addChapter = async (subjectId) => {
    const name = addingChapter[subjectId];
    if (!name?.trim()) return;
    try {
      await api.post('/teacher/syllabus/chapter', { subject_id: subjectId, chapter_name: name.trim() });
      setAddingChapter(prev => ({ ...prev, [subjectId]: '' }));
      loadSyllabus(selectedStudent);
      showMsg('Chapter added!');
    } catch { showMsg('Failed', 'error'); }
  };

  const addSubtopic = async (chapterId) => {
    const name = addingSubtopic[chapterId];
    if (!name?.trim()) return;
    try {
      await api.post('/teacher/syllabus/subtopic', { chapter_id: chapterId, subtopic_name: name.trim() });
      setAddingSubtopic(prev => ({ ...prev, [chapterId]: '' }));
      loadSyllabus(selectedStudent);
      showMsg('Sub-topic added!');
    } catch { showMsg('Failed', 'error'); }
  };

  const updateStatus = async (subtopicId, status) => {
    try {
      await api.put(`/teacher/syllabus/subtopic/${subtopicId}`, { status });
      loadSyllabus(selectedStudent);
    } catch { showMsg('Failed to update', 'error'); }
  };

  const deleteSubject = async (id) => {
    if (!window.confirm('Delete this subject and ALL its chapters/subtopics?')) return;
    try { await api.delete(`/teacher/syllabus/subject/${id}`); loadSyllabus(selectedStudent); showMsg('Deleted.'); }
    catch { showMsg('Failed', 'error'); }
  };

  const deleteChapter = async (id) => {
    if (!window.confirm('Delete this chapter and all its subtopics?')) return;
    try { await api.delete(`/teacher/syllabus/chapter/${id}`); loadSyllabus(selectedStudent); showMsg('Deleted.'); }
    catch { showMsg('Failed', 'error'); }
  };

  const deleteSubtopic = async (id) => {
    try { await api.delete(`/teacher/syllabus/subtopic/${id}`); loadSyllabus(selectedStudent); }
    catch { showMsg('Failed', 'error'); }
  };

  const card = { background: 'white', borderRadius: 16, padding: 24, border: '1px solid var(--border)', boxShadow: 'var(--shadow-xs)' };
  const btnSm = (color) => ({ padding: '3px 10px', fontSize: '0.72rem', background: 'none', border: `1px solid ${color}`, color, borderRadius: 6, cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: 600 });

  // Unique students
  const uniqueStudents = students.reduce((acc, s) => {
    if (!acc.find(x => x.id === s.id)) acc.push(s);
    return acc;
  }, []);

  return (
    <div style={{ display: 'grid', gap: 24 }}>
      {/* Student picker */}
      <div style={{ ...card, maxWidth: 480 }}>
        <h4 style={{ marginBottom: 16, color: 'var(--text)' }}>📚 Syllabus Manager</h4>
        <div className="form-group">
          <label className="form-label">Select Student</label>
          <select value={selectedStudent} onChange={e => setSelectedStudent(e.target.value)} className="form-input">
            <option value="">— Choose student —</option>
            {uniqueStudents.map(s => <option key={s.id} value={s.id}>{s.name} · Class {s.student_class}</option>)}
          </select>
        </div>
        {selectedStudent && (
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <input
              value={newSubject}
              onChange={e => setNewSubject(e.target.value)}
              className="form-input"
              placeholder="New subject name (e.g. Mathematics)"
              style={{ flex: 1 }}
              onKeyDown={e => e.key === 'Enter' && addSubject()}
            />
            <button onClick={addSubject} style={{ padding: '8px 18px', background: '#1B3A6B', color: 'white', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-body)', whiteSpace: 'nowrap' }}>+ Subject</button>
          </div>
        )}
      </div>

      {/* Syllabus tree */}
      {selectedStudent && (
        <div style={card}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: 32 }}><div className="spinner" /></div>
          ) : syllabus.length === 0 ? (
            <p style={{ color: 'var(--text3)', fontSize: '0.88rem' }}>No syllabus added yet. Add a subject above to get started.</p>
          ) : syllabus.map(subject => {
            const allSubtopics = subject.chapters?.flatMap(c => c.subtopics || []) || [];
            const completedCount = allSubtopics.filter(st => st.status === 'completed').length;
            const pct = allSubtopics.length > 0 ? Math.round((completedCount / allSubtopics.length) * 100) : 0;

            return (
              <div key={subject.id} style={{ marginBottom: 24, borderRadius: 12, border: '1px solid var(--border)', overflow: 'hidden' }}>
                {/* Subject header */}
                <div style={{ background: '#1B3A6B', color: 'white', padding: '12px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                  <button onClick={() => setExpandedSubjects(p => ({ ...p, [subject.id]: !p[subject.id] }))} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 700, fontFamily: 'var(--font-body)', textAlign: 'left', flex: 1, padding: 0 }}>
                    {expandedSubjects[subject.id] ? '▾' : '▸'} {subject.subject_name}
                  </button>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                    <div style={{ fontSize: '0.75rem', opacity: 0.85 }}>{completedCount}/{allSubtopics.length} done</div>
                    <div style={{ width: 80, height: 6, background: 'rgba(255,255,255,0.25)', borderRadius: 3 }}>
                      <div style={{ width: `${pct}%`, height: '100%', background: '#F5A623', borderRadius: 3, transition: 'width 0.4s' }} />
                    </div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, opacity: 0.9 }}>{pct}%</div>
                    <button onClick={() => deleteSubject(subject.id)} style={{ ...btnSm('rgba(255,255,255,0.6)'), borderColor: 'rgba(255,255,255,0.3)', color: 'rgba(255,255,255,0.8)' }}>✕</button>
                  </div>
                </div>

                {expandedSubjects[subject.id] && (
                  <div style={{ padding: '16px 18px' }}>
                    {/* Add chapter input */}
                    <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                      <input
                        value={addingChapter[subject.id] || ''}
                        onChange={e => setAddingChapter(p => ({ ...p, [subject.id]: e.target.value }))}
                        className="form-input"
                        placeholder="Add chapter..."
                        style={{ flex: 1, fontSize: '0.83rem' }}
                        onKeyDown={e => e.key === 'Enter' && addChapter(subject.id)}
                      />
                      <button onClick={() => addChapter(subject.id)} style={{ padding: '7px 14px', background: 'rgba(27,58,107,0.1)', color: '#1B3A6B', border: '1px solid rgba(27,58,107,0.25)', borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '0.82rem', whiteSpace: 'nowrap' }}>+ Chapter</button>
                    </div>

                    {/* Chapters */}
                    {(subject.chapters || []).map(chapter => {
                      const chTotal = chapter.subtopics?.length || 0;
                      const chDone = chapter.subtopics?.filter(st => st.status === 'completed').length || 0;
                      const chPct = chTotal > 0 ? Math.round((chDone / chTotal) * 100) : 0;

                      return (
                        <div key={chapter.id} style={{ marginBottom: 14, background: '#f8fafc', borderRadius: 10, padding: 14 }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8, flexWrap: 'wrap', gap: 6 }}>
                            <div style={{ fontWeight: 600, fontSize: '0.87rem', color: '#1B3A6B' }}>📖 {chapter.chapter_name}</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                              <div style={{ width: 60, height: 5, background: '#e2e8f0', borderRadius: 3 }}>
                                <div style={{ width: `${chPct}%`, height: '100%', background: '#0099B2', borderRadius: 3 }} />
                              </div>
                              <span style={{ fontSize: '0.72rem', color: 'var(--text3)', fontWeight: 600 }}>{chDone}/{chTotal}</span>
                              <button onClick={() => deleteChapter(chapter.id)} style={btnSm('#dc2626')}>✕</button>
                            </div>
                          </div>

                          {/* Subtopics */}
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
                            {(chapter.subtopics || []).map(st => (
                              <div key={st.id} style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'white', border: `1.5px solid ${SUBTOPIC_STATUS[st.status]}`, borderRadius: 20, padding: '3px 10px', fontSize: '0.78rem' }}>
                                <span style={{ color: '#334155' }}>{st.subtopic_name}</span>
                                <select
                                  value={st.status}
                                  onChange={e => updateStatus(st.id, e.target.value)}
                                  style={{ fontSize: '0.7rem', border: 'none', background: 'transparent', color: SUBTOPIC_STATUS[st.status], fontWeight: 700, cursor: 'pointer', outline: 'none', fontFamily: 'var(--font-body)' }}
                                >
                                  <option value="not_started">Not Started</option>
                                  <option value="in_progress">In Progress</option>
                                  <option value="completed">Done ✓</option>
                                </select>
                                <button onClick={() => deleteSubtopic(st.id)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '0.7rem', padding: '0 2px' }}>×</button>
                              </div>
                            ))}
                          </div>

                          {/* Add subtopic */}
                          <div style={{ display: 'flex', gap: 6 }}>
                            <input
                              value={addingSubtopic[chapter.id] || ''}
                              onChange={e => setAddingSubtopic(p => ({ ...p, [chapter.id]: e.target.value }))}
                              className="form-input"
                              placeholder="Add sub-topic..."
                              style={{ flex: 1, fontSize: '0.78rem', padding: '5px 10px' }}
                              onKeyDown={e => e.key === 'Enter' && addSubtopic(chapter.id)}
                            />
                            <button onClick={() => addSubtopic(chapter.id)} style={{ padding: '5px 12px', background: '#0099B2', color: 'white', border: 'none', borderRadius: 7, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '0.78rem', whiteSpace: 'nowrap' }}>+ Sub-topic</button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function TeacherDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('Overview');
  const [data, setData] = useState(null);
  const [tabData, setTabData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState({ text: '', type: '' });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const showMsg = (text, type = 'success') => { setMsg({ text, type }); setTimeout(() => setMsg({ text: '', type: '' }), 3500); };

  // Form states
  const [hwForm, setHwForm] = useState({ student_id: '', subject: '', title: '', description: '', due_date: '' });
  const [progForm, setProgForm] = useState({ student_id: '', subject: '', score: '', remarks: '', report_date: '' });

  // Enhanced attendance form with topic tracking
  const [attForm, setAttForm] = useState({
    student_id: '', class_date: new Date().toISOString().split('T')[0],
    status: 'present', subject: '',
    topic_taught: '', sub_topic: '', homework_given: '', class_rating: 5
  });

  const [noteForm, setNoteForm] = useState({ student_id: '', subject: '', title: '', content: '', is_public: false });
  const [fbForm, setFbForm] = useState({ student_id: '', subject: '', feedback: '', rating: 5 });
  const [doubtAnswer, setDoubtAnswer] = useState({});
  const [editHw, setEditHw] = useState(null);

  useEffect(() => {
    document.title = 'Teacher Dashboard | Teachs';
    api.get('/teacher/dashboard').then(r => setData(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (activeTab === 'Overview' || activeTab === 'Schedule Class' || activeTab === 'Syllabus') return;
    setTabData(null);
    const ep = { 'My Students': '/teacher/students', 'Homework': '/teacher/homework-all', 'Doubts': '/teacher/doubts-for-me' };
    if (ep[activeTab]) api.get(ep[activeTab]).then(r => setTabData(r.data)).catch(() => setTabData([]));
  }, [activeTab]);

  const reload = () => {
    if (activeTab === 'Homework') api.get('/teacher/homework-all').then(r => setTabData(r.data)).catch(() => {});
    if (activeTab === 'Doubts') api.get('/teacher/doubts-for-me').then(r => setTabData(r.data)).catch(() => {});
  };

  const submitHw = async e => { e.preventDefault(); try { await api.post('/teacher/homework', hwForm); showMsg('Homework assigned!'); setHwForm({ student_id: '', subject: '', title: '', description: '', due_date: '' }); reload(); } catch { showMsg('Failed.', 'error'); } };
  const updateHw = async e => { e.preventDefault(); try { await api.put(`/teacher/homework/${editHw.id}`, editHw); showMsg('Updated!'); setEditHw(null); reload(); } catch { showMsg('Failed.', 'error'); } };
  const markHwStatus = async (id, status) => { try { await api.put(`/teacher/homework/${id}`, { ...tabData.find(h => h.id === id), status }); showMsg(`Marked as ${status}!`); reload(); } catch { showMsg('Failed.', 'error'); } };
  const answerDoubt = async (id, markExplained = false) => {
    const answer = doubtAnswer[id];
    if (!answer && !markExplained) return showMsg('Type an answer first', 'error');
    try {
      await api.put(`/teacher/doubts/${id}`, { answer: answer || 'Explained in class', status: 'answered' });
      showMsg(markExplained ? 'Marked as explained!' : 'Doubt answered!');
      setDoubtAnswer(prev => { const n = { ...prev }; delete n[id]; return n; });
      reload();
    } catch { showMsg('Failed.', 'error'); }
  };
  const submitProg = async e => { e.preventDefault(); try { await api.post('/teacher/progress', progForm); showMsg('Progress added!'); setProgForm({ student_id: '', subject: '', score: '', remarks: '', report_date: '' }); } catch { showMsg('Failed.', 'error'); } };
  const submitAtt = async e => {
    e.preventDefault();
    if (!attForm.topic_taught.trim()) return showMsg('Topic Taught is required', 'error');
    try {
      await api.post('/teacher/attendance', attForm);
      showMsg('Attendance marked with topic!');
      setAttForm({ student_id: '', class_date: new Date().toISOString().split('T')[0], status: 'present', subject: '', topic_taught: '', sub_topic: '', homework_given: '', class_rating: 5 });
    } catch (e) { showMsg(e?.response?.data?.error || 'Failed.', 'error'); }
  };
  const submitNote = async e => { e.preventDefault(); try { await api.post('/teacher/notes', noteForm); showMsg('Notes saved!'); setNoteForm({ student_id: '', subject: '', title: '', content: '', is_public: false }); } catch { showMsg('Failed.', 'error'); } };
  const submitFb = async e => { e.preventDefault(); try { await api.post('/teacher/feedback', fbForm); showMsg('Feedback submitted!'); setFbForm({ student_id: '', subject: '', feedback: '', rating: 5 }); } catch { showMsg('Failed.', 'error'); } };

  // ─── RENDER ────────────────────────────────────────────────────────────────
  const card = { background: 'white', borderRadius: 16, padding: 24, border: '1px solid var(--border)', boxShadow: 'var(--shadow-xs)' };
  const students = data?.students || [];

  const renderContent = () => {
    if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}><div className="spinner" /></div>;

    // ── Overview ──────────────────────────────────────────────────────────────
    if (activeTab === 'Overview') {
      const upcoming = data?.schedule?.slice(0, 4) || [];
      const pending = data?.pendingDoubts?.length || 0;
      return (
        <div style={{ display: 'grid', gap: 24 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 16 }}>
            {[
              { label: 'My Students', val: students.length, icon: '👨‍🎓', color: '#1B3A6B' },
              { label: 'Upcoming Classes', val: upcoming.length, icon: '📅', color: '#0099B2' },
              { label: 'Pending Doubts', val: pending, icon: '❓', color: '#F5A623' },
              { label: 'Homework Tasks', val: data?.homework?.length || 0, icon: '📝', color: '#7c3aed' },
            ].map(({ label, val, icon, color }) => (
              <div key={label} style={{ ...card, textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: 6 }}>{icon}</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color }}>{val}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text3)', marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </div>

          {/* Upcoming schedule */}
          <div style={card}>
            <h4 style={{ marginBottom: 16, color: 'var(--text)' }}>📅 Upcoming Classes</h4>
            {upcoming.length === 0 ? <p style={{ color: 'var(--text3)', fontSize: '0.88rem' }}>No scheduled classes yet.</p> :
              upcoming.map(s => (
                <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text)' }}>{s.student_name} · {s.subject}</div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text3)' }}>{DAY[s.day_of_week]} {s.start_time?.slice(0, 5)} · {s.duration_min} min</div>
                  </div>
                  {s.meet_link && <a href={s.meet_link} target="_blank" rel="noreferrer" style={{ fontSize: '0.78rem', color: '#0099B2', fontWeight: 700, textDecoration: 'none' }}>Join →</a>}
                </div>
              ))}
          </div>

          {/* Recent homework */}
          {data?.homework?.length > 0 && (
            <div style={card}>
              <h4 style={{ marginBottom: 16, color: 'var(--text)' }}>📝 Recent Homework</h4>
              {data.homework.slice(0, 5).map(h => (
                <div key={h.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: '1px solid var(--border)' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.87rem', color: 'var(--text)' }}>{h.title}</div>
                    <div style={{ fontSize: '0.73rem', color: 'var(--text3)' }}>{h.student_name} · {h.subject} · Due {h.due_date || '—'}</div>
                  </div>
                  <span className={`badge ${STATUS_COLORS[h.status] || ''}`}>{h.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    // ── My Students ───────────────────────────────────────────────────────────
    if (activeTab === 'My Students') {
      const rows = tabData || students;
      return (
        <div style={card}>
          <h4 style={{ marginBottom: 16, color: 'var(--text)' }}>My Students</h4>
          {!tabData && <div style={{ display: 'flex', justifyContent: 'center', padding: 24 }}><div className="spinner" /></div>}
          {tabData && tabData.length === 0 && <p style={{ color: 'var(--text3)', fontSize: '0.88rem' }}>No students assigned yet.</p>}
          {tabData && tabData.map((s, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '12px 0', borderBottom: '1px solid var(--border)', flexWrap: 'wrap', gap: 8 }}>
              <div>
                <div style={{ fontWeight: 700, color: 'var(--text)' }}>{s.enrollment_no ? `[${s.enrollment_no}] ` : ''}{s.name}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text3)', marginTop: 2 }}>Class {s.student_class} · {s.subject} · {s.phone || 'No phone'}</div>
                {s.parent_name && <div style={{ fontSize: '0.75rem', color: 'var(--text3)' }}>Parent: {s.parent_name} · {s.parent_phone}</div>}
              </div>
            </div>
          ))}
        </div>
      );
    }

    // ── Schedule Class ────────────────────────────────────────────────────────
    if (activeTab === 'Schedule Class') return <ScheduleTab students={students} showMsg={showMsg} />;

    // ── Homework ──────────────────────────────────────────────────────────────
    if (activeTab === 'Homework') {
      return (
        <div style={{ display: 'grid', gap: 24 }}>
          <div style={{ ...card, maxWidth: 540 }}>
            <h4 style={{ marginBottom: 20, color: 'var(--text)' }}>Assign Homework</h4>
            <form onSubmit={submitHw}>
              <div className="form-group">
                <label className="form-label">Student *</label>
                <select value={hwForm.student_id} onChange={e => setHwForm({ ...hwForm, student_id: e.target.value })} className="form-input" required>
                  <option value="">Select Student</option>
                  {students.map(s => <option key={`${s.id}-${s.subject}`} value={s.id}>{s.name} · {s.subject}</option>)}
                </select>
              </div>
              <div className="form-group"><label className="form-label">Subject</label><input value={hwForm.subject} onChange={e => setHwForm({ ...hwForm, subject: e.target.value })} className="form-input" placeholder="Subject" /></div>
              <div className="form-group"><label className="form-label">Title *</label><input value={hwForm.title} onChange={e => setHwForm({ ...hwForm, title: e.target.value })} className="form-input" placeholder="e.g. Chapter 3 Practice Problems" required /></div>
              <div className="form-group"><label className="form-label">Description</label><textarea value={hwForm.description} onChange={e => setHwForm({ ...hwForm, description: e.target.value })} className="form-input" rows={3} placeholder="Instructions or details..." /></div>
              <div className="form-group"><label className="form-label">Due Date</label><input type="date" value={hwForm.due_date} onChange={e => setHwForm({ ...hwForm, due_date: e.target.value })} className="form-input" /></div>
              <button type="submit" style={{ background: 'linear-gradient(135deg, var(--sapphire) 0%, var(--sapphire2) 100%)', color: 'white', fontWeight: 700, padding: '11px', borderRadius: 10, border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)', width: '100%' }}>Assign Homework</button>
            </form>
          </div>

          {editHw && (
            <div className="modal-overlay" onClick={() => setEditHw(null)}>
              <div className="modal-box" onClick={e => e.stopPropagation()} style={{ background: 'white' }}>
                <h4 style={{ marginBottom: 20 }}>Edit Homework</h4>
                <form onSubmit={updateHw}>
                  <div className="form-group"><label className="form-label">Title</label><input value={editHw.title} onChange={e => setEditHw({ ...editHw, title: e.target.value })} className="form-input" /></div>
                  <div className="form-group"><label className="form-label">Description</label><textarea value={editHw.description || ''} onChange={e => setEditHw({ ...editHw, description: e.target.value })} className="form-input" rows={3} /></div>
                  <div className="form-group"><label className="form-label">Due Date</label><input type="date" value={editHw.due_date || ''} onChange={e => setEditHw({ ...editHw, due_date: e.target.value })} className="form-input" /></div>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button type="submit" style={{ flex: 1, padding: '10px', background: '#1B3A6B', color: 'white', border: 'none', borderRadius: 10, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>Update</button>
                    <button type="button" onClick={() => setEditHw(null)} style={{ flex: 1, padding: '10px', border: '1px solid var(--border)', borderRadius: 10, background: 'white', cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: 600 }}>Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div style={card}>
            <h4 style={{ marginBottom: 16, color: 'var(--text)' }}>All Homework</h4>
            {!tabData ? <div style={{ display: 'flex', justifyContent: 'center', padding: 24 }}><div className="spinner" /></div> :
              tabData.length === 0 ? <p style={{ color: 'var(--text3)', fontSize: '0.88rem' }}>No homework assigned yet.</p> :
                tabData.map(h => (
                  <div key={h.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '12px 0', borderBottom: '1px solid var(--border)', flexWrap: 'wrap', gap: 8 }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text)' }}>{h.title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text3)', marginTop: 2 }}>{h.student_name} · {h.subject} · Due: {h.due_date || '—'}</div>
                      {h.description && <div style={{ fontSize: '0.78rem', color: 'var(--text2)', marginTop: 4 }}>{h.description}</div>}
                    </div>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      <span className={`badge ${STATUS_COLORS[h.status] || ''}`}>{h.status}</span>
                      <button onClick={() => setEditHw({ ...h })} style={{ padding: '4px 10px', background: 'rgba(59,114,245,0.08)', color: 'var(--sapphire)', border: '1px solid rgba(59,114,245,0.2)', borderRadius: 7, cursor: 'pointer', fontSize: '0.75rem', fontFamily: 'var(--font-body)', fontWeight: 600 }}>Edit</button>
                      {h.status === 'submitted' && <button onClick={() => markHwStatus(h.id, 'graded')} style={{ padding: '4px 10px', background: 'rgba(34,197,94,0.1)', color: '#16a34a', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 7, cursor: 'pointer', fontSize: '0.75rem', fontFamily: 'var(--font-body)', fontWeight: 600 }}>Mark Graded</button>}
                    </div>
                  </div>
                ))}
          </div>
        </div>
      );
    }

    // ── Doubts ────────────────────────────────────────────────────────────────
    if (activeTab === 'Doubts') {
      return (
        <div style={card}>
          <h4 style={{ marginBottom: 16, color: 'var(--text)' }}>Student Doubts</h4>
          {!tabData ? <div style={{ display: 'flex', justifyContent: 'center', padding: 24 }}><div className="spinner" /></div> :
            tabData.length === 0 ? <p style={{ color: 'var(--text3)', fontSize: '0.88rem' }}>No doubts pending.</p> :
              tabData.map(d => (
                <div key={d.id} style={{ padding: '14px 0', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text)' }}>{d.student_name} · {d.subject}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text2)', marginTop: 4 }}>{d.question}</div>
                      {d.answer && <div style={{ fontSize: '0.8rem', color: '#16a34a', marginTop: 6, background: 'rgba(34,197,94,0.07)', padding: '6px 10px', borderRadius: 7 }}>✓ {d.answer}</div>}
                    </div>
                    <span className={`badge ${d.status === 'answered' ? 'badge-emerald' : 'badge-amber'}`}>{d.status}</span>
                  </div>
                  {d.status === 'pending' && (
                    <div style={{ display: 'flex', gap: 8 }}>
                      <input value={doubtAnswer[d.id] || ''} onChange={e => setDoubtAnswer(p => ({ ...p, [d.id]: e.target.value }))} className="form-input" placeholder="Type your answer..." style={{ flex: 1, fontSize: '0.82rem' }} />
                      <button onClick={() => answerDoubt(d.id)} style={{ padding: '7px 14px', background: '#1B3A6B', color: 'white', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '0.82rem', whiteSpace: 'nowrap' }}>Answer</button>
                      <button onClick={() => answerDoubt(d.id, true)} style={{ padding: '7px 14px', background: 'rgba(245,166,35,0.12)', color: '#b45309', border: '1px solid rgba(245,166,35,0.3)', borderRadius: 8, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>Explained in class</button>
                    </div>
                  )}
                </div>
              ))}
        </div>
      );
    }

    // ── Progress ──────────────────────────────────────────────────────────────
    if (activeTab === 'Progress') {
      return (
        <div style={{ ...card, maxWidth: 540 }}>
          <h4 style={{ marginBottom: 20, color: 'var(--text)' }}>Add Progress Report</h4>
          <form onSubmit={submitProg}>
            <div className="form-group">
              <label className="form-label">Student *</label>
              <select value={progForm.student_id} onChange={e => setProgForm({ ...progForm, student_id: e.target.value })} className="form-input" required>
                <option value="">Select Student</option>
                {students.map(s => <option key={`${s.id}-${s.subject}`} value={s.id}>{s.name} · {s.subject}</option>)}
              </select>
            </div>
            <div className="form-group"><label className="form-label">Subject</label><input value={progForm.subject} onChange={e => setProgForm({ ...progForm, subject: e.target.value })} className="form-input" placeholder="Subject" /></div>
            <div className="form-group"><label className="form-label">Score / Grade</label><input value={progForm.score} onChange={e => setProgForm({ ...progForm, score: e.target.value })} className="form-input" placeholder="e.g. 87 or A+" /></div>
            <div className="form-group"><label className="form-label">Remarks</label><textarea value={progForm.remarks} onChange={e => setProgForm({ ...progForm, remarks: e.target.value })} className="form-input" rows={3} placeholder="Observations, improvements, next steps..." /></div>
            <div className="form-group"><label className="form-label">Report Date</label><input type="date" value={progForm.report_date} onChange={e => setProgForm({ ...progForm, report_date: e.target.value })} className="form-input" /></div>
            <button type="submit" style={{ background: 'linear-gradient(135deg, var(--sapphire) 0%, var(--sapphire2) 100%)', color: 'white', fontWeight: 700, padding: '11px', borderRadius: 10, border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)', width: '100%' }}>Save Report</button>
          </form>
        </div>
      );
    }

    // ── ATTENDANCE (Enhanced) ─────────────────────────────────────────────────
    if (activeTab === 'Attendance') {
      const ratingColors = ['', '#dc2626', '#f97316', '#eab308', '#22c55e', '#16a34a'];
      return (
        <div style={{ ...card, maxWidth: 580 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <h4 style={{ color: 'var(--text)', margin: 0 }}>Mark Attendance</h4>
            <span style={{ fontSize: '0.72rem', background: 'rgba(0,153,178,0.1)', color: '#0099B2', borderRadius: 20, padding: '2px 10px', fontWeight: 700 }}>Topic required</span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text3)', marginBottom: 20 }}>All class details are saved for parent transparency and syllabus tracking.</p>

          <form onSubmit={submitAtt}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group" style={{ gridColumn: '1/-1' }}>
                <label className="form-label">Student *</label>
                <select value={attForm.student_id} onChange={e => setAttForm({ ...attForm, student_id: e.target.value })} className="form-input" required>
                  <option value="">Select Student</option>
                  {students.map(s => <option key={`${s.id}-${s.subject}`} value={s.id}>{s.name} · {s.subject}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Class Date *</label>
                <input type="date" value={attForm.class_date} onChange={e => setAttForm({ ...attForm, class_date: e.target.value })} className="form-input" required />
              </div>

              <div className="form-group">
                <label className="form-label">Status *</label>
                <select value={attForm.status} onChange={e => setAttForm({ ...attForm, status: e.target.value })} className="form-input">
                  <option value="present">Present</option>
                  <option value="absent">Absent</option>
                  <option value="late">Late</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Subject</label>
                <input value={attForm.subject} onChange={e => setAttForm({ ...attForm, subject: e.target.value })} className="form-input" placeholder="e.g. Mathematics" />
              </div>

              {/* --- Topic Tracking Section --- */}
              <div className="form-group" style={{ gridColumn: '1/-1' }}>
                <label className="form-label" style={{ color: '#1B3A6B', fontWeight: 700 }}>📖 Topic Taught Today *</label>
                <input value={attForm.topic_taught} onChange={e => setAttForm({ ...attForm, topic_taught: e.target.value })} className="form-input" placeholder="e.g. Linear Equations — Solving single variable" required />
              </div>

              <div className="form-group" style={{ gridColumn: '1/-1' }}>
                <label className="form-label">Sub-topic / Concept covered <span style={{ fontWeight: 400, color: 'var(--text3)' }}>(optional)</span></label>
                <input value={attForm.sub_topic} onChange={e => setAttForm({ ...attForm, sub_topic: e.target.value })} className="form-input" placeholder="e.g. Cross multiplication method" />
              </div>

              <div className="form-group" style={{ gridColumn: '1/-1' }}>
                <label className="form-label">Homework Given <span style={{ fontWeight: 400, color: 'var(--text3)' }}>(optional)</span></label>
                <textarea value={attForm.homework_given} onChange={e => setAttForm({ ...attForm, homework_given: e.target.value })} className="form-input" rows={2} placeholder="Describe the homework assigned, if any..." />
              </div>

              <div className="form-group" style={{ gridColumn: '1/-1' }}>
                <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Class Rating — How well did student understand?</span>
                  <span style={{ color: ratingColors[attForm.class_rating] || 'var(--text3)', fontWeight: 700 }}>
                    {['', 'Poor', 'Needs Work', 'Average', 'Good', 'Excellent'][attForm.class_rating]}
                  </span>
                </label>
                <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
                  {[1, 2, 3, 4, 5].map(n => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setAttForm({ ...attForm, class_rating: n })}
                      style={{
                        width: 44, height: 44, borderRadius: '50%', border: `2px solid ${attForm.class_rating === n ? ratingColors[n] : 'var(--border)'}`,
                        background: attForm.class_rating === n ? ratingColors[n] : 'white',
                        color: attForm.class_rating === n ? 'white' : 'var(--text)',
                        fontWeight: 700, fontSize: '1rem', cursor: 'pointer', fontFamily: 'var(--font-body)',
                        transition: 'all 0.15s',
                      }}
                    >{n}</button>
                  ))}
                </div>
              </div>
            </div>

            <button type="submit" style={{ background: 'linear-gradient(135deg, #1B3A6B 0%, #0099B2 100%)', color: 'white', fontWeight: 700, padding: '12px', borderRadius: 10, border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)', width: '100%', fontSize: '0.95rem', marginTop: 8 }}>
              ✓ Mark Attendance &amp; Save Topic
            </button>
          </form>
        </div>
      );
    }

    // ── Syllabus ──────────────────────────────────────────────────────────────
    if (activeTab === 'Syllabus') return <SyllabusTab students={students} showMsg={showMsg} />;

    // ── Notes ─────────────────────────────────────────────────────────────────
    if (activeTab === 'Notes') {
      return (
        <div style={{ ...card, maxWidth: 540 }}>
          <h4 style={{ marginBottom: 20, color: 'var(--text)' }}>Add Notes</h4>
          <form onSubmit={submitNote}>
            <div className="form-group">
              <label className="form-label">Student (leave blank for public notes)</label>
              <select value={noteForm.student_id} onChange={e => setNoteForm({ ...noteForm, student_id: e.target.value })} className="form-input">
                <option value="">All / Public</option>
                {students.map(s => <option key={`${s.id}-${s.subject}`} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div className="form-group"><label className="form-label">Subject</label><input value={noteForm.subject} onChange={e => setNoteForm({ ...noteForm, subject: e.target.value })} className="form-input" placeholder="Subject" /></div>
            <div className="form-group"><label className="form-label">Title *</label><input value={noteForm.title} onChange={e => setNoteForm({ ...noteForm, title: e.target.value })} className="form-input" placeholder="Note title" required /></div>
            <div className="form-group"><label className="form-label">Content</label><textarea value={noteForm.content} onChange={e => setNoteForm({ ...noteForm, content: e.target.value })} className="form-input" rows={5} placeholder="Write the note content..." /></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <input type="checkbox" id="is_public" checked={noteForm.is_public} onChange={e => setNoteForm({ ...noteForm, is_public: e.target.checked })} />
              <label htmlFor="is_public" style={{ fontSize: '0.85rem', color: 'var(--text2)', cursor: 'pointer' }}>Make visible to all my students</label>
            </div>
            <button type="submit" style={{ background: 'linear-gradient(135deg, var(--sapphire) 0%, var(--sapphire2) 100%)', color: 'white', fontWeight: 700, padding: '11px', borderRadius: 10, border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)', width: '100%' }}>Save Note</button>
          </form>
        </div>
      );
    }

    // ── Feedback ──────────────────────────────────────────────────────────────
    if (activeTab === 'Feedback') {
      return (
        <div style={{ ...card, maxWidth: 540 }}>
          <h4 style={{ marginBottom: 20, color: 'var(--text)' }}>Submit Feedback</h4>
          <form onSubmit={submitFb}>
            <div className="form-group">
              <label className="form-label">Student *</label>
              <select value={fbForm.student_id} onChange={e => setFbForm({ ...fbForm, student_id: e.target.value })} className="form-input" required>
                <option value="">Select Student</option>
                {students.map(s => <option key={`${s.id}-${s.subject}`} value={s.id}>{s.name} · {s.subject}</option>)}
              </select>
            </div>
            <div className="form-group"><label className="form-label">Subject</label><input value={fbForm.subject} onChange={e => setFbForm({ ...fbForm, subject: e.target.value })} className="form-input" placeholder="Subject" /></div>
            <div className="form-group"><label className="form-label">Feedback *</label><textarea value={fbForm.feedback} onChange={e => setFbForm({ ...fbForm, feedback: e.target.value })} className="form-input" rows={4} placeholder="Performance observations, strengths, areas to improve..." required /></div>
            <div className="form-group">
              <label className="form-label">Rating (1–5)</label>
              <input type="number" min={1} max={5} value={fbForm.rating} onChange={e => setFbForm({ ...fbForm, rating: e.target.value })} className="form-input" />
            </div>
            <button type="submit" style={{ background: 'linear-gradient(135deg, var(--sapphire) 0%, var(--sapphire2) 100%)', color: 'white', fontWeight: 700, padding: '11px', borderRadius: 10, border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)', width: '100%' }}>Submit Feedback</button>
          </form>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="dashboard-wrapper" style={{ minHeight: '100vh', background: '#f7f9fc' }}>
      {/* Toast */}
      {msg.text && (
        <div style={{ position: 'fixed', top: 24, right: 24, zIndex: 9999, background: msg.type === 'error' ? '#dc2626' : '#16a34a', color: 'white', padding: '12px 20px', borderRadius: 10, fontWeight: 600, boxShadow: '0 4px 20px rgba(0,0,0,0.2)', fontSize: '0.88rem', maxWidth: 340 }}>
          {msg.text}
        </div>
      )}

      {/* Header */}
      <div style={{ background: '#1B3A6B', color: 'white', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: 'none', border: 'none', color: 'white', fontSize: '1.3rem', cursor: 'pointer', display: 'none' }} className="mobile-menu-btn">☰</button>
          <div style={{ fontWeight: 800, fontSize: '1.15rem', letterSpacing: '-0.5px' }}>
            <span style={{ color: '#F5A623' }}>T</span>eachs
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ fontSize: '0.82rem', opacity: 0.85 }}>👋 {user?.name || 'Teacher'}</div>
          <button onClick={logout} style={{ background: 'rgba(255,255,255,0.12)', color: 'white', border: 'none', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.82rem' }}>Logout</button>
        </div>
      </div>

      <div style={{ display: 'flex', minHeight: 'calc(100vh - 60px)' }}>
        {/* Sidebar */}
        <div style={{ width: 220, background: 'white', borderRight: '1px solid var(--border)', padding: '20px 0', flexShrink: 0 }}>
          {TABS.map(tab => (
            <button key={tab} onClick={() => { setActiveTab(tab); setSidebarOpen(false); }} style={{ display: 'block', width: '100%', padding: '10px 24px', background: activeTab === tab ? 'rgba(27,58,107,0.08)' : 'none', borderLeft: activeTab === tab ? '3px solid #1B3A6B' : '3px solid transparent', color: activeTab === tab ? '#1B3A6B' : 'var(--text2)', fontWeight: activeTab === tab ? 700 : 500, fontFamily: 'var(--font-body)', fontSize: '0.87rem', border: 'none', borderTop: 'none', borderBottom: 'none', borderRight: 'none', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' }}>
              {tab === 'Overview' ? '🏠 ' : tab === 'My Students' ? '👨‍🎓 ' : tab === 'Schedule Class' ? '📅 ' : tab === 'Homework' ? '📝 ' : tab === 'Doubts' ? '❓ ' : tab === 'Progress' ? '📈 ' : tab === 'Attendance' ? '✅ ' : tab === 'Syllabus' ? '📚 ' : tab === 'Notes' ? '📓 ' : tab === 'Feedback' ? '💬 ' : ''}{tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ flex: 1, padding: '28px 32px', overflowY: 'auto', maxWidth: '100%' }}>
          <div style={{ marginBottom: 24 }}>
            <h2 style={{ color: '#1B3A6B', fontFamily: 'var(--font-heading)', margin: 0, fontSize: '1.5rem' }}>{activeTab}</h2>
          </div>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
