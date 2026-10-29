import React from 'react';
import { Icon } from '../core/Icon.jsx';
import { IndexBadge } from '../core/IndexBadge.jsx';
import { injectStyles } from '../core/injectStyles.js';

injectStyles('lm-accordion', `
.lm-acc{display:flex;flex-direction:column;font-family:var(--font-sans)}
.lm-acc--filled{gap:8px}
.lm-acc__item{border-radius:var(--radius-xs);transition:background-color var(--duration-base) var(--ease-out)}
.lm-acc--filled .lm-acc__item{background:var(--surface-2)}
[data-theme="light"] .lm-acc--filled .lm-acc__item{background:var(--gray-50)}
.lm-acc--divided .lm-acc__item{border-radius:0;box-shadow:inset 0 -1px 0 var(--border-subtle)}
.lm-acc__item--accent{background:var(--blue-600) !important;color:var(--white)}
.lm-acc__head{width:100%;display:flex;align-items:center;gap:12px;min-height:56px;padding:12px 16px;background:none;border:0;color:inherit;text-align:left;cursor:pointer;font-size:15px;letter-spacing:-.01em;line-height:1.3}
.lm-acc--divided .lm-acc__head{padding:16px 0;min-height:64px;font-size:18px;letter-spacing:-.02em}
.lm-acc__head:focus-visible{outline:none;box-shadow:var(--focus-shadow);border-radius:var(--radius-xs)}
.lm-acc__title{flex:1;min-width:0}
.lm-acc__meta{font-family:var(--font-mono);font-size:12px;color:var(--text-tertiary);letter-spacing:.02em}
.lm-acc__toggle{width:24px;height:24px;flex-shrink:0;display:inline-flex;align-items:center;justify-content:center;border-radius:var(--radius-xs);background:var(--surface-3);color:var(--text-primary);transition:background-color var(--duration-fast)}
[data-theme="light"] .lm-acc__toggle{background:var(--gray-200)}
.lm-acc__head:hover .lm-acc__toggle{background:var(--gray-700)}
[data-theme="light"] .lm-acc__head:hover .lm-acc__toggle{background:var(--gray-300)}
.lm-acc__item--accent .lm-acc__toggle{background:var(--white);color:var(--black)}
.lm-acc__panel{display:grid;grid-template-rows:0fr;transition:grid-template-rows var(--duration-slow) var(--ease-emphasized)}
.lm-acc__panel--open{grid-template-rows:1fr}
.lm-acc__inner{overflow:hidden}
.lm-acc__body{padding:0 16px 18px;font-size:14px;line-height:1.5;color:var(--text-secondary);max-width:68ch}
.lm-acc--numbered .lm-acc__body{padding-left:50px}
.lm-acc--divided .lm-acc__body{padding:0 0 20px;font-size:16px}
.lm-acc__item--accent .lm-acc__body{color:var(--white)}
`);

export function Accordion({ items = [], type = 'single', defaultOpen = [], variant = 'filled', numbered = false, accentOpen = false, className = '', style }) {
  const [open, setOpen] = React.useState(() => new Set(defaultOpen));
  const baseId = React.useId();
  const toggle = id => setOpen(prev => {
    const next = new Set(type === 'single' ? [] : prev);
    if (!prev.has(id)) next.add(id);
    return next;
  });
  return (
    <div className={['lm-acc', 'lm-acc--' + variant, numbered && 'lm-acc--numbered', className].filter(Boolean).join(' ')} style={style}>
      {items.map((it, i) => {
        const id = it.id ?? String(i);
        const isOpen = open.has(id);
        const hid = baseId + '-h' + i, pid = baseId + '-p' + i;
        return (
          <div key={id} className={['lm-acc__item', isOpen && accentOpen && 'lm-acc__item--accent'].filter(Boolean).join(' ')}>
            <button type="button" id={hid} className="lm-acc__head" aria-expanded={isOpen} aria-controls={pid} onClick={() => toggle(id)}>
              {numbered && <IndexBadge value={i + 1} variant={isOpen && accentOpen ? 'inverse' : 'outline'} />}
              <span className="lm-acc__title">{it.title}</span>
              {it.meta && <span className="lm-acc__meta">{it.meta}</span>}
              <span className="lm-acc__toggle" aria-hidden="true"><Icon name={isOpen ? 'minus' : 'plus'} size={14} strokeWidth={2} /></span>
            </button>
            <div id={pid} role="region" aria-labelledby={hid} className={'lm-acc__panel' + (isOpen ? ' lm-acc__panel--open' : '')}>
              <div className="lm-acc__inner"><div className="lm-acc__body">{it.content}</div></div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
