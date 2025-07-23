import { ApiError } from "@/types/error"

export default async function authExchange(azureToken: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/exchange`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ azureToken }),
  })

  if (!res.ok) {
    const err = await res.json()
    throw new ApiError(
      err.statusCode ?? res.status,
      err.message ?? "Unknown error"
    )
  }

  return res.json()
}
