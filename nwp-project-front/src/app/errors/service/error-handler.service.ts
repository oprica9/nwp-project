import {Injectable} from '@angular/core';
import {HttpErrorResponse} from "@angular/common/http";
import {ApiErrorResponse} from "../../model/api-error-response";
import {Observable, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  // Private Fields
  private errorSubject = new Subject<string>();

  constructor() {
  }

  // Public Methods
  handleHttpError(error: HttpErrorResponse): void {
    let errorMessage: string;

    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
      return;
    } else {
      const apiError: ApiErrorResponse = error.error;

      switch (error.status) {
        case 401:
          errorMessage = apiError.errorMessage;
          break;
        case 403:
          errorMessage = 'You do not have the required permission for the requested action.';
          break;
        case 500:
          errorMessage = 'An unexpected error occurred on the server.';
          break;
        default:
          console.error(`Backend returned code ${error.status}, body was: ${apiError.errorMessage}`);
          errorMessage = apiError.errorMessage;
          break;
      }

      if (this.determineIfCritical(error)) {
        this.errorSubject.next(errorMessage);
      }
    }
  }

  handleGeneralError(error: any): void {
    console.error('Unexpected error:', error);
    this.errorSubject.next('An unexpected error occurred. Please try again later.');
  }

  get error$(): Observable<string> {
    return this.errorSubject.asObservable();
  }

  // Private Methods
  private determineIfCritical(error: HttpErrorResponse): boolean {
    return [500, 401, 403].includes(error.status);
  }

}
