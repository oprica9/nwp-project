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
import {AppRoutes, UserPermissions} from "./constants";
import {UserResolver} from "./resolvers/user.resolver";

const routes: Routes = [
  {path: AppRoutes.HOME, component: HomeComponent, canActivate: [AuthGuard]},
  {path: AppRoutes.LOGIN, component: LoginComponent, canActivate: [LoginGuard]},
  {
    path: AppRoutes.USERS,
    component: UsersComponent,
    canActivate: [AuthGuard, PermissionGuard],
    data: {requiredPermission: UserPermissions.CAN_READ_USERS}
  },
  {
    path: AppRoutes.ADD_USER,
    component: AddUserComponent,
    canActivate: [AuthGuard, PermissionGuard],
    data: {requiredPermission: UserPermissions.CAN_CREATE_USERS}
  },
  {
    path: `${AppRoutes.EDIT_USER}/:id`,
    component: EditUserComponent,
    resolve: {
      user: UserResolver,
      permissions: UserResolver
    },
    canActivate: [AuthGuard, PermissionGuard],
    data: {requiredPermission: UserPermissions.CAN_UPDATE_USERS}
  },
  {
    path: AppRoutes.MACHINE_SEARCH,
    component: MachineSearchComponent,
    canActivate: [AuthGuard, PermissionGuard],
    data: {requiredPermission: UserPermissions.CAN_SEARCH_MACHINES}
  },
  {
    path: AppRoutes.MACHINE_CREATE,
    component: MachineCreateComponent,
    canActivate: [AuthGuard, PermissionGuard],
    data: {requiredPermission: UserPermissions.CAN_CREATE_MACHINES}
  },
  {
    path: AppRoutes.MACHINE_ERRORS,
    component: MachineErrorsComponent,
    canActivate: [AuthGuard]
  },
  {path: '**', redirectTo: '/'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
