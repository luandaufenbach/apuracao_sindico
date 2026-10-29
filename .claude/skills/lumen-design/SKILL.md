---
name: lumen-design
description: Use this skill to generate well-branded interfaces and assets for Lumen, either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the readme.md file within this skill, and explore the other available files.
If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.
If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

Quick map:
- `styles.css` → all tokens (`tokens/*.css`) + fonts. Dark is default; add `data-theme="light"` on any ancestor for light.
- `components/<group>/<Name>.jsx|.d.ts|.prompt.md` → React primitives (Button, Navbar, DataTable, Dialog, Glow…).
- `ui_kits/website`, `ui_kits/app` → full responsive screens to copy patterns from.
- `assets/icons/` → Lucide SVGs (1.5px stroke). No logo exists — use the Wordmark (brand name in Geist).
- Rules of thumb: black canvas, one blue (#298DFF; #1A6FE0 under white text), grain-textured glow backgrounds, 2px/4px corners, regular-weight Geist with tight tracking, Geist Mono UPPERCASE for labels, no emoji, mobile parity for every feature.
