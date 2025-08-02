import { Component, computed, inject, ViewChild } from '@angular/core';
import { AgGridAngular, AgGridModule } from 'ag-grid-angular';
import { AgGridStore } from '../../stores/ag-grid.store';
import { CustomHeaderComponent } from './custom-header/custom-header.component';

@Component({
  selector: 'app-ag-base-grid',
  standalone: true,
  imports: [AgGridAngular, CustomHeaderComponent],
  templateUrl: './ag-base-grid.component.html',
  styleUrl: './ag-base-grid.component.scss',
})
export class AgBaseGridComponent {
  private store = inject(AgGridStore);

  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;

  // Access the signals properly
  rowData = computed(() => {
    const data = this.store.rowData();
    console.log('Row data being passed to grid:', data);
    return data;
  });

  columnDefs = computed(() => {
    console.log('Computing columnDefs, store columnDefs:', this.store.columnDefs());
    return this.store.columnDefs();
  });

  gridOptions = computed(() => {
    const baseOptions = this.store.gridOptions() || {};
    // If no theme is specified, default to legacy
    const theme = baseOptions.theme || 'legacy';
    const visibleRows = this.store.getVisibleRows();
    const gridConfig = this.store.getGridConfig();

    // Get row height from store configuration, fallback to 60
    const rowHeight = gridConfig?.rowHeight || 60;
    const headerHeight = gridConfig?.headerHeight || 60;
    const toolbarHeight = 46;
    const calculatedHeight = (visibleRows * rowHeight) + headerHeight;

    // Update CSS custom properties
    document.documentElement.style.setProperty('--grid-height', `${calculatedHeight}px`);
    document.documentElement.style.setProperty('--toolbar-height', `${toolbarHeight}px`);

    const options = {
      ...baseOptions,
      theme: theme,
      domLayout: 'normal',
      rowHeight: rowHeight,
      headerHeight: headerHeight,
      onCellValueChanged: this.store.cellValueChangedHandler(),
      onSelectionChanged: this.store.selectionChangedHandler(),
      onRowSelected: this.store.rowSelectedHandler()
    };
    console.log('Grid options being passed to AG Grid:', options);
    return options;
  });

  onGridReady() {
    console.log('Grid ready');
    // Store the grid API reference
    this.store.setGridApi(this.agGrid.api);
    this.updateGridHeight();
  }

  private updateGridHeight() {
    const visibleRows = this.store.getVisibleRows();
    const gridConfig = this.store.getGridConfig();

    // Get row height from store configuration, fallback to 60
    const rowHeight = gridConfig?.rowHeight || 60;
    const headerHeight = gridConfig?.headerHeight || 60;
    const toolbarHeight = 46;
    const calculatedHeight = (visibleRows * rowHeight) + headerHeight;

    // Set CSS custom properties for dynamic height calculations
    document.documentElement.style.setProperty('--grid-height', `${calculatedHeight}px`);
    document.documentElement.style.setProperty('--toolbar-height', `${toolbarHeight}px`);
  }

  // Method to get selected rows
  getSelectedRows() {
    return this.agGrid?.api?.getSelectedRows() || [];
  }
}
