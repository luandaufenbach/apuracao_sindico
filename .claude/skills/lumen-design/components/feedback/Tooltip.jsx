import React from 'react';
import { injectStyles } from '../core/injectStyles.js';

injectStyles('lm-tooltip', `
.lm-tt{position:relative;display:inline-flex}
.lm-tt__bubble{position:absolute;z-index:var(--z-tooltip);pointer-events:none;background:var(--surface-inverse);color:var(--text-inverse);font-family:var(--font-mono);font-size:12px;letter-spacing:.02em;line-height:1.35;padding:6px 8px;border-radius:var(--radius-xs);white-space:nowrap;max-width:260px;animation:lm-tt-in var(--duration-fast) var(--ease-out)}
.lm-tt__bubble--wrap{white-space:normal;width:max-content}
.lm-tt__bubble--top{bottom:calc(100% + 8px);left:50%;transform:translateX(-50%)}
.lm-tt__bubble--bottom{top:calc(100% + 8px);left:50%;transform:translateX(-50%)}
.lm-tt__bubble--left{right:calc(100% + 8px);top:50%;transform:translateY(-50%)}
.lm-tt__bubble--right{left:calc(100% + 8px);top:50%;transform:translateY(-50%)}
@keyframes lm-tt-in{from{opacity:0}}
`);

export function Tooltip({ content, side = 'top', delay = 250, wrap = false, children }) {
  const [show, setShow] = React.useState(false);
  const t = React.useRef();
  const id = React.useId();
  const on = () => { clearTimeout(t.current); t.current = setTimeout(() => setShow(true), delay); };
  const off = () => { clearTimeout(t.current); setShow(false); };
  return (
    <span className="lm-tt" onMouseEnter={on} onMouseLeave={off} onFocus={on} onBlur={off} aria-describedby={show ? id : undefined}>
      {children}
      {show && <span id={id} role="tooltip" className={'lm-tt__bubble lm-tt__bubble--' + side + (wrap ? ' lm-tt__bubble--wrap' : '')}>{content}</span>}
    </span>
  );
}
