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
