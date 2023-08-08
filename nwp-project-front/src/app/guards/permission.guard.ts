import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from "@angular/router";
import {Observable, take} from "rxjs";
import {NotificationService} from "../service/notification/notification.service";
import {Injectable} from "@angular/core";
import {AuthService} from "../service/auth/auth.service";
import {map} from "rxjs/operators";
import {AppRoutes} from "../constants";

@Injectable({
  providedIn: 'root'
})
export class PermissionGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router, private notifyService: NotificationService) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    return this.authService.currentUser$.pipe(
      take(1),
      map(user => {
        const requiredPermission = next.data.requiredPermission;
        if (user && user.permissions.includes(requiredPermission)) {
          return true;
        } else {
          this.router.navigate([`/${AppRoutes.HOME}`]).then();
          this.notifyService.showError('You do not have permission to access this page.');
          return false;
        }
      })
    );
  }

}
