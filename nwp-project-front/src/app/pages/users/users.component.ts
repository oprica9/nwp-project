import {Component, HostListener} from '@angular/core';
import {Router} from '@angular/router';
import {UserService} from '../../service/impl/user/user.service';
import {NotificationService} from "../../service/impl/notification/notification.service";
import {AuthService} from "../../service/impl/auth/auth.service";
import {takeUntil} from "rxjs/operators";
import {AppRoutes, UserPermissions} from "../../constants";
import {User} from "../../model/model.user";
import {ErrorHandlerService} from "../../errors/service/error-handler.service";
import {BaseComponent} from "../../base-components/base/base.component";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent extends BaseComponent {

  // Public Fields
  users: User[] = [];
  totalUsers: number = 0;
  page: number = 1;
  size: number = 10;
  UserPermissions = UserPermissions;

  // Private Fields
  private clickFlag = false;
  private clickDragFlag = false;

  constructor(private userService: UserService,
              private router: Router,
              private authService: AuthService,
              protected errorService: ErrorHandlerService,
              protected notifyService: NotificationService
  ) {
    super(errorService, notifyService);
  }

  // Lifecycle Hooks
  ngOnInit(): void {
    super.ngOnInit();
    this._fetchUsers();
  }

  // Public Methods
  getPermissions(permissions: any[]): string {
    return permissions.map(p => p.name).join(', ');
  }

  pageChanged(event: any): void {
    this.page = event;
    this._fetchUsers();
  }

  userHasPermission(permission: string): boolean {
    return this.authService.userHasPermission(permission);
  }

  handleRowClick(id: number): void {
    if (this.userHasPermission(UserPermissions.CAN_UPDATE_USERS) && !this.clickDragFlag) {
      this._onUserClick(id);
    }
  }

  onDeleteClick(id: number): void {
    this._deleteUser(id);
  }

  onMouseDown(): void {
    this.clickFlag = true;
    this.clickDragFlag = false;
  }

  onMouseUp(): void {
    this.clickFlag = false;
  }

  onMouseMove(): void {
    if (this.clickFlag) {
      this.clickDragFlag = true;
    }
  }

  @HostListener('document:mouseup', ['$event'])
  onGlobalMouseUp(event: MouseEvent): void {
    if (this.clickDragFlag) {
      event.stopPropagation();
    }
  }

  // Private Methods
  private _fetchUsers(): void {
    this.userService.fetchUsers(this.page - 1, this.size).pipe(
      takeUntil(this.unsubscribeSignal$)
    ).subscribe({
      next: response => {
        this.users = response.data.content;
        this.totalUsers = response.data.totalElements;
      },
      error: err => console.error(err)
    });
  }

  private _onUserClick(id: number): void {
    this.router.navigate([AppRoutes.EDIT_USER, id]).then();
  }

  private _deleteUser(id: number) {
    this.userService.deleteUser(id).pipe(
      takeUntil(this.unsubscribeSignal$)
    ).subscribe({
      next: () => {
        this.notifyService.showSuccess('User deleted successfully.');
        this._fetchUsers();
      },
      error: err => console.error(err)
    });
  }
}
