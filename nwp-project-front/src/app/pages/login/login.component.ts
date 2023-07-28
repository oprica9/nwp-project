import {Component} from '@angular/core';
import {LoginRequest} from "../../model/login-request";
import {AuthService} from "../../service/auth/auth.service";
import {Router} from "@angular/router";
import {TokenService} from "../../service/token/token.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  email: string = '';
  password: string = '';

  constructor(private authService: AuthService,
              private tokenService: TokenService,
              private router: Router) {
  }

  login(): void {
    const request: LoginRequest = {email: this.email, password: this.password};
    this.authService.login(request).subscribe(
      _ => {
        this.router.navigate(['/']).catch(error => {
          console.error(`Failed to navigate: ${error}`);
        });
      },
      error => {
        console.log(error);
      }
    );
  }

}
