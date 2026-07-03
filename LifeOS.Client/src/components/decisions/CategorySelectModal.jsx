import React, { useState } from 'react';

const CATEGORIES = ['Career', 'Personal', 'Relationship', 'Health', 'Finance', 'Lifestyle', 'Study'];
const API = `http://${window.location.hostname}:5196/api`;

export function CategorySelectModal({ userId, onSaved, onClose }) {
  const [category, setCategory] = useState('Career');
  const [title, setTitle] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch(`${API}/Decision`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          title: '', // Empty decision initially, user writes it directly on the map
          category,
          description: title.trim() || 'Untitled Situation', // Saved directly to Problem / Situation
          expectedOutcome: '',
          actualOutcome: '',
          lessonsLearned: '',
          isEvaluated: false,
          pros: '',
          cons: '',
        }),
      });
      if (res.ok) {
        const saved = await res.json();
        onSaved(saved);
      }
    } catch {
      alert('Failed to create decision map.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 9998, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', borderRadius: '22px', padding: '2.25rem', maxWidth: '440px', width: '90%', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
        <h3 style={{ fontWeight: 900, fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>Create Decision Map</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          <div>
            <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Problem Statement</label>
            <input
              className="form-input"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g., Balancing career demands with personal health"
              style={{ marginTop: '0.35rem' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Category</label>
            <select
              className="form-input"
              value={category}
              onChange={e => setCategory(e.target.value)}
              style={{ marginTop: '0.35rem', padding: '0.65rem 0.75rem', borderRadius: '12px' }}
            >
              {CATEGORIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button
              type="submit"
              disabled={submitting}
              style={{
                flex: 1,
                padding: '0.75rem',
                borderRadius: '12px',
                border: 'none',
                background: 'var(--accent-green)',
                color: '#fff',
                fontFamily: 'var(--font-main)',
                fontWeight: 700,
                fontSize: '0.88rem',
                cursor: submitting ? 'not-allowed' : 'pointer'
              }}
            >
              {submitting ? 'Creating...' : 'Create Empty Map'}
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: '0.75rem',
                borderRadius: '12px',
                border: '1.5px solid var(--border-color)',
                background: '#fff',
                fontFamily: 'var(--font-main)',
                fontWeight: 700,
                fontSize: '0.88rem',
                cursor: 'pointer',
                color: 'var(--text-secondary)'
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
