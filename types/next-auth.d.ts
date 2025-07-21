import { Role } from "@/types/role"

// Extend the session user with custom fields
declare module "next-auth" {
  interface User {
    id: string
    name: string
    email: string
    role: Role
    accessToken?: string
    backendaccessToken?: string
    backendaccessTokenExpires?: number
    backendrefreshToken?: string
  }

  interface Session {
    user: {
      id: string
      name?: string
      email?: string
      role?: Role
      accessToken?: string
      backendaccessToken?: string
      backendaccessTokenExpires?: number
      backendrefreshToken?: string
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    name?: string
    email?: string
    role?: Role
    accessToken?: string
    backendaccessToken?: string
    backendaccessTokenExpires?: number
    backendrefreshToken?: string
  }
}
