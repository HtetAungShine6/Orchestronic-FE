import { Role } from "@/types/role"
import { User } from "next-auth"

export async function getUserByEmail(email: string) {
  const res = await fetch(
    `${process.env.API_BASE_URL}/user?email=${encodeURIComponent(email)}`
  )
  console.log(res)
  if (!res.ok) throw new Error("Failed to fetch user")
  const users = await res.json()
  return users.length > 0 ? users[0] : null
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
