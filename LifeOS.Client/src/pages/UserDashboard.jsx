import React, { useState, useEffect } from 'react';
import { TaskCard } from '../components/dashboard/TaskCard';
import { LearningCard } from '../components/dashboard/LearningCard';
import { ExpenseCard } from '../components/dashboard/ExpenseCard';
import { HabitTrackerCard } from '../components/dashboard/HabitTrackerCard';
import { OverallScoreCard } from '../components/dashboard/OverallScoreCard';

const API_BASE = `http://${window.location.hostname}:5196/api`;

const Quotes = [
  { text: "Discipline is choosing between what you want now and what you want most.", author: "Unknown" },
  { text: "Small steps today, big changes tomorrow. Keep pushing forward.", author: "LifeOS" },
  { text: "Consistency is your superpower. Your habits define your future.", author: "James Clear" },
  { text: "It is not that we have a short time to live, but that we waste a lot of it.", author: "Seneca" },
  { text: "Great things are done by a series of small things brought together.", author: "Vincent Van Gogh" }
];

export function UserDashboard({ user, triggerRefresh, onUpdate, onNavigate }) {
  const [data, setData] = useState(null);
  const [habitsList, setHabitsList] = useState([]);
  const [allPendingTasks, setAllPendingTasks] = useState([]);
  const [quoteIndex, setQuoteIndex] = useState(0);

  const rotateQuote = () => {
    setQuoteIndex(prev => (prev + 1) % Quotes.length);
  };

  // State for user learnings
  const [learnings, setLearnings] = useState([]);

  useEffect(() => {
    const today = new Date();
      // Fetch user learnings (lessonsLearned) from decisions API
      fetch(`${API_BASE}/Decision/user/${user.id}`)
        .then(res => res.ok ? res.json() : [])
        .then(decisions => {
          const safeDecisions = decisions || [];
          const userLearnings = safeDecisions
            .filter(d => d.lessonsLearned)
            .map(d => ({ text: d.lessonsLearned, author: user?.username || 'User' }));
          setLearnings(userLearnings);
        })
        .catch(err => console.error('Error loading learnings:', err));
    const year = today.getFullYear();
    const month = today.getMonth() + 1;

    // Load API metrics
    fetch(`${API_BASE}/dashboard/user/${user.id}`)
      .then(res => res.ok ? res.json() : null)
      .then(resData => {
        if (!resData) return;
        fetch(`${API_BASE}/Expense/budget/${user.id}/${year}/${month}`)
          .then(resBud => resBud.ok ? resBud.json() : { amount: 0 })
          .then(budData => {
            fetch(`${API_BASE}/Expense/summary/${user.id}/${year}/${month}`)
              .then(resSum => resSum.ok ? resSum.json() : { totalExpense: 0 })
              .then(sumData => {
                const updatedResData = {
                  ...resData,
                  budgetInfo: {
                    budget: budData.amount || 0,
                    spent: sumData.totalExpense || 0,
                    saved: Math.max(0, (budData.amount || 0) - (sumData.totalExpense || 0)),
                    categoryBreakdown: sumData.categoryBreakdown || []
                  }
                };
                setData(updatedResData);
              })
              .catch(() => setData(resData));
          })
          .catch(() => setData(resData));
      })
      .catch(err => console.error("Error loading dashboard data:", err));

    // Fetch ALL tasks directly — dashboard API only returns a limited subset
    fetch(`${API_BASE}/Task/user/${user.id}`)
      .then(res => res.ok ? res.json() : [])
      .then(tasks => {
        const safeTasks = tasks || [];
        const pending = safeTasks
          .filter(t => !t.isCompleted)
          .sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
        setAllPendingTasks(pending);
      })
      .catch(err => console.error("Error loading tasks:", err));

    fetch(`${API_BASE}/habit/user/${user.id}`)
      .then(res => res.ok ? res.json() : [])
      .then(data => setHabitsList(data || []))
      .catch(err => console.error("Error loading habits:", err));
  }, [user?.id, triggerRefresh]);

  const handleHabitToggle = (id) => {
    fetch(`${API_BASE}/habit/${id}/toggle-log`, { method: 'POST' })
      .then(() => onUpdate())
      .catch(err => console.error("Error toggling habit:", err));
  };

  if (!data) return <p style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>Loading dashboard metrics...</p>;

  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  
  const currentHour = currentDate.getHours();
  let greetingWord = 'Good morning';
  let greetingIcon = '☀️';
  if (currentHour >= 12 && currentHour < 17) {
    greetingWord = 'Good afternoon';
    greetingIcon = '🌤️';
  } else if (currentHour >= 17 || currentHour < 5) {
    greetingWord = 'Good evening';
    greetingIcon = '🌙';
  }
  const formattedName = user && user.username ? (user.username === 'john' ? 'John' : (user.username.charAt(0).toUpperCase() + user.username.slice(1))) : '';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '0 0.5rem', marginTop: '-0.5rem' }}>
      
      {/* Greeting + Date inline */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem 0.75rem', paddingLeft: '0.2rem', flexWrap: 'wrap' }}>
        <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#31543d' }}>
          {greetingWord}, {formattedName}! {greetingIcon}
        </div>
        <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#688c53', opacity: 0.5 }}></div>
        <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#688c53' }}>
          {formattedDate}
        </div>
      </div>

      {/* Main Stack */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
        
        {/* 1. Tasks & Deadlines Section */}
        <TaskCard 
          upcomingTasks={allPendingTasks || []} 
          onUpdate={onUpdate} 
          onNavigate={onNavigate} 
        />

        {/* 3. Expenses Section */}
        <ExpenseCard 
          budgetInfo={data.budgetInfo || {}} 
        />

        {/* 4. Habit Tracker Section */}
        <HabitTrackerCard 
          habitsList={habitsList || []} 
          onToggle={handleHabitToggle} 
        />

        {/* 5. Overall Score Section */}
        <OverallScoreCard 
          scores={data.scores || {}} 
        />

        {/* 6. Learning Card Section */}
        <LearningCard 
          learnings={learnings || []} 
          onRotate={rotateQuote} 
          quoteIndex={quoteIndex}
        />

      </div>
    </div>
  );
}
