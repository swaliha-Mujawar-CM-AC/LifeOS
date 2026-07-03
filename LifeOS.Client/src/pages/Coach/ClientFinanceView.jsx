import React, { useState, useEffect } from 'react';

const API = `http://${window.location.hostname}:5196/api`;

export function ClientFinanceView({ coach }) {
  const now = new Date();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [budget, setBudget] = useState(0);
  const [expenses, setExpenses] = useState([]);
  const [feedback, setFeedback] = useState('');
  const [sending, setSending] = useState(false);
  const [loadingExpenses, setLoadingExpenses] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  // Filters
  const [categoryFilter, setCategoryFilter] = useState('All');

  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

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
    if (!selectedUser) { 
      setExpenses([]); 
      setBudget(0);
      return; 
    }
    setLoadingExpenses(true);
    Promise.all([
      fetch(`${API}/Expense/budget/${selectedUser.id}/${year}/${month}`),
      fetch(`${API}/Expense/user/${selectedUser.id}/${year}/${month}`)
    ])
      .then(async ([budRes, expRes]) => {
        if (budRes.ok) {
          const bData = await budRes.json();
          setBudget(bData.amount || 0);
        }
        if (expRes.ok) {
          const exps = await expRes.json();
          setExpenses(exps);
        }
      })
      .catch(() => {
        setExpenses([]);
        setBudget(0);
      })
      .finally(() => setLoadingExpenses(false));
  }, [selectedUser, month, year]);

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
          category: 'Finance',
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

  // Determine unique categories
  const categories = ['All', ...new Set(expenses.map(e => e.category || 'General'))];

  // Apply filters
  const filteredExpenses = expenses.filter(e => {
    const matchesCat = categoryFilter === 'All' || (e.category || 'General') === categoryFilter;
    return matchesCat;
  });

  // Calculate totals
  const totalExpense = filteredExpenses.reduce((s, e) => s + e.amount, 0);
  const netSavings = budget - totalExpense;

  // Breakdown of expenses by category
  const expenseCategoriesBreakdown = {};
  filteredExpenses.forEach(e => {
    const cat = e.category || 'General';
    expenseCategoriesBreakdown[cat] = (expenseCategoriesBreakdown[cat] || 0) + e.amount;
  });

  const CAT_COLORS = { Food: '#f59e0b', Entertainment: '#8b5cf6', Bills: '#3b82f6', Health: '#22c55e', Travel: '#ef4444', Miscellaneous: '#6b7280' };

  return (
    <div style={{ padding: 0, overflowY: 'auto', height: 'calc(100vh - 130px)' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="page-title">📊 Client Finance Analytics</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginRight: '2.5rem' }}>
          <select value={month} onChange={e => setMonth(parseInt(e.target.value))} className="form-input" style={{ padding: '0.4rem 0.6rem', width: 'auto', fontSize: '0.82rem' }}>
            {monthNames.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
          </select>
          <select value={year} onChange={e => setYear(parseInt(e.target.value))} className="form-input" style={{ padding: '0.4rem 0.6rem', width: 'auto', fontSize: '0.82rem' }}>
            {[2024, 2025, 2026, 2027].map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
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
          {/* Filters Card */}
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
          </div>

          {/* Financial Totals */}
          <div style={{ display: 'grid', gridTemplateColumns: 'var(--grid-coach-stats-cols-3, repeat(3, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
            <div className="dashboard-card" style={{ padding: '1rem', textAlign: 'center', borderTop: '3px solid var(--accent-green)', marginBottom: 0 }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Monthly Budget</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.2rem' }}>₹{budget.toLocaleString('en-IN')}</div>
            </div>
            <div className="dashboard-card" style={{ padding: '1rem', textAlign: 'center', borderTop: '3px solid var(--alert-red)', marginBottom: 0 }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Total Spent</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--alert-red)', marginTop: '0.2rem' }}>₹{totalExpense.toLocaleString('en-IN')}</div>
            </div>
            <div className="dashboard-card" style={{ padding: '1rem', textAlign: 'center', borderTop: `3px solid ${netSavings >= 0 ? 'var(--accent-green)' : 'var(--alert-red)'}`, marginBottom: 0 }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Money Saved</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: netSavings >= 0 ? 'var(--accent-green)' : 'var(--alert-red)', marginTop: '0.2rem' }}>₹{Math.abs(netSavings).toLocaleString('en-IN')}</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'var(--grid-coach-charts-cols, 1.2fr 1fr)', gap: '1.25rem' }}>
            
            {/* Category Expenses Breakdown */}
            <div className="dashboard-card" style={{ padding: '1.25rem', marginBottom: 0 }}>
              <h3 style={{ fontSize: '0.92rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text-primary)' }}>
                Expenses Breakdown by Category
              </h3>
              {loadingExpenses ? (
                <p style={{ color: 'var(--text-secondary)' }}>Loading…</p>
              ) : Object.keys(expenseCategoriesBreakdown).length === 0 ? (
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>No expense transactions found matching filters.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {Object.keys(expenseCategoriesBreakdown).map(cat => {
                    const amt = expenseCategoriesBreakdown[cat];
                    const percentage = totalExpense > 0 ? Math.round((amt / totalExpense) * 100) : 0;
                    const color = CAT_COLORS[cat] || '#9ca3af';
                    return (
                      <div key={cat} style={{ background: '#FAFBF8', padding: '0.8rem 1rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 800, marginBottom: '0.4rem' }}>
                          <span style={{ color: 'var(--text-primary)' }}>{cat}</span>
                          <span style={{ color }}>{percentage}% (₹{amt.toLocaleString('en-IN')})</span>
                        </div>
                        <div style={{ height: '6px', background: 'var(--border-color)', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ width: `${percentage}%`, height: '100%', background: color, borderRadius: '3px' }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* List of anonymous transactions (ONLY category and amount, NO details) */}
            <div className="dashboard-card" style={{ padding: '1.25rem', marginBottom: 0, display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ fontSize: '0.92rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text-primary)' }}>
                Aggregated Transactions Stream
              </h3>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', fontWeight: 600 }}>Showing transaction metrics excluding description tags.</p>
              <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '280px' }}>
                {loadingExpenses ? (
                  <p style={{ color: 'var(--text-secondary)' }}>Loading…</p>
                ) : filteredExpenses.length === 0 ? (
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>No transaction history found.</p>
                ) : (
                  filteredExpenses.slice(0, 15).map(e => (
                    <div key={e.id} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '0.55rem 0.85rem', borderRadius: '8px', background: '#f9fafb',
                      borderLeft: `3px solid ${CAT_COLORS[e.category] || '#9ca3af'}`,
                    }}>
                      <div style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--text-primary)' }}>
                        {e.category} <span style={{ fontWeight: 500, color: 'var(--text-secondary)', fontSize: '0.7rem', marginLeft: '0.25rem' }}>({new Date(e.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })})</span>
                      </div>
                      <span style={{ fontWeight: 800, fontSize: '0.82rem', color: 'var(--alert-red)' }}>
                        -₹{e.amount.toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

          {/* Feedback Area */}
          <div className="dashboard-card" style={{ padding: '1.25rem', marginTop: '1rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem' }}>
              💬 Send Finance Advice to {selectedUser.username}
            </h3>
            <textarea value={feedback} onChange={e => setFeedback(e.target.value)}
              placeholder="Write advice based on budget utilization and category analysis..." rows={3} className="form-textarea" />
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
