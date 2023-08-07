import {Component, HostListener, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthUser, User} from '../../model/user';
import {UserService} from '../../service/user/user.service';
import {NotificationService} from "../../service/notification/notification.service";
import {AuthService} from "../../service/auth/auth.service";
import {tap, throwError} from "rxjs";
import {catchError} from "rxjs/operators";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  currentUser?: AuthUser | null;

  users: User[] = [];
  totalUsers: number = 0;
  page: number = 1;
  size: number = 10;
  clickFlag = false;
  clickDragFlag = false;

  constructor(private userService: UserService, private router: Router, private notifyService: NotificationService, private authService: AuthService) {
    this.authService.currentUser$.subscribe(user => this.currentUser = user);
  }

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.userService.fetchUsers(this.page - 1, this.size).pipe(
      tap(response => {
        this.users = response.data.content;
        this.totalUsers = response.data.totalElements;
      }),
      catchError(error => {
        this.notifyService.showError('An unknown error occurred.');
        return throwError(error);  // Re-throw the error if you want to keep the error chain
      })
    ).subscribe({
      next: () => {
      },  // handle next value, if needed
      error: err => console.error(err),  // handle error
    });
  }

  getPermissions(permissions: any[]): string {
    return permissions.map(p => p.name).join(', ');
  }

  pageChanged(event: any): void {
    console.log(event)
    this.page = event;
    this.fetchUsers();
  }

  onUserClick(id: number): void {
    this.router.navigate(['/edit-user', id]).then();
  }

  userCanDelete(): boolean {
    const userPermissions = this.currentUser?.permissions || [];
    return userPermissions.includes('can_delete_users');
  }

  onDeleteClick(id: number): void {
    const currentUser = this.currentUser;

    if (!currentUser) {
      this.notifyService.showError('User is not authenticated.');
      return;
    }

    const userPermissions = currentUser.permissions || [];

    if (!userPermissions.includes('can_delete_users')) {
      this.notifyService.showError('You do not have permission to delete users.');
      return;
    }

    this.userService.deleteUser(id).pipe(
      tap(() => {
        this.notifyService.showSuccess('User deleted successfully.');
        this.fetchUsers();  // Fetch users again to update the list
      }),
      catchError((error) => {
        this.notifyService.showError('Failed to delete user.');
        throw error;  // If you want to continue the error chain
      })
    ).subscribe({
      next: () => {
      },  // handle next value, if needed
      error: err => console.error(err),  // handle error
    });
  }

  canUpdateUsers(): boolean {
    const userPermissions = this.currentUser?.permissions || [];
    return userPermissions.includes('can_update_users');
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

  handleRowClick(id: number): void {
    if (this.canUpdateUsers() && !this.clickDragFlag) {
      this.onUserClick(id);
    }
  }
}
