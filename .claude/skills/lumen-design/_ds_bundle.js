/* @ds-bundle: {"format":4,"namespace":"LumenDesignSystem_12638a","components":[{"name":"ArrowLink","sourcePath":"components/core/ArrowLink.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Icon","sourcePath":"components/core/Icon.jsx"},{"name":"ICON_NAMES","sourcePath":"components/core/Icon.jsx"},{"name":"IconButton","sourcePath":"components/core/IconButton.jsx"},{"name":"IndexBadge","sourcePath":"components/core/IndexBadge.jsx"},{"name":"Tag","sourcePath":"components/core/Tag.jsx"},{"name":"Wordmark","sourcePath":"components/core/Wordmark.jsx"},{"name":"ICON_PATHS","sourcePath":"components/core/iconPaths.js"},{"name":"BarChart","sourcePath":"components/data/BarChart.jsx"},{"name":"DataTable","sourcePath":"components/data/DataTable.jsx"},{"name":"StatCard","sourcePath":"components/data/StatCard.jsx"},{"name":"ValueTag","sourcePath":"components/data/ValueTag.jsx"},{"name":"Badge","sourcePath":"components/feedback/Badge.jsx"},{"name":"Dialog","sourcePath":"components/feedback/Dialog.jsx"},{"name":"Toast","sourcePath":"components/feedback/Toast.jsx"},{"name":"ToastRegion","sourcePath":"components/feedback/ToastRegion.jsx"},{"name":"Tooltip","sourcePath":"components/feedback/Tooltip.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Radio","sourcePath":"components/forms/Radio.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"},{"name":"BottomNav","sourcePath":"components/navigation/BottomNav.jsx"},{"name":"Navbar","sourcePath":"components/navigation/Navbar.jsx"},{"name":"Sidebar","sourcePath":"components/navigation/Sidebar.jsx"},{"name":"Tabs","sourcePath":"components/navigation/Tabs.jsx"},{"name":"Accordion","sourcePath":"components/surfaces/Accordion.jsx"},{"name":"Card","sourcePath":"components/surfaces/Card.jsx"},{"name":"Glow","sourcePath":"components/surfaces/Glow.jsx"}],"sourceHashes":{"components/core/ArrowLink.jsx":"3d0b25a271ac","components/core/Button.jsx":"63332c8253c8","components/core/Icon.jsx":"f2c557725d11","components/core/IconButton.jsx":"83d31f7905bb","components/core/IndexBadge.jsx":"627e66359581","components/core/Tag.jsx":"f04d955e0688","components/core/Wordmark.jsx":"ff18d0294bf4","components/core/iconPaths.js":"914351fc9622","components/core/injectStyles.js":"5562757c30af","components/data/BarChart.jsx":"424c9660c232","components/data/DataTable.jsx":"294bb1c74e12","components/data/StatCard.jsx":"f407fffcfd88","components/data/ValueTag.jsx":"f1aefae29182","components/feedback/Badge.jsx":"990ae9126292","components/feedback/Dialog.jsx":"105729e95d4d","components/feedback/Toast.jsx":"e025c9a4a232","components/feedback/ToastRegion.jsx":"b0b417b64027","components/feedback/Tooltip.jsx":"407e587d2033","components/forms/Checkbox.jsx":"3d3befd63de5","components/forms/Input.jsx":"a83da765100d","components/forms/Radio.jsx":"4f68bb579429","components/forms/Select.jsx":"6540cafdae34","components/forms/Switch.jsx":"cf5a88ae55c9","components/forms/checkStyles.js":"c71ca8451ef1","components/forms/fieldStyles.js":"a92ca339f654","components/navigation/BottomNav.jsx":"8eacbde3e8be","components/navigation/Navbar.jsx":"b8ea7fd6abdc","components/navigation/Sidebar.jsx":"3ace5671a253","components/navigation/Tabs.jsx":"2fa51d43747e","components/surfaces/Accordion.jsx":"991bbccc2cd8","components/surfaces/Card.jsx":"ceafbc04976d","components/surfaces/Glow.jsx":"d5f7adb6a81d","scratch/dev-bundle.jsx":"a3bb4e4c30d9","ui_kits/app/ActivityScreen.jsx":"a702e10fbbf6","ui_kits/app/AppShell.jsx":"b2513a943605","ui_kits/app/AssetsScreen.jsx":"cc227151f7ef","ui_kits/app/OverviewScreen.jsx":"a0b1abad4165","ui_kits/app/SettingsScreen.jsx":"44fc437b3423","ui_kits/app/data.js":"45696a2fafe5","ui_kits/website/BountyPage.jsx":"f934ffc46971","ui_kits/website/HomePage.jsx":"2b73d2552b63","ui_kits/website/ProgramPage.jsx":"a178c217c3bd","ui_kits/website/ResearchPage.jsx":"d5a7562be4b2","ui_kits/website/SiteChrome.jsx":"bb1e03502948"},"inlinedExternals":[],"unexposedExports":[{"name":"injectStyles","sourcePath":"components/core/injectStyles.js"},{"name":"useCheckStyles","sourcePath":"components/forms/checkStyles.js"},{"name":"useFieldStyles","sourcePath":"components/forms/fieldStyles.js"}]} */

