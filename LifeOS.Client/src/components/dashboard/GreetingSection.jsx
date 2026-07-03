import React from 'react';

export function GreetingSection({ username }) {
  const currentHour = new Date().getHours();
  let greetingWord = 'Good morning';
  let greetingIcon = '☀️';

  if (currentHour >= 12 && currentHour < 17) {
    greetingWord = 'Good afternoon';
    greetingIcon = '🌤️';
  } else if (currentHour >= 17 || currentHour < 5) {
    greetingWord = 'Good evening';
    greetingIcon = '🌙';
  }

  const currentDate = new Date();
  const formattedDayName = currentDate.toLocaleDateString('en-US', { weekday: 'long' });
  const formattedFullDate = currentDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  const capitalizedName = username === 'john' ? 'John' : (username.charAt(0).toUpperCase() + username.slice(1));

  return (
    <section className="greeting-section" style={{ margin: '0.2rem 0 0.1rem 0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div className="greeting-text" style={{ fontSize: '1rem', color: '#132a1e', fontWeight: 400, letterSpacing: '0.5px' }}>
        {greetingWord}, <span style={{fontWeight: 700}}>{capitalizedName}</span>! {greetingIcon}
      </div>
      <div style={{ fontSize: '0.8rem', color: '#4b6251', fontWeight: 600, paddingRight: '0.5rem', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
        {formattedDayName}, {formattedFullDate}
      </div>
    </section>
  );
}
