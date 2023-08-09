import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../service/impl/user/user.service';
import {Permission, User} from '../../model/model.user';
import {NotificationService} from '../../service/impl/notification/notification.service';
import {takeUntil} from 'rxjs/operators';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AppRoutes, UserPermissions} from "../../constants";
import {UserUpdateDTO} from "../../model/dto.user";
import {ErrorHandlerService} from "../../errors/service/error-handler.service";
import {BaseComponent} from "../../base-components/base/base.component";
import {AuthService} from "../../service/impl/auth/auth.service";

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css'],
})
export class EditUserComponent extends BaseComponent {

  // Public Fields
  form: FormGroup;
  availablePermissions: Permission[] = [];

  // Private Fields
  private userId: number = -1;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    protected errorService: ErrorHandlerService,
    protected notifyService: NotificationService
  ) {
    super(errorService, notifyService)
    this.form = this._initializeForm();
  }

  // Lifecycle Hooks
  ngOnInit(): void {
    super.ngOnInit();
    // Extract the resolved data
    const userData: User = this.route.snapshot.data['user'][0];
    const permissionsData: Permission[] = this.route.snapshot.data['permissions'][1];

    // Check if the data exists and is valid
    if (userData && permissionsData) {
      this.userId = userData.id;
      this.availablePermissions = permissionsData;
      this._updateFormValues(userData);
    } else {
      this.notifyService.showError('Unknown error occurred when getting the user data');
      return;
    }
  }

  // Public Methods
  isFieldInvalid(controlName: string): boolean {
    return this.isFormControlInvalid(this.form, controlName);
  }

  updateUser(): void {
    if (!this.form.valid) {
      this.notifyService.showError('Form is not valid. Please check the inputs.');
      return;
    }
    if (this.userId < 0) {
      this.notifyService.showError('Unknown error occurred, id < 0');
      return;
    }
    const userUpdateDTO = this._buildUserUpdateDTO();
    this._updateUser(userUpdateDTO);
  }

  // Private Methods
  private _initializeForm(): FormGroup {
    return this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.maxLength(100)]],
      lastName: ['', [Validators.required, Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  private _updateFormValues(user: User): void {
    this.form.patchValue({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    });
    this._addPermissionControls(user.permissions);
  }

  private _addPermissionControls(permissions: Permission[]): void {
    for (let permission of this.availablePermissions) {
      this.form.addControl(
        permission.name,
        this.formBuilder.control(permissions.some(p => p.name === permission.name))
      );
    }
  }

  private _buildUserUpdateDTO(): UserUpdateDTO {
    const updatedPermissions: string[] = this.availablePermissions.filter(permission =>
      this.form.controls[permission.name] && this.form.controls[permission.name].value
    ).map(permission => permission.name);

    const {firstName, lastName, email} = this.form.value;

    return {
      firstName,
      lastName,
      email,
      permissions: updatedPermissions
    };
  }

  private _updateUser(userUpdateDTO: UserUpdateDTO) {
    this.userService.updateUser(this.userId, userUpdateDTO).pipe(
      takeUntil(this.unsubscribeSignal$)
    ).subscribe({
      next: _ => {
        this.notifyService.showSuccess('User details updated successfully.');
        this.router.navigate([`/${AppRoutes.USERS}`]).then();
      },
      error: err => console.error(err)
    });
  }
}
