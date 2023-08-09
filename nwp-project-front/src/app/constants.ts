import {environment} from "../environments/environment";

export const ApiEndpoints = {
  AUTH: `${environment.appURL}/auth/login`,
  USERS: `${environment.appURL}/api/users`,
  MACHINES: `${environment.appURL}/api/machines`,
  PERMISSIONS: `${environment.appURL}/api/permissions`
}

export enum UserPermissions {
  CAN_CREATE_USERS = "can_create_users",
  CAN_READ_USERS = "can_read_users",
  CAN_UPDATE_USERS = "can_update_users",
  CAN_DELETE_USERS = "can_delete_users",
  CAN_SEARCH_MACHINES = "can_search_machines",
  CAN_START_MACHINES = "can_start_machines",
  CAN_STOP_MACHINES = "can_stop_machines",
  CAN_RESTART_MACHINES = "can_restart_machines",
  CAN_CREATE_MACHINES = "can_create_machines",
  CAN_DESTROY_MACHINES = "can_destroy_machines",
  CAN_READ_MACHINE_ERRORS = "can_read_machine_errors",
}

export enum MachineActions {
  START = 'START',
  STOP = 'STOP',
  RESTART = 'RESTART',
  DESTROY = 'DESTROY'
}

export enum MachineStates {
  STOPPED = "STOPPED",
  RUNNING = "RUNNING",
}

export const AppRoutes = {
  HOME: '',
  LOGIN: 'login',
  USERS: 'users',
  ADD_USER: 'add-user',
  EDIT_USER: 'edit-user',
  MACHINE_SEARCH: 'machine-search',
  MACHINE_CREATE: 'machine-create',
  MACHINE_ERRORS: 'machine-errors'
};

