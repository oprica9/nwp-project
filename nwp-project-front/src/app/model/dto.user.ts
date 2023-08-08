export interface UserCreateDTO {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  permissions: string[];
}

export interface UserUpdateDTO {
  email: string;
  firstName: string;
  lastName: string;
  permissions: string[];
}


