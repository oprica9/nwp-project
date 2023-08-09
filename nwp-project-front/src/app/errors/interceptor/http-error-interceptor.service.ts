import {Injectable} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {ErrorHandlerService} from "../service/error-handler.service";

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

  constructor(private errorHandlerService: ErrorHandlerService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        this.errorHandlerService.handleHttpError(error);
        return throwError(() => error);
      })
    );
  }
}
