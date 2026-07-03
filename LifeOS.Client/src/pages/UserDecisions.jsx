import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CoachPrivacyModal } from '../components/decisions/CoachPrivacyModal';
import { CategorySelectModal } from '../components/decisions/CategorySelectModal';
import { ProsConsTool } from '../components/decisions/ProsConsTool';
import { SwotTool } from '../components/decisions/SwotTool';
import { TenTenTenTool } from '../components/decisions/TenTenTenTool';
import { FiveWhysTool } from '../components/decisions/FiveWhysTool';
import { DecisionMatrixTool } from '../components/decisions/DecisionMatrixTool';
const API = `http://${window.location.hostname}:5196/api`;

const CATEGORIES = ['Career', 'Personal', 'Relationship', 'Health', 'Finance', 'Lifestyle', 'Study'];

const CAT_THEMES = {
  Health:       { icon: '🌱', dot: '#27ae60' },
  Personal:     { icon: '💡', dot: '#F5A623' },
  Relationship: { icon: '👥', dot: '#00B4D8' },
  Lifestyle:    { icon: '📘', dot: '#9B5DE5' },
  Finance:      { icon: '💰', dot: '#e67e22' },
  Career:       { icon: '📈', dot: '#2980b9' },
  Study:        { icon: '📚', dot: '#8e44ad' },
  Default:      { icon: '💡', dot: '#F5A623' },
};

const getTheme = (cat = 'Career') => CAT_THEMES[cat] || CAT_THEMES.Default;

const DECISION_TOOLS = [
  {
    id: 'pros-cons',
    label: 'Pros & Cons',
    description: 'Weigh benefits against drawbacks to see if the decision is worth it.',
  },
  {
    id: 'swot',
    label: 'SWOT Analysis',
    description: 'Explore Strengths, Weaknesses, Opportunities, and Threats for a 360-degree view.',
  },
  {
    id: 'ten-ten-ten',
    label: '10/10/10 Rule',
    description: 'Ask how you will feel about this in 10 minutes, 10 months, and 10 years.',
  },
  {
    id: 'five-whys',
    label: '5 Whys',
    description: 'Ask why five times to drill down to the root cause of the situation.',
  },
  {
    id: 'decision-matrix',
    label: 'Decision Matrix',
    description: 'Compare options objectively by scoring them against criteria.',
  },
];

const PROBLEM_SOLVING_TECHNIQUES = [
  {
    title: '5 Whys',
    desc: 'Drill down to find the root cause.',
    color: '#2b533a',
    bg: '#d6e8dc',
  },
  {
    title: 'SWOT Analysis',
    desc: 'Understand strengths, weaknesses, opportunities, and threats.',
    color: '#028090',
    bg: '#e0f2f1',
  },
  {
    title: 'Decision Matrix',
    desc: 'Compare options based on what matters most.',
    color: '#6a4c93',
    bg: '#f0e6ff',
  },
  {
    title: '10/10/10 Rule',
    desc: 'Evaluate impact after 10 minutes, 10 months, and 10 years.',
    color: '#d97706',
    bg: '#fef3c7',
  },
  {
    title: 'Cost-Benefit Analysis',
    desc: 'Compare total expected cost against total expected benefit.',
    color: '#b33939',
    bg: '#ffdddd',
  },
];

