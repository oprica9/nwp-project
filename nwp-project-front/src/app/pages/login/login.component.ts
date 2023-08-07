import {Component, OnDestroy} from '@angular/core';
import {LoginRequest} from "../../model/login-request";
import {AuthService} from "../../service/auth/auth.service";
import {Router} from "@angular/router";
import {TokenService} from "../../service/token/token.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {NotificationService} from "../../service/notification/notification.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnDestroy {
  loginForm: FormGroup;
  private subscriptions: Subscription[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private tokenService: TokenService,
    private notifyService: NotificationService,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  login(): void {
    if (this.loginForm.invalid) {
      // Show error messages or visual cues to the user about invalid fields.
      this.notifyService.showError(`Invalid inputs.`);
      return;
    }

    const request: LoginRequest = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    };

    const subscription = this.authService.login(request).subscribe(
      () => {
        this.router.navigate(['/']).catch(error => {
          console.error(`Failed to navigate: ${error}`);
        });
      },
      error => {
        console.log('Login failed:', error);
        this.notifyService.showError(`Login failed for unknown reasons.`);
      }
    );

    this.subscriptions.push(subscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
