/**
 * Square-cornered (4px) container. Depth from surface steps + hairline, never heavy shadows.
 */
export interface CardProps {
  /** default = surface-1 + hairline · raised = surface-2 · outline · inverse = white · accent = blue · glow = horizon gradient + grain */
  variant?: 'default' | 'raised' | 'outline' | 'inverse' | 'accent' | 'glow';
  /** none 0 · sm 16 · md 16→24 · lg 20→40 (fluid) */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  /** Hover/focus affordance. Auto when href/onClick set. */
  interactive?: boolean;
  href?: string;
  as?: string;
  onClick?: (e: React.MouseEvent) => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}
export declare function Card(props: CardProps): JSX.Element;
