import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {AuthService} from "../../service/auth/auth.service";
import {Router} from "@angular/router";
import {AuthUser} from "../../model/user";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {

  currentUser?: AuthUser | null;
  private subscription: Subscription = new Subscription();

  constructor(private authService: AuthService, private router: Router) {
    this.subscription.add(
      this.authService.currentUser$.subscribe(user => this.currentUser = user)
    );
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']).then();
  }

  userCanCreate(): boolean {
    const currentUser = this.currentUser;
    if (!currentUser) {
      return false;
    }
    return currentUser.permissions.includes('can_create_users');
  }

  userCanSearchMachines(): boolean {
    const currentUser = this.currentUser;
    if (!currentUser) {
      return false;
    }
    return currentUser.permissions.includes('can_search_machines');
  }

  userCanCreateMachines(): boolean {
    const currentUser = this.currentUser;
    if (!currentUser) {
      return false;
    }
    return currentUser.permissions.includes('can_create_machines');
  }

}
