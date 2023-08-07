import { ErrorHandler, Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GlobalErrorHandler implements ErrorHandler {

  constructor() {
  }

  handleError(error: any): void {
    // If it's an unexpected client-side error (not an HttpErrorResponse), log it
    if (!(error instanceof HttpErrorResponse)) {
      this.handleClientError(error);
    }
  }

  private handleClientError(error: Error): void {
    console.error(error);
  }
}
