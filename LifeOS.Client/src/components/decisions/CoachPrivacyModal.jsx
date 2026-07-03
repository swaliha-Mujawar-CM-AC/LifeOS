import React from 'react';

export function CoachPrivacyModal({ onConfirm, onCancel, loading }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        background: '#fff', borderRadius: '22px', padding: '2rem 2.25rem',
        maxWidth: '440px', width: '90%', boxShadow: '0 20px 60px rgba(0,0,0,0.18)',
      }}>
        <div style={{ fontSize: '2rem', marginBottom: '0.75rem', textAlign: 'center' }}>🛡️</div>
        <h3 style={{ fontWeight: 900, fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '0.5rem', textAlign: 'center' }}>
          Privacy Notice
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem', textAlign: 'center' }}>
          Sending this decision to your coach will share your <strong>personal information</strong>, including the problem description, your decision, expected and actual outcomes, and lessons learned. Your coach will use this information to provide personalised feedback.
        </p>
        <div style={{ background: '#fef3c7', border: '1px solid #d97706', borderRadius: '12px', padding: '0.75rem 1rem', marginBottom: '1.25rem', display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
          <span style={{ fontSize: '1rem', flexShrink: 0 }}>⚠️</span>
          <p style={{ fontSize: '0.78rem', color: '#92400e', fontWeight: 600, lineHeight: 1.5, margin: 0 }}>
            By continuing, you acknowledge that your data will be visible to your assigned coach.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={onCancel}
            style={{ flex: 1, padding: '0.7rem', borderRadius: '12px', border: '1.5px solid var(--border-color)', background: '#fff', fontFamily: 'var(--font-main)', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer', color: 'var(--text-secondary)' }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            style={{ flex: 1, padding: '0.7rem', borderRadius: '12px', border: 'none', background: 'var(--accent-green)', color: '#fff', fontFamily: 'var(--font-main)', fontWeight: 700, fontSize: '0.88rem', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Sending…' : 'Yes, Share with Coach'}
          </button>
        </div>
      </div>
    </div>
  );
}
