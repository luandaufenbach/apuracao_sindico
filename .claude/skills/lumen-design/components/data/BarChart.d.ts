export interface BarDatum { label: string; value: number; }
/** Dense stepped bar chart; bars share one vertical gradient (deep blue → white at the top) so taller bars glow brighter. Hover/tap shows a ValueTag. */
export interface BarChartProps {
  data: BarDatum[];
  /** Plot height in px. */
  height?: number;
  /** Gap between bars in px (0–4). */
  gap?: number;
  /** Bar index to call out, 'max' (default) or null. */
  highlight?: number | 'max' | null;
  /** Value formatter for axis + tooltip. */
  format?: (v: number) => string;
  yTicks?: number;
  /** Override x-axis labels (default: 4 evenly spaced data labels). */
  xLabels?: string[];
  fill?: 'gradient' | 'solid';
  /** Accessible chart name. */
  label?: string;
  style?: React.CSSProperties;
}
export declare function BarChart(props: BarChartProps): JSX.Element;
