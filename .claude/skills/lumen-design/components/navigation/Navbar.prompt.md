Marketing/site header that collapses into a full-screen drawer on tablets and phones — every desktop link stays reachable on mobile.

```jsx
<Navbar
  items={[
    { label: 'Platform', children: [{ label: 'Overview', description: 'How the network works', icon: 'layers' }] },
    { label: 'Developers', children: [{ label: 'Docs' }, { label: 'SDKs' }] },
    { label: 'Blog', href: '/blog' },
  ]}
  secondaryAction={{ label: 'Sign in' }}
  cta={{ label: 'Get started' }}
/>
```

- `variant="transparent"` over a Glow hero; default sticky bar uses 72% black + backdrop blur.
- Drawer lists children as mono "└─" tree links (brand detail).
