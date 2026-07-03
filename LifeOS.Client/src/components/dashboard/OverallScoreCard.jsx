import React from 'react';
import { SVGIcons } from '../SVGIcons';

// Warm forest-green theme matching Habits card
const P = {
  track:      '#dcecd6',   // green track
  arc:        '#2b533a',   // deep green arc
  arcGlow:    '#588157',   // lighter green glow
  text:       '#132a1e',   // deep green/black text
  label:      '#4b6251',   // muted green label
  cardBg:     'rgba(255,255,255,0.62)',
  cardBorder: 'rgba(220,236,214,0.28)',
  divider:    'rgba(43,83,58,0.15)',
  bg1:        'rgba(250, 248, 244, 0.62)',  // match habits card
  bg2:        'rgba(250, 248, 244, 0.62)',  // match habits card
};

const subColors = [
  { bg: 'rgba(232,245,233,0.85)', bar: '#2b533a', text: '#2b533a', icon: '#2b533a' }, // Tasks (Sage/Forest)
  { bg: 'rgba(220,236,214,0.85)', bar: '#407c52', text: '#407c52', icon: '#407c52' }, // Habits (Light green)
  { bg: 'rgba(254,246,231,0.85)', bar: '#e76f51', text: '#e76f51', icon: '#e76f51' }, // Expenses (Terracotta)
  { bg: 'rgba(255,249,230,0.85)', bar: '#e9c46a', text: '#e9c46a', icon: '#e9c46a' }, // Decisions (Gold)
];

const CompassIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
  </svg>
);

