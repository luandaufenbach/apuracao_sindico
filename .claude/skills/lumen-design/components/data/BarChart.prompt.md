Time-series bar chart in the brand's glowing-column style — volumes, TVL, daily actives.

```jsx
<BarChart data={days} height={220} format={v => '$' + (v / 1e6).toFixed(1) + 'M'} label="Daily volume" />
```

- Pair with `Tabs` (Daily/Weekly/Monthly/All) above it inside a Card.
- Fluid width; on phones keep ≤ 40 bars and height ~180.
