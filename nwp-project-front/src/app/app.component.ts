import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from './service/auth/auth.service';
import {EMPTY, Subscription} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Your App Name';
  isLoggedIn: boolean = false;
  private loginSub: Subscription = EMPTY.subscribe();

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.loginSub = this.authService.isLoggedIn.subscribe(loggedIn => {
      this.isLoggedIn = loggedIn;
    });
  }

  ngOnDestroy(): void {
    this.loginSub.unsubscribe();
  }
}
