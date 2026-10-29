// DEV-ONLY fallback used when _ds_bundle.js has not been compiled yet. Regenerated from components/**. Do not edit.
(function(){
const React = window.React;

// ---- core/injectStyles.js
// Injects a component's stylesheet once per document. Classes are prefixed "lm-".
function injectStyles(id, css) {
  if (typeof document === 'undefined') return;
  if (document.getElementById(id)) return;
  const el = document.createElement('style');
  el.id = id;
  el.textContent = css;
  document.head.appendChild(el);
}

// ---- core/iconPaths.js
// Icon paths copied verbatim from Lucide (lucide-static@0.469.0, ISC license). Do not hand-edit.
const ICON_PATHS = {"arrow-right":"<path d=\"M5 12h14\" /><path d=\"m12 5 7 7-7 7\" />",
"arrow-left":"<path d=\"m12 19-7-7 7-7\" /><path d=\"M19 12H5\" />",
"arrow-up":"<path d=\"m5 12 7-7 7 7\" /><path d=\"M12 19V5\" />",
"arrow-down":"<path d=\"M12 5v14\" /><path d=\"m19 12-7 7-7-7\" />",
"arrow-up-right":"<path d=\"M7 7h10v10\" /><path d=\"M7 17 17 7\" />",
"chevron-down":"<path d=\"m6 9 6 6 6-6\" />",
"chevron-up":"<path d=\"m18 15-6-6-6 6\" />",
"chevron-left":"<path d=\"m15 18-6-6 6-6\" />",
"chevron-right":"<path d=\"m9 18 6-6-6-6\" />",
"plus":"<path d=\"M5 12h14\" /><path d=\"M12 5v14\" />",
"minus":"<path d=\"M5 12h14\" />",
"x":"<path d=\"M18 6 6 18\" /><path d=\"m6 6 12 12\" />",
"menu":"<line x1=\"4\" x2=\"20\" y1=\"12\" y2=\"12\" /><line x1=\"4\" x2=\"20\" y1=\"6\" y2=\"6\" /><line x1=\"4\" x2=\"20\" y1=\"18\" y2=\"18\" />",
"search":"<circle cx=\"11\" cy=\"11\" r=\"8\" /><path d=\"m21 21-4.3-4.3\" />",
"check":"<path d=\"M20 6 9 17l-5-5\" />",
"play":"<polygon points=\"6 3 20 12 6 21 6 3\" />",
"external-link":"<path d=\"M15 3h6v6\" /><path d=\"M10 14 21 3\" /><path d=\"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6\" />",
"copy":"<rect width=\"14\" height=\"14\" x=\"8\" y=\"8\" rx=\"2\" ry=\"2\" /><path d=\"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2\" />",
"info":"<circle cx=\"12\" cy=\"12\" r=\"10\" /><path d=\"M12 16v-4\" /><path d=\"M12 8h.01\" />",
"triangle-alert":"<path d=\"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3\" /><path d=\"M12 9v4\" /><path d=\"M12 17h.01\" />",
"circle-check":"<circle cx=\"12\" cy=\"12\" r=\"10\" /><path d=\"m9 12 2 2 4-4\" />",
"circle-x":"<circle cx=\"12\" cy=\"12\" r=\"10\" /><path d=\"m15 9-6 6\" /><path d=\"m9 9 6 6\" />",
"chart-line":"<path d=\"M3 3v16a2 2 0 0 0 2 2h16\" /><path d=\"m19 9-5 5-4-4-3 3\" />",
"chart-bar":"<path d=\"M3 3v16a2 2 0 0 0 2 2h16\" /><path d=\"M7 16h8\" /><path d=\"M7 11h12\" /><path d=\"M7 6h3\" />",
"chart-pie":"<path d=\"M21 12c.552 0 1.005-.449.95-.998a10 10 0 0 0-8.953-8.951c-.55-.055-.998.398-.998.95v8a1 1 0 0 0 1 1z\" /><path d=\"M21.21 15.89A10 10 0 1 1 8 2.83\" />",
"wallet":"<path d=\"M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1\" /><path d=\"M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4\" />",
"rocket":"<path d=\"M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z\" /><path d=\"m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z\" /><path d=\"M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0\" /><path d=\"M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5\" />",
"infinity":"<path d=\"M12 12c-2-2.67-4-4-6-4a4 4 0 1 0 0 8c2 0 4-1.33 6-4Zm0 0c2 2.67 4 4 6 4a4 4 0 0 0 0-8c-2 0-4 1.33-6 4Z\" />",
"file-text":"<path d=\"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z\" /><path d=\"M14 2v4a2 2 0 0 0 2 2h4\" /><path d=\"M10 9H8\" /><path d=\"M16 13H8\" /><path d=\"M16 17H8\" />",
"book-open":"<path d=\"M12 7v14\" /><path d=\"M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z\" />",
"code":"<polyline points=\"16 18 22 12 16 6\" /><polyline points=\"8 6 2 12 8 18\" />",
"layers":"<path d=\"M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z\" /><path d=\"M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12\" /><path d=\"M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17\" />",
"shield-check":"<path d=\"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z\" /><path d=\"m9 12 2 2 4-4\" />",
"zap":"<path d=\"M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z\" />",
"globe":"<circle cx=\"12\" cy=\"12\" r=\"10\" /><path d=\"M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20\" /><path d=\"M2 12h20\" />",
"user":"<path d=\"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2\" /><circle cx=\"12\" cy=\"7\" r=\"4\" />",
"settings":"<path d=\"M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z\" /><circle cx=\"12\" cy=\"12\" r=\"3\" />",
"bell":"<path d=\"M10.268 21a2 2 0 0 0 3.464 0\" /><path d=\"M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326\" />",
"log-out":"<path d=\"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4\" /><polyline points=\"16 17 21 12 16 7\" /><line x1=\"21\" x2=\"9\" y1=\"12\" y2=\"12\" />",
"house":"<path d=\"M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8\" /><path d=\"M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z\" />",
"activity":"<path d=\"M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2\" />",
"sliders-horizontal":"<line x1=\"21\" x2=\"14\" y1=\"4\" y2=\"4\" /><line x1=\"10\" x2=\"3\" y1=\"4\" y2=\"4\" /><line x1=\"21\" x2=\"12\" y1=\"12\" y2=\"12\" /><line x1=\"8\" x2=\"3\" y1=\"12\" y2=\"12\" /><line x1=\"21\" x2=\"16\" y1=\"20\" y2=\"20\" /><line x1=\"12\" x2=\"3\" y1=\"20\" y2=\"20\" /><line x1=\"14\" x2=\"14\" y1=\"2\" y2=\"6\" /><line x1=\"8\" x2=\"8\" y1=\"10\" y2=\"14\" /><line x1=\"16\" x2=\"16\" y1=\"18\" y2=\"22\" />",
"filter":"<polygon points=\"22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3\" />",
"download":"<path d=\"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4\" /><polyline points=\"7 10 12 15 17 10\" /><line x1=\"12\" x2=\"12\" y1=\"15\" y2=\"3\" />",
"calendar":"<path d=\"M8 2v4\" /><path d=\"M16 2v4\" /><rect width=\"18\" height=\"18\" x=\"3\" y=\"4\" rx=\"2\" /><path d=\"M3 10h18\" />",
"lock":"<rect width=\"18\" height=\"11\" x=\"3\" y=\"11\" rx=\"2\" ry=\"2\" /><path d=\"M7 11V7a5 5 0 0 1 10 0v4\" />",
"cpu":"<rect width=\"16\" height=\"16\" x=\"4\" y=\"4\" rx=\"2\" /><rect width=\"6\" height=\"6\" x=\"9\" y=\"9\" rx=\"1\" /><path d=\"M15 2v2\" /><path d=\"M15 20v2\" /><path d=\"M2 15h2\" /><path d=\"M2 9h2\" /><path d=\"M20 15h2\" /><path d=\"M20 9h2\" /><path d=\"M9 2v2\" /><path d=\"M9 20v2\" />",
"box":"<path d=\"M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z\" /><path d=\"m3.3 7 8.7 5 8.7-5\" /><path d=\"M12 22V12\" />",
"git-branch":"<line x1=\"6\" x2=\"6\" y1=\"3\" y2=\"15\" /><circle cx=\"18\" cy=\"6\" r=\"3\" /><circle cx=\"6\" cy=\"18\" r=\"3\" /><path d=\"M18 9a9 9 0 0 1-9 9\" />",
"terminal":"<polyline points=\"4 17 10 11 4 5\" /><line x1=\"12\" x2=\"20\" y1=\"19\" y2=\"19\" />",
"sun":"<circle cx=\"12\" cy=\"12\" r=\"4\" /><path d=\"M12 2v2\" /><path d=\"M12 20v2\" /><path d=\"m4.93 4.93 1.41 1.41\" /><path d=\"m17.66 17.66 1.41 1.41\" /><path d=\"M2 12h2\" /><path d=\"M20 12h2\" /><path d=\"m6.34 17.66-1.41 1.41\" /><path d=\"m19.07 4.93-1.41 1.41\" />",
"moon":"<path d=\"M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z\" />",
"ellipsis":"<circle cx=\"12\" cy=\"12\" r=\"1\" /><circle cx=\"19\" cy=\"12\" r=\"1\" /><circle cx=\"5\" cy=\"12\" r=\"1\" />",
"layout-grid":"<rect width=\"7\" height=\"7\" x=\"3\" y=\"3\" rx=\"1\" /><rect width=\"7\" height=\"7\" x=\"14\" y=\"3\" rx=\"1\" /><rect width=\"7\" height=\"7\" x=\"14\" y=\"14\" rx=\"1\" /><rect width=\"7\" height=\"7\" x=\"3\" y=\"14\" rx=\"1\" />",
"list":"<path d=\"M3 12h.01\" /><path d=\"M3 18h.01\" /><path d=\"M3 6h.01\" /><path d=\"M8 12h13\" /><path d=\"M8 18h13\" /><path d=\"M8 6h13\" />",
"trending-up":"<polyline points=\"22 7 13.5 15.5 8.5 10.5 2 17\" /><polyline points=\"16 7 22 7 22 13\" />",
"trending-down":"<polyline points=\"22 17 13.5 8.5 8.5 13.5 2 7\" /><polyline points=\"16 17 22 17 22 11\" />",
"coins":"<circle cx=\"8\" cy=\"8\" r=\"6\" /><path d=\"M18.09 10.37A6 6 0 1 1 10.34 18\" /><path d=\"M7 6h1v4\" /><path d=\"m16.71 13.88.7.71-2.82 2.82\" />",
"landmark":"<line x1=\"3\" x2=\"21\" y1=\"22\" y2=\"22\" /><line x1=\"6\" x2=\"6\" y1=\"18\" y2=\"11\" /><line x1=\"10\" x2=\"10\" y1=\"18\" y2=\"11\" /><line x1=\"14\" x2=\"14\" y1=\"18\" y2=\"11\" /><line x1=\"18\" x2=\"18\" y1=\"18\" y2=\"11\" /><polygon points=\"12 2 20 7 4 7\" />",
"bug":"<path d=\"m8 2 1.88 1.88\" /><path d=\"M14.12 3.88 16 2\" /><path d=\"M9 7.13v-1a3.003 3.003 0 1 1 6 0v1\" /><path d=\"M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6\" /><path d=\"M12 20v-9\" /><path d=\"M6.53 9C4.6 8.8 3 7.1 3 5\" /><path d=\"M6 13H2\" /><path d=\"M3 21c0-2.1 1.7-3.9 3.8-4\" /><path d=\"M20.97 5c0 2.1-1.6 3.8-3.5 4\" /><path d=\"M22 13h-4\" /><path d=\"M17.2 17c2.1.1 3.8 1.9 3.8 4\" />",
"mail":"<rect width=\"20\" height=\"16\" x=\"2\" y=\"4\" rx=\"2\" /><path d=\"m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7\" />",
"send":"<path d=\"M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z\" /><path d=\"m21.854 2.147-10.94 10.939\" />",
"refresh-cw":"<path d=\"M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8\" /><path d=\"M21 3v5h-5\" /><path d=\"M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16\" /><path d=\"M8 16H3v5\" />",
"eye":"<path d=\"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0\" /><circle cx=\"12\" cy=\"12\" r=\"3\" />",
"link":"<path d=\"M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71\" /><path d=\"M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71\" />"};

// ---- core/Icon.jsx

function Icon({ name, size = 20, strokeWidth = 1.5, title, style, className = '', ...rest }) {
  const inner = ICON_PATHS[name];
  if (!inner) return null;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
      aria-hidden={title ? undefined : true} role={title ? 'img' : undefined} aria-label={title}
      className={className} style={{ flexShrink: 0, display: 'block', ...style }}
      dangerouslySetInnerHTML={{ __html: (title ? '<title>' + title + '</title>' : '') + inner }} {...rest} />
  );
}

const ICON_NAMES = Object.keys(ICON_PATHS);

// ---- core/Button.jsx

injectStyles('lm-button', `
.lm-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;font-family:var(--font-sans);font-weight:500;letter-spacing:-0.01em;line-height:1;border:0;border-radius:var(--radius-control);cursor:pointer;white-space:nowrap;text-decoration:none;user-select:none;position:relative;transition:background-color var(--duration-fast) var(--ease-out),box-shadow var(--duration-base) var(--ease-out),color var(--duration-fast) var(--ease-out),transform var(--duration-instant) var(--ease-out)}
.lm-btn:hover{text-decoration:none}
.lm-btn:focus-visible{outline:none;box-shadow:var(--focus-shadow)}
.lm-btn:active:not(:disabled){transform:translateY(1px)}
.lm-btn--sm{height:var(--control-sm);padding:0 12px;font-size:13px}
.lm-btn--md{height:var(--control-md);padding:0 16px;font-size:14px}
.lm-btn--lg{height:var(--control-lg);padding:0 22px;font-size:15px}
@media (pointer:coarse){.lm-btn--sm,.lm-btn--md{min-height:var(--hit-min)}}
.lm-btn--full{width:100%}
.lm-btn--primary{background:var(--action-primary);color:var(--text-on-accent)}
.lm-btn--primary:hover{color:var(--text-on-accent);background:var(--action-primary-hover);box-shadow:var(--glow-sm)}
.lm-btn--primary:active{background:var(--action-primary-press)}
.lm-btn--secondary{background:var(--action-secondary);color:var(--action-secondary-text)}
.lm-btn--secondary:hover{color:var(--action-secondary-text);background:var(--action-secondary-hover)}
.lm-btn--outline{background:transparent;color:var(--text-primary);box-shadow:inset 0 0 0 1px var(--border-strong)}
.lm-btn--outline:hover{color:var(--text-primary);background:var(--action-ghost-hover);box-shadow:inset 0 0 0 1px var(--text-primary)}
.lm-btn--ghost{background:transparent;color:var(--text-primary)}
.lm-btn--ghost:hover{color:var(--text-primary);background:var(--action-ghost-hover)}
.lm-btn--danger{background:var(--red-700);color:var(--white)}
.lm-btn--danger:hover{color:var(--white);background:#C42A31}
.lm-btn:disabled,.lm-btn[aria-disabled="true"]{opacity:.4;cursor:not-allowed;box-shadow:none;transform:none}
.lm-btn__spin{width:14px;height:14px;border-radius:50%;border:1.5px solid currentColor;border-right-color:transparent;animation:lm-spin .7s linear infinite}
@keyframes lm-spin{to{transform:rotate(360deg)}}
`);

function Button({ variant = 'primary', size = 'md', iconLeft, iconRight, fullWidth = false, loading = false, disabled = false, href, type = 'button', children, className = '', ...rest }) {
  const cls = ['lm-btn', 'lm-btn--' + variant, 'lm-btn--' + size, fullWidth && 'lm-btn--full', className].filter(Boolean).join(' ');
  const iconSize = size === 'lg' ? 18 : 16;
  const content = (
    <>
      {loading ? <span className="lm-btn__spin" aria-hidden="true" /> : iconLeft && <Icon name={iconLeft} size={iconSize} />}
      {children}
      {iconRight && !loading && <Icon name={iconRight} size={iconSize} />}
    </>
  );
  if (href) {
    return <a href={disabled ? undefined : href} className={cls} aria-disabled={disabled || undefined} {...rest}>{content}</a>;
  }
  return <button type={type} className={cls} disabled={disabled || loading} aria-busy={loading || undefined} {...rest}>{content}</button>;
}

// ---- core/IconButton.jsx

injectStyles('lm-iconbutton', `
.lm-ib{display:inline-flex;align-items:center;justify-content:center;border:0;border-radius:var(--radius-control);cursor:pointer;padding:0;flex-shrink:0;transition:background-color var(--duration-fast) var(--ease-out),box-shadow var(--duration-base) var(--ease-out),color var(--duration-fast) var(--ease-out)}
.lm-ib:focus-visible{outline:none;box-shadow:var(--focus-shadow)}
.lm-ib--xs{width:24px;height:24px}.lm-ib--sm{width:32px;height:32px}.lm-ib--md{width:40px;height:40px}.lm-ib--lg{width:48px;height:48px}
@media (pointer:coarse){.lm-ib--sm,.lm-ib--md{min-width:var(--hit-min);min-height:var(--hit-min)}}
.lm-ib--solid{background:var(--surface-3);color:var(--text-primary)}.lm-ib--solid:hover{background:var(--gray-800)}
[data-theme="light"] .lm-ib--solid:hover{background:var(--gray-200)}
.lm-ib--ghost{background:transparent;color:var(--text-secondary)}.lm-ib--ghost:hover{background:var(--action-ghost-hover);color:var(--text-primary)}
.lm-ib--outline{background:transparent;color:var(--text-primary);box-shadow:inset 0 0 0 1px var(--border-default)}.lm-ib--outline:hover{box-shadow:inset 0 0 0 1px var(--text-primary)}
.lm-ib--primary{background:var(--action-primary);color:var(--white)}.lm-ib--primary:hover{box-shadow:var(--glow-sm)}
.lm-ib--inverse{background:var(--surface-inverse);color:var(--text-inverse)}.lm-ib--inverse:hover{opacity:.88}
.lm-ib:disabled{opacity:.4;cursor:not-allowed;box-shadow:none}
`);

function IconButton({ icon, label, variant = 'solid', size = 'md', type = 'button', className = '', ...rest }) {
  const iconSize = size === 'xs' ? 14 : size === 'sm' ? 16 : size === 'lg' ? 22 : 20;
  return (
    <button type={type} aria-label={label} title={label} className={['lm-ib', 'lm-ib--' + variant, 'lm-ib--' + size, className].join(' ')} {...rest}>
      <Icon name={icon} size={iconSize} />
    </button>
  );
}

// ---- core/Tag.jsx

const TAG_VARIANTS = {
  inverse: { background: 'var(--surface-inverse)', color: 'var(--text-inverse)' },
  accent: { background: 'var(--surface-accent)', color: 'var(--white)' },
  subtle: { background: 'var(--surface-3)', color: 'var(--text-secondary)' },
  outline: { background: 'transparent', color: 'var(--text-secondary)', boxShadow: 'inset 0 0 0 1px var(--border-default)' },
};

function Tag({ variant = 'inverse', size = 'md', uppercase = false, icon, children, style, ...rest }) {
  const fs = size === 'sm' ? 11 : 12;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-mono)', fontSize: fs, lineHeight: 1,
      letterSpacing: uppercase ? 'var(--tracking-caps)' : 'var(--tracking-mono)', textTransform: uppercase ? 'uppercase' : 'none',
      padding: size === 'sm' ? '3px 5px' : '5px 7px', borderRadius: 'var(--radius-xs)', whiteSpace: 'nowrap', flexShrink: 0, alignSelf: 'flex-start', width: 'fit-content',
      ...TAG_VARIANTS[variant], ...style,
    }} {...rest}>
      {icon && <Icon name={icon} size={fs + 1} strokeWidth={1.75} />}
      {children}
    </span>
  );
}

