/**
 * Status indicator — tinted chip with dot. Text always states the status (never color alone).
 */
export interface BadgeProps {
  tone?: 'neutral' | 'success' | 'warning' | 'danger' | 'info';
  dot?: boolean;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function Badge(props: BadgeProps): JSX.Element;