// ─── Inline Editable Node ─────────────────────────────────────────────────────
function EditableNode({ label, icon, iconBg, iconColor, value, placeholder, onChange, accentColor, wide }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value || '');
  const textareaRef = useRef(null);

  useEffect(() => { setDraft(value || ''); }, [value]);

  const startEdit = () => {
    setDraft(value || '');
    setEditing(true);
    setTimeout(() => textareaRef.current?.focus(), 50);
  };

  const commit = () => {
    setEditing(false);
    if (draft !== value) onChange(draft);
  };

  return (
    <div
      onClick={!editing ? startEdit : undefined}
      style={{
        background: '#FFFFFF',
        border: `1.5px solid ${editing ? accentColor || 'var(--accent-green)' : 'var(--border-color)'}`,
        borderRadius: '16px',
        padding: '0.9rem 1rem',
        width: wide ? '200px' : '190px',
        minHeight: '130px',
        flexShrink: 0,
        boxShadow: editing
          ? `0 0 0 3px ${accentColor ? accentColor + '20' : 'rgba(43,83,58,0.12)'}`
          : 'var(--box-shadow-soft)',
        cursor: editing ? 'default' : 'pointer',
        transition: 'all 0.2s',
        position: 'relative',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          {icon && (
            <span style={{
              background: iconBg || 'var(--accent-green-light)',
              color: iconColor || 'var(--accent-green)',
              borderRadius: '50%', width: 24, height: 24,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.8rem',
            }}>{icon}</span>
          )}
          <span style={{ fontSize: '0.8rem', fontWeight: 800, color: iconColor || 'var(--accent-green)' }}>{label}</span>
        </div>
        <span style={{ fontSize: '0.7rem', color: '#aaa', cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); startEdit(); }}>✏️</span>
      </div>

      {editing ? (
        <textarea
          ref={textareaRef}
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={e => { if (e.key === 'Escape') { setEditing(false); } }}
          placeholder={placeholder}
          rows={4}
          style={{
            width: '100%', border: 'none', outline: 'none',
            fontFamily: 'var(--font-main)', fontSize: '0.75rem',
            color: 'var(--text-primary)', background: 'transparent',
            resize: 'none', lineHeight: 1.5,
          }}
        />
      ) : (
        <p style={{ fontSize: '0.75rem', color: value ? 'var(--text-primary)' : '#bbb', lineHeight: '1.5', fontWeight: value ? 600 : 400 }}>
          {value || placeholder}
        </p>
      )}
    </div>
  );
}

