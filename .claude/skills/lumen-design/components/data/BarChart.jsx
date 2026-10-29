import React from 'react';
import { ValueTag } from './ValueTag.jsx';
import { injectStyles } from '../core/injectStyles.js';

injectStyles('lm-barchart', `
.lm-bc{display:grid;grid-template-columns:auto 1fr;grid-template-rows:1fr auto;gap:8px 10px;font-family:var(--font-mono);width:100%}
.lm-bc__y{display:flex;flex-direction:column;justify-content:space-between;font-size:10px;color:var(--text-tertiary);text-align:right;letter-spacing:.02em}
.lm-bc__plot{position:relative;display:flex;align-items:flex-end;min-width:0}
.lm-bc__grid{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:space-between;pointer-events:none}
.lm-bc__grid span{height:1px;background:var(--data-grid)}
.lm-bc__bar{position:relative;flex:1;min-width:0;height:100%;display:flex;align-items:flex-end;cursor:default}
.lm-bc__fill{width:100%;background-repeat:no-repeat;background-position:bottom;transition:filter var(--duration-fast) var(--ease-out),opacity var(--duration-fast)}
.lm-bc--dim .lm-bc__bar:not(.lm-bc__bar--on) .lm-bc__fill{opacity:.55}
.lm-bc__bar--on .lm-bc__fill{filter:brightness(1.25)}
.lm-bc__tip{position:absolute;left:50%;transform:translate(-50%,-100%);margin-top:-8px;z-index:2;pointer-events:none}
.lm-bc__tip::after{content:"";position:absolute;left:50%;bottom:-8px;width:1px;height:8px;background:var(--white);opacity:.6}
.lm-bc__x{grid-column:2;display:flex;justify-content:space-between;font-size:10px;color:var(--text-tertiary);letter-spacing:.02em}
`);

export function BarChart({ data = [], height = 240, gap = 2, highlight = 'max', format = v => String(v), yTicks = 4, xLabels, fill = 'gradient', label = 'Bar chart', style }) {
  const [hover, setHover] = React.useState(null);
  const max = Math.max(1, ...data.map(d => d.value));
  const niceMax = (() => { const p = Math.pow(10, Math.floor(Math.log10(max))); return Math.ceil(max / p) * p; })();
  const hiIdx = highlight === 'max' ? data.findIndex(d => d.value === max) : typeof highlight === 'number' ? highlight : null;
  const on = hover ?? hiIdx;
  const ticks = Array.from({ length: yTicks + 1 }, (_, i) => niceMax * (yTicks - i) / yTicks);
  const bg = fill === 'solid' ? 'var(--blue-500)' : 'var(--gradient-column)';
  const xs = xLabels || (data.length ? [data[0].label, data[Math.floor(data.length / 3)].label, data[Math.floor(2 * data.length / 3)].label, data[data.length - 1].label] : []);
  return (
    <div className={'lm-bc' + (hover != null ? ' lm-bc--dim' : '')} style={style} role="img" aria-label={label + ': ' + data.map(d => d.label + ' ' + format(d.value)).join(', ')}>
      <div className="lm-bc__y" style={{ height }}>{ticks.map((t, i) => <span key={i}>{format(t)}</span>)}</div>
      <div className="lm-bc__plot" style={{ height, gap }} onMouseLeave={() => setHover(null)}>
        <div className="lm-bc__grid">{ticks.map((_, i) => <span key={i} />)}</div>
        {data.map((d, i) => {
          const h = (d.value / niceMax) * height;
          return (
            <div key={i} className={'lm-bc__bar' + (on === i ? ' lm-bc__bar--on' : '')} onMouseEnter={() => setHover(i)} onTouchStart={() => setHover(i)}>
              <div className="lm-bc__fill" style={{ height: h, background: bg, backgroundSize: '100% ' + height + 'px' }} />
              {on === i && <div className="lm-bc__tip" style={{ bottom: h }}><ValueTag value={format(d.value)} /></div>}
            </div>
          );
        })}
      </div>
      <div className="lm-bc__x">{xs.map((x, i) => <span key={i}>{x}</span>)}</div>
    </div>
  );
}
