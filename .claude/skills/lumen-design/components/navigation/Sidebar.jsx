import React from 'react';
import { Icon } from '../core/Icon.jsx';
import { injectStyles } from '../core/injectStyles.js';

injectStyles('lm-sidebar', `
.lm-side{width:var(--sidebar-width);height:100%;display:flex;flex-direction:column;background:var(--surface-1);box-shadow:1px 0 0 var(--border-subtle);font-family:var(--font-sans);flex-shrink:0}
.lm-side__head{height:var(--nav-height);display:flex;align-items:center;padding:0 20px;flex-shrink:0}
.lm-side__nav{flex:1;overflow-y:auto;padding:8px 12px;display:flex;flex-direction:column;gap:2px}
.lm-side__section{font-family:var(--font-mono);font-size:11px;letter-spacing:var(--tracking-caps);text-transform:uppercase;color:var(--text-tertiary);padding:20px 10px 8px}
.lm-side__item{display:flex;align-items:center;gap:12px;height:40px;padding:0 10px;border-radius:var(--radius-xs);background:none;border:0;color:var(--text-secondary);font-size:14px;letter-spacing:-.01em;cursor:pointer;text-align:left;text-decoration:none;width:100%;transition:background-color var(--duration-fast) var(--ease-out),color var(--duration-fast)}
.lm-side__item:hover{background:var(--action-ghost-hover);color:var(--text-primary);text-decoration:none}
.lm-side__item[aria-current="page"]{background:var(--surface-3);color:var(--text-primary)}
.lm-side__item[aria-current="page"] svg{color:var(--blue-500)}
.lm-side__item:focus-visible{outline:none;box-shadow:var(--focus-shadow)}
.lm-side__badge{margin-left:auto;font-family:var(--font-mono);font-size:11px;min-width:20px;height:18px;padding:0 5px;display:inline-flex;align-items:center;justify-content:center;background:var(--surface-accent);color:var(--white);border-radius:var(--radius-xs)}
.lm-side__foot{padding:12px;box-shadow:0 -1px 0 var(--border-subtle);flex-shrink:0}
`);

export function Sidebar({ header, items = [], value, onChange, footer, className = '', style }) {
  return (
    <aside className={'lm-side ' + className} style={style}>
      {header && <div className="lm-side__head">{header}</div>}
      <nav className="lm-side__nav" aria-label="Sections">
        {items.map((it, i) => it.section ? <div key={'s' + i} className="lm-side__section">{it.section}</div> : (
          <button key={it.value} type="button" className="lm-side__item" aria-current={value === it.value ? 'page' : undefined} onClick={() => onChange && onChange(it.value)}>
            {it.icon && <Icon name={it.icon} size={18} />}<span>{it.label}</span>
            {it.badge != null && <span className="lm-side__badge">{it.badge}</span>}
          </button>
        ))}
      </nav>
      {footer && <div className="lm-side__foot">{footer}</div>}
    </aside>
  );
}
