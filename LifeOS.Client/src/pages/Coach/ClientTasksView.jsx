import React, { useState, useEffect } from 'react';

const API = `http://${window.location.hostname}:5196/api`;

export function ClientTasksView({ coach }) {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [feedback, setFeedback] = useState('');
  const [sending, setSending] = useState(false);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  // Filters
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

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

  useEffect(() => {
    if (!selectedUser) { setTasks([]); return; }
    setLoadingTasks(true);
    fetch(`${API}/Task/user/${selectedUser.id}`)
      .then(r => r.ok ? r.json() : [])
      .then(setTasks)
      .catch(() => setTasks([]))
      .finally(() => setLoadingTasks(false));
  }, [selectedUser]);

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
          category: 'Tasks',
        }),
      });
      if (res.ok) {
        setFeedbackMsg('Feedback sent!');
        setFeedback('');
        setTimeout(() => setFeedbackMsg(''), 3000);
      }
    } catch { setFeedbackMsg('Failed to send'); }
    finally { setSending(false); }
  };

  // Determine categories dynamically
  const categories = ['All', ...new Set(tasks.map(t => t.category || 'General'))];

  // Helper to check task status
  const getTaskStatus = (t) => {
    if (t.isCompleted) return 'Completed';
    if (t.deadline && new Date(t.deadline) < new Date()) return 'Overdue';
    return 'Pending';
  };

  // Apply filters
  const filteredTasks = tasks.filter(t => {
    const matchesCat = categoryFilter === 'All' || (t.category || 'General') === categoryFilter;
    const matchesStatus = statusFilter === 'All' || getTaskStatus(t) === statusFilter;
    return matchesCat && matchesStatus;
  });

  // Calculate stats for current selection/filters
  const totalCount = filteredTasks.length;
  const completedCount = filteredTasks.filter(t => t.isCompleted).length;
  const overdueCount = filteredTasks.filter(t => !t.isCompleted && t.deadline && new Date(t.deadline) < new Date()).length;
  const pendingCount = totalCount - completedCount;
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Breakdown by category
  const categoryBreakdown = {};
  filteredTasks.forEach(t => {
    const cat = t.category || 'General';
    if (!categoryBreakdown[cat]) {
      categoryBreakdown[cat] = { total: 0, completed: 0 };
    }
    categoryBreakdown[cat].total += 1;
    if (t.isCompleted) {
      categoryBreakdown[cat].completed += 1;
    }
  });

  return (
    <div style={{ padding: 0, overflowY: 'auto', height: 'calc(100vh - 130px)' }}>
      <div className="page-header">
        <div className="page-title">📊 Client Tasks Analytics</div>
      </div>

      {/* User selector */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        {users.length === 0 && <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>No assigned clients found.</span>}
        {users.map(u => (
          <button key={u.id} onClick={() => handleSelectUser(u)}
            className={selectedUser?.id === u.id ? 'btn-primary' : 'btn-secondary'}>
            👤 {u.username}
          </button>
        ))}
      </div>

      {selectedUser && (
        <>
          {/* Controls / Filter Bar */}
          <div className="dashboard-card" style={{ padding: '1.15rem', marginBottom: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', minWidth: '150px' }}>
              <label style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-secondary)' }}>Category Filter</label>
              <select
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
                style={{ padding: '0.45rem', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.82rem', fontWeight: 700, outline: 'none' }}
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', minWidth: '150px' }}>
              <label style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-secondary)' }}>Status Filter</label>
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                style={{ padding: '0.45rem', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.82rem', fontWeight: 700, outline: 'none' }}
              >
                <option value="All">All Statuses</option>
                <option value="Completed">Completed</option>
                <option value="Pending">Pending</option>
                <option value="Overdue">Overdue</option>
              </select>
            </div>
          </div>

          {/* Stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'var(--grid-coach-stats-cols, repeat(4, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
            <div className="dashboard-card" style={{ padding: '1rem', textAlign: 'center', borderTop: '3px solid var(--accent-blue)', marginBottom: 0 }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Total Tasks</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-primary)', marginTop: '0.25rem' }}>{totalCount}</div>
            </div>
            <div className="dashboard-card" style={{ padding: '1rem', textAlign: 'center', borderTop: '3px solid var(--accent-green)', marginBottom: 0 }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Completed</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--accent-green)', marginTop: '0.25rem' }}>{completedCount}</div>
            </div>
            <div className="dashboard-card" style={{ padding: '1rem', textAlign: 'center', borderTop: '3px solid var(--alert-orange)', marginBottom: 0 }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Pending</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--alert-orange)', marginTop: '0.25rem' }}>{pendingCount}</div>
            </div>
            <div className="dashboard-card" style={{ padding: '1rem', textAlign: 'center', borderTop: '3px solid var(--alert-red)', marginBottom: 0 }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Overdue</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--alert-red)', marginTop: '0.25rem' }}>{overdueCount}</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'var(--grid-coach-charts-cols, 1.2fr 1fr)', gap: '1.25rem' }}>
            {/* Category Breakdown list */}
            <div className="dashboard-card" style={{ padding: '1.25rem', marginBottom: 0 }}>
              <h3 style={{ fontSize: '0.92rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text-primary)' }}>
                Category Completion Rates
              </h3>
              {loadingTasks ? (
                <p style={{ color: 'var(--text-secondary)' }}>Loading…</p>
              ) : Object.keys(categoryBreakdown).length === 0 ? (
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>No task categories found matching active filters.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {Object.keys(categoryBreakdown).map(cat => {
                    const stats = categoryBreakdown[cat];
                    const rate = Math.round((stats.completed / stats.total) * 100);
                    return (
                      <div key={cat} style={{ background: '#FAFBF8', padding: '0.8rem 1rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 800, marginBottom: '0.4rem' }}>
                          <span style={{ color: 'var(--text-primary)' }}>{cat}</span>
                          <span style={{ color: 'var(--accent-green)' }}>{rate}% ({stats.completed}/{stats.total})</span>
                        </div>
                        {/* Custom progress bar */}
                        <div style={{ height: '6px', background: 'var(--border-color)', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ width: `${rate}%`, height: '100%', background: 'var(--accent-green)', borderRadius: '3px' }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Performance Overview */}
            <div className="dashboard-card" style={{ padding: '1.25rem', marginBottom: 0, display: 'flex', flexDirection: 'column', justify: 'center', alignItems: 'center' }}>
              <h3 style={{ fontSize: '0.92rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text-primary)', alignSelf: 'flex-start' }}>
                Overall Completion Performance
              </h3>
              <div style={{ width: '120px', height: '120px', borderRadius: '50%', border: '8px solid var(--border-color)', borderTopColor: 'var(--accent-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', margin: '1rem 0' }}>
                <span style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--text-primary)' }}>{completionRate}%</span>
                <span style={{ fontSize: '0.62rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>Completed</span>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textAlign: 'center', fontWeight: 600, padding: '0 0.5rem' }}>
                Reflected tasks count for {selectedUser.username}'s active items. Use filters to analyze category specific performance.
              </p>
            </div>
          </div>

          {/* Feedback Card */}
          <div className="dashboard-card" style={{ padding: '1.25rem', marginTop: '1rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem' }}>
              💬 Send Task Advice to {selectedUser.username}
            </h3>
            <textarea value={feedback} onChange={e => setFeedback(e.target.value)}
              placeholder="Write advice based on task completion analytics..." rows={3} className="form-textarea" />
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem', alignItems: 'center' }}>
              <button className="btn-primary" onClick={handleSendFeedback} disabled={sending || !feedback.trim()}>
                {sending ? 'Sending…' : 'Send Feedback'}
              </button>
              {feedbackMsg && <span style={{ color: 'var(--accent-green)', fontSize: '0.85rem', fontWeight: 600 }}>{feedbackMsg}</span>}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
