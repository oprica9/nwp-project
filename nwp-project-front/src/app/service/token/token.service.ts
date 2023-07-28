import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  getToken(): string {
    return localStorage.getItem('jwt') ?? '';
  }

  saveToken(token: string): void {
    localStorage.setItem('jwt', token);
  }

  removeToken(): void {
    localStorage.removeItem('jwt');
  }

  hasToken(): boolean {
    return !!this.getToken();
  }
}
