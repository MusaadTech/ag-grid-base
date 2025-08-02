# 🚀 **Simple & Comprehensive Template**

## **1. Your Service (Any Observable-based service works):**
```typescript
// your-data.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface YourData {
  id: number;
  name: string;
  email: string;
  // Add your fields here
}

@Injectable({ providedIn: 'root' })
export class YourDataService {
  private apiUrl = 'https://your-api.com/data';

  constructor(private http: HttpClient) {}

  getData(): Observable<YourData[]> {
    return this.http.get<YourData[]>(this.apiUrl);
  }

  createItem(item: Omit<YourData, 'id'>): Observable<YourData> {
    return this.http.post<YourData>(this.apiUrl, item);
  }

  updateItem(id: number, item: Partial<YourData>): Observable<YourData> {
    return this.http.put<YourData>(`${this.apiUrl}/${id}`, item);
  }

  deleteItem(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
```

## **2. Your Grid Component (Copy & Paste):**
```typescript
// your-grid.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { AgBaseGridComponent } from '../ag-base-grid/ag-base-grid.component';
import { AgGridStore } from '../../stores/ag-grid.store';
import { YourDataService, YourData } from '../../services/your-data.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-your-grid',
  standalone: true,
  imports: [AgBaseGridComponent],
  template: '<app-ag-base-grid></app-ag-base-grid>'
})
export class YourGridComponent implements OnInit {
  private store = inject(AgGridStore);
  private dataService = inject(YourDataService);

  ngOnInit() {
    this.setupGrid();
  }

  private setupGrid() {
    // 1. Connect your service to the store
    this.store.setDataFetcher(async () => {
      return await firstValueFrom(this.dataService.getData());
    });

    this.store.setInsertFn(async () => {
      const newItem = { name: '', email: '' }; // Your empty item structure
      return await firstValueFrom(this.dataService.createItem(newItem));
    });

    // 2. Set up button handlers
    this.store.setButtonClickHandler((button) => {
      switch (button.type) {
        case 'add': this.handleAdd(); break;
        case 'delete': this.handleDelete(); break;
        case 'refresh': this.store.fetchData(); break;
        case 'export': this.handleExport(); break;
      }
    });

    // 3. Set up event handlers
    this.store.setCellValueChangedHandler((params) => {
      this.handleCellEdit(params);
    });

    this.store.setSelectionChangedHandler((params) => {
      const selected = params.api.getSelectedRows();
      this.store.toggleButtonDisabled('delete', selected.length === 0);
    });

    // 4. Configure columns (update fields to match your data)
    this.store.setColumnDefs([
      { field: 'id', headerName: 'ID', sortable: true, filter: true, editable: false },
      { field: 'name', headerName: 'Name', sortable: true, filter: true, editable: true },
      { field: 'email', headerName: 'Email', sortable: true, filter: true, editable: true }
    ]);

    // 5. Configure buttons (header will auto-hide if all buttons are hidden)
    this.store.setHeaderButtons([
      { type: 'add', label: 'Add', icon: '➕', position: 'start' },
      { type: 'delete', label: 'Delete', icon: '🗑️', position: 'start' },
      { type: 'refresh', label: 'Refresh', icon: '🔄', position: 'start' },
      { type: 'export', label: 'Export', icon: '📤', position: 'end' }
    ]);

    // 6. Load initial data
    this.store.fetchData();
  }

  // Handler methods
  private async handleAdd() {
    try {
      const newItem = { name: '', email: '' };
      const created = await firstValueFrom(this.dataService.createItem(newItem));
      const currentData = this.store.rowData();
      this.store.setRowData([...currentData, created]);
      setTimeout(() => this.store.scrollToLastRow(), 100);
    } catch (error) {
      console.error('Add failed:', error);
    }
  }

  private async handleDelete() {
    const selected = this.store.getSelectedRows();
    if (selected.length === 0) return;

    try {
      for (const item of selected) {
        await firstValueFrom(this.dataService.deleteItem(item.id));
      }
      const currentData = this.store.rowData();
      const updatedData = currentData.filter(item => !selected.some(s => s.id === item.id));
      this.store.setRowData(updatedData);
    } catch (error) {
      console.error('Delete failed:', error);
    }
  }

  private async handleCellEdit(params: any) {
    try {
      await firstValueFrom(this.dataService.updateItem(params.data.id, { [params.field]: params.newValue }));
    } catch (error) {
      console.error('Update failed:', error);
    }
  }

  private handleExport() {
    console.log('Export handled by base component');
  }

  // 🆕 Header Visibility Management
  public toggleHeaderVisibility() {
    const currentButtons = this.store.headerButtons();
    if (currentButtons && currentButtons.length > 0) {
      // Hide all buttons (header will auto-hide)
      const hiddenButtons = currentButtons.map(btn => ({ ...btn, hidden: true }));
      this.store.setHeaderButtons(hiddenButtons);
    } else {
      // Show all buttons (header will auto-show)
      const visibleButtons = [
        { type: 'add', label: 'Add', icon: '➕', position: 'start', hidden: false },
        { type: 'delete', label: 'Delete', icon: '🗑️', position: 'start', hidden: false },
        { type: 'refresh', label: 'Refresh', icon: '🔄', position: 'start', hidden: false },
        { type: 'export', label: 'Export', icon: '📤', position: 'end', hidden: false }
      ];
      this.store.setHeaderButtons(visibleButtons);
    }
  }

  public checkHeaderVisibility() {
    const shouldShow = this.store.shouldShowHeader();
    console.log('Header should be visible:', shouldShow);
    return shouldShow;
  }
}
```

