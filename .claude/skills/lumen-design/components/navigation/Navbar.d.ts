export interface NavChild { label: string; href?: string; description?: string; icon?: string; }
export interface NavItem { label: string; href?: string; children?: NavChild[]; }
export interface NavAction { label: string; href?: string; onClick?: () => void; }
/**
 * Responsive site header. ≥1024px: links with boxed-chevron dropdowns + CTA. <1024px: square menu button opens a full-screen drawer with the SAME items (accordion groups) and full-width CTAs.
 */
export interface NavbarProps {
  /** Defaults to <Wordmark />. */
  brand?: React.ReactNode;
  brandHref?: string;
  items?: NavItem[];
  /** Blue primary CTA (hidden <640px in the bar, always shown in the drawer). */
  cta?: NavAction;
  /** Ghost secondary action (e.g. "Sign in"), moves into drawer on mobile. */
  secondaryAction?: NavAction;
  /** sticky (blurred, default) · transparent (over hero) · static */
  variant?: 'sticky' | 'transparent' | 'static';
  /** Label of the active top-level item. */
  current?: string;
  /** If set, links call this instead of navigating. */
  onNavigate?: (item: NavItem | NavChild) => void;
}
export declare function Navbar(props: NavbarProps): JSX.Element;
