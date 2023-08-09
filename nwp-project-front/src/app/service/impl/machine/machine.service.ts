import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import * as moment from 'moment';
import {ErrorMessage, Machine, SearchParams} from "../../../model/model.machine";
import {ApiResponse} from "../../../model/api-response";
import {Page} from "../../../model/page";
import {ApiEndpoints} from "../../../constants";
import {MachineCreateDTO} from "../../../model/dto.machine";

@Injectable({
  providedIn: 'root'
})
export class MachineService {

  constructor(private http: HttpClient) {
  }

  searchMachines(params: SearchParams): Observable<ApiResponse<Page<Machine>>> {
    const transformedParams: SearchParams = {
      ...params,
      dateFrom: params.dateFrom ? moment(params.dateFrom).format() : undefined,
      dateTo: params.dateTo ? moment(params.dateTo).format() : undefined
    };

    return this.http.post<ApiResponse<Page<Machine>>>(`${ApiEndpoints.MACHINES}/search`, transformedParams)
  }

  getAvailableStatuses(): Observable<ApiResponse<string[]>> {
    return this.http.get<ApiResponse<string[]>>(`${ApiEndpoints.MACHINES}/statuses`)
  }

  createMachine(machine: MachineCreateDTO): Observable<ApiResponse<Machine>> {
    return this.http.post<ApiResponse<Machine>>(`${ApiEndpoints.MACHINES}/create`, machine)
  }

  fetchErrors(page: number = 0, size: number = 10): Observable<ApiResponse<Page<ErrorMessage>>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<ApiResponse<Page<ErrorMessage>>>(`${ApiEndpoints.MACHINES}/errors`, {params})
  }

  startMachine(machineId: number): Observable<ApiResponse<string>> {
    return this.http.put<ApiResponse<string>>(`${ApiEndpoints.MACHINES}/${machineId}/start`, null)
  }

  restartMachine(machineId: number): Observable<ApiResponse<string>> {
    return this.http.put<ApiResponse<string>>(`${ApiEndpoints.MACHINES}/${machineId}/restart`, null)
  }

  stopMachine(machineId: number): Observable<ApiResponse<string>> {
    return this.http.put<ApiResponse<string>>(`${ApiEndpoints.MACHINES}/${machineId}/stop`, null)
  }

  destroyMachine(machineId: number): Observable<ApiResponse<string>> {
    return this.http.put<ApiResponse<string>>(`${ApiEndpoints.MACHINES}/${machineId}/destroy`, null)
  }

}
