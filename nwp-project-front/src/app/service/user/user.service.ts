import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {User, Permission, UserUpdateDTO} from '../../model/user';
import {API_ENDPOINTS} from '../../constants';
import {ApiResponse} from "../../model/api-response";
import {Page} from "../../model/page";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {
  }

  fetchUsers(page: number = 0, size: number = 10): Observable<ApiResponse<Page<User>>> {
    return this.http.get<ApiResponse<Page<User>>>(`${API_ENDPOINTS.USERS}?page=${page}&size=${size}`);
  }

  getUserById(id: number): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(`${API_ENDPOINTS.USERS}/${id}`);
  }

  updateUser(id: number, user: UserUpdateDTO): Observable<ApiResponse<User>> {
    return this.http.put<ApiResponse<User>>(`${API_ENDPOINTS.USERS}/${id}`, user);
  }

  createUser(user: Partial<User>): Observable<ApiResponse<User>> {
    return this.http.post<ApiResponse<User>>(`${API_ENDPOINTS.USERS}/create`, user);
  }

  deleteUser(id: number): Observable<ApiResponse<string>> {
    return this.http.delete<ApiResponse<string>>(`${API_ENDPOINTS.USERS}/${id}`);
  }

  getAvailablePermissions(): Observable<ApiResponse<Permission[]>> {
    return this.http.get<ApiResponse<Permission[]>>(`${API_ENDPOINTS.PERMISSIONS}`);
  }

}
