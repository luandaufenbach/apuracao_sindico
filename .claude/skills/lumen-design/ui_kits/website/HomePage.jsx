const { Glow, Button, StatCard, Card, Tabs, BarChart, ArrowLink, Icon } = window.LumenDesignSystem_12638a;

const SERIES = {
  Daily: Array.from({ length: 42 }, (_, i) => ({ label: 'Nov ' + (i % 30 + 1), value: Math.round(14 + Math.pow(Math.sin(i / 7), 2) * 22 + (i > 26 && i < 34 ? (i - 26) * 7 : 0) + (i % 4) * 2) })),
  Weekly: Array.from({ length: 26 }, (_, i) => ({ label: 'W' + (i + 1), value: Math.round(90 + i * 9 + Math.sin(i) * 30) })),
  Monthly: Array.from({ length: 18 }, (_, i) => ({ label: 'M' + (i + 1), value: Math.round(300 + i * i * 6 + Math.cos(i) * 60) })),
};

function HomeHero({ go }) {
  return (
    <Glow variant="columns" as="section" style={{ marginTop: 'calc(-1 * var(--nav-height))', minHeight: 'min(92vh, 860px)', display: 'flex', flexDirection: 'column' }}>
      <div className="wrap" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', gap: 28, paddingTop: 120, paddingBottom: 48 }}>
        <span className="eyebrow">Lumen network · Mainnet</span>
        <h1 className="d-lg" style={{ maxWidth: 980 }}>Infrastructure for verifiable software</h1>
        <p className="t-lg" style={{ maxWidth: 520, color: 'var(--text-primary)' }}>Build fast, private and transparent applications — without opaque intermediaries.</p>
        <div className="btn-row btn-row--stack" style={{ justifyContent: 'center', maxWidth: 360 }}>
          <Button size="lg" onClick={() => go('program')}>Start building</Button>
          <Button size="lg" variant="secondary">Read the docs</Button>
        </div>
      </div>
      <div className="wrap" style={{ width: '100%', paddingBottom: 24 }}>
        <div className="meta-row"><span>Block 48,201,993</span><span className="hide-sm">Finality 390ms</span><span>©2026</span></div>
      </div>
    </Glow>
  );
}

function Numbers() {
  return (
    <section className="section"><div className="wrap">
      <div className="head-row"><h2 className="d-2" style={{ maxWidth: 560 }}>Lumen in numbers</h2><span className="eyebrow">Updated 15 Dec 2025</span></div>
      <div className="grid-4">
        <StatCard variant="inverse" icon="shield-check" label="Value secured" value="$1.2B" caption="Across 214 applications" size="lg" />
        <StatCard variant="accent" icon="wallet" label="Accounts" value="8.4M" caption="Active in the last 30 days" size="lg" />
        <StatCard icon="zap" label="Finality" value="390ms" caption="Median, last 7 days" size="lg" />
        <StatCard icon="layout-grid" label="Applications" value="214" caption="Live on mainnet" delta={{ value: '+18' }} size="lg" />
      </div>
    </div></section>
  );
}

function Throughput() {
  const [range, setRange] = React.useState('Daily');
  return (
    <section className="section" style={{ paddingTop: 0 }}><div className="wrap split">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <span className="eyebrow">Throughput</span>
        <h2 className="d-3">Capacity that scales with demand</h2>
        <p className="t-md" style={{ maxWidth: 440 }}>Parallel execution keeps fees flat when activity spikes. Every number here is verifiable on-chain.</p>
        <ArrowLink href="#">Explore network data</ArrowLink>
      </div>
      <Card padding="md">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap', marginBottom: 24 }}>
          <div><div style={{ fontSize: 24, letterSpacing: '-.02em' }}>Transactions</div><div className="t-sm" style={{ color: 'var(--text-tertiary)', marginTop: 4 }}>Millions per period</div></div>
          <Tabs items={['Daily', 'Weekly', 'Monthly']} value={range} onChange={setRange} label="Range" />
        </div>
        <BarChart key={range} data={SERIES[range]} height={240} gap={2} format={v => v + 'M'} label={'Transactions ' + range} xLabels={range === 'Daily' ? ['Nov 1', 'Nov 15', 'Dec 1', 'Dec 15'] : undefined} />
      </Card>
    </div></section>
  );
}

const FEATS = [
  ['rocket', 'Ship in days', 'Typed smart contracts, local devnet and one-command deploys shorten the path from idea to mainnet.'],
  ['box', 'Assets you own', 'State lives in objects with a single owner, so transfers are simple and permissions are explicit.'],
  ['shield-check', 'Verify everything', 'Proofs and audits are first-class. Users can check what your app does before they sign.'],
];

function Features() {
  return (
    <section className="section" style={{ paddingTop: 0 }}><div className="wrap">
      <div className="head-row"><h2 className="d-2" style={{ maxWidth: 640 }}>Why teams build on Lumen</h2></div>
      <div className="grid-3">{FEATS.map(([ic, t, d]) => (
        <div key={t} className="feat"><span className="feat__icon"><Icon name={ic} size={18} /></span><div className="feat__title">{t}</div><p className="t-md">{d}</p></div>
      ))}</div>
    </div></section>
  );
}

function CtaBand({ go }) {
  return (
    <Glow variant="horizon" as="section" style={{ minHeight: 520, display: 'flex', alignItems: 'flex-start' }}>
      <div className="wrap" style={{ width: '100%', paddingTop: 'var(--section-y)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 24 }}>
        <h2 className="d-1" style={{ maxWidth: 760 }}>Start building on Lumen</h2>
        <p className="t-lg" style={{ maxWidth: 480 }}>Funding, audits and go-to-market support for teams shipping something new.</p>
        <div className="btn-row"><Button size="lg" onClick={() => go('program')} iconRight="arrow-right">Join the program</Button></div>
      </div>
    </Glow>
  );
}

function HomePage({ go }) {
  return <><HomeHero go={go} /><Numbers /><Throughput /><Features /><CtaBand go={go} /></>;
}

Object.assign(window, { HomePage });
