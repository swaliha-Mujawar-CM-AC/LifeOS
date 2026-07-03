import React, { useState } from 'react';

export function DecisionMatrixTool({ decision }) {
  const [options, setOptions] = useState(['Option A', 'Option B']);
  const [criteria, setCriteria] = useState(['Cost', 'Impact', 'Effort']);
  const [scores, setScores] = useState({});

  const handleScoreChange = (optIdx, critIdx, val) => {
    setScores(prev => ({ ...prev, [`${optIdx}-${critIdx}`]: parseInt(val) || 1 }));
  };

  const getOptionTotal = (optIdx) => {
    return criteria.reduce((sum, _, critIdx) => sum + (scores[`${optIdx}-${critIdx}`] || 1), 0);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
        Compare options objectively by scoring them (1-5) against your criteria. Click to rename options and criteria.
      </p>
      <div style={{ overflowX: 'auto', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8rem', background: '#fff' }}>
          <thead>
            <tr style={{ background: '#FAFBF8', borderBottom: '1.5px solid var(--border-color)' }}>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 800, color: 'var(--text-secondary)' }}>Options</th>
              {criteria.map((crit, critIdx) => (
                <th key={critIdx} style={{ padding: '0.75rem 1rem', fontWeight: 800, color: 'var(--text-secondary)' }}>
                  <input
                    value={crit}
                    onChange={e => setCriteria(prev => prev.map((c, idx) => idx === critIdx ? e.target.value : c))}
                    style={{ border: 'none', fontWeight: 800, outline: 'none', background: 'transparent', width: '80px', color: 'var(--text-secondary)', borderBottom: '1px dashed #ccc' }}
                  />
                </th>
              ))}
              <th style={{ padding: '0.75rem 1rem', fontWeight: 800, color: 'var(--accent-green)' }}>Total Score</th>
            </tr>
          </thead>
          <tbody>
            {options.map((opt, optIdx) => (
              <tr key={optIdx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>
                  <input
                    value={opt}
                    onChange={e => setOptions(prev => prev.map((o, idx) => idx === optIdx ? e.target.value : o))}
                    style={{ border: 'none', fontWeight: 700, outline: 'none', background: 'transparent', width: '100px', borderBottom: '1px dashed #ccc' }}
                  />
                </td>
                {criteria.map((_, critIdx) => (
                  <td key={critIdx} style={{ padding: '0.75rem 1rem' }}>
                    <select
                      value={scores[`${optIdx}-${critIdx}`] || 1}
                      onChange={e => handleScoreChange(optIdx, critIdx, e.target.value)}
                      style={{ padding: '0.25rem 0.5rem', borderRadius: '6px', border: '1px solid #ccc', outline: 'none' }}
                    >
                      {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </td>
                ))}
                <td style={{ padding: '0.75rem 1rem', fontWeight: 800, color: 'var(--accent-green)' }}>
                  {getOptionTotal(optIdx)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button
          onClick={() => setOptions(prev => [...prev, `Option ${String.fromCharCode(65 + prev.length)}`])}
          style={{ background: '#FAFBF8', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.4rem 0.8rem', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
        >
          + Add Option
        </button>
        <button
          onClick={() => setCriteria(prev => [...prev, `Criterion ${prev.length + 1}`])}
          style={{ background: '#FAFBF8', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.4rem 0.8rem', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
        >
          + Add Criterion
        </button>
      </div>
    </div>
  );
}
