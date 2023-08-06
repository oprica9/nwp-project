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
import {MachineSearchComponent} from './pages/machine-search/machine-search.component';
import {MachineCreateComponent} from "./pages/create-machine/machine-create.component";
import {MachineErrorsComponent} from "./pages/machine-errors/machine-errors.component";

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
  {
    path: 'machine-search',
    component: MachineSearchComponent,
    canActivate: [AuthGuard]
  },
  {path: 'search-machines', component: MachineSearchComponent, canActivate: [AuthGuard]},
  {
    path: 'machine-create',
    component: MachineCreateComponent,
    canActivate: [AuthGuard, PermissionGuard],
    data: {requiredPermission: 'can_create_machines'}
  },
  {
    path: 'machine-errors',
    component: MachineErrorsComponent,
    canActivate: [AuthGuard, PermissionGuard],
    data: {requiredPermission: 'can_create_machines'}
  },
  {path: '**', redirectTo: '/'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
