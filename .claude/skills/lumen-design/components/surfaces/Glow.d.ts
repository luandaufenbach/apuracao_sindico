/** Brand backdrop: light emerging from black, with film grain. Wrap hero sections, CTAs and feature cards. */
export interface GlowProps {
  /** horizon = glow rising from bottom · halo = luminous arc from top · fade-up / fade-down · columns = deep-blue vertical bands + dots · steel = horizontal blue→silver · dots · grid */
  variant?: 'horizon' | 'halo' | 'fade-up' | 'fade-down' | 'columns' | 'steel' | 'dots' | 'grid';
  /** Soft-light film grain overlay. Default true. */
  grain?: boolean;
  as?: string;
  minHeight?: number | string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}
export declare function Glow(props: GlowProps): JSX.Element;
