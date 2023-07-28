import {Component, OnDestroy, OnInit} from '@angular/core';
import {EMPTY, Subscription} from "rxjs";
import {AuthService} from "../../service/auth/auth.service";
import {Router} from "@angular/router";
import {AuthUser} from "../../model/user";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  private subscription: Subscription = EMPTY.subscribe();

  constructor(private authService: AuthService, private router: Router) {
  }

  ngOnInit() {
    this.subscription = this.authService.isLoggedIn.subscribe(value => {
      this.isLoggedIn = value;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  logout(){
    this.authService.logout();
    this.router.navigate(['/login']);
    this.isLoggedIn = false;
  }

  userCanCreate() {
    const currentUser = this.authService.currentUserValue;
    const userPermissions = ((currentUser as AuthUser).permissions || [])
    return userPermissions.includes('can_create_users');
  }
}
