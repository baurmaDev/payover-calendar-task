import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ErrorBoundaryComponent } from './error-boundary/error-boundary.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ErrorBoundaryComponent],
  template: `
    <app-error-boundary>
      <router-outlet></router-outlet>
    </app-error-boundary>
  `
})
export class AppComponent { }