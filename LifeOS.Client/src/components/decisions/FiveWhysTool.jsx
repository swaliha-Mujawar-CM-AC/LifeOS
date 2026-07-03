import React, { useState } from 'react';

export function FiveWhysTool() {
  const [whys, setWhys] = useState(['', '', '', '', '']);
  const labels = [
    'Why does this problem exist?',
    'Why is that?',
    'Why did that happen?',
    'Why is that the case?',
    'Why is that the root cause?'
  ];

  const handleChange = (index, val) => {
    const next = [...whys];
    next[index] = val;
    setWhys(next);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
        Ask "Why" five times to drill down to the root cause of the situation.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {labels.map((label, idx) => (
          <div key={idx} style={{ display: 'flex', gap: '1rem', alignItems: 'center', background: '#F8FBF9', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <span style={{ fontWeight: 900, color: 'var(--accent-green)', fontSize: '0.85rem', minWidth: '50px' }}>Why {idx + 1}</span>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
              <label style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 700 }}>{label}</label>
              <input
                value={whys[idx]}
                onChange={e => handleChange(idx, e.target.value)}
                placeholder="Type your explanation here..."
                style={{ width: '100%', border: 'none', borderBottom: '1px dashed #ccc', outline: 'none', background: 'transparent', fontSize: '0.8rem', fontFamily: 'var(--font-main)', color: 'var(--text-primary)', padding: '0.2rem 0' }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
