Positions toasts consistently across breakpoints; render once near the app root.

```jsx
<ToastRegion offsetBottom={64}>{toasts.map(t => <Toast key={t.id} {...t} />)}</ToastRegion>
```
