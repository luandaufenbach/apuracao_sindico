import React from 'react';
import { Icon } from './Icon.jsx';

const TAG_VARIANTS = {
  inverse: { background: 'var(--surface-inverse)', color: 'var(--text-inverse)' },
  accent: { background: 'var(--surface-accent)', color: 'var(--white)' },
  subtle: { background: 'var(--surface-3)', color: 'var(--text-secondary)' },
  outline: { background: 'transparent', color: 'var(--text-secondary)', boxShadow: 'inset 0 0 0 1px var(--border-default)' },
};

export function Tag({ variant = 'inverse', size = 'md', uppercase = false, icon, children, style, ...rest }) {
  const fs = size === 'sm' ? 11 : 12;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-mono)', fontSize: fs, lineHeight: 1,
      letterSpacing: uppercase ? 'var(--tracking-caps)' : 'var(--tracking-mono)', textTransform: uppercase ? 'uppercase' : 'none',
      padding: size === 'sm' ? '3px 5px' : '5px 7px', borderRadius: 'var(--radius-xs)', whiteSpace: 'nowrap', flexShrink: 0, alignSelf: 'flex-start', width: 'fit-content',
      ...TAG_VARIANTS[variant], ...style,
    }} {...rest}>
      {icon && <Icon name={icon} size={fs + 1} strokeWidth={1.75} />}
      {children}
    </span>
  );
}
