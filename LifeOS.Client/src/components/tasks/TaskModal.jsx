import React from 'react';

export function TaskModal({
  isAddingTask,
  editingTask,
  closeModal,
  handleSubmit,
  title,
  setTitle,
  category,
  setCategory,
  hasNoDeadline,
  setHasNoDeadline,
  deadline,
  setDeadline,
  priority,
  setPriority
}) {
  if (!isAddingTask) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content add-task-modal">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>
            {editingTask ? '📝 Edit Task' : '➕ Add New Task'}
          </h3>
          <button onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label className="form-label">Task Title</label>
            <input type="text" className="form-input" value={title} onChange={e => setTitle(e.target.value)} required placeholder="What needs to be done?" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'var(--grid-tasks-modal-cols, 1fr 1fr)', gap: '1rem' }}>
            <div>
              <label className="form-label">Category</label>
              <select className="form-input" value={category} onChange={e => setCategory(e.target.value)}>
                <option value="Career">Career</option>
                <option value="Personal">Personal</option>
                <option value="Home">Home</option>
                <option value="Health">Health</option>
                <option value="Finance">Finance</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label" style={{ marginBottom: 0 }}>Deadline</label>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.72rem', cursor: 'pointer', fontWeight: 650, color: 'var(--text-secondary)' }}>
                  <input 
                    type="checkbox" 
                    checked={hasNoDeadline} 
                    onChange={e => {
                      setHasNoDeadline(e.target.checked);
                      if (e.target.checked) setDeadline('');
                    }} 
                  />
                  No Deadline
                </label>
              </div>
              <input 
                type="datetime-local" 
                className="form-input" 
                value={deadline} 
                onChange={e => setDeadline(e.target.value)} 
                required={!hasNoDeadline} 
                disabled={hasNoDeadline} 
                style={{ marginTop: '0.3rem', width: '100%', opacity: hasNoDeadline ? 0.5 : 1 }}
              />
            </div>
          </div>
          <div>
            <label className="form-label">Priority</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {['Low', 'Medium', 'High'].map(p => (
                <button key={p} type="button" onClick={() => setPriority(p)} className={`priority-btn ${priority === p ? 'active' : ''} ${p.toLowerCase()}`}>
                  {p}
                </button>
              ))}
            </div>
          </div>
          <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem', width: '100%', padding: '0.75rem', justifyContent: 'center' }}>
            {editingTask ? 'Update Task' : 'Save Task'}
          </button>
        </form>
      </div>
    </div>
  );
}
