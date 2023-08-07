import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {LoginRequest} from "../../model/login-request";
import {AuthenticationResponseDTO} from "../../model/authentication-response-dto";
import {AuthUser} from "../../model/user";
import {TokenService} from "../token/token.service";
import {map} from "rxjs/operators";
import jwt_decode from "jwt-decode";
import {API_ENDPOINTS} from '../../constants';
import {ApiResponse} from "../../model/api-response";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<AuthUser | null> = new BehaviorSubject<AuthUser | null>(this.getDecodedToken());

  get currentUser$(): Observable<AuthUser | null> {
    return this.currentUserSubject.asObservable();
  }

  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) {
  }

  login(request: LoginRequest): Observable<ApiResponse<AuthenticationResponseDTO>> {
    return this.http.post<ApiResponse<AuthenticationResponseDTO>>(`${API_ENDPOINTS.AUTH}`, request).pipe(
      map(authResponse => {
        this.tokenService.saveToken(authResponse.data.jwt);
        this.setCurrentUser(authResponse.data.jwt);
        return authResponse;
      }));
  }

  logout(): void {
    this.tokenService.removeToken();
    this.currentUserSubject.next(null);
  }

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
