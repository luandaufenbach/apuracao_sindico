const { Glow, Button, Card, Tag, IndexBadge, Accordion, Dialog, Input, Select, Checkbox, Icon } = window.LumenDesignSystem_12638a;

const CRITERIA = [
  ['New primitives', 'Products that introduce a new way to move, price or protect value — not a fork of something that already exists.'],
  ['Real usage', 'A credible plan to reach users in the first 90 days, with a clear source of demand.'],
  ['Durable teams', 'Founders who ship weekly, publish their roadmap and stay accountable to their community.'],
];
const PERKS = [
  ['coins', 'Up to $250K in grants', 'Milestone-based, paid in stablecoins.'],
  ['shield-check', 'Audit credits', 'Two independent reviews before mainnet.'],
  ['send', 'Distribution', 'Placement across Lumen channels from day one.'],
];
const FAQ = [
  { title: 'When is the deadline to apply?', content: 'Applications are reviewed on a rolling basis. Most teams hear back within two weeks.' },
  { title: 'Who should apply?', content: 'Teams building something that matches the product criteria above. Early is fine — we care about direction and velocity.' },
  { title: 'Is this a grant or an investment?', content: 'A grant. We take no equity or tokens. Funding is released against milestones you define with us.' },
  { title: 'How many teams are accepted?', content: 'Around ten per cohort, three cohorts a year.' },
];

function ApplyDialog({ open, onClose, onDone }) {
  return (
    <Dialog open={open} onClose={onClose} size="lg" title="Apply to the Builder Program" description="Takes about five minutes. We'll reply within two weeks."
      footer={<><Button variant="ghost" onClick={onClose}>Cancel</Button><Button onClick={onDone}>Submit application</Button></>}>
      <div className="form-grid">
        <Input label="Team name" placeholder="Harbor Labs" required />
        <Input label="Work email" type="email" placeholder="you@team.xyz" required />
        <Select label="Stage" options={['Idea', 'Prototype', 'Testnet', 'Mainnet']} defaultValue="Prototype" />
        <Input label="Website or repo" placeholder="github.com/…" iconLeft="link" />
        <Input label="What are you building?" multiline rows={4} placeholder="One paragraph is enough." style={{ gridColumn: '1 / -1' }} />
        <Checkbox label="I agree to the program terms" style={{ gridColumn: '1 / -1' }} />
      </div>
    </Dialog>
  );
}

function ProgramPage({ toast }) {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Glow variant="horizon" as="section" style={{ marginTop: 'calc(-1 * var(--nav-height))', minHeight: 'min(86vh, 780px)', display: 'flex' }}>
        <div className="wrap" style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 24, paddingTop: 'calc(var(--nav-height) + clamp(64px, 12vh, 140px))' }}>
          <span className="eyebrow">Cohort 04 · Applications open</span>
          <h1 className="d-lg" style={{ maxWidth: 820 }}>Builder Program</h1>
          <p className="t-lg" style={{ maxWidth: 480, color: 'var(--text-primary)' }}>Funding, audits and distribution for teams building what's next.</p>
          <div className="btn-row btn-row--stack" style={{ maxWidth: 340, justifyContent: 'center' }}><Button size="lg" onClick={() => setOpen(true)}>Apply now</Button><Button size="lg" variant="secondary">Program guide</Button></div>
        </div>
      </Glow>
      <section className="section"><div className="wrap split" style={{ alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, position: 'sticky', top: 'calc(var(--nav-height) + 24px)' }}>
          <h2 className="d-2">What kind of teams?</h2>
          <p className="t-md" style={{ maxWidth: 420 }}>We back teams building something meaningfully new — products that are better versions of existing ones, or that open a category.</p>
          <Tag>Product criteria</Tag>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>{CRITERIA.map(([t, d], i) => (
          <Card key={t} variant="raised" padding="md"><div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 12 }}><IndexBadge value={i + 1} /><span style={{ fontSize: 18, letterSpacing: '-.02em' }}>{t}</span></div><p className="t-sm" style={{ paddingLeft: 36 }}>{d}</p></Card>
        ))}</div>
      </div></section>
      <section className="section" style={{ paddingTop: 0 }}><div className="wrap">
        <div className="head-row"><h2 className="d-2">What you get</h2></div>
        <div className="grid-3">{PERKS.map(([ic, t, d]) => <div key={t} className="feat"><span className="feat__icon"><Icon name={ic} size={18} /></span><div className="feat__title">{t}</div><p className="t-md">{d}</p></div>)}</div>
      </div></section>
      <section className="section" style={{ paddingTop: 0 }}><div className="wrap split" style={{ alignItems: 'start' }}>
        <h2 className="d-2">Frequently asked questions</h2>
        <Accordion items={FAQ} defaultOpen={['0']} />
      </div></section>
      <ApplyDialog open={open} onClose={() => setOpen(false)} onDone={() => { setOpen(false); toast({ tone: 'success', title: 'Application received', description: 'We\'ll reply within two weeks.' }); }} />
    </>
  );
}

Object.assign(window, { ProgramPage });
