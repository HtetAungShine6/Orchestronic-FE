import { Role } from "./role"

export type User = {
  id: string
  name: string
  email: string
  role: Role
}

export enum Status {
  Pending = "Pending",
  Approved = "Approved",
  Rejected = "Rejected",
}

export type UserState = {
  id: string
  name: string
  email: string
  role: Role
  iat: number
  exp: number
}
