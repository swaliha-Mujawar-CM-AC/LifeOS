import React, { useState, useEffect } from 'react';

const API = `http://${window.location.hostname}:5196/api`;

const CAT_THEMES = {
  Health:       { icon: '🌱', dot: '#27ae60' },
  Personal:     { icon: '💡', dot: '#F5A623' },
  Relationship: { icon: '👥', dot: '#00B4D8' },
  Lifestyle:    { icon: '📘', dot: '#9B5DE5' },
  Finance:      { icon: '💰', dot: '#e67e22' },
  Career:       { icon: '📈', dot: '#2980b9' },
  Study:        { icon: '📚', dot: '#8e44ad' },
  Default:      { icon: '💡', dot: '#F5A623' },
};

const getTheme = (cat = 'Career') => CAT_THEMES[cat] || CAT_THEMES.Default;

// ─── Static Diagram Node (Read-Only) ──────────────────────────────────────────
function StaticNode({ label, icon, iconBg, iconColor, value, placeholder, wide }) {
  return (
    <div
      style={{
        background: '#FFFFFF',
        border: '1.5px solid var(--border-color)',
        borderRadius: '16px',
        padding: '0.75rem 0.85rem',
        width: wide ? '175px' : '160px',
        minHeight: '110px',
        flexShrink: 0,
        boxShadow: 'var(--box-shadow-soft)',
        transition: 'all 0.2s',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
        {icon && (
          <span style={{
            background: iconBg || 'var(--accent-green-light)',
            color: iconColor || 'var(--accent-green)',
            borderRadius: '50%', width: 24, height: 24,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.8rem',
          }}>{icon}</span>
        )}
        <span style={{ fontSize: '0.8rem', fontWeight: 800, color: iconColor || 'var(--accent-green)' }}>{label}</span>
      </div>
      <p style={{ fontSize: '0.75rem', color: value ? 'var(--text-primary)' : '#bbb', lineHeight: '1.5', fontWeight: value ? 600 : 400 }}>
        {value || placeholder}
      </p>
    </div>
  );
}


export function ClientDecisionsView({ coach }) {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [decisions, setDecisions] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loadingDecisions, setLoadingDecisions] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [sending, setSending] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [sharedTitles, setSharedTitles] = useState([]);

  // Fetch assigned clients
  useEffect(() => {
    fetch(`${API}/Auth/assigned-users/${coach.id}`)
      .then(r => r.ok ? r.json() : [])
      .then(data => {
        setUsers(data);
        if (data.length > 0) {
          const lastId = localStorage.getItem('lifeos_coach_selected_client');
          setSelectedUser(data.find(u => u.id.toString() === lastId) || data[0]);
        }
      })
      .catch(() => setUsers([]));
  }, [coach.id]);

  const handleSelectUser = (u) => {
    setSelectedUser(u);
    localStorage.setItem('lifeos_coach_selected_client', u.id.toString());
  };

  // Load notifications to see what decisions were requested
  useEffect(() => {
    if (!selectedUser) {
      setSharedTitles([]);
      return;
    }
    fetch(`${API}/Notification/user/${coach.id}`)
      .then(r => r.ok ? r.json() : [])
      .then(notifs => {
        // Find titles in notifications like: "User [username] asked for help regarding "[title]""
        const prefixes = [`User ${selectedUser.username} asked for help regarding "`, `User Client asked for help regarding "`];
        const titles = notifs
          .filter(n => n.type === 'CoachFeedback' && n.title === 'Decision Help Request')
          .map(n => {
            const prefix = prefixes.find(p => n.message.startsWith(p));
            if (prefix) {
              const start = prefix.length;
              const end = n.message.lastIndexOf('"');
              return end > start ? n.message.substring(start, end) : null;
            }
            return null;
          })
          .filter(Boolean);
        setSharedTitles(titles);
      })
      .catch(() => setSharedTitles([]));
  }, [coach.id, selectedUser]);

  // Fetch client decisions when selection changes
  useEffect(() => {
    if (!selectedUser) {
      setDecisions([]);
      setSelectedId(null);
      return;
    }
    setLoadingDecisions(true);
    fetch(`${API}/Decision/user/${selectedUser.id}`)
      .then(r => r.ok ? r.json() : [])
      .then(data => {
        setDecisions(data);
      })
      .catch(() => setDecisions([]))
      .finally(() => setLoadingDecisions(false));
  }, [selectedUser]);

  const visibleDecisions = decisions.filter(d => sharedTitles.includes(d.title));
  const selectedDecision = visibleDecisions.find(d => d.id === selectedId) || visibleDecisions[0];

  useEffect(() => {
    if (selectedDecision && selectedId !== selectedDecision.id) {
      setSelectedId(selectedDecision.id);
    }
  }, [selectedDecision, selectedId]);

  const handleSendFeedback = async () => {
    if (!feedback.trim() || !selectedUser) return;
    setSending(true);
    try {
      const res = await fetch(`${API}/Feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: selectedUser.id,
          coachId: coach.id,
          feedbackText: feedback,
          category: `Decision-${selectedDecision.id}`,
        }),
      });
      if (res.ok) {
        setFeedbackMsg('Feedback sent successfully!');
        setFeedback('');
        setTimeout(() => setFeedbackMsg(''), 3000);
      }
    } catch {
      setFeedbackMsg('Failed to send feedback.');
    } finally {
      setSending(false);
    }
  };

  const timeAgo = (dateStr) => {
    if (!dateStr) return '';
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  };

  return (
    <div style={{ padding: 0, overflowY: 'auto', height: 'calc(100vh - 130px)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div className="page-header">
        <div className="page-title">🧠 Client Decisions</div>
      </div>

      {/* User selector */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {users.length === 0 && <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>No assigned clients found.</span>}
        {users.map(u => (
          <button key={u.id} onClick={() => handleSelectUser(u)}
            className={selectedUser?.id === u.id ? 'btn-primary' : 'btn-secondary'}>
            👤 {u.username}
          </button>
        ))}
      </div>

      {selectedUser && (
        <div style={{ display: 'grid', gridTemplateColumns: 'var(--grid-coach-decisions-cols, 280px 1fr)', gap: '1.25rem', flex: 1, minHeight: 0 }}>
          
          {/* Decisions List */}
          <div style={{ background: '#FFFFFF', border: '1px solid var(--border-color)', borderRadius: '22px', padding: '1.25rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 900, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>Decisions</h3>
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {loadingDecisions ? (
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Loading decisions…</p>
              ) : visibleDecisions.length === 0 ? (
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>No help requests for decisions yet.</p>
              ) : (
                visibleDecisions.map(d => {
                  const theme = getTheme(d.category);
                  const isSelected = d.id === selectedId;
                  return (
                    <div
                      key={d.id}
                      onClick={() => setSelectedId(d.id)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '0.7rem',
                        padding: '0.75rem 0.9rem', borderRadius: '14px', cursor: 'pointer',
                        background: isSelected ? 'var(--accent-green-light)' : '#FAFBF8',
                        border: `1.5px solid ${isSelected ? 'var(--accent-green)' : '#ECEEE8'}`,
                        transition: 'all 0.2s',
                      }}
                    >
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: theme.dot, flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 800, fontSize: '0.82rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.title}</div>
                        <div style={{ fontSize: '0.66rem', color: 'var(--text-secondary)', fontWeight: 700, marginTop: '0.1rem' }}>
                          {d.category} • {timeAgo(d.createdAt)}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Decision Map & Feedback */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', overflowY: 'auto' }}>
            
            {/* Diagram Map */}
            <div style={{ background: '#FFFFFF', border: '1px solid var(--border-color)', borderRadius: '22px', padding: '1.5rem 1.75rem' }}>
              <h3 style={{ fontWeight: 900, fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Decision Map</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Review the details of your client's decision process.</p>

              {selectedDecision ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginTop: '1.25rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                  
                  {/* Problem node */}
                  <StaticNode
                    label="Problem / Situation"
                    icon="?"
                    iconBg="var(--accent-green-light)"
                    iconColor="var(--accent-green)"
                    value={selectedDecision.description}
                    placeholder="No description provided."
                  />

                  {/* Arrow */}
                  <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0, margin: '0 0.35rem' }}>
                    <div style={{ width: 18, height: 2, background: 'var(--accent-green)' }} />
                    <div style={{ width: 0, height: 0, borderTop: '4px solid transparent', borderBottom: '4px solid transparent', borderLeft: '6px solid var(--accent-green)' }} />
                  </div>

                  {/* Decision node */}
                  <StaticNode
                    label="Decision"
                    icon="💡"
                    iconBg="#FDF2E2"
                    iconColor="#F5A623"
                    value={selectedDecision.title}
                    placeholder="No decision specified."
                  />

                  {/* Branching SVG */}
                  <div style={{ position: 'relative', width: 35, height: 160, flexShrink: 0 }}>
                    <svg width="35" height="160" viewBox="0 0 35 160" fill="none">
                      <path d="M 0 80 H 10 C 18 80, 18 28, 25 28 H 32" stroke="#F5A623" strokeWidth="2" fill="none" />
                      <path d="M 0 80 H 10 C 18 80, 18 132, 25 132 H 32" stroke="#F5A623" strokeWidth="2" fill="none" />
                      <polygon points="32,24 28,20 28,28" fill="#F5A623" />
                      <polygon points="32,128 28,124 28,132" fill="#F5A623" />
                    </svg>
                  </div>

                  {/* Expected + Actual outcomes */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', flexShrink: 0 }}>
                    <StaticNode
                      label="Expected Outcome"
                      icon="🎯"
                      iconBg="var(--accent-blue-light)"
                      iconColor="var(--accent-blue)"
                      value={selectedDecision.expectedOutcome}
                      placeholder="No expected outcomes defined."
                    />
                    <StaticNode
                      label="Actual Outcome"
                      icon="📈"
                      iconBg="var(--accent-purple-light)"
                      iconColor="var(--accent-purple)"
                      value={selectedDecision.actualOutcome}
                      placeholder="Pending resolution."
                    />
                  </div>

                  {/* Arrow to learning */}
                  <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0, margin: '0 0.35rem' }}>
                    <div style={{ width: 18, height: 2, borderTop: '2px dashed var(--accent-green)' }} />
                    <div style={{ width: 0, height: 0, borderTop: '4px solid transparent', borderBottom: '4px solid transparent', borderLeft: '6px solid var(--accent-green)' }} />
                  </div>

                  {/* Learning Node */}
                  <div style={{
                    background: '#FFFFFF', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '0.75rem 0.85rem',
                    width: '160px', flexShrink: 0, boxShadow: 'var(--box-shadow-soft)',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                      <span style={{ background: 'var(--accent-green-light)', color: 'var(--accent-green)', borderRadius: '50%', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>🌱</span>
                      <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--accent-green)' }}>Learning / Key Takeaway</span>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: selectedDecision.lessonsLearned ? 'var(--text-primary)' : '#bbb', lineHeight: '1.5', fontWeight: selectedDecision.lessonsLearned ? 600 : 400, marginBottom: '0.5rem' }}>
                      {selectedDecision.lessonsLearned || 'No learning recorded yet.'}
                    </p>
                  </div>

                </div>
              ) : (
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '1rem' }}>Please select a decision from the left list.</p>
              )}
            </div>

            {/* Send Feedback Card */}
            <div style={{ background: '#FFFFFF', border: '1px solid var(--border-color)', borderRadius: '22px', padding: '1.5rem 1.75rem' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
                💬 Send Feedback to {selectedUser.username}
              </h3>
              <textarea
                value={feedback}
                onChange={e => setFeedback(e.target.value)}
                placeholder="Write decision-related advice or feedback for your client..."
                rows={4}
                className="form-textarea"
              />
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem', alignItems: 'center' }}>
                <button
                  className="btn-primary"
                  onClick={handleSendFeedback}
                  disabled={sending || !feedback.trim()}
                  style={{ background: 'var(--accent-green)', color: '#fff', border: 'none', borderRadius: '12px', padding: '0.6rem 1.2rem', fontWeight: 700, cursor: sending ? 'not-allowed' : 'pointer' }}
                >
                  {sending ? 'Sending…' : 'Send Feedback'}
                </button>
                {feedbackMsg && <span style={{ color: 'var(--accent-green)', fontSize: '0.85rem', fontWeight: 600 }}>{feedbackMsg}</span>}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
