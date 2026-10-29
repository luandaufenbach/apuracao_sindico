import React from 'react';
import { Icon } from './Icon.jsx';
import { injectStyles } from './injectStyles.js';

injectStyles('lm-arrowlink', `
.lm-al{flex-shrink:0;white-space:nowrap;width:fit-content;display:inline-flex;align-items:center;gap:8px;font-family:var(--font-sans);font-size:14px;color:var(--text-primary);text-decoration:none;min-height:28px;cursor:pointer;background:none;border:0;padding:0}
.lm-al:hover{color:var(--text-primary);text-decoration:none}
.lm-al__box{width:20px;height:20px;display:inline-flex;align-items:center;justify-content:center;background:var(--surface-accent);color:var(--white);border-radius:var(--radius-xs);transition:box-shadow var(--duration-base) var(--ease-out),transform var(--duration-base) var(--ease-out)}
.lm-al:hover .lm-al__box{box-shadow:var(--glow-sm)}
.lm-al:hover .lm-al__label{text-decoration:underline;text-underline-offset:3px}
.lm-al--inverse .lm-al__box{background:var(--surface-inverse);color:var(--text-inverse)}
.lm-al--accent{color:var(--text-accent)}.lm-al--accent:hover{color:var(--text-link-hover)}
.lm-al--accent .lm-al__box{background:transparent;color:inherit;width:auto}
`);

export function ArrowLink({ href, icon = 'arrow-right', tone = 'default', children, className = '', ...rest }) {
  const Tag = href ? 'a' : 'button';
  return (
    <Tag href={href} className={['lm-al', 'lm-al--' + tone, className].join(' ')} {...rest}>
      <span className="lm-al__box"><Icon name={icon} size={14} strokeWidth={1.75} /></span>
      <span className="lm-al__label">{children}</span>
    </Tag>
  );
}
