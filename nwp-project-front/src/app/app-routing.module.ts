import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './pages/login/login.component';
import {UsersComponent} from './pages/users/users.component';
import {AddUserComponent} from './pages/add-user/add-user.component';
import {EditUserComponent} from './pages/edit-user/edit-user.component';
import {AuthGuard} from "./guards/auth.guard";
import {LoginGuard} from "./guards/login.guard";
import {PermissionGuard} from './guards/permission.guard';
import {HomeComponent} from "./pages/home/home.component";


const routes: Routes = [
  {path: '', component: HomeComponent, canActivate: [AuthGuard]},
  {path: 'login', component: LoginComponent, canActivate: [LoginGuard]},
  {
    path: 'users',
    component: UsersComponent,
    canActivate: [AuthGuard, PermissionGuard],
    data: {requiredPermission: 'can_read_users'}
  },
  {
    path: 'add-user',
    component: AddUserComponent,
    canActivate: [AuthGuard, PermissionGuard],
    data: {requiredPermission: 'can_create_users'}
  },
  {
    path: 'edit-user/:id',
    component: EditUserComponent,
    canActivate: [AuthGuard, PermissionGuard],
    data: {requiredPermission: 'can_update_users'}
  },
  {path: '**', redirectTo: '/'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
