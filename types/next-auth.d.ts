import { Role } from "@/types/role"

// Extend the session user with custom fields
declare module "next-auth" {
  interface User {
    id: string
    name: string
    email: string
    role: Role
    accessToken?: string
  }

  interface Session {
    user: {
      id: string
      name?: string
      email?: string
      role?: Role
      accessToken?: string
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
  }
}
