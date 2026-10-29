const { Sidebar, BottomNav, Wordmark, Input, IconButton, Select, Tooltip } = window.LumenDesignSystem_12638a;

const APP_NAV = [
  { value: 'overview', label: 'Overview', icon: 'layout-grid' },
  { value: 'activity', label: 'Activity', icon: 'activity', badge: 1 },
  { value: 'assets', label: 'Assets', icon: 'wallet' },
  { value: 'settings', label: 'Settings', icon: 'settings' },
];

function AppShell({ view, setView, children }) {
  const sideItems = [APP_NAV[0], APP_NAV[1], { section: 'Account' }, APP_NAV[2], APP_NAV[3]];
  return (
    <div className="app">
      <div className="app__side">
        <Sidebar header={<Wordmark size={22} />} items={sideItems} value={view} onChange={setView}
          footer={<div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><span className="app__avatar">HL</span><div style={{ minWidth: 0 }}><div style={{ fontSize: 14 }}>Harbor Labs</div><div className="eyebrow" style={{ fontSize: 10 }}>0x41be…77c0</div></div></div>} />
      </div>
      <div className="app__main">
        <header className="app__top">
          <span className="app__brand"><Wordmark size={20} /></span>
          <div className="app__search"><Input iconLeft="search" placeholder="Search transactions, apps, addresses" size="sm" suffix="⌘K" aria-label="Search" /></div>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Tooltip content="Search" side="bottom"><span className="app__brand"><IconButton icon="search" label="Search" variant="ghost" size="sm" /></span></Tooltip>
            <Select size="sm" options={['Mainnet', 'Testnet']} defaultValue="Mainnet" aria-label="Network" style={{ width: 128 }} />
            <Tooltip content="Notifications" side="bottom"><IconButton icon="bell" label="Notifications" variant="ghost" size="sm" /></Tooltip>
          </div>
        </header>
        <main className="app__content" data-screen-label={view}>{children}</main>
      </div>
      <BottomNav items={APP_NAV} value={view} onChange={setView} />
    </div>
  );
}

Object.assign(window, { AppShell });
