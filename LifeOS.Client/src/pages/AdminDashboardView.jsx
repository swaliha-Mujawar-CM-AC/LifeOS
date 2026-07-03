import React, { useState, useEffect, useRef } from 'react';

const API = `http://${window.location.hostname}:5196/api`;

const ROLES = ['User', 'Coach', 'Admin'];

const roleColor = (role) => {
  if (role === 'Admin') return 'var(--alert-red)';
  if (role === 'Coach') return 'var(--alert-orange)';
  return 'var(--accent-green)';
};

const roleBg = (role) => {
  if (role === 'Admin') return 'rgba(239,68,68,0.12)';
  if (role === 'Coach') return 'rgba(249,115,22,0.12)';
  return 'rgba(34,197,94,0.12)';
};

const roleEmoji = (role) => {
  if (role === 'Admin') return '🛡️';
  if (role === 'Coach') return '🎯';
  return '👤';
};

const PencilIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
);

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
);

/* ── Confirmation Modal (Role) ── */
function ConfirmModal({ user, newRole, onConfirm, onCancel, loading }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        background: 'var(--card-bg, #fff)', borderRadius: '20px', padding: '2rem 2.25rem',
        width: '380px', boxShadow: '0 24px 64px rgba(0,0,0,0.25)',
        border: '1px solid var(--border-color)',
        animation: 'fadeSlideIn 0.2s ease',
      }}>
        <div style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '0.75rem' }}>
          {roleEmoji(newRole)}
        </div>
        <h2 style={{ textAlign: 'center', fontSize: '1.05rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          Change Role
        </h2>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
          Set <strong>{user.username}</strong> as&nbsp;
          <span style={{ color: roleColor(newRole), fontWeight: 700 }}>{newRole}</span>?
          {newRole === 'Coach' && (
            <span style={{ display: 'block', marginTop: '0.4rem', fontSize: '0.78rem', color: 'var(--alert-orange)' }}>
              ⚠️ Coach accounts start as pending until approved.
            </span>
          )}
        </p>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1, padding: '0.65rem', borderRadius: '10px', border: '1px solid var(--border-color)',
              background: 'transparent', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600,
              color: 'var(--text-secondary)',
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            style={{
              flex: 1, padding: '0.65rem', borderRadius: '10px', border: 'none',
              background: roleColor(newRole), color: '#fff', cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '0.875rem', fontWeight: 700, opacity: loading ? 0.7 : 1,
              transition: 'opacity 0.2s',
            }}
          >
            {loading ? 'Saving…' : `Make ${newRole}`}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Delete Confirmation Modal ── */
function DeleteModal({ user, onConfirm, onCancel, loading }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        background: 'var(--card-bg, #fff)', borderRadius: '20px', padding: '2rem 2.25rem',
        width: '380px', boxShadow: '0 24px 64px rgba(0,0,0,0.25)',
        border: '1px solid var(--border-color)',
        animation: 'fadeSlideIn 0.2s ease',
      }}>
        <div style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '0.75rem', color: 'var(--alert-red)' }}>
          🗑️
        </div>
        <h2 style={{ textAlign: 'center', fontSize: '1.05rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          Delete User
        </h2>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
          Are you sure you want to delete <strong>{user.username}</strong>? This action will permanently remove all their data (tasks, habits, expenses) and cannot be undone.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1, padding: '0.65rem', borderRadius: '10px', border: '1px solid var(--border-color)',
              background: 'transparent', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600,
              color: 'var(--text-secondary)',
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            style={{
              flex: 1, padding: '0.65rem', borderRadius: '10px', border: 'none',
              background: 'var(--alert-red)', color: '#fff', cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '0.875rem', fontWeight: 700, opacity: loading ? 0.7 : 1,
              transition: 'opacity 0.2s',
            }}
          >
            {loading ? 'Deleting…' : `Delete User`}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Edit Modal ── */
function EditModal({ user, onConfirm, onCancel, loading }) {
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        background: 'var(--card-bg, #fff)', borderRadius: '20px', padding: '2rem 2.25rem',
        width: '380px', boxShadow: '0 24px 64px rgba(0,0,0,0.25)',
        border: '1px solid var(--border-color)',
        animation: 'fadeSlideIn 0.2s ease',
      }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem' }}>
          Edit User
        </h2>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Username</label>
          <input 
            type="text" 
            value={username} 
            onChange={e => setUsername(e.target.value)}
            style={{
              width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)',
              background: '#f9fafb', fontSize: '0.9rem', outline: 'none'
            }}
          />
        </div>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Email</label>
          <input 
            type="email" 
            value={email} 
            onChange={e => setEmail(e.target.value)}
            style={{
              width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)',
              background: '#f9fafb', fontSize: '0.9rem', outline: 'none'
            }}
          />
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1, padding: '0.65rem', borderRadius: '10px', border: '1px solid var(--border-color)',
              background: 'transparent', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600,
              color: 'var(--text-secondary)',
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(username, email)}
            disabled={loading}
            style={{
              flex: 1, padding: '0.65rem', borderRadius: '10px', border: 'none',
              background: 'var(--accent-blue)', color: '#fff', cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '0.875rem', fontWeight: 700, opacity: loading ? 0.7 : 1,
              transition: 'opacity 0.2s',
            }}
          >
            {loading ? 'Saving…' : `Save Changes`}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Role Selector Popover ── */
