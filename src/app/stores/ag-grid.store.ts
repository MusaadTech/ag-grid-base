import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import { GridOptions, themeMaterial } from 'ag-grid-community';
import {
  HeaderButton,
  ButtonClickHandler,
  GridConfig,
  GridRow,
  ColumnDefinition,
  GridApi,
  ExportConfig,
  CellValueChangedHandler,
  SelectionChangedHandler,
  RowSelectedHandler
} from './ag-grid.model';

export const AgGridStore = signalStore(
  withState(() => ({
    rowData: [] as GridRow[],
    columnDefs: [] as ColumnDefinition[],
    gridOptions: {} as GridOptions,
    headerButtons: [] as HeaderButton[],
    buttonClickHandler: undefined as ButtonClickHandler | undefined,
    cellValueChangedHandler: undefined as CellValueChangedHandler | undefined,
    selectionChangedHandler: undefined as SelectionChangedHandler | undefined,
    rowSelectedHandler: undefined as RowSelectedHandler | undefined,
    gridApi: undefined as GridApi | undefined,
    visibleRows: 3, // Default number of visible rows
    gridConfig: {
      theme: themeMaterial,
      rowHeight: 60,
      headerHeight: 60,
      defaultVisibleRows: 5,
      enableExport: true,
      enableMultiSelection: true,
      enableInlineEditing: true,
      enableSorting: true,
      enableFiltering: true,
      enableColumnResizing: false,
      enableRowAnimation: true
    } as GridConfig,
    exportConfig: {
      enabled: true,
      formats: ['xlsx', 'csv'],
      defaultFormat: 'xlsx',
      filename: 'export',
      includeHeaders: true
    } as ExportConfig
  })),

  withMethods((store) => ({
    // Data management
    setRowData: (data: GridRow[]) => {
      if (Array.isArray(data)) {
        patchState(store, { rowData: data });
      } else {
        console.warn('setRowData: Invalid data provided, expected array');
      }
    },
    addRow: (row: GridRow) => {
      if (row && typeof row === 'object' && row.id !== undefined) {
        const currentData = store.rowData();
        patchState(store, { rowData: [...currentData, row] });
      } else {
        console.warn('addRow: Invalid row provided, must have id property');
      }
    },
    updateRow: (index: number, row: GridRow) => {
      const currentData = store.rowData();
      if (index >= 0 && index < currentData.length && row && typeof row === 'object') {
        const updatedData = [...currentData];
        updatedData[index] = row;
        patchState(store, { rowData: updatedData });
      } else {
        console.warn(`updateRow: Invalid index ${index} or row data`);
      }
    },
    removeRow: (index: number) => {
      const currentData = store.rowData();
      if (index >= 0 && index < currentData.length) {
        const updatedData = currentData.filter((_, i) => i !== index);
        patchState(store, { rowData: updatedData });
      } else {
        console.warn(`removeRow: Invalid index ${index}`);
      }
    },
    removeRows: (indices: number[]) => {
      const currentData = store.rowData();
      if (Array.isArray(indices)) {
        const validIndices = indices.filter(index => index >= 0 && index < currentData.length);
        const updatedData = currentData.filter((_, i) => !validIndices.includes(i));
        patchState(store, { rowData: updatedData });
      } else {
        console.warn('removeRows: Invalid indices provided, expected array');
      }
    },
    clearData: () => patchState(store, { rowData: [] }),

    // Configuration management
    setColumnDefs: (defs: ColumnDefinition[]) => {
      if (Array.isArray(defs)) {
        patchState(store, { columnDefs: defs });
      } else {
        console.warn('setColumnDefs: Invalid column definitions provided, expected array');
      }
    },
    setGridOptions: (options: GridOptions) => {
      if (options && typeof options === 'object') {
        patchState(store, { gridOptions: options });
      } else {
        console.warn('setGridOptions: Invalid grid options provided, expected object');
      }
    },
    setHeaderButtons: (buttons: HeaderButton[]) => {
      if (Array.isArray(buttons)) {
        patchState(store, { headerButtons: buttons });
      } else {
        console.warn('setHeaderButtons: Invalid buttons provided, expected array');
      }
    },
    setGridConfig: (config: Partial<GridConfig>) => {
      if (config && typeof config === 'object') {
        patchState(store, { gridConfig: { ...store.gridConfig(), ...config } });
      } else {
        console.warn('setGridConfig: Invalid config provided, expected object');
      }
    },
    setExportConfig: (config: Partial<ExportConfig>) => {
      if (config && typeof config === 'object') {
        patchState(store, { exportConfig: { ...store.exportConfig(), ...config } });
      } else {
        console.warn('setExportConfig: Invalid config provided, expected object');
      }
    },

    // Event handlers
    setButtonClickHandler: (handler: ButtonClickHandler) => patchState(store, { buttonClickHandler: handler }),
    setCellValueChangedHandler: (handler: CellValueChangedHandler) => patchState(store, { cellValueChangedHandler: handler }),
    setSelectionChangedHandler: (handler: SelectionChangedHandler) => patchState(store, { selectionChangedHandler: handler }),
    setRowSelectedHandler: (handler: RowSelectedHandler) => patchState(store, { rowSelectedHandler: handler }),

    // Grid API management
    setGridApi: (api: GridApi) => patchState(store, { gridApi: api }),

    // Row visibility management
    setVisibleRows: (count: number) => {
      if (count > 0 && count <= 100) { // Reasonable limit
        patchState(store, { visibleRows: count });
      }
    },
    getVisibleRows: () => store.visibleRows(),
    getTotalRows: () => store.rowData().length,

    // Selection management
    getSelectedRows: (): GridRow[] => {
      const api = store.gridApi();
      return api ? api.getSelectedRows() : [];
    },

    // Configuration getters
    getGridConfig: () => store.gridConfig(),
    getExportConfig: () => store.exportConfig(),

    // Grid operations
    scrollToLastRow: () => {
      const api = store.gridApi();
      if (api && api['getDisplayedRowCount']) {
        const displayedRowCount = api['getDisplayedRowCount']();
        const totalRowCount = store.rowData().length;

        // Use the smaller of displayed rows or total rows to avoid index errors
        const safeRowCount = Math.min(displayedRowCount, totalRowCount);

        if (safeRowCount > 0) {
          const lastIndex = Math.max(0, safeRowCount - 1);
          try {
            api.ensureIndexVisible(lastIndex, 'bottom');
          } catch (error) {
            console.warn('Failed to scroll to last row:', error);
          }
        }
      }
    },

    // Button click handling (pure UI operation)
    handleButtonClick: (button: HeaderButton) => {
      if (button && typeof button === 'object' && button.type) {
        const handler = store.buttonClickHandler();
        if (handler) {
          handler(button);
        } else {
          console.warn('No button click handler set for:', button.type);
        }
      }
    },

    // Utility methods for dynamic configuration
    updateColumnEditable: (field: string, editable: boolean) => {
      if (field && typeof field === 'string') {
        const columnDefs = store.columnDefs().map(col =>
          col.field === field ? { ...col, editable } : col
        );
        patchState(store, { columnDefs });
      }
    },

    updateColumnSortable: (field: string, sortable: boolean) => {
      if (field && typeof field === 'string') {
        const columnDefs = store.columnDefs().map(col =>
          col.field === field ? { ...col, sortable } : col
        );
        patchState(store, { columnDefs });
      }
    },

    updateColumnFilterable: (field: string, filterable: boolean) => {
      if (field && typeof field === 'string') {
        const columnDefs = store.columnDefs().map(col =>
          col.field === field ? { ...col, filter: filterable } : col
        );
        patchState(store, { columnDefs });
      }
    },

    toggleButtonVisibility: (buttonType: string, hidden: boolean) => {
      if (buttonType && typeof buttonType === 'string') {
        const headerButtons = store.headerButtons().map(btn =>
          btn.type === buttonType ? { ...btn, hidden } : btn
        );
        patchState(store, { headerButtons });
      }
    },

    toggleButtonDisabled: (buttonType: string, disabled: boolean) => {
      if (buttonType && typeof buttonType === 'string') {
        const headerButtons = store.headerButtons().map(btn =>
          btn.type === buttonType ? { ...btn, disabled } : btn
        );
        patchState(store, { headerButtons });
      }
    },

    // Utility method to check if header should be visible
    shouldShowHeader: () => {
      const headerButtons = store.headerButtons();

      // If buttons array is null, undefined, or empty, don't show header
      if (!headerButtons || headerButtons.length === 0) {
        return false;
      }

      // If all buttons are hidden, don't show header
      const allButtonsHidden = headerButtons.every(button => button.hidden === true);
      if (allButtonsHidden) {
        return false;
      }

      return true;
    }
  }))
);
