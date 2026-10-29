Square icon-only button — the dark "hamburger" square, accordion +/− toggles, close buttons, toolbars.

```jsx
<IconButton icon="menu" label="Open menu" />
<IconButton icon="plus" label="Expand" variant="inverse" size="xs" />
<IconButton icon="x" label="Close" variant="ghost" />
```

- Always pass `label` (screen readers + tooltip).
- Stays square (2px radius) — never circular.