// ---- core/IndexBadge.jsx

const IDX_VARIANTS = {
  outline: { color: 'var(--text-primary)', boxShadow: 'inset 0 0 0 1px var(--border-strong)', background: 'transparent' },
  solid: { color: 'var(--white)', background: 'var(--surface-accent)' },
  inverse: { color: 'var(--text-inverse)', background: 'var(--surface-inverse)' },
};

function IndexBadge({ value, variant = 'outline', size = 'md', style }) {
  const s = size === 'sm' ? 18 : size === 'lg' ? 28 : 22;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: s, height: s, flexShrink: 0,
      fontFamily: 'var(--font-mono)', fontSize: size === 'lg' ? 13 : 11, lineHeight: 1, borderRadius: 'var(--radius-xs)',
      fontVariantNumeric: 'tabular-nums', ...IDX_VARIANTS[variant], ...style,
    }}>{value}</span>
  );
}

// ---- core/ArrowLink.jsx

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

function ArrowLink({ href, icon = 'arrow-right', tone = 'default', children, className = '', ...rest }) {
  const Tag = href ? 'a' : 'button';
  return (
    <Tag href={href} className={['lm-al', 'lm-al--' + tone, className].join(' ')} {...rest}>
      <span className="lm-al__box"><Icon name={icon} size={14} strokeWidth={1.75} /></span>
      <span className="lm-al__label">{children}</span>
    </Tag>
  );
}

