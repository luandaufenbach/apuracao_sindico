# Lumen Design System

> **Working name.** "Lumen" is a placeholder brand. Swap the name in `components/core/Wordmark.jsx` (and copy) once the real product name/logo exist.

A dark-first, technical design system for a modern infrastructure / fintech-style product: deep black canvases, one electric blue, light that emerges from darkness with film grain, near-square geometry, and a grotesk + mono type pairing. Built **mobile-complete**: every desktop capability has a phone equivalent (drawer nav, bottom tabs, card-mode tables, bottom-sheet dialogs) — layout adapts, features never disappear.

## Sources

The direction was derived from 8 reference images uploaded to `uploads/` — a third-party agency case study (Holographik × Sui, "Design System Archive", ©2026): moodboard grid, type scale sheet (TWK Everett), gradient specs (Gradient 03/04: radial, grain soft-light, blue color overlay), mobile web screens, data-viz tiles.

**Important:** those images depict another company's brand. This system reuses only the *general aesthetic vocabulary* (palette mood, gradients, type scale structure, layout rhythm). Their logo, wordmark, name and product copy were **not** reproduced. No codebase or Figma file was provided, so every value here is interpreted from screenshots.

---

## CONTENT FUNDAMENTALS

**Voice:** confident, precise, quietly technical. Short declarative claims, then one plain-language line of support. Never hype-y, never cute.

- **Headlines**: 2–6 words, sentence case, no terminal punctuation unless a two-beat line ("Find bugs. Earn rewards."). E.g. *Infrastructure for verifiable software*, *Capacity that scales with demand*, *What kind of teams?*
- **Sub-copy**: one sentence, ≤ 20 words, concrete benefit. *"Build fast, private and transparent applications — without opaque intermediaries."*
- **Person**: address the reader as **you**, the company as **we** ("We back teams building something meaningfully new"). Product name in third person ("Why teams build on Lumen").
- **Casing**: Sentence case everywhere (buttons, titles, menu items). **UPPERCASE only in mono** — eyebrows, tabs, table headers, meta rows (`LUMEN NETWORK · MAINNET`, `DAILY WEEKLY MONTHLY`).
- **Buttons**: verb-first, 1–3 words: *Get started, Start building, Apply now, Submit report, Read docs, View in explorer*.
- **Numbers are heroes**: big values with a short caption — *$1.2B / Across 214 applications*, *8.4M / Active in the last 30 days*. Use tabular mono for data in tables/tags; `▲ $25.14M` style callouts.
- **Meta labels**: mono, colon or middot separated — `OVERVIEW:`, `UPDATED 15 DEC 2025`, `©2026`.
- **Lists**: numbered (IndexBadge 1, 2, 3) for criteria/steps; tree glyph `└─` for nav/footer link lists.
- **Emoji**: never. **Exclamation marks**: avoid (one "Thank you!" sign-off at most).
- **Jargon**: allowed when the audience is technical, but always followed by a plain explanation.

---

## VISUAL FOUNDATIONS

**Color.** Black (`#000`) canvas; cool slate grays (`#C3C8D0` → `#0A0B0D`); a single core blue `#298DFF` (blue-500) with a 50–950 scale. White is used as a *surface* (inverse cards, secondary buttons) for rhythm. Blue-600 `#1A6FE0` is the fill for anything carrying white text (4.78:1, AA); blue-500 is for glow, icons, links on dark, large display. Semantic green/amber/red appear only for status. No purple, no multi-hue gradients. Light theme (`[data-theme="light"]`) mirrors every alias.

**Type.** Geist (sub. for TWK Everett) regular weight for everything from body to display — hierarchy comes from size and tight negative tracking (−4.5% display, −3.5% headlines, −1% body), not weight. Geist Mono (sub. for TWK Everett Mono) for labels, tabs, tags, numbers, meta. Display sizes are fluid `clamp()` tokens (`--fs-display-lg` 48→96px, `--fs-h1` 40→68px). Body never below 14px on mobile; inputs are 16px (no iOS zoom).

