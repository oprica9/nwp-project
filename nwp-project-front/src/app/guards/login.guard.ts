import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {TokenService} from "../service/token/token.service";

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {

  constructor(private router: Router, private tokenService: TokenService) {
  }

  canActivate(): boolean {
    const jwt = this.tokenService.getToken();
    if (jwt) {
      this.router.navigate(['/']);
      return false;
    }
    return true;
  }

}
