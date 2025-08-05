import { Component, inject, OnInit } from '@angular/core';
import { AgBaseGridComponent } from '../ag-base-grid/ag-base-grid.component';
import { AgGridStore } from '../../stores/ag-grid.store';
import { HeaderButton } from '../../stores/ag-grid.model';
import { GridOptions, themeMaterial, themeAlpine, themeBalham, themeQuartz } from 'ag-grid-community';
import { FormsModule } from '@angular/forms';
// @ts-ignore
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-example-grid',
  standalone: true,
  imports: [AgBaseGridComponent, FormsModule],
  templateUrl: './example-grid.component.html',
  styleUrl: './example-grid.component.scss',
})
export class ExampleGridComponent implements OnInit {
  public agGridStore = inject(AgGridStore);

  // Export modal state
  showExportModal = false;
  selectedExportFormat = 'xlsx';
  exportFormats = [
    { value: 'xlsx', label: 'Excel (XLSX)' },
    { value: 'csv', label: 'CSV' }
  ];

  // Dynamic configuration options
  availableVisibleRows = [3, 5, 10, 15, 20];
  currentVisibleRows = 3;

  ngOnInit() {
    console.log('ExampleGridComponent initialized');
    this.setupGrid();
  }

  private setupGrid() {
    console.log('Setting up example grid...');

    // Configure grid settings
    this.setupGridConfig();

    // Sample data - easily customizable
    const sampleData = this.generateSampleData();

    // Column definitions - fully configurable
    const columnDefs = this.generateColumnDefs();

    // Header buttons - easily customizable
    const headerButtons: HeaderButton[] = this.generateHeaderButtons();

    // Grid options - fully configurable
    const gridOptions = this.generateGridOptions();

    // Set visible rows in store (default is 3)
    this.agGridStore.setVisibleRows(this.currentVisibleRows);

    console.log('Grid options being set:', gridOptions);
    console.log('Configuring store with data:', sampleData);

    // Configure the store with pure grid data
    this.agGridStore.setRowData(sampleData);
    this.agGridStore.setColumnDefs(columnDefs);
    this.agGridStore.setGridOptions(gridOptions);
    this.agGridStore.setHeaderButtons(headerButtons);

    console.log('Store configured, rowData should be:', this.agGridStore.rowData());

    // Set up custom handlers
    this.setupCustomHandlers();

    console.log('Example grid setup completed');
  }

  // Setup grid configuration
  private setupGridConfig() {
    this.agGridStore.setGridConfig({
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
    });

    this.agGridStore.setExportConfig({
      enabled: true,
      formats: ['xlsx', 'csv'],
      defaultFormat: 'xlsx',
      filename: 'users',
      includeHeaders: true
    });
  }

  // Setup custom event handlers
  private setupCustomHandlers() {
    // Set up custom button click handler
    this.agGridStore.setButtonClickHandler((button: HeaderButton) => {
      console.log('Custom button handler:', button);
      switch (button.type) {
        case 'add':
          console.log('Custom add handler - adding new user...');
          this.handleAddUser();
          break;
        case 'delete':
          console.log('Custom delete handler - deleting selected...');
          this.handleDeleteUser();
          break;
        case 'refresh':
          console.log('Custom refresh handler - refreshing data...');
          this.handleRefresh();
          break;
        case 'export':
          console.log('Custom export handler - opening export modal...');
          this.handleExport();
          break;
        case 'settings':
          console.log('Custom settings handler - opening settings...');
          this.handleSettings();
          break;
        case 'toggleRows':
          console.log('Custom toggle rows handler - changing visible rows...');
          this.handleToggleRows();
          break;
        default:
          console.log('Unknown button type:', button.type);
          break;
      }
    });

    // Set up cell value changed handler
    this.agGridStore.setCellValueChangedHandler((params: any) => {
      console.log('Cell value changed:', params.field, 'from', params.oldValue, 'to', params.newValue);
      console.log('Updated row data:', params.data);

      // Example: Update button states based on data changes
      this.updateButtonStates();
    });

    // Set up selection changed handler
    this.agGridStore.setSelectionChangedHandler((params: any) => {
      const selectedRows = params.api.getSelectedRows();
      console.log('Selection changed. Selected rows:', selectedRows.length);

      // Example: Enable/disable delete button based on selection
      this.agGridStore.toggleButtonDisabled('delete', selectedRows.length === 0);
    });

    // Set up row selected handler
    this.agGridStore.setRowSelectedHandler((params: any) => {
      console.log('Row selected:', params.data);
    });
  }

  // Update button states based on current data
  private updateButtonStates() {
    const totalRows = this.agGridStore.getTotalRows();
    const selectedRows = this.agGridStore.getSelectedRows();

    // Disable delete button if no rows are selected
    this.agGridStore.toggleButtonDisabled('delete', selectedRows.length === 0);

    // Disable export button if no data
    this.agGridStore.toggleButtonDisabled('export', totalRows === 0);
  }

