import React from 'react';
import { injectStyles } from '../core/injectStyles.js';

injectStyles('lm-card', `
.lm-card{position:relative;display:flex;flex-direction:column;border-radius:var(--radius-card);overflow:hidden;color:var(--text-primary);text-decoration:none;font-family:var(--font-sans);min-width:0}
.lm-card--default{background:var(--surface-1);box-shadow:var(--shadow-hairline)}
[data-theme="light"] .lm-card--default{background:var(--white);box-shadow:var(--shadow-light-1)}
.lm-card--raised{background:var(--surface-2);box-shadow:var(--shadow-raised)}
.lm-card--outline{background:transparent;box-shadow:inset 0 0 0 1px var(--border-default)}
.lm-card--inverse{background:var(--surface-inverse);color:var(--text-inverse)}
.lm-card--accent{background:var(--blue-600);color:var(--white)}
.lm-card--glow{background:#000;background-image:var(--gradient-horizon);color:var(--white)}
.lm-card--glow::after{content:"";position:absolute;inset:0;background:var(--texture-grain);opacity:var(--grain-opacity);mix-blend-mode:var(--grain-blend);pointer-events:none}
.lm-card--glow > *{position:relative;z-index:1}
.lm-card--p-none{padding:0}.lm-card--p-sm{padding:16px}.lm-card--p-md{padding:clamp(16px,2.5vw,24px)}.lm-card--p-lg{padding:clamp(20px,3.5vw,40px)}
.lm-card--interactive{cursor:pointer;transition:box-shadow var(--duration-base) var(--ease-out),transform var(--duration-base) var(--ease-out),background-color var(--duration-base)}
.lm-card--interactive:hover{text-decoration:none;color:inherit}
.lm-card--default.lm-card--interactive:hover,.lm-card--outline.lm-card--interactive:hover{box-shadow:inset 0 0 0 1px var(--border-strong)}
.lm-card--raised.lm-card--interactive:hover{background:var(--surface-3)}
.lm-card--accent.lm-card--interactive:hover,.lm-card--glow.lm-card--interactive:hover{box-shadow:var(--glow-md)}
.lm-card--interactive:focus-visible{outline:none;box-shadow:var(--focus-shadow)}
`);

export function Card({ variant = 'default', padding = 'md', interactive, href, as, onClick, children, className = '', style, ...rest }) {
  const isInteractive = interactive ?? !!(href || onClick);
  const Tag = as || (href ? 'a' : 'div');
  const cls = ['lm-card', 'lm-card--' + variant, 'lm-card--p-' + padding, isInteractive && 'lm-card--interactive', className].filter(Boolean).join(' ');
  return <Tag href={href} onClick={onClick} className={cls} style={style} tabIndex={isInteractive && !href ? 0 : undefined} {...rest}>{children}</Tag>;
}
