export interface DataColumn {
  key: string;
  header: string;
  align?: 'left' | 'right';
  /** Mono tabular numerals (amounts, hashes, dates). */
  mono?: boolean;
  width?: number | string;
  /** Card title on mobile. Defaults to first column. */
  primary?: boolean;
  sortable?: boolean;
  sortValue?: (row: any) => any;
  render?: (row: any) => React.ReactNode;
}
/** Sortable table on ≥768px; becomes stacked cards with EVERY column + a sort select on phones (no data hidden). */
export interface DataTableProps {
  columns: DataColumn[];
  rows: any[];
  rowKey?: string;
  onRowClick?: (row: any) => void;
  /** Enable header sorting (default true; per-column opt-out via column.sortable=false). */
  sortable?: boolean;
  defaultSort?: { key: string; dir: 'asc' | 'desc' };
  empty?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}
export declare function DataTable(props: DataTableProps): JSX.Element;
