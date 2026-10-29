Responsive data table — desktop table with sortable mono headers, mobile card list that keeps every field and sorting.

```jsx
<DataTable
  columns={[
    { key: 'name', header: 'Protocol', primary: true },
    { key: 'tvl', header: 'TVL', align: 'right', mono: true, render: r => fmt(r.tvl) },
    { key: 'status', header: 'Status', render: r => <Badge tone="success">{r.status}</Badge> },
  ]}
  rows={rows}
  onRowClick={open}
/>
```
