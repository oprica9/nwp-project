import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LoginComponent} from './pages/login/login.component';
import {UsersComponent} from './pages/users/users.component';
import {AddUserComponent} from './pages/add-user/add-user.component';
import {EditUserComponent} from './pages/edit-user/edit-user.component';
import {NavbarComponent} from './pages/navbar/navbar.component';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ToastrModule} from 'ngx-toastr';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {AuthInterceptor} from './interceptors/auth.interceptor';
import {NgxPaginationModule} from 'ngx-pagination';
import {HomeComponent} from './pages/home/home.component';
import {MachineSearchComponent} from './pages/machine-search/machine-search.component';
import {MachineCreateComponent} from './pages/create-machine/machine-create.component';
import {MachineErrorsComponent} from './pages/machine-errors/machine-errors.component';
import {ErrorHandler} from '@angular/core';
import {GlobalErrorHandler} from './errors/global-error-handler.service';
import {HttpErrorInterceptor} from './errors/interceptor/http-error-interceptor.service';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UsersComponent,
    AddUserComponent,
    EditUserComponent,
    NavbarComponent,
    HomeComponent,
    MachineSearchComponent,
    MachineCreateComponent,
    MachineErrorsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    NgxPaginationModule,
    ReactiveFormsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true
    },
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
