import { Role } from "@/types/role"
import { Session } from "next-auth"

export function getUserRole(session: Session): Role {
  return session.user?.role ?? Role.Developer
}
