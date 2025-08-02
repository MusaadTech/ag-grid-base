import { Routes } from '@angular/router';
import { ExampleGridComponent } from './components/example/example-grid.component';

export const routes: Routes = [
  { path: '', redirectTo: '/example-grid', pathMatch: 'full' },
  { path: 'example-grid', component: ExampleGridComponent }
];
