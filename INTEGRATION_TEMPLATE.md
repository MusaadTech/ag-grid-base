# AG Grid Base Component - Integration Template

A comprehensive template for integrating the AG Grid base component into your Angular project with step-by-step instructions and best practices.

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Quick Integration](#quick-integration)
  - [Step 1: Install Dependencies](#step-1-install-dependencies)
  - [Step 2: Import Components](#step-2-import-components)
  - [Step 3: Basic Setup](#step-3-basic-setup)
  - [Step 4: Configure Data](#step-4-configure-data)
  - [Step 5: Add Headers (Optional)](#step-5-add-headers-optional)
  - [Step 6: Handle Events](#step-6-handle-events)
- [Advanced Configuration](#advanced-configuration)
  - [Grid Options](#grid-options)
  - [Column Definitions](#column-definitions)
  - [Header Buttons](#header-buttons)
  - [Grid Configuration](#grid-configuration)
  - [Export Configuration](#export-configuration)
- [Data Management Examples](#data-management-examples)
  - [Setting Initial Data](#setting-initial-data)
  - [Adding New Rows](#adding-new-rows)
  - [Updating Existing Rows](#updating-existing-rows)
  - [Removing Rows](#removing-rows)
  - [Selection Management](#selection-management)
- [Theming and Styling](#theming-and-styling)
  - [Theme Selection](#theme-selection)
  - [Custom Styling](#custom-styling)
- [Event Handling](#event-handling)
  - [Button Click Events](#button-click-events)
  - [Cell Value Changes](#cell-value-changes)
  - [Selection Changes](#selection-changes)
- [Responsive Design](#responsive-design)
- [Production Deployment](#production-deployment)
- [Troubleshooting](#troubleshooting)
- [Quick Start Checklist](#quick-start-checklist)

---

## Overview

This template provides a complete integration guide for the AG Grid base component. Follow these steps to integrate the component into your Angular project with proper configuration and best practices.

## Prerequisites

- Angular 19+ project
- Node.js 18+ and npm
- Basic understanding of Angular components and TypeScript

## Quick Integration

### Step 1: Install Dependencies

```bash
npm install ag-grid-angular ag-grid-community @ngrx/signals xlsx
```

### Step 2: Import Components

```typescript
import { AgBaseGridComponent } from './components/ag-base-grid/ag-base-grid.component';
import { AgGridStore } from './stores/ag-grid.store';
```

### Step 3: Basic Setup

```typescript
@Component({
  selector: 'app-my-grid',
  standalone: true,
  imports: [AgBaseGridComponent],
  template: '<app-ag-base-grid></app-ag-base-grid>'
})
export class MyGridComponent {
  private agGridStore = inject(AgGridStore);

  ngOnInit() {
    this.setupGrid();
  }

  private setupGrid() {
    // Your grid configuration will go here
  }
}
```

### Step 4: Configure Data

```typescript
private setupGrid() {
  // Set up your data
  const data = [
    { id: 1, name: 'John', email: 'john@example.com', age: 30 },
    { id: 2, name: 'Jane', email: 'jane@example.com', age: 25 },
    { id: 3, name: 'Bob', email: 'bob@example.com', age: 35 }
  ];

  const columns = [
    { field: 'name', headerName: 'Name', sortable: true, filter: true },
    { field: 'email', headerName: 'Email', sortable: true, filter: true },
    { field: 'age', headerName: 'Age', sortable: true, filter: true }
  ];

  // Configure the grid
  this.agGridStore.setRowData(data);
  this.agGridStore.setColumnDefs(columns);
}
```

### Step 5: Add Headers (Optional)

```typescript
private setupGrid() {
  // ... data configuration ...

  // Add header buttons
  const buttons = [
    { type: 'add', label: 'Add User', icon: '➕' },
    { type: 'delete', label: 'Delete', icon: '🗑️' },
    { type: 'export', label: 'Export', icon: '📊' },
    { type: 'refresh', label: 'Refresh', icon: '🔄' }
  ];

  this.agGridStore.setHeaderButtons(buttons);
}
```

### Step 6: Handle Events

```typescript
private setupGrid() {
  // ... data and header configuration ...

  // Set up event handlers
  this.agGridStore.setButtonClickHandler((button) => {
    switch (button.type) {
      case 'add':
        this.handleAdd();
        break;
      case 'delete':
        this.handleDelete();
        break;
      case 'export':
        this.handleExport();
        break;
      case 'refresh':
        this.handleRefresh();
        break;
    }
  });
}

// Implement your business logic
private handleAdd() {
  const newUser = { id: Date.now(), name: '', email: '', age: 0 };
  this.agGridStore.addRow(newUser);
}

private handleDelete() {
  const selected = this.agGridStore.getSelectedRows();
  if (selected.length > 0) {
    selected.forEach(row => {
      const index = this.agGridStore.rowData().findIndex(r => r.id === row.id);
      if (index !== -1) {
        this.agGridStore.removeRow(index);
      }
    });
  }
}

private handleExport() {
  const data = this.agGridStore.getRowData();
  // Implement your export logic
  console.log('Exporting data:', data);
}

private handleRefresh() {
  // Implement your refresh logic
  console.log('Refreshing data...');
}
```

## Advanced Configuration

### Grid Options

```typescript
import { GridOptions, themeMaterial } from 'ag-grid-community';

const gridOptions: GridOptions = {
  theme: themeMaterial,
  rowHeight: 48,
  headerHeight: 48,
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
  }
};

this.agGridStore.setGridOptions(gridOptions);
```

### Column Definitions

```typescript
const columns = [
  { 
    field: 'name', 
    headerName: 'Name', 
    sortable: true, 
    filter: true,
    editable: true
  },
  { 
    field: 'email', 
    headerName: 'Email', 
    sortable: true, 
    filter: true,
    editable: true
  },
  { 
    field: 'age', 
    headerName: 'Age', 
    sortable: true, 
    filter: true,
    editable: true,
    cellEditor: 'agNumberCellEditor'
  },
  { 
    field: 'status', 
    headerName: 'Status', 
    sortable: true, 
    filter: true,
    cellRenderer: (params) => {
      const status = params.value;
      const color = status === 'Active' ? 'green' : 'red';
      return `<span style="color: ${color}">${status}</span>`;
    }
  }
];
```

### Header Buttons

```typescript
const buttons = [
  { 
    type: 'add', 
    label: 'Add User', 
    icon: '➕',
    disabled: false
  },
  { 
    type: 'delete', 
    label: 'Delete Selected', 
    icon: '🗑️',
    disabled: false
  },
  { 
    type: 'export', 
    label: 'Export Data', 
    icon: '📊',
    disabled: false
  },
  { 
    type: 'refresh', 
    label: 'Refresh', 
    icon: '🔄',
    disabled: false
  }
];
```

### Grid Configuration

```typescript
import { themeMaterial } from 'ag-grid-community';

this.agGridStore.setGridConfig({
  theme: themeMaterial,
  rowHeight: 48,
  headerHeight: 48,
  defaultVisibleRows: 10,
  enableExport: true,
  enableMultiSelection: true,
  enableInlineEditing: true,
  enableSorting: true,
  enableFiltering: true,
  enableColumnResizing: true,
  enableRowAnimation: true
});
```

### Export Configuration

```typescript
this.agGridStore.setExportConfig({
  enabled: true,
  formats: ['xlsx', 'csv'],
  defaultFormat: 'xlsx',
  filename: 'grid-data',
  includeHeaders: true
});
```

## Data Management Examples

### Setting Initial Data

```typescript
// From API or local data
const initialData = [
  { id: 1, name: 'John Doe', email: 'john@example.com', age: 30 },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', age: 25 }
];

this.agGridStore.setRowData(initialData);
```

### Adding New Rows

```typescript
// Add single row
const newRow = { id: Date.now(), name: 'New User', email: 'new@example.com', age: 0 };
this.agGridStore.addRow(newRow);

// Add multiple rows
const newRows = [
  { id: Date.now(), name: 'User 1', email: 'user1@example.com', age: 25 },
  { id: Date.now() + 1, name: 'User 2', email: 'user2@example.com', age: 30 }
];

newRows.forEach(row => this.agGridStore.addRow(row));
```

### Updating Existing Rows

```typescript
// Update by index
this.agGridStore.updateRow(0, { name: 'Updated Name' });

// Update by ID
const currentData = this.agGridStore.rowData();
const index = currentData.findIndex(row => row.id === targetId);
if (index !== -1) {
  this.agGridStore.updateRow(index, updatedData);
}
```

### Removing Rows

```typescript
// Remove by index
this.agGridStore.removeRow(0);

// Remove multiple rows
const indicesToRemove = [0, 2, 4];
this.agGridStore.removeRows(indicesToRemove);

// Remove selected rows
const selectedRows = this.agGridStore.getSelectedRows();
const currentData = this.agGridStore.rowData();
const indices = selectedRows.map(row => 
  currentData.findIndex(r => r.id === row.id)
).filter(index => index !== -1);
this.agGridStore.removeRows(indices);
```

### Selection Management

```typescript
// Get selected rows
const selected = this.agGridStore.getSelectedRows();

// Get total rows
const totalRows = this.agGridStore.getTotalRows();

// Clear selection (if supported by your grid configuration)
// This would be handled by the grid itself
```

## Theming and Styling

### Theme Selection

```typescript
import { themeMaterial, themeAlpine, themeBalham, themeQuartz } from 'ag-grid-community';

// Material Design (default)
this.agGridStore.setGridConfig({ theme: themeMaterial });

// Alpine theme
this.agGridStore.setGridConfig({ theme: themeAlpine });

// Balham theme
this.agGridStore.setGridConfig({ theme: themeBalham });

// Quartz theme
this.agGridStore.setGridConfig({ theme: themeQuartz });
```

### Custom Styling

```scss
// Your component styles
.grid-container {
  height: 500px;
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 4px;
}

// Custom header styling
.header-container {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 12px;
  border-radius: 4px 4px 0 0;
}

.header-button {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  margin-right: 8px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-1px);
  }

  &.disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}
```

## Event Handling

### Button Click Events

```typescript
this.agGridStore.setButtonClickHandler((button) => {
  console.log('Button clicked:', button);
  
  switch (button.type) {
    case 'add':
      this.handleAdd();
      break;
    case 'delete':
      this.handleDelete();
      break;
    case 'export':
      this.handleExport();
      break;
    case 'refresh':
      this.handleRefresh();
      break;
    default:
      console.log('Unknown button type:', button.type);
  }
});
```

### Cell Value Changes

```typescript
this.agGridStore.setCellValueChangedHandler((event) => {
  console.log('Cell value changed:', event);
  
  // Handle the change
  const { data, field, newValue, oldValue } = event;
  
  // Update your backend or local state
  this.updateUserData(data.id, field, newValue);
});
```

### Selection Changes

```typescript
this.agGridStore.setSelectionChangedHandler((event) => {
  console.log('Selection changed:', event);
  
  // Update UI based on selection
  const selectedRows = this.agGridStore.getSelectedRows();
  this.updateSelectionUI(selectedRows);
});
```

## Responsive Design

The component automatically adjusts to container size:

```scss
// Responsive container
.grid-wrapper {
  width: 100%;
  height: 100%;
  min-height: 400px;
  
  @media (max-width: 768px) {
    height: 300px;
  }
  
  @media (max-width: 480px) {
    height: 250px;
  }
}

// Grid fills container
.grid-container {
  width: 100%;
  height: 100%;
}
```

## Production Deployment

### Build for Production

```bash
# Build the project
ng build --configuration production

# The built files will be in the dist/ folder
```

### Environment Configuration

```typescript
// environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};

// environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://your-api.com/api'
};
```

### Performance Optimization

```typescript
// Enable production mode
import { enableProdMode } from '@angular/core';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

// Use OnPush change detection for better performance
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
```

## Troubleshooting

### Common Issues

1. **Grid not rendering**
   - Check if data is set: `console.log(this.agGridStore.rowData())`
   - Verify column definitions: `console.log(this.agGridStore.columnDefs())`

2. **Header not showing**
   - Check header buttons: `console.log(this.agGridStore.headerButtons())`
   - Verify visibility logic: `console.log(this.agGridStore.shouldShowHeader())`

3. **Theme issues**
   - Ensure modern theming is used: `import { themeMaterial } from 'ag-grid-community'`
   - Remove legacy CSS imports from styles.scss

4. **Performance issues**
   - Use computed properties for reactive updates
   - Batch multiple updates when possible
   - Monitor memory usage

### Debug Methods

```typescript
// Add to your component for debugging
debugGridState() {
  console.log('=== Grid State Debug ===');
  console.log('Row data:', this.agGridStore.rowData());
  console.log('Column defs:', this.agGridStore.columnDefs());
  console.log('Grid config:', this.agGridStore.getGridConfig());
  console.log('Header buttons:', this.agGridStore.headerButtons());
  console.log('Should show header:', this.agGridStore.shouldShowHeader());
  console.log('Total rows:', this.agGridStore.getTotalRows());
  console.log('Selected rows:', this.agGridStore.getSelectedRows());
}
```

## Quick Start Checklist

- [ ] **Dependencies installed**: `ag-grid-angular`, `ag-grid-community`, `@ngrx/signals`, `xlsx`
- [ ] **Components imported**: `AgBaseGridComponent`, `AgGridStore`
- [ ] **Basic setup complete**: Component created and template added
- [ ] **Data configured**: Row data and column definitions set
- [ ] **Headers added** (optional): Header buttons configured
- [ ] **Event handlers set**: Button click and other event handlers configured
- [ ] **Theming applied**: Modern AG Grid theme selected
- [ ] **Styling customized**: Custom CSS applied if needed
- [ ] **Testing complete**: Grid functionality tested
- [ ] **Production ready**: Build and deployment tested

---

**Ready to use!** This template provides everything you need to integrate the AG Grid base component into your Angular project with proper configuration and best practices. 