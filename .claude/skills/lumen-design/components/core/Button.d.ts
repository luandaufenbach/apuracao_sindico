/**
 * Primary action control. Sans 13–15px medium, 2px radius, glow on hover.
 */
export interface ButtonProps {
  /** primary = blue fill (one per view); secondary = white/inverse; outline & ghost for tertiary; danger for destructive. */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  /** sm 32px · md 40px · lg 48px. sm/md grow to 44px on touch devices. */
  size?: 'sm' | 'md' | 'lg';
  /** Icon name (see Icon) before the label. */
  iconLeft?: string;
  /** Icon name after the label — "arrow-right" / "arrow-up-right" for navigation. */
  iconRight?: string;
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  /** Renders an <a> when set. */
  href?: string;
  type?: 'button' | 'submit' | 'reset';
  onClick?: (e: React.MouseEvent) => void;
  children?: React.ReactNode;
  className?: string;
}
export declare function Button(props: ButtonProps): JSX.Element;
