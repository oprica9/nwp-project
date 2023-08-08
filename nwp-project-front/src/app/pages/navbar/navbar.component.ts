import {Component} from '@angular/core';
import {AuthService} from "../../service/auth/auth.service";
import {Router} from "@angular/router";
import {AppRoutes, UserPermissions} from "../../constants";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  // Public Fields
  UserPermissions = UserPermissions;

  constructor(private authService: AuthService, private router: Router) {
  }

  // Public Methods
  isAuthenticated() {
    return this.authService.isAuthenticated()
  }

  logout() {
    this.authService.logout();
    this.router.navigate([`/${AppRoutes.LOGIN}`]).then();
  }

  userHasPermission(permission: string): boolean {
    return this.authService.userHasPermission(permission);
  }

}
