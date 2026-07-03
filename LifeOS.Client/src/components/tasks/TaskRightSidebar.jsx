import React from 'react';

export function TaskRightSidebar({
  selectedDate,
  setSelectedDate,
  now,
  days,
  hasTaskOnDay,
  pendingTasks,
  highCount,
  mediumCount,
  lowCount,
  sHigh,
  sMed,
  sLow,
  r,
  feedbacks,
  fbIdx,
  setFbIdx
}) {
  return (
    <aside className="tasks-right-sidebar">
      
      {/* Calendar Widget */}
      <div className="widget-card calendar-widget" style={{ position: 'relative' }}>
        {selectedDate && (
          <button 
            onClick={() => setSelectedDate(null)}
            title="Reset calendar filter"
            style={{
              position: 'absolute',
              bottom: '12px',
              right: '12px',
              background: 'none',
              border: 'none',
              color: 'var(--accent-green)',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '50%',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(30, 61, 47, 0.06)',
              width: '24px',
              height: '24px',
              transition: 'all 0.2s',
              zIndex: 10
            }}
            onMouseOver={e => e.currentTarget.style.backgroundColor = 'rgba(30, 61, 47, 0.12)'}
            onMouseOut={e => e.currentTarget.style.backgroundColor = 'rgba(30, 61, 47, 0.06)'}
          >
            <svg viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" strokeWidth="2.8" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
              <polyline points="3 3 3 8 8 8"/>
            </svg>
          </button>
        )}
        
        <div className="calendar-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button>&lt;</button>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            {now.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </span>
          <button>&gt;</button>
        </div>
        <div className="calendar-grid">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => <div key={d} className="cal-day-header">{d}</div>)}
          {days.map((day, i) => (
            <div 
              key={i} 
              className={`cal-cell ${day === now.getDate() ? 'today' : ''}`}
              onClick={() => day && setSelectedDate(selectedDate === day ? null : day)}
              style={{ cursor: day ? 'pointer' : 'default', background: selectedDate === day ? 'var(--accent-green-light)' : 'transparent', borderRadius: selectedDate === day ? '12px' : '0' }}
            >
              {day && <span>{day}</span>}
              {hasTaskOnDay(day) && <div className="cal-dot"></div>}
            </div>
          ))}
        </div>
      </div>

      {/* Task Overview (Doughnut Chart) */}
      <div className="widget-card overview-widget">
        <h4 className="widget-title">Task Overview</h4>
        <div className="overview-content">
          <div className="chart-container">
            <svg width="100%" height="100%" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r={r} fill="none" stroke="#f1f3ee" strokeWidth="8" />
              {pendingTasks.length > 0 && (
                <>
                  <circle cx="50" cy="50" r={r} fill="none" strokeWidth="8" strokeDasharray={sLow.strokeDasharray} strokeDashoffset={sLow.strokeDashoffset} stroke={sLow.stroke} transform="rotate(-90 50 50)" />
                  <circle cx="50" cy="50" r={r} fill="none" strokeWidth="8" strokeDasharray={sMed.strokeDasharray} strokeDashoffset={sMed.strokeDashoffset} stroke={sMed.stroke} transform="rotate(-90 50 50)" />
                  <circle cx="50" cy="50" r={r} fill="none" strokeWidth="8" strokeDasharray={sHigh.strokeDasharray} strokeDashoffset={sHigh.strokeDashoffset} stroke={sHigh.stroke} transform="rotate(-90 50 50)" />
                </>
              )}
            </svg>
            <div className="chart-center-text">
              <span className="chart-number">{pendingTasks.length}</span>
              <span className="chart-label">Total</span>
            </div>
          </div>
          <div className="overview-legend">
            <div className="legend-item"><span className="dot" style={{ backgroundColor: '#ff4b6b' }}></span> <span>{highCount} High</span></div>
            <div className="legend-item"><span className="dot" style={{ backgroundColor: '#7052ff' }}></span> <span>{mediumCount} Medium</span></div>
            <div className="legend-item"><span className="dot" style={{ backgroundColor: '#00c0a9' }}></span> <span>{lowCount} Low</span></div>
          </div>
        </div>
      </div>
      
      {/* Coach Feedback Widget */}
      <div className="widget-card coach-widget" style={{ position: 'relative', overflow: 'hidden' }}>
        <h4 className="widget-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: 0, paddingBottom: '0.65rem', borderBottom: '1px solid #f1f3ee' }}>
          <span style={{ fontSize: '0.92rem', fontWeight: 800 }}>💬 Coach Feedback</span>
          {feedbacks.length > 1 && (
            <button
              onClick={() => setFbIdx(prev => (prev + 1) % feedbacks.length)}
              style={{
                background: 'none', border: 'none', color: 'var(--accent-green)',
                fontSize: '0.72rem', fontWeight: 800, cursor: 'pointer',
                padding: '3px 8px', borderRadius: '6px',
                backgroundColor: 'rgba(30,61,47,0.05)', transition: 'background 0.2s'
              }}
              onMouseOver={e => e.currentTarget.style.backgroundColor = 'rgba(30,61,47,0.1)'}
              onMouseOut={e => e.currentTarget.style.backgroundColor = 'rgba(30,61,47,0.05)'}
            >
              Next →
            </button>
          )}
        </h4>
        {feedbacks.length === 0 ? (
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, padding: '0.75rem 0' }}>No feedback received.</p>
        ) : (
          <div style={{ marginTop: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--accent-green)' }}>
                Coach {feedbacks[fbIdx]?.coachName}
              </span>
              <span style={{ fontSize: '0.7rem', color: '#9ca3af' }}>
                {feedbacks[fbIdx]?.createdAt && new Date(feedbacks[fbIdx].createdAt).toLocaleDateString('en-GB')}
              </span>
            </div>
            <div style={{
              background: '#FAFBF8',
              borderLeft: '3px solid var(--accent-green)',
              padding: '0.75rem 1rem',
              borderRadius: '0 10px 10px 0',
              marginTop: '0.25rem'
            }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: '1.55', margin: 0, fontWeight: 500 }}>
                {feedbacks[fbIdx]?.feedbackText}
              </p>
            </div>
          </div>
        )}
      </div>

    </aside>
  );
}
