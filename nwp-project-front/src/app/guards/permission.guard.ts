import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs";
import {NotificationService} from "../service/notification/notification.service";
import {UserService} from "../service/user/user.service";
import {Injectable} from "@angular/core";
import {AuthService} from "../service/auth/auth.service";

@Injectable({
  providedIn: 'root'
})
export class PermissionGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router, private notifyService: NotificationService) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const user = this.authService.currentUserValue;
    // console.log('Current user: ', user); // add this line
    const requiredPermission = next.data.requiredPermission;
    // console.log('Required permission: ', requiredPermission); // and this line
    if (user && user.permissions.includes(requiredPermission)) {
      return true;
    } else {
      this.router.navigate(['/']); // Redirect to the home page or wherever you want.
      this.notifyService.showError('You do not have permission to access this page.');
      return false;
    }
  }

}
