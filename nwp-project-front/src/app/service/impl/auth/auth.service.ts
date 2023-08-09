import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {BehaviorSubject, Observable, throwError} from 'rxjs';
import {LoginRequest} from "../../../model/login-request";
import {AuthenticationResponseDTO} from "../../../model/authentication-response-dto";
import {AuthUser} from "../../../model/model.user";
import {TokenService} from "../token/token.service";
import {catchError, map} from "rxjs/operators";
import jwt_decode from "jwt-decode";
import {ApiEndpoints, UserPermissions} from '../../../constants';
import {ApiResponse} from "../../../model/api-response";
import {ApiErrorResponse} from "../../../model/api-error-response";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<AuthUser | null> = new BehaviorSubject<AuthUser | null>(this.getDecodedToken());

  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) {
  }

  // Observable to get the current user
  get currentUser$(): Observable<AuthUser | null> {
    return this.currentUserSubject.asObservable();
  }

  /**
   * Attempt to authenticate the user.
   * @param request The login request containing user credentials.
   */
  login(request: LoginRequest): Observable<ApiResponse<AuthenticationResponseDTO>> {
    return this.http.post<ApiResponse<AuthenticationResponseDTO>>(`${ApiEndpoints.AUTH}`, request)
      .pipe(
        map(authResponse => {
          this.tokenService.saveToken(authResponse.data.jwt);
          this.setCurrentUser(authResponse.data.jwt);
          return authResponse;
        }),
        catchError((error: HttpErrorResponse) => {
          let errorMessage = 'An error occurred. Please try again later.';

          if (error.error && typeof error.error === 'object' && 'errorMessage' in error.error) {
            const apiError: ApiErrorResponse = error.error;

            switch (apiError.errorCode) {
              case 'INVALID_CREDENTIALS':
                break;
              default:
                errorMessage = apiError.errorMessage || errorMessage;
                break;
            }
          }

          return throwError(() => error);
        })
      );
  }

  /**
   * Logs the user out.
   */
  logout(): void {
    this.tokenService.removeToken();
    this.currentUserSubject.next(null);
  }

  /**
   * Checks if the user is authenticated.
   */
  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  /**
   * Checks if the user has the specified permission.
   * @param permission The permission to check.
   */
  userHasPermission(permission: string): boolean {
    const currentUser = this.currentUserSubject.value;
    return currentUser?.permissions.includes(permission) || false;
  }

  userHasAnyPermission(): boolean {
    const currentUser = this.currentUserSubject.value;

    return currentUser?.permissions.some(permission => {
      const userPermissionValue = Object.values(UserPermissions).find(val => val === permission);
      return userPermissionValue !== undefined;
    }) ?? false;

  }

  // Private Methods
  private setCurrentUser(jwt: string): void {
    this.currentUserSubject.next(this.decodeToken(jwt));
  }

  private decodeToken(token: string): AuthUser {
    return jwt_decode(token);
  }

  private getDecodedToken(): AuthUser | null {
    const jwt = this.tokenService.getToken();
    return jwt ? this.decodeToken(jwt) : null;
  }

}
