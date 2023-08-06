export interface Permission {
  id: number;
  name: string;
}

export interface AuthUser {
  email: string;
  permissions: string[];
}

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  permissions: Permission[];
}

export interface Sort {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
}

export interface PermissionDTO {
  name: string;
  // Other properties...
}

export interface UserUpdateDTO {
  email: string;
  firstName: string;
  lastName: string;
  permissions: PermissionDTO[];
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  permissions: Permission[];
  // add other fields as needed
}
