import React from 'react';
import { IconButton } from '../core/IconButton.jsx';
import { injectStyles } from '../core/injectStyles.js';

injectStyles('lm-dialog', `
.lm-dlg{position:fixed;inset:0;z-index:var(--z-modal);display:flex;align-items:center;justify-content:center;padding:24px;font-family:var(--font-sans)}
.lm-dlg__scrim{position:absolute;inset:0;background:var(--surface-overlay);-webkit-backdrop-filter:var(--blur-overlay);backdrop-filter:var(--blur-overlay);animation:lm-dlg-fade var(--duration-base) var(--ease-out)}
.lm-dlg__panel{position:relative;width:100%;max-height:calc(100vh - 48px);display:flex;flex-direction:column;background:var(--surface-1);color:var(--text-primary);border-radius:var(--radius-sheet);box-shadow:var(--shadow-overlay);animation:lm-dlg-in var(--duration-slow) var(--ease-emphasized);outline:none}
[data-theme="light"] .lm-dlg__panel{background:var(--white);box-shadow:var(--shadow-light-2)}
.lm-dlg__handle{display:none;width:36px;height:4px;border-radius:9999px;background:var(--border-strong);margin:8px auto 0}
.lm-dlg__head{display:flex;align-items:flex-start;gap:16px;padding:24px 24px 0}
.lm-dlg__title{flex:1;font-size:24px;line-height:1.15;letter-spacing:-.02em}
.lm-dlg__desc{margin-top:8px;font-size:14px;line-height:1.45;color:var(--text-secondary)}
.lm-dlg__body{padding:20px 24px;overflow-y:auto;font-size:15px;line-height:1.5;color:var(--text-secondary)}
.lm-dlg__foot{display:flex;justify-content:flex-end;gap:8px;padding:0 24px 24px}
@keyframes lm-dlg-fade{from{opacity:0}}
@keyframes lm-dlg-in{from{opacity:0;transform:translateY(8px) scale(.985)}}
@keyframes lm-dlg-up{from{transform:translateY(100%)}}
@media (max-width:639px){
 .lm-dlg{align-items:flex-end;padding:0}
 .lm-dlg__panel{max-width:none !important;border-radius:var(--radius-sheet) var(--radius-sheet) 0 0;max-height:92vh;padding-bottom:env(safe-area-inset-bottom);animation:lm-dlg-up var(--duration-slow) var(--ease-emphasized)}
 .lm-dlg__handle{display:block}
 .lm-dlg__head{padding:16px 20px 0}
 .lm-dlg__body{padding:16px 20px}
 .lm-dlg__foot{flex-direction:column-reverse;padding:0 20px 20px}
 .lm-dlg__foot > *{width:100%}
}
`);

const WIDTHS = { sm: 400, md: 520, lg: 720 };

export function Dialog({ open, onClose, title, description, children, footer, size = 'md', dismissible = true }) {
  const panel = React.useRef(null);
  const tid = React.useId();
  React.useEffect(() => {
    if (!open) return;
    const prev = document.activeElement;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panel.current && panel.current.focus();
    const onKey = e => { if (e.key === 'Escape' && dismissible) onClose && onClose(); };
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prevOverflow; prev && prev.focus && prev.focus(); };
  }, [open]);
  if (!open) return null;
  return (
    <div className="lm-dlg">
      <div className="lm-dlg__scrim" onClick={dismissible ? onClose : undefined} />
      <div ref={panel} className="lm-dlg__panel" role="dialog" aria-modal="true" aria-labelledby={title ? tid : undefined} tabIndex={-1} style={{ maxWidth: WIDTHS[size] }}>
        <div className="lm-dlg__handle" aria-hidden="true" />
        {(title || dismissible) && <div className="lm-dlg__head">
          <div style={{ flex: 1 }}>
            {title && <h2 id={tid} className="lm-dlg__title">{title}</h2>}
            {description && <p className="lm-dlg__desc">{description}</p>}
          </div>
          {dismissible && <IconButton icon="x" label="Close" variant="ghost" size="sm" onClick={onClose} />}
        </div>}
        {children && <div className="lm-dlg__body">{children}</div>}
        {footer && <div className="lm-dlg__foot">{footer}</div>}
      </div>
    </div>
  );
}
