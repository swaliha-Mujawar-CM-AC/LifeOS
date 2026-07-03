import React, { useState, useEffect, useRef, useCallback } from 'react';
import toast from 'react-hot-toast';
import { SVGIcons } from '../components/SVGIcons';

const API = `http://${window.location.hostname}:5196/api`;


import { HabitLoopCard } from '../components/habits/HabitLoopCard';
import { HabitCoachFeedback } from '../components/habits/HabitCoachFeedback';
import { HabitLeaderboard } from '../components/habits/HabitLeaderboard';
import { HabitStats } from '../components/habits/HabitStats';
import { TopHabitCard } from '../components/habits/TopHabitCard';
import { MoreVerticalIcon } from '../components/habits/HabitIcons';

// Quotes for Tip of the Day
const MOTIVATIONAL_QUOTES = [
  { text: "Consistency is what transforms average into excellence.", author: "Unknown" },
  { text: "Atomic habits build monumental achievements.", author: "James Clear" },
  { text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", author: "Aristotle" },
  { text: "It is easier to prevent bad habits than to break them.", author: "Benjamin Franklin" },
  { text: "Motivation is what gets you started. Habit is what keeps you going.", author: "Jim Ryun" },
  { text: "Small daily improvements over time lead to stunning results.", author: "Robin Sharma" }
];

export function UserHabits({ user, onUpdate }) {
  const [habits, setHabits] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newHabit, setNewHabit] = useState('');
  const [adding, setAdding] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [fbIdx, setFbIdx] = useState(0);



  const addInputRef = useRef(null);
  const userId = user?.id;
  const daysOfWeek = ['M', 'T', 'W', 'T', 'F', 'S', 'S']; // Matches Mon, Tue, Wed, Thu, Fri, Sat, Sun style

  const loadData = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const [hRes, fbRes, leadRes] = await Promise.all([
        fetch(`${API}/Habit/user/${userId}`),
        fetch(`${API}/Feedback/user/${userId}/category/Habits`),
        fetch(`${API}/Habit/leaderboard`)
      ]);
      if (hRes.ok) setHabits(await hRes.json());
      if (fbRes.ok) setFeedbacks(await fbRes.json());
      if (leadRes.ok) setLeaderboard(await leadRes.json());
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [userId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Click outside close actions dropdown
  useEffect(() => {
    const handleOutsideClick = () => setOpenDropdownId(null);
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  const handleToggle = async (habitId) => {
    try {
      await fetch(`${API}/Habit/${habitId}/toggle-log`, { method: 'POST' });
      await loadData();
      if (onUpdate) onUpdate();
    } catch (e) {
      console.error(e);
    }
  };

  const handleAdd = async () => {
    if (!newHabit.trim()) return;
    setAdding(true);
    try {
      await fetch(`${API}/Habit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newHabit.trim(), userId }),
      });
      setNewHabit('');
      await loadData();
      if (onUpdate) onUpdate();
    } catch {
      alert('Failed to add habit');
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = (id) => {
    toast((t) => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <span style={{ fontWeight: 600 }}>Delete this habit?</span>
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
          <button 
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                await fetch(`${API}/Habit/${id}`, { method: 'DELETE' });
                await loadData();
                if (onUpdate) onUpdate();
                toast.success('Habit deleted');
              } catch (e) { console.error(e); }
            }} 
            style={{ padding: '0.35rem 0.85rem', background: 'var(--alert-red)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 700 }}
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
    ), { duration: Infinity, id: `delete-habit-${id}` });
  };

  // Calculations for cards
  const completedCount = habits.filter(h => h.isCompletedToday).length;
  const totalCount = habits.length;
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const currentStreak = habits.length > 0 ? Math.max(...habits.map(h => h.streak), 0) : 0;
  const longestStreak = habits.length > 0 ? Math.max(...habits.map(h => h.maxStreak), 0) : 0;
  
  // Points system calculation: 10 pts per current streak + 5 pts per max streak + 15 pts per completion today
  const totalPoints = habits.reduce((acc, h) => acc + (h.streak * 10) + (h.maxStreak * 5), 0) + (completedCount * 15);

  // Sparkline calculations (completed habits count per day this week)
  const dailyCompletionCounts = Array.from({ length: 7 }, (_, i) => 
    habits.filter(h => h.completedDaysOfWeek && h.completedDaysOfWeek.includes(i)).length
  );
  
  const generateSparklinePath = () => {
    const totalH = habits.length || 1;
    const coords = dailyCompletionCounts.map((count, index) => {
      const x = index * 20; // 0 to 120
      const y = 35 - (count / totalH) * 28; // 0 to 35
      return { x, y };
    });
    
    const lineD = coords.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x} ${c.y}`).join(' ');
    const fillD = `${lineD} L 120 40 L 0 40 Z`;
    return { lineD, fillD };
  };

  const { lineD, fillD } = generateSparklinePath();

  // Weekly Completion: Checks if at least one habit was completed on each day (Mon-Sun)
  const isDayCompleted = (dayIndex) => {
    return habits.some(h => h.completedDaysOfWeek && h.completedDaysOfWeek.includes(dayIndex));
  };

  // Top habit finder
  const topHabit = habits.length > 0 ? habits.reduce((prev, current) => (prev.streak > current.streak) ? prev : current) : null;

  // Selected Quote
  const tipQuote = MOTIVATIONAL_QUOTES[new Date().getDate() % MOTIVATIONAL_QUOTES.length];

  return (
    <div style={{ padding: '0.5rem 0', outline: 'none' }}>
      {/* Header Title Section with tagline next to it at the same size */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <h1 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, color: '#132a1e', display: 'flex', alignItems: 'center', gap: '0.2rem', letterSpacing: '0.5px' }}>
          Habit Tracker <span style={{ color: 'var(--accent-green)', display: 'inline-flex' }}><SVGIcons.Leaf /></span>
        </h1>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
          — Track small habits. Build a better you.
        </span>
      </div>

      {/* Main Habits Layout (Split Screen Grid) */}
      <div className="habit-tracker-grid">
        
        {/* Left Column: Coach Feedback, Habits List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', alignSelf: 'start' }}>
          
          {/* Coach Feedback Card */}
          <HabitCoachFeedback feedbacks={feedbacks} fbIdx={fbIdx} setFbIdx={setFbIdx} />

          {/* Your Habits Card */}
          <div className="dashboard-card" style={{ padding: '1.25rem 1.5rem', marginBottom: 0 }}>
            <div style={{ display: 'flex', flexDirection: 'var(--flex-dir-row-col, row)', justifyContent: 'space-between', alignItems: 'var(--flex-align-start-center, center)', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>Your Habits</h3>
              
              {/* Quick Add Habit form inline in header */}
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', width: 'var(--form-quick-add-width, auto)' }}>
                <input 
                  ref={addInputRef}
                  type="text" 
                  placeholder="e.g. Drink 3L water" 
                  value={newHabit}
                  onChange={e => setNewHabit(e.target.value)} 
                  className="form-input" 
                  style={{ width: 'var(--quick-add-input-width, 180px)', flex: 'var(--quick-add-input-flex, none)', border: '1.5px solid #eceee8', borderRadius: '8px', padding: '0.35rem 0.6rem', fontSize: '0.78rem', margin: 0 }}
                  onKeyDown={e => e.key === 'Enter' && handleAdd()} 
                />
                <button 
                  className="btn-primary" 
                  onClick={handleAdd} 
                  disabled={adding || !newHabit.trim()}
                  style={{ background: 'var(--accent-green)', padding: '0.35rem 0.85rem', fontSize: '0.78rem', borderRadius: '8px', whiteSpace: 'nowrap' }}
                >
                  {adding ? '...' : '+ Add'}
                </button>
              </div>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Loading habits…</div>
            ) : habits.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                No habits configured yet. Add your first habit above!
              </div>
            ) : (
              <div style={{ overflowX: 'auto', width: '100%' }}>
                <div style={{ minWidth: '600px' }}>
                  <table className="habits-table">
                    <thead>
                      <tr style={{ textAlign: 'left' }}>
                        <th style={{ width: '45%', paddingBottom: '0.5rem', fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Habit</th>
                        <th style={{ width: '15%', paddingBottom: '0.5rem', fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Streak</th>
                        <th style={{ width: '15%', paddingBottom: '0.5rem', fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', textAlign: 'center' }}>Progress</th>
                        <th style={{ width: '20%', paddingBottom: '0.5rem', fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', paddingLeft: '0.5rem' }}>History</th>
                        <th style={{ width: '5%', paddingBottom: '0.5rem', fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', textAlign: 'center' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {habits.map(h => {
                        const habitWeekProgress = Math.round(((h.completedDaysOfWeek ? h.completedDaysOfWeek.length : 0) / 7) * 100);
                        return (
                          <tr key={h.id} className="habit-row-item">
                            <td style={{ width: '45%', padding: '0.35rem 0.5rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div 
                                  className={`habit-checkbox-custom ${h.isCompletedToday ? 'checked' : ''}`}
                                  onClick={() => handleToggle(h.id)}
                                  style={{ width: '22px', height: '22px', borderRadius: '6px' }}
                                >
                                  <SVGIcons.Check />
                                </div>
                                <div>
                                  <div style={{ 
                                    fontWeight: 700, 
                                    fontSize: '0.88rem', 
                                    color: 'var(--text-primary)'
                                  }}>
                                    {h.title}
                                  </div>
                                  <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', fontWeight: 600, marginTop: '0.08rem' }}>Daily</div>
                                </div>
                              </div>
                            </td>
                            <td style={{ width: '15%', padding: '0.35rem 0.5rem' }}>
                              <span style={{ fontSize: '0.78rem', color: '#e67300', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                                🔥 {h.streak}d
                              </span>
                            </td>
                            <td style={{ width: '15%', padding: '0.35rem 0.5rem' }}>
                              <div className="row-progress-container">
                                <div className="mini-progress-ring" style={{ width: '34px', height: '34px' }}>
                                  <svg width="34" height="34" viewBox="0 0 36 36">
                                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#eceee8" strokeWidth="3.5" />
                                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="var(--accent-green)" strokeWidth="3.5" strokeDasharray={`${habitWeekProgress}, 100`} transform="rotate(-90 18 18)" />
                                  </svg>
                                  <span className="mini-progress-ring-text" style={{ fontSize: '0.62rem', fontWeight: '800' }}>{habitWeekProgress}%</span>
                                </div>
                              </div>
                            </td>
                            <td style={{ width: '20%', padding: '0.35rem 0.5rem' }}>
                              <div style={{ display: 'flex', gap: '0.25rem' }}>
                                {daysOfWeek.map((day, idx) => {
                                  const completed = h.completedDaysOfWeek && h.completedDaysOfWeek.includes(idx);
                                  return (
                                    <div key={idx} style={{
                                      width: 22, height: 22, borderRadius: '50%',
                                      fontSize: '0.62rem', fontWeight: 850,
                                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                                      backgroundColor: completed ? '#1e3d2f' : '#f1f3ee',
                                      color: completed ? '#ffffff' : 'var(--text-secondary)',
                                      border: completed ? 'none' : '1px solid #e2e8df',
                                      transition: 'all 0.25s'
                                    }}>
                                      {day}
                                    </div>
                                  );
                                })}
                              </div>
                            </td>
                            <td style={{ width: '5%', textAlign: 'center', padding: '0.35rem 0.5rem' }}>
                              <div className="actions-dropdown-container" onClick={(e) => e.stopPropagation()}>
                                <button 
                                  className="actions-dropdown-trigger" 
                                  onClick={() => setOpenDropdownId(openDropdownId === h.id ? null : h.id)}
                                >
                                  <MoreVerticalIcon />
                                </button>
                                {openDropdownId === h.id && (
                                  <div className="actions-dropdown-menu">
                                    <button 
                                      className="actions-dropdown-item delete" 
                                      onClick={() => { handleDelete(h.id); setOpenDropdownId(null); }}
                                    >
                                      🗑 Delete
                                    </button>
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Leaderboard (Top), Today's Progress (Middle), Top Habit (Bottom) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Card 1: Leaderboard (On Top) */}
          <HabitLeaderboard leaderboard={leaderboard} userId={userId} />

          {/* Card 2: Today's Progress (Middle) - Reduced Size */}
          <HabitStats completedCount={completedCount} totalCount={totalCount} progressPct={progressPct} currentStreak={currentStreak} longestStreak={longestStreak} totalPoints={totalPoints} />

          {/* Card 3: Top Habit (Bottom) */}
          <TopHabitCard topHabit={topHabit} />

        </div>

      </div>

      {/* Very thin Habit Loop Card at the bottom of the page */}
      <HabitLoopCard />

    </div>
  );
}
