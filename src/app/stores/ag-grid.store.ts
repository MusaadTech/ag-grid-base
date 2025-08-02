import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import {
  HeaderButton,
  ButtonClickHandler,
  GridConfig,
  ExportConfig,
  DataFetcher,
  InsertFunction,
  CellValueChangedHandler,
  SelectionChangedHandler,
  RowSelectedHandler
} from './ag-grid.model';

export const AgGridStore = signalStore(
  withState(() => ({
    rowData: [] as any[],
    columnDefs: [] as any[],
    gridOptions: {} as any,
    headerButtons: [] as HeaderButton[],
    fetcher: undefined as DataFetcher | undefined,
    insertFn: undefined as InsertFunction | undefined,
    buttonClickHandler: undefined as ButtonClickHandler | undefined,
    cellValueChangedHandler: undefined as CellValueChangedHandler | undefined,
    selectionChangedHandler: undefined as SelectionChangedHandler | undefined,
    rowSelectedHandler: undefined as RowSelectedHandler | undefined,
    gridApi: undefined as any,
    visibleRows: 3, // Default number of visible rows
    gridConfig: {
      theme: 'legacy',
      rowHeight: 48,
      headerHeight: 48,
      defaultVisibleRows: 3,
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
    setRowData: (data: any[]) => patchState(store, { rowData: data }),
    setColumnDefs: (defs: any[]) => patchState(store, { columnDefs: defs }),
    setGridOptions: (options: any) => patchState(store, { gridOptions: options }),
    setHeaderButtons: (buttons: HeaderButton[]) => patchState(store, { headerButtons: buttons }),
    setDataFetcher: (fn: DataFetcher) => patchState(store, { fetcher: fn }),
    setInsertFn: (fn: InsertFunction) => patchState(store, { insertFn: fn }),
    setButtonClickHandler: (handler: ButtonClickHandler) => patchState(store, { buttonClickHandler: handler }),
    setCellValueChangedHandler: (handler: CellValueChangedHandler) => patchState(store, { cellValueChangedHandler: handler }),
    setSelectionChangedHandler: (handler: SelectionChangedHandler) => patchState(store, { selectionChangedHandler: handler }),
    setRowSelectedHandler: (handler: RowSelectedHandler) => patchState(store, { rowSelectedHandler: handler }),
    setGridApi: (api: any) => patchState(store, { gridApi: api }),
    setGridConfig: (config: Partial<GridConfig>) => patchState(store, { gridConfig: { ...store.gridConfig(), ...config } }),
    setExportConfig: (config: Partial<ExportConfig>) => patchState(store, { exportConfig: { ...store.exportConfig(), ...config } }),

    getSelectedRows: () => {
      const api = store.gridApi();
      return api ? api.getSelectedRows() : [];
    },

    setVisibleRows: (count: number) => patchState(store, { visibleRows: count }),

    getVisibleRows: () => store.visibleRows(),

    getTotalRows: () => store.rowData().length,

    getGridConfig: () => store.gridConfig(),

    getExportConfig: () => store.exportConfig(),

    scrollToLastRow: () => {
      const api = store.gridApi();
      if (api) {
        const rowCount = store.rowData().length;
        if (rowCount > 0) {
          api.ensureIndexVisible(rowCount - 1, 'bottom');
        }
      }
    },

    fetchData: async () => {
      const fetcher = store.fetcher();
      if (!fetcher) return console.warn('No fetcher set');
      try {
        const data = await fetcher();
        patchState(store, { rowData: data });
      } catch (err) {
        console.error('fetchData() failed:', err);
      }
    },

    triggerAction: async (type: string) => {
      switch (type) {
        case 'add': {
          const insertFn = store.insertFn();
          if (!insertFn) return console.warn('No insertFn set');
          try {
            const newItem = await insertFn();
            const currentData = store.rowData();
            patchState(store, { rowData: [...currentData, newItem] });
          } catch (err) {
            console.error('insertFn failed:', err);
          }
          break;
        }

        case 'refresh': {
          const fetcher = store.fetcher();
          if (!fetcher) return;
          try {
            const data = await fetcher();
            patchState(store, { rowData: data });
          } catch (err) {
            console.error('refresh failed:', err);
          }
          break;
        }

        default:
          console.warn(`Unknown action: ${type}`);
      }
    },

    handleButtonClick: (button: HeaderButton) => {
      const handler = store.buttonClickHandler();
      if (handler) {
        handler(button);
      } else {
        // Fallback to default behavior
        console.log('No custom handler set, using default behavior for:', button.type);
        switch (button.type) {
          case 'add': {
            const insertFn = store.insertFn();
            if (!insertFn) return console.warn('No insertFn set');
            insertFn().then(newItem => {
              const currentData = store.rowData();
              patchState(store, { rowData: [...currentData, newItem] });
            }).catch(err => console.error('insertFn failed:', err));
            break;
          }
          case 'refresh': {
            const fetcher = store.fetcher();
            if (!fetcher) return;
            fetcher().then(data => {
              patchState(store, { rowData: data });
            }).catch(err => console.error('refresh failed:', err));
            break;
          }
          default:
            console.warn(`Unknown action: ${button.type}`);
        }
      }
    },

    // Utility methods for dynamic configuration
    updateColumnEditable: (field: string, editable: boolean) => {
      const columnDefs = store.columnDefs().map(col =>
        col.field === field ? { ...col, editable } : col
      );
      patchState(store, { columnDefs });
    },

    updateColumnSortable: (field: string, sortable: boolean) => {
      const columnDefs = store.columnDefs().map(col =>
        col.field === field ? { ...col, sortable } : col
      );
      patchState(store, { columnDefs });
    },

    updateColumnFilterable: (field: string, filterable: boolean) => {
      const columnDefs = store.columnDefs().map(col =>
        col.field === field ? { ...col, filter: filterable } : col
      );
      patchState(store, { columnDefs });
    },

    toggleButtonVisibility: (buttonType: string, hidden: boolean) => {
      const headerButtons = store.headerButtons().map(btn =>
        btn.type === buttonType ? { ...btn, hidden } : btn
      );
      patchState(store, { headerButtons });
    },

    toggleButtonDisabled: (buttonType: string, disabled: boolean) => {
      const headerButtons = store.headerButtons().map(btn =>
        btn.type === buttonType ? { ...btn, disabled } : btn
      );
      patchState(store, { headerButtons });
    }
  }))
);
