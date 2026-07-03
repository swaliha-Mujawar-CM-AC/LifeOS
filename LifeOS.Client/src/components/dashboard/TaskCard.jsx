import React, { useState, useEffect } from 'react';
import { SVGIcons } from '../SVGIcons';
import { TaskTimer } from '../TaskTimer';

const API_BASE = `http://${window.location.hostname}:5196/api`;

// Color pairs that alternate per column (every 2 tasks = 1 column) matching the earthy/forest theme
const COL_COLORS = [
  { bg: 'rgba(232, 245, 233, 0.85)', border: 'rgba(200, 230, 201, 0.85)', text: '#2b533a' },
  { bg: 'rgba(241, 247, 240, 0.85)', border: 'rgba(220, 236, 214, 0.85)', text: '#3a5a40' },
  { bg: 'rgba(254, 246, 231, 0.85)', border: 'rgba(251, 226, 181, 0.85)', text: '#b45309' },
  { bg: 'rgba(253, 240, 237, 0.85)', border: 'rgba(249, 213, 204, 0.85)', text: '#c2410c' },
];
const OVERDUE_COLOR = { bg: 'rgba(254, 236, 238, 0.85)', border: 'rgba(248, 187, 208, 0.85)', text: '#d92d20' };

export function TaskCard({ upcomingTasks = [], onUpdate, onNavigate }) {
  // Local copy so we can optimistically mark done without disappearing
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    // Always reset from props. Show ALL tasks passed in (not-yet-complete ones come from API).
    // We keep them in local state with an optional local `done` flag so the tick
    // animates before the next API refresh removes the item.
    setTasks(upcomingTasks.slice(0, 8).map(t => ({ ...t, localDone: false })));
  }, [upcomingTasks]);

  const handleToggle = (id) => {
    // Optimistically mark done locally (shows tick, keeps item visible)
    setTasks(prev => prev.map(t => t.id === id ? { ...t, localDone: !t.localDone } : t));

    // Fire API — onUpdate() will re-fetch and update props naturally
    fetch(`${API_BASE}/Task/${id}/toggle-complete`, { method: 'PATCH' })
      .then(() => onUpdate())
      .catch(err => {
        console.error(err);
        // Revert on error
        setTasks(prev => prev.map(t => t.id === id ? { ...t, localDone: !t.localDone } : t));
      });
  };

  // Visible tasks: show all (completed ones will drop after next API refresh)
  const visibleTasks = tasks;

  return (
    <div
      className="dashboard-card"
      style={{
        padding: '0.75rem 1rem',
        marginBottom: 0,
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(rgba(250, 248, 244, 0.62), rgba(250, 248, 244, 0.62)), url(/card-bg.png) no-repeat left center',
        backgroundSize: '120%',
      }}
    >
      {/* Header */}
      <div className="card-header" style={{ marginBottom: '0.5rem', position: 'relative', zIndex: 2 }}>
        <div className="card-title" style={{ fontSize: '0.95rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ background: '#dcecd6', padding: '0.25rem', borderRadius: '6px', color: '#407c52', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <SVGIcons.Calendar />
          </span>
          <span style={{ color: '#132a1e' }}>Deadlines</span>
        </div>
      </div>

      {/* Task Grid: 2 rows, auto-expanding columns */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        {visibleTasks.length > 0 ? (
          <div
            style={{
              display: 'grid',
              gridTemplateRows: 'repeat(2, auto)',
              gridAutoFlow: 'column',
              gridAutoColumns: '285px',
              gap: '0.9rem 2.5rem',
              overflowX: 'auto',
              paddingBottom: '0.25rem',
            }}
          >
            {visibleTasks.map((t, index) => {
              const isOverdue = new Date(t.deadline) < new Date();
              // Color by column: every 2 tasks share the same column color
              const colIndex = Math.floor(index / 2);
              const colorTheme = isOverdue ? OVERDUE_COLOR : COL_COLORS[colIndex % COL_COLORS.length];

              // Draw connecting line only on even-indexed (top-row) items
              // that have a next item to connect to
              const isTopOfColumn = index % 2 === 0;
              const hasPartnerBelow = isTopOfColumn && index + 1 < visibleTasks.length;

              return (
                <div
                  key={t.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.6rem',
                    position: 'relative',
                    opacity: t.localDone ? 0.45 : 1,
                    transition: 'opacity 0.3s',
                  }}
                >
                  {/* Left: dot + line + title */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', position: 'relative', flexShrink: 1, minWidth: 0 }}>

                    {/* Vertical connecting line going down to next task in same column */}
                    {hasPartnerBelow && (
                      <div
                        style={{
                          position: 'absolute',
                          left: '9px',
                          top: '20px',
                          // Height = gap (1rem) + height of next row item (approx 22px)
                          height: 'calc(100% + 0.75rem)',
                          width: '2px',
                          background: 'linear-gradient(to bottom, #d1ddd4, transparent)',
                          zIndex: 1,
                          borderRadius: '1px',
                        }}
                      />
                    )}

                    {/* Circle tick button */}
                    <button
                      onClick={() => handleToggle(t.id)}
                      title={t.localDone ? 'Mark incomplete' : 'Mark complete'}
                      style={{
                        width: '16px',
                        height: '16px',
                        borderRadius: '50%',
                        border: `2px solid ${t.localDone ? '#2b533a' : '#b5ccba'}`,
                        background: t.localDone ? '#2b533a' : '#ffffff',
                        cursor: 'pointer',
                        flexShrink: 0,
                        marginRight: '0.45rem',
                        position: 'relative',
                        zIndex: 2,
                        padding: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 0 0 2px rgba(255,255,255,0.8)',
                        transition: 'background 0.2s',
                        marginTop: '2px', // align with first line of text
                      }}
                    >
                      {t.localDone && (
                        <svg width="10" height="10" viewBox="0 0 10 10">
                          <polyline points="2,5 4,7 8,2" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" />
                        </svg>
                      )}
                    </button>

                    {/* Task title */}
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: '0.78rem',
                        color: t.localDone ? '#8aab91' : '#1a3525',
                        lineHeight: 1.2,
                        whiteSpace: 'normal',
                        wordBreak: 'normal',
                        overflowWrap: 'break-word',
                        textDecoration: t.localDone ? 'line-through' : 'none',
                        flex: 1,
                      }}
                    >
                      {t.title}
                    </div>
                  </div>

                  {/* Right: timer pill */}
                  <div
                    style={{
                      background: colorTheme.bg,
                      border: `1px solid ${colorTheme.border}`,
                      borderRadius: '20px',
                      padding: '1px 6px',
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <div style={{ color: colorTheme.text, transform: 'scale(0.72)', transformOrigin: 'center', margin: '-0.15rem -0.35rem' }}>
                      <TaskTimer deadline={t.deadline} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>No pending tasks or deadlines.</p>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '0.5rem' }}>
          <button
            onClick={() => onNavigate('tasks')}
            style={{ background: 'none', border: 'none', color: '#294d38', fontSize: '0.7rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem', padding: 0 }}
          >
            View all tasks <span style={{ color: '#637765' }}>→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
