Mobile app tab bar — the phone counterpart of Sidebar. 4–5 destinations, icon + short label.

```jsx
<BottomNav value={view} onChange={setView} items={[
  { value: 'overview', label: 'Overview', icon: 'layout-grid' },
  { value: 'activity', label: 'Activity', icon: 'activity', badge: 2 },
  { value: 'more', label: 'More', icon: 'ellipsis' },
]} />
```

- Add bottom padding (`--tabbar-height`) to page content so nothing hides behind it.
