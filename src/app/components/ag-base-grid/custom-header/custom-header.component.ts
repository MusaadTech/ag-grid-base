import { Component, inject, OnInit, ElementRef, ViewChild, computed } from '@angular/core';
import { AgGridStore } from '../../../stores/ag-grid.store';
import { HeaderButton } from '../../../stores/ag-grid.model';
import { IHeaderParams } from 'ag-grid-community';

@Component({
  selector: 'app-custom-header',
  standalone: true,
  imports: [],
  templateUrl: './custom-header.component.html',
  styleUrl: './custom-header.component.scss',
})
export class CustomHeaderComponent implements OnInit {
  @ViewChild('headerContainer', { static: true }) headerContainer!: ElementRef;

  private store = inject(AgGridStore);
  params?: IHeaderParams;

  // Make buttons reactive to store changes
  buttons = computed(() => this.store.headerButtons());

  ngOnInit() {
    console.log('Custom header initialized');
  }

  // AG Grid component interface methods
  agInit(params: IHeaderParams): void {
    this.params = params;
  }

  getGui(): HTMLElement {
    return this.headerContainer.nativeElement;
  }

  destroy(): void {
    // Cleanup if needed
  }

  onClick(button: HeaderButton) {
    if (!button.disabled && !button.hidden) {
      console.log('Button clicked:', button.type);
      this.store.handleButtonClick(button);
    }
  }

  getButtonsByPosition(position: 'start' | 'end'): HeaderButton[] {
    const buttons = this.buttons();
    console.log(`Getting buttons for position '${position}':`, buttons);

    const filteredButtons = buttons.filter(btn => {
      // If no position is specified, treat as 'start'
      const btnPosition = btn.position || 'start';
      return btnPosition === position;
    });

    console.log(`Filtered buttons for '${position}':`, filteredButtons);
    return filteredButtons;
  }
}
