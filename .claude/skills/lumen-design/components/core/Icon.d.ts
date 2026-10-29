/** Lucide line icon (1.5px stroke, 24 grid) rendered in currentColor. */
export interface IconProps {
  /** Lucide icon name, e.g. "arrow-right", "chart-line", "wallet". See ICON_NAMES. */
  name: string;
  /** Pixel size. 16 inline, 20 default, 24 nav. */
  size?: number;
  /** Stroke width. Keep 1.5 (brand default); 2 only below 16px. */
  strokeWidth?: number;
  /** Accessible label. Omit for decorative icons next to text. */
  title?: string;
  style?: React.CSSProperties;
  className?: string;
}
export declare function Icon(props: IconProps): JSX.Element | null;
export declare const ICON_NAMES: string[];
