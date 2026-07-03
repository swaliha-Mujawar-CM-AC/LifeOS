import React from 'react';

export function TransactionsModal({
  showTxModal,
  setShowTxModal,
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
  applyDateFilter,
  filteredExpenses,
  CAT_COLORS,
  CAT_ICONS,
  triggerEdit,
  handleDelete
}) {
  if (!showTxModal) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center'
    }} onClick={() => setShowTxModal(false)}>
      <div style={{
        background: '#fff',
        borderRadius: '18px',
        padding: '1.75rem',
        width: '780px',
        maxWidth: '90vw',
        maxHeight: '85vh',
        boxShadow: '0 20px 60px rgba(30,61,47,0.18)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        overflow: 'hidden'
      }} onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eceee8', paddingBottom: '0.75rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            📑 All Transactions History
          </h3>
          <button 
            onClick={() => setShowTxModal(false)}
            style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: 'var(--text-secondary)', fontWeight: 'bold' }}
          >
            ✕
          </button>
        </div>

        {/* Filter controls inside popup */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f8faf8', padding: '0.75rem 1rem', borderRadius: '10px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 700 }}>Filter by Date:</span>
          <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="form-input" style={{ padding: '0.3rem 0.5rem', fontSize: '0.78rem', width: '130px', margin: 0 }} />
          <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>to</span>
          <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="form-input" style={{ padding: '0.3rem 0.5rem', fontSize: '0.78rem', width: '130px', margin: 0 }} />
          <button 
            onClick={applyDateFilter}
            style={{ 
              background: '#13271e', 
              color: '#fff', 
              border: 'none', 
              borderRadius: '8px', 
              padding: '0.4rem 1rem', 
              fontSize: '0.78rem', 
              fontWeight: 700, 
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
            onMouseOver={e => e.currentTarget.style.backgroundColor = '#0b1812'}
            onMouseOut={e => e.currentTarget.style.backgroundColor = '#13271e'}
          >
            Apply Filter
          </button>
        </div>

        {/* Table Container (Scrollable) */}
        <div style={{ overflow: 'auto', flex: 1, paddingRight: '0.25rem', width: '100%' }}>
          <div style={{ minWidth: '650px' }}>
            {filteredExpenses.length === 0 ? (
              <div style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '3rem', fontSize: '0.85rem' }}>
                No transactions found for this date range.
              </div>
            ) : (
              <>
                {/* Table Header */}
                <div style={{ display: 'grid', gridTemplateColumns: 'var(--grid-finance-header-cols, 90px 1.5fr 120px 100px 90px 70px)', gap: '0.5rem', padding: '0.5rem', background: '#f8faf8', borderRadius: '8px', marginBottom: '0.5rem' }}>
                  {['Date', 'Description', 'Category', 'Payment', 'Amount', 'Actions'].map(h => (
                    <span key={h} style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>{h}</span>
                  ))}
                </div>
                {/* Rows */}
                {filteredExpenses.map(exp => (
                  <div key={exp.id} style={{ display: 'grid', gridTemplateColumns: 'var(--grid-finance-header-cols, 90px 1.5fr 120px 100px 90px 70px)', gap: '0.5rem', alignItems: 'center', padding: '0.6rem 0.5rem', borderBottom: '1px solid #f1f3ee' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      {new Date(exp.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                    <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {exp.description}
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', background: `${CAT_COLORS[exp.category]}18`, color: CAT_COLORS[exp.category] || '#9ca3af', fontSize: '0.72rem', fontWeight: 700, borderRadius: '6px', padding: '0.2rem 0.55rem', width: 'fit-content' }}>
                      {CAT_ICONS[exp.category]} {exp.category}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                      ≡ UPI
                    </span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: CAT_COLORS[exp.category] || '#9ca3af' }}>
                      ₹{exp.amount.toLocaleString('en-IN')}
                    </span>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button 
                        onClick={() => { triggerEdit(exp); setShowTxModal(false); }} 
                        title="Edit" 
                        style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem', padding: '0.1rem' }}
                      >
                        ✏️
                      </button>
                      <button 
                        onClick={() => handleDelete(exp.id)} 
                        title="Delete" 
                        style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem', padding: '0.1rem' }}
                      >
                        🗑
                      </button>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>

        {/* Footer / Close */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #eceee8', paddingTop: '0.75rem' }}>
          <button 
            onClick={() => setShowTxModal(false)}
            style={{ 
              background: '#13271e', 
              color: '#fff', 
              border: 'none', 
              borderRadius: '8px', 
              padding: '0.5rem 1.5rem', 
              fontSize: '0.8rem', 
              fontWeight: 700, 
              cursor: 'pointer' 
            }}
          >
            Close Window
          </button>
        </div>

      </div>
    </div>
  );
}
