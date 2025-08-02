export interface HeaderButton {
  type: string;
  icon?: string;
  label?: string;
  disabled?: boolean;
  hidden?: boolean;
  position?: 'start' | 'end';
  tooltip?: string;
  className?: string;
}

export interface GridConfig {
  theme?: string;
  rowHeight?: number;
  headerHeight?: number;
  defaultVisibleRows?: number;
  enableExport?: boolean;
  enableMultiSelection?: boolean;
  enableInlineEditing?: boolean;
  enableSorting?: boolean;
  enableFiltering?: boolean;
  enableColumnResizing?: boolean;
  enableRowAnimation?: boolean;
}

export interface ExportConfig {
  enabled: boolean;
  formats: ('xlsx' | 'csv')[];
  defaultFormat: 'xlsx' | 'csv';
  filename?: string;
  includeHeaders?: boolean;
}

export type ButtonClickHandler = (button: HeaderButton) => void;
export type DataFetcher = () => Promise<any[]>;
export type InsertFunction = () => Promise<any>;
export type CellValueChangedHandler = (params: any) => void;
export type SelectionChangedHandler = (params: any) => void;
export type RowSelectedHandler = (params: any) => void;
