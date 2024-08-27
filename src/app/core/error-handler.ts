import { ErrorHandler, Injectable, NgZone } from '@angular/core';
import { ErrorService } from '../services/error.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(
    private errorService: ErrorService,
    private zone: NgZone
  ) {}

  handleError(error: any) {
    this.zone.run(() =>
      this.errorService.handleError(error.message || 'Undefined client error')
    );

    console.error('Error from global error handler', error);
  }
}

