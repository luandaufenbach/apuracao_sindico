import React from 'react';
import { Icon } from '../core/Icon.jsx';
import { injectStyles } from '../core/injectStyles.js';

injectStyles('lm-bottomnav', `
.lm-bnav{display:flex;align-items:stretch;height:calc(var(--tabbar-height) + env(safe-area-inset-bottom));padding-bottom:env(safe-area-inset-bottom);background:rgba(10,11,13,.88);-webkit-backdrop-filter:var(--blur-nav);backdrop-filter:var(--blur-nav);box-shadow:0 -1px 0 var(--border-subtle);font-family:var(--font-sans);z-index:var(--z-nav)}
[data-theme="light"] .lm-bnav{background:rgba(255,255,255,.9)}
.lm-bnav--fixed{position:fixed;left:0;right:0;bottom:0}
@media (min-width:1024px){.lm-bnav--auto{display:none}}
.lm-bnav__item{flex:1;min-width:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;background:none;border:0;color:var(--text-tertiary);font-size:11px;font-weight:500;letter-spacing:0;cursor:pointer;position:relative;transition:color var(--duration-fast)}
.lm-bnav__item[aria-current="page"]{color:var(--text-primary)}
.lm-bnav__item[aria-current="page"] svg{color:var(--blue-500)}
.lm-bnav__item[aria-current="page"]::before{content:"";position:absolute;top:0;left:30%;right:30%;height:2px;background:var(--blue-500);box-shadow:var(--glow-sm)}
.lm-bnav__item:focus-visible{outline:none;box-shadow:inset var(--focus-shadow)}
.lm-bnav__dot{position:absolute;top:10px;left:calc(50% + 6px);min-width:16px;height:16px;padding:0 4px;border-radius:9999px;background:var(--blue-500);color:var(--white);font-family:var(--font-mono);font-size:10px;display:flex;align-items:center;justify-content:center}
`);

export function BottomNav({ items = [], value, onChange, position = 'fixed', hideOnDesktop = true, className = '', style }) {
  const cls = ['lm-bnav', position === 'fixed' && 'lm-bnav--fixed', hideOnDesktop && 'lm-bnav--auto', className].filter(Boolean).join(' ');
  return (
    <nav className={cls} style={style} aria-label="Primary">
      {items.slice(0, 5).map(it => (
        <button key={it.value} type="button" className="lm-bnav__item" aria-current={value === it.value ? 'page' : undefined} onClick={() => onChange && onChange(it.value)}>
          <Icon name={it.icon} size={22} />
          <span>{it.label}</span>
          {it.badge != null && <span className="lm-bnav__dot">{it.badge}</span>}
        </button>
      ))}
    </nav>
  );
}
