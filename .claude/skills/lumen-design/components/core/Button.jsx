import React from 'react';
import { Icon } from './Icon.jsx';
import { injectStyles } from './injectStyles.js';

injectStyles('lm-button', `
.lm-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;font-family:var(--font-sans);font-weight:500;letter-spacing:-0.01em;line-height:1;border:0;border-radius:var(--radius-control);cursor:pointer;white-space:nowrap;text-decoration:none;user-select:none;position:relative;transition:background-color var(--duration-fast) var(--ease-out),box-shadow var(--duration-base) var(--ease-out),color var(--duration-fast) var(--ease-out),transform var(--duration-instant) var(--ease-out)}
.lm-btn:hover{text-decoration:none}
.lm-btn:focus-visible{outline:none;box-shadow:var(--focus-shadow)}
.lm-btn:active:not(:disabled){transform:translateY(1px)}
.lm-btn--sm{height:var(--control-sm);padding:0 12px;font-size:13px}
.lm-btn--md{height:var(--control-md);padding:0 16px;font-size:14px}
.lm-btn--lg{height:var(--control-lg);padding:0 22px;font-size:15px}
@media (pointer:coarse){.lm-btn--sm,.lm-btn--md{min-height:var(--hit-min)}}
.lm-btn--full{width:100%}
.lm-btn--primary{background:var(--action-primary);color:var(--text-on-accent)}
.lm-btn--primary:hover{color:var(--text-on-accent);background:var(--action-primary-hover);box-shadow:var(--glow-sm)}
.lm-btn--primary:active{background:var(--action-primary-press)}
.lm-btn--secondary{background:var(--action-secondary);color:var(--action-secondary-text)}
.lm-btn--secondary:hover{color:var(--action-secondary-text);background:var(--action-secondary-hover)}
.lm-btn--outline{background:transparent;color:var(--text-primary);box-shadow:inset 0 0 0 1px var(--border-strong)}
.lm-btn--outline:hover{color:var(--text-primary);background:var(--action-ghost-hover);box-shadow:inset 0 0 0 1px var(--text-primary)}
.lm-btn--ghost{background:transparent;color:var(--text-primary)}
.lm-btn--ghost:hover{color:var(--text-primary);background:var(--action-ghost-hover)}
.lm-btn--danger{background:var(--red-700);color:var(--white)}
.lm-btn--danger:hover{color:var(--white);background:#C42A31}
.lm-btn:disabled,.lm-btn[aria-disabled="true"]{opacity:.4;cursor:not-allowed;box-shadow:none;transform:none}
.lm-btn__spin{width:14px;height:14px;border-radius:50%;border:1.5px solid currentColor;border-right-color:transparent;animation:lm-spin .7s linear infinite}
@keyframes lm-spin{to{transform:rotate(360deg)}}
`);

export function Button({ variant = 'primary', size = 'md', iconLeft, iconRight, fullWidth = false, loading = false, disabled = false, href, type = 'button', children, className = '', ...rest }) {
  const cls = ['lm-btn', 'lm-btn--' + variant, 'lm-btn--' + size, fullWidth && 'lm-btn--full', className].filter(Boolean).join(' ');
  const iconSize = size === 'lg' ? 18 : 16;
  const content = (
    <>
      {loading ? <span className="lm-btn__spin" aria-hidden="true" /> : iconLeft && <Icon name={iconLeft} size={iconSize} />}
      {children}
      {iconRight && !loading && <Icon name={iconRight} size={iconSize} />}
    </>
  );
  if (href) {
    return <a href={disabled ? undefined : href} className={cls} aria-disabled={disabled || undefined} {...rest}>{content}</a>;
  }
  return <button type={type} className={cls} disabled={disabled || loading} aria-busy={loading || undefined} {...rest}>{content}</button>;
}
