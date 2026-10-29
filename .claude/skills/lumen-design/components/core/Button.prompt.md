Text button for actions and CTAs — one `primary` per view, pair with `secondary` (white) for the second action.

```jsx
<Button variant="primary" iconRight="arrow-right">Get started</Button>
<Button variant="secondary">Read the docs</Button>
<Button variant="outline" size="sm" iconLeft="download">Export CSV</Button>
```

- Variants: primary (blue-600 fill, glow on hover), secondary (white on dark / black on light), outline, ghost, danger.
- Sizes sm/md/lg = 32/40/48px; sm & md auto-expand to 44px on touch screens.
- `fullWidth` on mobile CTAs and sheet footers. `loading` swaps the left icon for a spinner and disables.
- Sentence case labels, 1–3 words. No ALL CAPS on buttons (that's for mono tabs/eyebrows).
