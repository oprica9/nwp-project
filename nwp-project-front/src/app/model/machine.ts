export interface MachineDTO {
  id: number;
  name: string;
  status: string;
  createdBy: string;
  active: boolean;
}

export interface MachineCreateDTO {
  name: string;
}

export interface SearchParams {
  name?: string;
  statuses?: string[];
  dateFrom?: string; // We'll use string to hold the date-time data in ISO 8601 format
  dateTo?: string; // We'll use string to hold the date-time data in ISO 8601 format
  page?: number;
  size?: number;
}

export interface ErrorMessageDTO{
  timestamp: string;
  machineId: number;
  operation: string;
  errorMessage: string;
}
