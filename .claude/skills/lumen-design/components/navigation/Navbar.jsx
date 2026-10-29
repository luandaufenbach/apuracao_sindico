import React from 'react';
import { Icon } from '../core/Icon.jsx';
import { Button } from '../core/Button.jsx';
import { IconButton } from '../core/IconButton.jsx';
import { Wordmark } from '../core/Wordmark.jsx';
import { injectStyles } from '../core/injectStyles.js';

injectStyles('lm-navbar', `
.lm-nav{position:sticky;top:0;z-index:var(--z-nav);background:rgba(0,0,0,.72);-webkit-backdrop-filter:var(--blur-nav);backdrop-filter:var(--blur-nav);box-shadow:0 1px 0 var(--border-subtle);font-family:var(--font-sans)}
[data-theme="light"] .lm-nav{background:rgba(255,255,255,.8)}
.lm-nav--static{position:relative}
.lm-nav--transparent{background:transparent;box-shadow:none;-webkit-backdrop-filter:none;backdrop-filter:none}
.lm-nav__bar{height:var(--nav-height);max-width:var(--container-wide);margin:0 auto;padding:0 var(--gutter);display:flex;align-items:center;gap:28px}
.lm-nav__brand{display:inline-flex;align-items:center;color:var(--text-primary);text-decoration:none;flex-shrink:0}
.lm-nav__brand:hover{color:var(--text-primary);text-decoration:none}
.lm-nav__links{display:flex;align-items:center;gap:2px;flex:1;min-width:0}
.lm-nav__item{position:relative}
.lm-nav__trigger{display:inline-flex;align-items:center;gap:8px;height:36px;padding:0 10px;font-size:14px;letter-spacing:-.01em;color:var(--text-secondary);background:none;border:0;border-radius:var(--radius-xs);cursor:pointer;text-decoration:none;transition:color var(--duration-fast) var(--ease-out)}
.lm-nav__trigger:hover,.lm-nav__trigger[aria-expanded="true"],.lm-nav__trigger[aria-current="page"]{color:var(--text-primary);text-decoration:none}
.lm-nav__chev{width:16px;height:16px;display:inline-flex;align-items:center;justify-content:center;background:var(--surface-3);border-radius:var(--radius-xs);color:var(--text-primary)}
.lm-nav__chev svg{transition:transform var(--duration-base) var(--ease-out)}
.lm-nav__trigger[aria-expanded="true"] .lm-nav__chev svg{transform:rotate(180deg)}
.lm-nav__panel{position:absolute;top:calc(100% + 10px);left:0;min-width:300px;background:var(--surface-1);box-shadow:var(--shadow-overlay);border-radius:var(--radius-card);padding:6px;display:grid;gap:2px;animation:lm-nav-in var(--duration-base) var(--ease-out)}
@keyframes lm-nav-in{from{opacity:0;transform:translateY(-4px)}}
.lm-nav__plink{display:flex;gap:12px;align-items:flex-start;padding:10px 12px;border-radius:var(--radius-xs);color:var(--text-primary);text-decoration:none}
.lm-nav__plink:hover{background:var(--surface-3);color:var(--text-primary);text-decoration:none}
.lm-nav__picon{width:28px;height:28px;flex-shrink:0;display:inline-flex;align-items:center;justify-content:center;background:var(--surface-accent);color:var(--white);border-radius:var(--radius-xs)}
.lm-nav__ptitle{font-size:14px;line-height:1.3}
.lm-nav__pdesc{font-size:13px;color:var(--text-tertiary);line-height:1.35;margin-top:2px}
.lm-nav__actions{display:flex;align-items:center;gap:8px;margin-left:auto}
.lm-nav__menu{display:none}
.lm-nav__drawer{display:none}
@media (max-width:1023px){
 .lm-nav__bar{height:var(--nav-height-mobile);gap:12px}
 .lm-nav__links,.lm-nav__secondary{display:none}
 .lm-nav__menu{display:inline-flex}
 .lm-nav__drawer{display:flex;flex-direction:column;position:fixed;top:var(--nav-height-mobile);left:0;right:0;bottom:0;background:var(--bg-canvas);overflow-y:auto;padding:8px var(--gutter) calc(24px + env(safe-area-inset-bottom));animation:lm-nav-in var(--duration-base) var(--ease-out);z-index:var(--z-drawer)}
}
@media (max-width:639px){.lm-nav__cta{display:none}}
.lm-nav__group{border-bottom:1px solid var(--border-subtle)}
.lm-nav__gbtn{width:100%;display:flex;align-items:center;justify-content:space-between;min-height:60px;background:none;border:0;padding:0;color:var(--text-primary);font-size:20px;letter-spacing:-.02em;cursor:pointer;text-align:left;text-decoration:none}
.lm-nav__gbtn:hover{color:var(--text-primary);text-decoration:none}
.lm-nav__glist{display:flex;flex-direction:column;padding:0 0 16px}
.lm-nav__glink{display:flex;align-items:center;min-height:44px;font-family:var(--font-mono);font-size:13px;letter-spacing:.02em;color:var(--text-secondary);text-decoration:none}
.lm-nav__glink::before{content:"└─";color:var(--text-tertiary);margin-right:10px}
.lm-nav__glink:hover{color:var(--text-primary);text-decoration:none}
.lm-nav__dfoot{margin-top:auto;padding-top:24px;display:flex;flex-direction:column;gap:8px}
`);

