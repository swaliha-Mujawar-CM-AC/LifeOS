import React from 'react';
import { FlameIcon, TrophyIcon, StarIcon } from './HabitIcons';

export function HabitStats({ completedCount, totalCount, progressPct, currentStreak, longestStreak, totalPoints }) {
  return (
    <div className="dashboard-card" style={{ padding: '1rem', marginBottom: 0 }}>
      <h3 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.3rem' }}>Today's Progress</h3>
      <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '0.4rem' }}>
        {completedCount}/{totalCount} habits done
      </p>
      <div style={{ height: 6, borderRadius: 3, background: '#eceee8', overflow: 'hidden', marginBottom: '0.75rem' }}>
        <div style={{
          height: '100%', borderRadius: 3, width: `${progressPct}%`,
          background: '#1e3d2f',
          transition: 'width 0.5s ease',
        }} />
      </div>
      <div className="habit-stat-boxes" style={{ gap: '0.5rem', marginTop: '0.75rem' }}>
        <div className="habit-stat-box" style={{ border: '1px solid #ffd2d2', padding: '0.4rem' }}>
          <div className="stat-box-icon" style={{ background: '#ffe5e5', color: '#d32f2f', width: 22, height: 22, fontSize: '0.85rem', marginBottom: '0.2rem' }}>
            <FlameIcon />
          </div>
          <div className="stat-box-val" style={{ fontSize: '0.9rem' }}>{currentStreak}</div>
          <div className="stat-box-lbl" style={{ fontSize: '0.58rem', marginTop: '0.1rem' }}>Streak</div>
        </div>
        <div className="habit-stat-box" style={{ border: '1px solid #ffe8cc', padding: '0.4rem' }}>
          <div className="stat-box-icon" style={{ background: '#fff2e6', color: '#e67300', width: 22, height: 22, fontSize: '0.85rem', marginBottom: '0.2rem' }}>
            <TrophyIcon />
          </div>
          <div className="stat-box-val" style={{ fontSize: '0.9rem' }}>{longestStreak}</div>
          <div className="stat-box-lbl" style={{ fontSize: '0.58rem', marginTop: '0.1rem' }}>Longest</div>
        </div>
        <div className="habit-stat-box" style={{ border: '1px solid #cbe9d6', padding: '0.4rem' }}>
          <div className="stat-box-icon" style={{ background: '#e6f7ec', color: '#1e8a44', width: 22, height: 22, fontSize: '0.85rem', marginBottom: '0.2rem' }}>
            <StarIcon />
          </div>
          <div className="stat-box-val" style={{ fontSize: '0.9rem' }}>{totalPoints}</div>
          <div className="stat-box-lbl" style={{ fontSize: '0.58rem', marginTop: '0.1rem' }}>Points</div>
        </div>
      </div>
    </div>
  );
}
