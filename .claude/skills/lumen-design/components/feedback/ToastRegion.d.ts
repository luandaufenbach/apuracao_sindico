/** Fixed stack for Toasts — bottom-right on desktop, full-width bottom on phones (lifted above BottomNav via offsetBottom). */
export interface ToastRegionProps {
  /** Extra bottom offset on mobile, e.g. 64 when a BottomNav is present. */
  offsetBottom?: number;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function ToastRegion(props: ToastRegionProps): JSX.Element;
