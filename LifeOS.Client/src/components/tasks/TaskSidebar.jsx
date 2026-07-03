import React from 'react';
import { SVGIcons } from '../SVGIcons';

export function TaskSidebar({
  priorityFilter,
  setPriorityFilter,
  categoryFilter,
  setCategoryFilter,
  getPriorityCount,
  getCategoryCount
}) {
  return (
    <aside className="tasks-sidebar">
      {/* Priority Filter */}
      <div className="filter-group">
        <h4 className="filter-heading">Priority</h4>
        <ul className="filter-list">
          <li className={priorityFilter === 'All' ? 'active' : ''} onClick={() => setPriorityFilter('All')}>
            <div className="filter-label"><span className="dot all"></span> All</div>
            <span className="filter-count">{getPriorityCount('All')}</span>
          </li>
          <li className={priorityFilter === 'High' ? 'active' : ''} onClick={() => setPriorityFilter('High')}>
            <div className="filter-label"><span className="dot high"></span> High</div>
            <span className="filter-count">{getPriorityCount('High')}</span>
          </li>
          <li className={priorityFilter === 'Medium' ? 'active' : ''} onClick={() => setPriorityFilter('Medium')}>
            <div className="filter-label"><span className="dot medium"></span> Medium</div>
            <span className="filter-count">{getPriorityCount('Medium')}</span>
          </li>
          <li className={priorityFilter === 'Low' ? 'active' : ''} onClick={() => setPriorityFilter('Low')}>
            <div className="filter-label"><span className="dot low"></span> Low</div>
            <span className="filter-count">{getPriorityCount('Low')}</span>
          </li>
        </ul>
      </div>

      {/* Type / Category Filter */}
      <div className="filter-group" style={{ marginTop: 'var(--sidebar-group-margin, 2rem)' }}>
        <h4 className="filter-heading">Type</h4>
        <ul className="filter-list">
          <li className={categoryFilter === 'All' ? 'active' : ''} onClick={() => setCategoryFilter('All')}>
            <div className="filter-label"><SVGIcons.Tasks /> All</div>
            <span className="filter-count">{getCategoryCount('All')}</span>
          </li>
          {['Career', 'Personal', 'Home', 'Health', 'Finance', 'Other'].map(cat => (
            <li key={cat} className={categoryFilter === cat ? 'active' : ''} onClick={() => setCategoryFilter(cat)}>
              <div className="filter-label"><SVGIcons.Tasks /> {cat}</div>
              <span className="filter-count">{getCategoryCount(cat)}</span>
            </li>
          ))}
        </ul>
      </div>
      
      {/* Decorative graphic at the bottom of sidebar */}
      <div className="sidebar-decoration" />
    </aside>
  );
}