(() => {

const __ds_ns = (window.LumenDesignSystem_12638a = window.LumenDesignSystem_12638a || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/IndexBadge.jsx
try { (() => {
const IDX_VARIANTS = {
  outline: {
    color: 'var(--text-primary)',
    boxShadow: 'inset 0 0 0 1px var(--border-strong)',
    background: 'transparent'
  },
  solid: {
    color: 'var(--white)',
    background: 'var(--surface-accent)'
  },
  inverse: {
    color: 'var(--text-inverse)',
    background: 'var(--surface-inverse)'
  }
};
function IndexBadge({
  value,
  variant = 'outline',
  size = 'md',
  style
}) {
  const s = size === 'sm' ? 18 : size === 'lg' ? 28 : 22;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: s,
      height: s,
      flexShrink: 0,
      fontFamily: 'var(--font-mono)',
      fontSize: size === 'lg' ? 13 : 11,
      lineHeight: 1,
      borderRadius: 'var(--radius-xs)',
      fontVariantNumeric: 'tabular-nums',
      ...IDX_VARIANTS[variant],
      ...style
    }
  }, value);
}
Object.assign(__ds_scope, { IndexBadge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/IndexBadge.jsx", error: String((e && e.message) || e) }); }

// components/core/Wordmark.jsx
try { (() => {
function Wordmark({
  name = 'Lumen',
  size = 24,
  color = 'currentColor',
  style
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: size,
      lineHeight: 1,
      letterSpacing: '-0.05em',
      fontWeight: 400,
      color,
      whiteSpace: 'nowrap',
      ...style
    }
  }, name);
}
Object.assign(__ds_scope, { Wordmark });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Wordmark.jsx", error: String((e && e.message) || e) }); }

// components/core/iconPaths.js
try { (() => {
// Icon paths copied verbatim from Lucide (lucide-static@0.469.0, ISC license). Do not hand-edit.
const ICON_PATHS = {
  "arrow-right": "<path d=\"M5 12h14\" /><path d=\"m12 5 7 7-7 7\" />",
  "arrow-left": "<path d=\"m12 19-7-7 7-7\" /><path d=\"M19 12H5\" />",
  "arrow-up": "<path d=\"m5 12 7-7 7 7\" /><path d=\"M12 19V5\" />",
  "arrow-down": "<path d=\"M12 5v14\" /><path d=\"m19 12-7 7-7-7\" />",
  "arrow-up-right": "<path d=\"M7 7h10v10\" /><path d=\"M7 17 17 7\" />",
  "chevron-down": "<path d=\"m6 9 6 6 6-6\" />",
  "chevron-up": "<path d=\"m18 15-6-6-6 6\" />",
  "chevron-left": "<path d=\"m15 18-6-6 6-6\" />",
  "chevron-right": "<path d=\"m9 18 6-6-6-6\" />",
  "plus": "<path d=\"M5 12h14\" /><path d=\"M12 5v14\" />",
  "minus": "<path d=\"M5 12h14\" />",
  "x": "<path d=\"M18 6 6 18\" /><path d=\"m6 6 12 12\" />",
  "menu": "<line x1=\"4\" x2=\"20\" y1=\"12\" y2=\"12\" /><line x1=\"4\" x2=\"20\" y1=\"6\" y2=\"6\" /><line x1=\"4\" x2=\"20\" y1=\"18\" y2=\"18\" />",
  "search": "<circle cx=\"11\" cy=\"11\" r=\"8\" /><path d=\"m21 21-4.3-4.3\" />",
  "check": "<path d=\"M20 6 9 17l-5-5\" />",
  "play": "<polygon points=\"6 3 20 12 6 21 6 3\" />",
  "external-link": "<path d=\"M15 3h6v6\" /><path d=\"M10 14 21 3\" /><path d=\"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6\" />",
  "copy": "<rect width=\"14\" height=\"14\" x=\"8\" y=\"8\" rx=\"2\" ry=\"2\" /><path d=\"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2\" />",
  "info": "<circle cx=\"12\" cy=\"12\" r=\"10\" /><path d=\"M12 16v-4\" /><path d=\"M12 8h.01\" />",
  "triangle-alert": "<path d=\"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3\" /><path d=\"M12 9v4\" /><path d=\"M12 17h.01\" />",
  "circle-check": "<circle cx=\"12\" cy=\"12\" r=\"10\" /><path d=\"m9 12 2 2 4-4\" />",
  "circle-x": "<circle cx=\"12\" cy=\"12\" r=\"10\" /><path d=\"m15 9-6 6\" /><path d=\"m9 9 6 6\" />",
  "chart-line": "<path d=\"M3 3v16a2 2 0 0 0 2 2h16\" /><path d=\"m19 9-5 5-4-4-3 3\" />",
  "chart-bar": "<path d=\"M3 3v16a2 2 0 0 0 2 2h16\" /><path d=\"M7 16h8\" /><path d=\"M7 11h12\" /><path d=\"M7 6h3\" />",
  "chart-pie": "<path d=\"M21 12c.552 0 1.005-.449.95-.998a10 10 0 0 0-8.953-8.951c-.55-.055-.998.398-.998.95v8a1 1 0 0 0 1 1z\" /><path d=\"M21.21 15.89A10 10 0 1 1 8 2.83\" />",
  "wallet": "<path d=\"M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1\" /><path d=\"M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4\" />",
  "rocket": "<path d=\"M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z\" /><path d=\"m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z\" /><path d=\"M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0\" /><path d=\"M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5\" />",
  "infinity": "<path d=\"M12 12c-2-2.67-4-4-6-4a4 4 0 1 0 0 8c2 0 4-1.33 6-4Zm0 0c2 2.67 4 4 6 4a4 4 0 0 0 0-8c-2 0-4 1.33-6 4Z\" />",
  "file-text": "<path d=\"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z\" /><path d=\"M14 2v4a2 2 0 0 0 2 2h4\" /><path d=\"M10 9H8\" /><path d=\"M16 13H8\" /><path d=\"M16 17H8\" />",
  "book-open": "<path d=\"M12 7v14\" /><path d=\"M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z\" />",
  "code": "<polyline points=\"16 18 22 12 16 6\" /><polyline points=\"8 6 2 12 8 18\" />",
  "layers": "<path d=\"M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z\" /><path d=\"M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12\" /><path d=\"M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17\" />",
  "shield-check": "<path d=\"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z\" /><path d=\"m9 12 2 2 4-4\" />",
  "zap": "<path d=\"M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z\" />",
  "globe": "<circle cx=\"12\" cy=\"12\" r=\"10\" /><path d=\"M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20\" /><path d=\"M2 12h20\" />",
  "user": "<path d=\"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2\" /><circle cx=\"12\" cy=\"7\" r=\"4\" />",
  "settings": "<path d=\"M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z\" /><circle cx=\"12\" cy=\"12\" r=\"3\" />",
  "bell": "<path d=\"M10.268 21a2 2 0 0 0 3.464 0\" /><path d=\"M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326\" />",
  "log-out": "<path d=\"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4\" /><polyline points=\"16 17 21 12 16 7\" /><line x1=\"21\" x2=\"9\" y1=\"12\" y2=\"12\" />",
  "house": "<path d=\"M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8\" /><path d=\"M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z\" />",
  "activity": "<path d=\"M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2\" />",
  "sliders-horizontal": "<line x1=\"21\" x2=\"14\" y1=\"4\" y2=\"4\" /><line x1=\"10\" x2=\"3\" y1=\"4\" y2=\"4\" /><line x1=\"21\" x2=\"12\" y1=\"12\" y2=\"12\" /><line x1=\"8\" x2=\"3\" y1=\"12\" y2=\"12\" /><line x1=\"21\" x2=\"16\" y1=\"20\" y2=\"20\" /><line x1=\"12\" x2=\"3\" y1=\"20\" y2=\"20\" /><line x1=\"14\" x2=\"14\" y1=\"2\" y2=\"6\" /><line x1=\"8\" x2=\"8\" y1=\"10\" y2=\"14\" /><line x1=\"16\" x2=\"16\" y1=\"18\" y2=\"22\" />",
  "filter": "<polygon points=\"22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3\" />",
  "download": "<path d=\"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4\" /><polyline points=\"7 10 12 15 17 10\" /><line x1=\"12\" x2=\"12\" y1=\"15\" y2=\"3\" />",
  "calendar": "<path d=\"M8 2v4\" /><path d=\"M16 2v4\" /><rect width=\"18\" height=\"18\" x=\"3\" y=\"4\" rx=\"2\" /><path d=\"M3 10h18\" />",
  "lock": "<rect width=\"18\" height=\"11\" x=\"3\" y=\"11\" rx=\"2\" ry=\"2\" /><path d=\"M7 11V7a5 5 0 0 1 10 0v4\" />",
  "cpu": "<rect width=\"16\" height=\"16\" x=\"4\" y=\"4\" rx=\"2\" /><rect width=\"6\" height=\"6\" x=\"9\" y=\"9\" rx=\"1\" /><path d=\"M15 2v2\" /><path d=\"M15 20v2\" /><path d=\"M2 15h2\" /><path d=\"M2 9h2\" /><path d=\"M20 15h2\" /><path d=\"M20 9h2\" /><path d=\"M9 2v2\" /><path d=\"M9 20v2\" />",
  "box": "<path d=\"M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z\" /><path d=\"m3.3 7 8.7 5 8.7-5\" /><path d=\"M12 22V12\" />",
  "git-branch": "<line x1=\"6\" x2=\"6\" y1=\"3\" y2=\"15\" /><circle cx=\"18\" cy=\"6\" r=\"3\" /><circle cx=\"6\" cy=\"18\" r=\"3\" /><path d=\"M18 9a9 9 0 0 1-9 9\" />",
  "terminal": "<polyline points=\"4 17 10 11 4 5\" /><line x1=\"12\" x2=\"20\" y1=\"19\" y2=\"19\" />",
  "sun": "<circle cx=\"12\" cy=\"12\" r=\"4\" /><path d=\"M12 2v2\" /><path d=\"M12 20v2\" /><path d=\"m4.93 4.93 1.41 1.41\" /><path d=\"m17.66 17.66 1.41 1.41\" /><path d=\"M2 12h2\" /><path d=\"M20 12h2\" /><path d=\"m6.34 17.66-1.41 1.41\" /><path d=\"m19.07 4.93-1.41 1.41\" />",
  "moon": "<path d=\"M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z\" />",
  "ellipsis": "<circle cx=\"12\" cy=\"12\" r=\"1\" /><circle cx=\"19\" cy=\"12\" r=\"1\" /><circle cx=\"5\" cy=\"12\" r=\"1\" />",
  "layout-grid": "<rect width=\"7\" height=\"7\" x=\"3\" y=\"3\" rx=\"1\" /><rect width=\"7\" height=\"7\" x=\"14\" y=\"3\" rx=\"1\" /><rect width=\"7\" height=\"7\" x=\"14\" y=\"14\" rx=\"1\" /><rect width=\"7\" height=\"7\" x=\"3\" y=\"14\" rx=\"1\" />",
  "list": "<path d=\"M3 12h.01\" /><path d=\"M3 18h.01\" /><path d=\"M3 6h.01\" /><path d=\"M8 12h13\" /><path d=\"M8 18h13\" /><path d=\"M8 6h13\" />",
  "trending-up": "<polyline points=\"22 7 13.5 15.5 8.5 10.5 2 17\" /><polyline points=\"16 7 22 7 22 13\" />",
  "trending-down": "<polyline points=\"22 17 13.5 8.5 8.5 13.5 2 7\" /><polyline points=\"16 17 22 17 22 11\" />",
  "coins": "<circle cx=\"8\" cy=\"8\" r=\"6\" /><path d=\"M18.09 10.37A6 6 0 1 1 10.34 18\" /><path d=\"M7 6h1v4\" /><path d=\"m16.71 13.88.7.71-2.82 2.82\" />",
  "landmark": "<line x1=\"3\" x2=\"21\" y1=\"22\" y2=\"22\" /><line x1=\"6\" x2=\"6\" y1=\"18\" y2=\"11\" /><line x1=\"10\" x2=\"10\" y1=\"18\" y2=\"11\" /><line x1=\"14\" x2=\"14\" y1=\"18\" y2=\"11\" /><line x1=\"18\" x2=\"18\" y1=\"18\" y2=\"11\" /><polygon points=\"12 2 20 7 4 7\" />",
  "bug": "<path d=\"m8 2 1.88 1.88\" /><path d=\"M14.12 3.88 16 2\" /><path d=\"M9 7.13v-1a3.003 3.003 0 1 1 6 0v1\" /><path d=\"M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6\" /><path d=\"M12 20v-9\" /><path d=\"M6.53 9C4.6 8.8 3 7.1 3 5\" /><path d=\"M6 13H2\" /><path d=\"M3 21c0-2.1 1.7-3.9 3.8-4\" /><path d=\"M20.97 5c0 2.1-1.6 3.8-3.5 4\" /><path d=\"M22 13h-4\" /><path d=\"M17.2 17c2.1.1 3.8 1.9 3.8 4\" />",
  "mail": "<rect width=\"20\" height=\"16\" x=\"2\" y=\"4\" rx=\"2\" /><path d=\"m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7\" />",
  "send": "<path d=\"M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z\" /><path d=\"m21.854 2.147-10.94 10.939\" />",
  "refresh-cw": "<path d=\"M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8\" /><path d=\"M21 3v5h-5\" /><path d=\"M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16\" /><path d=\"M8 16H3v5\" />",
  "eye": "<path d=\"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0\" /><circle cx=\"12\" cy=\"12\" r=\"3\" />",
  "link": "<path d=\"M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71\" /><path d=\"M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71\" />"
};
Object.assign(__ds_scope, { ICON_PATHS });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/iconPaths.js", error: String((e && e.message) || e) }); }

// components/core/Icon.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Icon({
  name,
  size = 20,
  strokeWidth = 1.5,
  title,
  style,
  className = '',
  ...rest
}) {
  const inner = __ds_scope.ICON_PATHS[name];
  if (!inner) return null;
  return /*#__PURE__*/React.createElement("svg", _extends({
    xmlns: "http://www.w3.org/2000/svg",
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: strokeWidth,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": title ? undefined : true,
    role: title ? 'img' : undefined,
    "aria-label": title,
    className: className,
    style: {
      flexShrink: 0,
      display: 'block',
      ...style
    },
    dangerouslySetInnerHTML: {
      __html: (title ? '<title>' + title + '</title>' : '') + inner
    }
  }, rest));
}
const ICON_NAMES = Object.keys(__ds_scope.ICON_PATHS);
Object.assign(__ds_scope, { Icon, ICON_NAMES });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Icon.jsx", error: String((e && e.message) || e) }); }

// components/core/Tag.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const TAG_VARIANTS = {
  inverse: {
    background: 'var(--surface-inverse)',
    color: 'var(--text-inverse)'
  },
  accent: {
    background: 'var(--surface-accent)',
    color: 'var(--white)'
  },
  subtle: {
    background: 'var(--surface-3)',
    color: 'var(--text-secondary)'
  },
  outline: {
    background: 'transparent',
    color: 'var(--text-secondary)',
    boxShadow: 'inset 0 0 0 1px var(--border-default)'
  }
};
function Tag({
  variant = 'inverse',
  size = 'md',
  uppercase = false,
  icon,
  children,
  style,
  ...rest
}) {
  const fs = size === 'sm' ? 11 : 12;
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      fontFamily: 'var(--font-mono)',
      fontSize: fs,
      lineHeight: 1,
      letterSpacing: uppercase ? 'var(--tracking-caps)' : 'var(--tracking-mono)',
      textTransform: uppercase ? 'uppercase' : 'none',
      padding: size === 'sm' ? '3px 5px' : '5px 7px',
      borderRadius: 'var(--radius-xs)',
      whiteSpace: 'nowrap',
      flexShrink: 0,
      alignSelf: 'flex-start',
      width: 'fit-content',
      ...TAG_VARIANTS[variant],
      ...style
    }
  }, rest), icon && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: fs + 1,
    strokeWidth: 1.75
  }), children);
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Tag.jsx", error: String((e && e.message) || e) }); }

// components/core/injectStyles.js
try { (() => {
// Injects a component's stylesheet once per document. Classes are prefixed "lm-".
function injectStyles(id, css) {
  if (typeof document === 'undefined') return;
  if (document.getElementById(id)) return;
  const el = document.createElement('style');
  el.id = id;
  el.textContent = css;
  document.head.appendChild(el);
}
Object.assign(__ds_scope, { injectStyles });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/injectStyles.js", error: String((e && e.message) || e) }); }

// components/core/ArrowLink.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
__ds_scope.injectStyles('lm-arrowlink', `
.lm-al{flex-shrink:0;white-space:nowrap;width:fit-content;display:inline-flex;align-items:center;gap:8px;font-family:var(--font-sans);font-size:14px;color:var(--text-primary);text-decoration:none;min-height:28px;cursor:pointer;background:none;border:0;padding:0}
.lm-al:hover{color:var(--text-primary);text-decoration:none}
.lm-al__box{width:20px;height:20px;display:inline-flex;align-items:center;justify-content:center;background:var(--surface-accent);color:var(--white);border-radius:var(--radius-xs);transition:box-shadow var(--duration-base) var(--ease-out),transform var(--duration-base) var(--ease-out)}
.lm-al:hover .lm-al__box{box-shadow:var(--glow-sm)}
.lm-al:hover .lm-al__label{text-decoration:underline;text-underline-offset:3px}
.lm-al--inverse .lm-al__box{background:var(--surface-inverse);color:var(--text-inverse)}
.lm-al--accent{color:var(--text-accent)}.lm-al--accent:hover{color:var(--text-link-hover)}
.lm-al--accent .lm-al__box{background:transparent;color:inherit;width:auto}
`);
function ArrowLink({
  href,
  icon = 'arrow-right',
  tone = 'default',
  children,
  className = '',
  ...rest
}) {
  const Tag = href ? 'a' : 'button';
  return /*#__PURE__*/React.createElement(Tag, _extends({
    href: href,
    className: ['lm-al', 'lm-al--' + tone, className].join(' ')
  }, rest), /*#__PURE__*/React.createElement("span", {
    className: "lm-al__box"
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 14,
    strokeWidth: 1.75
  })), /*#__PURE__*/React.createElement("span", {
    className: "lm-al__label"
  }, children));
}
Object.assign(__ds_scope, { ArrowLink });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/ArrowLink.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
__ds_scope.injectStyles('lm-button', `
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
function Button({
  variant = 'primary',
  size = 'md',
  iconLeft,
  iconRight,
  fullWidth = false,
  loading = false,
  disabled = false,
  href,
  type = 'button',
  children,
  className = '',
  ...rest
}) {
  const cls = ['lm-btn', 'lm-btn--' + variant, 'lm-btn--' + size, fullWidth && 'lm-btn--full', className].filter(Boolean).join(' ');
  const iconSize = size === 'lg' ? 18 : 16;
  const content = /*#__PURE__*/React.createElement(React.Fragment, null, loading ? /*#__PURE__*/React.createElement("span", {
    className: "lm-btn__spin",
    "aria-hidden": "true"
  }) : iconLeft && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: iconLeft,
    size: iconSize
  }), children, iconRight && !loading && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: iconRight,
    size: iconSize
  }));
  if (href) {
    return /*#__PURE__*/React.createElement("a", _extends({
      href: disabled ? undefined : href,
      className: cls,
      "aria-disabled": disabled || undefined
    }, rest), content);
  }
  return /*#__PURE__*/React.createElement("button", _extends({
    type: type,
    className: cls,
    disabled: disabled || loading,
    "aria-busy": loading || undefined
  }, rest), content);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
__ds_scope.injectStyles('lm-iconbutton', `
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
function IconButton({
  icon,
  label,
  variant = 'solid',
  size = 'md',
  type = 'button',
  className = '',
  ...rest
}) {
  const iconSize = size === 'xs' ? 14 : size === 'sm' ? 16 : size === 'lg' ? 22 : 20;
  return /*#__PURE__*/React.createElement("button", _extends({
    type: type,
    "aria-label": label,
    title: label,
    className: ['lm-ib', 'lm-ib--' + variant, 'lm-ib--' + size, className].join(' ')
  }, rest), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: iconSize
  }));
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/data/DataTable.jsx
try { (() => {
__ds_scope.injectStyles('lm-datatable', `
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
function DataTable({
  columns = [],
  rows = [],
  rowKey = 'id',
  onRowClick,
  sortable = true,
  defaultSort,
  empty = 'No results',
  className = '',
  style
}) {
  const [sort, setSort] = React.useState(defaultSort || null);
  const sorted = React.useMemo(() => {
    if (!sort) return rows;
    const col = columns.find(c => c.key === sort.key);
    const get = col && col.sortValue ? col.sortValue : r => r[sort.key];
    return [...rows].sort((a, b) => {
      const x = get(a),
        y = get(b);
      return (x > y ? 1 : x < y ? -1 : 0) * (sort.dir === 'desc' ? -1 : 1);
    });
  }, [rows, sort, columns]);
  const toggle = key => setSort(s => s && s.key === key ? {
    key,
    dir: s.dir === 'asc' ? 'desc' : 'asc'
  } : {
    key,
    dir: 'desc'
  });
  const cell = (c, r) => c.render ? c.render(r) : r[c.key];
  const primary = columns.find(c => c.primary) || columns[0];
  const rest = columns.filter(c => c !== primary);
  const sortCols = sortable ? columns.filter(c => c.sortable !== false) : [];
  const cls = ['lm-dt', onRowClick && 'lm-dt--click', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("div", {
    className: cls,
    style: style
  }, sortCols.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "lm-dt__sort"
  }, /*#__PURE__*/React.createElement("span", {
    className: "lm-dt__k"
  }, rows.length, " items"), /*#__PURE__*/React.createElement("select", {
    "aria-label": "Sort by",
    value: sort ? sort.key + ':' + sort.dir : '',
    onChange: e => {
      const [key, dir] = e.target.value.split(':');
      setSort(key ? {
        key,
        dir
      } : null);
    }
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "Sort: default"), sortCols.map(c => [/*#__PURE__*/React.createElement("option", {
    key: c.key + 'd',
    value: c.key + ':desc'
  }, c.header, " \u2193"), /*#__PURE__*/React.createElement("option", {
    key: c.key + 'a',
    value: c.key + ':asc'
  }, c.header, " \u2191")]))), /*#__PURE__*/React.createElement("div", {
    className: "lm-dt__wrap"
  }, /*#__PURE__*/React.createElement("table", null, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, columns.map(c => {
    const canSort = sortable && c.sortable !== false;
    const active = sort && sort.key === c.key;
    return /*#__PURE__*/React.createElement("th", {
      key: c.key,
      className: c.align === 'right' ? 'lm-dt--right' : '',
      style: {
        width: c.width
      },
      "aria-sort": active ? sort.dir === 'asc' ? 'ascending' : 'descending' : undefined
    }, canSort ? /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: () => toggle(c.key),
      style: {
        color: active ? 'var(--text-primary)' : undefined
      }
    }, c.header, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
      name: active && sort.dir === 'asc' ? 'arrow-up' : 'arrow-down',
      size: 12,
      style: {
        opacity: active ? 1 : 0.35
      }
    })) : c.header);
  }))), /*#__PURE__*/React.createElement("tbody", null, sorted.length === 0 ? /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    colSpan: columns.length,
    className: "lm-dt__empty"
  }, empty)) : sorted.map((r, i) => /*#__PURE__*/React.createElement("tr", {
    key: r[rowKey] ?? i,
    onClick: onRowClick ? () => onRowClick(r) : undefined
  }, columns.map(c => /*#__PURE__*/React.createElement("td", {
    key: c.key,
    className: [c.mono && 'lm-dt--mono', c.align === 'right' && 'lm-dt--right'].filter(Boolean).join(' ')
  }, cell(c, r)))))))), /*#__PURE__*/React.createElement("ul", {
    className: "lm-dt__cards"
  }, sorted.length === 0 ? /*#__PURE__*/React.createElement("li", {
    className: "lm-dt__empty"
  }, empty) : sorted.map((r, i) => /*#__PURE__*/React.createElement("li", {
    key: r[rowKey] ?? i,
    className: "lm-dt__card",
    onClick: onRowClick ? () => onRowClick(r) : undefined,
    tabIndex: onRowClick ? 0 : undefined
  }, /*#__PURE__*/React.createElement("div", {
    className: "lm-dt__ctitle"
  }, /*#__PURE__*/React.createElement("span", null, cell(primary, r)), onRowClick && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "chevron-right",
    size: 16,
    style: {
      color: 'var(--text-tertiary)'
    }
  })), rest.map(c => /*#__PURE__*/React.createElement("div", {
    key: c.key,
    className: "lm-dt__row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "lm-dt__k"
  }, c.header), /*#__PURE__*/React.createElement("span", {
    className: 'lm-dt__v' + (c.mono ? ' lm-dt--mono' : '')
  }, cell(c, r))))))));
}
Object.assign(__ds_scope, { DataTable });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/DataTable.jsx", error: String((e && e.message) || e) }); }

// components/data/ValueTag.jsx
try { (() => {
const VT = {
  dark: {
    background: 'var(--black)',
    color: 'var(--white)',
    boxShadow: '0 0 0 1px var(--border-default)'
  },
  light: {
    background: 'var(--white)',
    color: 'var(--black)'
  },
  accent: {
    background: 'var(--blue-600)',
    color: 'var(--white)'
  }
};
function ValueTag({
  value,
  direction = 'up',
  variant = 'dark',
  style
}) {
  const arrowColor = direction === 'down' ? 'var(--red-400)' : variant === 'accent' ? 'var(--white)' : 'var(--blue-500)';
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      height: 24,
      padding: '0 8px',
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      letterSpacing: '0.02em',
      fontVariantNumeric: 'tabular-nums',
      borderRadius: 'var(--radius-xs)',
      whiteSpace: 'nowrap',
      ...VT[variant],
      ...style
    }
  }, direction && direction !== 'none' && /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      color: arrowColor,
      fontSize: 10
    }
  }, direction === 'down' ? '▼' : '▲'), /*#__PURE__*/React.createElement("span", null, value));
}
Object.assign(__ds_scope, { ValueTag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/ValueTag.jsx", error: String((e && e.message) || e) }); }

// components/data/BarChart.jsx
try { (() => {
__ds_scope.injectStyles('lm-barchart', `
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
function BarChart({
  data = [],
  height = 240,
  gap = 2,
  highlight = 'max',
  format = v => String(v),
  yTicks = 4,
  xLabels,
  fill = 'gradient',
  label = 'Bar chart',
  style
}) {
  const [hover, setHover] = React.useState(null);
  const max = Math.max(1, ...data.map(d => d.value));
  const niceMax = (() => {
    const p = Math.pow(10, Math.floor(Math.log10(max)));
    return Math.ceil(max / p) * p;
  })();
  const hiIdx = highlight === 'max' ? data.findIndex(d => d.value === max) : typeof highlight === 'number' ? highlight : null;
  const on = hover ?? hiIdx;
  const ticks = Array.from({
    length: yTicks + 1
  }, (_, i) => niceMax * (yTicks - i) / yTicks);
  const bg = fill === 'solid' ? 'var(--blue-500)' : 'var(--gradient-column)';
  const xs = xLabels || (data.length ? [data[0].label, data[Math.floor(data.length / 3)].label, data[Math.floor(2 * data.length / 3)].label, data[data.length - 1].label] : []);
  return /*#__PURE__*/React.createElement("div", {
    className: 'lm-bc' + (hover != null ? ' lm-bc--dim' : ''),
    style: style,
    role: "img",
    "aria-label": label + ': ' + data.map(d => d.label + ' ' + format(d.value)).join(', ')
  }, /*#__PURE__*/React.createElement("div", {
    className: "lm-bc__y",
    style: {
      height
    }
  }, ticks.map((t, i) => /*#__PURE__*/React.createElement("span", {
    key: i
  }, format(t)))), /*#__PURE__*/React.createElement("div", {
    className: "lm-bc__plot",
    style: {
      height,
      gap
    },
    onMouseLeave: () => setHover(null)
  }, /*#__PURE__*/React.createElement("div", {
    className: "lm-bc__grid"
  }, ticks.map((_, i) => /*#__PURE__*/React.createElement("span", {
    key: i
  }))), data.map((d, i) => {
    const h = d.value / niceMax * height;
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      className: 'lm-bc__bar' + (on === i ? ' lm-bc__bar--on' : ''),
      onMouseEnter: () => setHover(i),
      onTouchStart: () => setHover(i)
    }, /*#__PURE__*/React.createElement("div", {
      className: "lm-bc__fill",
      style: {
        height: h,
        background: bg,
        backgroundSize: '100% ' + height + 'px'
      }
    }), on === i && /*#__PURE__*/React.createElement("div", {
      className: "lm-bc__tip",
      style: {
        bottom: h
      }
    }, /*#__PURE__*/React.createElement(__ds_scope.ValueTag, {
      value: format(d.value)
    })));
  })), /*#__PURE__*/React.createElement("div", {
    className: "lm-bc__x"
  }, xs.map((x, i) => /*#__PURE__*/React.createElement("span", {
    key: i
  }, x))));
}
Object.assign(__ds_scope, { BarChart });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/BarChart.jsx", error: String((e && e.message) || e) }); }

// components/data/StatCard.jsx
try { (() => {
const SC = {
  default: {
    bg: 'var(--surface-1)',
    fg: 'var(--text-primary)',
    sub: 'var(--text-tertiary)',
    iconBg: 'var(--surface-accent)',
    iconFg: 'var(--white)',
    ring: 'var(--shadow-hairline)'
  },
  inverse: {
    bg: 'var(--surface-inverse)',
    fg: 'var(--text-inverse)',
    sub: 'var(--gray-500)',
    iconBg: 'var(--blue-500)',
    iconFg: 'var(--white)',
    ring: 'none'
  },
  accent: {
    bg: 'var(--blue-600)',
    fg: 'var(--white)',
    sub: 'var(--white)',
    iconBg: 'var(--black)',
    iconFg: 'var(--white)',
    ring: 'none'
  },
  outline: {
    bg: 'transparent',
    fg: 'var(--text-primary)',
    sub: 'var(--text-tertiary)',
    iconBg: 'var(--surface-3)',
    iconFg: 'var(--text-primary)',
    ring: 'inset 0 0 0 1px var(--border-default)'
  }
};
function StatCard({
  label,
  icon,
  value,
  caption,
  delta,
  variant = 'default',
  size = 'md',
  children,
  style
}) {
  const t = SC[variant];
  const lg = size === 'lg';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      gap: 24,
      minHeight: lg ? 280 : 180,
      padding: lg ? 'clamp(20px,2.5vw,28px)' : 20,
      background: t.bg,
      color: t.fg,
      boxShadow: t.ring,
      borderRadius: 'var(--radius-card)',
      fontFamily: 'var(--font-sans)',
      minWidth: 0,
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, icon && /*#__PURE__*/React.createElement("span", {
    style: {
      width: lg ? 32 : 24,
      height: lg ? 32 : 24,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: t.iconBg,
      color: t.iconFg,
      borderRadius: 'var(--radius-xs)',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: lg ? 18 : 14,
    strokeWidth: 1.75
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: lg ? 20 : 15,
      letterSpacing: '-0.02em',
      lineHeight: 1.2
    }
  }, label), delta && /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 'auto'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.ValueTag, {
    value: delta.value,
    direction: delta.direction || 'up',
    variant: variant === 'inverse' ? 'dark' : variant === 'accent' ? 'light' : 'dark'
  }))), children, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: lg ? 'clamp(44px, 2rem + 3vw, 64px)' : 'clamp(32px, 1.6rem + 1.5vw, 44px)',
      lineHeight: 1,
      letterSpacing: '-0.045em',
      fontVariantNumeric: 'tabular-nums'
    }
  }, value), caption && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      color: t.sub,
      marginTop: 8,
      letterSpacing: '-0.01em'
    }
  }, caption)));
}
Object.assign(__ds_scope, { StatCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/StatCard.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Badge.jsx
try { (() => {
const TONES = {
  neutral: ['var(--surface-3)', 'var(--text-secondary)', 'var(--gray-400)'],
  success: ['var(--status-success-bg)', 'var(--green-400)', 'var(--status-success)'],
  warning: ['var(--status-warning-bg)', 'var(--amber-400)', 'var(--status-warning)'],
  danger: ['var(--status-danger-bg)', 'var(--red-400)', 'var(--status-danger)'],
  info: ['var(--status-info-bg)', 'var(--blue-300)', 'var(--status-info)']
};
function Badge({
  tone = 'neutral',
  dot = true,
  children,
  style
}) {
  const [bg, fg, dc] = TONES[tone];
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      height: 22,
      padding: '0 8px',
      fontFamily: 'var(--font-sans)',
      fontSize: 12,
      fontWeight: 500,
      letterSpacing: 0,
      borderRadius: 'var(--radius-xs)',
      background: bg,
      color: fg,
      whiteSpace: 'nowrap',
      ...style
    }
  }, dot && /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      width: 6,
      height: 6,
      borderRadius: 9999,
      background: dc,
      boxShadow: tone === 'info' ? '0 0 6px var(--blue-500)' : 'none'
    }
  }), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Badge.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Dialog.jsx
try { (() => {
__ds_scope.injectStyles('lm-dialog', `
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
const WIDTHS = {
  sm: 400,
  md: 520,
  lg: 720
};
function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  dismissible = true
}) {
  const panel = React.useRef(null);
  const tid = React.useId();
  React.useEffect(() => {
    if (!open) return;
    const prev = document.activeElement;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panel.current && panel.current.focus();
    const onKey = e => {
      if (e.key === 'Escape' && dismissible) onClose && onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      prev && prev.focus && prev.focus();
    };
  }, [open]);
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    className: "lm-dlg"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lm-dlg__scrim",
    onClick: dismissible ? onClose : undefined
  }), /*#__PURE__*/React.createElement("div", {
    ref: panel,
    className: "lm-dlg__panel",
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": title ? tid : undefined,
    tabIndex: -1,
    style: {
      maxWidth: WIDTHS[size]
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "lm-dlg__handle",
    "aria-hidden": "true"
  }), (title || dismissible) && /*#__PURE__*/React.createElement("div", {
    className: "lm-dlg__head"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, title && /*#__PURE__*/React.createElement("h2", {
    id: tid,
    className: "lm-dlg__title"
  }, title), description && /*#__PURE__*/React.createElement("p", {
    className: "lm-dlg__desc"
  }, description)), dismissible && /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    icon: "x",
    label: "Close",
    variant: "ghost",
    size: "sm",
    onClick: onClose
  })), children && /*#__PURE__*/React.createElement("div", {
    className: "lm-dlg__body"
  }, children), footer && /*#__PURE__*/React.createElement("div", {
    className: "lm-dlg__foot"
  }, footer)));
}
Object.assign(__ds_scope, { Dialog });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Dialog.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Toast.jsx
try { (() => {
const TOAST_ICON = {
  neutral: ['info', 'var(--text-secondary)'],
  success: ['circle-check', 'var(--green-400)'],
  warning: ['triangle-alert', 'var(--amber-400)'],
  danger: ['circle-x', 'var(--red-400)'],
  info: ['info', 'var(--blue-400)']
};
function Toast({
  tone = 'neutral',
  title,
  description,
  action,
  onClose,
  style
}) {
  const [icon, color] = TOAST_ICON[tone];
  return /*#__PURE__*/React.createElement("div", {
    role: tone === 'danger' ? 'alert' : 'status',
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 12,
      width: '100%',
      maxWidth: 400,
      padding: '14px 12px 14px 16px',
      background: 'var(--surface-2)',
      color: 'var(--text-primary)',
      borderRadius: 'var(--radius-card)',
      boxShadow: 'var(--shadow-overlay)',
      fontFamily: 'var(--font-sans)',
      pointerEvents: 'auto',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color,
      marginTop: 1
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 18
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, title && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 500,
      letterSpacing: '-0.01em',
      lineHeight: 1.3
    }
  }, title), description && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--text-secondary)',
      lineHeight: 1.4,
      marginTop: 2
    }
  }, description), action && /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: action.onClick,
    style: {
      marginTop: 8,
      padding: 0,
      background: 'none',
      border: 0,
      cursor: 'pointer',
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      letterSpacing: 'var(--tracking-caps)',
      textTransform: 'uppercase',
      color: 'var(--text-accent)'
    }
  }, action.label)), onClose && /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    icon: "x",
    label: "Dismiss",
    variant: "ghost",
    size: "xs",
    onClick: onClose
  }));
}
Object.assign(__ds_scope, { Toast });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Toast.jsx", error: String((e && e.message) || e) }); }

// components/feedback/ToastRegion.jsx
try { (() => {
__ds_scope.injectStyles('lm-toastregion', `
.lm-toasts{position:fixed;z-index:var(--z-toast);right:24px;bottom:24px;display:flex;flex-direction:column;align-items:flex-end;gap:8px;pointer-events:none;width:min(400px,calc(100vw - 48px))}
@media (max-width:639px){.lm-toasts{left:12px;right:12px;width:auto;align-items:stretch;bottom:calc(12px + var(--lm-toast-offset,0px) + env(safe-area-inset-bottom))}}
`);
function ToastRegion({
  offsetBottom = 0,
  children,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "lm-toasts",
    "aria-live": "polite",
    style: {
      '--lm-toast-offset': offsetBottom + 'px',
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { ToastRegion });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/ToastRegion.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Tooltip.jsx
try { (() => {
__ds_scope.injectStyles('lm-tooltip', `
.lm-tt{position:relative;display:inline-flex}
.lm-tt__bubble{position:absolute;z-index:var(--z-tooltip);pointer-events:none;background:var(--surface-inverse);color:var(--text-inverse);font-family:var(--font-mono);font-size:12px;letter-spacing:.02em;line-height:1.35;padding:6px 8px;border-radius:var(--radius-xs);white-space:nowrap;max-width:260px;animation:lm-tt-in var(--duration-fast) var(--ease-out)}
.lm-tt__bubble--wrap{white-space:normal;width:max-content}
.lm-tt__bubble--top{bottom:calc(100% + 8px);left:50%;transform:translateX(-50%)}
.lm-tt__bubble--bottom{top:calc(100% + 8px);left:50%;transform:translateX(-50%)}
.lm-tt__bubble--left{right:calc(100% + 8px);top:50%;transform:translateY(-50%)}
.lm-tt__bubble--right{left:calc(100% + 8px);top:50%;transform:translateY(-50%)}
@keyframes lm-tt-in{from{opacity:0}}
`);
function Tooltip({
  content,
  side = 'top',
  delay = 250,
  wrap = false,
  children
}) {
  const [show, setShow] = React.useState(false);
  const t = React.useRef();
  const id = React.useId();
  const on = () => {
    clearTimeout(t.current);
    t.current = setTimeout(() => setShow(true), delay);
  };
  const off = () => {
    clearTimeout(t.current);
    setShow(false);
  };
  return /*#__PURE__*/React.createElement("span", {
    className: "lm-tt",
    onMouseEnter: on,
    onMouseLeave: off,
    onFocus: on,
    onBlur: off,
    "aria-describedby": show ? id : undefined
  }, children, show && /*#__PURE__*/React.createElement("span", {
    id: id,
    role: "tooltip",
    className: 'lm-tt__bubble lm-tt__bubble--' + side + (wrap ? ' lm-tt__bubble--wrap' : '')
  }, content));
}
Object.assign(__ds_scope, { Tooltip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Tooltip.jsx", error: String((e && e.message) || e) }); }

// components/forms/checkStyles.js
try { (() => {
function useCheckStyles() {
  __ds_scope.injectStyles('lm-check', `
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
Object.assign(__ds_scope, { useCheckStyles });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/checkStyles.js", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Checkbox({
  label,
  description,
  disabled,
  className = '',
  style,
  ...rest
}) {
  __ds_scope.useCheckStyles();
  return /*#__PURE__*/React.createElement("label", {
    className: ['lm-check', disabled && 'lm-check--disabled', className].filter(Boolean).join(' '),
    style: style
  }, /*#__PURE__*/React.createElement("input", _extends({
    type: "checkbox",
    className: "lm-check__input",
    disabled: disabled
  }, rest)), /*#__PURE__*/React.createElement("span", {
    className: "lm-check__box",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "check",
    size: 14,
    strokeWidth: 2.25
  })), (label || description) && /*#__PURE__*/React.createElement("span", {
    className: "lm-check__text"
  }, label && /*#__PURE__*/React.createElement("span", {
    className: "lm-check__label"
  }, label), description && /*#__PURE__*/React.createElement("span", {
    className: "lm-check__desc"
  }, description)));
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/Radio.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Radio({
  label,
  description,
  disabled,
  className = '',
  style,
  ...rest
}) {
  __ds_scope.useCheckStyles();
  return /*#__PURE__*/React.createElement("label", {
    className: ['lm-check', disabled && 'lm-check--disabled', className].filter(Boolean).join(' '),
    style: style
  }, /*#__PURE__*/React.createElement("input", _extends({
    type: "radio",
    className: "lm-check__input",
    disabled: disabled
  }, rest)), /*#__PURE__*/React.createElement("span", {
    className: "lm-check__box lm-check__box--radio",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("span", {
    className: "lm-check__dot"
  })), (label || description) && /*#__PURE__*/React.createElement("span", {
    className: "lm-check__text"
  }, label && /*#__PURE__*/React.createElement("span", {
    className: "lm-check__label"
  }, label), description && /*#__PURE__*/React.createElement("span", {
    className: "lm-check__desc"
  }, description)));
}
Object.assign(__ds_scope, { Radio });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Radio.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
function Switch({
  checked,
  defaultChecked = false,
  onChange,
  label,
  description,
  disabled,
  className = '',
  style
}) {
  __ds_scope.useCheckStyles();
  const [inner, setInner] = React.useState(defaultChecked);
  const on = checked ?? inner;
  const toggle = () => {
    if (checked === undefined) setInner(!on);
    onChange && onChange(!on);
  };
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    role: "switch",
    "aria-checked": on,
    disabled: disabled,
    onClick: toggle,
    className: 'lm-switch ' + className,
    style: style
  }, /*#__PURE__*/React.createElement("span", {
    className: "lm-switch__track"
  }, /*#__PURE__*/React.createElement("span", {
    className: "lm-switch__thumb"
  })), (label || description) && /*#__PURE__*/React.createElement("span", {
    className: "lm-check__text"
  }, label && /*#__PURE__*/React.createElement("span", {
    className: "lm-check__label"
  }, label), description && /*#__PURE__*/React.createElement("span", {
    className: "lm-check__desc"
  }, description)));
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// components/forms/fieldStyles.js
try { (() => {
function useFieldStyles() {
  __ds_scope.injectStyles('lm-field', `
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
Object.assign(__ds_scope, { useFieldStyles });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/fieldStyles.js", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Input({
  label,
  hint,
  error,
  required,
  iconLeft,
  suffix,
  size = 'md',
  multiline = false,
  rows = 4,
  disabled,
  id,
  className = '',
  style,
  ...rest
}) {
  __ds_scope.useFieldStyles();
  const autoId = React.useId();
  const fid = id || autoId;
  const describedBy = error ? fid + '-err' : hint ? fid + '-hint' : undefined;
  const ctrl = ['lm-control', 'lm-control--' + size, multiline && 'lm-control--multi', error && 'lm-control--invalid', disabled && 'lm-control--disabled'].filter(Boolean).join(' ');
  const Field = multiline ? 'textarea' : 'input';
  return /*#__PURE__*/React.createElement("div", {
    className: 'lm-field ' + className,
    style: style
  }, label && /*#__PURE__*/React.createElement("label", {
    className: "lm-field__label",
    htmlFor: fid
  }, label, required && /*#__PURE__*/React.createElement("span", {
    className: "lm-field__req",
    "aria-hidden": "true"
  }, "*")), /*#__PURE__*/React.createElement("div", {
    className: ctrl
  }, iconLeft && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: iconLeft,
    size: 18
  }), /*#__PURE__*/React.createElement(Field, _extends({
    id: fid,
    rows: multiline ? rows : undefined,
    disabled: disabled,
    required: required,
    "aria-invalid": !!error || undefined,
    "aria-describedby": describedBy
  }, rest)), suffix && /*#__PURE__*/React.createElement("span", {
    className: "lm-control__suffix"
  }, suffix)), error ? /*#__PURE__*/React.createElement("span", {
    id: fid + '-err',
    className: "lm-field__err"
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "circle-x",
    size: 14
  }), error) : hint && /*#__PURE__*/React.createElement("span", {
    id: fid + '-hint',
    className: "lm-field__hint"
  }, hint));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Select({
  label,
  hint,
  error,
  required,
  options = [],
  placeholder,
  size = 'md',
  disabled,
  id,
  className = '',
  style,
  ...rest
}) {
  __ds_scope.useFieldStyles();
  const autoId = React.useId();
  const fid = id || autoId;
  const ctrl = ['lm-control', 'lm-control--' + size, error && 'lm-control--invalid', disabled && 'lm-control--disabled'].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("div", {
    className: 'lm-field ' + className,
    style: style
  }, label && /*#__PURE__*/React.createElement("label", {
    className: "lm-field__label",
    htmlFor: fid
  }, label, required && /*#__PURE__*/React.createElement("span", {
    className: "lm-field__req",
    "aria-hidden": "true"
  }, "*")), /*#__PURE__*/React.createElement("div", {
    className: ctrl
  }, /*#__PURE__*/React.createElement("select", _extends({
    id: fid,
    disabled: disabled,
    required: required,
    "aria-invalid": !!error || undefined
  }, rest), placeholder && /*#__PURE__*/React.createElement("option", {
    value: "",
    disabled: true
  }, placeholder), options.map(o => typeof o === 'string' ? /*#__PURE__*/React.createElement("option", {
    key: o,
    value: o
  }, o) : /*#__PURE__*/React.createElement("option", {
    key: o.value,
    value: o.value
  }, o.label))), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "chevron-down",
    size: 16,
    className: "lm-control__chev"
  })), error ? /*#__PURE__*/React.createElement("span", {
    className: "lm-field__err"
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "circle-x",
    size: 14
  }), error) : hint && /*#__PURE__*/React.createElement("span", {
    className: "lm-field__hint"
  }, hint));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/navigation/BottomNav.jsx
try { (() => {
__ds_scope.injectStyles('lm-bottomnav', `
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
function BottomNav({
  items = [],
  value,
  onChange,
  position = 'fixed',
  hideOnDesktop = true,
  className = '',
  style
}) {
  const cls = ['lm-bnav', position === 'fixed' && 'lm-bnav--fixed', hideOnDesktop && 'lm-bnav--auto', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("nav", {
    className: cls,
    style: style,
    "aria-label": "Primary"
  }, items.slice(0, 5).map(it => /*#__PURE__*/React.createElement("button", {
    key: it.value,
    type: "button",
    className: "lm-bnav__item",
    "aria-current": value === it.value ? 'page' : undefined,
    onClick: () => onChange && onChange(it.value)
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: it.icon,
    size: 22
  }), /*#__PURE__*/React.createElement("span", null, it.label), it.badge != null && /*#__PURE__*/React.createElement("span", {
    className: "lm-bnav__dot"
  }, it.badge))));
}
Object.assign(__ds_scope, { BottomNav });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/BottomNav.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Navbar.jsx
try { (() => {
__ds_scope.injectStyles('lm-navbar', `
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
function Navbar({
  brand,
  brandHref = '#',
  items = [],
  cta,
  secondaryAction,
  variant = 'sticky',
  current,
  onNavigate
}) {
  const [openIdx, setOpenIdx] = React.useState(null);
  const [drawer, setDrawer] = React.useState(false);
  const [groupOpen, setGroupOpen] = React.useState(null);
  const ref = React.useRef(null);
  React.useEffect(() => {
    const onKey = e => {
      if (e.key === 'Escape') {
        setOpenIdx(null);
        setDrawer(false);
      }
    };
    const onDoc = e => {
      if (ref.current && !ref.current.contains(e.target)) setOpenIdx(null);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onDoc);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onDoc);
    };
  }, []);
  React.useEffect(() => {
    if (!drawer) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [drawer]);
  const go = (item, e) => {
    setOpenIdx(null);
    setDrawer(false);
    if (onNavigate) {
      e && e.preventDefault();
      onNavigate(item);
    }
  };
  const cls = ['lm-nav', variant === 'transparent' && 'lm-nav--transparent', variant === 'static' && 'lm-nav--static'].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("header", {
    className: cls,
    ref: ref
  }, /*#__PURE__*/React.createElement("div", {
    className: "lm-nav__bar"
  }, /*#__PURE__*/React.createElement("a", {
    href: brandHref,
    className: "lm-nav__brand",
    onClick: e => go({
      href: brandHref,
      label: 'home'
    }, e)
  }, brand || /*#__PURE__*/React.createElement(__ds_scope.Wordmark, {
    size: 22
  })), /*#__PURE__*/React.createElement("nav", {
    className: "lm-nav__links",
    "aria-label": "Main"
  }, items.map((it, i) => it.children ? /*#__PURE__*/React.createElement("div", {
    key: it.label,
    className: "lm-nav__item",
    onMouseEnter: () => setOpenIdx(i),
    onMouseLeave: () => setOpenIdx(null)
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "lm-nav__trigger",
    "aria-expanded": openIdx === i,
    "aria-current": current === it.label ? 'page' : undefined,
    onClick: () => setOpenIdx(openIdx === i ? null : i)
  }, it.label, /*#__PURE__*/React.createElement("span", {
    className: "lm-nav__chev"
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "chevron-down",
    size: 12,
    strokeWidth: 2
  }))), openIdx === i && /*#__PURE__*/React.createElement("div", {
    className: "lm-nav__panel",
    role: "menu"
  }, it.children.map(c => /*#__PURE__*/React.createElement("a", {
    key: c.label,
    href: c.href || '#',
    role: "menuitem",
    className: "lm-nav__plink",
    onClick: e => go(c, e)
  }, c.icon && /*#__PURE__*/React.createElement("span", {
    className: "lm-nav__picon"
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: c.icon,
    size: 16
  })), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("div", {
    className: "lm-nav__ptitle"
  }, c.label), c.description && /*#__PURE__*/React.createElement("div", {
    className: "lm-nav__pdesc"
  }, c.description)))))) : /*#__PURE__*/React.createElement("a", {
    key: it.label,
    href: it.href || '#',
    className: "lm-nav__trigger",
    "aria-current": current === it.label ? 'page' : undefined,
    onClick: e => go(it, e)
  }, it.label))), /*#__PURE__*/React.createElement("div", {
    className: "lm-nav__actions"
  }, secondaryAction && /*#__PURE__*/React.createElement("span", {
    className: "lm-nav__secondary"
  }, /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "ghost",
    size: "sm",
    href: secondaryAction.href,
    onClick: secondaryAction.onClick
  }, secondaryAction.label)), cta && /*#__PURE__*/React.createElement("span", {
    className: "lm-nav__cta"
  }, /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "primary",
    size: "sm",
    href: cta.href,
    onClick: cta.onClick
  }, cta.label)), /*#__PURE__*/React.createElement("span", {
    className: "lm-nav__menu"
  }, /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    icon: drawer ? 'x' : 'menu',
    label: drawer ? 'Close menu' : 'Open menu',
    size: "sm",
    "aria-expanded": drawer,
    onClick: () => setDrawer(!drawer)
  })))), drawer && /*#__PURE__*/React.createElement("div", {
    className: "lm-nav__drawer"
  }, items.map((it, i) => /*#__PURE__*/React.createElement("div", {
    key: it.label,
    className: "lm-nav__group"
  }, it.children ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "lm-nav__gbtn",
    "aria-expanded": groupOpen === i,
    onClick: () => setGroupOpen(groupOpen === i ? null : i)
  }, it.label, /*#__PURE__*/React.createElement("span", {
    className: "lm-nav__chev",
    style: {
      width: 24,
      height: 24
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: groupOpen === i ? 'minus' : 'plus',
    size: 14
  }))), groupOpen === i && /*#__PURE__*/React.createElement("div", {
    className: "lm-nav__glist"
  }, it.children.map(c => /*#__PURE__*/React.createElement("a", {
    key: c.label,
    href: c.href || '#',
    className: "lm-nav__glink",
    onClick: e => go(c, e)
  }, c.label)))) : /*#__PURE__*/React.createElement("a", {
    href: it.href || '#',
    className: "lm-nav__gbtn",
    onClick: e => go(it, e)
  }, it.label, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "arrow-right",
    size: 18
  })))), /*#__PURE__*/React.createElement("div", {
    className: "lm-nav__dfoot"
  }, cta && /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "primary",
    size: "lg",
    fullWidth: true,
    href: cta.href,
    onClick: cta.onClick
  }, cta.label), secondaryAction && /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "secondary",
    size: "lg",
    fullWidth: true,
    href: secondaryAction.href,
    onClick: secondaryAction.onClick
  }, secondaryAction.label))));
}
Object.assign(__ds_scope, { Navbar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Navbar.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Sidebar.jsx
try { (() => {
__ds_scope.injectStyles('lm-sidebar', `
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
function Sidebar({
  header,
  items = [],
  value,
  onChange,
  footer,
  className = '',
  style
}) {
  return /*#__PURE__*/React.createElement("aside", {
    className: 'lm-side ' + className,
    style: style
  }, header && /*#__PURE__*/React.createElement("div", {
    className: "lm-side__head"
  }, header), /*#__PURE__*/React.createElement("nav", {
    className: "lm-side__nav",
    "aria-label": "Sections"
  }, items.map((it, i) => it.section ? /*#__PURE__*/React.createElement("div", {
    key: 's' + i,
    className: "lm-side__section"
  }, it.section) : /*#__PURE__*/React.createElement("button", {
    key: it.value,
    type: "button",
    className: "lm-side__item",
    "aria-current": value === it.value ? 'page' : undefined,
    onClick: () => onChange && onChange(it.value)
  }, it.icon && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: it.icon,
    size: 18
  }), /*#__PURE__*/React.createElement("span", null, it.label), it.badge != null && /*#__PURE__*/React.createElement("span", {
    className: "lm-side__badge"
  }, it.badge)))), footer && /*#__PURE__*/React.createElement("div", {
    className: "lm-side__foot"
  }, footer));
}
Object.assign(__ds_scope, { Sidebar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Sidebar.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Tabs.jsx
try { (() => {
__ds_scope.injectStyles('lm-tabs', `
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
function Tabs({
  items = [],
  value,
  defaultValue,
  onChange,
  variant = 'text',
  fullWidth = false,
  label,
  className = '',
  style
}) {
  const norm = items.map(it => typeof it === 'string' ? {
    value: it,
    label: it
  } : it);
  const [inner, setInner] = React.useState(defaultValue ?? (norm[0] && norm[0].value));
  const active = value ?? inner;
  const refs = React.useRef([]);
  const select = v => {
    if (value === undefined) setInner(v);
    onChange && onChange(v);
  };
  const onKey = (e, i) => {
    const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const n = (i + d + norm.length) % norm.length;
    select(norm[n].value);
    refs.current[n] && refs.current[n].focus();
  };
  return /*#__PURE__*/React.createElement("div", {
    role: "tablist",
    "aria-label": label,
    className: ['lm-tabs', 'lm-tabs--' + variant, fullWidth && 'lm-tabs--full', className].filter(Boolean).join(' '),
    style: style
  }, norm.map((it, i) => /*#__PURE__*/React.createElement("button", {
    key: it.value,
    ref: el => refs.current[i] = el,
    type: "button",
    role: "tab",
    "aria-selected": active === it.value,
    tabIndex: active === it.value ? 0 : -1,
    className: "lm-tab",
    onClick: () => select(it.value),
    onKeyDown: e => onKey(e, i)
  }, it.label, it.count != null && /*#__PURE__*/React.createElement("span", {
    className: "lm-tab__count"
  }, it.count))));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Tabs.jsx", error: String((e && e.message) || e) }); }

// components/surfaces/Accordion.jsx
try { (() => {
__ds_scope.injectStyles('lm-accordion', `
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
function Accordion({
  items = [],
  type = 'single',
  defaultOpen = [],
  variant = 'filled',
  numbered = false,
  accentOpen = false,
  className = '',
  style
}) {
  const [open, setOpen] = React.useState(() => new Set(defaultOpen));
  const baseId = React.useId();
  const toggle = id => setOpen(prev => {
    const next = new Set(type === 'single' ? [] : prev);
    if (!prev.has(id)) next.add(id);
    return next;
  });
  return /*#__PURE__*/React.createElement("div", {
    className: ['lm-acc', 'lm-acc--' + variant, numbered && 'lm-acc--numbered', className].filter(Boolean).join(' '),
    style: style
  }, items.map((it, i) => {
    const id = it.id ?? String(i);
    const isOpen = open.has(id);
    const hid = baseId + '-h' + i,
      pid = baseId + '-p' + i;
    return /*#__PURE__*/React.createElement("div", {
      key: id,
      className: ['lm-acc__item', isOpen && accentOpen && 'lm-acc__item--accent'].filter(Boolean).join(' ')
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      id: hid,
      className: "lm-acc__head",
      "aria-expanded": isOpen,
      "aria-controls": pid,
      onClick: () => toggle(id)
    }, numbered && /*#__PURE__*/React.createElement(__ds_scope.IndexBadge, {
      value: i + 1,
      variant: isOpen && accentOpen ? 'inverse' : 'outline'
    }), /*#__PURE__*/React.createElement("span", {
      className: "lm-acc__title"
    }, it.title), it.meta && /*#__PURE__*/React.createElement("span", {
      className: "lm-acc__meta"
    }, it.meta), /*#__PURE__*/React.createElement("span", {
      className: "lm-acc__toggle",
      "aria-hidden": "true"
    }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
      name: isOpen ? 'minus' : 'plus',
      size: 14,
      strokeWidth: 2
    }))), /*#__PURE__*/React.createElement("div", {
      id: pid,
      role: "region",
      "aria-labelledby": hid,
      className: 'lm-acc__panel' + (isOpen ? ' lm-acc__panel--open' : '')
    }, /*#__PURE__*/React.createElement("div", {
      className: "lm-acc__inner"
    }, /*#__PURE__*/React.createElement("div", {
      className: "lm-acc__body"
    }, it.content))));
  }));
}
Object.assign(__ds_scope, { Accordion });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/surfaces/Accordion.jsx", error: String((e && e.message) || e) }); }

// components/surfaces/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
__ds_scope.injectStyles('lm-card', `
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
function Card({
  variant = 'default',
  padding = 'md',
  interactive,
  href,
  as,
  onClick,
  children,
  className = '',
  style,
  ...rest
}) {
  const isInteractive = interactive ?? !!(href || onClick);
  const Tag = as || (href ? 'a' : 'div');
  const cls = ['lm-card', 'lm-card--' + variant, 'lm-card--p-' + padding, isInteractive && 'lm-card--interactive', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement(Tag, _extends({
    href: href,
    onClick: onClick,
    className: cls,
    style: style,
    tabIndex: isInteractive && !href ? 0 : undefined
  }, rest), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/surfaces/Card.jsx", error: String((e && e.message) || e) }); }

// components/surfaces/Glow.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
__ds_scope.injectStyles('lm-glow', `
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
function Glow({
  variant = 'horizon',
  grain = true,
  as = 'div',
  minHeight,
  children,
  className = '',
  style,
  ...rest
}) {
  const Tag = as;
  return /*#__PURE__*/React.createElement(Tag, _extends({
    className: ['lm-glow', 'lm-glow--' + variant, className].join(' '),
    style: {
      minHeight,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    className: "lm-glow__layer",
    "aria-hidden": "true"
  }), variant === 'columns' && /*#__PURE__*/React.createElement("span", {
    className: "lm-glow__dots",
    "aria-hidden": "true"
  }), grain && /*#__PURE__*/React.createElement("span", {
    className: "lm-glow__grain",
    "aria-hidden": "true"
  }), children);
}
Object.assign(__ds_scope, { Glow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/surfaces/Glow.jsx", error: String((e && e.message) || e) }); }

// scratch/dev-bundle.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// DEV-ONLY fallback used when _ds_bundle.js has not been compiled yet. Regenerated from components/**. Do not edit.
(function () {
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
  const ICON_PATHS = {
    "arrow-right": "<path d=\"M5 12h14\" /><path d=\"m12 5 7 7-7 7\" />",
    "arrow-left": "<path d=\"m12 19-7-7 7-7\" /><path d=\"M19 12H5\" />",
    "arrow-up": "<path d=\"m5 12 7-7 7 7\" /><path d=\"M12 19V5\" />",
    "arrow-down": "<path d=\"M12 5v14\" /><path d=\"m19 12-7 7-7-7\" />",
    "arrow-up-right": "<path d=\"M7 7h10v10\" /><path d=\"M7 17 17 7\" />",
    "chevron-down": "<path d=\"m6 9 6 6 6-6\" />",
    "chevron-up": "<path d=\"m18 15-6-6-6 6\" />",
    "chevron-left": "<path d=\"m15 18-6-6 6-6\" />",
    "chevron-right": "<path d=\"m9 18 6-6-6-6\" />",
    "plus": "<path d=\"M5 12h14\" /><path d=\"M12 5v14\" />",
    "minus": "<path d=\"M5 12h14\" />",
    "x": "<path d=\"M18 6 6 18\" /><path d=\"m6 6 12 12\" />",
    "menu": "<line x1=\"4\" x2=\"20\" y1=\"12\" y2=\"12\" /><line x1=\"4\" x2=\"20\" y1=\"6\" y2=\"6\" /><line x1=\"4\" x2=\"20\" y1=\"18\" y2=\"18\" />",
    "search": "<circle cx=\"11\" cy=\"11\" r=\"8\" /><path d=\"m21 21-4.3-4.3\" />",
    "check": "<path d=\"M20 6 9 17l-5-5\" />",
    "play": "<polygon points=\"6 3 20 12 6 21 6 3\" />",
    "external-link": "<path d=\"M15 3h6v6\" /><path d=\"M10 14 21 3\" /><path d=\"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6\" />",
    "copy": "<rect width=\"14\" height=\"14\" x=\"8\" y=\"8\" rx=\"2\" ry=\"2\" /><path d=\"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2\" />",
    "info": "<circle cx=\"12\" cy=\"12\" r=\"10\" /><path d=\"M12 16v-4\" /><path d=\"M12 8h.01\" />",
    "triangle-alert": "<path d=\"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3\" /><path d=\"M12 9v4\" /><path d=\"M12 17h.01\" />",
    "circle-check": "<circle cx=\"12\" cy=\"12\" r=\"10\" /><path d=\"m9 12 2 2 4-4\" />",
    "circle-x": "<circle cx=\"12\" cy=\"12\" r=\"10\" /><path d=\"m15 9-6 6\" /><path d=\"m9 9 6 6\" />",
    "chart-line": "<path d=\"M3 3v16a2 2 0 0 0 2 2h16\" /><path d=\"m19 9-5 5-4-4-3 3\" />",
    "chart-bar": "<path d=\"M3 3v16a2 2 0 0 0 2 2h16\" /><path d=\"M7 16h8\" /><path d=\"M7 11h12\" /><path d=\"M7 6h3\" />",
    "chart-pie": "<path d=\"M21 12c.552 0 1.005-.449.95-.998a10 10 0 0 0-8.953-8.951c-.55-.055-.998.398-.998.95v8a1 1 0 0 0 1 1z\" /><path d=\"M21.21 15.89A10 10 0 1 1 8 2.83\" />",
    "wallet": "<path d=\"M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1\" /><path d=\"M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4\" />",
    "rocket": "<path d=\"M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z\" /><path d=\"m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z\" /><path d=\"M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0\" /><path d=\"M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5\" />",
    "infinity": "<path d=\"M12 12c-2-2.67-4-4-6-4a4 4 0 1 0 0 8c2 0 4-1.33 6-4Zm0 0c2 2.67 4 4 6 4a4 4 0 0 0 0-8c-2 0-4 1.33-6 4Z\" />",
    "file-text": "<path d=\"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z\" /><path d=\"M14 2v4a2 2 0 0 0 2 2h4\" /><path d=\"M10 9H8\" /><path d=\"M16 13H8\" /><path d=\"M16 17H8\" />",
    "book-open": "<path d=\"M12 7v14\" /><path d=\"M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z\" />",
    "code": "<polyline points=\"16 18 22 12 16 6\" /><polyline points=\"8 6 2 12 8 18\" />",
    "layers": "<path d=\"M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z\" /><path d=\"M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12\" /><path d=\"M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17\" />",
    "shield-check": "<path d=\"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z\" /><path d=\"m9 12 2 2 4-4\" />",
    "zap": "<path d=\"M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z\" />",
    "globe": "<circle cx=\"12\" cy=\"12\" r=\"10\" /><path d=\"M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20\" /><path d=\"M2 12h20\" />",
    "user": "<path d=\"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2\" /><circle cx=\"12\" cy=\"7\" r=\"4\" />",
    "settings": "<path d=\"M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z\" /><circle cx=\"12\" cy=\"12\" r=\"3\" />",
    "bell": "<path d=\"M10.268 21a2 2 0 0 0 3.464 0\" /><path d=\"M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326\" />",
    "log-out": "<path d=\"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4\" /><polyline points=\"16 17 21 12 16 7\" /><line x1=\"21\" x2=\"9\" y1=\"12\" y2=\"12\" />",
    "house": "<path d=\"M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8\" /><path d=\"M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z\" />",
    "activity": "<path d=\"M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2\" />",
    "sliders-horizontal": "<line x1=\"21\" x2=\"14\" y1=\"4\" y2=\"4\" /><line x1=\"10\" x2=\"3\" y1=\"4\" y2=\"4\" /><line x1=\"21\" x2=\"12\" y1=\"12\" y2=\"12\" /><line x1=\"8\" x2=\"3\" y1=\"12\" y2=\"12\" /><line x1=\"21\" x2=\"16\" y1=\"20\" y2=\"20\" /><line x1=\"12\" x2=\"3\" y1=\"20\" y2=\"20\" /><line x1=\"14\" x2=\"14\" y1=\"2\" y2=\"6\" /><line x1=\"8\" x2=\"8\" y1=\"10\" y2=\"14\" /><line x1=\"16\" x2=\"16\" y1=\"18\" y2=\"22\" />",
    "filter": "<polygon points=\"22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3\" />",
    "download": "<path d=\"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4\" /><polyline points=\"7 10 12 15 17 10\" /><line x1=\"12\" x2=\"12\" y1=\"15\" y2=\"3\" />",
    "calendar": "<path d=\"M8 2v4\" /><path d=\"M16 2v4\" /><rect width=\"18\" height=\"18\" x=\"3\" y=\"4\" rx=\"2\" /><path d=\"M3 10h18\" />",
    "lock": "<rect width=\"18\" height=\"11\" x=\"3\" y=\"11\" rx=\"2\" ry=\"2\" /><path d=\"M7 11V7a5 5 0 0 1 10 0v4\" />",
    "cpu": "<rect width=\"16\" height=\"16\" x=\"4\" y=\"4\" rx=\"2\" /><rect width=\"6\" height=\"6\" x=\"9\" y=\"9\" rx=\"1\" /><path d=\"M15 2v2\" /><path d=\"M15 20v2\" /><path d=\"M2 15h2\" /><path d=\"M2 9h2\" /><path d=\"M20 15h2\" /><path d=\"M20 9h2\" /><path d=\"M9 2v2\" /><path d=\"M9 20v2\" />",
    "box": "<path d=\"M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z\" /><path d=\"m3.3 7 8.7 5 8.7-5\" /><path d=\"M12 22V12\" />",
    "git-branch": "<line x1=\"6\" x2=\"6\" y1=\"3\" y2=\"15\" /><circle cx=\"18\" cy=\"6\" r=\"3\" /><circle cx=\"6\" cy=\"18\" r=\"3\" /><path d=\"M18 9a9 9 0 0 1-9 9\" />",
    "terminal": "<polyline points=\"4 17 10 11 4 5\" /><line x1=\"12\" x2=\"20\" y1=\"19\" y2=\"19\" />",
    "sun": "<circle cx=\"12\" cy=\"12\" r=\"4\" /><path d=\"M12 2v2\" /><path d=\"M12 20v2\" /><path d=\"m4.93 4.93 1.41 1.41\" /><path d=\"m17.66 17.66 1.41 1.41\" /><path d=\"M2 12h2\" /><path d=\"M20 12h2\" /><path d=\"m6.34 17.66-1.41 1.41\" /><path d=\"m19.07 4.93-1.41 1.41\" />",
    "moon": "<path d=\"M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z\" />",
    "ellipsis": "<circle cx=\"12\" cy=\"12\" r=\"1\" /><circle cx=\"19\" cy=\"12\" r=\"1\" /><circle cx=\"5\" cy=\"12\" r=\"1\" />",
    "layout-grid": "<rect width=\"7\" height=\"7\" x=\"3\" y=\"3\" rx=\"1\" /><rect width=\"7\" height=\"7\" x=\"14\" y=\"3\" rx=\"1\" /><rect width=\"7\" height=\"7\" x=\"14\" y=\"14\" rx=\"1\" /><rect width=\"7\" height=\"7\" x=\"3\" y=\"14\" rx=\"1\" />",
    "list": "<path d=\"M3 12h.01\" /><path d=\"M3 18h.01\" /><path d=\"M3 6h.01\" /><path d=\"M8 12h13\" /><path d=\"M8 18h13\" /><path d=\"M8 6h13\" />",
    "trending-up": "<polyline points=\"22 7 13.5 15.5 8.5 10.5 2 17\" /><polyline points=\"16 7 22 7 22 13\" />",
    "trending-down": "<polyline points=\"22 17 13.5 8.5 8.5 13.5 2 7\" /><polyline points=\"16 17 22 17 22 11\" />",
    "coins": "<circle cx=\"8\" cy=\"8\" r=\"6\" /><path d=\"M18.09 10.37A6 6 0 1 1 10.34 18\" /><path d=\"M7 6h1v4\" /><path d=\"m16.71 13.88.7.71-2.82 2.82\" />",
    "landmark": "<line x1=\"3\" x2=\"21\" y1=\"22\" y2=\"22\" /><line x1=\"6\" x2=\"6\" y1=\"18\" y2=\"11\" /><line x1=\"10\" x2=\"10\" y1=\"18\" y2=\"11\" /><line x1=\"14\" x2=\"14\" y1=\"18\" y2=\"11\" /><line x1=\"18\" x2=\"18\" y1=\"18\" y2=\"11\" /><polygon points=\"12 2 20 7 4 7\" />",
    "bug": "<path d=\"m8 2 1.88 1.88\" /><path d=\"M14.12 3.88 16 2\" /><path d=\"M9 7.13v-1a3.003 3.003 0 1 1 6 0v1\" /><path d=\"M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6\" /><path d=\"M12 20v-9\" /><path d=\"M6.53 9C4.6 8.8 3 7.1 3 5\" /><path d=\"M6 13H2\" /><path d=\"M3 21c0-2.1 1.7-3.9 3.8-4\" /><path d=\"M20.97 5c0 2.1-1.6 3.8-3.5 4\" /><path d=\"M22 13h-4\" /><path d=\"M17.2 17c2.1.1 3.8 1.9 3.8 4\" />",
    "mail": "<rect width=\"20\" height=\"16\" x=\"2\" y=\"4\" rx=\"2\" /><path d=\"m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7\" />",
    "send": "<path d=\"M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z\" /><path d=\"m21.854 2.147-10.94 10.939\" />",
    "refresh-cw": "<path d=\"M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8\" /><path d=\"M21 3v5h-5\" /><path d=\"M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16\" /><path d=\"M8 16H3v5\" />",
    "eye": "<path d=\"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0\" /><circle cx=\"12\" cy=\"12\" r=\"3\" />",
    "link": "<path d=\"M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71\" /><path d=\"M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71\" />"
  };

  // ---- core/Icon.jsx

  function Icon({
    name,
    size = 20,
    strokeWidth = 1.5,
    title,
    style,
    className = '',
    ...rest
  }) {
    const inner = ICON_PATHS[name];
    if (!inner) return null;
    return /*#__PURE__*/React.createElement("svg", _extends({
      xmlns: "http://www.w3.org/2000/svg",
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: strokeWidth,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      "aria-hidden": title ? undefined : true,
      role: title ? 'img' : undefined,
      "aria-label": title,
      className: className,
      style: {
        flexShrink: 0,
        display: 'block',
        ...style
      },
      dangerouslySetInnerHTML: {
        __html: (title ? '<title>' + title + '</title>' : '') + inner
      }
    }, rest));
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
  function Button({
    variant = 'primary',
    size = 'md',
    iconLeft,
    iconRight,
    fullWidth = false,
    loading = false,
    disabled = false,
    href,
    type = 'button',
    children,
    className = '',
    ...rest
  }) {
    const cls = ['lm-btn', 'lm-btn--' + variant, 'lm-btn--' + size, fullWidth && 'lm-btn--full', className].filter(Boolean).join(' ');
    const iconSize = size === 'lg' ? 18 : 16;
    const content = /*#__PURE__*/React.createElement(React.Fragment, null, loading ? /*#__PURE__*/React.createElement("span", {
      className: "lm-btn__spin",
      "aria-hidden": "true"
    }) : iconLeft && /*#__PURE__*/React.createElement(Icon, {
      name: iconLeft,
      size: iconSize
    }), children, iconRight && !loading && /*#__PURE__*/React.createElement(Icon, {
      name: iconRight,
      size: iconSize
    }));
    if (href) {
      return /*#__PURE__*/React.createElement("a", _extends({
        href: disabled ? undefined : href,
        className: cls,
        "aria-disabled": disabled || undefined
      }, rest), content);
    }
    return /*#__PURE__*/React.createElement("button", _extends({
      type: type,
      className: cls,
      disabled: disabled || loading,
      "aria-busy": loading || undefined
    }, rest), content);
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
  function IconButton({
    icon,
    label,
    variant = 'solid',
    size = 'md',
    type = 'button',
    className = '',
    ...rest
  }) {
    const iconSize = size === 'xs' ? 14 : size === 'sm' ? 16 : size === 'lg' ? 22 : 20;
    return /*#__PURE__*/React.createElement("button", _extends({
      type: type,
      "aria-label": label,
      title: label,
      className: ['lm-ib', 'lm-ib--' + variant, 'lm-ib--' + size, className].join(' ')
    }, rest), /*#__PURE__*/React.createElement(Icon, {
      name: icon,
      size: iconSize
    }));
  }

  // ---- core/Tag.jsx

  const TAG_VARIANTS = {
    inverse: {
      background: 'var(--surface-inverse)',
      color: 'var(--text-inverse)'
    },
    accent: {
      background: 'var(--surface-accent)',
      color: 'var(--white)'
    },
    subtle: {
      background: 'var(--surface-3)',
      color: 'var(--text-secondary)'
    },
    outline: {
      background: 'transparent',
      color: 'var(--text-secondary)',
      boxShadow: 'inset 0 0 0 1px var(--border-default)'
    }
  };
  function Tag({
    variant = 'inverse',
    size = 'md',
    uppercase = false,
    icon,
    children,
    style,
    ...rest
  }) {
    const fs = size === 'sm' ? 11 : 12;
    return /*#__PURE__*/React.createElement("span", _extends({
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        fontFamily: 'var(--font-mono)',
        fontSize: fs,
        lineHeight: 1,
        letterSpacing: uppercase ? 'var(--tracking-caps)' : 'var(--tracking-mono)',
        textTransform: uppercase ? 'uppercase' : 'none',
        padding: size === 'sm' ? '3px 5px' : '5px 7px',
        borderRadius: 'var(--radius-xs)',
        whiteSpace: 'nowrap',
        flexShrink: 0,
        alignSelf: 'flex-start',
        width: 'fit-content',
        ...TAG_VARIANTS[variant],
        ...style
      }
    }, rest), icon && /*#__PURE__*/React.createElement(Icon, {
      name: icon,
      size: fs + 1,
      strokeWidth: 1.75
    }), children);
  }

  // ---- core/IndexBadge.jsx

  const IDX_VARIANTS = {
    outline: {
      color: 'var(--text-primary)',
      boxShadow: 'inset 0 0 0 1px var(--border-strong)',
      background: 'transparent'
    },
    solid: {
      color: 'var(--white)',
      background: 'var(--surface-accent)'
    },
    inverse: {
      color: 'var(--text-inverse)',
      background: 'var(--surface-inverse)'
    }
  };
  function IndexBadge({
    value,
    variant = 'outline',
    size = 'md',
    style
  }) {
    const s = size === 'sm' ? 18 : size === 'lg' ? 28 : 22;
    return /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: s,
        height: s,
        flexShrink: 0,
        fontFamily: 'var(--font-mono)',
        fontSize: size === 'lg' ? 13 : 11,
        lineHeight: 1,
        borderRadius: 'var(--radius-xs)',
        fontVariantNumeric: 'tabular-nums',
        ...IDX_VARIANTS[variant],
        ...style
      }
    }, value);
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
  function ArrowLink({
    href,
    icon = 'arrow-right',
    tone = 'default',
    children,
    className = '',
    ...rest
  }) {
    const Tag = href ? 'a' : 'button';
    return /*#__PURE__*/React.createElement(Tag, _extends({
      href: href,
      className: ['lm-al', 'lm-al--' + tone, className].join(' ')
    }, rest), /*#__PURE__*/React.createElement("span", {
      className: "lm-al__box"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: icon,
      size: 14,
      strokeWidth: 1.75
    })), /*#__PURE__*/React.createElement("span", {
      className: "lm-al__label"
    }, children));
  }

  // ---- core/Wordmark.jsx

  function Wordmark({
    name = 'Lumen',
    size = 24,
    color = 'currentColor',
    style
  }) {
    return /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-display)',
        fontSize: size,
        lineHeight: 1,
        letterSpacing: '-0.05em',
        fontWeight: 400,
        color,
        whiteSpace: 'nowrap',
        ...style
      }
    }, name);
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

  function Input({
    label,
    hint,
    error,
    required,
    iconLeft,
    suffix,
    size = 'md',
    multiline = false,
    rows = 4,
    disabled,
    id,
    className = '',
    style,
    ...rest
  }) {
    useFieldStyles();
    const autoId = React.useId();
    const fid = id || autoId;
    const describedBy = error ? fid + '-err' : hint ? fid + '-hint' : undefined;
    const ctrl = ['lm-control', 'lm-control--' + size, multiline && 'lm-control--multi', error && 'lm-control--invalid', disabled && 'lm-control--disabled'].filter(Boolean).join(' ');
    const Field = multiline ? 'textarea' : 'input';
    return /*#__PURE__*/React.createElement("div", {
      className: 'lm-field ' + className,
      style: style
    }, label && /*#__PURE__*/React.createElement("label", {
      className: "lm-field__label",
      htmlFor: fid
    }, label, required && /*#__PURE__*/React.createElement("span", {
      className: "lm-field__req",
      "aria-hidden": "true"
    }, "*")), /*#__PURE__*/React.createElement("div", {
      className: ctrl
    }, iconLeft && /*#__PURE__*/React.createElement(Icon, {
      name: iconLeft,
      size: 18
    }), /*#__PURE__*/React.createElement(Field, _extends({
      id: fid,
      rows: multiline ? rows : undefined,
      disabled: disabled,
      required: required,
      "aria-invalid": !!error || undefined,
      "aria-describedby": describedBy
    }, rest)), suffix && /*#__PURE__*/React.createElement("span", {
      className: "lm-control__suffix"
    }, suffix)), error ? /*#__PURE__*/React.createElement("span", {
      id: fid + '-err',
      className: "lm-field__err"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "circle-x",
      size: 14
    }), error) : hint && /*#__PURE__*/React.createElement("span", {
      id: fid + '-hint',
      className: "lm-field__hint"
    }, hint));
  }

  // ---- forms/Select.jsx

  function Select({
    label,
    hint,
    error,
    required,
    options = [],
    placeholder,
    size = 'md',
    disabled,
    id,
    className = '',
    style,
    ...rest
  }) {
    useFieldStyles();
    const autoId = React.useId();
    const fid = id || autoId;
    const ctrl = ['lm-control', 'lm-control--' + size, error && 'lm-control--invalid', disabled && 'lm-control--disabled'].filter(Boolean).join(' ');
    return /*#__PURE__*/React.createElement("div", {
      className: 'lm-field ' + className,
      style: style
    }, label && /*#__PURE__*/React.createElement("label", {
      className: "lm-field__label",
      htmlFor: fid
    }, label, required && /*#__PURE__*/React.createElement("span", {
      className: "lm-field__req",
      "aria-hidden": "true"
    }, "*")), /*#__PURE__*/React.createElement("div", {
      className: ctrl
    }, /*#__PURE__*/React.createElement("select", _extends({
      id: fid,
      disabled: disabled,
      required: required,
      "aria-invalid": !!error || undefined
    }, rest), placeholder && /*#__PURE__*/React.createElement("option", {
      value: "",
      disabled: true
    }, placeholder), options.map(o => typeof o === 'string' ? /*#__PURE__*/React.createElement("option", {
      key: o,
      value: o
    }, o) : /*#__PURE__*/React.createElement("option", {
      key: o.value,
      value: o.value
    }, o.label))), /*#__PURE__*/React.createElement(Icon, {
      name: "chevron-down",
      size: 16,
      className: "lm-control__chev"
    })), error ? /*#__PURE__*/React.createElement("span", {
      className: "lm-field__err"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "circle-x",
      size: 14
    }), error) : hint && /*#__PURE__*/React.createElement("span", {
      className: "lm-field__hint"
    }, hint));
  }

  // ---- forms/Checkbox.jsx

  function Checkbox({
    label,
    description,
    disabled,
    className = '',
    style,
    ...rest
  }) {
    useCheckStyles();
    return /*#__PURE__*/React.createElement("label", {
      className: ['lm-check', disabled && 'lm-check--disabled', className].filter(Boolean).join(' '),
      style: style
    }, /*#__PURE__*/React.createElement("input", _extends({
      type: "checkbox",
      className: "lm-check__input",
      disabled: disabled
    }, rest)), /*#__PURE__*/React.createElement("span", {
      className: "lm-check__box",
      "aria-hidden": "true"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "check",
      size: 14,
      strokeWidth: 2.25
    })), (label || description) && /*#__PURE__*/React.createElement("span", {
      className: "lm-check__text"
    }, label && /*#__PURE__*/React.createElement("span", {
      className: "lm-check__label"
    }, label), description && /*#__PURE__*/React.createElement("span", {
      className: "lm-check__desc"
    }, description)));
  }

  // ---- forms/Radio.jsx

  function Radio({
    label,
    description,
    disabled,
    className = '',
    style,
    ...rest
  }) {
    useCheckStyles();
    return /*#__PURE__*/React.createElement("label", {
      className: ['lm-check', disabled && 'lm-check--disabled', className].filter(Boolean).join(' '),
      style: style
    }, /*#__PURE__*/React.createElement("input", _extends({
      type: "radio",
      className: "lm-check__input",
      disabled: disabled
    }, rest)), /*#__PURE__*/React.createElement("span", {
      className: "lm-check__box lm-check__box--radio",
      "aria-hidden": "true"
    }, /*#__PURE__*/React.createElement("span", {
      className: "lm-check__dot"
    })), (label || description) && /*#__PURE__*/React.createElement("span", {
      className: "lm-check__text"
    }, label && /*#__PURE__*/React.createElement("span", {
      className: "lm-check__label"
    }, label), description && /*#__PURE__*/React.createElement("span", {
      className: "lm-check__desc"
    }, description)));
  }

  // ---- forms/Switch.jsx

  function Switch({
    checked,
    defaultChecked = false,
    onChange,
    label,
    description,
    disabled,
    className = '',
    style
  }) {
    useCheckStyles();
    const [inner, setInner] = React.useState(defaultChecked);
    const on = checked ?? inner;
    const toggle = () => {
      if (checked === undefined) setInner(!on);
      onChange && onChange(!on);
    };
    return /*#__PURE__*/React.createElement("button", {
      type: "button",
      role: "switch",
      "aria-checked": on,
      disabled: disabled,
      onClick: toggle,
      className: 'lm-switch ' + className,
      style: style
    }, /*#__PURE__*/React.createElement("span", {
      className: "lm-switch__track"
    }, /*#__PURE__*/React.createElement("span", {
      className: "lm-switch__thumb"
    })), (label || description) && /*#__PURE__*/React.createElement("span", {
      className: "lm-check__text"
    }, label && /*#__PURE__*/React.createElement("span", {
      className: "lm-check__label"
    }, label), description && /*#__PURE__*/React.createElement("span", {
      className: "lm-check__desc"
    }, description)));
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
  function Navbar({
    brand,
    brandHref = '#',
    items = [],
    cta,
    secondaryAction,
    variant = 'sticky',
    current,
    onNavigate
  }) {
    const [openIdx, setOpenIdx] = React.useState(null);
    const [drawer, setDrawer] = React.useState(false);
    const [groupOpen, setGroupOpen] = React.useState(null);
    const ref = React.useRef(null);
    React.useEffect(() => {
      const onKey = e => {
        if (e.key === 'Escape') {
          setOpenIdx(null);
          setDrawer(false);
        }
      };
      const onDoc = e => {
        if (ref.current && !ref.current.contains(e.target)) setOpenIdx(null);
      };
      document.addEventListener('keydown', onKey);
      document.addEventListener('mousedown', onDoc);
      return () => {
        document.removeEventListener('keydown', onKey);
        document.removeEventListener('mousedown', onDoc);
      };
    }, []);
    React.useEffect(() => {
      if (!drawer) return;
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }, [drawer]);
    const go = (item, e) => {
      setOpenIdx(null);
      setDrawer(false);
      if (onNavigate) {
        e && e.preventDefault();
        onNavigate(item);
      }
    };
    const cls = ['lm-nav', variant === 'transparent' && 'lm-nav--transparent', variant === 'static' && 'lm-nav--static'].filter(Boolean).join(' ');
    return /*#__PURE__*/React.createElement("header", {
      className: cls,
      ref: ref
    }, /*#__PURE__*/React.createElement("div", {
      className: "lm-nav__bar"
    }, /*#__PURE__*/React.createElement("a", {
      href: brandHref,
      className: "lm-nav__brand",
      onClick: e => go({
        href: brandHref,
        label: 'home'
      }, e)
    }, brand || /*#__PURE__*/React.createElement(Wordmark, {
      size: 22
    })), /*#__PURE__*/React.createElement("nav", {
      className: "lm-nav__links",
      "aria-label": "Main"
    }, items.map((it, i) => it.children ? /*#__PURE__*/React.createElement("div", {
      key: it.label,
      className: "lm-nav__item",
      onMouseEnter: () => setOpenIdx(i),
      onMouseLeave: () => setOpenIdx(null)
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "lm-nav__trigger",
      "aria-expanded": openIdx === i,
      "aria-current": current === it.label ? 'page' : undefined,
      onClick: () => setOpenIdx(openIdx === i ? null : i)
    }, it.label, /*#__PURE__*/React.createElement("span", {
      className: "lm-nav__chev"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "chevron-down",
      size: 12,
      strokeWidth: 2
    }))), openIdx === i && /*#__PURE__*/React.createElement("div", {
      className: "lm-nav__panel",
      role: "menu"
    }, it.children.map(c => /*#__PURE__*/React.createElement("a", {
      key: c.label,
      href: c.href || '#',
      role: "menuitem",
      className: "lm-nav__plink",
      onClick: e => go(c, e)
    }, c.icon && /*#__PURE__*/React.createElement("span", {
      className: "lm-nav__picon"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: c.icon,
      size: 16
    })), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("div", {
      className: "lm-nav__ptitle"
    }, c.label), c.description && /*#__PURE__*/React.createElement("div", {
      className: "lm-nav__pdesc"
    }, c.description)))))) : /*#__PURE__*/React.createElement("a", {
      key: it.label,
      href: it.href || '#',
      className: "lm-nav__trigger",
      "aria-current": current === it.label ? 'page' : undefined,
      onClick: e => go(it, e)
    }, it.label))), /*#__PURE__*/React.createElement("div", {
      className: "lm-nav__actions"
    }, secondaryAction && /*#__PURE__*/React.createElement("span", {
      className: "lm-nav__secondary"
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      size: "sm",
      href: secondaryAction.href,
      onClick: secondaryAction.onClick
    }, secondaryAction.label)), cta && /*#__PURE__*/React.createElement("span", {
      className: "lm-nav__cta"
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      size: "sm",
      href: cta.href,
      onClick: cta.onClick
    }, cta.label)), /*#__PURE__*/React.createElement("span", {
      className: "lm-nav__menu"
    }, /*#__PURE__*/React.createElement(IconButton, {
      icon: drawer ? 'x' : 'menu',
      label: drawer ? 'Close menu' : 'Open menu',
      size: "sm",
      "aria-expanded": drawer,
      onClick: () => setDrawer(!drawer)
    })))), drawer && /*#__PURE__*/React.createElement("div", {
      className: "lm-nav__drawer"
    }, items.map((it, i) => /*#__PURE__*/React.createElement("div", {
      key: it.label,
      className: "lm-nav__group"
    }, it.children ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "lm-nav__gbtn",
      "aria-expanded": groupOpen === i,
      onClick: () => setGroupOpen(groupOpen === i ? null : i)
    }, it.label, /*#__PURE__*/React.createElement("span", {
      className: "lm-nav__chev",
      style: {
        width: 24,
        height: 24
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: groupOpen === i ? 'minus' : 'plus',
      size: 14
    }))), groupOpen === i && /*#__PURE__*/React.createElement("div", {
      className: "lm-nav__glist"
    }, it.children.map(c => /*#__PURE__*/React.createElement("a", {
      key: c.label,
      href: c.href || '#',
      className: "lm-nav__glink",
      onClick: e => go(c, e)
    }, c.label)))) : /*#__PURE__*/React.createElement("a", {
      href: it.href || '#',
      className: "lm-nav__gbtn",
      onClick: e => go(it, e)
    }, it.label, /*#__PURE__*/React.createElement(Icon, {
      name: "arrow-right",
      size: 18
    })))), /*#__PURE__*/React.createElement("div", {
      className: "lm-nav__dfoot"
    }, cta && /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      size: "lg",
      fullWidth: true,
      href: cta.href,
      onClick: cta.onClick
    }, cta.label), secondaryAction && /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      size: "lg",
      fullWidth: true,
      href: secondaryAction.href,
      onClick: secondaryAction.onClick
    }, secondaryAction.label))));
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
  function Tabs({
    items = [],
    value,
    defaultValue,
    onChange,
    variant = 'text',
    fullWidth = false,
    label,
    className = '',
    style
  }) {
    const norm = items.map(it => typeof it === 'string' ? {
      value: it,
      label: it
    } : it);
    const [inner, setInner] = React.useState(defaultValue ?? (norm[0] && norm[0].value));
    const active = value ?? inner;
    const refs = React.useRef([]);
    const select = v => {
      if (value === undefined) setInner(v);
      onChange && onChange(v);
    };
    const onKey = (e, i) => {
      const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (!d) return;
      e.preventDefault();
      const n = (i + d + norm.length) % norm.length;
      select(norm[n].value);
      refs.current[n] && refs.current[n].focus();
    };
    return /*#__PURE__*/React.createElement("div", {
      role: "tablist",
      "aria-label": label,
      className: ['lm-tabs', 'lm-tabs--' + variant, fullWidth && 'lm-tabs--full', className].filter(Boolean).join(' '),
      style: style
    }, norm.map((it, i) => /*#__PURE__*/React.createElement("button", {
      key: it.value,
      ref: el => refs.current[i] = el,
      type: "button",
      role: "tab",
      "aria-selected": active === it.value,
      tabIndex: active === it.value ? 0 : -1,
      className: "lm-tab",
      onClick: () => select(it.value),
      onKeyDown: e => onKey(e, i)
    }, it.label, it.count != null && /*#__PURE__*/React.createElement("span", {
      className: "lm-tab__count"
    }, it.count))));
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
  function Sidebar({
    header,
    items = [],
    value,
    onChange,
    footer,
    className = '',
    style
  }) {
    return /*#__PURE__*/React.createElement("aside", {
      className: 'lm-side ' + className,
      style: style
    }, header && /*#__PURE__*/React.createElement("div", {
      className: "lm-side__head"
    }, header), /*#__PURE__*/React.createElement("nav", {
      className: "lm-side__nav",
      "aria-label": "Sections"
    }, items.map((it, i) => it.section ? /*#__PURE__*/React.createElement("div", {
      key: 's' + i,
      className: "lm-side__section"
    }, it.section) : /*#__PURE__*/React.createElement("button", {
      key: it.value,
      type: "button",
      className: "lm-side__item",
      "aria-current": value === it.value ? 'page' : undefined,
      onClick: () => onChange && onChange(it.value)
    }, it.icon && /*#__PURE__*/React.createElement(Icon, {
      name: it.icon,
      size: 18
    }), /*#__PURE__*/React.createElement("span", null, it.label), it.badge != null && /*#__PURE__*/React.createElement("span", {
      className: "lm-side__badge"
    }, it.badge)))), footer && /*#__PURE__*/React.createElement("div", {
      className: "lm-side__foot"
    }, footer));
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
  function BottomNav({
    items = [],
    value,
    onChange,
    position = 'fixed',
    hideOnDesktop = true,
    className = '',
    style
  }) {
    const cls = ['lm-bnav', position === 'fixed' && 'lm-bnav--fixed', hideOnDesktop && 'lm-bnav--auto', className].filter(Boolean).join(' ');
    return /*#__PURE__*/React.createElement("nav", {
      className: cls,
      style: style,
      "aria-label": "Primary"
    }, items.slice(0, 5).map(it => /*#__PURE__*/React.createElement("button", {
      key: it.value,
      type: "button",
      className: "lm-bnav__item",
      "aria-current": value === it.value ? 'page' : undefined,
      onClick: () => onChange && onChange(it.value)
    }, /*#__PURE__*/React.createElement(Icon, {
      name: it.icon,
      size: 22
    }), /*#__PURE__*/React.createElement("span", null, it.label), it.badge != null && /*#__PURE__*/React.createElement("span", {
      className: "lm-bnav__dot"
    }, it.badge))));
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
  function Card({
    variant = 'default',
    padding = 'md',
    interactive,
    href,
    as,
    onClick,
    children,
    className = '',
    style,
    ...rest
  }) {
    const isInteractive = interactive ?? !!(href || onClick);
    const Tag = as || (href ? 'a' : 'div');
    const cls = ['lm-card', 'lm-card--' + variant, 'lm-card--p-' + padding, isInteractive && 'lm-card--interactive', className].filter(Boolean).join(' ');
    return /*#__PURE__*/React.createElement(Tag, _extends({
      href: href,
      onClick: onClick,
      className: cls,
      style: style,
      tabIndex: isInteractive && !href ? 0 : undefined
    }, rest), children);
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
  function Accordion({
    items = [],
    type = 'single',
    defaultOpen = [],
    variant = 'filled',
    numbered = false,
    accentOpen = false,
    className = '',
    style
  }) {
    const [open, setOpen] = React.useState(() => new Set(defaultOpen));
    const baseId = React.useId();
    const toggle = id => setOpen(prev => {
      const next = new Set(type === 'single' ? [] : prev);
      if (!prev.has(id)) next.add(id);
      return next;
    });
    return /*#__PURE__*/React.createElement("div", {
      className: ['lm-acc', 'lm-acc--' + variant, numbered && 'lm-acc--numbered', className].filter(Boolean).join(' '),
      style: style
    }, items.map((it, i) => {
      const id = it.id ?? String(i);
      const isOpen = open.has(id);
      const hid = baseId + '-h' + i,
        pid = baseId + '-p' + i;
      return /*#__PURE__*/React.createElement("div", {
        key: id,
        className: ['lm-acc__item', isOpen && accentOpen && 'lm-acc__item--accent'].filter(Boolean).join(' ')
      }, /*#__PURE__*/React.createElement("button", {
        type: "button",
        id: hid,
        className: "lm-acc__head",
        "aria-expanded": isOpen,
        "aria-controls": pid,
        onClick: () => toggle(id)
      }, numbered && /*#__PURE__*/React.createElement(IndexBadge, {
        value: i + 1,
        variant: isOpen && accentOpen ? 'inverse' : 'outline'
      }), /*#__PURE__*/React.createElement("span", {
        className: "lm-acc__title"
      }, it.title), it.meta && /*#__PURE__*/React.createElement("span", {
        className: "lm-acc__meta"
      }, it.meta), /*#__PURE__*/React.createElement("span", {
        className: "lm-acc__toggle",
        "aria-hidden": "true"
      }, /*#__PURE__*/React.createElement(Icon, {
        name: isOpen ? 'minus' : 'plus',
        size: 14,
        strokeWidth: 2
      }))), /*#__PURE__*/React.createElement("div", {
        id: pid,
        role: "region",
        "aria-labelledby": hid,
        className: 'lm-acc__panel' + (isOpen ? ' lm-acc__panel--open' : '')
      }, /*#__PURE__*/React.createElement("div", {
        className: "lm-acc__inner"
      }, /*#__PURE__*/React.createElement("div", {
        className: "lm-acc__body"
      }, it.content))));
    }));
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
  function Glow({
    variant = 'horizon',
    grain = true,
    as = 'div',
    minHeight,
    children,
    className = '',
    style,
    ...rest
  }) {
    const Tag = as;
    return /*#__PURE__*/React.createElement(Tag, _extends({
      className: ['lm-glow', 'lm-glow--' + variant, className].join(' '),
      style: {
        minHeight,
        ...style
      }
    }, rest), /*#__PURE__*/React.createElement("span", {
      className: "lm-glow__layer",
      "aria-hidden": "true"
    }), variant === 'columns' && /*#__PURE__*/React.createElement("span", {
      className: "lm-glow__dots",
      "aria-hidden": "true"
    }), grain && /*#__PURE__*/React.createElement("span", {
      className: "lm-glow__grain",
      "aria-hidden": "true"
    }), children);
  }

  // ---- data/ValueTag.jsx

  const VT = {
    dark: {
      background: 'var(--black)',
      color: 'var(--white)',
      boxShadow: '0 0 0 1px var(--border-default)'
    },
    light: {
      background: 'var(--white)',
      color: 'var(--black)'
    },
    accent: {
      background: 'var(--blue-600)',
      color: 'var(--white)'
    }
  };
  function ValueTag({
    value,
    direction = 'up',
    variant = 'dark',
    style
  }) {
    const arrowColor = direction === 'down' ? 'var(--red-400)' : variant === 'accent' ? 'var(--white)' : 'var(--blue-500)';
    return /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        height: 24,
        padding: '0 8px',
        fontFamily: 'var(--font-mono)',
        fontSize: 12,
        letterSpacing: '0.02em',
        fontVariantNumeric: 'tabular-nums',
        borderRadius: 'var(--radius-xs)',
        whiteSpace: 'nowrap',
        ...VT[variant],
        ...style
      }
    }, direction && direction !== 'none' && /*#__PURE__*/React.createElement("span", {
      "aria-hidden": "true",
      style: {
        color: arrowColor,
        fontSize: 10
      }
    }, direction === 'down' ? '▼' : '▲'), /*#__PURE__*/React.createElement("span", null, value));
  }

  // ---- data/StatCard.jsx

  const SC = {
    default: {
      bg: 'var(--surface-1)',
      fg: 'var(--text-primary)',
      sub: 'var(--text-tertiary)',
      iconBg: 'var(--surface-accent)',
      iconFg: 'var(--white)',
      ring: 'var(--shadow-hairline)'
    },
    inverse: {
      bg: 'var(--surface-inverse)',
      fg: 'var(--text-inverse)',
      sub: 'var(--gray-500)',
      iconBg: 'var(--blue-500)',
      iconFg: 'var(--white)',
      ring: 'none'
    },
    accent: {
      bg: 'var(--blue-600)',
      fg: 'var(--white)',
      sub: 'var(--white)',
      iconBg: 'var(--black)',
      iconFg: 'var(--white)',
      ring: 'none'
    },
    outline: {
      bg: 'transparent',
      fg: 'var(--text-primary)',
      sub: 'var(--text-tertiary)',
      iconBg: 'var(--surface-3)',
      iconFg: 'var(--text-primary)',
      ring: 'inset 0 0 0 1px var(--border-default)'
    }
  };
  function StatCard({
    label,
    icon,
    value,
    caption,
    delta,
    variant = 'default',
    size = 'md',
    children,
    style
  }) {
    const t = SC[variant];
    const lg = size === 'lg';
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: 24,
        minHeight: lg ? 280 : 180,
        padding: lg ? 'clamp(20px,2.5vw,28px)' : 20,
        background: t.bg,
        color: t.fg,
        boxShadow: t.ring,
        borderRadius: 'var(--radius-card)',
        fontFamily: 'var(--font-sans)',
        minWidth: 0,
        ...style
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10
      }
    }, icon && /*#__PURE__*/React.createElement("span", {
      style: {
        width: lg ? 32 : 24,
        height: lg ? 32 : 24,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: t.iconBg,
        color: t.iconFg,
        borderRadius: 'var(--radius-xs)',
        flexShrink: 0
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: icon,
      size: lg ? 18 : 14,
      strokeWidth: 1.75
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: lg ? 20 : 15,
        letterSpacing: '-0.02em',
        lineHeight: 1.2
      }
    }, label), delta && /*#__PURE__*/React.createElement("span", {
      style: {
        marginLeft: 'auto'
      }
    }, /*#__PURE__*/React.createElement(ValueTag, {
      value: delta.value,
      direction: delta.direction || 'up',
      variant: variant === 'inverse' ? 'dark' : variant === 'accent' ? 'light' : 'dark'
    }))), children, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: lg ? 'clamp(44px, 2rem + 3vw, 64px)' : 'clamp(32px, 1.6rem + 1.5vw, 44px)',
        lineHeight: 1,
        letterSpacing: '-0.045em',
        fontVariantNumeric: 'tabular-nums'
      }
    }, value), caption && /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 14,
        color: t.sub,
        marginTop: 8,
        letterSpacing: '-0.01em'
      }
    }, caption)));
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
  function BarChart({
    data = [],
    height = 240,
    gap = 2,
    highlight = 'max',
    format = v => String(v),
    yTicks = 4,
    xLabels,
    fill = 'gradient',
    label = 'Bar chart',
    style
  }) {
    const [hover, setHover] = React.useState(null);
    const max = Math.max(1, ...data.map(d => d.value));
    const niceMax = (() => {
      const p = Math.pow(10, Math.floor(Math.log10(max)));
      return Math.ceil(max / p) * p;
    })();
    const hiIdx = highlight === 'max' ? data.findIndex(d => d.value === max) : typeof highlight === 'number' ? highlight : null;
    const on = hover ?? hiIdx;
    const ticks = Array.from({
      length: yTicks + 1
    }, (_, i) => niceMax * (yTicks - i) / yTicks);
    const bg = fill === 'solid' ? 'var(--blue-500)' : 'var(--gradient-column)';
    const xs = xLabels || (data.length ? [data[0].label, data[Math.floor(data.length / 3)].label, data[Math.floor(2 * data.length / 3)].label, data[data.length - 1].label] : []);
    return /*#__PURE__*/React.createElement("div", {
      className: 'lm-bc' + (hover != null ? ' lm-bc--dim' : ''),
      style: style,
      role: "img",
      "aria-label": label + ': ' + data.map(d => d.label + ' ' + format(d.value)).join(', ')
    }, /*#__PURE__*/React.createElement("div", {
      className: "lm-bc__y",
      style: {
        height
      }
    }, ticks.map((t, i) => /*#__PURE__*/React.createElement("span", {
      key: i
    }, format(t)))), /*#__PURE__*/React.createElement("div", {
      className: "lm-bc__plot",
      style: {
        height,
        gap
      },
      onMouseLeave: () => setHover(null)
    }, /*#__PURE__*/React.createElement("div", {
      className: "lm-bc__grid"
    }, ticks.map((_, i) => /*#__PURE__*/React.createElement("span", {
      key: i
    }))), data.map((d, i) => {
      const h = d.value / niceMax * height;
      return /*#__PURE__*/React.createElement("div", {
        key: i,
        className: 'lm-bc__bar' + (on === i ? ' lm-bc__bar--on' : ''),
        onMouseEnter: () => setHover(i),
        onTouchStart: () => setHover(i)
      }, /*#__PURE__*/React.createElement("div", {
        className: "lm-bc__fill",
        style: {
          height: h,
          background: bg,
          backgroundSize: '100% ' + height + 'px'
        }
      }), on === i && /*#__PURE__*/React.createElement("div", {
        className: "lm-bc__tip",
        style: {
          bottom: h
        }
      }, /*#__PURE__*/React.createElement(ValueTag, {
        value: format(d.value)
      })));
    })), /*#__PURE__*/React.createElement("div", {
      className: "lm-bc__x"
    }, xs.map((x, i) => /*#__PURE__*/React.createElement("span", {
      key: i
    }, x))));
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
  function DataTable({
    columns = [],
    rows = [],
    rowKey = 'id',
    onRowClick,
    sortable = true,
    defaultSort,
    empty = 'No results',
    className = '',
    style
  }) {
    const [sort, setSort] = React.useState(defaultSort || null);
    const sorted = React.useMemo(() => {
      if (!sort) return rows;
      const col = columns.find(c => c.key === sort.key);
      const get = col && col.sortValue ? col.sortValue : r => r[sort.key];
      return [...rows].sort((a, b) => {
        const x = get(a),
          y = get(b);
        return (x > y ? 1 : x < y ? -1 : 0) * (sort.dir === 'desc' ? -1 : 1);
      });
    }, [rows, sort, columns]);
    const toggle = key => setSort(s => s && s.key === key ? {
      key,
      dir: s.dir === 'asc' ? 'desc' : 'asc'
    } : {
      key,
      dir: 'desc'
    });
    const cell = (c, r) => c.render ? c.render(r) : r[c.key];
    const primary = columns.find(c => c.primary) || columns[0];
    const rest = columns.filter(c => c !== primary);
    const sortCols = sortable ? columns.filter(c => c.sortable !== false) : [];
    const cls = ['lm-dt', onRowClick && 'lm-dt--click', className].filter(Boolean).join(' ');
    return /*#__PURE__*/React.createElement("div", {
      className: cls,
      style: style
    }, sortCols.length > 0 && /*#__PURE__*/React.createElement("div", {
      className: "lm-dt__sort"
    }, /*#__PURE__*/React.createElement("span", {
      className: "lm-dt__k"
    }, rows.length, " items"), /*#__PURE__*/React.createElement("select", {
      "aria-label": "Sort by",
      value: sort ? sort.key + ':' + sort.dir : '',
      onChange: e => {
        const [key, dir] = e.target.value.split(':');
        setSort(key ? {
          key,
          dir
        } : null);
      }
    }, /*#__PURE__*/React.createElement("option", {
      value: ""
    }, "Sort: default"), sortCols.map(c => [/*#__PURE__*/React.createElement("option", {
      key: c.key + 'd',
      value: c.key + ':desc'
    }, c.header, " \u2193"), /*#__PURE__*/React.createElement("option", {
      key: c.key + 'a',
      value: c.key + ':asc'
    }, c.header, " \u2191")]))), /*#__PURE__*/React.createElement("div", {
      className: "lm-dt__wrap"
    }, /*#__PURE__*/React.createElement("table", null, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, columns.map(c => {
      const canSort = sortable && c.sortable !== false;
      const active = sort && sort.key === c.key;
      return /*#__PURE__*/React.createElement("th", {
        key: c.key,
        className: c.align === 'right' ? 'lm-dt--right' : '',
        style: {
          width: c.width
        },
        "aria-sort": active ? sort.dir === 'asc' ? 'ascending' : 'descending' : undefined
      }, canSort ? /*#__PURE__*/React.createElement("button", {
        type: "button",
        onClick: () => toggle(c.key),
        style: {
          color: active ? 'var(--text-primary)' : undefined
        }
      }, c.header, /*#__PURE__*/React.createElement(Icon, {
        name: active && sort.dir === 'asc' ? 'arrow-up' : 'arrow-down',
        size: 12,
        style: {
          opacity: active ? 1 : 0.35
        }
      })) : c.header);
    }))), /*#__PURE__*/React.createElement("tbody", null, sorted.length === 0 ? /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
      colSpan: columns.length,
      className: "lm-dt__empty"
    }, empty)) : sorted.map((r, i) => /*#__PURE__*/React.createElement("tr", {
      key: r[rowKey] ?? i,
      onClick: onRowClick ? () => onRowClick(r) : undefined
    }, columns.map(c => /*#__PURE__*/React.createElement("td", {
      key: c.key,
      className: [c.mono && 'lm-dt--mono', c.align === 'right' && 'lm-dt--right'].filter(Boolean).join(' ')
    }, cell(c, r)))))))), /*#__PURE__*/React.createElement("ul", {
      className: "lm-dt__cards"
    }, sorted.length === 0 ? /*#__PURE__*/React.createElement("li", {
      className: "lm-dt__empty"
    }, empty) : sorted.map((r, i) => /*#__PURE__*/React.createElement("li", {
      key: r[rowKey] ?? i,
      className: "lm-dt__card",
      onClick: onRowClick ? () => onRowClick(r) : undefined,
      tabIndex: onRowClick ? 0 : undefined
    }, /*#__PURE__*/React.createElement("div", {
      className: "lm-dt__ctitle"
    }, /*#__PURE__*/React.createElement("span", null, cell(primary, r)), onRowClick && /*#__PURE__*/React.createElement(Icon, {
      name: "chevron-right",
      size: 16,
      style: {
        color: 'var(--text-tertiary)'
      }
    })), rest.map(c => /*#__PURE__*/React.createElement("div", {
      key: c.key,
      className: "lm-dt__row"
    }, /*#__PURE__*/React.createElement("span", {
      className: "lm-dt__k"
    }, c.header), /*#__PURE__*/React.createElement("span", {
      className: 'lm-dt__v' + (c.mono ? ' lm-dt--mono' : '')
    }, cell(c, r))))))));
  }

  // ---- feedback/Badge.jsx

  const TONES = {
    neutral: ['var(--surface-3)', 'var(--text-secondary)', 'var(--gray-400)'],
    success: ['var(--status-success-bg)', 'var(--green-400)', 'var(--status-success)'],
    warning: ['var(--status-warning-bg)', 'var(--amber-400)', 'var(--status-warning)'],
    danger: ['var(--status-danger-bg)', 'var(--red-400)', 'var(--status-danger)'],
    info: ['var(--status-info-bg)', 'var(--blue-300)', 'var(--status-info)']
  };
  function Badge({
    tone = 'neutral',
    dot = true,
    children,
    style
  }) {
    const [bg, fg, dc] = TONES[tone];
    return /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        height: 22,
        padding: '0 8px',
        fontFamily: 'var(--font-sans)',
        fontSize: 12,
        fontWeight: 500,
        letterSpacing: 0,
        borderRadius: 'var(--radius-xs)',
        background: bg,
        color: fg,
        whiteSpace: 'nowrap',
        ...style
      }
    }, dot && /*#__PURE__*/React.createElement("span", {
      "aria-hidden": "true",
      style: {
        width: 6,
        height: 6,
        borderRadius: 9999,
        background: dc,
        boxShadow: tone === 'info' ? '0 0 6px var(--blue-500)' : 'none'
      }
    }), children);
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
  const WIDTHS = {
    sm: 400,
    md: 520,
    lg: 720
  };
  function Dialog({
    open,
    onClose,
    title,
    description,
    children,
    footer,
    size = 'md',
    dismissible = true
  }) {
    const panel = React.useRef(null);
    const tid = React.useId();
    React.useEffect(() => {
      if (!open) return;
      const prev = document.activeElement;
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      panel.current && panel.current.focus();
      const onKey = e => {
        if (e.key === 'Escape' && dismissible) onClose && onClose();
      };
      document.addEventListener('keydown', onKey);
      return () => {
        document.removeEventListener('keydown', onKey);
        document.body.style.overflow = prevOverflow;
        prev && prev.focus && prev.focus();
      };
    }, [open]);
    if (!open) return null;
    return /*#__PURE__*/React.createElement("div", {
      className: "lm-dlg"
    }, /*#__PURE__*/React.createElement("div", {
      className: "lm-dlg__scrim",
      onClick: dismissible ? onClose : undefined
    }), /*#__PURE__*/React.createElement("div", {
      ref: panel,
      className: "lm-dlg__panel",
      role: "dialog",
      "aria-modal": "true",
      "aria-labelledby": title ? tid : undefined,
      tabIndex: -1,
      style: {
        maxWidth: WIDTHS[size]
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "lm-dlg__handle",
      "aria-hidden": "true"
    }), (title || dismissible) && /*#__PURE__*/React.createElement("div", {
      className: "lm-dlg__head"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, title && /*#__PURE__*/React.createElement("h2", {
      id: tid,
      className: "lm-dlg__title"
    }, title), description && /*#__PURE__*/React.createElement("p", {
      className: "lm-dlg__desc"
    }, description)), dismissible && /*#__PURE__*/React.createElement(IconButton, {
      icon: "x",
      label: "Close",
      variant: "ghost",
      size: "sm",
      onClick: onClose
    })), children && /*#__PURE__*/React.createElement("div", {
      className: "lm-dlg__body"
    }, children), footer && /*#__PURE__*/React.createElement("div", {
      className: "lm-dlg__foot"
    }, footer)));
  }

  // ---- feedback/Toast.jsx

  const TOAST_ICON = {
    neutral: ['info', 'var(--text-secondary)'],
    success: ['circle-check', 'var(--green-400)'],
    warning: ['triangle-alert', 'var(--amber-400)'],
    danger: ['circle-x', 'var(--red-400)'],
    info: ['info', 'var(--blue-400)']
  };
  function Toast({
    tone = 'neutral',
    title,
    description,
    action,
    onClose,
    style
  }) {
    const [icon, color] = TOAST_ICON[tone];
    return /*#__PURE__*/React.createElement("div", {
      role: tone === 'danger' ? 'alert' : 'status',
      style: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
        width: '100%',
        maxWidth: 400,
        padding: '14px 12px 14px 16px',
        background: 'var(--surface-2)',
        color: 'var(--text-primary)',
        borderRadius: 'var(--radius-card)',
        boxShadow: 'var(--shadow-overlay)',
        fontFamily: 'var(--font-sans)',
        pointerEvents: 'auto',
        ...style
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color,
        marginTop: 1
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: icon,
      size: 18
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, title && /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 14,
        fontWeight: 500,
        letterSpacing: '-0.01em',
        lineHeight: 1.3
      }
    }, title), description && /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        color: 'var(--text-secondary)',
        lineHeight: 1.4,
        marginTop: 2
      }
    }, description), action && /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: action.onClick,
      style: {
        marginTop: 8,
        padding: 0,
        background: 'none',
        border: 0,
        cursor: 'pointer',
        fontFamily: 'var(--font-mono)',
        fontSize: 12,
        letterSpacing: 'var(--tracking-caps)',
        textTransform: 'uppercase',
        color: 'var(--text-accent)'
      }
    }, action.label)), onClose && /*#__PURE__*/React.createElement(IconButton, {
      icon: "x",
      label: "Dismiss",
      variant: "ghost",
      size: "xs",
      onClick: onClose
    }));
  }

  // ---- feedback/ToastRegion.jsx

  injectStyles('lm-toastregion', `
.lm-toasts{position:fixed;z-index:var(--z-toast);right:24px;bottom:24px;display:flex;flex-direction:column;align-items:flex-end;gap:8px;pointer-events:none;width:min(400px,calc(100vw - 48px))}
@media (max-width:639px){.lm-toasts{left:12px;right:12px;width:auto;align-items:stretch;bottom:calc(12px + var(--lm-toast-offset,0px) + env(safe-area-inset-bottom))}}
`);
  function ToastRegion({
    offsetBottom = 0,
    children,
    style
  }) {
    return /*#__PURE__*/React.createElement("div", {
      className: "lm-toasts",
      "aria-live": "polite",
      style: {
        '--lm-toast-offset': offsetBottom + 'px',
        ...style
      }
    }, children);
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
  function Tooltip({
    content,
    side = 'top',
    delay = 250,
    wrap = false,
    children
  }) {
    const [show, setShow] = React.useState(false);
    const t = React.useRef();
    const id = React.useId();
    const on = () => {
      clearTimeout(t.current);
      t.current = setTimeout(() => setShow(true), delay);
    };
    const off = () => {
      clearTimeout(t.current);
      setShow(false);
    };
    return /*#__PURE__*/React.createElement("span", {
      className: "lm-tt",
      onMouseEnter: on,
      onMouseLeave: off,
      onFocus: on,
      onBlur: off,
      "aria-describedby": show ? id : undefined
    }, children, show && /*#__PURE__*/React.createElement("span", {
      id: id,
      role: "tooltip",
      className: 'lm-tt__bubble lm-tt__bubble--' + side + (wrap ? ' lm-tt__bubble--wrap' : '')
    }, content));
  }
  window.LumenDesignSystem_12638a = window.LumenDesignSystem_12638a || {
    injectStyles,
    ICON_PATHS,
    Icon,
    ICON_NAMES,
    Button,
    IconButton,
    Tag,
    IndexBadge,
    ArrowLink,
    Wordmark,
    useFieldStyles,
    useCheckStyles,
    Input,
    Select,
    Checkbox,
    Radio,
    Switch,
    Navbar,
    Tabs,
    Sidebar,
    BottomNav,
    Card,
    Accordion,
    Glow,
    ValueTag,
    StatCard,
    BarChart,
    DataTable,
    Badge,
    Dialog,
    Toast,
    ToastRegion,
    Tooltip
  };
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "scratch/dev-bundle.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/ActivityScreen.jsx
try { (() => {
const {
  Tabs,
  Input,
  DataTable,
  Badge,
  Dialog,
  Button,
  IconButton,
  Tooltip,
  Card
} = window.LumenDesignSystem_12638a;
const TONE = {
  Confirmed: 'success',
  Pending: 'warning',
  Failed: 'danger'
};
function TxDialog({
  tx,
  onClose,
  toast
}) {
  const copy = () => {
    navigator.clipboard && navigator.clipboard.writeText(tx.hash).catch(() => {});
    toast({
      tone: 'success',
      title: 'Hash copied'
    });
  };
  return /*#__PURE__*/React.createElement(Dialog, {
    open: !!tx,
    onClose: onClose,
    title: tx && tx.type,
    description: tx && tx.time,
    footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      onClick: onClose
    }, "Close"), /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      iconRight: "arrow-up-right"
    }, "View in explorer"))
  }, tx && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "kv"
  }, /*#__PURE__*/React.createElement("span", {
    className: "kv__k"
  }, "Status"), /*#__PURE__*/React.createElement(Badge, {
    tone: TONE[tx.status]
  }, tx.status)), /*#__PURE__*/React.createElement("div", {
    className: "kv"
  }, /*#__PURE__*/React.createElement("span", {
    className: "kv__k"
  }, "Hash"), /*#__PURE__*/React.createElement("span", {
    className: "kv__v"
  }, /*#__PURE__*/React.createElement("span", null, tx.hash), /*#__PURE__*/React.createElement(Tooltip, {
    content: "Copy hash"
  }, /*#__PURE__*/React.createElement(IconButton, {
    icon: "copy",
    label: "Copy hash",
    variant: "ghost",
    size: "xs",
    onClick: copy
  })))), /*#__PURE__*/React.createElement("div", {
    className: "kv"
  }, /*#__PURE__*/React.createElement("span", {
    className: "kv__k"
  }, "Amount"), /*#__PURE__*/React.createElement("span", {
    className: "kv__v"
  }, `${tx.amount.toLocaleString('en-US')} ${tx.asset}`)), /*#__PURE__*/React.createElement("div", {
    className: "kv"
  }, /*#__PURE__*/React.createElement("span", {
    className: "kv__k"
  }, "To"), /*#__PURE__*/React.createElement("span", {
    className: "kv__v"
  }, tx.to)), /*#__PURE__*/React.createElement("div", {
    className: "kv"
  }, /*#__PURE__*/React.createElement("span", {
    className: "kv__k"
  }, "Fee"), /*#__PURE__*/React.createElement("span", {
    className: "kv__v"
  }, `${tx.fee} LMN`)), /*#__PURE__*/React.createElement("div", {
    className: "kv"
  }, /*#__PURE__*/React.createElement("span", {
    className: "kv__k"
  }, "Block"), /*#__PURE__*/React.createElement("span", {
    className: "kv__v"
  }, tx.block.toLocaleString('en-US')))));
}
function ActivityScreen({
  toast
}) {
  const D = window.APP_DATA;
  const [type, setType] = React.useState('All');
  const [q, setQ] = React.useState('');
  const [sel, setSel] = React.useState(null);
  const types = ['All', 'Transfer', 'Swap', 'Stake'];
  const rows = D.txs.filter(t => (type === 'All' || t.type === type) && (t.hash + t.to).toLowerCase().includes(q.toLowerCase()));
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "page-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    className: "page-title"
  }, "Activity"), /*#__PURE__*/React.createElement("div", {
    className: "page-sub"
  }, "Every transaction from this account")), /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    size: "sm",
    iconLeft: "download"
  }, "Export CSV")), /*#__PURE__*/React.createElement("div", {
    className: "toolbar"
  }, /*#__PURE__*/React.createElement(Tabs, {
    variant: "underline",
    items: types.map(t => ({
      value: t,
      label: t === 'All' ? 'All' : t + 's',
      count: t === 'All' ? D.txs.length : D.txs.filter(x => x.type === t).length
    })),
    value: type,
    onChange: setType,
    label: "Type"
  }), /*#__PURE__*/React.createElement(Input, {
    iconLeft: "search",
    placeholder: "Hash or address",
    size: "sm",
    value: q,
    onChange: e => setQ(e.target.value),
    style: {
      width: 'min(100%, 260px)'
    }
  })), /*#__PURE__*/React.createElement(DataTable, {
    rows: rows,
    onRowClick: setSel,
    empty: "No transactions match these filters",
    columns: [{
      key: 'hash',
      header: 'Hash',
      mono: true,
      primary: true
    }, {
      key: 'type',
      header: 'Type'
    }, {
      key: 'amount',
      header: 'Amount',
      align: 'right',
      mono: true,
      render: r => r.amount.toLocaleString('en-US') + ' ' + r.asset
    }, {
      key: 'status',
      header: 'Status',
      render: r => /*#__PURE__*/React.createElement(Badge, {
        tone: TONE[r.status]
      }, r.status)
    }, {
      key: 'time',
      header: 'Time',
      sortable: false,
      render: r => /*#__PURE__*/React.createElement("span", {
        style: {
          color: 'var(--text-secondary)'
        }
      }, r.time)
    }]
  }), /*#__PURE__*/React.createElement(TxDialog, {
    tx: sel,
    onClose: () => setSel(null),
    toast: toast
  }));
}
Object.assign(window, {
  ActivityScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/ActivityScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/AppShell.jsx
try { (() => {
const {
  Sidebar,
  BottomNav,
  Wordmark,
  Input,
  IconButton,
  Select,
  Tooltip
} = window.LumenDesignSystem_12638a;
const APP_NAV = [{
  value: 'overview',
  label: 'Overview',
  icon: 'layout-grid'
}, {
  value: 'activity',
  label: 'Activity',
  icon: 'activity',
  badge: 1
}, {
  value: 'assets',
  label: 'Assets',
  icon: 'wallet'
}, {
  value: 'settings',
  label: 'Settings',
  icon: 'settings'
}];
function AppShell({
  view,
  setView,
  children
}) {
  const sideItems = [APP_NAV[0], APP_NAV[1], {
    section: 'Account'
  }, APP_NAV[2], APP_NAV[3]];
  return /*#__PURE__*/React.createElement("div", {
    className: "app"
  }, /*#__PURE__*/React.createElement("div", {
    className: "app__side"
  }, /*#__PURE__*/React.createElement(Sidebar, {
    header: /*#__PURE__*/React.createElement(Wordmark, {
      size: 22
    }),
    items: sideItems,
    value: view,
    onChange: setView,
    footer: /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "app__avatar"
    }, "HL"), /*#__PURE__*/React.createElement("div", {
      style: {
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 14
      }
    }, "Harbor Labs"), /*#__PURE__*/React.createElement("div", {
      className: "eyebrow",
      style: {
        fontSize: 10
      }
    }, "0x41be\u202677c0")))
  })), /*#__PURE__*/React.createElement("div", {
    className: "app__main"
  }, /*#__PURE__*/React.createElement("header", {
    className: "app__top"
  }, /*#__PURE__*/React.createElement("span", {
    className: "app__brand"
  }, /*#__PURE__*/React.createElement(Wordmark, {
    size: 20
  })), /*#__PURE__*/React.createElement("div", {
    className: "app__search"
  }, /*#__PURE__*/React.createElement(Input, {
    iconLeft: "search",
    placeholder: "Search transactions, apps, addresses",
    size: "sm",
    suffix: "\u2318K",
    "aria-label": "Search"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: 'auto',
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Tooltip, {
    content: "Search",
    side: "bottom"
  }, /*#__PURE__*/React.createElement("span", {
    className: "app__brand"
  }, /*#__PURE__*/React.createElement(IconButton, {
    icon: "search",
    label: "Search",
    variant: "ghost",
    size: "sm"
  }))), /*#__PURE__*/React.createElement(Select, {
    size: "sm",
    options: ['Mainnet', 'Testnet'],
    defaultValue: "Mainnet",
    "aria-label": "Network",
    style: {
      width: 128
    }
  }), /*#__PURE__*/React.createElement(Tooltip, {
    content: "Notifications",
    side: "bottom"
  }, /*#__PURE__*/React.createElement(IconButton, {
    icon: "bell",
    label: "Notifications",
    variant: "ghost",
    size: "sm"
  })))), /*#__PURE__*/React.createElement("main", {
    className: "app__content",
    "data-screen-label": view
  }, children)), /*#__PURE__*/React.createElement(BottomNav, {
    items: APP_NAV,
    value: view,
    onChange: setView
  }));
}
Object.assign(window, {
  AppShell
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/AppShell.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/AssetsScreen.jsx
try { (() => {
const {
  StatCard,
  Card,
  DataTable,
  Button,
  Dialog,
  Input,
  Select
} = window.LumenDesignSystem_12638a;
function AssetsScreen({
  toast
}) {
  const D = window.APP_DATA;
  const [send, setSend] = React.useState(false);
  const total = D.assets.reduce((s, a) => s + a.bal * a.price, 0);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "page-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    className: "page-title"
  }, "Assets"), /*#__PURE__*/React.createElement("div", {
    className: "page-sub"
  }, "Balances held by 0x41be\u202677c0")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "sm",
    iconLeft: "arrow-down"
  }, "Receive"), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    iconLeft: "send",
    onClick: () => setSend(true)
  }, "Send"))), /*#__PURE__*/React.createElement("div", {
    className: "two"
  }, /*#__PURE__*/React.createElement(StatCard, {
    variant: "inverse",
    icon: "wallet",
    label: "Total balance",
    value: fmtUsd(total),
    caption: "Across 4 assets",
    size: "lg",
    delta: {
      value: '2.4%'
    }
  }), /*#__PURE__*/React.createElement(Card, {
    padding: "md"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-title"
  }, "Allocation"), /*#__PURE__*/React.createElement("div", {
    className: "alloc"
  }, D.assets.map(a => /*#__PURE__*/React.createElement("span", {
    key: a.id,
    style: {
      width: a.bal * a.price / total * 100 + '%',
      background: a.color
    }
  }))), /*#__PURE__*/React.createElement("div", {
    className: "legend"
  }, D.assets.map(a => /*#__PURE__*/React.createElement("div", {
    key: a.id
  }, /*#__PURE__*/React.createElement("i", {
    style: {
      background: a.color
    }
  }), a.sym, /*#__PURE__*/React.createElement("b", null, Math.round(a.bal * a.price / total * 100), "%")))))), /*#__PURE__*/React.createElement(Card, {
    padding: "md"
  }, /*#__PURE__*/React.createElement(DataTable, {
    rows: D.assets,
    defaultSort: {
      key: 'value',
      dir: 'desc'
    },
    columns: [{
      key: 'name',
      header: 'Asset',
      primary: true,
      render: r => /*#__PURE__*/React.createElement("span", {
        className: "asset"
      }, /*#__PURE__*/React.createElement("span", {
        className: "asset__sym"
      }, r.sym.slice(0, 3)), r.name)
    }, {
      key: 'bal',
      header: 'Balance',
      align: 'right',
      mono: true,
      render: r => r.bal.toLocaleString('en-US') + ' ' + r.sym
    }, {
      key: 'price',
      header: 'Price',
      align: 'right',
      mono: true,
      render: r => fmtUsd(r.price, 2)
    }, {
      key: 'value',
      header: 'Value',
      align: 'right',
      mono: true,
      sortValue: r => r.bal * r.price,
      render: r => fmtUsd(r.bal * r.price)
    }]
  })), /*#__PURE__*/React.createElement(Dialog, {
    open: send,
    onClose: () => setSend(false),
    title: "Send assets",
    size: "sm",
    footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      onClick: () => setSend(false)
    }, "Cancel"), /*#__PURE__*/React.createElement(Button, {
      onClick: () => {
        setSend(false);
        toast({
          tone: 'success',
          title: 'Transaction sent',
          description: 'Finalized in 390ms',
          action: {
            label: 'View tx'
          }
        });
      }
    }, "Review & send"))
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(Select, {
    label: "Asset",
    options: D.assets.map(a => ({
      value: a.id,
      label: a.sym + ' — ' + a.bal.toLocaleString('en-US')
    }))
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Recipient",
    placeholder: "0x\u2026 or name.lmn",
    iconLeft: "user"
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Amount",
    placeholder: "0.00",
    inputMode: "decimal",
    suffix: "MAX",
    hint: "Network fee \u2248 0.002 LMN"
  }))));
}
Object.assign(window, {
  AssetsScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/AssetsScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/OverviewScreen.jsx
try { (() => {
const {
  StatCard,
  Card,
  Tabs,
  BarChart,
  DataTable,
  Badge,
  Dialog,
  Button,
  ArrowLink
} = window.LumenDesignSystem_12638a;
function AppDetail({
  app,
  onClose
}) {
  return /*#__PURE__*/React.createElement(Dialog, {
    open: !!app,
    onClose: onClose,
    title: app && app.name,
    description: app && app.cat + ' · Live on mainnet',
    footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      onClick: onClose
    }, "Close"), /*#__PURE__*/React.createElement(Button, {
      iconRight: "arrow-up-right"
    }, "Open app"))
  }, app && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "kv"
  }, /*#__PURE__*/React.createElement("span", {
    className: "kv__k"
  }, "TVL"), /*#__PURE__*/React.createElement("span", {
    className: "kv__v"
  }, `${fmtUsd(app.tvl, 1)}M`)), /*#__PURE__*/React.createElement("div", {
    className: "kv"
  }, /*#__PURE__*/React.createElement("span", {
    className: "kv__k"
  }, "7d change"), /*#__PURE__*/React.createElement("span", {
    className: "kv__v",
    style: {
      color: app.change < 0 ? 'var(--red-400)' : 'var(--green-400)'
    }
  }, `${app.change > 0 ? '+' : ''}${app.change}%`)), /*#__PURE__*/React.createElement("div", {
    className: "kv"
  }, /*#__PURE__*/React.createElement("span", {
    className: "kv__k"
  }, "Users"), /*#__PURE__*/React.createElement("span", {
    className: "kv__v"
  }, app.users.toLocaleString('en-US')))));
}
function OverviewScreen({
  go
}) {
  const [range, setRange] = React.useState('30D');
  const [sel, setSel] = React.useState(null);
  const D = window.APP_DATA;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "page-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    className: "page-title"
  }, "Overview"), /*#__PURE__*/React.createElement("div", {
    className: "page-sub"
  }, "Network health and your applications")), /*#__PURE__*/React.createElement(Tabs, {
    variant: "segmented",
    items: ['7D', '30D', '90D', 'All'],
    value: range,
    onChange: setRange,
    label: "Range"
  })), /*#__PURE__*/React.createElement("div", {
    className: "stats"
  }, /*#__PURE__*/React.createElement(StatCard, {
    variant: "accent",
    icon: "shield-check",
    label: "Value secured",
    value: "$1.24B",
    caption: 'Last ' + range,
    delta: {
      value: '4.2%'
    }
  }), /*#__PURE__*/React.createElement(StatCard, {
    icon: "activity",
    label: "Transactions",
    value: "912M",
    caption: "Cumulative",
    delta: {
      value: '12%'
    }
  }), /*#__PURE__*/React.createElement(StatCard, {
    icon: "zap",
    label: "Finality",
    value: "390ms",
    caption: "Median"
  }), /*#__PURE__*/React.createElement(StatCard, {
    icon: "user",
    label: "Active accounts",
    value: "8.4M",
    caption: "30-day",
    delta: {
      value: '0.8%',
      direction: 'down'
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "two"
  }, /*#__PURE__*/React.createElement(Card, {
    padding: "md"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "card-title"
  }, "Daily volume"), /*#__PURE__*/React.createElement("div", {
    className: "page-sub",
    style: {
      marginTop: 4
    }
  }, "USD, millions")), /*#__PURE__*/React.createElement(Tabs, {
    items: ['Daily', 'Weekly', 'Monthly'],
    label: "Granularity"
  })), /*#__PURE__*/React.createElement(BarChart, {
    data: D.volume,
    height: 220,
    format: v => '$' + v + 'M',
    xLabels: ['Nov 16', 'Nov 26', 'Dec 6', 'Dec 15'],
    label: "Daily volume"
  })), /*#__PURE__*/React.createElement(Card, {
    padding: "md"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-title"
  }, "Your activity"), /*#__PURE__*/React.createElement(ArrowLink, {
    onClick: () => go('activity')
  }, "View all")), D.txs.slice(0, 4).map(t => /*#__PURE__*/React.createElement("div", {
    key: t.id,
    className: "kv"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }
  }, /*#__PURE__*/React.createElement("span", null, t.type), /*#__PURE__*/React.createElement("span", {
    className: "kv__k",
    style: {
      fontSize: 10
    }
  }, t.time)), /*#__PURE__*/React.createElement("span", {
    className: "kv__v"
  }, `${t.amount.toLocaleString('en-US')} ${t.asset}`, " ", /*#__PURE__*/React.createElement(Badge, {
    tone: t.status === 'Confirmed' ? 'success' : t.status === 'Pending' ? 'warning' : 'danger',
    dot: true
  }, t.status)))))), /*#__PURE__*/React.createElement(Card, {
    padding: "md"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-title"
  }, "Top applications"), /*#__PURE__*/React.createElement("span", {
    className: "eyebrow"
  }, "By TVL")), /*#__PURE__*/React.createElement(DataTable, {
    rows: D.apps,
    onRowClick: setSel,
    defaultSort: {
      key: 'tvl',
      dir: 'desc'
    },
    columns: [{
      key: 'name',
      header: 'Application',
      primary: true
    }, {
      key: 'cat',
      header: 'Category'
    }, {
      key: 'tvl',
      header: 'TVL',
      align: 'right',
      mono: true,
      render: r => fmtUsd(r.tvl, 1) + 'M'
    }, {
      key: 'change',
      header: '7D',
      align: 'right',
      mono: true,
      render: r => /*#__PURE__*/React.createElement("span", {
        style: {
          color: r.change < 0 ? 'var(--red-400)' : 'var(--green-400)'
        }
      }, r.change > 0 ? '+' : '', r.change, "%")
    }, {
      key: 'users',
      header: 'Users',
      align: 'right',
      mono: true,
      render: r => r.users.toLocaleString('en-US')
    }]
  })), /*#__PURE__*/React.createElement(AppDetail, {
    app: sel,
    onClose: () => setSel(null)
  }));
}
Object.assign(window, {
  OverviewScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/OverviewScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/SettingsScreen.jsx
try { (() => {
const {
  Input,
  Select,
  Switch,
  Radio,
  Button,
  Checkbox
} = window.LumenDesignSystem_12638a;
function Row({
  title,
  desc,
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "settings"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "settings__h"
  }, title), /*#__PURE__*/React.createElement("div", {
    className: "settings__d"
  }, desc)), /*#__PURE__*/React.createElement("div", null, children));
}
function SettingsScreen({
  toast,
  theme,
  setTheme
}) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "page-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    className: "page-title"
  }, "Settings"), /*#__PURE__*/React.createElement("div", {
    className: "page-sub"
  }, "Profile, notifications and preferences"))), /*#__PURE__*/React.createElement(Row, {
    title: "Profile",
    desc: "Shown on your public application page."
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-grid"
  }, /*#__PURE__*/React.createElement(Input, {
    label: "Team name",
    defaultValue: "Harbor Labs"
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Email",
    type: "email",
    defaultValue: "ops@harbor.xyz"
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Website",
    defaultValue: "harbor.xyz",
    iconLeft: "globe",
    style: {
      gridColumn: '1 / -1'
    }
  }))), /*#__PURE__*/React.createElement(Row, {
    title: "Notifications",
    desc: "Choose what we alert you about."
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 4
    }
  }, /*#__PURE__*/React.createElement(Switch, {
    label: "Transaction confirmations",
    description: "Push + email for every outgoing transaction",
    defaultChecked: true
  }), /*#__PURE__*/React.createElement(Switch, {
    label: "Price alerts",
    description: "When any held asset moves \xB15% in 24h",
    defaultChecked: true
  }), /*#__PURE__*/React.createElement(Switch, {
    label: "Program updates",
    description: "Cohort deadlines and new grants"
  }))), /*#__PURE__*/React.createElement(Row, {
    title: "Appearance",
    desc: "Dark is the default; light mirrors every token."
  }, /*#__PURE__*/React.createElement("fieldset", {
    style: {
      border: 0,
      padding: 0,
      margin: 0,
      display: 'flex',
      gap: 24,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("legend", {
    style: {
      position: 'absolute',
      width: 1,
      height: 1,
      overflow: 'hidden'
    }
  }, "Theme"), /*#__PURE__*/React.createElement(Radio, {
    name: "theme",
    value: "dark",
    label: "Dark",
    checked: theme === 'dark',
    onChange: () => setTheme('dark')
  }), /*#__PURE__*/React.createElement(Radio, {
    name: "theme",
    value: "light",
    label: "Light",
    checked: theme === 'light',
    onChange: () => setTheme('light')
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16,
      maxWidth: 280
    }
  }, /*#__PURE__*/React.createElement(Select, {
    label: "Currency",
    options: ['USD', 'EUR', 'BRL'],
    defaultValue: "USD"
  }))), /*#__PURE__*/React.createElement(Row, {
    title: "Danger zone",
    desc: "Revoking keys signs this team out on every device."
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 12,
      justifyItems: 'start'
    }
  }, /*#__PURE__*/React.createElement(Checkbox, {
    label: "I understand this can't be undone"
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "danger",
    size: "sm"
  }, "Revoke all API keys"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: 8,
      paddingTop: 24
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "ghost"
  }, "Discard"), /*#__PURE__*/React.createElement(Button, {
    onClick: () => toast({
      tone: 'success',
      title: 'Settings saved'
    })
  }, "Save changes")));
}
Object.assign(window, {
  SettingsScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/SettingsScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/data.js
try { (() => {
window.APP_DATA = {
  apps: [{
    id: 1,
    name: 'Harbor Lend',
    cat: 'Lending',
    tvl: 412.8,
    change: 4.2,
    users: 182400
  }, {
    id: 2,
    name: 'Driftline',
    cat: 'Exchange',
    tvl: 318.2,
    change: 2.1,
    users: 241900
  }, {
    id: 3,
    name: 'Keel Vaults',
    cat: 'Yield',
    tvl: 196.4,
    change: -1.8,
    users: 40210
  }, {
    id: 4,
    name: 'Pier Pay',
    cat: 'Payments',
    tvl: 88.0,
    change: 12.5,
    users: 510330
  }, {
    id: 5,
    name: 'Mast Oracle',
    cat: 'Infra',
    tvl: 54.7,
    change: 0.6,
    users: 9120
  }],
  txs: [{
    id: 'a1',
    hash: '0x8f2c…91ad',
    type: 'Transfer',
    amount: 1250,
    asset: 'USDC',
    status: 'Confirmed',
    time: '2 min ago',
    fee: '0.0021',
    to: '0x41be…77c0',
    block: 48201993
  }, {
    id: 'a2',
    hash: '0x1b7e…02f4',
    type: 'Swap',
    amount: 3400,
    asset: 'LMN',
    status: 'Confirmed',
    time: '18 min ago',
    fee: '0.0034',
    to: 'Driftline',
    block: 48201870
  }, {
    id: 'a3',
    hash: '0x6d90…ac13',
    type: 'Stake',
    amount: 10000,
    asset: 'LMN',
    status: 'Pending',
    time: '1 h ago',
    fee: '0.0018',
    to: 'Validator 12',
    block: 48201511
  }, {
    id: 'a4',
    hash: '0x3e55…b7d2',
    type: 'Transfer',
    amount: 80,
    asset: 'USDC',
    status: 'Failed',
    time: '3 h ago',
    fee: '0.0009',
    to: '0x9a03…1e6b',
    block: 48200774
  }, {
    id: 'a5',
    hash: '0xc4a1…5f08',
    type: 'Swap',
    amount: 640,
    asset: 'USDC',
    status: 'Confirmed',
    time: 'Yesterday',
    fee: '0.0027',
    to: 'Driftline',
    block: 48190221
  }, {
    id: 'a6',
    hash: '0x77bd…e391',
    type: 'Stake',
    amount: 2500,
    asset: 'LMN',
    status: 'Confirmed',
    time: '2 days ago',
    fee: '0.0016',
    to: 'Validator 04',
    block: 48171008
  }],
  assets: [{
    id: 'lmn',
    sym: 'LMN',
    name: 'Lumen',
    bal: 18240.5,
    price: 1.84,
    color: 'var(--blue-500)'
  }, {
    id: 'usdc',
    sym: 'USDC',
    name: 'USD Coin',
    bal: 9310.0,
    price: 1,
    color: 'var(--blue-200)'
  }, {
    id: 'weth',
    sym: 'WETH',
    name: 'Wrapped Ether',
    bal: 1.42,
    price: 3120,
    color: 'var(--gray-400)'
  }, {
    id: 'hbr',
    sym: 'HBR',
    name: 'Harbor',
    bal: 5200,
    price: 0.31,
    color: 'var(--blue-800)'
  }],
  volume: Array.from({
    length: 30
  }, (_, i) => ({
    label: 'Day ' + (i + 1),
    value: Math.round(22 + Math.pow(Math.sin(i / 5), 2) * 18 + (i > 18 && i < 24 ? (i - 18) * 6 : 0) + i % 3 * 2)
  }))
};
window.fmtUsd = (v, d = 0) => '$' + Number(v).toLocaleString('en-US', {
  minimumFractionDigits: d,
  maximumFractionDigits: d
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/data.js", error: String((e && e.message) || e) }); }

// ui_kits/website/BountyPage.jsx
try { (() => {
const {
  Glow,
  Button,
  Accordion,
  Dialog,
  Input,
  Select,
  Radio,
  Tag
} = window.LumenDesignSystem_12638a;
const TIERS = [{
  title: 'Critical — up to $500,000',
  content: /*#__PURE__*/React.createElement("ol", {
    style: {
      margin: 0,
      paddingLeft: 18,
      display: 'grid',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("li", null, "Theft or permanent freezing of user funds."), /*#__PURE__*/React.createElement("li", null, "Consensus failure that halts the network."))
}, {
  title: 'High — up to $50,000',
  content: /*#__PURE__*/React.createElement("ol", {
    style: {
      margin: 0,
      paddingLeft: 18,
      display: 'grid',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("li", null, "Temporary freezing of funds for more than one hour."), /*#__PURE__*/React.createElement("li", null, "Unintended minting or burning of tokens."))
}, {
  title: 'Medium — up to $10,000',
  content: /*#__PURE__*/React.createElement("ol", {
    style: {
      margin: 0,
      paddingLeft: 18,
      display: 'grid',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("li", null, "A bug that causes unintended contract behaviour with no funds at direct risk."), /*#__PURE__*/React.createElement("li", null, "Shutdown of 30% or more of validator nodes without brute force."))
}, {
  title: 'Low — up to $1,000',
  content: 'Contract fails to deliver promised returns without losing value.'
}];
function BountyPage({
  toast
}) {
  const [open, setOpen] = React.useState(false);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Glow, {
    variant: "grid",
    as: "section",
    style: {
      marginTop: 'calc(-1 * var(--nav-height))',
      minHeight: 'min(80vh, 720px)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap",
    style: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      gap: 24,
      paddingTop: 'calc(var(--nav-height) + 64px)',
      paddingBottom: 72
    }
  }, /*#__PURE__*/React.createElement(Tag, {
    variant: "accent",
    uppercase: true
  }, "Bug bounty"), /*#__PURE__*/React.createElement("h1", {
    className: "d-lg",
    style: {
      maxWidth: 760
    }
  }, "Find bugs. Earn rewards."), /*#__PURE__*/React.createElement("p", {
    className: "t-lg",
    style: {
      maxWidth: 440,
      color: 'var(--text-primary)'
    }
  }, "Earn up to $500K for responsibly disclosing vulnerabilities in the protocol."), /*#__PURE__*/React.createElement("div", {
    className: "btn-row btn-row--stack",
    style: {
      maxWidth: 340,
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    onClick: () => window.scrollTo({
      top: document.getElementById('scope').offsetTop - 64,
      behavior: 'smooth'
    })
  }, "View scope"), /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    variant: "secondary",
    onClick: () => setOpen(true)
  }, "Submit report")))), /*#__PURE__*/React.createElement("section", {
    className: "section",
    id: "scope"
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap split",
    style: {
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("h2", {
    className: "d-2"
  }, "Impacts in scope"), /*#__PURE__*/React.createElement("p", {
    className: "t-md",
    style: {
      maxWidth: 420
    }
  }, "Only the impacts listed here are eligible for payout. Rewards scale with severity and the quality of the proof of concept.")), /*#__PURE__*/React.createElement(Accordion, {
    numbered: true,
    accentOpen: true,
    defaultOpen: ['2'],
    items: TIERS
  }))), /*#__PURE__*/React.createElement(Dialog, {
    open: open,
    onClose: () => setOpen(false),
    title: "Submit a report",
    description: "Reports are encrypted and triaged within 48 hours.",
    footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      onClick: () => setOpen(false)
    }, "Cancel"), /*#__PURE__*/React.createElement(Button, {
      onClick: () => {
        setOpen(false);
        toast({
          tone: 'success',
          title: 'Report submitted',
          description: 'Reference #LB-2041',
          action: {
            label: 'Track status'
          }
        });
      }
    }, "Submit report"))
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(Input, {
    label: "Title",
    placeholder: "Short summary of the issue",
    required: true
  }), /*#__PURE__*/React.createElement("fieldset", {
    style: {
      border: 0,
      padding: 0,
      margin: 0
    }
  }, /*#__PURE__*/React.createElement("legend", {
    className: "lm-field__label",
    style: {
      fontSize: 14,
      fontWeight: 500,
      color: 'var(--text-primary)',
      marginBottom: 6
    }
  }, "Severity"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      columnGap: 20
    }
  }, ['Critical', 'High', 'Medium', 'Low'].map((s, i) => /*#__PURE__*/React.createElement(Radio, {
    key: s,
    name: "sev",
    value: s,
    label: s,
    defaultChecked: i === 2
  })))), /*#__PURE__*/React.createElement(Select, {
    label: "Component",
    options: ['Consensus', 'Execution', 'Bridge', 'Wallet SDK']
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Proof of concept",
    multiline: true,
    rows: 4,
    placeholder: "Steps to reproduce"
  }))));
}
Object.assign(window, {
  BountyPage
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/BountyPage.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/HomePage.jsx
try { (() => {
const {
  Glow,
  Button,
  StatCard,
  Card,
  Tabs,
  BarChart,
  ArrowLink,
  Icon
} = window.LumenDesignSystem_12638a;
const SERIES = {
  Daily: Array.from({
    length: 42
  }, (_, i) => ({
    label: 'Nov ' + (i % 30 + 1),
    value: Math.round(14 + Math.pow(Math.sin(i / 7), 2) * 22 + (i > 26 && i < 34 ? (i - 26) * 7 : 0) + i % 4 * 2)
  })),
  Weekly: Array.from({
    length: 26
  }, (_, i) => ({
    label: 'W' + (i + 1),
    value: Math.round(90 + i * 9 + Math.sin(i) * 30)
  })),
  Monthly: Array.from({
    length: 18
  }, (_, i) => ({
    label: 'M' + (i + 1),
    value: Math.round(300 + i * i * 6 + Math.cos(i) * 60)
  }))
};
function HomeHero({
  go
}) {
  return /*#__PURE__*/React.createElement(Glow, {
    variant: "columns",
    as: "section",
    style: {
      marginTop: 'calc(-1 * var(--nav-height))',
      minHeight: 'min(92vh, 860px)',
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap",
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      gap: 28,
      paddingTop: 120,
      paddingBottom: 48
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "eyebrow"
  }, "Lumen network \xB7 Mainnet"), /*#__PURE__*/React.createElement("h1", {
    className: "d-lg",
    style: {
      maxWidth: 980
    }
  }, "Infrastructure for verifiable software"), /*#__PURE__*/React.createElement("p", {
    className: "t-lg",
    style: {
      maxWidth: 520,
      color: 'var(--text-primary)'
    }
  }, "Build fast, private and transparent applications \u2014 without opaque intermediaries."), /*#__PURE__*/React.createElement("div", {
    className: "btn-row btn-row--stack",
    style: {
      justifyContent: 'center',
      maxWidth: 360
    }
  }, /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    onClick: () => go('program')
  }, "Start building"), /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    variant: "secondary"
  }, "Read the docs"))), /*#__PURE__*/React.createElement("div", {
    className: "wrap",
    style: {
      width: '100%',
      paddingBottom: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "meta-row"
  }, /*#__PURE__*/React.createElement("span", null, "Block 48,201,993"), /*#__PURE__*/React.createElement("span", {
    className: "hide-sm"
  }, "Finality 390ms"), /*#__PURE__*/React.createElement("span", null, "\xA92026"))));
}
function Numbers() {
  return /*#__PURE__*/React.createElement("section", {
    className: "section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "head-row"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "d-2",
    style: {
      maxWidth: 560
    }
  }, "Lumen in numbers"), /*#__PURE__*/React.createElement("span", {
    className: "eyebrow"
  }, "Updated 15 Dec 2025")), /*#__PURE__*/React.createElement("div", {
    className: "grid-4"
  }, /*#__PURE__*/React.createElement(StatCard, {
    variant: "inverse",
    icon: "shield-check",
    label: "Value secured",
    value: "$1.2B",
    caption: "Across 214 applications",
    size: "lg"
  }), /*#__PURE__*/React.createElement(StatCard, {
    variant: "accent",
    icon: "wallet",
    label: "Accounts",
    value: "8.4M",
    caption: "Active in the last 30 days",
    size: "lg"
  }), /*#__PURE__*/React.createElement(StatCard, {
    icon: "zap",
    label: "Finality",
    value: "390ms",
    caption: "Median, last 7 days",
    size: "lg"
  }), /*#__PURE__*/React.createElement(StatCard, {
    icon: "layout-grid",
    label: "Applications",
    value: "214",
    caption: "Live on mainnet",
    delta: {
      value: '+18'
    },
    size: "lg"
  }))));
}
function Throughput() {
  const [range, setRange] = React.useState('Daily');
  return /*#__PURE__*/React.createElement("section", {
    className: "section",
    style: {
      paddingTop: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap split"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "eyebrow"
  }, "Throughput"), /*#__PURE__*/React.createElement("h2", {
    className: "d-3"
  }, "Capacity that scales with demand"), /*#__PURE__*/React.createElement("p", {
    className: "t-md",
    style: {
      maxWidth: 440
    }
  }, "Parallel execution keeps fees flat when activity spikes. Every number here is verifiable on-chain."), /*#__PURE__*/React.createElement(ArrowLink, {
    href: "#"
  }, "Explore network data")), /*#__PURE__*/React.createElement(Card, {
    padding: "md"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: 16,
      flexWrap: 'wrap',
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 24,
      letterSpacing: '-.02em'
    }
  }, "Transactions"), /*#__PURE__*/React.createElement("div", {
    className: "t-sm",
    style: {
      color: 'var(--text-tertiary)',
      marginTop: 4
    }
  }, "Millions per period")), /*#__PURE__*/React.createElement(Tabs, {
    items: ['Daily', 'Weekly', 'Monthly'],
    value: range,
    onChange: setRange,
    label: "Range"
  })), /*#__PURE__*/React.createElement(BarChart, {
    key: range,
    data: SERIES[range],
    height: 240,
    gap: 2,
    format: v => v + 'M',
    label: 'Transactions ' + range,
    xLabels: range === 'Daily' ? ['Nov 1', 'Nov 15', 'Dec 1', 'Dec 15'] : undefined
  }))));
}
const FEATS = [['rocket', 'Ship in days', 'Typed smart contracts, local devnet and one-command deploys shorten the path from idea to mainnet.'], ['box', 'Assets you own', 'State lives in objects with a single owner, so transfers are simple and permissions are explicit.'], ['shield-check', 'Verify everything', 'Proofs and audits are first-class. Users can check what your app does before they sign.']];
function Features() {
  return /*#__PURE__*/React.createElement("section", {
    className: "section",
    style: {
      paddingTop: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "head-row"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "d-2",
    style: {
      maxWidth: 640
    }
  }, "Why teams build on Lumen")), /*#__PURE__*/React.createElement("div", {
    className: "grid-3"
  }, FEATS.map(([ic, t, d]) => /*#__PURE__*/React.createElement("div", {
    key: t,
    className: "feat"
  }, /*#__PURE__*/React.createElement("span", {
    className: "feat__icon"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: ic,
    size: 18
  })), /*#__PURE__*/React.createElement("div", {
    className: "feat__title"
  }, t), /*#__PURE__*/React.createElement("p", {
    className: "t-md"
  }, d))))));
}
function CtaBand({
  go
}) {
  return /*#__PURE__*/React.createElement(Glow, {
    variant: "horizon",
    as: "section",
    style: {
      minHeight: 520,
      display: 'flex',
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap",
    style: {
      width: '100%',
      paddingTop: 'var(--section-y)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement("h2", {
    className: "d-1",
    style: {
      maxWidth: 760
    }
  }, "Start building on Lumen"), /*#__PURE__*/React.createElement("p", {
    className: "t-lg",
    style: {
      maxWidth: 480
    }
  }, "Funding, audits and go-to-market support for teams shipping something new."), /*#__PURE__*/React.createElement("div", {
    className: "btn-row"
  }, /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    onClick: () => go('program'),
    iconRight: "arrow-right"
  }, "Join the program"))));
}
function HomePage({
  go
}) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(HomeHero, {
    go: go
  }), /*#__PURE__*/React.createElement(Numbers, null), /*#__PURE__*/React.createElement(Throughput, null), /*#__PURE__*/React.createElement(Features, null), /*#__PURE__*/React.createElement(CtaBand, {
    go: go
  }));
}
Object.assign(window, {
  HomePage
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/HomePage.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/ProgramPage.jsx
try { (() => {
const {
  Glow,
  Button,
  Card,
  Tag,
  IndexBadge,
  Accordion,
  Dialog,
  Input,
  Select,
  Checkbox,
  Icon
} = window.LumenDesignSystem_12638a;
const CRITERIA = [['New primitives', 'Products that introduce a new way to move, price or protect value — not a fork of something that already exists.'], ['Real usage', 'A credible plan to reach users in the first 90 days, with a clear source of demand.'], ['Durable teams', 'Founders who ship weekly, publish their roadmap and stay accountable to their community.']];
const PERKS = [['coins', 'Up to $250K in grants', 'Milestone-based, paid in stablecoins.'], ['shield-check', 'Audit credits', 'Two independent reviews before mainnet.'], ['send', 'Distribution', 'Placement across Lumen channels from day one.']];
const FAQ = [{
  title: 'When is the deadline to apply?',
  content: 'Applications are reviewed on a rolling basis. Most teams hear back within two weeks.'
}, {
  title: 'Who should apply?',
  content: 'Teams building something that matches the product criteria above. Early is fine — we care about direction and velocity.'
}, {
  title: 'Is this a grant or an investment?',
  content: 'A grant. We take no equity or tokens. Funding is released against milestones you define with us.'
}, {
  title: 'How many teams are accepted?',
  content: 'Around ten per cohort, three cohorts a year.'
}];
function ApplyDialog({
  open,
  onClose,
  onDone
}) {
  return /*#__PURE__*/React.createElement(Dialog, {
    open: open,
    onClose: onClose,
    size: "lg",
    title: "Apply to the Builder Program",
    description: "Takes about five minutes. We'll reply within two weeks.",
    footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      onClick: onClose
    }, "Cancel"), /*#__PURE__*/React.createElement(Button, {
      onClick: onDone
    }, "Submit application"))
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-grid"
  }, /*#__PURE__*/React.createElement(Input, {
    label: "Team name",
    placeholder: "Harbor Labs",
    required: true
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Work email",
    type: "email",
    placeholder: "you@team.xyz",
    required: true
  }), /*#__PURE__*/React.createElement(Select, {
    label: "Stage",
    options: ['Idea', 'Prototype', 'Testnet', 'Mainnet'],
    defaultValue: "Prototype"
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Website or repo",
    placeholder: "github.com/\u2026",
    iconLeft: "link"
  }), /*#__PURE__*/React.createElement(Input, {
    label: "What are you building?",
    multiline: true,
    rows: 4,
    placeholder: "One paragraph is enough.",
    style: {
      gridColumn: '1 / -1'
    }
  }), /*#__PURE__*/React.createElement(Checkbox, {
    label: "I agree to the program terms",
    style: {
      gridColumn: '1 / -1'
    }
  })));
}
function ProgramPage({
  toast
}) {
  const [open, setOpen] = React.useState(false);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Glow, {
    variant: "horizon",
    as: "section",
    style: {
      marginTop: 'calc(-1 * var(--nav-height))',
      minHeight: 'min(86vh, 780px)',
      display: 'flex'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap",
    style: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      gap: 24,
      paddingTop: 'calc(var(--nav-height) + clamp(64px, 12vh, 140px))'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "eyebrow"
  }, "Cohort 04 \xB7 Applications open"), /*#__PURE__*/React.createElement("h1", {
    className: "d-lg",
    style: {
      maxWidth: 820
    }
  }, "Builder Program"), /*#__PURE__*/React.createElement("p", {
    className: "t-lg",
    style: {
      maxWidth: 480,
      color: 'var(--text-primary)'
    }
  }, "Funding, audits and distribution for teams building what's next."), /*#__PURE__*/React.createElement("div", {
    className: "btn-row btn-row--stack",
    style: {
      maxWidth: 340,
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    onClick: () => setOpen(true)
  }, "Apply now"), /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    variant: "secondary"
  }, "Program guide")))), /*#__PURE__*/React.createElement("section", {
    className: "section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap split",
    style: {
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 20,
      position: 'sticky',
      top: 'calc(var(--nav-height) + 24px)'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    className: "d-2"
  }, "What kind of teams?"), /*#__PURE__*/React.createElement("p", {
    className: "t-md",
    style: {
      maxWidth: 420
    }
  }, "We back teams building something meaningfully new \u2014 products that are better versions of existing ones, or that open a category."), /*#__PURE__*/React.createElement(Tag, null, "Product criteria")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, CRITERIA.map(([t, d], i) => /*#__PURE__*/React.createElement(Card, {
    key: t,
    variant: "raised",
    padding: "md"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 14,
      alignItems: 'center',
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement(IndexBadge, {
    value: i + 1
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 18,
      letterSpacing: '-.02em'
    }
  }, t)), /*#__PURE__*/React.createElement("p", {
    className: "t-sm",
    style: {
      paddingLeft: 36
    }
  }, d)))))), /*#__PURE__*/React.createElement("section", {
    className: "section",
    style: {
      paddingTop: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "head-row"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "d-2"
  }, "What you get")), /*#__PURE__*/React.createElement("div", {
    className: "grid-3"
  }, PERKS.map(([ic, t, d]) => /*#__PURE__*/React.createElement("div", {
    key: t,
    className: "feat"
  }, /*#__PURE__*/React.createElement("span", {
    className: "feat__icon"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: ic,
    size: 18
  })), /*#__PURE__*/React.createElement("div", {
    className: "feat__title"
  }, t), /*#__PURE__*/React.createElement("p", {
    className: "t-md"
  }, d)))))), /*#__PURE__*/React.createElement("section", {
    className: "section",
    style: {
      paddingTop: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap split",
    style: {
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    className: "d-2"
  }, "Frequently asked questions"), /*#__PURE__*/React.createElement(Accordion, {
    items: FAQ,
    defaultOpen: ['0']
  }))), /*#__PURE__*/React.createElement(ApplyDialog, {
    open: open,
    onClose: () => setOpen(false),
    onDone: () => {
      setOpen(false);
      toast({
        tone: 'success',
        title: 'Application received',
        description: 'We\'ll reply within two weeks.'
      });
    }
  }));
}
Object.assign(window, {
  ProgramPage
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/ProgramPage.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/ResearchPage.jsx
try { (() => {
const {
  Tabs,
  Card,
  IndexBadge,
  Tag,
  ArrowLink,
  Input
} = window.LumenDesignSystem_12638a;
const PAPERS = [{
  t: 'Parallel execution with owned objects',
  c: 'Consensus',
  d: 'Mar 2025',
  a: 'How single-owner state lets most transactions skip global ordering while preserving safety.'
}, {
  t: 'Economics of a fixed-supply network',
  c: 'Economics',
  d: 'Jan 2025',
  a: 'A model for fees, storage rebates and long-term validator incentives under a capped supply.'
}, {
  t: 'Verifiable off-chain compute',
  c: 'Cryptography',
  d: 'Nov 2024',
  a: 'Attested execution environments that let contracts trust results computed outside the chain.'
}, {
  t: 'Low-latency Byzantine agreement',
  c: 'Consensus',
  d: 'Aug 2024',
  a: 'A DAG-based protocol that reaches finality in under 400ms at global scale.'
}, {
  t: 'Private balances with public audits',
  c: 'Cryptography',
  d: 'May 2024',
  a: 'Confidential transfers that still let regulators verify aggregate supply.'
}, {
  t: 'Storage pricing for permanent data',
  c: 'Economics',
  d: 'Feb 2024',
  a: 'An endowment model for data that must stay available for decades.'
}];
function ResearchPage() {
  const [cat, setCat] = React.useState('All');
  const [q, setQ] = React.useState('');
  const list = PAPERS.filter(p => (cat === 'All' || p.c === cat) && p.t.toLowerCase().includes(q.toLowerCase()));
  return /*#__PURE__*/React.createElement("section", {
    className: "section",
    style: {
      paddingTop: 'clamp(48px, 8vw, 120px)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 20,
      marginBottom: 'var(--stack-y)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "eyebrow"
  }, "Whitepapers & journal articles"), /*#__PURE__*/React.createElement("h1", {
    className: "d-1"
  }, "Research papers")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 12,
      flexWrap: 'wrap',
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement(Tabs, {
    variant: "segmented",
    items: ['All', 'Consensus', 'Cryptography', 'Economics'].map(v => ({
      value: v,
      label: v,
      count: v === 'All' ? PAPERS.length : PAPERS.filter(p => p.c === v).length
    })),
    value: cat,
    onChange: setCat,
    label: "Category"
  }), /*#__PURE__*/React.createElement(Input, {
    iconLeft: "search",
    placeholder: "Search papers",
    size: "sm",
    value: q,
    onChange: e => setQ(e.target.value),
    style: {
      width: 'min(100%, 280px)'
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "grid-2"
  }, list.map((p, i) => /*#__PURE__*/React.createElement(Card, {
    key: p.t,
    padding: "md",
    variant: "raised"
  }, /*#__PURE__*/React.createElement("div", {
    className: "paper"
  }, /*#__PURE__*/React.createElement("div", {
    className: "paper__meta"
  }, /*#__PURE__*/React.createElement(IndexBadge, {
    value: String(PAPERS.indexOf(p) + 1).padStart(2, '0')
  }), /*#__PURE__*/React.createElement("span", {
    className: "eyebrow",
    style: {
      color: 'var(--text-tertiary)'
    }
  }, p.d)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 22,
      letterSpacing: '-.02em',
      lineHeight: 1.15
    }
  }, p.t), /*#__PURE__*/React.createElement("p", {
    className: "t-sm",
    style: {
      flex: 1
    }
  }, p.a), /*#__PURE__*/React.createElement("div", {
    className: "paper__meta"
  }, /*#__PURE__*/React.createElement(ArrowLink, {
    href: "#"
  }, "Read paper"), /*#__PURE__*/React.createElement(Tag, {
    variant: "subtle",
    size: "sm"
  }, p.c)))))), list.length === 0 && /*#__PURE__*/React.createElement("p", {
    className: "t-md",
    style: {
      padding: '48px 0',
      textAlign: 'center'
    }
  }, "No papers match \u201C", q, "\u201D.")));
}
Object.assign(window, {
  ResearchPage
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/ResearchPage.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/SiteChrome.jsx
try { (() => {
const {
  Navbar,
  Wordmark
} = window.LumenDesignSystem_12638a;
const NAV_ITEMS = [{
  label: 'Platform',
  children: [{
    label: 'Overview',
    description: 'How the network works',
    icon: 'layers',
    route: 'home'
  }, {
    label: 'Security',
    description: 'Audits and formal verification',
    icon: 'shield-check'
  }, {
    label: 'Roadmap',
    description: 'What ships next',
    icon: 'git-branch'
  }]
}, {
  label: 'Build',
  children: [{
    label: 'Documentation',
    description: 'Guides, references, tutorials',
    icon: 'book-open'
  }, {
    label: 'Builder Program',
    description: 'Funding and support for new teams',
    icon: 'rocket',
    route: 'program'
  }, {
    label: 'Bug Bounty',
    description: 'Up to $500K for critical findings',
    icon: 'bug',
    route: 'bounty'
  }]
}, {
  label: 'Ecosystem',
  children: [{
    label: 'Apps',
    description: 'Explore live applications',
    icon: 'layout-grid'
  }, {
    label: 'Events',
    description: 'Meetups and summits',
    icon: 'calendar'
  }]
}, {
  label: 'Research',
  route: 'research'
}];
function SiteHeader({
  route,
  go,
  transparent
}) {
  const current = {
    program: 'Build',
    bounty: 'Build',
    research: 'Research'
  }[route];
  return /*#__PURE__*/React.createElement(Navbar, {
    items: NAV_ITEMS,
    current: current,
    variant: transparent ? 'transparent' : 'sticky',
    secondaryAction: {
      label: 'Docs'
    },
    cta: {
      label: 'Start building',
      onClick: () => go('program')
    },
    onNavigate: it => go(it.route || (it.label === 'home' ? 'home' : route))
  });
}
const FOOTER_COLS = [['Platform', ['Overview', 'Security', 'Roadmap', 'Status']], ['Build', ['Docs', 'SDKs', 'Builder Program', 'Bug Bounty']], ['Ecosystem', ['Apps', 'Events', 'Grants']], ['Company', ['About', 'Careers', 'Press kit', 'Contact']]];
function SiteFooter({
  go
}) {
  const routes = {
    'Builder Program': 'program',
    'Bug Bounty': 'bounty',
    Overview: 'home'
  };
  return /*#__PURE__*/React.createElement("footer", {
    className: "footer"
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "footer__cols"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(Wordmark, {
    size: 32
  }), /*#__PURE__*/React.createElement("p", {
    className: "t-sm",
    style: {
      maxWidth: 260
    }
  }, "Infrastructure for verifiable software.")), FOOTER_COLS.map(([h, ls]) => /*#__PURE__*/React.createElement("div", {
    key: h
  }, /*#__PURE__*/React.createElement("div", {
    className: "footer__h"
  }, h), ls.map(l => /*#__PURE__*/React.createElement("a", {
    key: l,
    href: "#",
    className: "footer__l",
    onClick: e => {
      e.preventDefault();
      routes[l] && go(routes[l]);
    }
  }, l))))), /*#__PURE__*/React.createElement("div", {
    className: "meta-row",
    style: {
      marginTop: 64
    }
  }, /*#__PURE__*/React.createElement("span", null, "lumen.network"), /*#__PURE__*/React.createElement("span", {
    className: "hide-sm"
  }, "Privacy \xB7 Terms"), /*#__PURE__*/React.createElement("span", null, "\xA92026"))));
}
Object.assign(window, {
  SiteHeader,
  SiteFooter
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/SiteChrome.jsx", error: String((e && e.message) || e) }); }

__ds_ns.ArrowLink = __ds_scope.ArrowLink;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.ICON_NAMES = __ds_scope.ICON_NAMES;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.IndexBadge = __ds_scope.IndexBadge;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.Wordmark = __ds_scope.Wordmark;

__ds_ns.ICON_PATHS = __ds_scope.ICON_PATHS;

__ds_ns.BarChart = __ds_scope.BarChart;

__ds_ns.DataTable = __ds_scope.DataTable;

__ds_ns.StatCard = __ds_scope.StatCard;

__ds_ns.ValueTag = __ds_scope.ValueTag;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Dialog = __ds_scope.Dialog;

__ds_ns.Toast = __ds_scope.Toast;

__ds_ns.ToastRegion = __ds_scope.ToastRegion;

__ds_ns.Tooltip = __ds_scope.Tooltip;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Radio = __ds_scope.Radio;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.BottomNav = __ds_scope.BottomNav;

__ds_ns.Navbar = __ds_scope.Navbar;

__ds_ns.Sidebar = __ds_scope.Sidebar;

__ds_ns.Tabs = __ds_scope.Tabs;

__ds_ns.Accordion = __ds_scope.Accordion;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Glow = __ds_scope.Glow;

})();
