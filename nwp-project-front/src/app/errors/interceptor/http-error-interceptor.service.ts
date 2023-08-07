import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NotificationService } from '../../service/notification/notification.service';
import { ApiErrorResponse } from '../../model/api-error-response';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(private notifyService: NotificationService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.error instanceof ErrorEvent) {
          this.notifyService.showError('An unexpected error occurred.');
        } else {
          const apiError: ApiErrorResponse = error.error;
          this.notifyService.showError(
            apiError.errorMessage || 'An HTTP error occurred.'
          );
        }

        return throwError(() => error);
      })
    );
  }
}