export function OverallScoreCard({ scores = {} }) {
  const habitScoreVal    = scores.habitScore     !== undefined ? scores.habitScore     : 0;
  const taskScoreVal     = scores.taskScore      !== undefined ? scores.taskScore      : 0;
  const financeScoreVal  = scores.financialScore !== undefined ? scores.financialScore : 0;
  const decisionScoreVal = scores.decisionScore  !== undefined ? scores.decisionScore  : 0;

  const overallScoreVal = scores.overallScore !== undefined ? scores.overallScore : 0;

  let overallLabel = 'Average';
  if (overallScoreVal >= 85) overallLabel = 'Excellent';
  else if (overallScoreVal >= 70) overallLabel = 'Good';
  else if (overallScoreVal >= 50) overallLabel = 'Average';
  else overallLabel = 'Focus Needed';

  const size   = 128;
  const radius = 52;
  const sw     = 10;
  const circ   = 2 * Math.PI * radius;
  const center = size / 2;

  const subCards = [
    { title: 'Tasks',     score: taskScoreVal,     icon: <SVGIcons.TaskIcon /> },
    { title: 'Habits',    score: habitScoreVal,     icon: <SVGIcons.Leaf />     },
    { title: 'Expenses',  score: financeScoreVal,   icon: <SVGIcons.Expenses /> },
    { title: 'Decisions', score: decisionScoreVal,  icon: <SVGIcons.Decisions />},
  ];

  return (
    <div
      className="dashboard-card"
      style={{
        padding: '1rem 1.25rem',
        marginBottom: 0,
        position: 'relative',
        overflow: 'hidden',
        // Soft green gradient overlay on the score-bg image
        background: `linear-gradient(rgba(250, 248, 244, 0.62), rgba(250, 248, 244, 0.62)), url(/card-bg.png) no-repeat center`,
        backgroundSize: 'cover',
        display: 'flex',
        flexDirection: 'column',
        borderColor: 'rgba(220,236,214,0.28)',
      }}
    >
      {/* Subtle ambient blobs */}
      <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '180px', height: '180px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(43,83,58,0.12) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 1 }} />
      <div style={{ position: 'absolute', bottom: '-30px', left: '30%', width: '140px', height: '140px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(43,83,58,0.08) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 1 }} />

      {/* Header */}
      <div className="card-header" style={{ marginBottom: '0.75rem', position: 'relative', zIndex: 2 }}>
        <div className="card-title" style={{ fontSize: '0.95rem', fontWeight: 600, color: P.text, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span style={{ background: '#dcecd6', padding: '0.25rem', borderRadius: '6px', color: '#407c52', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CompassIcon />
          </span>
          <span>Your Overall Score</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'var(--flex-dir-row-col, row)', gap: '1.75rem', alignItems: 'center', position: 'relative', zIndex: 2 }}>

        {/* ── Left: Circle gauge ── */}
        <div style={{
          display: 'flex',
          flexDirection: 'var(--flex-dir-score-left, row)',
          alignItems: 'center',
          gap: '1.25rem',
          paddingRight: 'var(--score-left-padding-right, 1.5rem)',
          borderRight: 'var(--score-left-border-right, 1px solid ' + P.divider + ')',
          borderBottom: 'var(--score-left-border-bottom, none)',
          paddingBottom: 'var(--score-left-padding-bottom, 0px)',
          flexShrink: 0,
          width: 'var(--score-left-width, auto)'
        }}>
          <div style={{ width: size, height: size, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
              <defs>
                <filter id="ring-shadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#2b533a" floodOpacity="0.15" />
                </filter>
              </defs>

              {/* Track */}
              <circle cx={center} cy={center} r={radius} fill="none" stroke="#dcecd6" strokeWidth={sw} />

              {/* Inner soft fill */}
              <circle cx={center} cy={center} r={radius - sw / 2 - 1} fill="rgba(220, 236, 214, 0.25)" />

              {/* Progress arc */}
              <circle
                cx={center} cy={center} r={radius}
                fill="none"
                stroke="#2b533a"
                strokeWidth={sw}
                strokeDasharray={circ}
                strokeDashoffset={circ - (overallScoreVal / 100) * circ}
                transform={`rotate(-90 ${center} ${center})`}
                strokeLinecap="round"
                filter="url(#ring-shadow)"
                style={{ transition: 'stroke-dashoffset 0.6s ease' }}
              />
            </svg>

            {/* Center text */}
            <div style={{ position: 'absolute', textAlign: 'center' }}>
              <span style={{ fontSize: '2rem', fontWeight: 800, color: P.text, display: 'block', lineHeight: 1, letterSpacing: '-1px' }}>
                {overallScoreVal}
              </span>
              <span style={{ fontSize: '0.72rem', color: P.arc, fontWeight: 700, letterSpacing: '0.5px' }}>
                {overallLabel}
              </span>
            </div>
          </div>

          {/* Tagline */}
          <div>
            <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: P.text, marginBottom: '0.2rem' }}>
              You're on the right track! <span>✨</span>
            </h4>
            <p style={{ fontSize: '0.72rem', color: P.label, lineHeight: 1.4, fontWeight: 400, maxWidth: '140px' }}>
              Consistency is your superpower. Keep going strong.
            </p>
          </div>
        </div>

        {/* ── Right: Mini sub-score cards ── */}
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'var(--grid-dashboard-score-cols, repeat(4, 1fr))', gap: '0.75rem', width: '100%' }}>
          {subCards.map((card, i) => {
            const c = subColors[i];
            return (
              <div
                key={i}
                style={{
                  background: P.cardBg,
                  backdropFilter: 'blur(12px)',
                  border: `1px solid ${P.cardBorder}`,
                  borderRadius: '14px',
                  padding: '0.7rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.4rem',
                  boxShadow: '0 2px 12px rgba(43,83,58,0.06)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: c.icon, display: 'flex', alignItems: 'center' }}>
                    <div style={{ transform: 'scale(0.82)' }}>{card.icon}</div>
                  </span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: P.text }}>{card.score}%</span>
                </div>
                <span style={{ fontSize: '0.7rem', color: P.label, fontWeight: 600 }}>{card.title}</span>
                {/* Progress bar */}
                <div style={{ height: '3px', background: P.track, borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${card.score}%`, background: c.bar, borderRadius: '2px', transition: 'width 0.5s ease' }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
