const { Glow, Button, Accordion, Dialog, Input, Select, Radio, Tag } = window.LumenDesignSystem_12638a;

const TIERS = [
  { title: 'Critical — up to $500,000', content: <ol style={{ margin: 0, paddingLeft: 18, display: 'grid', gap: 8 }}><li>Theft or permanent freezing of user funds.</li><li>Consensus failure that halts the network.</li></ol> },
  { title: 'High — up to $50,000', content: <ol style={{ margin: 0, paddingLeft: 18, display: 'grid', gap: 8 }}><li>Temporary freezing of funds for more than one hour.</li><li>Unintended minting or burning of tokens.</li></ol> },
  { title: 'Medium — up to $10,000', content: <ol style={{ margin: 0, paddingLeft: 18, display: 'grid', gap: 8 }}><li>A bug that causes unintended contract behaviour with no funds at direct risk.</li><li>Shutdown of 30% or more of validator nodes without brute force.</li></ol> },
  { title: 'Low — up to $1,000', content: 'Contract fails to deliver promised returns without losing value.' },
];

function BountyPage({ toast }) {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Glow variant="grid" as="section" style={{ marginTop: 'calc(-1 * var(--nav-height))', minHeight: 'min(80vh, 720px)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
        <div className="wrap" style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 24, paddingTop: 'calc(var(--nav-height) + 64px)', paddingBottom: 72 }}>
          <Tag variant="accent" uppercase>Bug bounty</Tag>
          <h1 className="d-lg" style={{ maxWidth: 760 }}>Find bugs. Earn rewards.</h1>
          <p className="t-lg" style={{ maxWidth: 440, color: 'var(--text-primary)' }}>Earn up to $500K for responsibly disclosing vulnerabilities in the protocol.</p>
          <div className="btn-row btn-row--stack" style={{ maxWidth: 340, justifyContent: 'center' }}><Button size="lg" onClick={() => window.scrollTo({ top: document.getElementById('scope').offsetTop - 64, behavior: 'smooth' })}>View scope</Button><Button size="lg" variant="secondary" onClick={() => setOpen(true)}>Submit report</Button></div>
        </div>
      </Glow>
      <section className="section" id="scope"><div className="wrap split" style={{ alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <h2 className="d-2">Impacts in scope</h2>
          <p className="t-md" style={{ maxWidth: 420 }}>Only the impacts listed here are eligible for payout. Rewards scale with severity and the quality of the proof of concept.</p>
        </div>
        <Accordion numbered accentOpen defaultOpen={['2']} items={TIERS} />
      </div></section>
      <Dialog open={open} onClose={() => setOpen(false)} title="Submit a report" description="Reports are encrypted and triaged within 48 hours."
        footer={<><Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={() => { setOpen(false); toast({ tone: 'success', title: 'Report submitted', description: 'Reference #LB-2041', action: { label: 'Track status' } }); }}>Submit report</Button></>}>
        <div style={{ display: 'grid', gap: 16 }}>
          <Input label="Title" placeholder="Short summary of the issue" required />
          <fieldset style={{ border: 0, padding: 0, margin: 0 }}><legend className="lm-field__label" style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 6 }}>Severity</legend>
            <div style={{ display: 'flex', flexWrap: 'wrap', columnGap: 20 }}>{['Critical', 'High', 'Medium', 'Low'].map((s, i) => <Radio key={s} name="sev" value={s} label={s} defaultChecked={i === 2} />)}</div>
          </fieldset>
          <Select label="Component" options={['Consensus', 'Execution', 'Bridge', 'Wallet SDK']} />
          <Input label="Proof of concept" multiline rows={4} placeholder="Steps to reproduce" />
        </div>
      </Dialog>
    </>
  );
}

Object.assign(window, { BountyPage });
