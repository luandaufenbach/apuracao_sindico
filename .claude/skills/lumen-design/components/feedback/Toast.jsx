import React from 'react';
import { Icon } from '../core/Icon.jsx';
import { IconButton } from '../core/IconButton.jsx';

const TOAST_ICON = { neutral: ['info', 'var(--text-secondary)'], success: ['circle-check', 'var(--green-400)'], warning: ['triangle-alert', 'var(--amber-400)'], danger: ['circle-x', 'var(--red-400)'], info: ['info', 'var(--blue-400)'] };

export function Toast({ tone = 'neutral', title, description, action, onClose, style }) {
  const [icon, color] = TOAST_ICON[tone];
  return (
    <div role={tone === 'danger' ? 'alert' : 'status'} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, width: '100%', maxWidth: 400, padding: '14px 12px 14px 16px', background: 'var(--surface-2)', color: 'var(--text-primary)', borderRadius: 'var(--radius-card)', boxShadow: 'var(--shadow-overlay)', fontFamily: 'var(--font-sans)', pointerEvents: 'auto', ...style }}>
      <span style={{ color, marginTop: 1 }}><Icon name={icon} size={18} /></span>
      <div style={{ flex: 1, minWidth: 0 }}>
        {title && <div style={{ fontSize: 14, fontWeight: 500, letterSpacing: '-0.01em', lineHeight: 1.3 }}>{title}</div>}
        {description && <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.4, marginTop: 2 }}>{description}</div>}
        {action && <button type="button" onClick={action.onClick} style={{ marginTop: 8, padding: 0, background: 'none', border: 0, cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: 'var(--tracking-caps)', textTransform: 'uppercase', color: 'var(--text-accent)' }}>{action.label}</button>}
      </div>
      {onClose && <IconButton icon="x" label="Dismiss" variant="ghost" size="xs" onClick={onClose} />}
    </div>
  );
}