  // Business logic methods - pure client-side operations
  private handleAddUser() {
    const newUser = this.generateNewUser();
    this.agGridStore.addRow(newUser);

    // Add a small delay to ensure the grid has processed the new row
    setTimeout(() => {
      this.agGridStore.scrollToLastRow();
    }, 100);

    console.log('New user added:', newUser);
  }

  private handleDeleteUser() {
    const selectedRows = this.agGridStore.getSelectedRows();
    if (selectedRows.length === 0) {
      console.log('No rows selected for deletion');
      return;
    }

    const currentData = this.agGridStore.rowData();
    const selectedIds = selectedRows.map((row: any) => row.id);
    const updatedData = currentData.filter((row: any) => !selectedIds.includes(row.id));
    this.agGridStore.setRowData(updatedData);
    console.log(`${selectedRows.length} user(s) deleted`);
  }

  private handleRefresh() {
    const refreshedData = this.generateSampleData();
    this.agGridStore.setRowData(refreshedData);
    console.log('Data refreshed');
  }

  private handleExport() {
    console.log('Opening export format selection...');
    this.showExportModal = true;
  }

  private handleSettings() {
    console.log('Opening settings panel...');
    console.log('Settings opened!');
  }

  private handleToggleRows() {
    // Cycle through available row counts
    const currentIndex = this.availableVisibleRows.indexOf(this.currentVisibleRows);
    const nextIndex = (currentIndex + 1) % this.availableVisibleRows.length;
    this.currentVisibleRows = this.availableVisibleRows[nextIndex];

    this.agGridStore.setVisibleRows(this.currentVisibleRows);
    console.log(`Visible rows changed to: ${this.currentVisibleRows}`);
  }

  // Export modal methods
  onExportConfirm() {
    const data = this.agGridStore.rowData();
    const filename = `users.${this.selectedExportFormat}`;

    if (this.selectedExportFormat === 'xlsx') {
      this.exportToXLSX(data, filename);
    } else if (this.selectedExportFormat === 'csv') {
      this.exportToCSV(data, filename);
    }

    this.showExportModal = false;
    console.log(`Export completed: ${filename}`);
  }

  onExportCancel() {
    this.showExportModal = false;
    console.log('Export cancelled');
  }

  // Export functionality
  private exportToXLSX(data: any[], filename: string) {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');
    XLSX.writeFile(workbook, filename);
  }

  private exportToCSV(data: any[], filename: string) {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Dynamic configuration methods
  public changeVisibleRows(count: number) {
    if (this.availableVisibleRows.includes(count)) {
      this.currentVisibleRows = count;
      this.agGridStore.setVisibleRows(count);
      console.log(`Visible rows changed to: ${count}`);
    } else {
      console.log(`Invalid visible rows count: ${count}`);
    }
  }

  public getCurrentVisibleRows(): number {
    return this.agGridStore.getVisibleRows();
  }

  public getAvailableVisibleRows(): number[] {
    return this.availableVisibleRows;
  }

  public getTotalRows(): number {
    return this.agGridStore.getTotalRows();
  }

  public getSelectedRowsCount(): number {
    return this.agGridStore.getSelectedRows().length;
  }

  public onVisibleRowsChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    if (target) {
      this.changeVisibleRows(+target.value);
    }
  }

  // Dynamic configuration demonstration methods
  public toggleColumnEditing(field: string): void {
    const currentDefs = this.agGridStore.columnDefs();
    const column = currentDefs.find(col => col.field === field);
    if (column) {
      const newEditable = !column.editable;
      this.agGridStore.updateColumnEditable(field, newEditable);
      console.log(`Column '${field}' editing ${newEditable ? 'enabled' : 'disabled'}`);
    }
  }

  public toggleColumnSorting(field: string): void {
    const currentDefs = this.agGridStore.columnDefs();
    const column = currentDefs.find(col => col.field === field);
    if (column) {
      const newSortable = !column.sortable;
      this.agGridStore.updateColumnSortable(field, newSortable);
      console.log(`Column '${field}' sorting ${newSortable ? 'enabled' : 'disabled'}`);
    }
  }

  public toggleColumnFiltering(field: string): void {
    const currentDefs = this.agGridStore.columnDefs();
    const column = currentDefs.find(col => col.field === field);
    if (column) {
      const newFilterable = !column.filter;
      this.agGridStore.updateColumnFilterable(field, newFilterable);
      console.log(`Column '${field}' filtering ${newFilterable ? 'enabled' : 'disabled'}`);
    }
  }

