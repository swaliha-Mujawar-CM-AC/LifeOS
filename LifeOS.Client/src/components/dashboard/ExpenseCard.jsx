import React from 'react';
import { SVGIcons } from '../SVGIcons';

export function ExpenseCard({ budgetInfo = {} }) {
  const budget = budgetInfo.budget || 0;
  const spent = budgetInfo.spent || 0;
  const remaining = Math.max(0, budget - spent);
  const remainingPercent = budget > 0 ? Math.round((remaining / budget) * 100) : 0;
  const spentPercent = budget > 0 ? Math.round((spent / budget) * 100) : 0;

  const categories = budgetInfo.categoryBreakdown && budgetInfo.categoryBreakdown.length > 0 ? budgetInfo.categoryBreakdown : [];

  // Colors for donut and list matching forest/earthy theme
  const colors = ['#2b533a', '#588157', '#e76f51', '#e9c46a', '#3a5a40'];

  // Helper to draw donut segments
  let cumulativePercent = 0;
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  
  const segments = categories.slice(0, 5).map((c, i) => {
    // If the data doesn't have percent, calculate it
    const catPercent = c.percent || Math.round((c.amount / spent) * 100) || 0;
    const strokeDasharray = `${(catPercent * circumference) / 100} ${circumference}`;
    const strokeDashoffset = -((cumulativePercent * circumference) / 100);
    cumulativePercent += catPercent;
    
    return (
      <circle
        key={i}
        cx="57"
        cy="57"
        r={radius}
        fill="transparent"
        stroke={colors[i % colors.length]}
        strokeWidth="11"
        strokeDasharray={strokeDasharray}
        strokeDashoffset={strokeDashoffset}
        transform="rotate(-90 57 57)"
      />
    );
  });

  return (
    <div className="dashboard-card" style={{ padding: '0.75rem 1rem', marginBottom: 0, position: 'relative', overflow: 'hidden', background: 'linear-gradient(rgba(250, 248, 244, 0.62), rgba(250, 248, 244, 0.62)), url(/card-bg.png) no-repeat center', backgroundSize: 'cover' }}>
      
      {/* Header */}
      <div className="card-header" style={{ marginBottom: '0.75rem' }}>
        <div className="card-title" style={{ fontSize: '0.95rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ background: '#dcecd6', padding: '0.2rem', borderRadius: '6px', color: '#407c52', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <SVGIcons.Expenses />
          </span>
          <span style={{ color: '#132a1e' }}>Expenses</span>
        </div>
      </div>

      {/* Main Content Layout */}
      <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-evenly', flexWrap: 'nowrap', gap: '1rem', width: '100%' }}>
        
        {/* Left: Remaining Budget */}
        <div style={{ display: 'flex', flexDirection: 'column', flex: '1 1 0' }}>
          <span style={{ fontSize: '0.65rem', color: '#4b6251', fontWeight: 500 }}>Budget Remaining</span>
          <span style={{ fontSize: '1.4rem', fontWeight: 700, color: '#132a1e', lineHeight: 1.1, marginTop: '0.1rem', whiteSpace: 'nowrap' }}>
            ₹{remaining.toLocaleString()}
          </span>
          <span style={{ fontSize: '0.6rem', color: '#4b6251', marginTop: '0.1rem' }}>of ₹{budget.toLocaleString()}</span>
          
          <div style={{ marginTop: '0.4rem', alignSelf: 'flex-start', background: '#dcecd6', color: '#2b533a', padding: '0.15rem 0.4rem', borderRadius: '12px', fontSize: '0.55rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.2rem', whiteSpace: 'nowrap' }}>
            {remainingPercent}% left <span style={{ fontSize: '0.6rem' }}>↗</span>
          </div>
        </div>

        {/* Divider */}
        <div style={{ width: '1px', height: '70px', background: '#dcecd6', flexShrink: 0 }}></div>

        {/* Middle: Donut & List */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flex: '1.5 1 0' }}>
          {/* Donut Chart */}
          <div style={{ position: 'relative', width: '115px', height: '115px', flexShrink: 0 }}>
            <svg width="115" height="115" viewBox="0 0 114 114">
              <circle cx="57" cy="57" r={radius} fill="transparent" stroke="#dcecd6" strokeWidth="12" />
              {segments}
            </svg>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '1rem', fontWeight: 700, color: '#132a1e', lineHeight: 1 }}>{spentPercent}%</span>
              <span style={{ fontSize: '0.6rem', color: '#4b6251' }}>Spent</span>
            </div>
          </div>

          {/* Categories List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flexGrow: 1, minWidth: '0' }}>
            {categories.slice(0, 5).map((c, i) => {
              const catPercent = c.percent || Math.round((c.amount / spent) * 100);
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '1rem', fontSize: '0.65rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', minWidth: '80px' }}>
                    <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: colors[i % colors.length], flexShrink: 0 }}></div>
                    <span style={{ color: '#4a5568', fontWeight: 500, whiteSpace: 'nowrap' }}>{c.category}</span>
                  </div>
                  <span style={{ fontWeight: 600, color: '#1a3525' }}>{catPercent}%</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Divider */}
        <div style={{ width: '1px', height: '70px', background: '#dcecd6', flexShrink: 0 }}></div>

        {/* Right: Totals */}
        <div style={{ display: 'flex', flexDirection: 'column', flex: '1 1 0', gap: '0.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.65rem', color: '#4b6251', fontWeight: 500, whiteSpace: 'nowrap' }}>Total Budget</span>
            <span style={{ fontSize: '0.95rem', fontWeight: 600, color: '#132a1e' }}>₹{budget.toLocaleString()}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.65rem', color: '#4b6251', fontWeight: 500, whiteSpace: 'nowrap' }}>Total Spent</span>
            <span style={{ fontSize: '0.95rem', fontWeight: 600, color: '#e76f51' }}>₹{spent.toLocaleString()}</span>
          </div>
        </div>

      </div>
    </div>
  );
}
