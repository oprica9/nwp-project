import {environment} from "../environments/environment";

export const API_ENDPOINTS = {
  AUTH: `${environment.appURL}/auth/login`,
  USERS: `${environment.appURL}/api/users`,
  MACHINES: `${environment.appURL}/api/machines`,
  PERMISSIONS: `${environment.appURL}/api/permissions`
}
