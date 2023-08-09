import {ErrorHandler, Injectable, Injector} from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import {ErrorHandlerService} from "./service/error-handler.service";

@Injectable({
  providedIn: 'root'
})
export class GlobalErrorHandler implements ErrorHandler {

  constructor(private errorHandlerService: ErrorHandlerService) {}

  handleError(error: any): void {
    // HTTP errors are already handled by the interceptor
    if (!(error instanceof HttpErrorResponse)) {
      this.errorHandlerService.handleGeneralError(error);
    }
  }
}
