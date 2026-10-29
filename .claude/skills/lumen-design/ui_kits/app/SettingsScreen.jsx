const { Input, Select, Switch, Radio, Button, Checkbox } = window.LumenDesignSystem_12638a;

function Row({ title, desc, children }) {
  return <div className="settings"><div><div className="settings__h">{title}</div><div className="settings__d">{desc}</div></div><div>{children}</div></div>;
}

function SettingsScreen({ toast, theme, setTheme }) {
  return (
    <>
      <div className="page-head"><div><h1 className="page-title">Settings</h1><div className="page-sub">Profile, notifications and preferences</div></div></div>
      <Row title="Profile" desc="Shown on your public application page.">
        <div className="form-grid"><Input label="Team name" defaultValue="Harbor Labs" /><Input label="Email" type="email" defaultValue="ops@harbor.xyz" /><Input label="Website" defaultValue="harbor.xyz" iconLeft="globe" style={{ gridColumn: '1 / -1' }} /></div>
      </Row>
      <Row title="Notifications" desc="Choose what we alert you about.">
        <div style={{ display: 'grid', gap: 4 }}>
          <Switch label="Transaction confirmations" description="Push + email for every outgoing transaction" defaultChecked />
          <Switch label="Price alerts" description="When any held asset moves ±5% in 24h" defaultChecked />
          <Switch label="Program updates" description="Cohort deadlines and new grants" />
        </div>
      </Row>
      <Row title="Appearance" desc="Dark is the default; light mirrors every token.">
        <fieldset style={{ border: 0, padding: 0, margin: 0, display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          <legend style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden' }}>Theme</legend>
          <Radio name="theme" value="dark" label="Dark" checked={theme === 'dark'} onChange={() => setTheme('dark')} />
          <Radio name="theme" value="light" label="Light" checked={theme === 'light'} onChange={() => setTheme('light')} />
        </fieldset>
        <div style={{ marginTop: 16, maxWidth: 280 }}><Select label="Currency" options={['USD', 'EUR', 'BRL']} defaultValue="USD" /></div>
      </Row>
      <Row title="Danger zone" desc="Revoking keys signs this team out on every device.">
        <div style={{ display: 'grid', gap: 12, justifyItems: 'start' }}><Checkbox label="I understand this can't be undone" /><Button variant="danger" size="sm">Revoke all API keys</Button></div>
      </Row>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, paddingTop: 24 }}><Button variant="ghost">Discard</Button><Button onClick={() => toast({ tone: 'success', title: 'Settings saved' })}>Save changes</Button></div>
    </>
  );
}

Object.assign(window, { SettingsScreen });
