import {Component, OnInit, OnDestroy} from '@angular/core';
import {AuthService} from './service/auth/auth.service';
import {Subscription} from 'rxjs';
import {AuthUser} from "./model/user";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'The Cloud Provider';
  currentUser?: AuthUser | null;
  private userSub: Subscription = new Subscription();

  constructor(private authService: AuthService) {
  }

  ngOnInit(): void {
    this.userSub = this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }

}
