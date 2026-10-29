export interface AccordionItem { id?: string; title: React.ReactNode; content: React.ReactNode; meta?: React.ReactNode; }
/** Disclosure list — FAQs, tiered scopes, criteria. Square +/− toggle on the right. */
export interface AccordionProps {
  items: AccordionItem[];
  /** single = one open at a time (default) · multiple */
  type?: 'single' | 'multiple';
  /** Ids (or string indexes) open on mount. */
  defaultOpen?: string[];
  /** filled = gray rows with 8px gaps (FAQ) · divided = hairline rows, larger type */
  variant?: 'filled' | 'divided';
  /** Prefix rows with IndexBadge 1, 2, 3… */
  numbered?: boolean;
  /** Open row turns solid blue — use for one emphasised tier list per page. */
  accentOpen?: boolean;
  className?: string;
  style?: React.CSSProperties;
}
export declare function Accordion(props: AccordionProps): JSX.Element;
