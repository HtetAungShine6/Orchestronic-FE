import { Role } from "./role"

export type ApiResponse<T> = {
  statusCode: number
  message: string
  data: T | null
}

export type User = {
  id: string
  name: string
  email: string
  role: Role
}
