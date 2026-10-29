import React from 'react';

const TONES = {
  neutral: ['var(--surface-3)', 'var(--text-secondary)', 'var(--gray-400)'],
  success: ['var(--status-success-bg)', 'var(--green-400)', 'var(--status-success)'],
  warning: ['var(--status-warning-bg)', 'var(--amber-400)', 'var(--status-warning)'],
  danger: ['var(--status-danger-bg)', 'var(--red-400)', 'var(--status-danger)'],
  info: ['var(--status-info-bg)', 'var(--blue-300)', 'var(--status-info)'],
};

export function Badge({ tone = 'neutral', dot = true, children, style }) {
  const [bg, fg, dc] = TONES[tone];
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 22, padding: '0 8px', fontFamily: 'var(--font-sans)', fontSize: 12, fontWeight: 500, letterSpacing: 0, borderRadius: 'var(--radius-xs)', background: bg, color: fg, whiteSpace: 'nowrap', ...style }}>
      {dot && <span aria-hidden="true" style={{ width: 6, height: 6, borderRadius: 9999, background: dc, boxShadow: tone === 'info' ? '0 0 6px var(--blue-500)' : 'none' }} />}
      {children}
    </span>
  );
}