**Backgrounds.** The signature is **light emerging from darkness**: radial "horizon" glows rising from the bottom edge, "halo" arcs from the top, vertical blue column bands with a dot field, horizontal steel bars (black → blue → silver). Always with **film grain** (SVG fractal noise, soft-light, ~18%). Full-bleed, edge-to-edge. Secondary textures: 16px dot grid, 40px line grid (masked radially). No photography required; if used, it's cool, blue-lit, high-contrast (stage/event lighting).

**Layout.** 12-col grid, max 1280px container, fluid gutter 16→40px, section rhythm 64→160px. Big headline left / content right "split" layouts; centered hero stacks. Meta rows pinned to the corners of hero frames (mono, uppercase). Sticky blurred nav (72% black + 16px blur).

**Corners.** Near-square: **2px** controls/tags, **4px** cards, **10px** sheets/dialogs. Round only for radio, switch, status dots. Never pill buttons.

**Cards.** Dark: `surface-1` (#0A0B0D) + 1px hairline (white 8%); raised = `surface-2` (#111316). No drop shadows on dark — depth comes from surface steps. Inverse (white) and accent (blue) cards create rhythm in stat grids. "Glow" card = horizon gradient + grain, max one per view. No colored left-border cards.

**Borders.** 1px, white at 8% / 14% / 28% (subtle/default/strong). Drawn as inset box-shadows so they don't shift layout.

**Shadows & glow.** Overlays (menus, dialogs, toasts) get a deep soft shadow + hairline. Brand "elevation" is **glow**: `0 0 16px rgba(41,141,255,.35)` + 1px blue ring on primary hover, active switch, active bottom-tab indicator, highlighted chart bars.

**Transparency & blur.** Only on sticky chrome (nav, bottom tabs: 72–88% black + blur) and modal scrims (72% black + 6px blur). Never on content cards.

**Motion.** Quick and decelerating: `--ease-out` (.2,.8,.2,1) at 140–220ms for hovers; `--ease-emphasized` (.16,1,.3,1) at 360ms for accordions, sheets, switch thumbs. Fades + small 4–8px translates. No bounce, no spring overshoot. `prefers-reduced-motion` disables all.

**Hover.** Primary: glow ring. Secondary/white: → gray-100. Outline/ghost: 8% white fill + stronger border. Links: underline. Cards: hairline goes to 28% (dark) or glow (accent/glow cards). Nav text: gray-300 → white.

**Press.** 1px translateY on buttons; primary fill darkens to blue-700. No scale-shrink.

**Focus.** Always visible: 2px canvas gap + 2px blue-400 ring (`--focus-shadow`).

**Iconography containers.** Feature and header icons sit in solid blue 24–32px squares (white glyph); nav chevrons in tiny 16px gray squares.

---

## ICONOGRAPHY

- **System:** [Lucide](https://lucide.dev) line icons (ISC) — 24px grid, **1.5px stroke**, round caps/joins, `currentColor`. Closest CDN match to the thin geometric line icons in the references (chart-line, wallet, rocket, infinity). *Substitution — no icon files were provided.*
- **Files:** 65 SVGs copied to `assets/icons/`; the same paths are embedded in `components/core/iconPaths.js` and rendered via `<Icon name="…" />` (see `ICON_NAMES`).
- **Sizes:** 14–16 inline with small text, 18–20 default, 22–24 in nav/tab bars. Stroke 1.75–2.25 only under 16px.
- **Containers:** blue square (feature lists, stat card headers, ArrowLink), gray square (nav chevrons, accordion +/−), white square (inverse icon buttons).
- **Unicode as icons:** yes, sparingly and in mono only — `▲ ▼` for value direction, `└─` for tree links, `·` as separator, `⌘K` shortcut hints, `↑ ↓` in sort options.
- **Emoji:** never. **Logos:** none supplied — the wordmark is set in type (`<Wordmark />`); do not draw one.
- **Illustration:** none supplied. The references show isometric wireframe line art and 3D renders; if needed, request real assets rather than drawing SVGs.

---

## RESPONSIVE & ACCESSIBILITY PRINCIPLES

Breakpoints: **640** (phone), **768** (tablet portrait), **1024** (desktop nav/sidebar), **1280** (container max).

| Desktop | Phone equivalent (nothing removed) |
|---|---|
| Navbar dropdowns | Full-screen drawer, accordion groups, full-width CTAs |
| Sidebar | BottomNav (≤5 items, safe-area aware) |
| Sortable table | Card list with every field + "Sort by" select |
| Centered dialog | Bottom sheet, drag handle, stacked full-width actions |
| Toasts bottom-right | Full-width toasts lifted above the tab bar |
| Hover tooltip | Info also present in visible text/labels |

- Touch targets ≥ 44px on coarse pointers (buttons, icon buttons, tabs, checkboxes auto-grow).
- Text contrast ≥ 4.5:1 (secondary text gray-300 on black ≈ 8:1; tertiary gray-500 ≈ 4.7:1).
- Status never by color alone (Badge always has a label). Tabs support arrow keys; dialogs trap Esc + return focus; accordions use `aria-expanded`/regions.

---

## INDEX

**Root**
- `styles.css` — entry point (imports only) → `tokens/fonts.css`, `colors.css`, `typography.css`, `spacing.css`, `effects.css`, `base.css`
- `fonts/` — Geist + Geist Mono variable woff2 (latin, latin-ext, mono symbols)
- `assets/icons/` — 65 Lucide SVGs
- `guidelines/` — foundation specimen cards (Colors, Type, Spacing, Effects, Brand)
- `components/` — React primitives (below), one `*.card.html` per folder
- `ui_kits/website/` — responsive marketing site (Home, Builder Program, Bug Bounty, Research)
- `ui_kits/app/` — responsive dashboard (Overview, Activity, Assets, Settings, light/dark toggle)
- `scratch/dev-bundle.jsx` — dev-only fallback the UI kits load if `_ds_bundle.js` is missing
- `SKILL.md` — Agent Skill entry point · `thumbnail.html` — project tile

## Components

- **core/** — Button, IconButton, Icon, Tag, IndexBadge, ArrowLink, Wordmark
- **forms/** — Input, Select, Checkbox, Radio, Switch
- **navigation/** — Navbar, Tabs, Sidebar, BottomNav
- **surfaces/** — Card, Accordion, Glow
- **data/** — StatCard, BarChart, ValueTag, DataTable
- **feedback/** — Badge, Dialog, Toast, ToastRegion, Tooltip

Each has `<Name>.jsx`, `<Name>.d.ts` (props contract), `<Name>.prompt.md` (usage). Styles are CSS custom properties; components that need hover/media queries inject one prefixed (`lm-`) stylesheet via `core/injectStyles.js`.

### Intentional additions
No source defined a component inventory, so a standard set was authored, shaped by patterns visible in the references (boxed-chevron nav, numbered criteria, +/− accordions, mono range tabs, ▲ value tags, glowing column charts). Extras beyond the standard list:
- **Wordmark** — no logo supplied; one place to swap the brand mark.
- **Glow** — the brand's core visual device, packaged so it's applied consistently.
- **IndexBadge, ArrowLink, ValueTag** — recurring reference motifs.
- **Sidebar, BottomNav, DataTable, ToastRegion** — required for the mobile-complete requirement.

## Caveats
- Fonts are substitutes (Geist / Geist Mono for TWK Everett / TWK Everett Mono — commercial, by Weltkern). Everett's single-storey "a" is not replicated.
- Type-scale values were read from a low-res screenshot; a few headline steps were normalised into a monotonic scale.
- Icons are a Lucide substitution.
