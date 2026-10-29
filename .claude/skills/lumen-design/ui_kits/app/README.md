# App UI kit

Responsive dashboard ("Lumen app"). Same features on every breakpoint — layout adapts, nothing is removed.

| ≥1024px | <1024px |
|---|---|
| `Sidebar` + top bar with search field | Top bar with wordmark + search icon, `BottomNav` (same 4 destinations) |
| `DataTable` as sortable table | `DataTable` as stacked cards + sort select |
| `Dialog` centred | `Dialog` bottom sheet, stacked full-width actions |
| Toasts bottom-right | Toasts full-width above the tab bar |

**Screens** (state persists in localStorage):
- `OverviewScreen.jsx` — range segmented tabs, 4 StatCards, volume BarChart, recent activity list, top-apps DataTable → detail Dialog.
- `ActivityScreen.jsx` — underline type filters with counts, search, transactions DataTable → tx Dialog (copy hash with Tooltip → Toast).
- `AssetsScreen.jsx` — balance StatCard, allocation bar, assets table, **Send** Dialog → Toast.
- `SettingsScreen.jsx` — profile form, notification Switches, theme Radio (**toggles `data-theme="light"` live**), danger zone.
- `AppShell.jsx` — Sidebar / top bar / BottomNav composition. `data.js` — fake data + `fmtUsd`.