function RolePopover({ user, onSelect, onClose }) {
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  return (
    <div ref={ref} style={{
      position: 'absolute', right: 0, top: '110%', zIndex: 100,
      background: 'var(--card-bg, #fff)', borderRadius: '12px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.18)', border: '1px solid var(--border-color)',
      padding: '0.4rem', minWidth: '140px',
      animation: 'fadeSlideIn 0.15s ease',
    }}>
      {ROLES.map(role => (
        <button
          key={role}
          onClick={() => onSelect(role)}
          disabled={user.role === role}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            width: '100%', padding: '0.5rem 0.75rem', border: 'none',
            borderRadius: '8px', cursor: user.role === role ? 'default' : 'pointer',
            background: user.role === role ? roleBg(role) : 'transparent',
            color: user.role === role ? roleColor(role) : 'var(--text-primary)',
            fontWeight: user.role === role ? 700 : 500, fontSize: '0.82rem',
            transition: 'background 0.15s',
          }}
          onMouseEnter={e => { if (user.role !== role) e.currentTarget.style.background = roleBg(role); }}
          onMouseLeave={e => { if (user.role !== role) e.currentTarget.style.background = 'transparent'; }}
        >
          <span>{roleEmoji(role)}</span>
          <span>{role}</span>
          {user.role === role && (
            <span style={{ marginLeft: 'auto', fontSize: '0.7rem' }}>✓ Current</span>
          )}
        </button>
      ))}
    </div>
  );
}

