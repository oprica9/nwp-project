import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {UserService} from '../../service/user/user.service';
import {NotificationService} from "../../service/notification/notification.service";
import {AuthService} from "../../service/auth/auth.service";
import {Observable, Subject, throwError} from "rxjs";
import {catchError, takeUntil} from "rxjs/operators";
import {AppRoutes, UserPermissions} from "../../constants";
import {User} from "../../model/model.user";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit, OnDestroy {

  // Public Fields
  users: User[] = [];
  totalUsers: number = 0;
  page: number = 1;
  size: number = 10;
  UserPermissions = UserPermissions;

  // Private Fields
  private clickFlag = false;
  private clickDragFlag = false;
  private ngUnsubscribe = new Subject<void>();

  constructor(private userService: UserService,
              private router: Router,
              private notifyService: NotificationService,
              private authService: AuthService
  ) {
  }

  // Lifecycle Hooks
  ngOnInit(): void {
    this._fetchUsers();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
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

  // Event Handlers
  onDeleteClick(id: number): void {
    if (!this.authService.isAuthenticated()) {
      this.notifyService.showError('User is not authenticated.');
      return;
    }
    if (!this.authService.userHasPermission(UserPermissions.CAN_DELETE_USERS)) {
      this.notifyService.showError('You do not have permission to delete users.');
      return;
    }
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
      catchError(this._handleError.bind(this, 'An unknown error occurred.')),
      takeUntil(this.ngUnsubscribe)
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
      catchError(this._handleError.bind(this, 'Failed to delete user.')),
      takeUntil(this.ngUnsubscribe)
    ).subscribe({
      next: () => {
        this.notifyService.showSuccess('User deleted successfully.');
        this._fetchUsers();
      },
      error: err => console.error(err)
    });
  }

  // Utility methods or handlers
  private _handleError(message: string, error: any): Observable<never> {
    this.notifyService.showError(message);
    return throwError(error);
  }

}
