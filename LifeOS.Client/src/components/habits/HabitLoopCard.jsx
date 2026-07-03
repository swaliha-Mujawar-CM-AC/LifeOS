import React from 'react';
import { SVGIcons } from '../SVGIcons';
import { EyeIcon, GiftIcon, InfinityIcon } from './HabitIcons';

export function HabitLoopCard() {
  return (
    <div className="dashboard-card" style={{ padding: '0.5rem 1.25rem', marginTop: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', overflowX: 'auto', marginBottom: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexShrink: 0 }}>
        <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-primary)' }}>The Habit Loop</span>
        <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 500 }}>— System for behavior change:</span>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.88rem', justifyContent: 'flex-end' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <div style={{ color: 'var(--accent-green)', display: 'flex', transform: 'scale(0.8)' }}><EyeIcon /></div>
          <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>Cue</span>
          <span style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>(Make it obvious)</span>
        </div>
        <div style={{ color: '#9ca3af', fontSize: '0.7rem' }}>→</div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <div style={{ color: 'var(--accent-green)', display: 'flex', transform: 'scale(0.8)' }}><SVGIcons.Refresh /></div>
          <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>Routine</span>
          <span style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>(Make it easy)</span>
        </div>
        <div style={{ color: '#9ca3af', fontSize: '0.7rem' }}>→</div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <div style={{ color: 'var(--accent-green)', display: 'flex', transform: 'scale(0.8)' }}><GiftIcon /></div>
          <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>Reward</span>
          <span style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>(Make it satisfying)</span>
        </div>
        <div style={{ color: '#9ca3af', fontSize: '0.7rem' }}>→</div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <div style={{ color: 'var(--accent-green)', display: 'flex', transform: 'scale(0.8)' }}><InfinityIcon /></div>
          <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>Repeat</span>
          <span style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>(Make it automatic)</span>
        </div>
      </div>
    </div>
  );
}
