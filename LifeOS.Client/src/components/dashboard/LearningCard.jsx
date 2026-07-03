import React from 'react';

const RefreshIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/></svg>
);

// Updated component to display user learnings with fallback to motivational quotes
const MOTIVATIONAL_QUOTES = [
  { text: "Discipline is choosing between what you want now and what you want most.", author: "Unknown" },
  { text: "Small steps today, big changes tomorrow. Keep pushing forward.", author: "LifeOS" },
  { text: "Consistency is your superpower. Your habits define your future.", author: "James Clear" },
  { text: "It is not that we have a short time to live, but that we waste a lot of it.", author: "Seneca" },
  { text: "Great things are done by a series of small things brought together.", author: "Vincent Van Gogh" }
];

export function LearningCard({ learnings = [], onRotate, quoteIndex = 0 }) {
  return (
    <div className="dashboard-card" style={{ padding: '1.5rem', position: 'relative', overflow: 'hidden', minHeight: '120px', background: 'linear-gradient(rgba(250, 248, 244, 0.62), rgba(250, 248, 244, 0.62)), url(/card-bg.png) no-repeat center', backgroundSize: 'cover', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>

      {/* Refresh Button - Top Right */}
      <button 
        className="learning-refresh-btn" 
        onClick={onRotate}
        style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: '3', background: 'none', border: 'none', color: '#407c52', cursor: 'pointer', transition: 'transform 0.3s' }}
        onMouseOver={e => e.currentTarget.style.transform = 'rotate(180deg)'}
        onMouseOut={e => e.currentTarget.style.transform = 'none'}
      >
        <RefreshIcon />
      </button>

      {/* Learnings Block */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative', zIndex: '2', paddingLeft: '1rem', maxWidth: '90%' }}>
        {(() => {
          const userLearnings = learnings.slice(0, 3);
          const needed = 3 - userLearnings.length;
          
          const fallback = [];
          for (let i = 0; i < needed; i++) {
            const index = (quoteIndex + i) % MOTIVATIONAL_QUOTES.length;
            fallback.push(MOTIVATIONAL_QUOTES[index]);
          }
          
          const combined = [...userLearnings.map(l => ({ text: l.text, author: l.author })), ...fallback];
          return combined.map((item, idx) => (
            <div key={idx} style={{ fontSize: '1rem', fontWeight: 500, color: '#132a1e', lineHeight: '1.4' }}>
              {item.text}
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#4b6251' }}>— {item.author}</div>
            </div>
          ));
        })()}
      </div>
    </div>
  );
}
