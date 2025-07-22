import { Media } from "./type"

export enum RolesEnum {
  ADMIN = "ADMIN",
  DRIVER = "DRIVER"
}

export interface User {
  id: number;
  documenId: string;
  name: string;
  email: string;
  role: Role;
  profile?: Media;
  username: string
  confirmed: boolean
  blocked: boolean
  phone: string

  createdAt?: string
  updatedAt?: string
}

export interface Role {
  id: number
  slug: string
  name: RolesEnum,
  type: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthState {
  user: User | null
  isLoading: boolean
  error: string | null
}

export interface LoginResponse {
  user: User,
  jwt: string
}