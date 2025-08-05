# 🚀 AG Grid Base Component - Quick Start Guide

A **pure client-side** AG Grid base component with reactive state management, ready for immediate use in any Angular project.

## 📑 Table of Contents

- [📋 What You Get](#-what-you-get)
- [🎯 Quick Start (5 Minutes)](#-quick-start-5-minutes)
  - [1. Install Dependencies](#1-install-dependencies)
  - [2. Import the Component](#2-import-the-component)
  - [3. Basic Usage](#3-basic-usage)
  - [4. Add Custom Headers (Optional)](#4-add-custom-headers-optional)
- [🎨 Customization Examples](#-customization-examples)
  - [Change Theme](#change-theme)
  - [Configure Grid Options](#configure-grid-options)
  - [Dynamic Data Management](#dynamic-data-management)
- [🔧 Common Use Cases](#-common-use-cases)
  - [1. Simple Data Display](#1-simple-data-display)
  - [2. Interactive Grid with Actions](#2-interactive-grid-with-actions)
  - [3. Export Functionality](#3-export-functionality)
- [📱 Responsive Design](#-responsive-design)
- [🎯 Key Features](#-key-features)
- [🚨 Important Notes](#-important-notes)
- [📚 Next Steps](#-next-steps)

---

## 📋 What You Get

✅ **Pure Client-Side** - No server dependencies  
✅ **Reactive State** - NgRx Signals for real-time updates  
✅ **Modern AG Grid** - v32.2+ with Material Design theming  
✅ **Type-Safe** - Full TypeScript support  
✅ **Customizable** - Dynamic headers, themes, and configurations  
✅ **Export Ready** - Built-in XLSX/CSV export functionality  

## 🎯 Quick Start (5 Minutes)

### 1. Install Dependencies

```bash
npm install ag-grid-angular ag-grid-community @ngrx/signals xlsx
```

### 2. Import the Component

```typescript
import { AgBaseGridComponent } from './components/ag-base-grid/ag-base-grid.component';
import { AgGridStore } from './stores/ag-grid.store';
```

### 3. Basic Usage

```typescript
// In your component
export class MyComponent {
  public agGridStore = inject(AgGridStore);

  ngOnInit() {
    // Set up your data
    const data = [
      { id: 1, name: 'John', email: 'john@example.com' },
      { id: 2, name: 'Jane', email: 'jane@example.com' }
    ];

    const columns = [
      { field: 'name', headerName: 'Name' },
      { field: 'email', headerName: 'Email' }
    ];

    // Configure the grid
    this.agGridStore.setRowData(data);
    this.agGridStore.setColumnDefs(columns);
  }
}
```

```html
<!-- In your template -->
<app-ag-base-grid></app-ag-base-grid>
```

### 4. Add Custom Headers (Optional)

```typescript
// Add header buttons
const buttons = [
  { type: 'add', label: 'Add User', icon: '➕' },
  { type: 'delete', label: 'Delete', icon: '🗑️' },
  { type: 'export', label: 'Export', icon: '📊' }
];

this.agGridStore.setHeaderButtons(buttons);

// Handle button clicks
this.agGridStore.setButtonClickHandler((button) => {
  switch (button.type) {
    case 'add':
      this.handleAdd();
      break;
    case 'delete':
      this.handleDelete();
      break;
  }
});
```

## 🎨 Customization Examples

### Change Theme

```typescript
import { themeMaterial, themeAlpine, themeBalham } from 'ag-grid-community';

// Material Design (default)
this.agGridStore.setGridConfig({ theme: themeMaterial });

// Alpine theme
this.agGridStore.setGridConfig({ theme: themeAlpine });

// Balham theme
this.agGridStore.setGridConfig({ theme: themeBalham });
```

### Configure Grid Options

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

### Dynamic Data Management

```typescript
// Add new row
this.agGridStore.addRow({ id: 3, name: 'New User', email: 'new@example.com' });

// Update existing row
this.agGridStore.updateRow(0, { name: 'Updated Name' });

// Remove row
this.agGridStore.removeRow(1);

// Get selected rows
const selected = this.agGridStore.getSelectedRows();

// Clear all data
this.agGridStore.clearData();
```

## 🔧 Common Use Cases

### 1. Simple Data Display

```typescript
// Just show data - no headers needed
this.agGridStore.setRowData(yourData);
this.agGridStore.setColumnDefs(yourColumns);
// Header will be hidden automatically
```

### 2. Interactive Grid with Actions

```typescript
// Set up interactive buttons
this.agGridStore.setHeaderButtons([
  { type: 'add', label: 'Add', icon: '➕' },
  { type: 'delete', label: 'Delete', icon: '🗑️' },
  { type: 'refresh', label: 'Refresh', icon: '🔄' }
]);

// Handle actions
this.agGridStore.setButtonClickHandler((button) => {
  // Your business logic here
});
```

### 3. Export Functionality

```typescript
// Enable export
this.agGridStore.setExportConfig({
  enabled: true,
  formats: ['xlsx', 'csv'],
  defaultFormat: 'xlsx'
});

// Export data
const data = this.agGridStore.getRowData();
// Use your preferred export library
```

## 📱 Responsive Design

The component automatically adjusts to container size:

```scss
// Your component styles
.grid-container {
  height: 400px;
  width: 100%;
}

// Grid will fill the container
```

## 🎯 Key Features

| Feature | Description |
|---------|-------------|
| **Reactive Updates** | Data changes automatically reflect in the grid |
| **Dynamic Headers** | Headers show/hide based on button availability |
| **Type Safety** | Full TypeScript support with custom interfaces |
| **Modern Theming** | AG Grid v32.2+ Material Design themes |
| **Export Ready** | Built-in export functionality |
| **Pure Client-Side** | No server dependencies or API calls |

## 🚨 Important Notes

- **No Server Calls**: This is a pure client-side component
- **Data Management**: Handle data fetching in your parent component
- **State Management**: Uses NgRx Signals for reactive state
- **Modern API**: Uses AG Grid v32.2+ modern features only

## 📚 Next Steps

1. **Explore the Example**: Check `src/app/components/example/` for full implementation
2. **Read Integration Template**: See `INTEGRATION_TEMPLATE.md` for detailed integration
3. **Customize**: Modify themes, add custom handlers, configure exports
4. **Deploy**: Ready for production use

---

**Need Help?** Check the detailed `PROJECT_GUIDE.md` for comprehensive explanations and advanced usage patterns. 