## **3. Update Routes:**
```typescript
// app.routes.ts
import { Routes } from '@angular/router';
import { YourGridComponent } from './components/your-grid/your-grid.component';

export const routes: Routes = [
  { path: '', redirectTo: '/your-grid', pathMatch: 'full' },
  { path: 'your-grid', component: YourGridComponent }
];
```

## **4. Add HTTP Module:**
```typescript
// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient() // Add this line
  ]
};
```

## **🎯 What You Need to Change:**

1. **Service URL**: `https://your-api.com/data`
2. **Data Interface**: Add your fields to `YourData`
3. **Column Definitions**: Update fields to match your data
4. **Empty Item Structure**: In `handleAdd()` method

## **✅ That's It!**

- **Copy & paste** the template
- **Update the 4 things** above
- **Your grid works** with real data!

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

Just focus on your **service methods** and **data structure**! 🚀

---

## **🆕 Smart Header Visibility**

### **Automatic Behavior**

The header automatically hides when:
- **No buttons**: `headerButtons` is null, undefined, or empty array
- **All hidden**: All buttons have `hidden: true`

```typescript
// Header will be hidden
this.store.setHeaderButtons(null);
this.store.setHeaderButtons([]);
this.store.setHeaderButtons([
  { type: 'add', hidden: true },
  { type: 'delete', hidden: true }
]);

// Header will be visible
this.store.setHeaderButtons([
  { type: 'add', hidden: false },
  { type: 'delete', hidden: true }, // Mixed visibility works
  { type: 'export', hidden: false }
]);
```

### **Height Adjustment**

When header is hidden, toolbar height automatically reduces to 0:

```typescript
// Check visibility
const isVisible = this.store.shouldShowHeader();

// Get current toolbar height
const height = getComputedStyle(document.documentElement)
  .getPropertyValue('--toolbar-height');
```

### **Testing Methods**

```typescript
// Test all scenarios
this.store.testHeaderVisibility();

// Manual control
this.store.hideAllButtons();
this.store.showAllButtons();
this.store.clearAllButtons();
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

## **📚 Understanding `firstValueFrom`**

### **What is `firstValueFrom`?**

`firstValueFrom` is a utility function from RxJS that converts an Observable to a Promise. It takes the first value emitted by the Observable and resolves the Promise with that value.

### **Why Use It?**

Your service methods return `Observable<any[]>`, but the store's data fetcher expects a function that returns `Promise<any[]>`:

```typescript
// Store expects this type:
type DataFetcher = () => Promise<any[]>;

// But your service returns this:
getData(): Observable<any[]>
```

### **How It Works:**

```typescript
// Your service can be ANY Observable:
getUsers(): Observable<User[]>
getProducts(): Observable<Product[]>
getOrders(): Observable<Order[]>
getComplexData(): Observable<ComplexDataStructure>

