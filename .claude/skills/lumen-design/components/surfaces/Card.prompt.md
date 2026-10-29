Generic content container — feature tiles, research entries, settings groups.

```jsx
<Card padding="lg"><h3>Title</h3><p>Body</p><ArrowLink>Read docs</ArrowLink></Card>
<Card variant="glow" padding="lg" href="/launch">…</Card>
<Card variant="inverse">…</Card>
```

- Interactive cards get a strong hairline on hover (dark) or glow (accent/glow). Don't nest cards.
- Use `accent` / `glow` at most once per view — they're the "lit" element.
