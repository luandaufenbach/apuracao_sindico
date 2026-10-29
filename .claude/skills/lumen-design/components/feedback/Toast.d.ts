/** Transient notification. Place inside ToastRegion. Auto-dismiss 5s for success/info; keep danger until dismissed. */
export interface ToastProps {
  tone?: 'neutral' | 'success' | 'warning' | 'danger' | 'info';
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** Optional mono uppercase action ("Undo", "View tx"). */
  action?: { label: string; onClick?: () => void };
  onClose?: () => void;
  style?: React.CSSProperties;
}
export declare function Toast(props: ToastProps): JSX.Element;
