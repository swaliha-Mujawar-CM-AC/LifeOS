import React, { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { DonutChart } from '../components/finance/DonutChart';
import { AddExpenseModal } from '../components/finance/AddExpenseModal';
import { TransactionsModal } from '../components/finance/TransactionsModal';
const API = `http://${window.location.hostname}:5196/api`;

const CATEGORIES = ['Food', 'Entertainment', 'Bills', 'Health', 'Travel', 'Miscellaneous'];
const CAT_COLORS = {
  Food: '#f59e0b',
  Entertainment: '#8b5cf6',
  Bills: '#3b82f6',
  Health: '#22c55e',
  Travel: '#ef4444',
  Miscellaneous: '#6b7280',
};
const CAT_ICONS = {
  Food: '🍽',
  Entertainment: '🎬',
  Bills: '📄',
  Health: '❤️',
  Travel: '✈️',
  Miscellaneous: '📦',
};
const PAYMENT_METHODS = ['UPI', 'Card', 'Cash', 'Net Banking'];

// ─── Donut Chart moved to src/components/finance/DonutChart.jsx ───

export function UserFinance({ user, onUpdate }) {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [budget, setBudget] = useState(0);
  const [budgetInput, setBudgetInput] = useState('');
  const [budgetExists, setBudgetExists] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ amount: '', category: 'Food', date: new Date().toLocaleDateString('en-CA'), paymentMethod: 'UPI' });
  const [submitting, setSubmitting] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]);
  const [editId, setEditId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [dateFrom, setDateFrom] = useState(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`);
  const [dateTo, setDateTo] = useState(now.toLocaleDateString('en-CA'));
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [showTxModal, setShowTxModal] = useState(false);
  const [isFilterActive, setIsFilterActive] = useState(false);

  const userId = user?.id;

  const loadData = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const [budRes, expRes, sumRes, fbRes] = await Promise.all([
        fetch(`${API}/Expense/budget/${userId}/${year}/${month}`),
        fetch(`${API}/Expense/user/${userId}/${year}/${month}`),
        fetch(`${API}/Expense/summary/${userId}/${year}/${month}`),
        fetch(`${API}/Feedback/user/${userId}/category/Finance`),
      ]);
      if (budRes.ok) {
        const bData = await budRes.json();
        setBudget(bData.amount || 0);
        setBudgetExists(bData.exists);
        setBudgetInput(bData.amount > 0 ? bData.amount.toString() : '');
      }
      if (expRes.ok) {
        const exps = await expRes.json();
        setExpenses(exps);
        setFilteredExpenses(exps);
      }
      if (sumRes.ok) setSummary(await sumRes.json());
      if (fbRes.ok) setFeedbacks(await fbRes.json());
    } catch (e) { console.error('Finance load error', e); }
    finally { setLoading(false); }
  }, [userId, year, month]);

  useEffect(() => {
    setIsFilterActive(false);
    
    // Set default date range to first day of selected month -> today's date (if current month/year) or last day of selected month
    const firstDayStr = `${year}-${String(month).padStart(2, '0')}-01`;
    const today = new Date();
    let lastDayStr;
    if (today.getFullYear() === year && (today.getMonth() + 1) === month) {
      lastDayStr = today.toLocaleDateString('en-CA');
    } else {
      const lastDay = new Date(year, month, 0).getDate();
      lastDayStr = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
    }
    setDateFrom(firstDayStr);
    setDateTo(lastDayStr);

    loadData();
  }, [loadData]);

  const handleSetBudget = async () => {
    const amt = parseFloat(budgetInput);
    if (!amt || amt <= 0) return;
    await fetch(`${API}/Expense/budget`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, year, month, amount: amt }),
    });
    await loadData();
    toast.success('Budget updated!');
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!form.amount || parseFloat(form.amount) <= 0) return;
    setSubmitting(true);
    try {
      if (editId) {
        await fetch(`${API}/Expense/${editId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            description: form.category,
            amount: parseFloat(form.amount),
            type: 'Expense',
            category: form.category,
            date: new Date(form.date).toISOString(),
          }),
        });
        toast.success('Expense updated');
        setEditId(null);
      } else {
        await fetch(`${API}/Expense`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            description: form.category,
            amount: parseFloat(form.amount),
            type: 'Expense',
            category: form.category,
            date: new Date(form.date).toISOString(),
          }),
        });
        toast.success('Expense added');
      }
      setForm({ amount: '', category: 'Food', date: new Date().toLocaleDateString('en-CA'), paymentMethod: 'UPI' });
      setShowAddModal(false);
      await loadData();
      if (onUpdate) onUpdate();
    } catch { toast.error('Failed to save expense'); }
    finally { setSubmitting(false); }
  };

  const handleDelete = (id) => {
    toast((t) => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <span style={{ fontWeight: 600 }}>Delete this expense?</span>
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                await fetch(`${API}/Expense/${id}`, { method: 'DELETE' });
                await loadData();
                if (onUpdate) onUpdate();
                toast.success('Expense deleted');
              } catch (err) { console.error(err); }
            }}
            style={{ padding: '0.35rem 0.85rem', background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 700 }}
          >
            Delete
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            style={{ padding: '0.35rem 0.85rem', background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 700 }}
          >
            Cancel
          </button>
        </div>
      </div>
    ), { duration: Infinity, id: `delete-expense-${id}` });
  };

  const triggerEdit = (exp) => {
    setEditId(exp.id);
    setForm({ amount: exp.amount.toString(), category: exp.category, date: exp.date.split('T')[0], paymentMethod: 'UPI' });
    setShowAddModal(true);
  };

  const applyDateFilter = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/Expense/user/${userId}/range?from=${dateFrom}&to=${dateTo}`);
      if (res.ok) {
        const data = await res.json();
        const expensesOnly = data.filter(e => e.type === "Expense");
        setFilteredExpenses(expensesOnly);
        setIsFilterActive(true);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch range data');
    } finally {
      setLoading(false);
    }
  };

  const handleResetFilter = () => {
    const currentNow = new Date();
    const currentMonth = currentNow.getMonth() + 1;
    const currentYear = currentNow.getFullYear();
    
    if (month === currentMonth && year === currentYear) {
      setIsFilterActive(false);
      setDateFrom(`${currentYear}-${String(currentMonth).padStart(2, '0')}-01`);
      setDateTo(currentNow.toLocaleDateString('en-CA'));
      loadData();
    } else {
      setMonth(currentMonth);
      setYear(currentYear);
    }
  };

  const totalSpent = summary?.totalExpense || 0;
  const moneySaved = budget - totalSpent;
  const spentPct = budget > 0 ? Math.min(100, Math.round((totalSpent / budget) * 100)) : 0;
  const savedPct = budget > 0 ? Math.max(0, 100 - spentPct) : 0;
  const avgDailySpend = totalSpent > 0 ? (totalSpent / (new Date(year, month, 0).getDate())).toFixed(1) : 0;

  // Analytics calculations (filtered if range active)
  let displayTotalSpent = totalSpent;
  let displayAvgDailySpend = avgDailySpend;
  let displayCategoryBreakdown = summary?.categoryBreakdown || [];

  if (isFilterActive) {
    displayTotalSpent = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
    
    const fromDate = new Date(dateFrom);
    const toDate = new Date(dateTo);
    const diffDays = Math.max(1, Math.ceil(Math.abs(toDate - fromDate) / (1000 * 60 * 60 * 24)) + 1);
    displayAvgDailySpend = (displayTotalSpent / diffDays).toFixed(1);

    const categoriesMap = {};
    CATEGORIES.forEach(c => { categoriesMap[c] = 0; });
    filteredExpenses.forEach(e => {
      if (categoriesMap[e.category] !== undefined) {
        categoriesMap[e.category] += e.amount;
      }
    });
    displayCategoryBreakdown = Object.keys(categoriesMap)
      .map(cat => ({ category: cat, amount: categoriesMap[cat] }))
      .filter(c => c.amount > 0)
      .sort((a, b) => b.amount - a.amount);
  }

  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const displayedTx = filteredExpenses.slice(0, 5);

  const todayDate = new Date();
  const isDefaultPresentMonth = !isFilterActive && month === (todayDate.getMonth() + 1) && year === todayDate.getFullYear();

  return (
    <div style={{ padding: '0.5rem 0', outline: 'none' }}>

      {/* ── ADD / EDIT EXPENSE MODAL ── */}
      <AddExpenseModal
        showAddModal={showAddModal}
        setShowAddModal={setShowAddModal}
        editId={editId}
        setEditId={setEditId}
        form={form}
        setForm={setForm}
        handleAddExpense={handleAddExpense}
        submitting={submitting}
        CATEGORIES={CATEGORIES}
        CAT_ICONS={CAT_ICONS}
        PAYMENT_METHODS={PAYMENT_METHODS}
      />

      {/* ── VIEW ALL TRANSACTIONS MODAL ── */}
      <TransactionsModal
        showTxModal={showTxModal}
        setShowTxModal={setShowTxModal}
        dateFrom={dateFrom}
        setDateFrom={setDateFrom}
        dateTo={dateTo}
        setDateTo={setDateTo}
        applyDateFilter={applyDateFilter}
        filteredExpenses={filteredExpenses}
        CAT_COLORS={CAT_COLORS}
        CAT_ICONS={CAT_ICONS}
        triggerEdit={triggerEdit}
        handleDelete={handleDelete}
      />

      {/* ── PAGE HEADER ── */}
      <div className="page-header" style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <h1 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, color: '#132a1e', display: 'flex', alignItems: 'center', gap: '0.2rem', letterSpacing: '0.5px' }}>
            <span style={{ color: 'var(--accent-green)', display: 'inline-flex', fontSize: '1rem', fontWeight: 'bold' }}>₹</span> Expenses
          </h1>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
            — Track, analyze and improve your spending
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginRight: '2.5rem' }}>
          <select value={month} onChange={e => setMonth(parseInt(e.target.value))} className="form-input" style={{ padding: '0.4rem 0.6rem', width: 'auto', fontSize: '0.82rem' }}>
            {monthNames.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
          </select>
          <select value={year} onChange={e => setYear(parseInt(e.target.value))} className="form-input" style={{ padding: '0.4rem 0.6rem', width: 'auto', fontSize: '0.82rem' }}>
            {[2024, 2025, 2026, 2027].map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          <button className="btn-primary" onClick={() => setShowAddModal(true)} style={{ background: '#13271e', padding: '0.45rem 1.1rem', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
            + Add Expense
          </button>
        </div>
      </div>

      {/* ── 3 STAT CARDS ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'var(--grid-finance-summary-cols, repeat(3, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
        {/* Monthly Budget */}
        <div className="dashboard-card" style={{ padding: '0.65rem 1rem', marginBottom: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '0.15rem' }}>Monthly Budget</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>₹{budget.toLocaleString('en-IN')}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ height: 4, borderRadius: 2, background: '#eceee8', overflow: 'hidden', width: '100px' }}>
                <div style={{ height: '100%', borderRadius: 2, width: `${spentPct}%`, background: spentPct > 80 ? '#ef4444' : 'var(--accent-green)' }} />
              </div>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{spentPct}% used</span>
            </div>
            <div style={{ marginTop: '0.35rem', display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
              <input type="number" placeholder="Set budget…" value={budgetInput} onChange={e => setBudgetInput(e.target.value)}
                className="form-input" min="0" style={{ width: '85px', padding: '0.15rem 0.35rem', fontSize: '0.72rem', margin: 0 }} />
              <button onClick={handleSetBudget} style={{ background: '#13271e', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.15rem 0.5rem', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer' }}>
                {budgetExists ? 'Update' : 'Set'}
              </button>
            </div>
          </div>
          <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(30,61,47,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.05rem' }}>💼</div>
        </div>

        {/* Total Spent */}
        <div className="dashboard-card" style={{ padding: '0.65rem 1rem', marginBottom: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '0.15rem' }}>Total Spent</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ef4444', marginBottom: '0.25rem' }}>₹{totalSpent.toLocaleString('en-IN')}</div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              Avg ₹{avgDailySpend}/day
            </div>
          </div>
          <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(239,68,68,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.05rem' }}>📉</div>
        </div>

        {/* Money Saved */}
        <div className="dashboard-card" style={{ padding: '0.65rem 1rem', marginBottom: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '0.15rem' }}>Money Saved</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: moneySaved >= 0 ? 'var(--accent-green)' : '#ef4444', marginBottom: '0.25rem' }}>₹{Math.abs(moneySaved).toLocaleString('en-IN')}</div>
            <div style={{ fontSize: '0.65rem', color: moneySaved >= 0 ? 'var(--accent-green)' : '#ef4444', fontWeight: 600 }}>
              {moneySaved >= 0 ? `${savedPct}% saved` : 'Over budget'}
            </div>
          </div>
          <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(34,197,94,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.05rem' }}>🐷</div>
        </div>
      </div>

      {/* ── ANALYTICS SECTION ── */}
      <div className="dashboard-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        {/* Analytics header with date range */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>Analytics</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0 0', fontWeight: 500 }}>View expense insights and transactions for a specific period</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600, whiteSpace: 'nowrap' }}>Select Date Range</span>
            <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="form-input" style={{ padding: '0.3rem 0.5rem', fontSize: '0.78rem', width: '130px' }} />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>to</span>
            <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="form-input" style={{ padding: '0.3rem 0.5rem', fontSize: '0.78rem', width: '130px' }} />
            <button onClick={applyDateFilter} style={{ background: '#13271e', color: '#fff', border: 'none', borderRadius: '9px', padding: '0.38rem 1rem', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>
              Apply
            </button>
            {!isDefaultPresentMonth && (
              <button 
                onClick={handleResetFilter}
                title="Reset to present month"
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--accent-green)',
                  cursor: 'pointer',
                  padding: '4px',
                  borderRadius: '50%',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(30, 61, 47, 0.06)',
                  width: '28px',
                  height: '28px',
                  transition: 'all 0.2s',
                }}
                onMouseOver={e => e.currentTarget.style.backgroundColor = 'rgba(30, 61, 47, 0.12)'}
                onMouseOut={e => e.currentTarget.style.backgroundColor = 'rgba(30, 61, 47, 0.06)'}
              >
                <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" strokeWidth="2.8" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                  <polyline points="3 3 3 8 8 8"/>
                </svg>
              </button>
            )}
          </div>
        </div>
        {/* 2-column analytics grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'var(--grid-finance-body-cols, 1fr 2.3fr)', gap: '1.25rem', marginTop: '1rem' }}>

          {/* Spending Comparison */}
          <div style={{ background: '#f8faf8', borderRadius: '14px', padding: '1.1rem', border: '1px solid #eceee8' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.2rem' }}>Spending Comparison</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>{isFilterActive ? 'Summary for selected range' : 'Compared to previous month'}</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'var(--grid-finance-inputs-cols, 1fr 1fr)', gap: '0.75rem' }}>
              <div style={{ background: '#fff', borderRadius: '10px', padding: '0.85rem', border: '1px solid #eceee8', textAlign: 'center' }}>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '0.35rem' }}>Total Spent</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>₹{displayTotalSpent.toLocaleString('en-IN')}</div>
                <div style={{ fontSize: '0.68rem', color: '#ef4444', marginTop: '0.3rem' }}>{isFilterActive ? 'during period' : '↗ this month'}</div>
              </div>
              <div style={{ background: '#fff', borderRadius: '10px', padding: '0.85rem', border: '1px solid #eceee8', textAlign: 'center' }}>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '0.35rem' }}>Avg Daily Spend</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>₹{displayAvgDailySpend}</div>
                <div style={{ fontSize: '0.68rem', color: 'var(--accent-green)', marginTop: '0.3rem' }}>{isFilterActive ? 'average per day' : '↗ per day'}</div>
              </div>
            </div>
          </div>

          {/* Merged Expense Distribution & Category Breakdown */}
          <div style={{ background: '#f8faf8', borderRadius: '14px', padding: '1.1rem 1.4rem', border: '1px solid #eceee8' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>Expense Breakdown</div>
            {displayCategoryBreakdown.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'var(--grid-finance-chart-cols, 160px 1fr)', gap: '2.5rem', alignItems: 'center' }}>
                {/* Left: Donut Chart */}
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <DonutChart data={displayCategoryBreakdown} total={displayTotalSpent} size={150} />
                </div>
                
                {/* Right: Category List */}
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'var(--grid-finance-cat-breakdown-cols, 100px 1fr 45px 80px)', gap: '0.5rem', marginBottom: '0.4rem', borderBottom: '1px solid #eceee8', paddingBottom: '0.2rem' }}>
                    <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Category</span>
                    <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.4px', gridColumn: 'span 2' }}>% of Total</span>
                    <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.4px', textAlign: 'right' }}>Amount</span>
                  </div>
                  {displayCategoryBreakdown.map(c => {
                    const pct = displayTotalSpent > 0 ? Math.round((c.amount / displayTotalSpent) * 100) : 0;
                    const catColor = CAT_COLORS[c.category] || '#9ca3af';
                    return (
                      <div key={c.category} style={{ display: 'grid', gridTemplateColumns: 'var(--grid-finance-cat-breakdown-cols, 100px 1fr 45px 80px)', gap: '0.5rem', alignItems: 'center', padding: '0.4rem 0', borderBottom: '1px solid #f1f3ee' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <span style={{ width: 8, height: 8, borderRadius: '50%', background: catColor, flexShrink: 0 }} />
                          <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-primary)' }}>{c.category}</span>
                        </div>
                        <div style={{ height: 5, borderRadius: 2.5, background: '#e5e7eb', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${pct}%`, background: catColor, borderRadius: 2.5 }} />
                        </div>
                        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)', textAlign: 'right' }}>{pct}%</span>
                        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: catColor, textAlign: 'right' }}>₹{c.amount.toLocaleString('en-IN')}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', padding: '1.5rem', textAlign: 'center' }}>No expenses to chart</div>
            )}
          </div>
        </div>
      </div>

      {/* ── TRANSACTIONS + COACH FEEDBACK ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'var(--grid-finance-bottom-cols, 1.5fr 1fr)', gap: '1.25rem', marginBottom: '1.5rem' }}>

        {/* Transactions Table */}
        <div className="dashboard-card" style={{ padding: '1.25rem', marginBottom: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              Transactions
            </h3>
          </div>

          {loading ? (
            <div style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '1.5rem' }}>Loading…</div>
          ) : filteredExpenses.length === 0 ? (
            <div style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '1.5rem', fontSize: '0.85rem' }}>No transactions for this period</div>
          ) : (
            <>
              <div style={{ overflowX: 'auto', width: '100%' }}>
                <div style={{ minWidth: '600px' }}>
                  {/* Table Header */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'var(--grid-finance-history-cols, 80px 1fr 110px 90px 80px 60px)', gap: '0.5rem', padding: '0.4rem 0.5rem', background: '#f8faf8', borderRadius: '8px', marginBottom: '0.4rem' }}>
                    {['Date', 'Description', 'Category', 'Payment', 'Amount', ''].map(h => (
                      <span key={h} style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>{h}</span>
                    ))}
                  </div>
                  {/* Rows */}
                  {displayedTx.map(exp => (
                    <div key={exp.id} style={{ display: 'grid', gridTemplateColumns: 'var(--grid-finance-history-cols, 80px 1fr 110px 90px 80px 60px)', gap: '0.5rem', alignItems: 'center', padding: '0.55rem 0.5rem', borderBottom: '1px solid #f1f3ee' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        {new Date(exp.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                      <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{exp.description}</span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', background: `${CAT_COLORS[exp.category]}18`, color: CAT_COLORS[exp.category] || '#9ca3af', fontSize: '0.72rem', fontWeight: 700, borderRadius: '6px', padding: '0.2rem 0.55rem', whiteSpace: 'nowrap' }}>
                        {CAT_ICONS[exp.category]} {exp.category}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        ≡ UPI
                      </span>
                      <span style={{ fontSize: '0.85rem', fontWeight: 800, color: CAT_COLORS[exp.category] || '#9ca3af' }}>₹{exp.amount.toLocaleString('en-IN')}</span>
                      <div style={{ display: 'flex', gap: '0.25rem' }}>
                        <button onClick={() => triggerEdit(exp)} title="Edit" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.15rem', fontSize: '0.85rem' }}>✏️</button>
                        <button onClick={() => handleDelete(exp.id)} title="Delete" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.15rem', fontSize: '0.85rem' }}>🗑</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {filteredExpenses.length > 0 && (
                <button 
                  onClick={() => setShowTxModal(true)} 
                  style={{ 
                    marginTop: '0.75rem', 
                    background: '#13271e', 
                    color: '#ffffff', 
                    border: 'none', 
                    borderRadius: '8px', 
                    padding: '0.45rem 1.1rem', 
                    fontSize: '0.78rem', 
                    fontWeight: 700, 
                    cursor: 'pointer', 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '0.35rem',
                    transition: 'background 0.2s'
                  }}
                  onMouseOver={e => e.currentTarget.style.backgroundColor = '#0b1812'}
                  onMouseOut={e => e.currentTarget.style.backgroundColor = '#13271e'}
                >
                  View All Transactions →
                </button>
              )}
            </>
          )}
        </div>

        {/* Coach Feedback */}
        <div className="dashboard-card" style={{ padding: '1.25rem', marginBottom: 0 }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            👤 Coach Feedback
          </h3>
          {feedbacks.length === 0 ? (
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', padding: '1rem 0', textAlign: 'center' }}>No coach feedback yet.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {feedbacks.slice(0, 4).map((f, i) => {
                const bgs = ['rgba(34,197,94,0.07)', 'rgba(234,179,8,0.07)', 'rgba(59,130,246,0.07)', 'rgba(139,92,246,0.07)'];
                const borders = ['#22c55e', '#eab308', '#3b82f6', '#8b5cf6'];
                return (
                  <div key={f.id} style={{ background: bgs[i % 4], border: `1px solid ${borders[i % 4]}30`, borderRadius: '10px', padding: '0.75rem 0.9rem', borderLeft: `3px solid ${borders[i % 4]}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 800, color: borders[i % 4] }}>
                        Coach {f.coachName}
                      </span>
                      <span style={{ fontSize: '0.68rem', color: '#9ca3af' }}>
                        {f.createdAt && new Date(f.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: '1.45' }}>{f.feedbackText}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
