import React from 'react';

export function HabitCoachFeedback({ feedbacks, fbIdx, setFbIdx }) {
  return (
    <div className="dashboard-card" style={{ padding: '1.25rem 1.5rem', marginBottom: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>💬 Coach Feedback</h3>
        {feedbacks.length > 1 && (
          <button 
            onClick={() => setFbIdx(prev => (prev + 1) % feedbacks.length)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--accent-green)',
              fontSize: '0.75rem',
              fontWeight: 800,
              cursor: 'pointer',
              padding: '4px 10px',
              borderRadius: '8px',
              backgroundColor: 'rgba(30,61,47,0.05)',
              transition: 'all 0.2s'
            }}
            onMouseOver={e => e.currentTarget.style.backgroundColor = 'rgba(30,61,47,0.1)'}
            onMouseOut={e => e.currentTarget.style.backgroundColor = 'rgba(30,61,47,0.05)'}
          >
            Next Advice →
          </button>
        )}
      </div>
      {feedbacks.length === 0 ? (
        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', padding: '0.5rem 0' }}>No feedback received.</div>
      ) : (
        <div className="feedback-item" style={{ margin: 0, padding: '0.85rem', borderRadius: '12px', borderLeft: '4px solid var(--accent-green)', background: 'rgba(43, 83, 58, 0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
            <span className="feedback-item-coach" style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--accent-green)' }}>
              Coach {feedbacks[fbIdx]?.coachName}
            </span>
            <span style={{ fontSize: '0.68rem', color: '#9ca3af' }}>
              {feedbacks[fbIdx]?.createdAt && new Date(feedbacks[fbIdx].createdAt).toLocaleDateString()}
            </span>
          </div>
          <div className="feedback-item-text" style={{ fontSize: '0.82rem', color: 'var(--text-primary)', lineHeight: '1.45' }}>
            {feedbacks[fbIdx]?.feedbackText}
          </div>
        </div>
      )}
    </div>
  );
}
