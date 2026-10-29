/** Compact mono value readout with ▲/▼ — chart callouts, deltas in stat cards. */
export interface ValueTagProps {
  value: React.ReactNode;
  /** up (blue ▲) · down (red ▼) · none */
  direction?: 'up' | 'down' | 'none';
  variant?: 'dark' | 'light' | 'accent';
  style?: React.CSSProperties;
}
export declare function ValueTag(props: ValueTagProps): JSX.Element;
