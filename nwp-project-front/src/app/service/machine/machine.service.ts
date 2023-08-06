import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import * as moment from 'moment';
import {ErrorMessageDTO, MachineCreateDTO, MachineDTO, SearchParams} from "../../model/machine";
import {ApiResponse} from "../../model/api-response";
import {Page} from "../../model/page";
import {User} from "../../model/user";
import {API_ENDPOINTS} from "../../constants";

@Injectable({
  providedIn: 'root'
})
export class MachineService {

  constructor(private http: HttpClient) {
  }

  searchMachines(params: SearchParams): Observable<ApiResponse<Page<MachineDTO>>> {
    // Convert dates to ISO 8601 string format
    if (params.dateFrom) {
      params.dateFrom = moment(params.dateFrom).format();
    }
    if (params.dateTo) {
      params.dateTo = moment(params.dateTo).format();
    }
    return this.http.post<ApiResponse<Page<MachineDTO>>>(`${API_ENDPOINTS.MACHINES}/search`, params);
  }

  getAvailableStatuses(): Observable<ApiResponse<string[]>> {
    return this.http.get<ApiResponse<string[]>>(`${API_ENDPOINTS.MACHINES}/statuses`);
  }

  createMachine(machine: MachineCreateDTO) {
    return this.http.post<ApiResponse<User>>(`${API_ENDPOINTS.MACHINES}/create`, machine);
  }

  fetchErrors(page: number = 0, size: number = 10): Observable<ApiResponse<Page<ErrorMessageDTO>>> {
    return this.http.get<ApiResponse<Page<ErrorMessageDTO>>>(`${API_ENDPOINTS.MACHINES}/errors?page=${page}&size=${size}`);
  }
}