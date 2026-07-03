import React from 'react';

export function HabitLeaderboard({ leaderboard, userId }) {
  return (
    <div className="dashboard-card" style={{ padding: '1.25rem', marginBottom: 0 }}>
      <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.2rem' }}>Leaderboard</h3>
      <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '0.6rem' }}>Comparing total streaks</p>
      <div className="leaderboard-list">
        {leaderboard.length === 0 ? (
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', padding: '0.5rem 0' }}>No data yet.</div>
        ) : (
          leaderboard.slice(0, 3).map((row, idx) => {
            const rank = idx + 1;
            const isMe = row.userId === userId;
            const nameStr = row.username === 'john' ? 'John' : (row.username === 'coach_bob' ? 'Coach Bob' : (row.username.charAt(0).toUpperCase() + row.username.slice(1)));
            
            return (
              <div key={row.userId} className={`leaderboard-item ${isMe ? 'current-user' : ''}`} style={{ padding: '0.4rem 0.5rem', borderRadius: '8px', marginBottom: '0.25rem' }}>
                <div className="leaderboard-item-left">
                  <div className={`leaderboard-rank rank-${rank}`} style={{ width: 18, height: 18, fontSize: '0.7rem' }}>
                    {rank}
                  </div>
                  <div className="leaderboard-avatar" style={{ width: 22, height: 22, fontSize: '0.72rem' }}>
                    {nameStr.charAt(0).toUpperCase()}
                  </div>
                  <div className="leaderboard-username" style={{ fontSize: '0.78rem' }}>{nameStr}</div>
                </div>
                <div className="leaderboard-item-right">
                  <div className="leaderboard-score" style={{ fontSize: '0.8rem' }}>{row.totalStreakScore}</div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