export function Navbar({ brand, brandHref = '#', items = [], cta, secondaryAction, variant = 'sticky', current, onNavigate }) {
  const [openIdx, setOpenIdx] = React.useState(null);
  const [drawer, setDrawer] = React.useState(false);
  const [groupOpen, setGroupOpen] = React.useState(null);
  const ref = React.useRef(null);

  React.useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') { setOpenIdx(null); setDrawer(false); } };
    const onDoc = e => { if (ref.current && !ref.current.contains(e.target)) setOpenIdx(null); };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onDoc);
    return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('mousedown', onDoc); };
  }, []);
  React.useEffect(() => {
    if (!drawer) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [drawer]);

  const go = (item, e) => { setOpenIdx(null); setDrawer(false); if (onNavigate) { e && e.preventDefault(); onNavigate(item); } };
  const cls = ['lm-nav', variant === 'transparent' && 'lm-nav--transparent', variant === 'static' && 'lm-nav--static'].filter(Boolean).join(' ');

  return (
    <header className={cls} ref={ref}>
      <div className="lm-nav__bar">
        <a href={brandHref} className="lm-nav__brand" onClick={e => go({ href: brandHref, label: 'home' }, e)}>{brand || <Wordmark size={22} />}</a>
        <nav className="lm-nav__links" aria-label="Main">
          {items.map((it, i) => it.children ? (
            <div key={it.label} className="lm-nav__item" onMouseEnter={() => setOpenIdx(i)} onMouseLeave={() => setOpenIdx(null)}>
              <button type="button" className="lm-nav__trigger" aria-expanded={openIdx === i} aria-current={current === it.label ? 'page' : undefined} onClick={() => setOpenIdx(openIdx === i ? null : i)}>
                {it.label}<span className="lm-nav__chev"><Icon name="chevron-down" size={12} strokeWidth={2} /></span>
              </button>
              {openIdx === i && <div className="lm-nav__panel" role="menu">
                {it.children.map(c => (
                  <a key={c.label} href={c.href || '#'} role="menuitem" className="lm-nav__plink" onClick={e => go(c, e)}>
                    {c.icon && <span className="lm-nav__picon"><Icon name={c.icon} size={16} /></span>}
                    <span><div className="lm-nav__ptitle">{c.label}</div>{c.description && <div className="lm-nav__pdesc">{c.description}</div>}</span>
                  </a>
                ))}
              </div>}
            </div>
          ) : (
            <a key={it.label} href={it.href || '#'} className="lm-nav__trigger" aria-current={current === it.label ? 'page' : undefined} onClick={e => go(it, e)}>{it.label}</a>
          ))}
        </nav>
        <div className="lm-nav__actions">
          {secondaryAction && <span className="lm-nav__secondary"><Button variant="ghost" size="sm" href={secondaryAction.href} onClick={secondaryAction.onClick}>{secondaryAction.label}</Button></span>}
          {cta && <span className="lm-nav__cta"><Button variant="primary" size="sm" href={cta.href} onClick={cta.onClick}>{cta.label}</Button></span>}
          <span className="lm-nav__menu"><IconButton icon={drawer ? 'x' : 'menu'} label={drawer ? 'Close menu' : 'Open menu'} size="sm" aria-expanded={drawer} onClick={() => setDrawer(!drawer)} /></span>
        </div>
      </div>
      {drawer && <div className="lm-nav__drawer">
        {items.map((it, i) => (
          <div key={it.label} className="lm-nav__group">
            {it.children ? <>
              <button type="button" className="lm-nav__gbtn" aria-expanded={groupOpen === i} onClick={() => setGroupOpen(groupOpen === i ? null : i)}>
                {it.label}<span className="lm-nav__chev" style={{ width: 24, height: 24 }}><Icon name={groupOpen === i ? 'minus' : 'plus'} size={14} /></span>
              </button>
              {groupOpen === i && <div className="lm-nav__glist">{it.children.map(c => <a key={c.label} href={c.href || '#'} className="lm-nav__glink" onClick={e => go(c, e)}>{c.label}</a>)}</div>}
            </> : <a href={it.href || '#'} className="lm-nav__gbtn" onClick={e => go(it, e)}>{it.label}<Icon name="arrow-right" size={18} /></a>}
          </div>
        ))}
        <div className="lm-nav__dfoot">
          {cta && <Button variant="primary" size="lg" fullWidth href={cta.href} onClick={cta.onClick}>{cta.label}</Button>}
          {secondaryAction && <Button variant="secondary" size="lg" fullWidth href={secondaryAction.href} onClick={secondaryAction.onClick}>{secondaryAction.label}</Button>}
        </div>
      </div>}
    </header>
  );
}
