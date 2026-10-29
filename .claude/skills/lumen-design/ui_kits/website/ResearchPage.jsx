const { Tabs, Card, IndexBadge, Tag, ArrowLink, Input } = window.LumenDesignSystem_12638a;

const PAPERS = [
  { t: 'Parallel execution with owned objects', c: 'Consensus', d: 'Mar 2025', a: 'How single-owner state lets most transactions skip global ordering while preserving safety.' },
  { t: 'Economics of a fixed-supply network', c: 'Economics', d: 'Jan 2025', a: 'A model for fees, storage rebates and long-term validator incentives under a capped supply.' },
  { t: 'Verifiable off-chain compute', c: 'Cryptography', d: 'Nov 2024', a: 'Attested execution environments that let contracts trust results computed outside the chain.' },
  { t: 'Low-latency Byzantine agreement', c: 'Consensus', d: 'Aug 2024', a: 'A DAG-based protocol that reaches finality in under 400ms at global scale.' },
  { t: 'Private balances with public audits', c: 'Cryptography', d: 'May 2024', a: 'Confidential transfers that still let regulators verify aggregate supply.' },
  { t: 'Storage pricing for permanent data', c: 'Economics', d: 'Feb 2024', a: 'An endowment model for data that must stay available for decades.' },
];

function ResearchPage() {
  const [cat, setCat] = React.useState('All');
  const [q, setQ] = React.useState('');
  const list = PAPERS.filter(p => (cat === 'All' || p.c === cat) && p.t.toLowerCase().includes(q.toLowerCase()));
  return (
    <section className="section" style={{ paddingTop: 'clamp(48px, 8vw, 120px)' }}><div className="wrap">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 'var(--stack-y)' }}>
        <span className="eyebrow">Whitepapers & journal articles</span>
        <h1 className="d-1">Research papers</h1>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 24 }}>
        <Tabs variant="segmented" items={['All', 'Consensus', 'Cryptography', 'Economics'].map(v => ({ value: v, label: v, count: v === 'All' ? PAPERS.length : PAPERS.filter(p => p.c === v).length }))} value={cat} onChange={setCat} label="Category" />
        <Input iconLeft="search" placeholder="Search papers" size="sm" value={q} onChange={e => setQ(e.target.value)} style={{ width: 'min(100%, 280px)' }} />
      </div>
      <div className="grid-2">{list.map((p, i) => (
        <Card key={p.t} padding="md" variant="raised"><div className="paper">
          <div className="paper__meta"><IndexBadge value={String(PAPERS.indexOf(p) + 1).padStart(2, '0')} /><span className="eyebrow" style={{ color: 'var(--text-tertiary)' }}>{p.d}</span></div>
          <div style={{ fontSize: 22, letterSpacing: '-.02em', lineHeight: 1.15 }}>{p.t}</div>
          <p className="t-sm" style={{ flex: 1 }}>{p.a}</p>
          <div className="paper__meta"><ArrowLink href="#">Read paper</ArrowLink><Tag variant="subtle" size="sm">{p.c}</Tag></div>
        </div></Card>
      ))}</div>
      {list.length === 0 && <p className="t-md" style={{ padding: '48px 0', textAlign: 'center' }}>No papers match “{q}”.</p>}
    </div></section>
  );
}

Object.assign(window, { ResearchPage });