  public toggleButtonVisibility(buttonType: string): void {
    const currentButtons = this.agGridStore.headerButtons();
    console.log('Current buttons before toggle:', currentButtons);

    const button = currentButtons.find(btn => btn.type === buttonType);
    if (button) {
      const newHidden = !button.hidden;
      this.agGridStore.toggleButtonVisibility(buttonType, newHidden);
      console.log(`Button '${buttonType}' ${newHidden ? 'hidden' : 'shown'}`);

      // Log the updated buttons
      const updatedButtons = this.agGridStore.headerButtons();
      console.log('Updated buttons after toggle:', updatedButtons);
    } else {
      console.log(`Button type '${buttonType}' not found`);
    }
  }

  public updateGridTheme(themeName: 'ag-theme-alpine' | 'ag-theme-balham' | 'ag-theme-material' | 'ag-theme-quartz'): void {
    let theme;
    switch (themeName) {
      case 'ag-theme-alpine':
        theme = themeAlpine;
        break;
      case 'ag-theme-balham':
        theme = themeBalham;
        break;
      case 'ag-theme-material':
        theme = themeMaterial;
        break;
      case 'ag-theme-quartz':
        theme = themeQuartz;
        break;
      default:
        theme = themeMaterial;
    }

    this.agGridStore.setGridConfig({ theme });
    console.log(`Grid theme changed to: ${themeName}`);
  }

  public updateRowHeight(height: number): void {
    console.log('Updating row height to:', height);
    this.agGridStore.setGridConfig({ rowHeight: height });
    console.log(`Row height changed to: ${height}px`);

    // Log the updated config
    const updatedConfig = this.agGridStore.getGridConfig();
    console.log('Updated grid config:', updatedConfig);
  }

  public getGridConfig() {
    return this.agGridStore.getGridConfig();
  }

  public getExportConfig() {
    return this.agGridStore.getExportConfig();
  }

  // Header visibility testing methods
  public testHeaderVisibility() {
    console.log('=== Testing Header Visibility ===');

    // Test 1: Set null buttons
    console.log('Test 1: Setting null buttons');
    this.agGridStore.setHeaderButtons(null as any);
    console.log('Should show header:', this.agGridStore.shouldShowHeader());

    // Test 2: Set empty array
    console.log('Test 2: Setting empty array');
    this.agGridStore.setHeaderButtons([]);
    console.log('Should show header:', this.agGridStore.shouldShowHeader());

    // Test 3: Set all hidden buttons
    console.log('Test 3: Setting all hidden buttons');
    const allHiddenButtons = [
      { type: 'add', label: 'Add', icon: '➕', hidden: true },
      { type: 'delete', label: 'Delete', icon: '🗑️', hidden: true },
      { type: 'refresh', label: 'Refresh', icon: '🔄', hidden: true }
    ];
    this.agGridStore.setHeaderButtons(allHiddenButtons);
    console.log('Should show header:', this.agGridStore.shouldShowHeader());

    // Test 4: Set mixed visibility buttons
    console.log('Test 4: Setting mixed visibility buttons');
    const mixedButtons = [
      { type: 'add', label: 'Add', icon: '➕', hidden: false },
      { type: 'delete', label: 'Delete', icon: '🗑️', hidden: true },
      { type: 'refresh', label: 'Refresh', icon: '🔄', hidden: false }
    ];
    this.agGridStore.setHeaderButtons(mixedButtons);
    console.log('Should show header:', this.agGridStore.shouldShowHeader());

    // Test 5: Restore original buttons
    console.log('Test 5: Restoring original buttons');
    this.agGridStore.setHeaderButtons(this.generateHeaderButtons());
    console.log('Should show header:', this.agGridStore.shouldShowHeader());
  }

  public hideAllButtons() {
    const currentButtons = this.agGridStore.headerButtons();
    const allHiddenButtons = currentButtons.map(btn => ({ ...btn, hidden: true }));
    this.agGridStore.setHeaderButtons(allHiddenButtons);
    console.log('All buttons hidden');
  }

  public showAllButtons() {
    const currentButtons = this.agGridStore.headerButtons();
    const allVisibleButtons = currentButtons.map(btn => ({ ...btn, hidden: false }));
    this.agGridStore.setHeaderButtons(allVisibleButtons);
    console.log('All buttons shown');
  }

  public clearAllButtons() {
    this.agGridStore.setHeaderButtons([]);
    console.log('All buttons cleared');
  }

  public setNullButtons() {
    this.agGridStore.setHeaderButtons(null as any);
    console.log('Buttons set to null');
  }

