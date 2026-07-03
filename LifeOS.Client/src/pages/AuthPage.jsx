import React, { useState } from 'react';
import { SVGIcons } from '../components/SVGIcons';

const API_BASE = `http://${window.location.hostname}:5196/api`;

export function AuthPage({ onLoginSuccess }) {
  const [authMode, setAuthMode] = useState('login'); // 'login', 'register', 'forgot-password'
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [role, setRole] = useState('User');
  const [qualification, setQualification] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (authMode === 'login') {
      // Login
      fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: email, password })
      })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Login failed');
        onLoginSuccess(data.user);
      })
      .catch(err => {
        setErrorMsg(err.message);
      });
    } else if (authMode === 'register') {
      // Register
      fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password, role, qualification, securityAnswer })
      })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Registration failed');
        if (role === 'Coach') {
          setSuccessMsg('Coach application submitted successfully! It is pending admin approval.');
        } else {
          setSuccessMsg('Registration successful! You can now log in.');
        }
        setAuthMode('login');
        setUsername('');
        setPassword('');
        setSecurityAnswer('');
      })
      .catch(err => {
        setErrorMsg(err.message);
      });
    } else if (authMode === 'forgot-password') {
      // Forgot Password
      fetch(`${API_BASE}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, securityAnswer, newPassword })
      })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Password reset failed');
        setSuccessMsg(data.message || 'Password reset successfully! You can now log in.');
        setAuthMode('login');
        setPassword('');
        setNewPassword('');
        setSecurityAnswer('');
      })
      .catch(err => {
        setErrorMsg(err.message);
      });
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo" style={{ marginBottom: '-1.25rem', marginTop: '-2.1rem' }}>
          <img src="/logo.png" alt="LifeOS Logo" style={{ height: '180px', width: 'auto', objectFit: 'contain' }} />
        </div>

        <div className="auth-welcome" style={{ marginBottom: '0.85rem' }}>
          <h2>{authMode === 'forgot-password' ? 'Reset Password' : 'Welcome back!'}</h2>
          <p>{authMode === 'forgot-password' ? 'Answer your security question to reset password' : 'Login or Register to access your system'}</p>
        </div>

        {errorMsg && <div className="auth-alert error">{errorMsg}</div>}
        {successMsg && <div className="auth-alert success">{successMsg}</div>}

        <form onSubmit={handleSubmit} className="auth-form" style={{ gap: '1.15rem' }}>
          {authMode !== 'forgot-password' && (
            <div className="form-group">
              <label className="form-label">{authMode === 'login' ? 'Email Address' : 'Username'}</label>
              <div className="input-wrapper">
                <span className="input-icon"><SVGIcons.User /></span>
                {authMode === 'login' ? (
                  <input 
                    type="email" 
                    className="form-input" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    placeholder="Enter email address" 
                    required 
                  />
                ) : (
                  <input 
                    type="text" 
                    className="form-input" 
                    value={username} 
                    onChange={e => setUsername(e.target.value)} 
                    placeholder="Enter username" 
                    required 
                  />
                )}
              </div>
            </div>
          )}

          {(authMode === 'register' || authMode === 'forgot-password') && (
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-wrapper">
                <span className="input-icon"><SVGIcons.User /></span>
                <input 
                  type="email" 
                  className="form-input" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  placeholder="Enter email address" 
                  required 
                />
              </div>
            </div>
          )}

          {authMode !== 'forgot-password' && (
            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-wrapper">
                <span className="input-icon"><SVGIcons.Lock /></span>
                <div style={{ position: 'relative', flex: 1 }}>
                  <input 
                    type="password" 
                    className="form-input" 
                    style={{ width: '100%', paddingRight: '2.5rem' }}
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    placeholder="Enter password" 
                    required 
                  />
                  <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent-green)', cursor: 'pointer' }}>
                    <SVGIcons.Eye />
                  </span>
                </div>
              </div>
            </div>
          )}

          {(authMode === 'register' || authMode === 'forgot-password') && (
            <div className="form-group">
              <label className="form-label">Security Question: Name of your 1st school</label>
              <div className="input-wrapper">
                <span className="input-icon"><SVGIcons.Shield /></span>
                <input 
                  type="text" 
                  className="form-input" 
                  value={securityAnswer} 
                  onChange={e => setSecurityAnswer(e.target.value)} 
                  placeholder="Enter your answer" 
                  required 
                />
              </div>
            </div>
          )}

          {authMode === 'forgot-password' && (
            <div className="form-group">
              <label className="form-label">New Password</label>
              <div className="input-wrapper">
                <span className="input-icon"><SVGIcons.Lock /></span>
                <div style={{ position: 'relative', flex: 1 }}>
                  <input 
                    type="password" 
                    className="form-input" 
                    style={{ width: '100%', paddingRight: '2.5rem' }}
                    value={newPassword} 
                    onChange={e => setNewPassword(e.target.value)} 
                    placeholder="Enter new password" 
                    required 
                  />
                  <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent-green)', cursor: 'pointer' }}>
                    <SVGIcons.Eye />
                  </span>
                </div>
              </div>
            </div>
          )}

          {authMode === 'register' && (
            <>
              <div className="form-group">
                <label className="form-label">Register As</label>
                <div className="input-wrapper">
                  <span className="input-icon"><SVGIcons.Check /></span>
                  <select 
                    className="form-input" 
                    value={role} 
                    onChange={e => setRole(e.target.value)}
                  >
                    <option value="User">User / Client</option>
                    <option value="Coach">Coach / Instructor</option>
                  </select>
                </div>
              </div>

              {role === 'Coach' && (
                <div className="form-group">
                  <label className="form-label">Coach Qualifications</label>
                  <div className="input-wrapper">
                    <span className="input-icon"><SVGIcons.Check /></span>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={qualification} 
                      onChange={e => setQualification(e.target.value)} 
                      placeholder="e.g. Certified Personal Trainer" 
                      required 
                    />
                  </div>
                </div>
              )}
            </>
          )}

          <button type="submit" className="auth-submit-btn" style={{ marginTop: '0.5rem' }}>
            {authMode === 'login' ? 'Sign In' : authMode === 'register' ? 'Create Account' : 'Reset Password'}
            {authMode === 'login' && <SVGIcons.Leaf />}
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', margin: '1.25rem 0', gap: '1rem' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }}></div>
          <div style={{ color: '#8fae9a' }}><SVGIcons.Leaf /></div>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }}></div>
        </div>

        <div className="auth-toggle" style={{ marginTop: 0, marginBottom: '0.5rem' }}>
          {authMode === 'login' ? (
            <>
              <p>Don't have an account? <span onClick={() => { setAuthMode('register'); setErrorMsg(''); }}>Register here</span></p>
              <p style={{ marginTop: '0.5rem' }}><span onClick={() => { setAuthMode('forgot-password'); setErrorMsg(''); }}>Forgot Password?</span></p>
            </>
          ) : (
            <p>Back to login? <span onClick={() => { setAuthMode('login'); setErrorMsg(''); }}>Sign in here</span></p>
          )}
        </div>

      </div>
    </div>
  );
}
