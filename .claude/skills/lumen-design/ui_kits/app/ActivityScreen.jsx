const { Tabs, Input, DataTable, Badge, Dialog, Button, IconButton, Tooltip, Card } = window.LumenDesignSystem_12638a;

const TONE = { Confirmed: 'success', Pending: 'warning', Failed: 'danger' };

function TxDialog({ tx, onClose, toast }) {
  const copy = () => { navigator.clipboard && navigator.clipboard.writeText(tx.hash).catch(() => {}); toast({ tone: 'success', title: 'Hash copied' }); };
  return (
    <Dialog open={!!tx} onClose={onClose} title={tx && tx.type} description={tx && tx.time}
      footer={<><Button variant="ghost" onClick={onClose}>Close</Button><Button variant="secondary" iconRight="arrow-up-right">View in explorer</Button></>}>
      {tx && <div>
        <div className="kv"><span className="kv__k">Status</span><Badge tone={TONE[tx.status]}>{tx.status}</Badge></div>
        <div className="kv"><span className="kv__k">Hash</span><span className="kv__v"><span>{tx.hash}</span><Tooltip content="Copy hash"><IconButton icon="copy" label="Copy hash" variant="ghost" size="xs" onClick={copy} /></Tooltip></span></div>
        <div className="kv"><span className="kv__k">Amount</span><span className="kv__v">{`${tx.amount.toLocaleString('en-US')} ${tx.asset}`}</span></div>
        <div className="kv"><span className="kv__k">To</span><span className="kv__v">{tx.to}</span></div>
        <div className="kv"><span className="kv__k">Fee</span><span className="kv__v">{`${tx.fee} LMN`}</span></div>
        <div className="kv"><span className="kv__k">Block</span><span className="kv__v">{tx.block.toLocaleString('en-US')}</span></div>
      </div>}
    </Dialog>
  );
}

function ActivityScreen({ toast }) {
  const D = window.APP_DATA;
  const [type, setType] = React.useState('All');
  const [q, setQ] = React.useState('');
  const [sel, setSel] = React.useState(null);
  const types = ['All', 'Transfer', 'Swap', 'Stake'];
  const rows = D.txs.filter(t => (type === 'All' || t.type === type) && (t.hash + t.to).toLowerCase().includes(q.toLowerCase()));
  return (
    <>
      <div className="page-head"><div><h1 className="page-title">Activity</h1><div className="page-sub">Every transaction from this account</div></div><Button variant="outline" size="sm" iconLeft="download">Export CSV</Button></div>
      <div className="toolbar">
        <Tabs variant="underline" items={types.map(t => ({ value: t, label: t === 'All' ? 'All' : t + 's', count: t === 'All' ? D.txs.length : D.txs.filter(x => x.type === t).length }))} value={type} onChange={setType} label="Type" />
        <Input iconLeft="search" placeholder="Hash or address" size="sm" value={q} onChange={e => setQ(e.target.value)} style={{ width: 'min(100%, 260px)' }} />
      </div>
      <DataTable rows={rows} onRowClick={setSel} empty="No transactions match these filters" columns={[
        { key: 'hash', header: 'Hash', mono: true, primary: true },
        { key: 'type', header: 'Type' },
        { key: 'amount', header: 'Amount', align: 'right', mono: true, render: r => r.amount.toLocaleString('en-US') + ' ' + r.asset },
        { key: 'status', header: 'Status', render: r => <Badge tone={TONE[r.status]}>{r.status}</Badge> },
        { key: 'time', header: 'Time', sortable: false, render: r => <span style={{ color: 'var(--text-secondary)' }}>{r.time}</span> },
      ]} />
      <TxDialog tx={sel} onClose={() => setSel(null)} toast={toast} />
    </>
  );
}

Object.assign(window, { ActivityScreen });