// ---- core/Wordmark.jsx

function Wordmark({ name = 'Lumen', size = 24, color = 'currentColor', style }) {
  return (
    <span style={{ fontFamily: 'var(--font-display)', fontSize: size, lineHeight: 1, letterSpacing: '-0.05em', fontWeight: 400, color, whiteSpace: 'nowrap', ...style }}>{name}</span>
  );
}

// ---- forms/fieldStyles.js

function useFieldStyles() {
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

// ---- forms/checkStyles.js

function useCheckStyles() {
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

// ---- forms/Input.jsx

function Input({ label, hint, error, required, iconLeft, suffix, size = 'md', multiline = false, rows = 4, disabled, id, className = '', style, ...rest }) {
  useFieldStyles();
  const autoId = React.useId();
  const fid = id || autoId;
  const describedBy = error ? fid + '-err' : hint ? fid + '-hint' : undefined;
  const ctrl = ['lm-control', 'lm-control--' + size, multiline && 'lm-control--multi', error && 'lm-control--invalid', disabled && 'lm-control--disabled'].filter(Boolean).join(' ');
  const Field = multiline ? 'textarea' : 'input';
  return (
    <div className={'lm-field ' + className} style={style}>
      {label && <label className="lm-field__label" htmlFor={fid}>{label}{required && <span className="lm-field__req" aria-hidden="true">*</span>}</label>}
      <div className={ctrl}>
        {iconLeft && <Icon name={iconLeft} size={18} />}
        <Field id={fid} rows={multiline ? rows : undefined} disabled={disabled} required={required} aria-invalid={!!error || undefined} aria-describedby={describedBy} {...rest} />
        {suffix && <span className="lm-control__suffix">{suffix}</span>}
      </div>
      {error ? <span id={fid + '-err'} className="lm-field__err"><Icon name="circle-x" size={14} />{error}</span>
        : hint && <span id={fid + '-hint'} className="lm-field__hint">{hint}</span>}
    </div>
  );
}

// ---- forms/Select.jsx

function Select({ label, hint, error, required, options = [], placeholder, size = 'md', disabled, id, className = '', style, ...rest }) {
  useFieldStyles();
  const autoId = React.useId();
  const fid = id || autoId;
  const ctrl = ['lm-control', 'lm-control--' + size, error && 'lm-control--invalid', disabled && 'lm-control--disabled'].filter(Boolean).join(' ');
  return (
    <div className={'lm-field ' + className} style={style}>
      {label && <label className="lm-field__label" htmlFor={fid}>{label}{required && <span className="lm-field__req" aria-hidden="true">*</span>}</label>}
      <div className={ctrl}>
        <select id={fid} disabled={disabled} required={required} aria-invalid={!!error || undefined} {...rest}>
          {placeholder && <option value="" disabled>{placeholder}</option>}
          {options.map(o => typeof o === 'string' ? <option key={o} value={o}>{o}</option> : <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <Icon name="chevron-down" size={16} className="lm-control__chev" />
      </div>
      {error ? <span className="lm-field__err"><Icon name="circle-x" size={14} />{error}</span> : hint && <span className="lm-field__hint">{hint}</span>}
    </div>
  );
}

// ---- forms/Checkbox.jsx

function Checkbox({ label, description, disabled, className = '', style, ...rest }) {
  useCheckStyles();
  return (
    <label className={['lm-check', disabled && 'lm-check--disabled', className].filter(Boolean).join(' ')} style={style}>
      <input type="checkbox" className="lm-check__input" disabled={disabled} {...rest} />
      <span className="lm-check__box" aria-hidden="true"><Icon name="check" size={14} strokeWidth={2.25} /></span>
      {(label || description) && <span className="lm-check__text">
        {label && <span className="lm-check__label">{label}</span>}
        {description && <span className="lm-check__desc">{description}</span>}
      </span>}
    </label>
  );
}

// ---- forms/Radio.jsx

function Radio({ label, description, disabled, className = '', style, ...rest }) {
  useCheckStyles();
  return (
    <label className={['lm-check', disabled && 'lm-check--disabled', className].filter(Boolean).join(' ')} style={style}>
      <input type="radio" className="lm-check__input" disabled={disabled} {...rest} />
      <span className="lm-check__box lm-check__box--radio" aria-hidden="true"><span className="lm-check__dot" /></span>
      {(label || description) && <span className="lm-check__text">
        {label && <span className="lm-check__label">{label}</span>}
        {description && <span className="lm-check__desc">{description}</span>}
      </span>}
    </label>
  );
}

// ---- forms/Switch.jsx

function Switch({ checked, defaultChecked = false, onChange, label, description, disabled, className = '', style }) {
  useCheckStyles();
  const [inner, setInner] = React.useState(defaultChecked);
  const on = checked ?? inner;
  const toggle = () => { if (checked === undefined) setInner(!on); onChange && onChange(!on); };
  return (
    <button type="button" role="switch" aria-checked={on} disabled={disabled} onClick={toggle} className={'lm-switch ' + className} style={style}>
      <span className="lm-switch__track"><span className="lm-switch__thumb" /></span>
      {(label || description) && <span className="lm-check__text">
        {label && <span className="lm-check__label">{label}</span>}
        {description && <span className="lm-check__desc">{description}</span>}
      </span>}
    </button>
  );
}

// ---- navigation/Navbar.jsx

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

function Navbar({ brand, brandHref = '#', items = [], cta, secondaryAction, variant = 'sticky', current, onNavigate }) {
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

// ---- navigation/Tabs.jsx

injectStyles('lm-tabs', `
.lm-tabs{display:flex;align-items:center;overflow-x:auto;scrollbar-width:none;-webkit-overflow-scrolling:touch;max-width:100%}
.lm-tabs::-webkit-scrollbar{display:none}
.lm-tab{flex-shrink:0;display:inline-flex;align-items:center;justify-content:center;gap:6px;background:none;border:0;cursor:pointer;white-space:nowrap;transition:color var(--duration-fast) var(--ease-out),background-color var(--duration-fast) var(--ease-out),box-shadow var(--duration-fast)}
.lm-tab:focus-visible{outline:none;box-shadow:var(--focus-shadow)}
.lm-tab__count{font-family:var(--font-mono);font-size:11px;color:var(--text-tertiary)}
.lm-tabs--text{gap:16px}
.lm-tabs--text .lm-tab{height:32px;padding:0 2px;font-family:var(--font-mono);font-size:12px;letter-spacing:var(--tracking-caps);text-transform:uppercase;color:var(--text-tertiary)}
.lm-tabs--text .lm-tab:hover{color:var(--text-secondary)}
.lm-tabs--text .lm-tab[aria-selected="true"]{color:var(--text-primary)}
.lm-tabs--segmented{display:inline-flex;gap:2px;padding:3px;background:var(--surface-2);border-radius:var(--radius-control);box-shadow:inset 0 0 0 1px var(--border-subtle)}
.lm-tabs--segmented .lm-tab{height:30px;padding:0 12px;border-radius:var(--radius-xs);font-family:var(--font-mono);font-size:12px;letter-spacing:var(--tracking-caps);text-transform:uppercase;color:var(--text-secondary)}
.lm-tabs--segmented .lm-tab:hover{color:var(--text-primary)}
.lm-tabs--segmented .lm-tab[aria-selected="true"]{background:var(--surface-inverse);color:var(--text-inverse)}
.lm-tabs--segmented .lm-tab[aria-selected="true"] .lm-tab__count{color:inherit;opacity:.6}
.lm-tabs--underline{gap:24px;box-shadow:inset 0 -1px 0 var(--border-subtle)}
.lm-tabs--underline .lm-tab{height:44px;padding:0;font-family:var(--font-sans);font-size:14px;letter-spacing:-.01em;color:var(--text-tertiary)}
.lm-tabs--underline .lm-tab:hover{color:var(--text-primary)}
.lm-tabs--underline .lm-tab[aria-selected="true"]{color:var(--text-primary);box-shadow:inset 0 -2px 0 var(--blue-500)}
.lm-tabs--full{display:flex}.lm-tabs--full .lm-tab{flex:1}
@media (pointer:coarse){.lm-tabs--text .lm-tab,.lm-tabs--segmented .lm-tab{min-height:40px}}
`);

function Tabs({ items = [], value, defaultValue, onChange, variant = 'text', fullWidth = false, label, className = '', style }) {
  const norm = items.map(it => typeof it === 'string' ? { value: it, label: it } : it);
  const [inner, setInner] = React.useState(defaultValue ?? (norm[0] && norm[0].value));
  const active = value ?? inner;
  const refs = React.useRef([]);
  const select = v => { if (value === undefined) setInner(v); onChange && onChange(v); };
  const onKey = (e, i) => {
    const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const n = (i + d + norm.length) % norm.length;
    select(norm[n].value);
    refs.current[n] && refs.current[n].focus();
  };
  return (
    <div role="tablist" aria-label={label} className={['lm-tabs', 'lm-tabs--' + variant, fullWidth && 'lm-tabs--full', className].filter(Boolean).join(' ')} style={style}>
      {norm.map((it, i) => (
        <button key={it.value} ref={el => (refs.current[i] = el)} type="button" role="tab" aria-selected={active === it.value} tabIndex={active === it.value ? 0 : -1} className="lm-tab" onClick={() => select(it.value)} onKeyDown={e => onKey(e, i)}>
          {it.label}{it.count != null && <span className="lm-tab__count">{it.count}</span>}
        </button>
      ))}
    </div>
  );
}

// ---- navigation/Sidebar.jsx

injectStyles('lm-sidebar', `
.lm-side{width:var(--sidebar-width);height:100%;display:flex;flex-direction:column;background:var(--surface-1);box-shadow:1px 0 0 var(--border-subtle);font-family:var(--font-sans);flex-shrink:0}
.lm-side__head{height:var(--nav-height);display:flex;align-items:center;padding:0 20px;flex-shrink:0}
.lm-side__nav{flex:1;overflow-y:auto;padding:8px 12px;display:flex;flex-direction:column;gap:2px}
.lm-side__section{font-family:var(--font-mono);font-size:11px;letter-spacing:var(--tracking-caps);text-transform:uppercase;color:var(--text-tertiary);padding:20px 10px 8px}
.lm-side__item{display:flex;align-items:center;gap:12px;height:40px;padding:0 10px;border-radius:var(--radius-xs);background:none;border:0;color:var(--text-secondary);font-size:14px;letter-spacing:-.01em;cursor:pointer;text-align:left;text-decoration:none;width:100%;transition:background-color var(--duration-fast) var(--ease-out),color var(--duration-fast)}
.lm-side__item:hover{background:var(--action-ghost-hover);color:var(--text-primary);text-decoration:none}
.lm-side__item[aria-current="page"]{background:var(--surface-3);color:var(--text-primary)}
.lm-side__item[aria-current="page"] svg{color:var(--blue-500)}
.lm-side__item:focus-visible{outline:none;box-shadow:var(--focus-shadow)}
.lm-side__badge{margin-left:auto;font-family:var(--font-mono);font-size:11px;min-width:20px;height:18px;padding:0 5px;display:inline-flex;align-items:center;justify-content:center;background:var(--surface-accent);color:var(--white);border-radius:var(--radius-xs)}
.lm-side__foot{padding:12px;box-shadow:0 -1px 0 var(--border-subtle);flex-shrink:0}
`);

function Sidebar({ header, items = [], value, onChange, footer, className = '', style }) {
  return (
    <aside className={'lm-side ' + className} style={style}>
      {header && <div className="lm-side__head">{header}</div>}
      <nav className="lm-side__nav" aria-label="Sections">
        {items.map((it, i) => it.section ? <div key={'s' + i} className="lm-side__section">{it.section}</div> : (
          <button key={it.value} type="button" className="lm-side__item" aria-current={value === it.value ? 'page' : undefined} onClick={() => onChange && onChange(it.value)}>
            {it.icon && <Icon name={it.icon} size={18} />}<span>{it.label}</span>
            {it.badge != null && <span className="lm-side__badge">{it.badge}</span>}
          </button>
        ))}
      </nav>
      {footer && <div className="lm-side__foot">{footer}</div>}
    </aside>
  );
}

// ---- navigation/BottomNav.jsx

injectStyles('lm-bottomnav', `
.lm-bnav{display:flex;align-items:stretch;height:calc(var(--tabbar-height) + env(safe-area-inset-bottom));padding-bottom:env(safe-area-inset-bottom);background:rgba(10,11,13,.88);-webkit-backdrop-filter:var(--blur-nav);backdrop-filter:var(--blur-nav);box-shadow:0 -1px 0 var(--border-subtle);font-family:var(--font-sans);z-index:var(--z-nav)}
[data-theme="light"] .lm-bnav{background:rgba(255,255,255,.9)}
.lm-bnav--fixed{position:fixed;left:0;right:0;bottom:0}
@media (min-width:1024px){.lm-bnav--auto{display:none}}
.lm-bnav__item{flex:1;min-width:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;background:none;border:0;color:var(--text-tertiary);font-size:11px;font-weight:500;letter-spacing:0;cursor:pointer;position:relative;transition:color var(--duration-fast)}
.lm-bnav__item[aria-current="page"]{color:var(--text-primary)}
.lm-bnav__item[aria-current="page"] svg{color:var(--blue-500)}
.lm-bnav__item[aria-current="page"]::before{content:"";position:absolute;top:0;left:30%;right:30%;height:2px;background:var(--blue-500);box-shadow:var(--glow-sm)}
.lm-bnav__item:focus-visible{outline:none;box-shadow:inset var(--focus-shadow)}
.lm-bnav__dot{position:absolute;top:10px;left:calc(50% + 6px);min-width:16px;height:16px;padding:0 4px;border-radius:9999px;background:var(--blue-500);color:var(--white);font-family:var(--font-mono);font-size:10px;display:flex;align-items:center;justify-content:center}
`);

function BottomNav({ items = [], value, onChange, position = 'fixed', hideOnDesktop = true, className = '', style }) {
  const cls = ['lm-bnav', position === 'fixed' && 'lm-bnav--fixed', hideOnDesktop && 'lm-bnav--auto', className].filter(Boolean).join(' ');
  return (
    <nav className={cls} style={style} aria-label="Primary">
      {items.slice(0, 5).map(it => (
        <button key={it.value} type="button" className="lm-bnav__item" aria-current={value === it.value ? 'page' : undefined} onClick={() => onChange && onChange(it.value)}>
          <Icon name={it.icon} size={22} />
          <span>{it.label}</span>
          {it.badge != null && <span className="lm-bnav__dot">{it.badge}</span>}
        </button>
      ))}
    </nav>
  );
}

// ---- surfaces/Card.jsx

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

function Card({ variant = 'default', padding = 'md', interactive, href, as, onClick, children, className = '', style, ...rest }) {
  const isInteractive = interactive ?? !!(href || onClick);
  const Tag = as || (href ? 'a' : 'div');
  const cls = ['lm-card', 'lm-card--' + variant, 'lm-card--p-' + padding, isInteractive && 'lm-card--interactive', className].filter(Boolean).join(' ');
  return <Tag href={href} onClick={onClick} className={cls} style={style} tabIndex={isInteractive && !href ? 0 : undefined} {...rest}>{children}</Tag>;
}

// ---- surfaces/Accordion.jsx

injectStyles('lm-accordion', `
.lm-acc{display:flex;flex-direction:column;font-family:var(--font-sans)}
.lm-acc--filled{gap:8px}
.lm-acc__item{border-radius:var(--radius-xs);transition:background-color var(--duration-base) var(--ease-out)}
.lm-acc--filled .lm-acc__item{background:var(--surface-2)}
[data-theme="light"] .lm-acc--filled .lm-acc__item{background:var(--gray-50)}
.lm-acc--divided .lm-acc__item{border-radius:0;box-shadow:inset 0 -1px 0 var(--border-subtle)}
.lm-acc__item--accent{background:var(--blue-600) !important;color:var(--white)}
.lm-acc__head{width:100%;display:flex;align-items:center;gap:12px;min-height:56px;padding:12px 16px;background:none;border:0;color:inherit;text-align:left;cursor:pointer;font-size:15px;letter-spacing:-.01em;line-height:1.3}
.lm-acc--divided .lm-acc__head{padding:16px 0;min-height:64px;font-size:18px;letter-spacing:-.02em}
.lm-acc__head:focus-visible{outline:none;box-shadow:var(--focus-shadow);border-radius:var(--radius-xs)}
.lm-acc__title{flex:1;min-width:0}
.lm-acc__meta{font-family:var(--font-mono);font-size:12px;color:var(--text-tertiary);letter-spacing:.02em}
.lm-acc__toggle{width:24px;height:24px;flex-shrink:0;display:inline-flex;align-items:center;justify-content:center;border-radius:var(--radius-xs);background:var(--surface-3);color:var(--text-primary);transition:background-color var(--duration-fast)}
[data-theme="light"] .lm-acc__toggle{background:var(--gray-200)}
.lm-acc__head:hover .lm-acc__toggle{background:var(--gray-700)}
[data-theme="light"] .lm-acc__head:hover .lm-acc__toggle{background:var(--gray-300)}
.lm-acc__item--accent .lm-acc__toggle{background:var(--white);color:var(--black)}
.lm-acc__panel{display:grid;grid-template-rows:0fr;transition:grid-template-rows var(--duration-slow) var(--ease-emphasized)}
.lm-acc__panel--open{grid-template-rows:1fr}
.lm-acc__inner{overflow:hidden}
.lm-acc__body{padding:0 16px 18px;font-size:14px;line-height:1.5;color:var(--text-secondary);max-width:68ch}
.lm-acc--numbered .lm-acc__body{padding-left:50px}
.lm-acc--divided .lm-acc__body{padding:0 0 20px;font-size:16px}
.lm-acc__item--accent .lm-acc__body{color:var(--white)}
`);

function Accordion({ items = [], type = 'single', defaultOpen = [], variant = 'filled', numbered = false, accentOpen = false, className = '', style }) {
  const [open, setOpen] = React.useState(() => new Set(defaultOpen));
  const baseId = React.useId();
  const toggle = id => setOpen(prev => {
    const next = new Set(type === 'single' ? [] : prev);
    if (!prev.has(id)) next.add(id);
    return next;
  });
  return (
    <div className={['lm-acc', 'lm-acc--' + variant, numbered && 'lm-acc--numbered', className].filter(Boolean).join(' ')} style={style}>
      {items.map((it, i) => {
        const id = it.id ?? String(i);
        const isOpen = open.has(id);
        const hid = baseId + '-h' + i, pid = baseId + '-p' + i;
        return (
          <div key={id} className={['lm-acc__item', isOpen && accentOpen && 'lm-acc__item--accent'].filter(Boolean).join(' ')}>
            <button type="button" id={hid} className="lm-acc__head" aria-expanded={isOpen} aria-controls={pid} onClick={() => toggle(id)}>
              {numbered && <IndexBadge value={i + 1} variant={isOpen && accentOpen ? 'inverse' : 'outline'} />}
              <span className="lm-acc__title">{it.title}</span>
              {it.meta && <span className="lm-acc__meta">{it.meta}</span>}
              <span className="lm-acc__toggle" aria-hidden="true"><Icon name={isOpen ? 'minus' : 'plus'} size={14} strokeWidth={2} /></span>
            </button>
            <div id={pid} role="region" aria-labelledby={hid} className={'lm-acc__panel' + (isOpen ? ' lm-acc__panel--open' : '')}>
              <div className="lm-acc__inner"><div className="lm-acc__body">{it.content}</div></div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ---- surfaces/Glow.jsx

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

function Glow({ variant = 'horizon', grain = true, as = 'div', minHeight, children, className = '', style, ...rest }) {
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

// ---- data/ValueTag.jsx

const VT = {
  dark: { background: 'var(--black)', color: 'var(--white)', boxShadow: '0 0 0 1px var(--border-default)' },
  light: { background: 'var(--white)', color: 'var(--black)' },
  accent: { background: 'var(--blue-600)', color: 'var(--white)' },
};

function ValueTag({ value, direction = 'up', variant = 'dark', style }) {
  const arrowColor = direction === 'down' ? 'var(--red-400)' : variant === 'accent' ? 'var(--white)' : 'var(--blue-500)';
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 24, padding: '0 8px', fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.02em', fontVariantNumeric: 'tabular-nums', borderRadius: 'var(--radius-xs)', whiteSpace: 'nowrap', ...VT[variant], ...style }}>
      {direction && direction !== 'none' && <span aria-hidden="true" style={{ color: arrowColor, fontSize: 10 }}>{direction === 'down' ? '▼' : '▲'}</span>}
      <span>{value}</span>
    </span>
  );
}

// ---- data/StatCard.jsx

const SC = {
  default: { bg: 'var(--surface-1)', fg: 'var(--text-primary)', sub: 'var(--text-tertiary)', iconBg: 'var(--surface-accent)', iconFg: 'var(--white)', ring: 'var(--shadow-hairline)' },
  inverse: { bg: 'var(--surface-inverse)', fg: 'var(--text-inverse)', sub: 'var(--gray-500)', iconBg: 'var(--blue-500)', iconFg: 'var(--white)', ring: 'none' },
  accent: { bg: 'var(--blue-600)', fg: 'var(--white)', sub: 'var(--white)', iconBg: 'var(--black)', iconFg: 'var(--white)', ring: 'none' },
  outline: { bg: 'transparent', fg: 'var(--text-primary)', sub: 'var(--text-tertiary)', iconBg: 'var(--surface-3)', iconFg: 'var(--text-primary)', ring: 'inset 0 0 0 1px var(--border-default)' },
};

function StatCard({ label, icon, value, caption, delta, variant = 'default', size = 'md', children, style }) {
  const t = SC[variant];
  const lg = size === 'lg';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 24, minHeight: lg ? 280 : 180, padding: lg ? 'clamp(20px,2.5vw,28px)' : 20, background: t.bg, color: t.fg, boxShadow: t.ring, borderRadius: 'var(--radius-card)', fontFamily: 'var(--font-sans)', minWidth: 0, ...style }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {icon && <span style={{ width: lg ? 32 : 24, height: lg ? 32 : 24, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: t.iconBg, color: t.iconFg, borderRadius: 'var(--radius-xs)', flexShrink: 0 }}><Icon name={icon} size={lg ? 18 : 14} strokeWidth={1.75} /></span>}
        <span style={{ fontSize: lg ? 20 : 15, letterSpacing: '-0.02em', lineHeight: 1.2 }}>{label}</span>
        {delta && <span style={{ marginLeft: 'auto' }}><ValueTag value={delta.value} direction={delta.direction || 'up'} variant={variant === 'inverse' ? 'dark' : variant === 'accent' ? 'light' : 'dark'} /></span>}
      </div>
      {children}
      <div>
        <div style={{ fontSize: lg ? 'clamp(44px, 2rem + 3vw, 64px)' : 'clamp(32px, 1.6rem + 1.5vw, 44px)', lineHeight: 1, letterSpacing: '-0.045em', fontVariantNumeric: 'tabular-nums' }}>{value}</div>
        {caption && <div style={{ fontSize: 14, color: t.sub, marginTop: 8, letterSpacing: '-0.01em' }}>{caption}</div>}
      </div>
    </div>
  );
}

// ---- data/BarChart.jsx

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

function BarChart({ data = [], height = 240, gap = 2, highlight = 'max', format = v => String(v), yTicks = 4, xLabels, fill = 'gradient', label = 'Bar chart', style }) {
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

// ---- data/DataTable.jsx

injectStyles('lm-datatable', `
.lm-dt{font-family:var(--font-sans);width:100%}
.lm-dt__wrap{overflow-x:auto}
.lm-dt table{width:100%;border-collapse:collapse}
.lm-dt th{height:40px;padding:0 16px;font-family:var(--font-mono);font-size:11px;font-weight:400;letter-spacing:var(--tracking-caps);text-transform:uppercase;color:var(--text-tertiary);text-align:left;white-space:nowrap;box-shadow:inset 0 -1px 0 var(--border-default)}
.lm-dt th button{all:unset;cursor:pointer;display:inline-flex;align-items:center;gap:6px}
.lm-dt th button:hover{color:var(--text-primary)}
.lm-dt th button:focus-visible{box-shadow:var(--focus-shadow)}
.lm-dt td{height:56px;padding:0 16px;font-size:14px;letter-spacing:-.01em;color:var(--text-primary);box-shadow:inset 0 -1px 0 var(--border-subtle);white-space:nowrap}
.lm-dt td.lm-dt--mono,.lm-dt__v.lm-dt--mono{font-family:var(--font-mono);font-size:13px;letter-spacing:0;font-variant-numeric:tabular-nums}
.lm-dt .lm-dt--right{text-align:right}
.lm-dt tbody tr{transition:background-color var(--duration-fast)}
.lm-dt--click tbody tr{cursor:pointer}
.lm-dt--click tbody tr:hover{background:var(--surface-3)}
.lm-dt__cards{display:none;list-style:none;margin:0;padding:0;flex-direction:column;gap:8px}
.lm-dt__card{background:var(--surface-1);box-shadow:var(--shadow-hairline);border-radius:var(--radius-card);padding:14px 16px;display:flex;flex-direction:column;gap:10px}
.lm-dt--click .lm-dt__card{cursor:pointer}
.lm-dt__ctitle{display:flex;align-items:center;justify-content:space-between;gap:12px;font-size:15px}
.lm-dt__row{display:flex;justify-content:space-between;align-items:center;gap:12px;min-height:22px}
.lm-dt__k{font-family:var(--font-mono);font-size:11px;letter-spacing:var(--tracking-caps);text-transform:uppercase;color:var(--text-tertiary)}
.lm-dt__v{font-size:14px;text-align:right}
.lm-dt__sort{display:none;align-items:center;justify-content:space-between;gap:8px;margin-bottom:10px}
.lm-dt__sort select{appearance:none;-webkit-appearance:none;background:var(--surface-2);color:var(--text-primary);border:0;box-shadow:inset 0 0 0 1px var(--border-default);border-radius:var(--radius-xs);height:40px;padding:0 12px;font-family:var(--font-mono);font-size:12px;letter-spacing:.04em;text-transform:uppercase}
.lm-dt__empty{padding:48px 16px;text-align:center;color:var(--text-tertiary);font-size:14px}
@media (max-width:767px){.lm-dt__wrap{display:none}.lm-dt__cards{display:flex}.lm-dt__sort{display:flex}}
`);

function DataTable({ columns = [], rows = [], rowKey = 'id', onRowClick, sortable = true, defaultSort, empty = 'No results', className = '', style }) {
  const [sort, setSort] = React.useState(defaultSort || null);
  const sorted = React.useMemo(() => {
    if (!sort) return rows;
    const col = columns.find(c => c.key === sort.key);
    const get = col && col.sortValue ? col.sortValue : r => r[sort.key];
    return [...rows].sort((a, b) => { const x = get(a), y = get(b); return (x > y ? 1 : x < y ? -1 : 0) * (sort.dir === 'desc' ? -1 : 1); });
  }, [rows, sort, columns]);
  const toggle = key => setSort(s => s && s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'desc' });
  const cell = (c, r) => c.render ? c.render(r) : r[c.key];
  const primary = columns.find(c => c.primary) || columns[0];
  const rest = columns.filter(c => c !== primary);
  const sortCols = sortable ? columns.filter(c => c.sortable !== false) : [];
  const cls = ['lm-dt', onRowClick && 'lm-dt--click', className].filter(Boolean).join(' ');
  return (
    <div className={cls} style={style}>
      {sortCols.length > 0 && <div className="lm-dt__sort">
        <span className="lm-dt__k">{rows.length} items</span>
        <select aria-label="Sort by" value={sort ? sort.key + ':' + sort.dir : ''} onChange={e => { const [key, dir] = e.target.value.split(':'); setSort(key ? { key, dir } : null); }}>
          <option value="">Sort: default</option>
          {sortCols.map(c => [<option key={c.key + 'd'} value={c.key + ':desc'}>{c.header} ↓</option>, <option key={c.key + 'a'} value={c.key + ':asc'}>{c.header} ↑</option>])}
        </select>
      </div>}
      <div className="lm-dt__wrap">
        <table>
          <thead><tr>{columns.map(c => {
            const canSort = sortable && c.sortable !== false;
            const active = sort && sort.key === c.key;
            return (
              <th key={c.key} className={c.align === 'right' ? 'lm-dt--right' : ''} style={{ width: c.width }} aria-sort={active ? (sort.dir === 'asc' ? 'ascending' : 'descending') : undefined}>
                {canSort ? <button type="button" onClick={() => toggle(c.key)} style={{ color: active ? 'var(--text-primary)' : undefined }}>
                  {c.header}<Icon name={active && sort.dir === 'asc' ? 'arrow-up' : 'arrow-down'} size={12} style={{ opacity: active ? 1 : 0.35 }} />
                </button> : c.header}
              </th>
            );
          })}</tr></thead>
          <tbody>{sorted.length === 0 ? <tr><td colSpan={columns.length} className="lm-dt__empty">{empty}</td></tr> :
            sorted.map((r, i) => (
              <tr key={r[rowKey] ?? i} onClick={onRowClick ? () => onRowClick(r) : undefined}>
                {columns.map(c => <td key={c.key} className={[c.mono && 'lm-dt--mono', c.align === 'right' && 'lm-dt--right'].filter(Boolean).join(' ')}>{cell(c, r)}</td>)}
              </tr>
            ))}</tbody>
        </table>
      </div>
      <ul className="lm-dt__cards">
        {sorted.length === 0 ? <li className="lm-dt__empty">{empty}</li> : sorted.map((r, i) => (
          <li key={r[rowKey] ?? i} className="lm-dt__card" onClick={onRowClick ? () => onRowClick(r) : undefined} tabIndex={onRowClick ? 0 : undefined}>
            <div className="lm-dt__ctitle"><span>{cell(primary, r)}</span>{onRowClick && <Icon name="chevron-right" size={16} style={{ color: 'var(--text-tertiary)' }} />}</div>
            {rest.map(c => <div key={c.key} className="lm-dt__row"><span className="lm-dt__k">{c.header}</span><span className={'lm-dt__v' + (c.mono ? ' lm-dt--mono' : '')}>{cell(c, r)}</span></div>)}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ---- feedback/Badge.jsx

const TONES = {
  neutral: ['var(--surface-3)', 'var(--text-secondary)', 'var(--gray-400)'],
  success: ['var(--status-success-bg)', 'var(--green-400)', 'var(--status-success)'],
  warning: ['var(--status-warning-bg)', 'var(--amber-400)', 'var(--status-warning)'],
  danger: ['var(--status-danger-bg)', 'var(--red-400)', 'var(--status-danger)'],
  info: ['var(--status-info-bg)', 'var(--blue-300)', 'var(--status-info)'],
};

function Badge({ tone = 'neutral', dot = true, children, style }) {
  const [bg, fg, dc] = TONES[tone];
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 22, padding: '0 8px', fontFamily: 'var(--font-sans)', fontSize: 12, fontWeight: 500, letterSpacing: 0, borderRadius: 'var(--radius-xs)', background: bg, color: fg, whiteSpace: 'nowrap', ...style }}>
      {dot && <span aria-hidden="true" style={{ width: 6, height: 6, borderRadius: 9999, background: dc, boxShadow: tone === 'info' ? '0 0 6px var(--blue-500)' : 'none' }} />}
      {children}
    </span>
  );
}

// ---- feedback/Dialog.jsx

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

function Dialog({ open, onClose, title, description, children, footer, size = 'md', dismissible = true }) {
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

// ---- feedback/Toast.jsx

const TOAST_ICON = { neutral: ['info', 'var(--text-secondary)'], success: ['circle-check', 'var(--green-400)'], warning: ['triangle-alert', 'var(--amber-400)'], danger: ['circle-x', 'var(--red-400)'], info: ['info', 'var(--blue-400)'] };

function Toast({ tone = 'neutral', title, description, action, onClose, style }) {
  const [icon, color] = TOAST_ICON[tone];
  return (
    <div role={tone === 'danger' ? 'alert' : 'status'} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, width: '100%', maxWidth: 400, padding: '14px 12px 14px 16px', background: 'var(--surface-2)', color: 'var(--text-primary)', borderRadius: 'var(--radius-card)', boxShadow: 'var(--shadow-overlay)', fontFamily: 'var(--font-sans)', pointerEvents: 'auto', ...style }}>
      <span style={{ color, marginTop: 1 }}><Icon name={icon} size={18} /></span>
      <div style={{ flex: 1, minWidth: 0 }}>
        {title && <div style={{ fontSize: 14, fontWeight: 500, letterSpacing: '-0.01em', lineHeight: 1.3 }}>{title}</div>}
        {description && <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.4, marginTop: 2 }}>{description}</div>}
        {action && <button type="button" onClick={action.onClick} style={{ marginTop: 8, padding: 0, background: 'none', border: 0, cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: 'var(--tracking-caps)', textTransform: 'uppercase', color: 'var(--text-accent)' }}>{action.label}</button>}
      </div>
      {onClose && <IconButton icon="x" label="Dismiss" variant="ghost" size="xs" onClick={onClose} />}
    </div>
  );
}

// ---- feedback/ToastRegion.jsx

injectStyles('lm-toastregion', `
.lm-toasts{position:fixed;z-index:var(--z-toast);right:24px;bottom:24px;display:flex;flex-direction:column;align-items:flex-end;gap:8px;pointer-events:none;width:min(400px,calc(100vw - 48px))}
@media (max-width:639px){.lm-toasts{left:12px;right:12px;width:auto;align-items:stretch;bottom:calc(12px + var(--lm-toast-offset,0px) + env(safe-area-inset-bottom))}}
`);

function ToastRegion({ offsetBottom = 0, children, style }) {
  return <div className="lm-toasts" aria-live="polite" style={{ '--lm-toast-offset': offsetBottom + 'px', ...style }}>{children}</div>;
}

// ---- feedback/Tooltip.jsx

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

function Tooltip({ content, side = 'top', delay = 250, wrap = false, children }) {
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

window.LumenDesignSystem_12638a = window.LumenDesignSystem_12638a || { injectStyles, ICON_PATHS, Icon, ICON_NAMES, Button, IconButton, Tag, IndexBadge, ArrowLink, Wordmark, useFieldStyles, useCheckStyles, Input, Select, Checkbox, Radio, Switch, Navbar, Tabs, Sidebar, BottomNav, Card, Accordion, Glow, ValueTag, StatCard, BarChart, DataTable, Badge, Dialog, Toast, ToastRegion, Tooltip };
})();
