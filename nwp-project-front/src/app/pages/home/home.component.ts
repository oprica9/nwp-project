import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../service/impl/auth/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  userHasPermissions: boolean = false;

  constructor(private authService: AuthService, private router: Router) {
  }

  // Lifecycle Hooks
  ngOnInit(): void {
    if (this.authService.userHasAnyPermission()) {
      this.userHasPermissions = true;
    }
  }

}
