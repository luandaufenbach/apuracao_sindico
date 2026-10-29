import React from 'react';
import { injectStyles } from '../core/injectStyles.js';

injectStyles('lm-toastregion', `
.lm-toasts{position:fixed;z-index:var(--z-toast);right:24px;bottom:24px;display:flex;flex-direction:column;align-items:flex-end;gap:8px;pointer-events:none;width:min(400px,calc(100vw - 48px))}
@media (max-width:639px){.lm-toasts{left:12px;right:12px;width:auto;align-items:stretch;bottom:calc(12px + var(--lm-toast-offset,0px) + env(safe-area-inset-bottom))}}
`);

export function ToastRegion({ offsetBottom = 0, children, style }) {
  return <div className="lm-toasts" aria-live="polite" style={{ '--lm-toast-offset': offsetBottom + 'px', ...style }}>{children}</div>;
}
