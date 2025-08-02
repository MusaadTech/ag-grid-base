# AG Grid Base - Reusable Angular Data Grid Library

A powerful, configurable, and reusable Angular data grid component library built around AG Grid with dynamic configuration capabilities, state management, and modern Angular features.

## Features

- **Dynamic Configuration**: All grid settings configurable through centralized store
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

## Architecture

- **Angular 19** with standalone components and modern control flow (`@if`, `@for`)
- **AG Grid Community** for powerful grid functionality (no enterprise features required)
- **NgRx Signals** for reactive state management
- **TypeScript** for type safety and better developer experience
- **SCSS** for advanced styling with CSS custom properties

## 📦 Project Structure

```
src/app/
├── components/
│   ├── ag-base-grid/           # Core reusable grid component
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
    └── ag-grid.store.ts        # NgRx Signals store
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
  private store = inject(AgGridStore);

  ngOnInit() {
    this.setupGrid();
  }

  private setupGrid() {
    // Configure data
    this.store.setRowData(yourData);
    this.store.setColumnDefs(yourColumnDefs);
    this.store.setGridOptions(yourGridOptions);
    this.store.setHeaderButtons(yourHeaderButtons);
  }
}
```

## Configuration Guide

### 1. Data Configuration

```typescript
// Set your data
const sampleData = [
  { id: 1, name: 'John Doe', email: 'john@example.com', age: 30 },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', age: 25 }
];

this.store.setRowData(sampleData);
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

this.store.setColumnDefs(columnDefs);
```

### 3. Header Buttons

```typescript
const headerButtons: HeaderButton[] = [
  { type: 'add', label: 'Add User', icon: '➕', position: 'start' },
  { type: 'delete', label: 'Delete', icon: '🗑️', position: 'start' },
  { type: 'export', label: 'Export', icon: '📤', position: 'end' },
  { type: 'settings', label: 'Settings', icon: '⚙️', position: 'end' }
];

this.store.setHeaderButtons(headerButtons);
```

### 4. Grid Options

```typescript
const gridOptions = {
  rowHeight: 48,
  headerHeight: 48,
  rowSelection: { mode: 'multiRow' },
  animateRows: true,
  onCellValueChanged: (params: any) => {
    console.log('Cell changed:', params);
  }
};

this.store.setGridOptions(gridOptions);
```

### 5. Custom Actions

```typescript
// Set up custom button click handlers
this.store.setButtonClickHandler((button: HeaderButton) => {
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

// Set up data fetcher (for refresh functionality)
this.store.setDataFetcher(async () => {
  return await this.apiService.getData();
});

// Set up insert function (for add functionality)
this.store.setInsertFn(async () => {
  return await this.apiService.createItem();
});
```

## Customization

### Dynamic Row Display

```typescript
// Set visible rows (default is 3)
this.store.setVisibleRows(5);

// Get current visible rows
const currentRows = this.store.getVisibleRows();

// Get total rows
const totalRows = this.store.getTotalRows();
```

### Custom Cell Rendering

```typescript
{
  field: 'status',
  headerName: 'Status',
  cellRenderer: (params: any) => {
    const status = params.value;
    const color = status === 'Active' ? '#27ae60' : '#e74c3c';
    return `<span style="color: ${color}; font-weight: bold;">${status}</span>`;
  }
}
```

### Export Functionality

The library includes built-in export functionality for both XLSX and CSV formats:

```typescript
// Export to XLSX
this.exportToXLSX(data, 'filename.xlsx');

// Export to CSV
this.exportToCSV(data, 'filename.csv');
```

## Advanced Features

### Multi-Row Selection

```typescript
// Get selected rows
const selectedRows = this.store.getSelectedRows();

// Handle selection changes
const gridOptions = {
  onSelectionChanged: (params: any) => {
    const selectedRows = params.api.getSelectedRows();
    console.log('Selected rows:', selectedRows);
  }
};
```

### Auto-Scroll to New Rows

```typescript
// Automatically scroll to the last row after adding new data
this.store.scrollToLastRow();
```

### Custom Cell Editors

```typescript
{
  field: 'department',
  cellEditor: 'agSelectCellEditor',
  cellEditorParams: {
    values: ['Engineering', 'Marketing', 'Sales', 'HR']
  }
}
```

## Responsive Design

The grid automatically adapts to different screen sizes and includes:

- **Flexible column widths** using flex properties
- **Responsive button positioning** (start/end groups)
- **Dynamic height calculation** based on visible rows
- **Mobile-friendly interactions**

## Example Implementation

The project includes a comprehensive example in `src/app/components/example/` that demonstrates:

- ✅ All available features
- ✅ Best practices for configuration
- ✅ Dynamic data generation
- ✅ Custom styling and theming
- ✅ Export functionality
- ✅ Interactive controls

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
