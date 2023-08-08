import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Permission, User} from '../../model/model.user';
import {ApiEndpoints} from '../../constants';
import {ApiResponse} from "../../model/api-response";
import {Page} from "../../model/page";
import {UserCreateDTO, UserUpdateDTO} from "../../model/dto.user";
import {Machine} from "../../model/model.machine";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {
  }

  fetchUsers(page: number = 0, size: number = 10): Observable<ApiResponse<Page<User>>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<ApiResponse<Page<User>>>(`${ApiEndpoints.USERS}`, {params});
  }

  getUserById(id: number): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(`${ApiEndpoints.USERS}/${id}`);
  }

  updateUser(id: number, user: UserUpdateDTO): Observable<ApiResponse<User>> {
    return this.http.put<ApiResponse<User>>(`${ApiEndpoints.USERS}/${id}`, user);
  }

  createUser(user: UserCreateDTO): Observable<ApiResponse<User>> {
    return this.http.post<ApiResponse<User>>(`${ApiEndpoints.USERS}/create`, user);
  }

  deleteUser(id: number): Observable<ApiResponse<string>> {
    return this.http.delete<ApiResponse<string>>(`${ApiEndpoints.USERS}/${id}`);
  }

  getAvailablePermissions(): Observable<ApiResponse<Permission[]>> {
    return this.http.get<ApiResponse<Permission[]>>(`${ApiEndpoints.PERMISSIONS}`);
  }

}
