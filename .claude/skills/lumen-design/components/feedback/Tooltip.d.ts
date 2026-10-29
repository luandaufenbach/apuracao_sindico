/** Short hint on hover/focus — white mono bubble. Never put essential info only in a tooltip (touch users can't hover). */
export interface TooltipProps {
  content: React.ReactNode;
  side?: 'top' | 'bottom' | 'left' | 'right';
  /** ms before showing. */
  delay?: number;
  /** Allow multi-line (max 260px). */
  wrap?: boolean;
  children: React.ReactNode;
}
export declare function Tooltip(props: TooltipProps): JSX.Element;
