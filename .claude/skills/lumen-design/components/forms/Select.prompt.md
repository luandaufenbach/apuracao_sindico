Dropdown choice built on the native <select> — keeps the OS picker on phones.

```jsx
<Select label="Network" options={['Mainnet', 'Testnet', 'Devnet']} defaultValue="Mainnet" />
<Select size="sm" options={[{ value: '7d', label: 'Last 7 days' }]} />
```

- 2–3 options? Prefer `Tabs variant="segmented"` or `Radio` so choices are visible.
