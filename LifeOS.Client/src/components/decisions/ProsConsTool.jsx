import React, { useState } from 'react';

export function ProsConsTool() {
  const [items, setItems] = useState({ pros: ['', '', ''], cons: ['', '', ''] });
  const [input, setInput] = useState({ pros: '', cons: '' });

  const add = (side) => {
    if (!input[side].trim()) return;
    setItems(prev => ({ ...prev, [side]: [...prev[side].filter(Boolean), input[side].trim()] }));
    setInput(prev => ({ ...prev, [side]: '' }));
  };

  const remove = (side, idx) => {
    setItems(prev => ({ ...prev, [side]: prev[side].filter((_, i) => i !== idx) }));
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'var(--grid-decision-tools-cols, 1fr 1fr)', gap: '1.25rem' }}>
      {[['pros', '#27ae60', '#eafaf1'], ['cons', '#e74c3c', '#fdf0f0']].map(([side, color, bg]) => (
        <div key={side} style={{ background: bg, borderRadius: '16px', padding: '1rem 1.1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <span style={{ fontWeight: 800, fontSize: '0.9rem', color, textTransform: 'capitalize' }}>{side}</span>
            <span style={{ fontSize: '0.75rem', color: '#999', marginLeft: 'auto' }}>
              {side === 'pros' ? 'List the benefits of this decision...' : 'List the drawbacks or risks...'}
            </span>
          </div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '0.75rem' }}>
            {items[side].filter(Boolean).map((item, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                <span style={{ color, flexShrink: 0 }}>•</span>
                <span style={{ flex: 1 }}>{item}</span>
                <button onClick={() => remove(side, i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#bbb', fontSize: '0.7rem', padding: '0' }}>✕</button>
              </li>
            ))}
          </ul>
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            <input
              value={input[side]}
              onChange={e => setInput(p => ({ ...p, [side]: e.target.value }))}
              onKeyDown={e => e.key === 'Enter' && add(side)}
              placeholder="Add item…"
              style={{ flex: 1, border: `1px solid ${color}40`, borderRadius: '8px', padding: '0.4rem 0.6rem', fontSize: '0.78rem', fontFamily: 'var(--font-main)', outline: 'none', background: '#fff' }}
            />
            <button onClick={() => add(side)} style={{ background: color, color: '#fff', border: 'none', borderRadius: '8px', padding: '0.4rem 0.7rem', fontSize: '0.78rem', cursor: 'pointer', fontWeight: 700 }}>+</button>
          </div>
        </div>
      ))}
    </div>
  );
}
