import { Theme } from 'ag-grid-community';

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

export interface GridRow {
  id: string | number;
  [key: string]: any; // Allow additional properties
}

export interface ColumnDefinition {
  field: string;
  headerName?: string;
  sortable?: boolean;
  filter?: boolean;
  editable?: boolean;
  resizable?: boolean;
  flex?: number;
  width?: number;
  cellRenderer?: (params: any) => string;
  cellEditor?: string;
  cellEditorParams?: any;
  cellStyle?: any;
  [key: string]: any; // Allow additional AG Grid properties
}

export interface GridApi {
  getSelectedRows: () => GridRow[];
  ensureIndexVisible: (index: number, position: 'top' | 'bottom' | 'middle') => void;
  [key: string]: any; // Allow additional AG Grid API methods
}

export interface GridConfig {
  theme?: Theme;
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
export type CellValueChangedHandler = (params: any) => void;
export type SelectionChangedHandler = (params: any) => void;
export type RowSelectedHandler = (params: any) => void;
