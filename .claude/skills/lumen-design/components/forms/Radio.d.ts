/** Single choice within a group (share the same name). The only round control besides Switch. */
export interface RadioProps {
  label?: React.ReactNode;
  description?: React.ReactNode;
  name: string;
  value: string;
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  style?: React.CSSProperties;
}
export declare function Radio(props: RadioProps): JSX.Element;
