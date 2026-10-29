Line icon from the bundled Lucide subset — use for every glyph in UI (never emoji or hand-drawn SVG).

```jsx
<Icon name="chart-line" size={20} />
<Icon name="wallet" title="Wallet" />
```

- Inherits `currentColor`; size 16 inline with 14px text, 20 default, 24 in nav bars.
- Brand pattern: put icons inside a solid blue square (`IconButton variant="primary"` or a 24–32px `--surface-accent` box) for feature lists and card headers.
- Available names: see `ICON_NAMES` (65 icons copied to `assets/icons/`).
