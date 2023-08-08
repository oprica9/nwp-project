import {Injectable} from '@angular/core';
import {Router, Resolve, ActivatedRouteSnapshot} from '@angular/router';
import {EMPTY, forkJoin, Observable} from 'rxjs';
import {Permission, User} from "../model/model.user";
import {UserService} from "../service/user/user.service";
import {AppRoutes} from "../constants";
import {map} from "rxjs/operators";

@Injectable({providedIn: 'root'})
export class UserResolver implements Resolve<[User, Permission[]]> {

  constructor(private userService: UserService, private router: Router) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<[User, Permission[]]> {
    const id = Number(route.paramMap.get('id'));
    if (!isNaN(id)) {
      return forkJoin([
        this.userService.getUserById(id),
        this.userService.getAvailablePermissions()
      ]).pipe(
        map(([userResponse, permissionsResponse]) => [userResponse.data, permissionsResponse.data])
      );
    } else {
      this.router.navigate([`/${AppRoutes.USERS}`]).then();
      return EMPTY;
    }
  }
}