// firstValueFrom converts ANY of them to Promise:
const users = await firstValueFrom(this.service.getUsers());
const products = await firstValueFrom(this.service.getProducts());
const orders = await firstValueFrom(this.service.getOrders());
const complexData = await firstValueFrom(this.service.getComplexData());
```

### **Benefits:**

1. **🔄 Universal Compatibility** - Works with ANY Observable
2. **🔧 No Service Changes** - Don't modify your existing services
3. **⚡ Simple Integration** - One line of code per method
4. **🎯 Type Safe** - Maintains TypeScript types
5. **🚀 Future Proof** - Works with new service methods too

### **Real-World Examples:**

#### **Simple Service:**
```typescript
@Injectable()
export class SimpleService {
  getData(): Observable<any[]> {
    return this.http.get<any[]>('/api/data');
  }
}

// Usage:
this.store.setDataFetcher(async () => {
  return await firstValueFrom(this.simpleService.getData());
});
```

#### **Complex Service with Multiple Methods:**
```typescript
@Injectable()
export class ComplexService {
  getUsers(): Observable<User[]> { /* ... */ }
  getProducts(): Observable<Product[]> { /* ... */ }
  getOrders(): Observable<Order[]> { /* ... */ }
  getAnalytics(): Observable<Analytics> { /* ... */ }
  getReports(): Observable<Report[]> { /* ... */ }
  // ... 50 more methods
}

// Usage - you only need the ones you want:
this.store.setDataFetcher(async () => {
  return await firstValueFrom(this.complexService.getUsers());
});

this.store.setInsertFn(async () => {
  return await firstValueFrom(this.complexService.createUser(newUser));
});
```

#### **Service with Different Return Types:**
```typescript
@Injectable()
export class MixedService {
  getUsers(): Observable<User[]> { /* ... */ }
  getUserById(id: number): Observable<User> { /* ... */ }
  getStats(): Observable<Stats> { /* ... */ }
  getConfig(): Observable<Config> { /* ... */ }
}

// Usage - firstValueFrom handles all types:
this.store.setDataFetcher(async () => {
  return await firstValueFrom(this.mixedService.getUsers());
});

// For single item:
const user = await firstValueFrom(this.mixedService.getUserById(123));
```

### **Pro Tip:**

You can even use it with **different services** for different operations:

```typescript
// Mix and match services:
this.store.setDataFetcher(async () => {
  return await firstValueFrom(this.userService.getUsers());
});

this.store.setInsertFn(async () => {
  return await firstValueFrom(this.auditService.logAction('user_created'));
});
```

So `firstValueFrom` is your **"don't worry about it"** solution! It handles all the complexity of converting Observables to Promises, regardless of how many methods your service has or what they return. 🚀

---

## **🔧 Installation Requirements**

### **1. Install RxJS (if not already installed):**
```bash
npm install rxjs
```

### **2. Import in your component:**
```typescript
import { firstValueFrom } from 'rxjs';
```

### **3. Alternative Methods (if you prefer):**

#### **Using `.toPromise()` (Deprecated but still works):**
```typescript
this.store.setDataFetcher(async () => {
  return await this.userService.getUsers().toPromise();
});
```

#### **Converting Service to Return Promises:**
```typescript
// Modify your service to return Promises directly
@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) {}

  async getUsers(): Promise<any[]> {
    return await firstValueFrom(this.http.get<any[]>(this.apiUrl));
  }

  async createUser(user: any): Promise<any> {
    return await firstValueFrom(this.http.post<any>(this.apiUrl, user));
  }
}

// Then use it directly:
this.store.setDataFetcher(async () => {
  return await this.userService.getUsers();
});
```

---

## **🎯 Quick Start Checklist**

- [ ] Create your service with Observable methods
- [ ] Copy the grid component template
- [ ] Update the 4 configuration points
- [ ] Add HTTP module to app.config.ts
- [ ] Update routes
- [ ] Import `firstValueFrom` from 'rxjs'
- [ ] Test your integration
- [ ] **Optional**: Test header visibility functionality
- [ ] **Optional**: Explore modern control flow syntax

**That's it! Your grid is ready to use with real data.** 🎉

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