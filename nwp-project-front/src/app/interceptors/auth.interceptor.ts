import {Injectable} from '@angular/core';
import {HttpInterceptor, HttpRequest, HttpHandler} from '@angular/common/http';
import {TokenService} from '../service/impl/token/token.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private tokenService: TokenService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const jwtToken = this.tokenService.getToken();

    if (jwtToken) {
      const cloned = req.clone({
        headers: req.headers.set("Authorization",
          "Bearer " + jwtToken)
      });

      return next.handle(cloned);
    } else {
      return next.handle(req);
    }
  }
}
