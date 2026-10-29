import React from 'react';
import { injectStyles } from '../core/injectStyles.js';

injectStyles('lm-tabs', `
.lm-tabs{display:flex;align-items:center;overflow-x:auto;scrollbar-width:none;-webkit-overflow-scrolling:touch;max-width:100%}
.lm-tabs::-webkit-scrollbar{display:none}
.lm-tab{flex-shrink:0;display:inline-flex;align-items:center;justify-content:center;gap:6px;background:none;border:0;cursor:pointer;white-space:nowrap;transition:color var(--duration-fast) var(--ease-out),background-color var(--duration-fast) var(--ease-out),box-shadow var(--duration-fast)}
.lm-tab:focus-visible{outline:none;box-shadow:var(--focus-shadow)}
.lm-tab__count{font-family:var(--font-mono);font-size:11px;color:var(--text-tertiary)}
.lm-tabs--text{gap:16px}
.lm-tabs--text .lm-tab{height:32px;padding:0 2px;font-family:var(--font-mono);font-size:12px;letter-spacing:var(--tracking-caps);text-transform:uppercase;color:var(--text-tertiary)}
.lm-tabs--text .lm-tab:hover{color:var(--text-secondary)}
.lm-tabs--text .lm-tab[aria-selected="true"]{color:var(--text-primary)}
.lm-tabs--segmented{display:inline-flex;gap:2px;padding:3px;background:var(--surface-2);border-radius:var(--radius-control);box-shadow:inset 0 0 0 1px var(--border-subtle)}
.lm-tabs--segmented .lm-tab{height:30px;padding:0 12px;border-radius:var(--radius-xs);font-family:var(--font-mono);font-size:12px;letter-spacing:var(--tracking-caps);text-transform:uppercase;color:var(--text-secondary)}
.lm-tabs--segmented .lm-tab:hover{color:var(--text-primary)}
.lm-tabs--segmented .lm-tab[aria-selected="true"]{background:var(--surface-inverse);color:var(--text-inverse)}
.lm-tabs--segmented .lm-tab[aria-selected="true"] .lm-tab__count{color:inherit;opacity:.6}
.lm-tabs--underline{gap:24px;box-shadow:inset 0 -1px 0 var(--border-subtle)}
.lm-tabs--underline .lm-tab{height:44px;padding:0;font-family:var(--font-sans);font-size:14px;letter-spacing:-.01em;color:var(--text-tertiary)}
.lm-tabs--underline .lm-tab:hover{color:var(--text-primary)}
.lm-tabs--underline .lm-tab[aria-selected="true"]{color:var(--text-primary);box-shadow:inset 0 -2px 0 var(--blue-500)}
.lm-tabs--full{display:flex}.lm-tabs--full .lm-tab{flex:1}
@media (pointer:coarse){.lm-tabs--text .lm-tab,.lm-tabs--segmented .lm-tab{min-height:40px}}
`);

export function Tabs({ items = [], value, defaultValue, onChange, variant = 'text', fullWidth = false, label, className = '', style }) {
  const norm = items.map(it => typeof it === 'string' ? { value: it, label: it } : it);
  const [inner, setInner] = React.useState(defaultValue ?? (norm[0] && norm[0].value));
  const active = value ?? inner;
  const refs = React.useRef([]);
  const select = v => { if (value === undefined) setInner(v); onChange && onChange(v); };
  const onKey = (e, i) => {
    const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const n = (i + d + norm.length) % norm.length;
    select(norm[n].value);
    refs.current[n] && refs.current[n].focus();
  };
  return (
    <div role="tablist" aria-label={label} className={['lm-tabs', 'lm-tabs--' + variant, fullWidth && 'lm-tabs--full', className].filter(Boolean).join(' ')} style={style}>
      {norm.map((it, i) => (
        <button key={it.value} ref={el => (refs.current[i] = el)} type="button" role="tab" aria-selected={active === it.value} tabIndex={active === it.value ? 0 : -1} className="lm-tab" onClick={() => select(it.value)} onKeyDown={e => onKey(e, i)}>
          {it.label}{it.count != null && <span className="lm-tab__count">{it.count}</span>}
        </button>
      ))}
    </div>
  );
}
