/** Square icon-only button (menu, close, accordion toggle, toolbar). */
export interface IconButtonProps {
  /** Icon name — see Icon. */
  icon: string;
  /** Required accessible label (also used as tooltip title). */
  label: string;
  /** solid = gray square (hamburger); ghost; outline; primary = blue square; inverse = white square. */
  variant?: 'solid' | 'ghost' | 'outline' | 'primary' | 'inverse';
  /** xs 24 · sm 32 · md 40 · lg 48. sm/md expand to 44px on touch. */
  size?: 'xs' | 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
  'aria-expanded'?: boolean;
}
export declare function IconButton(props: IconButtonProps): JSX.Element;
