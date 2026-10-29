import { injectStyles } from '../core/injectStyles.js';

export function useCheckStyles() {
  injectStyles('lm-check', `
.lm-check{display:inline-flex;gap:12px;align-items:flex-start;cursor:pointer;font-family:var(--font-sans);padding:4px 0;min-height:28px;position:relative}
@media (pointer:coarse){.lm-check{min-height:var(--hit-min);padding:10px 0}}
.lm-check--disabled{opacity:.45;cursor:not-allowed}
.lm-check__input{position:absolute;opacity:0;width:1px;height:1px;margin:0;pointer-events:none}
.lm-check__box{width:18px;height:18px;flex-shrink:0;margin-top:1px;display:inline-flex;align-items:center;justify-content:center;border-radius:var(--radius-xs);box-shadow:inset 0 0 0 1.5px var(--border-strong);background:transparent;color:var(--white);transition:background-color var(--duration-fast) var(--ease-out),box-shadow var(--duration-fast) var(--ease-out)}
.lm-check__box--radio{border-radius:9999px}
.lm-check:hover .lm-check__box{box-shadow:inset 0 0 0 1.5px var(--text-secondary)}
.lm-check__input:checked + .lm-check__box{background:var(--blue-500);box-shadow:none}
.lm-check__input:checked + .lm-check__box--radio{background:transparent;box-shadow:inset 0 0 0 1.5px var(--blue-500)}
.lm-check__dot{width:8px;height:8px;border-radius:9999px;background:var(--blue-500);transform:scale(0);transition:transform var(--duration-fast) var(--ease-out)}
.lm-check__input:checked + .lm-check__box .lm-check__dot{transform:scale(1)}
.lm-check__input + .lm-check__box svg{opacity:0;transform:scale(.6);transition:all var(--duration-fast) var(--ease-out)}
.lm-check__input:checked + .lm-check__box svg{opacity:1;transform:scale(1)}
.lm-check__input:focus-visible + .lm-check__box{box-shadow:var(--focus-shadow)}
.lm-check__text{display:flex;flex-direction:column;gap:2px}
.lm-check__label{font-size:15px;color:var(--text-primary);letter-spacing:-.01em;line-height:1.3}
.lm-check__desc{font-size:13px;color:var(--text-tertiary);line-height:1.35}
.lm-switch{display:inline-flex;align-items:center;gap:12px;cursor:pointer;background:none;border:0;padding:4px 0;font-family:var(--font-sans);text-align:left;min-height:28px}
@media (pointer:coarse){.lm-switch{min-height:var(--hit-min)}}
.lm-switch:disabled{opacity:.45;cursor:not-allowed}
.lm-switch__track{width:40px;height:22px;flex-shrink:0;border-radius:9999px;background:var(--surface-3);box-shadow:inset 0 0 0 1px var(--border-default);position:relative;transition:background-color var(--duration-base) var(--ease-out),box-shadow var(--duration-base) var(--ease-out)}
.lm-switch__thumb{position:absolute;top:3px;left:3px;width:16px;height:16px;border-radius:9999px;background:var(--gray-300);transition:transform var(--duration-base) var(--ease-emphasized),background-color var(--duration-base)}
.lm-switch[aria-checked="true"] .lm-switch__track{background:var(--blue-500);box-shadow:var(--glow-sm)}
.lm-switch[aria-checked="true"] .lm-switch__thumb{transform:translateX(18px);background:var(--white)}
.lm-switch:focus-visible{outline:none}.lm-switch:focus-visible .lm-switch__track{box-shadow:var(--focus-shadow)}
`);
}
