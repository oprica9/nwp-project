import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../service/user/user.service';
import {Permission, User, UserUpdateDTO} from '../../model/user';
import {NotificationService} from '../../service/notification/notification.service';
import {Subject} from 'rxjs';
import {forkJoin} from 'rxjs';

import {takeUntil} from 'rxjs/operators';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css'],
})
export class EditUserComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  user: User = {} as User;
  availablePermissions: Permission[] = [];
  private ngUnsubscribe = new Subject<void>();

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private notifyService: NotificationService,
    private formBuilder: FormBuilder,
  ) {
  }

  ngOnInit(): void {
    this.initializeForm();
    this.route.paramMap
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((params) => {
        const id = Number(params.get('id'));
        if (!isNaN(id)) {
          forkJoin([
            this.userService.getUserById(id),
            this.userService.getAvailablePermissions()
          ])
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(
              ([userResponse, permissionsResponse]) => {
                this.user = userResponse.data;
                this.availablePermissions = permissionsResponse.data;
                this.updateFormValues();
              },
              error => {
                console.error(error);
                this.notifyService.showError('Failed to fetch data.');
              }
            );
        } else {
          this.router.navigate(['/users']).then();
        }
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  initializeForm(): void {
    this.form = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  updateFormValues(): void {
    this.form.patchValue({
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      email: this.user.email,
    });
    this.addPermissionControls();
  }

  addPermissionControls(): void {
    for (let permission of this.availablePermissions) {
      this.form.addControl(
        permission.name,
        this.formBuilder.control(this.user.permissions.some(p => p.name === permission.name))
      );
    }
  }

  updateUser(): void {
    if (!this.form.valid) {
      this.notifyService.showError('Form is not valid. Please check the inputs.');
      return;
    }

    const userUpdateDTO = this.buildUserUpdateDTO();

    this.userService.updateUser(this.user.id, userUpdateDTO)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        () => {
          this.notifyService.showSuccess('User details updated successfully.');
          this.router.navigate(['/users']).then();
        },
        error => {
          console.error(error);
          this.notifyService.showError('Failed to update user details.');
        }
      );
  }

  private buildUserUpdateDTO(): UserUpdateDTO {
    let updatedPermissions: Permission[] = [];
    for (const permissionName in this.form.controls) {
      if ((this.form.controls as { [key: string]: any })[permissionName].value) {
        const permission = this.availablePermissions.find(p => p.name === permissionName);
        if (permission) {
          updatedPermissions.push(permission);
        }
      }
    }
    const formValue = this.form.value;
    return {
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      email: formValue.email,
      permissions: updatedPermissions
    };
  }

}
