/**
 * Labelled text field (single or multi-line). 44px tall, 16px text (prevents iOS zoom).
 */
export interface InputProps {
  label?: string;
  /** Helper text under the field. Replaced by error when present. */
  hint?: string;
  /** Error message — sets aria-invalid and red border. */
  error?: string;
  required?: boolean;
  /** Leading icon name (e.g. "search", "mail"). */
  iconLeft?: string;
  /** Trailing mono unit/suffix, e.g. "USDC" or "⌘K". */
  suffix?: React.ReactNode;
  /** sm 36 · md 44 · lg 52 */
  size?: 'sm' | 'md' | 'lg';
  /** Renders a <textarea>. */
  multiline?: boolean;
  rows?: number;
  disabled?: boolean;
  id?: string;
  type?: string;
  name?: string;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  className?: string;
  style?: React.CSSProperties;
}
export declare function Input(props: InputProps): JSX.Element;