// ─── Learning / Key Takeaway Node ────────────────────────────────────────────
function LearningNode({ value, onChange }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value || '');
  const textareaRef = useRef(null);

  useEffect(() => { setDraft(value || ''); }, [value]);

  const startEdit = () => {
    setDraft(value || '');
    setEditing(true);
    setTimeout(() => textareaRef.current?.focus(), 50);
  };

  const commit = () => {
    setEditing(false);
    if (draft !== value) onChange(draft);
  };

  return (
    <div
      onClick={!editing ? startEdit : undefined}
      style={{
        background: '#FFFFFF', border: `1.5px solid ${editing ? 'var(--accent-green)' : 'var(--border-color)'}`,
        borderRadius: '16px', padding: '0.9rem 1rem', width: '190px', minHeight: '140px',
        flexShrink: 0, boxShadow: editing ? '0 0 0 3px rgba(43,83,58,0.12)' : 'var(--box-shadow-soft)',
        cursor: editing ? 'default' : 'pointer', transition: 'all 0.2s',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{ background: 'var(--accent-green-light)', color: 'var(--accent-green)', borderRadius: '50%', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>🌱</span>
          <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--accent-green)' }}>Learning / Key Takeaway</span>
        </div>
        <span style={{ fontSize: '0.7rem', color: '#aaa', cursor: 'pointer' }} onClick={e => { e.stopPropagation(); startEdit(); }}>✏️</span>
      </div>
      {editing ? (
        <textarea
          ref={textareaRef}
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={e => { if (e.key === 'Escape') setEditing(false); }}
          placeholder="What did you learn from this?"
          rows={4}
          style={{ width: '100%', border: 'none', outline: 'none', fontFamily: 'var(--font-main)', fontSize: '0.75rem', color: 'var(--text-primary)', background: 'transparent', resize: 'none', lineHeight: 1.5 }}
        />
      ) : (
        <p style={{ fontSize: '0.75rem', color: value ? 'var(--text-primary)' : '#bbb', lineHeight: '1.5', fontWeight: value ? 600 : 400, marginBottom: '0.5rem' }}>
          {value || 'Click to add what you learned…'}
        </p>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function UserDecisions({ user, onUpdate }) {
  const [decisions, setDecisions] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTool, setActiveTool] = useState('pros-cons');
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showCategorySelector, setShowCategorySelector] = useState(false);
  const [coachSending, setCoachSending] = useState(false);
  const [coachFeedbacks, setCoachFeedbacks] = useState([]);
  const [coachFeedbackLoading, setCoachFeedbackLoading] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('All');

  const userId = user?.id;

  const loadData = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const [dRes, fbRes] = await Promise.all([
        fetch(`${API}/Decision/user/${userId}`),
        fetch(`${API}/Feedback/user/${userId}/category/Decisions`),
      ]);
      if (dRes.ok) {
        const data = await dRes.json();
        setDecisions(data);
        if (data.length > 0 && !selectedId) setSelectedId(data[0].id);
      }
      if (fbRes.ok) setFeedbacks(await fbRes.json());
    } catch (e) { console.error('Decision load error', e); }
    finally { setLoading(false); }
  }, [userId, selectedId]);

  useEffect(() => { loadData(); }, [loadData]);

  // Load coach feedbacks for the selected decision
  useEffect(() => {
    if (!userId || !selectedId) {
      setCoachFeedbacks([]);
      return;
    }
    setCoachFeedbackLoading(true);
    fetch(`${API}/Feedback/user/${userId}/category/Decision-${selectedId}`)
      .then(r => r.ok ? r.json() : [])
      .then(data => setCoachFeedbacks(Array.isArray(data) ? data : []))
      .catch(() => setCoachFeedbacks([]))
      .finally(() => setCoachFeedbackLoading(false));
  }, [userId, selectedId]);

  const selectedDecision = decisions.find(d => d.id === selectedId);

  // Inline-edit a field and auto-save
  const patchField = async (field, value) => {
    if (!selectedDecision) return;
    const updated = { ...selectedDecision, [field]: value };
    try {
      const res = await fetch(`${API}/Decision/${selectedDecision.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...updated, userId }),
      });
      if (res.ok) {
        const saved = await res.json();
        setDecisions(prev => prev.map(d => d.id === saved.id ? saved : d));
        if (onUpdate) onUpdate();
      }
    } catch (e) { console.error(e); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this decision?')) return;
    await fetch(`${API}/Decision/${id}`, { method: 'DELETE' });
    setSelectedId(null);
    await loadData();
    if (onUpdate) onUpdate();
  };

  const handleCoachConfirm = async () => {
    if (!selectedDecision) return;
    setCoachSending(true);
    try {
      // 1. Notify the user that it was shared
      await fetch(`${API}/Notification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          title: 'Decision sent to coach',
          message: `Your decision "${selectedDecision.title}" has been shared with your coach for review.`,
          type: 'CoachFeedback',
          category: selectedDecision.category || 'General',
        }),
      });

      // 2. Notify the assigned coach
      if (user?.assignedCoachId) {
        await fetch(`${API}/Notification`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.assignedCoachId,
            title: 'Decision Help Request',
            message: `User ${user.username || 'Client'} asked for help regarding "${selectedDecision.title}"`,
            type: 'CoachFeedback',
            category: 'Decisions',
          }),
        });
      }
    } catch (e) { console.error(e); }
    finally { setCoachSending(false); setShowPrivacyModal(false); }
  };

  const timeAgo = (dateStr) => {
    if (!dateStr) return '';
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
    const wks = Math.floor(days / 7);
    return `${wks} week${wks > 1 ? 's' : ''} ago`;
  };

  const filteredDecisions = decisions.filter(d => categoryFilter === 'All' || d.category === categoryFilter);
  const pendingDecisions = filteredDecisions.filter(d => !d.actualOutcome);
  const completedDecisions = filteredDecisions.filter(d => !!d.actualOutcome);

  return (
    <>
      {showPrivacyModal && (
        <CoachPrivacyModal
          onConfirm={handleCoachConfirm}
          onCancel={() => setShowPrivacyModal(false)}
          loading={coachSending}
        />
      )}
      {showCategorySelector && (
        <CategorySelectModal
          userId={userId}
          onSaved={async (saved) => {
            setShowCategorySelector(false);
            await loadData();
            setSelectedId(saved.id);
            if (onUpdate) onUpdate();
          }}
          onClose={() => setShowCategorySelector(false)}
        />
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'var(--grid-decision-main-cols, 300px 1fr)', gap: '1.25rem', height: 'var(--grid-decision-main-height, calc(100vh - 140px))', minHeight: 0 }}>

        {/* ── LEFT SIDEBAR ──────────────────────────────────────────── */}
        <div style={{ background: '#FFFFFF', border: '1px solid var(--border-color)', borderRadius: '22px', padding: '1.25rem', display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
            <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 800, fontSize: '1rem', color: '#132a1e', margin: 0, letterSpacing: '0.5px' }}>
              🌱 <span>Your Decisions</span>
            </h1>
            <button
              onClick={() => setShowCategorySelector(true)}
              style={{ background: 'var(--accent-green-light)', border: 'none', borderRadius: '8px', padding: '0.3rem 0.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
              title="Add new decision"
            >
              <span style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>+</span>
            </button>
          </div>
          <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '0.75rem' }}>Reflect. Learn. Grow.</p>

          {/* Category Filter Selector */}
          <div style={{ marginBottom: '1rem' }}>
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              style={{
                width: '100%',
                padding: '0.45rem 0.75rem',
                borderRadius: '10px',
                border: '1px solid var(--border-color)',
                fontSize: '0.78rem',
                fontWeight: 700,
                outline: 'none',
                background: '#FAFBF8',
                color: 'var(--text-secondary)'
              }}
            >
              <option value="All">All Categories</option>
              {CATEGORIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Scrollable list */}
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.6rem', paddingRight: '0.25rem' }}>
            {loading ? (
              <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem', fontSize: '0.85rem' }}>Loading…</p>
            ) : filteredDecisions.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '1rem' }}>No decisions found.</p>
                <button onClick={() => setShowCategorySelector(true)} style={{ background: 'var(--accent-green)', color: '#fff', border: 'none', borderRadius: '12px', padding: '0.6rem 1.2rem', fontFamily: 'var(--font-main)', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}>
                  + Add Decision
                </button>
              </div>
            ) : (
              <>
                {completedDecisions.map(d => {
                  const theme = getTheme(d.category);
                  const isSelected = d.id === selectedId;
                  return (
                    <div
                      key={d.id}
                      onClick={() => setSelectedId(d.id)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '0.7rem',
                        padding: '0.75rem 0.9rem', borderRadius: '14px', cursor: 'pointer',
                        background: isSelected ? 'var(--accent-green-light)' : '#FAFBF8',
                        border: `1.5px solid ${isSelected ? 'var(--accent-green)' : '#ECEEE8'}`,
                        transition: 'all 0.2s',
                      }}
                    >
                      <div style={{ width: 10, height: 10, borderRadius: '50%', background: theme.dot, flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 800, fontSize: '0.84rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.title || d.description || 'Untitled Decision'}</div>
                        <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', fontWeight: 700, marginTop: '0.1rem' }}>
                          {d.category} • {timeAgo(d.createdAt || d.updatedAt)}
                        </div>
                      </div>
                      <span style={{ color: isSelected ? 'var(--accent-green)' : '#D0D4CA', fontWeight: 'bold', fontSize: '0.8rem' }}>›</span>
                    </div>
                  );
                })}

                {pendingDecisions.length > 0 && (
                  <>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', padding: '0.4rem 0.5rem 0.2rem', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <span style={{ background: '#fef3c7', color: '#d97706', borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 900 }}>{pendingDecisions.length}</span>
                      Remaining Reflections
                    </div>
                    <p style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', padding: '0 0.5rem', marginBottom: '0.25rem' }}>Decisions needing your reflection</p>
                    {pendingDecisions.map(d => {
                      const theme = getTheme(d.category);
                      const isSelected = d.id === selectedId;
                      return (
                        <div
                          key={d.id}
                          onClick={() => setSelectedId(d.id)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '0.7rem',
                            padding: '0.65rem 0.9rem', borderRadius: '12px', cursor: 'pointer',
                            background: isSelected ? 'var(--accent-green-light)' : '#FAFBF8',
                            border: `1.5px solid ${isSelected ? 'var(--accent-green)' : '#ECEEE8'}`,
                            transition: 'all 0.2s',
                          }}
                        >
                          <div style={{ width: 8, height: 8, borderRadius: '50%', background: theme.dot, flexShrink: 0 }} />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.title || d.description || 'Untitled Decision'}</div>
                            <div style={{ fontSize: '0.66rem', color: 'var(--text-secondary)', fontWeight: 600, marginTop: '0.05rem' }}>{timeAgo(d.createdAt || d.updatedAt)}</div>
                          </div>
                          <span style={{ background: '#fef3c7', color: '#d97706', fontSize: '0.62rem', fontWeight: 800, padding: '0.15rem 0.45rem', borderRadius: '8px' }}>Pending</span>
                        </div>
                      );
                    })}
                  </>
                )}
              </>
            )}
          </div>
        </div>

        {/* ── CENTER MAIN (Covers till right end) ────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', height: '100%', minHeight: 0, overflowY: 'auto' }}>

          {/* Decision Map Card (Full Width) */}
          <div style={{ background: '#FFFFFF', border: '1px solid var(--border-color)', borderRadius: '22px', padding: '1.5rem 1.75rem', flexShrink: 0 }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.3rem' }}>
              <div>
                <h3 style={{ fontWeight: 900, fontSize: '1.05rem', color: 'var(--text-primary)', margin: 0 }}>Decision Map</h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600, marginTop: '0.15rem' }}>
                  {selectedDecision ? 'Click any box to edit and build your decision.' : 'Select or create a decision to get started.'}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                <button
                  onClick={() => setShowCategorySelector(true)}
                  style={{
                    background: 'none',
                    border: '1px solid var(--border-color)',
                    borderRadius: '12px',
                    width: '32px',
                    height: '32px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    color: 'var(--text-secondary)'
                  }}
                  title="Create new empty map"
                >
                  +
                </button>
                <button
                  onClick={() => { if (selectedDecision) setShowPrivacyModal(true); }}
                  disabled={!selectedDecision}
                  style={{
                    background: selectedDecision ? '#D32F2F' : '#ccc',
                    color: '#fff', border: 'none', borderRadius: '12px',
                    padding: '0.5rem 1rem', cursor: selectedDecision ? 'pointer' : 'not-allowed',
                    fontFamily: 'var(--font-main)', fontWeight: 700, fontSize: '0.82rem',
                    display: 'flex', alignItems: 'center', gap: '0.4rem',
                    transition: 'all 0.2s',
                  }}
                >
                  Ask Coach for Suggestions
                </button>
                {selectedDecision && (
                  <button
                    onClick={() => handleDelete(selectedDecision.id)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '0.4rem',
                      display: 'flex',
                      alignItems: 'center',
                      color: '#e04a58',
                    }}
                    title="Delete decision"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      <line x1="10" y1="11" x2="10" y2="17" />
                      <line x1="14" y1="11" x2="14" y2="17" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {selectedDecision ? (
              /* ── Decision Map Diagram ── */
              <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginTop: '1.25rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>

                {/* Problem node */}
                <EditableNode
                  label="Problem / Situation"
                  icon="?"
                  iconBg="var(--accent-green-light)"
                  iconColor="var(--accent-green)"
                  accentColor="var(--accent-green)"
                  value={selectedDecision.description}
                  placeholder="Describe the problem or situation…"
                  onChange={v => patchField('description', v)}
                />

                {/* Arrow */}
                <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0, margin: '0 0.5rem' }}>
                  <div style={{ width: 28, height: 2, background: 'var(--accent-green)' }} />
                  <div style={{ width: 0, height: 0, borderTop: '5px solid transparent', borderBottom: '5px solid transparent', borderLeft: '7px solid var(--accent-green)' }} />
                </div>

                {/* Decision node */}
                <EditableNode
                  label="Decision"
                  icon="💡"
                  iconBg="#FDF2E2"
                  iconColor="#F5A623"
                  accentColor="#F5A623"
                  value={selectedDecision.title}
                  placeholder="What decision did you make?"
                  onChange={v => patchField('title', v)}
                />

                {/* Branching SVG */}
                <div style={{ position: 'relative', width: 45, height: 180, flexShrink: 0 }}>
                  <svg width="45" height="180" viewBox="0 0 45 180" fill="none">
                    <path d="M 0 90 H 12 C 22 90, 22 30, 34 30 H 42" stroke="#F5A623" strokeWidth="2" fill="none" />
                    <path d="M 0 90 H 12 C 22 90, 22 150, 34 150 H 42" stroke="#F5A623" strokeWidth="2" fill="none" />
                    <polygon points="42,26 38,22 38,30" fill="#F5A623" />
                    <polygon points="42,146 38,142 38,150" fill="#F5A623" />
                  </svg>
                </div>

                {/* Expected + Actual nodes */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', flexShrink: 0 }}>
                  <EditableNode
                    label="Expected Outcome"
                    icon="🎯"
                    iconBg="var(--accent-blue-light)"
                    iconColor="var(--accent-blue)"
                    accentColor="var(--accent-blue)"
                    value={selectedDecision.expectedOutcome}
                    placeholder="What outcomes did you expect?"
                    onChange={v => patchField('expectedOutcome', v)}
                  />
                  <EditableNode
                    label="Actual Outcome"
                    icon="📈"
                    iconBg="var(--accent-purple-light)"
                    iconColor="var(--accent-purple)"
                    accentColor="var(--accent-purple)"
                    value={selectedDecision.actualOutcome}
                    placeholder="What actually happened? (leave blank if pending)"
                    onChange={v => patchField('actualOutcome', v)}
                  />
                </div>

                {/* Arrow to learning */}
                <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0, margin: '0 0.5rem' }}>
                  <div style={{ width: 28, height: 2, borderTop: '2px dashed var(--accent-green)' }} />
                  <div style={{ width: 0, height: 0, borderTop: '5px solid transparent', borderBottom: '5px solid transparent', borderLeft: '7px solid var(--accent-green)' }} />
                </div>

                {/* Learning / Key Takeaway node */}
                <LearningNode
                  value={selectedDecision.lessonsLearned}
                  category={selectedDecision.category}
                  onChange={v => patchField('lessonsLearned', v)}
                />
              </div>
            ) : (
              <div
                onClick={() => setShowCategorySelector(true)}
                style={{
                  marginTop: '1.25rem', padding: '3rem', textAlign: 'center',
                  border: '2px dashed var(--border-color)', borderRadius: '18px',
                  cursor: 'pointer', color: 'var(--text-secondary)',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent-green)'; e.currentTarget.style.background = 'var(--accent-green-light)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.background = 'transparent'; }}
              >
                <p style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.25rem' }}>Click to create your decision map</p>
                <p style={{ fontSize: '0.78rem' }}>Build a visual map of your decisions, outcomes, and learnings.</p>
              </div>
            )}
          </div>

          {/* Lower Grid: Left side Decision Tools / Feedbacks, Right side Problem Solving Techniques */}
          <div style={{ display: 'grid', gridTemplateColumns: 'var(--grid-decision-map-footer-cols, 1fr 320px)', gap: '1.25rem', flexShrink: 0 }}>

            {/* LOWER LEFT COLUMN */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

              {/* Decision Tools Card */}
              <div style={{ background: '#FFFFFF', border: '1px solid var(--border-color)', borderRadius: '22px', padding: '1.5rem 1.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginBottom: '1rem' }}>
                  <h3 style={{ fontWeight: 900, fontSize: '1rem', color: 'var(--text-primary)', margin: 0 }}>Decision Tools</h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Use proven frameworks to think clearly and make better decisions.</p>
                </div>

                {/* Tool Tabs */}
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
                  {DECISION_TOOLS.map(tool => (
                    <button
                      key={tool.id}
                      onClick={() => setActiveTool(tool.id)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '0.4rem',
                        padding: '0.45rem 0.9rem', borderRadius: '22px',
                        border: activeTool === tool.id ? '1.5px solid var(--accent-green)' : '1.5px solid var(--border-color)',
                        background: activeTool === tool.id ? 'var(--accent-green-light)' : '#FAFBF8',
                        color: activeTool === tool.id ? 'var(--accent-green)' : 'var(--text-secondary)',
                        fontFamily: 'var(--font-main)', fontWeight: 700, fontSize: '0.82rem',
                        cursor: 'pointer', transition: 'all 0.2s',
                      }}
                    >
                      <span>{tool.label}</span>
                    </button>
                  ))}
                </div>

                {/* Tool Content */}
                {activeTool === 'pros-cons' && <ProsConsTool decision={selectedDecision} />}
                {activeTool === 'swot' && <SwotTool decision={selectedDecision} />}
                {activeTool === 'ten-ten-ten' && <TenTenTenTool decision={selectedDecision} />}
                {activeTool === 'five-whys' && <FiveWhysTool decision={selectedDecision} />}
                {activeTool === 'decision-matrix' && <DecisionMatrixTool decision={selectedDecision} />}
              </div>

              {/* Coach Feedback Card */}
              <div style={{ background: '#FFFFFF', border: '1px solid var(--border-color)', borderRadius: '22px', padding: '1.5rem 1.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <h3 style={{ fontWeight: 900, fontSize: '1rem', color: 'var(--text-primary)', margin: 0 }}>Coach Feedback</h3>
                </div>
                {coachFeedbackLoading ? (
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Loading feedback…</p>
                ) : coachFeedbacks.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '1.5rem 1rem' }}>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '0.4rem' }}>No coach feedback yet.</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Click <strong>"Ask Coach for Suggestions"</strong> in the Decision Map to send a decision to your coach for review.</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    {coachFeedbacks.slice(0, 5).map((fb, i) => (
                      <div key={fb.id || i} style={{ background: '#F8FBF9', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '1rem 1.1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                          <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--accent-green)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700 }}>
                            {fb.coachName ? fb.coachName.charAt(0).toUpperCase() : 'C'}
                          </div>
                          <div>
                            <div style={{ fontWeight: 800, fontSize: '0.82rem', color: 'var(--text-primary)' }}>{fb.coachName || 'Your Coach'}</div>
                            <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>{timeAgo(fb.createdAt)}</div>
                          </div>
                        </div>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-primary)', lineHeight: 1.55, fontWeight: 500 }}>{fb.feedbackText || fb.message || fb.feedback}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* LOWER RIGHT COLUMN: Problem Solving Techniques */}
            <div style={{ background: '#FFFFFF', border: '1px solid var(--border-color)', borderRadius: '22px', padding: '1.25rem', display: 'flex', flexDirection: 'column', height: 'fit-content' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                <h3 style={{ fontWeight: 900, fontSize: '0.92rem', color: 'var(--text-primary)', margin: 0 }}>Problem Solving Techniques</h3>
              </div>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '1rem' }}>Choose a framework to go deeper.</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {PROBLEM_SOLVING_TECHNIQUES.map((t, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.7rem',
                      padding: '0.75rem 0.9rem', borderRadius: '14px',
                      background: '#FAFBF8', border: '1px solid var(--border-color)',
                      cursor: 'pointer', transition: 'all 0.18s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = t.bg; e.currentTarget.style.borderColor = t.color + '50'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#FAFBF8'; e.currentTarget.style.borderColor = 'var(--border-color)'; }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 800, fontSize: '0.82rem', color: t.color }}>{t.title}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', lineHeight: 1.4, marginTop: '0.1rem' }}>{t.desc}</div>
                    </div>
                  </div>
                ))}
              </div>



              {/* Mini stats */}
              {/* Premium Progress Card */}
              <div style={{
                marginTop: '1.25rem',
                padding: '1.25rem 1.1rem',
                background: 'linear-gradient(135deg, #FAFBF8 0%, #FFFFFF 100%)',
                border: '1.5px solid var(--border-color)',
                borderRadius: '20px',
                boxShadow: 'var(--box-shadow-soft)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 900, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Your Progress</span>
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--accent-green)', background: 'var(--accent-green-light)', padding: '0.15rem 0.5rem', borderRadius: '20px' }}>
                    {decisions.length > 0 ? Math.round((completedDecisions.length / decisions.length) * 100) : 0}% Done
                  </span>
                </div>
                
                {/* Horizontal Progress Bar */}
                <div style={{ height: '8px', background: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden', marginBottom: '1rem' }}>
                  <div style={{
                    width: `${decisions.length > 0 ? (completedDecisions.length / decisions.length) * 100 : 0}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, var(--accent-green) 0%, #58a372 100%)',
                    borderRadius: '4px',
                    transition: 'width 0.4s ease'
                  }} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem' }}>
                  <div style={{ flex: 1, background: '#FAFBF8', padding: '0.6rem', borderRadius: '12px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.62rem', color: 'var(--text-secondary)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.15rem' }}>Total</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--text-primary)' }}>{decisions.length}</div>
                  </div>
                  <div style={{ flex: 1, background: '#eafaf1', padding: '0.6rem', borderRadius: '12px', border: '1px solid rgba(39,174,96,0.15)', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.62rem', color: '#27ae60', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.15rem' }}>Reflected</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#27ae60' }}>{completedDecisions.length}</div>
                  </div>
                  <div style={{ flex: 1, background: '#fef9f0', padding: '0.6rem', borderRadius: '12px', border: '1px solid rgba(230,126,34,0.15)', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.62rem', color: '#e67e22', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.15rem' }}>Pending</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#e67e22' }}>{pendingDecisions.length}</div>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </>
  );
}
