# AG Grid Base - Reusable Angular Data Grid Library

A powerful, configurable, and reusable Angular data grid component library built around AG Grid with dynamic configuration capabilities, state management, and modern Angular features.

## 📑 Table of Contents

- [✨ Features](#-features)
- [🏗️ Architecture](#️-architecture)
- [📦 Project Structure](#-project-structure)
- [🚀 Quick Start](#-quick-start)
  - [1. Installation](#1-installation)
  - [2. Basic Usage](#2-basic-usage)
- [🔧 Component Integration Guide](#-component-integration-guide)
- [📊 Data Management](#-data-management)
- [🎨 Configuration](#-configuration)
- [🎯 Example Implementation](#-example-implementation)
- [📋 API Reference](#-api-reference)
- [🚨 Important Notes](#-important-notes)
- [📚 Documentation](#-documentation)

---

## ✨ Features

- **Pure Component Architecture**: Base component handles only grid operations
- **Smart Header Visibility**: Automatically hides header when no buttons are visible
- **Custom Header Buttons**: Positioned start/end with custom actions
- **Multi-Row Selection**: Select multiple rows for bulk operations
- **Editable Cells**: Inline editing with dropdowns and validation
- **Export Functionality**: XLSX and CSV export options
- **Dynamic Row Display**: Configurable visible rows with auto-scroll
- **Custom Cell Rendering**: Status columns with color coding
- **Real-time Updates**: Cell value changes and selection events
- **Modern Angular**: Built with Angular 19, standalone components, and control flow
- **Responsive Design**: Works seamlessly across all device sizes
- **Community Edition**: Uses only AG Grid Community features (no enterprise license required)
- **Client-Side Only**: Pure client-side data handling with no server dependencies

## Architecture

- **Angular 19** with standalone components and modern control flow (`@if`, `@for`)
- **AG Grid Community** for powerful grid functionality (no enterprise features required)
- **NgRx Signals** for reactive state management
- **TypeScript** for type safety and better developer experience
- **SCSS** for advanced styling with CSS custom properties
- **Pure Client-Side**: No API calls or server dependencies - handles all data locally

## 📦 Project Structure

```
src/app/
├── components/
│   ├── ag-base-grid/           # Pure reusable grid component
│   │   ├── ag-base-grid.component.ts
│   │   ├── ag-base-grid.component.html
│   │   ├── ag-base-grid.component.scss
│   │   └── custom-header/      # Custom header component
│   │       ├── custom-header.component.ts
│   │       ├── custom-header.component.html
│   │       └── custom-header.component.scss
│   └── example/                # Comprehensive example implementation
│       ├── example-grid.component.ts
│       ├── example-grid.component.html
│       └── example-grid.component.scss
└── stores/
    ├── ag-grid.model.ts        # TypeScript interfaces
    └── ag-grid.store.ts        # NgRx Signals store (pure state management)
```

## 🚀 Quick Start

### 1. Installation

```bash
# Clone the repository
git clone <repository-url>
cd ag-grid-base

# Install dependencies
npm install

# Start development server
npm start
```

Navigate to `http://localhost:4200` to see the example implementation.

### 2. Basic Usage

```typescript
import { AgBaseGridComponent } from './components/ag-base-grid/ag-base-grid.component';
import { AgGridStore } from './stores/ag-grid.store';

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
    // Configure pure grid data
    this.agGridStore.setRowData(yourData);
    this.agGridStore.setColumnDefs(yourColumnDefs);
    this.agGridStore.setGridOptions(yourGridOptions);
    this.agGridStore.setHeaderButtons(yourHeaderButtons);
  }
}
```

## 🔧 Component Integration Guide

### How to Use the Base Grid Component

The `AgBaseGridComponent` is designed to be a pure, reusable component that handles only grid operations. Here's how to integrate it into your application:

#### 1. Import and Use the Component

```typescript
// In your feature component
import { AgBaseGridComponent } from './components/ag-base-grid/ag-base-grid.component';
import { AgGridStore } from './stores/ag-grid.store';

@Component({
  selector: 'app-users-grid',
  standalone: true,
  imports: [AgBaseGridComponent],
  template: `
    <div class="users-container">
      <h2>Users Management</h2>
      <app-ag-base-grid></app-ag-base-grid>
    </div>
  `
})
export class UsersGridComponent {
  private agGridStore = inject(AgGridStore);

  ngOnInit() {
    this.initializeGrid();
  }

  private initializeGrid() {
    // Set up your data locally
    const usersData = [
      { id: 1, name: 'John Doe', email: 'john@example.com', department: 'Engineering' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', department: 'Marketing' }
    ];

    // Configure columns
    const columnDefs = [
      { field: 'id', headerName: 'ID', sortable: true, filter: true, flex: 1 },
      { field: 'name', headerName: 'Name', sortable: true, filter: true, flex: 2, editable: true },
      { field: 'email', headerName: 'Email', sortable: true, filter: true, flex: 2, editable: true },
      { 
        field: 'department', 
        headerName: 'Department', 
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: { values: ['Engineering', 'Marketing', 'Sales', 'HR'] }
      }
    ];

    // Set up header buttons
    const headerButtons = [
      { type: 'add', label: 'Add User', icon: '➕', position: 'start' },
      { type: 'delete', label: 'Delete', icon: '🗑️', position: 'start' },
      { type: 'export', label: 'Export', icon: '📤', position: 'end' }
    ];

    // Configure grid options
    const gridOptions = {
      rowHeight: 48,
      headerHeight: 48,
      rowSelection: { mode: 'multiRow' },
      animateRows: true,
      onCellValueChanged: (params: any) => {
        console.log('Cell changed:', params);
        this.handleCellChange(params);
      }
    };

    // Apply configuration to store
    this.agGridStore.setRowData(usersData);
    this.agGridStore.setColumnDefs(columnDefs);
    this.agGridStore.setGridOptions(gridOptions);
    this.agGridStore.setHeaderButtons(headerButtons);
    this.agGridStore.setButtonClickHandler(this.handleButtonClick.bind(this));
  }

  // Handle button clicks
  private handleButtonClick(button: HeaderButton) {
    switch (button.type) {
      case 'add':
        this.addNewUser();
        break;
      case 'delete':
        this.deleteSelectedUsers();
        break;
      case 'export':
        this.exportUsers();
        break;
    }
  }

  // Local data operations
  private addNewUser() {
    const newUser = {
      id: Date.now(),
      name: '',
      email: '',
      department: 'Engineering'
    };
    this.agGridStore.addRow(newUser);
  }

  private deleteSelectedUsers() {
    const selectedRows = this.agGridStore.getSelectedRows();
    this.agGridStore.removeRows(selectedRows);
  }

  private exportUsers() {
    const data = this.agGridStore.getRowData();
    this.exportToXLSX(data, 'users.xlsx');
  }

  private handleCellChange(params: any) {
    console.log('User data updated:', params.data);
    // Handle any local state updates here
  }
}
```

#### 2. Multiple Grid Instances

You can use multiple instances of the grid component in the same application:

```typescript
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [AgBaseGridComponent],
  template: `
    <div class="dashboard">
      <div class="grid-section">
        <h3>Active Users</h3>
        <app-ag-base-grid></app-ag-base-grid>
      </div>
      
      <div class="grid-section">
        <h3>Products</h3>
        <app-ag-base-grid></app-ag-base-grid>
      </div>
    </div>
  `
})
export class DashboardComponent {
  private agGridStore = inject(AgGridStore);

  ngOnInit() {
    this.setupUsersGrid();
    this.setupProductsGrid();
  }

  private setupUsersGrid() {
    // Configure users grid
    this.agGridStore.setRowData(this.getUsersData());
    this.agGridStore.setColumnDefs(this.getUsersColumns());
    // ... other configuration
  }

  private setupProductsGrid() {
    // Configure products grid
    this.agGridStore.setRowData(this.getProductsData());
    this.agGridStore.setColumnDefs(this.getProductsColumns());
    // ... other configuration
  }
}
```

#### 3. Dynamic Data Updates

```typescript
@Component({
  selector: 'app-dynamic-grid',
  standalone: true,
  imports: [AgBaseGridComponent],
  template: '<app-ag-base-grid></app-ag-base-grid>'
})
export class DynamicGridComponent {
  private agGridStore = inject(AgGridStore);
  private data: any[] = [];

  ngOnInit() {
    this.initializeGrid();
  }

  private initializeGrid() {
    // Initial setup
    this.agGridStore.setRowData(this.data);
    this.agGridStore.setColumnDefs(this.getColumnDefs());
  }

  private updateData() {
    // Add new data
    const newItem = {
      id: Date.now(),
      name: `User ${Date.now()}`,
      value: Math.floor(Math.random() * 100)
    };

    this.agGridStore.addRow(newItem);
  }
}
```

#### 4. Grid State Management

```typescript
@Component({
  selector: 'app-stateful-grid',
  standalone: true,
  imports: [AgBaseGridComponent],
  template: `
    <div class="grid-container">
      <div class="controls">
        <button (click)="saveState()">Save State</button>
        <button (click)="loadState()">Load State</button>
        <button (click)="resetGrid()">Reset</button>
      </div>
      <app-ag-base-grid></app-ag-base-grid>
    </div>
  `
})
export class StatefulGridComponent {
  private agGridStore = inject(AgGridStore);
  private savedState: any = null;

  ngOnInit() {
    this.initializeGrid();
  }

  private initializeGrid() {
    // Initial grid setup
    this.agGridStore.setRowData(this.getInitialData());
    this.agGridStore.setColumnDefs(this.getColumnDefs());
  }

  saveState() {
    // Save current grid state locally
    this.savedState = {
      rowData: this.agGridStore.getRowData(),
      selectedRows: this.agGridStore.getSelectedRows(),
      visibleRows: this.agGridStore.getVisibleRows()
    };
    console.log('Grid state saved:', this.savedState);
  }

  loadState() {
    if (this.savedState) {
      // Restore saved state
      this.agGridStore.setRowData(this.savedState.rowData);
      // Note: Selection state would need to be restored via grid API
      console.log('Grid state restored');
    }
  }

  resetGrid() {
    // Reset to initial state
    this.agGridStore.setRowData(this.getInitialData());
    this.savedState = null;
  }
}
```

#### 5. Custom Grid Wrapper

```typescript
@Component({
  selector: 'app-custom-grid-wrapper',
  standalone: true,
  imports: [AgBaseGridComponent],
  template: `
    <div class="custom-grid-wrapper">
      <div class="grid-header">
        <h2>{{ title }}</h2>
        <div class="grid-stats">
          Total: {{ totalRows }} | Selected: {{ selectedRows }}
        </div>
      </div>
      
      <app-ag-base-grid></app-ag-base-grid>
      
      <div class="grid-footer">
        <button (click)="refreshData()">Refresh</button>
        <button (click)="clearSelection()">Clear Selection</button>
      </div>
    </div>
  `
})
export class CustomGridWrapperComponent {
  @Input() title: string = 'Data Grid';
  @Input() data: any[] = [];
  @Input() columns: any[] = [];

  private agGridStore = inject(AgGridStore);

  get totalRows(): number {
    return this.agGridStore.getTotalRows();
  }

  get selectedRows(): number {
    return this.agGridStore.getSelectedRows().length;
  }

  ngOnInit() {
    this.initializeGrid();
  }

  private initializeGrid() {
    this.agGridStore.setRowData(this.data);
    this.agGridStore.setColumnDefs(this.columns);
  }

  refreshData() {
    // Regenerate or reload data locally
    this.agGridStore.setRowData(this.generateNewData());
  }

  clearSelection() {
    // Clear grid selection
    this.agGridStore.clearSelection();
  }

  private generateNewData() {
    // Generate new data locally
    return Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      name: `Item ${i + 1}`,
      value: Math.floor(Math.random() * 100)
    }));
  }
}
```

### Integration Best Practices

1. **Keep Data Local**: All data operations should be handled locally within your component
2. **Use Store Methods**: Leverage the `AgGridStore` methods for all grid operations
3. **Handle Events**: Set up proper event handlers for user interactions
4. **Maintain State**: Use the store's state management capabilities
5. **Customize Responsively**: Adapt the grid configuration based on your needs

### Available Store Methods

```typescript
// Data operations
this.agGridStore.setRowData(data);
this.agGridStore.addRow(row);
this.agGridStore.updateRow(id, updates);
this.agGridStore.removeRow(id);
this.agGridStore.removeRows(rows);
this.agGridStore.clearData();

// Configuration
this.agGridStore.setColumnDefs(columns);
this.agGridStore.setGridOptions(options);
this.agGridStore.setHeaderButtons(buttons);
this.agGridStore.setButtonClickHandler(handler);

// State queries
this.agGridStore.getRowData();
this.agGridStore.getSelectedRows();
this.agGridStore.getTotalRows();
this.agGridStore.getVisibleRows();

// Grid control
this.agGridStore.clearSelection();
this.agGridStore.scrollToLastRow();
this.agGridStore.shouldShowHeader();
```

## Configuration Guide

### 1. Data Configuration

```typescript
// Set your data
const sampleData = [
  { id: 1, name: 'John Doe', email: 'john@example.com', age: 30 },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', age: 25 }
];

this.agGridStore.setRowData(sampleData);
```

### 2. Column Definitions

```typescript
const columnDefs = [
  { 
    field: 'id', 
    headerName: 'ID', 
    sortable: true, 
    filter: true, 
    flex: 1, 
    editable: false 
  },
  { 
    field: 'name', 
    headerName: 'Name', 
    sortable: true, 
    filter: true, 
    flex: 2, 
    editable: true 
  },
  {
    field: 'department',
    headerName: 'Department',
    cellEditor: 'agSelectCellEditor',
    cellEditorParams: {
      values: ['Engineering', 'Marketing', 'Sales', 'HR']
    }
  }
];

this.agGridStore.setColumnDefs(columnDefs);
```

### 3. Header Buttons

```typescript
const headerButtons: HeaderButton[] = [
  { type: 'add', label: 'Add User', icon: '➕', position: 'start' },
  { type: 'delete', label: 'Delete', icon: '🗑️', position: 'start' },
  { type: 'export', label: 'Export', icon: '📤', position: 'end' },
  { type: 'settings', label: 'Settings', icon: '⚙️', position: 'end' }
];

this.agGridStore.setHeaderButtons(headerButtons);
```

### 4. Grid Options

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

### 5. Custom Actions

```typescript
// Set up custom button click handlers
this.agGridStore.setButtonClickHandler((button: HeaderButton) => {
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
  }
});

// Handle business logic in your component
private handleAdd() {
  // Create new item locally
  const newItem = { id: Date.now(), name: '', email: '', age: 0 };
  this.agGridStore.addRow(newItem);
}

private handleDelete() {
  // Handle deletion locally
  const selected = this.agGridStore.getSelectedRows();
  this.agGridStore.removeRows(selected);
}

private handleExport() {
  // Export current grid data
  const data = this.agGridStore.getRowData();
  this.exportToXLSX(data, 'grid-data.xlsx');
}
```

### Local Data Management

```typescript
// Add new row locally
this.agGridStore.addRow({ id: 1, name: 'New User', email: 'new@example.com' });

// Update existing row
this.agGridStore.updateRow(1, { name: 'Updated Name' });

// Remove row locally
this.agGridStore.removeRow(1);

// Get current data
const currentData = this.agGridStore.getRowData();

// Clear all data
this.agGridStore.clearData();
```

## Example Implementation

The project includes a comprehensive example in `src/app/components/example/` that demonstrates:

- ✅ All available features
- ✅ Best practices for configuration
- ✅ Dynamic data generation (client-side only)
- ✅ Custom styling and theming
- ✅ Export functionality
- ✅ Interactive controls
- ✅ Header visibility testing
- ✅ Height adjustment functionality
- ✅ Pure client-side data management

Run the example to see all features in action:

```bash
npm start
```

## Development

### Available Scripts

```bash
# Start development server
npm start

# Build for production
npm run build

# Run unit tests
npm test

# Build in watch mode
npm run watch
```

### Code Scaffolding

```bash
# Generate a new component
ng generate component component-name

# Generate a new service
ng generate service service-name
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Acknowledgments

- [AG Grid](https://www.ag-grid.com/) for the powerful grid functionality
- [Angular](https://angular.io/) for the amazing framework
- [NgRx](https://ngrx.io/) for state management solutions

## Support

For support and questions:

- 📧 Create an issue on GitHub
- 📖 Check the example implementation
- 🔍 Review the configuration guide above

---

**Built with ❤️ using Angular 19 and AG Grid**
