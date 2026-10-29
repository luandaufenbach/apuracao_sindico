import React from 'react';
import { Icon } from './Icon.jsx';
import { injectStyles } from './injectStyles.js';

injectStyles('lm-iconbutton', `
.lm-ib{display:inline-flex;align-items:center;justify-content:center;border:0;border-radius:var(--radius-control);cursor:pointer;padding:0;flex-shrink:0;transition:background-color var(--duration-fast) var(--ease-out),box-shadow var(--duration-base) var(--ease-out),color var(--duration-fast) var(--ease-out)}
.lm-ib:focus-visible{outline:none;box-shadow:var(--focus-shadow)}
.lm-ib--xs{width:24px;height:24px}.lm-ib--sm{width:32px;height:32px}.lm-ib--md{width:40px;height:40px}.lm-ib--lg{width:48px;height:48px}
@media (pointer:coarse){.lm-ib--sm,.lm-ib--md{min-width:var(--hit-min);min-height:var(--hit-min)}}
.lm-ib--solid{background:var(--surface-3);color:var(--text-primary)}.lm-ib--solid:hover{background:var(--gray-800)}
[data-theme="light"] .lm-ib--solid:hover{background:var(--gray-200)}
.lm-ib--ghost{background:transparent;color:var(--text-secondary)}.lm-ib--ghost:hover{background:var(--action-ghost-hover);color:var(--text-primary)}
.lm-ib--outline{background:transparent;color:var(--text-primary);box-shadow:inset 0 0 0 1px var(--border-default)}.lm-ib--outline:hover{box-shadow:inset 0 0 0 1px var(--text-primary)}
.lm-ib--primary{background:var(--action-primary);color:var(--white)}.lm-ib--primary:hover{box-shadow:var(--glow-sm)}
.lm-ib--inverse{background:var(--surface-inverse);color:var(--text-inverse)}.lm-ib--inverse:hover{opacity:.88}
.lm-ib:disabled{opacity:.4;cursor:not-allowed;box-shadow:none}
`);

export function IconButton({ icon, label, variant = 'solid', size = 'md', type = 'button', className = '', ...rest }) {
  const iconSize = size === 'xs' ? 14 : size === 'sm' ? 16 : size === 'lg' ? 22 : 20;
  return (
    <button type={type} aria-label={label} title={label} className={['lm-ib', 'lm-ib--' + variant, 'lm-ib--' + size, className].join(' ')} {...rest}>
      <Icon name={icon} size={iconSize} />
    </button>
  );
}
