Desktop app navigation column — icon + label rows, mono section headings, count badges.

```jsx
<Sidebar header={<Wordmark size={20} />} value="overview" onChange={setView}
  items={[{ value: 'overview', label: 'Overview', icon: 'layout-grid' }, { section: 'Assets' }, { value: 'wallets', label: 'Wallets', icon: 'wallet', badge: 3 }]} />
```

- Hide below 1024px and render `BottomNav` with the primary 4–5 items; put the rest in a "More" sheet.
