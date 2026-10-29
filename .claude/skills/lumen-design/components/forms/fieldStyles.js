import { injectStyles } from '../core/injectStyles.js';

export function useFieldStyles() {
  injectStyles('lm-field', `
.lm-field{display:flex;flex-direction:column;gap:8px;font-family:var(--font-sans);min-width:0}
.lm-field__label{font-size:14px;font-weight:500;color:var(--text-primary);letter-spacing:-.01em}
.lm-field__req{color:var(--text-accent);margin-left:3px}
.lm-field__hint{font-size:13px;color:var(--text-tertiary);line-height:1.35}
.lm-field__err{font-size:13px;color:var(--red-400);display:flex;gap:6px;align-items:center;line-height:1.35}
[data-theme="light"] .lm-field__err{color:var(--red-700)}
.lm-control{position:relative;display:flex;align-items:center;gap:10px;height:44px;padding:0 14px;background:var(--surface-2);border-radius:var(--radius-control);box-shadow:inset 0 0 0 1px var(--border-default);color:var(--text-tertiary);transition:box-shadow var(--duration-fast) var(--ease-out)}
.lm-control:hover{box-shadow:inset 0 0 0 1px var(--border-strong)}
.lm-control:focus-within{box-shadow:inset 0 0 0 1px var(--blue-500),0 0 0 3px rgba(41,141,255,.28)}
.lm-control--sm{height:36px;padding:0 10px}
.lm-control--lg{height:52px;padding:0 16px}
.lm-control--multi{height:auto;align-items:flex-start;padding:12px 14px}
.lm-control--invalid,.lm-control--invalid:hover{box-shadow:inset 0 0 0 1px var(--red-500)}
.lm-control--disabled{opacity:.45;pointer-events:none}
.lm-control input,.lm-control select,.lm-control textarea{flex:1;min-width:0;height:100%;background:transparent;border:0;outline:0;color:var(--text-primary);font-family:var(--font-sans);font-size:16px;letter-spacing:-.01em;padding:0;margin:0}
.lm-control textarea{resize:vertical;min-height:96px;line-height:1.45}
.lm-control input::placeholder,.lm-control textarea::placeholder{color:var(--text-tertiary)}
.lm-control select{appearance:none;-webkit-appearance:none;cursor:pointer;padding-right:28px}
.lm-control select option{background:var(--surface-2);color:var(--text-primary)}
.lm-control__chev{position:absolute;right:12px;pointer-events:none;color:var(--text-secondary)}
.lm-control__suffix{font-family:var(--font-mono);font-size:12px;letter-spacing:.02em;color:var(--text-tertiary);white-space:nowrap}
`);
}
