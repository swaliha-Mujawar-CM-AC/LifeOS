import React from 'react';
import { SVGIcons } from '../SVGIcons';

// Curly multi-leaf sprout icon
const LeafCluster = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.58,20C9,19.9 16.24,18.86 20,12C20.5,11 21,9 21,9S18.5,8.5 17,8Z" />
    <path d="M10,12C4.5,13.5 3,17.5 1.5,21L3,21.5L3.5,20C5.5,20 10,19 12.5,14.5C13,13.8 13.2,12.5 13.2,12.5S11.5,12.2 10,12Z" opacity="0.8" transform="rotate(-35 10 12)" />
  </svg>
);

// Tiny coral/yellow blossom SVG that blooms when active
const Blossom = ({ active }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ transition: 'all 0.5s ease', transform: active ? 'scale(1.15)' : 'scale(0.85)' }}>
    <circle cx="12" cy="12" r="3" fill="#e9c46a" />
    <path d="M12,2 C10,5 6,5 6,8 C6,10 8,11 10,10 C9,12 9,16 12,16 C15,16 15,12 14,10 C16,11 18,10 18,8 C18,5 14,5 12,2 Z" fill="#e76f51" />
  </svg>
);

export function HabitTrackerCard({ habitsList = [], onToggle }) {
  const habitsDoneCount = habitsList.filter(h => h.isCompletedToday).length;
  const habitsTotalCount = habitsList.length || 1;
  const streak = habitsList.length > 0 ? Math.max(...habitsList.map(h => h.streak)) : 0;
  const progressPercent = habitsList.length === 0 ? 0 : (habitsDoneCount / habitsTotalCount);

  // Math for positioning the growing tip leaf bud along the sine wave vine stem:
  // 5 full wave cycles across the 1000px viewBox SVG path.
  // Amplitude is 6.5px (ranging from 10 - 6.5 = 3.5px peak to 10 + 6.5 = 16.5px valley).
  // Total height of the SVG is 20px, absolute parent height is 20px.
  // "Growth" animation logic
  const totalCycles = 5;
  const waveAmplitude = 8;
  const phase = progressPercent * totalCycles * 2 * Math.PI;
  const budAngle = 15 - 35 * Math.cos(phase); // derivative slope angle in degrees

  // Larger radius for a bigger circle
  const size = 110;
  const radius = 44;
  const strokeWidth = 9;
  const circ = 2 * Math.PI * radius;
  const center = size / 2;

  return (
    <div
      className="dashboard-card"
      style={{
        padding: '1rem 1.5rem',
        position: 'relative',
        // Slightly warmer overlay so text is readable against the background
        background: 'linear-gradient(rgba(250, 248, 244, 0.62), rgba(250, 248, 244, 0.62)), url(/card-bg.png) no-repeat center',
        backgroundSize: 'cover',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Top row: title left, streak right */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', position: 'relative', zIndex: 2 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ background: '#dcecd6', padding: '0.2rem', borderRadius: '6px', color: '#407c52', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <SVGIcons.Flame />
          </span>
          <span style={{ fontSize: '0.95rem', fontWeight: 600, color: '#132a1e' }}>Habits</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{ fontSize: '0.75rem', color: '#4b6251', fontWeight: 600 }}>Streak</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#d97706', fontWeight: 700, fontSize: '0.95rem' }}>
            🔥 {streak}d
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', position: 'relative', zIndex: 2 }}>

        {/* ── Left: redesigned progress circle ── */}
        <div style={{ position: 'relative', width: size, height: size, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            {/* Soft drop-shadow filter */}
            <defs>
              <filter id="ring-shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#2b533a" floodOpacity="0.15" />
              </filter>
            </defs>

            {/* Track ring */}
            <circle
              cx={center} cy={center} r={radius}
              fill="none"
              stroke="#dcecd6"
              strokeWidth={strokeWidth}
            />

            {/* Background subtle inner fill */}
            <circle
              cx={center} cy={center} r={radius - strokeWidth / 2 - 1}
              fill="rgba(220, 236, 214, 0.25)"
            />

            {/* Progress arc — theme green */}
            <circle
              cx={center} cy={center} r={radius}
              fill="none"
              stroke="#2b533a"
              strokeWidth={strokeWidth}
              strokeDasharray={circ}
              strokeDashoffset={circ - progressPercent * circ}
              transform={`rotate(-90 ${center} ${center})`}
              strokeLinecap="round"
              filter="url(#ring-shadow)"
              style={{ transition: 'stroke-dashoffset 0.5s ease' }}
            />
          </svg>

          {/* Center text */}
          <div style={{ position: 'absolute', textAlign: 'center', lineHeight: 1 }}>
            <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#132a1e', display: 'block', letterSpacing: '-1px' }}>
              {habitsDoneCount}<span style={{ fontSize: '0.9rem', fontWeight: 500, color: '#4b6251' }}>/{habitsTotalCount}</span>
            </span>
            <span style={{ fontSize: '0.55rem', color: '#4b6251', fontWeight: 600, display: 'block', marginTop: '0.15rem', letterSpacing: '0.3px', textTransform: 'uppercase' }}>
              done today
            </span>
          </div>
        </div>

        {/* ── Right: Horizontal habit timeline ── */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', zIndex: 2, width: '100%', alignItems: 'flex-start', paddingTop: '0.25rem' }}>

            {/* Wavy Vine Progress Bar (Wavy Branch Stem) */}
            <svg 
              style={{ 
                position: 'absolute', 
                top: '4px', 
                left: '12px', 
                right: '12px', 
                width: 'calc(100% - 24px)', 
                height: '20px', 
                pointerEvents: 'none', 
                overflow: 'visible', 
                zIndex: 1 
              }}
              viewBox="0 0 1000 20"
              preserveAspectRatio="none"
            >
              {/* Wavy background stem (woody twigs style) */}
              <path
                d="M 0,10 Q 50,3.5 100,10 T 200,10 T 300,10 T 400,10 T 500,10 T 600,10 T 700,10 T 800,10 T 900,10 T 1000,10"
                fill="none"
                stroke="#dcecd6"
                strokeWidth="2"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />

              {/* Active green winding progress stem */}
              <path
                d="M 0,10 Q 50,3.5 100,10 T 200,10 T 300,10 T 400,10 T 500,10 T 600,10 T 700,10 T 800,10 T 900,10 T 1000,10"
                fill="none"
                stroke="#2b533a"
                strokeWidth="3.5"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                strokeDasharray="1010"
                strokeDashoffset={1010 - (progressPercent * 1010)}
                style={{ transition: 'stroke-dashoffset 0.5s ease' }}
              />
            </svg>

            {/* Sprouting decorations container */}
            <div style={{ position: 'absolute', top: '4px', left: '12px', right: '12px', width: 'calc(100% - 24px)', height: '20px', zIndex: 2, pointerEvents: 'none' }}>
              {/* Winding Leaf Bud Tip */}
              {progressPercent > 0 && (
                <div 
                  style={{
                    position: 'absolute',
                    left: `${progressPercent * 100}%`,
                    top: `${10 - waveAmplitude * Math.sin(phase)}px`,
                    transform: `translate(-50%, -50%) rotate(${budAngle}deg)`,
                    transition: 'left 0.5s ease, top 0.5s ease, transform 0.5s ease',
                    color: '#2b533a',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 3
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.58,20C9,19.9 16.24,18.86 20,12C20.5,11 21,9 21,9S18.5,8.5 17,8Z" />
                  </svg>
                </div>
              )}

              {/* Fixed leaf clusters and blossoms along the curves */}
              {[
                { pct: 10, type: 'leaf', angle: -45, top: 3.5 },
                { pct: 25, type: 'blossom', angle: 0, top: 10 },
                { pct: 40, type: 'leaf', angle: 135, top: 16.5 },
                { pct: 60, type: 'leaf', angle: -40, top: 3.5 },
                { pct: 75, type: 'blossom', angle: 0, top: 10 },
                { pct: 90, type: 'leaf', angle: 145, top: 16.5 }
              ].map((sprout, index) => {
                const active = (progressPercent * 100) >= sprout.pct;
                return (
                  <div
                    key={index}
                    style={{
                      position: 'absolute',
                      left: `${sprout.pct}%`,
                      top: `${sprout.top}px`,
                      transform: `translate(-50%, -50%) rotate(${sprout.angle}deg)`,
                      color: active 
                        ? (sprout.type === 'blossom' ? '#e76f51' : '#2b533a') 
                        : (sprout.type === 'blossom' ? '#e2c5bd' : '#b5ccba'),
                      opacity: active ? 1 : 0.45,
                      transition: 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {sprout.type === 'blossom' ? (
                      <Blossom active={active} />
                    ) : (
                      <LeafCluster />
                    )}
                  </div>
                );
              })}
            </div>

            {habitsList.map(h => (
              <div
                key={h.id}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.45rem', cursor: 'pointer', zIndex: 2, minWidth: '44px', maxWidth: '70px', flex: 1 }}
                onClick={() => onToggle(h.id)}
              >
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: h.isCompletedToday ? '#2b533a' : '#ffffff',
                  border: `2px solid ${h.isCompletedToday ? '#2b533a' : '#b5ccba'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#ffffff',
                  transition: 'all 0.25s',
                  boxShadow: h.isCompletedToday ? '0 2px 8px rgba(43,83,58,0.28)' : '0 1px 4px rgba(0,0,0,0.06)',
                  flexShrink: 0,
                }}>
                  {h.isCompletedToday
                    ? <svg width="12" height="12" viewBox="0 0 12 12"><polyline points="2,6 5,9 10,3" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    : null
                  }
                </div>
                <span style={{
                  fontSize: '0.6rem',
                  fontWeight: h.isCompletedToday ? 700 : 600,
                  color: h.isCompletedToday ? '#132a1e' : '#4b6251',
                  letterSpacing: '0.3px',
                  textTransform: 'uppercase',
                  textAlign: 'center',
                  whiteSpace: 'normal',
                  wordBreak: 'break-word',
                  lineHeight: 1.3,
                  width: '100%',
                }}>
                  {h.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
