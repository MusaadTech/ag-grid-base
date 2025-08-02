import { Component, inject, OnInit } from '@angular/core';
import { AgBaseGridComponent } from '../ag-base-grid/ag-base-grid.component';
import { AgGridStore } from '../../stores/ag-grid.store';
import { HeaderButton } from '../../stores/ag-grid.model';
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
  public store = inject(AgGridStore);

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
    this.store.setVisibleRows(this.currentVisibleRows);

    console.log('Grid options being set:', gridOptions);
    console.log('Configuring store with data:', sampleData);

    // Configure the store
    this.store.setRowData(sampleData);
    this.store.setColumnDefs(columnDefs);
    this.store.setGridOptions(gridOptions);
    this.store.setHeaderButtons(headerButtons);

    console.log('Store configured, rowData should be:', this.store.rowData());

    // Set up data fetcher (simulates API call)
    this.store.setDataFetcher(async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return sampleData;
    });

    // Set up insert function
    this.store.setInsertFn(async () => {
      // Simulate API call to add new user
      await new Promise(resolve => setTimeout(resolve, 300));
      return this.generateNewUser();
    });

    // Set up custom handlers
    this.setupCustomHandlers();

    console.log('Example grid setup completed');
  }

  // Setup grid configuration
  private setupGridConfig() {
    this.store.setGridConfig({
      theme: 'legacy',
      rowHeight: 60,
      headerHeight: 60,
      defaultVisibleRows: 3,
      enableExport: true,
      enableMultiSelection: true,
      enableInlineEditing: true,
      enableSorting: true,
      enableFiltering: true,
      enableColumnResizing: false,
      enableRowAnimation: true
    });

    this.store.setExportConfig({
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
    this.store.setButtonClickHandler((button: HeaderButton) => {
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
    this.store.setCellValueChangedHandler((params: any) => {
      console.log('Cell value changed:', params.field, 'from', params.oldValue, 'to', params.newValue);
      console.log('Updated row data:', params.data);

      // Example: Update button states based on data changes
      this.updateButtonStates();
    });

    // Set up selection changed handler
    this.store.setSelectionChangedHandler((params: any) => {
      const selectedRows = params.api.getSelectedRows();
      console.log('Selection changed. Selected rows:', selectedRows.length);

      // Example: Enable/disable delete button based on selection
      this.store.toggleButtonDisabled('delete', selectedRows.length === 0);
    });

    // Set up row selected handler
    this.store.setRowSelectedHandler((params: any) => {
      console.log('Row selected:', params.data);
    });
  }

  // Update button states based on current data
  private updateButtonStates() {
    const totalRows = this.store.getTotalRows();
    const selectedRows = this.store.getSelectedRows();

    // Disable delete button if no rows are selected
    this.store.toggleButtonDisabled('delete', selectedRows.length === 0);

    // Disable export button if no data
    this.store.toggleButtonDisabled('export', totalRows === 0);
  }

  // Dynamic data generation
  private generateSampleData() {
    return [
      { id: 1, name: 'John Doe', email: 'john@example.com', age: 30, department: 'Engineering', status: 'Active' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', age: 25, department: 'Marketing', status: 'Active' },
      { id: 3, name: 'Bob Johnson', email: 'bob@example.com', age: 35, department: 'Sales', status: 'Inactive' },
      { id: 4, name: 'Alice Brown', email: 'alice@example.com', age: 28, department: 'HR', status: 'Active' },
      { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', age: 32, department: 'Engineering', status: 'Active' },
      { id: 6, name: 'Diana Prince', email: 'diana@example.com', age: 29, department: 'Finance', status: 'Active' },
      { id: 7, name: 'Eve Adams', email: 'eve@example.com', age: 31, department: 'IT', status: 'Inactive' }
    ];
  }

  // Dynamic column definitions
  private generateColumnDefs() {
    return [
      {
        field: 'id',
        headerName: 'ID',
        sortable: true,
        filter: true,
        flex: 1,
        resizable: false,
        editable: false,
        cellStyle: { fontWeight: 'bold' }
      },
      {
        field: 'name',
        headerName: 'Name',
        sortable: true,
        filter: true,
        flex: 2,
        resizable: false,
        editable: true,
        cellStyle: { color: '#2c3e50' }
      },
      {
        field: 'email',
        headerName: 'Email',
        sortable: true,
        filter: true,
        flex: 3,
        resizable: false,
        editable: true,
        cellStyle: { color: '#3498db' }
      },
      {
        field: 'age',
        headerName: 'Age',
        sortable: true,
        filter: true,
        flex: 1,
        resizable: false,
        editable: true,
        cellStyle: { textAlign: 'center' }
      },
      {
        field: 'department',
        headerName: 'Department',
        sortable: true,
        filter: true,
        flex: 2,
        resizable: false,
        editable: true,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {
          values: ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'IT', 'Operations']
        },
        cellStyle: { backgroundColor: '#f8f9fa' }
      },
      {
        field: 'status',
        headerName: 'Status',
        sortable: true,
        filter: true,
        flex: 1,
        resizable: false,
        editable: true,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {
          values: ['Active', 'Inactive', 'Pending']
        },
        cellRenderer: (params: any) => {
          const status = params.value;
          const color = status === 'Active' ? '#27ae60' : status === 'Inactive' ? '#e74c3c' : '#f39c12';
          return `<span style="color: ${color}; font-weight: bold;">${status}</span>`;
        }
      }
    ];
  }

  // Dynamic header buttons
  private generateHeaderButtons(): HeaderButton[] {
    return [
      { type: 'add', label: 'Add User', icon: '➕', position: 'start' },
      { type: 'delete', label: 'Delete', icon: '🗑️', position: 'start' },
      { type: 'refresh', label: 'Refresh', icon: '🔄', position: 'start' },
      { type: 'toggleRows', label: 'Toggle Rows', icon: '📊', position: 'start' },
      { type: 'export', label: 'Export', icon: '📤', position: 'end' },
      { type: 'settings', label: 'Settings', icon: '⚙️', position: 'end' },
    ];
  }

  // Dynamic grid options
  private generateGridOptions() {
    const gridConfig = this.store.getGridConfig();

    return {
      rowHeight: gridConfig?.rowHeight || 60,
      headerHeight: gridConfig?.headerHeight || 60,
      rowSelection: {
        mode: 'multiRow',
      },
      animateRows: true,
      suppressColumnVirtualisation: false,
      suppressRowVirtualisation: false
    };
  }

  // Dynamic new user generation
  private generateNewUser() {
    const departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'IT', 'Operations'];
    const statuses = ['Active', 'Inactive', 'Pending'];

    return {
      id: Math.floor(Math.random() * 1000) + 100,
      name: 'New User',
      email: 'newuser@example.com',
      age: Math.floor(Math.random() * 30) + 20,
      department: departments[Math.floor(Math.random() * departments.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)]
    };
  }

  private handleAddUser() {
    // Create a new user with empty values for manual editing
    const newUser = {
      id: Math.floor(Math.random() * 1000) + 100,
      name: '',
      email: '',
      age: null,
      department: '',
      status: 'Active'
    };

    // Get current data and add the new user
    const currentData = this.store.rowData();
    const updatedData = [...currentData, newUser];

    // Update the store with new data
    this.store.setRowData(updatedData);

    // Auto-scroll to the newly added row
    setTimeout(() => {
      this.store.scrollToLastRow();
    }, 100);

    console.log('Empty user row added:', newUser);
    console.log('Total users now:', updatedData.length);
  }

  private handleRefresh() {
    console.log('Refreshing data...');
    this.store.fetchData();
  }

  private handleDeleteUser() {
    // Get all selected rows from the grid
    const selectedRows = this.store.getSelectedRows();

    if (selectedRows && selectedRows.length > 0) {
      const currentData = this.store.rowData();

      // Get IDs of all selected rows
      const selectedIds = selectedRows.map((row: any) => row.id);

      // Remove all selected rows
      const updatedData = currentData.filter((row: any) => !selectedIds.includes(row.id));

      // Update the store with new data
      this.store.setRowData(updatedData);

      console.log(`${selectedRows.length} user(s) deleted:`, selectedRows);
      console.log('Total users now:', updatedData.length);
    } else {
      console.log('No rows selected for deletion');
    }
  }

  private handleExport() {
    console.log('Opening export format selection...');
    this.showExportModal = true;
  }

  private handleSettings() {
    console.log('Opening settings panel...');
    setTimeout(() => {
      console.log('Settings opened!');
    }, 500);
  }

  private handleToggleRows() {
    // Cycle through available row counts
    const currentIndex = this.availableVisibleRows.indexOf(this.currentVisibleRows);
    const nextIndex = (currentIndex + 1) % this.availableVisibleRows.length;
    this.currentVisibleRows = this.availableVisibleRows[nextIndex];

    this.store.setVisibleRows(this.currentVisibleRows);
    console.log(`Visible rows changed to: ${this.currentVisibleRows}`);
  }

  // Export modal methods
  onExportConfirm() {
    const data = this.store.rowData();
    const filename = `users.${this.selectedExportFormat}`;

    if (this.selectedExportFormat === 'xlsx') {
      this.exportToXLSX(data, filename);
    } else {
      this.exportToCSV(data, filename);
    }

    this.showExportModal = false;
    console.log(`Exported data as ${this.selectedExportFormat.toUpperCase()}`);
  }

  onExportCancel() {
    this.showExportModal = false;
    console.log('Export cancelled');
  }

  // Public methods for external control
  public changeVisibleRows(count: number) {
    if (this.availableVisibleRows.includes(count)) {
      this.currentVisibleRows = count;
      this.store.setVisibleRows(count);
      console.log(`Visible rows changed to: ${count}`);
    } else {
      console.warn(`Invalid row count: ${count}. Available options:`, this.availableVisibleRows);
    }
  }

  public getCurrentVisibleRows(): number {
    return this.store.getVisibleRows();
  }

  public getAvailableVisibleRows(): number[] {
    return this.availableVisibleRows;
  }

  public getTotalRows(): number {
    return this.store.getTotalRows();
  }

  public onVisibleRowsChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    if (target) {
      this.changeVisibleRows(+target.value);
    }
  }

  // Dynamic configuration demonstration methods
  public toggleColumnEditing(field: string): void {
    const currentDefs = this.store.columnDefs();
    const column = currentDefs.find(col => col.field === field);
    if (column) {
      const newEditable = !column.editable;
      this.store.updateColumnEditable(field, newEditable);
      console.log(`Column '${field}' editing ${newEditable ? 'enabled' : 'disabled'}`);
    }
  }

  public toggleColumnSorting(field: string): void {
    const currentDefs = this.store.columnDefs();
    const column = currentDefs.find(col => col.field === field);
    if (column) {
      const newSortable = !column.sortable;
      this.store.updateColumnSortable(field, newSortable);
      console.log(`Column '${field}' sorting ${newSortable ? 'enabled' : 'disabled'}`);
    }
  }

  public toggleColumnFiltering(field: string): void {
    const currentDefs = this.store.columnDefs();
    const column = currentDefs.find(col => col.field === field);
    if (column) {
      const newFilterable = !column.filter;
      this.store.updateColumnFilterable(field, newFilterable);
      console.log(`Column '${field}' filtering ${newFilterable ? 'enabled' : 'disabled'}`);
    }
  }

  public toggleButtonVisibility(buttonType: string): void {
    const currentButtons = this.store.headerButtons();
    console.log('Current buttons before toggle:', currentButtons);

    const button = currentButtons.find(btn => btn.type === buttonType);
    console.log('Found button:', button);

    if (button) {
      const newHidden = !button.hidden;
      this.store.toggleButtonVisibility(buttonType, newHidden);
      console.log(`Button '${buttonType}' ${newHidden ? 'hidden' : 'shown'}`);

      // Log the updated buttons
      setTimeout(() => {
        const updatedButtons = this.store.headerButtons();
        console.log('Updated buttons after toggle:', updatedButtons);
      }, 100);
    } else {
      console.warn(`Button type '${buttonType}' not found. Available buttons:`, currentButtons.map(btn => btn.type));
    }
  }

  public updateGridTheme(theme: string): void {
    this.store.setGridConfig({ theme });
    console.log(`Grid theme changed to: ${theme}`);
  }

  public updateRowHeight(height: number): void {
    console.log('Updating row height to:', height);
    this.store.setGridConfig({ rowHeight: height });
    console.log(`Row height changed to: ${height}px`);

    // Log the updated config
    setTimeout(() => {
      const updatedConfig = this.store.getGridConfig();
      console.log('Updated grid config:', updatedConfig);
    }, 100);
  }

  public getGridConfig() {
    return this.store.getGridConfig();
  }

  public getExportConfig() {
    return this.store.getExportConfig();
  }

  // Test methods for header visibility functionality
  public testHeaderVisibility() {
    console.log('=== Testing Header Visibility ===');

    // Test 1: Set null buttons
    console.log('Test 1: Setting null buttons');
    this.store.setHeaderButtons(null as any);
    console.log('Should show header:', this.store.shouldShowHeader());

    // Test 2: Set empty array
    console.log('Test 2: Setting empty array');
    this.store.setHeaderButtons([]);
    console.log('Should show header:', this.store.shouldShowHeader());

    // Test 3: Set all hidden buttons
    console.log('Test 3: Setting all hidden buttons');
    const allHiddenButtons: HeaderButton[] = [
      { type: 'add', label: 'Add', icon: '➕', hidden: true },
      { type: 'delete', label: 'Delete', icon: '🗑️', hidden: true },
      { type: 'refresh', label: 'Refresh', icon: '🔄', hidden: true }
    ];
    this.store.setHeaderButtons(allHiddenButtons);
    console.log('Should show header:', this.store.shouldShowHeader());

    // Test 4: Set mixed visibility buttons
    console.log('Test 4: Setting mixed visibility buttons');
    const mixedButtons: HeaderButton[] = [
      { type: 'add', label: 'Add', icon: '➕', hidden: false },
      { type: 'delete', label: 'Delete', icon: '🗑️', hidden: true },
      { type: 'refresh', label: 'Refresh', icon: '🔄', hidden: false }
    ];
    this.store.setHeaderButtons(mixedButtons);
    console.log('Should show header:', this.store.shouldShowHeader());

    // Test 5: Restore original buttons
    console.log('Test 5: Restoring original buttons');
    this.store.setHeaderButtons(this.generateHeaderButtons());
    console.log('Should show header:', this.store.shouldShowHeader());
  }

  public hideAllButtons() {
    const currentButtons = this.store.headerButtons();
    const allHiddenButtons = currentButtons.map(btn => ({ ...btn, hidden: true }));
    this.store.setHeaderButtons(allHiddenButtons);
    console.log('All buttons hidden');
  }

  public showAllButtons() {
    const currentButtons = this.store.headerButtons();
    const allVisibleButtons = currentButtons.map(btn => ({ ...btn, hidden: false }));
    this.store.setHeaderButtons(allVisibleButtons);
    console.log('All buttons shown');
  }

  public clearAllButtons() {
    this.store.setHeaderButtons([]);
    console.log('All buttons cleared');
  }

  public setNullButtons() {
    this.store.setHeaderButtons(null as any);
    console.log('Buttons set to null');
  }

  // Test header height adjustment
  public testHeaderHeightAdjustment() {
    console.log('=== Testing Header Height Adjustment ===');

    // Test 1: Show header (should have toolbar height)
    console.log('Test 1: Showing header with buttons');
    this.store.setHeaderButtons(this.generateHeaderButtons());
    setTimeout(() => {
      const toolbarHeight = getComputedStyle(document.documentElement).getPropertyValue('--toolbar-height');
      console.log('Toolbar height with visible header:', toolbarHeight);
    }, 100);

    // Test 2: Hide header (should have 0 toolbar height)
    setTimeout(() => {
      console.log('Test 2: Hiding header');
      this.store.setHeaderButtons([]);
      setTimeout(() => {
        const toolbarHeight = getComputedStyle(document.documentElement).getPropertyValue('--toolbar-height');
        console.log('Toolbar height with hidden header:', toolbarHeight);
      }, 100);
    }, 2000);

    // Test 3: Show header again
    setTimeout(() => {
      console.log('Test 3: Showing header again');
      this.store.setHeaderButtons(this.generateHeaderButtons());
      setTimeout(() => {
        const toolbarHeight = getComputedStyle(document.documentElement).getPropertyValue('--toolbar-height');
        console.log('Toolbar height with visible header again:', toolbarHeight);
      }, 100);
    }, 4000);
  }

  // Export methods
  private exportToXLSX(data: any[], filename: string) {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, filename);
  }

  private exportToCSV(data: any[], filename: string) {
    if (data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvRows = [headers.join(',')];

    for (const row of data) {
      const values = headers.map(header => {
        const value = row[header];
        return `"${value}"`;
      });
      csvRows.push(values.join(','));
    }

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
} 