import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
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
    const transformedParams: SearchParams = {
      ...params,
      dateFrom: params.dateFrom ? moment(params.dateFrom).format() : undefined,
      dateTo: params.dateTo ? moment(params.dateTo).format() : undefined
    };

    return this.http.post<ApiResponse<Page<MachineDTO>>>(
      `${API_ENDPOINTS.MACHINES}/search`,
      transformedParams
    );
  }

  getAvailableStatuses(): Observable<ApiResponse<string[]>> {
    return this.http.get<ApiResponse<string[]>>(
      `${API_ENDPOINTS.MACHINES}/statuses`
    );
  }

  createMachine(machine: MachineCreateDTO): Observable<ApiResponse<User>> {
    return this.http.post<ApiResponse<User>>(
      `${API_ENDPOINTS.MACHINES}/create`,
      machine
    );
  }

  fetchErrors(page: number = 0, size: number = 10): Observable<ApiResponse<Page<ErrorMessageDTO>>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<ApiResponse<Page<ErrorMessageDTO>>>(
      `${API_ENDPOINTS.MACHINES}/errors`,
      {params}
    );
  }

  startMachine(machineId: number): Observable<ApiResponse<string>> {
    return this.http.put<ApiResponse<string>>(
      `${API_ENDPOINTS.MACHINES}/${machineId}/start`,
      null
    );
  }

  restartMachine(machineId: number): Observable<ApiResponse<string>> {
    return this.http.put<ApiResponse<string>>(
      `${API_ENDPOINTS.MACHINES}/${machineId}/restart`,
      null
    );
  }

  stopMachine(machineId: number): Observable<ApiResponse<string>> {
    return this.http.put<ApiResponse<string>>(
      `${API_ENDPOINTS.MACHINES}/${machineId}/stop`,
      null
    );
  }


  destroyMachine(machineId: number): Observable<ApiResponse<string>> {
    return this.http.put<ApiResponse<string>>(
      `${API_ENDPOINTS.MACHINES}/${machineId}/destroy`,
      null
    );
  }
}
