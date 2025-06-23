import { ApiError } from "@/types/error"
import { Role } from "@/types/role"
import { User } from "next-auth"

export async function getUserByEmail(email: string): Promise<User> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/user/by-email?email=${encodeURIComponent(email)}`
  )

  if (!res.ok) {
    const err = await res.json()
    throw new ApiError(
      err.statusCode || res.status,
      err.message || "Unknown error"
    )
  }

  return res.json()
}

export async function createUser(user: User) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: user.name,
      email: user.email,
      role: Role.Developer,
    }),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.message)
  }
  return res.json()
}
