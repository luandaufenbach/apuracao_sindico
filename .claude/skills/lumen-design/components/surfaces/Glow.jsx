import React from 'react';
import { injectStyles } from '../core/injectStyles.js';

injectStyles('lm-glow', `
.lm-glow{position:relative;overflow:hidden;background-color:#000;isolation:isolate}
.lm-glow__layer{position:absolute;inset:0;pointer-events:none;z-index:-1}
.lm-glow__grain{position:absolute;inset:0;pointer-events:none;background:var(--texture-grain);opacity:var(--grain-opacity);mix-blend-mode:var(--grain-blend);z-index:-1}
.lm-glow--horizon .lm-glow__layer{background:var(--gradient-horizon)}
.lm-glow--halo .lm-glow__layer{background:var(--gradient-halo)}
.lm-glow--fade-up .lm-glow__layer{background:var(--gradient-fade-up)}
.lm-glow--fade-down .lm-glow__layer{background:var(--gradient-fade-down)}
.lm-glow--steel .lm-glow__layer{background:var(--gradient-steel)}
.lm-glow--columns .lm-glow__layer{background:radial-gradient(90% 45% at 50% 0%,rgba(41,141,255,.28),transparent 70%),linear-gradient(180deg,rgba(0,0,0,0) 0%,rgba(0,0,0,.55) 70%,#000 100%),repeating-linear-gradient(90deg,#041330 0 6%,#06204A 6% 11%,#09295C 11% 19%,#051C45 19% 24%,#0B3470 24% 27%,#041330 27% 33%),#041330}
.lm-glow--columns .lm-glow__dots{position:absolute;inset:0;background:var(--texture-dots);background-size:var(--texture-dots-size);z-index:-1;pointer-events:none;-webkit-mask:linear-gradient(180deg,transparent,#000 30%,#000 70%,transparent);mask:linear-gradient(180deg,transparent,#000 30%,#000 70%,transparent)}
.lm-glow--dots .lm-glow__layer{background:var(--texture-dots);background-size:var(--texture-dots-size)}
.lm-glow--grid .lm-glow__layer{background:var(--texture-grid),radial-gradient(70% 55% at 50% 0%,rgba(41,141,255,.45),rgba(12,61,128,.25) 45%,transparent 75%);background-size:var(--texture-grid-size),100% 100%;-webkit-mask:radial-gradient(80% 70% at 50% 40%,#000,transparent);mask:radial-gradient(80% 70% at 50% 40%,#000,transparent)}
`);

export function Glow({ variant = 'horizon', grain = true, as = 'div', minHeight, children, className = '', style, ...rest }) {
  const Tag = as;
  return (
    <Tag className={['lm-glow', 'lm-glow--' + variant, className].join(' ')} style={{ minHeight, ...style }} {...rest}>
      <span className="lm-glow__layer" aria-hidden="true" />
      {variant === 'columns' && <span className="lm-glow__dots" aria-hidden="true" />}
      {grain && <span className="lm-glow__grain" aria-hidden="true" />}
      {children}
    </Tag>
  );
}
