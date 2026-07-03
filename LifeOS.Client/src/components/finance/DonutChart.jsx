import React from 'react';

const CAT_COLORS = {
  Food: '#f59e0b',
  Entertainment: '#8b5cf6',
  Bills: '#3b82f6',
  Health: '#22c55e',
  Travel: '#ef4444',
  Miscellaneous: '#6b7280',
};

// Donut chart with center label
export const DonutChart = ({ data, total, size = 160 }) => {
  const center = size / 2;
  const radius = size / 2 - 14;
  const circ = 2 * Math.PI * radius;
  let offset = 0;
  if (!data || data.length === 0 || total === 0) {
    return (
      <div style={{ width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
        No data
      </div>
    );
  }
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={center} cy={center} r={radius} fill="none" stroke="#f1f3ee" strokeWidth="16" />
        {data.map((d) => {
          const pct = d.amount / total;
          const dash = pct * circ;
          const gap = circ - dash;
          const seg = (
            <circle
              key={d.category}
              cx={center} cy={center} r={radius}
              fill="none"
              stroke={CAT_COLORS[d.category] || '#9ca3af'}
              strokeWidth="16"
              strokeDasharray={`${dash} ${gap}`}
              strokeDashoffset={-offset}
            />
          );
          offset += dash;
          return seg;
        })}
      </svg>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', lineHeight: '1.2'
      }}>
        <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Total Spent</span>
        <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0.1rem 0' }}>₹{total.toLocaleString('en-IN')}</span>
        <span style={{ fontSize: '0.52rem', color: 'var(--text-secondary)', opacity: 0.8 }}>in selected period</span>
      </div>
    </div>
  );
};
