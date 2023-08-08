import {Component, OnDestroy} from '@angular/core';
import {LoginRequest} from "../../model/login-request";
import {AuthService} from "../../service/auth/auth.service";
import {Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Observable, Subject, throwError} from "rxjs";
import {NotificationService} from "../../service/notification/notification.service";
import {AppRoutes} from "../../constants";
import {catchError, takeUntil} from "rxjs/operators";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnDestroy {

  // Public Fields
  loginForm: FormGroup;

  // Private Fields
  private ngUnsubscribe = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private notifyService: NotificationService,
    private router: Router
  ) {
    this.loginForm = this._initializeForm();
  }

  // Lifecycle Hooks
  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
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
      takeUntil(this.ngUnsubscribe)
    ).subscribe({
      next: _ => {
        this.router.navigate([`/${AppRoutes.HOME}`]).catch(error => {
          console.error(`Failed to navigate: ${error}`);
        });
      },
      error: err => console.error(err)
    });
  }

  // Utility methods or handlers
  private handleError(message: string, error: any): Observable<never> {
    this.notifyService.showError(message);
    return throwError(error);
  }

}
