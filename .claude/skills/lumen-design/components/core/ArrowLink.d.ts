/** Inline text link led by a small blue icon square — "→ Read docs", "▷ Watch the video". */
export interface ArrowLinkProps {
  href?: string;
  /** Icon in the square. "arrow-right" (default), "play", "arrow-up-right", "download". */
  icon?: string;
  /** default = blue square + white text; inverse = white square; accent = blue text, bare icon. */
  tone?: 'default' | 'inverse' | 'accent';
  onClick?: (e: React.MouseEvent) => void;
  children?: React.ReactNode;
  className?: string;
}
export declare function ArrowLink(props: ArrowLinkProps): JSX.Element;
