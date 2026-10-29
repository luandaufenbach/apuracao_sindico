/**
 * Big-number tile — label + icon square on top, large tabular value bottom-left.
 */
export interface StatCardProps {
  label: React.ReactNode;
  /** Icon name shown in a small square before the label. */
  icon?: string;
  value: React.ReactNode;
  /** Small line under the value, e.g. "In bridged USDC". */
  caption?: React.ReactNode;
  delta?: { value: React.ReactNode; direction?: 'up' | 'down' };
  /** default (dark surface) · inverse (white) · accent (blue) · outline */
  variant?: 'default' | 'inverse' | 'accent' | 'outline';
  /** md 180px min-height · lg 280px */
  size?: 'md' | 'lg';
  /** Optional slot between header and value (sparkline, chart). */
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function StatCard(props: StatCardProps): JSX.Element;
