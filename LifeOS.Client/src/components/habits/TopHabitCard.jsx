import React from 'react';
import { TrophyIcon, StarIcon } from './HabitIcons';

export function TopHabitCard({ topHabit }) {
  return (
    <div className="dashboard-card" style={{ padding: '1.25rem', marginBottom: 0 }}>
      <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>Top Habit</h3>
      {topHabit && topHabit.streak > 0 ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f5f7f4', borderRadius: '12px', padding: '0.65rem 0.85rem', border: '1px solid #e1e7df' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#1e3d2f', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <StarIcon />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.82rem', color: '#1e3d2f' }}>{topHabit.title}</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{topHabit.streak} days streak</div>
            </div>
          </div>
          <div style={{ color: '#1e8a44', display: 'flex' }}>
            <TrophyIcon />
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f7f4', borderRadius: '12px', padding: '0.65rem 0.85rem', border: '1px solid #e1e7df', fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
          No streaks recorded.
        </div>
      )}
    </div>
  );
}
