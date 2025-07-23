import { requestFormSchema } from "@/components/requests/client-request-form"
import { authOptions } from "@/lib/auth-options"
import { fetchWithAuth } from "@/lib/fetchWithAuth"
import { ApiError } from "@/types/error"
import { getServerSession } from "next-auth"
import z from "zod"

export async function getRequests() {
  const session = await getServerSession(authOptions)

  console.log("Fetching requests with session:", session)

  const res = await fetchWithAuth(
    `${process.env.NEXT_PUBLIC_API_URL}/request`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.user?.backendAccessToken}`,
      },
    }
  )

  if (!res.ok) {
    const err = await res.json()
    throw new ApiError(
      err.statusCode ?? res.status,
      err.message ?? "Unknown error"
    )
  }

  return res.json()
}

export default async function createRequest(
  data: z.infer<typeof requestFormSchema>
) {
  const session = await getServerSession(authOptions)
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/request`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.user?.accessToken}`,
    },
    body: JSON.stringify(data),
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
