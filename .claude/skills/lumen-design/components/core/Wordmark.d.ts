/** Brand name set in type. Placeholder until a real logo is supplied — swap this one component to rebrand everywhere. */
export interface WordmarkProps {
  /** Brand name. Default "Lumen" (working name). */
  name?: string;
  /** Font size in px. 20–24 in nav, 64+ for hero lockups. */
  size?: number;
  color?: string;
  style?: React.CSSProperties;
}
export declare function Wordmark(props: WordmarkProps): JSX.Element;
