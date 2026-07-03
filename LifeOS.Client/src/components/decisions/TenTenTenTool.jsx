import React, { useState } from 'react';

export function TenTenTenTool() {
  const horizons = [
    { key: 't10min',   label: '10 Minutes',  color: '#2980b9', bg: '#eaf4fb', question: 'How will you feel about this decision in 10 minutes?' },
    { key: 't10month', label: '10 Months',   color: '#27ae60', bg: '#eafaf1', question: 'How will you feel about this decision in 10 months?' },
    { key: 't10year',  label: '10 Years',    color: '#d97706', bg: '#fef3c7', question: 'How will you feel about this decision in 10 years?' },
  ];
  const [answers, setAnswers] = useState({ t10min: '', t10month: '', t10year: '' });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '0.25rem' }}>
        Evaluate your decision across three time horizons to avoid short-term bias.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'var(--grid-decision-101010-cols, 1fr 1fr 1fr)', gap: '1rem' }}>
        {horizons.map(h => (
          <div key={h.key} style={{ background: h.bg, borderRadius: '14px', padding: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
              <span style={{ fontWeight: 800, fontSize: '0.85rem', color: h.color }}>{h.label}</span>
            </div>
            <p style={{ fontSize: '0.72rem', color: '#777', marginBottom: '0.6rem', lineHeight: 1.4 }}>{h.question}</p>
            <textarea
              value={answers[h.key]}
              onChange={e => setAnswers(p => ({ ...p, [h.key]: e.target.value }))}
              placeholder="Write your thoughts…"
              rows={3}
              style={{
                width: '100%', border: `1px solid ${h.color}40`, borderRadius: '8px',
                padding: '0.5rem 0.6rem', fontSize: '0.75rem',
                fontFamily: 'var(--font-main)', resize: 'none', outline: 'none',
                background: '#fff', color: 'var(--text-primary)',
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
