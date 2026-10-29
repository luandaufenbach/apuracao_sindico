# Website UI kit

Responsive marketing site for Lumen. One codebase, desktop → phone, no feature removed on mobile.

**Screens** (click through via the nav / footer / CTAs — route persists in localStorage):
- `HomePage.jsx` — columns-glow hero, "in numbers" StatCards, throughput BarChart with range Tabs, feature list, horizon CTA band.
- `ProgramPage.jsx` — Builder Program: criteria (Tag + numbered cards), perks, FAQ Accordion, **Apply** Dialog (bottom sheet on phones) → success Toast.
- `BountyPage.jsx` — grid-glow hero, severity Accordion (numbered + accentOpen), **Submit report** Dialog with Radio/Select/Input.
- `ResearchPage.jsx` — segmented category filter with counts + live search, numbered paper cards.
- `SiteChrome.jsx` — `SiteHeader` (Navbar: dropdowns ≥1024px, drawer below) and `SiteFooter` (mono └─ tree links).

`site.css` holds page-layout helpers only (container, section rhythm, display type classes, responsive grids). All UI comes from the design-system bundle.

Note: content and the "Lumen" name are placeholders — replace with real copy/brand.
