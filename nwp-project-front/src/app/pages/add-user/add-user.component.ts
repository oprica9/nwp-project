import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {UserService} from '../../service/user/user.service';
import {Permission} from '../../model/model.user';
import {NotificationService} from '../../service/notification/notification.service';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Observable, Subject, throwError} from 'rxjs';
import {catchError, takeUntil} from 'rxjs/operators';
import {AppRoutes} from "../../constants";
import {UserCreateDTO} from "../../model/dto.user";

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css'],
})
export class AddUserComponent implements OnInit, OnDestroy {

  // Public Fields
  form: FormGroup;
  availablePermissions: Permission[] = [];

  // Private Fields
  private ngUnsubscribe = new Subject<void>();

  constructor(
    private userService: UserService,
    private router: Router,
    private notifyService: NotificationService,
    private formBuilder: FormBuilder,
  ) {
    this.form = this._initializeForm();
  }

  // Lifecycle Hooks
  ngOnInit(): void {
    this._fetchAvailablePermissions();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  // Public Methods
  createUser(): void {
    if (!this.form.valid) {
      this.notifyService.showError('Form is not valid. Please check the inputs.');
      return;
    }

    const user: UserCreateDTO = this._buildUserCreateDTO();

    this._createUser(user);
  }

  // Private Methods
  private _initializeForm(): FormGroup {
    return this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(200)]]
    });
  }

  private _fetchAvailablePermissions(): void {
    this.userService.getAvailablePermissions().pipe(
      catchError(this._handleError.bind(this, "Failed to fetch available permissions.")),
      takeUntil(this.ngUnsubscribe)
    ).subscribe({
      next: next => {
        this.availablePermissions = next.data;
        // add a new form control for each permission
        for (let permission of this.availablePermissions) {
          this.form.addControl(permission.name, this.formBuilder.control(false));
        }
      },
      error: err => console.log(err)
    });
  }

  private _buildUserCreateDTO(): UserCreateDTO {
    const permissions: string[] = this.availablePermissions.filter(permission =>
      this.form.controls[permission.name] && this.form.controls[permission.name].value
    ).map(permission => permission.name);

    const formValue = this.form.value;
    return {
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      email: formValue.email,
      password: formValue.password,
      permissions: permissions
    };
  }

  private _createUser(user: UserCreateDTO) {
    this.userService.createUser(user)
      .pipe(
        catchError(this._handleError.bind(this, "Failed to create user.")),
        takeUntil(this.ngUnsubscribe)
      ).subscribe({
      next: next => {
        this.notifyService.showSuccess(`User ${next.data.firstName} ${next.data.lastName} created successfully.`);
        this.router.navigate([`/${AppRoutes.USERS}`]).then();
      },
      error: err => console.log(err)
    });
  }

  // Utility methods or handlers
  private _handleError(message: string, error: any): Observable<never> {
    this.notifyService.showError(message);
    return throwError(error);
  }


}
