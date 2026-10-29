export interface BottomNavItem { value: string; label: string; icon: string; badge?: React.ReactNode; }
/** Phone tab bar (max 5 items), thumb-reachable, safe-area aware. Auto-hides ≥1024px where Sidebar takes over. */
export interface BottomNavProps {
  items: BottomNavItem[];
  value?: string;
  onChange?: (value: string) => void;
  /** fixed to viewport bottom (default) or static (inside a mock frame). */
  position?: 'fixed' | 'static';
  /** Hide at ≥1024px. Default true. */
  hideOnDesktop?: boolean;
  className?: string;
  style?: React.CSSProperties;
}
export declare function BottomNav(props: BottomNavProps): JSX.Element;