/* ── Main Component ── */
export function AdminDashboardView() {
  const [users, setUsers] = useState([]);
  const [pendingCoaches, setPendingCoaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users');
  const [stats, setStats] = useState({ total: 0, users: 0, coaches: 0, admins: 0, pending: 0 });

  // Role change state
  const [popoverUserId, setPopoverUserId] = useState(null);
  const [confirm, setConfirm] = useState(null); // { user, newRole }
  const [roleChanging, setRoleChanging] = useState(false);
  
  // Edit & Delete state
  const [editTarget, setEditTarget] = useState(null); // user object
  const [deleteTarget, setDeleteTarget] = useState(null); // user object
  const [actionLoading, setActionLoading] = useState(false);

  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [usersRes, pendingRes] = await Promise.all([
        fetch(`${API}/Auth/users`),
        fetch(`${API}/Auth/pending-coaches`),
      ]);
      const usersData = usersRes.ok ? await usersRes.json() : [];
      const pendingData = pendingRes.ok ? await pendingRes.json() : [];
      setUsers(usersData);
      setPendingCoaches(pendingData);
      setStats({
        total: usersData.length,
        users: usersData.filter(u => u.role === 'User').length,
        coaches: usersData.filter(u => u.role === 'Coach' && u.isApproved).length,
        admins: usersData.filter(u => u.role === 'Admin').length,
        pending: pendingData.length,
      });
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, []);

  const handleApprove = async (coachId) => {
    await fetch(`${API}/Auth/approve-coach/${coachId}`, { method: 'PUT' });
    await loadData();
  };

  const handleAssignCoach = async (userId, coachId) => {
    try {
      const res = await fetch(`${API}/Auth/assign-user`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, coachId }),
      });
      if (res.ok) {
        showToast('Coach assignment updated successfully!');
        await loadData();
      } else {
        const err = await res.json();
        showToast(err.message || 'Failed to assign coach', 'error');
      }
    } catch (e) {
      console.error(e);
      showToast('Network error', 'error');
    }
  };

  /* Role change flow */
  const openRoleSelect = (userId) => {
    setPopoverUserId(prev => (prev === userId ? null : userId));
  };

  const requestRoleChange = (user, newRole) => {
    setPopoverUserId(null);
    if (user.role === newRole) return;
    setConfirm({ user, newRole });
  };

  const confirmRoleChange = async () => {
    if (!confirm) return;
    setRoleChanging(true);
    try {
      const res = await fetch(`${API}/Auth/change-role/${confirm.user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: confirm.newRole }),
      });
      if (res.ok) {
        showToast(`${confirm.user.username} is now a ${confirm.newRole}!`);
        await loadData();
      } else {
        const err = await res.json();
        showToast(err.message || 'Failed to change role', 'error');
      }
    } catch (e) {
      console.error(e);
      showToast('Network error', 'error');
    } finally {
      setRoleChanging(false);
      setConfirm(null);
    }
  };

  /* Edit flow */
  const handleEditConfirm = async (newUsername, newEmail) => {
    if (!editTarget) return;
    setActionLoading(true);
    try {
      const res = await fetch(`${API}/Auth/edit-user/${editTarget.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: newUsername, email: newEmail }),
      });
      if (res.ok) {
        showToast(`User ${editTarget.username} updated!`);
        await loadData();
        setEditTarget(null);
      } else {
        const err = await res.json();
        showToast(err.message || 'Failed to update user', 'error');
      }
    } catch (e) {
      console.error(e);
      showToast('Network error', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  /* Delete flow */
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setActionLoading(true);
    try {
      const res = await fetch(`${API}/Auth/delete-user/${deleteTarget.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        showToast(`User ${deleteTarget.username} deleted!`);
        await loadData();
        setDeleteTarget(null);
      } else {
        const err = await res.json();
        showToast(err.message || 'Failed to delete user', 'error');
      }
    } catch (e) {
      console.error(e);
      showToast('Network error', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const sortedUsers = [...users].sort((a, b) => {
    const rolePriority = { 'Coach': 1, 'User': 2, 'Admin': 3 };
    const rA = rolePriority[a.role] || 99;
    const rB = rolePriority[b.role] || 99;
    if (rA !== rB) return rA - rB;
    return a.username.localeCompare(b.username);
  });

  return (
    <div style={{ padding: 0, overflowY: 'auto', height: 'calc(100vh - 130px)' }}>
      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 9998,
          background: toast.type === 'error' ? 'var(--alert-red)' : 'var(--accent-green)',
          color: '#fff', padding: '0.75rem 1.25rem', borderRadius: '12px',
          fontWeight: 600, fontSize: '0.875rem',
          boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
          animation: 'fadeSlideIn 0.25s ease',
        }}>
          {toast.type === 'error' ? '❌ ' : '✅ '}{toast.msg}
        </div>
      )}

      {/* Confirm Modal (Role) */}
      {confirm && (
        <ConfirmModal
          user={confirm.user}
          newRole={confirm.newRole}
          onConfirm={confirmRoleChange}
          onCancel={() => setConfirm(null)}
          loading={roleChanging}
        />
      )}

      {/* Edit Modal */}
      {editTarget && (
        <EditModal
          user={editTarget}
          onConfirm={handleEditConfirm}
          onCancel={() => setEditTarget(null)}
          loading={actionLoading}
        />
      )}

      {/* Delete Modal */}
      {deleteTarget && (
        <DeleteModal
          user={deleteTarget}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
          loading={actionLoading}
        />
      )}

      <div className="page-header">
        <div className="page-title">🛡️ Admin Panel</div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'var(--grid-admin-stats-cols, repeat(5, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'Total Users', value: stats.total, color: 'var(--accent-blue)', icon: '👥' },
          { label: 'Regular', value: stats.users, color: 'var(--accent-green)', icon: '👤' },
          { label: 'Coaches', value: stats.coaches, color: 'var(--alert-orange)', icon: '🎯' },
          { label: 'Admins', value: stats.admins, color: 'var(--alert-red)', icon: '🛡️' },
          { label: 'Pending', value: stats.pending, color: 'var(--accent-purple)', icon: '⏳' },
        ].map(({ label, value, color, icon }) => (
          <div key={label} className="dashboard-card" style={{ padding: '1rem', textAlign: 'center', borderTop: `3px solid ${color}`, marginBottom: 0 }}>
            <div style={{ fontSize: '1.4rem' }}>{icon}</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color }}>{value}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="filter-tabs" style={{ marginBottom: '1.5rem', width: 'fit-content' }}>
        <button className={`filter-tab ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>All Users</button>
        <button className={`filter-tab ${activeTab === 'coaches' ? 'active' : ''}`} onClick={() => setActiveTab('coaches')}>
          Coach Applications {stats.pending > 0 && `(${stats.pending})`}
        </button>
      </div>

      {/* ── All Users Tab ── */}
      {activeTab === 'users' && (
        <div className="dashboard-card" style={{ padding: '1.25rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>All Registered Users</h3>
          {loading ? (
            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem' }}>Loading…</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ background: '#f9fafb' }}>
                    {['ID', 'Username', 'Email', 'Role / Status', 'Assigned Coach', 'Change Role', 'Actions'].map(h => (
                      <th key={h} style={{ padding: '0.75rem', textAlign: 'left', color: 'var(--text-secondary)', fontWeight: 600, borderBottom: '1px solid var(--border-color)', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sortedUsers.map((u, i) => (
                    <tr key={u.id} style={{ background: i % 2 === 0 ? '#fff' : '#f9fafb' }}>
                      <td style={{ padding: '0.75rem', borderBottom: '1px solid #f3f4f6', color: 'var(--text-secondary)' }}>#{u.id}</td>
                      <td style={{ padding: '0.75rem', borderBottom: '1px solid #f3f4f6', fontWeight: 600 }}>{u.username}</td>
                      <td style={{ padding: '0.75rem', borderBottom: '1px solid #f3f4f6', color: 'var(--text-secondary)' }}>{u.email}</td>
                      <td style={{ padding: '0.75rem', borderBottom: '1px solid #f3f4f6' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', alignItems: 'flex-start' }}>
                          <span style={{
                            padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700,
                            background: roleBg(u.role), color: roleColor(u.role),
                          }}>
                            {roleEmoji(u.role)} {u.role}
                          </span>
                          {!u.isApproved && (
                            <span style={{
                              padding: '0.1rem 0.4rem', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 800,
                              background: 'var(--alert-orange-light)', color: 'var(--alert-orange)',
                            }}>
                              Pending Approval
                            </span>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: '0.75rem', borderBottom: '1px solid #f3f4f6' }}>
                        {u.role === 'User' ? (
                          <select
                            value={u.assignedCoachId || ''}
                            onChange={async (e) => {
                              const val = e.target.value;
                              const coachId = val ? parseInt(val, 10) : null;
                              await handleAssignCoach(u.id, coachId);
                            }}
                            style={{
                              padding: '0.35rem 0.5rem',
                              borderRadius: '8px',
                              border: '1px solid var(--border-color)',
                              fontSize: '0.8rem',
                              fontWeight: 600,
                              background: '#FFFFFF',
                              outline: 'none',
                              width: '100%',
                              maxWidth: '160px',
                              cursor: 'pointer'
                            }}
                          >
                            <option value="">No Coach Assigned</option>
                            {users.filter(usr => usr.role === 'Coach' && usr.isApproved).map(c => (
                              <option key={c.id} value={c.id}>
                                {c.username}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>—</span>
                        )}
                      </td>
                      {/* Role Toggle */}
                      <td style={{ padding: '0.75rem', borderBottom: '1px solid #f3f4f6', position: 'relative' }}>
                        <button
                          id={`role-btn-${u.id}`}
                          onClick={() => openRoleSelect(u.id)}
                          style={{
                            display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                            padding: '0.3rem 0.75rem', borderRadius: '20px', border: '1.5px solid var(--border-color)',
                            background: 'transparent', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600,
                            color: 'var(--text-primary)', transition: 'border-color 0.15s, background 0.15s',
                          }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = roleColor(u.role); e.currentTarget.style.background = roleBg(u.role); }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.background = 'transparent'; }}
                        >
                          Set Role
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ marginLeft: '2px', transform: popoverUserId === u.id ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                            <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>

                        {popoverUserId === u.id && (
                          <RolePopover
                            user={u}
                            onSelect={(newRole) => requestRoleChange(u, newRole)}
                            onClose={() => setPopoverUserId(null)}
                          />
                        )}
                      </td>
                      {/* Actions (Edit / Delete) */}
                      <td style={{ padding: '0.75rem', borderBottom: '1px solid #f3f4f6' }}>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button 
                            title="Edit User"
                            onClick={() => setEditTarget(u)}
                            style={{
                              background: 'rgba(59,130,246,0.1)', color: 'var(--accent-blue)',
                              border: 'none', borderRadius: '6px', padding: '0.35rem',
                              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}
                          >
                            <PencilIcon />
                          </button>
                          <button 
                            title="Delete User"
                            onClick={() => setDeleteTarget(u)}
                            style={{
                              background: 'rgba(239,68,68,0.1)', color: 'var(--alert-red)',
                              border: 'none', borderRadius: '6px', padding: '0.35rem',
                              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}
                          >
                            <TrashIcon />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── Coach Applications Tab ── */}
      {activeTab === 'coaches' && (
        <div className="dashboard-card" style={{ padding: '1.25rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>🎯 Pending Coach Applications</h3>
          {pendingCoaches.length === 0 ? (
            <div style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem' }}>
              No pending applications 🎉
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {pendingCoaches.map(c => (
                <div key={c.id} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '1rem 1.25rem', borderRadius: '12px', background: '#f9fafb',
                  border: '1px solid var(--border-color)',
                }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>🎯 {c.username}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{c.email}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--accent-blue)', marginTop: '0.25rem' }}>
                      Qualification: {c.qualification || 'N/A'}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn-primary" onClick={() => handleApprove(c.id)}>✅ Approve</button>
                    <button className="btn-delete" onClick={() => handleApprove(c.id)}>❌ Reject</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Keyframe animation (inject once) */}
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
