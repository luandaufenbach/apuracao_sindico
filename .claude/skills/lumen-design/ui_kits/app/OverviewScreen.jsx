const { StatCard, Card, Tabs, BarChart, DataTable, Badge, Dialog, Button, ArrowLink } = window.LumenDesignSystem_12638a;

function AppDetail({ app, onClose }) {
  return (
    <Dialog open={!!app} onClose={onClose} title={app && app.name} description={app && app.cat + ' · Live on mainnet'}
      footer={<><Button variant="ghost" onClick={onClose}>Close</Button><Button iconRight="arrow-up-right">Open app</Button></>}>
      {app && <div>
        <div className="kv"><span className="kv__k">TVL</span><span className="kv__v">{`${fmtUsd(app.tvl, 1)}M`}</span></div>
        <div className="kv"><span className="kv__k">7d change</span><span className="kv__v" style={{ color: app.change < 0 ? 'var(--red-400)' : 'var(--green-400)' }}>{`${app.change > 0 ? '+' : ''}${app.change}%`}</span></div>
        <div className="kv"><span className="kv__k">Users</span><span className="kv__v">{app.users.toLocaleString('en-US')}</span></div>
      </div>}
    </Dialog>
  );
}

function OverviewScreen({ go }) {
  const [range, setRange] = React.useState('30D');
  const [sel, setSel] = React.useState(null);
  const D = window.APP_DATA;
  return (
    <>
      <div className="page-head">
        <div><h1 className="page-title">Overview</h1><div className="page-sub">Network health and your applications</div></div>
        <Tabs variant="segmented" items={['7D', '30D', '90D', 'All']} value={range} onChange={setRange} label="Range" />
      </div>
      <div className="stats">
        <StatCard variant="accent" icon="shield-check" label="Value secured" value="$1.24B" caption={'Last ' + range} delta={{ value: '4.2%' }} />
        <StatCard icon="activity" label="Transactions" value="912M" caption="Cumulative" delta={{ value: '12%' }} />
        <StatCard icon="zap" label="Finality" value="390ms" caption="Median" />
        <StatCard icon="user" label="Active accounts" value="8.4M" caption="30-day" delta={{ value: '0.8%', direction: 'down' }} />
      </div>
      <div className="two">
        <Card padding="md">
          <div className="card-head"><div><div className="card-title">Daily volume</div><div className="page-sub" style={{ marginTop: 4 }}>USD, millions</div></div><Tabs items={['Daily', 'Weekly', 'Monthly']} label="Granularity" /></div>
          <BarChart data={D.volume} height={220} format={v => '$' + v + 'M'} xLabels={['Nov 16', 'Nov 26', 'Dec 6', 'Dec 15']} label="Daily volume" />
        </Card>
        <Card padding="md">
          <div className="card-head"><div className="card-title">Your activity</div><ArrowLink onClick={() => go('activity')}>View all</ArrowLink></div>
          {D.txs.slice(0, 4).map(t => (
            <div key={t.id} className="kv"><span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}><span>{t.type}</span><span className="kv__k" style={{ fontSize: 10 }}>{t.time}</span></span>
              <span className="kv__v">{`${t.amount.toLocaleString('en-US')} ${t.asset}`} <Badge tone={t.status === 'Confirmed' ? 'success' : t.status === 'Pending' ? 'warning' : 'danger'} dot>{t.status}</Badge></span></div>
          ))}
        </Card>
      </div>
      <Card padding="md">
        <div className="card-head"><div className="card-title">Top applications</div><span className="eyebrow">By TVL</span></div>
        <DataTable rows={D.apps} onRowClick={setSel} defaultSort={{ key: 'tvl', dir: 'desc' }} columns={[
          { key: 'name', header: 'Application', primary: true },
          { key: 'cat', header: 'Category' },
          { key: 'tvl', header: 'TVL', align: 'right', mono: true, render: r => fmtUsd(r.tvl, 1) + 'M' },
          { key: 'change', header: '7D', align: 'right', mono: true, render: r => <span style={{ color: r.change < 0 ? 'var(--red-400)' : 'var(--green-400)' }}>{r.change > 0 ? '+' : ''}{r.change}%</span> },
          { key: 'users', header: 'Users', align: 'right', mono: true, render: r => r.users.toLocaleString('en-US') },
        ]} />
      </Card>
      <AppDetail app={sel} onClose={() => setSel(null)} />
    </>
  );
}

Object.assign(window, { OverviewScreen });
