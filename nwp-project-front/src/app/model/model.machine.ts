import {MachineActions} from "../constants";

export interface Machine {
  id: number;
  name: string;
  status: string;
  createdBy: string;
  active: boolean;
  allowedActions?: MachineActions[];
  actionPermissions?: { [key in MachineActions]?: boolean };
}

export interface SearchParams {
  name?: string;
  statuses?: string[];
  dateFrom?: string; // We'll use string to hold the date-time data in ISO 8601 format
  dateTo?: string; // We'll use string to hold the date-time data in ISO 8601 format
  page?: number;
  size?: number;
}

export interface ErrorMessage {
  timestamp: string;
  machineId: number;
  operation: string;
  errorMessage: string;
}
