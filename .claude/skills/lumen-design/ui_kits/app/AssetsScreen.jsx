const { StatCard, Card, DataTable, Button, Dialog, Input, Select } = window.LumenDesignSystem_12638a;

function AssetsScreen({ toast }) {
  const D = window.APP_DATA;
  const [send, setSend] = React.useState(false);
  const total = D.assets.reduce((s, a) => s + a.bal * a.price, 0);
  return (
    <>
      <div className="page-head"><div><h1 className="page-title">Assets</h1><div className="page-sub">Balances held by 0x41be…77c0</div></div>
        <div style={{ display: 'flex', gap: 8 }}><Button variant="secondary" size="sm" iconLeft="arrow-down">Receive</Button><Button size="sm" iconLeft="send" onClick={() => setSend(true)}>Send</Button></div></div>
      <div className="two">
        <StatCard variant="inverse" icon="wallet" label="Total balance" value={fmtUsd(total)} caption="Across 4 assets" size="lg" delta={{ value: '2.4%' }} />
        <Card padding="md">
          <div className="card-title">Allocation</div>
          <div className="alloc">{D.assets.map(a => <span key={a.id} style={{ width: (a.bal * a.price / total * 100) + '%', background: a.color }} />)}</div>
          <div className="legend">{D.assets.map(a => <div key={a.id}><i style={{ background: a.color }} />{a.sym}<b>{Math.round(a.bal * a.price / total * 100)}%</b></div>)}</div>
        </Card>
      </div>
      <Card padding="md">
        <DataTable rows={D.assets} defaultSort={{ key: 'value', dir: 'desc' }} columns={[
          { key: 'name', header: 'Asset', primary: true, render: r => <span className="asset"><span className="asset__sym">{r.sym.slice(0, 3)}</span>{r.name}</span> },
          { key: 'bal', header: 'Balance', align: 'right', mono: true, render: r => r.bal.toLocaleString('en-US') + ' ' + r.sym },
          { key: 'price', header: 'Price', align: 'right', mono: true, render: r => fmtUsd(r.price, 2) },
          { key: 'value', header: 'Value', align: 'right', mono: true, sortValue: r => r.bal * r.price, render: r => fmtUsd(r.bal * r.price) },
        ]} />
      </Card>
      <Dialog open={send} onClose={() => setSend(false)} title="Send assets" size="sm"
        footer={<><Button variant="ghost" onClick={() => setSend(false)}>Cancel</Button><Button onClick={() => { setSend(false); toast({ tone: 'success', title: 'Transaction sent', description: 'Finalized in 390ms', action: { label: 'View tx' } }); }}>Review & send</Button></>}>
        <div style={{ display: 'grid', gap: 16 }}>
          <Select label="Asset" options={D.assets.map(a => ({ value: a.id, label: a.sym + ' — ' + a.bal.toLocaleString('en-US') }))} />
          <Input label="Recipient" placeholder="0x… or name.lmn" iconLeft="user" />
          <Input label="Amount" placeholder="0.00" inputMode="decimal" suffix="MAX" hint="Network fee ≈ 0.002 LMN" />
        </div>
      </Dialog>
    </>
  );
}

Object.assign(window, { AssetsScreen });
