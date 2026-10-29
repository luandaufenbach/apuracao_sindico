/** Native select styled to match Input — native picker on mobile for best UX. */
export interface SelectOption { value: string; label: string; }
export interface SelectProps {
  label?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  /** Strings or {value,label} objects. */
  options: Array<string | SelectOption>;
  /** Disabled first option shown when value is "". */
  placeholder?: string;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  id?: string;
  name?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
  style?: React.CSSProperties;
}
export declare function Select(props: SelectProps): JSX.Element;
