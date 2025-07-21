import { Media } from "./type"

export enum RolesEnum {
  ADMIN = "ADMIN",
  DRIVER = "DRIVER"
}

export interface Role {
  id: number
  slug: string
  name: RolesEnum
}

export interface User {
  id: string
  slug: string
  email: string
  name: string
  roles: Role[],
  userInfo: unknown
  profile?: Media
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
