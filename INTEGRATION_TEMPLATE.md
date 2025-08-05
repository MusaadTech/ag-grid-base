# 🔧 AG Grid Base Component - Integration Template

A comprehensive template for integrating the AG Grid base component into your Angular project with step-by-step instructions and best practices.

## 📑 Table of Contents

- [🎯 Overview](#-overview)
- [📦 Prerequisites](#-prerequisites)
- [🚀 Quick Integration](#-quick-integration)
  - [Step 1: Install Dependencies](#step-1-install-dependencies)
  - [Step 2: Import Components](#step-2-import-components)
  - [Step 3: Basic Setup](#step-3-basic-setup)
  - [Step 4: Configure Data](#step-4-configure-data)
  - [Step 5: Add Headers (Optional)](#step-5-add-headers-optional)
  - [Step 6: Handle Events](#step-6-handle-events)
- [🔧 Advanced Configuration](#-advanced-configuration)
  - [Grid Options](#grid-options)
  - [Column Definitions](#column-definitions)
  - [Header Buttons](#header-buttons)
  - [Grid Configuration](#grid-configuration)
  - [Export Configuration](#export-configuration)
- [📊 Data Management Examples](#-data-management-examples)
  - [Setting Initial Data](#setting-initial-data)
  - [Adding New Rows](#adding-new-rows)
  - [Updating Existing Rows](#updating-existing-rows)
  - [Removing Rows](#removing-rows)
  - [Selection Management](#selection-management)
- [🎨 Theming and Styling](#-theming-and-styling)
  - [Theme Selection](#theme-selection)
  - [Custom Styling](#custom-styling)
- [🔧 Event Handling](#-event-handling)
  - [Button Click Events](#button-click-events)
  - [Cell Value Changes](#cell-value-changes)
  - [Selection Changes](#selection-changes)
- [📱 Responsive Design](#-responsive-design)
- [🚀 Production Deployment](#-production-deployment)
- [🔍 Troubleshooting](#-troubleshooting)
- [📚 Quick Start Checklist](#-quick-start-checklist)

---

## 🎯 Overview

## **1. Your Grid Component (Copy & Paste):**
```typescript
// your-grid.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { AgBaseGridComponent } from '../ag-base-grid/ag-base-grid.component';
import { AgGridStore } from '../../stores/ag-grid.store';

@Component({
  selector: 'app-your-grid',
  standalone: true,
  imports: [AgBaseGridComponent],
  template: '<app-ag-base-grid></app-ag-base-grid>'
})
export class YourGridComponent implements OnInit {
  private agGridStore = inject(AgGridStore);

  ngOnInit() {
    this.setupGrid();
  }

  private setupGrid() {
    // 1. Load initial data locally
    const initialData = this.generateSampleData();
    this.agGridStore.setRowData(initialData);

    // 2. Set up button handlers
    this.agGridStore.setButtonClickHandler((button) => {
      switch (button.type) {
        case 'add': this.handleAdd(); break;
        case 'delete': this.handleDelete(); break;
        case 'refresh': this.handleRefresh(); break;
        case 'export': this.handleExport(); break;
      }
    });

    // 3. Set up event handlers
    this.agGridStore.setCellValueChangedHandler((params) => {
      this.handleCellEdit(params);
    });

    this.agGridStore.setSelectionChangedHandler((params) => {
      const selected = params.api.getSelectedRows();
      this.agGridStore.toggleButtonDisabled('delete', selected.length === 0);
    });

    // 4. Configure columns (update fields to match your data)
    this.agGridStore.setColumnDefs([
      { field: 'id', headerName: 'ID', sortable: true, filter: true, editable: false },
      { field: 'name', headerName: 'Name', sortable: true, filter: true, editable: true },
      { field: 'email', headerName: 'Email', sortable: true, filter: true, editable: true }
    ]);

    // 5. Configure buttons (header will auto-hide if all buttons are hidden)
    this.agGridStore.setHeaderButtons([
      { type: 'add', label: 'Add', icon: '➕', position: 'start' },
      { type: 'delete', label: 'Delete', icon: '🗑️', position: 'start' },
      { type: 'refresh', label: 'Refresh', icon: '🔄', position: 'start' },
      { type: 'export', label: 'Export', icon: '📤', position: 'end' }
    ]);
  }

  // Business logic methods
  private handleAdd() {
    const newItem = { name: '', email: '' }; // Your empty item structure
    const created = { id: Date.now(), ...newItem };
    this.agGridStore.addRow(created);
    this.agGridStore.scrollToLastRow();
  }

  private handleDelete() {
    const selected = this.agGridStore.getSelectedRows();
    if (selected.length === 0) return;

    const currentData = this.agGridStore.rowData();
    const updatedData = currentData.filter(item => !selected.some(s => s.id === item.id));
    this.agGridStore.setRowData(updatedData);
  }

  private handleRefresh() {
    const data = this.generateSampleData(); // Your data generation method
    this.agGridStore.setRowData(data);
  }

  private handleCellEdit(params: any) {
    console.log('Cell updated:', params.field, 'to', params.newValue);
    // Handle any local state updates here
  }

  private handleExport() {
    console.log('Export handled by base component');
  }

  // Helper method to generate sample data
  private generateSampleData() {
    return [
      { id: 1, name: 'John Doe', email: 'john@example.com' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
    ];
  }
}
```

## **2. Update Routes:**
```typescript
// app.routes.ts
import { Routes } from '@angular/router';
import { YourGridComponent } from './components/your-grid/your-grid.component';

export const routes: Routes = [
  { path: '', redirectTo: '/your-grid', pathMatch: 'full' },
  { path: 'your-grid', component: YourGridComponent }
];
```

## **🎯 What You Need to Change:**

1. **Data Structure**: Update the `generateSampleData()` method with your data
2. **Column Definitions**: Update fields to match your data
3. **Empty Item Structure**: In `handleAdd()` method
4. **Export Logic**: Customize the `handleExport()` method

## **✅ That's It!**

- **Copy & paste** the template
- **Update the 4 things** above
- **Your grid works** with local data!

**Features you get automatically:**
- ✅ CRUD operations (Create, Read, Update, Delete)
- ✅ Multi-row selection
- ✅ Export (XLSX/CSV)
- ✅ Sorting & filtering
- ✅ Inline editing
- ✅ Dynamic configuration
- ✅ Responsive design
- ✅ **Smart header visibility** (auto-hides when no buttons)
- ✅ **Modern control flow syntax** (`@if`, `@for`)
- ✅ **Dynamic height adjustment** (toolbar height adapts)

**No need to worry about:**
- ❌ Grid configuration
- ❌ Event handling
- ❌ Styling
- ❌ Export logic
- ❌ Button management
- ❌ Header visibility logic
- ❌ Height calculations

Just focus on your **data structure** and **local operations**! 🚀

---

## **🆕 Smart Header Visibility**

### **Automatic Behavior**

The header automatically hides when:
- **No buttons**: `headerButtons` is null, undefined, or empty array
- **All hidden**: All buttons have `hidden: true`

```typescript
// Header will be hidden
this.agGridStore.setHeaderButtons(null);
this.agGridStore.setHeaderButtons([]);
this.agGridStore.setHeaderButtons([
  { type: 'add', hidden: true },
  { type: 'delete', hidden: true }
]);

// Header will be visible
this.agGridStore.setHeaderButtons([
  { type: 'add', hidden: false },
  { type: 'delete', hidden: true }, // Mixed visibility works
  { type: 'export', hidden: false }
]);
```

### **Height Adjustment**

When header is hidden, toolbar height automatically reduces to 0:

```typescript
// Check visibility
const isVisible = this.agGridStore.shouldShowHeader();

// Get current toolbar height
const height = getComputedStyle(document.documentElement)
  .getPropertyValue('--toolbar-height');
```

### **Testing Methods**

```typescript
// Test all scenarios
this.agGridStore.testHeaderVisibility();

// Manual control
this.agGridStore.hideAllButtons();
this.agGridStore.showAllButtons();
this.agGridStore.clearAllButtons();
```

---

## **🆕 Modern Control Flow Syntax**

The library uses Angular's latest control flow syntax:

### **Template Examples**

```html
<!-- Instead of *ngIf -->
@if (shouldShowHeader()) {
<div class="toolbar">
  <app-header></app-header>
</div>
}

<!-- Instead of *ngFor -->
@for (item of items; track item.id) {
<div class="item">{{ item.name }}</div>
}
```

### **Benefits**

- **Better Performance**: More efficient than `*ngIf`/`*ngFor`
- **Type Safety**: Better TypeScript integration
- **Cleaner Code**: More readable syntax
- **Future-Proof**: Uses Angular's latest features

---

## **🎯 Quick Start Checklist**

- [ ] Copy the grid component template
- [ ] Update the 4 configuration points
- [ ] Update routes
- [ ] Test your integration
- [ ] **Optional**: Test header visibility functionality
- [ ] **Optional**: Explore modern control flow syntax

**That's it! Your grid is ready to use with local data.** 🎉

---

## **🆕 New Features Summary**

### **Smart Header Visibility**
- ✅ Automatically hides when no buttons are visible
- ✅ Dynamic height adjustment (0px when hidden)
- ✅ Smooth transitions
- ✅ Testing methods included

### **Modern Control Flow**
- ✅ Uses `@if` instead of `*ngIf`
- ✅ Uses `@for` instead of `*ngFor`
- ✅ Better performance and type safety
- ✅ Future-proof Angular syntax

### **Enhanced Testing**
- ✅ Header visibility testing
- ✅ Height adjustment testing
- ✅ Comprehensive example controls
- ✅ Console logging for debugging 