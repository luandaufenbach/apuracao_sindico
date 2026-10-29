/** Modal dialog — centred panel on desktop, bottom sheet with drag-handle and stacked full-width actions on phones (<640px). Esc + scrim close; focus returns to trigger. */
export interface DialogProps {
  open: boolean;
  onClose?: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  /** Action buttons (primary last). Stacks full-width on mobile. */
  footer?: React.ReactNode;
  /** sm 400 · md 520 · lg 720 */
  size?: 'sm' | 'md' | 'lg';
  /** Show close button and allow Esc/scrim dismiss. */
  dismissible?: boolean;
}
export declare function Dialog(props: DialogProps): JSX.Element | null;
