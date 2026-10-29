/** Small numbered square (1, 2, 3…) for ordered lists, steps, accordions. */
export interface IndexBadgeProps {
  value: React.ReactNode;
  /** outline (default) · solid (blue, active step) · inverse (white). */
  variant?: 'outline' | 'solid' | 'inverse';
  size?: 'sm' | 'md' | 'lg';
  style?: React.CSSProperties;
}
export declare function IndexBadge(props: IndexBadgeProps): JSX.Element;
