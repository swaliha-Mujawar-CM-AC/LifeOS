import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Toaster } from 'react-hot-toast';
import * as signalR from '@microsoft/signalr';
import { SVGIcons } from './components/SVGIcons';
import { AuthPage } from './pages/AuthPage';
import { UserDashboard } from './pages/UserDashboard';
import { UserTasks } from './pages/UserTasks';
import { UserHabits } from './pages/UserHabits';
import { UserDecisions } from './pages/UserDecisions';
import { UserFinance } from './pages/UserFinance';
import { AdminDashboardView } from './pages/AdminDashboardView';
import { ClientTasksView } from './pages/Coach/ClientTasksView';
import { ClientHabitsView } from './pages/Coach/ClientHabitsView';
import { ClientFinanceView } from './pages/Coach/ClientFinanceView';
import { ClientDecisionsView } from './pages/Coach/ClientDecisionsView';

const API = `http://${window.location.hostname}:5196/api`;

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('lifeos_user');
      if (saved) {
        const user = JSON.parse(saved);
        if (user && user.role && user.username) return user;
        localStorage.removeItem('lifeos_user'); // Clear corrupted state
      }
    } catch (e) {
      localStorage.removeItem('lifeos_user');
    }
    return null;
  });
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('lifeos_active_tab') || 'dashboard';
  });
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [connection, setConnection] = useState(null);

  const notifRef = useRef(null);
  const profileRef = useRef(null);
  const menuRef = useRef(null);
  const menuBtnRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('lifeos_active_tab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showNotifPanel && notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifPanel(false);
      }
      if (showProfileMenu && profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
      if (showMobileMenu && 
          menuRef.current && !menuRef.current.contains(event.target) &&
          menuBtnRef.current && !menuBtnRef.current.contains(event.target)) {
        setShowMobileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [showNotifPanel, showProfileMenu, showMobileMenu]);

  const triggerRefresh = () => setRefreshTrigger(prev => prev + 1);

  const handleLogout = () => {
    localStorage.removeItem('lifeos_user');
    if (connection) connection.stop();
    setCurrentUser(null);
    setNotifications([]);
    setUnreadCount(0);
  };

  // Fetch notifications
  const loadNotifications = useCallback(async (userId) => {
    try {
      const [notifRes, countRes] = await Promise.all([
        fetch(`${API}/Notification/user/${userId}`),
        fetch(`${API}/Notification/unread-count/${userId}`)
      ]);
      if (notifRes.ok) setNotifications(await notifRes.json());
      if (countRes.ok) {
        const data = await countRes.json();
        setUnreadCount(data.count);
      }
    } catch (e) { console.error('Failed to load notifications', e); }
  }, []);

  // Setup SignalR connection
  useEffect(() => {
    if (!currentUser) return;

    const conn = new signalR.HubConnectionBuilder()
      .withUrl(`http://${window.location.hostname}:5196/hubs/notifications`)
      .withAutomaticReconnect()
      .build();

    conn.on('ReceiveNotification', (notif) => {
      setNotifications(prev => [notif, ...prev]);
      setUnreadCount(prev => prev + 1);
    });

    conn.start()
      .then(() => {
        conn.invoke('JoinUserGroup', currentUser.id.toString());
      })
      .catch(err => console.error('SignalR connection failed:', err));

    setConnection(conn);
    loadNotifications(currentUser.id);

    return () => { conn.stop(); };
  }, [currentUser, loadNotifications]);

  const markAllRead = async () => {
    if (!currentUser) return;
    await fetch(`${API}/Notification/read-all/${currentUser.id}`, { method: 'PUT' });
    setUnreadCount(0);
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const markAsRead = async (id) => {
    try {
      const res = await fetch(`${API}/Notification/${id}/read`, { method: 'PUT' });
      if (res.ok) {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (e) { console.error('Failed to mark notification as read', e); }
  };

  if (!currentUser) {
    return <AuthPage onLoginSuccess={(user) => {
      localStorage.setItem('lifeos_user', JSON.stringify(user));
      setCurrentUser(user);
      setActiveTab('dashboard');
    }} />;
  }

  const renderUserViews = () => (
    <>
      {activeTab === 'dashboard' && <UserDashboard user={currentUser} triggerRefresh={refreshTrigger} onUpdate={triggerRefresh} onNavigate={setActiveTab} />}
      {activeTab === 'tasks' && <UserTasks user={currentUser} onUpdate={triggerRefresh} />}
      {activeTab === 'habits' && <UserHabits user={currentUser} onUpdate={triggerRefresh} />}
      {activeTab === 'decisions' && <UserDecisions user={currentUser} onUpdate={triggerRefresh} />}
      {activeTab === 'finance' && <UserFinance user={currentUser} onUpdate={triggerRefresh} />}
    </>
  );

  const renderCoachViews = () => (
    <>
      {activeTab === 'dashboard' && <ClientTasksView coach={currentUser} />}
      {activeTab === 'tasks' && <ClientTasksView coach={currentUser} />}
      {activeTab === 'habits' && <ClientHabitsView coach={currentUser} />}
      {activeTab === 'finance' && <ClientFinanceView coach={currentUser} />}
      {activeTab === 'decisions' && <ClientDecisionsView coach={currentUser} />}
    </>
  );

  const renderAdminViews = () => (
    <>{activeTab === 'dashboard' && <AdminDashboardView />}</>
  );

  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <div className="app-container">
      <Toaster position="top-center" toastOptions={{ style: { fontFamily: 'var(--font-main)', fontWeight: 600 } }} />
      <header className="app-header">
        <div className="header-left" style={{ display: 'flex', alignItems: 'center' }}>
          <div className="logo-icon" style={{ display: 'flex', alignItems: 'center', height: '62px', marginLeft: '-20px' }}>
            <img src="/logo.png" alt="LifeOS Logo" style={{ height: '115px', width: 'auto', objectFit: 'contain' }} />
          </div>
        </div>
        
        {/* Mobile Hamburger Button */}
        <button ref={menuBtnRef} className="mobile-menu-btn" onClick={() => setShowMobileMenu(!showMobileMenu)} style={{ display: 'none' }}>
          <SVGIcons.Menu />
        </button>

        <nav ref={menuRef} className={`header-nav ${showMobileMenu ? 'mobile-open' : ''}`}>
          {currentUser.role === 'User' && (
            <>
              <button className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => { setActiveTab('dashboard'); setShowMobileMenu(false); }}><SVGIcons.Dashboard /> Dashboard</button>
              <button className={`nav-link ${activeTab === 'tasks' ? 'active' : ''}`} onClick={() => { setActiveTab('tasks'); setShowMobileMenu(false); }}><SVGIcons.Tasks /> Tasks</button>
              <button className={`nav-link ${activeTab === 'habits' ? 'active' : ''}`} onClick={() => { setActiveTab('habits'); setShowMobileMenu(false); }}><SVGIcons.Flame /> Habits</button>
              <button className={`nav-link ${activeTab === 'finance' ? 'active' : ''}`} onClick={() => { setActiveTab('finance'); setShowMobileMenu(false); }}><SVGIcons.Expenses /> Expenses</button>
              <button className={`nav-link ${activeTab === 'decisions' ? 'active' : ''}`} onClick={() => { setActiveTab('decisions'); setShowMobileMenu(false); }}><SVGIcons.Decisions /> Decisions</button>
            </>
          )}
          {currentUser.role === 'Coach' && (
            <>
              <button className={`nav-link ${activeTab === 'tasks' ? 'active' : '' }${activeTab === 'dashboard' ? ' active' : ''}`} onClick={() => { setActiveTab('tasks'); setShowMobileMenu(false); }}><SVGIcons.Tasks /> Client Tasks</button>
              <button className={`nav-link ${activeTab === 'habits' ? 'active' : ''}`} onClick={() => { setActiveTab('habits'); setShowMobileMenu(false); }}><SVGIcons.Flame /> Client Habits</button>
              <button className={`nav-link ${activeTab === 'finance' ? 'active' : ''}`} onClick={() => { setActiveTab('finance'); setShowMobileMenu(false); }}><SVGIcons.Expenses /> Client Finance</button>
              <button className={`nav-link ${activeTab === 'decisions' ? 'active' : ''}`} onClick={() => { setActiveTab('decisions'); setShowMobileMenu(false); }}><SVGIcons.Decisions /> Client Decisions</button>
            </>
          )}
          {currentUser.role === 'Admin' && (
            <>
              <button className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => { setActiveTab('dashboard'); setShowMobileMenu(false); }}><SVGIcons.Dashboard /> Admin Panel</button>
            </>
          )}
        </nav>
        <div className="header-right" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>

          {/* Notification Bell */}
          <div style={{ position: 'relative' }} ref={notifRef}>
            <button className="notification-bell" onClick={() => {
              const nextState = !showNotifPanel;
              setShowNotifPanel(nextState);
              if (nextState && unreadCount > 0) {
                markAllRead();
              }
            }}>
              <SVGIcons.Bell />
              {unreadCount > 0 && (
                <span className="notification-badge">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Panel Dropdown */}
            {showNotifPanel && (
              <div className="notif-panel">
                <div className="notif-panel-header">
                  <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Notifications</span>
                  {unreadCount > 0 && (
                    <button onClick={markAllRead} style={{ background: 'none', border: 'none', color: 'var(--accent-green)', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="notif-panel-list">
                  {notifications.length === 0 ? (
                    <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                      No notifications yet
                    </div>
                  ) : (
                    notifications.slice(0, 20).map(n => (
                      <div key={n.id} className={`notif-item ${!n.isRead ? 'unread' : ''}`} onClick={() => !n.isRead && markAsRead(n.id)}>
                        <div className="notif-icon-wrapper">
                          {n.type === 'CoachFeedback' ? '💬' : n.type === 'CoachApplication' ? '🎯' : '🔔'}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div className="notif-title">{n.title}</div>
                          <div className="notif-message">{n.message}</div>
                          <div className="notif-time">{timeAgo(n.createdAt)}</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <div style={{ position: 'relative' }} ref={profileRef}>
            <div className="user-profile" onClick={() => setShowProfileMenu(!showProfileMenu)} style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '25px', padding: '0.2rem 0.6rem 0.2rem 0.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid rgba(255,255,255,0.05)', marginLeft: '0.5rem' }}>
              <div className="user-avatar-placeholder" style={{ width: '32px', height: '32px', background: '#71a37c', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', fontWeight: 600, border: 'none' }}>
                {currentUser.username.charAt(0).toUpperCase()}
              </div>
              <span className="user-name" style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1, fontSize: '0.8rem', fontWeight: 500, paddingRight: '0.25rem' }}>
                {currentUser.username === 'john' ? 'John' : (currentUser.username.charAt(0).toUpperCase() + currentUser.username.slice(1))}
              </span>
              <span style={{ transform: showProfileMenu ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', fontSize: '0.55rem', color: 'rgba(255,255,255,0.8)' }}>
                ▼
              </span>
            </div>

            {showProfileMenu && (
              <div className="notif-panel" style={{ width: '150px', marginTop: '0.5rem', right: 0, padding: '0.5rem' }}>
                <button className="nav-link" onClick={handleLogout} style={{ width: '100%', color: 'var(--alert-red)', padding: '0.5rem 0.75rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', hover: { background: 'var(--alert-red-light)' } }}>
                  <SVGIcons.Logout />
                  <span>Log Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
      <main className="main-content">
        {currentUser.role === 'User' && renderUserViews()}
        {currentUser.role === 'Coach' && renderCoachViews()}
        {currentUser.role === 'Admin' && renderAdminViews()}
      </main>
      <footer className="app-footer">
        <div className="footer-left">Your system. Your growth. Your future.</div>
        <div className="footer-right">Stay consistent. Stay unstoppable. 💚</div>
      </footer>
    </div>
  );
}