  // Height adjustment testing
  public testHeaderHeightAdjustment() {
    console.log('=== Testing Header Height Adjustment ===');

    // Test 1: Show header (should have toolbar height)
    console.log('Test 1: Showing header with buttons');
    this.agGridStore.setHeaderButtons(this.generateHeaderButtons());
    const toolbarHeight1 = getComputedStyle(document.documentElement).getPropertyValue('--toolbar-height');
    console.log('Toolbar height with buttons:', toolbarHeight1);

    // Test 2: Hide header (should have 0 toolbar height)
    console.log('Test 2: Hiding header');
    this.agGridStore.setHeaderButtons([]);
    const toolbarHeight2 = getComputedStyle(document.documentElement).getPropertyValue('--toolbar-height');
    console.log('Toolbar height without buttons:', toolbarHeight2);

    // Test 3: Show header again (should restore toolbar height)
    console.log('Test 3: Showing header again');
    this.agGridStore.setHeaderButtons(this.generateHeaderButtons());
    const toolbarHeight3 = getComputedStyle(document.documentElement).getPropertyValue('--toolbar-height');
    console.log('Toolbar height restored:', toolbarHeight3);
  }

  // Data generation methods
  private generateSampleData() {
    return [
      { id: 1, name: 'John Doe', email: 'john@example.com', age: 30, department: 'Engineering', status: 'Active' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', age: 25, department: 'Marketing', status: 'Active' },
      { id: 3, name: 'Bob Johnson', email: 'bob@example.com', age: 35, department: 'Sales', status: 'Inactive' },
      { id: 4, name: 'Alice Brown', email: 'alice@example.com', age: 28, department: 'HR', status: 'Active' },
      { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', age: 32, department: 'Engineering', status: 'Active' },
      { id: 6, name: 'Diana Davis', email: 'diana@example.com', age: 27, department: 'Marketing', status: 'Inactive' },
      { id: 7, name: 'Edward Miller', email: 'edward@example.com', age: 29, department: 'Sales', status: 'Active' },
      { id: 8, name: 'Fiona Garcia', email: 'fiona@example.com', age: 31, department: 'Engineering', status: 'Active' },
      { id: 9, name: 'George Martinez', email: 'george@example.com', age: 26, department: 'HR', status: 'Inactive' },
      { id: 10, name: 'Helen Taylor', email: 'helen@example.com', age: 33, department: 'Marketing', status: 'Active' }
    ];
  }

  private generateNewUser() {
    const currentData = this.agGridStore.rowData();
    const maxId = Math.max(...currentData.map((user: any) => user.id), 0);
    return {
      id: maxId + 1,
      name: 'New User',
      email: 'newuser@example.com',
      age: 25,
      department: 'Engineering',
      status: 'Active'
    };
  }

  private generateColumnDefs() {
    return [
      { field: 'id', headerName: 'ID', sortable: true, filter: true, flex: 1, editable: false },
      { field: 'name', headerName: 'Name', sortable: true, filter: true, flex: 2, editable: true },
      { field: 'email', headerName: 'Email', sortable: true, filter: true, flex: 2, editable: true },
      { field: 'age', headerName: 'Age', sortable: true, filter: true, flex: 1, editable: true },
      {
        field: 'department',
        headerName: 'Department',
        sortable: true,
        filter: true,
        flex: 1,
        editable: true,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {
          values: ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations']
        }
      },
      {
        field: 'status',
        headerName: 'Status',
        sortable: true,
        filter: true,
        flex: 1,
        editable: true,
        cellRenderer: (params: any) => {
          const status = params.value;
          const color = status === 'Active' ? '#27ae60' : '#e74c3c';
          return `<span style="color: ${color}; font-weight: bold;">${status}</span>`;
        }
      }
    ];
  }

  private generateHeaderButtons(): HeaderButton[] {
    return [
      { type: 'add', label: 'Add User', icon: '➕', position: 'start' },
      { type: 'delete', label: 'Delete', icon: '🗑️', position: 'start' },
      { type: 'refresh', label: 'Refresh', icon: '🔄', position: 'start' },
      { type: 'toggleRows', label: 'Toggle Rows', icon: '📊', position: 'start' },
      { type: 'settings', label: 'Settings', icon: '⚙️', position: 'end' },
      { type: 'export', label: 'Export', icon: '📤', position: 'end' }
    ];
  }

  private generateGridOptions(): GridOptions {
    const gridConfig = this.agGridStore.getGridConfig();

    return {
      theme: themeMaterial, // Use legacy theme which is supported by AG Grid
      rowHeight: gridConfig?.rowHeight || 60,
      headerHeight: gridConfig?.headerHeight || 60,
      rowSelection: {
        mode: 'multiRow',
        enableClickSelection: true
      },
      animateRows: true,
      domLayout: 'normal',
      defaultColDef: {
        sortable: true,
        filter: true,
        resizable: true
      },
      suppressCellFocus: false,
      suppressColumnVirtualisation: false,
      suppressRowVirtualisation: false,
      suppressAnimationFrame: false,
      suppressColumnMoveAnimation: false,
      suppressNoRowsOverlay: false,
      suppressFieldDotNotation: false,
      suppressMenuHide: false,
      suppressRowTransform: false,
      loading: false
    };
  }
} 