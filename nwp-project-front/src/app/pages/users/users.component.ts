import {Component, HostListener, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthUser, User} from '../../model/user';
import {UserService} from '../../service/user/user.service';
import {NotificationService} from "../../service/notification/notification.service";
import {AuthService} from "../../service/auth/auth.service";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  users: User[] = [];
  totalUsers: number = 0;
  page: number = 1;
  size: number = 10;
  clickFlag = false;
  clickDragFlag = false;

  constructor(private userService: UserService, private router: Router, private notifyService: NotificationService, private authService: AuthService) {
  }

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.userService.fetchUsers(this.page - 1, this.size).subscribe(
      response => {
        this.users = response.data.content;
        this.totalUsers = response.data.totalElements;
      },
      error => {
        this.notifyService.showError('An unknown error occurred.');
      }
    );
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
    this.router.navigate(['/edit-user', id]);
  }

  userCanDelete(): boolean {
    const currentUser = this.authService.currentUserValue;
    const userPermissions = ((currentUser as AuthUser).permissions || [])
    return userPermissions.includes('can_delete_users');
  }


  onDeleteClick(id: number): void {
    const currentUser = this.authService.currentUserValue;
    const userPermissions = ((currentUser as AuthUser).permissions || [])

    if (!userPermissions.includes('can_delete_users')) {
      this.notifyService.showError('You do not have permission to delete users.');
      return;
    }

    this.userService.deleteUser(id).subscribe(
      () => {
        this.notifyService.showSuccess('User deleted successfully.');
        this.fetchUsers();  // Fetch users again to update the list
      },
      (error) => {
        this.notifyService.showError('Failed to delete user.');
      }
    );
  }

  canUpdateUsers() {
    const currentUser = this.authService.currentUserValue;
    const userPermissions = ((currentUser as AuthUser).permissions || [])
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
