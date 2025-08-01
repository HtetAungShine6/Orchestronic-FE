import { authOptions } from "@/lib/auth-options"
import { ApiError } from "@/types/error"
import { getServerSession } from "next-auth"

export default async function checkRepositoryAvailability(name: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/repositories/available-repository?name=${encodeURIComponent(name)}`
  )

  if (!res.ok) {
    const err = await res.json()
    throw new ApiError(
      err.statusCode ?? res.status,
      err.message ?? "Unknown error",
      err.error ?? "An error occurred while checking repository availability"
    )
  }

  return res.json()
}

export async function getResources() {
  const session = await getServerSession(authOptions)

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/resource`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.user?.backendAccessToken}`,
    },
  })

  if (!res.ok) {
    const err = await res.json()
    throw new ApiError(
      err.statusCode ?? res.status,
      err.message ?? "Unknown error",
      err.error ?? "An error occurred while fetching resources"
    )
  }

  return res.json()
}
