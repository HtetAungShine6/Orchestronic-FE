import { ApiResponse } from "@/types/api"
import { Role } from "@/types/role"
import { User } from "next-auth"

export async function getUserByEmail(email: string) {
  const res = await fetch(
    `${process.env.API_BASE_URL}/user/by-email?email=${encodeURIComponent(email)}`
  )
  if (!res.ok) throw new Error("Failed to fetch user")
  const response: ApiResponse<User> = await res.json()
  return response.data
}

export async function createUser(user: User) {
  const res = await fetch(`${process.env.API_BASE_URL}/user`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: user.name ?? "Unknown",
      email: user.email,
      role: Role.Developer,
    }),
  })
  if (!res.ok) throw new Error("Failed to create user")
  return await res.json()
}

export async function updateUserRole(email: string, role: Role) {
  const res = await fetch(`${process.env.API_BASE_URL}/user`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, role }),
  })
  if (!res.ok) throw new Error("Failed to update user role")
  return await res.json()
}

export async function deleteUser(email: string) {
  const res = await fetch(`${process.env.API_BASE_URL}/user`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  })
  if (!res.ok) throw new Error("Failed to delete user")
  return await res.json()
}
