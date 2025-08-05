import { Component, computed, inject, ViewChild } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { AgGridStore } from '../../stores/ag-grid.store';
import { GridOptions, themeMaterial } from 'ag-grid-community';
import { CustomHeaderComponent } from './custom-header/custom-header.component';

@Component({
  selector: 'app-ag-base-grid',
  standalone: true,
  imports: [AgGridAngular, CustomHeaderComponent],
  templateUrl: './ag-base-grid.component.html',
  styleUrl: './ag-base-grid.component.scss',
})
export class AgBaseGridComponent {
  private agGridStore = inject(AgGridStore);

  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;

  // Access the signals properly
  rowData = computed(() => {
    const data = this.agGridStore.rowData();
    console.log('Row data being passed to grid:', data);
    return data;
  });

  columnDefs = computed(() => {
    console.log('Computing columnDefs, store columnDefs:', this.agGridStore.columnDefs());
    return this.agGridStore.columnDefs();
  });

  // Check if header buttons should be visible
  shouldShowHeader = computed(() => {
    const headerButtons = this.agGridStore.headerButtons();

    console.log('Checking header visibility. Buttons:', headerButtons);

    // If buttons array is null, undefined, or empty, don't show header
    if (!headerButtons || headerButtons.length === 0) {
      console.log('Header hidden: No buttons or empty array');
      return false;
    }

    // If all buttons are hidden, don't show header
    const allButtonsHidden = headerButtons.every(button => button.hidden === true);
    if (allButtonsHidden) {
      console.log('Header hidden: All buttons are hidden');
      return false;
    }

    console.log('Header visible: Has visible buttons');
    return true;
  });

  gridOptions = computed(() => {
    const baseOptions = this.agGridStore.gridOptions() || {};
    const visibleRows = this.agGridStore.getVisibleRows();
    const gridConfig = this.agGridStore.getGridConfig();

    // Get row height from store configuration, fallback to 60
    const rowHeight = gridConfig?.rowHeight || 60;
    const headerHeight = gridConfig?.headerHeight || 60;
    const toolbarHeight = this.shouldShowHeader() ? 46 : 0; // Reduce toolbar height when header is hidden
    const calculatedHeight = (visibleRows * rowHeight) + headerHeight;

    // Update CSS custom properties
    document.documentElement.style.setProperty('--grid-height', `${calculatedHeight}px`);
    document.documentElement.style.setProperty('--toolbar-height', `${toolbarHeight}px`);

    // Merge base options with computed options, preserving AG Grid types
    const options = {
      ...baseOptions,
      theme: baseOptions.theme || themeMaterial, // Use modern theming API
      rowHeight: rowHeight,
      headerHeight: headerHeight,
      onCellValueChanged: this.agGridStore.cellValueChangedHandler(),
      onSelectionChanged: this.agGridStore.selectionChangedHandler(),
      onRowSelected: this.agGridStore.rowSelectedHandler()
    };

    console.log('Grid options being passed to AG Grid:', options);
    return options;
  });

  onGridReady() {
    console.log('Grid ready');
    // Store the grid API reference
    this.agGridStore.setGridApi(this.agGrid.api);
    this.updateGridHeight();
  }

  private updateGridHeight() {
    const visibleRows = this.agGridStore.getVisibleRows();
    const gridConfig = this.agGridStore.getGridConfig();

    // Get row height from store configuration, fallback to 60
    const rowHeight = gridConfig?.rowHeight || 60;
    const headerHeight = gridConfig?.headerHeight || 60;
    const toolbarHeight = this.shouldShowHeader() ? 46 : 0; // Reduce toolbar height when header is hidden
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
