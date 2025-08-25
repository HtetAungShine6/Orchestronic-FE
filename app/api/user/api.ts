"use client"

import { fetcher } from "@/lib/fetcher"
import { User } from "@/types/api"
import { Role } from "@/types/role"

export async function getUserByEmail(email: string): Promise<User> {
  return fetcher(
    `${process.env.NEXT_PUBLIC_API_URL}/user/by-email?email=${encodeURIComponent(email)}`
  )
}

export async function fuzzyFindUsersByEmail(email: string): Promise<User[]> {
  return fetcher(
    `${process.env.NEXT_PUBLIC_API_URL}/user/fuzzy-find-by-email?email=${encodeURIComponent(email)}`
  )
}

export async function createUser(user: User) {
  return fetcher(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: user.name,
      email: user.email,
      role: Role.Developer,
    }),
  })
}

export async function getUser(): Promise<User | undefined> {
  return fetcher(`${process.env.NEXT_PUBLIC_API_URL}/user/me`, {
    headers: { "Content-Type": "application/json" },
  })
}
