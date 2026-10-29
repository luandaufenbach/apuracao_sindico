/** Mono label chip — section markers ("Product criteria"), categories, metadata. Non-interactive. */
export interface TagProps {
  /** inverse = white chip (brand default on dark); accent = blue; subtle = gray; outline. */
  variant?: 'inverse' | 'accent' | 'subtle' | 'outline';
  size?: 'sm' | 'md';
  /** Uppercase + wider tracking for eyebrow-style tags. */
  uppercase?: boolean;
  icon?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function Tag(props: TagProps): JSX.Element;
