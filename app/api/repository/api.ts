import { ApiError } from "@/types/error"

export default async function checkRepositoryAvailability(name: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/repositories/available-repository?name=${encodeURIComponent(name)}`
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
