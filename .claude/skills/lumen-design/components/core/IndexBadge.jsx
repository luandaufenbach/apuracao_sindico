import React from 'react';

const IDX_VARIANTS = {
  outline: { color: 'var(--text-primary)', boxShadow: 'inset 0 0 0 1px var(--border-strong)', background: 'transparent' },
  solid: { color: 'var(--white)', background: 'var(--surface-accent)' },
  inverse: { color: 'var(--text-inverse)', background: 'var(--surface-inverse)' },
};

export function IndexBadge({ value, variant = 'outline', size = 'md', style }) {
  const s = size === 'sm' ? 18 : size === 'lg' ? 28 : 22;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: s, height: s, flexShrink: 0,
      fontFamily: 'var(--font-mono)', fontSize: size === 'lg' ? 13 : 11, lineHeight: 1, borderRadius: 'var(--radius-xs)',
      fontVariantNumeric: 'tabular-nums', ...IDX_VARIANTS[variant], ...style,
    }}>{value}</span>
  );
}
