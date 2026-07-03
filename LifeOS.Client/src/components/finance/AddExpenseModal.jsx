import React from 'react';

export function AddExpenseModal({
  showAddModal,
  setShowAddModal,
  editId,
  setEditId,
  form,
  setForm,
  handleAddExpense,
  submitting,
  CATEGORIES,
  CAT_ICONS,
  PAYMENT_METHODS
}) {
  if (!showAddModal) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center'
    }} onClick={() => { setShowAddModal(false); setEditId(null); setForm({ amount: '', category: 'Food', date: new Date().toLocaleDateString('en-CA'), paymentMethod: 'UPI' }); }}>
      <div style={{ background: '#fff', borderRadius: '18px', padding: '2rem', width: '380px', boxShadow: '0 20px 60px rgba(30,61,47,0.18)' }} onClick={e => e.stopPropagation()}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.25rem', color: 'var(--text-primary)' }}>
          {editId ? '✏️ Edit Expense' : '➕ Add Expense'}
        </h3>
        <form onSubmit={handleAddExpense} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.3rem' }}>Amount (₹)</label>
            <input type="number" placeholder="0.00" value={form.amount}
              onChange={e => setForm(p => ({ ...p, amount: e.target.value }))}
              className="form-input" required min="1"
              style={{ width: '100%', fontSize: '1.1rem', fontWeight: 700 }} />
          </div>
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.3rem' }}>Category</label>
            <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} className="form-input" style={{ width: '100%' }}>
              {CATEGORIES.map(c => <option key={c} value={c}>{CAT_ICONS[c]} {c}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.3rem' }}>Date</label>
            <input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} className="form-input" style={{ width: '100%' }} />
          </div>
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.3rem' }}>Payment Method</label>
            <select value={form.paymentMethod} onChange={e => setForm(p => ({ ...p, paymentMethod: e.target.value }))} className="form-input" style={{ width: '100%' }}>
              {PAYMENT_METHODS.map(m => <option key={m}>{m}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
            <button type="submit" className="btn-primary" disabled={submitting} style={{ flex: 1, justifyContent: 'center', background: '#13271e' }}>
              {submitting ? 'Saving…' : (editId ? 'Update' : 'Add Expense')}
            </button>
            <button type="button" onClick={() => { setShowAddModal(false); setEditId(null); setForm({ amount: '', category: 'Food', date: new Date().toLocaleDateString('en-CA'), paymentMethod: 'UPI' }); }}
              style={{ flex: 1, padding: '0.6rem', background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' }}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
