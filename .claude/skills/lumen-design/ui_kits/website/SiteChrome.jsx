const { Navbar, Wordmark } = window.LumenDesignSystem_12638a;

const NAV_ITEMS = [
  { label: 'Platform', children: [
    { label: 'Overview', description: 'How the network works', icon: 'layers', route: 'home' },
    { label: 'Security', description: 'Audits and formal verification', icon: 'shield-check' },
    { label: 'Roadmap', description: 'What ships next', icon: 'git-branch' },
  ] },
  { label: 'Build', children: [
    { label: 'Documentation', description: 'Guides, references, tutorials', icon: 'book-open' },
    { label: 'Builder Program', description: 'Funding and support for new teams', icon: 'rocket', route: 'program' },
    { label: 'Bug Bounty', description: 'Up to $500K for critical findings', icon: 'bug', route: 'bounty' },
  ] },
  { label: 'Ecosystem', children: [
    { label: 'Apps', description: 'Explore live applications', icon: 'layout-grid' },
    { label: 'Events', description: 'Meetups and summits', icon: 'calendar' },
  ] },
  { label: 'Research', route: 'research' },
];

function SiteHeader({ route, go, transparent }) {
  const current = { program: 'Build', bounty: 'Build', research: 'Research' }[route];
  return (
    <Navbar items={NAV_ITEMS} current={current} variant={transparent ? 'transparent' : 'sticky'}
      secondaryAction={{ label: 'Docs' }} cta={{ label: 'Start building', onClick: () => go('program') }}
      onNavigate={it => go(it.route || (it.label === 'home' ? 'home' : route))} />
  );
}

const FOOTER_COLS = [
  ['Platform', ['Overview', 'Security', 'Roadmap', 'Status']],
  ['Build', ['Docs', 'SDKs', 'Builder Program', 'Bug Bounty']],
  ['Ecosystem', ['Apps', 'Events', 'Grants']],
  ['Company', ['About', 'Careers', 'Press kit', 'Contact']],
];

function SiteFooter({ go }) {
  const routes = { 'Builder Program': 'program', 'Bug Bounty': 'bounty', Overview: 'home' };
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer__cols">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Wordmark size={32} />
            <p className="t-sm" style={{ maxWidth: 260 }}>Infrastructure for verifiable software.</p>
          </div>
          {FOOTER_COLS.map(([h, ls]) => (
            <div key={h}><div className="footer__h">{h}</div>
              {ls.map(l => <a key={l} href="#" className="footer__l" onClick={e => { e.preventDefault(); routes[l] && go(routes[l]); }}>{l}</a>)}
            </div>
          ))}
        </div>
        <div className="meta-row" style={{ marginTop: 64 }}><span>lumen.network</span><span className="hide-sm">Privacy · Terms</span><span>©2026</span></div>
      </div>
    </footer>
  );
}

Object.assign(window, { SiteHeader, SiteFooter });
