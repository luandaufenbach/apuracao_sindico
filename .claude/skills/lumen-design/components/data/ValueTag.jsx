import React from 'react';

const VT = {
  dark: { background: 'var(--black)', color: 'var(--white)', boxShadow: '0 0 0 1px var(--border-default)' },
  light: { background: 'var(--white)', color: 'var(--black)' },
  accent: { background: 'var(--blue-600)', color: 'var(--white)' },
};

export function ValueTag({ value, direction = 'up', variant = 'dark', style }) {
  const arrowColor = direction === 'down' ? 'var(--red-400)' : variant === 'accent' ? 'var(--white)' : 'var(--blue-500)';
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 24, padding: '0 8px', fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.02em', fontVariantNumeric: 'tabular-nums', borderRadius: 'var(--radius-xs)', whiteSpace: 'nowrap', ...VT[variant], ...style }}>
      {direction && direction !== 'none' && <span aria-hidden="true" style={{ color: arrowColor, fontSize: 10 }}>{direction === 'down' ? '▼' : '▲'}</span>}
      <span>{value}</span>
    </span>
  );
}
