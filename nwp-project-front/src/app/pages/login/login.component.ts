import {Component} from '@angular/core';
import {LoginRequest} from "../../model/login-request";
import {AuthService} from "../../service/impl/auth/auth.service";
import {Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NotificationService} from "../../service/impl/notification/notification.service";
import {AppRoutes} from "../../constants";
import {takeUntil} from "rxjs/operators";
import {ErrorHandlerService} from "../../errors/service/error-handler.service";
import {BaseComponent} from "../../base-components/base/base.component";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent extends BaseComponent {

  // Public Fields
  loginForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    protected errorService: ErrorHandlerService,
    protected notifyService: NotificationService
  ) {
    super(errorService, notifyService)
    this.loginForm = this._initializeForm();
  }

  // Public Methods
  login(): void {
    if (this.loginForm.invalid) {
      this.notifyService.showError(`Invalid inputs.`);
      return;
    }

    const request: LoginRequest = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    };

    this._login(request);
  }

  // Private Methods
  private _initializeForm(): FormGroup {
    return this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.maxLength(100)]],
    });
  }

  private _login(request: LoginRequest) {
    this.authService.login(request).pipe(
      takeUntil(this.unsubscribeSignal$)
    ).subscribe({
      next: _ => {
        this.router.navigate([`/${AppRoutes.HOME}`]).catch(error => {
          console.error(`Failed to navigate: ${error}`);
        });
      },
      error: err => console.error(err)
    });
  }

}
