export interface TabItem { value: string; label: React.ReactNode; count?: number | string; }
/** Tab / filter switcher. Mono uppercase "DAILY · WEEKLY · MONTHLY" style by default; scrolls horizontally on narrow screens. */
export interface TabsProps {
  items: Array<string | TabItem>;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** text = bare mono labels (chart ranges) · segmented = filled pill-box (filters) · underline = sans page tabs */
  variant?: 'text' | 'segmented' | 'underline';
  /** Stretch tabs to fill the row (mobile segmented controls). */
  fullWidth?: boolean;
  /** aria-label for the tablist. */
  label?: string;
  className?: string;
  style?: React.CSSProperties;
}
export declare function Tabs(props: TabsProps): JSX.Element;
