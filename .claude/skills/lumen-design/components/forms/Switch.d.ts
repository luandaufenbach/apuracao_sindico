/** On/off toggle that applies immediately (settings). Use Checkbox inside submit-forms instead. */
export interface SwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  /** Receives the next boolean value. */
  onChange?: (next: boolean) => void;
  label?: React.ReactNode;
  description?: React.ReactNode;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}
export declare function Switch(props: SwitchProps): JSX.Element;
