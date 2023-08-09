import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {UserService} from '../../service/impl/user/user.service';
import {Permission} from '../../model/model.user';
import {NotificationService} from '../../service/impl/notification/notification.service';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {takeUntil} from 'rxjs/operators';
import {AppRoutes, UserPermissions} from "../../constants";
import {UserCreateDTO} from "../../model/dto.user";
import {BaseComponent} from "../../base-components/base/base.component";
import {ErrorHandlerService} from "../../errors/service/error-handler.service";
import {AuthService} from "../../service/impl/auth/auth.service";

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css'],
})
export class AddUserComponent extends BaseComponent {

  // Public Fields
  form: FormGroup;
  availablePermissions: Permission[] = [];

  constructor(
    private userService: UserService,
    private authService: AuthService,
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
    this._fetchAvailablePermissions();
  }

  // Public Methods
  isFieldInvalid(controlName: string): boolean {
    return this.isFormControlInvalid(this.form, controlName);
  }

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
      takeUntil(this.unsubscribeSignal$)
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
        takeUntil(this.unsubscribeSignal$)
      ).subscribe({
      next: next => {
        this.notifyService.showSuccess(`User ${next.data.firstName} ${next.data.lastName} created successfully.`);
        this.router.navigate([`/${AppRoutes.USERS}`]).then();
      },
      error: err => console.log(err)
    });
  }

}
