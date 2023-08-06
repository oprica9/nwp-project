import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {UserService} from '../../service/user/user.service';
import {Permission, User} from '../../model/user';
import {NotificationService} from '../../service/notification/notification.service';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css'],
})
export class AddUserComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  availablePermissions: Permission[] = [];
  permissionNames: string[] = [];
  private ngUnsubscribe = new Subject<void>();

  constructor(
    private userService: UserService,
    private router: Router,
    private notifyService: NotificationService,
    private formBuilder: FormBuilder,
  ) {
  }

  ngOnInit(): void {
    this.initializeForm();
    this.fetchAvailablePermissions();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  initializeForm(): void {
    this.form = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(200)]]
    });
  }

  fetchAvailablePermissions(): void {
    this.userService.getAvailablePermissions()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (response) => {
          this.availablePermissions = response.data;

          // add a new form control for each permission
          for (let permission of this.availablePermissions) {
            this.form.addControl(permission.name, this.formBuilder.control(false));
            this.permissionNames.push(permission.name);
          }
        },
        (error) => {
          console.error(error);
          this.notifyService.showError('Failed to fetch available permissions.');
        }
      );
  }

  createUser(): void {
    if (!this.form.valid) {
      this.notifyService.showError('Form is not valid. Please check the inputs.');
      return;
    }

    const user: Partial<User> = this.buildUserCreateDTO();

    this.userService.createUser(user)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        () => {
          this.notifyService.showSuccess('User created successfully.');
          this.router.navigate(['/users']).then();
        },
        (error) => {
          console.error(error);
          this.notifyService.showError(`Failed to create user.\n ${error.error.message}`);
        }
      );
  }

  private buildUserCreateDTO(): Partial<User> {
    let permissions: Permission[] = [];
    for (const permissionName of this.permissionNames) {
      if ((this.form.controls as { [key: string]: any })[permissionName].value) {
        const permission = this.availablePermissions.find(p => p.name === permissionName);
        if (permission) {
          permissions.push(permission);
        }
      }
    }
    const formValue = this.form.value;
    return {
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      email: formValue.email,
      password: formValue.password,
      permissions: permissions
    };
  }
}
