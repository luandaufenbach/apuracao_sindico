export interface SidebarItem { value?: string; label?: string; icon?: string; badge?: React.ReactNode; /** Render a mono section heading instead of an item. */ section?: string; }
/** App sidebar for ≥1024px. Pair with BottomNav (same items) for phones so no destination is lost. */
export interface SidebarProps {
  header?: React.ReactNode;
  items: SidebarItem[];
  value?: string;
  onChange?: (value: string) => void;
  footer?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}
export declare function Sidebar(props: SidebarProps): JSX.Element;
