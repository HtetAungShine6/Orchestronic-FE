import { Role } from "@/types/role"

export async function getUsers() {
  const res = await fetch("/api/users", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.message || "Failed to fetch users")
  }

  return res.json()
}

export async function updateUserRole(userId: string, role: Role) {
  const res = await fetch(`/api/users/${userId}/role`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ role }),
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.message || "Failed to update user role")
  }

  return res.json()
}
