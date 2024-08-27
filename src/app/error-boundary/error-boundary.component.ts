import { Component, Input, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ErrorService } from '../services/error.service';

@Component({
  selector: 'app-error-boundary',
  standalone: true,
  imports: [CommonModule],
  template: `
    <ng-container *ngIf="error; else content">
      <h1>An error occurred</h1>
      <p>{{ error }}</p>
      <button (click)="reset()">Try again</button>
    </ng-container>
    <ng-template #content>
      <ng-content></ng-content>
    </ng-template>
  `
})
export class ErrorBoundaryComponent implements OnDestroy {
  @Input() fallback: any;
  error: any = null;
  private subscription: Subscription;

  constructor(private errorService: ErrorService) {
    this.subscription = this.errorService.error$.subscribe(
      error => this.error = error
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  reset() {
    this.error = null;
    this.errorService.clear();
  }
}