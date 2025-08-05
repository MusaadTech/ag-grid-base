# AG Grid Base Component

A **pure client-side** AG Grid base component with reactive state management using NgRx Signals, ready for immediate use in any Angular project.

## Overview

This project provides a reusable AG Grid base component that follows the Single Responsibility Principle with a pure client-side approach. The base component handles only AG Grid operations and data availability, while parent components handle business logic and data management.

## Key Features

- **Pure Client-Side**: No server dependencies or API calls
- **Reactive State**: NgRx Signals for real-time updates
- **Modern AG Grid**: v32.2+ with Material Design theming
- **Type-Safe**: Full TypeScript support with custom interfaces
- **Dynamic Headers**: Automatically shows/hides based on button availability
- **Export Ready**: Built-in XLSX/CSV export functionality
- **Responsive Design**: Works seamlessly across all device sizes

## Documentation Structure

This project includes comprehensive documentation split across multiple files to avoid duplication:

### [Quick Start Guide](QUICK_START_GUIDE.md)
Get up and running in 5 minutes with basic setup, customization examples, and common use cases.

### [Project Guide](PROJECT_GUIDE.md)
Comprehensive guide covering architecture, state management, advanced usage patterns, and best practices.

### [Integration Template](INTEGRATION_TEMPLATE.md)
Step-by-step integration template with detailed examples and troubleshooting guide.

## Quick Installation

```bash
npm install ag-grid-angular ag-grid-community @ngrx/signals xlsx
```

## Basic Usage

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
    // Set up your data
    this.agGridStore.setRowData(yourData);
    this.agGridStore.setColumnDefs(yourColumns);
  }
}
```

## Project Structure

```
src/app/
├── components/
│   ├── ag-base-grid/           # Pure reusable grid component
│   │   ├── ag-base-grid.component.ts
│   │   ├── ag-base-grid.component.html
│   │   ├── ag-base-grid.component.scss
│   │   └── custom-header/      # Custom header component
│   └── example/                # Comprehensive example implementation
└── stores/
    ├── ag-grid.model.ts        # TypeScript interfaces
    └── ag-grid.store.ts        # NgRx Signals store
```

## Architecture

- **Angular 19** with standalone components and modern control flow
- **AG Grid Community** for powerful grid functionality
- **NgRx Signals** for reactive state management
- **TypeScript** for type safety
- **Pure Client-Side**: All operations handled locally

## Getting Started

1. **Quick Start**: See [QUICK_START_GUIDE.md](QUICK_START_GUIDE.md) for immediate setup
2. **Deep Dive**: See [PROJECT_GUIDE.md](PROJECT_GUIDE.md) for comprehensive understanding
3. **Integration**: See [INTEGRATION_TEMPLATE.md](INTEGRATION_TEMPLATE.md) for step-by-step integration

## Example Implementation

Run the example to see all features in action:

```bash
npm install
npm start
```

Navigate to `http://localhost:4200` to see the comprehensive example implementation.

## Important Notes

- **No Server Calls**: This is a pure client-side component
- **Data Management**: Handle data fetching in your parent component
- **State Management**: Uses NgRx Signals for reactive state
- **Modern API**: Uses AG Grid v32.2+ modern features only

## Contributing

This is a base component library designed for reuse across projects. The architecture follows the Single Responsibility Principle to ensure maintainability and extensibility.

---

**Built with ❤️ using Angular 19 and AG Grid**
