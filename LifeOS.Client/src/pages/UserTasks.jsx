import React, { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { SVGIcons } from '../components/SVGIcons';
import { TaskModal } from '../components/tasks/TaskModal';
import { TaskSidebar } from '../components/tasks/TaskSidebar';
import { TaskRightSidebar } from '../components/tasks/TaskRightSidebar';

const API = `http://${window.location.hostname}:5196/api`;

// Small helper for doughnut chart segments
const createDonutSegment = (percentage, offset, color, radius) => {
  const circ = 2 * Math.PI * radius;
  const strokeDasharray = `${(percentage / 100) * circ} ${circ}`;
  const strokeDashoffset = `${-((offset / 100) * circ)}`;
  return { strokeDasharray, strokeDashoffset, stroke: color };
};

export function UserTasks({ user, onUpdate }) {
  const [tasks, setTasks] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [hasNoDeadline, setHasNoDeadline] = useState(false);
  const [fbIdx, setFbIdx] = useState(0);

  // Filters
  const [activeTab, setActiveTab] = useState('Upcoming'); // All Tasks, Upcoming, Overdue, Completed
  const [priorityFilter, setPriorityFilter] = useState('All'); // All, High, Medium, Low
  const [categoryFilter, setCategoryFilter] = useState('All'); // All, Career, Personal, Health, Home, Finance, Other
  const [showCompleted, setShowCompleted] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [category, setCategory] = useState('Other');

  const userId = user?.id;

  const fetchTasks = useCallback(async () => {
    try {
      const [tasksRes, fbRes] = await Promise.all([
        fetch(`${API}/Task/user/${userId}`),
        fetch(`${API}/Feedback/user/${userId}/category/Tasks`),
      ]);
      if (tasksRes.ok) setTasks(await tasksRes.json());
      if (fbRes.ok) setFeedbacks(await fbRes.json());
    } catch (err) { console.error(err); }
  }, [userId]);

  useEffect(() => { fetchTasks(); }, [userId, fetchTasks]);

  const handleEditClick = (task) => {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description || '');
    const isNoDeadlineTask = task.deadline && task.deadline.startsWith('2099-12-31');
    setDeadline(isNoDeadlineTask ? '' : (task.deadline ? task.deadline.slice(0, 16) : ''));
    setHasNoDeadline(!!isNoDeadlineTask);
    setPriority(task.priority || 'Medium');
    setCategory(task.category || 'Other');
    setIsAddingTask(true);
  };

  const closeModal = () => {
    setIsAddingTask(false);
    setEditingTask(null);
    setTitle('');
    setDescription('');
    setDeadline('');
    setPriority('Medium');
    setCategory('Other');
    setHasNoDeadline(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    if (!hasNoDeadline && !deadline) return;

    const taskDeadline = hasNoDeadline ? "2099-12-31T23:59:59.000Z" : new Date(deadline).toISOString();

    try {
      if (editingTask) {
        // Edit Task
        await fetch(`${API}/Task/${editingTask.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            id: editingTask.id,
            title: title.trim(), 
            description, 
            deadline: taskDeadline, 
            priority, 
            category,
            isCompleted: editingTask.isCompleted, 
            userId 
          }),
        });
        toast.success('Task updated successfully!');
      } else {
        // Create Task
        await fetch(`${API}/Task`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            title: title.trim(), 
            description, 
            deadline: taskDeadline, 
            priority, 
            category,
            isCompleted: false, 
            userId 
          }),
        });
        toast.success('Task added successfully!');
      }
      closeModal();
      await fetchTasks();
      if (onUpdate) onUpdate();
    } catch (err) { console.error(err); }
  };

  const handleToggle = async (id) => {
    await fetch(`${API}/Task/${id}/toggle-complete`, { method: 'PATCH' });
    await fetchTasks();
    if (onUpdate) onUpdate();
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${API}/Task/${id}`, { method: 'DELETE' });
      await fetchTasks();
      if (onUpdate) onUpdate();
      toast.success('Task deleted');
    } catch (err) { console.error(err); }
  };

  // -----------------------------------------------------
  // FILTERING LOGIC
  // -----------------------------------------------------
  let filteredTasks = tasks;

  // 1. Tab Filter
  const now = new Date();
  if (activeTab === 'Upcoming') {
    filteredTasks = filteredTasks.filter(t => !t.isCompleted && (t.deadline?.startsWith('2099-12-31') || new Date(t.deadline) >= now));
  } else if (activeTab === 'Overdue') {
    filteredTasks = filteredTasks.filter(t => !t.isCompleted && !t.deadline?.startsWith('2099-12-31') && new Date(t.deadline) < now);
  } else if (activeTab === 'Completed') {
    filteredTasks = filteredTasks.filter(t => t.isCompleted);
  }

  // 2. Priority Filter
  if (priorityFilter !== 'All') {
    filteredTasks = filteredTasks.filter(t => t.priority === priorityFilter);
  }

  // 3. Category Filter
  if (categoryFilter !== 'All') {
    filteredTasks = filteredTasks.filter(t => (t.category || 'Other') === categoryFilter);
  }

  // 4. Calendar Date Filter
  if (selectedDate) {
    filteredTasks = filteredTasks.filter(t => {
      if (t.deadline?.startsWith('2099-12-31')) return false;
      const d = new Date(t.deadline);
      return d.getDate() === selectedDate && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });
  }

  // Sorting
  filteredTasks.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

  // -----------------------------------------------------
  // STATS & CHART CALCS
  // -----------------------------------------------------
  const getPriorityCount = (p) => tasks.filter(t => !t.isCompleted && (p === 'All' || t.priority === p)).length;
  const getCategoryCount = (c) => tasks.filter(t => !t.isCompleted && (c === 'All' || (t.category || 'Other') === c)).length;
  
  const pendingTasks = tasks.filter(t => !t.isCompleted);
  const totalPending = pendingTasks.length || 1;
  const highCount = pendingTasks.filter(t => t.priority === 'High').length;
  const mediumCount = pendingTasks.filter(t => t.priority === 'Medium').length;
  const lowCount = pendingTasks.filter(t => t.priority === 'Low').length;

  const highPct = (highCount / totalPending) * 100;
  const mediumPct = (mediumCount / totalPending) * 100;
  const lowPct = (lowCount / totalPending) * 100;

  // Doughnut segments
  const r = 44;
  const sHigh = createDonutSegment(highPct, 0, '#ff4b6b', r);
  const sMed = createDonutSegment(mediumPct, highPct, '#7052ff', r);
  const sLow = createDonutSegment(lowPct, highPct + mediumPct, '#00c0a9', r);

  // -----------------------------------------------------
  // CALENDAR CALCS
  // -----------------------------------------------------
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay(); // 0 = Sunday
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const days = [];
  
  // Adjusted for Monday start if desired, but default JS is Sunday. Let's stick to Sunday start for simplicity.
  for (let i = 0; i < firstDay; i++) { days.push(null); }
  for (let i = 1; i <= daysInMonth; i++) { days.push(i); }

  const hasTaskOnDay = (day) => {
    if (!day) return false;
    return tasks.some(t => {
      if (t.deadline?.startsWith('2099-12-31')) return false;
      const d = new Date(t.deadline);
      return !t.isCompleted && d.getDate() === day && d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });
  };



  return (
    <div className="tasks-page-container">
      {/* =========================================
          GLOBAL HEADER
      ========================================= */}
      <header className="tasks-main-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <SVGIcons.Leaf />
            <h1 className="tasks-title">Tasks &amp; Deadlines</h1>
          </div>
          <p className="tasks-subtitle">Plan, prioritize and complete your tasks on time.</p>
        </div>
        <button className="btn-add-task" onClick={() => setIsAddingTask(true)}>
          <SVGIcons.Plus /> Add Task
        </button>
      </header>

      <div className="tasks-page-layout" style={{ paddingTop: '1.5rem' }}>
      
      {/* =========================================
          LEFT SIDEBAR: FILTERS
      ========================================= */}
      <TaskSidebar
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        getPriorityCount={getPriorityCount}
        getCategoryCount={getCategoryCount}
      />

      {/* =========================================
          MAIN CONTENT AREA
      ========================================= */}
      <main className="tasks-main">
        {/* Add Task Form Modal */}
        <TaskModal
          isAddingTask={isAddingTask}
          editingTask={editingTask}
          closeModal={closeModal}
          handleSubmit={handleSubmit}
          title={title}
          setTitle={setTitle}
          category={category}
          setCategory={setCategory}
          hasNoDeadline={hasNoDeadline}
          setHasNoDeadline={setHasNoDeadline}
          deadline={deadline}
          setDeadline={setDeadline}
          priority={priority}
          setPriority={setPriority}
        />

        {/* Tabs */}
        <div className="tasks-tabs-container">
          <div className="tasks-tabs">
            {['All Tasks', 'Upcoming', 'Overdue', 'Completed'].map(tab => (
              <button key={tab} className={`tab-btn ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Task List */}
        <div className="tasks-list">
          {filteredTasks.length === 0 ? (
            <div className="empty-state">No tasks found.</div>
          ) : (
            <>
              {activeTab === 'All Tasks' ? (
                <>
                  {/* Pending Tasks */}
                  {filteredTasks.filter(t => !t.isCompleted).map(t => (
                    <div key={t.id} className="task-row">
                      <div className="task-row-left">
                        <button onClick={() => handleToggle(t.id)} className="task-checkbox">
                        </button>
                        <div className="task-info">
                          <span className="task-title-text">{t.title}</span>
                          <span className="task-category-pill">{t.category || 'Other'}</span>
                        </div>
                      </div>
                      <div className="task-row-right">
                        <div className="task-meta">
                          <span className={`task-priority-pill ${t.priority.toLowerCase()}`}>{t.priority}</span>
                          <div className="task-deadline-info">
                            <SVGIcons.Calendar />
                            <span>
                              {t.deadline && t.deadline.startsWith('2099-12-31') 
                                ? 'No Deadline' 
                                : new Date(t.deadline).toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                        <div className="task-actions">
                          <button className="btn-edit-task" onClick={() => handleEditClick(t)} title="Edit Task" style={{ background: 'none', border: 'none', color: '#a0b5a6', cursor: 'pointer', padding: '0.35rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.color = 'var(--accent-green)'} onMouseOut={e => e.currentTarget.style.color = '#a0b5a6'}>
                            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                          </button>
                          <button className="btn-delete-task" onClick={() => handleDelete(t.id)} title="Delete Task">
                            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* View Completed Toggle Button */}
                  {filteredTasks.filter(t => t.isCompleted).length > 0 && (
                    <div style={{ display: 'flex', marginTop: '1rem', marginBottom: '0.5rem' }}>
                      <button 
                        className="btn-toggle-completed" 
                        onClick={() => setShowCompleted(!showCompleted)}
                      >
                        {showCompleted ? 'Hide Completed Tasks' : `View Completed Tasks (${filteredTasks.filter(t => t.isCompleted).length})`}
                      </button>
                    </div>
                  )}
 
                  {/* Completed Tasks */}
                  {showCompleted && filteredTasks.filter(t => t.isCompleted).map(t => (
                    <div key={t.id} className="task-row completed">
                      <div className="task-row-left">
                        <button onClick={() => handleToggle(t.id)} className="task-checkbox checked">
                          <SVGIcons.Check />
                        </button>
                        <div className="task-info">
                          <span className="task-title-text">{t.title}</span>
                          <span className="task-category-pill">{t.category || 'Other'}</span>
                        </div>
                      </div>
                      <div className="task-row-right">
                        <div className="task-meta">
                          <span className={`task-priority-pill ${t.priority.toLowerCase()}`}>{t.priority}</span>
                          <div className="task-deadline-info">
                            <SVGIcons.Calendar />
                            <span>
                              {t.deadline && t.deadline.startsWith('2099-12-31') 
                                ? 'No Deadline' 
                                : new Date(t.deadline).toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                        <div className="task-actions">
                          <button className="btn-edit-task" onClick={() => handleEditClick(t)} title="Edit Task" style={{ background: 'none', border: 'none', color: '#a0b5a6', cursor: 'pointer', padding: '0.35rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.color = 'var(--accent-green)'} onMouseOut={e => e.currentTarget.style.color = '#a0b5a6'}>
                            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                          </button>
                          <button className="btn-delete-task" onClick={() => handleDelete(t.id)} title="Delete Task">
                            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                /* Other Tabs Render Normally */
                filteredTasks.map(t => (
                  <div key={t.id} className={`task-row ${t.isCompleted ? 'completed' : ''}`}>
                    <div className="task-row-left">
                      <button onClick={() => handleToggle(t.id)} className={`task-checkbox ${t.isCompleted ? 'checked' : ''}`}>
                        {t.isCompleted && <SVGIcons.Check />}
                      </button>
                      <div className="task-info">
                        <span className="task-title-text">{t.title}</span>
                        <span className="task-category-pill">{t.category || 'Other'}</span>
                      </div>
                    </div>
                    <div className="task-row-right">
                      <div className="task-meta">
                        <span className={`task-priority-pill ${t.priority.toLowerCase()}`}>{t.priority}</span>
                        <div className="task-deadline-info">
                          <SVGIcons.Calendar />
                          <span>
                            {t.deadline && t.deadline.startsWith('2099-12-31') 
                              ? 'No Deadline' 
                              : new Date(t.deadline).toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                      <div className="task-actions">
                        <button className="btn-edit-task" onClick={() => handleEditClick(t)} title="Edit Task" style={{ background: 'none', border: 'none', color: '#a0b5a6', cursor: 'pointer', padding: '0.35rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.color = 'var(--accent-green)'} onMouseOut={e => e.currentTarget.style.color = '#a0b5a6'}>
                          <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                        </button>
                        <button className="btn-delete-task" onClick={() => handleDelete(t.id)} title="Delete Task">
                          <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </>
          )}
        </div>
      </main>

      {/* =========================================
          RIGHT SIDEBAR: WIDGETS
      ========================================= */}
      <TaskRightSidebar
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        now={now}
        days={days}
        hasTaskOnDay={hasTaskOnDay}
        pendingTasks={pendingTasks}
        highCount={highCount}
        mediumCount={mediumCount}
        lowCount={lowCount}
        sHigh={sHigh}
        sMed={sMed}
        sLow={sLow}
        r={r}
        feedbacks={feedbacks}
        fbIdx={fbIdx}
        setFbIdx={setFbIdx}
      />

    </div>
    </div>
  );
}
