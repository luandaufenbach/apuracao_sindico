import React from 'react';
import { Icon } from '../core/Icon.jsx';
import { ValueTag } from './ValueTag.jsx';

const SC = {
  default: { bg: 'var(--surface-1)', fg: 'var(--text-primary)', sub: 'var(--text-tertiary)', iconBg: 'var(--surface-accent)', iconFg: 'var(--white)', ring: 'var(--shadow-hairline)' },
  inverse: { bg: 'var(--surface-inverse)', fg: 'var(--text-inverse)', sub: 'var(--gray-500)', iconBg: 'var(--blue-500)', iconFg: 'var(--white)', ring: 'none' },
  accent: { bg: 'var(--blue-600)', fg: 'var(--white)', sub: 'var(--white)', iconBg: 'var(--black)', iconFg: 'var(--white)', ring: 'none' },
  outline: { bg: 'transparent', fg: 'var(--text-primary)', sub: 'var(--text-tertiary)', iconBg: 'var(--surface-3)', iconFg: 'var(--text-primary)', ring: 'inset 0 0 0 1px var(--border-default)' },
};

export function StatCard({ label, icon, value, caption, delta, variant = 'default', size = 'md', children, style }) {
  const t = SC[variant];
  const lg = size === 'lg';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 24, minHeight: lg ? 280 : 180, padding: lg ? 'clamp(20px,2.5vw,28px)' : 20, background: t.bg, color: t.fg, boxShadow: t.ring, borderRadius: 'var(--radius-card)', fontFamily: 'var(--font-sans)', minWidth: 0, ...style }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {icon && <span style={{ width: lg ? 32 : 24, height: lg ? 32 : 24, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: t.iconBg, color: t.iconFg, borderRadius: 'var(--radius-xs)', flexShrink: 0 }}><Icon name={icon} size={lg ? 18 : 14} strokeWidth={1.75} /></span>}
        <span style={{ fontSize: lg ? 20 : 15, letterSpacing: '-0.02em', lineHeight: 1.2 }}>{label}</span>
        {delta && <span style={{ marginLeft: 'auto' }}><ValueTag value={delta.value} direction={delta.direction || 'up'} variant={variant === 'inverse' ? 'dark' : variant === 'accent' ? 'light' : 'dark'} /></span>}
      </div>
      {children}
      <div>
        <div style={{ fontSize: lg ? 'clamp(44px, 2rem + 3vw, 64px)' : 'clamp(32px, 1.6rem + 1.5vw, 44px)', lineHeight: 1, letterSpacing: '-0.045em', fontVariantNumeric: 'tabular-nums' }}>{value}</div>
        {caption && <div style={{ fontSize: 14, color: t.sub, marginTop: 8, letterSpacing: '-0.01em' }}>{caption}</div>}
      </div>
    </div>
  );
}
