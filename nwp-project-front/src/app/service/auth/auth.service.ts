import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {BehaviorSubject, Observable, throwError} from 'rxjs';
import {LoginRequest} from "../../model/login-request";
import {AuthenticationResponseDTO} from "../../model/authentication-response-dto";
import {ApiResponse, AuthUser} from "../../model/user";
import {TokenService} from "../token/token.service";
import {catchError, map} from "rxjs/operators";
import jwt_decode from "jwt-decode";
import {API_ENDPOINTS} from '../../constants';
import {NotificationService} from "../notification/notification.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(this.tokenService.hasToken());

  private currentUserSubject: BehaviorSubject<AuthUser | null>;
  currentUser: Observable<AuthUser | null>;

  constructor(private http: HttpClient,
              private tokenService: TokenService,
              private notificationService: NotificationService) {
    const currentUserItem = localStorage.getItem('jwt');
    let currentUser: AuthUser | null = null;
    if (currentUserItem) {
      currentUser = this.decodeToken(currentUserItem);
    }
    this.currentUserSubject = new BehaviorSubject<AuthUser | null>(currentUser);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  login(request: LoginRequest): Observable<ApiResponse<AuthenticationResponseDTO>> {
    return this.http.post<ApiResponse<AuthenticationResponseDTO>>(`${API_ENDPOINTS.AUTH}`, request)
      .pipe(
        map(authResponse => {
          console.log(authResponse)
          this.tokenService.saveToken(authResponse.data.jwt);
          this.userLoggedIn();
          this.setCurrentUser(authResponse.data.jwt)
          return authResponse;
        }),
        catchError((error: HttpErrorResponse) => {
          this.notificationService.showError("Invalid credentials. Please try again.");
          return throwError(error);
        }));
  }

  public get currentUserValue(): AuthUser | null {
    return this.currentUserSubject.value;
  }

  logout() {
    this.loggedIn.next(false);
    this.tokenService.removeToken();
  }

  userLoggedIn() {
    this.loggedIn.next(true);
  }

  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  setCurrentUser(jwt: string) {
    this.currentUserSubject.next(this.decodeToken(jwt));
  }

  private decodeToken(token: string): AuthUser | null {
    return jwt_decode(token) as AuthUser;
  }

}
