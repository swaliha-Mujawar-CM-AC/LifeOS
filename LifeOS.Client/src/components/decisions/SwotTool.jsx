import React, { useState } from 'react';

export function SwotTool() {
  const quadrants = [
    { key: 'strengths',     label: 'Strengths',     color: '#27ae60', bg: '#eafaf1', desc: 'Internal advantages' },
    { key: 'weaknesses',    label: 'Weaknesses',    color: '#e67e22', bg: '#fef9f0', desc: 'Internal disadvantages' },
    { key: 'opportunities', label: 'Opportunities', color: '#2980b9', bg: '#eaf4fb', desc: 'External positive factors' },
    { key: 'threats',       label: 'Threats',       color: '#e74c3c', bg: '#fdf0f0', desc: 'External negative factors' },
  ];
  const [items, setItems] = useState({ strengths: [], weaknesses: [], opportunities: [], threats: [] });
  const [inputs, setInputs] = useState({ strengths: '', weaknesses: '', opportunities: '', threats: '' });

  const add = (key) => {
    if (!inputs[key].trim()) return;
    setItems(p => ({ ...p, [key]: [...p[key], inputs[key].trim()] }));
    setInputs(p => ({ ...p, [key]: '' }));
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'var(--grid-decision-tools-cols, 1fr 1fr)', gap: '1rem' }}>
      {quadrants.map(q => (
        <div key={q.key} style={{ background: q.bg, borderRadius: '14px', padding: '0.85rem 1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
            <span style={{ fontWeight: 800, fontSize: '0.85rem', color: q.color }}>{q.label}</span>
            <span style={{ fontSize: '0.65rem', color: '#999', marginLeft: 'auto' }}>{q.desc}</span>
          </div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.3rem', marginBottom: '0.5rem' }}>
            {items[q.key].map((item, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                <span style={{ color: q.color }}>•</span>
                <span style={{ flex: 1 }}>{item}</span>
                <button onClick={() => setItems(p => ({ ...p, [q.key]: p[q.key].filter((_, j) => j !== i) }))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#bbb', fontSize: '0.65rem' }}>✕</button>
              </li>
            ))}
          </ul>
          <div style={{ display: 'flex', gap: '0.35rem' }}>
            <input
              value={inputs[q.key]}
              onChange={e => setInputs(p => ({ ...p, [q.key]: e.target.value }))}
              onKeyDown={e => e.key === 'Enter' && add(q.key)}
              placeholder="Add point…"
              style={{ flex: 1, border: `1px solid ${q.color}40`, borderRadius: '7px', padding: '0.35rem 0.5rem', fontSize: '0.72rem', fontFamily: 'var(--font-main)', outline: 'none', background: '#fff' }}
            />
            <button onClick={() => add(q.key)} style={{ background: q.color, color: '#fff', border: 'none', borderRadius: '7px', padding: '0.35rem 0.6rem', fontSize: '0.72rem', cursor: 'pointer', fontWeight: 700 }}>+</button>
          </div>
        </div>
      ))}
    </div>
  );
}
